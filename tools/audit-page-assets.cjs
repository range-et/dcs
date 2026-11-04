// Verify the combined installed page graph and referenced static icon files.
const fs=require('fs'),path=require('path');
const profile=path.join(process.env.APPDATA,'TouchPortal');
const roots=[path.resolve(__dirname,'../pages'),path.resolve(__dirname,'../../blender_touchportal/pages'),path.resolve(__dirname,'../../touchportal_shared/pages'),path.resolve(__dirname,'../../obs_touchportal/pages')];
let count=0;
for(const root of roots)for(const file of fs.readdirSync(root,{recursive:true}).filter(x=>x.endsWith('.tml'))){
 const page=JSON.parse(fs.readFileSync(path.join(root,file)));const occupied=new Set();
 const live=JSON.parse(fs.readFileSync(path.join(profile,'pages',file)));
 if(page.BGI&&(!fs.existsSync(path.join(profile,'icons',page.BGI))||page.BGI!==live.BGI))throw Error('Missing or mismatched group background '+file);
 for(let y=0;y<15;y++)for(let x=0;x<15;x++){
  const b=page.BUTTONS[y]?.[x];if(!b?.id)continue;count++;
  if(b.I&&!fs.existsSync(path.join(profile,'icons',b.I)))throw Error('Missing icon '+file+' '+b.T);
  if(!b.I&&(b.A?.length||b.E?.length))throw Error('Interactive/readout control missing icon '+file+' '+b.T);
  for(let dy=0;dy<(b.ROWS||1);dy++)for(let dx=0;dx<(b.COLS||1);dx++){
   const pos=[x+dx,y+dy].join(',');if(occupied.has(pos)||x+dx>=page.KEY_COLUMNS||y+dy>=page.KEY_ROWS)throw Error('Layout conflict '+file+' '+pos);occupied.add(pos);
  }
  const deployed=live.BUTTONS[y]?.[x];if(deployed?.id!==b.id||deployed.I!==b.I)throw Error('Installed control mismatch '+file+' '+b.id);
  for(const group of ['A','E','C'])for(const action of b[group]||[]){
   if(action.KEY_TYPE==='GOTO_PAGE_ACTION'&&!['(Previous Page)','(Next Page)'].includes(action.KEY_PAGE_NAME)&&!fs.existsSync(path.join(profile,'pages',action.KEY_PAGE_NAME.replace(/^\\/,''))))throw Error('Missing destination '+action.KEY_PAGE_NAME);
   if(action.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION'&&action.KEY_IS_CHANGE_ICON)throw Error('State event can erase badge '+b.id);
  }
 }
 console.log('OK',file);
}
console.log(count,'populated controls; interactive icons, group backgrounds and navigation validated.');
