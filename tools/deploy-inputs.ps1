param([switch]$Apply)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path $PSScriptRoot -Parent
$sourceRoot=Join-Path $repoRoot 'config\dcs\Config\Input'
$targetRoot=Join-Path $env:USERPROFILE 'Saved Games\DCS\Config\Input'
$files=Get-ChildItem -LiteralPath $sourceRoot -Recurse -File -Filter '*.diff.lua'
if(-not $Apply){$files | Select-Object FullName;return}
if(Get-Process DCS -ErrorAction SilentlyContinue){throw 'Exit DCS normally before deploying inputs; it can overwrite these files on exit.'}
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$archive=Join-Path $repoRoot "local_archives\input-deployments\$stamp"
$records=@()
foreach($file in $files){
 $relative=$file.FullName.Substring($sourceRoot.Length+1)
 $target=Join-Path $targetRoot $relative
 $backup=Join-Path $archive $relative
 $before=$null
 if(Test-Path -LiteralPath $target){
  New-Item -ItemType Directory -Force -Path (Split-Path $backup -Parent) | Out-Null
  Copy-Item -LiteralPath $target -Destination $backup
  $before=(Get-FileHash -LiteralPath $target).Hash
 }
 New-Item -ItemType Directory -Force -Path (Split-Path $target -Parent) | Out-Null
 Copy-Item -LiteralPath $file.FullName -Destination $target
 $expected=(Get-FileHash -LiteralPath $file.FullName).Hash
 $actual=(Get-FileHash -LiteralPath $target).Hash
 if($expected -ne $actual){throw "Hash mismatch: $relative"}
 $records += [pscustomobject]@{File=$relative;BeforeSHA256=$before;AfterSHA256=$actual;Backup=if($before){$backup}else{$null};Target=$target}
}
$records | ConvertTo-Json -Depth 5 | Set-Content -Encoding utf8 (Join-Path $repoRoot "docs\deployments\inputs-$stamp.json")
$records | Format-Table File,AfterSHA256
