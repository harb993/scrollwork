#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_BIN=""
BACKEND_PID=""
WEB_PID=""

if [[ -x "$ROOT_DIR/.venv/Scripts/python.exe" ]]; then
  PYTHON_BIN="$ROOT_DIR/.venv/Scripts/python.exe"
elif [[ -x "$ROOT_DIR/.venv/bin/python" ]]; then
  PYTHON_BIN="$ROOT_DIR/.venv/bin/python"
else
  PYTHON_BIN="python"
fi

cleanup() {
  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  if [[ -n "$WEB_PID" ]] && kill -0 "$WEB_PID" 2>/dev/null; then
    kill "$WEB_PID" 2>/dev/null || true
  fi
}

trap cleanup EXIT INT TERM

start_backend() {
  cd "$ROOT_DIR/backend"
  "$PYTHON_BIN" main.py &
  BACKEND_PID=$!
  echo "Backend started on http://127.0.0.1:8000"
}

start_web() {
  cd "$ROOT_DIR/web"
  "$PYTHON_BIN" -m http.server 8080 &
  WEB_PID=$!
  echo "Web server started on http://127.0.0.1:8080"
}

start_mobile() {
  cd "$ROOT_DIR/mobile"
  npx expo start -c
}

case "${1:-all}" in
  all)
    start_backend
    start_web
    start_mobile
    ;;
  backend)
    cd "$ROOT_DIR/backend"
    "$PYTHON_BIN" main.py
    ;;
  web)
    cd "$ROOT_DIR/web"
    "$PYTHON_BIN" -m http.server 8080
    ;;
  mobile)
    cd "$ROOT_DIR/mobile"
    npx expo start -c
    ;;
  *)
    echo "Usage: ./run.sh [all|backend|web|mobile]"
    exit 1
    ;;
esac
