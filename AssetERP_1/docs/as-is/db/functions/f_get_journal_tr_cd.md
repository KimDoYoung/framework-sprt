# f_get_journal_tr_cd

## FUNCTION public.f_get_journal_tr_cd(p_journal_id numeric)

- 반환: `character varying`
- 줄 수: 34

```sql
CREATE OR REPLACE FUNCTION public.f_get_journal_tr_cd(p_journal_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_tr_cd     VARCHAR(4);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT CASE WHEN act02_biz_id  IS NOT NULL THEN '9001'                                                      /* 9001:법인카드사용 */
                WHEN act02_tr_id   IS NOT NULL THEN ( CASE WHEN ast07_settle_id IS NOT NULL THEN ast07_tr_cd
                                                           ELSE ast06_tr_cd END )
                WHEN act02_pay_month_cd IS NOT NULL THEN ( CASE act02_pay_month_cd WHEN '01' THEN '5020'        /* 5020:급여지급     */
                                                                                   WHEN '02' THEN '5021'        /* 5021:상여금지급   */
                                                                                   WHEN '03' THEN '5022' END )  /* 5022:퇴직정산지급 */
                WHEN (SELECT COUNT(*)
                        FROM pay50_expense
                       WHERE pay50_journal_id = act02_journal_id) > 0 THEN '9100'                               /* 9100:사업비발생   */
                ELSE '9500' END                                                                                 /* 9500:전표입력     */
      INTO v_tr_cd
      FROM act02_journal
           LEFT OUTER JOIN ast06_tr         ON ast06_tr_id        = act02_tr_id
           LEFT OUTER JOIN ast07_settle     ON ast07_settle_id    = act02_tr_id
           LEFT OUTER JOIN biz01_promo      ON biz01_promo_id     = act02_biz_id
     WHERE act02_journal_id = p_journal_id;
    -------------------------------------------------------------------------------------
    RETURN v_tr_cd;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
