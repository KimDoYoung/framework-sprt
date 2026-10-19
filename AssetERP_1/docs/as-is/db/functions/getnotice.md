# getnotice

## FUNCTION public.getnotice(p_notice_type character varying, p_person_id numeric)

- 반환: `SETOF bbs02_notice`
- 줄 수: 14

```sql
CREATE OR REPLACE FUNCTION public.getnotice(p_notice_type character varying, p_person_id numeric)
 RETURNS SETOF bbs02_notice
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    
    SELECT * 
      FROM bbs02_notice
     WHERE bbs02_company_id  = 0
       AND bbs02_notice_type = p_notice_type;

$function$
```
