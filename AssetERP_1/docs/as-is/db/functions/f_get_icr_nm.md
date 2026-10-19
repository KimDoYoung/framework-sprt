# f_get_icr_nm

## FUNCTION public.f_get_icr_nm(p_icr_class_tree_id numeric, p_type character varying)

- 반환: `character varying`
- 줄 수: 62

```sql
CREATE OR REPLACE FUNCTION public.f_get_icr_nm(p_icr_class_tree_id numeric, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_name  icr01_class_tree.icr01_class_tree_nm%TYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    WITH RECURSIVE icr_list AS (
        SELECT icr01_class_tree_id              icr_id
             , icr01_class_tree_nm              icr_nm
             , icr01_parent_tree_id             parent_id
             , 1                                depth
             --, ARRAY[icr01_class_tree_nm::text] path
          FROM icr01_class_tree
         WHERE icr01_class_tree_id = p_icr_class_tree_id
         UNION
        SELECT a.icr01_class_tree_id
             , a.icr01_class_tree_nm
             , a.icr01_parent_tree_id
             , b.depth + 1 depth
             --, ARRAY_APPEND(b.path, a.icr01_class_tree_nm::text) path
          FROM icr01_class_tree a
             , icr_list b
         WHERE a.icr01_class_tree_id = b.parent_id
    )
    SELECT icr_nm
      INTO v_name
      FROM ( SELECT icr_nm
               FROM icr_list
              WHERE p_type = '0' --(0:자체명)
                AND icr_id = p_icr_class_tree_id
              UNION ALL
             SELECT icr_nm
               FROM icr_list
              WHERE p_type    = '1' --(1:대분류명)
                AND parent_id = 0
              UNION ALL
             SELECT icr_nm
               FROM icr_list
              WHERE p_type = '2' --(2:중분류명)
                AND icr_id IN ( SELECT icr_id
                                  FROM icr_list
                                 WHERE parent_id > 0
                                 ORDER BY depth DESC
                                 LIMIT 1 )
              UNION ALL
             SELECT string_agg(icr_nm, ' / ' ORDER BY depth DESC)
               FROM icr_list
              WHERE p_type = '3' --(3:대분류명+중분류명)
                AND icr_id != p_icr_class_tree_id
            ) a;
    -------------------------------------------------------------------------------------
    RETURN v_name;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
