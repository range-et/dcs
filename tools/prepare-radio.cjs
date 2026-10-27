// Derive a separate simulator model from the backed-up Sim CABEL model.
// Historical first checkpoint only. The current profile is built by refine-radio.py.
if(!process.argv.includes('--initial'))throw Error('Use tools/refine-radio.py for the current profile; --initial rebuilds only the historical first checkpoint.');
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'backups/tx16s/20261026/MODELS/model1.yml'),'utf8');
if(!source.includes('name: "Sim CABEL"')||!source.includes('usbJoystickExtMode: 0'))throw Error('Unexpected source model');
let text=source.replace('name: "Sim CABEL"','name: "DCS Cockpit"').replace('labels: ""','labels: "Favorites"').replace('usbJoystickExtMode: 0','usbJoystickExtMode: 1');
const channels=[];
const axis=(ch,param)=>channels.push({ch,mode:'CH_AXIS',inversion:0,param,btn_num:0,switch_npos:0});
const buttons=(ch,first,count,inversion=1)=>channels.push({ch,mode:'CH_BUTTON',inversion,param:0,btn_num:first-1,switch_npos:count-1});
for(let ch=0;ch<4;ch++)axis(ch,ch);
buttons(4,15,3); // SE, output CH5
buttons(5,1,3);  // SA, output CH6
buttons(6,4,3);  // SB, output CH7
buttons(7,9,3);  // SC, output CH8
buttons(8,12,3); // SD, output CH9
axis(10,4);     // RS (SL2), output CH11 -> rotY
axis(11,5);     // LS (SL1), output CH12 -> rotZ
buttons(14,7,1,0); // SF, preserve measured up=pressed
buttons(15,8,1,0); // SH, preserve held=pressed
text+='\nusbJoystickCh:\n'+channels.map(({ch,...fields})=>'   '+ch+':\n'+Object.entries(fields).map(([key,value])=>'      '+key+': '+value+'\n').join('')).join('');
const used=new Set();for(const channel of channels)if(channel.mode==='CH_BUTTON')for(let n=channel.btn_num;n<=channel.btn_num+channel.switch_npos;n++){if(used.has(n))throw Error('Overlapping USB buttons');used.add(n);}
const out=path.join(root,'config/radio/model7.yml');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,text);
console.log('Prepared DCS Cockpit with',channels.length,'USB channel definitions and',used.size,'distinct buttons.');
