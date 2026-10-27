// Passive, bounded TCP trace. No simulator commands are sent.
const fs=require('fs'),net=require('net'),path=require('path');
const seconds=Number(process.argv[2]||45);if(!(seconds>0&&seconds<=120))throw Error('Duration must be 1..120 seconds');
const ids=process.argv.slice(3),controls={};
for(const name of ['MetadataStart','FC3','F-14','P-51D','CommonData'])for(const group of Object.values(JSON.parse(fs.readFileSync(path.join(__dirname,'../baseline/dcs/Scripts/DCS-BIOS/doc/json',name+'.json')))))Object.assign(controls,group);
for(const id of ids)if(!controls[id])throw Error('Unknown control '+id);
const memory=Buffer.alloc(65536),seen=Buffer.alloc(65536),previous={};let pending=Buffer.alloc(0);
const socket=net.connect(7778,'127.0.0.1');socket.on('error',e=>{console.error(e.message);process.exitCode=1});
function snapshot(){for(const id of ids){const outputs=controls[id].outputs;if(outputs.some(o=>!seen[o.address]))continue;
 const values=outputs.map(o=>o.type==='string'?memory.toString('ascii',o.address,o.address+o.max_length).split('\0')[0]:(memory.readUInt16LE(o.address)&o.mask)>>o.shift_by);
 const text=JSON.stringify(values);if(previous[id]!==text){previous[id]=text;console.log(JSON.stringify({time:new Date().toISOString(),id,values}));}
}}
socket.on('data',chunk=>{pending=Buffer.concat([pending,chunk]);while(pending.length>=4){
 if(pending.readUInt32LE(0)===0x55555555){pending=pending.subarray(4);snapshot();continue;}
 const a=pending.readUInt16LE(0),n=pending.readUInt16LE(2);if(a+n>65536)throw Error('Invalid BIOS record');if(pending.length<4+n)break;
 pending.copy(memory,a,4,4+n);seen.fill(1,a,a+n);pending=pending.subarray(4+n);
}});
setTimeout(()=>{snapshot();socket.destroy();console.log('Trace complete.');},seconds*1000);
