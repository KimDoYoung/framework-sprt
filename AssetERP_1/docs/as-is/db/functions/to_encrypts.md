# to_encrypts

## FUNCTION public.to_encrypts(data character varying)

- 반환: `character varying`
- 줄 수: 8

```sql
CREATE OR REPLACE FUNCTION public.to_encrypts(data character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ BEGIN
    RETURN encode(encrypt(convert_to(data, 'utf8'), '***', 'aes'), 'hex');
END; $function$
```
