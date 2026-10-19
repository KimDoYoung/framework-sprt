# f_get_crdmanagerid2

## FUNCTION public.f_get_crdmanagerid2(p_card_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 33

```sql
CREATE OR REPLACE FUNCTION public.f_get_crdmanagerid2(p_card_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_PERSON_ID     NUMERIC;
v_PUBLIC_YN     VARCHAR(5);
-----------------------------------------------------------------------------------------
-- RD에서 사용중
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT crd03_person_id
         , COALESCE(crd03_public_yn,'false')
      INTO v_PERSON_ID
         , v_PUBLIC_YN
      FROM crd03_trans
     WHERE crd03_card_id = p_card_id
       --AND crd03_fr_dt  <= p_std_date
       AND p_std_date BETWEEN crd03_fr_dt AND COALESCE(crd03_to_dt,'9999-12-31')
     ORDER BY crd03_fr_dt DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    IF v_PUBLIC_YN = 'true' THEN v_PERSON_ID := 0; END IF;
    -------------------------------------------------------------------------------------
    RETURN v_PERSON_ID;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
