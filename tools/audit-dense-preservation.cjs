// Compare dense UI changes with the pre-layout snapshot; ignore visual actions only.
const fs=require('fs'),path=require('path'),assert=require('assert/strict'),cp=require('child_process');
const root=path.resolve(__dirname,'..');
const pairs=[['blender','../blender_touchportal/pages/Blender/Viewpad.tml',47],['f14','pages/DCS/F14 Radar & Navigation.tml',79]];
const commands=b=>JSON.stringify(['A','E','C'].map(k=>(b[k]||[]).filter(a=>a.KEY_TYPE!=='CHANGE_BUTTON_VISUALS_ACTION')));
for(const [name,file,count] of pairs){
 const before=JSON.parse(name==='f14'?cp.execFileSync('git',['show','adca3dc:pages/DCS/F14 Radar & Navigation.tml'],{cwd:root,encoding:'utf8'}):fs.readFileSync(path.join(root,'../blender_touchportal/config/validation-baseline.json')));
 const after=JSON.parse(fs.readFileSync(path.resolve(root,file)));
 assert.equal(after.KEY_COLUMNS,before.KEY_COLUMNS);assert.equal(after.KEY_ROWS,before.KEY_ROWS);
 assert.equal(after.BUTTONS.flat().filter(b=>b.id).length,count);
 for(let y=0;y<15;y++)for(let x=0;x<15;x++){
  const b=before.BUTTONS[y]?.[x];if(!b?.id)continue;const a=after.BUTTONS[y]?.[x];
  assert.equal(a?.id,b.id);assert.equal(a.COLS,b.COLS);assert.equal(a.ROWS,b.ROWS);assert.equal(commands(a),commands(b),b.T);
 }
 console.log(name+': '+count+' controls, positions, spans, commands and conditions preserved');
}
