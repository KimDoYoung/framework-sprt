# f_job_nm

## FUNCTION public.f_job_nm(p_job_code_id numeric, p_job_date timestamp without time zone)

- 반환: `character varying`
- 줄 수: 25

```sql
CREATE OR REPLACE FUNCTION public.f_job_nm(p_job_code_id numeric, p_job_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE
	w_return		varchar(400);
begin

	if	p_job_code_id	is	null	then
		return	null;
	end	if;
	
	select	job.job00_job_nm
	into	w_return
	from	job00_job_info job
	where	job00_job_code_id = p_job_code_id 
	and 	job00_mod_date	= ( select	max(job00_mod_date) 
								from	job00_job_info x
								where	x.job00_job_code_id = job.job00_job_code_id 
								and 	x.job00_mod_date <= p_job_date)
	LIMIT 1;

	return	(w_return);
end;$function$
```
