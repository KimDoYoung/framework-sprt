# f_get_ics_nm

## FUNCTION public.f_get_ics_nm(p_ics_class_tree_id numeric, p_type character varying)

- 반환: `character varying`
- 줄 수: 62

```sql
CREATE OR REPLACE FUNCTION public.f_get_ics_nm(p_ics_class_tree_id numeric, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_name  ics01_class_tree.ics01_class_tree_nm%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    WITH RECURSIVE ics_list AS (
        SELECT ics01_class_tree_id              ics_id
             , ics01_class_tree_nm              ics_nm
             , ics01_parent_tree_id             parent_id
             , 1                                depth
             --, ARRAY[ics01_class_tree_nm::text] path
          FROM ics01_class_tree
         WHERE ics01_class_tree_id = p_ics_class_tree_id
         UNION
        SELECT a.ics01_class_tree_id
             , a.ics01_class_tree_nm
             , a.ics01_parent_tree_id
             , b.depth + 1 depth
             --, ARRAY_APPEND(b.path, a.ics01_class_tree_nm::text) path
          FROM ics01_class_tree a
             , ics_list b
         WHERE a.ics01_class_tree_id = b.parent_id
    )
    SELECT ics_nm
      INTO v_name
      FROM ( SELECT ics_nm
               FROM ics_list
              WHERE p_type = '0' --(0:자체명)
                AND ics_id = p_ics_class_tree_id
              UNION ALL
             SELECT ics_nm
               FROM ics_list
              WHERE p_type    = '1' --(1:대분류명)
                AND parent_id = 0
              UNION ALL
             SELECT ics_nm
               FROM ics_list
              WHERE p_type = '2' --(2:중분류명)
                AND ics_id IN ( SELECT ics_id
                                  FROM ics_list
                                 WHERE parent_id > 0
                                 ORDER BY depth DESC
                                 LIMIT 1 )
              UNION ALL
             SELECT string_agg(ics_nm, ' / ' ORDER BY depth DESC)
               FROM ics_list
              WHERE p_type = '3' --(3:대분류명+중분류명)
                AND ics_id != p_ics_class_tree_id
            ) a;
    -------------------------------------------------------------------------------------
    RETURN v_name;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
