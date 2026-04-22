@echo off
setlocal
set "ROOT=%~dp0.."
set "NODE=%ROOT%\.tools\node-v24.14.1-win-x64\node.exe"
set "TSC=%ROOT%\node_modules\typescript\lib\tsc.js"
set "VITE=%ROOT%\node_modules\vite\bin\vite.js"

if not exist "%NODE%" (
  echo Local Node.js was not found at "%NODE%"
  exit /b 1
)

if not exist "%TSC%" (
  echo TypeScript entrypoint was not found at "%TSC%"
  exit /b 1
)

if not exist "%VITE%" (
  echo Vite entrypoint was not found at "%VITE%"
  exit /b 1
)

"%NODE%" "%TSC%" -b
if errorlevel 1 exit /b %ERRORLEVEL%

"%NODE%" "%VITE%" build %*
exit /b %ERRORLEVEL%
