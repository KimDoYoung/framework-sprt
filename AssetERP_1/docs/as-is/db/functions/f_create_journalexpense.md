# f_create_journalexpense

## FUNCTION public.f_create_journalexpense(p_company_id numeric, p_person_id numeric, p_occ_date date, p_desc text, p_corp_id numeric, p_expense_id numeric, p_expense_ids numeric[])

- 반환: `character varying`
- 줄 수: 127

```sql
CREATE OR REPLACE FUNCTION public.f_create_journalexpense(p_company_id numeric, p_person_id numeric, p_occ_date date, p_desc text, p_corp_id numeric, p_expense_id numeric, p_expense_ids numeric[])
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY50             pay50_expense%ROWTYPE;
    v_ACT02             act02_journal%ROWTYPE;
    v_COM01             com01_relate_appr%ROWTYPE;
    v_DCR               RECORD;

    v_CNT               NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /* 호출스크립트 
    select f_create_journalExpense(28000, 29049,'2024-4-14', null, ARRAY[202504172263989, 202504172263990]::NUMERIC[])
    */

    RAISE NOTICE ' p_expense_ids [] : %', p_expense_ids;
    --PERFORM log_message('INFO', CONCAT('IN) p_expense_ids : ', array_to_string(p_expense_ids,',')));

    v_errMsg := '사업비 발생분개 생성 실패';
    -------------------------------------------------------------------------------------
    -- 회계결산여부 체크
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id = p_company_id
       AND act05_std_date  >= p_occ_date;
    IF v_CNT > 0 THEN
        v_errMsg := '회계마감 되었습니다.';
        RAISE USING ERRCODE = '90001';
    END IF;

    --PERFORM log_message('INFO', '10. 회계결산여부 체크 OK');

    -------------------------------------------------------------------------------------
    -- 전표Main 생성
    -------------------------------------------------------------------------------------
    v_errMsg := '전표Main(ACT02) 생성 실패';
    v_ACT02.act02_journal_id    := f_create_seq()   ;
    v_ACT02.act02_company_id    := p_company_id     ;
    v_ACT02.act02_person_id     := p_person_id      ;
    v_ACT02.act02_date          := p_occ_date       ;
    v_ACT02.act02_note          := p_desc           ;
    v_ACT02.act02_close_yn      := 'false'          ;
    v_ACT02.act02_corp_id       := p_corp_id        ;
    v_ACT02.act02_cur_cd        := 'KRW'            ;
    v_ACT02.act02_journal_no    := f_create_journal_no(v_ACT02.act02_company_id, v_ACT02.act02_date);

    INSERT INTO act02_journal VALUES (v_ACT02.*);

    --PERFORM log_message('INFO', '20. act02_journal insert OK');
    
    -------------------------------------------------------------------------------------
    -- 임시분개장(ACT06) 생성
    -------------------------------------------------------------------------------------
    v_errMsg := '임시분개장(ACT06) 생성 실패';
    -------------------------------------------------------------------------------------
    FOR v_PAY50 IN ( SELECT *
                       FROM pay50_expense
                      WHERE pay50_expense_id IN (SELECT UNNEST(p_expense_ids))
                         OR pay50_expense_id = p_expense_id
    ) LOOP
    
        --PERFORM log_message('INFO', '30 - 임시분개장 생성 LOOP IN...'||v_PAY50.pay50_expense_id);
    
        ---------------------------------------------------------------------------------
        -- 임시분개장 생성
        v_errMsg := '임시분개장 생성 실패';
        v_errMsg := f_create_journalExpense_sub(v_ACT02.act02_journal_id, v_PAY50);
        IF v_errMsg != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;

        -- 분개번호 UPDATE
        UPDATE pay50_expense
           SET pay50_journal_id = v_ACT02.act02_journal_id
         WHERE pay50_expense_id = v_PAY50.pay50_expense_id;
    END LOOP;

    ---------------------------------------------------------------------------------
    -- 연관문서등록(지출결의서)
    ---------------------------------------------------------------------------------
    FOR v_DCR IN ( SELECT DISTINCT pay50_expense_appr_id
                     FROM pay50_expense
                    WHERE pay50_expense_id IN (SELECT UNNEST(p_expense_ids))
                       OR pay50_expense_id = p_expense_id
    ) LOOP
        v_COM01 := NULL ;

        v_COM01.com01_relate_appr_id    := f_create_seq()               ;
        v_COM01.com01_key_table         := 'ACT02'                      ;
        v_COM01.com01_key_table_id      := v_ACT02.act02_journal_id     ;
        v_COM01.com01_appr_id           := v_DCR.pay50_expense_appr_id  ;

        INSERT INTO com01_relate_appr VALUES (v_COM01.*);
    END LOOP;

    ---------------------------------------------------------------------------------
    -- 실분개장(ACT03) 생성
    ---------------------------------------------------------------------------------
    v_errMsg := '실분개장 생성 실패(f_create_journal_r)';
    v_errMsg := f_create_journal_r(v_ACT02.act02_journal_id);
    IF v_errMsg != 'Y' THEN
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        --PERFORM log_message('ERR', CONCAT('EXCEPTION USER ERR : ', v_errMsg));
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_errMsg ;
        RETURN v_errMsg;
    WHEN OTHERS THEN
        --PERFORM log_message('ERR', CONCAT('EXCEPTION ERR : ', v_errMsg), SQLERRM);
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN CONCAT(v_errMsg||'-', SQLERRM);
END;
$function$
```
