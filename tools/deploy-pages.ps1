param([switch]$Apply)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path $PSScriptRoot -Parent
$pageRoot=Join-Path $env:APPDATA 'TouchPortal\pages'
$files=@('DCS\FC3 Main Panel.tml','DCS\FC3 Navigation & Sensor Panel.tml','DCS\F14.tml','DCS\F14 Radar & Navigation.tml','DCS\P-51D.tml')
if (-not $Apply) {
 foreach($file in $files) { [pscustomobject]@{Source=(Join-Path $repoRoot "pages\$file");Destination=(Join-Path $pageRoot $file)} }
 return
}
if (Get-Process TouchPortal -ErrorAction SilentlyContinue) {throw 'Fully exit Touch Portal before deploying saved pages.'}
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$archive=Join-Path $repoRoot "local_archives\page-deployments\$stamp"
$records=@()
foreach($file in $files) {
 $source=Join-Path $repoRoot "pages\$file"
 $target=Join-Path $pageRoot $file
 $backup=Join-Path $archive $file
 $before=$null
 if(Test-Path -LiteralPath $target) {
  New-Item -ItemType Directory -Force -Path (Split-Path $backup -Parent) | Out-Null
  Copy-Item -LiteralPath $target -Destination $backup
  $before=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
 }
 New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
 Copy-Item -LiteralPath $source -Destination $target
 $expected=(Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash
 $actual=(Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash
 if($actual -ne $expected){throw "Deployment hash mismatch: $file"}
 $records += [pscustomobject]@{File=$file;BeforeSHA256=$before;AfterSHA256=$actual;Backup=$backup;Target=$target}
}
$recordDir=Join-Path $repoRoot 'docs\deployments'
New-Item -ItemType Directory -Force -Path $recordDir | Out-Null
$iconNames=Get-Content -LiteralPath (Join-Path $repoRoot 'assets\icons\manifest.json') -Raw | ConvertFrom-Json | Select-Object -ExpandProperty file -Unique
foreach($name in $iconNames){
 $source=Join-Path $repoRoot "assets\icons\$name"
 $target=Join-Path $env:APPDATA "TouchPortal\icons\$name"
 $backup=Join-Path $archive "icons\$name";$before=$null
 if(Test-Path -LiteralPath $target){New-Item -ItemType Directory -Force -Path (Split-Path $backup -Parent) | Out-Null;Copy-Item -LiteralPath $target -Destination $backup;$before=(Get-FileHash -LiteralPath $target).Hash}
 Copy-Item -LiteralPath $source -Destination $target
 $after=(Get-FileHash -LiteralPath $target).Hash
 if($after -ne (Get-FileHash -LiteralPath $source).Hash){throw "Icon hash mismatch: $name"}
 $records += [pscustomobject]@{File="icons\$name";BeforeSHA256=$before;AfterSHA256=$after;Backup=$backup;Target=$target}
}
$records | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 (Join-Path $recordDir "$stamp.json")
$records | Format-Table File,AfterSHA256
