# f_get_leave_days2

## FUNCTION public.f_get_leave_days2(p_person_id numeric, p_std_year character varying, p_days_type character varying, p_std_date date, p_appr_chk_yn character varying)

- 반환: `numeric`
- 줄 수: 65

```sql
CREATE OR REPLACE FUNCTION public.f_get_leave_days2(p_person_id numeric, p_std_year character varying, p_days_type character varying, p_std_date date, p_appr_chk_yn character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_LEAVE_YN          VARCHAR;
    v_DAYS              NUMERIC;
    v_USE_DAYS          NUMERIC;
    v_REMAIN_DAYS       NUMERIC;
    v_PRE_REMAIN_DAYS   NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN

    SELECT sys01_leave_yn
      INTO v_LEAVE_YN
      FROM sys01_company
     WHERE sys01_company_id IN ( SELECT emp01_company_id
                                   FROM emp01_person
                                  WHERE emp01_person_id = p_person_id );

    -------------------------------------------------------------------------------------
    -- 휴가 초과사용 불가!!!
    -------------------------------------------------------------------------------------
    IF COALESCE(v_LEAVE_YN,'true') = 'false' THEN
        v_DAYS := f_get_leave_days(p_person_id, p_std_year, p_days_type, p_std_date, p_appr_chk_yn);
        RETURN v_DAYS;

    -------------------------------------------------------------------------------------
    -- 휴가 초과사용 가능.. 다음년도꺼 사용함
    -------------------------------------------------------------------------------------
    ELSE
        -- (2:사용일수/3:잔여일수)인 경우...
        IF p_days_type IN ('2','3') THEN

            -- 전기의 잔여일수 가져와 초과일수 SET
            v_PRE_REMAIN_DAYS := f_get_leave_days(p_person_id, CAST(CAST(p_std_year AS NUMERIC)-1 AS VARCHAR), '3', null, 'true');
            IF v_PRE_REMAIN_DAYS > 0 THEN
                v_PRE_REMAIN_DAYS := 0;
            END IF;
            v_PRE_REMAIN_DAYS := v_PRE_REMAIN_DAYS * -1;

            -- 당기의 사용일수 + 전기 초과일수
            v_USE_DAYS := f_get_leave_days(p_person_id, p_std_year, '2', p_std_date, p_appr_chk_yn) + v_PRE_REMAIN_DAYS;

            -- 잔여일수 = 총일수 - (당기의 사용일수 + 전기 초과일수)
            IF p_days_type = '3' THEN
                v_REMAIN_DAYS := f_get_leave_days(p_person_id, p_std_year, '1', p_std_date, p_appr_chk_yn) - v_USE_DAYS;
            END IF;

        ELSE
            v_DAYS := f_get_leave_days(p_person_id, p_std_year, p_days_type, p_std_date, p_appr_chk_yn);
        END IF;
        ---------------------------------------------------------------------------------
        IF    p_days_type = '2' THEN RETURN v_USE_DAYS;
        ELSIF p_days_type = '3' THEN RETURN v_REMAIN_DAYS;
        ELSE                         RETURN v_DAYS;
        END IF;
    END IF;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
