# f_get_account_close_date

## FUNCTION public.f_get_account_close_date(p_company_id numeric, p_stddate date, p_type numeric)

- 반환: `date`
- 줄 수: 39

```sql
CREATE OR REPLACE FUNCTION public.f_get_account_close_date(p_company_id numeric, p_stddate date, p_type numeric)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_std_date_str  VARCHAR(8);
    v_close_month   VARCHAR(2);
    v_date          DATE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT sys01_account_close_month
      INTO v_close_month
      FROM sys01_company
     WHERE sys01_company_id = p_company_id;
    -------------------------------------------------------------------------------------
    IF v_close_month IS NULL THEN
        v_close_month := '12';
    END IF;
    -------------------------------------------------------------------------------------
    v_std_date_str := TO_CHAR(p_stdDate,'YYYYMMDD');
    -------------------------------------------------------------------------------------
    v_date := f_get_last_day(CAST(SUBSTR(v_std_date_str,1,4)||v_close_month||'01' AS DATE));
    -------------------------------------------------------------------------------------
    IF v_date < p_stdDate THEN
        v_date := v_date + INTERVAL '1year';
    END IF;
    -------------------------------------------------------------------------------------
    v_date := v_date + p_type * INTERVAL '1year';
    -------------------------------------------------------------------------------------
    RETURN v_date;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
