@echo off
setlocal
set "ROOT=%~dp0.."
set "NPM=%ROOT%\.tools\node-v24.14.1-win-x64\npm.cmd"

if not exist "%NPM%" (
  echo Local npm was not found at "%NPM%"
  exit /b 1
)

call "%NPM%" %*
exit /b %ERRORLEVEL%

