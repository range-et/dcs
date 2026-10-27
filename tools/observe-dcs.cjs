// Passive TCP observation only: no commands are sent to the simulator.
const fs=require('fs'),net=require('net'),path=require('path');
const root=path.resolve(__dirname,'..');
const selected=process.argv.slice(2);const memory=Buffer.alloc(65536),seen=Buffer.alloc(65536);let pending=Buffer.alloc(0),bytes=0,records=0;
const controls={};
for(const file of ['MetadataStart','FC3','F-14','P-51D','CommonData']){
 const doc=JSON.parse(fs.readFileSync(path.join(root,'baseline/dcs/Scripts/DCS-BIOS/doc/json',file+'.json'),'utf8'));
 for(const group of Object.values(doc))for(const [id,control] of Object.entries(group))controls[id]=control;
}
const tcp=net.connect(7778,'127.0.0.1');
tcp.on('error',e=>{console.error(e.message);process.exitCode=1});
tcp.on('data',chunk=>{bytes+=chunk.length;pending=Buffer.concat([pending,chunk]);while(pending.length>=4){
 if(pending.readUInt32LE(0)===0x55555555){pending=pending.subarray(4);continue;}
 const address=pending.readUInt16LE(0),count=pending.readUInt16LE(2);if(address+count>65536)throw Error('Invalid BIOS record');
 if(pending.length<4+count)break;pending.copy(memory,address,4,4+count);seen.fill(1,address,address+count);pending=pending.subarray(4+count);records++;
}});
setTimeout(()=>{tcp.destroy();const values={};for(const id of selected){const control=controls[id];if(!control){values[id]='unknown control';continue;}if(!bytes){values[id]='no data received';continue;}values[id]=control.outputs.map(o=>!seen[o.address]?'not observed in this interval':o.type==='string'?memory.toString('utf8',o.address,o.address+o.max_length).split('\0')[0]:(memory.readUInt16LE(o.address)&o.mask)>>o.shift_by);}
 console.log(JSON.stringify({aircraft:memory.toString('ascii',0,24).split('\0')[0],bytes,records,values},null,2));},6000);
