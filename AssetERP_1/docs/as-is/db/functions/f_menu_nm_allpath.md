# f_menu_nm_allpath

## FUNCTION public.f_menu_nm_allpath(p_menu_id numeric)

- 반환: `character varying`
- 줄 수: 39

```sql
CREATE OR REPLACE FUNCTION public.f_menu_nm_allpath(p_menu_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
	w_menu_name   varchar(1000);
BEGIN
WITH RECURSIVE menu_list(sys06_menu_id, sys06_parent_id, sys06_menu_nm, DEPTH, PATH)AS
   (
   		/** 시작 조건 */
   		SELECT 
   			sys06_menu_id, sys06_parent_id, sys06_menu_nm, 1, ARRAY [sys06_menu_nm::text]
   		FROM 
	   		sys06_menu
   		WHERE 
   			sys06_menu_id = p_menu_id 
   		UNION ALL   		
   		/** 하위 데이터 반복 */
   		SELECT 
   			a.sys06_menu_id, a.sys06_parent_id, a.sys06_menu_nm, b.DEPTH+1, ARRAY_APPEND(B.PATH, A.sys06_menu_nm::text)
   		FROM 
	   		sys06_menu a, menu_list b 
   		WHERE 1=1
   			and B.sys06_parent_id  = A.sys06_menu_id 
   )
   /** VIEW */
   SELECT 
    array_to_string(array_reverse(path),' / ','')   INTO w_menu_name
   FROM 
   	menu_list 
   ORDER BY path desc
   limit 1	;
  
   RETURN w_menu_name;

end;
$function$
```
