# f_get_leave_days

## FUNCTION public.f_get_leave_days(p_person_id numeric, p_std_year character varying, p_days_type character varying, p_std_date date, p_appr_chk_yn character varying)

- 반환: `numeric`
- 줄 수: 441

```sql
CREATE OR REPLACE FUNCTION public.f_get_leave_days(p_person_id numeric, p_std_year character varying, p_days_type character varying, p_std_date date, p_appr_chk_yn character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    --v_EMP01                         emp01_person%ROWTYPE;
    v_EMP01                         RECORD;
    v_SYS01                         sys01_company%ROWTYPE;

    c_EMP22                         RECORD;
    c_EMP20                         RECORD;

    v_TOTAL_DAYS                    NUMERIC;
    v_INIT_USE_DAYS                 NUMERIC;
    v_USE_DAYS                      NUMERIC;
    v_REMAIN_DAYS                   NUMERIC;
    v_SPC_DAYS                      NUMERIC;
    v_REWARD_TOTAL_DAYS             NUMERIC;
    v_REWARD_USE_DAYS               NUMERIC;
    v_REWARD_REMAIN_DAYS            NUMERIC;

    v_TMP                           NUMERIC;
    v_CNT                           NUMERIC;
    v_FIX_CNT                       NUMERIC;

    v_YEAR                          NUMERIC;    -- 근무년수
    v_LEAVE_YEAR                    NUMERIC;    -- 연차
    v_LEAVE_MONTH                   NUMERIC;    -- 월차

    v_YEAR_START_DATE               DATE;
    v_YEAR_CLOSE_DATE               DATE;
    v_MONTH_START_DATE              DATE;
    v_MONTH_CLOSE_DATE              DATE;
    v_START_DATE                    DATE;
    v_CLOSE_DATE                    DATE;
    v_REWARD_USE_START_DATE         DATE;
    v_REWARD_USE_OVER_START_DATE    DATE;
-----------------------------------------------------------------------------------------
BEGIN

    -- 사원정보 가져오기
    SELECT *
         , COALESCE(emp02_hire_date_leave_calc, emp01_hire_date)    AS calc_hire_date
      INTO v_EMP01
      FROM emp01_person
           INNER JOIN emp02_others ON emp02_person_id = emp01_person_id
     WHERE emp01_person_id = p_person_id;

    RAISE NOTICE '1. 회사코드 : %', v_EMP01.emp01_company_id;
    RAISE NOTICE '2. 입사일자 : %', v_EMP01.calc_hire_date;

    -- 회사정보 가져오기
    SELECT *
      INTO v_SYS01
      FROM sys01_company
     WHERE sys01_company_id = v_EMP01.emp01_company_id;

    --RAISE NOTICE '3. 결산월 : %', v_SYS01.sys01_leave_month_cd;

    -------------------------------------------------------------------------------------
    -- 월차 시작일(=기준년 시작일)
    v_MONTH_START_DATE  := f_get_close_date(v_EMP01.emp01_company_id,p_std_year,'1');
    -------------------------------------------------------------------------------------
    -- 월차 종료일
    IF p_std_date IS NULL THEN
        v_MONTH_CLOSE_DATE := f_get_close_date(v_EMP01.emp01_company_id,p_std_year,'2');
    ELSE
        v_MONTH_CLOSE_DATE := p_std_date;
    END IF;
    -------------------------------------------------------------------------------------
    --v_YEAR_START_DATE   := v_MONTH_START_DATE + INTERVAL '-1year'                   ; -- 연차 시작일
    --v_YEAR_CLOSE_DATE   := v_MONTH_CLOSE_DATE + INTERVAL '-1year'                   ; -- 연차 종료일
    v_START_DATE        := CAST(p_std_year||'-01-01' AS date)                       ; -- 기준년도 연초(YYYY.01.01)
    v_CLOSE_DATE        := CAST(p_std_year||'-12-31' AS date)                       ; -- 기준년도 연말(YYYY.12.31)

    --RAISE NOTICE '5-1. 연차 시작일 : %', v_YEAR_START_DATE  ;
    --RAISE NOTICE '5-2. 연차 종료일 : %', v_YEAR_CLOSE_DATE  ;
    RAISE NOTICE '5-3. 월차 시작일 : %', v_MONTH_START_DATE ;
    RAISE NOTICE '5-4. 월차 종료일 : %', v_MONTH_CLOSE_DATE ;
    --RAISE NOTICE '5-5. 기준년초    : %', v_START_DATE ;
    --RAISE NOTICE '5-6. 기준년말    : %', v_CLOSE_DATE ;

    -------------------------------------------------------------------------------------
    --(2:사용일수/6:특별휴가일수/7~9:포상휴가) 제외
    IF p_days_type NOT IN ('2','6','7','8','9') THEN

        -- 근무년수계산 = (기준년 시작일 - 입사일자) / 365
        v_YEAR := (v_MONTH_START_DATE - v_EMP01.calc_hire_date) / 365.0;

        RAISE NOTICE '6. 근무년수 : %', v_YEAR;

        ---------------------------------------------------------------------------------
        -- 연차계산
        IF f_get_last_day((v_EMP01.calc_hire_date + INTERVAL '+1year -1month')::DATE) < v_MONTH_CLOSE_DATE THEN
            v_LEAVE_YEAR := f_get_leave_year (v_EMP01.emp01_company_id, v_YEAR);
        ELSE
            v_LEAVE_YEAR := 0;
        END IF;

        RAISE NOTICE '7. 연차 : %', v_LEAVE_YEAR;

        ---------------------------------------------------------------------------------
        -- 월차계산
        v_LEAVE_MONTH := 0;

        -- 근무년수가 1년미만인 경우
        IF v_YEAR < 1 THEN

            RAISE NOTICE '월차 계산 대상!!';

            IF TO_CHAR(v_EMP01.calc_hire_date,'YYYY') = p_std_year THEN
                -- 근무기간 = 월차종료일 - 입사일
                v_LEAVE_MONTH := (DATE_PART('year' , v_MONTH_CLOSE_DATE) - DATE_PART('year' , v_EMP01.calc_hire_date)) * 12
                               + (DATE_PART('month', v_MONTH_CLOSE_DATE) - DATE_PART('month', v_EMP01.calc_hire_date));
            ELSE

                -- 근무기간 = (입사일+1년) - 월차시작일
                --v_LEAVE_MONTH := (DATE_PART('year' , (v_EMP01.calc_hire_date + INTERVAL '1year')::date) - DATE_PART('year' , v_MONTH_START_DATE)) * 12
                --               + (DATE_PART('month', (v_EMP01.calc_hire_date + INTERVAL '1year')::date) - DATE_PART('month', v_MONTH_START_DATE));


            --RAISE NOTICE 'v_MONTH_CLOSE_DATE : %', v_MONTH_CLOSE_DATE;
            --RAISE NOTICE '(입사일+1년) : %', (v_EMP01.calc_hire_date + INTERVAL '1year')::date;


                --(월차종료일(or조회기준일)이 (입사일+1년) 보다 과거일인 경우
                --IF v_MONTH_CLOSE_DATE < (v_EMP01.calc_hire_date + INTERVAL '1year')::date THEN
                IF TO_CHAR(v_MONTH_CLOSE_DATE,'YYYYMM') < TO_CHAR((v_EMP01.calc_hire_date + INTERVAL '1year')::date,'YYYYMM') THEN
                    -- 근무기간 = 월차종료일(or조회기준일) - 월차시작일
                    v_LEAVE_MONTH := (DATE_PART('year' , v_MONTH_CLOSE_DATE) - DATE_PART('year' , v_MONTH_START_DATE)) * 12
                                   + (DATE_PART('month', v_MONTH_CLOSE_DATE) - DATE_PART('month', v_MONTH_START_DATE)) + 1;
                ELSE
                    RAISE NOTICE '여기오지??';
                    -- 근무기간 = (입사일+1년) - 월차시작일
                    v_LEAVE_MONTH := (DATE_PART('year' , (v_EMP01.calc_hire_date + INTERVAL '1year')::date) - DATE_PART('year' , v_MONTH_START_DATE)) * 12
                                   + (DATE_PART('month', (v_EMP01.calc_hire_date + INTERVAL '1year')::date) - DATE_PART('month', v_MONTH_START_DATE));
                END IF;

            RAISE NOTICE '근무기간(v_LEAVE_MONTH) : %', v_LEAVE_MONTH;
            RAISE NOTICE '(입사일+1년) : %', (v_EMP01.calc_hire_date + INTERVAL '1year')::date;

            END IF;

            IF v_LEAVE_MONTH > 11 THEN
                v_LEAVE_MONTH := 11;
            END IF;
        END IF;

        RAISE NOTICE '8. 월차 : %', v_LEAVE_MONTH;

        -- 총일수
        v_TOTAL_DAYS := v_LEAVE_YEAR + v_LEAVE_MONTH ;

        RAISE NOTICE '*** 총일수 : %', v_TOTAL_DAYS;

    END IF;

    -------------------------------------------------------------------------------------
    --(2:사용일수 / 3:잔여일수)
    IF p_days_type IN ('2','3') THEN
        ---------------------------------------------------------------------------------
        SELECT SUM(f_get_leave_count(GREATEST(emp20_start_date, v_MONTH_START_DATE)
                                    ,LEAST   (emp20_close_date, v_MONTH_CLOSE_DATE)
                                    ,emp20_leave_cd, emp20_company_id))
          INTO v_USE_DAYS
          FROM (
                 SELECT emp20_leave_cd
                      , emp20_start_date
                      , emp20_close_date
                      , emp20_company_id
                      , emp20_person_id
                   FROM emp20_leave
                        LEFT OUTER JOIN apr01_appr ON apr01_appr_id = emp20_appr_id
                  WHERE emp20_person_id = p_person_id
                    AND emp20_leave_cd  IN ('01','02','03','06','07','08','09')  --(01:연차휴가/02,03:반차/06,07,08,09:반반차)
                    AND COALESCE(emp20_cancel,'false') != 'true'
                    AND ( ( COALESCE(p_appr_chk_yn,'true') = 'true'             AND
                            COALESCE(apr01_status_cd,'99') NOT IN ('40','99')   ) OR --(40:반려/99:임시저장)
                          ( COALESCE(p_appr_chk_yn,'true') = 'false'            ) )
                  UNION ALL
                 SELECT '01'                emp20_leave_cd
                      , emp24_start_date    emp20_start_date
                      , emp24_close_date    emp20_close_date
                      , emp24_company_id    emp20_company_id
                      , emp01_person_id     emp20_person_id
                   FROM emp24_joint_leave
                        INNER JOIN apr01_appr   ON apr01_appr_id   = emp24_appr_id
                        INNER JOIN emp01_person ON emp01_person_id = p_person_id
                  WHERE emp24_company_id = emp01_company_id
                    AND apr01_status_cd  = '30' /* 상신상태(30:완료) */
                    AND emp01_hire_date  < emp24_start_date
                    AND NOT EXISTS ( SELECT 1
                                       FROM emp28_joint_leave_except
                                      WHERE emp28_joint_leave_id = emp24_joint_leave_id
                                        AND emp28_person_id      = emp01_person_id )
               ) t
         WHERE ( ( emp20_start_date BETWEEN v_MONTH_START_DATE AND v_MONTH_CLOSE_DATE ) OR
                 ( emp20_close_date BETWEEN v_MONTH_START_DATE AND v_MONTH_CLOSE_DATE ) );
        ---------------------------------------------------------------------------------
        IF v_USE_DAYS IS NULL THEN
            v_USE_DAYS := 0;
        END IF;

        RAISE NOTICE '*** 사용일수 : %', v_USE_DAYS;

        ---------------------------------------------------------------------------------
        -- 초기설정 사용일수 반영
        SELECT emp26_use_days
          INTO v_INIT_USE_DAYS
          FROM emp26_init_leave
         WHERE emp26_person_id = p_person_id
           AND emp26_year      = p_std_year;

        RAISE NOTICE '*** 초기설정 사용일수 : %', v_INIT_USE_DAYS;

        v_USE_DAYS := v_USE_DAYS + COALESCE(v_INIT_USE_DAYS,0);

        RAISE NOTICE '*** 최종 사용일수 : %', v_USE_DAYS;

    END IF;

    -------------------------------------------------------------------------------------
    --(3:잔여일수)
    IF p_days_type = '3' THEN
        v_REMAIN_DAYS := v_TOTAL_DAYS - v_USE_DAYS;

        --RAISE NOTICE '*** 잔여일수 : %', v_LEAVE_MONTH;

    END IF;

    -------------------------------------------------------------------------------------
    --(6:특별휴가일수)
    IF p_days_type = '6' THEN
        ---------------------------------------------------------------------------------
        SELECT COALESCE(t1.days,0) + COALESCE(t2.days,0)
          INTO v_SPC_DAYS
          FROM (
                SELECT SUM(f_get_leave_count(GREATEST(emp20_start_date, v_MONTH_START_DATE)
                                            ,LEAST   (emp20_close_date, v_MONTH_CLOSE_DATE)
                                            ,emp20_leave_cd, emp20_company_id)) AS days
                  FROM emp20_leave
                       LEFT OUTER JOIN apr01_appr ON apr01_appr_id = emp20_appr_id
                 WHERE emp20_person_id = p_person_id
                   AND emp20_leave_cd  = '04'   --(04:특별휴가)
                   AND COALESCE(emp20_cancel,'false') != 'true'
                   AND ( ( emp20_start_date BETWEEN v_MONTH_START_DATE AND v_MONTH_CLOSE_DATE ) OR
                         ( emp20_close_date BETWEEN v_MONTH_START_DATE AND v_MONTH_CLOSE_DATE ) )
                   AND COALESCE(apr01_status_cd,'99') NOT IN ('40','99')    --(40:반려/99:임시저장)
               ) t1
             , (
                 SELECT SUM(emp27_leave_count)  AS days
                   FROM emp27_leave_old
                  WHERE emp27_person_id = p_person_id
                    AND emp27_leave_cd  = '04'
                   AND ( ( emp27_start_date BETWEEN v_MONTH_START_DATE AND v_MONTH_CLOSE_DATE ) OR
                         ( emp27_close_date BETWEEN v_MONTH_START_DATE AND v_MONTH_CLOSE_DATE ) )
               ) t2;

        IF v_SPC_DAYS IS NULL THEN
            v_SPC_DAYS := 0;
        END IF;

        --RAISE NOTICE '*** 특별휴가 사용일수 : %', v_SPC_DAYS;

    END IF;
/*
    -------------------------------------------------------------------------------------
    --(7:포상휴가총일수)
    IF p_days_type = '7' THEN
        ---------------------------------------------------------------------------------
        SELECT SUM(emp22_days)
          INTO v_REWARD_TOTAL_DAYS
          FROM emp22_etc_leave
               INNER JOIN emp23_etc_leave_person ON emp23_etc_leave_id = emp22_etc_leave_id
               INNER JOIN apr01_appr             ON apr01_appr_id      = emp22_appr_id
         WHERE emp22_leave_cd  = '05'   -- 휴가구분(05:포상휴가)
           AND emp22_start_date <= v_CLOSE_DATE
           AND emp22_close_date >= v_START_DATE
           AND apr01_status_cd = '30'   -- 문서결재상태(30:완료)
           AND emp23_person_id = p_person_id;

        --RAISE NOTICE '*** 포상휴가 총일수 : %', v_REWARD_TOTAL_DAYS;
        IF v_REWARD_TOTAL_DAYS IS NULL THEN
            v_REWARD_TOTAL_DAYS := 0;
        END IF;
    END IF;

    -------------------------------------------------------------------------------------
    --(8:포상휴가사용일수 / 9:포상휴가잔여일수(미사용기간종료일수 차감))
    IF p_days_type IN ('8','9') THEN
        ---------------------------------------------------------------------------------
        v_REWARD_TOTAL_DAYS          := 0 ;
        v_REWARD_USE_DAYS            := 0 ;
        v_REWARD_REMAIN_DAYS         := 0 ;
        v_CNT                        := 0 ;
        v_FIX_CNT                    := 0 ;
        v_REWARD_USE_START_DATE      := NULL;
        v_REWARD_USE_OVER_START_DATE := NULL;
        ---------------------------------------------------------------------------------
        FOR c_EMP22 IN ( SELECT *
                           FROM emp22_etc_leave
                                INNER JOIN emp23_etc_leave_person ON emp23_etc_leave_id = emp22_etc_leave_id
                                INNER JOIN apr01_appr             ON apr01_appr_id      = emp22_appr_id
                          WHERE emp23_person_id = p_person_id
                            AND emp22_leave_cd  = '05'   -- 휴가구분(05:포상휴가)
                            AND apr01_status_cd = '30'   -- 문서결재상태(30:완료)
                            AND emp22_start_date <= v_CLOSE_DATE
                            AND emp22_close_date >= v_START_DATE
                          ORDER BY emp22_close_date
        ) LOOP
            -----------------------------------------------------------------------------
            -- 총일수
            v_REWARD_TOTAL_DAYS := v_REWARD_TOTAL_DAYS + c_EMP22.emp22_days ;
            -----------------------------------------------------------------------------
            -- 사용시작일 SET
            IF v_REWARD_USE_START_DATE IS NULL THEN
                v_REWARD_USE_START_DATE := c_EMP22.emp22_start_date;
            END IF;
            -----------------------------------------------------------------------------
            RAISE NOTICE ' ';
            RAISE NOTICE ' 포상휴가 사용기간            : % ~ %', c_EMP22.emp22_start_date, c_EMP22.emp22_close_date;
            RAISE NOTICE ' v_REWARD_USE_START_DATE      : %', v_REWARD_USE_START_DATE;
            RAISE NOTICE ' v_REWARD_USE_OVER_START_DATE : %', v_REWARD_USE_OVER_START_DATE;
            RAISE NOTICE ' v_CNT                        : %', v_CNT;

            IF v_CNT < 0 THEN -- 잔여일수 오버
                IF (v_REWARD_USE_OVER_START_DATE BETWEEN c_EMP22.emp22_start_date AND c_EMP22.emp22_close_date) THEN -- 다른포상휴가 사용가능 기간이랑 겹치는 경우
                    RAISE NOTICE ' ==> 잔여차감 이월 IN : 잔여일수가 오버됐는데 다른포상휴가 사용가능 기간이랑 겹쳐지는 경우 거기서 차감';
                    v_CNT := c_EMP22.emp22_days + v_CNT;
                ELSE
                    IF p_days_type = '9' THEN
                        RAISE NOTICE ' ==> 차감가능한 다른 포상휴가 사용가능 기간이 없음. 더이상 체크 없이 오버일수 리턴';
                        RETURN v_CNT;
                    END IF;
                END IF;
            ELSE
                RAISE NOTICE ' ==> 일반적 IN';
                v_FIX_CNT               := v_FIX_CNT + v_CNT;
                v_CNT                   := c_EMP22.emp22_days;
                v_REWARD_USE_START_DATE := c_EMP22.emp22_start_date;
            END IF;

            RAISE NOTICE '*** 포상휴가 일수 : 원래일수(%) / CNT(%) / FIX_CNT(%)', c_EMP22.emp22_days, v_CNT, v_FIX_CNT;
            RAISE NOTICE '---------------------------------------------------------------';

            -----------------------------------------------------------------------------
            FOR c_EMP20 IN ( SELECT *
                               FROM emp20_leave
                                    LEFT  JOIN apr01_appr     ON apr01_appr_id = emp20_appr_id
                                    INNER JOIN sys12_calendar ON ( sys12_company_id  = emp20_company_id                           AND
                                                                   sys12_working_yn  = 'true'                                     AND
                                                                  (sys12_day::date BETWEEN emp20_start_date AND emp20_close_date) )
                              WHERE emp20_person_id = c_EMP22.emp23_person_id
                                AND emp20_leave_cd  = c_EMP22.emp22_leave_cd
                                AND sys12_day BETWEEN v_REWARD_USE_START_DATE AND c_EMP22.emp22_close_date
                                AND COALESCE(emp20_cancel,'false') != 'true'
                                AND ( ( p_appr_chk_yn = 'true'                              AND
                                        COALESCE(apr01_status_cd, '99') NOT IN ('99','40')  ) OR
                                      ( p_appr_chk_yn != 'true'                             ) )
                              ORDER BY sys12_day
            ) LOOP
                -------------------------------------------------------------------------

                RAISE NOTICE '****** 포상휴가 사용일자 : %', c_EMP20.sys12_day;

                -------------------------------------------------------------------------
                v_REWARD_USE_DAYS := v_REWARD_USE_DAYS + 1;
                v_CNT             := v_CNT             - 1;
                -------------------------------------------------------------------------
                v_REWARD_USE_START_DATE := c_EMP20.sys12_day + INTERVAL '1day';
                IF v_CNT >= 0 THEN
                    v_REWARD_USE_OVER_START_DATE := v_REWARD_USE_START_DATE;
                END IF;
                -------------------------------------------------------------------------
            END LOOP;
            -----------------------------------------------------------------------------
            RAISE NOTICE '*** 다음 사용휴가 체크 시작일  : %', v_REWARD_USE_START_DATE;
            RAISE NOTICE '*** 잔여휴가 오버 체크 시작일  : %', v_REWARD_USE_OVER_START_DATE;
            RAISE NOTICE '*** 잔여 일수(계산용/확정일수) : % / %', v_CNT, v_FIX_CNT ;

            -- 잔여일수가 남아있는데 사용기간종료일이 지났다면 잔여일수 없음
            IF c_EMP22.emp22_close_date <= f_today() AND v_CNT > 0 THEN
                v_CNT             := 0;
                RAISE NOTICE '*** 잔여일수가 남아있는데 사용기간종료일이 지났다면 잔여일수 없음 : 잔여일수(v_CNT) <= 0';
            END IF;

        END LOOP;

        v_REWARD_REMAIN_DAYS := v_FIX_CNT + v_CNT;

        RAISE NOTICE '===============================================================';
        RAISE NOTICE '======> 포상휴가 총   일수 : %', v_REWARD_TOTAL_DAYS;
        RAISE NOTICE '======> 포상휴가 사용 일수 : %', v_REWARD_USE_DAYS;
        RAISE NOTICE '======> 포상휴가 잔여 일수 : %', v_REWARD_REMAIN_DAYS;

    END IF;
*/
    -------------------------------------------------------------------------------------
    --(7:포상휴가총일수 / 8:포상휴가사용일수 / 9:포상휴가잔여일수(미사용기간종료일수 차감))
    IF p_days_type IN ('7','8','9') THEN
        ---------------------------------------------------------------------------------
        SELECT SUM(emp22_days)
             , SUM(COALESCE(emp20.use_days,0))
             , SUM(emp22_days) - SUM(COALESCE(emp20.use_days,0))
          INTO v_REWARD_TOTAL_DAYS
             , v_REWARD_USE_DAYS
             , v_REWARD_REMAIN_DAYS
          FROM emp22_etc_leave
               INNER JOIN emp23_etc_leave_person ON emp23_etc_leave_id = emp22_etc_leave_id
               INNER JOIN apr01_appr             ON apr01_appr_id      = emp22_appr_id
               LEFT  JOIN LATERAL ( SELECT SUM(emp20_leave_count) use_days
                                      FROM emp20_leave
                                     WHERE emp20_etc_leave_id  = emp22_etc_leave_id
                                       AND emp20_person_id     = p_person_id ) emp20 ON TRUE
         WHERE emp22_leave_cd  = '05'   -- 휴가구분(05:포상휴가)
           AND emp22_start_date <= v_CLOSE_DATE
           AND emp22_close_date >= v_START_DATE
           AND apr01_status_cd = '30'   -- 문서결재상태(30:완료)
           AND emp23_person_id = p_person_id;
    END IF;

    -------------------------------------------------------------------------------------
    IF    p_days_type = '1' THEN RETURN v_TOTAL_DAYS;           -- 1:총일수(연월차)
    ELSIF p_days_type = '2' THEN RETURN v_USE_DAYS;             -- 2:사용일수(연월차)
    ELSIF p_days_type = '3' THEN RETURN v_REMAIN_DAYS;          -- 3:잔여일수(연월차)
    ELSIF p_days_type = '4' THEN RETURN v_LEAVE_YEAR;           -- 4:연차일수
    ELSIF p_days_type = '5' THEN RETURN v_LEAVE_MONTH;          -- 5:월차일수
    ELSIF p_days_type = '6' THEN RETURN v_SPC_DAYS;             -- 6:특별휴가일수
    ELSIF p_days_type = '7' THEN RETURN v_REWARD_TOTAL_DAYS;    -- 7:포상휴가총일수
    ELSIF p_days_type = '8' THEN RETURN v_REWARD_USE_DAYS;      -- 8:포상휴가사용일수
    ELSIF p_days_type = '9' THEN RETURN v_REWARD_REMAIN_DAYS;   -- 9:포상휴가잔여일수(미사용기간종료일수 차감)
    END IF;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'ERROR : %', SQLERRM;
    RETURN NULL;
END;
$function$
```
