"""Render upstream Material glyphs onto transparent button-sized canvases."""
import json
import sys
import hashlib
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[1]
manifest = Path(sys.argv[1]) if len(sys.argv)>1 else root/'assets/icons/manifest.json'
output = manifest.parent
assets = root/'assets/material-icons'
codes = dict(line.split() for line in (assets/'MaterialIcons-Regular.codepoints').read_text().splitlines())
font = ImageFont.truetype(str(assets/'MaterialIcons-Regular.ttf'),72)
for item in {x['file']:x for x in json.loads(manifest.read_text())}.values():
    if item.get('kind')=='background':
        image=Image.new('RGBA',(1200,900),'#0F1113')
        draw=ImageDraw.Draw(image)
        # Native kFM=2 with BTN_MARGIN=1.5: calibrated gutter centre is
        # 1.25% in from the preview perimeter (not the raw cell edge).
        mx,my=(15 if item['cols']==10 else 10.5),11.25
        cw,ch=(1200-2*mx)/item['cols'],(900-2*my)/item['rows']
        if item['page']=='Blender/Viewpad.tml' or item['page'] in ('DCS/P-51D.tml','DCS/F14.tml','DCS/FC3 Main Panel.tml','DCS/FC3 Navigation & Sensor Panel.tml'):
            # Actual 3200x2400 iPad screenshot, content below 128px toolbar:
            # button row fills [178+368r,511+368r]; ideal gutter centres
            # 160.5+368r. Measured BG transform y_screen=109.683+2.54547*y_png.
            # The mobile background is transformed differently from desktop.
            # Keep x (already centred); calibrate only Blender's six rows.
            mx,cw=10.5,1179/item['cols']
            my,ch=20,867/item['rows']
        for x,y,w,h in item['groups']:
            draw.rectangle((round(mx+x*cw),round(my+y*ch),round(mx+(x+w)*cw),round(my+(y+h)*ch)),outline='#D7A12A',width=2)
        image.save(output/item['file'])
        continue
    if item['icon'] not in codes:
        raise ValueError('Unknown Material icon: '+item['icon'])
    badge=Image.new('RGBA',(256,256))
    draw=ImageDraw.Draw(badge)
    glyph=chr(int(codes[item['icon']],16))
    compact=item.get('page')=='DCS/F14 Radar & Navigation.tml'
    icon_font=ImageFont.truetype(str(assets/'MaterialIcons-Regular.ttf'),56)
    box=draw.textbbox((0,0),glyph,font=icon_font)
    role=item.get('role','default')
    colour='#1E88C8' if role in ('primary','navigation') else '#B6BFCC' if role!='default' else '#2B9ED1'
    draw.text(((256-(box[2]-box[0]))/2-box[0],(16 if item.get('page')=='Blender/Viewpad.tml' else 4)-box[1]),glyph,font=icon_font,fill=colour)
    # TP fits merged-button images into its unit image box before stretching.
    # Use the same unit canvas for every span to avoid compressed glyphs.
    image=badge
    image.save(output/item['file'])
# Mobile clients may retain an image when only its bytes change. Name every
# asset by its content so a changed graphic is requested as a new resource.
items=json.loads(manifest.read_text())
renames={}
for name in {x['file'] for x in items}:
    data=(output/name).read_bytes()
    stem=re.sub(r'_[0-9a-f]{12}$','',Path(name).stem)
    hashed=stem+'_'+hashlib.sha256(data).hexdigest()[:12]+'.png'
    (output/hashed).write_bytes(data)
    renames[name]=hashed
for item in items:item['file']=renames[item['file']]
manifest.write_text(json.dumps(items,indent=2)+'\n')
for page_name in {x['page'] for x in items}:
    file=root/'pages'/page_name
    page=json.loads(file.read_text())
    if page.get('BGI') in renames:page['BGI']=renames[page['BGI']]
    for row in page['BUTTONS']:
        for button in row:
            if button.get('I') in renames:button['I']=renames[button['I']]
    file.write_text(json.dumps(page,indent=2,ensure_ascii=False)+'\n')
print('Rendered content-addressed icons:',len(renames))
