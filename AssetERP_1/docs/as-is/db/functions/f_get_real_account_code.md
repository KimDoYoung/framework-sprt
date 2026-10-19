# f_get_real_account_code

## FUNCTION public.f_get_real_account_code(p_company_id numeric, p_repr_account_cd character varying, p_map_id character varying)

- 반환: `character varying`
- 줄 수: 116

```sql
CREATE OR REPLACE FUNCTION public.f_get_real_account_code(p_company_id numeric, p_repr_account_cd character varying, p_map_id character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACNT_CD   act13_real_account_map.act13_real_account_cd%TYPE;
-----------------------------------------------------------------------------------------
BEGIN

    -------------------------------------------------------------------------------------
    SELECT act13_real_account_cd
      INTO v_ACNT_CD
      FROM act13_real_account_map
     WHERE act13_company_id      = p_company_id
       AND act13_repr_account_cd = p_repr_account_cd
       AND act13_account_map     = p_map_id
     LIMIT 1;
    -------------------------------------------------------------------------------------
    IF COALESCE(v_ACNT_CD,'') = '' THEN
        ---------------------------------------------------------------------------------
        SELECT act13_real_account_cd
          INTO v_ACNT_CD
          FROM ( SELECT 1 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = SUBSTR(p_map_id,1,8)||'00'
                  UNION
                 SELECT 2 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = SUBSTR(p_map_id,1,6)||'99'||SUBSTR(p_map_id,9,2)
                  UNION
                 SELECT 3 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = SUBSTR(p_map_id,1,6)||'99'||'00'
                  UNION
                 SELECT 4 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = SUBSTR(p_map_id,1,4)||'00'||SUBSTR(p_map_id,7,2)||'00'
                  UNION
                 SELECT 5 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = SUBSTR(p_map_id,1,4)||'00'||'99'||'00'
                  UNION
                 SELECT 6 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = SUBSTR(p_map_id,1,2)||'0000'||SUBSTR(p_map_id,7,2)||'00'
                  UNION
                 SELECT 7 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = SUBSTR(p_map_id,1,2)||'0000'||'99'||'00'
                  UNION
                 SELECT 8 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = '000000'||SUBSTR(p_map_id,7,2)||'00'
                  UNION
                 SELECT 9 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = '000000'||'99'||'00'
                  UNION
                 SELECT 10 seq
                      , act13_real_account_cd
                      , act13_account_map
                   FROM act13_real_account_map
                  WHERE act13_company_id        = p_company_id
                    AND act13_repr_account_cd   = p_repr_account_cd
                    AND act13_account_map       = '0000000000'
               ) t
         ORDER BY seq
         LIMIT 1;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_ACNT_CD;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN NULL;
END;
$function$
```
