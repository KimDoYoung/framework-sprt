# f_get_sellpossibleqty

## FUNCTION public.f_get_sellpossibleqty(p_book_id numeric)

- 반환: `numeric`
- 줄 수: 40

```sql
CREATE OR REPLACE FUNCTION public.f_get_sellpossibleqty(p_book_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST09                 ast09_book%ROWTYPE;
    v_LOCK_UP_QTY           NUMERIC;
    v_SELL_POSSIBLE_QTY     NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST09
      FROM ast09_book
     WHERE ast09_book_id = p_book_id;
    -------------------------------------------------------------------------------------
    IF v_AST09.ast09_lock_up_date IS NULL THEN
        v_LOCK_UP_QTY := 0;
    -------------------------------------------------------------------------------------
    ELSE
        IF v_AST09.ast09_lock_up_date >= v_AST09.ast09_hold_date THEN
            v_LOCK_UP_QTY := COALESCE(v_AST09.ast09_lock_up_qty,0);
        ELSE
            v_LOCK_UP_QTY := 0;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    v_SELL_POSSIBLE_QTY := v_AST09.ast09_hold_qty - v_LOCK_UP_QTY;
    IF v_SELL_POSSIBLE_QTY < 0 THEN
        v_SELL_POSSIBLE_QTY := 0;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_SELL_POSSIBLE_QTY;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```

## FUNCTION public.f_get_sellpossibleqty(p_book_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 40

```sql
CREATE OR REPLACE FUNCTION public.f_get_sellpossibleqty(p_book_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST09                 ast09_book%ROWTYPE;
    v_LOCK_UP_QTY           NUMERIC;
    v_SELL_POSSIBLE_QTY     NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST09
      FROM ast09_book
     WHERE ast09_book_id = p_book_id;
    -------------------------------------------------------------------------------------
    IF v_AST09.ast09_lock_up_date IS NULL THEN
        v_LOCK_UP_QTY := 0;
    -------------------------------------------------------------------------------------
    ELSE
        IF v_AST09.ast09_lock_up_date >= p_std_date THEN
            v_LOCK_UP_QTY := COALESCE(v_AST09.ast09_lock_up_qty,0);
        ELSE
            v_LOCK_UP_QTY := 0;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    v_SELL_POSSIBLE_QTY := v_AST09.ast09_hold_qty - v_LOCK_UP_QTY;
    IF v_SELL_POSSIBLE_QTY < 0 THEN
        v_SELL_POSSIBLE_QTY := 0;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_SELL_POSSIBLE_QTY;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
