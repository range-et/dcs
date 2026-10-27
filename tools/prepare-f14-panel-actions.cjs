// Expose only BIOS-documented INC/DEC inputs omitted by the older COINS UI schema.
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'..');
const file=path.join(root,'config/touchportal/plugins/Munt.G_DCS-COINS/entry.tp');
const entry=JSON.parse(fs.readFileSync(file)),cat=entry.categories.find(c=>c.id==='mgdc_f-14');
const doc=JSON.parse(fs.readFileSync(path.join(root,'baseline/dcs/Scripts/DCS-BIOS/doc/json/F-14.json')));
const controls=Object.assign({},...Object.values(doc));
for(const name of ['plt_tacan_dial_ones','plt_tacan_dial_tens','plt_uhf1_presets','rio_vuhf_presets']){
 if(!controls[name.toUpperCase()].inputs.some(i=>i.interface==='fixed_step'))throw Error('No fixed-step input '+name);
 const action=cat.actions.find(a=>a.id==='mgdc_f-14_ac_'+name);
 for(const value of ['[DEC] Backward','[INC] Forward'])if(!action.data[0].valueChoices.includes(value))action.data[0].valueChoices.push(value);
}
fs.writeFileSync(file,JSON.stringify(entry,null,2)+'\n');
