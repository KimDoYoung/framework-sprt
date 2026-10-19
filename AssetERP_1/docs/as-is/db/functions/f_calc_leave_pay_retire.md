# f_calc_leave_pay_retire

## FUNCTION public.f_calc_leave_pay_retire(p_person_id numeric, p_proc_type character varying)

- 반환: `character varying`
- 줄 수: 255

```sql
CREATE OR REPLACE FUNCTION public.f_calc_leave_pay_retire(p_person_id numeric, p_proc_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY10             pay10_month%ROWTYPE;
    v_PAY11             pay11_month_item%ROWTYPE;
    v_PAY15             pay15_retire_leave%ROWTYPE;

    v_EMP               RECORD;
    
    v_CALC_DATE         DATE;
    v_START_DATE        DATE;
    v_CNT               NUMERIC := 0;

    v_YEAR_PAY          NUMERIC;
    v_DAY_PAY           NUMERIC;
    v_LEAVE_PAY         NUMERIC;

    v_REM_DAYS          NUMERIC;
    v_YEAR_DAYS         NUMERIC;
    v_YEAR_DAYS1        NUMERIC;
    v_YEAR_DAYS2        NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        퇴직정산 연차휴가수당 생성
    ************************************************************************************/

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
    -- 기생성내역 삭제
    -------------------------------------------------------------------------------------
    v_errMsg := '퇴직정산내역 생성전 연차휴가 삭제 실패 ['||v_PAY10.pay10_month_id||']';
    DELETE
      FROM pay11_month_item
     WHERE pay11_month_id = v_PAY10.pay10_month_id
       AND pay11_item_cd = '123' ; --(123:연차수당)

    v_errMsg := '퇴직정산내역 생성전 연차휴가 계산상세 삭제 실패 ['||v_PAY10.pay10_month_id||']';
    DELETE
      FROM pay15_retire_leave
     WHERE pay15_month_id = v_PAY10.pay10_month_id;

    -------------------------------------------------------------------------------------
    -- 연차휴가수당 생성
    -------------------------------------------------------------------------------------
    IF p_proc_type = 'P' THEN
        ---------------------------------------------------------------------------------
        -- 사원정보
        v_errMsg := '사원정보 가져오기 실패 ['||v_PAY10.pay10_person_id||']';
        SELECT *
             , CAST(f_get_empTrans(v_PAY10.pay10_person_id, null, 'retire_date') AS DATE)   AS emp01_retire_date
             , COALESCE(emp02_hire_date_leave_calc, emp01_hire_date)                        AS emp01_calc_hire_date
          INTO v_EMP
          FROM emp01_person
               INNER JOIN emp02_others ON emp02_person_id = emp01_person_id
         WHERE emp01_person_id = v_PAY10.pay10_person_id ;

        IF v_EMP.emp01_retire_date IS NULL THEN
            v_errMsg := '퇴직자가 아닙니다';
            RAISE USING ERRCODE = '90001';
        END IF;

        ---------------------------------------------------------------------------------
        -- 입사년차 연차일수 계산상세 Default SET
        v_PAY15.pay15_month_id      := v_PAY10.pay10_month_id   ;
        v_PAY15.pay15_calc_std_type := '2'                      ; --(1:입사일기준/2:회계일기준)

        ---------------------------------------------------------------------------------
        -- 기본연봉 = 비과세항목, 연장수당 포함하여 계산
        ---------------------------------------------------------------------------------
        SELECT pay01_annual_pay
          INTO v_YEAR_PAY
          FROM pay01_annual
               INNER JOIN apr01_appr ON apr01_appr_id = pay01_appr_id
         WHERE pay01_person_id   = v_PAY10.pay10_person_id
           AND pay01_start_date <= v_EMP.emp01_retire_date
           AND apr01_status_cd = '30'
         ORDER BY pay01_start_date DESC
         LIMIT 1;

        RAISE NOTICE '기본연봉 : %', v_YEAR_PAY;

        ---------------------------------------------------------------------------------
        -- 월봉 = 기본연봉 / 12개월
        -- 시급 = 월봉 / 209시간
        -- 일당 = 시급 * 8시간
        ---------------------------------------------------------------------------------
        v_DAY_PAY := TRUNC(v_YEAR_PAY / 12 / 209 * 8);

        RAISE NOTICE '일당 : %', v_DAY_PAY;

        ---------------------------------------------------------------------------------
        -- 잔여휴가일수 = 퇴직년도 잔여일수 + (입사기준연차일수 - 회계년도기준연차일수)
        ---------------------------------------------------------------------------------
        v_errMsg := '퇴직년도 잔여휴가 가져오기 실패(f_get_leave_days)';
        /*v_REM_DAYS := f_get_leave_days ( v_PAY10.pay10_person_id
                                       , TO_CHAR(v_EMP.emp01_retire_date,'YYYY')
                                       , '3'                                        --(3:잔여일수(연월차))
                                       , v_EMP.emp01_retire_date
                                       , 'true'                                     --(true:임시저장,반려는 사용일수에서 제외/false:임시저장도 사용일수에 포함)
                                       );*/
        v_REM_DAYS := f_get_leave_days2 ( v_PAY10.pay10_person_id
                                        , TO_CHAR(v_EMP.emp01_retire_date,'YYYY')
                                        , '3'                                        --(3:잔여일수(연월차))
                                        , v_EMP.emp01_retire_date
                                        , 'true'                                     --(true:임시저장,반려는 사용일수에서 제외/false:임시저장도 사용일수에 포함)
                                        );

        v_errMsg := '입사일기준 연차일수 가져오기 실패(f_get_leave_days_hire)';
        v_YEAR_DAYS1 := f_get_leave_days_hire ( v_PAY10.pay10_person_id
                                               , v_EMP.emp01_retire_date
                                               , v_PAY10.pay10_month_id
                                               );

        v_errMsg := '회계일기준 연차일수 가져오기 실패(f_get_close_date)';
        ---------------------------------------------------------------------------------
        v_CALC_DATE := f_get_close_date ( v_PAY10.pay10_company_id
                                        , TO_CHAR(v_EMP.emp01_calc_hire_date,'YYYY')
                                        , '2'   --(2:휴가결산종료일)
                                        );
        ---------------------------------------------------------------------------------
        v_YEAR_DAYS2 := 0;

        RAISE NOTICE '###========================== 회계일기준 연차일수 계산 시작~!!!';

        -- 입사년도 발생월차
        /*v_YEAR_DAYS2 := f_get_leave_days ( v_PAY10.pay10_person_id
                                         , TO_CHAR(v_EMP.emp01_hire_date,'YYYY')
                                         , '1'                                        --(1:총일수(연월차))
                                         , CASE WHEN v_CALC_DATE > v_EMP.emp01_retire_date THEN v_EMP.emp01_retire_date ELSE NULL END
                                         , 'true'                                     --(true:임시저장,반려는 사용일수에서 제외/false:임시저장도 사용일수에 포함)
                                         );
        RAISE NOTICE '###----- 회계일기준 연차일수 계산 - 입사년도(%) 발생월차 : %', TO_CHAR(v_EMP.emp01_hire_date,'YYYY'), v_YEAR_DAYS2;*/

        v_START_DATE := v_EMP.emp01_calc_hire_date + INTERVAL '+1month';

        LOOP
            v_CNT := v_CNT + 1;
            -----------------------------------------------------------------------------
            IF TO_CHAR(v_CALC_DATE,'YYYY') >= TO_CHAR(v_EMP.emp01_retire_date,'YYYY') THEN
                v_YEAR_DAYS := f_get_leave_days ( v_PAY10.pay10_person_id
                                                , TO_CHAR(v_EMP.emp01_retire_date,'YYYY')
                                                , '1'                                        --(1:총일수(연월차))
                                                , v_EMP.emp01_retire_date
                                                , 'true'                                     --(true:임시저장,반려는 사용일수에서 제외/false:임시저장도 사용일수에 포함)
                                                );
                -------------------------------------------------------------------------
                -- 퇴직년도 연차일수 계산상세 생성
                v_PAY15.pay15_retire_leave_id   := f_create_seq()   ;
                v_PAY15.pay15_year_cnt          := v_CNT            ;
                v_PAY15.pay15_start_date        := v_START_DATE     ;
                v_PAY15.pay15_close_date        := CASE WHEN v_CNT=1 THEN v_EMP.emp01_retire_date ELSE v_CALC_DATE END;
                v_PAY15.pay15_leave_days        := v_YEAR_DAYS      ;

                INSERT INTO pay15_retire_leave VALUES (v_PAY15.*);

                RAISE NOTICE '###----- 퇴직년도 연차(월차)일수 : %', v_YEAR_DAYS;

                v_YEAR_DAYS2 := v_YEAR_DAYS2 + v_YEAR_DAYS;
                EXIT;
            -----------------------------------------------------------------------------
            ELSE
                v_YEAR_DAYS := f_get_leave_days ( v_PAY10.pay10_person_id
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

        RAISE NOTICE '### 퇴직년도 잔여연차 : %', v_REM_DAYS;

        IF (v_YEAR_DAYS1 - v_YEAR_DAYS2) > 0 THEN
            v_REM_DAYS := v_REM_DAYS + (v_YEAR_DAYS1 - v_YEAR_DAYS2);
        END IF;

        RAISE NOTICE '### 입사일기준 연차 : %', v_YEAR_DAYS1;
        RAISE NOTICE '### 회계일기준 연차 : %', v_YEAR_DAYS2;
        RAISE NOTICE '### 최종 잔여연차   : %', v_REM_DAYS;

        ---------------------------------------------------------------------------------
        -- 연차수당 = 일당 * 잔여연차휴가일수
        ---------------------------------------------------------------------------------
        IF v_REM_DAYS > 0 THEN
            -----------------------------------------------------------------------------
            v_LEAVE_PAY := v_DAY_PAY * v_REM_DAYS;
            RAISE NOTICE '연차수당 : %', v_LEAVE_PAY;

            -----------------------------------------------------------------------------
            -- 항목상세 생성
            v_errMsg := '퇴직정산 연차수당 항목 생성실패 ['||v_PAY10.pay10_month_id||']['||v_PAY10.pay10_date||']';
            -----------------------------------------------------------------------------
            v_PAY11 := NULL;
            -----------------------------------------------------------------------------
            v_PAY11.pay11_month_item_id := f_create_seq()           ;
            v_PAY11.pay11_month_id      := v_PAY10.pay10_month_id   ;
            v_PAY11.pay11_item_type     := '1'                      ;
            v_PAY11.pay11_item_cd       := '123'                    ; --(123:연차수당)
            v_PAY11.pay11_item_amt      := v_LEAVE_PAY              ;
            -----------------------------------------------------------------------------
            v_errMsg := '퇴직정산 연차수당 항목 생성실패(INSERT)';
            INSERT INTO pay11_month_item VALUES (v_PAY11.*);
        END IF;

    END IF;
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
