-- 3-변경반영 2026-11-11: AS-IS 11-04~05 회사 설정 두 가지(16b52c5e2 고객사 임직원준수점검 상신자 구분, ff05be9ff 책무이행점검 증빙 연결문서만)가 쓰는
-- 열·코드를 로컬 asseterpdb에 더한다. 원본 저장소에 DDL이 없어 원본 SQL 쓰임새로 타입을 정했다:
--   sys01_comply_appr_reg_emp_type      — f_cdnm('ApprRegEmpType', …)로 이름을 읽고 화면이 "1"과 비교(1 = 작성자가 직접 결재요청 A53).
--                                          같은 종류의 sys01_ics_check_confirmer_type·sys01_ics_comply_cycle_type처럼 VARCHAR(1)
--   sys01_tdm_evid_only_relate_dcr_yn   — 그리드 Boolean(책무증빙자료 불러오기 연결문서만). 다른 _yn 열과 같은 VARCHAR(5), 기본값 없음(NULL = false)
--   코드 종류 ApprRegEmpType            — 원본에 코드 값이 없다. 화면은 '1'만 쓴다. 이름은 추정(사용자 확인 필요):
--                                          1 = 작성자, 2 = 확인자(부서장) — 비어 있으면 지금처럼 [제출]·확인자 상신(#1311 A52)
-- 실행 전 백업: tools/db_dump_backup.sh
-- 실행: docker exec -i omen_postgres psql -U kdy987 -d asseterpdb -X -q < AssetERP/docs/3-변경반영/db/2026-11-11-sys01-comply-columns.sql
BEGIN;
ALTER TABLE sys01_company ADD COLUMN IF NOT EXISTS sys01_comply_appr_reg_emp_type VARCHAR(1);
COMMENT ON COLUMN sys01_company.sys01_comply_appr_reg_emp_type IS '임직원준수점검 상신자 구분(ApprRegEmpType)';
ALTER TABLE sys01_company ADD COLUMN IF NOT EXISTS sys01_tdm_evid_only_relate_dcr_yn VARCHAR(5);
COMMENT ON COLUMN sys01_company.sys01_tdm_evid_only_relate_dcr_yn IS '책무증빙자료 불러오기 연결문서만';

-- 코드 종류·코드 (회사 0 = 공통, IcsCheckListConfirmerType과 같은 모양)
INSERT INTO sys08_code_kind (sys08_code_kind_id, sys08_kind_cd, sys08_kind_nm, sys08_sys_yn)
SELECT f_create_seq(), 'ApprRegEmpType', '임직원준수점검 상신자 구분', 'true'
 WHERE NOT EXISTS (SELECT 1 FROM sys08_code_kind WHERE sys08_kind_cd = 'ApprRegEmpType');
INSERT INTO sys09_code (sys09_code_id, sys09_code, sys09_name, sys09_seq, sys09_apply_date, sys09_code_kind_id, sys09_company_id)
SELECT f_create_seq(), v.code, v.name, v.seq, '1910-01-01', k.sys08_code_kind_id, 0
  FROM sys08_code_kind k
       CROSS JOIN (VALUES ('1', '작성자', '1'), ('2', '확인자', '2')) AS v(code, name, seq)
 WHERE k.sys08_kind_cd = 'ApprRegEmpType'
   AND NOT EXISTS (SELECT 1 FROM sys09_code c WHERE c.sys09_code_kind_id = k.sys08_code_kind_id AND c.sys09_code = v.code AND c.sys09_company_id = 0);
COMMIT;
