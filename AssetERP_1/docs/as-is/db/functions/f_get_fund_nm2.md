# f_get_fund_nm2

## FUNCTION public.f_get_fund_nm2(p_fund_id numeric, p_std_date date)

- 반환: `character varying`
- 줄 수: 27

```sql
CREATE OR REPLACE FUNCTION public.f_get_fund_nm2(p_fund_id numeric, p_std_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_NAME    VARCHAR;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT fnd02_fund_nm
      INTO v_NAME
      FROM fnd01_fund_code
           INNER JOIN fnd02_fund_info ON (    fnd02_fund_code_id = fnd01_fund_code_id
                                          AND fnd02_work_date = ( SELECT MAX(fnd02_work_date)
                                                                    FROM fnd02_fund_info
                                                                   WHERE fnd02_fund_code_id = fnd01_fund_code_id
                                                                     AND fnd02_work_date <= p_std_date ) )
     WHERE fnd01_fund_code_id = p_fund_id;
    -------------------------------------------------------------------------------------
    RETURN v_NAME;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN '';
END;
$function$
```
