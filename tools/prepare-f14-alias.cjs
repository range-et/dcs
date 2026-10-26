const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const base=path.join(root,'baseline');
function write(relative,text){const out=path.join(root,'config',relative);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,text);console.log(relative);}
let moduleText=fs.readFileSync(path.join(base,'dcs/Scripts/DCS-BIOS/lib/modules/aircraft_modules/F-14.lua'),'utf8');
if(!moduleText.includes('{ "F-14B", "F-14A-135-GR" }'))throw Error('Unexpected F-14 module mapping');
moduleText=moduleText.replace('{ "F-14B", "F-14A-135-GR" }','{ "F-14B", "F-14A-135-GR", "F-14BU" }');
write('dcs/Scripts/DCS-BIOS/lib/modules/aircraft_modules/F-14.lua',moduleText);
let list=fs.readFileSync(path.join(base,'dcs/Scripts/DCS-BIOS/lib/AircraftList.lua'),'utf8');
list=list.replace('add("F-14B", true)','add("F-14B", true)\nadd("F-14BU", true)');
write('dcs/Scripts/DCS-BIOS/lib/AircraftList.lua',list);
let aliases=fs.readFileSync(path.join(base,'touchportal/plugins/Munt.G_DCS-COINS/acdb/aircraftModules.cfg'),'utf8');
aliases=aliases.replace('F-14|f-14|F-14|F-14B','F-14|f-14|F-14|F-14B\r\nF-14|f-14|F-14|F-14BU');
write('touchportal/plugins/Munt.G_DCS-COINS/acdb/aircraftModules.cfg',aliases);
const entry=JSON.parse(fs.readFileSync(path.join(base,'touchportal/plugins/Munt.G_DCS-COINS/entry.tp'),'utf8'));
entry.categories.find(c=>c.id==='mgdc_f-14').states.find(s=>s.id==='mgdc_f-14_st_aircraft_model').valueChoices.push('F-14BU');
write('touchportal/plugins/Munt.G_DCS-COINS/entry.tp',JSON.stringify(entry,null,2)+'\n');
