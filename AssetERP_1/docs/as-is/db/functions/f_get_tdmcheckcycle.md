# f_get_tdmcheckcycle

## FUNCTION public.f_get_tdmcheckcycle(p_manl_id numeric)

- 반환: `character varying`
- 줄 수: 37

```sql
CREATE OR REPLACE FUNCTION public.f_get_tdmcheckcycle(p_manl_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_CHECK_CYCLE   VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT f_cdnm('CycleCode', tdm43_check_cycle_cd, tdm43_company_id, f_today())
           || CASE WHEN tdm43_check_cycle_cd = '03' THEN ''
                   WHEN tdm43_check_cycle_cd = '99' THEN '(발생익월)'
                   ELSE ( CASE WHEN LENGTH(tdm43_check_month) != 12 THEN ''
                               ELSE '('|| (
                                            SELECT STRING_AGG(pos||'월', ', ')
                                              FROM (
                                                     SELECT GENERATE_SERIES(1, LENGTH(tdm43_check_month)) pos
                                                   ) t
                                             WHERE SUBSTR(tdm43_check_month, pos, 1) = '1'
                                          )||')'
                               END ) END
      INTO v_CHECK_CYCLE
      FROM tdm43_manl
     WHERE tdm43_manl_id = p_manl_id;
    -------------------------------------------------------------------------------------
    IF v_CHECK_CYCLE IS NULL THEN
        v_CHECK_CYCLE := '';
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_CHECK_CYCLE;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN '';
END;
$function$
```
