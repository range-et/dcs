# DCS cockpit controls

Personal DCS World setup for Touch Portal on iPad, DCS-COINS, DCS-BIOS, and a RadioMaster TX16S. The aim is a readable, consistent cockpit interface and transferable fixed-wing stick practice for FPV flying.

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
| SB, three positions | Flaps **and** autopilot were both requested | Conflict to resolve before implementation. Autopilot request: off, altitude hold, heading plus altitude hold. Aircraft capability varies. |
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

Keep the baseline backup immutable. Store editable source/configuration separately, retain assets and an inventory for restoration, and record validation status honestly. Test changes incrementally: page appearance and pressed state, connection and aircraft identification, individual controls, feedback, and clean shutdown. Keep local installer/runtime binaries outside Git and record their hashes. Local commits do not imply publication or upload.

The repository already contained its license commit before this work. The first and second requested commits are the next two commits: intent, then the working-state backup.
