# f_cdnm

## FUNCTION public.f_cdnm(av_code_kind character varying, av_code character varying, av_company_id numeric, av_date timestamp without time zone)

- 반환: `character varying`
- 줄 수: 58

```sql
CREATE OR REPLACE FUNCTION public.f_cdnm(av_code_kind character varying, av_code character varying, av_company_id numeric, av_date timestamp without time zone)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
 DECLARE 
	code_name	varchar(200);

begin
    
    if av_code is null then 
    	return null ; 
    end if; 

    IF av_code_kind = 'trCode' THEN
        SELECT ast05_tr_nm
          INTO code_name
          FROM ast05_tr_code
         WHERE ast05_company_id = av_company_id
           AND ast05_tr_cd      = av_code;
    ELSE
        select	t6.sys09_name
        into 	code_name
        from	sys09_code		t6
            ,	sys08_code_kind	t7
            ,	(
                    select	sys09_company_id
                        ,	sys09_code_kind_id
                        ,	sys09_code
                        ,	max(sys09_apply_date)	as	sys09_apply_date
                    from    sys09_code
                    where	sys09_code			=	av_code
                    and		sys09_apply_date	<=	av_date
                    group	by	sys09_company_id
                            ,	sys09_code_kind_id
                            ,	sys09_code
                )	x1
        where 	t6.sys09_company_id		=	x1.sys09_company_id
        and		t6.sys09_code_kind_id	=	x1.sys09_code_kind_id
        and		t6.sys09_code			=	x1.sys09_code
        and		t6.sys09_apply_date		=	x1.sys09_apply_date
        and		t6.sys09_code_kind_id	=	t7.sys08_code_kind_id
        and		t6.sys09_company_id		=	(case when t7.sys08_sys_yn = 'true' then 0 else av_company_id end )
        and		t7.sys08_kind_cd		=	av_code_kind
        and		t6.sys09_code			=	av_code
        ;
    END IF;

	return code_name  ; 
	    
exception 
when others then 

	return 'N/A : ' || av_code ; 

end;
$function$
```
