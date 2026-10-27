"""Create an original Monad vector badge and its 192x114 radio PNG export."""
from pathlib import Path
from html import escape
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
out = ROOT / 'assets/radio'
out.mkdir(parents=True, exist_ok=True)
scale = 4
image = Image.new('RGB', (192*scale, 114*scale), '#0F1113')
draw = ImageDraw.Draw(image)
parts = ['<svg xmlns="http://www.w3.org/2000/svg" width="192" height="114" viewBox="0 0 192 114">',
         '<rect width="192" height="114" fill="#0F1113"/>']

def line(points, color, width=1):
    draw.line([(int(x*scale),int(y*scale)) for x,y in points], fill=color, width=int(width*scale))
    parts.append('<polyline points="'+' '.join(f'{x},{y}' for x,y in points)+f'" fill="none" stroke="{color}" stroke-width="{width}"/>')

def text(x,y,value,size,color):
    font=ImageFont.truetype('C:/Windows/Fonts/consolab.ttf',size*scale)
    draw.text((x*scale,y*scale),value,font=font,fill=color,anchor='lt')
    parts.append(f'<text x="{x}" y="{y}" dominant-baseline="text-before-edge" font-family="Consolas,monospace" font-size="{size}" font-weight="bold" fill="{color}">{escape(value)}</text>')

line([(3,23),(3,3),(23,3)], '#2B9ED1', 2)
line([(169,3),(189,3),(189,23)], '#2B9ED1', 2)
line([(3,91),(3,111),(23,111)], '#2B9ED1', 2)
line([(169,111),(189,111),(189,91)], '#2B9ED1', 2)
text(13,15,'MONAD / 01',9,'#B6BFCC')
text(10,33,'DCS',44,'#EEF2F6')
text(13,83,'FLIGHTDECK',12,'#2B9ED1')
line([(13,102),(103,102)],'#D7A12A',2)
plane=[(151,17),(156,39),(177,56),(177,64),(158,58),(157,81),
       (168,94),(168,98),(151,92),(134,98),(134,94),(145,81),
       (144,58),(125,64),(125,56),(146,39)]
draw.polygon([(x*scale,y*scale) for x,y in plane], fill='#1F242B')
parts.append('<polygon points="'+' '.join(f'{x},{y}' for x,y in plane)+'" fill="#1F242B"/>')
line(plane+[plane[0]],'#2B9ED1',1)
line([(151,31),(151,87)],'#EEF2F6',1)
parts.append('</svg>')
(out/'dcs.svg').write_text('\n'.join(parts)+'\n',encoding='utf-8')
image.resize((192,114),Image.Resampling.LANCZOS).save(out/'dcs.png')
print(out/'dcs.png')
