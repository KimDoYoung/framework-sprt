# f_icr_class_tree_nm_allpath

## FUNCTION public.f_icr_class_tree_nm_allpath(p_class_tree_id numeric)

- 반환: `character varying`
- 줄 수: 40

```sql
CREATE OR REPLACE FUNCTION public.f_icr_class_tree_nm_allpath(p_class_tree_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
	w_class_tree_name   varchar(1000);
BEGIN
WITH RECURSIVE class_list(icr01_class_tree_id, icr01_parent_tree_id, icr01_class_tree_nm, DEPTH, PATH, CYCLE  ) AS
   (
   		/** 시작 조건 */
   		SELECT 
   			icr01_class_tree_id, icr01_parent_tree_id, icr01_class_tree_nm, 1, ARRAY [icr01_class_tree_nm::text], false
   		FROM 
	   		icr01_class_tree
   		WHERE 
   			icr01_class_tree_id = p_class_tree_id 
   		UNION ALL   		
   		/** 하위 데이터 반복 */
   		SELECT 
   			a.icr01_class_tree_id, a.icr01_parent_tree_id, a.icr01_class_tree_nm, b.DEPTH+1, ARRAY_APPEND(B.PATH, A.icr01_class_tree_nm::text), a.icr01_class_tree_nm = any(b.PATH)
   		FROM 
	   		icr01_class_tree a, class_list b 
   		WHERE 1=1
   			and B.icr01_parent_tree_id  = A.icr01_CLASS_TREE_ID 
   			AND NOT CYCLE 
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
