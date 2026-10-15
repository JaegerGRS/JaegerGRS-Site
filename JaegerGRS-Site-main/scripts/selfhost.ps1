# Self-hosted test server: the same Worker, API and pages as jaegergrs.com, running on this PC.
# Open http://localhost:8787 here, or http://<this-PC-IP>:8787 from a phone or TV on your network.
# Setup is left open (RIG_SETUP=open) so the tray app's "Get key from site" works. Local testing only.
param([int]$Port = 8787)

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
node src\site\build.mjs
if ($LASTEXITCODE -ne 0) { exit 1 }

$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch '^(127|169)' -and $_.InterfaceAlias -notmatch 'vEthernet|Loopback' } | Select-Object -First 1).IPAddress
$origins = "https://jaegergrs.com,http://localhost:$Port"
if ($ip) { $origins += ",http://${ip}:$Port" }

Write-Host "Site:        http://localhost:$Port"
if ($ip) { Write-Host "On your LAN: http://${ip}:$Port" }
Write-Host "In the tray app use the address http://localhost:$Port, then press 'Get key from site'."
Write-Host "Stop with Ctrl+C. Data is kept in .wrangler (ignored by git)."

npx --yes wrangler@4 dev --ip 0.0.0.0 --port $Port --var RIG_SETUP:open --var "ALLOWED_ORIGINS:$origins"
