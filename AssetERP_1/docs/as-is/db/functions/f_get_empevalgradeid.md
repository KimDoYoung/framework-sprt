# f_get_empevalgradeid

## FUNCTION public.f_get_empevalgradeid(p_eval_list_std_id numeric, p_score numeric)

- 반환: `numeric`
- 줄 수: 31

```sql
CREATE OR REPLACE FUNCTION public.f_get_empevalgradeid(p_eval_list_std_id numeric, p_score numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_GRADE_ID      NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT emp42_eval_grade_id
      INTO v_GRADE_ID
      FROM emp42_eval_grade
     WHERE emp42_eval_list_std_id = p_eval_list_std_id
       AND (CASE emp42_compare_cd
                WHEN '1' THEN p_score >= emp42_grade_score  -- 이상
                WHEN '2' THEN p_score <= emp42_grade_score  -- 이하
                WHEN '3' THEN p_score < emp42_grade_score   -- 미만
                WHEN '4' THEN p_score > emp42_grade_score   -- 초과
            END)
     ORDER BY emp42_grade_score DESC, emp42_compare_cd
     LIMIT 1;
    -------------------------------------------------------------------------------------
    RETURN v_GRADE_ID;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RETURN null;
END;
$function$
```
