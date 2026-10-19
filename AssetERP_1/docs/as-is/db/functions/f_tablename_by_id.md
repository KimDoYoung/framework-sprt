# f_tablename_by_id

## FUNCTION public.f_tablename_by_id(p_id numeric)

- 반환: `character varying`
- 줄 수: 42

```sql
CREATE OR REPLACE FUNCTION public.f_tablename_by_id(p_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
r1      record;
sql_query text;
ret    numeric;
BEGIN

for r1 in
SELECT table_name,
   column_name,
   ordinal_position,
   column_default,
   is_nullable,
   data_type,
   character_maximum_length,
   numeric_precision,
   numeric_scale
FROM information_schema.columns
WHERE table_schema = 'public' 
and  column_name = table_name || '_id' 
LOOP

sql_query := format('SELECT 1 FROM %I WHERE %I = $1  LIMIT 1', r1.table_name, r1.column_name );

EXECUTE sql_query into ret USING p_id;

IF ret IS NOT NULL THEN
return (r1.table_name);
END IF;

END LOOP;


return( null);
END;
$function$
```
