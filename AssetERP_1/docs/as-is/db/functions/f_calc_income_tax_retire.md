# f_calc_income_tax_retire

## FUNCTION public.f_calc_income_tax_retire(p_person_id numeric, p_per_year_yn character varying, p_proc_step numeric)

- 반환: `character varying`
- 줄 수: 775

```sql
CREATE OR REPLACE FUNCTION public.f_calc_income_tax_retire(p_person_id numeric, p_per_year_yn character varying, p_proc_step numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY10                 pay10_month%ROWTYPE;
    v_PAY11                 pay11_month_item%ROWTYPE;
    v_PAY13                 pay13_retire_tax%ROWTYPE;
    v_PAY13_CALC            pay13_retire_tax%ROWTYPE;
    v_PAY14                 pay14_retire_tax_item%ROWTYPE;
    v_PAY24                 pay24_deduct_table%ROWTYPE;
    v_EMP35                 emp35_deduct%ROWTYPE;

    c_DATA                  RECORD;

    v_STD_YEAR              VARCHAR(4);
    v_PRE_YEAR              VARCHAR(4);

    v_YEAR_AMT              NUMERIC;
    v_PRE_YEAR_AMT          NUMERIC;
    v_DEDUCT_LIMIT_AMT      NUMERIC;
    v_INCOME_DEDUCT         NUMERIC;
    v_INCOME_AMT            NUMERIC;
    v_CALC_TAX              NUMERIC;
    v_DEDUCT_AMT            NUMERIC;
    v_STD_AMT               NUMERIC;
    v_STD_DATE              DATE;
    v_PER_YEAR_YN           VARCHAR(5);

    v_LOOP_CNT              NUMERIC;

    v_errMsg                VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN

    /************************************************************************************
        소득세 퇴직정산내역 생성
    ************************************************************************************/

    -- 기생성내역 삭제
    v_errMsg := '소득세 퇴직정산내역 생성(저장)시 기생성내역 삭제 실패(1) ['||p_person_id||']['||p_proc_step||']';
    v_errMsg := f_calc_income_tax_retire_c (p_person_id, p_proc_step);
    IF v_errMsg != 'Y' THEN
        RAISE USING ERRCODE = '90001';
    END IF;

    RAISE NOTICE '=================== 소득세 퇴직정산내역 생성 IN !!!! (STEP : %) =====================', p_proc_step;

    -------------------------------------------------------------------------------------
    -- 퇴직정산내역 가져오기
    v_errMsg := '퇴직정산내역 가져오기 실패 ['||p_person_id||']';
    SELECT *
      INTO v_PAY10
      FROM pay10_month
     WHERE pay10_person_id  = p_person_id
       AND pay10_pay_cd     = '03'  --(03:퇴직정산)
     ORDER BY pay10_date DESC
     LIMIT 1;

    IF v_PAY10 IS NULL THEN
        v_errMsg := '퇴직정산내역이 존재하지 않습니다. 급여관리에서 지급구분을 "퇴직정산"으로 생성한 후 진행하세요';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 소득세 퇴직정산내역 가져오기
    v_errMsg := '소득세 퇴직정산내역 가져오기 실패';
    SELECT *
      INTO v_PAY13
      FROM pay13_retire_tax
     WHERE pay13_month_id = v_PAY10.pay10_month_id;

    -------------------------------------------------------------------------------------
    IF v_PAY13 IS NULL OR p_proc_step = 1 THEN
        ---------------------------------------------------------------------------------
        IF lower(COALESCE(p_per_year_yn,'null')) NOT IN ('false','true') THEN
            v_errMsg := '전년도분 생성여부를 확인해주세요 ['||COALESCE(p_per_year_yn,'null')||']';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        v_PER_YEAR_YN               := p_per_year_yn            ;
        ---------------------------------------------------------------------------------
        v_PAY13.pay13_retire_tax_id := f_create_seq()           ;
        v_PAY13.pay13_month_id      := v_PAY10.pay10_month_id   ;
        ---------------------------------------------------------------------------------
        INSERT INTO pay13_retire_tax VALUES (v_PAY13.*);
    -------------------------------------------------------------------------------------
    ELSE
        SELECT SUM(COALESCE(pay14_py_item_amt,0))
          INTO v_PRE_YEAR_AMT
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '1' ;  --(1:급여지급항목)

        IF COALESCE(v_PRE_YEAR_AMT,0) = 0 THEN
            v_PER_YEAR_YN := 'false';
        ELSE
            v_PER_YEAR_YN := 'true';
        END IF;
    END IF;

    -------------------------------------------------------------------------------------
    v_STD_YEAR := SUBSTR(v_PAY10.pay10_std_month,1,4);
    v_PRE_YEAR := CAST(SUBSTR(v_PAY10.pay10_std_month,1,4)::INT - 1 AS VARCHAR);

    --===================================================================================
    --
    -- 1. 총소득액
    --
    --===================================================================================
    IF p_proc_step < 1 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [1. 총소득액]';
        ---------------------------------------------------------------------------------
        v_errMsg := '소득항목생성 실패 ['||p_person_id||']['||v_STD_YEAR||']['||v_PRE_YEAR||']['||v_PER_YEAR_YN||']';
        INSERT
          INTO pay14_retire_tax_item
        SELECT f_create_seq()
             , v_PAY10.pay10_month_id
             , pay20_item_type
             , pay20_item_nm
             , SUM(item_amt)
             , SUM(py_item_amt)
          FROM ( 
                 SELECT pay20_item_type
                      , pay20_item_nm
                      , SUM(COALESCE(pay11_item_amt,0)) item_amt
                      , 0                               py_item_amt
                   FROM pay10_month
                        INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                        INNER JOIN pay20_item       ON pay20_item_cd  = pay11_item_cd
                  WHERE pay10_person_id             = p_person_id
                    AND pay20_item_type             = '1'    --(1:급여지급항목)
                    AND pay20_non_tax_type          = '1'    --(1:과세)
                    AND SUBSTR(pay10_std_month,1,4) = v_STD_YEAR
                  GROUP BY pay20_item_type, pay20_item_nm
                  UNION ALL
                 SELECT pay20_item_type
                      , pay20_item_nm
                      , 0                               item_amt
                      , SUM(COALESCE(pay11_item_amt,0)) py_item_amt
                   FROM pay10_month
                        INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                        INNER JOIN pay20_item       ON pay20_item_cd  = pay11_item_cd
                  WHERE pay10_person_id             = p_person_id
                    AND pay20_item_type             = '1'    --(1:급여지급항목)
                    AND pay20_non_tax_type          = '1'    --(1:과세)
                    AND SUBSTR(pay10_std_month,1,4) = v_PRE_YEAR
                    AND v_PER_YEAR_YN               = 'true'
                  GROUP BY pay20_item_type, pay20_item_nm
               ) t
         GROUP BY pay20_item_type, pay20_item_nm;

        RAISE NOTICE ' - 총소득액 생성완료';
    END IF;

    --===================================================================================
    --
    -- 2. 근로소득공제
    --
    --===================================================================================
    IF p_proc_step < 2 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [2. 근로소득공제]';
        ---------------------------------------------------------------------------------
        v_PAY13.pay13_income_deduct     := 0;
        v_PAY13.pay13_py_income_deduct  := 0;
        ---------------------------------------------------------------------------------
        v_errMsg := '총소득액 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
        SELECT SUM(COALESCE(pay14_item_amt   ,0))
             , SUM(COALESCE(pay14_py_item_amt,0))
          INTO v_YEAR_AMT
             , v_PRE_YEAR_AMT
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '1' ;  --(1:급여지급항목)

        IF v_YEAR_AMT IS NULL THEN
            v_YEAR_AMT := 0;
        END IF;

        IF v_PRE_YEAR_AMT IS NULL THEN
            v_PRE_YEAR_AMT := 0;
        END IF;

        RAISE NOTICE ' - 총소득액 : % , %', v_YEAR_AMT, v_PRE_YEAR_AMT;

        ---------------------------------------------------------------------------------
        IF v_PER_YEAR_YN = 'true' THEN
            v_LOOP_CNT := 2;
        ELSE
            v_LOOP_CNT := 1;
        END IF;

        FOR i IN 1..v_LOOP_CNT LOOP
            -----------------------------------------------------------------------------
            IF i = 1 THEN
                v_STD_AMT   := v_YEAR_AMT;
                v_STD_DATE  := v_PAY10.pay10_date;
            ELSE
                v_STD_AMT   := v_PRE_YEAR_AMT;
                v_STD_DATE  := CAST(v_PRE_YEAR||'-12-31' AS DATE);
            END IF;
            -----------------------------------------------------------------------------
            v_errMsg := '근로소득공제 계산정보 가져오기 실패 ['||v_PAY10.pay10_month_id||']['||v_STD_DATE||']';
            SELECT *
              INTO v_PAY24
              FROM pay24_deduct_table
             WHERE pay24_data_cd    = '2'
               AND pay24_start_date = ( SELECT MAX(pay24_start_date)
                                          FROM pay24_deduct_table
                                         WHERE pay24_data_cd = '2'
                                           AND pay24_start_date <= v_STD_DATE )
               AND pay24_from_amt   <  v_STD_AMT
               AND v_STD_AMT        <= pay24_to_amt ;
            -----------------------------------------------------------------------------
            v_errMsg := '근로소득공제 한도금액 가져오기 실패 ['||v_PAY10.pay10_month_id||']['||v_STD_DATE||']';
            SELECT pay24_limit_amt
              INTO v_DEDUCT_LIMIT_AMT
              FROM pay24_deduct_table
             WHERE pay24_data_cd    = '1'
               AND pay24_start_date = ( SELECT MAX(pay24_start_date)
                                          FROM pay24_deduct_table
                                         WHERE pay24_data_cd = '1'
                                           AND pay24_start_date <= v_STD_DATE );
            IF v_DEDUCT_LIMIT_AMT IS NULL THEN
                v_DEDUCT_LIMIT_AMT := 0;
            END IF;

            RAISE NOTICE ' - %) 기본공제금액(%) + (총소득액(%) - 구간기준시작금액(%)) * 공제율(%)', i, v_PAY24.pay24_deduct_amt, v_STD_AMT, v_PAY24.pay24_from_amt, v_PAY24.pay24_deduct_rate;

            -----------------------------------------------------------------------------
            -- 근로소득공제금액 = 기본공제금액 + (총소득액 - 구간기준시작금액) * 공제율
            v_INCOME_DEDUCT := v_PAY24.pay24_deduct_amt + TRUNC((v_STD_AMT - v_PAY24.pay24_from_amt) * (v_PAY24.pay24_deduct_rate / 100.0));
            -----------------------------------------------------------------------------
            -- 공제한도금액 적용
            IF v_DEDUCT_LIMIT_AMT != 0 AND v_INCOME_DEDUCT > v_DEDUCT_LIMIT_AMT THEN
                v_INCOME_DEDUCT := v_DEDUCT_LIMIT_AMT;
            END IF;

            RAISE NOTICE ' - %) 근로소득공제금액 : %', i, v_INCOME_DEDUCT;
            RAISE NOTICE ' - %) 공제한도금액     : %', i, v_DEDUCT_LIMIT_AMT;

            -----------------------------------------------------------------------------
            IF i =1 THEN
                v_PAY13.pay13_income_deduct     := v_INCOME_DEDUCT;
                v_PAY13.pay13_py_income_deduct  := 0              ;
            ELSE
                v_PAY13.pay13_py_income_deduct  := v_INCOME_DEDUCT;
            END IF;
        END LOOP;
        ---------------------------------------------------------------------------------
        RAISE NOTICE ' - 근로소득공제 UPDATE : %, %', v_PAY13.pay13_income_deduct, v_PAY13.pay13_py_income_deduct;

        UPDATE pay13_retire_tax
           SET pay13_income_deduct    = v_PAY13.pay13_income_deduct
             , pay13_py_income_deduct = v_PAY13.pay13_py_income_deduct
         WHERE pay13_month_id = v_PAY10.pay10_month_id;       
    END IF;

    --===================================================================================
    --
    -- 3. 근로소득금액
    --
    --===================================================================================
    IF p_proc_step < 3 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [3. 근로소득금액]';
        ---------------------------------------------------------------------------------
        v_errMsg := '총소득액 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
        SELECT SUM(COALESCE(pay14_item_amt   ,0))
             , SUM(COALESCE(pay14_py_item_amt,0))
          INTO v_YEAR_AMT
             , v_PRE_YEAR_AMT
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '1' ;  --(1:급여지급항목)

        IF v_YEAR_AMT IS NULL THEN
            v_YEAR_AMT := 0;
        END IF;

        IF v_PRE_YEAR_AMT IS NULL THEN
            v_PRE_YEAR_AMT := 0;
        END IF;

        ---------------------------------------------------------------------------------
        -- 근로소득금액 = 총소득액 - 근로소득공제
        v_errMsg := '근로소득금액 계산 실패 ['||v_PAY10.pay10_month_id||']';
        UPDATE pay13_retire_tax
           SET pay13_income_amt    = v_YEAR_AMT     - pay13_income_deduct
             , pay13_py_income_amt = v_PRE_YEAR_AMT - pay13_py_income_deduct
         WHERE pay13_month_id = v_PAY10.pay10_month_id; 

        RAISE NOTICE ' - 근로소득금액 UPDATE 완료 ';
    END IF;

    --===================================================================================
    --
    -- 4. 종합소득공제
    --
    --===================================================================================
    IF p_proc_step < 4 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [4. 종합소득공제]';
        ---------------------------------------------------------------------------------
        FOR c_DATA IN ( SELECT *
                          FROM pay20_item
                         WHERE pay20_item_type = '3'    --(3:종합소득공제항목)
                           AND pay20_use_yn    = 'true'
                         ORDER BY COALESCE(pay20_seq||'', pay20_item_cd)
        ) LOOP
            -----------------------------------------------------------------------------
            v_PAY14.pay14_retire_tax_item_id    := f_create_seq()           ;
            v_PAY14.pay14_month_id              := v_PAY10.pay10_month_id   ;
            v_PAY14.pay14_item_type             := c_DATA.pay20_item_type   ;
            v_PAY14.pay14_item_nm               := c_DATA.pay20_item_nm     ;
            -----------------------------------------------------------------------------
            IF v_PER_YEAR_YN = 'true' THEN
                v_LOOP_CNT := 2;
            ELSE
                v_LOOP_CNT := 1;
            END IF;
            -----------------------------------------------------------------------------
            FOR i IN 1..v_LOOP_CNT LOOP
                -------------------------------------------------------------------------
                v_STD_AMT := 0;
                -------------------------------------------------------------------------
                IF i = 1 THEN
                    v_STD_DATE  := v_PAY10.pay10_date;
                ELSE
                    v_STD_DATE  := CAST(v_PRE_YEAR||'-12-31' AS DATE);
                END IF;

                RAISE NOTICE ' - %) 기준일자 : %', i, v_STD_DATE;

                -------------------------------------------------------------------------
                -- 인적공제(310:기본공제/320:추가공제)
                -------------------------------------------------------------------------
                IF c_DATA.pay20_item_cd IN ('310','320') THEN
                    ---------------------------------------------------------------------
                    v_errMsg := '공제정보 가져오기 실패 ['||v_PAY10.pay10_person_id||']['||v_STD_DATE||']';
                    SELECT *
                      INTO v_EMP35
                      FROM emp35_deduct
                     WHERE emp35_person_id   = v_PAY10.pay10_person_id
                       AND emp35_start_date <= v_STD_DATE
                     ORDER BY emp35_start_date DESC
                     LIMIT 1;

                    IF v_EMP35.emp35_basic_deduct_cnt IS NULL THEN
                        v_EMP35.emp35_basic_deduct_cnt  := 1        ;
                        v_EMP35.emp35_add_deduct_yn     := 'false'  ;
                    END IF;
                    ---------------------------------------------------------------------
                    -- (310:기본공제)
                    IF c_DATA.pay20_item_cd = '310' THEN
                        -----------------------------------------------------------------
                        v_errMsg := '기본공제금액 가져오기 실패 ['||v_STD_DATE||']';
                        SELECT pay25_deduct_amt * v_EMP35.emp35_basic_deduct_cnt
                          INTO v_STD_AMT
                          FROM pay25_person_deduct
                         WHERE pay25_person_deduct_cd = '0' --(0:기본공제)
                           AND pay25_start_date      <= v_STD_DATE
                         ORDER BY pay25_start_date DESC
                         LIMIT 1;

                        RAISE NOTICE ' - %) 기본공제금액 : %(%)', i, v_STD_AMT, v_EMP35.emp35_basic_deduct_cnt;

                    ---------------------------------------------------------------------
                    -- (320:추가공제)
                    ELSIF c_DATA.pay20_item_cd = '320'                              AND
                          COALESCE(v_EMP35.emp35_add_deduct_yn,'false') = 'true'    THEN
                        -----------------------------------------------------------------
                        v_errMsg := '추가공제내역 가져오기 실패 ['||v_STD_DATE||']';
                        SELECT SUM(emp36_add_deduct_cnt * ( SELECT pay25_deduct_amt
                                                              FROM pay25_person_deduct
                                                             WHERE pay25_person_deduct_cd = emp36_add_deduct_type
                                                               AND pay25_start_date      <= v_STD_DATE
                                                             ORDER BY pay25_start_date DESC
                                                             LIMIT 1 ))
                          INTO v_STD_AMT
                          FROM emp36_add_deduct
                         WHERE emp36_deduct_id      = v_EMP35.emp35_deduct_id
                           AND emp36_add_deduct_cnt > 0;

                        RAISE NOTICE ' - %) 추가공제금액 : %', i, v_STD_AMT;
                    END IF;

                -------------------------------------------------------------------------
                -- 330:국민연금보험료
                -- 340:건강보험료(장기요양포함)
                -- 350:건강보험료(고용보험료)
                -------------------------------------------------------------------------
                ELSIF c_DATA.pay20_item_cd IN ('330','340','350') THEN
                    ---------------------------------------------------------------------
                    v_errMsg := '4대보험 납입금액 가져오기 실패 ['||v_PAY10.pay10_person_id||']['||i||']['||v_STD_YEAR||']['||v_PRE_YEAR||']['||c_DATA.pay20_item_cd||']';
                    SELECT SUM(COALESCE(pay11_item_amt,0))
                      INTO v_STD_AMT
                      FROM pay10_month
                           INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                     WHERE pay10_person_id = v_PAY10.pay10_person_id
                       AND SUBSTR(pay10_std_month,1,4) = CASE WHEN i=1 THEN v_STD_YEAR ELSE v_PRE_YEAR END
                       AND ( ( c_DATA.pay20_item_cd = '330' AND pay11_item_cd =   '210'         ) OR    --(210:국민연금)
                             ( c_DATA.pay20_item_cd = '340' AND pay11_item_cd IN ('220','230')  ) OR    --(220:건강보험/230:장기요양보험)
                             ( c_DATA.pay20_item_cd = '350' AND pay11_item_cd =   '240'         ) );    --(240:고용보험)

                    RAISE NOTICE ' - %) 4대보험 납입금액 : %', i, v_STD_AMT;
                END IF;
                -------------------------------------------------------------------------
                IF v_STD_AMT IS NULL THEN
                    v_STD_AMT := 0;
                END IF;
                -------------------------------------------------------------------------
                IF i = 1 THEN
                    v_PAY14.pay14_item_amt    := v_STD_AMT  ;
                    v_PAY14.pay14_py_item_amt := 0          ;
                ELSE
                    v_PAY14.pay14_py_item_amt := v_STD_AMT  ;
                END IF;
            END LOOP;
            -----------------------------------------------------------------------------
            INSERT INTO pay14_retire_tax_item VALUES (v_PAY14.*);
        END LOOP;
    END IF;

    --===================================================================================
    --
    -- 5. 차감소득금액(과세표준)
    --
    --===================================================================================
    IF p_proc_step < 5 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [5. 차감소득금액(과세표준)]';
        ---------------------------------------------------------------------------------
        v_errMsg := '종합소득공제 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
        SELECT SUM(COALESCE(pay14_item_amt   ,0))
             , SUM(COALESCE(pay14_py_item_amt,0))
          INTO v_YEAR_AMT
             , v_PRE_YEAR_AMT
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '3' ;  --(3:종합소득공제항목)

        IF v_YEAR_AMT IS NULL THEN
            v_YEAR_AMT := 0;
        END IF;

        IF v_PRE_YEAR_AMT IS NULL THEN
            v_PRE_YEAR_AMT := 0;
        END IF;
        ---------------------------------------------------------------------------------
        -- 과세표준 = 근로소득금액 - 종합소득공제
        v_errMsg := '과세표준 계산 실패 ['||v_PAY10.pay10_month_id||']';
        UPDATE pay13_retire_tax
           SET pay13_tax_base    = pay13_income_amt    - v_YEAR_AMT
             , pay13_py_tax_base = pay13_py_income_amt - v_PRE_YEAR_AMT
         WHERE pay13_month_id = v_PAY10.pay10_month_id;
    END IF;

    --===================================================================================
    --
    -- 6. 산출세액
    --
    --===================================================================================
    IF p_proc_step < 6 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [6. 산출세액]';
        ---------------------------------------------------------------------------------
        v_errMsg := '과세표준 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
        SELECT *
          INTO v_PAY13_CALC
          FROM pay13_retire_tax
         WHERE pay13_month_id = v_PAY10.pay10_month_id;

        ---------------------------------------------------------------------------------
        IF v_PER_YEAR_YN = 'true' THEN
            v_LOOP_CNT := 2;
        ELSE
            v_LOOP_CNT := 1;
        END IF;

        FOR i IN 1..v_LOOP_CNT LOOP
            -----------------------------------------------------------------------------
            IF i = 1 THEN
                v_STD_AMT   := v_PAY13_CALC.pay13_tax_base;
                v_STD_DATE  := v_PAY10.pay10_date;
            ELSE
                v_STD_AMT   := v_PAY13_CALC.pay13_py_tax_base;
                v_STD_DATE  := CAST(v_PRE_YEAR||'-12-31' AS DATE);
            END IF;        
            -----------------------------------------------------------------------------
            -- 산출세액 = 기본세액 + (과세표준 - 과세표준 구간시작금액) * 기본세율
            v_errMsg := '산출세액 계산 실패 ['||v_STD_AMT||']['||v_STD_DATE||']';
            SELECT pay26_basic_tax + TRUNC((v_STD_AMT - pay26_from_amt) * (pay26_rate / 100.0))
              INTO v_CALC_TAX
              FROM pay26_tax_calc_table
             WHERE pay26_from_amt   <  v_STD_AMT
               AND v_STD_AMT        <= pay26_to_amt
               AND pay26_start_date <= v_STD_DATE
             ORDER BY pay26_start_date DESC
             LIMIT 1;
            -----------------------------------------------------------------------------
            IF v_CALC_TAX IS NULL THEN
                v_CALC_TAX := 0;
            END IF;
            -----------------------------------------------------------------------------
            IF i = 1 THEN
                v_PAY13.pay13_calc_tax    := v_CALC_TAX  ;
                v_PAY13.pay13_py_calc_tax := 0           ;
            ELSE
                v_PAY13.pay13_py_calc_tax := v_CALC_TAX  ;
            END IF;
        END LOOP;
        ---------------------------------------------------------------------------------
        UPDATE pay13_retire_tax
           SET pay13_calc_tax    = v_PAY13.pay13_calc_tax
             , pay13_py_calc_tax = v_PAY13.pay13_py_calc_tax
         WHERE pay13_month_id = v_PAY10.pay10_month_id;
    END IF;

    --===================================================================================
    --
    -- 7. 세액공제
    --
    --===================================================================================
    IF p_proc_step < 7 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [7. 세액공제]';
        ---------------------------------------------------------------------------------
        v_errMsg := '산출세액 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
        SELECT *
          INTO v_PAY13_CALC
          FROM pay13_retire_tax
         WHERE pay13_month_id = v_PAY10.pay10_month_id;
        ---------------------------------------------------------------------------------
        v_errMsg := '총소득액 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
        SELECT SUM(COALESCE(pay14_item_amt   ,0))
             , SUM(COALESCE(pay14_py_item_amt,0))
          INTO v_YEAR_AMT
             , v_PRE_YEAR_AMT
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '1' ;  --(1:급여지급항목)

        IF v_YEAR_AMT IS NULL THEN
            v_YEAR_AMT := 0;
        END IF;

        IF v_PRE_YEAR_AMT IS NULL THEN
            v_PRE_YEAR_AMT := 0;
        END IF;
        ---------------------------------------------------------------------------------
        FOR c_DATA IN ( SELECT *
                          FROM pay20_item
                         WHERE pay20_item_type = '4'    --(4:세액공제항목)
                           AND pay20_use_yn    = 'true'
                         ORDER BY COALESCE(pay20_seq||'', pay20_item_cd)
        ) LOOP
            -----------------------------------------------------------------------------
            v_PAY14.pay14_retire_tax_item_id    := f_create_seq()           ;
            v_PAY14.pay14_month_id              := v_PAY10.pay10_month_id   ;
            v_PAY14.pay14_item_type             := c_DATA.pay20_item_type   ;
            v_PAY14.pay14_item_nm               := c_DATA.pay20_item_nm     ;
            -----------------------------------------------------------------------------
            IF v_PER_YEAR_YN = 'true' THEN
                v_LOOP_CNT := 2;
            ELSE
                v_LOOP_CNT := 1;
            END IF;
            -----------------------------------------------------------------------------
            FOR i IN 1..v_LOOP_CNT LOOP
                -------------------------------------------------------------------------
                IF i = 1 THEN
                    v_STD_DATE   := v_PAY10.pay10_date;
                    v_STD_AMT    := v_PAY13_CALC.pay13_calc_tax;
                    v_INCOME_AMT := v_YEAR_AMT;
                ELSE
                    v_STD_DATE   := CAST(v_PRE_YEAR||'-12-31' AS DATE);
                    v_STD_AMT    := v_PAY13_CALC.pay13_py_calc_tax;
                    v_INCOME_AMT := v_PRE_YEAR_AMT;
                END IF;
                -------------------------------------------------------------------------
                -- 410:근로소득
                IF c_DATA.pay20_item_cd = '410' THEN
                    ---------------------------------------------------------------------
                    -- 근로소득세액공제 = 기본공제 + (산출세액 - 구간시작금액) * 적용율
                    v_errMsg := '근로소득세액공제 계산 실패 ['||v_PAY10.pay10_month_id||']';
                    SELECT pay27_deduct_amt + TRUNC((v_STD_AMT - pay27_from_amt) * (pay27_rate / 100.0))
                      INTO v_DEDUCT_AMT
                      FROM pay27_tax_deduct_table
                     WHERE pay27_from_amt   <  v_STD_AMT
                       AND v_STD_AMT        <= pay27_to_amt
                       AND pay27_start_date <= v_STD_DATE
                     ORDER BY pay27_start_date DESC
                     LIMIT 1;
                    ---------------------------------------------------------------------
                    IF v_DEDUCT_AMT IS NULL THEN
                        v_DEDUCT_AMT := 0 ;
                    END IF;
                    ---------------------------------------------------------------------
                    -- 근로소득세액공제한도 가져오기
                    v_errMsg := '근로소득세액공제한도 가져오기 실패';
                    SELECT GREATEST(pay28_max_limit - TRUNC((v_INCOME_AMT - pay28_from_amt) * (pay28_rate/100.0)), pay28_min_limit)
                      INTO v_DEDUCT_LIMIT_AMT
                      FROM pay28_tax_deduct_limit
                     WHERE pay28_from_amt   <  v_INCOME_AMT
                       AND v_INCOME_AMT     <= pay28_to_amt
                       AND pay28_start_date <= v_STD_DATE
                     ORDER BY pay28_start_date DESC
                     LIMIT 1;
                    ---------------------------------------------------------------------
                    IF v_DEDUCT_LIMIT_AMT IS NULL THEN
                        v_DEDUCT_LIMIT_AMT := 0;
                    END IF;
                    ---------------------------------------------------------------------
                    -- 한도반영
                    IF v_DEDUCT_AMT > v_DEDUCT_LIMIT_AMT THEN
                        v_DEDUCT_AMT := v_DEDUCT_LIMIT_AMT;
                    END IF;
                END IF;
                -------------------------------------------------------------------------
                IF i = 1 THEN
                    v_PAY14.pay14_item_amt    := v_DEDUCT_AMT  ;
                    v_PAY14.pay14_py_item_amt := 0             ;
                ELSE
                    v_PAY14.pay14_py_item_amt := v_DEDUCT_AMT  ;
                END IF;
            END LOOP;
            -----------------------------------------------------------------------------
            INSERT INTO pay14_retire_tax_item VALUES (v_PAY14.*);
        END LOOP;
    END IF;

    --===================================================================================
    --
    -- 8. 결정세액
    --
    --===================================================================================
    IF p_proc_step < 8 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [8. 결정세액]';
        ---------------------------------------------------------------------------------
        v_errMsg := '세액공제 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
        SELECT SUM(COALESCE(pay14_item_amt   ,0))
             , SUM(COALESCE(pay14_py_item_amt,0))
          INTO v_YEAR_AMT
             , v_PRE_YEAR_AMT
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '4' ;  --(4:세액공제항목)

        IF v_YEAR_AMT IS NULL THEN
            v_YEAR_AMT := 0;
        END IF;

        IF v_PRE_YEAR_AMT IS NULL THEN
            v_PRE_YEAR_AMT := 0;
        END IF;
        ---------------------------------------------------------------------------------
        -- 결정세액 = 산출세액 - 세액공제
        v_errMsg := '결정세액 계산 실패 ['||v_PAY10.pay10_month_id||']';
        UPDATE pay13_retire_tax
           SET pay13_decide_tax    = pay13_calc_tax    - v_YEAR_AMT
             , pay13_py_decide_tax = pay13_py_calc_tax - v_PRE_YEAR_AMT
         WHERE pay13_month_id = v_PAY10.pay10_month_id;
    END IF;

    --===================================================================================
    --
    -- 9. 기납부세액
    --
    --===================================================================================
    IF p_proc_step < 9 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [9. 기납부세액]';
        ---------------------------------------------------------------------------------
        IF v_PER_YEAR_YN = 'true' THEN
            v_LOOP_CNT := 2;
        ELSE
            v_LOOP_CNT := 1;
        END IF;
        ---------------------------------------------------------------------------------
        FOR i IN 1..v_LOOP_CNT LOOP
            -----------------------------------------------------------------------------
            SELECT SUM(COALESCE(pay11_item_amt,0))
              INTO v_STD_AMT
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id = v_PAY10.pay10_person_id
               AND SUBSTR(pay10_std_month,1,4) = CASE WHEN i=1 THEN v_STD_YEAR ELSE v_PRE_YEAR END
               AND pay11_item_cd =   '250'; --(250:소득세)
            -----------------------------------------------------------------------------
            IF v_STD_AMT IS NULL THEN
                v_STD_AMT := 0;
            END IF;
            -----------------------------------------------------------------------------
            IF i = 1 THEN
                v_PAY13.pay13_cur_office_pay_tax    := v_STD_AMT;
                v_PAY13.pay13_py_cur_office_pay_tax := 0        ;
            ELSE
                v_PAY13.pay13_py_cur_office_pay_tax := v_STD_AMT;
            END IF;
        END LOOP;
            -----------------------------------------------------------------------------
        UPDATE pay13_retire_tax
           SET pay13_cur_office_pay_tax     = v_PAY13.pay13_cur_office_pay_tax
             , pay13_py_cur_office_pay_tax  = v_PAY13.pay13_py_cur_office_pay_tax
         WHERE pay13_month_id = v_PAY10.pay10_month_id;
    END IF;

    --===================================================================================
    --
    -- 10. 차감징수세액
    --
    --===================================================================================
    IF p_proc_step < 10 THEN
        RAISE NOTICE ' ';
        RAISE NOTICE ' [10. 차감징수세액]';
        ---------------------------------------------------------------------------------
        -- 차감징수세액 = 결정세액 - 기납부세액
        v_errMsg := '차감징수세액 계산 실패 ['||v_PAY10.pay10_month_id||']';
        UPDATE pay13_retire_tax
           SET pay13_settle_tax    = TRUNC(pay13_decide_tax    - (COALESCE(pay13_pre_office_pay_tax   ,0) + pay13_cur_office_pay_tax   ), -1)
             , pay13_py_settle_tax = TRUNC(pay13_py_decide_tax - (COALESCE(pay13_py_pre_office_pay_tax,0) + pay13_py_cur_office_pay_tax), -1)
         WHERE pay13_month_id = v_PAY10.pay10_month_id;
    END IF;

    --===================================================================================
    --
    -- 99. 소득세/지방세 퇴직정산 항목상세 생성
    --
    --===================================================================================
    v_errMsg := '소득세/지방세 퇴직정산 항목상세 생성실패';
    -------------------------------------------------------------------------------------
    v_PAY11 := NULL;
    v_PAY11.pay11_month_id      := v_PAY10.pay10_month_id   ;
    v_PAY11.pay11_item_type     := '2'                      ;
    -------------------------------------------------------------------------------------
    FOR i IN 1..2 LOOP
        ---------------------------------------------------------------------------------
        IF i = 1 THEN
            -----------------------------------------------------------------------------
            v_PAY11.pay11_item_cd := '252' ; --(252:소득세(퇴직정산))
            -----------------------------------------------------------------------------
            SELECT pay13_settle_tax + pay13_py_settle_tax
              INTO v_PAY11.pay11_item_amt
              FROM pay13_retire_tax
             WHERE pay13_month_id = v_PAY10.pay10_month_id;
        ---------------------------------------------------------------------------------
        ELSE
            v_PAY11.pay11_item_cd  := '262' ; --(262:지방세(퇴직정산))
            v_PAY11.pay11_item_amt := f_calc_local_tax(v_PAY10.pay10_date, v_PAY11.pay11_item_amt);
        END IF;
        ---------------------------------------------------------------------------------
        v_errMsg := '소득세 퇴직정산 항목상세 생성실패(INSERT)';
        v_PAY11.pay11_month_item_id := f_create_seq()           ;
        INSERT INTO pay11_month_item VALUES (v_PAY11.*);
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
