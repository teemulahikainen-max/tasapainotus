@echo off
setlocal
set "ROOT=%~dp0.."
set "NODE=%ROOT%\.tools\node-v24.14.1-win-x64\node.exe"
set "VITEST=%ROOT%\node_modules\vitest\vitest.mjs"

if not exist "%NODE%" (
  echo Local Node.js was not found at "%NODE%"
  exit /b 1
)

if not exist "%VITEST%" (
  echo Vitest entrypoint was not found at "%VITEST%"
  exit /b 1
)

"%NODE%" "%VITEST%" run %*
exit /b %ERRORLEVEL%

