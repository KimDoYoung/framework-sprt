# f_create_financebook

## FUNCTION public.f_create_financebook(p_proc_type character varying, p_tr_id numeric)

- 반환: `character varying`
- 줄 수: 316

```sql
CREATE OR REPLACE FUNCTION public.f_create_financebook(p_proc_type character varying, p_tr_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST06         ast06_tr%ROWTYPE;
    v_AST08         ast08_tr_finance%ROWTYPE;
    v_AST09         ast09_book%ROWTYPE;

    v_TR            RECORD;

    v_FINANCE_YN    VARCHAR(5);
    v_BOOK_IO       VARCHAR(1);

    v_DML           VARCHAR(1);
    v_BOOK_AMT      NUMERIC;
    v_PUR_AMT       NUMERIC;
    v_OCI           NUMERIC;

    v_FOR_BOOK_AMT  NUMERIC;
    v_FOR_PUR_AMT   NUMERIC;

    total_rows      NUMERIC;
    v_tmp           NUMERIC;

    v_CNT           NUMERIC;
    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '금융자산 원장생성 실패 ['||p_tr_id||']';

    -------------------------------------------------------------------------------------
    -- 거래정보 가져오기
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST06
      FROM ast06_tr
     WHERE ast06_tr_id = p_tr_id;

    IF v_AST06.ast06_tr_id IS NULL THEN
        IF p_proc_type = 'C' THEN
            RETURN 'Y';
        ELSE
            v_errMsg := '금융자산 원장 생성 실패 - 거래내역이 존재하지 않습니다. ['||p_tr_id||']';
            RAISE USING ERRCODE = '90001';
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 금융자산 거래 및 원장생성여부 체크
    v_errMsg := '금융자산 거래 및 원장생성여부 체크 실패 ['||v_AST06.ast06_company_id||']['||v_AST06.ast06_tr_cd||']';
    SELECT COALESCE(ast05_finance_yn,'false')
         , COALESCE(act11_book_io_type,'9')
      INTO v_FINANCE_YN
         , v_BOOK_IO
      FROM ast05_tr_code
           LEFT OUTER JOIN act11_tr_map ON ( act11_company_id = ast05_company_id AND
                                             act11_tr_cd      = ast05_tr_cd      )
     WHERE ast05_company_id = v_AST06.ast06_company_id
       AND ast05_tr_cd      = v_AST06.ast06_tr_cd;

    IF v_FINANCE_YN = 'false' OR v_BOOK_IO NOT IN ('1','2','5') THEN   --(1:입고/2:출고/5:원장변경)
        RAISE NOTICE '원장반영 해당없음!!!' ;
        RETURN 'Y';
    END IF;
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST08
      FROM ast08_tr_finance
     WHERE ast08_tr_id = p_tr_id;
    IF v_AST08.ast08_tr_finance_id IS NULL THEN
        v_errMsg := '금융자산 원장생성 실패 - 거래내역(금융자산 상세)이 존재하지 않습니다. ['||p_tr_id||']';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 거래일 이후 평가처리건 존재유무 체크
    v_errMsg := '거래일 이후 평가처리건 존재유무 체크 실패';
    IF v_AST06.ast06_tr_cd IN ('3600','3610') THEN
        SELECT *
          INTO v_CNT
          FROM ( SELECT *
                   FROM ast06_tr
                        INNER JOIN ast08_tr_finance ON ast08_tr_id = ast06_tr_id 
                  WHERE ast06_company_id           = v_AST06.ast06_company_id
                    AND ast06_ast_class_tree_id    = v_AST06.ast06_ast_class_tree_id
                    AND ast06_date                 > v_AST06.ast06_date
                    AND ( ast08_account_id         IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) OR
                          ast08_in_account_id      IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) )
                    AND ast06_tr_cd                IN ('3600','3601','3610','3611') --(3600:금융상품 평가/3601:금융상품 평가반제/3610:금융상품 이자평가/3611:금융상품 이자평가반제)
               ) t;
    ELSE
        SELECT *
          INTO v_CNT
          FROM ( SELECT *
                   FROM ast06_tr
                        INNER JOIN ast08_tr_finance ON ast08_tr_id = ast06_tr_id 
                  WHERE ast06_company_id           = v_AST06.ast06_company_id
                    AND ast06_ast_class_tree_id    = v_AST06.ast06_ast_class_tree_id
                    AND (CASE WHEN ast06_tr_cd IN ('3601','3611') THEN ast06_date + INTERVAL '-1day' ELSE ast06_date END) >= v_AST06.ast06_date
                    AND ( ast08_account_id         IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) OR
                          ast08_in_account_id      IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) )
                    AND ast06_tr_cd                IN ('3600','3601','3610','3611') --(3600:금융상품 평가/3601:금융상품 평가반제/3610:금융상품 이자평가/3611:금융상품 이자평가반제)
               ) t;
    END IF;
    IF v_CNT > 0 THEN
        v_errMsg := '처리(취소)일 이후 평가내역이 존재합니다. 평가취소 후 진행하세요';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 원장정리 (거래일 ~ 당일)
    -------------------------------------------------------------------------------------
    v_errMsg := '원장정리 (거래일 ~ 당일) 실패';
    DELETE
      FROM ast09_book
     WHERE ast09_company_id         = v_AST06.ast06_company_id
       AND ast09_ast_class_tree_id  = v_AST06.ast06_ast_class_tree_id
       AND ast09_hold_date         >= v_AST06.ast06_date
       AND ast09_keep_account_id    IN ( SELECT ast08_account_id
                                           FROM ast06_tr
                                                INNER JOIN ast08_tr_finance ON ast08_tr_id = ast06_tr_id 
                                          WHERE ast06_company_id           = v_AST06.ast06_company_id
                                            AND ast06_ast_class_tree_id    = v_AST06.ast06_ast_class_tree_id
                                            AND ast06_date                >= v_AST06.ast06_date
                                            AND ( ast08_account_id         IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) OR
                                                  ast08_in_account_id      IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) )
                                          UNION
                                         SELECT ast08_in_account_id
                                           FROM ast06_tr
                                                INNER JOIN ast08_tr_finance ON ast08_tr_id = ast06_tr_id 
                                          WHERE ast06_company_id           = v_AST06.ast06_company_id
                                            AND ast06_ast_class_tree_id    = v_AST06.ast06_ast_class_tree_id
                                            AND ast06_date                >= v_AST06.ast06_date
                                            AND ( ast08_account_id         IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) OR
                                                  ast08_in_account_id      IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) ) );

    -------------------------------------------------------------------------------------
    -- 원장생성 (거래일 ~ 당일 : 영업일만)
    -------------------------------------------------------------------------------------
    RAISE NOTICE '#### 거래반영하기!!! (거래일 ~ 당일 : 영업일만)';
    RAISE NOTICE ' - ast06_ast_class_tree_id : %', v_AST06.ast06_ast_class_tree_id;
    RAISE NOTICE ' - ast08_account_id        : %', v_AST08.ast08_account_id;
    RAISE NOTICE ' - ast08_in_account_id     : %', v_AST08.ast08_in_account_id;
    RAISE NOTICE ' - ast06_date              : %', v_AST06.ast06_date;

    v_errMsg := '원장생성 (거래일 ~ 당일) 실패';
    FOR v_TR IN ( SELECT ast06_tr.*
                       , ast08_tr_finance.*
                       , CASE WHEN COALESCE(ast01_tr_unit,0) = 0 THEN 1
                              ELSE ast01_tr_unit END    as ast01_tr_unit
                       , COALESCE(ast01_cur_cd,'KRW')   as ast01_cur_cd
                       , COALESCE(( SELECT act11_book_io_type
                                      FROM act11_tr_map
                                     WHERE act11_company_id              = ast06_company_id
                                       AND act11_tr_cd                   = ast06_tr_cd
                                       AND COALESCE(act11_use_yn,'true') = 'true'
                                     LIMIT 1 ),'9') as act11_book_io_type
                    FROM ast06_tr
                         INNER JOIN ast08_tr_finance ON ast08_tr_id         = ast06_tr_id
                         INNER JOIN ast01_class_tree ON ast01_class_tree_id = ast06_ast_class_tree_id
                   WHERE ast06_company_id           = v_AST06.ast06_company_id
                     AND ast06_ast_class_tree_id    = v_AST06.ast06_ast_class_tree_id
                     AND ( ast08_account_id         IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) OR
                           ast08_in_account_id      IN (v_AST08.ast08_account_id, v_AST08.ast08_in_account_id) )
                     AND ast06_date BETWEEN v_AST06.ast06_date AND f_today()
                     AND 'Y' = ( CASE WHEN p_proc_type = 'C' AND ast06_tr_id = p_tr_id THEN 'N' -- 취소건은 제외하고 원장반영
                                      ELSE 'Y' END )
                   ORDER BY ast06_date, ast06_tr_id
    ) LOOP
        v_errMsg := '원장생성['||v_TR.ast06_date||'] 실패';
        ---------------------------------------------------------------------------------
        CONTINUE WHEN v_TR.act11_book_io_type NOT IN ('1','2','5');    --(1:입고/2:출고/5:원장변경)만 PASS
        ---------------------------------------------------------------------------------
        v_DML := 'U';
        ---------------------------------------------------------------------------------

        RAISE NOTICE '--------------------------------------------------------------------------------';
        RAISE NOTICE '거래반영 일자(%), 입/출고(%), 종목ID(%), 계좌ID(%)', v_TR.ast06_date, v_TR.act11_book_io_type, v_TR.ast06_ast_class_tree_id, v_TR.ast08_account_id;
        
        -- 원장 가져오기
        SELECT *
          INTO v_AST09
          FROM ast09_book
         WHERE ast09_company_id         = v_TR.ast06_company_id
           AND ast09_ast_class_tree_id  = v_TR.ast06_ast_class_tree_id
           AND ast09_keep_account_id    = v_TR.ast08_account_id
           AND ast09_hold_date          = v_TR.ast06_date;
        ---------------------------------------------------------------------------------
        IF v_AST09.ast09_book_id IS NULL THEN
        
            RAISE NOTICE '원장 미존재!!  ===> 원장이월';
        
            -- 원장이월(결산원장 존재시엔 결산원장에서 이월)
            v_errMsg := f_create_financeBook_carrForward ( v_TR.ast06_company_id
                                                         , v_TR.ast06_ast_class_tree_id
                                                         , v_TR.ast08_account_id
                                                         , v_TR.ast06_date
                                                         );
            IF v_errMsg != 'Y' THEN
                RAISE USING ERRCODE = '90001';
            END IF;
            v_errMsg := 'ING';

            -- 원장 가져오기
            SELECT *
              INTO v_AST09
              FROM ast09_book
             WHERE ast09_company_id         = v_TR.ast06_company_id
               AND ast09_ast_class_tree_id  = v_TR.ast06_ast_class_tree_id
               AND ast09_keep_account_id    = v_TR.ast08_account_id
               AND ast09_hold_date          = v_TR.ast06_date;

            RAISE NOTICE '원장 다시GET!!.........%, %', v_AST09.ast09_hold_qty, v_AST09.ast09_book_end_yn;
        
        END IF;

        ---------------------------------------------------------------------------------
        -- 입/출고 거래반영
        ---------------------------------------------------------------------------------
        IF v_TR.act11_book_io_type IN ('1','2') THEN

          --  RAISE NOTICE 'v_TR.ast01_tr_unit....%', v_TR.ast01_tr_unit;

            -----------------------------------------------------------------------------
            -- 거래 반영
            -----------------------------------------------------------------------------
            IF v_TR.act11_book_io_type = '2' THEN --(2:출고)

                RAISE NOTICE '출고...% - %', v_TR.ast06_date, v_TR.ast08_qty;

                RAISE NOTICE '출고.. book_amt [%], hold_qty [%], tr_qty [%], cur_cd [%]', v_AST09.ast09_book_amt, v_AST09.ast09_hold_qty, v_TR.ast08_qty, v_TR.ast01_cur_cd;
                --PERFORM log_message('INFO', '출고.. book_amt ['||v_AST09.ast09_book_amt||'], hold_qty ['||v_AST09.ast09_hold_qty||'], tr_qty ['||v_TR.ast08_qty||']');

                -------------------------------------------------------------------------
                v_BOOK_AMT      := f_trunc(v_AST09.ast09_book_amt     * v_TR.ast08_qty / v_AST09.ast09_hold_qty, v_TR.ast01_cur_cd, '1');
                v_PUR_AMT       := f_trunc(v_AST09.ast09_pur_amt      * v_TR.ast08_qty / v_AST09.ast09_hold_qty, v_TR.ast01_cur_cd, '1');
                v_OCI           := f_trunc(v_AST09.ast09_oci          * v_TR.ast08_qty / v_AST09.ast09_hold_qty, v_TR.ast01_cur_cd, '1');

                v_FOR_BOOK_AMT  := f_trunc(v_AST09.ast09_for_book_amt * v_TR.ast08_qty / v_AST09.ast09_hold_qty, v_TR.ast01_cur_cd, '2');
                v_FOR_PUR_AMT   := f_trunc(v_AST09.ast09_for_pur_amt  * v_TR.ast08_qty / v_AST09.ast09_hold_qty, v_TR.ast01_cur_cd, '2');
                -------------------------------------------------------------------------

                RAISE NOTICE '출고.. v_BOOK_AMT     [%]', v_BOOK_AMT;
                RAISE NOTICE '출고.. v_FOR_BOOK_AMT [%]', v_FOR_BOOK_AMT;
                --PERFORM log_message('INFO', '출고.. v_BOOK_AMT     ['||v_BOOK_AMT||']');
                --PERFORM log_message('INFO', '출고.. v_FOR_BOOK_AMT ['||v_FOR_BOOK_AMT||']');

                v_errMsg := '원장출고처리 실패';
                v_errMsg := f_create_financeBook_out ( v_AST09.ast09_book_id
                                                     , v_TR.ast08_qty
                                                     , v_TR.ast01_cur_cd
                                                     );
                IF v_errMsg != 'Y' THEN
                    RAISE USING ERRCODE = '90001';
                END IF;
            -----------------------------------------------------------------------------
            ELSE --(1:입고)

                RAISE NOTICE '입고...입고일:% => 보유수량:% + 입고수량:%, 보유장부:% + 입고장부:%', v_TR.ast06_date, v_AST09.ast09_hold_qty, v_TR.ast08_qty, v_AST09.ast09_book_amt, v_TR.ast08_tr_amt;

                -------------------------------------------------------------------------
                v_BOOK_AMT      := v_TR.ast08_tr_amt - COALESCE(v_TR.ast08_acr_int_amt,0);
                v_PUR_AMT       := v_BOOK_AMT;
                v_OCI           := 0;

                v_FOR_BOOK_AMT  := v_TR.ast08_for_tr_amt;
                v_FOR_PUR_AMT   := v_FOR_BOOK_AMT;
                -------------------------------------------------------------------------
                v_errMsg := f_create_financeBook_in ( v_AST09.ast09_book_id
                                                    , v_TR
                                                    );
                IF v_errMsg != 'Y' THEN
                    RAISE USING ERRCODE = '90001';
                END IF;
            END IF;
            -----------------------------------------------------------------------------
            -- 거래내역 장부금액 반영
            v_errMsg := '거래내역 장부금액 반영실패';
            UPDATE ast08_tr_finance
               SET ast08_book_amt       = v_BOOK_AMT
                 , ast08_pur_amt        = v_PUR_AMT
                 , ast08_oci            = v_OCI
                 , ast08_for_book_amt   = v_FOR_BOOK_AMT
                 , ast08_for_pur_amt    = v_FOR_PUR_AMT
             WHERE ast08_tr_finance_id = v_TR.ast08_tr_finance_id;

        ---------------------------------------------------------------------------------
        -- 원장변경 거래반영
        ---------------------------------------------------------------------------------
        ELSIF v_TR.act11_book_io_type IN ('5') THEN

            v_errMsg := f_update_financeBook(v_TR.AST06_TR_ID, v_AST09.ast09_book_id);

            RAISE NOTICE '% - 원장변경 거래반영(f_update_financeBook) RETURN MSG : %', v_TR.act11_book_io_type, v_errMsg;

            IF v_errMsg != 'Y' THEN
                RAISE USING ERRCODE = '90001';
            END IF;
            v_errMsg := 'ING';

        END IF;

    END LOOP;
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
