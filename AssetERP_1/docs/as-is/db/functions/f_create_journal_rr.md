# f_create_journal_rr

## FUNCTION public.f_create_journal_rr(p_journal_id numeric)

- 반환: `character varying`
- 줄 수: 113

```sql
CREATE OR REPLACE FUNCTION public.f_create_journal_rr(p_journal_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACT03             act03_journal_dtl%ROWTYPE;

    v_JNL               RECORD;

    v_DR_SEQ            NUMERIC;
    v_CR_SEQ            NUMERIC;
    v_DML               VARCHAR(1);

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 분개상세(ACT03) 생성
    -------------------------------------------------------------------------------------
    v_errMsg := '분개상세 생성 실패 ['||p_journal_id||']';
    v_DR_SEQ := 0;
    v_CR_SEQ := 0;
    -------------------------------------------------------------------------------------
    FOR v_JNL IN ( SELECT *
                     FROM act06_journal_tmp
                    WHERE act06_journal_id = p_journal_id
                    ORDER BY act06_drcr_type DESC, act06_seq
    ) LOOP

        --PERFORM log_message('INFO', ' --- 실분개장 생성 --- act06_drcr_type : '||v_JNL.act06_drcr_type);

        ---------------------------------------------------------------------------------
        v_ACT03 := NULL;
        ---------------------------------------------------------------------------------
        v_ACT03.act03_journal_id := p_journal_id;
        ---------------------------------------------------------------------------------
        --차변계정(D) INSERT
        IF v_JNL.act06_drcr_type = 'D' THEN
            -----------------------------------------------------------------------------
            v_DML := 'I';
            -----------------------------------------------------------------------------
            v_DR_SEQ                        := v_DR_SEQ + 1                     ;
            v_ACT03.act03_seq               := v_DR_SEQ                         ;
            -----------------------------------------------------------------------------
            v_ACT03.act03_journal_dtl_id    := f_create_seq()                   ;
            v_ACT03.act03_dr_account_cd     := v_JNL.act06_real_account_cd      ;
            v_ACT03.act03_dr_amt            := v_JNL.act06_amt                  ;
            v_ACT03.act03_dr_for_amt        := v_JNL.act06_for_amt              ;
            v_ACT03.act03_dr_ast_id         := v_JNL.act06_deposit_id           ;
            v_ACT03.act03_dr_note           := v_JNL.act06_note                 ;

            --PERFORM log_message('INFO', ' --- 실분개장 생성 (D)--- v_DR_SEQ            : '||v_DR_SEQ);
            --PERFORM log_message('INFO', ' --- 실분개장 생성 (D)--- act03_dr_account_cd : '||v_ACT03.act03_dr_account_cd);
            --PERFORM log_message('INFO', ' --- 실분개장 생성 (D)--- act03_dr_amt        : '||v_ACT03.act03_dr_amt);

        ---------------------------------------------------------------------------------
        -- 대변계정(C) INSERT & UPDATE
        ELSE
            -----------------------------------------------------------------------------
            v_CR_SEQ                        := v_CR_SEQ + 1     ;
            v_ACT03.act03_seq               := v_CR_SEQ         ;
            -----------------------------------------------------------------------------
            IF v_DR_SEQ >= v_CR_SEQ THEN
                -------------------------------------------------------------------------
                v_DML := 'U';
                -------------------------------------------------------------------------
                SELECT *
                  INTO v_ACT03
                  FROM act03_journal_dtl
                 WHERE act03_journal_id = v_ACT03.act03_journal_id
                   AND act03_seq        = v_ACT03.act03_seq;
            -----------------------------------------------------------------------------
            ELSE
                -------------------------------------------------------------------------
                v_DML := 'I';
                -------------------------------------------------------------------------
                v_ACT03.act03_journal_dtl_id    := f_create_seq();
            END IF;
            -----------------------------------------------------------------------------
            v_ACT03.act03_cr_account_cd     := v_JNL.act06_real_account_cd      ;
            v_ACT03.act03_cr_amt            := v_JNL.act06_amt                  ;
            v_ACT03.act03_cr_for_amt        := v_JNL.act06_for_amt              ;
            v_ACT03.act03_cr_ast_id         := v_JNL.act06_deposit_id           ;
            v_ACT03.act03_cr_note           := v_JNL.act06_note                 ;
        END IF;
        -------------------------------------------------------------------------
        IF v_DML = 'I' THEN
            INSERT INTO act03_journal_dtl VALUES (v_ACT03.*);
        ELSE
            UPDATE act03_journal_dtl
               SET act03_cr_account_cd  = v_ACT03.act03_cr_account_cd
                 , act03_cr_amt         = v_ACT03.act03_cr_amt
                 , act03_cr_for_amt     = v_ACT03.act03_cr_for_amt
                 , act03_cr_ast_id      = v_ACT03.act03_cr_ast_id
                 , act03_cr_note        = v_ACT03.act03_cr_note
             WHERE act03_journal_dtl_id = v_ACT03.act03_journal_dtl_id;
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
