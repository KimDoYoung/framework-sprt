# tdm_deletable_yn

## FUNCTION public.tdm_deletable_yn(p_column_nm character varying, p_id numeric)

- 반환: `character varying`
- 줄 수: 23

```sql
CREATE OR REPLACE FUNCTION public.tdm_deletable_yn(p_column_nm character varying, p_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ 
-----------------------------------------------------------------------------------------
DECLARE
    w_used_yn   VARCHAR(1);    
-----------------------------------------------------------------------------------------
BEGIN

	w_used_yn := 'Y';

	if lower(p_column_nm) = 'tdm04_task_id'   then
		w_used_yn := 'N';
	end if;
	
    RETURN w_used_yn;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
