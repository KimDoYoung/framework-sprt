# f_get_company_nm

## FUNCTION public.f_get_company_nm(p_company_id numeric)

- 반환: `character varying`
- 줄 수: 22

```sql
CREATE OR REPLACE FUNCTION public.f_get_company_nm(p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_NM    sys01_company.sys01_company_nm%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT sys01_company_nm
      INTO v_NM
      FROM sys01_company
     WHERE sys01_company_id = p_company_id;
    -------------------------------------------------------------------------------------
    RETURN v_NM;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
