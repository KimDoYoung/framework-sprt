# f_get_simple_income_tax

## FUNCTION public.f_get_simple_income_tax(p_person_id numeric, p_std_date date, p_month_pay numeric)

- 반환: `numeric`
- 줄 수: 123

```sql
CREATE OR REPLACE FUNCTION public.f_get_simple_income_tax(p_person_id numeric, p_std_date date, p_month_pay numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY23             pay23_simple_tax_table_other%ROWTYPE;
    v_EMP               RECORD;
    v_CHILD_DEDUCT_AMT  NUMERIC;
    v_MONTH_PAY         NUMERIC;
    v_WITH_HOLD_RATE    NUMERIC;
    v_TAX               NUMERIC;
    v_UNIT              NUMERIC := 1000;
    v_STD_AMT           NUMERIC := 10000;   --(10,000만원)
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 원천징수세액 계산
    -------------------------------------------------------------------------------------
    -- 사원정보
    SELECT *
      INTO v_EMP
      FROM emp35_deduct
     WHERE emp35_person_id   = p_person_id
       AND emp35_start_date <= p_std_date
     ORDER BY emp35_start_date DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    v_MONTH_PAY := TRUNC(p_month_pay / v_UNIT);
    -------------------------------------------------------------------------------------
    -- 공제대상가족수에 따른 세액
    SELECT CASE v_EMP.emp35_basic_deduct_cnt WHEN  1 THEN pay22_deduct_cnt1
                                             WHEN  2 THEN pay22_deduct_cnt2
                                             WHEN  3 THEN pay22_deduct_cnt3
                                             WHEN  4 THEN pay22_deduct_cnt4
                                             WHEN  5 THEN pay22_deduct_cnt5
                                             WHEN  6 THEN pay22_deduct_cnt6
                                             WHEN  7 THEN pay22_deduct_cnt7
                                             WHEN  8 THEN pay22_deduct_cnt8
                                             WHEN  9 THEN pay22_deduct_cnt9
                                             WHEN 10 THEN pay22_deduct_cnt10
                                             WHEN 11 THEN pay22_deduct_cnt11 END
      INTO v_TAX
      FROM pay22_simple_tax_table
     WHERE pay22_start_date <= p_std_date
       AND v_MONTH_PAY BETWEEN pay22_from_amt AND pay22_to_amt-1
     ORDER BY pay22_start_date DESC
     LIMIT 1;

    RAISE NOTICE '===> 원천징수세액 계산) 공제대상가족수                 [%]', v_EMP.emp35_basic_deduct_cnt;
    RAISE NOTICE '===> 원천징수세액 계산) 간이세액표상의 천만원이하 세액 [%]', v_TAX;

    -------------------------------------------------------------------------------------
    -- 월소득액이 천만원 초과하는 경우 추가세액 계산
    IF v_MONTH_PAY > v_STD_AMT THEN
        ---------------------------------------------------------------------------------
        SELECT *
          INTO v_PAY23
          FROM pay23_simple_tax_table_other
         WHERE pay23_start_date <= p_std_date
           AND v_MONTH_PAY BETWEEN pay23_from_amt+1 AND pay23_to_amt
         ORDER BY pay23_start_date DESC
         LIMIT 1;
        ---------------------------------------------------------------------------------
        RAISE NOTICE '===> 원천징수세액 계산) 천만원 초과분 세액 계산 : % + {(% - %) * % * %/100 * %/100 + %}', v_TAX, v_MONTH_PAY, v_PAY23.pay23_from_amt, v_UNIT, v_PAY23.pay23_rate1, v_PAY23.pay23_rate2, v_PAY23.pay23_add_tax;
        v_TAX := v_TAX + TRUNC((v_MONTH_PAY - v_PAY23.pay23_from_amt) * v_UNIT * (v_PAY23.pay23_rate1/100) * (v_PAY23.pay23_rate2/100)) + v_PAY23.pay23_add_tax;

        RAISE NOTICE '===> 원천징수세액 계산) 천만원 초과분 세액 (v_TAX) : %', v_TAX;

    END IF;

    /*-----------------------------------------------------------------------------------
      (2024.03.08 CYY)
       2024년03월01일부터 시행
       <개정내용> 공제대상가족 중 8세 이상 20세 이하 자녀가 있는 경우의 세액은
       근로소득 간이세액표의 금액에서 해당 자녀수별로 아래 금액을 공제한 금액으로 함.
       다만, 공제한 금액이 음수인 경우의 세액은 0원으로 함
       - 8세이상 20세이하 자녀가 1명인 경우      : 12,500원
       - 8세이상 20세이하 자녀가 2명인 경우      : 29,160원
       - 8세이상 20세이하 자녀가 3명 이상인 경우 : 29,160원 + 2명 초과 자녀 1명당 25,000원
    -------------------------------------------------------------------------------------*/
    IF p_std_date >= '2024-03-01' THEN
        ---------------------------------------------------------------------------------
        v_CHILD_DEDUCT_AMT := 0;
        ---------------------------------------------------------------------------------
        IF COALESCE(v_EMP.emp35_child_deduct_cnt,0) = 1 THEN
            v_CHILD_DEDUCT_AMT := 12500;
        ELSIF COALESCE(v_EMP.emp35_child_deduct_cnt,0) = 2 THEN
            v_CHILD_DEDUCT_AMT := 29160;
        ELSIF COALESCE(v_EMP.emp35_child_deduct_cnt,0) > 2 THEN
            v_CHILD_DEDUCT_AMT := 29160 + ((v_EMP.emp35_child_deduct_cnt - 2) * 25000);
        END IF;
        ---------------------------------------------------------------------------------
        v_TAX := v_TAX - v_CHILD_DEDUCT_AMT;
        IF v_TAX < 0 THEN v_TAX := 0; END IF;
    END IF;


    -------------------------------------------------------------------------------------
    -- 원천징수비율
    v_WITH_HOLD_RATE := COALESCE(v_EMP.emp35_with_hold_rate,0);
    IF v_WITH_HOLD_RATE = 0 THEN
        ---------------------------------------------------------------------------------
        -- 사원정보에 원천징수비율이 없으면 회사기본정보에서 가져옴
        SELECT pay30_with_hold_rate
          INTO v_WITH_HOLD_RATE
          FROM pay30_basic_setup
         WHERE pay30_company_id = v_EMP.emp35_company_id;
        ---------------------------------------------------------------------------------
        IF v_WITH_HOLD_RATE IS NULL THEN
            v_WITH_HOLD_RATE := 100;
        END IF;
    END IF;

    RAISE NOTICE '===> 원천징수세액 계산) 원천징수비율 : %', v_WITH_HOLD_RATE;
    -------------------------------------------------------------------------------------
    RETURN TRUNC(v_TAX * v_WITH_HOLD_RATE / 100, -1);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
