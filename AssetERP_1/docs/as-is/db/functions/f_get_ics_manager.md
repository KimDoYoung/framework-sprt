# f_get_ics_manager

## FUNCTION public.f_get_ics_manager(p_company_id numeric, p_ics_class_tree_id numeric)

- 반환: `numeric`
- 줄 수: 34

```sql
CREATE OR REPLACE FUNCTION public.f_get_ics_manager(p_company_id numeric, p_ics_class_tree_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_manager_group_id  NUMERIC;
v_person_id         NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT ics02_person_id
      INTO v_person_id
      FROM ics05_relate_manager
           INNER JOIN ics02_manager ON ics02_manager_id = ics05_manager_id
     WHERE ics05_ics_class_tree_id = p_ics_class_tree_id
       AND ics02_company_id        = p_company_id ;
    -------------------------------------------------------------------------------------
    IF v_person_id IS NULL THEN
        SELECT ics02_person_id
          INTO v_person_id
          FROM ics02_manager
         WHERE ics02_company_id = p_company_id
           AND ics02_default_yn = 'true'
         LIMIT 1;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_person_id;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
