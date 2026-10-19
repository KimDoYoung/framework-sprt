# f_org_parent_info_id

## FUNCTION public.f_org_parent_info_id(av_parent_code_id numeric, av_date timestamp without time zone)

- 반환: `numeric`
- 줄 수: 32

```sql
CREATE OR REPLACE FUNCTION public.f_org_parent_info_id(av_parent_code_id numeric, av_date timestamp without time zone)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$ DECLARE 
	v_parent_info_id	numeric; 

begin

    select  org02_info_id 
    into    v_parent_info_id 
    from    org01_code, 
            org02_info 
    where   org01_code_id = org02_code_id
    and     org01_code_id = av_parent_code_id 
    and		av_date between org01_open_date and coalesce (org01_close_date, to_date('99991231', 'yyyymmdd'))
    and		org02_mod_date 
            = ( select 	max(x.org02_mod_date) 
                from 	org02_info x
                where 	x.org02_code_id = org02_info.org02_code_id 
                and		x.org02_mod_date <= av_date )
    ;
    

    return v_parent_info_id ; 
exception 
when others then 

	return -1; 

end;$function$
```
