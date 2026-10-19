# f_get_biz_date2

## FUNCTION public.f_get_biz_date2(p_company_id numeric, p_stddate date, p_prd character varying, p_chk_yn character varying)

- 반환: `date`
- 줄 수: 36

```sql
CREATE OR REPLACE FUNCTION public.f_get_biz_date2(p_company_id numeric, p_stddate date, p_prd character varying, p_chk_yn character varying)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_STD_DATE  DATE;
    v_CHK_DATE  DATE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_STD_DATE := f_get_biz_date(p_company_id, p_stdDate, p_prd);
    -------------------------------------------------------------------------------------
    -- 휴장일 체크 (휴장일 공휴일 처리)
    IF p_chk_yn = 'true' THEN
        v_CHK_DATE := CAST(TO_CHAR(v_STD_DATE,'YYYY')||'-12-31' AS DATE);
        v_CHK_DATE := f_get_biz_date(p_company_id, v_CHK_DATE, '-0');

        IF v_CHK_DATE = v_STD_DATE THEN
            IF SUBSTR(p_prd,1,1) = '-' THEN
                v_STD_DATE := f_get_biz_date(p_company_id, v_STD_DATE , '-1');
            ELSE
                v_STD_DATE := f_get_biz_date(p_company_id, v_STD_DATE , '+1');
            END IF;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_STD_DATE;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %/%/%/%', p_company_id, p_stdDate, p_prd, p_chk_yn;
    RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
