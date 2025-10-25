param(
  [string]$Output = "../js/resources-open.json"
)

$ErrorActionPreference = "Stop"

# Helpers
function Get-PdfLinksFromPage {
  param(
    [string]$Url,
    [string]$Tag,
    [int]$Max = 50
  )
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 30
  } catch {
    return @()
  }
  $base = [Uri]$Url
  $pdfs = @()
  foreach ($l in $resp.Links) {
    if ($null -ne $l.href -and $l.href -match "\.pdf(\?|$)") {
      try {
        $abs = if ([Uri]::IsWellFormedUriString($l.href,[UriKind]::Absolute)) { $l.href } else { (New-Object System.Uri($base, $l.href)).AbsoluteUri }
      } catch { continue }
      $pdfs += $abs
    }
  }
  $pdfs = $pdfs | Select-Object -Unique | Select-Object -First $Max
  $out = @()
  foreach ($u in $pdfs) {
    try {
      $head = Invoke-WebRequest -Uri $u -Method Head -UseBasicParsing -TimeoutSec 20 -ErrorAction Stop
      if ($head.StatusCode -ge 200 -and $head.StatusCode -lt 400 -and ($head.Headers["Content-Type"] -like "application/pdf*")) {
        $title = [System.IO.Path]::GetFileNameWithoutExtension(([Uri]$u).AbsolutePath) -replace "[_-]"," "
        $out += [PSCustomObject]@{ title=$title; desc=$Url; iconClass="fa-solid fa-file-pdf"; url=$u; tags=@($Tag) }
      }
    } catch {
      # Fallback to GET small range to validate
      try {
        $get = Invoke-WebRequest -Uri $u -Method Get -UseBasicParsing -MaximumRedirection 2 -TimeoutSec 20 -Headers @{Range='bytes=0-64'}
        if ($get.StatusCode -ge 200 -and $get.StatusCode -lt 400 -and ($get.Headers["Content-Type"] -like "application/pdf*" -or $get.RawContentStream)) {
          $title = [System.IO.Path]::GetFileNameWithoutExtension(([Uri]$u).AbsolutePath) -replace "[_-]"," "
          $out += [PSCustomObject]@{ title=$title; desc=$Url; iconClass="fa-solid fa-file-pdf"; url=$u; tags=@($Tag) }
        }
      } catch {}
    }
  }
  return $out
}

# Seeds by category (reputable open-access domains)
$seeds = @(
  @{ Tag="cyber"; Url="https://csrc.nist.gov/publications/sp800" },
  @{ Tag="ai"; Url="https://mml-book.github.io/" },
  @{ Tag="ai"; Url="https://d2l.ai/" },
  @{ Tag="computer"; Url="https://pages.cs.wisc.edu/~remzi/OSTEP/" },
  @{ Tag="computer"; Url="http://linuxcommand.org/tlcl.php" },
  @{ Tag="web"; Url="https://eloquentjavascript.net/" },
  @{ Tag="computer"; Url="http://opendatastructures.org/" },
  @{ Tag="computer"; Url="https://greenteapress.com/" },
  @{ Tag="computer"; Url="https://github.com/progit/progit2/releases" },
  @{ Tag="ai"; Url="https://www.cs.cornell.edu/jeh/" },
  @{ Tag="electrician"; Url="https://www.navsea.navy.mil/Home/Warfighter-Training/NAVEDTRA/" },
  @{ Tag="electrician"; Url="https://maritime.org/doc/" },
  @{ Tag="solar"; Url="https://www.nrel.gov/publications.html" },
  @{ Tag="solar"; Url="https://www.nrel.gov/research/publications.html" },
  @{ Tag="hvacr"; Url="https://www.energy.gov/eere/buildings/building-energy-codes-program" },
  @{ Tag="welding"; Url="https://www.osha.gov/publications" },
  @{ Tag="auto"; Url="https://www.nhtsa.gov/vehicle-manufacturers" },
  @{ Tag="machinist"; Url="https://www.osha.gov/sites/default/files/publications.html" },
  @{ Tag="english"; Url="https://www.plainlanguage.gov/resources/" }
)

$results = @()
foreach ($s in $seeds) {
  $results += Get-PdfLinksFromPage -Url $s.Url -Tag $s.Tag -Max 100
}

# Dedupe by URL and keep up to 100
$seen = @{}
$unique = @()
foreach ($r in $results) {
  if (-not $seen.ContainsKey($r.url)) { $seen[$r.url] = $true; $unique += $r }
}
if ($unique.Count -gt 100) { $unique = $unique | Select-Object -First 100 }

# Map tags to course categories and icons where possible
function Map-Icon {
  param([string]$tag)
  switch ($tag) {
    'computer' { 'fa-solid fa-computer' }
    'graphics' { 'fa-solid fa-palette' }
    'web' { 'fa-solid fa-globe' }
    'cyber' { 'fa-solid fa-shield-halved' }
    'ai' { 'fa-solid fa-robot' }
    'english' { 'fa-solid fa-language' }
    'auto' { 'fa-solid fa-car' }
    'hvacr' { 'fa-solid fa-snowflake' }
    'welding' { 'fa-solid fa-industry' }
    'motorcycle' { 'fa-solid fa-motorcycle' }
    'machinist' { 'fa-solid fa-gear' }
    'electrician' { 'fa-solid fa-bolt' }
    'mobile' { 'fa-solid fa-mobile-screen' }
    'solar' { 'fa-solid fa-solar-panel' }
    default { 'fa-solid fa-file-pdf' }
  }
}
$final = $unique | ForEach-Object {
  $_.iconClass = Map-Icon -tag ($_.tags[0]); $_
}

# Ensure directory
$outPath = Join-Path -Path $PSScriptRoot -ChildPath $Output
$outDir = Split-Path -Parent $outPath
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$final | ConvertTo-Json -Depth 5 | Out-File -FilePath $outPath -Encoding UTF8
Write-Host "Wrote $($final.Count) links to $outPath"