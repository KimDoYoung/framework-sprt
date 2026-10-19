# f_create_tdm59

## FUNCTION public.f_create_tdm59(p_proc_type character varying, p_tdm51_id numeric)

- 반환: `character varying`
- 줄 수: 234

```sql
CREATE OR REPLACE FUNCTION public.f_create_tdm59(p_proc_type character varying, p_tdm51_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_TDM51             tdm51_chck_org%ROWTYPE;
    v_TDM53             tdm53_chck_exct%ROWTYPE;
    v_TDM59             tdm59_chck_appr_cmnt%ROWTYPE;
    v_TDM59_CHECK       tdm59_chck_appr_cmnt%ROWTYPE;

    c_TDM58             RECORD;
    c_TDM59             RECORD;

    v_STD_DATE          DATE;
    v_CNT               NUMERIC;
    
    v_errMsg            TEXT;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_proc_type = 'P' THEN -- 점검자 확정처리시 tdm59 table 생성
        -------------------------------------------------------------------------------------
        -- 부서점검현황 GET
        SELECT *
          INTO v_TDM51
          FROM tdm51_chck_org
         WHERE tdm51_chck_org_id = p_tdm51_id;
        -------------------------------------------------------------------------------------
        -- 임원승인현황 GET
        SELECT *
          INTO v_TDM53
          FROM tdm53_chck_exct
         WHERE tdm53_company_id = v_TDM51.tdm51_company_id
           AND tdm53_check_ym   = v_TDM51.tdm51_check_ym
           AND tdm53_role_id    = v_TDM51.tdm51_role_id;

        IF COALESCE(v_TDM53.tdm53_exct_appr_yn,'false') = 'true' THEN
            v_errMsg := '임원승인이 완료되었습니다.';
            RAISE USING ERRCODE = '90001';
        END IF;
        -------------------------------------------------------------------------------------
        -- 기준일 SET = 점검년월의 말일 => 점검시작일
        --v_STD_DATE := f_get_last_day((v_TDM51.tdm51_check_ym||'.01')::date);
        SELECT tdm50_start_date
          INTO v_STD_DATE
          FROM tdm50_chck_job
         WHERE tdm50_chck_job_id = v_TDM51.tdm51_chck_job_id;

        RAISE NOTICE 'v_STD_DATE : %', v_STD_DATE;

        -------------------------------------------------------------------------------------
        -- 직책-부서별 승인선(tdm58) => 부서별 승인정보(tdm59) 생성
        FOR c_TDM58 IN ( SELECT *
                              , COALESCE(( SELECT f_get_empTrans(a.tdm58_appr_emp_id, v_STD_DATE,'org_code_id')::numeric
                                             FROM tdm58_chck_appr_step a
                                            WHERE a.tdm58_chck_org_id = tdm58.tdm58_chck_org_id
                                              AND a.tdm58_appr_seq    > tdm58.tdm58_appr_seq
                                            ORDER BY tdm58_appr_seq
                                            LIMIT 1 ),0) AS parent_org_id
                              , COALESCE(( SELECT f_get_empTrans(a.tdm58_appr_emp_id, v_STD_DATE,'org_code_id')::numeric
                                             FROM tdm58_chck_appr_step a
                                            WHERE a.tdm58_chck_org_id = tdm58.tdm58_chck_org_id
                                              AND a.tdm58_appr_seq    < tdm58.tdm58_appr_seq
                                            ORDER BY tdm58_appr_seq DESC
                                            LIMIT 1 ),0) AS child_org_id
                           FROM tdm58_chck_appr_step tdm58
                                INNER JOIN getPerson(v_TDM51.tdm51_company_id, v_STD_DATE) ON emp00_person_id = tdm58_appr_emp_id
                          WHERE tdm58_chck_org_id = v_TDM51.tdm51_chck_org_id
                          ORDER BY tdm58_appr_seq
        ) LOOP
            ---------------------------------------------------------------------------------
            v_TDM59 := NULL;
            v_TDM59.tdm59_chck_exct_id      := v_TDM53.tdm53_chck_exct_id       ;
            v_TDM59.tdm59_appr_org_id       := c_TDM58.emp00_org_code_id        ;
            v_TDM59.tdm59_appr_emp_id       := c_TDM58.tdm58_appr_emp_id        ;
            v_TDM59.tdm59_parent_org_id     := c_TDM58.parent_org_id            ;

            /*===============================================================================

                    SELF SET

            ===============================================================================*/
            v_TDM59.tdm59_cmnt_type         := 'SELF'                           ;
            v_TDM59.tdm59_child_org_id      := 0                                ;
            v_TDM59.tdm59_appr_status_cd    := NULL                             ;
            v_TDM59.tdm59_appr_cmnt         := NULL                             ;
            v_TDM59.tdm59_report_cmnt       := NULL                             ;
            v_TDM59.tdm59_submit_yn         := 'false'                          ;
            v_TDM59.tdm59_submit_date       := NULL                             ;
            ---------------------------------------------------------------------------------
            -- 기생성내역 체크
            SELECT *
              INTO v_TDM59_CHECK
              FROM tdm59_chck_appr_cmnt
             WHERE tdm59_chck_exct_id   = v_TDM59.tdm59_chck_exct_id
               AND tdm59_appr_org_id    = v_TDM59.tdm59_appr_org_id
               AND tdm59_appr_emp_id    = v_TDM59.tdm59_appr_emp_id
               AND tdm59_cmnt_type      = v_TDM59.tdm59_cmnt_type
               AND tdm59_parent_org_id  = v_TDM59.tdm59_parent_org_id;
            ---------------------------------------------------------------------------------
            IF NOT FOUND THEN
                v_TDM59.tdm59_chck_appr_cmnt_id := f_create_seq();
                INSERT INTO tdm59_chck_appr_cmnt VALUES (v_TDM59.*);
            ---------------------------------------------------------------------------------
            ELSE
                -- 상태체크
                IF COALESCE(v_TDM59_CHECK.tdm59_appr_status_cd,'10') != '10' THEN
                    v_errMsg := '승인자('||c_TDM58.emp00_kor_nm||')의 승인처리가 완료되었습니다. 승인취소가 필요합니다';
                    RAISE USING ERRCODE = '90001';
                END IF;
                IF COALESCE(v_TDM59_CHECK.tdm59_submit_yn,'false') = 'true' THEN
                    v_errMsg := '승인자('||c_TDM58.emp00_kor_nm||')의 이행점검보고가 제출되었습니다. 제출취소가 필요합니다';
                    RAISE USING ERRCODE = '90001';
                END IF;

                v_TDM59.tdm59_chck_appr_cmnt_id := v_TDM59_CHECK.tdm59_chck_appr_cmnt_id;
            END IF;

            -- 부서점검(tdm51) 연결
            v_errmsg := f_create_tdm62(v_TDM59.tdm59_chck_appr_cmnt_id, p_tdm51_id);

            /*===============================================================================

                    SUB SET

            ===============================================================================*/
            v_TDM59.tdm59_cmnt_type         := 'SUB'                            ;
            v_TDM59.tdm59_child_org_id      := c_TDM58.child_org_id             ;
            v_TDM59.tdm59_appr_status_cd    := NULL                             ;
            v_TDM59.tdm59_appr_cmnt         := NULL                             ;
            v_TDM59.tdm59_report_cmnt       := NULL                             ;
            v_TDM59.tdm59_submit_yn         := 'false'                          ;
            v_TDM59.tdm59_submit_date       := NULL                             ;


            RAISE NOTICE 'child_org_id : %', c_TDM58.child_org_id;

            ---------------------------------------------------------------------------------
            IF c_TDM58.child_org_id = 0 THEN

                RAISE NOTICE 'emp00_org_code_id[%] - org_id[%]', c_TDM58.emp00_org_code_id, v_TDM51.tdm51_org_id;

                -----------------------------------------------------------------------------
                -- 승인부서와 점검부서가 같은 경우 SKIP
                IF c_TDM58.emp00_org_code_id = v_TDM51.tdm51_org_id THEN
                    CONTINUE;
                -----------------------------------------------------------------------------
                -- 승인부서와 점검부서가 다른 경우 점검부서를 SUB로 만든다.
                ELSE
                    v_TDM59.tdm59_chck_appr_cmnt_id := f_create_seq()           ;
                    v_TDM59.tdm59_child_org_id      := v_TDM51.tdm51_org_id     ;

                    INSERT INTO tdm59_chck_appr_cmnt VALUES (v_TDM59.*);
                END IF;
            ELSE
                -----------------------------------------------------------------------------
                -- 기생성내역 체크
                SELECT *
                  INTO v_TDM59_CHECK
                  FROM tdm59_chck_appr_cmnt
                 WHERE tdm59_chck_exct_id   = v_TDM59.tdm59_chck_exct_id
                   AND tdm59_appr_org_id    = v_TDM59.tdm59_appr_org_id
                   AND tdm59_appr_emp_id    = v_TDM59.tdm59_appr_emp_id
                   AND tdm59_cmnt_type      = v_TDM59.tdm59_cmnt_type
                   AND tdm59_parent_org_id  = v_TDM59.tdm59_parent_org_id
                   AND tdm59_child_org_id   = v_TDM59.tdm59_child_org_id;
                -----------------------------------------------------------------------------
                IF NOT FOUND THEN
                    v_TDM59.tdm59_chck_appr_cmnt_id := f_create_seq();
                    INSERT INTO tdm59_chck_appr_cmnt VALUES (v_TDM59.*);
                -----------------------------------------------------------------------------
                ELSE
                    -- 상태체크
                    IF COALESCE(v_TDM59_CHECK.tdm59_appr_status_cd,'10') != '10' THEN
                        v_errMsg := '승인자('||c_TDM58.emp00_kor_nm||')의 '||f_org_nm(c_TDM58.child_org_id, v_STD_DATE)||' 승인처리가 완료되었습니다. 승인취소가 필요합니다';
                        RAISE USING ERRCODE = '90001';
                    END IF;
                    
                    v_TDM59.tdm59_chck_appr_cmnt_id := v_TDM59_CHECK.tdm59_chck_appr_cmnt_id;
                END IF;
            END IF;

            -- 부서점검(tdm51) 연결
            v_errmsg := f_create_tdm62(v_TDM59.tdm59_chck_appr_cmnt_id, p_tdm51_id);

        END LOOP;
    
    -------------------------------------------------------------------------------------
    ELSIF p_proc_type = 'C' THEN  -- 점검자 확정 취소시 tdm59 table 정리
        ---------------------------------------------------------------------------------
        FOR c_TDM59 IN ( SELECT *
                           FROM tdm59_chck_appr_cmnt
                          WHERE tdm59_chck_appr_cmnt_id IN ( SELECT tdm62_chck_appr_cmnt_id
                                                               FROM tdm62_chck_cmnt_relate_org
                                                              WHERE tdm62_chck_org_id = p_tdm51_id )
        ) LOOP
            -----------------------------------------------------------------------------
            DELETE
              FROM tdm62_chck_cmnt_relate_org
             WHERE tdm62_chck_appr_cmnt_id  = c_TDM59.tdm59_chck_appr_cmnt_id
               AND tdm62_chck_org_id        = p_tdm51_id;
            -----------------------------------------------------------------------------
            SELECT COUNT(*)
              INTO v_CNT
              FROM tdm62_chck_cmnt_relate_org
             WHERE tdm62_chck_appr_cmnt_id  = c_TDM59.tdm59_chck_appr_cmnt_id;

            IF v_CNT = 0 THEN
                DELETE
                  FROM tdm59_chck_appr_cmnt
                 WHERE tdm59_chck_appr_cmnt_id = c_TDM59.tdm59_chck_appr_cmnt_id;
            END IF;
        END LOOP;

    -------------------------------------------------------------------------------------
    ELSE
        v_errMsg := CONCAT('정의되지 않은 처리구분자 입니다. 전산팀에 문의하세요 [',p_proc_type,']');
        RAISE USING ERRCODE = '90001';
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
