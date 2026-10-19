# f_get_ipo_valid_item_cd

## FUNCTION public.f_get_ipo_valid_item_cd(p_item_cd character varying)

- 반환: `character varying`
- 줄 수: 26

```sql
CREATE OR REPLACE FUNCTION public.f_get_ipo_valid_item_cd(p_item_cd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ITEM_CD VARCHAR(12);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT sch15_valid_item_cd
      INTO v_ITEM_CD
      FROM sch15_ipo_item_matching
     WHERE sch15_item_cd = p_item_cd ;
    -------------------------------------------------------------------------------------
    IF COALESCE(v_ITEM_CD,'') = '' THEN
        v_ITEM_CD := p_item_cd;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_ITEM_CD;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
