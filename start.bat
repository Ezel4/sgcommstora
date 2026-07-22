@echo off
setlocal
REM ============================================================
REM  Sigmood IA - serveur de developpement
REM  Double-cliquez ce fichier pour lancer le site,
REM  puis le navigateur s'ouvre sur http://localhost:8080
REM
REM  IMPORTANT : gardez ce projet HORS de OneDrive
REM  (sinon .next se verrouille : erreur EPERM et modules
REM   introuvables lors de la synchronisation).
REM ============================================================

cd /d "%~dp0front"

if not exist "node_modules\next" (
  echo Installation des dependances ^(premiere fois, patientez...^)
  call npm install
  if errorlevel 1 (
    echo.
    echo ERREUR pendant l'installation. Lisez les messages ci-dessus.
    pause
    exit /b 1
  )
)

echo.
echo ============================================================
echo   Sigmood IA  -  http://localhost:8080
echo   Le navigateur va s'ouvrir automatiquement dans ~6s.
echo   Laissez cette fenetre ouverte. Ctrl+C pour arreter.
echo ============================================================
echo.

REM Ouvre le navigateur une fois le serveur demarre
start "" /b powershell -NoProfile -Command "Start-Sleep -Seconds 6; Start-Process 'http://localhost:8080'"

call npm run dev -- -p 8080 -H 0.0.0.0

echo.
echo Le serveur s'est arrete. En cas d'erreur, lisez les messages ci-dessus.
pause
