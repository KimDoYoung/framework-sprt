# f_get_fss_account_cd

## FUNCTION public.f_get_fss_account_cd(p_company_id numeric, p_account_cd character varying)

- 반환: `character varying`
- 줄 수: 53

```sql
CREATE OR REPLACE FUNCTION public.f_get_fss_account_cd(p_company_id numeric, p_account_cd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACNT_CD act01_account_code.act01_account_cd%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    WITH RECURSIVE upAccountTree ( act01_account_cd
                                 , act01_parent_cd
                                 , act01_fss_slip_yn
                                 , depth
                                 , path
                                 , cycle
    ) AS ( SELECT act01_account_cd
                , act01_parent_cd
                , act01_fss_slip_yn
                , 0
                , ARRAY[act01_account_cd::text]
                , false
             FROM act01_account_code
            WHERE act01_company_id = p_company_id
              AND act01_account_cd = p_account_cd
            UNION ALL
           SELECT a.act01_account_cd
                , a.act01_parent_cd
                , a.act01_fss_slip_yn
                , b.depth + 1
                , array_append(b.path, a.act01_account_cd::text)
                , a.act01_account_cd = any(b.path)
             FROM act01_account_code a
                , upAccountTree b
            WHERE a.act01_account_cd = b.act01_parent_cd
              AND a.act01_company_id = p_company_id
              AND not b.cycle
    )
    SELECT act01_account_cd
      INTO v_ACNT_CD
      FROM upAccountTree
     WHERE COALESCE(act01_fss_slip_yn,'false') = 'true'
     ORDER BY depth
     LIMIT 1;
    -------------------------------------------------------------------------------------
    RETURN v_ACNT_CD;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN null;
END;
$function$
```
