# f_get_corp_nm

## FUNCTION public.f_get_corp_nm(p_corp_id numeric)

- 반환: `character varying`
- 줄 수: 35

```sql
CREATE OR REPLACE FUNCTION public.f_get_corp_nm(p_corp_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_CORP_NM   sys15_corp.sys15_corp_nm%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    IF p_corp_id IS NULL THEN
        RETURN NULL;
    END IF;

    SELECT sys15_corp_nm
      INTO v_CORP_NM
      FROM sys15_corp
     WHERE sys15_corp_id = p_corp_id;
    -------------------------------------------------------------------------------------
    -- 사업비의 지출처에는 사원ID가 들어감
    IF v_CORP_NM IS NULL THEN
        SELECT emp01_kor_nm
          INTO v_CORP_NM
          FROM emp01_person
         WHERE emp01_person_id = p_corp_id;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_CORP_NM;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN CAST(p_corp_id AS VARCHAR);
END;
$function$
```
