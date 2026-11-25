# =============================================================================
# Cube4Fun Cross-Device Git Sync Helper (Windows PowerShell)
# =============================================================================
[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [ValidateSet("pull", "push", "sync", "status", "check", "serve")]
    [string]$Action = "status",

    [Parameter(Position=1)]
    [string]$Message = "Update project files",

    [Parameter(Position=2)]
    [int]$Port = 8080
)

$RepoDir = $PSScriptRoot
Set-Location $RepoDir

switch ($Action) {
    "pull" {
        Write-Host "🔄 Pulling latest changes from origin main..." -ForegroundColor Cyan
        git pull origin main
        Write-Host "✅ Up to date with origin main." -ForegroundColor Green
    }
    "push" {
        Write-Host "📦 Staging changes..." -ForegroundColor Cyan
        git add .
        $diff = git status --porcelain
        if ([string]::IsNullOrWhiteSpace($diff)) {
            Write-Host "ℹ️ No changes to commit." -ForegroundColor Yellow
        } else {
            Write-Host "💾 Committing: $Message" -ForegroundColor Cyan
            git commit -m $Message
        }
        Write-Host "🚀 Pushing to origin main..." -ForegroundColor Cyan
        git push origin main
        Write-Host "✅ Successfully synced to GitHub!" -ForegroundColor Green
    }
    "sync" {
        Write-Host "🔄 Pulling latest changes from origin main..." -ForegroundColor Cyan
        git pull origin main
        Write-Host "📦 Staging changes..." -ForegroundColor Cyan
        git add .
        $diff = git status --porcelain
        if ([string]::IsNullOrWhiteSpace($diff)) {
            Write-Host "ℹ️ No changes to commit." -ForegroundColor Yellow
        } else {
            Write-Host "💾 Committing: $Message" -ForegroundColor Cyan
            git commit -m $Message
            Write-Host "🚀 Pushing to origin main..." -ForegroundColor Cyan
            git push origin main
            Write-Host "✅ Successfully synced to GitHub!" -ForegroundColor Green
        }
    }
    "check" {
        Write-Host "🔍 Checking environment readiness..." -ForegroundColor Cyan
        $name = git config user.name
        $email = git config user.email
        if ($name -and $email) {
            Write-Host "✅ Git Author: $name <$email>" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Git Author: Not configured" -ForegroundColor Yellow
        }
        git ls-remote --exit-code origin HEAD *> $null
        if ($LASTEXITCODE -eq 0) {
            $remoteUrl = git remote get-url origin
            Write-Host "✅ Git Remote: Connected to $remoteUrl" -ForegroundColor Green
        } else {
            Write-Host "⚠️ Git Remote: Could not reach origin" -ForegroundColor Yellow
        }
        if (Get-Command gh -ErrorAction SilentlyContinue) {
            $ghVer = (gh --version | Select-Object -First 1)
            Write-Host "✅ GitHub CLI: $ghVer" -ForegroundColor Green
        } else {
            Write-Host "⚠️ GitHub CLI: Not installed" -ForegroundColor Yellow
        }
        if (Get-Command python -ErrorAction SilentlyContinue) {
            $pyVer = (python --version)
            Write-Host "✅ Python: $pyVer" -ForegroundColor Green
        } else {
            Write-Host "❌ Python: Not installed" -ForegroundColor Red
        }
        if (Get-Command node -ErrorAction SilentlyContinue) {
            $nodeVer = (node --version)
            Write-Host "✅ Node.js: $nodeVer" -ForegroundColor Green
        } else {
            Write-Host "❌ Node.js: Not installed" -ForegroundColor Red
        }
    }
    "status" {
        Write-Host "📍 Directory: $RepoDir" -ForegroundColor Cyan
        $branch = git rev-parse --abbrev-ref HEAD
        Write-Host "🌿 Branch: $branch" -ForegroundColor Cyan
        git status -s
        Write-Host "`nRecent commits:" -ForegroundColor Gray
        git log -n 3 --oneline
    }
    "serve" {
        Write-Host "🌐 Starting preview server on http://localhost:$Port..." -ForegroundColor Cyan
        python -m http.server $Port
    }
}
