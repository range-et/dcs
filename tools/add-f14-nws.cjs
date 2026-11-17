// Apply after page rebuilds. Preserve every existing control and asset.
const fs = require('fs'), path = require('path'), assert = require('assert');
const file = path.resolve(__dirname, '../pages/DCS/F14.tml');
const page = JSON.parse(fs.readFileSync(file, 'utf8'));
const id = 'dcs_f14_nosewheel_steering';
assert(!page.BUTTONS[1][3].T || page.BUTTONS[1][3].id === id, 'NWS slot occupied');
assert(!page.BUTTONS[1][4].T, 'NWS span occupied');
const b = structuredClone(page.BUTTONS[6][3]);
b.id = id;
b.T = 'Nosewheel\nOffline';
b.TC = -4800564;
b.C = [];
const condition = state => ({KEY_TYPE:'EXTENDED_IF_STATEMENT',kIEn:true,kL:[{
  val:'ON',vari:state,cmp:0,lc:0,varc:'${value:' + state + '}',varp:state
}]});
const end = () => ({KEY_TYPE:'LOGIC_IF_END_ACTION',kIEn:true});
// The stick button is autopilot reference airborne, so allow ground use only.
b.A = [condition('mgdc_f-14_st_aircraft_connection'),condition('mgdc_f-14_st_ext_wow_nose'),
  {KEY_KEYCODES:['N|78|1|0|0'],KEY_DURATION:100,kIEn:true,KEY_TYPE:'KEY_PRESS_ACTION_V2'},end(),end()];
const sourceEvent = structuredClone(b.E[0]);
const sourceVisual = structuredClone(b.E[1]);
const event = (state,value,name) => ({...sourceEvent,kVal:value,
  kVSI:'mgdc_f-14_st_'+state,kPID:'mgdc_f-14_ev_'+state,
  kFormat:'When '+name+' is $val',kName:name});
const visual = (label,on=false) => ({...sourceVisual,KEY_TITLE:'Nosewheel\n'+label,
  KEY_TEXT_COLOR:on?-9523899:label==='Offline'?-4800564:-1117450,
  KEY_START_COLOR:on?-14012102:-14736341,KEY_END_COLOR:on?-14012102:-14736341});
const connected = condition('mgdc_f-14_st_aircraft_connection');
b.E = [
  event('plt_hud_light_nws','ON','f-14 PILOT HUD Light NWS Enga (yellow)'),connected,visual('ON',true),end(),
  event('plt_hud_light_nws','OFF','f-14 PILOT HUD Light NWS Enga (yellow)'),structuredClone(connected),visual('OFF'),end(),
  event('aircraft_connection','OFF','aircraft state'),visual('Offline'),
  event('aircraft_connection','ON','aircraft state'),
  condition('mgdc_f-14_st_plt_hud_light_nws'),visual('ON',true),
  {KEY_TYPE:'LOGIC_ELSE_ACTION',kIEn:true},visual('OFF'),end()
];
page.BUTTONS[1][3] = b;
fs.writeFileSync(file,JSON.stringify(page,null,2)+'\n');
console.log('Added ground-only NWS toggle with cockpit lamp feedback.');
