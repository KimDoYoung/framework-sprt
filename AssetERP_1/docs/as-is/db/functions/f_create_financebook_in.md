# f_create_financebook_in

## FUNCTION public.f_create_financebook_in(p_book_id numeric, p_tr record)

- 반환: `character varying`
- 줄 수: 150

```sql
CREATE OR REPLACE FUNCTION public.f_create_financebook_in(p_book_id numeric, p_tr record)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST09         ast09_book%ROWTYPE;
    v_EVAL_PRICE    NUMERIC;
    v_DML           VARCHAR(1);

    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '원장입고처리 실패';

    -------------------------------------------------------------------------------------
    -- 입고원장 GET
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST09
      FROM ast09_book
     WHERE ast09_book_id = p_book_id;

    IF v_AST09.ast09_book_id IS NULL THEN
        ---------------------------------------------------------------------------------
        v_DML := 'I';
        ---------------------------------------------------------------------------------
        v_AST09.ast09_book_id           := f_create_seq();
        v_AST09.ast09_company_id        := p_TR.ast06_company_id;
        v_AST09.ast09_ast_class_tree_id := p_TR.ast06_ast_class_tree_id;
        v_AST09.ast09_keep_account_id   := p_TR.ast08_account_id;
        v_AST09.ast09_hold_date         := p_TR.ast06_date;
        v_AST09.ast09_lock_up_period_cd := p_TR.ast08_lock_up_period_cd;
        v_AST09.ast09_lock_up_date      := p_TR.ast08_lock_up_date;
        v_AST09.ast09_first_pur_date    := p_TR.ast06_date;
        v_AST09.ast09_first_pur_amt     := p_TR.ast08_tr_amt - COALESCE(p_TR.ast08_acr_int_amt,0);
        v_AST09.ast09_book_end_yn       := 'false';
    ELSE
        ---------------------------------------------------------------------------------
        v_DML := 'U';
        ---------------------------------------------------------------------------------
    END IF;    

    -------------------------------------------------------------------------------------
    -- 평가단가
    v_errMsg := '평가단가 계산 실패 ['||p_TR.ast01_tr_unit||']' ;
    IF COALESCE(v_AST09.ast09_hold_qty,0) = 0 THEN
        v_EVAL_PRICE := 0;
    ELSE
        --v_EVAL_PRICE := COALESCE(v_AST09.ast09_for_eval_amt,0) / COALESCE(v_AST09.ast09_hold_qty,1) * p_TR.ast01_tr_unit;
        v_EVAL_PRICE := COALESCE(v_AST09.ast09_eval_amt,0) / COALESCE(v_AST09.ast09_hold_qty,1) * p_TR.ast01_tr_unit;
    END IF;

    -------------------------------------------------------------------------------------
    -- 입고원장 SET
    -------------------------------------------------------------------------------------
    -- 종료된 원장이면 최초취득일, 최초취득금액을 SET한다.
    IF COALESCE(v_AST09.ast09_book_end_yn,'false') = 'true' THEN
        v_AST09.ast09_first_pur_date := p_TR.ast06_date;
        v_AST09.ast09_first_pur_amt  := p_TR.ast08_tr_amt - COALESCE(p_TR.ast08_acr_int_amt,0);
        v_AST09.ast09_book_end_yn    := 'false';
    END IF;

    v_AST09.ast09_hold_qty          := COALESCE(v_AST09.ast09_hold_qty       ,0) + p_TR.ast08_qty;
    v_AST09.ast09_pur_amt           := COALESCE(v_AST09.ast09_pur_amt        ,0) + p_TR.ast08_tr_amt - COALESCE(p_TR.ast08_acr_int_amt,0);
    v_AST09.ast09_book_amt          := COALESCE(v_AST09.ast09_book_amt       ,0) + p_TR.ast08_tr_amt - COALESCE(p_TR.ast08_acr_int_amt,0);
    v_AST09.ast09_acr_int_amt       := COALESCE(v_AST09.ast09_acr_int_amt    ,0) + p_TR.ast08_acr_int_amt;

    IF p_TR.ast06_cur_cd = 'KRW' THEN
        v_AST09.ast09_for_pur_amt       := v_AST09.ast09_pur_amt;
        v_AST09.ast09_for_book_amt      := v_AST09.ast09_book_amt;
        v_AST09.ast09_for_acr_int_amt   := v_AST09.ast09_acr_int_amt;
    ELSE
        v_AST09.ast09_for_pur_amt       := COALESCE(v_AST09.ast09_for_pur_amt    ,0) + p_TR.ast08_for_tr_amt;
        v_AST09.ast09_for_book_amt      := COALESCE(v_AST09.ast09_for_book_amt   ,0) + p_TR.ast08_for_tr_amt;
        v_AST09.ast09_for_acr_int_amt   := 0;
    END IF;
    -------------------------------------------------------------------------------------
    v_errMsg := '평가금액/손익 계산 실패';
    /* (2025.01.17 CYY - 외화평가금액 계산 안하기로 함!!!!)
    v_AST09.ast09_for_eval_amt  := TRUNC(v_AST09.ast09_hold_qty * v_EVAL_PRICE / p_TR.ast01_tr_unit);
    IF v_AST09.ast09_for_eval_amt = 0 THEN
        v_AST09.ast09_eval_amt  := 0;
    ELSE
        v_AST09.ast09_eval_amt  := v_AST09.ast09_for_eval_amt * COALESCE(p_TR.ast06_fx_rate,1);
    END IF;*/

    v_AST09.ast09_eval_amt      := TRUNC(v_AST09.ast09_hold_qty * v_EVAL_PRICE / p_TR.ast01_tr_unit);
    v_AST09.ast09_for_eval_amt  := 0;
    -------------------------------------------------------------------------------------
    v_errMsg := '의무보유수량(매도제한수량) 설정 실패';
    IF p_TR.ast08_lock_up_date IS NOT NULL THEN
        v_AST09.ast09_lock_up_qty := p_TR.ast08_qty;
    END IF;
    -------------------------------------------------------------------------------------
    IF v_DML = 'I' THEN
        INSERT INTO ast09_book VALUES (v_AST09.*);
    ELSIF v_DML = 'U' THEN

        RAISE NOTICE '입고 UPDATE % - % - %', p_TR.ast06_date, v_AST09.ast09_hold_qty, v_AST09.ast09_book_id;

        UPDATE ast09_book
           SET ast09_hold_qty           = v_AST09.ast09_hold_qty
             , ast09_pur_amt            = v_AST09.ast09_pur_amt 
             , ast09_book_amt           = v_AST09.ast09_book_amt
             , ast09_eval_amt           = v_AST09.ast09_eval_amt
             , ast09_eval_pl            = v_AST09.ast09_eval_pl 
             , ast09_for_pur_amt        = v_AST09.ast09_for_pur_amt 
             , ast09_for_book_amt       = v_AST09.ast09_for_book_amt
             , ast09_for_eval_amt       = v_AST09.ast09_for_eval_amt
             , ast09_for_eval_pl        = v_AST09.ast09_for_eval_pl 
             , ast09_first_pur_date     = v_AST09.ast09_first_pur_date
             , ast09_first_pur_amt      = v_AST09.ast09_first_pur_amt
             , ast09_book_end_yn        = v_AST09.ast09_book_end_yn
             , ast09_acr_int_amt        = v_AST09.ast09_acr_int_amt
             , ast09_for_acr_int_amt    = v_AST09.ast09_for_acr_int_amt
             , ast09_lock_up_period_cd  = v_AST09.ast09_lock_up_period_cd
             , ast09_lock_up_date       = v_AST09.ast09_lock_up_date
             , ast09_lock_up_qty        = v_AST09.ast09_lock_up_qty
         WHERE ast09_book_id            = v_AST09.ast09_book_id;
        /*
        IF NOT FOUND THEN
          RAISE NOTICE 'No rows found';
        ELSIF FOUND THEN
           GET DIAGNOSTICS total_rows := ROW_COUNT;
              -- the above line used to get row_count
           RAISE NOTICE 'Rows Found : total_rows: %', total_rows;
        END IF;

        SELECT ast09_hold_qty
          INTO v_tmp
          FROM ast09_book
         WHERE ast09_book_id    = v_AST09.ast09_book_id;

        RAISE NOTICE 'UPDATE 후 수량 =====> %', v_tmp;*/
    END IF;   
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_errMsg ;
        RETURN v_errMsg;
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN v_errMsg||'-'||SQLERRM;
END;
$function$
```
