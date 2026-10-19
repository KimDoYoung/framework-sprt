# f_emp_kor_nm

## FUNCTION public.f_emp_kor_nm(p_person_id numeric)

- 반환: `character varying`
- 줄 수: 35

```sql
CREATE OR REPLACE FUNCTION public.f_emp_kor_nm(p_person_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
declare 
    o_kor_name    varchar(200);
begin
    if  p_person_id is  null    then 
        return  null; 
    end if; 

    -- 관리자용 person_id ---------
    if p_person_id = 9000100 then
        return 'batchFundFee';
    ELSIF p_person_id = 9000200 then
        return 'kfs_admin';
    end if;
    -------------------------------

    begin
        select  emp01_kor_nm
        into    strict o_kor_name
        from    emp01_person
        where   emp01_person_id =   p_person_id
        ;
    exception   when    NO_DATA_FOUND   then
        return  'EMP_NAME을 찾을 수 없습니다.'; 
    end;
    
    return  o_kor_name;

end;
$function$
```
