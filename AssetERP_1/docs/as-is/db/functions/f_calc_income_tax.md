# f_calc_income_tax

## FUNCTION public.f_calc_income_tax(p_pay_month_id numeric)

- 반환: `numeric`
- 줄 수: 267

```sql
CREATE OR REPLACE FUNCTION public.f_calc_income_tax(p_pay_month_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY10             pay10_month%ROWTYPE;

    v_MONTH_PAY         NUMERIC := 0    ; -- 월급여액(과세항목)
    v_BONUS_PAY         NUMERIC := 0    ; -- 상여금
    v_BONUS_AVG         NUMERIC := 0    ; -- 월평균상여금
    v_BONUS_AVG_PERIOD  NUMERIC := 0    ; -- 월평균상여금 계산기간

    v_TAX_PERIOD        NUMERIC := NULL ; -- 산정세액 계산기간

    v_SUM_INCOME_TAX    NUMERIC := 0    ; -- 기납부 소득세 합계
    v_PRE_INCOME_TAX    NUMERIC := 0    ; -- 전납부 소득세 합계
    v_INCOME_TAX        NUMERIC := 0    ; -- 소득세

    v_CALC_START_DATE   DATE;
    v_CALC_CLOSE_DATE   DATE;
    v_PRE_BONUS_DATE    DATE;
    v_HIRE_DATE         DATE;

    v_CNT               NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '원천징수(근로소득세) 계산 실패 ['||p_pay_month_id||']';
    -------------------------------------------------------------------------------------
    -- 급여정보 GET
    -------------------------------------------------------------------------------------
    v_errMsg := '급여정보 가져오기 실패 ['||p_pay_month_id||']';
    SELECT *
      INTO v_PAY10
      FROM pay10_month
     WHERE pay10_month_id = p_pay_month_id;

    -------------------------------------------------------------------------------------
    -- 월급여액 GET
    -------------------------------------------------------------------------------------
    v_errMsg := '월급여액 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
    SELECT SUM(CASE WHEN pay11_item_cd != '130' THEN COALESCE(pay11_item_amt,0) ELSE 0 END)
         , SUM(CASE WHEN pay11_item_cd  = '130' THEN COALESCE(pay11_item_amt,0) ELSE 0 END)  --(130:상여금)
      INTO v_MONTH_PAY
         , v_BONUS_PAY
      FROM pay10_month
           INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
           INNER JOIN pay20_item       ON pay20_item_cd  = pay11_item_cd
     WHERE pay10_month_id     = v_PAY10.pay10_month_id
       AND pay20_item_type    = '1'     --(1:급여지급항목)
       AND pay20_non_tax_type = '1';    --(1:과세/2:비과세)

    IF v_MONTH_PAY IS NULL THEN
        v_MONTH_PAY := 0;
    END IF;

    RAISE NOTICE '월급여액[%], 상여금[%]', v_MONTH_PAY, v_BONUS_PAY;

    -------------------------------------------------------------------------------------
    -- 상여가 포함되어 있다면 [월평균상여] 계산
    -- 월평균상여 = 상여금 / 대상기간
    -- (대상기간 : 전 상여지급 다음월(해당연도에 상여지급이 없었다면 1월) ~ 현 상여지급 월)
    -------------------------------------------------------------------------------------
    IF COALESCE(v_BONUS_PAY,0) > 0 THEN
        ---------------------------------------------------------------------------------
        -- 전 상여 지급일자 GET
        v_errMsg := '전 상여 지급일자 가져오기 실패 ['||v_PAY10.pay10_person_id||']['||v_PAY10.pay10_date||']';
        SELECT pay10_date
          INTO v_PRE_BONUS_DATE
          FROM pay10_month
               INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
         WHERE pay10_person_id  = v_PAY10.pay10_person_id
           AND pay10_date       < v_PAY10.pay10_date
           AND pay11_item_cd    = '130'    --(130:상여금)
           AND pay11_item_amt  != 0
         ORDER BY pay10_date DESC
         LIMIT 1;

        RAISE NOTICE '전 상여 지급일자[%]', v_PRE_BONUS_DATE;

        ---------------------------------------------------------------------------------
        -- 입사일 가져오기
        v_errMsg := '입사일 가져오기 실패 ['||v_PAY10.pay10_person_id||']';
        SELECT emp01_hire_date
          INTO v_HIRE_DATE
          FROM emp01_person
         WHERE emp01_person_id = v_PAY10.pay10_person_id;

        ---------------------------------------------------------------------------------
        -- 대상기간 시작일자
        ---------------------------------------------------------------------------------
        -- 대상기간 시작일 = 당해년도 1월 1일 
        v_CALC_START_DATE := (TO_CHAR(v_PAY10.pay10_date,'YYYY')||'-01-01')::date;

        IF v_HIRE_DATE > v_CALC_START_DATE THEN
            v_CALC_START_DATE := v_HIRE_DATE;
        END IF;

        IF COALESCE(v_PRE_BONUS_DATE, v_CALC_START_DATE) > v_CALC_START_DATE THEN
            v_CALC_START_DATE := date_trunc('month', v_PRE_BONUS_DATE + INTERVAL '1month');
        ELSE
            -- 세액기간 개월수(산정세액)
            IF DATE_TRUNC('year', v_HIRE_DATE) = DATE_TRUNC('year', v_CALC_START_DATE) THEN -- 당해년도 입사자인 경우
                SELECT f_get_datedif(MIN(pay10_date), v_PAY10.pay10_date, 'M') + 1
                  INTO v_TAX_PERIOD
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                 WHERE pay10_person_id = v_PAY10.pay10_person_id
                   AND pay10_date BETWEEN v_CALC_START_DATE AND v_PAY10.pay10_date
                   AND pay11_item_cd               = '250'  --(250:소득세)
                   AND COALESCE(pay11_item_amt,0) != 0;
            END IF;
        END IF;
        ---------------------------------------------------------------------------------
        -- 대상기간 종료일자
        ---------------------------------------------------------------------------------
        v_CALC_CLOSE_DATE := v_PAY10.pay10_date;
        ---------------------------------------------------------------------------------
        -- 대상기간 개월수(월평균상여기간)
        v_BONUS_AVG_PERIOD := f_get_datedif(v_CALC_START_DATE, v_CALC_CLOSE_DATE, 'M') + 1;
        
        IF v_TAX_PERIOD IS NULL THEN
            v_TAX_PERIOD := v_BONUS_AVG_PERIOD;
        END IF;

        RAISE NOTICE '대상기간 개월수[%], (% ~ %)', v_BONUS_AVG_PERIOD, v_CALC_START_DATE, v_CALC_CLOSE_DATE;
        RAISE NOTICE '세액기간 개월수[%]', v_TAX_PERIOD;

        ---------------------------------------------------------------------------------
        -- 월평균상여
        ---------------------------------------------------------------------------------
        v_BONUS_AVG := TRUNC(v_BONUS_PAY / v_BONUS_AVG_PERIOD);

        RAISE NOTICE '월평균상여[%]', v_BONUS_AVG;

        ---------------------------------------------------------------------------------
        -- 월급여액이 없다면 직전급여액의 '110:기본급'만 GET
        IF v_MONTH_PAY = 0 THEN
            v_errMsg := '전급여액 가져오기 실패 ['||v_PAY10.pay10_person_id||']';
            /* (2023.07.28 CYY - '110:기본급'만 가져오기로 함)
            SELECT SUM(CASE WHEN pay20_item_type = '1' THEN COALESCE(pay11_item_amt,0) ELSE 0 END)
                 , SUM(CASE WHEN pay20_item_type = '2' THEN (CASE WHEN (pay10_date BETWEEN date_trunc('month',v_PAY10.pay10_date) AND v_PAY10.pay10_date) THEN 0
                                                                  ELSE COALESCE(pay11_item_amt,0) END) ELSE 0 END)
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                   INNER JOIN pay20_item       ON pay20_item_cd  = pay11_item_cd
             WHERE pay10_month_id     = ( SELECT pay10_month_id
                                            FROM pay10_month
                                                 INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                                           WHERE pay10_person_id = v_PAY10.pay10_person_id
                                             AND pay10_date     <= v_PAY10.pay10_date
                                             AND pay11_item_cd   = '110'  --(110:기본급)
                                             AND pay11_item_amt != 0
                                           ORDER BY pay10_date DESC
                                           LIMIT 1 )
               AND ( ( pay20_item_type      = '1'   AND     --(1:급여지급항목)
                       pay20_non_tax_type   = '1'   ) OR    --(1:과세/2:비과세)
                     ( pay20_item_type      = '2'   AND     --(2:급여공제항목)
                       pay11_item_cd        = '250' ) )     --(250:소득세)
               AND pay11_item_cd     != '130';  --(130:상여금) */

            SELECT pay11_item_amt
                 , f_get_simple_income_tax ( pay10_person_id, v_PAY10.pay10_date, pay11_item_amt)
              INTO v_MONTH_PAY
                 , v_PRE_INCOME_TAX
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id = v_PAY10.pay10_person_id
               AND pay10_date     <= v_PAY10.pay10_date
               AND pay11_item_cd   = '110'  --(110:기본급)
               AND pay11_item_amt != 0
               AND pay10_month_id != v_PAY10.pay10_month_id
             ORDER BY pay10_date DESC
             LIMIT 1;

            RAISE NOTICE '월급여액이 없음. 직전 급여액(기본급만)/소득세 가져오기 [%, %]', v_MONTH_PAY, v_PRE_INCOME_TAX;

            -- 당월에 급여가 먼저 지급되고, 이후에 상여가 지급되는 경우 기납부세액에 당월께 이미 포함되었으므로 'v_PRE_INCOME_TAX'은 0으로 SET
            SELECT COUNT(*)
              INTO v_CNT
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id  = v_PAY10.pay10_person_id
               AND TO_CHAR(pay10_date,'YYYYMM') = TO_CHAR(v_CALC_CLOSE_DATE,'YYYYMM')
               AND pay10_date       < v_CALC_CLOSE_DATE
               AND pay10_month_id  != v_PAY10.pay10_month_id
               AND pay11_item_cd    = '250' ;    --(250:소득세)

            IF v_CNT != 0 THEN
                v_PRE_INCOME_TAX := 0;
            END IF;

        ELSE
            v_PRE_INCOME_TAX := 0;
        END IF;

        -- 대상기간의 기납부 소득세 합계 GET
        SELECT SUM(COALESCE(pay11_item_amt,0))
          INTO v_SUM_INCOME_TAX
          FROM pay10_month
               INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
         WHERE pay10_person_id  = v_PAY10.pay10_person_id
           AND pay10_date BETWEEN v_CALC_START_DATE AND v_CALC_CLOSE_DATE-1
           AND pay10_month_id  != v_PAY10.pay10_month_id
           AND pay11_item_cd    = '250' ;    --(250:소득세)

        RAISE NOTICE '대상기간의 기납부 소득세 [%]', v_SUM_INCOME_TAX;

        IF v_SUM_INCOME_TAX IS NULL THEN
            v_SUM_INCOME_TAX := 0 ;
        END IF;

        -- 월소득액 = 월급여액 + 월평균상여
        v_MONTH_PAY := v_MONTH_PAY + v_BONUS_AVG;

        RAISE NOTICE '월소득액[%] = 월급여액 + 월평균상여[%]', v_MONTH_PAY, v_BONUS_AVG;

        -- 월소득액의 소득세
        v_errMsg := '소득세 가져오기 실패(상여포함) ['||v_MONTH_PAY||']['||v_PAY10.pay10_person_id||']['||v_PAY10.pay10_date||']';
        v_INCOME_TAX := f_get_simple_income_tax ( v_PAY10.pay10_person_id   -- 사원ID
                                                , v_PAY10.pay10_date        -- 기준일
                                                , v_MONTH_PAY               -- 월소득액
                                                );

        RAISE NOTICE '{월급여액 + 월평균상여}의 간이세액표상의 소득세 [%]', v_INCOME_TAX;

        RAISE NOTICE '월소득액의 소득세 * 산정세액 대상기간 [%]', v_INCOME_TAX * v_TAX_PERIOD;
        RAISE NOTICE '기납부소득세                          [%]', v_SUM_INCOME_TAX + v_PRE_INCOME_TAX;

        -- 상여금의 소득세 = 월소득액의 소득세 * 산정세액 대상기간 - 기납부소득세
        v_INCOME_TAX := v_INCOME_TAX * v_TAX_PERIOD - (v_SUM_INCOME_TAX + v_PRE_INCOME_TAX);

        -- 소득세의 환급은 연말정산때만 해당된다고 함. (-)금액 발생시 0으로 리턴 (2023.07.28 CYY)
        IF v_INCOME_TAX < 0 THEN
            v_INCOME_TAX := 0;
        END IF;

        RAISE NOTICE '상여금의 소득세 [%]', v_INCOME_TAX;

    -------------------------------------------------------------------------------------
    ELSE
        IF v_MONTH_PAY = 0 THEN
            RETURN 0;
        END IF;

        -- 월소득액의 소득세
        v_errMsg := '소득세 가져오기 실패 ['||v_MONTH_PAY||']['||v_PAY10.pay10_person_id||']['||v_PAY10.pay10_date||']';
        v_INCOME_TAX := f_get_simple_income_tax ( v_PAY10.pay10_person_id   -- 사원ID
                                                , v_PAY10.pay10_date        -- 기준일
                                                , v_MONTH_PAY               -- 월소득액
                                                );

        RAISE NOTICE '월소득액의 소득세 [%]', v_INCOME_TAX;

    END IF;
    -------------------------------------------------------------------------------------
    RETURN TRUNC(v_INCOME_TAX, -1);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
    RETURN 0;
END;
$function$
```
