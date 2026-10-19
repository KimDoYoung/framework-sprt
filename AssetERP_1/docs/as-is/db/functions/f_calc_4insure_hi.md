# f_calc_4insure_hi

## FUNCTION public.f_calc_4insure_hi(p_person_id numeric, p_std_date date, p_adj_except_yn boolean)

- 반환: `numeric`
- 줄 수: 151

```sql
CREATE OR REPLACE FUNCTION public.f_calc_4insure_hi(p_person_id numeric, p_std_date date, p_adj_except_yn boolean)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY31             RECORD; --pay31_insure_apply%ROWTYPE;
    v_PAY29             pay29_other_setup%ROWTYPE;

    v_MONTH_AMT         NUMERIC;
    v_HI_AMT            NUMERIC;
    v_HI_PAY_AMT        NUMERIC;
    v_HI_DIFF_AMT       NUMERIC;

    v_PAY_PERIOD        NUMERIC;
    v_FIRST_PAY_DATE    DATE;

    c_CALC              RECORD;
    v_CALC_START_DATE   DATE;
    v_CALC_CLOSE_DATE   DATE;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        건강보험
    -------------------------------------------------------------------------------------
     1. 건강보험 납부월액 = 평균 소득월액(신고한 보수총액/근무월수) * 보험료율(3.545%), 십원미만 절사
        ※ 당해년도 신고한 월소득액이 있는경우(연봉변동시, 신규입사시, 비과세급여 변동시)
          평균 소득월액이 아닌 최근신고한 금액으로 계산
     2. 월보험료 상하한액(2023년 기준)
        - 하한액 : 19,780원(보수월액 하한 279,266원) / 2
        - 상한액 : 7,822,560원(보수월액 상한 110,332,300원) / 2
     3. 보수총액 매년 3월 10일까지 신고하여 매년 4월부터 다음해 3월까지 적용
     4. 신고 후 정산금액(추가부과 또는 환급)은 4월분 보험료에 합산고지하며, 10회 이내의 범위에서 분할납부 신청 가능
     5. 적용일 1일을 기준으로 보험료가 부과됨
        - 입사일(적용일)이 1일      : 당월 납부, 만약 신고완료일이 15일 이후면 다음달에 합산되어 부과
        - 입사일(적용일)이 2일~말일 : 당월 미납부(납부대상 아님)
    ************************************************************************************/
    
    -- 건강보험 계산용 소득월액
    v_errMsg := '건강보험 계산용 소득월액 계산 실패(calc_4insure_hi_month_amt) ['||p_person_id||']['||p_std_date||']';
    CALL calc_4insure_hi_month_amt(p_person_id, p_std_date, v_PAY31, v_FIRST_PAY_DATE, v_MONTH_AMT);
    IF COALESCE(v_MONTH_AMT,0) = 0 THEN
        RETURN 0;
    END IF;

    RAISE NOTICE '소득월액 : [%]', v_MONTH_AMT;

    -------------------------------------------------------------------------------------
    -- 건강보험료 = 소득월액 * 요율, 십원미만 절사
    -------------------------------------------------------------------------------------
    v_HI_AMT := TRUNC(v_MONTH_AMT * f_get_rate('21', p_std_date), -1);
    
    RAISE NOTICE '당월 건강보험료 : [%]', v_HI_AMT;

    -------------------------------------------------------------------------------------
    -- 월보험료 상하한액 적용
    -------------------------------------------------------------------------------------
    v_errMsg := '건강보험 월보험료 상하한액 가져오기 실패 ['||p_std_date||']';
    SELECT *
      INTO v_PAY29
      FROM pay29_other_setup
     WHERE pay29_start_date <= p_std_date
     ORDER BY pay29_start_date DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    -- 상한액적용
    IF COALESCE(v_PAY29.pay29_hi_max_amt,0) != 0        AND
       COALESCE(v_PAY29.pay29_hi_max_amt,0) < v_HI_AMT  THEN
        v_HI_AMT := v_PAY29.pay29_hi_max_amt;
    END IF;
    -------------------------------------------------------------------------------------
    -- 하한액적용
    IF COALESCE(v_PAY29.pay29_hi_min_amt,0) != 0        AND
       COALESCE(v_PAY29.pay29_hi_min_amt,0) >= v_HI_AMT THEN
        v_HI_AMT := v_PAY29.pay29_hi_min_amt;
    END IF;

    IF p_adj_except_yn THEN
        ---------------------------------------------------------------------------------
        -- 신고후 최초납부일인 경우 소급처리
        ---------------------------------------------------------------------------------
        IF v_FIRST_PAY_DATE = p_std_date THEN
            v_HI_DIFF_AMT := 0;
            -----------------------------------------------------------------------------
            -- (1:신규등록) 계산기간 : 취득월 ~ 납부월
            IF v_PAY31.pay31_insure_apply_cd = '1' THEN
                -------------------------------------------------------------------------
                IF TO_CHAR(v_PAY31.pay31_init_date,'DD') = '01' THEN -- 입사일이 1일이면 당월부터 납부
                    v_CALC_START_DATE := v_PAY31.pay31_init_date;
                    v_CALC_CLOSE_DATE := p_std_date;
                ELSE -- 입사일이 1일이 아니면 익월부터 납부
                    v_CALC_START_DATE := v_PAY31.pay31_init_date + INTERVAL '+1month';
                    v_CALC_CLOSE_DATE := p_std_date;
                END IF;
            -----------------------------------------------------------------------------
            ELSE --(2:보수변동/3:착오정정/4:보수총액신고) 계산기간 : 변경적용월 ~ 납부월
                -------------------------------------------------------------------------
                v_CALC_START_DATE := CAST(v_PAY31.pay31_apply_month||'.01' AS DATE);
                v_CALC_CLOSE_DATE := p_std_date;
                -------------------------------------------------------------------------
                -- 기납부액GET
                SELECT COALESCE(SUM(pay11_item_amt),0)
                  INTO v_HI_PAY_AMT
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                 WHERE pay10_person_id = p_person_id
                   AND pay10_date BETWEEN CAST(v_PAY31.pay31_apply_month||'.01' AS DATE) AND p_std_date - 1
                   AND pay11_item_cd = '220'; --(220:건강보험)

                RAISE NOTICE '기납부 건강보험료 : [%]', v_HI_PAY_AMT;

                v_HI_DIFF_AMT := v_HI_PAY_AMT * -1;
            END IF;

            v_PAY_PERIOD  := f_get_datedif(v_CALC_START_DATE, v_CALC_CLOSE_DATE, 'M');

            IF v_PAY_PERIOD >= 1 THEN
                -------------------------------------------------------------------------
                -- 소급기간의 적용율로 계산
                FOR c_CALC IN ( SELECT f_get_rate('21',sys12_day::date) rate
                                  FROM sys12_calendar
                                 WHERE sys12_company_id = 0
                                   AND sys12_day        = DATE_TRUNC('month', sys12_day)
                                   AND sys12_day  BETWEEN DATE_TRUNC('month', v_CALC_START_DATE) AND v_CALC_CLOSE_DATE + INTERVAL '-1month'
                ) LOOP
                    ---------------------------------------------------------------------
                    v_HI_DIFF_AMT := v_HI_DIFF_AMT + TRUNC(v_MONTH_AMT * c_CALC.rate, -1);
                END LOOP;
            END IF;

            RAISE NOTICE '소급금액 : [%]', v_HI_DIFF_AMT;

            -----------------------------------------------------------------------------
            -- 소급분반영 당월 납부금액
            v_HI_AMT := v_HI_AMT + v_HI_DIFF_AMT;

            RAISE NOTICE '소급반영 건강보험 당월납부액 : [%]', v_HI_AMT;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_HI_AMT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
    RETURN 0;
END;
$function$
```
