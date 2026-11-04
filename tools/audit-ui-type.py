"""Audit dense labels with actual Arial metrics, including feedback variants."""
import json
from pathlib import Path
from PIL import ImageFont

root=Path(__file__).resolve().parents[1]
pages=[(root/'pages/DCS/F14 Radar & Navigation.tml',14),(root.parent/'blender_touchportal/pages/Blender/Viewpad.tml',18),
       (root/'pages/DCS/P-51D.tml',18),(root/'pages/DCS/F14.tml',20),
       (root/'pages/DCS/FC3 Main Panel.tml',20),(root/'pages/DCS/FC3 Navigation & Sensor Panel.tml',20)]
issues=[]
for file,body in pages:
    page=json.loads(file.read_text())
    for row in page['BUTTONS']:
        for b in row:
            if not b.get('id'):continue
            if b.get('I') and b['TS']!=body:issues.append((file.name,b['id'],'nonstandard body size',b['TS']))
            font=ImageFont.truetype('C:/Windows/Fonts/cour.ttf' if b.get('FF')=='Courier New' else 'C:/Windows/Fonts/arial.ttf',b['TS'])
            titles=[b['T']]+[a.get('KEY_TITLE','') for k in ('A','E','C') for a in b[k] if a.get('KEY_TYPE')=='CHANGE_BUTTON_VISUALS_ACTION']
            for title in set(titles):
                if '${' in title:continue
                if any(font.getlength(line)>100*b['COLS']-16 for line in title.splitlines()):issues.append((file.name,b['id'],'width',title))
                if len(title.splitlines())>3:issues.append((file.name,b['id'],'lines',title))
    print(file.name,'body type',body)
for issue in issues:print(issue)
if issues:raise SystemExit(1)
print('All static and feedback labels fit the measured width and three-line budget.')
