# getsubtdmorg

## FUNCTION public.getsubtdmorg(p_tdm53_chck_exct_id numeric, p_org_id numeric)

- 반환: `TABLE(org_id numeric, depth numeric)`
- 줄 수: 40

```sql
CREATE OR REPLACE FUNCTION public.getsubtdmorg(p_tdm53_chck_exct_id numeric, p_org_id numeric)
 RETURNS TABLE(org_id numeric, depth numeric)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
   
    ------------------------------------------------------------
    -- 책무이행점검 승인선기준 특정부서이하 부서리스트 리턴
    ------------------------------------------------------------
    WITH RECURSIVE org ( org_id
                       , parent_id
                       , depth
                       , path
    ) AS (
             SELECT DISTINCT
                    tdm59_appr_org_id               as org_id
                  , tdm59_parent_org_id             as parent_id
                  , 0                               as depth
                  , ARRAY[tdm59_appr_org_id::text]  as path
               FROM tdm59_chck_appr_cmnt
              WHERE tdm59_chck_exct_id = p_tdm53_chck_exct_id
                AND tdm59_appr_org_id  = p_org_id
              UNION ALL
             SELECT tdm59_appr_org_id
                  , tdm59_parent_org_id
                  , depth + 1
                  , ARRAY_APPEND(path, tdm59_appr_org_id::text)
               FROM tdm59_chck_appr_cmnt
                    INNER JOIN org ON org_id = tdm59_parent_org_id
              WHERE tdm59_chck_exct_id = p_tdm53_chck_exct_id
                AND NOT (tdm59_appr_org_id::text = ANY(org.path))
    )
    SELECT DISTINCT org_id, depth
      FROM org
     ORDER BY depth ;

$function$
```
