# f_account_nm_allpath

## FUNCTION public.f_account_nm_allpath(p_account_id numeric)

- 반환: `character varying`
- 줄 수: 49

```sql
CREATE OR REPLACE FUNCTION public.f_account_nm_allpath(p_account_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    w_account_allpath_name   varchar(1000);
BEGIN
    WITH RECURSIVE class_list ( act01_account_cd
                              , act01_parent_cd
                              , act01_account_nm
                              , act01_attribute_cd
                              , DEPTH
                              , PATH
    ) AS (
            /** 시작 조건 */
            SELECT act01_account_cd
                 , act01_parent_cd
                 , act01_account_nm
                 , act01_attribute_cd
                 , 1
                 , ARRAY[act01_account_nm::text]
              FROM act01_account_code
             WHERE act01_account_code_id = p_account_id 
             UNION ALL           
            /** 하위 데이터 반복 */
            SELECT a.act01_account_cd
                 , a.act01_parent_cd
                 , a.act01_account_nm
                 , a.act01_attribute_cd
                 , b.DEPTH+1
                 , ARRAY_APPEND(B.PATH, a.act01_account_nm::text)
              FROM act01_account_code a
                 , class_list b 
             WHERE 1=1
               AND b.act01_parent_cd = a.act01_account_cd 
   )
   /** VIEW */
   SELECT array_to_string(array_reverse(path),'/','')
     INTO w_account_allpath_name
     FROM CLASS_LIST 
    ORDER BY path DESC
    LIMIT 1 ;

   RETURN w_account_allpath_name;

END;
$function$
```
