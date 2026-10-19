# f_get_confirmer

## FUNCTION public.f_get_confirmer(p_person_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 66

```sql
CREATE OR REPLACE FUNCTION public.f_get_confirmer(p_person_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_COMPANY_ID    NUMERIC;
v_ORG_ID        NUMERIC;
v_PERSON_ID     NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    /*
        조직장 Get, 조직장이 공석인 경우 준법감사인으로
    */
    -------------------------------------------------------------------------------------
    SELECT emp01_company_id
         , f_get_emptrans(emp01_person_id, p_std_date, 'org_code_id') org_id
      INTO v_COMPANY_ID
         , v_ORG_ID
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;
    -------------------------------------------------------------------------------------
    SELECT emp03_person_id
      INTO v_PERSON_ID
      FROM emp01_person
           INNER JOIN emp03_trans ON (    emp03_person_id = emp01_person_id
                                      AND emp03_trans_date = (SELECT MAX(emp03_trans_date)
                                                                FROM emp03_trans
                                                               WHERE emp03_person_id   = emp01_person_id
                                                                 AND emp03_trans_date <= p_std_date) )
     WHERE emp01_company_id  = v_COMPANY_ID
       AND emp03_org_code_id = v_ORG_ID
       AND emp03_trans_cd   != '900'
       AND emp03_org_head_yn = 'true'
       AND NOT EXISTS ( SELECT 1
                          FROM emp04_add_title
                         WHERE emp04_add_person_id = emp03_person_id
                           AND ( ( emp04_start_date                        > p_std_date ) OR
                                   COALESCE(emp04_close_date,'9999-12-31') < p_std_date ) )
     ORDER BY emp03_title_cd
     LIMIT 1;
    -------------------------------------------------------------------------------------
    -- 조직장 공석시 준법감시인이 확인자임 (2024.6.10 이용희 전무님 요청)
    IF v_PERSON_ID IS NULL THEN
        SELECT emp03_person_id
          INTO v_PERSON_ID
          FROM emp01_person
               INNER JOIN emp03_trans ON (    emp03_person_id = emp01_person_id
                                          AND emp03_trans_date = (SELECT MAX(emp03_trans_date)
                                                                    FROM emp03_trans
                                                                   WHERE emp03_person_id   = emp01_person_id
                                                                     AND emp03_trans_date <= p_std_date) )
         WHERE emp01_company_id  = v_COMPANY_ID
           AND emp03_trans_cd   != '900' --(900:퇴직)
           AND emp03_grade_cd    = '120' --(120:준법감시인)
         ORDER BY emp03_trans_date DESC
         LIMIT 1;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_PERSON_ID;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
