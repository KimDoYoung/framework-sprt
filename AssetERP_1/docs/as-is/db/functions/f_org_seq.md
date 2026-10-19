# f_org_seq

## FUNCTION public.f_org_seq(v_code_id numeric, v_base_date timestamp without time zone, v_company numeric)

- 반환: `character varying`
- 줄 수: 96

```sql
CREATE OR REPLACE FUNCTION public.f_org_seq(v_code_id numeric, v_base_date timestamp without time zone, v_company numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE
	v_parent_id	numeric;	
	v_seq		varchar;
begin
	begin	
		select
-- 		 string_agg(a.org02_sort_order||'-'||a.org01_org_cd,' ') 	into v_seq
			string_agg(a.org02_sort_order||a.org01_org_cd,'') 	into strict	v_seq
		from (
			with recursive org_list(org01_org_cd, org02_sort_order,org02_code_id,org02_parent_code_id, org02_kor_nm, depth, path, cycle) as
			(
				/** 시작 조건*/
				select 
					  a.org01_org_cd
					, a.org02_sort_order
					, a.org02_code_id
					, a.org02_parent_code_id
					, a.org02_kor_nm
					, 0
					, ARRAY[a.org02_kor_nm::text]
					, false    
				from 
					 (           select	org01_code.*
									,	org02_info.*
								from	org01_code
									,	org02_info	
								where	org01_company_id	=	v_company 
								and		org01_code_id		=	org02_code_id
								and		v_base_date 			between	org01_open_date	and	coalesce (org01_close_date,	to_date('29991231',	'yyyymmdd'))
								and		org02_level_cd	>=	'0020'
								and		org02_mod_date	=	(	select	max(x.org02_mod_date)	
																from	org02_info	x
																where	x.org02_code_id	=	org02_info.org02_code_id	
																and		x.org02_mod_date	<=	v_base_date
			                                                  )
			          )a                                        
				where  1=1
					and org02_code_id	=	v_code_id
				union all 
				/** 하위 조건 */
				select 
					  a.org01_org_cd
					, a.org02_sort_order	  
					, a.org01_code_id
					, b.org02_parent_code_id
					, a.org02_kor_nm
					, b.depth + 1
					, array_append(b.path, b.org02_kor_nm::text) 
					, a.org02_kor_nm = any(b.path)	 
				from 
					(           select	org01_code.*
									,	org02_info.*
								from	org01_code
									,	org02_info	
								where	org01_company_id	=	v_company
								and		org01_code_id		=	org02_code_id
								and		v_base_date 			between	org01_open_date	and	coalesce (org01_close_date,	to_date('29991231',	'yyyymmdd'))
								and		org02_level_cd	>=	'0020'
								and		org02_mod_date	=	(	select	max(x.org02_mod_date)	
																from	org02_info	x
																where	x.org02_code_id	=	org02_info.org02_code_id	
																and		x.org02_mod_date	<=	v_base_date 
			                                                  )
			          ) a , 
					org_list b
				where  1=1
					and b.org02_parent_code_id = a.org02_code_id
					and not cycle
			)
			select
				 org01_org_cd
				,org02_sort_order
				,org02_code_id
				,org02_parent_code_id
				,depth 
				,LPAD(' ', 4*(depth-1)) || org02_sort_order AS sort_order
				,path
			from 
			org_list
			where 1=1
			and depth < 2
			order by path 
		) a;

	exception	when	NO_DATA_FOUND	then
		return	'';	
	end;

	return	v_seq;

end;$function$
```
