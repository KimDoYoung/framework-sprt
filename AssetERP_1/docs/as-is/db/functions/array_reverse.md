# array_reverse

## FUNCTION public.array_reverse(anyarray)

- 반환: `anyarray`
- 줄 수: 16

```sql
CREATE OR REPLACE FUNCTION public.array_reverse(anyarray)
 RETURNS anyarray
 LANGUAGE sql
 IMMUTABLE STRICT
AS $function$
SELECT ARRAY(
    SELECT $1[i]
    FROM generate_series(
        array_lower($1,1),
        array_upper($1,1)
    ) AS s(i)
    ORDER BY i DESC
);
$function$
```
