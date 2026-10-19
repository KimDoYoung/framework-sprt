#!/usr/bin/env bash
# usage: .claude/hooks/yunhee-guard.test.sh  — psql 가드 시험. 기대: block / allow
H="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/yunhee-guard.sh"
fail=0
t() {
  want=$1; shift
  got=$(printf '%s' "$1" | jq -Rs '{tool_input:{command:.}}' | "$H" | jq -r '.hookSpecificOutput.permissionDecision // "allow"')
  [ "$got" = deny ] && got=block
  [ -z "$got" ] && got=allow
  if [ "$got" = "$want" ]; then s=OK; else s=FAIL; fail=1; fi
  printf '%-5s want=%-5s got=%-5s %s\n' "$s" "$want" "$got" "$1"
}
t block 'psql -h localhost -U kdy987 -d asseterpdb -c "select 1"'
t block 'cd x && psql "$LOCAL_DB" -c "select 1"'
t block 'docker exec omen_postgres psql -U kdy987 -c "select 1"'
t block 'docker compose exec db psql -U u'
t block 'echo hi | psql'
t block 'sudo -u postgres psql'
t block 'pg_dump asseterpdb'
t block 'PGPASSWORD=x; psql -c 1'
t allow 'yunhee sql "select 1"'
t allow 'yunhee run "psql -c x"'
t allow 'git commit -m "psql 차단 훅"'
t allow 'ls /usr/bin | grep psql'
t allow 'which psql'
t allow 'echo "use psql later"'
t allow 'curl -s -d "psql ok" ntfy.sh/x'
# 2026-10-19 완화: heredoc 본문·따옴표 인자 안의 문구는 통과, 실제 읽기 명령은 계속 차단
t allow $'cat > docs/work/F/x.md <<\'EOF\'\ntail -3 docs/08-회차인계.md\ngrep -A3 x frontend/src/a.tsx\nEOF'
t allow $'python3 - <<\'EOF\'\n# sed -n 1,5p backend/src/main/java/A.java\nEOF'
t allow 'echo "tail -3 frontend/src/a.tsx"'
t allow 'git commit -m "cat frontend/src/a.tsx 설명"'
t block 'cat frontend/src/pages/apr/A.tsx'
t block 'tail -3 docs/as-is/src/apr/screens/A.md'
t block $'cat > x.md <<\'EOF\'\nhi\nEOF\ncat frontend/src/a.tsx'
t block 'grep -n x frontend/src/a.tsx -A3'
exit $fail
