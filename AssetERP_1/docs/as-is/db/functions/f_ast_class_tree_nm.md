# f_ast_class_tree_nm

## FUNCTION public.f_ast_class_tree_nm(p_class_tree_id numeric)

- 반환: `character varying`
- 줄 수: 19

```sql
CREATE OR REPLACE FUNCTION public.f_ast_class_tree_nm(p_class_tree_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_ast_nm    ast01_class_tree.ast01_class_tree_nm%TYPE;
BEGIN
    SELECT ast01_class_tree_nm
      INTO v_ast_nm
      FROM ast01_class_tree
     WHERE ast01_class_tree_id = p_class_tree_id;

   RETURN v_ast_nm;

EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
