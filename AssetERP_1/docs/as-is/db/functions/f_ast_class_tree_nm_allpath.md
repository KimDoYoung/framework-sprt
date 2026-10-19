# f_ast_class_tree_nm_allpath

## FUNCTION public.f_ast_class_tree_nm_allpath(p_class_tree_id numeric)

- 반환: `character varying`
- 줄 수: 41

```sql
CREATE OR REPLACE FUNCTION public.f_ast_class_tree_nm_allpath(p_class_tree_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
	w_class_tree_name   varchar(1000);
BEGIN
WITH RECURSIVE class_list(ast01_class_tree_id, ast01_parent_tree_id, ast01_class_tree_nm, ast01_isin, DEPTH, PATH  ) AS
   (
   		/** 시작 조건 */
   		SELECT 
   			ast01_class_tree_id, ast01_parent_tree_id, ast01_class_tree_nm, ast01_isin, 1, ARRAY [ ast01_class_tree_nm||CASE WHEN ast01_type_cd != 'IT' THEN ''
																								  							 ELSE (CASE WHEN COALESCE(ast01_isin,'X') != 'X' THEN ' ('||ast01_isin||')' ELSE '' END) END::text]
   		FROM 
	   		ast01_class_tree
   		WHERE 
   			ast01_class_tree_id = p_class_tree_id 
   		UNION ALL   		
   		/** 하위 데이터 반복 */
   		SELECT 
   			a.ast01_class_tree_id, a.ast01_parent_tree_id, a.ast01_class_tree_nm, a.ast01_isin, b.DEPTH+1, ARRAY_APPEND(B.PATH, a.ast01_class_tree_nm||CASE WHEN a.ast01_type_cd != 'IT' THEN ''
																								  							                                ELSE (CASE WHEN COALESCE(a.ast01_isin,'X') != 'X' THEN ' ('||a.ast01_isin||')' ELSE '' END) END::text)
   		FROM 
	   		ast01_class_tree a, class_list b 
   		WHERE 1=1
   			and B.ast01_parent_tree_id  = A.AST01_CLASS_TREE_ID 
   )
   /** VIEW */
   SELECT 
    array_to_string(array_reverse(path),'/','')   INTO w_class_tree_name
   FROM 
   	CLASS_LIST 
   ORDER BY path desc
   limit 1	;
  
   RETURN w_class_tree_name;

end;
$function$
```
