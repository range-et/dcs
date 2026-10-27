# TX16S layout and verification

Confirmed by the user: SB is flaps; SE is autopilot. SA is the gear/ground switch, SC mode/radar, SD armament, SF guns, SH weapon release. SF+SH stays unbound until its exact emergency purpose is chosen.

Current refinement: 7 USB axes / 26 buttons, deployed after the user selected USB Storage. See the final section below; it supersedes the historical initial mapping. The model image is now assets/radio/dcs.png, an original Monad vector badge exported at the same 192x114 dimensions as the previous image. The original Sim CABEL model and edge.jpg image were not changed.

The existing F-15C and P-51D profiles agree on stick channels: pitch JOY_Y inverted, roll JOY_RX, rudder JOY_X, throttle JOY_Z inverted. Preserve their current filters, including the Mustang curves. The baseline has no F-14BU joystick profile, only keyboard overrides.

Before mapping switches, measure the USB outputs for each physical position. tools/read-radio.ps1 reads the Windows joystick values without sending input or changing the radio. The original profile exposed six WinMM axes and 24 buttons; the DCS Cockpit profile exposes six axes and 17 buttons. A switch name must not be guessed from a JOY_BTN number. A radio model can change that correspondence.

The local TX16SMKII_2.0.pdf is a four-page quick-start. It identifies hardware but does not document this radio model's current EdgeTX mixer/USB channel assignments.

Use consistent physical directions across aircraft. Prefer gear down in the middle and gear up at the final position, with a dedicated ground function at the first position only after deciding between wheel braking and nosewheel steering. Keep gear commands explicit when the module supports them. P-51D has neither radar nor the requested modern autopilot modes; do not assign misleading equivalents.

F-14 LS/RS wing sweep and P-51 cooling are candidates pending channel measurement and cockpit behavior checks. A spring-centered or freely moving slider needs aircraft-specific range and direction verification before deployment.

Status: original radio models and settings are backed up under backups/tx16s/20261026 with a SHA-256 manifest. A separate DCS Cockpit model was derived from Sim CABEL; the original model, stick mixers, trims and calibration were preserved. The user selected DCS Cockpit manually. Initial native DCS bindings were deployed while DCS was closed, with previous files retained under local_archives/input-deployments/20261026-212443. Exact targets/hashes are recorded in docs/deployments/inputs-20261026-212443.json. In-game verification is pending.

Measured on 2026-10-26: SF up = Windows button 7, SF down = released. SH held = Windows button 8, SH released = released. These are physical observations, not guessed channel defaults. A combined SA/SB/SC/SD/SE run did not identify every position reliably: some movements preceded full axis recording. Final observed state included button 1 and two additional axis endpoints. Do not derive a full mapping from that incomplete trace. Requested firmware/model identification and USB Storage access to back up and inspect the radio model directly.

The radio settings report EdgeTX model format 2.12.4; the SD package reports 2.12.3. Advanced USB mapping in config/radio/model7.yml preserves X/Y/Z/RX for the four existing stick axes and exposes RS on RY and LS on RZ. Three-position switches now have one USB button per position. Windows and joy.cpl report six axes and 17 buttons after reconnecting.

| Switch | UP | MIDDLE | DOWN | Physical check so far |
|---|---:|---:|---:|---|
| SA | 3 | 2 | 1 | All three observed separately |
| SB | 6 | 5 | 4 | All three observed |
| SC | 11 | 10 | 9 | All three observed |
| SD | 14 | 13 | 12 | All three observed |
| SE | 17 | 16 | 15 | All three observed |
| SF | 7 when active | — | released | Pressed and released observed in advanced profile; verify physical direction before flight |
| SH | 8 when pulled | — | released | Pulled and released observed in advanced profile |

The first new model file used AXIS/BUTTON enum names, which the radio did not accept. The file was corrected to CH_AXIS/CH_BUTTON after inspecting the EdgeTX YAML serializer; the first loaded version is retained in ignored work/radio-model7-first-load.yml. Corrected deployed model SHA-256: D1865CC8DDE62C4F6DBB7E13E8A30697D202EE498936E301FA514D9AC8C18EF5. The subsequent six-axis/17-button measurement confirms the corrected USB format loaded.

To undo the radio model change, select the original Sim CABEL model. Do not restore the whole global radio.yml just to change the model: that could overwrite later radio preferences. Original complete files are retained for recovery if necessary.

Both side sliders reached full forward (WinMM r/u = 65535) and full back (r/u = 0). WinMM r/u/v field names must not be confused with DirectInput RX/RY/RZ. The radio's configured destinations are LS -> RZ, RS -> RY. Neither slider has an aircraft binding yet.

## Initial deployed aircraft bindings

All profiles retain the existing F-15C/P-51D axis blocks verbatim. New F-14B and F-14BU profiles use the F-15C's four flight axes. Native command IDs and hashes are recorded in docs/input-command-manifest.json; tools/prepare-inputs.cjs rebuilds the profiles. The hash format comes from the installed Scripts/Input/Utils.lua. DCS's applyDiffToCommands_ removes default combinations mentioned in a custom diff, preventing the default button 1/2/3 actions from remaining on the new gear/brake positions.

| Control | F-15C | P-51D | F-14B / F-14BU |
|---|---|---|---|
| SA UP / MIDDLE / DOWN | Wheel brakes while UP / gear down / gear up | Same | Same |
| SB UP / DOWN | Flaps up / landing | Flaps up / down | Flaps up / down |
| SB MIDDLE | Holds previous position; unbound | Unbound; use Touch Portal for 20 DEG | Unbound |
| SC UP / MIDDLE / DOWN | BVR / vertical scan / boresight | Fixed / fixed+gyro / gyro gunsight | Cruise / air-to-air / air-to-ground display mode |
| SD UP / MIDDLE / DOWN | Cannon / next weapon / unbound | Guns safe / gun+camera+sight / camera+sight | Gun / Sparrow-or-Phoenix / Sidewinder |
| SE UP / MIDDLE / DOWN | Disengage / altitude hold / attitude hold | Unbound: no autopilot | UP disengages; middle/down remain pending |
| SF | Gun/weapon fire | Gun fire | Aircraft trigger, weapon selected by SD |
| SH | Weapon release | Weapon release | Same aircraft trigger, weapon selected by SD |

These are initial bindings, not a claim that every requested function is finished. F-15C attitude hold is not heading-plus-altitude hold. The F-14 uses one trigger for guns/missiles: both SF and SH are trigger inputs, so leave SF released when using SH for missiles. F-14 radar belongs primarily to the RIO/Jester; SC currently selects pilot display modes. Full F-14 SE sequencing, three-position flap targets, F-15 weapon-selection refinements and LS/RS roles remain to be completed and flight-tested. No combined SF+SH emergency action was assigned.

## Live checks after deployment

With the P-51D Take Off Batumi sample running, the user cycled SA MIDDLE -> UP and confirmed the brake held, including during a high-throttle check. The first attempt had rolled off the runway and crashed before that held-switch behavior was verified. The restarted sample exported roughly 1,640 RPM and 1,070 PSI of hydraulic pressure, then continued running during the user's manual flight (188 knots / 4,950 feet observed, later about 2,960 RPM / 1,040 PSI). Do not count that as verification of every switch or flap travel.

The saved DCS miscellaneous.synchronize_controls option is currently false. tools/set-input-sync.ps1 previews a change to true and requires DCS to be closed before applying it. It backs up the exact previous options.lua and records hashes. This change is prepared, not applied. Its purpose is to pick up the physical HOTAS positions at mission start; the ground/air-start switch positions must be set appropriately before loading. The [official DCS user manual](https://www.digitalcombatsimulator.com/upload/iblock/ed6/87v22jwd1xh51i3rgki944xsf503istq/DCS_User_Manual_EN_2020.pdf) documents the synchronization option. Its behavior still needs a fresh-load check on this installation.

## Refined profile, awaiting reconnect test

USB reconnect verification: the actual 19-byte HID report contains all seven axes and 26 buttons. Physical LS forward / RS back produced RZ=2048 / RY=0, confirming the existing slider assignments. SG toward the antenna produced neutral button 26. With SB, SE and SG in MIDDLE, the report contained flap slider=819, SE buttons 18+19, and SG button 25. Those checks passed; refined in-game behavior remains pending.

With SB, SE and SG fully toward the user (DOWN), the report contained flap slider=2048, SB button 4, SE buttons 15+18+19+20 and SG button 24. This also passed. UP means away from the user, toward the antenna; DOWN means toward the user. Page navigation was confirmed on the iPad: Mustang has Home only and F-14 has Radar/Nav.

The user confirmed the four flight axes and responsive ONLINE iPad operation in flight, followed by successful shutdown/OFFLINE. After DCS exited, synchronize_controls was enabled; docs/deployments/input-sync-20261026-214904.json records the exact previous options.lua backup and hashes. The earlier paragraph describes the pre-change state.

The model loaded from the radio after the flight is preserved under backups/tx16s/20261026-refinement, including its current trims and original 17 mixer entries. tools/refine-radio.py extends that snapshot; all four inputs, flight-mode trims and the 17 existing mixers are asserted unchanged. The first 17 USB buttons and the existing six axes retain their assignments. SG and auxiliary virtual channels extend the descriptor to seven axes and 26 buttons. The [EdgeTX 2.12 USB implementation](https://github.com/EdgeTX/edgetx/blob/2.12/radio/src/usb_joystick.cpp) documents the button threshold/quantization used here.

| Physical control | Refined role |
|---|---|
| SG UP / MIDDLE / DOWN | Neutral / communications menu / F-14 Jester menu; DOWN unbound in F-15C and P-51D |
| SE, F-14 UP / MIDDLE / DOWN | AP off / engage + altitude hold / keep altitude + heading hold; cockpit AFCS prerequisites still apply |
| SB, P-51D UP / MIDDLE / DOWN | Dedicated slider axis targets UP / 20 DEG / DOWN; endpoint/direction check pending |
| LS, P-51D | Propeller-RPM setting; forward intended as maximum; direction check pending |
| RS, P-51D BACK / MIDDLE / FORWARD | Coolant CLOSE / AUTO / OPEN; open cooling covers first; oil remains controlled by the iPad AUTO button |
| RS, F-14 BACK / MIDDLE / FORWARD | Normal wing sweep AFT / AUTO / FORWARD buttons; uses no emergency sweep lever or oversweep axis |

SE adds virtual buttons 18/19/20: none in UP, 18+19 in MIDDLE, and 18+19+20 in DOWN. These let separate native F-14 commands remain held together without assigning one joystick button to multiple DCS actions. RS uses buttons 21/22/23; SG UP/MIDDLE/DOWN uses 26/25/24. The extra SB axis uses JOY_SLIDER1. F-15C SE remains OFF / altitude hold / attitude hold because its native profile does not expose the requested combined heading-plus-altitude command. F-15C SD DOWN remains unbound; missile-type selection still uses its native next-weapon action in MIDDLE.

The badge source is assets/radio/dcs.svg; tools/build-radio-badge.py exports the PNG. Only G:/MODELS/model7.yml and G:/IMAGES/dcs.png were written to the radio. tools/deploy-radio.ps1 verifies the ICARUS_DATA volume, model name and copied hashes, retaining the previous model locally. Deployment records radio-20261026-215558.json and inputs-20261026-215630.json identify the live refinements. These additions are not yet marked tested.

For the next parked test: SA/SB/SC/SD/SE/SG UP, SF released, SH released, throttle idle, LS forward and RS MIDDLE (AUTO). Ground-start and air-start gear/brake positions differ; set them for the mission before loading now that startup sync is enabled. Check the descriptor, SG menus, Mustang SB detents/LS/RS and F-14 SE/RS before considering the refinements complete.

End-of-day flight comparison: the user reported the F-15C was fine after loading Marianas Hotstart with this radio. That is a general handling check, not individual verification of all switch bindings. F-14 runway skidding/spinning remains unresolved. All four deployed radio input files (F-15C, P-51D, F-14B and F-14BU) matched their repository copies at the closing checkpoint. No control-profile changes were made during these runway attempts.
