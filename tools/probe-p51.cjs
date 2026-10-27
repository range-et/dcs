// Controlled local DCS-BIOS probe, only for the parked P-51D systems test.
// Pass one of the fixed cases; no arbitrary simulator command is accepted.
const cases={
 flaps_up:['FLAPS_CONTROL_HANDLE 65535'],
 flaps_20:['FLAPS_CONTROL_HANDLE 39321'],
 covers_open:['COOLANT_CONTROL_COVER 1','OIL_CONTROL_COVER 1'],
 cooling_auto:['COOLANT_CONTROL 2','OIL_CONTROL 2']
};
const chosen=cases[process.argv[2]];if(!chosen)throw Error('Choose flaps_up, flaps_20, covers_open, or cooling_auto');
process.argv=['node','observe-dcs.cjs','FLAPS_CONTROL_HANDLE','COOLANT_CONTROL','OIL_CONTROL','COOLANT_CONTROL_COVER','OIL_CONTROL_COVER'];
require('./observe-dcs.cjs');
const udp=require('dgram').createSocket('udp4');
setTimeout(()=>udp.send(chosen.join('\n')+'\n',7778,'127.0.0.1',err=>{udp.close();if(err)throw err;console.log('Sent local probe:',chosen.join('; '));}),500);
