# f_get_std_date_new

## FUNCTION public.f_get_std_date_new(p_deadline_id numeric, p_stddate date, p_company_id numeric)

- 반환: `date`
- 줄 수: 280

```sql
CREATE OR REPLACE FUNCTION public.f_get_std_date_new(p_deadline_id numeric, p_stddate date, p_company_id numeric)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_SCH03     SCH03_DEADLINE_NEW%ROWTYPE;
v_date      DATE;
v_last_day  DATE;
v_day       NUMERIC;
v_weekDay   NUMERIC;
v_month     NUMERIC;
v_errMsg    VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_date := CAST(p_stdDate AS DATE);

    -------------------------------------------------------------------------------------
    -- 주기정보 가져오기
    v_errMsg := '주기정보 가져오기 실패['||p_deadline_id||']' ;
    SELECT *
      INTO v_SCH03
      FROM SCH03_DEADLINE_NEW
     WHERE SCH03_DEADLINE_ID = p_deadline_id;

    IF v_SCH03.SCH03_DEADLINE_ID IS NULL THEN
        RAISE NOTICE 'NO_DATA_FOUND';
        v_errMsg := '주기정보 가져오기 실패 - NO DATA FOUND ['||p_deadline_id||']' ;
        RAISE;
    END IF;

    -------------------------------------------------------------------------------------
    -- 주기계산코드
    -------------------------------------------------------------------------------------
    -- (03 : 매일 / 10 : 즉시)
    IF v_SCH03.SCH03_CYCLE_CALC_TYPE IN ('03','10') THEN
        RAISE NOTICE '주기계산코드 => 매일/즉시 (%)', v_SCH03.SCH03_CYCLE_CALC_TYPE;
        RETURN v_date;

    -------------------------------------------------------------------------------------
    -- (01 : 일자지정)
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '01' THEN
        RAISE NOTICE '주기계산코드 => 일자지정(01)';
        RETURN v_SCH03.SCH03_FIX_DATE;

    -------------------------------------------------------------------------------------
    -- (02 : 수시기간설정) => 예, 3영업일 이내
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '02' THEN
        RAISE NOTICE '주기계산코드 => 수시기간설정(02).... %, %', v_SCH03.SCH03_PERIOD_CD, v_SCH03.SCH03_NUM1;

        IF v_SCH03.SCH03_PERIOD_CD = '2' THEN --(2:영업일 이내)
            v_date := f_get_biz_date(p_company_id, v_date, CAST(v_SCH03.SCH03_NUM1 AS VARCHAR));
        ELSE
            IF v_SCH03.SCH03_PERIOD_CD = '1' THEN --(1:일 이내)
                v_date := f_get_date(v_date, v_SCH03.SCH03_NUM1);
            ELSIF v_SCH03.SCH03_PERIOD_CD = '3' THEN --(3:주)
                v_date := f_get_date(v_date, v_SCH03.SCH03_NUM1 * 7);
            ELSIF v_SCH03.SCH03_PERIOD_CD = '4' THEN --(4:개월)
                v_date := v_date + v_SCH03.SCH03_NUM1 * INTERVAL '1month';
            ELSIF v_SCH03.SCH03_PERIOD_CD = '5' THEN --(5:년)
                v_date := v_date + v_SCH03.SCH03_NUM1 * INTERVAL '1year';
            END IF;
        END IF;

    -------------------------------------------------------------------------------------
    -- (04 : 주별주기설정) => 예, 2주마다 월요일
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '04' THEN
        RAISE NOTICE '주기계산코드 => 주별주기설정(04)';

        v_weekday := CAST(to_char(v_date::timestamp,'D') AS NUMERIC);
        RAISE NOTICE '기준일의 요일 => %', v_weekDay;

        CASE v_SCH03.SCH03_DAY_WEEK_CD
            WHEN '02' THEN -- 월요일
                IF v_weekDay <= 2 THEN
                    v_date := date_trunc('week', v_date)+ INTERVAL '0days';
                ELSE
                    v_date := date_trunc('week', v_date)+ INTERVAL '7days';
                END IF;
            WHEN '03' THEN -- 화요일
                IF v_weekDay <= 3 THEN
                    v_date := date_trunc('week', v_date)+ INTERVAL '1days';
                ELSE
                    v_date := date_trunc('week', v_date)+ INTERVAL '8days';
                END IF;
            WHEN '04' THEN -- 수요일
                IF v_weekDay <= 4 THEN
                    v_date := date_trunc('week', v_date)+ INTERVAL '2days';
                ELSE
                    v_date := date_trunc('week', v_date)+ INTERVAL '9days';
                END IF;
            WHEN '05' THEN -- 목요일
                IF v_weekDay <= 5 THEN
                    v_date := date_trunc('week', v_date)+ INTERVAL '3days';
                ELSE
                    v_date := date_trunc('week', v_date)+ INTERVAL '10days';
                END IF;
            WHEN '06' THEN -- 금요일
                IF v_weekDay <= 6 THEN
                    v_date := date_trunc('week', v_date)+ INTERVAL '4days';
                ELSE
                    v_date := date_trunc('week', v_date)+ INTERVAL '11days';
                END IF;
            ELSE
                RAISE NOTICE 'SCH03_DAY_WEEK_CD 예외코드 발생 %', v_SCH03.SCH03_DAY_WEEK_CD;
        END CASE;

    -------------------------------------------------------------------------------------
    -- (05 : 주기설정1) 예, 매월 말일
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '05' THEN
        RAISE NOTICE '주기계산코드 => 주기설정1(05)';

        -- YYYY/MM SET
        v_date := date_trunc('month', v_date);

        -- DD SET
        IF v_SCH03.SCH03_DAY_CD = '31' THEN --(31:말일)
            v_date := f_get_last_day(v_date);
        ELSE
            IF v_SCH03.SCH03_DAY_CD = 'AA' THEN
                v_day := v_SCH03.SCH03_NUM2;
            ELSE
                v_day := CAST(v_SCH03.SCH03_DAY_CD AS NUMERIC);
            END IF;

            IF v_SCH03.SCH03_DAY_TYPE_CD = '3' THEN -- (3:영업일 => 기간조회)
                v_date := f_get_biz_date(p_company_id, v_date-1, CAST(v_day AS VARCHAR));
            ELSIF v_SCH03.SCH03_DAY_TYPE_CD = '2' THEN -- (2:일 이내 => 기간조회)
                v_date := f_get_date(v_date-1, v_day);
            ELSE --(1:일)
                --v_last_day := f_get_last_day(v_date);
                v_date := TO_CHAR(f_get_date(v_date, v_day),'YYYYMM')||v_SCH03.SCH03_DAY_CD;
                /*IF v_date > v_last_day THEN
                    v_date := v_last_day;
                END IF;*/
            END IF;
        END IF;

    -------------------------------------------------------------------------------------
    -- (06 : 주기설정2) 예, 매월 셋째주 수요일
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '06' THEN
        RAISE NOTICE '주기계산코드 => 주기설정2(06)';
        
        -- YYYY/MM SET
        v_date := date_trunc('month', v_date);
        /*IF v_SCH03.SCH03_MONTH_CD = '2' AND COALESCE(v_SCH03.SCH03_NUM1,1) != 1 THEN --(2:직접입력)
            v_date := v_date + v_SCH03.SCH03_NUM1 * INTERVAL '1month';
        END IF;*/

        -- DD SET
        v_date := f_get_week_date (v_date, v_SCH03.SCH03_WEEK_CD, v_SCH03.SCH03_DAY_WEEK_CD);

    -------------------------------------------------------------------------------------
    -- (07 : 분기의 말일)
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '07' THEN
        RAISE NOTICE '주기계산코드 => 분기의 말일(07)';
        v_date := f_get_last_day(CAST(f_get_quarter_date(v_date,'1') + INTERVAL '3month' AS DATE));

    -------------------------------------------------------------------------------------
    -- (08 : 반기의 말일)
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '08' THEN
        RAISE NOTICE '주기계산코드 => 반기의 말일(08)';
        v_date := f_get_last_day(CAST(f_get_quarter_date(v_date,'2') + INTERVAL '6month' AS DATE));

    -------------------------------------------------------------------------------------
    -- (09 : 년의 말일)
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE IN ('09') THEN
        RAISE NOTICE '주기계산코드 => 년의 말일(%)',v_SCH03.SCH03_CYCLE_CALC_TYPE;
        v_date := CAST(TO_CHAR(v_date, 'YYYY')||'1231' AS DATE);

    -------------------------------------------------------------------------------------
    -- (11 : 분기/반기 주기설정1) 예, "2개월 이내", "분기 후 익월 10일"
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '11' THEN
        RAISE NOTICE '주기계산코드 => 분기/반기 주기설정1 (%)...%', v_SCH03.SCH03_CYCLE_CALC_TYPE, v_SCH03.SCH03_CYCLE_CD;

        -- YYYY SET
        IF v_SCH03.SCH03_CYCLE_CD = '04' THEN --(04:분기별)
            v_date := f_get_quarter_date(v_date,'1');
        ELSIF v_SCH03.SCH03_CYCLE_CD = '05' THEN --(05:반기별)
            v_date := f_get_quarter_date(v_date,'2');
        ELSIF v_SCH03.SCH03_CYCLE_CD = '06' THEN --(06:연별)
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '-1day';
        END IF;

        RAISE NOTICE 'v_date 1 : %',v_date;

        -- MM SET
        IF v_SCH03.SCH03_MONTH_CD = '2' THEN --(2:익월)
            v_month := 1;
        ELSE
            v_month := COALESCE(v_SCH03.SCH03_NUM1,0);
        END IF;
        IF COALESCE(v_SCH03.SCH03_MONTH_TYPE_CD,'2') = '2' THEN --(2:개월 이내)
            v_date := v_date + v_month * INTERVAL '1month';
        ELSE
            v_date := date_trunc('month',v_date) + v_month * INTERVAL '1month';
            IF COALESCE(v_SCH03.SCH03_DAY_TYPE_CD,'1') IN ('2','3') THEN --(일구분이 기간조회인 경우)
                v_date := v_date - 1;
            END IF;
        END IF;

        RAISE NOTICE 'v_date 2 : %',v_date;

        -- DD SET
        IF v_SCH03.SCH03_DAY_CD IS NOT NULL THEN
            IF v_SCH03.SCH03_DAY_CD = '31' THEN --(31:말일)
                v_date := f_get_last_day(v_date);
            ELSE
                /*IF v_SCH03.SCH03_CYCLE_CD = '06' THEN --(06:연별)
                    v_date := v_date + INTERVAL '-1month';
                END IF;*/

                IF v_SCH03.SCH03_DAY_CD = 'AA' THEN
                    v_day := v_SCH03.SCH03_NUM2;
                ELSE
                    v_day := CAST(v_SCH03.SCH03_DAY_CD AS NUMERIC);
                END IF;

                RAISE NOTICE 'v_day : %....%',v_day, v_SCH03.SCH03_DAY_TYPE_CD;

                IF v_SCH03.SCH03_DAY_TYPE_CD = '3' THEN -- (3:영업일 => 기간조회)
                    v_date := f_get_biz_date(p_company_id, v_date, CAST(v_day AS VARCHAR));
                ELSIF v_SCH03.SCH03_DAY_TYPE_CD = '2' THEN -- (2:일 이내 => 기간조회)

                    RAISE NOTICE 'v_date , v_day : %, %',v_date, v_day;
                    
                    v_date := f_get_date(v_date, v_day);

                    RAISE NOTICE 'v_date 3 : %',v_date;

                
                ELSE --(1:일)
                    --v_last_day := f_get_last_day(v_date);
                    v_date := TO_CHAR(f_get_date(v_date, v_day),'YYYYMM')||v_SCH03.SCH03_DAY_CD;
                    /*IF v_date > v_last_day THEN
                        v_date := v_last_day;
                    END IF;*/
                END IF;
            END IF;
        END IF;

    -------------------------------------------------------------------------------------
    -- (12: 분기/반기 주기설정2) 예, "반기 익월 3째주 목요일"
    ELSIF v_SCH03.SCH03_CYCLE_CALC_TYPE = '12' THEN
        RAISE NOTICE '주기계산코드 => 분기/반기 주기설정2 (%)', v_SCH03.SCH03_CYCLE_CALC_TYPE;
        
        -- YYYY/MM SET
        IF v_SCH03.SCH03_CYCLE_CD = '04' THEN --(04:분기별)
            v_date := f_get_quarter_date(v_date,'1');
        ELSIF v_SCH03.SCH03_CYCLE_CD = '05' THEN --(05:반기별)
            v_date := f_get_quarter_date(v_date,'2');
        ELSIF v_SCH03.SCH03_CYCLE_CD = '06' THEN --(06:연별)
            v_date := DATE_TRUNC('year',v_date) + INTERVAL '-1day';
        END IF;
        v_date := v_date + COALESCE(v_SCH03.SCH03_NUM1,0) * INTERVAL '1month';

        -- DD SET
        v_date := f_get_week_date (v_date, v_SCH03.SCH03_WEEK_CD, v_SCH03.SCH03_DAY_WEEK_CD);

    END IF;

    -------------------------------------------------------------------------------------
    -- 영업일SET
    IF v_SCH03.SCH03_HOLIDAY_CD = '1' THEN --(1:직전영업일)
        v_date := f_get_biz_date(p_company_id, v_date, '-0');
    ELSIF v_SCH03.SCH03_HOLIDAY_CD = '2' THEN --(2:직후영업일)
        v_date := f_get_biz_date(p_company_id, v_date, '+0');
    END IF;

    -------------------------------------------------------------------------------------
    RETURN v_date;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - % (%)', v_errMsg, SQLERRM ;
    RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
