# f_get_appr_close_date

## FUNCTION public.f_get_appr_close_date(p_appr_id numeric, p_deadline_id numeric, p_company_id numeric)

- 반환: `date`
- 줄 수: 38

```sql
CREATE OR REPLACE FUNCTION public.f_get_appr_close_date(p_appr_id numeric, p_deadline_id numeric, p_company_id numeric)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_APR01     APR01_APPR%ROWTYPE;
    v_STD_DATE  DATE;
-----------------------------------------------------------------------------------------
BEGIN
    v_STD_DATE := NULL;
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_APR01
      FROM APR01_APPR
     WHERE APR01_APPR_ID = p_appr_id;
    -------------------------------------------------------------------------------------
    IF v_APR01.APR01_STATUS_CD = '30' THEN  --(30:완료)
        ---------------------------------------------------------------------------------
        -- 최종결재일 가져오기
        SELECT MAX(APR04_APPR_DATE)
          INTO v_STD_DATE
          FROM APR04_APPR_STEP
         WHERE APR04_APPR_ID       = p_appr_id
           AND APR04_STEP_TYPE_CD != '30';   --(30:참조)제외
        ---------------------------------------------------------------------------------
        IF v_STD_DATE IS NOT NULL THEN
            v_STD_DATE := f_get_std_date(p_deadline_id, v_STD_DATE, p_company_id);
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_STD_DATE;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
