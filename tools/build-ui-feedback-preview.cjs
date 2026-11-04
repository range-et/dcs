// Offline visual fixture only: longest native feedback titles; no plugin/keyboard actions.
const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const p=JSON.parse(fs.readFileSync(path.join(root,'pages/DCS/F14 Radar & Navigation.tml')));
p.KEY_ID='ui-qa-feedback-only';p.KEY_TITLE='UI QA Feedback';
for(const b of p.BUTTONS.flat())if(b.id){
 const visuals=['A','E','C'].flatMap(k=>b[k]||[]).filter(a=>a.KEY_TYPE==='CHANGE_BUTTON_VISUALS_ACTION'&&a.KEY_TITLE);
 visuals.sort((a,c)=>c.KEY_TITLE.split('\n').length-a.KEY_TITLE.split('\n').length||c.KEY_TITLE.length-a.KEY_TITLE.length);
 if(visuals[0]){const v=visuals[0];b.T=v.KEY_TITLE;if(v.KEY_IS_CHANGE_BG_COLOR){b.BG=v.KEY_START_COLOR;b.BE=v.KEY_END_COLOR;}if(v.KEY_IS_CHANGE_TEXT_COLOR)b.TC=v.KEY_TEXT_COLOR;}
 b.id='qa_'+b.id;b.A=[];b.E=[];b.C=[];
}
fs.mkdirSync(path.join(root,'work/ui-review'),{recursive:true});
fs.writeFileSync(path.join(root,'work/ui-review/UI QA Feedback.tml'),JSON.stringify(p,null,2));
console.log('Built offline feedback fixture; no live commands or state claims.');
