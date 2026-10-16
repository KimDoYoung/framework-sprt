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
exit $fail
