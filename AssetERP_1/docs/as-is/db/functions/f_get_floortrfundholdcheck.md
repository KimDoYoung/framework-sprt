# f_get_floortrfundholdcheck

## FUNCTION public.f_get_floortrfundholdcheck(p_company_id numeric, p_item_cd character varying, p_std_date date)

- 반환: `boolean`
- 줄 수: 93

```sql
CREATE OR REPLACE FUNCTION public.f_get_floortrfundholdcheck(p_company_id numeric, p_item_cd character varying, p_std_date date)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_STD_DATE  DATE;
    v_RETURN    BOOLEAN := false;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_item_cd IS NULL OR p_item_cd = '' THEN RETURN false; END IF;
    -------------------------------------------------------------------------------------
    v_STD_DATE := LEAST(p_std_date, f_get_biz_date2(p_company_id, f_today(), '-1', 'true'));
    -------------------------------------------------------------------------------------
    RAISE NOTICE 'v_STD_DATE : %', v_STD_DATE;

    SELECT CASE WHEN (
                      SELECT count(*)
                        FROM fnd10_book
                       WHERE fnd10_company_id    = company_id
                         AND fnd10_item_cd       = item_cd
                         AND fnd10_std_date      = std_date
                         AND fnd10_item_group_cd = '3'
                         AND fnd10_market_cd    != 'B'
                     ) + (
                      SELECT count(*)
                        FROM fnd11_book_extr
                       WHERE fnd11_company_id   = company_id
                         AND fnd11_item_cd      = item_cd
                         AND fnd11_std_date     =  ( SELECT MAX(fnd11_std_date)
                                                       FROM fnd11_book_extr
                                                      WHERE fnd11_company_id = company_id
                                                        AND fnd11_std_date  <= std_date )
                         AND fnd11_item_type    = '2010'    /*(2010:주식)*/
                     ) + (
                      SELECT count(*)
                        FROM flt09_fund_item
                       WHERE flt09_company_id   = company_id
                         AND flt09_item_cd      = item_cd
                         AND flt09_std_date     = std_date
                         AND flt09_item_type    = '2010'    /*(2010:주식)*/
                     ) + (
                      SELECT count(*)
                        FROM adv10_book
                       WHERE adv10_company_id    = company_id
                         AND adv10_item_cd       = item_cd
                         AND adv10_std_date      = std_date
                         AND adv10_item_group_cd = '3'
                         AND adv10_market_cd    != 'B'
                     ) + (
                      SELECT count(*)
                        FROM adv11_book_extr
                       WHERE adv11_company_id   = company_id
                         AND adv11_item_cd      = item_cd
                         AND adv11_std_date     =  ( SELECT MAX(adv11_std_date)
                                                       FROM adv11_book_extr
                                                      WHERE adv11_company_id = company_id
                                                        AND adv11_std_date  <= std_date )
                         AND adv11_item_type    = '2010'    /*(2010:주식)*/
                     ) + (
                      SELECT count(*) cnt
                        FROM ast09_book
                             INNER JOIN ast01_class_tree ON ast01_class_tree_id = ast09_ast_class_tree_id
                             INNER JOIN com50_item       ON com50_item_short_cd = ast01_isin AND com50_item_type = '2010'
                       WHERE ast09_company_id = company_id
                         AND ast09_hold_qty  != 0
                         AND com50_item_cd    = item_cd
                         AND ast01_asset_type = '1'                       /*(1:고유자산)*/
                         AND ast01_item_s_class_cd IN ('201010','201011') /*(201010:상장주식/201011:IPO)*/
                         AND (ast09_ast_class_tree_id
                             ,ast09_keep_account_id
                             ,ast09_hold_date        ) IN ( SELECT ast09_ast_class_tree_id
                                                                 , ast09_keep_account_id
                                                                 , MAX(ast09_hold_date)
                                                              FROM ast09_book
                                                             WHERE ast09_company_id = company_id
                                                               AND ast09_hold_date <= std_date
                                                             GROUP BY ast09_ast_class_tree_id, ast09_keep_account_id )
                     ) = 0 THEN false
                           ELSE true END
      INTO v_RETURN
      FROM ( SELECT p_company_id    AS company_id
                  , p_item_cd       AS item_cd
                  , v_STD_DATE      AS std_date
           ) t;
    -------------------------------------------------------------------------------------
    RETURN v_RETURN;
-----------------------------------------------------------------------------------------
END;
$function$
```
