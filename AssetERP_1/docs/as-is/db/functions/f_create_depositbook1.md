# f_create_depositbook1

## FUNCTION public.f_create_depositbook1(p_company_id numeric, p_std_date date, p_ast_id numeric)

- 반환: `character varying`
- 줄 수: 367

```sql
CREATE OR REPLACE FUNCTION public.f_create_depositbook1(p_company_id numeric, p_std_date date, p_ast_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST09         ast09_book%ROWTYPE;

    v_JNL           RECORD;

    v_DML           VARCHAR(1);
    v_BOOK_AMT      NUMERIC;
    v_PUR_AMT       NUMERIC;
    v_EVAL_AMT      NUMERIC;
    v_QTY           NUMERIC;
    v_CNT           NUMERIC;

    v_CLOSE_DATE    DATE;

    total_rows NUMERIC;

    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '예금 원장정리 실패 ['||p_std_date||']';

    v_CLOSE_DATE := f_today();

    -------------------------------------------------------------------------------------
    -- 회계결산여부 체크
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id =  p_company_id
       AND act05_std_date   >= p_std_date;
    IF v_CNT > 0 THEN
        v_errMsg := '해당일은 회계가 마감되었습니다. 마감취소 후 정리가 가능합니다.';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 거래일 이후 환평가처리건 존재유무 체크
    -------------------------------------------------------------------------------------
    v_errMsg := '거래일 이후 환평가처리건 존재유무 체크 실패';
    SELECT COUNT(*)
      INTO v_CNT
      FROM ast06_tr
     WHERE ast06_company_id         = p_company_id
       AND ast06_ast_class_tree_id  = p_ast_id
       AND ast06_tr_cd              = '3700'
       AND ast06_date              >= p_std_date;
    IF v_CNT > 0 THEN
        v_errMsg := '처리(취소)일 이후 환평가내역이 존재합니다. 환평가취소 후 진행하세요';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 원장정리 (기준일 ~ 당일)
    -------------------------------------------------------------------------------------
    v_errMsg := '원장정리 (기준일 ~ 당일) 실패';
    DELETE
      FROM ast09_book
     WHERE ast09_company_id         = p_company_id
       AND ast09_ast_class_tree_id  = p_ast_id
       AND ast09_hold_date          BETWEEN p_std_date AND v_CLOSE_DATE;
    -------------------------------------------------------------------------------------
    -- 원장생성 (거래일 ~ 당일 : 영업일만)
    -------------------------------------------------------------------------------------
    RAISE NOTICE '거래반영하기!!! (거래일(%) ~ 당일)', p_std_date;

    v_errMsg := '원장생성 (거래일 ~ 당일) 실패';
    FOR v_JNL IN ( SELECT act02_journal.*
                        , act03_dr_ast_id                           AS ast_id
                        , act03_dr_amt                              AS amt
                        , CASE WHEN COALESCE(ast01_cur_cd,'KRW') = 'KRW'
                               THEN act03_dr_amt
                               ELSE act03_dr_for_amt END            AS for_amt
                        , CASE WHEN COALESCE(ast01_cur_cd,'KRW') = 'KRW'
                               THEN 1
                               ELSE COALESCE(ast06_fx_rate,1)  END  AS fx_rate
                        , COALESCE(ast06_tr_cd,'')                  AS tr_cd  
                     FROM act02_journal
                          INNER JOIN act03_journal_dtl ON act03_journal_id    = act02_journal_id
                          INNER JOIN ast01_class_tree  ON ast01_class_tree_id = act03_dr_ast_id
                          LEFT OUTER JOIN ast06_tr     ON ast06_tr_id         = act02_tr_id
                    WHERE act02_company_id = p_company_id
                      AND act03_dr_ast_id  = p_ast_id
                      AND act02_date BETWEEN p_std_date AND v_CLOSE_DATE
                      AND act03_dr_amt != 0
                    UNION ALL
                   SELECT act02_journal.*
                        , act03_cr_ast_id                           AS ast_id
                        , act03_cr_amt     * -1                     AS amt
                        , CASE WHEN COALESCE(ast01_cur_cd,'KRW') = 'KRW'
                               THEN act03_cr_amt
                               ELSE act03_cr_for_amt END * -1       AS for_amt
                        , CASE WHEN COALESCE(ast01_cur_cd,'KRW') = 'KRW'
                               THEN 1
                               ELSE COALESCE(ast06_fx_rate,1)  END  AS fx_rate
                        , COALESCE(ast06_tr_cd,'')                  AS tr_cd  
                     FROM act02_journal
                          INNER JOIN act03_journal_dtl ON act03_journal_id    = act02_journal_id
                          INNER JOIN ast01_class_tree  ON ast01_class_tree_id = act03_cr_ast_id
                          LEFT OUTER JOIN ast06_tr     ON ast06_tr_id         = act02_tr_id
                    WHERE act02_company_id = p_company_id
                      AND act03_cr_ast_id  = p_ast_id
                      AND act02_date BETWEEN p_std_date AND v_CLOSE_DATE
                      AND act03_cr_amt != 0
                    ORDER BY act02_date, act02_journal_id
    ) LOOP
        v_errMsg := '원장생성['||v_JNL.act02_date||'] 실패';
        ---------------------------------------------------------------------------------
        v_DML := 'U';
        ---------------------------------------------------------------------------------

        RAISE NOTICE '--------------------------------------------------------------------------------';
        RAISE NOTICE '거래반영 일자(%), 종목ID(%), 금액(%), 외화금액(%)', v_JNL.act02_date, v_JNL.ast_id, v_JNL.amt, v_JNL.for_amt;

        -- 원장 가져오기
        SELECT *
          INTO v_AST09
          FROM ast09_book
         WHERE ast09_company_id         = v_JNL.act02_company_id
           AND ast09_ast_class_tree_id  = v_JNL.ast_id
           AND ast09_hold_date          = v_JNL.act02_date;
        
        RAISE NOTICE '원장 KEY : %, 수량 : %', v_AST09.ast09_book_id, v_AST09.ast09_hold_qty;
        ---------------------------------------------------------------------------------
        IF v_AST09.ast09_book_id IS NULL THEN
        
            RAISE NOTICE '원장 미존재!!  ===> 최근원장으로 이월';
        
            -- 원장이월(결산원장 존재시엔 결산원장에서 이월)
            INSERT
              INTO ast09_book
            SELECT f_create_seq()
                 , v_JNL.act02_date as ast09_hold_date
                 , ast09_ast_class_tree_id
                 , ast09_keep_account_id
                 , ast09_hold_qty
                 , ast09_pur_amt
                 , ast09_book_amt
                 , ast09_eval_amt
                 , ast09_eval_pl
                 , ast09_first_pur_amt
                 , ast09_first_pur_date
                 , ast09_company_id
                 , ast09_for_pur_amt
                 , ast09_for_book_amt
                 , ast09_for_eval_amt
                 , ast09_for_eval_pl
                 , ast09_fx_pl
                 , ast09_book_end_yn
                 , ast09_acr_int_amt
                 , ast09_for_acr_int_amt
                 , ast09_oci
                 , ast09_for_oci
              FROM (
                     SELECT ast09_hold_date
                          , ast09_ast_class_tree_id
                          , ast09_keep_account_id
                          , ast09_hold_qty
                          , ast09_pur_amt
                          , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                                 THEN ast09_eval_amt
                                 ELSE ast09_book_amt END ast09_book_amt
                          , ast09_eval_amt
                          , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                                 THEN 0
                                 ELSE ast09_eval_pl END ast09_eval_pl
                          , ast09_first_pur_amt
                          , ast09_first_pur_date
                          , ast09_company_id
                          , ast09_for_pur_amt
                          , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                                 THEN ast09_for_eval_amt
                                 ELSE ast09_for_book_amt END ast09_for_book_amt
                          , ast09_for_eval_amt
                          , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                                 THEN 0
                                 ELSE ast09_for_eval_pl END ast09_for_eval_pl
                          , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                                 THEN 0
                                 ELSE ast09_fx_pl END ast09_fx_pl
                          , ast09_book_end_yn
                          , ast09_acr_int_amt
                          , ast09_for_acr_int_amt
                          , ast09_oci
                          , ast09_for_oci
                       FROM ast09_book
                      WHERE ast09_company_id         = v_JNL.act02_company_id
                        AND ast09_ast_class_tree_id  = v_JNL.ast_id
                        AND ast09_hold_date          < v_JNL.act02_date
                        AND NOT EXISTS ( SELECT 1
                                           FROM ast11_book_close
                                          WHERE ast11_company_id        = ast09_company_id
                                            AND ast11_ast_class_tree_id = ast09_ast_class_tree_id
                                            AND ast11_hold_date         = ast09_hold_date )
                      UNION ALL
                     SELECT ast11_hold_date
                          , ast11_ast_class_tree_id
                          , ast11_keep_account_id
                          , ast11_hold_qty
                          , ast11_pur_amt
                          , ast11_book_amt
                          , ast11_eval_amt
                          , ast11_eval_pl
                          , ast11_first_pur_amt
                          , ast11_first_pur_date
                          , ast11_company_id
                          , ast11_for_pur_amt
                          , ast11_for_book_amt
                          , ast11_for_eval_amt
                          , ast11_for_eval_pl
                          , ast11_fx_pl
                          , ast11_book_end_yn
                          , ast11_acr_int_amt
                          , ast11_for_acr_int_amt
                          , ast11_oci
                          , ast11_for_oci
                       FROM ast11_book_close
                      WHERE ast11_company_id         = v_JNL.act02_company_id
                        AND ast11_ast_class_tree_id  = v_JNL.ast_id
                        AND ast11_hold_date          < v_JNL.act02_date
                      ORDER BY ast09_hold_date DESC
                      LIMIT 1
                   ) t ;

            -- 원장 가져오기
            SELECT *
              INTO v_AST09
              FROM ast09_book
             WHERE ast09_company_id         = v_JNL.act02_company_id
               AND ast09_ast_class_tree_id  = v_JNL.ast_id
               AND ast09_hold_date          = v_JNL.act02_date;

            RAISE NOTICE '원장 다시GET!!.........%', v_AST09.ast09_hold_qty;

            IF v_AST09.ast09_book_id IS NULL THEN

                RAISE NOTICE '신규종목임 !!! ';

                v_DML := 'I';
                v_AST09 := NULL ;
                v_AST09.ast09_book_id           := f_create_seq();
                v_AST09.ast09_company_id        := v_JNL.act02_company_id;
                v_AST09.ast09_ast_class_tree_id := v_JNL.ast_id;
                v_AST09.ast09_keep_account_id   := v_JNL.ast_id;
                v_AST09.ast09_hold_date         := v_JNL.act02_date;
            END IF;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_JNL.tr_cd = '3700' THEN -- 외화예금 환산평가
            IF v_DML = 'I' THEN
                v_AST09.ast09_hold_qty      := COALESCE(v_AST09.ast09_hold_qty      ,0) ;
                v_AST09.ast09_pur_amt       := COALESCE(v_AST09.ast09_pur_amt       ,0) ;
                v_AST09.ast09_book_amt      := COALESCE(v_AST09.ast09_book_amt      ,0) ;
                v_AST09.ast09_eval_amt      := COALESCE(v_AST09.ast09_eval_amt      ,0) ;
                v_AST09.ast09_eval_pl       := COALESCE(v_AST09.ast09_eval_pl       ,0) ;
                v_AST09.ast09_for_pur_amt   := COALESCE(v_AST09.ast09_for_pur_amt   ,0) ;
                v_AST09.ast09_for_book_amt  := COALESCE(v_AST09.ast09_for_book_amt  ,0) ;
                v_AST09.ast09_for_eval_amt  := COALESCE(v_AST09.ast09_for_eval_amt  ,0) ;
                v_AST09.ast09_for_eval_pl   := COALESCE(v_AST09.ast09_for_eval_pl   ,0) ;
                v_AST09.ast09_fx_pl         := v_JNL.amt;

                INSERT INTO ast09_book VALUES (v_AST09.*);
            -----------------------------------------------------------------------------
            ELSIF v_DML = 'U' THEN
                UPDATE ast09_book
                   SET ast09_eval_amt = ast09_book_amt + v_JNL.amt
                     , ast09_fx_pl    = v_JNL.amt
                 WHERE ast09_book_id = v_AST09.ast09_book_id;
            END IF;
        ---------------------------------------------------------------------------------
        ELSE
            IF v_JNL.for_amt > 0 THEN
                v_AST09.ast09_hold_qty      := COALESCE(v_AST09.ast09_hold_qty      ,0) + v_JNL.for_amt ;
                v_AST09.ast09_for_pur_amt   := COALESCE(v_AST09.ast09_for_pur_amt   ,0) + v_JNL.for_amt ;
                v_AST09.ast09_for_book_amt  := COALESCE(v_AST09.ast09_for_book_amt  ,0) + v_JNL.for_amt ;
                v_AST09.ast09_for_eval_amt  := COALESCE(v_AST09.ast09_for_eval_amt  ,0) + v_JNL.for_amt ;
                v_AST09.ast09_pur_amt       := COALESCE(v_AST09.ast09_pur_amt       ,0) + v_JNL.amt     ;
                v_AST09.ast09_book_amt      := COALESCE(v_AST09.ast09_book_amt      ,0) + v_JNL.amt     ;
                v_AST09.ast09_eval_amt      := COALESCE(v_AST09.ast09_eval_amt      ,0) + v_JNL.amt     ;
            -----------------------------------------------------------------------------
            ELSIF v_JNL.for_amt < 0 THEN
                -------------------------------------------------------------------------
                IF COALESCE(v_AST09.ast09_hold_qty,0) = 0 THEN
                    v_QTY := 1;
                ELSE
                    v_QTY := v_AST09.ast09_hold_qty;
                END IF;
                -------------------------------------------------------------------------
                IF COALESCE(v_AST09.ast09_pur_amt,0) = 0 THEN
                    v_PUR_AMT := 1;
                ELSE
                    v_PUR_AMT := v_AST09.ast09_pur_amt;
                END IF;
                -------------------------------------------------------------------------
                IF COALESCE(v_AST09.ast09_book_amt,0) = 0 THEN
                    v_BOOK_AMT := 1;
                ELSE
                    v_BOOK_AMT := v_AST09.ast09_book_amt;
                END IF;
                -------------------------------------------------------------------------
                IF COALESCE(v_AST09.ast09_eval_amt,0) = 0 THEN
                    v_EVAL_AMT := 1;
                ELSE
                    v_EVAL_AMT := v_AST09.ast09_eval_amt;
                END IF;
                -------------------------------------------------------------------------
                v_AST09.ast09_pur_amt       := COALESCE(v_AST09.ast09_pur_amt,0)
                                               - TRUNC(v_PUR_AMT  / v_QTY * ABS(v_JNL.for_amt));
                v_AST09.ast09_book_amt      := COALESCE(v_AST09.ast09_book_amt,0)
                                               - TRUNC(v_BOOK_AMT / v_QTY * ABS(v_JNL.for_amt));
                v_AST09.ast09_eval_amt      := COALESCE(v_AST09.ast09_eval_amt,0)
                                               - TRUNC(v_EVAL_AMT / v_QTY * ABS(v_JNL.for_amt));
                -------------------------------------------------------------------------
                IF COALESCE(v_AST09.ast09_fx_pl,0) != 0 THEN
                    v_AST09.ast09_fx_pl     := COALESCE(v_AST09.ast09_fx_pl,0)
                                               - (ABS(v_JNL.amt) - TRUNC(COALESCE(v_AST09.ast09_book_amt,0) / v_QTY * ABS(v_JNL.for_amt)));
                END IF;
                -------------------------------------------------------------------------
                v_AST09.ast09_hold_qty      := COALESCE(v_AST09.ast09_hold_qty,0) - ABS(v_JNL.for_amt) ;
                -------------------------------------------------------------------------
                v_AST09.ast09_for_pur_amt   := v_AST09.ast09_hold_qty;
                v_AST09.ast09_for_book_amt  := v_AST09.ast09_hold_qty;
                v_AST09.ast09_for_eval_amt  := v_AST09.ast09_hold_qty;

                RAISE NOTICE '처리후 잔액 : ast09_hold_qty[%], ast09_for_book_amt[%], ast09_book_amt[%]', v_AST09.ast09_hold_qty, v_AST09.ast09_for_book_amt, v_AST09.ast09_book_amt;

            END IF;
            -----------------------------------------------------------------------------
            IF v_JNL.for_amt != 0 THEN
                IF v_DML = 'I' THEN

                    RAISE NOTICE '원장 INSERT : KEY(%), %(%) % %', v_AST09.ast09_book_id, f_ast_class_tree_nm(v_AST09.ast09_ast_class_tree_id), v_AST09.ast09_ast_class_tree_id, v_AST09.ast09_book_amt, v_AST09.ast09_hold_qty;

                    INSERT INTO ast09_book VALUES (v_AST09.*);
                -------------------------------------------------------------------------
                ELSIF v_DML = 'U' THEN
                    UPDATE ast09_book
                       SET ast09_hold_qty     = v_AST09.ast09_hold_qty
                         , ast09_pur_amt      = v_AST09.ast09_pur_amt
                         , ast09_book_amt     = v_AST09.ast09_book_amt
                         , ast09_eval_amt     = v_AST09.ast09_eval_amt
                         , ast09_for_pur_amt  = v_AST09.ast09_for_pur_amt
                         , ast09_for_book_amt = v_AST09.ast09_for_book_amt
                         , ast09_for_eval_amt = v_AST09.ast09_for_eval_amt
                         , ast09_fx_pl        = v_AST09.ast09_fx_pl
                     WHERE ast09_book_id      = v_AST09.ast09_book_id;
                END IF;
            END IF;
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
