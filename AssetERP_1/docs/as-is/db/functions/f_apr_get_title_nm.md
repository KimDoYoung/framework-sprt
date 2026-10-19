# f_apr_get_title_nm

## FUNCTION public.f_apr_get_title_nm(p_emp_id numeric, p_date timestamp without time zone)

- 반환: `character varying`
- 줄 수: 37

```sql
CREATE OR REPLACE FUNCTION public.f_apr_get_title_nm(p_emp_id numeric, p_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE  
    o_title_name    varchar(200); 
  
begin 
    if  p_emp_id    is    null    then  
        return    null;  
    elsif 
        p_date        is    null    then  
        return    null;  
    end if; 
  
    begin 
        select emp00_title_nm || ' ' || f_emp_kor_nm(emp00_person_id) --emp00_kor_nm 
        into   strict o_title_name 
        from   emp00_trans_info 
         
        where  emp00_person_id = p_emp_id 
 		and	   emp00_all_title = 0
        and    emp00_trans_date  
               = (select max(x.emp03_trans_date) 
                  from   emp03_trans x 
                  where  x.emp03_person_id = emp00_person_id 
                  and    x.emp03_trans_date <= p_date 
                ) 
        ; 
    exception    when    NO_DATA_FOUND    then 
        return    '사원정보를 찾을 수 없습니다.';  
    end; 
     
    return    o_title_name; 
  
end;$function$
```
