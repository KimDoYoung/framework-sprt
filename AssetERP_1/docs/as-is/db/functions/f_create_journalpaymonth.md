# f_create_journalpaymonth

## FUNCTION public.f_create_journalpaymonth(p_company_id numeric, p_person_id numeric, p_pay_date date, p_pay_type character varying, p_retire_id numeric)

- 반환: `character varying`
- 줄 수: 269

```sql
CREATE OR REPLACE FUNCTION public.f_create_journalpaymonth(p_company_id numeric, p_person_id numeric, p_pay_date date, p_pay_type character varying, p_retire_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACT02             act02_journal%ROWTYPE;
    v_ACT06             act06_journal_tmp%ROWTYPE;

    v_DATA              RECORD;
    v_JNL               RECORD;

    v_CNT               NUMERIC;

    v_TR_CD             VARCHAR(4);
    v_JNL_AMT           NUMERIC;
    v_DEPOSIT_ID        NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '급여분개 생성 실패 ['||p_pay_date||']['||p_pay_type||']';
    -------------------------------------------------------------------------------------
    -- 회계결산여부 체크
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id =  p_company_id
       AND act05_std_date   >= p_pay_date;
    IF v_CNT > 0 THEN
        v_errMsg := '회계마감 되었습니다.';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 급여정보 체크
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM pay10_month
     WHERE pay10_company_id = p_company_id
       AND pay10_date       = p_pay_date
       AND pay10_pay_cd     = p_pay_type
       AND ( ( p_pay_type       = '03'          AND --(03:퇴직정산)
               pay10_month_id   = p_retire_id   ) OR
             ( p_pay_type      != '03'          ) );

    IF v_CNT = 0 THEN
        v_errMsg := '급여정보가 존재하지 않습니다. ['||p_pay_date||']['||p_pay_type||']';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 금액 구하기
    -------------------------------------------------------------------------------------
    v_errMsg := '분개정보 생성 실패 ['||p_pay_date||']['||p_pay_type||']['||p_pay_type||']['||p_retire_id||']';
    FOR v_DATA IN ( SELECT pay10_retire_id                                                                                                      AS retire_id
                         , pay10_retire_person_nm                                                                                               AS retire_person_nm
                         , SUM(CASE WHEN emp03_kind_cd IN ('10','20','30','40') AND emp03_officer_type = '1' THEN pay10_pay       ELSE 0 END)   AS pay11
                         , SUM(CASE WHEN emp03_kind_cd IN ('10','20','30','40') AND emp03_officer_type = '2' THEN pay10_pay       ELSE 0 END)   AS pay12
                         , SUM(CASE WHEN emp03_kind_cd IN ('10','20','30','40') AND emp03_officer_type = '1' THEN pay10_bonus_pay ELSE 0 END)   AS bonus1
                         , SUM(CASE WHEN emp03_kind_cd IN ('10','20','30','40') AND emp03_officer_type = '2' THEN pay10_bonus_pay ELSE 0 END)   AS bonus2
                         , SUM(CASE WHEN emp03_kind_cd = '99' THEN pay10_pay + pay10_bonus_pay ELSE 0 END)                                      AS pay99
                         , SUM(pay10_np_ddc      )                                                                                              AS np_ddc
                         , SUM(pay10_hi_ddc      )                                                                                              AS hi_ddc
                         , SUM(pay10_ei_ddc      )                                                                                              AS ei_ddc
                         , SUM(pay10_income_tax  )                                                                                              AS income_tax
                         , SUM(pay10_resident_tax)                                                                                              AS resident_tax
                         , SUM(pay10_others_ddc  )                                                                                              AS others_ddc
                         , SUM(pay10_real_pay    )                                                                                              AS real_pay
                      FROM ( 
                             SELECT COALESCE(emp03_kind_cd,'99')                                                                 AS emp03_kind_cd
                                  , CASE WHEN COALESCE(emp03_officer_yn,'false') = 'true' THEN '1' ELSE '2' END                  AS emp03_officer_type
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                             INNER JOIN pay20_item ON pay20_item_cd = pay11_item_cd
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay20_item_type = '1'
                                         AND pay11_item_cd  != '130' )                                                           AS pay10_pay
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay11_item_cd   = '130' )                                                           AS pay10_bonus_pay
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay11_item_cd   IN ('250','251','252') )                                            AS pay10_income_tax
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay11_item_cd   IN ('260','261','262') )                                            AS pay10_resident_tax
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay11_item_cd    = '210' )                                                          AS pay10_np_ddc
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay11_item_cd   IN ('220','221','222','223','230','231','232','233') )             AS pay10_hi_ddc
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay11_item_cd   IN ('240','241','242','243') )                                     AS pay10_ei_ddc
                                  , ( SELECT SUM(pay11_item_amt)
                                        FROM pay11_month_item
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay11_item_cd    = '290' )                                                          AS pay10_others_ddc
                                  , ( SELECT SUM(pay11_item_amt * CASE WHEN pay20_item_type = '1' THEN 1 ELSE -1 END)
                                        FROM pay11_month_item
                                             INNER JOIN pay20_item ON pay20_item_cd = pay11_item_cd
                                       WHERE pay11_month_id  = pay10_month_id
                                         AND pay20_item_type IN ('1','2') )                                                      AS pay10_real_pay
                                  , CASE WHEN pay10_pay_cd = '03' THEN pay10_month_id ELSE NULL END                              AS pay10_retire_id
                                  , CASE WHEN pay10_pay_cd = '03' THEN f_emp_kor_nm(pay10_person_id) ELSE NULL END               AS pay10_retire_person_nm
                               FROM pay10_month
                                    INNER JOIN ( SELECT *
                                                   FROM emp01_person
                                                        INNER JOIN emp03_trans ON emp03_person_id = emp01_person_id
                                                  WHERE emp01_company_id = p_company_id
                                                    AND (emp03_person_id, emp03_trans_date) IN ( SELECT emp03_person_id, MAX(emp03_trans_date)
                                                                                                   FROM emp03_trans
                                                                                                  WHERE emp03_trans_date <= p_pay_date
                                                                                                  GROUP BY emp03_person_id ) ) emp ON emp01_person_id = pay10_person_id
                              WHERE pay10_company_id = p_company_id
                                AND pay10_date       = p_pay_date
                                AND pay10_pay_cd     = p_pay_type
                                AND ( ( '03'            = p_pay_type    AND
                                        pay10_month_id  = p_retire_id   ) OR
                                      ( '03'           != p_pay_type    ) )
                           ) t
                     GROUP BY pay10_retire_id, pay10_retire_person_nm
                     ORDER BY pay10_retire_person_nm
    ) LOOP
        ---------------------------------------------------------------------------------
        v_ACT02 := NULL;
        ---------------------------------------------------------------------------------
        -- 분개정보 생성
        ---------------------------------------------------------------------------------
        v_ACT02.act02_journal_id   := f_create_seq()    ;
        v_ACT02.act02_company_id   := p_company_id      ;
        v_ACT02.act02_person_id    := p_person_id       ;
        v_ACT02.act02_date         := p_pay_date        ;
        v_ACT02.act02_pay_month_cd := p_pay_type        ;
        v_ACT02.act02_cur_cd       := 'KRW'             ;
        v_ACT02.act02_retire_id    := v_DATA.retire_id  ;
        v_ACT02.act02_note         := TO_CHAR(p_pay_date,'yyyy.mm')||' '||f_cdnm('PayMonthCode', p_pay_type, p_company_id, p_pay_date)||' 지급'
                                    ||CASE WHEN p_pay_type = '03' THEN ' - '||v_DATA.retire_person_nm ELSE '' END ;

        v_ACT02.act02_journal_no   := f_create_journal_no(v_ACT02.act02_company_id, v_ACT02.act02_date);

        INSERT INTO act02_journal VALUES (v_ACT02.*);

        ---------------------------------------------------------------------------------
        -- 거래코드 SET
        IF p_pay_type = '01' THEN       -- 01:급여
            v_TR_CD := '5020';
        ELSIF p_pay_type = '02' THEN    -- 02:상여급
            v_TR_CD := '5021';
        ELSIF p_pay_type = '03' THEN    -- 03:퇴직정산
            v_TR_CD := '5022';
        ELSIF p_pay_type = '04' THEN    -- 04:특별수당(비과세)
            v_TR_CD := '5023';
        END IF;
        RAISE NOTICE 'v_TR_CD : %', v_TR_CD;
        ---------------------------------------------------------------------------------
        -- 급여출금계좌 GET
        SELECT pay03_ast_class_tree_id
          INTO v_DEPOSIT_ID
          FROM pay03_account
         WHERE pay03_company_id = p_company_id
           AND pay03_start_date <= p_pay_date
         ORDER BY pay03_start_date DESC
         LIMIT 1;

        ---------------------------------------------------------------------------------
        -- 임시분개장 생성
        ---------------------------------------------------------------------------------
        v_errMsg := '임시분개장 생성 실패 ['||p_company_id||']['||v_TR_CD||']';
        FOR v_JNL IN ( SELECT act12_journal_map.*
                            , f_get_real_account_code(act12_company_id, act12_repr_account_cd, '0000000000')  AS act13_real_account_cd
                         FROM act11_tr_map
                              INNER JOIN act12_journal_map ON ( act12_company_id    = act11_company_id      AND
                                                                act12_journal_group = act11_journal_group   AND
                                                                COALESCE(act12_use_yn,'false') = 'true'     )
                        WHERE act11_company_id  = p_company_id
                          AND act11_tr_cd       = v_TR_CD
                          AND COALESCE(act11_use_yn,'false') = 'true'
                        ORDER BY act12_seq
        ) LOOP
            -----------------------------------------------------------------------------
            v_ACT06 := NULL;
            -----------------------------------------------------------------------------
            -- 금액 SET
            -----------------------------------------------------------------------------
            IF    UPPER(v_JNL.act12_formula) = 'PAY11'          THEN v_JNL_AMT := v_DATA.pay11;
            ELSIF UPPER(v_JNL.act12_formula) = 'PAY12'          THEN v_JNL_AMT := v_DATA.pay12;
            ELSIF UPPER(v_JNL.act12_formula) = 'PAY99'          THEN v_JNL_AMT := v_DATA.pay99;
            ELSIF UPPER(v_JNL.act12_formula) = 'BONUS1'         THEN v_JNL_AMT := v_DATA.bonus1;
            ELSIF UPPER(v_JNL.act12_formula) = 'BONUS2'         THEN v_JNL_AMT := v_DATA.bonus2;
            ELSIF UPPER(v_JNL.act12_formula) = 'REAL_PAY'       THEN v_JNL_AMT := v_DATA.real_pay;
            ELSIF UPPER(v_JNL.act12_formula) = 'NP_DDC'         THEN v_JNL_AMT := v_DATA.np_ddc;
            ELSIF UPPER(v_JNL.act12_formula) = 'HI_DDC'         THEN v_JNL_AMT := v_DATA.hi_ddc;
            ELSIF UPPER(v_JNL.act12_formula) = 'EI_DDC'         THEN v_JNL_AMT := v_DATA.ei_ddc;
            ELSIF UPPER(v_JNL.act12_formula) = 'INCOME_TAX'     THEN v_JNL_AMT := v_DATA.income_tax;
            ELSIF UPPER(v_JNL.act12_formula) = 'LOCAL_TAX'      THEN v_JNL_AMT := v_DATA.resident_tax;
            ELSIF UPPER(v_JNL.act12_formula) = 'ETC_DDC'        THEN v_JNL_AMT := v_DATA.others_ddc;
            ELSE v_JNL_AMT := 0;
            END IF;

            IF v_JNL_AMT IS NULL THEN v_JNL_AMT := 0; END IF;

            RAISE NOTICE 'v_JNL.act12_formula : %', v_JNL.act12_formula;
            RAISE NOTICE 'v_JNL_AMT : %', v_JNL_AMT;

            -----------------------------------------------------------------------------
            IF v_JNL_AMT != 0 THEN
                -------------------------------------------------------------------------
                v_ACT06.act06_journal_tmp_id    := f_create_seq()                       ;
                v_ACT06.act06_journal_id        := v_ACT02.act02_journal_id             ;
                v_ACT06.act06_seq               := v_JNL.act12_seq                      ;
                v_ACT06.act06_repr_account_cd   := v_JNL.act12_repr_account_cd          ;
                v_ACT06.act06_real_account_cd   := v_JNL.act13_real_account_cd          ;
                v_ACT06.act06_drcr_type         := v_JNL.act12_drcr_type                ;
                v_ACT06.act06_amt               := v_JNL_AMT                            ;
                v_ACT06.act06_for_amt           := v_JNL_AMT                            ;
                v_ACT06.act06_note              := NULL                                 ;
                -------------------------------------------------------------------------
                IF (v_ACT06.act06_repr_account_cd IN ('2200','8888') AND   --(2200:미지급금/8888:예금계정)
                    v_DEPOSIT_ID IS NOT NULL                         ) THEN
                    v_ACT06.act06_deposit_id        := v_DEPOSIT_ID ;
                    v_ACT06.act06_repr_account_cd   := '8888';
                    v_ACT06.act06_real_account_cd   := f_get_real_account_code(p_company_id, v_ACT06.act06_repr_account_cd, '0000000000');
                ELSE
                    v_ACT06.act06_deposit_id        := NULL ;
                END IF;

                RAISE NOTICE 'v_ACT06.act06_seq             : %', v_ACT06.act06_seq;
                RAISE NOTICE 'v_ACT06.act06_repr_account_cd : %', v_ACT06.act06_repr_account_cd;
                RAISE NOTICE 'v_ACT06.act06_real_account_cd : %', v_ACT06.act06_real_account_cd;
                RAISE NOTICE 'v_ACT06.act06_drcr_type       : %', v_ACT06.act06_drcr_type;
                RAISE NOTICE 'v_ACT06.act06_amt             : %', v_ACT06.act06_amt;
                
                v_errMsg := '임시분개장 INSERT 실패 ['||v_ACT06.act06_repr_account_cd||']['||v_ACT06.act06_real_account_cd||']';
                INSERT INTO act06_journal_tmp VALUES (v_ACT06.*);
            END IF;
        END LOOP;

        ---------------------------------------------------------------------------------
        -- 실분개장 생성
        ---------------------------------------------------------------------------------
        v_errMsg := f_create_journal_r(v_ACT02.act02_journal_id);
        IF v_errMsg != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
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
