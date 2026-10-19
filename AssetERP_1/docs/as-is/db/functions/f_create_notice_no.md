# f_create_notice_no

## FUNCTION public.f_create_notice_no(p_company_id numeric)

- 반환: `character varying`
- 줄 수: 51

```sql
CREATE OR REPLACE FUNCTION public.f_create_notice_no(p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_NO        NUMERIC;
    v_YYMM      VARCHAR(6) = TO_CHAR(now(), 'yymm');
    v_RETURN    VARCHAR(9);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT MAX(bbs06_no)
      INTO v_NO
      FROM bbs06_notice_no
     WHERE bbs06_company_id = p_company_id
       AND bbs06_yymm       = v_YYMM;
    -------------------------------------------------------------------------------------
    IF v_NO IS NULL THEN
        ---------------------------------------------------------------------------------
        v_NO := 1;
        ---------------------------------------------------------------------------------
        INSERT
          INTO bbs06_notice_no
        SELECT f_create_seq()
             , p_company_id
             , v_YYMM
             , v_NO;
    -------------------------------------------------------------------------------------
    ELSE
        v_NO := v_NO + 1;
        ---------------------------------------------------------------------------------
        UPDATE bbs06_notice_no
           SET bbs06_no = v_NO
         WHERE bbs06_company_id = p_company_id
           AND bbs06_yymm       = v_YYMM;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_company_id = 0 THEN
        v_RETURN := CONCAT(v_YYMM,'-',LPAD(v_NO||'',3,'0'),'S');
    ELSE
        v_RETURN := CONCAT(v_YYMM,'-',LPAD(v_NO||'',3,'0'),'A');
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_RETURN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
