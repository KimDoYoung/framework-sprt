-- 3-변경반영 2026-11-12: AS-IS 11-11 dec60a5e6 "임직원매매 투자한도 체크안함 설정 추가"가 쓰는 열을 로컬 asseterpdb에 더한다.
-- 원본 저장소에 DDL이 없어 원본 SQL 쓰임새로 타입을 정했다(테스트 DB의 실제 타입은 사용자 확인 필요):
--   flt01_company_std.flt01_invest_limit_no_check_yn — 모델 Boolean(investLimitNoCheckYn), SQL이 COALESCE(…,'false')·= 'true'로 비교.
--                                          같은 테이블의 flt01_invest_limit_unvisible_yn·flt01_invest_amt_over_check_yn과 같은 VARCHAR(5), 기본값 없음(NULL = false)
--   flt02_emp 쪽 열은 만들지 않는다 — flt02_emp.selectById·selectInvestLimit이 flt01_company_std에서 읽어 모델에 싣는다.
-- 실행 전 백업: tools/db_dump_backup.sh
-- 실행: docker exec -i omen_postgres psql -U kdy987 -d asseterpdb -X -q < AssetERP/docs/3-변경반영/db/2026-11-12-flt-columns.sql
BEGIN;
ALTER TABLE flt01_company_std ADD COLUMN IF NOT EXISTS flt01_invest_limit_no_check_yn VARCHAR(5);
COMMENT ON COLUMN flt01_company_std.flt01_invest_limit_no_check_yn IS '투자한도 체크안함';
COMMIT;
