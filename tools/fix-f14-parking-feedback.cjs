// Owner verified reversed parking-handle feedback in F-14 on 2026-11-18.
// Change presentation only; retain the BIOS toggle action and all other buttons.
module.exports = function fixParkingFeedback(page) {
  const state = 'mgdc_f-14_st_plt_park_brake';
  const buttons = page.BUTTONS.flat().filter(b => (b.E || []).some(e => e.kVSI === state));
  if (buttons.length !== 1) throw Error('Expected exactly one F-14 parking-brake button');
  const b = buttons[0];
  const pairs = {};
  for (let i = 0; i < b.E.length; i++) {
    const e = b.E[i];
    if (e.KEY_TYPE === 'PLUGIN_EVENT' && e.kVSI === state) {
      const v = b.E[i + 1];
      if (v?.KEY_TYPE !== 'CHANGE_BUTTON_VISUALS_ACTION') throw Error('Unexpected parking feedback');
      e.kID = 'mgdc_f-14_ev_plt_park_brake';
      delete e.kPID;
      pairs[e.kVal] = v;
    }
  }
  if (!pairs.ON || !pairs.OFF) throw Error('Missing parking handle states');
  // Raw OFF is SET; raw ON is RELEASED. Explicit labels avoid colour ambiguity.
  for (const [raw, label] of [['OFF', 'SET'], ['ON', 'RELEASED']]) {
    const v = pairs[raw];
    v.KEY_IS_CHANGE_TITLE = true;
    v.KEY_TITLE = 'Parking Brake\n' + label;
    v.KEY_IS_CHANGE_TEXT_COLOR = true;
    v.KEY_TEXT_COLOR = raw === 'OFF' ? -9523899 : -1117450;
    v.KEY_IS_CHANGE_BG_COLOR = true;
    v.KEY_START_COLOR = v.KEY_END_COLOR = raw === 'OFF' ? -14012102 : -14736341;
  }
  b.T = 'Parking Brake\nUNKNOWN';
  b.TC = -1117450;
  b.BG = b.BE = -14736341;
  return page;
};
