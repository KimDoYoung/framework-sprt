# f_get_journal_corp_nm

## FUNCTION public.f_get_journal_corp_nm(p_journal_id numeric)

- 반환: `character varying`
- 줄 수: 45

```sql
CREATE OR REPLACE FUNCTION public.f_get_journal_corp_nm(p_journal_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_corp_nm   sys15_corp.sys15_corp_nm%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT COALESCE(CASE WHEN act02_biz_id IS NOT NULL
                         THEN ( SELECT crd02_franchise_nm
                                  FROM crd02_data
                                 WHERE crd02_data_id = biz01_card_data_id )
                         ELSE ( SELECT sys15_corp_nm
                                  FROM sys15_corp
                                 WHERE sys15_corp_id = act02_corp_id ) END , '')
      INTO v_corp_nm
      FROM act02_journal
           LEFT OUTER JOIN ast06_tr         ON ast06_tr_id        = act02_tr_id
           LEFT OUTER JOIN ast07_settle     ON ast07_settle_id    = act02_tr_id
           LEFT OUTER JOIN biz01_promo      ON biz01_promo_id     = act02_biz_id
     WHERE act02_journal_id = p_journal_id;

    RAISE NOTICE 'v_corp_nm : %', v_corp_nm;
    -------------------------------------------------------------------------------------
    IF COALESCE(v_corp_nm, '') = '' THEN
        RAISE NOTICE 'IN.... %', p_journal_id;

        SELECT f_emp_kor_nm(act02_corp_id)
          INTO v_corp_nm
          FROM act02_journal
         WHERE act02_journal_id = p_journal_id;

         RAISE NOTICE 'IN--- v_corp_nm : %', v_corp_nm;
    END IF;
    -------------------------------------------------------------------------------------
    RAISE NOTICE 'RETURN --- v_corp_nm : %', v_corp_nm;
    RETURN COALESCE(v_corp_nm,' ');
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 'err';
END;
$function$
```
