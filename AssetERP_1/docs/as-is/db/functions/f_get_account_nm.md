# f_get_account_nm

## FUNCTION public.f_get_account_nm(p_company_id numeric, p_account_cd character varying)

- 반환: `character varying`
- 줄 수: 25

```sql
CREATE OR REPLACE FUNCTION public.f_get_account_nm(p_company_id numeric, p_account_cd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACNT_NM   act01_account_code.act01_account_nm%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    SELECT CASE WHEN COALESCE(act01_use_yn,'false') = 'false' THEN '(사용X)' ELSE '' END
           ||act01_account_nm
      INTO v_ACNT_NM
      FROM act01_account_code
     WHERE act01_company_id = p_company_id
       AND act01_account_cd = p_account_cd;
    -------------------------------------------------------------------------------------
    RETURN v_ACNT_NM;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN p_account_cd;
END;
$function$
```
