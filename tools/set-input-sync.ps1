param([switch]$Apply)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path $PSScriptRoot -Parent
$target=Join-Path $env:USERPROFILE 'Saved Games\DCS\Config\options.lua'
$pattern='(\["synchronize_controls"\]\s*=\s*)false'
$source=[IO.File]::ReadAllText($target)
if([regex]::Matches($source,$pattern).Count -ne 1){throw 'Expected exactly one disabled synchronize_controls option; inspect current settings before applying.'}
if(-not $Apply){Write-Output 'Preview: enable only miscellaneous.synchronize_controls. DCS must be closed before -Apply.';return}
if(Get-Process DCS -ErrorAction SilentlyContinue){throw 'Exit DCS normally before changing its saved options.'}
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$backup=Join-Path $repoRoot "local_archives\options-deployments\$stamp\options.lua"
New-Item -ItemType Directory -Force -Path (Split-Path $backup -Parent) | Out-Null
Copy-Item -LiteralPath $target -Destination $backup
$before=(Get-FileHash -LiteralPath $target).Hash
$updated=[regex]::Replace($source,$pattern,'${1}true')
[IO.File]::WriteAllText($target,$updated,[Text.UTF8Encoding]::new($false))
$after=(Get-FileHash -LiteralPath $target).Hash
[pscustomobject]@{Target=$target;Backup=$backup;BeforeSHA256=$before;AfterSHA256=$after;Change='miscellaneous.synchronize_controls false -> true'} |
 ConvertTo-Json | Set-Content -Encoding utf8 (Join-Path $repoRoot "docs\deployments\input-sync-$stamp.json")
Write-Output 'Enabled cockpit/HOTAS synchronization. Set physical switches for the intended ground or air start before loading a mission.'
