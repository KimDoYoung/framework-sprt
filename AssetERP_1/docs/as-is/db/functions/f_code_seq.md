# f_code_seq

## FUNCTION public.f_code_seq(v_company_id numeric, v_kind_cd character varying, v_code character varying)

- 반환: `character varying`
- 줄 수: 28

```sql
CREATE OR REPLACE FUNCTION public.f_code_seq(v_company_id numeric, v_kind_cd character varying, v_code character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE 
    v_seq       varchar(400);

begin

    begin 
        select case when sys09_seq is null then sys09_code else sys09_seq end 
          into strict v_seq
          from sys09_code
             , sys08_code_kind
         where sys08_code_kind_id = sys09_code_kind_id
           and sys09_company_id = v_company_id
           and sys08_kind_cd = v_kind_cd
           and sys09_code = v_code
           ; 
    exception 
    when NO_DATA_FOUND then
        return ''; 
    end;
    
    return v_seq ; 
 
end;$function$
```
