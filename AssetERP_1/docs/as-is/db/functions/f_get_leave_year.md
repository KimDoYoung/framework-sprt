# f_get_leave_year

## FUNCTION public.f_get_leave_year(p_company_id numeric, p_year numeric)

- 반환: `numeric`
- 줄 수: 96

```sql
CREATE OR REPLACE FUNCTION public.f_get_leave_year(p_company_id numeric, p_year numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_COMPANY_ID    NUMERIC;
    v_DAYS          NUMERIC;
    v_DAYS_CALC     NUMERIC;
    v_ADD           NUMERIC;
    v_1YEAR_DAYS    NUMERIC;
    v_CNT           NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_year < 0 THEN  --1년 미만은 연차없음
        RETURN 0;
    END IF;

    -------------------------------------------------------------------------------------
    -- 회사정보 체크.. 없으면 공통사용
    SELECT COUNT(*)
      INTO v_CNT
      FROM sys30_leave_year
     WHERE sys30_company_id = p_company_id;

    IF v_CNT = 0 THEN
        v_COMPANY_ID := 0;
    ELSE
        v_COMPANY_ID := p_company_id;
    END IF;

    -------------------------------------------------------------------------------------
    IF p_year < 1 THEN
        ---------------------------------------------------------------------------------
        SELECT sys30_leave_days
          INTO v_1YEAR_DAYS
          FROM sys30_leave_year
         WHERE sys30_company_id = v_COMPANY_ID
           AND sys30_year       = 1;
        ---------------------------------------------------------------------------------
        IF p_year < 1 THEN
            RAISE NOTICE '===> p_year       : %', p_year;
            RAISE NOTICE '===> v_1YEAR_DAYS : %', v_1YEAR_DAYS;

            v_DAYS := p_year * v_1YEAR_DAYS;
            RAISE NOTICE '===> v_DAYS 1     : %', v_DAYS;

            -- 반반차 사용여부 체크
            SELECT COUNT(*)
              INTO v_CNT
              FROM sys31_leave_company
             WHERE sys31_company_id = p_company_id
               AND sys31_leave_cd IN ('06','07','08','09') --반반차
               AND COALESCE(sys31_un_use_yn, 'false') = 'false';

            -- 반반차 미사용 고객사는 0.5단위로 계산
            IF v_CNT = 0 THEN
                SELECT TRUNC(v_DAYS) + CASE WHEN (v_DAYS - TRUNC(v_DAYS)) > 0.5 THEN 1 ELSE 0.5 END
                  INTO v_DAYS;

            -- 반반차 사용 고객사는 0.25단위로 계산
            ELSE
                v_DAYS_CALC := TRUNC(v_DAYS);
                v_ADD       := 0;
                IF    (v_DAYS - v_DAYS_CALC) > 0.75 THEN v_ADD := 1;
                ELSIF (v_DAYS - v_DAYS_CALC) > 0.5  THEN v_ADD := 0.75;
                ELSIF (v_DAYS - v_DAYS_CALC) > 0.25 THEN v_ADD := 0.5;
                                                    ELSE v_ADD := 0.25;
                END IF;

                v_DAYS := v_DAYS_CALC + v_ADD;
            END IF;

            RAISE NOTICE '===> v_DAYS 2     : %', v_DAYS;
        ELSE
            v_DAYS := v_1YEAR_DAYS;
        END IF;
    -------------------------------------------------------------------------------------
    ELSE
        SELECT sys30_leave_days
          INTO v_DAYS
          FROM sys30_leave_year
         WHERE sys30_company_id = v_COMPANY_ID
           AND sys30_year      <= p_year
         ORDER BY sys30_year DESC
         LIMIT 1;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_DAYS;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
