# getcompanyrule

## FUNCTION public.getcompanyrule(p_company_id numeric, p_rule_cd character varying)

- 반환: `SETOF bbs15_company_rule`
- 줄 수: 20

```sql
CREATE OR REPLACE FUNCTION public.getcompanyrule(p_company_id numeric, p_rule_cd character varying)
 RETURNS SETOF bbs15_company_rule
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$

    SELECT t.*
      FROM bbs15_company_rule t
     WHERE bbs15_company_id = p_company_id
       AND bbs15_company_rule_cd = CASE WHEN p_rule_cd IS NOT NULL THEN p_rule_cd ELSE bbs15_company_rule_cd END
       AND bbs15_revision_no = ( SELECT MAX(bbs15_revision_no)
                                   FROM bbs15_company_rule a
                                  WHERE a.bbs15_company_id      = t.bbs15_company_id
                                    AND a.bbs15_company_rule_cd = t.bbs15_company_rule_cd
                                    AND COALESCE(a.bbs15_public_yn,'false') = 'true' );

$function$
```
