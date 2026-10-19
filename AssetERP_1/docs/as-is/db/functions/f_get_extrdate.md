# f_get_extrdate

## FUNCTION public.f_get_extrdate(p_datestr character varying)

- 반환: `date[]`
- 줄 수: 38

```sql
CREATE OR REPLACE FUNCTION public.f_get_extrdate(p_datestr character varying)
 RETURNS date[]
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_DATE      RECORD;
    v_DATES     DATE[];-- := ARRAY[NULL::DATE, NULL::DATE];
    v_PATTERN   TEXT := '\d{4}\.\d{2}\.\d{2}'; --'\\b\\d{4}\\.\\d{2}\\.\\d{2}\\b'; -- yyyy.MM.dd 형식의 패턴
    v_MATCHES   TEXT[];
    i INTEGER := 1;
-----------------------------------------------------------------------------------------
BEGIN
    -- NULL 체크
    IF p_dateStr IS NULL OR char_length(p_dateStr) = 0 THEN
        RETURN NULL;
    END IF;

    -- 패턴 매칭하여 추출
    v_MATCHES := ARRAY(SELECT unnest(regexp_matches(p_dateStr, v_PATTERN, 'g')));

    RAISE NOTICE 'v_MATCHES : %', v_MATCHES;

    FOR v_DATE IN ( SELECT TO_DATE(unnest(v_MATCHES),'YYYY.MM.DD') extrDate
    ) LOOP
        IF v_DATE.extrDate IS NOT NULL THEN
            v_DATES[i] := v_DATE.extrDate;
            i := i + 1;
        END IF;
    END LOOP;

    RETURN v_DATES;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
