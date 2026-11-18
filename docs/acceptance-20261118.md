# Joint checks, 2026-11-18

The owner confirmed F-14 lighting, straight taxi after releasing the parking
brake, takeoff and basic airborne handling. Touch Portal parking-handle feedback
was reversed: its presentation now maps raw OFF to SET and raw ON to RELEASED.
The owner verified both-state feedback after deployment and DCS exited gracefully.
The toggle command is unchanged. Explicit labels replace colour-only indication.

P-51D pitch/roll/rudder, three flap positions, propeller lever direction, coolant
switch positions, landing-light feedback in both directions, takeoff and basic
airborne handling passed owner checks. The owner removed JOY_BTN1 from Gun fire
in DCS; saved-file readback confirmed that removal with JOY_BTN7 retained.
The generator now explicitly removes defaults 1/2 from fire/release so gear
switches do not retain those actions. Fresh-load conflict checking remains pending.

F-14 RS wing sweep remains unresolved despite correct HID button outputs and
owner-confirmed bindings. Emergency-handle engagement and sweep state require
further diagnosis. TrackIR F7 conflicts with a camera key; F1 cockpit/recenter
coexistence is intentional. Tablet reconnect testing remains outstanding.

Pre-merge checks: input generator completed; radio refinement assertions passed;
all 30 relocation-manifest targets matched their SHA-256 hashes; page asset and
navigation audit passed for 391 controls; measured static/feedback label fit
passed; parking feedback references resolve in the installed plugin. Changed
JavaScript and PowerShell files passed syntax checks. No live configuration was
redeployed during these pre-merge generator checks.
