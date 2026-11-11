-- dev-reset-passwords.sql : 로컬 asseterpdb 의 모든 로그인 비밀번호를 '1111' 로 맞춘다 (개발·시험 전용)
-- 사용자 결정 2026-11-11: 회사·사용자를 바꿔 가며 시험하므로 모든 계정(사원·회사관리자·KFS 관리자, kalpa 포함)을 1111 로 통일.
-- 실행(저장소 루트에서):  psql "<asseterpdb 접속 URL>" -f AssetERP/tools/dev-reset-passwords.sql
-- DB 를 백업에서 복원했거나 시나리오로 비밀번호를 바꾼 뒤 다시 돌린다(몇 번 돌려도 같은 결과).
-- 비밀번호 규칙(복잡도·재사용 금지) 자체를 시험할 때는 그 계정만 따로 바꾼다.
--
-- 저장 위치 (TOBE 로그인 AccountMapper.xml 기준)
--   사원       : sys25_password 의 사원별 최신 sys25_seq 행, TO_ENCRYPTS(평문). 만료(90일)는 sys25_work_date 로 판정 → 오늘로
--   회사관리자 : sys02_user.sys02_passwd, TO_ENCRYPTS(평문)
--   잠금       : emp01_person.emp01_lock_yn ('true' 면 로그인 불가)
--   실패 횟수  : Redis erp:login:fail:<userId> (DB 아님 — 맨 아래 참고)

\set ON_ERROR_STOP on
BEGIN;

-- 0. 로컬 asseterpdb 가 아니면 멈춘다
DO $$
BEGIN
    IF current_database() <> 'asseterpdb' THEN
        RAISE EXCEPTION 'asseterpdb 가 아닙니다: %', current_database();
    END IF;
END $$;

-- 1. 사원: 비밀번호가 있는 사원은 최신 순번 행을 1111 로, 작업일시를 오늘로 (만료 경고·만료 없앰)
UPDATE sys25_password s
   SET sys25_pwd       = TO_ENCRYPTS('1111')
     , sys25_work_date = f_sysdate()
 WHERE s.sys25_seq = (SELECT MAX(x.sys25_seq)
                        FROM sys25_password x
                       WHERE x.sys25_person_id = s.sys25_person_id);

-- 2. 사원: 비밀번호 행이 없는 사원(그대로면 "비밀번호 미설정"으로 로그인 불가)에게 순번 1 행을 만든다
--    (퇴사자·발령 없는 사원은 비밀번호와 상관없이 로그인 단계에서 막힌다)
INSERT INTO sys25_password (sys25_password_id, sys25_company_id, sys25_person_id, sys25_seq, sys25_pwd, sys25_work_date)
SELECT f_create_seq()
     , p.emp01_company_id
     , p.emp01_person_id
     , 1
     , TO_ENCRYPTS('1111')
     , f_sysdate()
  FROM emp01_person p
 WHERE NOT EXISTS (SELECT 1 FROM sys25_password s WHERE s.sys25_person_id = p.emp01_person_id);

-- 3. 사원 잠금 해제 (emp01_person 은 바뀌는 행마다 백업 트리거가 empbak01_person 에 이력을 남긴다 → 잠긴 행만)
UPDATE emp01_person
   SET emp01_lock_yn = 'false'
 WHERE emp01_lock_yn = 'true';

-- 4. 회사관리자 (KFS 관리자 포함)
UPDATE sys02_user
   SET sys02_passwd = TO_ENCRYPTS('1111');

-- 5. 확인: 모두 0 이어야 한다
SELECT (SELECT COUNT(*) FROM emp01_person p
         WHERE NOT EXISTS (SELECT 1 FROM sys25_password s
                            WHERE s.sys25_person_id = p.emp01_person_id
                              AND s.sys25_seq = (SELECT MAX(x.sys25_seq) FROM sys25_password x WHERE x.sys25_person_id = s.sys25_person_id)
                              AND TO_DECRYPTS(s.sys25_pwd) = '1111'))          AS emp_not_1111
     , (SELECT COUNT(*) FROM emp01_person WHERE emp01_lock_yn = 'true')        AS emp_locked
     , (SELECT COUNT(*) FROM sys02_user
         WHERE TO_DECRYPTS(sys02_passwd) IS DISTINCT FROM '1111')             AS mgr_not_1111;

COMMIT;

-- 6. (선택) Redis 의 로그인 실패 횟수 지우기 — 잠금은 위 3 으로 풀렸지만, 남은 횟수가 있으면 몇 번 더 틀릴 때 다시 잠긴다.
--    성공 로그인 때도 지워지므로 보통은 필요 없다.
--    docker exec t3600_redis sh -c "redis-cli --scan --pattern 'erp:login:fail:*' | xargs -r redis-cli del"
--    (집 PC 는 omen_redis)
