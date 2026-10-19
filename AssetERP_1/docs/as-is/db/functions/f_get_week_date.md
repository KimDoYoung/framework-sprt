# f_get_week_date

## FUNCTION public.f_get_week_date(p_stddate date, p_week_cd character varying, p_day_cd character varying)

- 반환: `date`
- 줄 수: 148

```sql
CREATE OR REPLACE FUNCTION public.f_get_week_date(p_stddate date, p_week_cd character varying, p_day_cd character varying)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_weekDay   NUMERIC;
v_date      DATE;
v_errMsg    VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN

    RAISE NOTICE 'f_get_week_date IN) p_stdDate : [%]', p_stdDate;
    RAISE NOTICE 'f_get_week_date IN) p_week_cd : [%]', p_week_cd;
    RAISE NOTICE 'f_get_week_date IN) p_day_cd  : [%]', p_day_cd;

    v_date := p_stdDate;

    -------------------------------------------------------------------------------------
    -- p_week_cd => 00:해당없음 / 01:첫째주 ~ 04:넷째주 / 05:마지막주
    -- p_day_cd  => 00:해당없음 / 02:월요일 ~ 06:금요일
    -------------------------------------------------------------------------------------
    IF COALESCE(p_day_cd ,'00') = '00' THEN
        v_errMsg := '요일코드는 반드시 있어야합니다.['||p_day_cd||']' ;
        RAISE;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_week_cd = '05' THEN -- 주코드가 마지막주인 경우
        v_date    := date_trunc('month', v_date) + INTERVAL '1month -1day';

        RAISE NOTICE 'f_get_week_date IN) ..... v_date : [%]', v_date;

        v_weekday := CAST(to_char(v_date::timestamp,'D') AS NUMERIC); --기준월의 마지막 요일


        RAISE NOTICE 'f_get_week_date IN) ..... v_weekday : [%]', v_weekday;


        ---------------------------------------------------------------------------------
        CASE p_day_cd
            WHEN '02' THEN -- 월요일
                IF v_weekday > 2 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '0days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '-7days';
                END IF ;
            WHEN '03' THEN -- 화요일
                IF v_weekday > 3 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '1days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '-6days';
                END IF ;
            WHEN '04' THEN -- 수요일
                IF v_weekday > 4 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '2days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '-5days';
                END IF ;
            WHEN '05' THEN -- 목요일
                IF v_weekday > 5 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '3days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '-4days';
                END IF ;
            WHEN '06' THEN -- 금요일
                IF v_weekday > 6 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '4days';
                ELSE

                    RAISE NOTICE 'f_get_week_date IN) ..... v_date 111 : [%]', v_date;

                    v_date := date_trunc('week', v_date) + INTERVAL '-3days';

                    RAISE NOTICE 'f_get_week_date IN) ..... v_date 2222 : [%]', v_date;

                END IF ;
            ELSE
                RAISE NOTICE 'SCH03_DAY_CD 예외코드 발생 %', p_day_cd;
        END CASE;

        v_date := v_date + INTERVAL '7days';

    -------------------------------------------------------------------------------------
    ELSE
        v_date    := date_trunc('month', v_date);
        v_weekday := CAST(to_char(v_date::timestamp,'D') AS NUMERIC); --기준월의 첫번째 요일
        ---------------------------------------------------------------------------------
        CASE p_day_cd
            WHEN '02' THEN -- 월요일
                --IF v_weekday <= 2 THEN
                IF v_weekday BETWEEN 2 AND 2 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '0days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '7days';
                END IF ;
            WHEN '03' THEN -- 화요일
                --IF v_weekday <= 3 THEN
                IF v_weekday BETWEEN 2 AND 3 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '1days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '8days';
                END IF ;
            WHEN '04' THEN -- 수요일
                --IF v_weekday <= 4 THEN
                IF v_weekday BETWEEN 2 AND 4 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '2days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '9days';
                END IF ;
            WHEN '05' THEN -- 목요일
                --IF v_weekday <= 5 THEN
                IF v_weekday BETWEEN 2 AND 5 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '3days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '10days';
                END IF ;
            WHEN '06' THEN -- 금요일
                --IF v_weekday <= 6 THEN
                IF v_weekday BETWEEN 2 AND 6 THEN
                    v_date := date_trunc('week', v_date) + INTERVAL '4days';
                ELSE
                    v_date := date_trunc('week', v_date) + INTERVAL '11days';
                END IF ;
            ELSE
                RAISE NOTICE 'SCH03_DAY_CD 예외코드 발생 %', p_day_cd;
        END CASE;
        ---------------------------------------------------------------------------------
        -- 둘째주
        IF p_week_cd = '02' THEN
            v_date := v_date + INTEGER '7';
        -- 셋째주
        ELSIF p_week_cd = '03' THEN
            v_date := v_date + INTEGER '14';
        -- 넷째주
        ELSIF p_week_cd = '04' THEN
            v_date := v_date + INTEGER '21';
        END IF;
    END IF ;
    -------------------------------------------------------------------------------------
    RETURN v_date;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %/%/%', p_stdDate, p_week_cd, p_day_cd;
    RETURN TO_DATE('19000101','YYYYMMDD');
END;
$function$
```
