// Build the linked radar/navigation page from declared installed COINS controls.
module.exports=({pages,entry,clone,theme,visual,c,gate})=>{
 const cat=entry.categories.find(x=>x.id==='mgdc_f-14');
 const page=clone(pages['DCS/F14.tml']);page.KEY_TITLE='F-14 Radar & Navigation';page.KEY_ID='monad-f14-systems-20261026';page.KEY_COLUMNS=10;page.KEY_ROWS=9;
 page.BUTTONS=Array.from({length:15},()=>Array.from({length:15},()=>({})));
 const template=pages['DCS/F14.tml'].BUTTONS[0][0];let serial=0;
 function action(name,value){
  const a=cat.actions.find(a=>a.id==='mgdc_f-14_ac_'+name);if(!a)throw Error('Missing F-14 action '+name);
  const d=a.data[0];if(d.valueChoices&&!d.valueChoices.includes(value))throw Error('Undeclared F-14 value '+name+' '+value);
  return {KEY_TYPE:'PLUGIN_ACTION',kIEn:true,kPlugType:2,kID:a.id,kPrefix:'F-14',kPID:'Munt.G_DCS-COINS',kName:a.name,kET:0,
   kData:clone(a.data),kVals:[{VAL:value,ID:d.id,TYPE:d.type}],kInline:'false',kHHF:'false',kStatic:'false'};
 }
 function event(name,value){const e=cat.events.find(e=>e.id==='mgdc_f-14_ev_'+name);if(!e)throw Error('Missing F-14 event '+name);return {...gate(e.valueStateId,value),kVT:e.valueType,kChoices:e.valueChoices||[],kFormat:e.format,kName:e.name};}
 function button(x,y,title,actions=[],cols=1){const b=clone(template);Object.assign(b,{id:'monad_f14_systems_'+(++serial),T:title,COLS:cols,ROWS:1,A:actions,E:[],C:[]});page.BUTTONS[y][x]=b;return b;}
 function state(b,name,on='ON',off='OFF',suffix=true){b.E=[event(name,on),visual(b.T+(suffix?'\nON':''),c.good,c.active),event(name,off),visual(b.T+(suffix?'\nOFF':''),c.text)];return b;}
 function select(x,y,title,name,value,values){const b=button(x,y,title,[action(name,value)]);b.E=values.flatMap(v=>[event(name,v),visual(title+(v===value?'\nSET':''),v===value?c.good:c.text,v===value?c.active:c.surface)]);return b;}
 function pulse(x,y,title,name,feedback){const b=button(x,y,title,[action(name,'[1] ON'),{KEY_TYPE:'TIMER_ACTION',kIEn:true,TT:0,KEY_TIMER_VALUE:'200',kTS:1},action(name,'[0] OFF')]);if(feedback)state(b,feedback,'ON','OFF',false);return b;}
 function toggle(x,y,title,name){return state(button(x,y,title,[action(name,'[TOGGLE]')]),name);}
 function readout(x,y,title,state,cols=2){if(!cat.states.some(s=>s.id==='mgdc_f-14_st_'+state))throw Error('Missing F-14 readout '+state);const b=button(x,y,title,[],cols);b.E=[{KEY_TYPE:'AUTO_UPDATE_EVENT',kIEn:true,kTxt:title+'\n${value:mgdc_f-14_st_'+state+'}'}];return b;}
 function nav(x,y,title,target,cols=2){return button(x,y,title,[{KEY_TYPE:'GOTO_PAGE_ACTION',kIEn:true,KEY_PAGE_NAME:target}],cols);}
 button(0,0,'F-14\nRADAR / NAV',[],2).TC=c.info;
 state(button(2,0,'OFFLINE',[],2),'aircraft_connection');page.BUTTONS[0][2].E=[event('aircraft_connection','ON'),visual('ONLINE',c.good,c.active),event('aircraft_connection','OFF'),visual('OFFLINE',c.muted)];
 const channel=button(4,0,'TACAN CH',[],2);channel.E=[{KEY_TYPE:'AUTO_UPDATE_EVENT',kIEn:true,kTxt:'TACAN CH\n${value:mgdc_f-14_st_plt_tacan_dial_tens}${value:mgdc_f-14_st_plt_tacan_dial_ones}'}];readout(6,0,'RADIO UHF','uhf_freq');nav(8,0,'FLIGHT\nCONTROLS','\\DCS\\F14.tml');
 const modes=[['PD\nSEARCH','pdsrch','pdsearch'],['PULSE\nSEARCH','pulse','psearch'],['RANGE\nWHILE SEARCH','rws','rws'],['TRACK SCAN\nAUTO','twsauto','tws_auto'],['TRACK SCAN\nMANUAL','twsman','tws_man'],['PD SINGLE\nTRACK','pdstt','pdstt'],['PULSE\nSINGLE TRACK','pstt','pstt']];
 modes.forEach(([title,a,light],x)=>pulse(x,1,title,'rio_radar_'+a,'rio_ddd_light_'+light+'_2'));
 toggle(7,1,'RADAR\nSTABILIZE','rio_radar_stabi');pulse(8,1,'RADAR\nDISPLAY','rio_ddd_radar','rio_ddd_light_rdr_2');pulse(9,1,'IFF\nINTERROGATE','rio_ddd_iff','rio_ddd_light_iff_2');
 [5,10,20,50,100,200].forEach((n,x)=>pulse(x,2,'RADAR\n'+n+' NM','rio_radar_'+n,'rio_radar_'+n));
 [10,20,40,65].forEach((n,i)=>select(6+i,2,'SCAN\n+/- '+n+' DEG','rio_radar_azi_scan',String(i),['0','1','2','3']));
 [25,50,100,200,400].forEach((n,i)=>select(i,3,'TID\n'+n+' NM','rio_tid_range',String(i),['0','1','2','3','4']));
 ['GROUND\nSTABILIZED','AIRCRAFT\nSTABILIZED','ATTACK\nDISPLAY','TV / TCS\nDISPLAY'].forEach((t,i)=>select(5+i,3,t,'rio_tid_mode',String(i),['0','1','2','3']));
 pulse(9,3,'HAND CTRL\nTID CURSOR','rio_hcu_tid');
 [['TACAN','tacan'],['DESTINATION','dest'],['APPROACH','awl'],['VECTOR','vector'],['MANUAL','man']].forEach(([t,n],x)=>pulse(x,4,'STEER\n'+t,'plt_nav_steer_'+n,'plt_nav_steer_'+n));
 [['HSD\nECM','0'],['HSD\nTID','1'],['HSD\nNAV','2']].forEach(([t,v],i)=>select(5+i,4,t,'plt_hsd_dis_mode',v,['0','1','2']));
 button(8,4,'HEADING\n- 1 DEG',[action('plt_hsd_knob_hdg','-182')]);button(9,4,'HEADING\n+ 1 DEG',[action('plt_hsd_knob_hdg','182')]);
 [['ONES -','plt_tacan_dial_ones','[DEC] Backward'],['ONES +','plt_tacan_dial_ones','[INC] Forward'],['TENS -','plt_tacan_dial_tens','[DEC] Backward'],['TENS +','plt_tacan_dial_tens','[INC] Forward']].forEach(([t,n,v],x)=>button(x,5,'TACAN\n'+t,[action(n,v)]));
 const xy=button(4,5,'TACAN\nX / Y',[action('plt_tacan_channel','[INC] Forward')]);xy.E=[event('plt_tacan_channel','ON'),visual('TACAN\nY',c.good,c.active),event('plt_tacan_channel','OFF'),visual('TACAN\nX',c.good,c.active)];
 [['OFF','0'],['RECEIVE','1'],['TRANSCEIVE','2']].forEach(([t,v],i)=>select(5+i,5,'TACAN\n'+t,'plt_tacan_mode',v,['0','1','2','3','4']));
 button(8,5,'COURSE\n- 1 DEG',[action('plt_hsd_knob_crs','-182')]);button(9,5,'COURSE\n+ 1 DEG',[action('plt_hsd_knob_crs','182')]);
 [['COLLISION','clsn','clsn'],['DATA LINK','data_link','datalink'],['SYMBOLOGY','sym_elem','symelem'],['ALTITUDES','alt_num',null],['VELOCITY','vel_vector','velvec'],['TRACK HOLD','trackhold',null]].forEach(([t,n,light],x)=>pulse(x,6,'TID\n'+t,'rio_tid_'+n,light?(light==='clsn'?'rio_tid_clsn_light_2':'rio_tid_light_'+light+'_2'):undefined));
 [1,2,4,8].forEach((n,i)=>select(6+i,6,'RADAR\n'+n+' BAR'+(n===1?'':'S'),'rio_radar_ele_bars',String(i),['0','1','2','3']));
 button(0,7,'UHF CH\nPREVIOUS',[action('plt_uhf1_presets','[DEC] Backward')]);readout(1,7,'UHF PRESET','plt_uhf1_presets');button(3,7,'UHF CH\nNEXT',[action('plt_uhf1_presets','[INC] Forward')]);
 [['GUARD','0'],['MANUAL','1'],['PRESET','2']].forEach(([t,v],i)=>select(4+i,7,'UHF\n'+t,'plt_uhf1_freq_mode',v,['0','1','2']));
 pulse(7,7,'TACAN\nTAKE CMD','plt_tacan_cmd_button');button(8,7,'V/UHF CH\nPREVIOUS',[action('rio_vuhf_presets','[DEC] Backward')]);button(9,7,'V/UHF CH\nNEXT',[action('rio_vuhf_presets','[INC] Forward')]);
 nav(0,8,'FLIGHT\nCONTROLS','\\DCS\\F14.tml');nav(2,8,'HOME','\\(main).tml');
 readout(4,8,'TACAN NM','hsd_tacan_range_s');readout(6,8,'TACAN CRS','hsd_tacan_crs_s');
 button(8,8,'RADAR / TID\nRIO CONTROLS',[],2).TC=c.info;
 const feedback=new Map(page.BUTTONS.flat().filter(b=>b.id).map(b=>[b.id,clone(b.E)]));theme(page);for(const b of page.BUTTONS.flat())if(b.id)b.E=feedback.get(b.id);
 pages['DCS/F14 Radar & Navigation.tml']=page;
 const main=pages['DCS/F14.tml'];const link=clone(template);Object.assign(link,{id:'monad_f14_systems_link',T:'RADAR / NAV',COLS:2,ROWS:1,A:[{KEY_TYPE:'GOTO_PAGE_ACTION',kIEn:true,KEY_PAGE_NAME:'\\DCS\\F14 Radar & Navigation.tml'}],E:[],C:[],TC:c.info});main.BUTTONS[0][3]=link;
 main.BUTTONS[7][6].T='HOME';
};
