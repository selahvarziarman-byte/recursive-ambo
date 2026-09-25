@echo off
REM ==========================================================================
REM  STOP THE USE SERVER (:5180 only)
REM
REM  SAFETY: this is scoped to port 5180 BY CONSTRUCTION. It finds the process
REM  by asking who is listening on 5180 and stops only that one. It cannot
REM  touch 5173 (Arman's bench) or 5199 (the app-leg's) even if run twice.
REM  -- the standing rule: never kill a listener you did not spawn.
REM ==========================================================================

powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 5180 -State Listen -ErrorAction SilentlyContinue; if ($null -eq $c) { Write-Host 'The USE server is not running on :5180 - nothing to stop.' } else { $id = $c[0].OwningProcess; $n = (Get-Process -Id $id -ErrorAction SilentlyContinue).ProcessName; Stop-Process -Id $id -Force; Write-Host ('STOPPED the USE server on :5180 (pid ' + $id + ', ' + $n + ')') }"

echo.
pause
