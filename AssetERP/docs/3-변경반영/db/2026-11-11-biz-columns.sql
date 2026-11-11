-- 3-변경반영 2026-11-11: AS-IS 11-06 이익제공 변경(9cb0efcef 거래상대방 필수입력 체크, c0b1e1146 법인카드 상신)이 쓰는 열을 로컬 asseterpdb에 더한다.
-- 원본 저장소에 DDL이 없어 원본 SQL 쓰임새로 타입을 정했다:
--   biz90_target_info_req_yn — COALESCE(…,'false') = 'true'로 비교, 그리드 Boolean. 다른 _yn 열(biz01_close_yn·biz02_emp_yn)과 같은 VARCHAR(5), 기본값 없음(NULL = false)
--   biz01_appr_id            — UPDATE … SET biz01_appr_id = #{apprId}, apr01_appr.apr01_appr_id와 조인. biz01_appr_id1~3과 같은 NUMERIC
-- 실행 전 백업: data/backup/db/asseterpdb-20261111-155845.dump
-- 실행: docker exec -i t3600_postgres psql -U kdy987 -d asseterpdb -X -q < AssetERP/docs/3-변경반영/db/2026-11-11-biz-columns.sql
BEGIN;
ALTER TABLE biz90_limit ADD COLUMN IF NOT EXISTS biz90_target_info_req_yn VARCHAR(5);
COMMENT ON COLUMN biz90_limit.biz90_target_info_req_yn IS '거래상대방 필수입력 여부';
ALTER TABLE biz01_promo ADD COLUMN IF NOT EXISTS biz01_appr_id NUMERIC;
COMMENT ON COLUMN biz01_promo.biz01_appr_id IS '상신 결재문서 ID(법인카드 일괄 상신)';
COMMIT;
