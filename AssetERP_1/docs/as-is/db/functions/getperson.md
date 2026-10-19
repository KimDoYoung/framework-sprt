# getperson

## FUNCTION public.getperson(p_company_id numeric, p_std_date date)

- 반환: `TABLE(emp00_trans_id numeric, emp00_company_id numeric, emp00_person_id numeric, emp00_kor_nm character varying, emp00_emp_no character varying, emp00_email_addr character varying, emp00_email_pw character varying, emp00_mobile_telno character varying, emp00_hire_date date, emp00_retire_date date, emp00_trans_date date, emp00_trans_cd character varying, emp00_kind_cd character varying, emp00_pos_cd character varying, emp00_title_cd character varying, emp00_grade_cd character varying, emp00_duty character varying, emp00_non_stay_yn character varying, emp00_org_head_yn character varying, emp00_org_code_id numeric, emp00_org_cd character varying, emp00_org_code_nm character varying, emp00_org_head_nm character varying, emp00_officer_yn character varying, emp00_expiry_date date, emp00_tdm_target_yn character varying, emp00_director_yn character varying, emp00_office_detail character varying)`
- 줄 수: 76

```sql
CREATE OR REPLACE FUNCTION public.getperson(p_company_id numeric, p_std_date date)
 RETURNS TABLE(emp00_trans_id numeric, emp00_company_id numeric, emp00_person_id numeric, emp00_kor_nm character varying, emp00_emp_no character varying, emp00_email_addr character varying, emp00_email_pw character varying, emp00_mobile_telno character varying, emp00_hire_date date, emp00_retire_date date, emp00_trans_date date, emp00_trans_cd character varying, emp00_kind_cd character varying, emp00_pos_cd character varying, emp00_title_cd character varying, emp00_grade_cd character varying, emp00_duty character varying, emp00_non_stay_yn character varying, emp00_org_head_yn character varying, emp00_org_code_id numeric, emp00_org_cd character varying, emp00_org_code_nm character varying, emp00_org_head_nm character varying, emp00_officer_yn character varying, emp00_expiry_date date, emp00_tdm_target_yn character varying, emp00_director_yn character varying, emp00_office_detail character varying)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$

    WITH org_head AS ( SELECT emp03_org_code_id                 org_id
                            , STRING_AGG(emp01_kor_nm, ', ')    org_head_nm
                         FROM emp01_person
                              INNER JOIN emp03_trans ON (    emp03_person_id  = emp01_person_id
                                                         AND emp03_trans_date = ( SELECT MAX(emp03_trans_date)
                                                                                    FROM emp03_trans
                                                                                   WHERE emp03_person_id   = emp01_person_id
                                                                                     AND emp03_trans_date <= p_std_date ) )
                        WHERE emp01_company_id = CASE WHEN p_company_id = 0 THEN emp01_company_id
                                                      ELSE p_company_id END
                          AND emp03_trans_cd NOT IN ('900')
                          AND coalesce(emp03_org_head_yn,'false') = 'true'
                        GROUP BY emp03_org_code_id
    )
    SELECT emp03_trans_id                                                               AS emp00_trans_id
         , emp01_company_id                                                             AS emp00_company_id
         , emp01_person_id                                                              AS emp00_person_id
         , emp01_kor_nm                                                                 AS emp00_kor_nm
         , emp01_emp_no                                                                 AS emp00_emp_no
         , emp01_email_addr                                                             AS emp00_email_addr
         , emp01_password                                                               AS emp00_email_pw
         , emp01_mobile_telno                                                           AS emp00_mobile_telno
         , emp01_hire_date                                                              AS emp00_hire_date
         , (CASE WHEN emp03_trans_cd = '900' THEN emp03_trans_date
                 WHEN emp03_trans_cd = '800' THEN ( SELECT COALESCE(emp04_close_date,'2999-12-31'::date)
                                                      FROM emp04_add_title
                                                     WHERE emp04_add_person_id = emp01_person_id
                                                     LIMIT 1 )
                 ELSE NULL END)::date                                                   AS emp00_retire_date
         , emp03_trans_date::date                                                       AS emp00_trans_date
         , emp03_trans_cd                                                               AS emp00_trans_cd
         , emp03_kind_cd                                                                AS emp00_kind_cd
         , emp03_pos_cd                                                                 AS emp00_pos_cd
         , emp03_title_cd                                                               AS emp00_title_cd
         , emp03_grade_cd                                                               AS emp00_grade_cd
         , emp03_duty                                                                   AS emp00_duty
         , emp03_non_stay_yn                                                            AS emp00_non_stay_yn
         , emp03_org_head_yn                                                            AS emp00_org_head_yn
         , emp03_org_code_id                                                            AS emp00_org_code_id
         , org01_org_cd                                                                 AS emp00_org_cd
         , org02_kor_nm                                                                 AS emp00_org_code_nm
         , org_head_nm                                                                  AS emp00_org_head_nm
         , emp03_officer_yn                                                             AS emp00_officer_yn
         , emp03_expiry_date                                                            AS emp00_expiry_date
         , emp03_tdm_target_yn                                                          AS emp00_tdm_target_yn
         , emp03_director_yn                                                            AS emp00_director_yn
         , emp01_office_detail                                                          AS emp00_office_detail
      FROM emp01_person
           INNER JOIN emp03_trans ON (    emp03_person_id  = emp01_person_id
                                      AND emp03_trans_date = ( SELECT MAX(emp03_trans_date)
                                                                 FROM emp03_trans
                                                                WHERE emp03_person_id   = emp01_person_id
                                                                  AND emp03_trans_date <= p_std_date ) )
           INNER JOIN org01_code ON      org01_code_id  = emp03_org_code_id
           INNER JOIN org02_info ON (    org02_code_id  = emp03_org_code_id
                                     AND org02_mod_date = ( SELECT MAX(org02_mod_date)
                                                              FROM org02_info
                                                             WHERE org02_code_id   = emp03_org_code_id
                                                               AND org02_mod_date <= CASE WHEN emp03_trans_cd = '900'
                                                                                          THEN emp03_trans_date
                                                                                          ELSE p_std_date END ) )
           LEFT OUTER JOIN org_head ON org_id = emp03_org_code_id
     WHERE emp01_company_id = CASE WHEN p_company_id = 0 THEN emp01_company_id
                                   ELSE p_company_id END
    ;

$function$
```
