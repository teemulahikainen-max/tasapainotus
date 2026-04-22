param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$workspace = Split-Path -Parent $PSScriptRoot
$gitPath = Join-Path $workspace ".tools\\PortableGit-2.54.0\\cmd\\git.exe"

if (-not (Test-Path $gitPath)) {
  throw "Local git was not found at $gitPath"
}

& $gitPath @Args
$global:LASTEXITCODE = $LASTEXITCODE
exit $LASTEXITCODE
