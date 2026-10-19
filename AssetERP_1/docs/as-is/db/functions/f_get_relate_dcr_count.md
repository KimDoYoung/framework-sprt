# f_get_relate_dcr_count

## FUNCTION public.f_get_relate_dcr_count(p_journal_id numeric)

- 반환: `numeric`
- 줄 수: 113

```sql
CREATE OR REPLACE FUNCTION public.f_get_relate_dcr_count(p_journal_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_CNT   NUMERIC := 0;
    v_CNT1  NUMERIC := 0;
    v_CNT2  NUMERIC := 0;
    v_CNT3  NUMERIC := 0;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM act80_relate_appr
           INNER JOIN apr01_appr ON apr01_appr_id = act80_appr_id
     WHERE 1=1
       AND ( act80_journal_id IN ( SELECT p_journal_id
                                    UNION
                                   SELECT act02_journal_id
                                     FROM act02_journal
                                    WHERE act02_tr_id IN ( SELECT ast07_tr_id
                                                             FROM ast07_settle
                                                                  INNER JOIN act02_journal ON act02_tr_id = ast07_settle_id
                                                            WHERE act02_journal_id = p_journal_id
                                                            UNION
                                                           SELECT ast07_settle_id
                                                             FROM ast07_settle
                                                            WHERE ast07_tr_id IN ( SELECT ast07_tr_id
                                                                                     FROM ast07_settle
                                                                                          INNER JOIN act02_journal ON act02_tr_id = ast07_settle_id
                                                                                    WHERE act02_journal_id = p_journal_id )
                                                            UNION
                                                           SELECT ast07_settle_id
                                                             FROM ast07_settle
                                                            WHERE ast07_tr_id IN ( SELECT ast06_tr_id
                                                                                     FROM ast06_tr
                                                                                          INNER JOIN act02_journal ON act02_tr_id = ast06_tr_id
                                                                                    WHERE act02_journal_id = p_journal_id ) )   ) OR
             act80_tr_id IN ( SELECT act02_tr_id
                                FROM act02_journal
                               WHERE act02_journal_id = p_journal_id
                               UNION
                              SELECT ast07_tr_id
                                FROM ast07_settle
                               WHERE ast07_settle_id IN ( SELECT act02_tr_id
                                                            FROM act02_journal
                                                           WHERE act02_journal_id = p_journal_id )
                               UNION
                              SELECT ast07_settle_id
                                FROM ast07_settle
                               WHERE ast07_tr_id IN ( SELECT ast07_tr_id
                                                        FROM ast07_settle
                                                       WHERE ast07_settle_id IN ( SELECT act02_tr_id
                                                                                    FROM act02_journal
                                                                                   WHERE act02_journal_id = p_journal_id ) )
                               UNION
                              SELECT ast07_settle_id
                                FROM ast07_settle
                               WHERE ast07_tr_id IN ( SELECT act02_tr_id
                                                        FROM act02_journal
                                                       WHERE act02_journal_id = p_journal_id ) )    )
    ;
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT1
      FROM com01_relate_appr
           INNER JOIN apr01_appr ON apr01_appr_id = com01_appr_id
     WHERE com01_key_table_id = p_journal_id;
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT2
      FROM sys10_file
     WHERE sys10_parent_id = p_journal_id;
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT3
      FROM ast06_tr
           INNER JOIN apr01_appr ON ( apr01_appr_id = ast06_appr_id          AND
                                      COALESCE(apr01_status_cd,'99') != '99' )
     WHERE ast06_tr_id IN (SELECT act02_tr_id
                             FROM act02_journal
                            WHERE act02_journal_id = p_journal_id
                            UNION
                           SELECT ast07_tr_id
                             FROM ast07_settle
                            WHERE ast07_settle_id IN ( SELECT act02_tr_id
                                                         FROM act02_journal
                                                        WHERE act02_journal_id = p_journal_id )
                            UNION
                           SELECT ast07_settle_id
                             FROM ast07_settle
                            WHERE ast07_tr_id In ( SELECT ast07_tr_id
                                                     FROM ast07_settle
                                                    WHERE ast07_settle_id IN ( SELECT act02_tr_id
                                                                                 FROM act02_journal
                                                                                WHERE act02_journal_id = p_journal_id ))
                            UNION
                           SELECT ast07_settle_id
                             FROM ast07_settle
                            WHERE ast07_tr_id IN ( SELECT act02_tr_id
                                                     FROM act02_journal
                                                    WHERE act02_journal_id = p_journal_id )
                          );
    -------------------------------------------------------------------------------------
    RETURN v_CNT + v_CNT1 + v_CNT2 + v_CNT3;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
