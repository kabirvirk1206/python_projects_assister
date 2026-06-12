#!/usr/bin/env bash
# starts the backend and serves the frontend statically
# usage: ./run_dev.sh

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "=== Serialscope dev server ==="

# backend
cd "$ROOT/backend"
if [ ! -d ".venv" ]; then
  echo "[backend] creating virtual environment..."
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -q -r requirements.txt
echo "[backend] starting fastapi on http://localhost:8000 ..."
uvicorn app:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!

# frontend (just a static file server)
cd "$ROOT/frontend"
echo "[frontend] serving on http://localhost:3000 ..."
python3 -m http.server 3000 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

echo ""
echo "backend : http://localhost:8000"
echo "frontend: http://localhost:3000"
echo "press Ctrl-C to stop both."
wait
