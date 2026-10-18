# Builds the per-user installer agent\dist\JaegerRigAgent-<version>.msi.
# Requires WiX Toolset 3.14 binaries (candle.exe / light.exe). Looked up in this order:
#   1. $env:JGRS_WIX (folder containing candle.exe)
#   2. %LOCALAPPDATA%\Tools\WiX314
#   3. %ProgramFiles(x86)%\WiX Toolset v3.14\bin
param([string]$Version = '1.0.0')
$ErrorActionPreference = 'Stop'
$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$dist = Join-Path $root 'dist'

& (Join-Path $root 'app\build.ps1')
if ($LASTEXITCODE -ne 0) { throw 'EXE build failed.' }

$wixBin = @($env:JGRS_WIX, (Join-Path $env:LOCALAPPDATA 'Tools\WiX314'), (Join-Path ${env:ProgramFiles(x86)} 'WiX Toolset v3.14\bin')) |
    Where-Object { $_ -and (Test-Path (Join-Path $_ 'candle.exe')) } | Select-Object -First 1
if (-not $wixBin) { throw 'WiX 3.14 not found. Set JGRS_WIX to the folder that contains candle.exe.' }
$candle = Join-Path $wixBin 'candle.exe'
$light = Join-Path $wixBin 'light.exe'

$obj = Join-Path $dist 'msi-obj'
New-Item -ItemType Directory -Force $obj | Out-Null
$msi = Join-Path $dist "JaegerRigAgent-$Version.msi"

& $candle -nologo -arch x64 -ext WixUtilExtension -ext WixUIExtension "-dVersion=$Version" "-dExeFile=$(Join-Path $dist 'JaegerRigAgent.exe')" `
    "-dIconFile=$(Join-Path $dist 'JaegerRigAgent.ico')" -out "$obj\" (Join-Path $PSScriptRoot 'JaegerRigAgent.wxs')
if ($LASTEXITCODE -ne 0) { throw 'candle failed.' }

& $light -nologo -ext WixUIExtension -ext WixUtilExtension -out $msi "$obj\JaegerRigAgent.wixobj"
if ($LASTEXITCODE -ne 0) { throw 'light failed.' }

Remove-Item -Recurse -Force $obj
Write-Host "Built $msi"
