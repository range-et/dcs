# Home and Material icons — 2026-11-03

The shared launcher is now **Home**, with Blender Viewpad navigation, Blender/DCS/TrackIR/Steam launchers and the existing aircraft page links. Blender-specific page sources, shortcuts, build/deploy tools and assets live in `C:/Users/range/Desktop/blender_touchportal`. This repo retains DCS pages and the shared launcher integration.

Every populated DCS button and readout has a Google Material icon badge. Icons are coloured with Monad Information Blue (#2B9ED1); native text remains readable below the icon. State-feedback actions retain their existing titles/colours and leave the static icon intact. Existing aircraft action, state-condition and timer definitions were compared with the previous committed versions and found unchanged. No BIOS scripts, export rates or live input profiles were changed.

Sources: https://github.com/google/material-design-icons (font, codepoint map and Apache 2.0 licence retained under assets/material-icons/). Generated transparent icons and the per-control mapping are under assets/icons/. tools/apply-page-icons.cjs applies the badge style after the normal theme build; tools/render-material-icons.py renders only the needed glyphs with Pillow. Icons supplement labels and do not assert a control's state.

Full pre-install pages/icons backup: `local_archives/tools-hub/20261103-213555/`. Subsequent per-file backups and before/after hashes are in the dated docs/deployments records. Close Touch Portal before restoring pages or icon files, then restart and reconnect the iPad. Restore the shared main page with the corresponding page set so navigation remains consistent.

Desktop inspection covered the Tools Hub, Blender Viewpad and FC3 Main; label wrapping and merged-icon proportions were corrected after the initial preview. Plugin-reference audits and layout occupancy checks passed. Blender mappings were checked against the installed Blender 5.1 keymap, and Touch Portal's editor recognized NumPad-1. iPad button-to-Blender behavior and DCS feedback after adding icons still require a live check; the device was disconnected after restart during setup.

The DCS-only TX16S model copy remains at config/radio/model7.yml (SHA-256 9A27E7F8E943E86CB4319C9ADFBC720DEC841FA0EE1EA15DF22A7724EC88FB92), with its badge under assets/radio/. These are DCS integration artifacts. General radio backups belong to Icarus; do not copy them back wholesale.

Live follow-up: the iPad reconnected and the Blender page was delivered. After the FRONT / TOP / BACK test request, the user confirmed that all buttons work. Blender keyboard operation is now user-confirmed. DCS icon feedback was not re-tested in a running mission during this Blender session.
