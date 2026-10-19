# f_get_tdmsubmitpossibleyn

## FUNCTION public.f_get_tdmsubmitpossibleyn(p_company_id numeric, p_check_ym character varying, p_role_id numeric, p_person_id numeric, p_type character varying)

- 반환: `boolean`
- 줄 수: 95

```sql
CREATE OR REPLACE FUNCTION public.f_get_tdmsubmitpossibleyn(p_company_id numeric, p_check_ym character varying, p_role_id numeric, p_person_id numeric, p_type character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ALL_CNT           NUMERIC;
    v_SUBMIT_YN         BOOLEAN;
    v_ALL_APPR_YN       BOOLEAN;
    v_EXCT_APPR_YN      BOOLEAN;
    v_LOCK_YN           BOOLEAN;
    v_PARENT_APPR_YN    BOOLEAN;

    c_TDM59             RECORD;

    v_RETURN            BOOLEAN;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT CASE WHEN SUM(CASE WHEN tdm59_submit_yn      = 'true' THEN 1 ELSE 0 END) > 0        THEN true ELSE false END   AS submit_yn        --제출여부
         , CASE WHEN SUM(CASE WHEN tdm59_appr_status_cd = '20'   THEN 1 ELSE 0 END) = COUNT(*) THEN true ELSE false END   AS all_appr_yn      --전체승인여부
         , CASE WHEN SUM(CASE WHEN tdm53_exct_appr_yn   = 'true' THEN 1 ELSE 0 END) > 0        THEN true ELSE false END   AS exct_appr_yn     --임원승인여부
         , CASE WHEN SUM(CASE WHEN tdm53_lock_yn        = 'true' THEN 1 ELSE 0 END) > 0        THEN true ELSE false END   AS lock_yn          --잠금여부
         , COUNT(*)                                                                                                       AS all_cnt
      INTO v_SUBMIT_YN
         , v_ALL_APPR_YN
         , v_EXCT_APPR_YN
         , v_LOCK_YN
         , v_ALL_CNT
      FROM tdm53_chck_exct
           INNER JOIN tdm59_chck_appr_cmnt ON tdm59_chck_exct_id = tdm53_chck_exct_id
     WHERE tdm53_company_id  = p_company_id
       AND tdm53_check_ym    = p_check_ym
       AND tdm53_role_id     = p_role_id
       AND tdm59_appr_emp_id = p_person_id;
    -------------------------------------------------------------------------------------
    IF v_ALL_CNT = 0  THEN RETURN false; END IF;
    IF v_LOCK_YN      THEN RETURN false; END IF;
    -------------------------------------------------------------------------------------
    IF p_type = 'P' THEN
        IF v_SUBMIT_YN       THEN RETURN false; END IF;
        IF NOT v_ALL_APPR_YN THEN RETURN false; END IF;
    -------------------------------------------------------------------------------------
    ELSIF p_type = 'C' THEN
        IF NOT v_SUBMIT_YN THEN RETURN false; END IF;

        ---------------------------------------------------------------------------------
        -- 다음승인자가 승인처리를 한 경우 제출취소 불가능!!
        FOR c_TDM59 IN ( SELECT *
                           FROM tdm53_chck_exct
                                INNER JOIN tdm59_chck_appr_cmnt ON tdm59_chck_exct_id = tdm53_chck_exct_id
                          WHERE tdm53_company_id  = p_company_id
                            AND tdm53_check_ym    = p_check_ym
                            AND tdm53_role_id     = p_role_id
                            AND tdm59_appr_emp_id = p_person_id
        ) LOOP
            -----------------------------------------------------------------------------
            v_PARENT_APPR_YN := NULL;

            SELECT CASE WHEN SUM(CASE WHEN COALESCE(tdm60_appr_status_cd,'10') != '10' THEN 1 ELSE 0 END) > 0 THEN true ELSE false END
              INTO v_PARENT_APPR_YN
              FROM tdm60_chck_manl_appr
                   INNER JOIN tdm52_chck_manl ON tdm52_chck_manl_id = tdm60_chck_manl_id
                   INNER JOIN tdm51_chck_org  ON tdm51_chck_org_id  = tdm52_chck_org_id
             WHERE tdm51_chck_org_id IN ( SELECT tdm62_chck_org_id
                                            FROM tdm62_chck_cmnt_relate_org
                                           WHERE tdm62_chck_appr_cmnt_id = ( SELECT tdm59_chck_appr_cmnt_id
                                                                               FROM tdm59_chck_appr_cmnt
                                                                              WHERE tdm59_chck_exct_id  = c_TDM59.tdm59_chck_exct_id
                                                                                AND tdm59_appr_org_id   = c_TDM59.tdm59_parent_org_id
                                                                                AND tdm59_cmnt_type     = 'SUB'
                                                                                AND tdm59_child_org_id  = c_TDM59.tdm59_appr_org_id ) )
               AND tdm60_appr_org_id = c_TDM59.tdm59_parent_org_id ;

            IF v_PARENT_APPR_YN THEN RETURN false; END IF;
            -----------------------------------------------------------------------------
            -- 승인자가 임원인 경우 '잠금여부' 체크
            IF c_TDM59.tdm59_parent_org_id = 0 THEN
                IF v_LOCK_YN THEN RETURN false; END IF;
            -----------------------------------------------------------------------------
            -- 승인자가 임원이 아닌 경우 '임원승인여부' 체크
            ELSE
                IF v_EXCT_APPR_YN THEN RETURN false; END IF;
            END IF;

        END LOOP;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN true;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN false;
END;
$function$
```
