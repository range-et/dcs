# DCS cockpit controls

Personal DCS World setup for Touch Portal on iPad, DCS-COINS, DCS-BIOS, and a RadioMaster TX16S. The aim is a readable, consistent cockpit interface and transferable fixed-wing stick practice for FPV flying.

## Current checkpoint

2026-11-03: the shared Home launcher lives outside this repository at C:/Users/range/Desktop/touchportal_shared. All DCS pages have Material icon badges beside their native labels; DCS commands/state conditions are preserved. Blender sources live separately at `C:/Users/range/Desktop/blender_touchportal`. See [the design checkpoint](docs/design-checkpoint-20261103.md) for installation, backups and remaining mobile checks. The DCS-only TX16S model copy remains in config/radio/model7.yml; full radio backups belong to Icarus.

The DCS/Touch Portal baseline is committed. TX16S radio backups moved on 2026-11-03 to `C:/Users/range/Desktop/icarus/radios/tx16s/backups/dcs-20261026/`; see docs/backup-and-restore.md and the relocation manifest. All six Touch Portal pages use Monad colours and readable labels, including a separate linked F-14 Radar & Navigation page. The Mustang page returns to Home and has no F-14 shortcut. F-14BU ONLINE/parking-brake feedback passed a live check. The new Mustang page passed battery/generator, actual flap travel and selection feedback, cooling controls, radio/brake release timing, responsive ONLINE operation and a user flight-axis check. Normal shutdown changed the Mustang indicator to OFFLINE. These are representative checks, not a test of every aircraft switch. The new F-14 systems page has passed installation/reference checks and desktop visual inspection; its controls await live aircraft validation.

The DCS Cockpit radio model now has an original DCS badge and a refined 7-axis/26-button USB mapping. SG is communications/Jester. Additional SE outputs support the F-14 autopilot sequence; SB has a dedicated three-position Mustang flap axis. RS controls normal wing-sweep buttons on the F-14 and coolant control on the Mustang; LS is Mustang propeller RPM. Reconnect and representative USB endpoint checks passed. Aircraft-specific refinements still need individual in-game checks. Cockpit/HOTAS synchronization is enabled with a saved rollback copy. The user's BIOS export-rate/sync code remains unchanged.

End-of-day checkpoint, 2026-10-26 (Toronto): the user reported that the F-15C handled fine in the Marianas Hotstart sample. The F-14BU repeatedly spun/skidded during runway attempts; cause remains unresolved, so do not attribute it to aircraft difficulty or mark its ground handling passed. F-14 radar/nav exports responded in representative tests, ONLINE and TID 25 NM SET were confirmed on the iPad, and the user subsequently reported cockpit clicks and that the controls work. The entire radar page and radio autopilot/slider functions are not exhaustively verified. Resume with the F-14 ground-handling diagnosis and remaining per-aircraft radio checks. No further app changes or aircraft shutdown were requested at this stopping point.

See [radio layout and validation](docs/tx16s-layout.md), [Mustang checks](docs/p51-validation.md), [F-14 diagnosis](docs/f14-diagnosis.md), [theme details](docs/theme-port.md) and [backup/restore](docs/backup-and-restore.md). Deployment records under docs/deployments identify exact files, previous copies and hashes. All commits are local; nothing has been pushed.

## Working baseline

The user fixed the iPad lag/disconnection issue and reports that FC3 now works. The current installed DCS-BIOS files include the user's update-rate and synchronization changes. Preserve this exact working state before further changes. Excessive update traffic is a suspected cause, not a proven diagnosis.

Do not restore an older BIOSStateMachine.lua over the working copy or increase its export rate without a measured reason. Back up first, record each change, and make rollback practical.

## Work order

1. Record this intent and repository ignore rules in a commit.
2. Copy and organize the installed DCS-COINS, DCS-BIOS, Touch Portal pages/assets/settings, and DCS input bindings here. Record source paths, hashes, and restore instructions, then commit the baseline separately. Retain original downloads locally.
3. Port all Touch Portal pages to the [Monad system](https://github.com/range-et/monad_system). Use its actual palette tokens, consistent typography, clear hierarchy, and good contrast. Use computer control to inspect/edit/verify the pages and retain page backups here.
4. Replace/fix the FC3 landing-gear lever graphic. Keep button labels visible when pressed and when state feedback changes; avoid visual effects that obscure the control's identity.
5. Diagnose the F-14 page's missing ONLINE indication and verify control/feedback in DCS.
6. Create a P-51D page using the existing modules and Chuck's guide, then debug it in DCS.
7. Standardize TX16S bindings across installed aircraft, preserving the existing working F-15C and P-51 axes as the initial reference.

## Interface goals

- A consistent Monad look on the launcher, FC3 main/sensor pages, F-14, and P-51D.
- Readable labels at iPad viewing distance, including pressed and active states.
- Simple, reliable gear status instead of a fragile decorative lever.
- Explicit aircraft connection status, clear navigation, and meaningful feedback.
- Conservative update traffic: send useful changes and verify connection stability.
- Separate evidence of correct installation, control input, aircraft feedback, and normal shutdown. Do not mark a module verified from page visibility alone.

## TX16S intent and unresolved choices

Primary purpose: build comfortable, transferable fixed-wing FPV stick habits. Keep flight axes consistent and avoid disrupting the already configured throttle/stick axes. Weapon controls are convenience mappings for DCS.

| Control | Requested role | Notes |
|---|---|---|
| SF | Guns | Verify actual USB button/channel output before binding. |
| SH | Missile/weapon release | Momentary switch; use aircraft-appropriate release. |
| SF + SH | Throttle cutoff, eject, or another special function | Exact action undecided. Keep unbound until chosen; avoid accidental combined weapon/emergency commands. |
| SA, three positions | Ground brake / gear down / gear up | Clarify whether ground position means wheel brake or nosewheel steering. Use explicit commands where available, not repeated toggles. |
| SB, three positions | Flaps | User confirmed SB = flaps, SE = autopilot. Use explicit positions appropriate to each aircraft. |
| SE, three positions | Autopilot | Off, altitude hold, heading plus altitude hold where supported. Do not invent autopilot modes for the Mustang. |
| SC, three positions | Radar/mode select | Choose meaningful aircraft-specific modes; P-51D has no equivalent modern radar modes. |
| SD, three positions | Armament/missile select | Aircraft-specific options; preserve consistent switch direction. |
| LS / RS | Aircraft-specific continuous controls | F-14 wing sweep proposed; P-51 cooling/radiator control proposed. Check actual supported control behavior first. |

Use the TX16S manual in ref_docs to identify physical switches, USB outputs, and radio-model configuration. Document any recommended layout before applying it. Do not invent equivalent modes on aircraft that lack them.

## References

- [Monad design tokens](https://github.com/range-et/monad_system)
- [Chuck's F-14B guide](https://chucksguides.com/aircraft/dcs/f-14b/)
- [Chuck's P-51D guide](https://chucksguides.com/aircraft/dcs/p-51d/)
- Local ref_docs contains both aircraft guides and TX16SMKII_2.0.pdf. This folder is intentionally ignored by Git.

## Change and validation policy

The F-14 main page includes a Nosewheel toggle beside Gear (row 2). It sends
the default pilot N binding only while F-14 is connected and nose weight-on-wheels
is ON. Keep DCS focused. ON/OFF follows the actual NWS ENGA cockpit lamp;
Offline means no aircraft connection. OFF does not mean the wheel is locked.
This avoids invoking the same stick button's autopilot-reference function airborne.
After rebuilding pages, run `node tools/add-f14-nws.cjs` to reapply this addition.
The installed page, assets, plugin references and Touch Portal editor parsing were
verified on 2026-11-17; live DCS key delivery and lamp feedback remain to be checked.
See [Heatblur ground handling](https://f14.manuals.heatblur.se/f14ab/systems/flight_controls_gear/gear_ground_handling.html).

Keep the baseline backup immutable. Store editable source/configuration separately, retain assets and an inventory for restoration, and record validation status honestly. Test changes incrementally: page appearance and pressed state, connection and aircraft identification, individual controls, feedback, and clean shutdown. Keep local installer/runtime binaries outside Git and record their hashes. Local commits do not imply publication or upload.

The repository already contained its license commit before this work. The first and second requested commits are the next two commits: intent, then the working-state backup.
