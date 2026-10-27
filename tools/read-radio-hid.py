"""Read the configured seven-axis TX16S USB report without injecting input."""
import json
import sys
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'work/python-deps'))
import hid
device = next(d for d in hid.enumerate() if d.get('product_string') == 'Radiomaster TX16S Joystick' and d.get('usage_page') == 1 and d.get('usage') == 4)
handle = hid.device()
try:
    handle.open_path(device['path'])
    data = handle.read(64,1500)
finally:
    handle.close()
if len(data)==20 and data[0]==0:
    data=data[1:]
if len(data)!=19:
    raise RuntimeError(f'Expected the configured 19-byte report, received {len(data)} bytes')
mask=int.from_bytes(bytes(data[14:18]),'little')
print(json.dumps({'axes':dict(zip(['X','Y','Z','RX','RY','RZ','SLIDER'],
 [int.from_bytes(bytes(data[i:i+2]),'little') for i in range(0,14,2)])),
 'buttons':[i+1 for i in range(26) if mask&(1<<i)]}))
