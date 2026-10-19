# getorg

## FUNCTION public.getorg(p_company_id numeric, p_std_date date)

- 반환: `TABLE(org00_org_id numeric, org00_company_id numeric, org00_org_cd character varying, org00_open_date date, org00_close_date date, org00_open_reason character varying, org00_close_reason character varying, org00_kor_nm character varying, org00_mod_date date, org00_mod_reason character varying, org00_parent_code_id numeric, org00_inner_type character varying, org00_eng_nm character varying, org00_note character varying, org00_level_cd character varying, org00_sort_order character varying, org00_mod_detail character varying, org00_dcr_id_word character varying, org00_tdm_yn character varying)`
- 줄 수: 36

```sql
CREATE OR REPLACE FUNCTION public.getorg(p_company_id numeric, p_std_date date)
 RETURNS TABLE(org00_org_id numeric, org00_company_id numeric, org00_org_cd character varying, org00_open_date date, org00_close_date date, org00_open_reason character varying, org00_close_reason character varying, org00_kor_nm character varying, org00_mod_date date, org00_mod_reason character varying, org00_parent_code_id numeric, org00_inner_type character varying, org00_eng_nm character varying, org00_note character varying, org00_level_cd character varying, org00_sort_order character varying, org00_mod_detail character varying, org00_dcr_id_word character varying, org00_tdm_yn character varying)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$

    SELECT org01_code_id                    AS org00_org_id
         , org01_company_id                 AS org00_company_id
         , org01_org_cd                     AS org00_org_cd
         , org01_open_date                  AS org00_open_date
         , org01_close_date                 AS org00_close_date
         , org01_open_reason                AS org00_open_reason
         , org01_close_reason               AS org00_close_reason
         , org02_kor_nm                     AS org00_kor_nm
         , org02_mod_date                   AS org00_mod_date
         , org02_mod_reason                 AS org00_mod_reason
         , org02_parent_code_id             AS org00_parent_code_id
         , org02_inner_type                 AS org00_inner_type
         , org02_eng_nm                     AS org00_eng_nm
         , org02_note                       AS org00_note
         , org02_level_cd                   AS org00_level_cd
         , org02_sort_order                 AS org00_sort_order
         , org02_mod_detail                 AS org00_mod_detail
         , org02_dcr_id_word                AS org00_dcr_id_word
         , COALESCE(org02_tdm_yn,'false')   AS org00_tdm_yn
      FROM org01_code
           INNER JOIN org02_info ON (    org02_code_id  = org01_code_id
                                     AND org02_mod_date = ( SELECT MAX(org02_mod_date)
                                                              FROM org02_info
                                                             WHERE org02_code_id   = org01_code_id
                                                               AND org02_mod_date <= p_std_date ) )
     WHERE org01_company_id = p_company_id ;
$function$
```
