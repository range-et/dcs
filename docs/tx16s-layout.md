# TX16S layout and verification

Confirmed by the user: SB is flaps; SE is autopilot. SA is the gear/ground switch, SC mode/radar, SD armament, SF guns, SH weapon release. SF+SH stays unbound until its exact emergency purpose is chosen.

The existing F-15C and P-51D profiles agree on stick channels: pitch JOY_Y inverted, roll JOY_RX, rudder JOY_X, throttle JOY_Z inverted. Preserve their current filters, including the Mustang curves. The baseline has no F-14BU joystick profile, only keyboard overrides.

Before mapping switches, measure the USB outputs for each physical position. tools/read-radio.ps1 reads the Windows joystick values without sending input or changing the radio. Windows currently exposes one joystick with six axes and 24 buttons. A switch name must not be guessed from a JOY_BTN number. A radio model can change that correspondence.

The local TX16SMKII_2.0.pdf is a four-page quick-start. It identifies hardware but does not document this radio model's current EdgeTX mixer/USB channel assignments.

Use consistent physical directions across aircraft. Prefer gear down in the middle and gear up at the final position, with a dedicated ground function at the first position only after deciding between wheel braking and nosewheel steering. Keep gear commands explicit when the module supports them. P-51D has neither radar nor the requested modern autopilot modes; do not assign misleading equivalents.

F-14 LS/RS wing sweep and P-51 cooling are candidates pending channel measurement and cockpit behavior checks. A spring-centered or freely moving slider needs aircraft-specific range and direction verification before deployment.

Status: original radio models and settings are backed up under backups/tx16s/20261026 with a SHA-256 manifest. A separate DCS Cockpit model was derived from Sim CABEL; the original model, stick mixers, trims and calibration were preserved. The user selected DCS Cockpit manually. DCS switch bindings have not yet been changed.

Measured on 2026-10-26: SF up = Windows button 7, SF down = released. SH held = Windows button 8, SH released = released. These are physical observations, not guessed channel defaults. A combined SA/SB/SC/SD/SE run did not identify every position reliably: some movements preceded full axis recording. Final observed state included button 1 and two additional axis endpoints. Do not derive a full mapping from that incomplete trace. Requested firmware/model identification and USB Storage access to back up and inspect the radio model directly.

The radio settings report EdgeTX model format 2.12.4; the SD package reports 2.12.3. Advanced USB mapping in config/radio/model7.yml preserves X/Y/Z/RX for the four existing stick axes and exposes RS on RY and LS on RZ. Three-position switches now have one USB button per position. Windows and joy.cpl report six axes and 17 buttons after reconnecting.

| Switch | UP | MIDDLE | DOWN | Physical check so far |
|---|---:|---:|---:|---|
| SA | 3 | 2 | 1 | All three observed separately |
| SB | 6 | 5 | 4 | UP and MIDDLE observed; DOWN pending |
| SC | 11 | 10 | 9 | UP and MIDDLE observed; DOWN pending |
| SD | 14 | 13 | 12 | UP and MIDDLE observed; DOWN pending |
| SE | 17 | 16 | 15 | UP and DOWN observed; MIDDLE pending |
| SF | 7 | — | released | Original profile measured; advanced mapping recheck pending |
| SH | 8 when pulled | — | released | Original profile measured; advanced mapping recheck pending |

The first new model file used AXIS/BUTTON enum names, which the radio did not accept. The file was corrected to CH_AXIS/CH_BUTTON after inspecting the EdgeTX YAML serializer; the first loaded version is retained in ignored work/radio-model7-first-load.yml. Corrected deployed model SHA-256: D1865CC8DDE62C4F6DBB7E13E8A30697D202EE498936E301FA514D9AC8C18EF5. The subsequent six-axis/17-button measurement confirms the corrected USB format loaded.

To undo the radio model change, select the original Sim CABEL model. Do not restore the whole global radio.yml just to change the model: that could overwrite later radio preferences. Original complete files are retained for recovery if necessary.
