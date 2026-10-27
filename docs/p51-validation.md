# P-51D page validation

The new page uses the installed DCS-COINS P-51D actions and states. The page-reference audit reports no missing IDs. The P-51D cold-start sample at Vaziani was loaded on 2026-10-26; passive DCS-BIOS TCP data identifies P-51D and includes aircraft records.

The cold-start gear-down handle exports LANDING_GEAR_CONTR0L_HANDLE = 0. The editable page therefore uses [0] OFF for DOWN and [1] ON for UP; OFF/ON are the plugin's numeric choice names, not labels describing gear position. The initial draft had these two explicit actions reversed and was corrected before the gear test.

FLAPS_CONTROL_HANDLE is exported as a potentiometer, but the cockpit handle has six detents at 0.2 intervals. The revised page uses 65535, 39321 and 0 for UP, 20 DEG and DOWN. The ambiguous HALF command at 32767 was removed. A local UDP probe for 39321 independently returned FLAPS_CONTROL_HANDLE = 39321. COOLANT/OIL AUTO use enum 2. Cooling covers must open first. A local probe opened both covers and their exported bits became 1. Radio channel and brake-handle commands have a release after the press.

The older P-51D module reports ALTIMETER_VALUE above the 16-bit allocation limit during the cold-start sample. This page uses CommonData altitude in feet instead of that faulty field. The underlying legacy gauge export is not repaired by the page. BIOSStateMachine.lua is unchanged.

The user confirmed ONLINE and battery/generator ON feedback before and after the readability restart, with complete readable labels. A subsequent passive capture independently observed BAT = 1 and GEN = 1. The native preview also shows the revised labels fitting their cells without mid-word wrapping.

The first mobile flap/cooling test failed according to the user. Do not count the direct API probes as a passing mobile test. The revised flap buttons now highlight their actual exported detent; cooling buttons highlight enum 2. The final build was deployed with hashes recorded under docs/deployments, and a new mobile retest was requested.

Follow-up tracing on 2026-10-26 confirmed that mobile FLAPS UP arrived as `mgdc_p-51d_ac_flaps_control_handle`, was forwarded as `FLAPS_CONTROL_HANDLE 65535`, and returned raw 65535 from DCS. The user then confirmed the cockpit handle was changing. The apparent failure included a page feedback bug: the theme pass replaced the newly generated numeric-selection colours with the default colour. The builder now preserves the Mustang's explicit event visuals and adds SELECTED to the matching label. After deployment 20261026-211301 and restart with the original installed DCS-COINS.exe, the user confirmed the flap SELECTED feedback works.

Touch Portal also logged invalid timer values for the new fractional-second release waits. Waits now use integer milliseconds, including the two inherited F-14 waits. This preserves their intended duration while avoiding fractional parsing. Radio-channel and brake release timing still needs a live retest.

A bounded cold-start attempt briefly produced ENGINE_RPM_VALUE = 1246 and hydraulic pressure. Later observation returned RPM = 0 and no pressure. Do not describe the engine as remaining running. The handle-position round trip is verified; actual hydraulic flap travel with a sustained running engine remains pending. Cooling feedback, timed releases and shutdown status also remain pending.

The diagnostic Node process used an extracted copy of the existing plugin with action logging. It was terminated when Touch Portal shut down; the restarted desktop launched its original installed DCS-COINS.exe. No replacement plugin runtime was installed. BIOSStateMachine.lua still matches the user's baseline SHA-256.
