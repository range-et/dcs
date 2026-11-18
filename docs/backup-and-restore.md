# Working baseline backup

Captured before theme or module changes on 2026-10-26. The complete local copies remain under this repository even where Git ignores runtime packages.

| Copy | Original source |
|---|---|
| baseline/dcs/Scripts | C:/Users/range/Saved Games/DCS/Scripts |
| baseline/dcs/Config/Input | C:/Users/range/Saved Games/DCS/Config/Input |
| baseline/touchportal | Installed pages, assets, plugin, values, flows, host config |
| local_archives/TouchPortal-full | C:/Users/range/AppData/Roaming/TouchPortal, full profile |
| local_archives/DCS-COINS-download | Original downloaded DCS-COINS distribution |
| local_archives/previous-debug-session | Earlier debugging report and its older backups |

The current working BIOSStateMachine.lua SHA-256 is `A15B322DFEFB9225C1381E8B5A5B22D32D013CF2EADF73753C705F7774B9C89E`. Its 0.1-second export interval and queue-only-nonempty-data logic are the user's working baseline. Older files in previous-debug-session predate those changes.

baseline-manifest.csv records original paths, backup paths, byte sizes, and SHA-256 hashes. Live logs/cache can change during copying; the configuration and state-machine copies are the recovery baseline. Reference PDFs remain in ignored ref_docs as requested by the existing ignore rule.

## Restore a particular change

1. Close the DCS mission before restoring export scripts. Fully exit Touch Portal before restoring its pages/plugin/profile files.
2. Copy the required file from baseline to its original path above. Restore only affected files; a complete profile restore can overwrite later work.
3. For a full Touch Portal restoration use local_archives/TouchPortal-full. This includes locally retained executables and other runtime files excluded from Git.
4. Relaunch Touch Portal, reconnect the iPad, then load a DCS mission and verify controls and feedback.

A Git clone alone does not recreate ignored installers, executable binaries, local-only full-profile settings, or reference PDFs. Preserve local_archives separately when transferring the setup. This work creates local commits only; no push is implied.

Do not edit baseline in place. New versions belong in working directories and should be deployed with an explicit file list and recorded hashes.

## TX16S backup location (2026-11-03)

Radio SD/model/settings backups now live in `C:/Users/range/Desktop/icarus/radios/tx16s/backups/dcs-20261026/`. This contains the original `20261026` snapshot, `20261026-refinement` radio snapshot, original manifests and the pre-deployment rollback file under `deployments/20261026-215558/`. They were moved with SHA-256 verification; `tx16s-backup-relocation-20261103.csv` maps every previous path to its new location. Historical deployment JSON records retain their original paths for provenance; consult this relocation map when restoring them.

The four DCS joystick-profile backups from the refinement snapshot remain here under `backups/dcs-inputs/20261026-refinement/Config/Input/`. Radio-specific original files are no longer stored in this DCS working tree, though earlier Git commits retain their history. New radio deployment rollback copies go to Icarus at `radios/tx16s/backups/dcs-deployments/`. Radio builders default to the sibling `icarus` repo; set `ICARUS_ROOT` if it is elsewhere. DCS/Touch Portal configuration, native input bindings and DCS integration tools remain in this repo.
