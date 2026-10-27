// Rebuild editable pages from the immutable baseline and upstream Monad tokens.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'), read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const clone=o=>structuredClone(o);
const palette=read('theme/monad-colors.json').Default_Colors;
const ui=palette.General_UI_Colors;
const argb=h=>(parseInt(h.replace('#',''),16)|0xff000000);
const c={bg:argb(ui.Background.hex),surface:argb(ui.Layer_02.hex),active:argb(ui.Layer_03.hex),
 text:argb(ui.Primary_Text.hex),muted:argb(ui.Secondary_Text.hex),info:argb(palette.Information_Indicators.Information_1.hex),
 good:argb(palette.Information_Indicators.Information_3.hex),warn:argb(palette.Warnings_and_Alerts.Warning_1.hex),
 error:argb(palette.Warnings_and_Alerts.Alert_1.hex)};
const originals={};
for(const file of ['(main).tml','DCS/FC3 Main Panel.tml','DCS/FC3 Navigation & Sensor Panel.tml','DCS/F14.tml']) originals[file]=read('baseline/touchportal/pages/'+file);
const label=s=>{const vars=[];return(s||'').replace(/\$\{[^}]+\}/g,v=>'@@'+(vars.push(v)-1)+'@@').replace(/TRHOTTLE/gi,'THROTTLE').replace(/Ldg Gear/gi,'GEAR').replace(/\bExit\b/gi,'HOME').trim().toUpperCase().replace(/@@(\d+)@@/g,(_,i)=>vars[+i]);};
function compact(s){return s.replace(/THROTTLE\s+LEFT/g,'LEFT\nTHROTTLE').replace(/THROTTLE\s+RIGHT/g,'RIGHT\nTHROTTLE')
 .replace(/MASTER\s+ARM\s+COVER/g,'MASTER\nCOVER').replace(/ACM\s+JETTISON/g,'ACM\nJETT')
 .replace(/DECLUTTER/g,'DECLUT').replace(/ENG\s+LEFT\s+START/g,'LEFT\nENGINE\nSTART').replace(/ENG\s+RIGHT\s+START/g,'RIGHT\nENGINE\nSTART')
 .replace(/ANTI\s+COLLISION/g,'ANTI COL').replace(/STEER\s+CMD\s+/g,'STEER\n').replace(/AWL\/PCD/g,'AWL/PCD')
 .replace(/ATP\s+ENGAGE/g,'AP\nENGAGE').replace(/ATP\s+ALT\s+GNT/g,'AP ALT\nGNT')
 .replace(/HSD\/ECM\s+POWER/g,'HSD/ECM\nPWR').replace(/A\/P\s+OVERRIDE/g,'A/P\nOVRD').replace(/TRAN LVL\s+FLGT CTRL/g,'LEVEL\nFLIGHT')
 .split('\n').map(x=>x.trim()).join('\n');}
// Fit both the ordinary label and every feedback label to the same button.
// Widths are conservative Segoe UI uppercase em estimates; visual QA follows in Touch Portal.
function fitLabel(b){
 const cols=b.COLS||1,rows=b.ROWS||1;
 const wrap=t=>t.includes('${')?t:t.split('\n').flatMap(line=>{
  const words=line.trim().split(/\s+/),lines=[];let current='';const limit=cols===1?9:cols*9;
  for(const word of words){if(current&&current.length+1+word.length>limit){lines.push(current);current=word;}else current+=(current?' ':'')+word;}
  lines.push(current);return lines;
 }).join('\n');
 b.T=wrap(b.T);
 const labels=[b.T];for(const group of ['A','E','C'])for(const a of b[group]||[])if(a.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION'){a.KEY_TITLE=wrap(a.KEY_TITLE);labels.push(a.KEY_TITLE);}
 let size=b.TS||26;
 for(const t of labels){if(t.includes('${'))continue;const lines=t.split('\n');
  for(const line of lines){const width=[...line].reduce((sum,ch)=>sum+(/[MW@%]/.test(ch)?.96:/[I1|.:' ]/.test(ch)?.35:.69),0);if(width)size=Math.min(size,Math.floor((cols*100-18)/width));}
  size=Math.min(size,Math.floor((rows*100-16)/(lines.length*1.3)));
 }
 b.TS=Math.max(14,size);
}
function visual(title,color=c.text,bg=c.surface){return {KEY_TYPE:'CHANGE_BUTTON_VISUALS_ACTION',kIEn:true,
 KEY_IS_CHANGE_TITLE:true,KEY_TITLE:title,KEY_IS_CHANGE_TEXT_COLOR:true,KEY_TEXT_COLOR:color,
 KEY_IS_CHANGE_BG_COLOR:true,KEY_START_COLOR:bg,KEY_END_COLOR:bg,KEY_IS_CHANGE_ICON:true,KEY_FILENAME:'',KEY_ALT_FILENAME:'',
 KEY_IS_CHANGE_IS_FULL_ICON:false,KEY_IS_CHANGE_IS_TRANSPARENT:true,KEY_IS_TRANSPARENT:false,
 KEY_IS_CHANGE_ALIGN_HOR:false,KEY_IS_CHANGE_ALIGN_VERT:false,KEY_IS_CHANGE_IS_ROUNDED:false};}
function gate(state,value){return {KEY_TYPE:'PLUGIN_EVENT',kIEn:true,kChoices:['OFF','ON'],kCSO:-1,kVal:value,kVT:'choice',
 kVSI:state,kID:state.replace('_st_','_ev_'),kLS:[],kCO:'none',kFormat:'When aircraft state is $val',kName:state,kpip:''};}
function styleButton(b){
 if(!b.id)return b;
 b.T=compact(label(b.T));b.I='';b.Ialt='';b.IiS=false;b.BiT=false;b.BiR=false;b.ITS=true;b.GUid=-1;b.GUdata='';b.kIAs=[];
 b.BG=c.surface;b.BE=c.surface;b.TC=c.text;b.FF='Segoe UI';b.TA=5;b.TP=2;b.THO=3;b.TO=3;b.TS=26;
 b.kKnBgI={a:[],f:'',fe:''};b.kKnRotIImg2={a:[],f:'',fe:''};b.kSCHS=false;b.kSCHRC=false;
 for(const key of ['A','E','C']){
  let condition='';
  b[key]=(b[key]||[]).filter(a=>a.KEY_TYPE!=='CHANGE_GU_SETTINGS_ACTION').map(a=>{
   if(a.KEY_TYPE==='PLUGIN_EVENT'||/BUTTON_STATE.*EVENT/.test(a.KEY_TYPE||''))condition=a.kVal||a.KEY_STATE||'';
   if(a.KEY_TYPE==='AUTO_UPDATE_EVENT')a.kTxt=label(a.kTxt);
   if(a.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION'){
    let title=a.KEY_IS_CHANGE_TITLE?compact(label(a.KEY_TITLE)):b.T;
    if(!title)title=b.T;
    if(/^(ON|OFF|ENGAGED|DISENGAGED)$/.test(title)&&b.T)title=b.T+'\n'+title;
    return {...a,...visual(title,condition==='ON'?c.good:c.text,condition==='ON'?c.active:c.surface)};
   }return a;
  });
 }
 if(b.A.some(a=>a.KEY_TYPE==='GOTO_PAGE_ACTION'))b.TC=c.info;
 if(!b.A.length)b.FF='Consolas';
 if(b.T.split('\n').some(s=>s.length>12)&&b.COLS===1)b.TS=23;
 return b;
}
function theme(page){page.BG=c.bg;page.BGI='';page.GUid=-1;page.GUdata='';page.BTN_MARGIN=0.5;page.kGB=false;
 page.BUTTONS.forEach(row=>row.forEach(styleButton));return page;}
const pages={};
for(const [file,source] of Object.entries(originals))pages[file]=theme(clone(source));
// Static labels for formerly image-only controls/readouts.
const main=pages['(main).tml'];main.BUTTONS[0][0].T='STEAM';
const fc3=pages['DCS/FC3 Main Panel.tml'];
fc3.BUTTONS[0][0].T='FC3\nFLIGHT';fc3.BUTTONS[0][0].TC=c.info;
for(const [x,y,t] of [[3,5,'LEFT\nENGINE\nSTART'],[4,5,'RIGHT\nENGINE\nSTART'],[3,6,'LEFT\nENGINE\nSTOP'],[4,6,'RIGHT\nENGINE\nSTOP']])fc3.BUTTONS[y][x].T=t;
for(const row of fc3.BUTTONS)for(const b of row)if(b.id){b.T=b.T.replace('A/P\nOVERRIDE','A/P\nOVRD').replace('TRAN LVL\nFLGT CTRL','LEVEL\nFLIGHT');}
const wowLabels=new Map([[originals['DCS/FC3 Main Panel.tml'].BUTTONS[2][0].id,'NOSE\nWOW'],[originals['DCS/FC3 Main Panel.tml'].BUTTONS[3][0].id,'LEFT\nWOW'],[originals['DCS/FC3 Main Panel.tml'].BUTTONS[3][1].id,'RIGHT\nWOW']]);
for(const page of [fc3,pages['DCS/FC3 Navigation & Sensor Panel.tml']])for(const b of page.BUTTONS.flat())if(wowLabels.has(b.id)){
 const t=wowLabels.get(b.id);b.T=t;b.TS=20;let value='';for(const a of b.E){if(a.KEY_TYPE==='PLUGIN_EVENT')value=a.kVal;if(a.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION')Object.assign(a,visual(t+'\n'+value,value==='ON'?c.good:c.muted));}
}
const gear=fc3.BUTTONS[1][0];gear.T='GEAR\nUNKNOWN';gear.TC=c.warn;gear.TS=24;gear.E=[gate('mgdc_fc3_st_fc3_gear','ON'),visual('GEAR\nDOWN',c.good,c.active),gate('mgdc_fc3_st_fc3_gear','OFF'),visual('GEAR\nUP',c.text)];
for(const b of pages['DCS/FC3 Navigation & Sensor Panel.tml'].BUTTONS.flat())if(b.id===gear.id){b.T=gear.T;b.TC=gear.TC;b.TS=gear.TS;b.E=clone(gear.E);}
// Legacy sensor-page duplicates sit underneath merged readouts. Visible copies remain.
const sensor=pages['DCS/FC3 Navigation & Sensor Panel.tml'];
for(const [x,y] of [[4,0],[6,0],[1,1],[4,1],[10,1],[1,2]]){
 const hidden=sensor.BUTTONS[y][x];
 if(!sensor.BUTTONS.flat().some(b=>b!==hidden&&b.id&&b.T===hidden.T))throw Error('Expected visible duplicate for '+hidden.T);
 sensor.BUTTONS[y][x]={};
}
// Retain page-layout identity while removing the obsolete f-14b state namespace.
let f14=JSON.parse(JSON.stringify(pages['DCS/F14.tml']).replaceAll('mgdc_f-14b_','mgdc_f-14_'));
pages['DCS/F14.tml']=f14;
f14.BUTTONS[0][0].T='F-14';f14.BUTTONS[0][0].TC=c.info;
// Give throttle actions room for their full meaning instead of shrinking to tiny text.
const speedReadout=f14.BUTTONS[4][5],altReadout=f14.BUTTONS[5][5];
f14.BUTTONS[3][5]=speedReadout;f14.BUTTONS[3][10]=altReadout;
for(const y of [4,5]){
 const left=f14.BUTTONS[y][3],right=f14.BUTTONS[y][4];
 f14.BUTTONS[y][4]={};f14.BUTTONS[y][5]=right;
 left.COLS=2;right.COLS=3;
}
for(const b of f14.BUTTONS.flat())if(b.id){b.T=b.T.replace('SW COOL','SW\nCOOL').replace('MSL PREP','MSL\nPREP');}
function connection(page,prefix){for(const row of page.BUTTONS)for(const b of row)if(b.id&&/^(ONLINE|OFFLINE)$/i.test(b.T||'')){
 b.T='OFFLINE';b.TC=c.muted;b.TS=24;b.E=[gate(`mgdc_${prefix}_st_aircraft_connection`,'ON'),visual('ONLINE',c.good,c.active),gate(`mgdc_${prefix}_st_aircraft_connection`,'OFF'),visual('OFFLINE',c.muted)];
}}
connection(fc3,'fc3');connection(pages['DCS/FC3 Navigation & Sensor Panel.tml'],'fc3');connection(f14,'f-14');
// Build Mustang controls from declared installed plugin actions, with explicit values.
const entry=read('baseline/touchportal/plugins/Munt.G_DCS-COINS/entry.tp');
const cat=entry.categories.find(x=>x.id==='mgdc_p-51d');
function p51Gate(name,value){const e=cat.events.find(e=>e.id==='mgdc_p-51d_ev_'+name);if(!e)throw Error('Missing event '+name);return {...gate(e.valueStateId,value),kChoices:e.valueChoices||[],kVT:e.valueType,kFormat:e.format,kName:e.name};}
function selection(b,name,selected,values){b.E=values.flatMap(value=>[p51Gate(name,value),visual(b.T+(value===selected?'\nSELECTED':''),value===selected?c.good:c.text,value===selected?c.active:c.surface)]);return b;}
const template=originals['DCS/F14.tml'].BUTTONS[1][0];
const p51=clone(main);p51.KEY_TITLE='P-51D';p51.KEY_ID='monad-p51d-20261026';p51.KEY_COLUMNS=8;p51.KEY_ROWS=6;
 p51.BUTTONS=Array.from({length:15},()=>Array.from({length:15},()=>({})));
let serial=0;
function button(x,y,title,action,cols=1){const b=clone(template);b.id='monad_p51_'+(++serial);b.T=title;b.COLS=cols;b.ROWS=1;b.A=action?[action]:[];b.E=[];b.C=[];b.I='';styleButton(b);b.TS=22;p51.BUTTONS[y][x]=b;return b;}
function action(name,value){const def=cat.actions.find(a=>a.id==='mgdc_p-51d_ac_'+name);if(!def)throw Error('Missing action '+name);const d=def.data[0];if(d.valueChoices&&!d.valueChoices.includes(value))throw Error('Invalid '+name+' value '+value);return {KEY_TYPE:'PLUGIN_ACTION',kIEn:true,kPlugType:2,kID:def.id,kPrefix:'P-51D',kPID:entry.id,kName:def.name,kET:0,kData:clone(def.data),kVals:[{VAL:value,ID:d.id,TYPE:d.type}],kInline:'false',kHHF:'false',kStatic:'false'};}
function toggle(x,y,title,name){const b=button(x,y,title,action(name,'[TOGGLE]'));const s='mgdc_p-51d_st_'+name;b.E=[gate(s,'ON'),visual(label(title)+'\nON',c.good,c.active),gate(s,'OFF'),visual(label(title)+'\nOFF')];return b;}
function pulse(name,ms=200){return [action(name,'[1] ON'),{KEY_TYPE:'TIMER_ACTION',kIEn:true,TT:0,KEY_TIMER_VALUE:String(ms),kTS:1},action(name,'[0] OFF')];}
function readout(x,y,title,state,cols=2){const b=button(x,y,title,null,cols);b.E=[{KEY_TYPE:'AUTO_UPDATE_EVENT',kIEn:true,kTxt:title+'\n${value:'+state+'}'}];return b;}
button(0,0,'P-51D\nMUSTANG',null,2).TC=c.info;
button(2,0,'OFFLINE',null,2);connection(p51,'p-51d');
readout(4,0,'IAS KT','mgdc_commondata_st_ias_us');
readout(6,0,'ALT FT','mgdc_commondata_st_alt_msl_ft');
toggle(0,1,'BATTERY','bat');toggle(1,1,'GENERATOR','gen');toggle(2,1,'FUEL\nBOOST','fuel_booster');
button(3,1,'IGNITION\nBOTH',action('ignition','3'));button(4,1,'MIXTURE\nRUN',action('mixture_control','1'));
toggle(5,1,'PITOT\nHEAT','pitot');toggle(6,1,'LANDING\nLIGHT','landing_light');button(7,1,'BRAKE\nHANDLE').A=pulse('park_brake_handle');
button(0,2,'GEAR\nDOWN',action('landing_gear_contr0l_handle','[0] OFF'));button(1,2,'GEAR\nUP',action('landing_gear_contr0l_handle','[1] ON'));
const flapStates=['0%','20%','40%','60%','80%','100%'];
selection(button(2,2,'FLAPS\nUP',action('flaps_control_handle','65535')),'flaps_control_handle','100%',flapStates);
selection(button(3,2,'FLAPS\n20 DEG',action('flaps_control_handle','39321')),'flaps_control_handle','60%',flapStates);
selection(button(4,2,'FLAPS\nDOWN',action('flaps_control_handle','0')),'flaps_control_handle','0%',flapStates);
const safe=button(5,2,'DOWN\nLAMP',null,2);safe.E=[gate('mgdc_p-51d_st_landing_gear_green','ON'),visual('DOWN LAMP\nON',c.good),gate('mgdc_p-51d_st_landing_gear_green','OFF'),visual('DOWN LAMP\nOFF',c.muted)];
toggle(7,2,'RADIO\nPOWER','vhf_radio_on_off');
// Radiator labels/positions are added only after verifying the cockpit enum order.
selection(button(0,3,'COOLANT\nAUTO',action('coolant_control','2'),2),'coolant_control','2',['0','1','2','3']);
selection(button(2,3,'OIL\nAUTO',action('oil_control','2'),2),'oil_control','2',['0','1','2','3']);
for(const [x,ch] of [[4,'a'],[5,'b'],[6,'c'],[7,'d']])button(x,3,'RADIO\n'+ch.toUpperCase()).A=pulse('vhf_radio_chan_'+ch);
button(0,4,'GUNS\nSAFE',action('gun_control','1'),2);button(2,4,'GUNS\nARM',action('gun_control','2'),2);
button(4,4,'COOLING\nCOVERS',null,2).A=[action('coolant_control_cover','[1] ON'),action('oil_control_cover','[1] ON')];
const f1=clone(originals['DCS/FC3 Main Panel.tml'].BUTTONS[1][11].A[0]);const f2=clone(originals['DCS/FC3 Main Panel.tml'].BUTTONS[1][12].A[0]);
button(6,4,'COCKPIT\nF1',f1);button(7,4,'EXTERNAL\nF2',f2);
button(0,5,'HOME',{KEY_TYPE:'GOTO_PAGE_ACTION',kIEn:true,KEY_PAGE_NAME:'\\(main).tml'},2);
button(2,5,'FLIGHT\nCOOLING / GEAR',null,4).TC=c.muted;
button(6,5,'F-14',{KEY_TYPE:'GOTO_PAGE_ACTION',kIEn:true,KEY_PAGE_NAME:'\\DCS\\F14.tml'},2);
// Theme the new controls without replacing their explicit numeric-state feedback.
const p51Feedback=new Map(p51.BUTTONS.flat().filter(b=>b.id).map(b=>[b.id,clone(b.E)]));
pages['DCS/P-51D.tml']=theme(p51);
for(const b of p51.BUTTONS.flat())if(b.id)b.E=p51Feedback.get(b.id);
// Add Mustang navigation to an empty launcher slot.
const nav=clone(main.BUTTONS[0][5]);nav.id='monad_home_p51';nav.T='P-51D';nav.A=[{KEY_TYPE:'GOTO_PAGE_ACTION',kIEn:true,KEY_PAGE_NAME:'\\DCS\\P-51D.tml'}];main.BUTTONS[1][0]=nav;
const launchers=main.BUTTONS[0].slice(0,6);main.KEY_COLUMNS=4;main.KEY_ROWS=2;
main.MAX=true;
main.BUTTONS=Array.from({length:15},()=>Array.from({length:15},()=>({})));
for(let i=0;i<3;i++)main.BUTTONS[0][i]=launchers[i];
const header=clone(launchers[2]);header.id='monad_launcher_title';header.T='MONAD\nFLIGHTDECK';header.A=[];header.TC=c.muted;main.BUTTONS[0][3]=header;
for(let i=0;i<3;i++)main.BUTTONS[1][i]=launchers[i+3];main.BUTTONS[1][3]=nav;
for(const b of main.BUTTONS.flat())if(b.id)b.TS=14;
// Remove image-only decoration which has no state or action; keep other controls intact.
for(const [file,page] of Object.entries(pages)){
 for(const b of page.BUTTONS.flat())for(const group of ['A','E','C'])for(const a of b[group]||[])if(a.KEY_TYPE==='TIMER_ACTION'&&a.TT===1){
  const seconds=Number(String(a.KEY_TIMER_VALUE).replace(',','.'));
  if(!Number.isFinite(seconds)||seconds<0)throw Error('Invalid wait in '+file);
  a.TT=0;a.KEY_TIMER_VALUE=String(Math.round(seconds*1000));
 }
 for(const b of page.BUTTONS.flat())if(b.id)fitLabel(b);
 for(const row of page.BUTTONS)for(let i=0;i<row.length;i++)if(row[i].id&&!row[i].T&&!row[i].A?.length&&!row[i].E?.length)row[i]={};
 const out=path.join(root,'pages',file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,JSON.stringify(page,null,2)+'\n');
 console.log(file,page.BUTTONS.flat().filter(b=>b.id).length,'controls');
}
