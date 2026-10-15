# Self-hosted test server: the same Worker, API and pages as jaegergrs.com, running on this PC.
# Reachable from this PC only (localhost). Nothing is exposed to your network.
# Setup is left open (RIG_SETUP=open) so the tray app's "Get key from site" works. Local testing only.
param([int]$Port = 8787)

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
node src\site\build.mjs
if ($LASTEXITCODE -ne 0) { exit 1 }

$origins = "https://jaegergrs.com,http://localhost:$Port"

Write-Host "Site:        http://localhost:$Port"
Write-Host "In the tray app use the address http://localhost:$Port, then press 'Get key from site'."
Write-Host "Stop with Ctrl+C. Data is kept in .wrangler (ignored by git)."

npx --yes wrangler@4 dev --ip 127.0.0.1 --port $Port --var RIG_SETUP:open --var "ALLOWED_ORIGINS:$origins"
