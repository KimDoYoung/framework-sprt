#!/usr/bin/env bash
# RD 시뮬레이터 실행/중지: tools/run-rd-server.sh {start|stop|restart|status|logs|calls}
# 설정은 환경변수(RD_SIM_PORT, RD_SIM_ROOT, RD_SIM_FAIL, RD_SIM_HTTPS_KEY/CERT)로 준다 — tools/rd-simulator/README.md
set -euo pipefail
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/rd-simulator" && pwd)"
PID="$DIR/.rd.pid"; LOG="$DIR/.rd.log"
PORT="${RD_SIM_PORT:-5151}"

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
  calls) curl -s "http://localhost:$PORT/__calls${2:+?mrd=$2}" ;;
  *) echo "사용: $0 {start|stop|restart|status|logs [줄수]|calls [mrd]}"; exit 2 ;;
esac
