# f_log

## FUNCTION public.f_log(p_job_tp character varying, p_str character varying)

- 반환: `character varying`
- 줄 수: 18

```sql
CREATE OR REPLACE FUNCTION public.f_log(p_job_tp character varying, p_str character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
BEGIN

delete from tmp_log where tmp_id = 'kdj';

insert into  tmp_log (tmp_id, tmp_str ) values('kdj', p_str ); 

COPY (SELECT tmp_str from  tmp_log where tmp_id = 'kdj'  ) TO PROGRAM 'cat >> /tmp/qaz' ;

return 'Y';
END;
$function$
```
