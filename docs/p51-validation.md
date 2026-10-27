# P-51D page validation

The new page uses the installed DCS-COINS P-51D actions and states. The page-reference audit reports no missing IDs. The P-51D cold-start sample at Vaziani was loaded on 2026-10-26; passive DCS-BIOS TCP data identifies P-51D and includes aircraft records.

The cold-start gear-down handle exports LANDING_GEAR_CONTR0L_HANDLE = 0. The editable page therefore uses [0] OFF for DOWN and [1] ON for UP; OFF/ON are the plugin's numeric choice names, not labels describing gear position. The initial draft had these two explicit actions reversed and was corrected before the gear test.

FLAPS_CONTROL_HANDLE is exported as a potentiometer, but the cockpit handle has six detents at 0.2 intervals. The revised page uses 65535, 39321 and 0 for UP, 20 DEG and DOWN. The ambiguous HALF command at 32767 was removed. A local UDP probe for 39321 independently returned FLAPS_CONTROL_HANDLE = 39321. COOLANT/OIL AUTO use enum 2. Cooling covers must open first. A local probe opened both covers and their exported bits became 1. Radio channel and brake-handle commands have a release after the press.

The older P-51D module reports ALTIMETER_VALUE above the 16-bit allocation limit during the cold-start sample. This page uses CommonData altitude in feet instead of that faulty field. The underlying legacy gauge export is not repaired by the page. BIOSStateMachine.lua is unchanged.

The user confirmed ONLINE and battery/generator ON feedback before and after the readability restart, with complete readable labels. A subsequent passive capture independently observed BAT = 1 and GEN = 1. The native preview also shows the revised labels fitting their cells without mid-word wrapping.

The first mobile flap/cooling test failed according to the user. Do not count the direct API probes as a passing mobile test. The revised flap buttons now highlight their actual exported detent; cooling buttons highlight enum 2. The final build was deployed with hashes recorded under docs/deployments, and a new mobile retest was requested.

Pending: revised mobile flap/cooling test; shutdown status. An ONLINE indicator alone is not a complete validation.
