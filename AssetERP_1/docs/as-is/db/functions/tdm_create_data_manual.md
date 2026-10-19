# tdm_create_data_manual

## FUNCTION public.tdm_create_data_manual(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)

- 반환: `text`
- 줄 수: 188

```sql
CREATE OR REPLACE FUNCTION public.tdm_create_data_manual(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)
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
	

		rr.sys99_string01 := 'MANL_OVERVIEW';

        select *
        from   tdm42_manl_org 
        into   R_tdm42_manl_org
        where  tdm42_manl_org_id = p_id  ;
    
        IF NOT FOUND THEN
            RAISE NOTICE 'Job not foud in R_tdm42_manl_org  ' ;
            RETURN 'N';
        END IF;

		-- 20260520 화면의 일자를 무시하고  메뉴얼 시작일을 이용한다 
		w_std_date := R_tdm42_manl_org.tdm42_start_date;

        ------------------------------------------
        for r1 in
            select  f_org_nm(R_tdm42_manl_org.tdm42_org_id, f_today())   org_nm 
                , tdm20_role_nm 
                , tdm01_person_nm  
                , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
                , R_tdm42_manl_org.tdm42_start_date    start_date
            from   getTdm30RoleAllc(R_tdm42_manl_org.tdm42_company_id, w_std_date, false)
            left outer join tdm20_role
            on     tdm30_role_id = tdm20_role_id
            left outer join tdm01_hr
            on     tdm30_person_id =  tdm01_person_id
            where  tdm30_role_id    = R_tdm42_manl_org.tdm42_role_id
        LOOP
            
            rr.sys99_text01  := '   1) 부서 : ' || r1.org_nm  ;
            rr.sys99_print_id := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;

            rr.sys99_text01  := '   2) 직책 : ' || r1.tdm20_role_nm  ;
            rr.sys99_print_id := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;

            rr.sys99_text01  := '   3) 임원 : ' || r1.tdm01_person_nm  || ' ' || r1.pos_nm ;
            rr.sys99_print_id := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;

            rr.sys99_text01  := '   4) 적용시작일 : ' || to_char( r1.start_date ,'yyyy-mm-dd') ;
            rr.sys99_print_id := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;



       ------------------------------------------
        rr.sys99_string01 := 'MANL_DETAIL';
        rr.sys99_text01   := '책무';  rr.sys99_text02 := '책무 세부내용';  rr.sys99_text03  := '주요 관리의무';  rr.sys99_text04 := null;
        rr.sys99_long01   := null;
        rr.sys99_long02   := 0;  

        rr.sys99_long10 :=0;
        rr.sys99_long11 :=0;
        rr.sys99_print_id := f_create_seq() ;
        INSERT INTO sys99_print  SELECT (rr).*;

        for r1 in
            select distinct tdm43_task_id, tdm10_task_nm, tdm10_task_type_cd
            from   tdm43_manl
            join   tdm10_task
            on     tdm43_task_id       = tdm10_task_id
            where  tdm43_manl_org_id   = R_tdm42_manl_org.tdm42_manl_org_id 
            order by tdm43_task_id
        LOOP

            -- 책무명 
            rr.sys99_string01 := 'MANL_DETAIL';
            rr.sys99_long01   := r1.tdm43_task_id;
            rr.sys99_text01   := r1.tdm10_task_nm;    rr.sys99_text02 := null;  rr.sys99_text03  := null;  rr.sys99_text04 := null;

            for r2 in 
                with lists
                as (
                    select distinct tdm43_task_id, tdm43_task_relate_detail_id , tdm43_task_relate_duty_id
                    from   tdm43_manl
                    where  tdm43_manl_org_id   = R_tdm42_manl_org.tdm42_manl_org_id 
                    and    tdm43_task_id       = r1.tdm43_task_id
                )
                select tdm43_task_relate_detail_id, tdm43_task_relate_duty_id
                    , (select tdm12_content from  tdm12_task_relate_detail where  tdm12_task_relate_detail_id = a.tdm43_task_relate_detail_id ) detail_nm
                    , (select tdm13_content from  tdm13_task_relate_duty   where  tdm13_task_relate_duty_id   = a.tdm43_task_relate_duty_id ) duty_nm
                    , row_number() over (   partition by tdm43_task_id       order by tdm43_task_relate_detail_id, tdm43_task_relate_duty_id   ) as seq
                from  lists a
                order by tdm43_task_id, tdm43_task_relate_detail_id, tdm43_task_relate_duty_id

            loop

                rr.sys99_long10 := rr.sys99_long10  +1; 

                rr.sys99_text02 := r2.detail_nm;  rr.sys99_text03  := substr( rr.sys99_long10 || ') ' || rtrim( r2.duty_nm)  ,1,400); 
                rr.sys99_print_id := f_create_seq() ;
                INSERT INTO sys99_print  SELECT (rr).*;

            END Loop;


            --  책무이행을 위한 관리의무 
            rr.sys99_string01 := 'MANL_CHCK';
            rr.sys99_text01   := '책무 점검방법';  rr.sys99_text02 := null;  rr.sys99_text03  := null;  rr.sys99_text04 := null;
            rr.sys99_long01   := 0;
            rr.sys99_long02   := 0;

            for r2 in 
                select tdm43_org_id -- , tdm43_person_id
                        , tdm43_task_id,  tdm43_task_relate_detail_id , tdm43_task_relate_duty_id
                        , tdm12_seq detail_seq , tdm12_content  detail_nm 
                        , tdm13_seq duty_seq,    tdm13_content  duty_nm 
                        , tdm43_check_item, tdm43_check_how
                        , tdm43_check_cycle_cd,  f_cdnm ('CycleCode', tdm43_check_cycle_cd, 0,  f_sysdate() )   check_cycle_nm
                        /*, tdm43_check_evid_type, f_cdnm ('TdmEvidType', tdm43_check_evid_type, 0,  f_sysdate() )  check_evid_type_nm*/
                        , tdm43_check_evid_doc_nm
						, case when coalesce( tdm43_start_date, w_std_date+1) > w_std_date then to_char(tdm43_start_date,'yyyymmdd')  end start_date 
                from tdm43_manl
                left outer join tdm12_task_relate_detail  
                on  tdm43_task_relate_detail_id = tdm12_task_relate_detail_id
                left outer join tdm13_task_relate_duty  
                on  tdm43_task_relate_duty_id = tdm13_task_relate_duty_id
                where tdm43_manl_org_id   = R_tdm42_manl_org.tdm42_manl_org_id 
                and   tdm43_task_id       = r1.tdm43_task_id
                order by tdm43_role_id, tdm43_task_id,  tdm43_task_relate_detail_id , tdm43_task_relate_duty_id 
            loop

                if rr.sys99_long01   <> r2.tdm43_task_relate_duty_id then

                    rr.sys99_long01   := r2.tdm43_task_relate_duty_id;
                    rr.sys99_long11   := rr.sys99_long11 +1;
                    rr.sys99_string12 := substr( rr.sys99_long11 || ') ' || r2.duty_nm ,1,400) ;
                end if;

                rr.sys99_text01    := r2.detail_nm;

                -- rr.sys99_text02    := r2.duty_nm;
                rr.sys99_text03    := r2.tdm43_check_item;
                rr.sys99_text04    := r2.tdm43_check_how;
                rr.sys99_text05    := r2.check_cycle_nm;
                rr.sys99_text06    := r2.tdm43_check_evid_doc_nm;
				rr.sys99_text07    := r2.start_date;
  

                rr.sys99_print_id  := f_create_seq() ;
                INSERT INTO sys99_print  SELECT (rr).*;

            END Loop;

        END LOOP;
 

		RETURN  'Y';

	END;
	$function$
```
