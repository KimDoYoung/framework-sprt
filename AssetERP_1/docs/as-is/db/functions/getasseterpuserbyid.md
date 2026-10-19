# getasseterpuserbyid

## FUNCTION public.getasseterpuserbyid(p_person_id numeric)

- 반환: `TABLE(company_id numeric, company_nm character varying, company_domain character varying, company_tel_no character varying, company_fax_no character varying, company_addr character varying, company_mail_info character varying, emp_id numeric, emp_no character varying, emp_nm character varying, email_addr character varying, email_pw character varying, mobile_telno character varying, org_cd character varying, org_nm character varying, title_cd character varying, pos_cd character varying, pos_nm character varying, retire_yn character varying, pw character varying, int_tel_no character varying)`
- 줄 수: 42

```sql
CREATE OR REPLACE FUNCTION public.getasseterpuserbyid(p_person_id numeric)
 RETURNS TABLE(company_id numeric, company_nm character varying, company_domain character varying, company_tel_no character varying, company_fax_no character varying, company_addr character varying, company_mail_info character varying, emp_id numeric, emp_no character varying, emp_nm character varying, email_addr character varying, email_pw character varying, mobile_telno character varying, org_cd character varying, org_nm character varying, title_cd character varying, pos_cd character varying, pos_nm character varying, retire_yn character varying, pw character varying, int_tel_no character varying)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$

    SELECT emp00_company_id                                                         AS company_id
         , sys01_company_nm                                                         AS company_nm
         , sys01_loc_nm                                                             AS company_domain
         , sys01_office_tel_no                                                      AS company_tel_no
         , sys01_office_fax_no                                                      AS company_fax_no
         , CONCAT('('||sys01_zip_cd||')', sys01_zip_addr, ' '||sys01_zip_detail)    AS company_addr
         , sys01_mail_info                                                          AS company_mail_info
         , emp00_person_id                                                          AS emp_id
         , emp00_emp_no                                                             AS emp_no
         , emp00_kor_nm                                                             AS emp_nm
         , emp00_email_addr                                                         AS email_addr
         , emp00_email_pw                                                           AS email_pw
         , emp00_mobile_telno                                                       AS mobile_telno
         , emp00_org_cd                                                             AS org_cd
         , emp00_org_code_nm                                                        AS org_nm
         , emp00_title_cd                                                           AS title_cd
         , emp00_pos_cd                                                             AS pos_cd
         , f_cdnm('EmpPosCode', emp00_pos_cd, emp00_company_id, f_today())          AS pos_nm
         , CASE WHEN emp00_trans_cd = '900' THEN 'Y' ELSE '' END                    AS retire_yn
         , ( SELECT sys25_pwd
               FROM sys25_password
              WHERE sys25_person_id  = emp00_person_id
                --AND sys25_work_date <= f_today()
              ORDER BY sys25_password_id DESC
              LIMIT 1 )                                                             AS pw
         , emp00_office_detail                                                      AS int_tel_no
      FROM emp01_person
           INNER JOIN getPerson(emp01_company_id, f_today()) ON emp00_person_id  = emp01_person_id
           INNER JOIN sys01_company                          ON sys01_company_id = emp01_company_id
     WHERE emp01_person_id = p_person_id
    ;

$function$
```
