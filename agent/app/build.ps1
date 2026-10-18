# Builds agent\dist\JaegerRigAgent.exe (with icon, manifest and version info) using the .NET Framework
# compiler that ships with Windows, so nothing needs installing. The MSI is built by agent\installer\build-msi.ps1.
$ErrorActionPreference = 'Stop'
$csc = Join-Path $env:WINDIR 'Microsoft.NET\Framework64\v4.0.30319\csc.exe'
if (-not (Test-Path $csc)) { throw 'csc.exe not found. Windows 10/11 normally includes it.' }
$out = Join-Path $PSScriptRoot '..\dist'
New-Item -ItemType Directory -Force $out | Out-Null

# Icon: a dark disc with the same green dot the tray shows when online, as a multi-size .ico.
Add-Type -AssemblyName System.Drawing
$images = @()
foreach ($size in 16, 32, 48, 256) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)
    $disc = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 11, 18, 32))
    $dot = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 46, 201, 155))
    $g.FillEllipse($disc, 0, 0, $size - 1, $size - 1)
    $inset = [math]::Round($size * 0.28); $span = $size - 2 * $inset - 1
    $g.FillEllipse($dot, $inset, $inset, $span, $span)
    $ms = New-Object System.IO.MemoryStream
    $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
    $images += [pscustomobject]@{ Size = $size; Bytes = $ms.ToArray() }
    $dot.Dispose(); $disc.Dispose(); $g.Dispose(); $bmp.Dispose(); $ms.Dispose()
}
$ico = Join-Path $out 'JaegerRigAgent.ico'
$stream = New-Object System.IO.MemoryStream
$w = New-Object System.IO.BinaryWriter $stream
$w.Write([uint16]0); $w.Write([uint16]1); $w.Write([uint16]$images.Count)
$offset = 6 + 16 * $images.Count
foreach ($img in $images) {
    $dim = if ($img.Size -ge 256) { 0 } else { $img.Size }
    $w.Write([byte]$dim); $w.Write([byte]$dim); $w.Write([byte]0); $w.Write([byte]0)
    $w.Write([uint16]1); $w.Write([uint16]32)
    $w.Write([uint32]$img.Bytes.Length); $w.Write([uint32]$offset)
    $offset += $img.Bytes.Length
}
foreach ($img in $images) { $w.Write($img.Bytes) }
$w.Flush()
[System.IO.File]::WriteAllBytes($ico, $stream.ToArray())
$w.Dispose(); $stream.Dispose()

& $csc /nologo /target:winexe /optimize+ /platform:anycpu "/out:$out\JaegerRigAgent.exe" `
  "/win32icon:$ico" "/win32manifest:$(Join-Path $PSScriptRoot 'app.manifest')" `
  /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.Management.dll /r:System.Security.dll `
  (Join-Path $PSScriptRoot 'AssemblyInfo.cs') (Join-Path $PSScriptRoot 'RigAgent.cs')
if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
Write-Host "Built $out\JaegerRigAgent.exe"
