# TX16S layout and verification

Confirmed by the user: SB is flaps; SE is autopilot. SA is the gear/ground switch, SC mode/radar, SD armament, SF guns, SH weapon release. SF+SH stays unbound until its exact emergency purpose is chosen.

The existing F-15C and P-51D profiles agree on stick channels: pitch JOY_Y inverted, roll JOY_RX, rudder JOY_X, throttle JOY_Z inverted. Preserve their current filters, including the Mustang curves. The baseline has no F-14BU joystick profile, only keyboard overrides.

Before mapping switches, measure the USB outputs for each physical position. tools/read-radio.ps1 reads the Windows joystick values without sending input or changing the radio. Windows currently exposes one joystick with six axes and 24 buttons. A switch name must not be guessed from a JOY_BTN number. A radio model can change that correspondence.

The local TX16SMKII_2.0.pdf is a four-page quick-start. It identifies hardware but does not document this radio model's current EdgeTX mixer/USB channel assignments.

Use consistent physical directions across aircraft. Prefer gear down in the middle and gear up at the final position, with a dedicated ground function at the first position only after deciding between wheel braking and nosewheel steering. Keep gear commands explicit when the module supports them. P-51D has neither radar nor the requested modern autopilot modes; do not assign misleading equivalents.

F-14 LS/RS wing sweep and P-51 cooling are candidates pending channel measurement and cockpit behavior checks. A spring-centered or freely moving slider needs aircraft-specific range and direction verification before deployment.

Status: intended layout documented, existing axes backed up; switch bindings have not yet been changed.

Measured on 2026-10-26: SF up = Windows button 7, SF down = released. SH held = Windows button 8, SH released = released. These are physical observations, not guessed channel defaults. A combined SA/SB/SC/SD/SE run did not identify every position reliably: some movements preceded full axis recording. Final observed state included button 1 and two additional axis endpoints. Do not derive a full mapping from that incomplete trace. Requested firmware/model identification and USB Storage access to back up and inspect the radio model directly.
