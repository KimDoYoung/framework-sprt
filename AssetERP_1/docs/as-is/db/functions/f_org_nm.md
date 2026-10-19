# f_org_nm

## FUNCTION public.f_org_nm(p_org_id numeric, p_date timestamp without time zone)

- 반환: `character varying`
- 줄 수: 32

```sql
CREATE OR REPLACE FUNCTION public.f_org_nm(p_org_id numeric, p_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE 
    o_org_name varchar(200);
 
begin
    if p_org_id is null then 
        return null; 
    elsif p_date is null then 
        return null; 
    end if;

    begin
        select  org02_kor_nm
          into  strict o_org_name
          from  org02_info a
         where  org02_code_id  = p_org_id
           and  org02_mod_date = ( select max(x.org02_mod_date)
                                     from org02_info x
                                    where x.org02_code_id  = a.org02_code_id 
                                      and x.org02_mod_date <= p_date ) 
        ;
    exception when NO_DATA_FOUND then
        return ''; 
    end;
    
    return o_org_name;
 
end;$function$
```
