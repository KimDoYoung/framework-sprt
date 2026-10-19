# f_get_extrdate2

## FUNCTION public.f_get_extrdate2(p_datestr character varying)

- 반환: `character varying`
- 줄 수: 46

```sql
CREATE OR REPLACE FUNCTION public.f_get_extrdate2(p_datestr character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_DATE_STRS       TEXT[];
    v_START_DATE_STR  TEXT;
    v_END_DATE_STR    TEXT;
    v_YEAR_PART       INTEGER;
-----------------------------------------------------------------------------------------
BEGIN
    -- NULL 체크
    IF p_dateStr IS NULL THEN
        RETURN NULL;
    END IF;

    -- 문자열 분리
    v_DATE_STRS := string_to_array(p_dateStr, '~');

    -- 앞뒤 공백 제거
    v_START_DATE_STR := trim(v_DATE_STRS[1]);
    v_END_DATE_STR   := trim(v_DATE_STRS[2]);

    RAISE NOTICE 'v_START_DATE_STR : %', v_START_DATE_STR;
    RAISE NOTICE 'v_END_DATE_STR   : %', v_END_DATE_STR;

    -- 종료일에 연도 추가
    IF array_length(string_to_array(v_END_DATE_STR, '.'), 1) = 2 THEN
        IF v_START_DATE_STR > SUBSTR(v_START_DATE_STR, 1, 5) || v_END_DATE_STR THEN
            v_YEAR_PART    := CAST(SUBSTR(v_START_DATE_STR, 1, 4) AS INTEGER) + 1;
            v_END_DATE_STR := v_YEAR_PART || '.' || v_END_DATE_STR;
        ELSE
            v_END_DATE_STR := SUBSTR(v_START_DATE_STR, 1, 5) || v_END_DATE_STR;
        END IF;
    END IF;

    RAISE NOTICE 'v_END_DATE_STR2  : %', v_END_DATE_STR;

    RETURN f_get_extrDate(v_START_DATE_STR || ' ~ ' || v_END_DATE_STR);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
