# =============================================================================
#  STOP THE USE SERVE WHOLE, AND WAIT UNTIL ITS LOG IS FREE  --  the one stop both
#  update.ps1 and stop.cmd use (GROUP 4 / slice 1's rider, 2026-10-22).
#
#  THE DEFECT, MEASURED on the coder's probe port (two rounds): the serve is a
#  CHAIN -- the /MIN window's cmd.exe -> npx's node -> an inner cmd -> vite's node
#  (the listener) -- and the window's cmd holds the log open through `> log`.
#  `Stop-Process` on the listener alone leaves the window alive at 0 ms with the
#  log held; the chain unwinds in 70-100 ms. update.ps1 started the new window
#  at once, and its `> use-server.log` met the held file: the redirect failed, the
#  new cmd never ran, nothing listened -- "FAILED to restart", the log keeping the
#  old lines (release 3, claims 517).
#
#  THE CURE, BY CONSTRUCTION: stop EVERY process whose command line carries the
#  port (the window, npx, the inner cmd, the listener -- an old dev serve's npm
#  chain too), then WAIT until the log opens for exclusive write and the port is
#  free, before anything starts. Refuses loudly if either never frees.
#
#  Usage:  . stop-serve.ps1 ; Stop-Serve -Port 5180 -Log C:\Dev\202cl\use-server.log
#          (or run as a script with -Port/-Log to stop by hand)
# =============================================================================
param([int]$Port = 0, [string]$Log = '')

function Test-LogFree([string]$path) {
  if (-not (Test-Path $path)) { return $true }
  try { $fs = [IO.File]::Open($path, 'Open', 'Write', 'None'); $fs.Close(); return $true } catch { return $false }
}

function Stop-Serve([int]$Port, [string]$Log, [int]$WaitSeconds = 10) {
  $pat = "*--port $Port*"
  $members = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -and $_.CommandLine -like $pat }
  $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  $ids = @($members | ForEach-Object { $_.ProcessId })
  if ($listener) { $ids += $listener | ForEach-Object { $_.OwningProcess } }
  $ids = $ids | Sort-Object -Unique
  if ($ids.Count -eq 0) { Write-Host "  was not running (no process carries --port $Port)"; }
  foreach ($id in $ids) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue; Write-Host ("  stopped pid " + $id) }
  $sw = [Diagnostics.Stopwatch]::StartNew()
  while ($sw.Elapsed.TotalSeconds -lt $WaitSeconds) {
    $busy = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if (-not $busy -and (Test-LogFree $Log)) { Write-Host ("  the port is free and the log is free after " + $sw.ElapsedMilliseconds + " ms"); return $true }
    Start-Sleep -Milliseconds 50
  }
  Write-Host ("REFUSED: after " + $WaitSeconds + " s the port is " + $(if (Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue) { "still listening" } else { "free" }) + " and the log is " + $(if (Test-LogFree $Log) { "free" } else { "still held" })) -ForegroundColor Red
  return $false
}

if ($Port -gt 0 -and $Log -ne '' -and $MyInvocation.InvocationName -ne '.') {
  if (Stop-Serve -Port $Port -Log $Log) { exit 0 } else { exit 1 }
}
