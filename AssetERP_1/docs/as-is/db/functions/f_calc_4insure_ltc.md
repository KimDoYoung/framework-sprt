# f_calc_4insure_ltc

## FUNCTION public.f_calc_4insure_ltc(p_person_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 99

```sql
CREATE OR REPLACE FUNCTION public.f_calc_4insure_ltc(p_person_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY31             RECORD;
    c_CALC              RECORD;
    v_CALC_START_DATE   DATE;
    v_STD_DATE          DATE;
    v_FIRST_PAY_DATE    DATE;

    v_MONTH_AMT         NUMERIC := 0;
    v_HI_AMT            NUMERIC := 0;
    v_LTC_AMT           NUMERIC := 0;
    v_LTC_PAY_AMT       NUMERIC := 0;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 장기요양보험(Long Term Care Insure) = 월건강보험료 * 보험료율, 십원미만 절사 
    -------------------------------------------------------------------------------------
    -- 최근 신고정보(PAY31) 가져오기
    v_errMsg := '최근 신고정보(PAY31) 가져오기 실패(calc_4insure_hi_month_amt) ['||p_person_id||']['||p_std_date||']';
    CALL calc_4insure_hi_month_amt(p_person_id, p_std_date, v_PAY31, v_FIRST_PAY_DATE, v_MONTH_AMT);
    IF COALESCE(v_MONTH_AMT,0) = 0 THEN
        RETURN 0;
    END IF;

    -------------------------------------------------------------------------------------
    -- 신고후 최초납부일인 경우 소급처리
    -------------------------------------------------------------------------------------
    IF v_FIRST_PAY_DATE = p_std_date THEN
        -------------------------------------------------------------------------------------
        -- (1:신규등록) 계산기간 : 취득월 ~ 납부월
        IF v_PAY31.pay31_insure_apply_cd = '1' THEN
            ---------------------------------------------------------------------------------
            IF TO_CHAR(v_PAY31.pay31_init_date,'DD') = '01' THEN -- 입사일이 1일이면 당월부터 납부
                v_CALC_START_DATE := v_PAY31.pay31_init_date;
            ELSE -- 입사일이 1일이 아니면 익월부터 납부
                v_CALC_START_DATE := v_PAY31.pay31_init_date + INTERVAL '+1month';
            END IF;
        -------------------------------------------------------------------------------------
        ELSE --(2:보수변동/3:착오정정/4:보수총액신고) 계산기간 : 변경적용월 ~ 납부월
            ---------------------------------------------------------------------------------
            v_CALC_START_DATE := CAST(v_PAY31.pay31_apply_month||'.01' AS DATE);
            -------------------------------------------------------------------------
            -- 기납부액GET
            SELECT COALESCE(SUM(pay11_item_amt),0)
              INTO v_LTC_PAY_AMT
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id = p_person_id
               AND pay10_date BETWEEN CAST(v_PAY31.pay31_apply_month||'.01' AS DATE) AND p_std_date - 1
               AND pay11_item_cd = '230'; --(230:장기요양보험)

            RAISE NOTICE '기납부 장기요양보험료 : [%]', v_LTC_PAY_AMT;

            v_LTC_AMT := v_LTC_PAY_AMT * -1;
        END IF;

        RAISE NOTICE '계산기간 : % ~ %', v_CALC_START_DATE, p_std_date;
        RAISE NOTICE '구간별 장기요양보험료 계산 시작 ------------------------------------';

        -------------------------------------------------------------------------------------
        FOR c_CALC IN ( SELECT sys12_day
                             , f_get_rate('21',sys12_day::date) hi_rate
                             , f_get_rate('22',sys12_day::date) ltc_rate
                          FROM sys12_calendar
                         WHERE sys12_company_id = 0
                           AND sys12_day        = DATE_TRUNC('month', sys12_day)
                           AND sys12_day  BETWEEN DATE_TRUNC('month', v_CALC_START_DATE) AND p_std_date
        ) LOOP
            ---------------------------------------------------------------------------------
            -- 건강보험료
            v_HI_AMT := TRUNC(v_MONTH_AMT * c_CALC.hi_rate, -1);

            -- 장기요양보험 = 월건강보험료 * 보험료율, 십원미만 절사 
            v_LTC_AMT := v_LTC_AMT + TRUNC(v_HI_AMT * c_CALC.ltc_rate, -1);

            RAISE NOTICE '기준월[%] : 건강보험료[%](적용이율:%) * 적용보험료율[%] = 장기요양보험[%]', TO_CHAR(c_CALC.sys12_day,'YYYY.MM'), v_HI_AMT, c_CALC.hi_rate, c_CALC.ltc_rate, TRUNC(v_HI_AMT * c_CALC.ltc_rate, -1);

        END LOOP;
    -------------------------------------------------------------------------------------
    ELSE
        v_HI_AMT  := TRUNC(v_MONTH_AMT * f_get_rate('21',p_std_date), -1);
        v_LTC_AMT := TRUNC(v_HI_AMT    * f_get_rate('22',p_std_date), -1);
    END IF;

    RAISE NOTICE '장기요양보험 : %', v_LTC_AMT;

    RETURN v_LTC_AMT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
