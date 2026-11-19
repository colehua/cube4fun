# =============================================================================
# Cube4Fun Cross-Device Git Sync Helper (Windows PowerShell)
# =============================================================================
[CmdletBinding()]
param(
    [Parameter(Position=0)]
    [ValidateSet("pull", "push", "status", "serve")]
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
