#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
export PATH="$PROJECT_DIR/.tools/node/bin:$PATH"
exec npm start -- "$@"

