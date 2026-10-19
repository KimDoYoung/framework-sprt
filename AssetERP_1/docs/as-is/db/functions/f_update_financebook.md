# f_update_financebook

## FUNCTION public.f_update_financebook(p_tr_id numeric, p_book_id numeric)

- 반환: `character varying`
- 줄 수: 271

```sql
CREATE OR REPLACE FUNCTION public.f_update_financebook(p_tr_id numeric, p_book_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST01         ast01_class_tree%ROWTYPE;
    v_AST06         ast06_tr%ROWTYPE;
    v_AST08         ast08_tr_finance%ROWTYPE;
    v_AST09         ast09_book%ROWTYPE;

    v_AST09_IN      ast09_book%ROWTYPE;
    v_AST09_OUT     ast09_book%ROWTYPE;
    v_AST09_ORG     ast09_book%ROWTYPE;

    v_BOOK_AMT      NUMERIC;
    v_FOR_BOOK_AMT  NUMERIC;
    v_OCI           NUMERIC;
    v_EVAL_PRICE    NUMERIC;
    v_DML           VARCHAR(1);

    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '금융자산 원장변경 실패 ['||p_tr_id||']';

    -------------------------------------------------------------------------------------
    -- 거래정보 가져오기
    SELECT *
      INTO v_AST06
      FROM ast06_tr
     WHERE ast06_tr_id = p_tr_id;
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST08
      FROM ast08_tr_finance
     WHERE ast08_tr_id = p_tr_id;
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST01
      FROM ast01_class_tree
     WHERE ast01_class_tree_id = v_AST06.ast06_ast_class_tree_id;

    -------------------------------------------------------------------------------------
    -- 거래코드별 원장반영
    -------------------------------------------------------------------------------------
    CASE v_AST06.ast06_tr_cd
    -------------------------------------------------------------------------------------
    WHEN '3150' THEN    --(3150:계좌대체)
        ---------------------------------------------------------------------------------
        -- 출고계좌 출고처리
        ---------------------------------------------------------------------------------
        -- 출고장부 가져오기
        SELECT *
          INTO v_AST09_OUT
          FROM ast09_book
         WHERE ast09_company_id         = v_AST06.ast06_company_id
           AND ast09_hold_date          = v_AST06.ast06_date
           AND ast09_ast_class_tree_id  = v_AST06.ast06_ast_class_tree_id
           AND ast09_keep_account_id    = v_AST08.ast08_account_id;

        v_AST09_ORG := v_AST09_OUT;

        -- 원장출고처리
        v_errMsg := f_create_financeBook_out ( v_AST09_OUT.ast09_book_id
                                             , v_AST08.ast08_qty
                                             , v_AST06.ast06_cur_cd
                                             );
        IF v_errMsg != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;
        v_errMsg := 'ING';

        -- 화면에서 입력받은 출고금액으로 UPDATE하기
        UPDATE ast09_book
           SET ast09_pur_amt     = v_AST09_ORG.ast09_pur_amt     - v_AST08.ast08_tr_amt
             , ast09_for_pur_amt = v_AST09_ORG.ast09_for_pur_amt - v_AST08.ast08_for_tr_amt
         WHERE ast09_book_id = v_AST09_OUT.ast09_book_id;

        ---------------------------------------------------------------------------------
        -- 평가단가 SET
        v_EVAL_PRICE := COALESCE(v_AST09_ORG.ast09_eval_amt,0) / COALESCE(v_AST09_ORG.ast09_hold_qty,1) * COALESCE(v_AST01.ast01_tr_unit,1);

        ---------------------------------------------------------------------------------
        -- 입고계좌 입고처리
        ---------------------------------------------------------------------------------
        -- 입고장부 가져오기
        SELECT *
          INTO v_AST09_IN
          FROM ast09_book
         WHERE ast09_company_id         = v_AST06.ast06_company_id
           AND ast09_hold_date          = v_AST06.ast06_date
           AND ast09_ast_class_tree_id  = v_AST06.ast06_ast_class_tree_id
           AND ast09_keep_account_id    = v_AST08.ast08_in_account_id;

        ---------------------------------------------------------------------------------
        v_DML := 'U';
        ---------------------------------------------------------------------------------
        IF v_AST09_IN.ast09_book_id IS NULL THEN
            -- 원장이월(결산원장 존재시엔 결산원장에서 이월)
            v_errMsg := f_create_financeBook_carrForward ( v_AST06.ast06_company_id
                                                         , v_AST06.ast06_ast_class_tree_id
                                                         , v_AST08.ast08_in_account_id
                                                         , v_AST06.ast06_date
                                                         );
            IF v_errMsg != 'Y' THEN
                RAISE USING ERRCODE = '90001';
            END IF;
            v_errMsg := 'ING';

            -- 다시 가져오기
            SELECT *
              INTO v_AST09_IN
              FROM ast09_book
             WHERE ast09_company_id         = v_AST06.ast06_company_id
               AND ast09_hold_date          = v_AST06.ast06_date
               AND ast09_ast_class_tree_id  = v_AST06.ast06_ast_class_tree_id
               AND ast09_keep_account_id    = v_AST08.ast08_in_account_id;

            IF v_AST09_IN.ast09_book_id IS NULL THEN
                -------------------------------------------------------------------------
                v_DML := 'I';
                -------------------------------------------------------------------------
                v_AST09_IN.ast09_book_id           := f_create_seq();
                v_AST09_IN.ast09_company_id        := v_AST06.ast06_company_id;
                v_AST09_IN.ast09_ast_class_tree_id := v_AST06.ast06_ast_class_tree_id;
                v_AST09_IN.ast09_keep_account_id   := v_AST08.ast08_in_account_id;
                v_AST09_IN.ast09_hold_date         := v_AST06.ast06_date;
                v_AST09_IN.ast09_first_pur_date    := v_AST06.ast06_date;
                v_AST09_IN.ast09_first_pur_amt     := v_AST08.ast08_tr_amt;
                v_AST09_IN.ast09_book_end_yn       := 'false';
            END IF;
        END IF;

        ---------------------------------------------------------------------------------
        -- 입고원장 SET

        -- 종료된 원장이면 최초취득일, 최초취득금액을 SET한다.
        IF COALESCE(v_AST09_IN.ast09_book_end_yn,'false') = 'true' THEN
            v_AST09_IN.ast09_first_pur_date := v_AST06.ast06_date;
            v_AST09_IN.ast09_first_pur_amt  := v_AST08.ast08_tr_amt;
            v_AST09_IN.ast09_book_end_yn    := 'false';
        END IF;

        -- 보유수량, 취득금액 SET
        v_AST09_IN.ast09_hold_qty      := COALESCE(v_AST09_IN.ast09_hold_qty    ,0) + v_AST08.ast08_qty;
        v_AST09_IN.ast09_pur_amt       := COALESCE(v_AST09_IN.ast09_pur_amt     ,0) + v_AST08.ast08_tr_amt;
        v_AST09_IN.ast09_for_pur_amt   := COALESCE(v_AST09_IN.ast09_for_pur_amt ,0) + v_AST08.ast08_for_tr_amt;
        
        -- 장부금액 SET
        v_BOOK_AMT                     := f_trunc(v_AST09_ORG.ast09_book_amt / v_AST09_ORG.ast09_hold_qty * v_AST08.ast08_qty, v_AST06.ast06_cur_cd, '1');
        v_AST09_IN.ast09_book_amt      := COALESCE(v_AST09_IN.ast09_book_amt,0) + v_BOOK_AMT;

        v_FOR_BOOK_AMT                 := f_trunc(v_AST09_ORG.ast09_for_book_amt / v_AST09_ORG.ast09_hold_qty * v_AST08.ast08_qty, v_AST06.ast06_cur_cd, '2');
        v_AST09_IN.ast09_for_book_amt  := COALESCE(v_AST09_IN.ast09_for_book_amt,0) + v_FOR_BOOK_AMT;

        -- 경과이자 SET
        v_AST09_IN.ast09_acr_int_amt    := COALESCE(v_AST09_IN.ast09_acr_int_amt ,0)
                                         + f_trunc(v_AST09_ORG.ast09_acr_int_amt / v_AST09_ORG.ast09_hold_qty * v_AST08.ast08_qty, v_AST06.ast06_cur_cd, '1');
        v_AST09_IN.ast09_for_acr_int_amt:= COALESCE(v_AST09_IN.ast09_for_acr_int_amt ,0)
                                         + f_trunc(v_AST09_ORG.ast09_for_acr_int_amt / v_AST09_ORG.ast09_hold_qty * v_AST08.ast08_qty, v_AST06.ast06_cur_cd, '2');

        -- 기타포괄손익 SET
        v_OCI                           := f_trunc(v_AST09_ORG.ast09_oci / v_AST09_ORG.ast09_hold_qty * v_AST08.ast08_qty, v_AST06.ast06_cur_cd, '1');
        v_AST09_IN.ast09_oci            := COALESCE(v_AST09_IN.ast09_oci ,0) + v_OCI;
        v_AST09_IN.ast09_for_oci        := COALESCE(v_AST09_IN.ast09_for_oci ,0)
                                         + f_trunc(v_AST09_ORG.ast09_for_oci / v_AST09_ORG.ast09_hold_qty * v_AST08.ast08_qty, v_AST06.ast06_cur_cd, '2');

        -- 평가금액 SET
        /* (2025.01.17 CYY - 외화평가금액 계산 안하기로 함!!!!)
        v_AST09_IN.ast09_for_eval_amt  := COALESCE(v_AST09_IN.ast09_for_eval_amt,0)
                                        + TRUNC(v_AST08.ast08_qty * v_EVAL_PRICE / COALESCE(v_AST01.ast01_tr_unit,1));
        IF v_AST09_IN.ast09_for_eval_amt = 0 THEN
            v_AST09_IN.ast09_eval_amt  := 0;
        ELSE
            v_AST09_IN.ast09_eval_amt  := v_AST09_IN.ast09_for_eval_amt * COALESCE(v_AST06.ast06_fx_rate,1);
        END IF;*/
        v_AST09.ast09_eval_amt      := TRUNC(v_AST08.ast08_qty * v_EVAL_PRICE / COALESCE(v_AST01.ast01_tr_unit,1));
        v_AST09.ast09_for_eval_amt  := 0;

        IF v_DML = 'I' THEN
            INSERT INTO ast09_book VALUES (v_AST09_IN.*);
        ELSIF v_DML = 'U' THEN
            UPDATE ast09_book
               SET ast09_hold_qty           = v_AST09_IN.ast09_hold_qty
                 , ast09_pur_amt            = v_AST09_IN.ast09_pur_amt 
                 , ast09_book_amt           = v_AST09_IN.ast09_book_amt
                 , ast09_eval_amt           = v_AST09_IN.ast09_eval_amt
                 , ast09_eval_pl            = v_AST09_IN.ast09_eval_amt - v_AST09_IN.ast09_book_amt
                 , ast09_for_pur_amt        = v_AST09_IN.ast09_for_pur_amt 
                 , ast09_for_book_amt       = v_AST09_IN.ast09_for_book_amt
                 , ast09_for_eval_amt       = v_AST09_IN.ast09_for_eval_amt
                 , ast09_for_eval_pl        = v_AST09_IN.ast09_for_eval_amt - v_AST09_IN.ast09_for_book_amt
                 , ast09_first_pur_date     = v_AST09_IN.ast09_first_pur_date
                 , ast09_first_pur_amt      = v_AST09_IN.ast09_first_pur_amt
                 , ast09_book_end_yn        = v_AST09_IN.ast09_book_end_yn
                 , ast09_acr_int_amt        = v_AST09_IN.ast09_acr_int_amt
                 , ast09_for_acr_int_amt    = v_AST09_IN.ast09_for_acr_int_amt
                 , ast09_oci                = v_AST09_IN.ast09_oci
                 , ast09_for_oci            = v_AST09_IN.ast09_for_oci
             WHERE ast09_book_id            = v_AST09_IN.ast09_book_id;
        END IF;

        -----------------------------------------------------------------------------
        -- 거래내역 장부금액 반영
        v_errMsg := '거래내역 장부금액 반영실패';
        UPDATE ast08_tr_finance
           SET ast08_book_amt       = v_BOOK_AMT
             , ast08_for_book_amt   = v_FOR_BOOK_AMT
             , ast08_oci            = v_OCI
         WHERE ast08_tr_finance_id = v_AST08.ast08_tr_finance_id;

    -------------------------------------------------------------------------------------
    WHEN '3211' THEN    --(3211:금융상품 이자수령)
        SELECT *
          INTO v_AST09
          FROM ast09_book
         WHERE ast09_book_id = p_book_id;
        ---------------------------------------------------------------------------------
        UPDATE ast08_tr_finance
           SET ast08_acr_int_amt = v_AST09.ast09_acr_int_amt
         WHERE ast08_tr_id = p_tr_id;
        ---------------------------------------------------------------------------------
        UPDATE ast09_book
           SET ast09_acr_int_amt     = 0
             , ast09_for_acr_int_amt = 0
         WHERE ast09_book_id = p_book_id;
    -------------------------------------------------------------------------------------
    WHEN '3304' THEN    --(3304:권리행사(액면변경))
        UPDATE ast09_book
           SET ast09_hold_qty = v_AST08.ast08_qty
         WHERE ast09_book_id = p_book_id; 
    -------------------------------------------------------------------------------------
    WHEN '3217' THEN    --(3217:분배금재투자)
        UPDATE ast09_book
           SET ast09_hold_qty       = ast09_hold_qty     + v_AST08.ast08_qty
             , ast09_pur_amt        = ast09_pur_amt      + v_AST08.ast08_tr_amt
             , ast09_for_pur_amt    = ast09_for_pur_amt  + v_AST08.ast08_for_tr_amt
             , ast09_book_amt       = ast09_book_amt     + v_AST08.ast08_tr_amt
             , ast09_for_book_amt   = ast09_for_book_amt + v_AST08.ast08_for_tr_amt
         WHERE ast09_book_id = p_book_id; 
    -------------------------------------------------------------------------------------
    WHEN '3600' THEN    --(3600:금융상품 평가처리)
        UPDATE ast09_book
           SET ast09_eval_amt     = v_AST06.ast06_amt
             , ast09_for_eval_amt = v_AST06.ast06_for_amt
             , ast09_eval_pl      = v_AST08.ast08_pl
             , ast09_for_eval_pl  = v_AST08.ast08_for_pl
         WHERE ast09_book_id = p_book_id;
    -------------------------------------------------------------------------------------
    WHEN '3610' THEN    --(3610:금융상품 이자평가처리)
        RAISE NOTICE '원장 변경사항 없음!! 평가일 원장이월이 필요해서 들어간것임!';
    -------------------------------------------------------------------------------------
    ELSE
        v_errMsg := '미식별 거래코드 ['||v_AST06.ast06_tr_cd||']';
        RAISE USING ERRCODE = '90001';
    END CASE;
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
