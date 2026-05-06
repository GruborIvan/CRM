# ---------------------------------------------------------------------------
# server-setup.ps1  —  Run this ONCE on the IIS server (as Administrator)
#
# What it does:
#   - Creates the deployment folder
#   - Shares it on the network so deploy.ps1 can copy files to it
#   - Creates an IIS App Pool (No Managed Code)
#   - Creates an IIS Site bound to port 5000
#   - Opens port 5000 in the firewall
# ---------------------------------------------------------------------------

$ErrorActionPreference = "Stop"

# ── Config — adjust these if needed ─────────────────────────────────────────
$SiteName    = "crm-api"
$AppPool     = "crm-api-pool"
$DeployPath  = "C:\inetpub\crm-api"
$Port        = 5000
$ShareName   = "crm-api"          # network share name  →  \\THIS_PC\crm-api
# ────────────────────────────────────────────────────────────────────────────

Import-Module WebAdministration

# 1. Create deploy folder
Write-Host "[1/5] Creating deployment folder..." -ForegroundColor Cyan
New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
Write-Host "      $DeployPath" -ForegroundColor Green

# 2. Share the folder so deploy.ps1 can reach it over the network
Write-Host "`n[2/5] Creating network share '$ShareName'..." -ForegroundColor Cyan
$existing = Get-SmbShare -Name $ShareName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "      Share already exists, skipping." -ForegroundColor Yellow
} else {
    New-SmbShare -Name $ShareName -Path $DeployPath -FullAccess "Everyone"
    Write-Host "      \\$env:COMPUTERNAME\$ShareName" -ForegroundColor Green
}

# 3. Create App Pool (No Managed Code — required for ASP.NET Core)
Write-Host "`n[3/5] Creating App Pool '$AppPool'..." -ForegroundColor Cyan
if (Test-Path "IIS:\AppPools\$AppPool") {
    Write-Host "      Already exists, skipping." -ForegroundColor Yellow
} else {
    New-WebAppPool -Name $AppPool
    Set-ItemProperty "IIS:\AppPools\$AppPool" -Name managedRuntimeVersion -Value ""
    Set-ItemProperty "IIS:\AppPools\$AppPool" -Name startMode -Value "AlwaysRunning"
    Write-Host "      Done." -ForegroundColor Green
}

# 4. Create IIS Site
Write-Host "`n[4/5] Creating IIS Site '$SiteName' on port $Port..." -ForegroundColor Cyan
if (Get-Website -Name $SiteName -ErrorAction SilentlyContinue) {
    Write-Host "      Already exists, skipping." -ForegroundColor Yellow
} else {
    New-Website -Name $SiteName -PhysicalPath $DeployPath -Port $Port -ApplicationPool $AppPool
    Write-Host "      Done." -ForegroundColor Green
}

# 5. Open firewall port
Write-Host "`n[5/5] Opening firewall port $Port..." -ForegroundColor Cyan
$rule = Get-NetFirewallRule -DisplayName "CRM API" -ErrorAction SilentlyContinue
if ($rule) {
    Write-Host "      Rule already exists, skipping." -ForegroundColor Yellow
} else {
    New-NetFirewallRule -DisplayName "CRM API" -Direction Inbound -Protocol TCP -LocalPort $Port -Action Allow | Out-Null
    Write-Host "      Done." -ForegroundColor Green
}

Write-Host "`nServer setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Network share path for deploy.ps1:" -ForegroundColor White
Write-Host "  \\$env:COMPUTERNAME\$ShareName   (or use the server's IP)" -ForegroundColor Yellow
Write-Host ""
Write-Host "App will be available at:" -ForegroundColor White
Write-Host "  http://$env:COMPUTERNAME`:$Port" -ForegroundColor Yellow
