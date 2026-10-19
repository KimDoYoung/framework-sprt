# gettdm30roleallc

## FUNCTION public.gettdm30roleallc(p_company_id numeric, p_std_date date, p_appr_yn boolean)

- 반환: `TABLE(tdm30_role_allc_id numeric, tdm30_company_id numeric, tdm30_role_id numeric, tdm30_person_id numeric, tdm30_add_title_yn character varying, tdm30_reg_reason text, tdm30_deputy_emp_nm character varying, tdm30_start_date date, tdm30_end_date date, tdm30_role_allc_date date, tdm30_appr_id numeric, tdm30_role_allc_detail_id numeric)`
- 줄 수: 60

```sql
CREATE OR REPLACE FUNCTION public.gettdm30roleallc(p_company_id numeric, p_std_date date, p_appr_yn boolean)
 RETURNS TABLE(tdm30_role_allc_id numeric, tdm30_company_id numeric, tdm30_role_id numeric, tdm30_person_id numeric, tdm30_add_title_yn character varying, tdm30_reg_reason text, tdm30_deputy_emp_nm character varying, tdm30_start_date date, tdm30_end_date date, tdm30_role_allc_date date, tdm30_appr_id numeric, tdm30_role_allc_detail_id numeric)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$

    SELECT *
      FROM (
                SELECT tdm30_role_allc_id           AS tdm30_role_allc_id
                     , tdm30_company_id             AS tdm30_company_id
                     , tdm30_role_id                AS tdm30_role_id
                     , tdm30_person_id              AS tdm30_person_id
                     , tdm30_add_title_yn           AS tdm30_add_title_yn
                     , tdm34_reg_reason             AS tdm30_reg_reason
                     , tdm34_deputy_emp_nm          AS tdm30_deputy_emp_nm
                     , tdm30_start_date             AS tdm30_start_date
                     , tdm30_end_date               AS tdm30_end_date
                     , tdm34_role_allc_date         AS tdm30_role_allc_date
                     , tdm34_appr_id                AS tdm30_appr_id
                     , tdm34_role_allc_detail_id    AS tdm30_role_allc_detail_id
                  FROM tdm30_role_allc
                       INNER JOIN tdm34_role_allc_detail ON tdm34_role_allc_id = tdm30_role_allc_id
                       LEFT  JOIN apr01_appr             ON apr01_appr_id      = tdm34_appr_id
                 WHERE tdm30_company_id = p_company_id
                   AND ( ( p_appr_yn                        = true  AND
                           COALESCE(apr01_status_cd,'99')   = '30'  ) OR
                         ( p_appr_yn                       != true  ) )
                   AND p_std_date IS NULL
                 UNION ALL
                SELECT tdm30_role_allc_id           AS tdm30_role_allc_id
                     , tdm30_company_id             AS tdm30_company_id
                     , tdm30_role_id                AS tdm30_role_id
                     , tdm30_person_id              AS tdm30_person_id
                     , tdm30_add_title_yn           AS tdm30_add_title_yn
                     , tdm34_reg_reason             AS tdm30_reg_reason
                     , tdm34_deputy_emp_nm          AS tdm30_deputy_emp_nm
                     , tdm30_start_date             AS tdm30_start_date
                     , tdm30_end_date               AS tdm30_end_date
                     , tdm34_role_allc_date         AS tdm30_role_allc_date
                     , tdm34_appr_id                AS tdm30_appr_id
                     , tdm34_role_allc_detail_id    AS tdm30_role_allc_detail_id
                  FROM tdm30_role_allc
                       INNER JOIN tdm34_role_allc_detail ON tdm34_role_allc_id = tdm30_role_allc_id
                       LEFT  JOIN apr01_appr             ON apr01_appr_id      = tdm34_appr_id
                 WHERE tdm30_company_id = p_company_id
                   AND p_std_date BETWEEN tdm30_start_date AND COALESCE(tdm30_end_date,'9999-12-31'::date)
                   AND ( ( p_appr_yn                        = true  AND
                           COALESCE(apr01_status_cd,'99')   = '30'  ) OR
                         ( p_appr_yn                       != true  ) )
                   AND tdm34_role_allc_date = ( SELECT MAX(tdm34_role_allc_date)
                                                  FROM tdm34_role_allc_detail
                                                 WHERE tdm34_role_allc_id    = tdm30_role_allc_id
                                                   AND tdm34_role_allc_date <= p_std_date )
                   AND p_std_date IS NOT NULL
           ) t;

$function$
```
