# f_get_journal_note

## FUNCTION public.f_get_journal_note(p_journal_id numeric)

- 반환: `character varying`
- 줄 수: 38

```sql
CREATE OR REPLACE FUNCTION public.f_get_journal_note(p_journal_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_note     act02_journal.act02_note%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT COALESCE(f_ast_class_tree_nm(ast_id),'')
           ||CASE WHEN LENGTH(CAST(ast_id AS VARCHAR)) > 0 AND LENGTH(TRIM(note)) > 0 THEN '-' ELSE '' END
           ||COALESCE(note,'')
      INTO v_note
      FROM (
             SELECT CASE WHEN ast06_tr_id     IS NOT NULL THEN ast06_ast_class_tree_id
                         WHEN ast07_settle_id IS NOT NULL THEN ( SELECT ast06_ast_class_tree_id
                                                                   FROM ast06_tr
                                                                  WHERE ast06_tr_id = ast07_tr_id )
                         ELSE NULL END as ast_id
                  , /*CASE WHEN ast06_tr_id     IS NOT NULL THEN ast06_note
                         WHEN ast07_settle_id IS NOT NULL THEN ast07_note
                         ELSE act02_note END */
                    act02_note  as note
               FROM act02_journal
                    LEFT OUTER JOIN ast06_tr         ON ast06_tr_id        = act02_tr_id
                    LEFT OUTER JOIN ast07_settle     ON ast07_settle_id    = act02_tr_id
                    LEFT OUTER JOIN biz01_promo      ON biz01_promo_id     = act02_biz_id
              WHERE act02_journal_id = p_journal_id
           ) t;
    -------------------------------------------------------------------------------------
    RETURN v_note;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN '';
END;
$function$
```
