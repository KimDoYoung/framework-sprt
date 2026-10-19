# f_org_parent_full_nm

## FUNCTION public.f_org_parent_full_nm(p_org_id numeric, p_date timestamp without time zone)

- 반환: `character varying`
- 줄 수: 84

```sql
CREATE OR REPLACE FUNCTION public.f_org_parent_full_nm(p_org_id numeric, p_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE   
    o_kor_name      varchar(200);
    w_org_code_id   numeric;
    w_date          timestamp;
    
begin
    if  p_org_id    is  null    then    
        return  null;
    end if;
    
    if  p_date      is  null    then
        w_date  :=  f_sysdate();
    else
        w_date  :=  p_date;
    end if;
    
    w_org_code_id   :=  p_org_id;
    
    with recursive dep_list(org02_parent_code_id, org02_code_id, org02_kor_nm, org02_level_cd, depth, path, cycle) as
    (
        /** 시작 조건*/
        select 
              a.org02_parent_code_id
            , a.org02_code_id
            , a.org02_kor_nm
            , a.org02_level_cd
            , 0
            , ARRAY[a.org02_kor_nm::text]
            , false
        from 
            org02_info a
        where  1=1
            and org02_code_id   =   w_org_code_id
            and org02_mod_date  =   (   select  max(x.org02_mod_date)
                                          from  org02_info  x
                                         where  x.org02_code_id =   a.org02_code_id 
                                           and  x.org02_mod_date    <=  w_date
                                        )           
        union all 
        /** 하위 조건 */
        select 
              a.org02_parent_code_id
            , a.org02_code_id
            , a.org02_kor_nm
            , a.org02_level_cd
            , b.depth + 1
            , array_append(b.path, a.org02_kor_nm::text) 
            , a.org02_kor_nm = any(b.path)
        from 
            org02_info a , dep_list b
        where  1=1
            and b.org02_parent_code_id = a.org02_code_id
            and a.org02_mod_date =  (   select  max(x.org02_mod_date)
                                          from  org02_info  x
                                         where  x.org02_code_id =   a.org02_code_id 
                                           and  x.org02_mod_date    <=  w_date
                                        )
            and not cycle
    )
    /** view query */
    select 
        case array_length(path,1)
        when 1 then 
            org02_kor_nm 
        else
            array_to_string( array_reverse(path[1:array_upper(path, 1) - 1]),'-')
        end 
        into o_kor_name
    from
        dep_list
    where 1=1
    order by path desc
    LIMIT 1 ;

    return  o_kor_name;
    
exception   when others then 
    return ''; 
end;$function$
```
