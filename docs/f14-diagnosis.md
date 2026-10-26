# F-14 recognition and page repair

The baseline page contains six invalid references in the old mgdc_f-14b namespace. The installed entry.tp declares mgdc_f-14 instead. Its ONLINE event additionally watches OFF. Both page defects are corrected by the reproducible page builder.

The installed F14BU/entry.lua registers the upgraded aircraft as F-14BU. The baseline aircraftModules.cfg and DCS-BIOS F-14 module list omit that aircraft name. config/ contains the narrow alias additions plus the corresponding aircraft-model choice in entry.tp. AircraftList.lua also lists the upgraded aircraft as clickable.

Upstream DCS-BIOS now lists F-14BU in its F-14 module too:
https://raw.githubusercontent.com/DCS-Skunkworks/dcs-bios/master/Scripts/DCS-BIOS/lib/modules/aircraft_modules/F-14.lua

This is an alias backport to the existing module, not a full upgrade to the newer upstream module. The F14BU cockpit loads the base device_init.lua and overrides selected systems. Basic shared pilot controls must be tested, and upgraded HUD/radio-specific features must not be assumed compatible. The baseline F-14 module uses older indication indexes; retain that limitation when evaluating radio/HSD display exports.

Deployed files: F-14.lua, AircraftList.lua, aircraftModules.cfg, entry.tp, and themed pages. BIOSStateMachine.lua remains byte-identical to the user's working baseline.

Rollback: close the mission and Touch Portal, restore the four files above and affected page files from baseline/, then restart. Do not restore an older state machine.

Validation is pending live cockpit testing.
