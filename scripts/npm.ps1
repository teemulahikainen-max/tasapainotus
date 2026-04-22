param(
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]]$Args
)

$workspace = Split-Path -Parent $PSScriptRoot
$npmPath = Join-Path $workspace ".tools\\node-v24.14.1-win-x64\\npm.cmd"

if (-not (Test-Path $npmPath)) {
  throw "Local npm was not found at $npmPath"
}

& $npmPath @Args
$global:LASTEXITCODE = $LASTEXITCODE
exit $LASTEXITCODE

