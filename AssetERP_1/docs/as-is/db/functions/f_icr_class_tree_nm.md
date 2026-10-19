# f_icr_class_tree_nm

## FUNCTION public.f_icr_class_tree_nm(p_class_tree_id numeric)

- 반환: `character varying`
- 줄 수: 27

```sql
CREATE OR REPLACE FUNCTION public.f_icr_class_tree_nm(p_class_tree_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare 
	p_class_tree_name    varchar(200);
begin
    if	p_class_tree_id	is	null	then 
		return	null; 
    end if; 

	begin
		select	icr01_class_tree_nm
		into	strict p_class_tree_name
		from	icr01_class_tree
		where	icr01_class_tree_id	=	p_class_tree_id
		;
	exception	when	NO_DATA_FOUND	then
		return	'내부통제 명을 찾을 수 없습니다.'; 
	end;
	
	return	p_class_tree_name;

end;
$function$
```
