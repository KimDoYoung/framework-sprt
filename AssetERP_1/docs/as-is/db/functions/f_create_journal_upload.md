# f_create_journal_upload

## FUNCTION public.f_create_journal_upload(p_company_id numeric, p_person_id numeric)

- 반환: `text`
- 줄 수: 142

```sql
CREATE OR REPLACE FUNCTION public.f_create_journal_upload(p_company_id numeric, p_person_id numeric)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACT02         act02_journal%ROWTYPE;
    v_ACT03         act03_journal_dtl%ROWTYPE;
    v_ACT06         act06_journal_tmp%ROWTYPE;

    c_JNL           RECORD;
    c_DTL           RECORD;

    v_SEQ           NUMERIC;
    v_CNT           NUMERIC;
    v_CHK_DATE      DATE;

    v_RESULT_MSG    TEXT;
-----------------------------------------------------------------------------------------
BEGIN
    v_RESULT_MSG := '전표입력 업로드 처리시 오류 발생';

    -------------------------------------------------------------------------------------
    -- 10. 회계마감 체크
    v_RESULT_MSG := '회계마감 체크 실패';
    SELECT MIN(act08_date)
      INTO v_CHK_DATE
      FROM act08_journal_upload
     WHERE act08_company_id = p_company_id;

    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id = p_company_id
       AND act05_std_date  >= v_CHK_DATE;

    IF v_CNT > 0 THEN
        v_RESULT_MSG := '분개발생일('||TO_CHAR(v_CHK_DATE,'YYYY-MM-DD')||' 이후 회계마감 내역이 존재합니다';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 20. 분개장(전표) 생성(ACT02)
    v_RESULT_MSG := '분개장(전표) 생성 실패';
    FOR c_JNL IN ( SELECT act08_date            jnl_date
                        , act08_journal_no      jnl_no
                        , MIN(act08_note)       note
                     FROM act08_journal_upload
                    WHERE act08_company_id = p_company_id
                    GROUP BY act08_date, act08_journal_no
                    ORDER BY act08_date, act08_journal_no
    ) LOOP
        ---------------------------------------------------------------------------------
        v_ACT02 := NULL;
        ---------------------------------------------------------------------------------
        v_ACT02.act02_journal_id    := f_create_seq()       ;
        v_ACT02.act02_company_id    := p_company_id         ;
        v_ACT02.act02_person_id     := p_person_id          ;
        v_ACT02.act02_date          := c_JNL.jnl_date       ;
        v_ACT02.act02_note          := c_JNL.note           ;
        v_ACT02.act02_cur_cd        := 'KRW'                ;
        v_ACT02.act02_fix_yn        := 'false'              ;

        IF c_JNL.jnl_no::NUMERIC < 999 THEN
            v_ACT02.act02_journal_no := (TO_CHAR(c_JNL.jnl_date,'YYMMDD')||LPAD((c_JNL.jnl_no::NUMERIC)::TEXT,3,'0'))::NUMERIC;
        ELSE
            v_ACT02.act02_journal_no := (TO_CHAR(c_JNL.jnl_date,'YYMMDD')||SUBSTR(c_JNL.jnl_no,1,1)||RIGHT(c_JNL.jnl_no,2))::NUMERIC;
        END IF;

        RAISE NOTICE 'act02) 일자[%]-전표번호[% -> %]', to_char(c_JNL.jnl_date,'yyyy-mm-dd'), c_JNL.jnl_no, v_ACT02.act02_journal_no;

        INSERT INTO act02_journal VALUES (v_ACT02.*);

        ---------------------------------------------------------------------------------
        -- 30. 임기분개 생성(ACT06)
        ---------------------------------------------------------------------------------
        v_SEQ := 0;

        v_RESULT_MSG := '임기분개 생성 실패';
        FOR c_DTL IN ( SELECT *
                         FROM act08_journal_upload
                        WHERE act08_company_id  = p_company_id
                          AND act08_date        = c_JNL.jnl_date
                          AND act08_journal_no  = c_JNL.jnl_no
                        ORDER BY act08_journal_upload_id
        ) LOOP
            -----------------------------------------------------------------------------
            v_ACT06 := NULL     ;
            -----------------------------------------------------------------------------
            v_ACT06.act06_journal_id        := v_ACT02.act02_journal_id     ;
            v_ACT06.act06_repr_account_cd   := null                         ;
            v_ACT06.act06_real_account_cd   := c_DTL.act08_account_cd       ;
            v_ACT06.act06_note              := c_DTL.act08_account_note     ;

            IF COALESCE(c_DTL.act08_dr_amt,0) != 0 THEN
                v_SEQ := v_SEQ + 1;

                v_ACT06.act06_journal_tmp_id := f_create_seq()      ;
                v_ACT06.act06_seq            := v_SEQ               ;
                v_ACT06.act06_drcr_type      := 'D'                 ;
                v_ACT06.act06_amt            := c_DTL.act08_dr_amt  ;
                v_ACT06.act06_for_amt        := c_DTL.act08_dr_amt  ;

                INSERT INTO act06_journal_tmp VALUES (v_ACT06.*);
            END IF;

            IF COALESCE(c_DTL.act08_cr_amt,0) != 0 THEN
                v_SEQ := v_SEQ + 1;

                v_ACT06.act06_journal_tmp_id := f_create_seq()      ;
                v_ACT06.act06_seq            := v_SEQ               ;
                v_ACT06.act06_drcr_type      := 'C'                 ;
                v_ACT06.act06_amt            := c_DTL.act08_cr_amt  ;
                v_ACT06.act06_for_amt        := c_DTL.act08_cr_amt  ;

                INSERT INTO act06_journal_tmp VALUES (v_ACT06.*);
            END IF;
        END LOOP;

        ---------------------------------------------------------------------------------
        -- 40. 분개생성(ACT03)
        ---------------------------------------------------------------------------------
        v_RESULT_MSG := f_create_journal_rr(v_ACT02.act02_journal_id);
        IF v_RESULT_MSG != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;

    END LOOP; /* ACT02 END */
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_RESULT_MSG ;
        RETURN v_RESULT_MSG;
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_RESULT_MSG, SQLERRM ;
        RETURN v_RESULT_MSG||'-'||SQLERRM;
END;
$function$
```
