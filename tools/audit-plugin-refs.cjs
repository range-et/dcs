const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const entry=JSON.parse(fs.readFileSync(path.join(root,'baseline/touchportal/plugins/Munt.G_DCS-COINS/entry.tp')));
const ids=new Set();
function collect(o){if(!o||typeof o!=='object')return;if(o.id)ids.add(o.id);for(const v of Object.values(o))if(typeof v==='object')collect(v);}
collect(entry);
const pages=process.argv[2]||'baseline/touchportal/pages';
function walk(dir){for(const f of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,f.name);if(f.isDirectory())walk(p);else if(f.name.endsWith('.tml')){const missing=new Set();function check(o){if(typeof o==='string'){for(const m of o.matchAll(/mgdc_[a-zA-Z0-9_-]+/g))if(!ids.has(m[0]))missing.add(m[0]);}else if(o&&typeof o==='object')Object.values(o).forEach(check);}check(JSON.parse(fs.readFileSync(p)));console.log(path.relative(root,p), 'missing', missing.size,[...missing].slice(0,15));}}}
walk(path.resolve(root,pages));
