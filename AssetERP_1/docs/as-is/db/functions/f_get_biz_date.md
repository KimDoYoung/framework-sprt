# f_get_biz_date

## FUNCTION public.f_get_biz_date(p_company_id numeric, p_stddate date, p_prd character varying)

- 반환: `date`
- 줄 수: 83

```sql
CREATE OR REPLACE FUNCTION public.f_get_biz_date(p_company_id numeric, p_stddate date, p_prd character varying)
 RETURNS date
 LANGUAGE plpgsql
 STABLE
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_sign   NUMERIC;
v_days   NUMERIC;
v_date   DATE;
v_bizYn  VARCHAR(5);
-----------------------------------------------------------------------------------------
BEGIN

    --RAISE NOTICE 'f_get_biz_date IN) p_company_id : [%]', p_company_id;
    --RAISE NOTICE 'f_get_biz_date IN) p_stdDate    : [%]', p_stdDate;
    --RAISE NOTICE 'f_get_biz_date IN) p_prd        : [%]', p_prd;

    -------------------------------------------------------------------------------------
    IF p_prd = '0' THEN
        RETURN p_stdDate;
    END IF;
    -------------------------------------------------------------------------------------
    IF SUBSTR(p_prd,1,1) = '-' THEN
        v_sign := -1;
    ELSE
        v_sign := 1;
    END IF;
    v_days := ABS(CAST(p_prd AS NUMERIC));
    -------------------------------------------------------------------------------------
    IF v_days = 0 THEN
        SELECT SYS12_WORKING_YN
          INTO v_bizYn
          FROM SYS12_CALENDAR
         WHERE SYS12_COMPANY_ID = p_company_id
           AND SYS12_DAY        = DATE_TRUNC('day',p_stdDate);
        IF v_bizYn IS NULL THEN RAISE; END IF;
        ---------------------------------------------------------------------------------
        IF v_bizYn = 'true' THEN
            RETURN p_stdDate;
        ELSE
            v_days := 1;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    IF v_sign = 1 THEN
        SELECT MAX(SYS12_DAY)
          INTO v_date
          FROM ( SELECT *
                   FROM SYS12_CALENDAR
                  WHERE SYS12_COMPANY_ID = p_company_id
                    AND SYS12_WORKING_YN = 'true'
                    AND SYS12_DAY > DATE_TRUNC('day',p_stdDate)
                  ORDER BY SYS12_DAY ASC
                  LIMIT v_days
                ) a ;
        IF v_date IS NULL THEN
            RAISE NOTICE 'SYS12_CALENDAR 날짜정보 없음!!!!';
            RAISE;
        END IF;
    ELSE
        SELECT MIN(SYS12_DAY)
          INTO v_date
          FROM ( SELECT *
                   FROM SYS12_CALENDAR
                  WHERE SYS12_COMPANY_ID = p_company_id
                    AND SYS12_WORKING_YN = 'true'
                    AND SYS12_DAY < DATE_TRUNC('day',p_stdDate)
                  ORDER BY SYS12_DAY DESC
                  LIMIT v_days
                ) a ;
        IF v_date IS NULL THEN RAISE; END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_date;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %/%/%', p_company_id, p_stdDate, p_prd;
    RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
