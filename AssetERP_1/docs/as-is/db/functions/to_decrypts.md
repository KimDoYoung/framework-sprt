# to_decrypts

## FUNCTION public.to_decrypts(data character varying)

- 반환: `character varying`
- 줄 수: 8

```sql
CREATE OR REPLACE FUNCTION public.to_decrypts(data character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ BEGIN
    RETURN convert_from(decrypt(decode(data, 'hex'), '***', 'aes'), 'utf8');
END; $function$
```
