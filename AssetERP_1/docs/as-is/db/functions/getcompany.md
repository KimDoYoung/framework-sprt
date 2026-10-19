# getcompany

## FUNCTION public.getcompany()

- 반환: `TABLE(company_id numeric, company_nm character varying, company_domain character varying, company_tel_no character varying, company_fax_no character varying, company_addr character varying, company_mail_info character varying)`
- 줄 수: 22

```sql
CREATE OR REPLACE FUNCTION public.getcompany()
 RETURNS TABLE(company_id numeric, company_nm character varying, company_domain character varying, company_tel_no character varying, company_fax_no character varying, company_addr character varying, company_mail_info character varying)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$

    SELECT sys01_company_id                                                         AS company_id
         , sys01_company_nm                                                         AS company_nm
         , sys01_loc_nm                                                             AS company_domain
         , sys01_office_tel_no                                                      AS company_tel_no
         , sys01_office_fax_no                                                      AS company_fax_no
         , CONCAT('('||sys01_zip_cd||')', sys01_zip_addr, ' '||sys01_zip_detail)    AS company_addr
         , sys01_mail_info                                                          AS company_mail_info
      FROM sys01_company
     WHERE sys01_company_id NOT IN (0,10,20,30,40)
       AND COALESCE(sys01_use_yn, 'false') = 'true'
    ;

$function$
```
