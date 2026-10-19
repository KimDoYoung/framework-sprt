# f_get_fund_nm

## FUNCTION public.f_get_fund_nm(p_company_id numeric, p_fund_cd character varying, p_std_date date)

- 반환: `character varying`
- 줄 수: 29

```sql
CREATE OR REPLACE FUNCTION public.f_get_fund_nm(p_company_id numeric, p_fund_cd character varying, p_std_date date)
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
         , fnd02_fund_info
     WHERE fnd01_fund_code_id = fnd02_fund_code_id
       AND fnd01_company_id   = p_company_id
       AND fnd01_fund_cd      = p_fund_cd
       AND (fnd02_fund_code_id, fnd02_work_date) IN ( SELECT fnd02_fund_code_id, MAX(fnd02_work_date)
                                                        FROM fnd02_fund_info
                                                       WHERE fnd02_work_date <= p_std_date
                                                       GROUP BY fnd02_fund_code_id );
    -------------------------------------------------------------------------------------
    RETURN v_NAME;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN '';
END;
$function$
```
