# f_org_parent_info_nm

## FUNCTION public.f_org_parent_info_nm(p_org_id numeric, p_date timestamp without time zone)

- 반환: `character varying`
- 줄 수: 46

```sql
CREATE OR REPLACE FUNCTION public.f_org_parent_info_nm(p_org_id numeric, p_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE	
	o_kor_name		varchar(200);
	w_parent_id		numeric;
	w_org_code_id	numeric;
	w_level_cd		varchar(10);
	w_date			timestamp;
	cnt				int := 0;
begin
	if	p_org_id	is	null	then	
		return	null;
	else
		w_org_code_id	:=	p_org_id;
	end	if;
	if	p_date		is	null	then	
		w_date	:=	f_sysdate();
	else
		w_date := p_date;		
	end	if;
	
	Loop
		o_kor_name	:=	'';
		w_level_cd	:=	'0000';
		select	org02_parent_code_id, org02_kor_nm, org02_level_cd
		into	w_parent_id, o_kor_name,	w_level_cd
		from	org02_info a
		where	org02_code_id	=	w_org_code_id
		and		org02_mod_date	=	(	select	max(x.org02_mod_date)
										from	org02_info	x
										where	x.org02_code_id	=	a.org02_code_id	
										and		x.org02_mod_date	<=	w_date
									);
		
		w_org_code_id	:=	w_parent_id;
		cnt := cnt + 1;
		exit	when	w_level_cd	<=	'0020';
		exit    when    cnt > 5 ;
	end	loop;

	return	o_kor_name;
	
end;$function$
```
