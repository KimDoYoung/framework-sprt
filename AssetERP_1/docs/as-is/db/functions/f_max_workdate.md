# f_max_workdate

## FUNCTION public.f_max_workdate(p_fund_code_id numeric, p_work_date timestamp without time zone)

- 반환: `timestamp without time zone`
- 줄 수: 17

```sql
CREATE OR REPLACE FUNCTION public.f_max_workdate(p_fund_code_id numeric, p_work_date timestamp without time zone)
 RETURNS timestamp without time zone
 LANGUAGE plpgsql
AS $function$ DECLARE
	w_return		timestamp;
begin
	select	max(fnd02_work_date)
	into	w_return
	from	fnd02_fund_info
	where	fnd02_fund_code_id	=	p_fund_code_id
	and		fnd02_work_date		<=	p_work_date
	;

	return	(w_return);
end;$function$
```
