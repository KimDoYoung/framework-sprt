# f_get_price_stk

## FUNCTION public.f_get_price_stk(p_std_date date, p_item_cd character varying)

- 반환: `numeric`
- 줄 수: 29

```sql
CREATE OR REPLACE FUNCTION public.f_get_price_stk(p_std_date date, p_item_cd character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_STD_DATE  DATE;
    v_PRICE     NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_STD_DATE := f_get_biz_date2(0, p_std_date, '-0', 'true');
    -------------------------------------------------------------------------------------
    -- 임직원 자기매매 상장주식/ETF 시세조회용 (12자리 표준코드 사용)
    -------------------------------------------------------------------------------------
    SELECT icam20_close_price
      INTO v_PRICE
      FROM icam20_price
     WHERE icam20_std_date  = v_STD_DATE
       AND icam20_item_type = '2010'    --(2010:주식)
       AND icam20_isin      = p_item_cd;
    -------------------------------------------------------------------------------------
    RETURN COALESCE(v_PRICE,0);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
