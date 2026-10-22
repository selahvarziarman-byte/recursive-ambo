@echo off
REM ==========================================================================
REM  STOP THE USE SERVER (:5180 only)
REM
REM  SAFETY: this is scoped to port 5180 BY CONSTRUCTION. It finds the process
REM  by asking who is listening on 5180 and stops only that one. It cannot
REM  touch 5173 (Arman's bench) or 5199 (the app-leg's) even if run twice.
REM  -- the standing rule: never kill a listener you did not spawn.
REM ==========================================================================

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop-serve.ps1" -Port 5180 -Log C:\Dev\202cl\use-server.log

echo.
pause
