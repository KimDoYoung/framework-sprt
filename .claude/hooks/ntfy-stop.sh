#!/bin/bash
# Claude Code Stop hook: ntfy notification
curl -s -d "claude message: [framework-sprt] 작업 끝 남" ntfy.sh/asseterp-framework-gwtgxt-2-sbreact-2026 >/dev/null 2>&1 || true
exit 0
