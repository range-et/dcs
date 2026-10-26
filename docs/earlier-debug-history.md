# DCS-COINS diagnosis and changes

## Result
The Su-25T / FC3 sample passed the control-and-feedback check on 2026-10-25.

- DCS loaded and ran the included Su-25T Free Flight at Mineralnye Vody mission.
- Touch Portal showed one connected mobile device.
- Before the export fix, a three-second TCP capture from DCS-BIOS port 7778 contained 300 bytes consisting exclusively of 0x55 frame synchronization markers, with no cockpit data.
- After the fix and mission restart, a later capture contained 18,964 bytes, including 17,770 bytes other than synchronization markers and records in the FC3 address range. This confirms aircraft data export is running.
- The user confirmed the iPad panel was working and that tapping Ldg Gear changed both the aircraft's gear and the panel's gear icon. This is the verified round trip: iPad → Touch Portal keyboard action → DCS → DCS-BIOS → DCS-COINS → Touch Portal → iPad.
- This is a sample verification, not a test of every aircraft or every button.

## What was wrong

### Original ACJSON.cfg error
The executable was launched from the extracted Downloads staging folder. That folder lacked the generated ACJSON.cfg, while the .tpp package and the installed Touch Portal plugin contained it. The relative file lookup failed before startup completed. The .tpp is correctly installed through Touch Portal; the installed plugin folder is the relevant runtime directory.

Earlier in the chat, ACJSON.cfg was copied unchanged out of the .tpp into the Downloads staging folder to diagnose that standalone launch. This did not install or repair the Touch Portal plugin itself.

### FC3 feedback failure
The bundled DCS-BIOS 0.8.2 BIOSStateMachine.lua only ran module export hooks when GetDevice(0) was not nil. The Su-25T / FC3 case had no clickable cockpit device, so the getter-based aircraft and metadata hooks were skipped. The network connection existed, but it carried frame markers without the values that identify and update the aircraft. The iPad therefore lacked live feedback.

A narrowly scoped backport now permits FC3, CommonData, MetadataStart, and MetadataEnd hooks to run with an empty device table when the cockpit device is absent. The current upstream DCS-BIOS handles modules that do not require dev0 similarly:
https://github.com/DCS-Skunkworks/dcs-bios/blob/master/Scripts/DCS-BIOS/lib/BIOSStateMachine.lua
https://github.com/DCS-Skunkworks/dcs-bios/blob/master/Scripts/DCS-BIOS/lib/modules/aircraft_modules/FC3.lua

### Historical error
Touch Portal's existing log also recorded an earlier missing La7.json crash. The current ACJSON.cfg does not request that file; its configured aircraft are F-14, FC3, and P-51D plus common metadata. No La-7 file was added during this session.

## Persistent changes made by the assistant

1. Added C:\Users\range\Downloads\DCS-COINS_2024-10-16\DCS-COINS\Munt.G_DCS-COINS\ACJSON.cfg earlier in the chat. The file was copied from the sibling .tpp archive; it did not previously exist there.
2. Modified C:\Users\range\Saved Games\DCS\Scripts\DCS-BIOS\lib\BIOSStateMachine.lua, in queue_module_data, to permit the four getter-based modules listed above when dev0 is nil.

The installed Touch Portal ACJSON.cfg, DCS-COINS.cfg, entry.tp, and three DCS sample page files were not manually edited. Hash checks before the export fix confirmed they matched the session-start backups. No controls or mission files were edited.

## Other session actions

- Toggled the existing DCS-COINS integration off and back on, leaving it enabled.
- Closed and reopened Touch Portal to reload its plugin; the user reconnected the iPad afterward.
- Launched DCS and ran its included sample. The user restarted the mission after the Lua fix.
- The user handled DCS's Windows Firewall prompt; the assistant made no firewall/security setting change.
- A temporary verbose diagnostic process was stopped. The regular plugin launched by Touch Portal remains the intended running instance.
- Earlier restricted-shell process/socket checks were not reliable evidence that Touch Portal was closed. Those checks were superseded by direct UI and unrestricted local connection checks.

## Backups and reversal

Backups are in the sibling DCS-debug-backup folder:

- BIOSStateMachine.lua.original — exact pre-patch export file.
- Export.lua.original — original DCS export loader, which was not edited.
- TouchPortal/ — session-start copies of config.properties, values.tp, flows.dat, plugins/, pages/, and buttons/ where present.

To reverse the export fix, leave the mission or close DCS, copy DCS-debug-backup\BIOSStateMachine.lua.original over C:\Users\range\Saved Games\DCS\Scripts\DCS-BIOS\lib\BIOSStateMachine.lua, and reload the mission. This restores the previous behavior, including the FC3 feedback failure.

To reverse the earlier staging-folder diagnostic addition, remove only C:\Users\range\Downloads\DCS-COINS_2024-10-16\DCS-COINS\Munt.G_DCS-COINS\ACJSON.cfg. Do not remove the installed Touch Portal plugin's ACJSON.cfg.

The TouchPortal/ backup is available if needed; restoring the entire directory is unnecessary for the small Lua fix and could overwrite later user changes.

## Remaining limitation observed
After the export hooks began running, DCS-BIOS.log recorded out-of-range warnings for FC3_ADI_YAW and CommonData HDG_DEG. The bundled float encoding expects a smaller range than some reported yaw values; heading can exceed 360 degrees. MemoryAllocation rejects those particular out-of-range values, so these specific readings may be stale or missing, and warnings can grow the log during flight. The tested gear control and feedback worked. These additional range issues were not modified in this session.

A future DCS-COINS setup run or DCS-BIOS reinstall may overwrite the local export fix. Keep this report and the backup if that happens.
## Shutdown status follow-up
- Confirmed DCS.exe was no longer running while the iPad still showed ONLINE.
- Reproduced the issue using the actual parser code extracted locally from the installed executable. Its pending event queue is emitted only on the next 0x5555 frame marker. The final empty aircraft record at shutdown was queued after the last marker and never emitted.
- Added one trailing frame_sync_sequence to BIOSStateMachine:shutdown immediately before send_queue, so the final disconnect update is emitted before sockets close.
- Saved the pre-shutdown-fix version, which includes the earlier FC3 fix, as DCS-debug-backup\BIOSStateMachine.lua.before-shutdown-fix. To undo only this follow-up, close DCS and copy that version over the installed BIOSStateMachine.lua. BIOSStateMachine.lua.original still reverses both fixes.
- Local regression check passed: the original shutdown packet emits no disconnect; adding the trailing marker emits an empty aircraft immediately.
- Sending a standalone frame marker to the running local plugin is a transient diagnostic; it changes no file and should flush the real shutdown update already waiting in its queue.
- The persistent shutdown change will load on the next mission start. Normal mission exit is covered; abrupt process termination may bypass DCS's shutdown callback.


### Shutdown verification result
The user confirmed that sending only the missing final marker changed the iPad aircraft indicator from ONLINE to OFFLINE while DCS remained closed. This live result matches the regression reproduction and validates the cause. The persistent shutdown marker is saved for subsequent missions; a second full DCS launch-and-exit cycle was not performed during this follow-up.


## F-15C follow-up after reboot
- Confirmed DCS is running the F-15C and that both raw TCP export and the actual UDP parser receive F-15C data. The earlier Lua fixes remain present on disk.
- The installed entry.tp, ACJSON.cfg, FC3 Main Panel.tml, and FC3 Navigation & Sensor Panel.tml exactly match their session-start backup hashes. All main-panel action, event, and connector definitions match the original backup.
- Read-only process-token inspection found DCS, DCS-COINS, TouchPortal, and TouchPortalServices all at the same Medium integrity level; there is no administrator-level mismatch.
- Direct Touch Portal UI inspection showed Device Not Connected with a red indicator. The user has been asked to reconnect the iPad and repeat the test. No app configuration or Lua changes were made during this follow-up.


### F-15C follow-up resolution
The user reconnected the iPad after the desktop had shown Device Not Connected, then confirmed that the panel worked with DCS in the foreground. This occurrence was resolved by restoring the iPad-to-PC connection. No additional plugin, panel, or DCS-BIOS edits were required.


### Correction and fresh startup
The user clarified that the iPad page reconnected but its buttons still did nothing. The previous resolution entry was premature: button operation remains unresolved. No panel action edits were saved. At the fresh-start check DCS was already closed; TrackIR5, Touch Portal, TouchPortalServices, and the normal installed DCS-COINS plugin were running.


Fresh startup: reconnected iPad and verified green 1 connected device(s) on desktop plus established TCP connection. TrackIR was running before DCS launch. Launched DCS through its existing launcher and loaded F-15C Marianas Cold and Dark. Passive 8-second trace received 13,352 TCP bytes / 1,192 records and 197 UDP updates; both paths identify F-15C. Awaiting separate mobile F2 test. No configuration, panel, or Lua changes made during fresh startup.


## Button-latency follow-up
User reports delayed iPad buttons. PC-to-iPad ping: 12/12 replies, 0% loss, 3 ms minimum, 103 ms maximum, 26 ms average. This shows jitter but does not establish multi-second delay. Touch Portal log recorded three Button State DOWN failures at 21:29:56 with empty page identifier and Page does not exist. Desktop then showed Device Not Connected again. Fully shut down Touch Portal through Quick Actions, verified TouchPortal/TouchPortalServices/DCS-COINS processes exited, and relaunched existing desktop app. New service/plugin processes started and desktop returned to green one connected device. DCS left running. No saved configuration, panel, Lua, or security settings changed. Awaiting latency retest after full mobile restart.


## Persistent disconnect investigation
Restart did not stabilize iPad. Log at 21:37:25 repeats empty-page Button State DOWN failures, followed by main/FC3 page navigation. Port remains 12135; desktop Connection Handler is Reject incoming connection. Existing Connection, Actions, and Pages diagnostic categories already enabled. Temporarily enabled previously unchecked MultipleConnection log category for diagnosis; turn it off in Logs to reverse. DCS is no longer open at this check. Awaiting iPad version, foreground-disconnect behavior, and other-device information.


### Isolated connection check
DCS remains closed. At 21:47:13, MultipleConnection logging captured one successful iPad Wi-Fi handshake from 10.88.111.19 followed by main-page refresh. TCP sampling saw the same established session and no state transitions during the observation (more than one minute elapsed since handshake). No competing device attempt logged in that interval. Ethernet error/discard counters all zero. Requested iPad version/address/port and a main-to-FC3-to-main navigation check. No new saved settings or file changes except this report.


### Isolated navigation result
User reports iPad Touch Portal 4.7.1, port 12135, and prompt main/FC3 navigation with DCS closed. Desktop is 4.7, so reported major/minor versions and port match. MultipleConnection log confirms page data sent for those transitions without another handshake or empty-page error during the test. Proceeding to compare with live DCS data; this does not yet establish the cause of earlier disconnects.

