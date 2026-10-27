# Monad Touch Portal port

Source palette: range-et/monad_system, theme/monad-colors.json. Its MIT license is retained beside the palette. The port uses #0F1113 page backgrounds, #1F242B control surfaces, #2A313A active surfaces, #EEF2F6 primary text, #B6BFCC secondary text, and the upstream blue/green/amber/red semantic accents.

tools/build-pages.cjs rebuilds pages/ from the immutable baseline. It removes wallpaper, full-button icon skins, graphic upgrades, flashing effects, and image-swap visuals. Control identity remains textual in both ordinary and event-driven states. Existing action sequences are preserved except for the explicitly documented fixes. Fonts are Segoe UI for controls and Consolas for readouts, using fonts available on Windows rather than adding a font dependency.

FC3 gear is a plain GEAR UNKNOWN / DOWN / UP control with its existing G key action. The old weight-on-wheels graphic cells now have explicit NOSE/LEFT/RIGHT WOW labels. These are ground-contact indications, not gear-lock sensors.

F-14 changes include replacing obsolete mgdc_f-14b references with the installed mgdc_f-14 namespace and rebuilding the ONLINE event to require ON. Baseline audit found six unique invalid references. All original module actions remain subject to in-game validation, especially on the newer F-14BU variant.

P-51D is a new draft with explicit gear/flaps positions, battery/generator/boost controls, ignition BOTH, mixture RUN, automatic cooling, radio channels, and camera navigation. Radiator AUTO is enum 2, verified against installed cockpit clickabledata.lua; zero is not AUTO. Radio channel and brake-handle presses include release events. Gear lamps describe lamp state, not an inferred mechanical lock when unpowered. Do not label it flight-verified until cockpit tests pass.

No export-rate or synchronization change belongs to the theme port. The baseline state-machine hash must stay unchanged.

Readability refinement: replace the split THROTTLE LEFT/RIGHT labels with explicit LEFT/RIGHT, THROTTLE, IDLE/CUT on separate lines. Fit the largest normal or event-driven label to each button, and wrap at word boundaries. Apply the plain gear/WOW feedback to both FC3 pages. The launcher fills its two rows with smaller headings. These refinements require a clean Touch Portal restart and native preview inspection after deployment.

tools/deploy-pages.ps1 previews its exact file list by default. With -Apply it requires Touch Portal to be closed, backs up each previous page under ignored local_archives/page-deployments, copies the five generated pages, verifies hashes, and records the result under docs/deployments.

Final readability build: widened all four F-14 throttle controls, moving the SPEED and ALT readouts into unused cells. Native preview confirms LEFT/RIGHT THROTTLE IDLE/CUT are complete and readable. Launcher, both FC3 pages and Mustang were also inspected in Touch Portal. Six legacy duplicate sensor-page controls hidden underneath merged readouts were removed; visible copies remain. A grid-span audit reports no overlapping/out-of-bounds controls on any aircraft page, and the plugin-reference audit reports zero missing IDs.

Feedback repair (deployment 20261026-211301): preserve the explicit numeric-state colours on newly created Mustang controls when applying the general theme. The previous final theme pass erased those colours. Selected flap/cooling controls now retain their identity and append SELECTED. The user confirmed the flap selection follows mobile presses. Fractional-second waits were converted to integer milliseconds after Touch Portal reported invalid timer values; native timing validation remains pending.
