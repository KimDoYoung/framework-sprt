# f_conv_tdm

## FUNCTION public.f_conv_tdm(p_company_id numeric)

- 반환: `character varying`
- 줄 수: 798

```sql
CREATE OR REPLACE FUNCTION public.f_conv_tdm(p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_COMPANY_ID    NUMERIC := p_company_id;
    v_START_DATE    DATE    := '2026-1-1'::date;
    v_END_DATE      DATE    := '2026-6-30'::date;

    c_DATA          RECORD;
    c_TASK          RECORD;
    c_DETAIL        RECORD;
    c_DUTY          RECORD;
    c_ORG           RECORD;
    c_CHK           RECORD;

    v_TDM10         tdm10_task%ROWTYPE;
    v_TDM12         tdm12_task_relate_detail%ROWTYPE;
    v_TDM13         tdm13_task_relate_duty%ROWTYPE;
    v_TDM20         tdm20_role%ROWTYPE;
    v_TDM30         tdm30_role_allc%ROWTYPE;
    v_TDM34         tdm34_role_allc_detail%ROWTYPE;
    v_TDM31         tdm31_role_desc%ROWTYPE;
    v_TDM40         tdm40_manl_job%ROWTYPE;
    v_TDM41         tdm41_manl_duty%ROWTYPE;
    v_TDM42         tdm42_manl_org%ROWTYPE;
    v_TDM43         tdm43_manl%ROWTYPE;
    
    v_CEO_ROLE_ID   NUMERIC;
    v_CNT           NUMERIC;
    v_CNT1          NUMERIC;
    v_CNT2          NUMERIC;

    v_APPR_ID       NUMERIC;
    v_EMP_NO        emp01_person.emp01_emp_no%TYPE;

    v_MSG           TEXT;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_COMPANY_ID := 202601209259551;
/*
    -------------------------------------------------------------------------------------
    -- 10. 직책(tdm20) 생성
    -------------------------------------------------------------------------------------

    RAISE NOTICE '---------------------------------------------------';
    RAISE NOTICE '----- 10. 직책(tdm20) 생성 시작';

    FOR c_DATA IN ( SELECT DISTINCT conv10_role_cd, conv10_role_nm
                      FROM conv10_tdm_base
                     WHERE conv10_company_id = v_COMPANY_ID
                       AND conv10_role_cd NOT LIKE 'ZZ%'
                     ORDER BY conv10_role_cd
    ) LOOP
        ---------------------------------------------------------------------------------
        v_TDM20 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM20.tdm20_role_id           := f_create_seq()           ;
        v_TDM20.tdm20_company_id        := v_COMPANY_ID             ;
        v_TDM20.tdm20_role_nm           := c_DATA.conv10_role_nm    ;

        -- (직책그룹코드)---------------------------------------------
        --YURIE01 대표이사                      => C 대표이사
        --YURIE02 이사회 의장                   => A 이사회의장
        --YURIE03 CIO                           => D 대표이사지원
        --YURIE04 CMO                           => D 대표이사지원
        --YURIE05 경영지원본부장                => D 대표이사지원
        --YURIE06 준법감시인 및 위험관리책임자  => D 대표이사지원
        --YURIE07 감사                          => B 이사회지원
        --------------------------------------------------------------
        IF c_DATA.conv10_role_nm = '대표이사' THEN
            v_TDM20.tdm20_role_type := 'C'  ;
            v_CEO_ROLE_ID           := v_TDM20.tdm20_role_id ;

        ELSIF REPLACE(c_DATA.conv10_role_nm,' ','') = '이사회의장' THEN
            v_TDM20.tdm20_role_type := 'A'  ;

        ELSIF c_DATA.conv10_role_nm = '감사' THEN
            v_TDM20.tdm20_role_type := 'B'  ;

        ELSE
            v_TDM20.tdm20_role_type := 'D'  ;
        END IF;

        v_TDM20.tdm20_ceo_role_id       := v_CEO_ROLE_ID    ;
        --------------------------------------------------------------
        v_TDM20.tdm20_role_type_etc_nm  := NULL             ;
        v_TDM20.tdm20_overview          := NULL             ;
        --------------------------------------------------------------
        v_TDM20.tdm20_start_date        := v_START_DATE     ;
        v_TDM20.tdm20_end_date          := NULL             ;
        v_TDM20.tdm20_upd_nm            := 'system'         ;
        v_TDM20.tdm20_upd_date          := f_sysdate()      ;

        INSERT INTO tdm20_role VALUES (v_TDM20.*);
    END LOOP;


    RAISE NOTICE '---------------------------------------------------';
    RAISE NOTICE '----- 20. 책무(tdm10) 생성 시작';

    --delete from tdm21_role_relate_task   where tdm21_task_id in (select tdm10_task_id from tdm10_task where tdm10_company_id = v_COMPANY_ID);
    --delete from tdm13_task_relate_duty   where tdm13_task_id in (select tdm10_task_id from tdm10_task where tdm10_company_id = v_COMPANY_ID);
    --delete from tdm12_task_relate_detail where tdm12_task_id in (select tdm10_task_id from tdm10_task where tdm10_company_id = v_COMPANY_ID);
    --delete from tdm10_task               where tdm10_company_id = v_COMPANY_ID;

    -------------------------------------------------------------------------------------
    -- 20. 책무(tdm10) 생성
    -------------------------------------------------------------------------------------
    FOR c_TASK IN ( SELECT DISTINCT
                           SUBSTR(conv10_duty_cd,1,3)   task_cd
                         , conv10_task_nm               task_nm
                      FROM conv10_tdm_base
                     WHERE conv10_company_id = v_COMPANY_ID
                     ORDER BY 1
    ) LOOP
        ---------------------------------------------------------------------------------
        v_TDM10 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM10.tdm10_task_id       := f_create_seq()                               ;
        v_TDM10.tdm10_company_id    := v_COMPANY_ID                                 ;
        v_TDM10.tdm10_task_type_cd  := f_conv_tdm_taskType('YURIE', c_TASK.task_cd) ;
        v_TDM10.tdm10_task_class_cd := SUBSTR(v_TDM10.tdm10_task_type_cd,1,1)       ;
        v_TDM10.tdm10_task_nm       := c_TASK.task_nm                               ;
        ---------------------------------------------------------------------------------
        SELECT SUM(CASE WHEN conv10_role_nm = '대표이사'    THEN 1 ELSE 0 END)
             , SUM(CASE WHEN conv10_item_type LIKE '%공통%' THEN 1 ELSE 0 END)
          INTO v_CNT1, v_CNT2
          FROM conv10_tdm_base
         WHERE conv10_company_id = v_COMPANY_ID
           AND SUBSTR(conv10_duty_cd,1,3) = c_TASK.task_cd;

        IF v_CNT1 > 0 THEN
            v_TDM10.tdm10_ceo_yn := 'true';
        ELSE
            v_TDM10.tdm10_ceo_yn := 'false';
        END IF;

        IF v_CNT2 > 0 THEN
            v_TDM10.tdm10_common_yn := 'true';
        ELSE
            v_TDM10.tdm10_common_yn := 'false';
        END IF;
        ---------------------------------------------------------------------------------
        v_TDM10.tdm10_start_date    := v_START_DATE                                 ;
        v_TDM10.tdm10_end_date      := NULL                                         ;
        v_TDM10.tdm10_upd_nm        := 'system'                                     ;
        v_TDM10.tdm10_upd_date      := f_sysdate()                                  ;

        INSERT INTO tdm10_task VALUES (v_TDM10.*);

        ---------------------------------------------------------------------------------
        -- 21. 책무세부(tdm12) 생성
        ---------------------------------------------------------------------------------
        RAISE NOTICE '----- 21. 책무세부(tdm12) 생성 시작';

        FOR c_DETAIL IN ( SELECT DISTINCT
                                 SUBSTR(conv10_duty_cd,1,6)   detail_cd
                               , conv10_task_detail           detail_nm
                            FROM conv10_tdm_base
                           WHERE conv10_company_id = v_COMPANY_ID
                             AND conv10_duty_cd LIKE c_TASK.task_cd||'%'
                           ORDER BY 1
        ) LOOP
            -----------------------------------------------------------------------------
            v_TDM12 := NULL;
            -----------------------------------------------------------------------------
            v_TDM12.tdm12_task_relate_detail_id := f_create_seq()                   ;
            v_TDM12.tdm12_task_id               := v_TDM10.tdm10_task_id            ;
            v_TDM12.tdm12_content               := c_DETAIL.detail_nm               ;
            v_TDM12.tdm12_seq                   := c_DETAIL.detail_cd::numeric      ;
            v_TDM12.tdm12_use_yn                := 'true'                           ;
            v_TDM12.tdm12_upd_nm                := 'system'                         ;
            v_TDM12.tdm12_upd_date              := f_sysdate()                      ;

            INSERT INTO tdm12_task_relate_detail VALUES (v_TDM12.*);

            -----------------------------------------------------------------------------
            -- 22. 주요관리의무(tdm13) 생성
            ----------------------------------------------------------------------------- 
            RAISE NOTICE '----- 22. 주요관리의무(tdm13) 생성 시작';

            FOR c_DUTY IN ( SELECT DISTINCT
                                   conv10_duty_cd           duty_cd
                                 , conv10_task_detail_duty  duty_nm
                              FROM conv10_tdm_base
                             WHERE conv10_company_id = v_COMPANY_ID
                               AND conv10_duty_cd LIKE c_DETAIL.detail_cd||'%'
                             ORDER BY 1
            ) LOOP
                -------------------------------------------------------------------------
                v_TDM13 := NULL;
                -------------------------------------------------------------------------
                v_TDM13.tdm13_task_relate_duty_id   := f_create_seq()                       ;
                v_TDM13.tdm13_task_id               := v_TDM12.tdm12_task_id                ;
                v_TDM13.tdm13_task_relate_detail_id := v_TDM12.tdm12_task_relate_detail_id  ;
                v_TDM13.tdm13_content               := c_DUTY.duty_nm                       ;
                v_TDM13.tdm13_seq                   := c_DUTY.duty_cd::numeric              ;
                v_TDM13.tdm13_use_yn                := 'true'                               ;
                v_TDM13.tdm13_upd_nm                := 'system'                             ;
                v_TDM13.tdm13_upd_date              := f_sysdate()                          ;

                INSERT INTO tdm13_task_relate_duty VALUES (v_TDM13.*);

            END LOOP;   --(c_DUTY end)
        END LOOP;       --(c_DETAIL end)

        ---------------------------------------------------------------------------------
        -- 23. 법령 및 내규 연결
        ---------------------------------------------------------------------------------
        RAISE NOTICE '----- 23. 법령 및 내규 연결 생성 시작';

        INSERT
          INTO tdm11_task_relate_rule
        SELECT f_create_seq()
             , v_TDM10.tdm10_task_id
             , CASE WHEN conv11_law_type = '법규' THEN '1' ELSE '2' END
             , conv11_law_cd
             , null
             , conv11_company_id
             , 'system'
             , f_sysdate()
          FROM conv11_tdm_law
         WHERE conv11_company_id = v_COMPANY_ID
           AND conv11_task_type  = v_TDM10.tdm10_task_type_cd;

        ---------------------------------------------------------------------------------
        -- 25. 직책-책무 연결(tdm21) 생성
        ---------------------------------------------------------------------------------
        RAISE NOTICE '----- 25. 직책-책무 연결(tdm21) 생성 시작';

        -- 개별책무
        INSERT
          INTO tdm21_role_relate_task
        SELECT f_create_seq()
             , *
          FROM (
                 SELECT DISTINCT
                        tdm20_role_id
                      , v_TDM10.tdm10_task_id
                   FROM ( SELECT DISTINCT conv10_role_nm
                            FROM conv10_tdm_base
                           WHERE conv10_company_id = v_COMPANY_ID
                             AND conv10_duty_cd LIKE c_TASK.task_cd||'%'
                             AND conv10_role_nm NOT LIKE '공통%'
                        ) t
                        INNER JOIN tdm20_role ON ( tdm20_company_id = v_COMPANY_ID   AND
                                                   tdm20_role_nm    = conv10_role_nm )
                  WHERE NOT EXISTS ( SELECT 1
                                       FROM tdm21_role_relate_task
                                      WHERE tdm21_role_id = tdm20_role_id
                                        AND tdm21_task_id = v_TDM10.tdm10_task_id )
               ) tt;

        -- 공통책무
        INSERT
          INTO tdm21_role_relate_task
        SELECT f_create_seq()
             , *
          FROM (
                 SELECT DISTINCT
                        tdm20_role_id
                      , v_TDM10.tdm10_task_id
                   FROM ( SELECT DISTINCT conv10_role_nm
                            FROM conv10_tdm_base
                           WHERE conv10_company_id = v_COMPANY_ID
                             AND conv10_duty_cd LIKE c_TASK.task_cd||'%'
                             AND conv10_role_nm LIKE '공통%'
                        ) t
                      , tdm20_role
                  WHERE tdm20_company_id = v_COMPANY_ID
                    AND NOT EXISTS ( SELECT 1
                                       FROM tdm21_role_relate_task
                                      WHERE tdm21_role_id = tdm20_role_id
                                        AND tdm21_task_id = v_TDM10.tdm10_task_id )
               ) tt;

    END LOOP; --(c_TASK end)
*/

    RAISE NOTICE '----- 30. 직책-담당부서 연결(tdm23) 생성 시작';

    delete from tdm23_role_relate_org where tdm23_role_id in (select tdm20_role_id from tdm20_role where tdm20_company_id = v_COMPANY_ID);

    -------------------------------------------------------------------------------------
    -- 30. 직책-담당부서 연결(tdm23) 생성
    -------------------------------------------------------------------------------------
    INSERT
      INTO tdm23_role_relate_org
    SELECT f_create_seq()
         , *
      FROM (
            SELECT DISTINCT
                   tdm20_role_id
                 , f_get_tdmOrg_id2(v_COMPANY_ID, org00_org_id, f_today())  tdm_org_id
              FROM ( SELECT DISTINCT
                            tdm20_role_id
                          , org00_org_id
                       FROM conv10_tdm_base
                            INNER JOIN tdm20_role ON ( tdm20_company_id = v_COMPANY_ID   AND
                                                       tdm20_role_nm    = conv10_role_nm )
                            INNER JOIN getOrg(v_COMPANY_ID, f_today()) ON org00_kor_nm = trim(conv10_org_nm02)
                      WHERE conv10_company_id = v_COMPANY_ID
                        AND conv10_role_nm NOT LIKE '공통%'
                   ) t0
           ) t;

    -------------------------------------------------------------------------------------
    -- 직책별 부서승인선 등록(조직장이 없는 경우 생성안됨 - 화면에서 수작업 등록하기!!) => 책무점검조직만 생성되도록 변경함(20260410)
    
    RAISE NOTICE '----- 30-1. 직책별 부서승인선 등록(tdm09) 생성 시작';

    delete from tdm09_appr_step where tdm09_company_id = v_COMPANY_ID;

    v_MSG := f_create_tdmApprStep_init(v_COMPANY_ID);
    IF v_MSG != 'Y' THEN
        RAISE NOTICE '----- 30-1. 직책별 부서승인선 등록(tdm09) 생성 실패 : %', v_MSG;
    END IF;

/*
    -------------------------------------------------------------------------------------
    -- 공통사용 임원동의서 임시 상신문서생성
    SELECT *
         , (SELECT dcr30_class_tree_id
              FROM dcr30_link
             WHERE dcr30_company_id = emp00_company_id
               AND dcr30_link_cd    = 'A90')    as dcr_class_tree_id
      INTO c_DATA
      FROM getPerson(v_COMPANY_ID, f_today())
     WHERE emp00_grade_cd = '120';  --(120:준법감시인)

    v_APPR_ID := f_create_seq();

    INSERT
      INTO apr01_appr
         ( apr01_appr_id
         , apr01_title
         , apr01_reg_date
         , apr01_status_cd
         , apr01_content
         , apr01_reg_emp_id
         , apr01_effect_date
         , apr01_class_tree_id
         , apr01_inout_cd
         , apr01_company_id
    ) VALUES
        (  v_APPR_ID
         , '임원동의서_임시'
         , f_today()
         , '30'                     --(30:완료)
         , '본 문서는 책무 데이터 이행 확인을 위해 임시로 생성된 공용 임원동의서이므로, 반드시 폐기 후 임원동의서 상신을 진행해 주시기 바랍니다.'
         , c_DATA.emp00_person_id   --(준감인)
         , v_START_DATE
         , c_DATA.dcr_class_tree_id --(연결문서:A90 책무배분(직책배정))
         , '20'                     --(20:사내문서)
         , v_COMPANY_ID
         );

    INSERT
      INTO apr04_appr_step
    SELECT f_create_seq()
         , v_APPR_ID
         , '00'
         , 1
         , '20'
         , f_sysdate()
         , null
         , null
         , c_DATA.emp00_person_id
         , c_DATA.emp00_person_id;

    -------------------------------------------------------------------------------------
    -- 40. 직책배분(tdm30,34,35) 및 임원동의서 연결
    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT *
                      FROM tdm20_role
                     WHERE tdm20_company_id = v_COMPANY_ID
                       AND tdm20_role_type NOT IN ('A') --(A:이사회의장)은 우선 제외!!
    ) LOOP
        ---------------------------------------------------------------------------------
        v_TDM30 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM30.tdm30_role_allc_id  := f_create_seq()           ;
        v_TDM30.tdm30_company_id    := v_COMPANY_ID             ;
        v_TDM30.tdm30_role_id       := c_DATA.tdm20_role_id     ;
        v_TDM30.tdm30_start_date    := v_START_DATE             ;
        v_TDM30.tdm30_end_date      := NULL                     ;
        v_TDM30.tdm30_upd_nm        := 'system'                 ;
        v_TDM30.tdm30_upd_date      := f_sysdate()              ;

        ---------------------------------------------------------------------------------
        -- 대표이사                     => 002 조우*
        -- CIO                          => 003 한진*
        -- CMO                          => 004 오경*
        -- 경영지원본부장               => 044 전용*
        -- 준법감시인 및 위험관리책임자 => 052 장세*
        -- 감사                         => 052 장세*
        v_EMP_NO := CASE c_DATA.tdm20_role_nm WHEN '대표이사'                     THEN '002'
                                              WHEN 'CIO'                          THEN '003'
                                              WHEN 'CMO'                          THEN '004'
                                              WHEN '경영지원본부장'               THEN '044'
                                              WHEN '준법감시인 및 위험관리책임자' THEN '052'
                                              WHEN '감사'                         THEN '052'
                                              ELSE NULL END;

        SELECT emp01_person_id
          INTO v_TDM30.tdm30_person_id
          FROM emp01_person
         WHERE emp01_company_id = v_COMPANY_ID
           AND emp01_emp_no     = v_EMP_NO;

        ---------------------------------------------------------------------------------
        IF c_DATA.tdm20_role_nm = '감사' THEN
            v_TDM30.tdm30_add_title_yn = 'true';
        ELSE
            v_TDM30.tdm30_add_title_yn = 'false';
        END IF;

        INSERT INTO tdm30_role_allc VALUES (v_TDM30.*);

        ---------------------------------------------------------------------------------
        -- 41. 책무배분일 정보(tdm34) 생성
        ---------------------------------------------------------------------------------
        v_TDM34 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM34.tdm34_role_allc_detail_id   := f_create_seq()               ;
        v_TDM34.tdm34_role_allc_id          := v_TDM30.tdm30_role_allc_id   ;
        v_TDM34.tdm34_role_allc_date        := v_START_DATE                 ;
        v_TDM34.tdm34_reg_reason            := '최초등록'                   ;
        v_TDM34.tdm34_deputy_emp_nm         := NULL                         ;
        v_TDM34.tdm34_appr_id               := v_APPR_ID                    ;
        v_TDM34.tdm34_upd_nm                := 'system'                     ;
        v_TDM34.tdm34_upd_date              := f_sysdate()                  ;

        INSERT INTO tdm34_role_allc_detail VALUES (v_TDM34.*);

        ---------------------------------------------------------------------------------
        -- 42. 책무배분-확정책무(tdm35) 생성
        ---------------------------------------------------------------------------------
        INSERT
          INTO tdm35_role_allc_task
        SELECT f_create_seq()
             , tdm34_role_allc_detail_id
             , tdm10_task_id
             , tdm10_task_nm
             , tdm12_task_relate_detail_id
             , tdm12_content
             , tdm12_seq
             , tdm13_task_relate_duty_id
             , tdm13_content
             , tdm13_seq
             , 'system'
             , f_sysdate()
          FROM tdm34_role_allc_detail
               INNER JOIN tdm30_role_allc           ON tdm30_role_allc_id = tdm34_role_allc_id
               INNER JOIN tdm21_role_relate_task    ON tdm21_role_id      = tdm30_role_id
               INNER JOIN tdm10_task                ON ( tdm10_task_id    = tdm21_task_id                                                               AND
                                                         tdm34_role_allc_date BETWEEN tdm10_start_date AND COALESCE(tdm10_end_date,'9999-12-31'::date)  )
               INNER JOIN tdm12_task_relate_detail  ON ( tdm12_task_id                  = tdm10_task_id AND
                                                         COALESCE(tdm12_use_yn,'false') = 'true'        )
               INNER JOIN tdm13_task_relate_duty    ON ( tdm13_task_id               = tdm12_task_id                AND
                                                         tdm13_task_relate_detail_id = tdm12_task_relate_detail_id  AND
                                                         COALESCE(tdm13_use_yn,'false') = 'true'                    )
         WHERE tdm34_role_allc_detail_id = v_TDM34.tdm34_role_allc_detail_id
         ORDER BY tdm10_task_nm COLLATE "ko_KR.utf8", tdm12_seq, tdm13_seq;

        ---------------------------------------------------------------------------------
        -- 43. 책무기술서(tdm31) 생성
        ---------------------------------------------------------------------------------
        v_TDM31 := NULL;
        ---------------------------------------------------------------------------------
        -- 본직책에 대해서만 생성
        IF v_TDM30.tdm30_add_title_yn = 'false' THEN
            v_TDM31.tdm31_role_desc_id      := f_create_seq()               ;
            v_TDM31.tdm31_company_id        := v_COMPANY_ID                 ;
            v_TDM31.tdm31_reg_date          := v_START_DATE                 ;
            v_TDM31.tdm31_person_id         := v_TDM30.tdm30_person_id      ;
            v_TDM31.tdm31_role_allc_id      := v_TDM30.tdm30_role_allc_id   ;
            v_TDM31.tdm31_reason_cd         := 'D03'                        ; --(D03:임원선임 및 변경)
            v_TDM31.tdm31_upd_nm            := 'system'                     ;
            v_TDM31.tdm31_upd_date          := f_sysdate()                  ;

            INSERT INTO tdm31_role_desc VALUES (v_TDM31.*);
        END IF;
    END LOOP;

    -------------------------------------------------------------------------------------
    -- 50. 부서책무매뉴얼 작업등록(tdm40) 생성
    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT *
                      FROM tdm20_role
                     WHERE tdm20_company_id = v_COMPANY_ID
                       AND tdm20_role_type NOT IN ('A') --(A:이사회의장)은 우선 제외!!
                     ORDER BY 1
    ) LOOP
        ---------------------------------------------------------------------------------
        v_TDM40 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM40.tdm40_manl_job_id   := f_create_seq()                       ;
        v_TDM40.tdm40_company_id    := v_COMPANY_ID                         ;
        v_TDM40.tdm40_reg_date      := v_START_DATE                         ;
        v_TDM40.tdm40_job_nm        := c_DATA.tdm20_role_nm || '_ver.26.01' ;
        v_TDM40.tdm40_role_id       := c_DATA.tdm20_role_id                 ;
        v_TDM40.tdm40_org_id        := NULL                                 ;
        v_TDM40.tdm40_job_reason    := '최초생성'                           ;
        v_TDM40.tdm40_start_date    := v_START_DATE                         ;
        v_TDM40.tdm40_end_date      := v_END_DATE                           ;
        v_TDM40.tdm40_upd_nm        := 'system'                             ;
        v_TDM40.tdm40_upd_date      := f_sysdate()                          ;

        INSERT INTO tdm40_manl_job VALUES (v_TDM40.*);
    END LOOP;
*/


    RAISE NOTICE '----- 51. 부서책무매뉴얼 관리의무생성(tdm41) 생성 시작';

    delete from tdm44_manl_duty_org where tdm44_manl_duty_id in (select tdm41_manl_duty_id from tdm41_manl_duty where tdm41_company_id = v_COMPANY_ID);
    delete from tdm41_manl_duty where tdm41_company_id = v_COMPANY_ID;

    -------------------------------------------------------------------------------------
    -- 51. 부서책무매뉴얼 관리의무생성(tdm41) 및 부서지정(tdm44)
    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT *
                      FROM tdm40_manl_job
                           INNER JOIN getTdm30RoleAllc(v_COMPANY_ID, f_today(), true) ON tdm30_role_id             = tdm40_role_id
                           INNER JOIN tdm35_role_allc_task                            ON tdm35_role_allc_detail_id = tdm30_role_allc_detail_id
                     WHERE tdm40_company_id = v_COMPANY_ID
                       AND EXISTS ( SELECT 1
                                      FROM tdm20_role
                                           INNER JOIN tdm23_role_relate_org           ON tdm23_role_id = tdm20_role_id
                                           INNER JOIN getOrg(v_COMPANY_ID, f_today()) ON org00_org_id  = tdm23_org_id
                                           INNER JOIN conv10_tdm_base ON ( conv10_company_id     = tdm40_company_id                  AND
                                                                           conv10_duty_cd        = tdm35_task_relate_duty_seq::text  AND
                                                                           trim(conv10_org_nm02) IN (org00_kor_nm,'전체부서')        )
                                     WHERE tdm20_role_id = tdm40_role_id
                                  )
                     ORDER BY tdm40_role_id, tdm35_task_relate_duty_seq
    ) LOOP
        ---------------------------------------------------------------------------------
        v_TDM41 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM41.tdm41_manl_duty_id          := f_create_seq()                       ;
        v_TDM41.tdm41_manl_job_id           := c_DATA.tdm40_manl_job_id             ;
        v_TDM41.tdm41_role_id               := c_DATA.tdm40_role_id                 ;
        v_TDM41.tdm41_task_id               := c_DATA.tdm35_task_id                 ;
        v_TDM41.tdm41_task_relate_detail_id := c_DATA.tdm35_task_relate_detail_id   ;
        v_TDM41.tdm41_task_relate_duty_id   := c_DATA.tdm35_task_relate_duty_id     ;
        v_TDM41.tdm41_upd_nm                := 'system'                             ;
        v_TDM41.tdm41_upd_date              := f_sysdate()                          ;
        v_TDM41.tdm41_company_id            := v_COMPANY_ID                         ;

        INSERT INTO tdm41_manl_duty VALUES (v_TDM41.*);

        ---------------------------------------------------------------------------------
        -- 주요관리의무(개별) 담당부서 생성(tdm44)

        
        RAISE NOTICE '----- 51-1. 주요관리의무(개별) 담당부서 생성(tdm44) 생성 시작';

        INSERT
          INTO tdm44_manl_duty_org
        SELECT f_create_seq()
             , v_TDM41.tdm41_manl_duty_id
             , tdm_org_id
             , 'true'      --작성완료
             , f_today()
             , null
             , 'system'
             , f_sysdate()
          FROM (
                SELECT DISTINCT f_get_tdmOrg_id2(v_COMPANY_ID, org00_org_id, f_today()) tdm_org_id
                  FROM (
                        SELECT DISTINCT org00_org_id
                          FROM conv10_tdm_base
                               INNER JOIN getOrg(v_COMPANY_ID, f_today()) ON org00_kor_nm  = trim(conv10_org_nm02)
                               LEFT  JOIN tdm20_role                      ON ( tdm20_company_id = conv10_company_id  AND
                                                                               tdm20_role_nm    = conv10_role_nm     )
                         WHERE conv10_company_id = v_COMPANY_ID
                           AND conv10_duty_cd    = c_DATA.tdm35_task_relate_duty_seq::text
                           AND ( tdm20_role_id   = c_DATA.tdm40_role_id OR
                                 conv10_role_nm LIKE '공통%'            )
                       ) t0
               ) t;

        ---------------------------------------------------------------------------------
        -- 주요관리의무(공통) 담당부서 생성(tdm44)

        RAISE NOTICE '----- 51-2. 주요관리의무(공통) 담당부서 생성(tdm44) 생성 시작';

        INSERT
          INTO tdm44_manl_duty_org
        SELECT f_create_seq()
             , v_TDM41.tdm41_manl_duty_id
             , tdm23_org_id
             , 'true'      --작성완료
             , f_today()
             , null
             , 'system'
             , f_sysdate()
          FROM (
                 SELECT *
                   FROM tdm20_role
                        INNER JOIN tdm23_role_relate_org ON tdm23_role_id = tdm20_role_id
                  WHERE tdm20_role_id = c_DATA.tdm40_role_id
                    AND EXISTS ( SELECT 1
                                   FROM conv10_tdm_base
                                  WHERE conv10_company_id = tdm20_company_id
                                    AND conv10_duty_cd    = c_DATA.tdm35_task_relate_duty_seq::text
                                    AND conv10_org_nm02   = '전체부서' )
               ) t;
    END LOOP;

    -------------------------------------------------------------------------------------
    -- 52. 부서책무매뉴얼(tdm42) 및 점검항목(tdm43) 생성
    -------------------------------------------------------------------------------------

    RAISE NOTICE '----- 52. 부서책무매뉴얼(tdm42) 및 점검항목(tdm43) 생성 시작';

    delete from tdm43_manl where tdm43_manl_org_id in (select tdm42_manl_org_id from tdm42_manl_org where tdm42_company_id = v_COMPANY_ID);
    delete from tdm42_manl_org where tdm42_company_id = v_COMPANY_ID;

    v_CNT := 0;

    FOR c_DATA IN ( SELECT DISTINCT
                           tdm41_role_id        role_id
                         , tdm44_org_id         org_id
                         , tdm30_person_id      person_id
                         , tdm40_manl_job_id    manl_job_id
                      FROM tdm40_manl_job
                           INNER JOIN tdm41_manl_duty                                 ON tdm41_manl_job_id  = tdm40_manl_job_id
                           INNER JOIN tdm44_manl_duty_org                             ON tdm44_manl_duty_id = tdm41_manl_duty_id
                           INNER JOIN getTdm30RoleAllc(v_COMPANY_ID, f_today(), true) ON tdm30_role_id      = tdm41_role_id
                     WHERE tdm40_company_id = v_COMPANY_ID
                     ORDER BY 1,2,3
    ) LOOP
        ---------------------------------------------------------------------------------
        v_TDM42 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM42.tdm42_manl_org_id   := f_create_seq()           ;
        v_TDM42.tdm42_company_id    := v_COMPANY_ID             ;
        v_TDM42.tdm42_org_id        := c_DATA.org_id            ;
        v_TDM42.tdm42_exct_id       := c_DATA.person_id         ;
        v_TDM42.tdm42_role_id       := c_DATA.role_id           ;
        v_TDM42.tdm42_lock_yn       := 'false'                  ;
        v_TDM42.tdm42_start_date    := v_START_DATE             ;
        v_TDM42.tdm42_end_date      := NULL                     ;
        v_TDM42.tdm42_appr_id       := NULL                     ;
        v_TDM42.tdm42_manl_job_id   := c_DATA.manl_job_id       ;
        v_TDM42.tdm42_upd_nm        := 'system'                 ;
        v_TDM42.tdm42_upd_date      := f_sysdate()              ;

        INSERT INTO tdm42_manl_org VALUES (v_TDM42.*);

        ---------------------------------------------------------------------------------
        -- 부서책무매뉴얼 점검항목 생성(tdm43)

        RAISE NOTICE '----- 52-1. 부서책무매뉴얼 점검항목 생성(tdm43) 시작';
        
        FOR c_CHK IN ( SELECT conv10_tdm_base.*
                            , tdm20_role_nm                 AS role_nm
                            , tdm10_task_id                 AS task_id
                            , tdm10_task_nm                 AS task_nm
                            , tdm12_task_relate_detail_id   AS task_detail_id
                            , tdm12_content                 AS task_detail_nm
                            , tdm13_task_relate_duty_id     AS task_detail_duty_id
                            , tdm13_content                 AS task_detail_duty_nm
                            , tdm41_manl_duty_id
                         FROM tdm41_manl_duty
                              INNER JOIN tdm44_manl_duty_org             ON tdm44_manl_duty_id          = tdm41_manl_duty_id
                              INNER JOIN getOrg(v_COMPANY_ID, f_today()) ON org00_org_id                = tdm44_org_id
                              INNER JOIN tdm20_role                      ON tdm20_role_id               = tdm41_role_id
                              INNER JOIN tdm10_task                      ON tdm10_task_id               = tdm41_task_id
                              INNER JOIN tdm12_task_relate_detail        ON tdm12_task_relate_detail_id = tdm41_task_relate_detail_id
                              INNER JOIN tdm13_task_relate_duty          ON tdm13_task_relate_duty_id   = tdm41_task_relate_duty_id
                              INNER JOIN conv10_tdm_base                 ON (    conv10_company_id = tdm41_company_id
                                                                             AND conv10_duty_cd    = tdm13_seq::text
                                                                             AND trim(conv10_org_nm02) IN ( --점검부서
                                                                                                            SELECT org00_kor_nm
                                                                                                             UNION ALL
                                                                                                            --점검부서의 하위부서 중 책무점검부서로 설정된 부서가 아닌 부서들
                                                                                                            SELECT org_nm
                                                                                                              FROM getSubOrg(tdm44_org_id, f_today())
                                                                                                                   INNER JOIN getOrg(v_COMPANY_ID, f_today()) a ON a.org00_org_id = org_id
                                                                                                             WHERE org_id        != tdm44_org_id
                                                                                                               AND a.org00_tdm_yn = 'false'
                                                                                                             UNION ALL
                                                                                                            SELECT '전체부서' )
                                                                             AND ( conv10_role_nm = tdm20_role_nm OR
                                                                                   conv10_role_nm like '공통%'    ) )
                        WHERE tdm41_manl_job_id = v_TDM42.tdm42_manl_job_id
                          AND tdm41_role_id     = v_TDM42.tdm42_role_id
                          AND tdm44_org_id      = v_TDM42.tdm42_org_id
                        ORDER BY tdm13_seq, conv10_tdm_base_id
        ) LOOP
            -----------------------------------------------------------------------------
            v_TDM43 := NULL;
            -----------------------------------------------------------------------------
            v_TDM43.tdm43_manl_id               := f_create_seq()                   ;
            v_TDM43.tdm43_manl_org_id           := v_TDM42.tdm42_manl_org_id        ;
            v_TDM43.tdm43_company_id            := v_COMPANY_ID                     ;
            v_TDM43.tdm43_org_id                := v_TDM42.tdm42_org_id             ;
            v_TDM43.tdm43_exct_id               := v_TDM42.tdm42_exct_id            ;
            v_TDM43.tdm43_role_id               := v_TDM42.tdm42_role_id            ;
            v_TDM43.tdm43_role_nm               := c_CHK.role_nm                    ;
            v_TDM43.tdm43_task_id               := c_CHK.task_id                    ;
            v_TDM43.tdm43_task_nm               := c_CHK.task_nm                    ;
            v_TDM43.tdm43_task_relate_detail_id := c_CHK.task_detail_id             ;
            v_TDM43.tdm43_task_relate_detail_nm := c_CHK.task_detail_nm             ;
            v_TDM43.tdm43_task_relate_duty_id   := c_CHK.task_detail_duty_id        ;
            v_TDM43.tdm43_task_relate_duty_nm   := c_CHK.task_detail_duty_nm        ;
            v_TDM43.tdm43_check_item            := c_CHK.conv10_item_title          ;
            v_TDM43.tdm43_check_evid_doc_nm     := c_CHK.conv10_check_evid_doc      ;
            v_TDM43.tdm43_ceo_duty_cd           := NULL                             ;
            v_TDM43.tdm43_exct_duty_cd          := NULL                             ;
            v_TDM43.tdm43_import_level_cd       := NULL                             ;
            v_TDM43.tdm43_start_date            := NULL                             ;
            v_TDM43.tdm43_manl_duty_id          := c_CHK.tdm41_manl_duty_id         ;
            v_TDM43.tdm43_first_reg_emp_id      := NULL                             ;
            v_TDM43.tdm43_upd_nm                := 'system'                         ;
            v_TDM43.tdm43_upd_date              := f_sysdate()                      ;
            -----------------------------------------------------------------------------
            -- 점검항목코드
            v_CNT := v_CNT + 1;
            v_TDM43.tdm43_manl_cd := '26'||LPAD(v_CNT::text,5,'0');

            RAISE NOTICE '% - %) manl_cd : %', v_CNT, c_CHK.conv10_duty_cd, v_TDM43.tdm43_manl_cd;

            -----------------------------------------------------------------------------
            -- 점검주기, 점검월
            IF c_CHK.conv10_check_cycle = '연1회(2월)' THEN
                v_TDM43.tdm43_check_cycle_cd    := '06'             ; --(06:연)
                v_TDM43.tdm43_check_month       := '010000000000'   ;
            ELSIF c_CHK.conv10_check_cycle = '발생익월' THEN
                v_TDM43.tdm43_check_cycle_cd    := '99'             ; --(99:수시)
                v_TDM43.tdm43_check_month       := '111111111111'   ;
            ELSIF c_CHK.conv10_check_cycle = '매월' THEN
                v_TDM43.tdm43_check_cycle_cd    := '03'             ; --(03:월)
                v_TDM43.tdm43_check_month       := '111111111111'   ;
            ELSIF c_CHK.conv10_check_cycle = '분기(2월, 5월, 8월, 11월)' THEN
                v_TDM43.tdm43_check_cycle_cd    := '04'             ; --(04:분기)
                v_TDM43.tdm43_check_month       := '010010010010'   ;
            ELSIF c_CHK.conv10_check_cycle = '반기(2월, 8월)' THEN
                v_TDM43.tdm43_check_cycle_cd    := '05'             ; --(05:반기)
                v_TDM43.tdm43_check_month       := '010000010000'   ;
            ELSE
                v_TDM43.tdm43_check_cycle_cd    := NULL             ;
                v_TDM43.tdm43_check_month       := NULL             ;
            END IF;
            -----------------------------------------------------------------------------
            -- 점검방법
            IF c_CHK.conv10_check_step1 = 'Step2로 이동' THEN
                v_TDM43.tdm43_check_how := c_CHK.conv10_check_step2;
            ELSE
                v_TDM43.tdm43_check_how := CONCAT('step1) ' || c_CHK.conv10_check_step1 || CHR(10)
                                                 ,'step2) ' || c_CHK.conv10_check_step2
                                                 );
            END IF;
            -----------------------------------------------------------------------------
            -- 관련참고근거
            IF COALESCE(c_CHK.conv10_int_rule,'-') != '-' THEN
                v_TDM43.tdm43_ref_basis := '** 내규 : ' || c_CHK.conv10_int_rule;
            END IF;

            IF COALESCE(c_CHK.conv10_ext_rule,'-') != '-' THEN
                IF v_TDM43.tdm43_ref_basis IS NOT NULL THEN
                    v_TDM43.tdm43_ref_basis := v_TDM43.tdm43_ref_basis || CHR(10) || '** 외규 : ' || c_CHK.conv10_ext_rule;
                ELSE
                    v_TDM43.tdm43_ref_basis := '** 외규 : ' || c_CHK.conv10_ext_rule;
                END IF;
            END IF;

            -----------------------------------------------------------------------------
            INSERT INTO tdm43_manl VALUES (v_TDM43.*);

        END LOOP;
    END LOOP;

    --이행점검 데이터 제거
    /*
    delete from tdm51_chck_org       where tdm51_company_id = p_company_id;
    delete from tdm52_chck_manl      where tdm52_company_id = p_company_id;
    delete from tdm53_chck_exct      where tdm53_company_id = p_company_id;
    delete from tdm58_chck_appr_step where tdm58_chck_org_id in (select tdm51_chck_org_id from tdm51_chck_org where tdm51_company_id = p_company_id);
    */

    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN SQLERRM;
END;
$function$
```
