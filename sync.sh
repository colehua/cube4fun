#!/usr/bin/env bash
# =============================================================================
# Cube4Fun Cross-Device Git Sync Helper (Linux / Google Cloud Shell)
# =============================================================================
set -e

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$REPO_DIR"

ACTION="${1:-status}"

case "$ACTION" in
  pull)
    echo "🔄 Pulling latest changes from origin main..."
    git pull origin main
    echo "✅ Up to date with origin main."
    ;;

  push)
    MSG="${2:-Update project files}"
    echo "📦 Staging changes..."
    git add .
    if git diff --staged --quiet; then
      echo "ℹ️ No changes to commit."
    else
      echo "💾 Committing: $MSG"
      git commit -m "$MSG"
    fi
    echo "🚀 Pushing to origin main..."
    git push origin main
    echo "✅ Successfully synced to GitHub!"
    ;;

  status)
    echo "📍 Working directory: $REPO_DIR"
    echo "🌿 Branch: $(git rev-parse --abbrev-ref HEAD)"
    git status -s
    echo ""
    echo "Recent commits:"
    git log -n 3 --oneline
    ;;

  sync)
    MSG="${2:-Auto-sync project changes}"
    echo "🔄 Pulling latest changes from origin main..."
    git pull origin main
    echo "📦 Staging changes..."
    git add .
    if git diff --staged --quiet; then
      echo "ℹ️ No changes to commit."
    else
      echo "💾 Committing: $MSG"
      git commit -m "$MSG"
      echo "🚀 Pushing to origin main..."
      git push origin main
      echo "✅ Successfully synced to GitHub!"
    fi
    ;;

  check)
    echo "🔍 Checking environment readiness..."
    NAME=$(git config user.name || true)
    EMAIL=$(git config user.email || true)
    if [ -n "$NAME" ] && [ -n "$EMAIL" ]; then
      echo "✅ Git Author: $NAME <$EMAIL>"
    else
      echo "⚠️ Git Author: Not configured"
    fi

    if git ls-remote --exit-code origin HEAD >/dev/null 2>&1; then
      echo "✅ Git Remote: Connected to $(git remote get-url origin)"
    else
      echo "⚠️ Git Remote: Could not reach origin"
    fi

    if command -v gh >/dev/null 2>&1; then
      echo "✅ GitHub CLI: $(gh --version | head -n 1)"
    else
      echo "⚠️ GitHub CLI: Not installed"
    fi

    if command -v git-lfs >/dev/null 2>&1; then
      echo "✅ Git LFS: $(git-lfs version | head -n 1)"
    else
      echo "⚠️ Git LFS: Not installed"
    fi

    if command -v python3 >/dev/null 2>&1; then
      echo "✅ Python 3: $(python3 --version)"
    else
      echo "❌ Python 3: Not installed"
    fi

    if command -v node >/dev/null 2>&1; then
      echo "✅ Node.js: $(node --version)"
    else
      echo "❌ Node.js: Not installed"
    fi

    if command -v cloudshell >/dev/null 2>&1; then
      echo "✅ Cloud Shell CLI: Available"
    fi
    ;;

  serve)
    PORT="${2:-8080}"
    echo "🌐 Starting web server on http://localhost:$PORT..."
    echo "Press Ctrl+C to stop."
    python3 -m http.server "$PORT"
    ;;

  open)
    echo "💻 Opening Cloud Shell workspace at $REPO_DIR..."
    cloudshell workspace "$REPO_DIR"
    ;;

  *)
    echo "Usage: ./sync.sh [pull | push "commit message" | sync "commit message" | status | check | serve [port] | open]"
    exit 1
    ;;
esac
