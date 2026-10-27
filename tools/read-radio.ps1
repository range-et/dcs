param([int]$Seconds = 0,[switch]$SwitchesOnly)
# Read-only Windows joystick telemetry. No input injection or device changes.
Add-Type -TypeDefinition @'
using System;
using System.Runtime.InteropServices;
public class DcsRadio {
 [StructLayout(LayoutKind.Sequential, CharSet=CharSet.Ansi)]
 public struct Caps {
  public ushort mid,pid;
  [MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)] public string name;
  public uint xmin,xmax,ymin,ymax,zmin,zmax,buttons,pmin,pmax,rmin,rmax,umin,umax,vmin,vmax,caps,maxAxes,numAxes,maxButtons;
  [MarshalAs(UnmanagedType.ByValTStr, SizeConst=32)] public string reg;
  [MarshalAs(UnmanagedType.ByValTStr, SizeConst=260)] public string oem;
 }
 [StructLayout(LayoutKind.Sequential)] public struct Pos {
  public uint size,flags,x,y,z,r,u,v,buttons,buttonNumber,pov,reserved1,reserved2;
 }
 [DllImport("winmm.dll",CharSet=CharSet.Ansi)] public static extern uint joyGetDevCapsA(uint id,out Caps caps,uint size);
 [DllImport("winmm.dll")] public static extern uint joyGetPosEx(uint id,ref Pos pos);
 [DllImport("winmm.dll")] public static extern uint joyGetNumDevs();
}
'@
$devices = @()
for ([uint32]$deviceId=0; $deviceId -lt [DcsRadio]::joyGetNumDevs(); $deviceId++) {
 $caps=New-Object DcsRadio+Caps
 if ([DcsRadio]::joyGetDevCapsA($deviceId,[ref]$caps,[Runtime.InteropServices.Marshal]::SizeOf($caps)) -eq 0) {
  $devices += [pscustomobject]@{Id=$deviceId;Name=$caps.name;Axes=$caps.numAxes;Buttons=$caps.buttons}
 }
}
$devices | ConvertTo-Json -Compress
$last=@{}
$until=(Get-Date).AddSeconds($Seconds)
do {
 foreach ($device in $devices) {
  $position=New-Object DcsRadio+Pos
  $position.size=[Runtime.InteropServices.Marshal]::SizeOf($position);$position.flags=255
  if ([DcsRadio]::joyGetPosEx($device.Id,[ref]$position) -eq 0) {
   $buttons=1..32 | Where-Object {($position.buttons -band ([uint32]1 -shl ($_-1))) -ne 0}
   if($SwitchesOnly){$line=[ordered]@{device=$device.Id;buttons=@($buttons)} | ConvertTo-Json -Compress}
   else{$line=[ordered]@{device=$device.Id;buttons=@($buttons);x=$position.x;y=$position.y;z=$position.z;r=$position.r;u=$position.u;v=$position.v;pov=$position.pov} | ConvertTo-Json -Compress}
   if ($last[$device.Id] -ne $line) { "$(Get-Date -Format HH:mm:ss.fff) $line"; $last[$device.Id]=$line }
  }
 }
 if ($Seconds -gt 0) {Start-Sleep -Milliseconds 100}
} while ((Get-Date) -lt $until)
