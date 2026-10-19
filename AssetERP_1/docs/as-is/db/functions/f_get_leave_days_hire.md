# f_get_leave_days_hire

## FUNCTION public.f_get_leave_days_hire(p_person_id numeric, p_std_date date, p_month_id numeric)

- 반환: `numeric`
- 줄 수: 132

```sql
CREATE OR REPLACE FUNCTION public.f_get_leave_days_hire(p_person_id numeric, p_std_date date, p_month_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    --v_EMP01                         emp01_person%ROWTYPE;
    v_PAY15                         pay15_retire_leave%ROWTYPE;

    v_COMPANY_ID                    NUMERIC;
    v_HIRE_DATE                     DATE;

    v_CALC_DATE                     DATE;
    v_CLOSE_DATE                    DATE;
    v_CNT                           NUMERIC := 1 ;

    v_YEAR                          NUMERIC      ;  -- 근무년수
    v_LEAVE_YEAR                    NUMERIC := 0 ;  -- 연차
    v_LEAVE_YEAR_SUM                NUMERIC      ;
-----------------------------------------------------------------------------------------
BEGIN
    --===================================================================================
    --
    -- 입사일기준의 연차휴가 계산
    --
    --===================================================================================

    -- 사원정보 가져오기
    SELECT emp01_company_id, COALESCE(emp02_hire_date_leave_calc, emp01_hire_date)
      INTO v_COMPANY_ID, v_HIRE_DATE
      FROM emp01_person
           INNER JOIN emp02_others ON emp02_person_id = emp01_person_id
     WHERE emp01_person_id = p_person_id;

    RAISE NOTICE '입사일자 : %', v_HIRE_DATE;

    -------------------------------------------------------------------------------------
    -- 입사년차 연차일수 계산상세 Default SET
    -------------------------------------------------------------------------------------
    v_PAY15.pay15_month_id          := p_month_id               ;
    v_PAY15.pay15_calc_std_type     := '1'                      ; --(1:입사일기준/2:회계일기준)

    -------------------------------------------------------------------------------------
    -- 입사 0년차 월차계산
    -------------------------------------------------------------------------------------
    v_CALC_DATE  := v_HIRE_DATE + INTERVAL '+1year -1month';

    IF p_std_date < v_CALC_DATE THEN
        ---------------------------------------------------------------------------------
        v_CALC_DATE := p_std_date;
        ---------------------------------------------------------------------------------
        -- 입사일이 말일인 경우
        IF f_get_last_day(v_HIRE_DATE) = v_HIRE_DATE THEN
            IF TO_CHAR(p_std_date,'DD') < TO_CHAR(f_get_last_day(p_std_date),'DD') AND
               TO_CHAR(p_std_date,'DD') < TO_CHAR(v_HIRE_DATE,'DD')                THEN
                v_CALC_DATE := p_std_date + INTERVAL '-1month';
            END IF;
        ---------------------------------------------------------------------------------
        -- 입사일이 말일이 아닌 경우
        ELSIF TO_CHAR(p_std_date,'DD') < TO_CHAR(v_HIRE_DATE,'DD') THEN
            RAISE NOTICE '입사일이 말일이 아니면서 입사일[%]보다 전일[%]이다', TO_CHAR(v_HIRE_DATE,'DD'), TO_CHAR(p_std_date,'DD');
            v_CALC_DATE := p_std_date + INTERVAL '-1month';
       END IF;
    END IF;

    v_LEAVE_YEAR := f_get_datedif(v_HIRE_DATE, v_CALC_DATE::date, 'M');
    RAISE NOTICE '--- 입사 1년미만 월차일수 : %', v_LEAVE_YEAR;

    v_LEAVE_YEAR_SUM := v_LEAVE_YEAR;

    -------------------------------------------------------------------------------------
    -- 입사년차 연차일수 계산상세 생성
    v_PAY15.pay15_retire_leave_id   := f_create_seq()                       ;
    v_PAY15.pay15_year_cnt          := 1                                    ;
    v_PAY15.pay15_start_date        := v_HIRE_DATE + INTERVAL '+1month'     ;
    v_PAY15.pay15_close_date        := v_CALC_DATE                          ;
    v_PAY15.pay15_leave_days        := v_LEAVE_YEAR                         ;

    INSERT INTO pay15_retire_leave VALUES (v_PAY15.*);

    -------------------------------------------------------------------------------------
    -- 입사 N년차 월차계산
    -------------------------------------------------------------------------------------
    v_CALC_DATE  := v_HIRE_DATE;
    v_CLOSE_DATE := CAST(TO_CHAR(p_std_date,'YYYY')||TO_CHAR(v_CALC_DATE,'MMDD') AS DATE) + INTERVAL '-1day';
    IF v_CLOSE_DATE < p_std_date THEN
        v_CLOSE_DATE := v_CLOSE_DATE + INTERVAL '+1year';
    END IF;

    RAISE NOTICE '계산시작일(입사일)       : %', v_CALC_DATE;
    RAISE NOTICE '계산종료일(v_CLOSE_DATE) : %', v_CLOSE_DATE;

    -------------------------------------------------------------------------------------
    LOOP
        ---------------------------------------------------------------------------------
        v_CALC_DATE  := v_CALC_DATE + INTERVAL '+1year';
        EXIT WHEN v_CALC_DATE > v_CLOSE_DATE;
        ---------------------------------------------------------------------------------
        v_CNT := v_CNT + 1;
        RAISE NOTICE '--- 입사 %년차 계산기준일(v_CALC_DATE) : %', v_CNT, v_CALC_DATE;
        ---------------------------------------------------------------------------------
        -- 근무년수계산 = (입사N연차 - 입사일자) / 365
        v_YEAR := (v_CALC_DATE - v_HIRE_DATE) / 365.0;
        RAISE NOTICE '--- 입사 %년차 근무년수 : %', v_CNT, v_YEAR;
        ---------------------------------------------------------------------------------
        -- 연차일수 계산
        v_LEAVE_YEAR     := f_get_leave_year (v_COMPANY_ID, v_YEAR);
        RAISE NOTICE '--- 입사 %년차 연차일수 : %', v_CNT, v_LEAVE_YEAR;
        ---------------------------------------------------------------------------------
        -- 입사 N년차 연차일수 계산상세 생성
        v_PAY15.pay15_retire_leave_id   := f_create_seq()                       ;
        v_PAY15.pay15_year_cnt          := v_CNT                                ;
        v_PAY15.pay15_start_date        := v_CALC_DATE                          ;
        v_PAY15.pay15_close_date        := v_CALC_DATE + INTERVAL '+1year -1day';
        v_PAY15.pay15_leave_days        := v_LEAVE_YEAR                         ;

        INSERT INTO pay15_retire_leave VALUES (v_PAY15.*);

        ---------------------------------------------------------------------------------
        v_LEAVE_YEAR_SUM := v_LEAVE_YEAR_SUM + v_LEAVE_YEAR;
        RAISE NOTICE '------------------------------------------------';
    END LOOP;

    RAISE NOTICE '--- 전체 연차일수 : %', v_LEAVE_YEAR_SUM;
    -------------------------------------------------------------------------------------
    RETURN v_LEAVE_YEAR_SUM;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
