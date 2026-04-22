@echo off
setlocal
set "ROOT=%~dp0.."
set "NODE=%ROOT%\.tools\node-v24.14.1-win-x64\node.exe"
set "TSC=%ROOT%\node_modules\typescript\lib\tsc.js"

if not exist "%NODE%" (
  echo Local Node.js was not found at "%NODE%"
  exit /b 1
)

if not exist "%TSC%" (
  echo TypeScript entrypoint was not found at "%TSC%"
  exit /b 1
)

"%NODE%" "%TSC%" --noEmit %*
exit /b %ERRORLEVEL%

