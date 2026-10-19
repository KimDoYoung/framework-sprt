# f_create_financebook_out

## FUNCTION public.f_create_financebook_out(p_book_id numeric, p_out_qty numeric, p_cur_cd character varying)

- 반환: `character varying`
- 줄 수: 114

```sql
CREATE OR REPLACE FUNCTION public.f_create_financebook_out(p_book_id numeric, p_out_qty numeric, p_cur_cd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST09     ast09_book%ROWTYPE;

    v_errMsg    VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '원장출고처리 실패';

    -------------------------------------------------------------------------------------
    -- 출고원장 GET
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST09
      FROM ast09_book
     WHERE ast09_book_id = p_book_id;

    IF v_AST09.ast09_book_id IS NULL THEN
        v_errMsg := '출고원장이 존재하지 않습니다. ('||p_book_id||')';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    IF f_get_sellPossibleQty(v_AST09.ast09_book_id) < p_out_qty THEN
        v_errMsg := '출고수량이 매도가능수량보다 많습니다. ('
                    ||f_ast_class_tree_nm(v_AST09.ast09_ast_class_tree_id)
                    ||' - 매도가능수량['||f_get_sellPossibleQty(v_AST09.ast09_book_id)||'] 매도수량['||p_out_qty||']';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 출고원장 SET
    -------------------------------------------------------------------------------------
    v_AST09.ast09_book_amt      := v_AST09.ast09_book_amt
                                 - f_trunc(v_AST09.ast09_book_amt     * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '1');
    -------------------------------------------------------------------------------------
    v_AST09.ast09_for_book_amt  := v_AST09.ast09_for_book_amt
                                 - f_trunc(v_AST09.ast09_for_book_amt * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '2');
    -------------------------------------------------------------------------------------
    v_AST09.ast09_pur_amt       := v_AST09.ast09_pur_amt
                                 - f_trunc(v_AST09.ast09_pur_amt * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '1');
    -------------------------------------------------------------------------------------
    v_AST09.ast09_for_pur_amt   := v_AST09.ast09_for_pur_amt
                                 - f_trunc(v_AST09.ast09_for_pur_amt * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '2');
    -------------------------------------------------------------------------------------
    v_AST09.ast09_eval_amt      := v_AST09.ast09_eval_amt
                                 - f_trunc(v_AST09.ast09_eval_amt * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '1');
    -------------------------------------------------------------------------------------
    /* (2025.01.17 CYY - 외화평가금액 계산 안하기로 함!!!!)
    v_AST09.ast09_for_eval_amt  := v_AST09.ast09_for_eval_amt
                                 - f_trunc(v_AST09.ast09_for_eval_amt * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '2');*/
    -------------------------------------------------------------------------------------
    v_AST09.ast09_eval_pl       := v_AST09.ast09_eval_pl
                                 - f_trunc(v_AST09.ast09_eval_pl * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '1');
    -------------------------------------------------------------------------------------
    /*v_AST09.ast09_for_eval_pl   := v_AST09.ast09_for_eval_pl
                                 - f_trunc(v_AST09.ast09_for_eval_pl * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '2');*/
    -------------------------------------------------------------------------------------
    v_AST09.ast09_acr_int_amt   := v_AST09.ast09_acr_int_amt
                                 - f_trunc(v_AST09.ast09_acr_int_amt * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '1');
    -------------------------------------------------------------------------------------
    /*v_AST09.ast09_for_acr_int_amt   := v_AST09.ast09_for_acr_int_amt
                                     - f_trunc(v_AST09.ast09_for_acr_int_amt * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '2');*/
    -------------------------------------------------------------------------------------
    v_AST09.ast09_oci               := v_AST09.ast09_oci
                                     - f_trunc(v_AST09.ast09_oci * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '1');
    -------------------------------------------------------------------------------------
    /*v_AST09.ast09_for_oci           := v_AST09.ast09_for_oci
                                     - f_trunc(v_AST09.ast09_for_oci * (p_out_qty / v_AST09.ast09_hold_qty), p_cur_cd, '2');*/
    -------------------------------------------------------------------------------------
    v_AST09.ast09_hold_qty      := v_AST09.ast09_hold_qty - p_out_qty;

    -------------------------------------------------------------------------------------
    IF v_AST09.ast09_hold_qty = 0 THEN

        RAISE NOTICE '보유수량 0 => 원장종료';

        v_AST09.ast09_book_end_yn := 'true';
    END IF;
    -------------------------------------------------------------------------------------
    -- UPDATE
    -------------------------------------------------------------------------------------
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
         , ast09_book_end_yn        = v_AST09.ast09_book_end_yn
         , ast09_acr_int_amt        = v_AST09.ast09_acr_int_amt
         , ast09_for_acr_int_amt    = v_AST09.ast09_for_acr_int_amt
         , ast09_oci                = v_AST09.ast09_oci
         , ast09_for_oci            = v_AST09.ast09_for_oci
     WHERE ast09_book_id            = v_AST09.ast09_book_id;
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
