#!/usr/bin/env bash
# delete-company-db-data: 가상 회사(kalpa·kova·igo) 하나의 DB 데이터를 모두 지운다. 업무분석 시나리오를 처음부터 다시 돌리기 위한 도구.
# 사용: ./tools/delete-company-db-data.sh <회사ID> [--all]   (회사ID = 서브도메인 = sys01_loc_nm, 예: kalpa)
#   (옵션 없음)  지울 행 수를 테이블별 표로만 보여 준다(dry-run, 끝에 ROLLBACK)
#   --all        그 회사 데이터를 회사 행(sys01_company)까지 한 트랜잭션으로 모두 삭제(COMMIT)
#   --sql        실행하지 않고 dry-run SQL만 출력(yunhee sql -f - --rollback 시험용)
#   -h, --help   이 도움말
# 지우는 범위(asseterpdb에는 FK가 없어 이름·값으로 찾는다):
#   0단계  *_company_id 열 = 그 회사 id 인 모든 테이블의 행 (숫자 열, sys93 같은 문자 열은 글자로 비교)
#   1단계~ 위 행들의 PK 값(전역 채번이라 회사 간에 겹치지 않음)을 *_id 열에 가진 다른 테이블의 행
#          → 사원(emp01) id에 묶인 emp02~emp35·sys26 로그인 기록, 권한(sys04) id에 묶인 sys07 등. 새 행이 없을 때까지 반복
# 안전장치: kalpa·kova·igo 만 허용(실제 회사 kfstest·admin 등은 막는다). 쓰기 전에 ./tools/db_dump_backup.sh 로 백업한다.
# 환경변수(기본값): DB_CONTAINER=<호스트명 소문자>_postgres (사무실 t3600_postgres, 집 omen_postgres)  DB_USER=kdy987  DB_NAME=asseterpdb
set -euo pipefail

HOST_LC="$(hostname -s 2>/dev/null || hostname)"; HOST_LC="${HOST_LC,,}"
CONTAINER="${DB_CONTAINER:-${HOST_LC}_postgres}"
DBUSER="${DB_USER:-kdy987}"
DBNAME="${DB_NAME:-asseterpdb}"
ALLOWED="kalpa kova igo"
MODE=dry
LOC=""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --all) MODE=all ;;
        --sql) MODE=sql ;;
        -h|--help) sed -n '2,13p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; exit 0 ;;
        -*) echo "모르는 옵션: $1 (--help)" >&2; exit 2 ;;
        *) [[ -z "$LOC" ]] || { echo "[ERROR] 회사ID는 하나만 줍니다." >&2; exit 2; }; LOC="$1" ;;
    esac
    shift
done

[[ -n "$LOC" ]] || { echo "[ERROR] 회사ID(서브도메인)가 필요합니다. 예: $0 kalpa (--help)" >&2; exit 2; }
[[ " $ALLOWED " == *" $LOC "* ]] || { echo "[ERROR] '$LOC' 는 지울 수 없습니다. 허용: $ALLOWED" >&2; exit 2; }
[[ "$LOC" =~ ^[a-z0-9]+$ ]] || { echo "[ERROR] 회사ID 형식이 이상합니다: $LOC" >&2; exit 2; }

psql_run() { docker exec -i "$CONTAINER" psql -U "$DBUSER" -d "$DBNAME" -v ON_ERROR_STOP=1 -q "$@"; }

# 회사 id 를 SQL 안에서 찾게 해서(--sql 출력도 그대로 돌게) 스크립트는 값을 넘기지 않는다.
make_sql() {
    local finish="$1"
    cat <<SQL
BEGIN;
CREATE TEMP TABLE _del (t text, col text, lvl int, n bigint) ON COMMIT DROP;
CREATE TEMP TABLE _ids (id numeric PRIMARY KEY) ON COMMIT DROP;
DO \$\$
DECLARE
    cid numeric;
    cnt int;
    r record;
    n bigint;
    pk text;
    lvl int := 0;
    before_ids bigint;
    after_ids bigint;
    do_delete boolean := ${2:-false};
BEGIN
    SELECT count(*), min(sys01_company_id) INTO cnt, cid FROM sys01_company WHERE sys01_loc_nm = '${LOC}';
    IF cnt <> 1 THEN RAISE EXCEPTION '회사 ${LOC}: sys01_company 행이 %개입니다(1개여야 함)', cnt; END IF;

    -- 0단계: 회사 열
    FOR r IN SELECT c.table_name t, c.column_name col, c.data_type dt
             FROM information_schema.columns c JOIN information_schema.tables tb USING (table_schema, table_name)
             WHERE c.table_schema = 'public' AND tb.table_type = 'BASE TABLE' AND c.column_name LIKE '%company_id'
    LOOP
        IF r.dt IN ('numeric','bigint','integer') THEN
            EXECUTE format('SELECT count(*) FROM %I WHERE %I = \$1', r.t, r.col) INTO n USING cid;
        ELSE
            EXECUTE format('SELECT count(*) FROM %I WHERE %I = \$1', r.t, r.col) INTO n USING cid::text;
        END IF;
        CONTINUE WHEN n = 0;
        INSERT INTO _del VALUES (r.t, r.col, 0, n);
        SELECT a.attname INTO pk FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = i.indkey[0]
         JOIN information_schema.columns c2 ON c2.table_schema = 'public' AND c2.table_name = r.t AND c2.column_name = a.attname
         WHERE i.indrelid = format('public.%I', r.t)::regclass AND i.indisprimary AND i.indnatts = 1
           AND c2.data_type IN ('numeric','bigint','integer');
        IF pk IS NOT NULL AND r.dt IN ('numeric','bigint','integer') THEN
            EXECUTE format('INSERT INTO _ids SELECT %I FROM %I WHERE %I = \$1 AND %I IS NOT NULL ON CONFLICT DO NOTHING', pk, r.t, r.col, pk) USING cid;
        END IF;
        pk := NULL;
    END LOOP;

    -- 1단계~: 모은 id 를 *_id 열에 가진 행 (회사 열로 이미 잡은 테이블·열은 건너뜀)
    LOOP
        lvl := lvl + 1;
        SELECT count(*) INTO before_ids FROM _ids;
        FOR r IN SELECT c.table_name t, c.column_name col
                 FROM information_schema.columns c JOIN information_schema.tables tb USING (table_schema, table_name)
                 WHERE c.table_schema = 'public' AND tb.table_type = 'BASE TABLE'
                   AND c.column_name LIKE '%\_id' AND c.column_name NOT LIKE '%company_id'
                   AND c.data_type IN ('numeric','bigint','integer')
                   AND NOT EXISTS (SELECT 1 FROM _del d WHERE d.t = c.table_name AND (d.col = c.column_name OR d.lvl = 0))
        LOOP
            EXECUTE format('SELECT count(*) FROM %I WHERE %I IN (SELECT id FROM _ids)', r.t, r.col) INTO n;
            CONTINUE WHEN n = 0;
            INSERT INTO _del VALUES (r.t, r.col, lvl, n);
            SELECT a.attname INTO pk FROM pg_index i JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = i.indkey[0]
             JOIN information_schema.columns c2 ON c2.table_schema = 'public' AND c2.table_name = r.t AND c2.column_name = a.attname
             WHERE i.indrelid = format('public.%I', r.t)::regclass AND i.indisprimary AND i.indnatts = 1
               AND c2.data_type IN ('numeric','bigint','integer');
            IF pk IS NOT NULL THEN
                EXECUTE format('INSERT INTO _ids SELECT %I FROM %I WHERE %I IN (SELECT id FROM _ids) AND %I IS NOT NULL ON CONFLICT DO NOTHING', pk, r.t, r.col, pk);
            END IF;
            pk := NULL;
        END LOOP;
        SELECT count(*) INTO after_ids FROM _ids;
        EXIT WHEN after_ids = before_ids OR lvl >= 6;
    END LOOP;

    IF do_delete THEN
        FOR r IN SELECT d.t, d.col, d.lvl, c.data_type dt FROM _del d
                 JOIN information_schema.columns c ON c.table_schema = 'public' AND c.table_name = d.t AND c.column_name = d.col
                 ORDER BY d.lvl DESC, d.t
        LOOP
            IF r.lvl = 0 AND r.dt IN ('numeric','bigint','integer') THEN
                EXECUTE format('DELETE FROM %I WHERE %I = \$1', r.t, r.col) USING cid;
            ELSIF r.lvl = 0 THEN
                EXECUTE format('DELETE FROM %I WHERE %I = \$1', r.t, r.col) USING cid::text;
            ELSE
                EXECUTE format('DELETE FROM %I WHERE %I IN (SELECT id FROM _ids)', r.t, r.col);
            END IF;
        END LOOP;
        SELECT count(*) INTO cnt FROM sys01_company WHERE sys01_loc_nm = '${LOC}';
        IF cnt <> 0 THEN RAISE EXCEPTION '회사 행이 남았습니다'; END IF;
    END IF;
END
\$\$;
SELECT lvl AS "단계", t AS "테이블", col AS "열", n AS "행수" FROM _del ORDER BY lvl, t, col;
SELECT count(*) AS "테이블·열", sum(n) AS "행 합계" FROM _del;
${finish};
SQL
}

case "$MODE" in
    sql) make_sql "ROLLBACK" false ;;
    dry)
        echo "==> dry-run: ${LOC} 에서 지울 행 (DB는 바뀌지 않음)"
        make_sql "ROLLBACK" false | psql_run ;;
    all)
        echo "==> 삭제: ${LOC} 의 DB 데이터를 모두 지웁니다 (${CONTAINER}/${DBNAME})"
        make_sql "COMMIT" true | psql_run
        echo "==> 완료. 남은 회사 행: $(psql_run -At -c "select count(*) from sys01_company where sys01_loc_nm='${LOC}'")" ;;
esac
