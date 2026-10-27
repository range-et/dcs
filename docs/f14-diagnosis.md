# F-14 recognition and page repair

The baseline page contains six invalid references in the old mgdc_f-14b namespace. The installed entry.tp declares mgdc_f-14 instead. Its ONLINE event additionally watches OFF. Both page defects are corrected by the reproducible page builder.

The installed F14BU/entry.lua registers the upgraded aircraft as F-14BU. The baseline aircraftModules.cfg and DCS-BIOS F-14 module list omit that aircraft name. config/ contains the narrow alias additions plus the corresponding aircraft-model choice in entry.tp. AircraftList.lua also lists the upgraded aircraft as clickable.

Upstream DCS-BIOS now lists F-14BU in its F-14 module too:
https://raw.githubusercontent.com/DCS-Skunkworks/dcs-bios/master/Scripts/DCS-BIOS/lib/modules/aircraft_modules/F-14.lua

This is an alias backport to the existing module, not a full upgrade to the newer upstream module. The F14BU cockpit loads the base device_init.lua and overrides selected systems. Basic shared pilot controls must be tested, and upgraded HUD/radio-specific features must not be assumed compatible. The baseline F-14 module uses older indication indexes; retain that limitation when evaluating radio/HSD display exports.

Deployed files: F-14.lua, AircraftList.lua, aircraftModules.cfg, entry.tp, and themed pages. BIOSStateMachine.lua remains byte-identical to the user's working baseline.

Rollback: close the mission and Touch Portal, restore the four files above and affected page files from baseline/, then restart. Do not restore an older state machine.

Live validation on 2026-10-26: a passive TCP capture identifies F-14BU and contains aircraft records. The user confirmed that the iPad shows ONLINE, tapping PARKING BRAKE moves the cockpit handle, and the button label stays visible. This verifies a basic pilot-control round trip; it does not verify every F-14 control or the upgraded radio/HUD exports.

The F-14 export log also reports negative AOA, fuel-digit and mirror values outside the older module's declared ranges while cold. Those individual readings can be rejected. They are a separate compatibility limitation and were not addressed by changing the user's state machine or export rate.

## Separate radar and navigation page

The F-14 flight page now links to F14 Radar & Navigation. The new page contains radar search/track modes, DDD ranges, scan width/bars, TID range/modes and display options, pilot steering/HSD modes, heading/course steps, TACAN channel/mode, and radio preset controls. Flight Controls and Home provide return navigation. Radar/TID controls are RIO functions and may interact with Jester's operation.

The builder validates action choices and event/state identifiers against the installed plugin schema. Four existing preset/TACAN actions now expose INC/DEC choices already supported by the installed BIOS fixed-step inputs. No executable or export-rate changes were required. All six pages passed the plugin-reference audit. The desktop preview displayed complete labels; aircraft operation and active-state readouts on this new page still require live testing, especially for F-14BU compatibility.

Page and plugin-entry backups and exact hashes are recorded under docs/deployments. The Mustang-to-F-14 shortcut was removed at the user's request from both the builder and deployed Mustang page; Home remains its only page-navigation action.
