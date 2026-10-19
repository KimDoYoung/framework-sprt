# f_calc_rem_leave_days

## FUNCTION public.f_calc_rem_leave_days(p_person_id numeric, p_std_date date)

- 반환: `character varying`
- 줄 수: 179

```sql
CREATE OR REPLACE FUNCTION public.f_calc_rem_leave_days(p_person_id numeric, p_std_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY15             pay15_retire_leave%ROWTYPE;
    v_PAY16             pay16_retire_rem_leave%ROWTYPE;

    v_EMP               RECORD;
    
    v_CALC_DATE         DATE;
    v_START_DATE        DATE;
    v_CNT               NUMERIC := 0;

    v_REM_DAYS          NUMERIC;
    v_YEAR_DAYS         NUMERIC;
    v_YEAR_DAYS1        NUMERIC;
    v_YEAR_DAYS2        NUMERIC;

    v_PY_MONTH_DAYS     NUMERIC;
    v_PY_USE_DAYS       NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        잔여 연차일수 계산
    ************************************************************************************/
    -------------------------------------------------------------------------------------
    -- 기생성내역 삭제
    v_errMsg := '퇴직정산내역 생성전 연차휴가 계산상세 삭제 실패 ['||p_person_id||']';
    DELETE
      FROM pay15_retire_leave
     WHERE pay15_month_id = p_person_id;

    DELETE
      FROM pay16_retire_rem_leave
     WHERE pay16_person_id = p_person_id;

    -------------------------------------------------------------------------------------
    v_errMsg := '사원정보 가져오기 실패 ['||p_person_id||']';
    SELECT *
         , COALESCE(emp02_hire_date_leave_calc, emp01_hire_date) AS calc_hire_date
      INTO v_EMP
      FROM emp01_person
           INNER JOIN emp02_others ON emp02_person_id = emp01_person_id
     WHERE emp01_person_id = p_person_id ;

    -------------------------------------------------------------------------------------
    -- 입사년차 연차일수 계산상세 생성
    -------------------------------------------------------------------------------------
    v_PAY15.pay15_month_id      := p_person_id   ;
    v_PAY15.pay15_calc_std_type := '2'                      ; --(1:입사일기준/2:회계일기준)

    -- 잔여휴가일수 = 기준년도 잔여일수 + (입사기준연차일수 - 회계년도기준연차일수)
    v_errMsg := '퇴직년도 잔여휴가 가져오기 실패(f_get_leave_days2)';
    v_REM_DAYS := f_get_leave_days2 ( p_person_id
                                    , TO_CHAR(p_std_date,'YYYY')
                                    , '3'           --(3:잔여일수(연월차))
                                    , p_std_date
                                    , 'true'        --(true:임시저장,반려는 사용일수에서 제외/false:임시저장도 사용일수에 포함)
                                    );

    -- 전년도 미사용월차 추가 = 전년도 발생월차 - 전년도 사용휴가
    v_PY_MONTH_DAYS := f_get_leave_days ( p_person_id
                                        , CAST(CAST(TO_CHAR(p_std_date,'YYYY') AS NUMERIC)-1 AS VARCHAR)
                                        , '5'
                                        , NULL
                                        , 'true'
                                        );

    v_PY_USE_DAYS := f_get_leave_days ( p_person_id
                                      , CAST(CAST(TO_CHAR(p_std_date,'YYYY') AS NUMERIC)-1 AS VARCHAR)
                                      , '2'
                                      , NULL
                                      , 'true'
                                      );
    v_REM_DAYS := v_REM_DAYS + GREATEST((v_PY_MONTH_DAYS - v_PY_USE_DAYS), 0);


    v_errMsg := '입사일기준 연차일수 가져오기 실패(f_get_leave_days_hire)';
    v_YEAR_DAYS1 := f_get_leave_days_hire ( p_person_id
                                          , p_std_date
                                          , p_person_id
                                          );

    v_errMsg := '회계일기준 연차일수 가져오기 실패(f_get_close_date)';
    v_CALC_DATE := f_get_close_date ( v_EMP.emp01_company_id
                                    , TO_CHAR(v_EMP.calc_hire_date,'YYYY')
                                    , '2'   --(2:휴가결산종료일)
                                    );

    RAISE NOTICE '###========================== 회계일기준 연차일수 계산 시작~!!!';

    v_YEAR_DAYS2 := 0;
    v_START_DATE := v_EMP.calc_hire_date + INTERVAL '+1month';

    LOOP
        v_CNT := v_CNT + 1;
        -----------------------------------------------------------------------------
        IF TO_CHAR(v_CALC_DATE,'YYYY') >= TO_CHAR(p_std_date,'YYYY') THEN
            v_YEAR_DAYS := f_get_leave_days ( p_person_id
                                            , TO_CHAR(p_std_date,'YYYY')
                                            , '1'           --(1:총일수(연월차))
                                            , p_std_date
                                            , 'true'        --(true:임시저장,반려는 사용일수에서 제외/false:임시저장도 사용일수에 포함)
                                            );
            -------------------------------------------------------------------------
            -- 퇴직년도 연차일수 계산상세 생성
            v_PAY15.pay15_retire_leave_id   := f_create_seq()   ;
            v_PAY15.pay15_year_cnt          := v_CNT            ;
            v_PAY15.pay15_start_date        := v_START_DATE     ;
            v_PAY15.pay15_close_date        := CASE WHEN v_CNT=1 THEN p_std_date ELSE v_CALC_DATE END;
            v_PAY15.pay15_leave_days        := v_YEAR_DAYS      ;

            INSERT INTO pay15_retire_leave VALUES (v_PAY15.*);

            RAISE NOTICE '###----- 퇴직년도 연차(월차)일수 : %', v_YEAR_DAYS;

            v_YEAR_DAYS2 := v_YEAR_DAYS2 + v_YEAR_DAYS;
            EXIT;
        -----------------------------------------------------------------------------
        ELSE
            v_YEAR_DAYS := f_get_leave_days ( p_person_id
                                            , TO_CHAR(v_CALC_DATE,'YYYY')
                                            , '1'                                        --(1:총일수(연월차))
                                            , NULL
                                            , 'true'                                     --(true:임시저장,반려는 사용일수에서 제외/false:임시저장도 사용일수에 포함)
                                            );
            -------------------------------------------------------------------------
            -- 연차일수 계산상세 생성
            v_PAY15.pay15_retire_leave_id   := f_create_seq()   ;
            v_PAY15.pay15_year_cnt          := v_CNT            ;
            v_PAY15.pay15_start_date        := v_START_DATE     ;
            v_PAY15.pay15_close_date        := v_CALC_DATE      ;
            v_PAY15.pay15_leave_days        := v_YEAR_DAYS      ;

            INSERT INTO pay15_retire_leave VALUES (v_PAY15.*);

            RAISE NOTICE '###-----  %년도 연차(월차)일수 : %', TO_CHAR(v_CALC_DATE,'YYYY'), v_YEAR_DAYS;
        END IF;
        -----------------------------------------------------------------------------
        v_YEAR_DAYS2 := v_YEAR_DAYS2 + v_YEAR_DAYS;
        v_START_DATE := v_CALC_DATE + INTERVAL '+1day' ;
        v_CALC_DATE  := v_CALC_DATE + INTERVAL '+1year';
        -----------------------------------------------------------------------------
    END LOOP;

    -------------------------------------------------------------------------------------
    -- 잔여휴가 정보 Insert
    v_PAY16.pay16_retire_rem_leave_id   := f_create_seq()               ;
    v_PAY16.pay16_person_id             := p_person_id                  ;
    v_PAY16.pay16_retire_date           := p_std_date                   ;
    v_PAY16.pay16_rem_days              := v_REM_DAYS                   ;

    v_PAY16.pay16_add_days              := v_YEAR_DAYS1 - v_YEAR_DAYS2  ;
    IF v_PAY16.pay16_add_days < 0 THEN
        v_PAY16.pay16_add_days := 0;
    END IF;

    v_PAY16.pay16_final_days  := v_PAY16.pay16_rem_days + v_PAY16.pay16_add_days;

    INSERT INTO pay16_retire_rem_leave VALUES (v_PAY16.*);

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
