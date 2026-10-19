# f_get_crdmanagerid

## FUNCTION public.f_get_crdmanagerid(p_card_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 26

```sql
CREATE OR REPLACE FUNCTION public.f_get_crdmanagerid(p_card_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_DATA  NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT crd03_person_id
      INTO v_DATA
      FROM crd03_trans
     WHERE crd03_card_id = p_card_id
       --AND crd03_fr_dt  <= p_std_date
       AND p_std_date BETWEEN crd03_fr_dt AND COALESCE(crd03_to_dt,'9999-12-31')
     ORDER BY crd03_fr_dt DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    RETURN v_DATA;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
