DCS-BIOS Version: 0.8.2
PP Version: 2024-09-15
2024-04-15
- Disabled unnecessary angular velocity parameters in CommonData
- Adjusted default value of a few parameters for L-39
2024-04-10
- Support for DCS-BIOS naming convention changes starting with DCS Unified 2.9.3
- Fixed: Base aircraft name for SA-342
2023-09-09
- Fixed: F/A-18 Hornet variants not recognized
- Fixed: C-101 and variants not recognized
- Added: F-15E, MB-339 and Blackshark 3 support
- Synced with patches from FlightPanels' DCS-BIOS v0.7.47-49
  Aircraft includes A-10C, A-4E, AH-64D, AJS37, AV8BNA, C-101, F-14, F-16, F/A-18, FW-190D, Gazelle, M-2000C, Mig-21, MirageF1, Mi-8, Mi-24, Mosquito, P-47, T-45, Yak-52
  (Refer https://github.com/DCSFlightpanels/dcs-bios/releases)
2022-11-11
- F-16C_50
  - Translated a few ICP parameter values
2022-11-06
- AH-64D
  - Added enums, adjusted defaults for cold start
2022-10-23
- All aircraft
  - Change/enable tpValType "=int" to "=pct" for position parameters (eg. canopy, door, flaps, seat height, hook, wing, refuel probe, throttle, brake and etc.)
  - Disable noisy strobe lights
- F-16C, F/A-18C, Mosquito, UH-1H
  - Fix default value of a few parameters for cold start-up
2022-10-08
- Added new value type '=ctr'<max value> for connector/slider controls
- Removed '%' character from non-connector/slider control return values
- Streamlined all non-connector/slider numerical values to '=int'<Max value>
- Renamed value type "PCT" with segments "ADD" and "MINUS" to "=pct", "+" and "-" respectively
- Renamed value type "Text" to "text"
- Added transform character "*" and "/" in "int" value type to multiply and divide the base value with the segment value (float supported) after the respective transform character
  Format: =int(<max value>)[*|/](<value to multiply/divide by)
  eg. =int(65535)*(1.6), =int(65000)/(2)
2024-09-15
- Added new value type '=ictr'<max value>, inverted version of '=ctr'<max value> for connector/slider controls
- L-39
  - Added enums with adjusted defaults
- FA-18C_hornet
  - Added enums with adjusted defaults
- Support for new modules/variants F-4E-45MC, Mirage-F1BE, OH58D, UH-60L
2024-09-17
- Patch for UH-1H (INT_VOL, VHFFM_VOL)
2024-09-22
- Patch for UH-1H (ADF_GAIN, INT_VOL, UHF_VOL, VHFFM_VOL, VHFCOMM_VOL)
