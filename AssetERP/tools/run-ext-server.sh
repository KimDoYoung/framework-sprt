#!/usr/bin/env bash
# 외부 연동 시뮬레이터(AI 점검의견·새 메일 시스템) 실행/중지: tools/run-ext-server.sh {start|stop|restart|status|logs|calls|reset}
# 설정은 환경변수(EXT_SIM_HOST, EXT_SIM_PORT, EXT_SIM_FAIL, EXT_SIM_MAIL_TOKEN, EXT_SIM_BOT_DELAY_MS) — tools/ext-simulator/README.md
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/ext-simulator" && pwd)"
PID="$DIR/.ext.pid"; LOG="$DIR/.ext.log"
PORT="${EXT_SIM_PORT:-5171}"

running() { [[ -f "$PID" ]] && kill -0 "$(cat "$PID")" 2>/dev/null; }

case "${1:-status}" in
  start)
    if running; then echo "이미 실행 중 (pid $(cat "$PID"), port $PORT)"; exit 0; fi
    nohup node "$DIR/server.js" >"$LOG" 2>&1 &
    echo $! >"$PID"; sleep 0.5
    if running; then echo "시작: pid $(cat "$PID"), $(head -1 "$LOG")"; else echo "시작 실패 — $LOG"; cat "$LOG"; rm -f "$PID"; exit 1; fi ;;
  stop)
    if running; then kill "$(cat "$PID")"; rm -f "$PID"; echo "중지"; else rm -f "$PID"; echo "실행 중 아님"; fi ;;
  restart) "$0" stop; "$0" start ;;
  status)
    if running; then echo "실행 중 (pid $(cat "$PID")) — $(curl -s "http://localhost:$PORT/__health" || echo 'health 응답 없음')"; else echo "중지됨"; fi ;;
  logs) tail -n "${2:-30}" "$LOG" ;;
  calls) curl -s "http://localhost:$PORT/__calls${2:+?kind=$2}" ;;
  reset) curl -s "http://localhost:$PORT/__reset" ;;
  *) echo "사용: $0 {start|stop|restart|status|logs [줄수]|calls [bot|mail-write|mail-send]|reset}"; exit 2 ;;
esac
