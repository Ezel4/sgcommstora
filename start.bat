@echo off
REM ============================================================
REM  Stora AI - serveur de dev
REM  Ouvre ensuite : http://localhost:8080
REM
REM  IMPORTANT : ce projet doit etre place HORS de OneDrive
REM  (ex. C:\dev\Sigmood-commerce-ai). Dans un dossier OneDrive,
REM  la synchronisation verrouille .next (EPERM) et deshydrate
REM  node_modules (modules introuvables).
REM ============================================================

cd /d "%~dp0front"

if not exist "node_modules\next" (
  echo Installation des dependances ^(premiere fois^)...
  call npm install
)

echo.
echo ============================================================
echo   Stora AI  -  http://localhost:8080
echo   Laisse cette fenetre ouverte. Ctrl+C pour arreter.
echo ============================================================
echo.

call npm run dev -- -p 8080 -H 0.0.0.0

echo.
echo Le serveur s'est arrete. En cas d'erreur, lis les messages ci-dessus.
pause
