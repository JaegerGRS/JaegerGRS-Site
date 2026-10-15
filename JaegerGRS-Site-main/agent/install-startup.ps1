# Registers the agent to start when you sign in to Windows (a per-user scheduled task, no admin needed).
# Run `node agent\rig-agent.mjs setup` first. Remove later with: Unregister-ScheduledTask JaegerGRS-Rig-Agent
$node = (Get-Command node).Source
$agent = Join-Path $PSScriptRoot 'rig-agent.mjs'
$action = New-ScheduledTaskAction -Execute $node -Argument "`"$agent`"" -WorkingDirectory $PSScriptRoot
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $env:USERNAME
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -RestartCount 3 -RestartInterval (New-TimeSpan -Minutes 1)
Register-ScheduledTask -TaskName 'JaegerGRS-Rig-Agent' -Action $action -Trigger $trigger -Settings $settings -Force | Out-Null
Write-Host 'Done. The agent will start at your next sign-in.'
