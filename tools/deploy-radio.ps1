param([switch]$Apply)
$ErrorActionPreference='Stop'
$repoRoot=Split-Path $PSScriptRoot -Parent
$files=@(@{Source='config\radio\model7.yml';Target='G:\MODELS\model7.yml'},@{Source='assets\radio\dcs.png';Target='G:\IMAGES\dcs.png'})
if(-not $Apply){$files | ForEach-Object {[pscustomobject]$_};return}
$volume=Get-Volume -DriveLetter G
if($volume.FileSystemLabel -ne 'ICARUS_DATA'){throw 'G: is not the expected radio SD card.'}
if(-not ([IO.File]::ReadAllText('G:\MODELS\model7.yml').Contains('DCS Cockpit'))){throw 'The target model is not DCS Cockpit.'}
$stamp=Get-Date -Format 'yyyyMMdd-HHmmss'
$icarusRoot=if($env:ICARUS_ROOT){$env:ICARUS_ROOT}else{Join-Path (Split-Path $repoRoot -Parent) 'icarus'}
$icarusRoot=(Resolve-Path -LiteralPath $icarusRoot -ErrorAction Stop).Path
$archive=Join-Path $icarusRoot "radios\tx16s\backups\dcs-deployments\$stamp"
New-Item -ItemType Directory -Force -Path $archive | Out-Null
$records=@()
foreach($file in $files){
 $source=Join-Path $repoRoot $file.Source
 $target=$file.Target
 $before=$null;$backup=$null
 if(Test-Path -LiteralPath $target){
  $backup=Join-Path $archive (Split-Path $target -Leaf)
  Copy-Item -LiteralPath $target -Destination $backup
  $before=(Get-FileHash -LiteralPath $target).Hash
 }
 Copy-Item -LiteralPath $source -Destination $target
 $after=(Get-FileHash -LiteralPath $target).Hash
 if($after -ne (Get-FileHash -LiteralPath $source).Hash){throw "Hash mismatch for $target"}
 $records += [pscustomobject]@{Source=$source;Target=$target;Backup=$backup;BeforeSHA256=$before;AfterSHA256=$after}
}
$records | ConvertTo-Json | Set-Content -Encoding utf8 (Join-Path $repoRoot "docs\deployments\radio-$stamp.json")
$records | Format-Table Target,AfterSHA256
