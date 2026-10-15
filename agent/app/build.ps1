# Builds agent\dist\JaegerRigAgent.exe using the .NET Framework compiler that ships with Windows (nothing to install).
$ErrorActionPreference = 'Stop'
$csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path $csc)) { throw 'csc.exe not found. Windows 10/11 normally includes it.' }
$out = Join-Path $PSScriptRoot '..\dist'
New-Item -ItemType Directory -Force $out | Out-Null
& $csc /nologo /target:winexe /optimize+ /platform:anycpu "/out:$out\JaegerRigAgent.exe" `
  /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.Management.dll /r:System.Security.dll `
  (Join-Path $PSScriptRoot 'RigAgent.cs')
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
Write-Host "Built $out\JaegerRigAgent.exe"
