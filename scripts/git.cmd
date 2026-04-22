@echo off
setlocal
set "ROOT=%~dp0.."
set "GIT=%ROOT%\.tools\PortableGit-2.54.0\cmd\git.exe"

if not exist "%GIT%" (
  echo Local git was not found at "%GIT%"
  exit /b 1
)

"%GIT%" %*
exit /b %ERRORLEVEL%
