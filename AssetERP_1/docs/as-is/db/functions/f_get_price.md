# f_get_price

## FUNCTION public.f_get_price(p_std_date date, p_ast_class_tree_id numeric)

- 반환: `numeric`
- 줄 수: 60

```sql
CREATE OR REPLACE FUNCTION public.f_get_price(p_std_date date, p_ast_class_tree_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST01     ast01_class_tree%ROWTYPE;
    v_PRICE_ID  NUMERIC;
    v_PRICE     NUMERIC;
    v_STD_DATE  DATE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 고유자산관리 시세조회용 (주식/ETF 코스콤 6자리코드 사용)
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST01
      FROM ast01_class_tree
     WHERE ast01_class_tree_id = p_ast_class_tree_id;

    IF v_AST01.ast01_class_tree_id IS NULL THEN
        RETURN 0;
    END IF;

    IF COALESCE(v_AST01.ast01_isin,'') = '' THEN
        RETURN 0;
    END IF;
    -------------------------------------------------------------------------------------
    -- 기준일 SET : 영업일이 아닌 경우 전영업일로 가져온다. (휴장일 체크)
    v_STD_DATE := f_get_biz_date2(0, p_std_date, '-0', 'true');
    -------------------------------------------------------------------------------------
    SELECT ast25_price_id, ast25_eval_price
      INTO v_PRICE_ID, v_PRICE
      FROM ast25_price
     WHERE ast25_company_id = v_AST01.ast01_company_id
       AND ast25_std_date   = v_STD_DATE
       AND ast25_item_type  = CASE WHEN v_AST01.ast01_item_s_class_cd = '205010' THEN '2010'  /* ETF(205010)인 경우 상품분류가 주식(2010)으로 들어옴 */
                                   ELSE v_AST01.ast01_item_m_class_cd END
       AND ast25_item_cd    = v_AST01.ast01_isin;

    IF v_PRICE_ID IS NULL THEN
        ---------------------------------------------------------------------------------
        SELECT icam20_close_price
          INTO v_PRICE
          FROM icam20_price
         WHERE icam20_std_date  = v_STD_DATE
           AND icam20_item_type = CASE WHEN v_AST01.ast01_item_s_class_cd = '205010' THEN '2010'  /* ETF(205010)인 경우 상품분류가 주식(2010)으로 들어옴 */
                                       ELSE v_AST01.ast01_item_m_class_cd END
           AND icam20_item_cd   = v_AST01.ast01_isin
         ORDER BY icam20_isin
         LIMIT 1;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN COALESCE(v_PRICE,0);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
