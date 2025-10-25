param(
  [Parameter(Mandatory=$true)][string]$In,
  [Parameter(Mandatory=$true)][string]$Out
)
$j = Get-Content -Raw -LiteralPath $In
$outTxt = 'window.OPEN_PDFS = ' + $j + ';'
Set-Content -LiteralPath $Out -Value $outTxt -Encoding UTF8
Write-Host "Wrote inline JS: $Out"