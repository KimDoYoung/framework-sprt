# f_create_journal_no

## FUNCTION public.f_create_journal_no(p_company_id numeric, p_date date)

- 반환: `numeric`
- 줄 수: 27

```sql
CREATE OR REPLACE FUNCTION public.f_create_journal_no(p_company_id numeric, p_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_SEQ NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT COALESCE(MAX(act02_journal_no),0) + 1
      INTO v_SEQ
      FROM act02_journal
     WHERE act02_company_id = p_company_id
       AND act02_date       = p_date;

    IF v_SEQ = 1 THEN
        v_SEQ := CAST(TO_CHAR(p_date,'YYMMDD')||LPAD(v_SEQ||'',3,'0') AS NUMERIC);
    END IF;

    RETURN v_SEQ;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
