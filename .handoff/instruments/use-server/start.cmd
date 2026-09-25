@echo off
REM ==========================================================================
REM  THE USE SERVER  -- the customer's release. The bench NEVER touches it.
REM
REM  Serves the PINNED checkout  C:\Dev\202cl\USE  (detached HEAD) on :5180.
REM  It is pinned, so an edit or a landing on the bench cannot reload it.
REM
REM  Start it:  double-click this file, or run it from any prompt.
REM  Address :  http://localhost:5180
REM  Version :  http://localhost:5180/__whereami
REM  Log     :  C:\Dev\202cl\use-server.log
REM  Stop    :  stop.cmd (beside this file), or close the "USE server" window.
REM
REM  WHY ITS OWN WINDOW -- measured 2026-09-25 TWICE, and the second run
REM  CORRECTED the first. Read both; the first reading was over-attributed:
REM    (a) a server launched with stdin redirected from NUL **DIES**: vite
REM        watches stdin for its 'h' key, reads EOF at once, and exits.
REM    (b) a server launched with -WindowStyle Hidden from an ordinary shell
REM        **SURVIVES** its launcher's death (measured on the update path:
REM        parent gone, orphaned, still serving 2027c6d).
REM    => THE KILLER IS EOF ON STDIN, NOT THE HIDDEN WINDOW. The first run
REM       blamed "hidden" because the test harness happened to feed it NUL.
REM    `start /MIN` is kept anyway: its OWN console gives it its OWN stdin,
REM    so it is immune however it is launched, including from a console that
REM    later closes. That is robustness, not a cure for a live defect.
REM ==========================================================================

powershell -NoProfile -Command "$c = Get-NetTCPConnection -LocalPort 5180 -State Listen -ErrorAction SilentlyContinue; if ($c) { Write-Host ('ALREADY RUNNING on :5180 (pid ' + $c[0].OwningProcess + ') - nothing to do.'); exit 1 } else { exit 0 }"
if errorlevel 1 goto :done

echo Starting the USE server on :5180 ...
start "USE server  (pinned release -- close this window to stop)" /MIN cmd /c "cd /d C:\Dev\202cl\USE && npm run dev -- --port 5180 --strictPort > C:\Dev\202cl\use-server.log 2>&1"

powershell -NoProfile -Command "Start-Sleep -Seconds 14; $c = Get-NetTCPConnection -LocalPort 5180 -State Listen -ErrorAction SilentlyContinue; if ($c) { Write-Host ''; Write-Host '  UP  ->  http://localhost:5180'; Write-Host ('  serving: ' + (curl.exe -s http://localhost:5180/__whereami)) } else { Write-Host '  FAILED to start - see C:\Dev\202cl\use-server.log'; Get-Content C:\Dev\202cl\use-server.log -Tail 15 }"

:done
echo.
pause
