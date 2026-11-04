"""Project the actual generated border PNG against measured iPad button bounds."""
import json
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parents[1]
metrics=json.loads((root/'docs/ui-review/ipad-blender-metrics.json').read_text())
blender=root.parent/'blender_touchportal'
page=json.loads((blender/'pages/Blender/Viewpad.tml').read_text())
im=Image.open(blender/'assets/icons'/page['BGI']).convert('RGB')
rows=[]
for y in range(im.height):
    r,g,b=im.getpixel((35,y))
    if r>150 and g>100 and b<110:
        if not rows or y>rows[-1][-1]+1:rows.append([])
        rows[-1].append(y)
assert len(rows)==7,rows
scale=metrics['backgroundTransformY']['scale'];offset=metrics['backgroundTransformY']['offset']
minimum=float('inf')
for line in rows:
    top=offset+scale*min(line);bottom=offset+scale*max(line)
    for start,end in metrics['buttonRows']:
        gap=max(start-bottom,top-end)
        assert gap>=8,f'Border {top:.1f}..{bottom:.1f} collides with button row {start}..{end}'
        minimum=min(minimum,gap)
print(f'Generated PNG projected into measured iPad geometry: minimum vertical clearance {minimum:.1f}px.')
