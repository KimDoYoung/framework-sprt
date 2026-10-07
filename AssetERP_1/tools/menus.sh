#!/usr/bin/env bash
# 메뉴 트리 비교: 로그인 → GET /api/v1/sys/menus의 1·2·3차 개수와 JSON 해시 → 로그아웃
# 사용: tools/menus.sh <base> <host:port> <user> <pass> <company>
#   예) tools/menus.sh http://localhost:8082/AssetERP_1 localhost:8082 admin 1111 admin
#       tools/menus.sh http://localhost:8082/OMS        localhost:8082 admin 1111 admin   # 이전 회차와 비교
# 주의: 같은 계정으로 로그인하므로 그 계정의 다른 세션은 중복 로그인 차단으로 끊길 수 있다
B=$1; H="Host: admin.$2"; J=$(mktemp)
curl -s -c $J -H "$H" -H 'Content-Type: application/json' -d "{\"username\":\"$3\",\"password\":\"$4\",\"companyCode\":\"$5\"}" $B/api/auth/login | python3 -c "import sys,json; d=json.load(sys.stdin); print('login', d['success'], d.get('message'))"
curl -s -b $J -H "$H" $B/api/v1/sys/menus | python3 -c "
import sys,json,hashlib; d=json.load(sys.stdin)['data']
l2=sum(len(a['groups']) for a in d); l3=[i['code'] for a in d for g in a['groups'] for i in g['items']]
print('L1',len(d),'L2',l2,'L3',len(l3),'hash',hashlib.md5(json.dumps(d,sort_keys=True,ensure_ascii=False).encode()).hexdigest()[:10])"
curl -s -o /dev/null -b $J -H "$H" -X POST $B/api/auth/logout; rm -f $J
