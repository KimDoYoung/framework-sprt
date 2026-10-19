# getsuborg

## FUNCTION public.getsuborg(p_org_id numeric, p_std_date date)

- 반환: `TABLE(org_id numeric, org_nm character varying, depth numeric, seq numeric, tdm_yn character varying)`
- 줄 수: 71

```sql
CREATE OR REPLACE FUNCTION public.getsuborg(p_org_id numeric, p_std_date date)
 RETURNS TABLE(org_id numeric, org_nm character varying, depth numeric, seq numeric, tdm_yn character varying)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
   
    ----------------------
    -- 하위조직목록
    ----------------------
    WITH RECURSIVE
    orgSeq AS ( SELECT LPAD(COALESCE(org02_sort_order, org01_org_cd), 10, '0') as seq
                  FROM org01_code
                       INNER JOIN org02_info ON (    org02_code_id = org01_code_id
                                                 AND org02_mod_date = (SELECT MAX(org02_mod_date)
                                                                         FROM org02_info
                                                                        WHERE org02_code_id   = org01_code_id
                                                                          AND org02_mod_date <= p_std_date) )
                 WHERE org01_code_id  = p_org_id
                   AND COALESCE(org01_close_date,'9999-12-31'::date) >= p_std_date
    ),
    org ( org_id
        , parent_id
        , depth
        , seq
        , path
        , org_nm
        , tdm_yn
    ) AS (
            SELECT org01_code_id                                   as org_id
                 , org02_parent_code_id                            as parent_id
                 , 0                                               as depth
                 , CONCAT(orgSeq.seq, org02_sort_order)::numeric   as seq
                 , ARRAY[org02_kor_nm::text]                       as path
                 , org02_kor_nm                                    as org_nm
                 , org02_tdm_yn                                    as tdm_yn
              FROM org01_code
                   INNER JOIN org02_info ON ( org02_code_id  = org01_code_id AND
                                              org02_mod_date = (SELECT MAX(org02_mod_date)
                                                                  FROM org02_info
                                                                 WHERE org02_code_id = org01_code_id
                                                                   AND org02_mod_date <= p_std_date) )
                   CROSS JOIN orgSeq
             WHERE org01_code_id = p_org_id
               AND COALESCE(org01_close_date,'9999-12-31'::date) >= p_std_date
             UNION ALL
            SELECT org01_code_id
                 , org02_parent_code_id
                 , depth + 1
                 , CONCAT(orgSeq.seq, org02_sort_order)::numeric
                 , ARRAY_APPEND(path, org02_kor_nm::text)
                 , org02_kor_nm
                 , org02_tdm_yn
              FROM org01_code
                   INNER JOIN org02_info ON ( org02_code_id  = org01_code_id AND
                                              org02_mod_date = (SELECT MAX(org02_mod_date)
                                                                  FROM org02_info
                                                                 WHERE org02_code_id = org01_code_id
                                                                   AND org02_mod_date <= p_std_date) )
                   INNER JOIN org ON org_id = org02_parent_code_id
                   CROSS JOIN orgSeq
             WHERE COALESCE(org01_close_date,'9999-12-31'::date) >= p_std_date
               AND NOT (org02_kor_nm = ANY(org.path))
    )
    SELECT org_id, org_nm, depth, seq, coalesce(tdm_yn,'false')
      FROM org
     ORDER BY depth, seq ;

$function$
```
