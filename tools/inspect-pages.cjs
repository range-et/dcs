const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,'../baseline/touchportal/pages');
for(const file of ['(main).tml','DCS/FC3 Main Panel.tml','DCS/FC3 Navigation & Sensor Panel.tml','DCS/F14.tml']) {
 const page=JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
 console.log('\nPAGE',file,page.KEY_COLUMNS,page.KEY_ROWS);
 page.BUTTONS.forEach((row,y)=>row.forEach((b,x)=>{
  if(!b.id)return;
  console.log(JSON.stringify({x,y,T:b.T,id:b.id,I:b.I,TS:b.TS,ITS:b.ITS,TA:b.TA,TP:b.TP,
   actionTypes:b.A?.map(a=>a.KEY_TYPE),events:b.E?.length,
   details:/gear|online|offline|connection/i.test(b.T||'')?b:undefined}));
 }));
}
