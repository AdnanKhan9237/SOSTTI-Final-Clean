param(
  [Parameter(Mandatory=$true)][string]$In,
  [Parameter(Mandatory=$true)][string]$Out
)
$bytes = [System.IO.File]::ReadAllBytes((Resolve-Path -LiteralPath $In))
# Strip UTF-8 BOM if present
if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
  $bytes = $bytes[3..($bytes.Length-1)]
}
$j = [Text.Encoding]::UTF8.GetString($bytes)
$outTxt = 'window.OPEN_PDFS = ' + $j + ';'
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText((Resolve-Path -LiteralPath $Out), $outTxt, $utf8NoBom)
Write-Host "Wrote inline JS (no BOM): $Out"
