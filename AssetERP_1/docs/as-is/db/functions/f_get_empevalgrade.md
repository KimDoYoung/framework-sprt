# f_get_empevalgrade

## FUNCTION public.f_get_empevalgrade(p_eval_list_std_id numeric, p_score numeric, p_type character varying)

- 반환: `character varying`
- 줄 수: 35

```sql
CREATE OR REPLACE FUNCTION public.f_get_empevalgrade(p_eval_list_std_id numeric, p_score numeric, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_GRADE         VARCHAR(1);
    v_REASON_YN     VARCHAR(5);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT emp42_grade, COALESCE(emp42_reason_yn,'false')
      INTO v_GRADE, v_REASON_YN
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
    IF    p_type = '1' THEN RETURN v_GRADE;
    ELSIF p_type = '2' THEN RETURN v_REASON_YN;
                       ELSE RETURN '';
    END IF;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RETURN '';
END;
$function$
```
