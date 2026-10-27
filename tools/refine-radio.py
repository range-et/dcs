"""Extend the saved DCS-only model; preserve original mixers, trims and inputs."""
import copy
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'work/python-deps'))
import yaml

source = ROOT / 'backups/tx16s/20261026-refinement/MODELS/model7.yml'
model = yaml.safe_load(source.read_text(encoding='utf-8-sig'))
assert model['header']['name'] == 'DCS Cockpit'
assert len(model['mixData']) == 17
original_inputs = copy.deepcopy(model['expoData'])
original_mixes = copy.deepcopy(model['mixData'])
model['header']['bitmap'] = 'dcs.png'

template = copy.deepcopy(model['mixData'][4])
def mix(channel, source, weight=100, offset=0, switch='NONE', name=''):
    item = copy.deepcopy(template)
    item.update(destCh=channel, srcRaw=source, weight=weight, offset=offset,
                swtch=switch, name=name, mltpx='ADD')
    model['mixData'].append(item)

# SE raw positions are -100/0/+100. A single USB button activates only above 0.
# Engage and altitude therefore remain held in both MIDDLE and DOWN.
mix(17, 'SE', 50, 50, name='AP ENG')
mix(18, 'SE', 50, 50, name='AP ALT')
mix(19, 'SE', name='AP HDG')
mix(20, 'SL2', name='RS MODES')
# Dedicated Mustang flap axis: its three targets become 1.0/0.6/0.0.
for switch, value in [('SB0', -100), ('SB1', -20), ('SB2', 100)]:
    mix(21, 'MAX', value, switch=switch, name='FLAPS')

usb = model['usbJoystickCh']
def button(channel, first, count=1, inversion=0):
    usb[channel] = dict(mode='CH_BUTTON', inversion=inversion, param=0,
                        btn_num=first-1, switch_npos=count-1)
button(17, 18)
button(18, 19)
button(19, 20)
button(20, 21, 3)
button(9, 24, 3, 1)  # original SG mixer; UP/MIDDLE/DOWN -> 26/25/24
usb[21] = dict(mode='CH_AXIS', inversion=0, param=6, btn_num=0, switch_npos=0)
model['usbJoystickCh'] = dict(sorted(usb.items()))

assert model['expoData'] == original_inputs
assert model['mixData'][:17] == original_mixes
assert model['flightModeData'] == yaml.safe_load(source.read_text(encoding='utf-8-sig'))['flightModeData']
used = set()
for channel in usb.values():
    if channel['mode'] != 'CH_BUTTON':
        continue
    for number in range(channel['btn_num'], channel['btn_num'] + channel['switch_npos'] + 1):
        assert number not in used, 'Overlapping USB button'
        used.add(number)
assert used == set(range(26))
assert sum(x['mode'] == 'CH_AXIS' for x in usb.values()) == 7

output = ROOT / 'config/radio/model7.yml'
output.write_text(yaml.safe_dump(model, sort_keys=False, allow_unicode=True, width=120), encoding='utf-8')
assert yaml.safe_load(output.read_text(encoding='utf-8')) == model
print('Prepared 7 axes / 26 USB buttons; original 17 mixers and four inputs preserved.')
print(json.dumps({'SE': {'UP': [], 'MIDDLE': [18, 19], 'DOWN': [18, 19, 20]},
                  'RS': {'BACK': 21, 'MIDDLE': 22, 'FORWARD': 23},
                  'SG': {'UP': 26, 'MIDDLE': 25, 'DOWN': 24}}))
