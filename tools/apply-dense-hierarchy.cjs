// Keep every cell/action in place. Borders live behind the existing dense grid.
module.exports=function(pages,manifest){
 const f14=pages['DCS/F14 Radar & Navigation.tml'];
 const blender=pages['Blender/Viewpad.tml'];
 const style=(page,file,name,groups)=>{
  page.MAX=true;page.kFM=2;page.BTN_MARGIN=1.5;page.BG=(parseInt('0F1113',16)|0xff000000);page.BGI=name;
  for(const b of page.BUTTONS.flat())if(b.id)b.monadRole=b.A?.some(a=>a.KEY_TYPE==='GOTO_PAGE_ACTION')?'navigation':b.A?.length?'secondary':b.E?.length?'readout':'caption';
  manifest.push({kind:'background',page:file,file:name,cols:page.KEY_COLUMNS,rows:page.KEY_ROWS,groups});
 };
 if(blender){
  style(blender,'Blender/Viewpad.tml','monad_blender_group_frames.png',[
   [0,0,4,1],[4,0,4,1],[0,1,8,1],[0,2,4,1],[4,2,4,1],
   [0,3,2,1],[2,3,4,1],[6,3,2,1],[0,4,4,1],[4,4,4,1],
   [0,5,3,1],[3,5,3,1],[6,5,2,1]
  ]);
  blender.BUTTONS[0][0].T='Blender';blender.BUTTONS[0][0].monadRole='title';
  for(const x of [0,2,4])blender.BUTTONS[1][x].monadRole='primary';
  for(const x of [3,4,5])blender.BUTTONS[3][x].monadRole='primary';
  for(const x of [6,7])blender.BUTTONS[5][x].monadRole='utility';
 }
 if(f14){
  style(f14,'DCS/F14 Radar & Navigation.tml','monad_f14_group_frames.png',[
   [0,0,4,1],[4,0,4,1],[8,0,2,1],[0,1,7,1],[7,1,3,1],
   [0,2,6,1],[6,2,4,1],[0,3,5,1],[5,3,5,1],
   [0,4,5,1],[5,4,3,1],[8,4,2,1],[0,5,5,1],[5,5,3,1],[8,5,2,1],
   [0,6,6,1],[6,6,4,1],[0,7,7,1],[7,7,3,1],[0,8,4,1],[4,8,4,1],[8,8,2,1]
  ]);
  f14.BUTTONS[0][0].monadRole='title';f14.BUTTONS[0][2].monadRole='status';
  for(const x of [0,1,2,3,4])f14.BUTTONS[1][x].monadRole='primary';
 }
 const layouts={
  'DCS/P-51D.tml':[[0,0,4,1],[4,0,4,1],[0,1,2,1],[2,1,3,1],[5,1,3,1],[0,2,2,1],[2,2,3,1],[5,2,2,1],[7,2,1,1],[0,3,4,1],[4,3,4,1],[0,4,4,1],[4,4,2,1],[6,4,2,1],[0,5,2,1],[2,5,4,1]],
  'DCS/FC3 Main Panel.tml':[[0,0,3,1],[3,0,5,1],[8,0,4,1],[12,0,1,1],[0,1,2,7],[3,1,2,6],[5,2,2,1],[5,4,2,2],[5,6,3,2],[7,1,2,5],[9,1,2,5],[11,1,2,6],[8,7,3,1],[12,7,1,1]],
  'DCS/FC3 Navigation & Sensor Panel.tml':[[0,0,3,1],[3,0,5,1],[8,0,4,1],[12,0,1,1],[0,1,2,7],[2,1,4,4],[7,1,2,5],[9,1,2,5],[11,1,2,6],[5,5,3,3],[2,6,3,2],[8,7,3,1],[12,7,1,1]],
  'DCS/F14.tml':[[0,0,3,1],[3,0,2,1],[5,0,3,3],[0,1,3,7],[3,2,2,2],[5,3,3,1],[3,4,5,2],[3,6,2,1],[3,7,2,1],[5,6,3,1],[6,7,1,1],[9,0,4,3],[9,3,1,2],[10,3,3,1],[10,4,3,1],[8,5,5,1],[8,6,5,2]]
 };
 for(const [file,groups] of Object.entries(layouts))if(pages[file]){
  const p=pages[file],name='monad_'+file.split('/').pop().replace(/[^a-z0-9]/gi,'_').toLowerCase()+'_groups.png';
  style(p,file,name,groups);
  for(const b of p.BUTTONS.flat())if(b.id&&b.A?.length)b.monadRole='secondary';
 }
};
