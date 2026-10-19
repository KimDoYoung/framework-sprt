# tdm_create_data_digm

## FUNCTION public.tdm_create_data_digm(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)

- 반환: `text`
- 줄 수: 213

```sql
CREATE OR REPLACE FUNCTION public.tdm_create_data_digm(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
	declare
	    r1      record;
	    r2      record;
	
	    w_person_id    tdm31_role_desc.tdm31_person_id%type;
	    rr sys99_print%ROWTYPE;
	    v_rowcount     integer;
	    w_tmp_cnt       integer;

	    r_tdm53           tdm53_chck_exct%ROWTYPE;
	    R_tdm42_manl_org  tdm42_manl_org%ROWTYPE;
		check_cnt integer := 0;

 	BEGIN

	    rr := null;
	    
	    rr.sys99_company_id := p_company_id;
	    rr.sys99_person_id  := p_emp_id;
	    rr.sys99_group_id   := p_sys99_group_id;
	
	    delete from sys99_print 
	    where  sys99_company_id   = rr.sys99_company_id
	    and    sys99_person_id    = rr.sys99_person_id
	    and    sys99_group_id     = rr.sys99_group_id;


      ----------------------------------
        -- 책무리스트 
        rr.sys99_string01 := 'DIGM_TASK';
        rr.sys99_long01   := null;
        
        rr.sys99_text01   := '지정책임자책무';  rr.sys99_text02 := null;  rr.sys99_text03  := '금융영업책무';  rr.sys99_text04 := null;  rr.sys99_text05  := '경영관리책무';  rr.sys99_text06 := null; 
        rr.sys99_long02   := 0;
        rr.sys99_print_id := f_create_seq() ;
        INSERT INTO sys99_print  SELECT (rr).*;
            
        -- 첫 번째 LOOP
        FOR r1 IN
            with lists
            as (
                select    tdm10_company_id, tdm10_task_class_cd,   tdm10_task_type_cd
                    -- ,  f_cdnm ('TdmTaskCode', tdm10_task_type_cd, 0,  f_sysdate() )   tdm10_task_type_nm
                    , (select tdm14_task_type_nm from tdm14_task_type 
                        where tdm14_company_id = a.tdm10_company_id and   tdm14_task_type_cd = a.tdm10_task_type_cd limit 1 ) tdm10_task_type_nm  
                    , row_number() over (   partition by tdm10_task_class_cd   order by cast (substr( tdm10_task_type_cd,2) as numeric  ))  as seq
                from   tdm10_task  a
                where  tdm10_company_id = p_company_id 
                and    tdm10_start_date <= w_std_date
                and    coalesce(tdm10_end_date, w_std_date + 1)  >= w_std_date
                group by tdm10_company_id, tdm10_task_class_cd,   tdm10_task_type_cd
            )
            select 
                 max( case when  tdm10_task_class_cd = 'A' then tdm10_task_type_cd end ) A_cd 
                ,max( case when  tdm10_task_class_cd = 'A' then tdm10_task_type_nm end ) A_nm
                ,max( case when  tdm10_task_class_cd = 'B' then tdm10_task_type_cd end ) B_cd 
                ,max( case when  tdm10_task_class_cd = 'B' then tdm10_task_type_nm end ) B_nm
                ,max( case when  tdm10_task_class_cd = 'C' then tdm10_task_type_cd end ) C_cd 
                ,max( case when  tdm10_task_class_cd = 'C' then tdm10_task_type_nm end ) C_nm
            from  lists
            group by seq
            order by seq
        LOOP
            rr.sys99_text01   := r1.A_cd;  rr.sys99_text02 := r1.A_nm;  rr.sys99_text03  := r1.B_cd;  rr.sys99_text04 := r1.B_nm;  rr.sys99_text05  := r1.C_cd;  rr.sys99_text06 := r1.C_nm; 

            rr.sys99_long02   := rr.sys99_long02 +1;
            rr.sys99_print_id := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;

        END LOOP;

        ----------------------------------------------------------------
        -- 직책 리스트 
        rr.sys99_string01 := 'DIGM_ROLE';
        rr.sys99_long01   := null;
        rr.sys99_text01   := '직책';  rr.sys99_text02 := '임원';  rr.sys99_text03  := '책무';  rr.sys99_text04 := '일자';  rr.sys99_text05  := null;   rr.sys99_text06 := null; 
        rr.sys99_long02   := 0;
        rr.sys99_print_id := f_create_seq() ;
        INSERT INTO sys99_print  SELECT (rr).*;

        for r1 in 
            select tdm20_role_id, tdm20_role_nm , tdm20_role_type, tdm20_role_type_etc_nm 
            from   tdm20_role
            where  tdm20_company_id = p_company_id
            and    tdm20_start_date <= w_std_date
            and    coalesce(tdm20_end_date, w_std_date + 1)  >= w_std_date
        Loop

            rr.sys99_string01 := 'DIGM_ROLE_' || r1.tdm20_role_type ;

            if   r1.tdm20_role_type ='A' then
                rr.sys99_string02        := '이사회의장';
            elsif r1.tdm20_role_type ='B' then  
                rr.sys99_string02        := '이사회지원';
            elsif r1.tdm20_role_type ='C' then  
                rr.sys99_string02         := '대표이사';
            elsif r1.tdm20_role_type ='D' then
                rr.sys99_string02         := '대표이사지원';
            elsif r1.tdm20_role_type ='E' then
                rr.sys99_string02         := r1.tdm20_role_type_etc_nm;
            end if;
  

            rr.sys99_text01         := r1.tdm20_role_nm;  -- 직책  

  
            -- rr.sys99_text02 := '임원';  rr.sys99_text03  := '책무';  rr.sys99_text04 := '일자'; 

            /*
            with lists
            as (
                select distinct  tdm10_task_type_cd  
                from   tdm10_task
                where  tdm10_task_id in (select tdm21_task_id from  tdm21_role_relate_task where  tdm21_role_id = r1.tdm20_role_id )
                and    tdm10_start_date <= to_date('20250701','yyyymmdd') 
                and    coalesce(tdm10_end_date, current_timestamp)  >= to_date('20250701','yyyymmdd')
            )
            select string_agg(tdm10_task_type_cd::text, ' ' order by tdm10_task_type_cd) as task_type_nm
            into   rr.sys99_text03
            from lists;
            */

            for r2 in
                with lists
                as (
                    select distinct  tdm10_task_type_cd  
                    from   tdm10_task
                    where  tdm10_task_id in (select tdm21_task_id from  tdm21_role_relate_task where  tdm21_role_id = r1.tdm20_role_id )
                    and    tdm10_start_date <= w_std_date
                    and    coalesce(tdm10_end_date, w_std_date + 1)  >= w_std_date
                )
                select tdm10_task_type_cd
                        , row_number() over (  order by tdm10_task_type_cd )   as seq
                        , mod( row_number() over (  order by tdm10_task_type_cd ), 5)    as grp_seq
                from lists
                order by 2
            loop

                if r2.seq = 1 then
                    rr.sys99_text03 := r2.tdm10_task_type_cd ;
                elsif r2.grp_seq = 1 then
                    rr.sys99_text03 := rr.sys99_text03 || chr(10) ||  r2.tdm10_task_type_cd ;
                else
                    rr.sys99_text03 := rr.sys99_text03 || ' ' ||  r2.tdm10_task_type_cd  ;
                end if;

            end loop;

            -- 여러명일수 있다
            w_tmp_cnt := 0;  
            for r2 in
                with lists
                as (/* (2025.11.25 CYY - tdm30_role_allc => getTdm30RoleAllc 변경)
                    select tdm30_role_allc_id, tdm30_role_id,  tdm01_person_nm,  tdm30_deputy_emp_nm
                        , tdm30_add_title_yn
                        , tdm01_pos_cd 
                        , tdm01_title_cd
                        , tdm01_org_id
                        , tdm01_org_nm
                        , tdm30_start_date
                        --, row_number() over (  partition by tdm30_role_id   order by tdm30_start_date desc )  as seq
                    from   tdm30_role_allc 
                    left outer join tdm01_hr
                    on     tdm30_person_id = tdm01_person_id
                    where  tdm30_role_id   = r1.tdm20_role_id
                    and    tdm30_start_date <= w_std_date
                    and    coalesce(tdm30_end_date, current_timestamp)  >= w_std_date
                    */
                    select tdm30_role_allc_id, tdm30_role_id,  tdm01_person_nm,  tdm30_deputy_emp_nm
                        , tdm30_add_title_yn
                        , tdm01_pos_cd 
                        , tdm01_title_cd
                        , tdm01_org_id
                        , tdm01_org_nm
                        , tdm30_role_allc_date
                    from   getTdm30RoleAllc(p_company_id, w_std_date, true)
                    left outer join tdm01_hr
                    on     tdm30_person_id = tdm01_person_id
                    where  tdm30_role_id   = r1.tdm20_role_id
                )
                select  tdm01_person_nm, tdm30_role_allc_date
                --into    rr.sys99_text02, rr.sys99_text04
                from    lists
            loop
        
                rr.sys99_text02   := r2.tdm01_person_nm ;
                rr.sys99_text04   := r2.tdm30_role_allc_date;
                w_tmp_cnt := w_tmp_cnt +1;  

                rr.sys99_print_id := f_create_seq() ;
                INSERT INTO sys99_print  SELECT (rr).*;

            End loop;

            -- 배정된 임원이 없어도 Write한다. 
            if w_tmp_cnt = 0 then
                rr.sys99_text02   := null ;
                rr.sys99_text04   := null ;
                rr.sys99_print_id := f_create_seq() ;
                INSERT INTO sys99_print  SELECT (rr).*;
            end if;

        End loop;
		RETURN  'Y';

	END;
	$function$
```
