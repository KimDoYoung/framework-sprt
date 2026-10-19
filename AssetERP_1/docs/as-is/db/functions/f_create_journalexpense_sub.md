# f_create_journalexpense_sub

## FUNCTION public.f_create_journalexpense_sub(p_journal_id numeric, p_pay50 record)

- 반환: `character varying`
- 줄 수: 170

```sql
CREATE OR REPLACE FUNCTION public.f_create_journalexpense_sub(p_journal_id numeric, p_pay50 record)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACT06             act06_journal_tmp%ROWTYPE;
    v_JNL               RECORD;

    v_DEPOSIT_ID        NUMERIC;
    v_MAP_ID            VARCHAR(10);
    v_ACNT_CD           act01_account_code.act01_account_cd%TYPE;
    v_JNL_AMT           NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN

    --PERFORM log_message('INFO', '30 ----- 임시분개장 생성 (f_create_journalExpense_sub)하러 들어옴!!');

    v_errMsg := '임시분개장 생성 실패(ACT06)';
    -------------------------------------------------------------------------------------
    FOR v_JNL IN ( SELECT act12_journal_map.*
                        , f_get_real_account_code(act12_company_id, act12_repr_account_cd, '0000000000')  AS real_account_cd
                     FROM act11_tr_map
                          INNER JOIN act12_journal_map ON ( act12_company_id    = act11_company_id      AND
                                                            act12_journal_group = act11_journal_group   AND
                                                            COALESCE(act12_use_yn,'false') = 'true'     )
                    WHERE act11_company_id  = p_PAY50.pay50_company_id
                      AND act11_tr_cd       = '9100'    --(9100:사업비 발생)
                      AND COALESCE(act11_use_yn,'false') = 'true'
                    ORDER BY act12_seq
    ) LOOP
        RAISE NOTICE '-------------------------------------------------------------------------';
        RAISE NOTICE '   seq             : %', v_JNL.act12_seq;
        RAISE NOTICE '   repr_account_cd : %', v_JNL.act12_repr_account_cd;
        RAISE NOTICE ' ';

        --PERFORM log_message('INFO','임시분개장 생성 -------------------------------------------------------------------------');
        --PERFORM log_message('INFO','임시분개장 생성 -  seq             : '||v_JNL.act12_seq);
        --PERFORM log_message('INFO','임시분개장 생성 -  repr_account_cd : '||v_JNL.act12_repr_account_cd);
        --PERFORM log_message('INFO','임시분개장 생성  ');

        ---------------------------------------------------------------------------------
        v_ACT06  := NULL;
        ---------------------------------------------------------------------------------
        v_DEPOSIT_ID := NULL;
        v_MAP_ID     := '0000000000';
        v_ACNT_CD    := v_JNL.real_account_cd;
        v_JNL_AMT    := 0;
        ---------------------------------------------------------------------------------
        -- 10. 계정과목 SET
        ---------------------------------------------------------------------------------
        IF v_JNL.act12_repr_account_cd = '9999'                 THEN --(9999:사용자지정계정)
            IF p_PAY50.pay50_account_cd IS NULL OR p_PAY50.pay50_account_cd = '' THEN
                v_errMsg := '계정과목이 존재하지 않습니다';
                RAISE USING ERRCODE = '90001';
            END IF;
            v_ACNT_CD := p_PAY50.pay50_account_cd;

            IF p_PAY50.pay50_expense_cd = '91' THEN --(91:기타출금(선급))
                v_DEPOSIT_ID := p_PAY50.pay50_ast_id;
            END IF;

        ELSIF SUBSTR(v_JNL.act12_repr_account_cd,1,2) = '22'    THEN --(2200:미지급금계정/2201:미지급비용계정)
            -----------------------------------------------------------------------------
            /* 주석사유 : 현금 및 보통예금으로 발생시 후에 지급여부 체크가 안됨.
                          무조건 미지급계정으로 발생 후 미수/미지급 처리화면에서 결제거래가 발생하여야 함!!!

            IF p_PAY50.pay50_pay_method_cd = '20' THEN  --(20:현금)
                -------------------------------------------------------------------------
                v_DEPOSIT_ID := p_PAY50.pay50_deposit_id;
                v_ACNT_CD    := f_get_real_account_code(p_PAY50.pay50_company_id, '8889', v_MAP_ID);
            -----------------------------------------------------------------------------
            ELSIF p_PAY50.pay50_pay_method_cd = '10'                 AND    --(10:계좌이체)이며, 
                  p_PAY50.pay50_occ_date = p_PAY50.pay50_settle_date THEN   --발생일이 자금집행일이면 보통예금처리
                -------------------------------------------------------------------------
                v_DEPOSIT_ID := p_PAY50.pay50_deposit_id;
                SELECT COALESCE(ast01_item_s_class_cd, '000000')||
                       COALESCE(ast01_account_type   , '99')||
                       COALESCE(SUBSTR(ast01_item_d_class_cd,7,2), '00')
                  INTO v_MAP_ID
                  FROM ast01_class_tree
                 WHERE ast01_class_tree_id = v_DEPOSIT_ID;
                -----------------------------------------------------------------
                v_ACNT_CD := f_get_real_account_code(p_PAY50.pay50_company_id, '8888', v_MAP_ID);
            END IF;*/

            -----------------------------------------------------------------------------
            IF p_PAY50.pay50_pay_method_cd = '17' THEN  --(17:선급비용)
                -------------------------------------------------------------------------
                v_DEPOSIT_ID := p_PAY50.pay50_deposit_id;

                SELECT COALESCE(ast01_item_s_class_cd, '00')||
                       COALESCE(ast01_account_type   , '99')||
                       COALESCE(SUBSTR(ast01_item_d_class_cd,7,2), '00')
                  INTO v_MAP_ID
                  FROM ast01_class_tree
                 WHERE ast01_class_tree_id = v_DEPOSIT_ID;

                 v_ACNT_CD := f_get_real_account_code(p_PAY50.pay50_company_id, '1100', v_MAP_ID);
            END IF;
        END IF;

        --PERFORM log_message('INFO',CONCAT('임시분개장 생성  v_DEPOSIT_ID : ',v_DEPOSIT_ID   ));
        --PERFORM log_message('INFO',CONCAT('임시분개장 생성  v_MAP_ID     : ',v_MAP_ID       ));
        --PERFORM log_message('INFO',CONCAT('임시분개장 생성  v_ACNT_CD    : ',v_ACNT_CD      ));
        
        ---------------------------------------------------------------------------------
        -- 20. 금액 SET
        ---------------------------------------------------------------------------------
        IF    UPPER(v_JNL.act12_formula) = 'AMT'            THEN v_JNL_AMT := COALESCE(p_PAY50.pay50_amt       ,0);
        ELSIF UPPER(v_JNL.act12_formula) = 'TAX'            THEN v_JNL_AMT := COALESCE(p_PAY50.pay50_tax       ,0);
        ELSIF UPPER(v_JNL.act12_formula) = 'SETTLE_AMT'     THEN v_JNL_AMT := COALESCE(p_PAY50.pay50_settle_amt,0);
        ELSE  v_JNL_AMT := 0;
        END IF;

        --PERFORM log_message('INFO',CONCAT('임시분개장 생성 - [', v_JNL.act12_formula, '] v_JNL_AMT : ',v_JNL_AMT ));

        ---------------------------------------------------------------------------------
        IF v_JNL_AMT != 0 THEN
        
            --PERFORM log_message('INFO',CONCAT('임시분개장 생성 - v_ACT06 insert 합시다!!'));

            -----------------------------------------------------------------------------
            v_ACT06.act06_journal_tmp_id    := f_create_seq()                       ;
            v_ACT06.act06_journal_id        := p_journal_id                         ;
            v_ACT06.act06_seq               := v_JNL.act12_seq                      ;
            v_ACT06.act06_repr_account_cd   := v_JNL.act12_repr_account_cd          ;
            v_ACT06.act06_real_account_cd   := v_ACNT_CD                            ;
            v_ACT06.act06_drcr_type         := v_JNL.act12_drcr_type                ;
            v_ACT06.act06_amt               := v_JNL_AMT                            ;
            v_ACT06.act06_for_amt           := v_JNL_AMT                            ;
            v_ACT06.act06_deposit_id        := v_DEPOSIT_ID                         ;
            v_ACT06.act06_account_map       := v_MAP_ID                             ;
            v_ACT06.act06_note              := CONCAT(p_PAY50.pay50_desc ,'-'||f_get_corp_nm(p_PAY50.pay50_corp_id));

            RAISE NOTICE 'v_ACT06.act06_seq             : %', v_ACT06.act06_seq;
            RAISE NOTICE 'v_ACT06.act06_repr_account_cd : %', v_ACT06.act06_repr_account_cd;
            RAISE NOTICE 'v_ACT06.act06_real_account_cd : %', v_ACT06.act06_real_account_cd;
            RAISE NOTICE 'v_ACT06.act06_drcr_type       : %', v_ACT06.act06_drcr_type;
            RAISE NOTICE 'v_ACT06.act06_amt             : %', v_ACT06.act06_amt;
            
            --PERFORM log_message('INFO', CONCAT('v_ACT06.act06_seq             : ', v_ACT06.act06_seq));
            --PERFORM log_message('INFO', CONCAT('v_ACT06.act06_repr_account_cd : ', v_ACT06.act06_repr_account_cd));
            --PERFORM log_message('INFO', CONCAT('v_ACT06.act06_real_account_cd : ', v_ACT06.act06_real_account_cd));
            --PERFORM log_message('INFO', CONCAT('v_ACT06.act06_drcr_type       : ', v_ACT06.act06_drcr_type));
            --PERFORM log_message('INFO', CONCAT('v_ACT06.act06_amt             : ', v_ACT06.act06_amt));
            
            v_errMsg := '임시분개장 INSERT 실패 ['||v_ACT06.act06_repr_account_cd||']['||v_ACT06.act06_real_account_cd||']';
            INSERT INTO act06_journal_tmp VALUES (v_ACT06.*);
        END IF;
    END LOOP;

-----------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        PERFORM log_message('ERR', CONCAT('EXCEPTION USER ERR : ', v_errMsg));
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_errMsg ;
        RETURN v_errMsg;
    WHEN OTHERS THEN
        PERFORM log_message('ERR', CONCAT('EXCEPTION ERR : ', v_errMsg), SQLERRM);
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN CONCAT(v_errMsg||'-', SQLERRM);
END;
$function$
```
