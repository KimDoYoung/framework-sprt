-- sys90_user_props : 사용자 설정 (TOBE 재설계 03 "나의 화면 저장", 이후 사용자 설정 탭)
-- 계획: AssetERP/docs/4-재설계/03-나의-화면-저장.md
-- 실행: psql -h localhost -U kdy987 -d asseterpdb -f AssetERP/docs/4-재설계/ddl/sys90_user_props.sql
--       (앱 접속 계정도 kdy987 이고 기존 테이블 소유자도 kdy987 이라 GRANT 불필요)
-- AS-IS는 이 테이블을 모른다(AS-IS 동작에 영향 없음). 되돌리기: DROP TABLE sys90_user_props;

CREATE TABLE IF NOT EXISTS sys90_user_props (
    sys90_user_id           numeric      NOT NULL,
    sys90_company_id        numeric      NOT NULL,
    sys90_my_screen_layout  text,
    sys90_props             text,
    sys90_reg_dt            timestamp    NOT NULL DEFAULT now(),
    sys90_upd_dt            timestamp    NOT NULL DEFAULT now(),
    CONSTRAINT sys90_user_props_pk PRIMARY KEY (sys90_user_id)
);

COMMENT ON TABLE  sys90_user_props                        IS '사용자 설정 (TOBE)';
COMMENT ON COLUMN sys90_user_props.sys90_user_id          IS '세션 사용자ID (사원 emp01_person_id, 회사관리자 -sys02_user_id)';
COMMENT ON COLUMN sys90_user_props.sys90_company_id       IS '회사ID';
COMMENT ON COLUMN sys90_user_props.sys90_my_screen_layout IS '나의 화면 저장 (JSON)';
COMMENT ON COLUMN sys90_user_props.sys90_props            IS '사용자 설정 (JSON: TopBar 배경색, 글꼴 등)';
COMMENT ON COLUMN sys90_user_props.sys90_reg_dt           IS '등록일시';
COMMENT ON COLUMN sys90_user_props.sys90_upd_dt           IS '수정일시';
