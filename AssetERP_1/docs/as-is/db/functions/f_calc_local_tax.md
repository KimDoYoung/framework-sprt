# f_calc_local_tax

## FUNCTION public.f_calc_local_tax(p_std_date date, p_income_tax numeric)

- 반환: `numeric`
- 줄 수: 17

```sql
CREATE OR REPLACE FUNCTION public.f_calc_local_tax(p_std_date date, p_income_tax numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 지방세 = 소득세 * 주민세율(10%), 십원미만 절사
    RETURN TRUNC(p_income_tax * f_get_rate('10', p_std_date), -1);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
