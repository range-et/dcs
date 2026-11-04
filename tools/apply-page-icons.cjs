// Material icon badges supplement native labels; state events retain the badge.
module.exports=function applyIcons(pages,manifest){
 const rules=[[/HOME|TOOLS HUB/,'home'],[/BLENDER|VIEWPAD/,'view_in_ar'],[/STEAM/,'videogame_asset'],[/TRACK.?IR/,'visibility'],[/ONLINE|OFFLINE/,'network_check'],[/RADAR|SENSOR|SCAN|TRACK|TID|IFF|BORE|BVR/,'gps_fixed'],[/RADIO|UHF|VHF|TACAN|\bCOMM\b/,'radio'],[/GEAR|BRAKE|WOW/,'vertical_align_bottom'],[/FLAP|WING/,'air'],[/ENGINE|THROTTLE|THRUST|RPM|POWER|BATTERY|GENERATOR/,'power_settings_new'],[/TEMP/,'thermostat'],[/FUEL|OIL|COOL|MIXTURE/,'opacity'],[/GUN|ARM|MISSILE|JETT|FIRE|WEAPON/,'security'],[/(?:^|\W)LIGHTS?\b|LAMP|BEACON/,'lightbulb'],[/HEADING|COURSE|STEER|NAV|DEST|VECTOR/,'navigation'],[/ALT|CLIMB|DESCENT|VERTICAL|VV/,'swap_vert'],[/SPEED|IAS|MACH/,'speed'],[/TIME|CLOCK/,'timer'],[/PAUSE/,'pause'],[/PLAY|START/,'play_arrow'],[/\bF\d+\b|COCKPIT|EXTERNAL|VIEW/,'visibility'],[/A\/P|\bAP\b|AUTOPILOT|HOLD|LEVEL/,'flight'],[/DCS|F-14|FC3|P-51|FLIGHT/,'flight']];
 for(const [file,page] of Object.entries(pages))for(const b of page.BUTTONS.flat())if(b.id){
  const role=b.monadRole||'default';delete b.monadRole;
  if(['title','section','caption'].includes(role)){
   const argb=h=>(parseInt(h.slice(1),16)|0xff000000);
   b.I='';b.Ialt='';b.IiS=false;b.ITS=false;b.BG=argb('#0F1113');b.BE=b.BG;b.TC=argb(role==='title'?'#EEF2F6':'#B6BFCC');
   b.FF=role==='section'?'Courier New':'Arial';b.TP=2;b.TO=3;b.TS=role==='title'?26:role==='caption'?16:20;
   // The contrasting full-width label band and surrounding gutter separate groups.
   delete b.monadIcon;continue;
  }
  const icon=b.monadIcon||rules.find(([re])=>re.test(b.T||''))?.[1]||'tune';delete b.monadIcon;
  const cols=b.COLS||1,rows=b.ROWS||1,name=`monad_md_${icon}_${cols}x${rows}_${role}${file==='DCS/F14 Radar & Navigation.tml'?'_compact':''}.png`;
  if(role!=='default'){
   const argb=h=>(parseInt(h.slice(1),16)|0xff000000);
   b.FF=role==='readout'?'Courier New':'Arial';b.BG=argb(role==='primary'?'#2A313A':'#1F242B');b.BE=b.BG;b.TC=argb(role==='navigation'?'#1E88C8':role==='utility'?'#B6BFCC':'#EEF2F6');
  }
  b.I=name;b.Ialt='';b.IiS=true;b.ITS=false;b.TP=3;b.TO=3;
  // Fixed type tokens; labels must be rewritten/wrapped rather than shrunk.
  b.TS=file==='DCS/F14 Radar & Navigation.tml'?14:page.KEY_COLUMNS>=13?20:page.KEY_COLUMNS===8?18:22;
  if(file==='DCS/F14 Radar & Navigation.tml'){
   const replacements={'INTERROGATE':'IDENTIFY','STABILIZED':'STAB','DESTINATION':'DEST','TRANSCEIVE':'TX / RX','SYMBOLOGY':'SYMBOLS','ALTITUDES':'ALTITUDE','PREVIOUS':'PREV','COLLISION':'COLLISION','WHILE SEARCH':'WHILE\nSEARCH','SINGLE TRACK':'SINGLE\nTRACK','TRACK SCAN':'TRACK\nSCAN'};
   const rewrite=t=>Object.entries(replacements).reduce((s,[from,to])=>s.replaceAll(from,to),t).replace(/\+\/- (\d+)\nDEG/g,'±$1°');
   b.T=rewrite(b.T);
   for(const k of ['A','E','C'])for(const a of b[k]||[])if(a.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION'&&a.KEY_TITLE)a.KEY_TITLE=rewrite(a.KEY_TITLE);
  }
  if(file==='Blender/Viewpad.tml')b.T=b.T.toLowerCase().replace(/\b[a-z]/g,c=>c.toUpperCase());
  if(file.startsWith('DCS/')&&file!=='DCS/F14 Radar & Navigation.tml'){
   const acronyms=new Set(['FC3','F-14','P-51D','IAS','MACH','ALT','AAG','VV','RPM','WOW','ECM','BVR','CAC','HMD','RWS','TWS','RWR','SPO','HUD','HSD','VDI','AWL','ACL','ACM','AFCS','ATP','AP','HDG','KT','FT','OFF','ON','DEG','GNT','PCD','SW','MSL','TD','DN','LT','RT','L','R','N','A','B','C','D']);
   const rewrite=t=>t.replace(/[A-Z][A-Z0-9-]*/g,s=>acronyms.has(s)?s:s[0]+s.slice(1).toLowerCase()).replaceAll('MSL Prep','MSL\nPrep').replaceAll('HSD/ECM','HSD /\nECM').replaceAll('AWL/PCD','AWL /\nPCD');
   b.T=rewrite(b.T);
   for(const k of ['A','E','C'])for(const a of b[k]||[])if(a.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION'&&a.KEY_TITLE)a.KEY_TITLE=rewrite(a.KEY_TITLE);
  }
  for(const k of ['A','E','C'])for(const a of b[k]||[])if(a.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION')a.KEY_IS_CHANGE_ICON=false;
  manifest.push({page:file,id:b.id,title:b.T,icon,file:name,cols,rows,role});
 }
};
