# f_get_tdmorg_id2

## FUNCTION public.f_get_tdmorg_id2(p_company_id numeric, p_org_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 55

```sql
CREATE OR REPLACE FUNCTION public.f_get_tdmorg_id2(p_company_id numeric, p_org_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_TDM_ORG_ID    NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    /*-----------------------------------------------------------------------------------

          소속 책무이행 점검조직ID 리턴

    -----------------------------------------------------------------------------------*/
    WITH RECURSIVE org ( org_id
                       , parent_id
                       , depth
                       , path
                       , org_nm
                       , tdm_yn
    ) AS (
            SELECT org00_org_id                                         AS org_id
                 , org00_parent_code_id                                 AS parent_id
                 , 0                                                    AS depth
                 , ARRAY[org00_org_id||org00_kor_nm::text]              AS path
                 , org00_kor_nm                                         AS org_nm
                 , COALESCE(org00_tdm_yn,'false')                       AS tdm_yn
              FROM getOrg(p_company_id, p_std_date)
             WHERE org00_org_id = p_org_id
             UNION ALL
            SELECT org00_org_id                                         AS org_id
                 , org00_parent_code_id                                 AS parent_id
                 , depth + 1                                            AS depth
                 , ARRAY_APPEND(path, org00_org_id||org00_kor_nm::text) AS path
                 , org00_kor_nm                                         AS org_nm
                 , COALESCE(org00_tdm_yn,'false')                       AS tdm_yn
              FROM getOrg(p_company_id, p_std_date)
                   INNER JOIN org ON parent_id = org00_org_id
             WHERE NOT (org00_kor_nm = ANY(org.path))
    )
    SELECT org_id
      INTO v_TDM_ORG_ID
      FROM org
     WHERE tdm_yn = 'true'
     ORDER BY depth
     LIMIT 1 ;

    -------------------------------------------------------------------------------------
    RETURN v_TDM_ORG_ID;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
