# f_create_back_journal

## FUNCTION public.f_create_back_journal(p_tr_id numeric)

- 반환: `character varying`
- 줄 수: 147

```sql
CREATE OR REPLACE FUNCTION public.f_create_back_journal(p_tr_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST06                 ast06_tr%ROWTYPE;
    v_AST08                 ast08_tr_finance%ROWTYPE;
    v_ACT02                 act02_journal%ROWTYPE;
    v_ACT03                 act03_journal_dtl%ROWTYPE;

    v_JNL                   RECORD;

    v_errMsg                VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 반제 거래 생성 (ast06_tr, ast08_tr_finance)
    -------------------------------------------------------------------------------------
    v_errMsg := '반제거래 생성 실패 ['||p_tr_id||']';
    -- 평가거래 가져오기
    SELECT *
      INTO v_AST06
      FROM ast06_tr
     WHERE ast06_tr_id = p_tr_id;

    -------------------------------------------------------------------------------------
    -- 거래유형 : 3600  금융상품 평가처리
    --            3610  금융상품 이자평가처리
    --            3700  외화예금 환산평가
    --            9910  펀드운용보수 미수처리
    --            9920  펀드사무관리보수 미수처리
    -------------------------------------------------------------------------------------
    IF v_AST06.ast06_tr_cd NOT IN ('3600','3610','3700','9910','9920') THEN
        v_errMsg := '원거래가 평가(결산)처리 거래가 아닙니다. ['||v_AST06.ast06_tr_cd||']';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    IF v_AST06.ast06_date = f_get_account_close_date(v_AST06.ast06_company_id, v_AST06.ast06_date, 0) THEN
        IF v_AST06.ast06_tr_cd NOT IN ('9910','9920','3610') THEN --펀드보수, 미수이자는 반제처리 함
            RAISE NOTICE '결산일의 반제는 생성하지 않는다!!';
            RETURN 'Y';
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- DATA SET
    v_AST06.ast06_tr_id             := f_create_seq()                   ;
    v_AST06.ast06_date              := f_get_date(v_AST06.ast06_date,1) ;
    v_AST06.ast06_org_tr_id         := p_tr_id                          ;
    -------------------------------------------------------------------------------------
    v_AST06.ast06_amt               := v_AST06.ast06_amt          * -1  ;
    v_AST06.ast06_for_amt           := v_AST06.ast06_for_amt      * -1  ;
    v_AST06.ast06_cont_amt          := v_AST06.ast06_cont_amt     * -1  ;
    v_AST06.ast06_for_cont_amt      := v_AST06.ast06_for_cont_amt * -1  ;
    -------------------------------------------------------------------------------------
    IF    v_AST06.ast06_tr_cd = '3600' THEN v_AST06.ast06_tr_cd := '3601' ;   --(3601:금융상품 평가반제처리)
    ELSIF v_AST06.ast06_tr_cd = '3610' THEN v_AST06.ast06_tr_cd := '3611' ;   --(3611:금융상품 이자평가반제처리)
    ELSIF v_AST06.ast06_tr_cd = '3700' THEN v_AST06.ast06_tr_cd := '3701' ;   --(3701:외화예금 환산평가반제)
    ELSIF v_AST06.ast06_tr_cd = '9910' THEN v_AST06.ast06_tr_cd := '9911' ;   --(9911:펀드운용보수 미수반체처리)
    ELSIF v_AST06.ast06_tr_cd = '9920' THEN v_AST06.ast06_tr_cd := '9921' ;   --(9921:펀드사무관리보수 미수반체처리)
    END IF;
    -------------------------------------------------------------------------------------
    INSERT INTO ast06_tr VALUES (v_AST06.*);
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST08
      FROM ast08_tr_finance
     WHERE ast08_tr_id = p_tr_id;

    IF v_AST08.ast08_tr_finance_id IS NOT NULL THEN
        v_AST08.ast08_tr_finance_id := f_create_seq()                   ;
        v_AST08.ast08_tr_id         := v_AST06.ast06_tr_id              ;

        INSERT INTO ast08_tr_finance VALUES (v_AST08.*);
    END IF;

    -------------------------------------------------------------------------------------
    -- 반제 분개 생성(act02_journal, act03_journal_dtl)
    -------------------------------------------------------------------------------------
    v_errMsg := '반제분개 생성 실패 ['||p_tr_id||']';
    SELECT *
      INTO v_ACT02
      FROM act02_journal
     WHERE act02_tr_id = p_tr_id;
    -------------------------------------------------------------------------------------
    v_ACT02.act02_journal_id    = f_create_seq()                                                    ;
    v_ACT02.act02_journal_no    = f_create_journal_no(v_AST06.ast06_company_id, v_AST06.ast06_date) ;
    v_ACT02.act02_date          = v_AST06.ast06_date                                                ;
    v_ACT02.act02_tr_id         = v_AST06.ast06_tr_id                                               ;
    -------------------------------------------------------------------------------------
    INSERT INTO act02_journal VALUES (v_ACT02.*);
    -------------------------------------------------------------------------------------
    FOR v_JNL IN ( SELECT *
                     FROM act03_journal_dtl
                    WHERE act03_journal_id IN ( SELECT act02_journal_id
                                                  FROM act02_journal
                                                 WHERE act02_tr_id = p_tr_id )
                    ORDER BY act03_seq
    ) LOOP
        ---------------------------------------------------------------------------------
        v_ACT03 := NULL;
        ---------------------------------------------------------------------------------
        v_ACT03.act03_journal_dtl_id    := f_create_seq()               ;
        v_ACT03.act03_journal_id        := v_ACT02.act02_journal_id     ;
        v_ACT03.act03_seq               := v_JNL.act03_seq              ;
        ---------------------------------------------------------------------------------
        /* (2023.09.04 CYY - 반제분개시 '-'분개 발생하지 않고 반대분개 발생시키기로 함)
        v_ACT03.act03_dr_account_cd     := v_JNL.act03_dr_account_cd    ;
        v_ACT03.act03_dr_amt            := v_JNL.act03_dr_amt     * -1  ;
        v_ACT03.act03_dr_for_amt        := v_JNL.act03_dr_for_amt * -1  ;
        v_ACT03.act03_dr_ast_id         := v_JNL.act03_dr_ast_id        ;
        v_ACT03.act03_dr_note           := v_JNL.act03_dr_note          ;
        ---------------------------------------------------------------------------------
        v_ACT03.act03_cr_account_cd     := v_JNL.act03_cr_account_cd    ;
        v_ACT03.act03_cr_amt            := v_JNL.act03_cr_amt     * -1  ;
        v_ACT03.act03_cr_for_amt        := v_JNL.act03_cr_for_amt * -1  ;
        v_ACT03.act03_cr_ast_id         := v_JNL.act03_cr_ast_id        ;
        v_ACT03.act03_cr_note           := v_JNL.act03_cr_note          ;*/

        v_ACT03.act03_dr_account_cd     := v_JNL.act03_cr_account_cd    ;
        v_ACT03.act03_dr_amt            := v_JNL.act03_cr_amt           ;
        v_ACT03.act03_dr_for_amt        := v_JNL.act03_cr_for_amt       ;
        v_ACT03.act03_dr_ast_id         := v_JNL.act03_cr_ast_id        ;
        v_ACT03.act03_dr_note           := v_JNL.act03_cr_note          ;
        ---------------------------------------------------------------------------------
        v_ACT03.act03_cr_account_cd     := v_JNL.act03_dr_account_cd    ;
        v_ACT03.act03_cr_amt            := v_JNL.act03_dr_amt           ;
        v_ACT03.act03_cr_for_amt        := v_JNL.act03_dr_for_amt       ;
        v_ACT03.act03_cr_ast_id         := v_JNL.act03_dr_ast_id        ;
        v_ACT03.act03_cr_note           := v_JNL.act03_dr_note          ;
        ---------------------------------------------------------------------------------
        INSERT INTO act03_journal_dtl VALUES (v_ACT03.*);
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
