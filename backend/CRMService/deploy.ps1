Test-Path "\\SERVER_IP\crm-api"# ---------------------------------------------------------------------------
# deploy.ps1  —  Publish and deploy CRMService.API to a network IIS server
#
# Usage:
#   .\deploy.ps1
#   .\deploy.ps1 -ServerPath "\\192.168.1.50\sites\crm-api"
# ---------------------------------------------------------------------------

param(
    # UNC path to the IIS site root on the target machine
    [string]$ServerPath = "\\YOUR_SERVER_IP\crm-api"
)

$ErrorActionPreference = "Stop"

$ProjectFile = "$PSScriptRoot\CRMService.API\CRMService.API.csproj"
$PublishDir  = "$PSScriptRoot\.publish"
$Offline     = Join-Path $ServerPath "app_offline.htm"

# ── 1. Publish ──────────────────────────────────────────────────────────────
Write-Host "`n[1/4] Publishing..." -ForegroundColor Cyan

dotnet publish $ProjectFile -c Release -o $PublishDir --nologo -v quiet
if ($LASTEXITCODE -ne 0) { throw "dotnet publish failed." }

Write-Host "      Done." -ForegroundColor Green

# ── 2. Take app offline ─────────────────────────────────────────────────────
Write-Host "`n[2/4] Taking app offline..." -ForegroundColor Cyan

if (-not (Test-Path $ServerPath)) {
    throw "Cannot reach server path: $ServerPath`nMake sure the network share is accessible."
}

"<h1>Deploying, back in a moment...</h1>" | Out-File -FilePath $Offline -Encoding utf8
Start-Sleep -Seconds 2   # give IIS a moment to notice

Write-Host "      Done." -ForegroundColor Green

# ── 3. Copy files ───────────────────────────────────────────────────────────
Write-Host "`n[3/4] Copying files to $ServerPath ..." -ForegroundColor Cyan

robocopy $PublishDir $ServerPath /MIR /NFL /NDL /NJH /NJS /nc /ns /np
# robocopy exit codes 0-7 are success (8+ are errors)
if ($LASTEXITCODE -ge 8) { throw "robocopy failed with exit code $LASTEXITCODE." }

Write-Host "      Done." -ForegroundColor Green

# ── 4. Bring app back online ────────────────────────────────────────────────
Write-Host "`n[4/4] Bringing app back online..." -ForegroundColor Cyan

Remove-Item -Path $Offline -Force

Write-Host "      Done.`n" -ForegroundColor Green
Write-Host "Deployment complete!" -ForegroundColor Green
