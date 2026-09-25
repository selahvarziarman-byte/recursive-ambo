# =============================================================================
#  UPDATE THE PINNED USE SERVER  --  run ONLY on the mothership's announcement.
#
#  Usage:   powershell -NoProfile -File update.ps1 <new-ratified-sha>
#
#  NEVER on a landing, NEVER on a timer, NEVER automatically. The pin moves
#  when a human office says a build is ratified, and at no other moment.
#  (The sibling rule on the MAIN checkout -- "MARK, never move" -- exists
#   because an advance under a live session hot-reloads a walk out from under
#   the person, and a walk's whole content is its carried state. Same reason
#   here: moving this pin WILL reload the customer's tab. That is correct at
#   an announcement and destructive at any other time.)
#
#  GUARDS, in order. Any failure refuses and changes nothing:
#    1. the new SHA must exist
#    2. it must be a DESCENDANT of the current pin  (fast-forward only)
#    3. the USE tree must be clean                  (never clobber)
# =============================================================================

param([Parameter(Mandatory = $true)][string]$Sha)

$USE  = 'C:\Dev\202cl\USE'
$MAIN = 'C:\Dev\202cl\PlatonicEngine202'
$ErrorActionPreference = 'Stop'

function Fail($m) { Write-Host "REFUSED: $m" -ForegroundColor Red; exit 1 }

Write-Host "=== fetching origin so the new commit is reachable ==="
git -C $MAIN fetch origin --quiet

$old = (git -C $USE rev-parse HEAD).Trim()
Write-Host ("  current pin : " + $old.Substring(0,7))

# --- guard 1: the SHA exists -------------------------------------------------
$new = (git -C $MAIN rev-parse --verify --quiet "$Sha^{commit}")
if (-not $new) { Fail "'$Sha' is not a commit in this repository." }
$new = $new.Trim()
Write-Host ("  new pin     : " + $new.Substring(0,7))

if ($new -eq $old) { Write-Host "Already pinned there. Nothing to do."; exit 0 }

# --- guard 2: FAST-FORWARD ONLY ---------------------------------------------
git -C $MAIN merge-base --is-ancestor $old $new
if ($LASTEXITCODE -ne 0) {
  Fail "the new pin is NOT a descendant of the current pin. That is a rewind or a divergence, not a release. Nothing moved."
}
Write-Host "  ff-only guard: PASS (forward move)"

# --- guard 3: the USE tree must be clean ------------------------------------
if ((git -C $USE status --porcelain)) {
  Fail "the USE checkout has local changes. It is a release, not a workspace. Nothing moved."
}
Write-Host "  clean guard  : PASS"

# --- stop, move, reinstall if deps moved, restart ---------------------------
Write-Host "`n=== stopping the server ==="
$c = Get-NetTCPConnection -LocalPort 5180 -State Listen -ErrorAction SilentlyContinue
if ($c) { Stop-Process -Id $c[0].OwningProcess -Force; Write-Host "  stopped pid $($c[0].OwningProcess)" }
else    { Write-Host "  was not running" }

Write-Host "`n=== moving the pin ==="
git -C $USE checkout --detach $new --quiet
Write-Host ("  USE HEAD now: " + (git -C $USE rev-parse --short HEAD))

# dependencies only need work if the lockfile actually moved
$depsMoved = $true
git -C $MAIN diff --quiet $old $new -- package.json package-lock.json
if ($LASTEXITCODE -eq 0) { $depsMoved = $false }
if ($depsMoved) {
  Write-Host "`n=== package-lock moved between pins -> npm ci ==="
  Push-Location $USE; npm ci --no-audit --no-fund; Pop-Location
} else {
  Write-Host "`n=== dependencies unchanged between pins -> install skipped ==="
}

# Restart in its OWN console, the same form start.cmd uses.
# MEASURED 2026-09-25: the previous form here (-WindowStyle Hidden) DID survive
# its launcher's death on this path -- it was NOT broken. The killer measured
# earlier was EOF on stdin (a harness feeding NUL), not the hidden window.
# `start /MIN` is used anyway so both paths are identical and neither depends
# on who launched it or on that launcher's stdin. Hardening, not a bug fix.
Write-Host "`n=== restarting (own console, same form as start.cmd) ==="
cmd /c 'start "USE server  (pinned release -- close this window to stop)" /MIN cmd /c "cd /d C:\Dev\202cl\USE && npm run dev -- --port 5180 --strictPort > C:\Dev\202cl\use-server.log 2>&1"'
Start-Sleep -Seconds 14

$c = Get-NetTCPConnection -LocalPort 5180 -State Listen -ErrorAction SilentlyContinue
if (-not $c) { Write-Host "FAILED to restart - see C:\Dev\202cl\use-server.log" -ForegroundColor Red; Get-Content C:\Dev\202cl\use-server.log -Tail 15; exit 1 }

Write-Host "`n=== VERIFY: the server must now answer the new pin ==="
$w = (curl.exe -s http://localhost:5180/__whereami)
Write-Host "  $w"
if ($w -notmatch $new.Substring(0,12)) { Write-Host "MISMATCH - it is not serving the new pin." -ForegroundColor Red; exit 1 }
Write-Host "`nUSE server updated and serving $($new.Substring(0,7)) on http://localhost:5180" -ForegroundColor Green
