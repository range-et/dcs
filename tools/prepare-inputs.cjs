// Build native DCS joystick diffs while preserving the existing flight-axis blocks.
// Command hashes follow installed Scripts/Input/Utils.lua getKeyCommandActionHashInfos.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),install='F:/DCS World';
const device='Radiomaster TX16S Joystick {BB74DAE0-B917-11f1-8001-444553540000}.diff.lua';
const read=p=>fs.readFileSync(p,'utf8');
const strip=s=>s.replace(/--\[(=*)\[[\s\S]*?\]\1\]/g,'').replace(/--[^\r\n]*/g,'');
function counters(file,devices=false){
 const source=strip(read(file)),out={};let count=devices?8:3000,count2=10100,count3=3000;
 const re=devices?/devices\["([^"]+)"\]\s*=\s*(counter\(\)|\d+)/g:/\b([A-Za-z_][A-Za-z_0-9]*)\s*=\s*(counter[23]?\(\)|\d+)\s*[,;]/g;
 for(const m of source.matchAll(re)){const v=m[2];out[m[1]]=v==='counter()'?++count:v==='counter2()'?++count2:v==='counter3()'?++count3:Number(v);}
 return out;
}
const f14cmd=counters(install+'/Mods/aircraft/F14/Cockpit/command_defs.lua');
const f14dev=counters(install+'/Mods/aircraft/F14/Cockpit/devices.lua',true);
const commandManifest=[];
function stripKeyDiffs(source){
 const start=source.indexOf('["keyDiffs"]');if(start<0)return source;
 let i=source.indexOf('{',start),depth=0,quote='',escape=false;
 for(;i<source.length;i++){
  const ch=source[i];if(quote){if(escape)escape=false;else if(ch==='\\')escape=true;else if(ch===quote)quote='';continue;}
  if(ch==='"'||ch==="'"){quote=ch;continue;}if(ch==='{')depth++;
  if(ch==='}'&&--depth===0){i++;while(/\s/.test(source[i]||'')&&i<source.length)i++;if(source[i]===',')i++;return source.slice(0,source.lastIndexOf('\n',start)+1)+source.slice(i);}
 }
 throw Error('Unbalanced keyDiffs');
}
function profile(module,axisModule){
 const current=path.join(root,'backups/tx16s/20261026-refinement/Config/Input',module,'joystick',device);
 const source=stripKeyDiffs(read(fs.existsSync(current)?current:path.join(root,'baseline/dcs/Config/Input',axisModule,'joystick',device)));
 const keys={},axes=[];
 function bind(name,buttons,fields){
  const hash=[['d','down'],['p','pressed'],['u','up'],['cd','cockpit_device_id'],['vd','value_down'],['vp','value_pressed'],['vu','value_up']].map(([prefix,key])=>prefix+(fields[key]??'nil')).join('');
  if(keys[hash])throw Error('Duplicate command '+hash);
  keys[hash]={name,buttons};commandManifest.push({module,name,buttons,hash,...fields});
 }
 function native(name,buttons,command,deviceName,value,upValue){
  const down=f14cmd[command],cockpit_device_id=f14dev[deviceName];
  if(!Number.isInteger(down)||!Number.isInteger(cockpit_device_id))throw Error('Missing native F-14 identifier '+command+'/'+deviceName);
  bind(name,buttons,{down,cockpit_device_id,value_down:value,...(upValue===undefined?{}:{up:down,value_up:upValue})});
 }
 function save(){
  const quote=JSON.stringify;
  const lines=Object.entries(keys).map(([hash,{name,buttons}])=>'\t\t['+quote(hash)+'] = { ["name"] = '+quote(name)+', ["added"] = { '+buttons.map((b,i)=>'['+(i+1)+'] = { ["key"] = "JOY_BTN'+b+'" }').join(', ')+' } },');
  let text=source.replace('local diff = {','local diff = {\n\t["keyDiffs"] = {\n'+lines.join('\n')+'\n\t},');
  if(axes.length)text=text.replace('["axisDiffs"] = {','["axisDiffs"] = {\n'+axes.join('\n'));
  const out=path.join(root,'config/dcs/Config/Input',module,'joystick',device);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,text);
  console.log(module, Object.keys(keys).length,'native key commands; original',axisModule,'axis block retained');
 }
 function axis(name,hash,key,invert=false){
  if(source.includes('["'+hash+'"]'))throw Error('Existing axis would be overwritten: '+hash);
  axes.push('\t\t['+JSON.stringify(hash)+'] = { ["name"] = '+JSON.stringify(name)+', ["added"] = { [1] = { ["key"] = '+JSON.stringify(key)+', ["filter"] = { ["curvature"] = { [1] = 0 }, ["deadzone"] = 0, ["invert"] = '+invert+', ["saturationX"] = 1, ["saturationY"] = 1, ["slider"] = false } } } },');
  commandManifest.push({module,name,hash,key,invert,kind:'axis'});
 }
 return {bind,native,axis,save};
}
// Shared 84/85 and 350/351 are defined in the installed Mustang command_defs.lua.
// Other FC3 constants are documented in the installed Scripts/Export.lua.
{
 const p=profile('F-15C','F-15C'),b=p.bind;
 b('Weapon Fire',[7],{down:84,up:85});b('Weapon Release',[8],{down:350,up:351});
 b('Wheel Brake On',[3],{down:74,up:75});b('Landing Gear Down',[2],{down:431});b('Landing Gear Up',[1],{down:430});
 b('Flaps Up',[6],{down:146});b('Flaps Landing Position',[4],{down:145});
 b('(2) Beyond Visual Range Mode',[11],{down:106});b('(3) Close Air Combat Vertical Scan Mode',[10],{down:107});b('(4) Close Air Combat Bore Mode',[9],{down:108});
 b('Cannon',[14],{down:113});b('Change Weapon',[13],{down:101});
 b('Autopilot Disengage',[17],{down:408});b('Autopilot - Altitude Hold',[16],{down:389});b('Autopilot - Attitude Hold',[15],{down:62});
 b('Communication menu',[25],{down:179});
 p.save();
}
{
 const p=profile('P-51D','P-51D'),b=p.bind;
 b('Gun fire',[7],{down:84,up:85});b('Weapon release',[8],{down:350,up:351});
 b('Wheel brake Both',[3],{down:74,up:75});
 b('Landing Gear Down',[2],{down:3004,cockpit_device_id:12,value_down:0.1});b('Landing Gear Up',[1],{down:3004,cockpit_device_id:12,value_down:0.2});
 p.axis('Flaps','a3017cd12','JOY_SLIDER1');
 p.axis('Engine RPM Setting','a3026cd5','JOY_RZ',true);
 b('Gunsight mode FIXED',[11],{down:3003,cockpit_device_id:1,value_down:0});b('Gunsight mode FIXED GYRO',[10],{down:3003,cockpit_device_id:1,value_down:0.1});b('Gunsight mode GYRO',[9],{down:3003,cockpit_device_id:1,value_down:0.2});
 b('Gun safety switch OFF',[14],{down:3007,cockpit_device_id:13,value_down:0});b('Gun safety switch GUN CAMERA SIGHT',[13],{down:3007,cockpit_device_id:13,value_down:1});b('Gun safety switch CAMERA SIGHT',[12],{down:3007,cockpit_device_id:13,value_down:-1});
 b('Radiator coolant Close',[21],{down:3001,up:3001,cockpit_device_id:5,value_down:0.1,value_up:0});
 b('Radiator coolant Auto',[22],{down:3009,cockpit_device_id:5,value_down:0.2});
 b('Radiator coolant Open',[23],{down:3001,up:3001,cockpit_device_id:5,value_down:0.3,value_up:0});
 b('COMM Communication menu',[25],{down:179});
 p.save();
}
for(const module of ['F-14BU','F-14B']){
 const p=profile(module,'F-15C'),n=p.native;
 // Both switches operate the real aircraft trigger. SD selects gun/missile type.
 n('Trigger',[7,8],'STICK_Trigger','HOTAS',1,0);
 // 2101 is Wheel Brake in the installed TF-51D VPC preset; F-14 uses
 // that command with pressed=1 and up=-1 in its native keyboard definition.
 p.bind('Wheel Brake both',[3],{pressed:2101,up:2101,value_pressed:1,value_up:-1});
 n('Gears Down',[2],'GEAR_Handle','GEARHOOK',1);n('Gears Up',[1],'GEAR_Handle','GEARHOOK',0);
 n('Flaps Up',[6],'FLAPS_Lever_Key','FLAPS',0.8);n('Flaps Down',[4],'FLAPS_Lever_Key','FLAPS',0.5);
 n('Display mode cruise',[11],'DISP_mode_cruise','HUD',1);n('Display mode air to air',[10],'DISP_mode_air2air','HUD',1);n('Display mode air to ground',[9],'DISP_mode_air2ground','HUD',1);
 n('Weapon Selector Gun',[14],'STICK_Weapon_Selector','WEAPONS',1);n('Weapon Selector Sparrow or Phoenix Missiles',[13],'STICK_Weapon_Selector','WEAPONS',0.5);n('Weapon Selector Sidewinder Missiles',[12],'STICK_Weapon_Selector','WEAPONS',-0.5);
 n('Autopilot Off',[17],'AP_Engage','AFCS',-1);
 n('Autopilot On, else Off',[18],'AP_Engage','AFCS',1,-1);
 n('Altitude Hold On, else Off',[19],'AP_Altitude','AFCS',1,-1);
 n('Heading Hold On, else Off',[20],'AP_Heading','AFCS',1,0);
 n('Wing Sweep Aft',[21],'WINGSWEEP_AftButton','WINGSWEEP',1,0);
 n('Wing Sweep Auto Mode',[22],'WINGSWEEP_AutoButton','WINGSWEEP',1,0);
 n('Wing Sweep Forward',[23],'WINGSWEEP_FwdButton','WINGSWEEP',1,0);
 p.bind('Communication menu',[25],{down:179});
 n('Toggle Menu',[24],'JESTER_ToggleMenu','JESTERAI',1,-1);
 p.save();
}
fs.writeFileSync(path.join(root,'docs/input-command-manifest.json'),JSON.stringify(commandManifest,null,2)+'\n');
