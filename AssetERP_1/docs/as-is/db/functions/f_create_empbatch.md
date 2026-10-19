# f_create_empbatch

## FUNCTION public.f_create_empbatch(p_proc_type character varying, p_company_id numeric)

- 반환: `character varying`
- 줄 수: 549

```sql
CREATE OR REPLACE FUNCTION public.f_create_empbatch(p_proc_type character varying, p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_RAWORG                RECORD;
    v_RAWEMP                RECORD;

    v_ORG01                 org01_code%ROWTYPE;
    v_ORG02                 org02_info%ROWTYPE;
    v_ORG02_MOD             org02_info%ROWTYPE;
    v_PARENT_ORG_CD         org01_code.org01_org_cd%TYPE;
    v_MIRAEASSET_LEVEL_CD   raw10_miraeasset_org.raw10_org_level_cd%TYPE;

    v_EMP01                 emp01_person%ROWTYPE;
    v_EMP02                 emp02_others%ROWTYPE;
    v_EMP03                 emp03_trans%ROWTYPE;
    v_EMP03_MOD             emp03_trans%ROWTYPE;
    v_ORG_START             org01_code.org01_open_date%TYPE;

    v_BATCH_ID              raw10_miraeasset_org.raw10_batch_id%TYPE;
    v_DML                   VARCHAR(1);

    v_errMsg                VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_errMsg := '인사정보 생성실패 ['||p_proc_type||']['||p_company_id||']';

    -- 회사ID가 미래에셋자산운용(202403273621336)인 경우에만 처리
    IF p_company_id NOT IN (202403273621336, 202404021662972) THEN
        v_errMsg := '인사정보 생성실패 - 미래에셋자산운용이 아님';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 조직정보 생성
    -------------------------------------------------------------------------------------
    IF p_proc_type IN ('0','1') THEN
        ---------------------------------------------------------------------------------
        RAISE NOTICE '조직정보 생성 시작';
        ---------------------------------------------------------------------------------
        -- 최근 batch_id GET
        SELECT raw10_batch_id
          INTO v_BATCH_ID
          FROM raw10_miraeasset_org
         ORDER BY raw10_batch_id DESC
         LIMIT 1;

        ---------------------------------------------------------------------------------
        FOR v_RAWORG IN ( WITH RECURSIVE raworg ( raw10_org_cd
                                                , raw10_org_nm
                                                , raw10_start_date
                                                , raw10_close_date
                                                , raw10_org_level_cd
                                                , raw10_org_cap_cd
                                                , raw10_org_cap_nm
                                                , raw10_parent_org_cd
                                                , raw10_batch_id
                                                , raw10_level
                          ) AS ( SELECT raw10_org_cd
                                      , raw10_org_nm
                                      , TO_DATE(raw10_start_date,'yyyyMMdd')
                                      , TO_DATE(raw10_close_date,'yyyyMMdd')
                                      , raw10_org_level_cd
                                      , raw10_org_cap_cd
                                      , raw10_org_cap_nm
                                      , raw10_parent_org_cd
                                      , raw10_batch_id
                                      , 0
                                   FROM raw10_miraeasset_org
                                  WHERE raw10_parent_org_cd              = '00000'
                                    AND COALESCE(raw10_org_level_cd,'') != ''
                                    AND raw10_batch_id                   = v_BATCH_ID
                                  UNION ALL
                                 SELECT a.raw10_org_cd
                                      , a.raw10_org_nm
                                      , TO_DATE(a.raw10_start_date,'yyyyMMdd')
                                      , TO_DATE(a.raw10_close_date,'yyyyMMdd')
                                      , a.raw10_org_level_cd
                                      , a.raw10_org_cap_cd
                                      , a.raw10_org_cap_nm
                                      , a.raw10_parent_org_cd
                                      , a.raw10_batch_id
                                      , b.raw10_level + 1
                                   FROM raw10_miraeasset_org a
                                      , raworg b
                                  WHERE a.raw10_parent_org_cd              = b.raw10_org_cd
                                    AND COALESCE(a.raw10_org_level_cd,'') != ''
                                    AND a.raw10_batch_id                   = v_BATCH_ID
                          )
                          SELECT *
                            FROM raworg
                           ORDER BY raw10_level, raw10_parent_org_cd
        ) LOOP
            -----------------------------------------------------------------------------
            -- 조직정보 유무체크
            SELECT *
              INTO v_ORG01
              FROM org01_code
             WHERE org01_company_id = p_company_id
               AND org01_org_cd     = v_RAWORG.raw10_org_cd;

            -- (없으면 조직정보&변경이력 Insert, 있으면 변경이력만 Insert)
            IF v_ORG01.org01_code_id IS NULL THEN
                RAISE NOTICE ' - (%)신규조직 생성', v_RAWORG.raw10_org_cd;
                -------------------------------------------------------------------------
                v_DML := 'I';
                -------------------------------------------------------------------------
                v_ORG01.org01_code_id       := f_create_seq()                   ;
                v_ORG01.org01_company_id    := p_company_id                     ;
                v_ORG01.org01_org_cd        := v_RAWORG.raw10_org_cd            ;
                v_ORG01.org01_open_date     := v_RAWORG.raw10_start_date        ;
                
                IF COALESCE(v_RAWORG.raw10_close_date,'9999-12-31') != '9999-12-31' THEN
                    v_ORG01.org01_close_date := v_RAWORG.raw10_close_date;
                ELSE
                    v_ORG01.org01_close_date := NULL;
                END IF;

                v_ORG01.org01_open_reason   := NULL                             ;
                v_ORG01.org01_close_reason  := NULL                             ;
                v_ORG01.org01_note          := NULL                             ;

                v_ORG02.org02_info_id           := f_create_seq()               ;
                v_ORG02.org02_kor_nm            := v_RAWORG.raw10_org_nm        ;
                v_ORG02.org02_mod_date          := v_RAWORG.raw10_start_date    ;
                v_ORG02.org02_mod_reason        := '최초등록'                   ;
                v_ORG02.org02_code_id           := v_ORG01.org01_code_id        ;
                v_ORG02.org02_inner_type        := NULL                         ;
                v_ORG02.org02_eng_nm            := NULL                         ;
                v_ORG02.org02_note              := NULL                         ;
                v_ORG02.org02_sort_order        := v_ORG01.org01_org_cd         ;
                v_ORG02.org02_mod_detail        := NULL                         ;
                v_ORG02.org02_dcr_id_word       := NULL                         ;

                -- 상위조직코드SET
                SELECT org01_code_id
                  INTO v_ORG02.org02_parent_code_id
                  FROM org01_code
                 WHERE org01_company_id = p_company_id
                   AND org01_org_cd     = v_RAWORG.raw10_parent_org_cd ;

                IF v_ORG02.org02_parent_code_id IS NULL THEN
                    RAISE NOTICE '★★★ (%) 상위조직 미존재!!! 상위조직코드 : %', v_RAWORG.raw10_org_cd, v_RAWORG.raw10_parent_org_cd;
                END IF;

                -- 조직레벨코드SET
                SELECT sys09_seq
                  INTO v_ORG02.org02_level_cd
                  FROM sys08_code_kind
                       INNER JOIN sys09_code ON sys09_code_kind_id = sys08_code_kind_id
                 WHERE sys08_kind_cd = 'OrgLevelCodeMiraeAsset'
                   AND sys09_code    = v_RAWORG.raw10_org_level_cd ;

                IF v_ORG02.org02_level_cd IS NULL THEN
                    RAISE NOTICE '★★★ (%) 조직레벨 미존재!!! 레벨코드 : %', v_RAWORG.raw10_org_cd, v_RAWORG.raw10_org_level_cd;
                END IF;

                INSERT INTO org01_code VALUES (v_ORG01.*);
                INSERT INTO org02_info VALUES (v_ORG02.*);

            ELSE
                RAISE NOTICE ' - (%)조직정보 변경', v_RAWORG.raw10_org_cd;

                -------------------------------------------------------------------------
                v_DML := 'U';
                -------------------------------------------------------------------------
                IF COALESCE(v_RAWORG.raw10_close_date,'9999-12-31') != '9999-12-31' THEN
                    RAISE NOTICE ' - 조직폐쇄 (%)', v_ORG01.org01_org_cd;

                    -- 폐쇄일 UPDATE
                    UPDATE org01_code
                       SET org01_close_date = v_RAWORG.raw10_close_date
                     WHERE org01_code_id = v_ORG01.org01_code_id;
                END IF;

                -------------------------------------------------------------------------
                -- 최근이력정보 GET
                SELECT org02_info.*
                  INTO v_ORG02
                  FROM org02_info
                 WHERE org02_code_id = v_ORG01.org01_code_id
                   AND org02_mod_date <= f_today()
                 ORDER BY org02_mod_date DESC
                 LIMIT 1;

                -------------------------------------------------------------------------
                -- 상위조직코드, 조직레벨코드 GET
                SELECT org01_org_cd, sys09_level_cd
                  INTO v_PARENT_ORG_CD, v_MIRAEASSET_LEVEL_CD
                  FROM org01_code
                       INNER JOIN ( SELECT sys09_code AS sys09_level_cd
                                         , sys09_seq
                                      FROM sys08_code_kind
                                           INNER JOIN sys09_code ON sys09_code_kind_id = sys08_code_kind_id
                                     WHERE sys08_kind_cd = 'OrgLevelCodeMiraeAsset' ) t ON sys09_seq = v_ORG02.org02_level_cd
                 WHERE org01_company_id = p_company_id
                   AND org01_code_id    = v_ORG02.org02_parent_code_id;

                -------------------------------------------------------------------------
                -- 변경비교(조직명, 상위조직코드, 조직레벨코드)
                IF CONCAT(v_ORG02.org02_kor_nm, v_PARENT_ORG_CD, v_MIRAEASSET_LEVEL_CD)
                   != CONCAT(v_RAWORG.raw10_org_nm, v_RAWORG.raw10_parent_org_cd, v_RAWORG.raw10_org_level_cd) THEN
                    ---------------------------------------------------------------------
                    v_ORG02_MOD := v_ORG02;
                    ---------------------------------------------------------------------
                    v_ORG02_MOD.org02_info_id   := f_create_seq()           ;
                    v_ORG02_MOD.org02_mod_date  := f_today()                ;
                    v_ORG02_MOD.org02_mod_reason    := '정보변경'           ;
                    v_ORG02_MOD.org02_kor_nm    := v_RAWORG.raw10_org_nm    ;

                    RAISE NOTICE ' - 조직변경 (%)', v_ORG01.org01_org_cd;

                    -- 변경된 상위조직코드 SET
                    IF v_PARENT_ORG_CD != v_RAWORG.raw10_parent_org_cd THEN
                        SELECT org01_code_id
                          INTO v_ORG02_MOD.org02_parent_code_id
                          FROM org01_code
                         WHERE org01_company_id = p_company_id
                           AND org01_org_cd     = v_RAWORG.raw10_parent_org_cd ;

                        IF v_ORG02_MOD.org02_parent_code_id IS NULL THEN
                            RAISE NOTICE '--- 상위조직 미존재!!! 상위조직코드 : %', v_RAWORG.raw10_parent_org_cd;
                        END IF;

                        RAISE NOTICE ' - 상위조직변경 (% => %)', v_PARENT_ORG_CD, v_RAWORG.raw10_parent_org_cd;

                    END IF;

                    -- 변경된 조직레벨코드 SET
                    IF v_MIRAEASSET_LEVEL_CD != v_RAWORG.raw10_org_level_cd THEN
                        SELECT sys09_seq
                          INTO v_ORG02_MOD.org02_level_cd
                          FROM sys08_code_kind
                               INNER JOIN sys09_code ON sys09_code_kind_id = sys08_code_kind_id
                         WHERE sys08_kind_cd = 'OrgLevelCodeMiraeAsset'
                           AND sys09_code    = v_RAWORG.raw10_org_level_cd ;

                        RAISE NOTICE ' - 조직레벨변경 (% => %)', v_MIRAEASSET_LEVEL_CD, v_RAWORG.raw10_org_level_cd;
                    END IF;

                    INSERT INTO org02_info VALUES (v_ORG02_MOD.*);
                END IF;
            END IF;
        END LOOP;
    END IF;

    -------------------------------------------------------------------------------------
    -- 임직원정보 생성
    -------------------------------------------------------------------------------------
    IF p_proc_type IN ('0','2') THEN
        ---------------------------------------------------------------------------------
        RAISE NOTICE '임직원정보 생성 시작';
        ---------------------------------------------------------------------------------
        -- 최근 batch_id GET
        SELECT raw11_batch_id
          INTO v_BATCH_ID
          FROM raw11_miraeasset_emp
         ORDER BY raw11_batch_id DESC
         LIMIT 1;

        ---------------------------------------------------------------------------------
        FOR v_RAWEMP IN ( SELECT *
                            FROM raw11_miraeasset_emp
                           WHERE raw11_batch_id = v_BATCH_ID
                             AND COALESCE(raw11_close_date,'') = ''
        ) LOOP
            v_errMsg := '직원정보 유무체크 실패 - '||v_RAWEMP.raw11_emp_cd;
            -----------------------------------------------------------------------------
            -- 직원정보 유무체크
            SELECT *
              INTO v_EMP01
              FROM emp01_person
             WHERE emp01_company_id = p_company_id
               AND emp01_emp_no     = v_RAWEMP.raw11_emp_cd;

            -----------------------------------------------------------------------------
            IF v_EMP01.emp01_person_id IS NULL THEN
                v_errMsg := '신규사원 생성 실패 - '||v_RAWEMP.raw11_emp_cd;
                -------------------------------------------------------------------------
                RAISE NOTICE ' - (%)신규사원 생성', v_RAWEMP.raw11_emp_cd;
                -------------------------------------------------------------------------
                v_EMP01.emp01_person_id     := f_create_seq()                               ;
                v_EMP01.emp01_emp_no        := v_RAWEMP.raw11_emp_cd                        ;
                v_EMP01.emp01_order_seq     := NULL                                         ;
                v_EMP01.emp01_kor_nm        := v_RAWEMP.raw11_emp_nm                        ;
                v_EMP01.emp01_hire_cd       := NULL                                         ;
                v_EMP01.emp01_apply_cd      := NULL                                         ;
                v_EMP01.emp01_hire_date     := TO_DATE(v_RAWEMP.raw11_start_date,'yyyyMMdd');
                v_EMP01.emp01_email_addr    := v_RAWEMP.raw11_email                         ;
                v_EMP01.emp01_office_telno  := NULL                                         ;
                v_EMP01.emp01_office_detail := NULL                                         ;
                v_EMP01.emp01_mobile_telno  := NULL                                         ;
                v_EMP01.emp01_password      := NULL                                         ;
                v_EMP01.emp01_company_id    := p_company_id                                 ;
                v_EMP01.emp01_note          := NULL                                         ;
                v_EMP01.emp01_location_cd   := NULL                                         ;
                v_EMP01.emp01_theme_cd      := NULL                                         ;
                v_EMP01.emp01_lock_yn       := NULL                                         ;
                v_EMP01.emp01_menu_fix_yn   := NULL                                         ;

                v_EMP02.emp02_others_id     := f_create_seq()                               ;
                v_EMP02.emp02_person_id     := v_EMP01.emp01_person_id                      ;
                v_EMP02.emp02_chn_nm        := NULL                                         ;
                v_EMP02.emp02_ctz_no        := NULL                                         ;
                v_EMP02.emp02_birthday      := NULL                                         ;
                v_EMP02.emp02_lunar_cd      := NULL                                         ;
                v_EMP02.emp02_eng_nm        := v_RAWEMP.raw11_emp_enm                       ;
                v_EMP02.emp02_gender_cd     := NULL                                         ;
                v_EMP02.emp02_nat_cd        := NULL                                         ;
                v_EMP02.emp02_email_other   := NULL                                         ;
                v_EMP02.emp02_military_cd   := NULL                                         ;
                v_EMP02.emp02_family_dscr   := NULL                                         ;
                v_EMP02.emp02_marriage_cd   := NULL                                         ;
                v_EMP02.emp02_zip_cd        := NULL                                         ;
                v_EMP02.emp02_zip_addr      := NULL                                         ;
                v_EMP02.emp02_addr_detail   := NULL                                         ;
                v_EMP02.emp02_home_telno    := NULL                                         ;
                v_EMP02.emp02_note          := NULL                                         ;
                v_EMP02.emp02_note_admin    := NULL                                         ;

                v_EMP03.emp03_trans_id      := f_create_seq()                               ;
                v_EMP03.emp03_trans_date    := v_EMP01.emp01_hire_date                      ;
                v_EMP03.emp03_trans_cd      := '100'                                        ;   --(100:채용)
                v_EMP03.emp03_person_id     := v_EMP01.emp01_person_id                      ;
                v_EMP03.emp03_trans_reason  := NULL                                         ;
                v_EMP03.emp03_note          := NULL                                         ;
                v_EMP03.emp03_kind_cd       := NULL                                         ;

                v_EMP03.emp03_pos_cd        := f_conv_empTitleCode('POS'  ,v_RAWEMP.raw11_pos_cd  ,p_company_id);
                v_EMP03.emp03_title_cd      := f_conv_empTitleCode('TITLE',v_RAWEMP.raw11_title_cd,p_company_id);

                -- 특정직위 SET
                IF v_RAWEMP.raw11_title_cd = '620' THEN --(620:준법감시인)
                    v_EMP03.emp03_grade_cd  := '120';
                ELSE
                    v_EMP03.emp03_grade_cd  := NULL;
                END IF;

                -- 조직ID SET
                v_errMsg := '조직ID SET 실패 - '||v_RAWEMP.raw11_org_cd;
                SELECT org01_code_id
                  INTO v_EMP03.emp03_org_code_id
                  FROM org01_code
                 WHERE org01_company_id = p_company_id
                   AND org01_org_cd     = v_RAWEMP.raw11_org_cd;

                -- 조직장여부 SET
                v_errMsg := '조직장여부 SET 실패 - ['||v_RAWEMP.raw11_emp_cd||']['||v_RAWEMP.raw11_org_cd||']';
                SELECT CASE WHEN raw10_org_cap_cd = v_RAWEMP.raw11_emp_cd THEN 'true' ELSE 'false' END
                  INTO v_EMP03.emp03_org_head_yn
                  FROM raw10_miraeasset_org
                 WHERE raw10_org_cd   = v_RAWEMP.raw11_org_cd
                   AND raw10_batch_id = ( SELECT raw10_batch_id
                                            FROM raw10_miraeasset_org
                                           ORDER BY raw10_batch_id DESC
                                           LIMIT 1 );

                -- 비상근여부 SET
                --------------------------
                -- 630 : 사외이사
                -- 900 : 고문
                -- 901 : 고문
                --------------------------
                v_errMsg := '비상근여부 SET 실패 - ['||v_RAWEMP.raw11_emp_cd||']';
                IF v_RAWEMP.raw11_title_cd IN ('630','900','901') THEN
                    v_EMP03.emp03_non_stay_yn := 'true';
                ELSE
                    v_EMP03.emp03_non_stay_yn := 'false';
                END IF;

                INSERT INTO emp01_person VALUES (v_EMP01.*);
                INSERT INTO emp02_others VALUES (v_EMP02.*);
                INSERT INTO emp03_trans  VALUES (v_EMP03.*);

                /**** 최초이행시 특이사항 *****/
                -- 부서개설일이 발령일보다 이후인 경우 이동발령정보를 하나 더 생성한다
                v_errMsg := '이동발령정보 생성 실패 - ['||v_EMP03.emp03_org_code_id||']';
                SELECT org01_open_date
                  INTO v_ORG_START
                  FROM org01_code
                 WHERE org01_code_id = v_EMP03.emp03_org_code_id;

                IF v_EMP03.emp03_trans_date < v_ORG_START THEN
                    v_EMP03.emp03_trans_id   := f_create_seq()  ;
                    v_EMP03.emp03_trans_date := v_ORG_START     ;
                    v_EMP03.emp03_trans_cd   := '200'           ;   --(200:이동)
                    INSERT INTO emp03_trans  VALUES (v_EMP03.*);
                END IF;

            ELSE
                -------------------------------------------------------------------------
                RAISE NOTICE ' - (%)사원정보 변경반영', v_RAWEMP.raw11_emp_cd;
                -------------------------------------------------------------------------
                -- 기타정보 GET
                SELECT *
                  INTO v_EMP02
                  FROM emp02_others
                 WHERE emp02_person_id = v_EMP01.emp01_person_id;

                -- 발령정보 GET
                SELECT *
                  INTO v_EMP03
                  FROM emp03_trans
                 WHERE emp03_person_id   = v_EMP01.emp01_person_id
                   AND emp03_trans_date <= f_today()
                 ORDER BY emp03_trans_date
                 LIMIT 1;

                v_EMP03_MOD := v_EMP03;

                -------------------------------------------------------------------------
                -- 기본정보 변경사항 반영
                UPDATE emp01_person
                   SET emp01_kor_nm     = v_RAWEMP.raw11_emp_nm
                     , emp01_hire_date  = TO_DATE(v_RAWEMP.raw11_start_date,'yyyyMMdd')
                     , emp01_email_addr = v_RAWEMP.raw11_email
                 WHERE emp01_person_id = v_EMP01.emp01_person_id;

                -------------------------------------------------------------------------
                -- 기타정보 변경사항 반영
                UPDATE emp02_others
                   SET emp02_eng_nm = v_RAWEMP.raw11_emp_enm
                 WHERE emp02_others_id = v_EMP02.emp02_others_id;

                -------------------------------------------------------------------------
                -- 발령정보 생성
                IF COALESCE(v_RAWEMP.raw10_close_date,'') != '' THEN
                    v_EMP03_MOD.emp03_trans_id   := f_create_seq()              ;
                    v_EMP03_MOD.emp03_trans_date := v_RAWEMP.raw10_close_date   ;
                    v_EMP03_MOD.emp03_trans_cd   := '900'                       ; --(900:퇴직)
                    ---------------------------------------------------------------------
                    INSERT INTO emp03_trans VALUES (v_EMP03_MOD.*);
                -------------------------------------------------------------------------
                ELSE
                    -- 직책, 직위가 변경된 경우 승진 발령정보 생성
                    IF (v_EMP03.emp03_title_cd != f_conv_empTitleCode('TITLE',v_RAWEMP.raw11_title_cd,p_company_id)) OR
                       (v_EMP03.emp03_pos_cd   != f_conv_empTitleCode('POS'  ,v_RAWEMP.raw11_pos_cd  ,p_company_id)) THEN
                        -----------------------------------------------------------------
                        v_EMP03_MOD.emp03_trans_id   := f_create_seq()          ;
                        v_EMP03_MOD.emp03_trans_date := f_today()               ;
                        v_EMP03_MOD.emp03_trans_cd   := '300'                   ; --(300:승진)
                        v_EMP03_MOD.emp03_pos_cd     := f_conv_empTitleCode('POS'  ,v_RAWEMP.raw11_pos_cd  ,p_company_id);
                        v_EMP03_MOD.emp03_title_cd   := f_conv_empTitleCode('TITLE',v_RAWEMP.raw11_title_cd,p_company_id);

                        -- 특정직위 SET
                        IF v_RAWEMP.raw11_title_cd = '620' THEN --(620:준법감시인)
                            v_EMP03_MOD.emp03_grade_cd  := '120';
                        ELSE
                            v_EMP03_MOD.emp03_grade_cd  := NULL;
                        END IF;

                        -- 조직ID SET
                        SELECT org01_code_id
                          INTO v_EMP03_MOD.emp03_org_code_id
                          FROM org01_code
                         WHERE org01_company_id = p_company_id
                           AND org01_org_cd     = v_RAWEMP.raw11_org_cd;

                        -- 조직장여부 SET
                        SELECT CASE WHEN raw10_org_cap_cd = v_RAWEMP.raw11_emp_cd THEN 'true' ELSE' false' END
                          INTO v_EMP03_MOD.emp03_org_head_yn
                          FROM raw10_miraeasset_org
                         WHERE raw10_org_cd   = v_RAWEMP.raw11_org_cd
                           AND raw10_batch_id = ( SELECT raw10_batch_id
                                                    FROM raw10_miraeasset_org
                                                   ORDER BY raw10_batch_id DESC
                                                   LIMIT 1 );

                        -- 비상근여부 SET
                        --------------------------
                        -- 630 : 사외이사
                        -- 900 : 고문
                        -- 901 : 고문
                        --------------------------
                        IF v_RAWEMP.raw11_title_cd IN ('630','900','901') THEN
                            v_EMP03_MOD.emp03_non_stay_yn := 'true';
                        ELSE
                            v_EMP03_MOD.emp03_non_stay_yn := 'false';
                        END IF;

                        -----------------------------------------------------------------
                        INSERT INTO emp03_trans VALUES (v_EMP03_MOD.*);

                    ---------------------------------------------------------------------
                    -- 부서가 변경된 경우 이동 발령정보 생성
                    ELSIF f_get_empTrans(v_EMP01.emp01_person_id,f_today(),'org_cd') != v_RAWEMP.raw11_org_cd THEN
                        -----------------------------------------------------------------
                        v_EMP03_MOD.emp03_trans_id   := f_create_seq()          ;
                        v_EMP03_MOD.emp03_trans_date := f_today()               ;
                        v_EMP03_MOD.emp03_trans_cd   := '200'                   ; --(200:이동)

                        -- 조직ID SET
                        SELECT org01_code_id
                          INTO v_EMP03_MOD.emp03_org_code_id
                          FROM org01_code
                         WHERE org01_company_id = p_company_id
                           AND org01_org_cd     = v_RAWEMP.raw11_org_cd;

                        -- 조직장여부 SET
                        SELECT CASE WHEN raw10_org_cap_cd = v_RAWEMP.raw11_emp_cd THEN 'true' ELSE' false' END
                          INTO v_EMP03_MOD.emp03_org_head_yn
                          FROM raw10_miraeasset_org
                         WHERE raw10_org_cd   = v_RAWEMP.raw11_org_cd
                           AND raw10_batch_id = ( SELECT raw10_batch_id
                                                    FROM raw10_miraeasset_org
                                                   ORDER BY raw10_batch_id DESC
                                                   LIMIT 1 );

                        -----------------------------------------------------------------
                        INSERT INTO emp03_trans VALUES (v_EMP03_MOD.*);

                    ---------------------------------------------------------------------
                    -- 그밖의 정보가 변경된 경우 UPDATE
                    ELSE
                        -- 조직장여부 SET
                        SELECT CASE WHEN raw10_org_cap_cd = v_RAWEMP.raw11_emp_cd THEN 'true' ELSE' false' END
                          INTO v_EMP03.emp03_org_head_yn
                          FROM raw10_miraeasset_org
                         WHERE raw10_batch_id = v_BATCH_ID
                           AND raw10_org_cd   = v_RAWEMP.raw11_org_cd;

                        -----------------------------------------------------------------
                        UPDATE emp03_trans
                           SET emp03_org_head_yn = v_EMP03.emp03_org_head_yn
                         WHERE emp03_trans_id = v_EMP03.emp03_trans_id;

                    END IF;
                END IF;
            END IF;
        END LOOP;
    END IF;

    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_errMsg ;
        RETURN v_errMsg;
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN v_errMsg||'-'||SQLERRM;
END;
$function$
```
