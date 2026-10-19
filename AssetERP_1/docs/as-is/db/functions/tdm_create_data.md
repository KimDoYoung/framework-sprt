# tdm_create_data

## FUNCTION public.tdm_create_data(p_job_tp character varying, p_ymd character varying, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)

- 반환: `character varying`
- 줄 수: 1395

```sql
CREATE OR REPLACE FUNCTION public.tdm_create_data(p_job_tp character varying, p_ymd character varying, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$

    /*
        p_job_tp 
            MK_DESC 직무기술서 
            MK_DIGM 직무체계도
            MK_MANUAL 업무매뉴얼 
            MK_CHCK 업무이행점검보고서
    */

    /*
        select tdm_create_data  ('MK_DESC', '20250926', tdm31_role_desc_id,  tdm31_company_id,   29041,  202507212358655 )
        from   tdm31_role_desc 
        where  tdm31_role_desc_id = 202509269072480  
        ;

        select tdm_create_data  ('MK_DESC', '20250701', 202508269012818,  28000,  202507212358656 ,  202507212358655 ) as test;

        select tdm_create_data  ('MK_MANUAL', '20251104', 202511049174330,  202510319166200,  202410303344462 ,  202511059190783 ) as test;
         
        select tdm_create_data  ('MK_DIGM', '20250701', 202508269012818,  28000,  202507212358656 ,  202507212358656 ) as test;
        
        -- 주식운용본부장 직책
        select tdm_create_data  ('MK_MANUAL', '20250701', 202507250000018,  28000,  202507212358656 ,  202507212358654 ) as test;

        select tdm_create_data  ('MK_MANUAL', '20250701', 202510149102895,  28000,  202507212358656 ,  202507212358654 ) as test;


         select tdm_create_data  ('MK_FSS_COVER', '20250701', 0,  202510319166200,  202410303344462 ,  202511059190783 ) as test;
         select tdm_create_data  ('MK_FSS_BOARD'::varchar, '20250701'::varchar, 0,  202510319166200,  202410303344462 ,  202511059190783 ) as test ;
         
        select tdm_create_data  ('MK_FSS_OVERVIEW', '20251230', 0,  28000,  202410303344462 ,  202511059190783 ) as test;


        Error :  function string(numeric) does not exist

select tdm_create_data(
  'MK_FSS_OVERVIEW'::varchar,
  '20250701'::varchar,
  0::numeric,
  28000::numeric,
  202410303344462::numeric,
  202511059190783::numeric
);

    */
    
BEGIN
/*
    CREATE OR REPLACE FUNCTION tdm_create_data_manual (w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric) 
    RETURNS text AS $inner$
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

        ------------------------------------------
        for r1 in
            select  f_org_nm(R_tdm42_manl_org.tdm42_org_id, f_today())   org_nm 
                , tdm20_role_nm 
                , tdm01_person_nm  
                , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
                , tdm30_role_allc_date
            from   getTdm30RoleAllc(R_tdm42_manl_org.tdm42_company_id, w_std_date, true)
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

            rr.sys99_text01  := '   4) 적용시작일 : ' || to_char( r1.tdm30_role_allc_date ,'yyyy-mm-dd') ;
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
                        , tdm43_check_evid_doc_nm
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
  

                rr.sys99_print_id  := f_create_seq() ;
                INSERT INTO sys99_print  SELECT (rr).*;

            END Loop;

        END LOOP;
 

        RETURN  'Y';

    END;
    $inner$ language plpgsql;

*/
/*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    CREATE OR REPLACE FUNCTION tdm_create_data_desc (w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric) 
    RETURNS text AS $inner$
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
        
       select tdm31_company_id,   tdm31_person_id 
        from   tdm31_role_desc 
        into   rr.sys99_company_id,  w_person_id
        where  tdm31_role_desc_id = p_id  ;
    
        IF NOT FOUND THEN
            RAISE NOTICE 'Job not foud in tdm31_role_desc  ' ;
            RETURN 'N';
        END IF;

    
        ------------------------------------------
        -- 첫 번째 LOOP
        FOR r1 IN
            with lists
            as (select tdm30_role_allc_id, tdm30_role_id, tdm20_role_nm, tdm01_person_nm, tdm30_deputy_emp_nm
                    , case when coalesce(tdm30_add_title_yn,'false') = 'false' then  tdm30_start_date end   tdm30_start_date
                    , case when coalesce(tdm30_add_title_yn,'false') = 'false' then  tdm20_role_nm end      main_role_nm 
                    --, case when coalesce(tdm30_add_title_yn,'false') = 'true'  then  tdm20_role_nm end      sub_role_nm 
                    , f_get_tdmPersonInfo(w_person_id, w_std_date,'3')                                      add_role_nm 
                    , tdm30_add_title_yn
                    , tdm01_pos_cd,  f_Cdnm('EmpPosCode',tdm01_pos_cd, tdm01_company_id, f_today() ) pos_nm
                    , tdm01_title_cd
                    , tdm01_org_id
                    , tdm01_org_nm
                    , row_number() over (   partition by tdm30_person_id       order by tdm30_add_title_yn    )  as seq
                from   getTdm30RoleAllc(p_company_id, w_std_date, true)
                left outer join tdm20_role
                on     tdm30_role_id = tdm20_role_id
                left outer join tdm01_hr
                on     tdm30_person_id = tdm01_person_id
                where  tdm30_person_id = w_person_id
            )
            select max(tdm01_person_nm)         person_nm
                , max(main_role_nm )            main_role_nm 
                --, STRING_AGG( distinct sub_role_nm, ', ') as sub_role_nm
                , max(tdm01_org_nm)             org_nm
                , max(tdm01_title_cd)           title_nm
                , max(pos_nm)                   pos_nm
                --, case when max(add_role_nm) is null  and  max(sub_role_nm) is null   then  'N' else 'Y' end  add_role_yn 
                , case when coalesce(max(add_role_nm),'') = '' then  'N' else 'Y' end                   add_role_yn 
                , max( tdm30_start_date )                                                               role_start_date
                , case when coalesce(max(add_role_nm),'') = '' then 'N' else max(add_role_nm) end       add_role_nm
                , STRING_AGG( distinct tdm30_deputy_emp_nm, ', ')                                       deputy_emp_nm
            from   lists
        LOOP
    
            rr.sys99_string01 := 'DESC_HR';
    
            rr.sys99_text01   := '직책¹⁾';  rr.sys99_text02 := r1.main_role_nm;   rr.sys99_text03  := '성명';  rr.sys99_text04 := r1.person_nm;   rr.sys99_long01 := 0;
            rr.sys99_print_id := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;
    
            rr.sys99_text01   = '직위²⁾';  rr.sys99_text02 := r1.pos_nm;           rr.sys99_text03  := '현직책부여일';  rr.sys99_text04 := r1.role_start_date;   rr.sys99_long01 := 1;
            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;
    

--             rr.sys99_text01   := '겸직여부³?';  rr.sys99_text02 := r1.add_role_yn ;  rr.sys99_text03  := '겸직사항⁴?';  rr.sys99_text04 := r1.sub_role_nm   ;   rr.sys99_long01 := 2;
--          if r1.add_role_nm is  not null then
--              rr.sys99_text04 := r1.add_role_nm  || ' ' || r1.sub_role_nm   ;
--          end if; 
            rr.sys99_text01   := '겸직여부³⁾';  rr.sys99_text02 := r1.add_role_yn ;  rr.sys99_text03  := '겸직사항⁴⁾';  rr.sys99_text04 := r1.add_role_nm   ;   rr.sys99_long01 := 2;
            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;
    
    
            rr.sys99_text01  := '소관부서';  rr.sys99_text02 :=  r1.org_nm;       rr.sys99_text03  := '유고시 책무 대행자';  rr.sys99_text04 := r1.deputy_emp_nm;   rr.sys99_long01 := 3;
            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;
    
        END LOOP ;

        ------------------------------------------
        rr.sys99_string01 := 'DESC_CNCL';
        rr.sys99_text01   := '회의체명';  rr.sys99_text02 := '위원장/위원';       rr.sys99_text03  := '개최주기';  rr.sys99_text04 := '주요 심의·의결사항';
        rr.sys99_long01   := null;
        rr.sys99_long02   := 0;
        rr.sys99_print_id := f_create_seq() ;
        INSERT INTO sys99_print  SELECT (rr).*;

        for r1 in  
            with list_tdm30_role_allc
            as (
                select tdm30_role_allc_id, tdm30_role_id, tdm30_add_title_yn
                    , case when coalesce(tdm30_add_title_yn,'false') = 'false' then  1 else  2 end  tdm30_role_seq
                from   getTdm30RoleAllc(p_company_id, w_std_date, true)
                where  tdm30_person_id = w_person_id 
            )
            , list_2
            as (
                select  distinct tdm22_cncl_id cncl_id, tdm05_cncl_nm cncl_nm -- tdm22_role_relate_cncl_id, tdm22_role_id, 
                    , tdm22_member_type, f_cdnm ('TdmCnclMemberType', tdm22_member_type, 0,  f_sysdate() ) cncl_memb_tp_nm
                    , tdm05_open_cycle_cd, f_cdnm ( 'CycleCode', tdm05_open_cycle_cd, 0,  f_sysdate() ) open_cycle_nm
                    , tdm05_main_decision
                    -- , tdm14_start_date, tdm14_end_date, tdm14_upd_id, tdm14_upd_date
                from   tdm22_role_relate_cncl 
                join list_tdm30_role_allc
                on   tdm22_role_id = tdm30_role_id  
                left outer join tdm05_cncl
                on   tdm22_cncl_id = tdm05_cncl_id  
                where  tdm05_start_date <=w_std_date
                and    coalesce(tdm05_end_date, current_timestamp)  >= w_std_date
                -- order by tdm30_role_seq, tdm22_cncl_id
            )
            select cncl_id, cncl_nm 
                , string_agg(cncl_memb_tp_nm::text, ',' order by tdm22_member_type) as cncl_memb_tp_nm
                , max( open_cycle_nm) open_cycle_nm
                , max(tdm05_main_decision) main_decision  --, ;  rr.sys99_text02 := r1.cncl_memb_tp_nm;  rr.sys99_text03  := r1.open_cycle_nm;  rr.sys99_text04 := r1.tdm05_main_decision
            from  list_2
            group by  cncl_id, cncl_nm

        LOOP

            rr.sys99_text01   := r1.cncl_nm;  rr.sys99_text02 := r1.cncl_memb_tp_nm;  rr.sys99_text03  := r1.open_cycle_nm;  rr.sys99_text04 := r1.main_decision;
            rr.sys99_long02   := rr.sys99_long02 +1;
            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;
    
        END LOOP;

        -- 위원회 건수가 없으면  한 Record 를 만들어준다  
        if rr.sys99_long02  = 0 then

            rr.sys99_text01   := null;  rr.sys99_text02 := null;       rr.sys99_text03  := null;  rr.sys99_text04 := null;
            rr.sys99_long02   := rr.sys99_long02 +1;
            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;

        end if;

        ------------------------------------------

        rr.sys99_string01 := 'DESC_INTRO';
        rr.sys99_text01   := '책무개요';  rr.sys99_text02 := '책무 배분일자';  rr.sys99_text03  := null;  rr.sys99_text04 := null;
        rr.sys99_long01   := null;
        rr.sys99_long02   := 0;
        rr.sys99_print_id := f_create_seq() ;
        INSERT INTO sys99_print  SELECT (rr).*;

-- call p_log('kdj', 'w_person_id ' || w_person_id  ||  ' w_std_date ' || w_std_date  );


        for r1 in  
            select tdm30_role_allc_id, tdm30_role_id , tdm30_add_title_yn, tdm30_role_allc_date
                , case when tdm30_add_title_yn = 'false' then  1 else  2 end  tdm30_role_seq
                , tdm20_overview
            from   getTdm30RoleAllc(p_company_id, w_std_date, true)
            left outer join tdm20_role
            on   tdm30_role_id = tdm20_role_id 
            where  tdm30_person_id = w_person_id 
            order by   case when tdm30_add_title_yn = 'false' then  1 else  2 end,  tdm30_role_allc_id, tdm30_role_id
        LOOP
            rr.sys99_text01    := r1.tdm20_overview;  rr.sys99_text02 := r1.tdm30_role_allc_date;  
            rr.sys99_long02    := rr.sys99_long02 +1;
            rr.sys99_long01    := rr.sys99_long02 ;
            rr.sys99_long10    := r1.tdm30_role_id ;   -- Sub-page로 만들기 위한 부분

            rr.sys99_print_id  := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;
                
        END LOOP;

        ------------------------------------------
        rr.sys99_string01 := 'DESC_DETAIL';
        rr.sys99_text01   := '책무';  rr.sys99_text02 := '책무 세부내용';  rr.sys99_text03  := '관련 법령 및 내규';  rr.sys99_text04 := null;
        rr.sys99_long01   := null;
        rr.sys99_long02   := 0;
        rr.sys99_print_id := f_create_seq() ;
        INSERT INTO sys99_print  SELECT (rr).*;

        for r1 in
            SELECT DISTINCT
                   tdm35_task_id                                            AS tdm21_task_id
                 , tdm35_task_nm                                            AS tdm10_task_nm
                 , case when tdm30_add_title_yn is null then 1 else 2 end   AS add_title_yn_seq
                 , tdm30_role_id                                            AS tdm30_role_id
                 , tdm30_role_allc_detail_id                                AS tdm30_role_allc_detail_id
              FROM getTdm30RoleAllc(p_company_id, w_std_date, true)
                   INNER JOIN tdm35_role_allc_task ON tdm35_role_allc_detail_id = tdm30_role_allc_detail_id
             WHERE tdm30_person_id = w_person_id
             ORDER BY add_title_yn_seq, tdm30_role_id, tdm21_task_id

        LOOP

            rr.sys99_long01      := r1.tdm21_task_id;
            rr.sys99_string01 := 'DESC_DETAIL';
            rr.sys99_long10    := r1.tdm30_role_id ;  


            -- 책무명 
            rr.sys99_text01         := r1.tdm10_task_nm;    rr.sys99_text02 := null;  rr.sys99_text03  := null;  rr.sys99_text04 := null;

 
            -- 관련법규  
            for r2 in
                SELECT tdm11_relate_type
                     , string_agg(raw_nm::text, chr(10) order by seq) as raw_nms
                  FROM (
                         SELECT ROW_NUMBER() OVER(PARTITION BY tdm11_relate_type ORDER BY tdm11_rule_cd) seq
                              , tdm11_relate_type
                              , CASE WHEN tdm11_relate_type = '1' THEN '  - ' || f_cdnm('TdmLawCode', tdm11_rule_cd, 0, f_today())
                                     WHEN tdm11_relate_type = '2' THEN '  - ' || bbs15_title
                                     END raw_nm
                           FROM tdm11_task_relate_rule
                                LEFT JOIN LATERAL getCompanyRule(tdm11_company_id, tdm11_rule_cd) bbs15 ON TRUE
                          WHERE tdm11_task_id = r1.tdm21_task_id
                       ) t
                 GROUP BY tdm11_relate_type
            loop

                if r2.tdm11_relate_type='1' then
                    rr.sys99_text03 := '[관련법령]' || chr(10)  || r2.raw_nms ;

                elsif r2.tdm11_relate_type='2' then
                    rr.sys99_text03 := rr.sys99_text03 || chr(10) || '[관련내규]' || chr(10)  || r2.raw_nms ;
                end if;
                -- [관련내규] 
            end loop;


            -- 책무세부 
            for r2 in
                SELECT tdm35_task_relate_detail_nm                                                          AS tdm12_content
                     , row_number() over(partition by tdm35_task_id order by tdm35_task_relate_detail_id)   AS seq
                  FROM tdm35_role_allc_task
                 WHERE tdm35_role_allc_detail_id = r1.tdm30_role_allc_detail_id
                   AND tdm35_task_id             = r1.tdm21_task_id
                 GROUP BY tdm35_task_id, tdm35_task_relate_detail_id, tdm35_task_relate_detail_nm
                 ORDER BY tdm35_task_id, 2
            loop
                rr.sys99_long02    := r2.seq;
                rr.sys99_text02    := r2.tdm12_content;
                rr.sys99_print_id  := f_create_seq() ;
                INSERT INTO sys99_print  SELECT (rr).*;

            END Loop;

            --  책무이행을 위한 관리의무 
            rr.sys99_string01 := 'DESC_DUTY';
            rr.sys99_text01   := '책무 관리의무';  rr.sys99_text02 := null;  rr.sys99_text03  := null;  rr.sys99_text04 := null;
            rr.sys99_long01   := 0;
            rr.sys99_long02   := 0;
            rr.sys99_print_id := f_create_seq() ;

            for r2 in 
                SELECT tdm35_task_relate_duty_nm                                                            AS tdm13_content
                     , row_number() over(partition by tdm35_task_id order by tdm35_task_relate_detail_id)   AS seq
                     , tdm35_task_relate_detail_id                                                          AS tdm13_task_relate_detail_id
                     , tdm35_task_relate_detail_nm                                                          AS detail_nm
                  FROM tdm35_role_allc_task
                 WHERE tdm35_role_allc_detail_id = r1.tdm30_role_allc_detail_id
                   AND tdm35_task_id             = r1.tdm21_task_id
                 ORDER BY tdm35_task_relate_detail_id, 2
            loop
                check_cnt := check_cnt + 1;

                if rr.sys99_long01 <> r2.tdm13_task_relate_detail_id then
                    rr.sys99_long01    = r2.tdm13_task_relate_detail_id;

                    if check_cnt != 1 then
                        rr.sys99_text01    := null;  
                        rr.sys99_long02    := rr.sys99_long02 +1;
                        rr.sys99_print_id  := f_create_seq() ;
                        INSERT INTO sys99_print  SELECT (rr).*;
                    end if;

                    rr.sys99_text01   := ' ■ ' || r2.detail_nm;  
                    rr.sys99_long02   := rr.sys99_long02 +1;
                    rr.sys99_print_id := f_create_seq() ;
                    INSERT INTO sys99_print  SELECT (rr).*;

                end if;

                rr.sys99_long02   := rr.sys99_long02 +1;
                rr.sys99_text01   := '   - '  ||r2.tdm13_content;
                rr.sys99_print_id := f_create_seq() ;
                INSERT INTO sys99_print  SELECT (rr).*;

            END Loop;

        END LOOP;
        RETURN  'Y';

    END;
    $inner$ language plpgsql;

*/
/*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    CREATE OR REPLACE FUNCTION tdm_create_data_digm (w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric) 
    RETURNS text AS $inner$
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
                and    coalesce(tdm10_end_date, current_timestamp)  >= w_std_date
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
            and    coalesce(tdm20_end_date, current_timestamp)  >= w_std_date
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

            for r2 in
                with lists
                as (
                    select distinct  tdm10_task_type_cd  
                    from   tdm10_task
                    where  tdm10_task_id in (select tdm21_task_id from  tdm21_role_relate_task where  tdm21_role_id = r1.tdm20_role_id )
                    and    tdm10_start_date <= w_std_date
                    and    coalesce(tdm10_end_date, current_timestamp)  >= w_std_date
                )
                select tdm10_task_type_cd
                        , row_number() over (  order by tdm10_task_type_cd )   as seq
                        , mod( row_number() over (  order by tdm10_task_type_cd ), 4)    as grp_seq
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
                as (select tdm30_role_allc_id, tdm30_role_id,  tdm01_person_nm,  tdm30_deputy_emp_nm
                        , tdm30_add_title_yn
                        , tdm01_pos_cd 
                        , tdm01_title_cd
                        , tdm01_org_id
                        , tdm01_org_nm
                        , tdm30_start_date
                    from   getTdm30RoleAllc(p_company_id, w_std_date, true)
                    left outer join tdm01_hr
                    on     tdm30_person_id = tdm01_person_id
                    where  tdm30_role_id   = r1.tdm20_role_id
                )
                select  tdm01_person_nm, tdm30_start_date
                --into    rr.sys99_text02, rr.sys99_text04
                from    lists
            loop
        
                rr.sys99_text02   := r2.tdm01_person_nm ;
                rr.sys99_text04   := r2.tdm30_start_date;
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
    $inner$ language plpgsql;

*/
/*


    -------------------------------------------------------------------------------------------------------------------------------------------------------
    CREATE OR REPLACE FUNCTION tdm_create_data_chck (w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric) 
    RETURNS text AS $inner$
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

       SELECT *
          INTO r_tdm53
          FROM tdm53_chck_exct
         WHERE tdm53_chck_exct_id = p_id;

        --이행점검결과집계
        ----------------------------------------------------------------------------------------------------------------------------------------------------
        for r1 in
            SELECT t.*
              FROM (
                    SELECT tdm51_chck_org.*
                         , tdm20_role_nm                                                                                AS tdm51_role_nm                --직책
                         , f_emp_kor_nm(tdm51_exct_id)                                                                  AS tdm51_exct_nm                --임원
                         , COALESCE(task_cnt,0)                                                                         AS tdm51_task_cnt               --항목수_책무
                         , COALESCE(detail_cnt,0)                                                                       AS tdm51_detail_cnt             --항목수_책무세부
                         , COALESCE(duty_cnt,0)                                                                         AS tdm51_duty_cnt               --항목수_관리의무
                         , COALESCE(manl_cnt,0)                                                                         AS tdm51_manl_cnt               --항목수_점검항목
                         , COALESCE(month_check_cnt,0)                                                                  AS tdm51_month_check_cnt        --당월점검_점검건수
                         , COALESCE(month_check1_cnt,0)                                                                 AS tdm51_month_check1_cnt       --당월점검_적정
                         , COALESCE(month_check2_cnt,0)                                                                 AS tdm51_month_check2_cnt       --당월점검_미흡
                         , COALESCE(month_check9_cnt,0)                                                                 AS tdm51_month_check9_cnt       --당월점검_해당없음
                         , f_org_nm(tdm51_org_id, f_today())                                                            AS tdm51_org_nm
                         , '공통'                                                                                         AS tdm51_status
                      FROM tdm51_chck_org
                           INNER JOIN tdm20_role ON tdm20_role_id = tdm51_role_id
                           LEFT JOIN ( SELECT tdm43_manl_org_id
                                             , COUNT(DISTINCT tdm43_task_id)                task_cnt
                                             , COUNT(DISTINCT tdm43_task_relate_detail_id)  detail_cnt
                                             , COUNT(DISTINCT tdm43_task_relate_duty_id)    duty_cnt
                                             , COUNT(*)                                     manl_cnt
                                          FROM tdm43_manl
                                               LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
                                         WHERE tdm43_company_id = r_tdm53.tdm53_company_id
                                           AND tdm10_common_yn = 'true'
                                           AND COALESCE(tdm43_start_date,'9999-12-31'::date) >= (r_tdm53.tdm53_check_ym||'.01')::date
                                         GROUP BY tdm43_manl_org_id ) tdm43 ON tdm43_manl_org_id = tdm51_manl_org_id
                           LEFT JOIN ( SELECT tdm52_chck_org_id
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11')                                 THEN 1 ELSE 0 END)  month_check_cnt
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '1' THEN 1 ELSE 0 END)  month_check1_cnt
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd IN ('2') THEN 1 ELSE 0 END)  month_check2_cnt
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '9' THEN 1 ELSE 0 END)  month_check9_cnt
                                          FROM tdm52_chck_manl
                                               LEFT JOIN tdm43_manl ON tdm43_manl_id = tdm52_manl_id
                                               LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
                                         WHERE tdm52_company_id = r_tdm53.tdm53_company_id
                                           AND tdm10_common_yn = 'true'
                                         GROUP BY tdm52_chck_org_id ) tdm52 ON tdm52_chck_org_id = tdm51_chck_org_id
                     WHERE tdm51_company_id = r_tdm53.tdm53_company_id
                       AND tdm51_check_ym   = r_tdm53.tdm53_check_ym
                       AND tdm51_role_id     = r_tdm53.tdm53_role_id
                   ) t
            UNION ALL
            SELECT t.*
              FROM (
                    SELECT tdm51_chck_org.*
                         , tdm20_role_nm                                                                                AS tdm51_role_nm                --직책
                         , f_emp_kor_nm(tdm51_exct_id)                                                                  AS tdm51_exct_nm                --임원
                         , COALESCE(task_cnt,0)                                                                         AS tdm51_task_cnt               --항목수_책무
                         , COALESCE(detail_cnt,0)                                                                       AS tdm51_detail_cnt             --항목수_책무세부
                         , COALESCE(duty_cnt,0)                                                                         AS tdm51_duty_cnt               --항목수_관리의무
                         , COALESCE(manl_cnt,0)                                                                         AS tdm51_manl_cnt               --항목수_점검항목
                         , COALESCE(month_check_cnt,0)                                                                  AS tdm51_month_check_cnt        --당월점검_점검건수
                         , COALESCE(month_check1_cnt,0)                                                                 AS tdm51_month_check1_cnt       --당월점검_적정
                         , COALESCE(month_check2_cnt,0)                                                                 AS tdm51_month_check2_cnt       --당월점검_미흡
                         , COALESCE(month_check9_cnt,0)                                                                 AS tdm51_month_check9_cnt       --당월점검_해당없음
                         , f_org_nm(tdm51_org_id, f_today())                                                            AS tdm51_org_nm
                         , '개별'                                                                                         AS tdm51_status
                      FROM tdm51_chck_org
                           INNER JOIN tdm20_role ON tdm20_role_id = tdm51_role_id
                           LEFT JOIN ( SELECT tdm43_manl_org_id
                                             , COUNT(DISTINCT tdm43_task_id)                task_cnt
                                             , COUNT(DISTINCT tdm43_task_relate_detail_id)  detail_cnt
                                             , COUNT(DISTINCT tdm43_task_relate_duty_id)    duty_cnt
                                             , COUNT(*)                                     manl_cnt
                                          FROM tdm43_manl
                                               LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
                                         WHERE tdm43_company_id = r_tdm53.tdm53_company_id
                                           AND tdm10_common_yn = 'false'
                                           AND COALESCE(tdm43_start_date,'9999-12-31'::date) >= (r_tdm53.tdm53_check_ym||'.01')::date
                                         GROUP BY tdm43_manl_org_id ) tdm43 ON tdm43_manl_org_id = tdm51_manl_org_id
                           LEFT JOIN ( SELECT tdm52_chck_org_id
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11')                                 THEN 1 ELSE 0 END)  month_check_cnt
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '1' THEN 1 ELSE 0 END)  month_check1_cnt
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd IN ('2') THEN 1 ELSE 0 END)  month_check2_cnt
                                             , SUM(CASE WHEN COALESCE(tdm52_check_status_cd,'10') NOT IN ('','10','11') AND tdm52_check_result_cd = '9' THEN 1 ELSE 0 END)  month_check9_cnt
                                          FROM tdm52_chck_manl
                                               LEFT JOIN tdm43_manl ON tdm43_manl_id = tdm52_manl_id
                                               LEFT JOIN tdm10_task ON tdm10_task_id = tdm43_task_id
                                         WHERE tdm52_company_id = r_tdm53.tdm53_company_id
                                           AND tdm10_common_yn = 'false'
                                         GROUP BY tdm52_chck_org_id ) tdm52 ON tdm52_chck_org_id = tdm51_chck_org_id
                     WHERE tdm51_company_id = r_tdm53.tdm53_company_id
                       AND tdm51_check_ym   = r_tdm53.tdm53_check_ym
                       AND tdm51_role_id     = r_tdm53.tdm53_role_id
                   ) t
             ORDER BY 1, 2
        LOOP
            rr.sys99_string01  := 'CHCK_TOTAL';
            rr.sys99_string02  := r1.tdm51_org_nm;
            rr.sys99_string03  := r1.tdm51_status;
            rr.sys99_long01    := r1.tdm51_task_cnt;
            rr.sys99_long02    := r1.tdm51_detail_cnt;
            rr.sys99_long03    := r1.tdm51_duty_cnt;
            rr.sys99_long04    := r1.tdm51_manl_cnt;
            rr.sys99_long05    := r1.tdm51_month_check_cnt;
            rr.sys99_long06    := r1.tdm51_month_check1_cnt;
            rr.sys99_long07    := r1.tdm51_month_check2_cnt;
            rr.sys99_long08    := r1.tdm51_month_check9_cnt;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
        ----------------------------------------------------------------------------------------------------------------------------------------------------
        
        --점검 결과 미흡에 대한 상세 내용 및 조치
        ----------------------------------------------------------------------------------------------------------------------------------------------------
        for r1 in
            SELECT tdm53_chck_exct_id
                 , CONCAT( CASE WHEN tdm10.tdm10_common_yn = 'true' THEN '<b>(공통책무)</b>' ELSE '<b>(개별책무)</b>' END, tdm43.tdm43_task_nm
                           , '<br>'
                           , '<b>(책무세부)</b>', tdm43.tdm43_task_relate_detail_nm
                           , '<br>'
                           , '<b>(관리의무)</b>', tdm43.tdm43_task_relate_duty_nm)                                                                  AS tdm54_task_info
                 , CONCAT(   '<b>(점검항목명)</b>', tdm43.tdm43_check_item 
                           , '<br>'
                           , '<b>(점검주기)</b>', CONCAT( f_cdnm('CycleCode', tdm43.tdm43_check_cycle_cd, tdm54.tdm54_company_id, tdm54.tdm54_reg_date)
                                                                  , '('||CASE WHEN tdm43.tdm43_check_cycle_cd IN ('06','98')
                                                                              THEN tdm43.tdm43_check_month
                                                                              ELSE null END||')' )
                           , '<br>'
                           , '<b>(점검자의견)</b>', tdm52.tdm52_check_cmnt)                                                                          AS tdm54_check_info
                 , CONCAT(   '<b>(조치명)</b>', tdm54.tdm54_action_nm
                           , '<br>'
                           , '<b>(조치완료예정일)</b>', to_char(tdm54.tdm54_due_date,'yyyy-mm-dd') 
                           , '<br>'
                           , '<b>(조치예정자)</b>', f_emp_kor_nm(tdm54.tdm54_plan_action_emp_id)
                           , '<br>'
                           , '<b>(조치계획)</b>', tdm54.tdm54_action_plan)                                                                          AS tdm54_plan_info
                 , CONCAT(   '<b>(부서장의견)</b>', tdm60.tdm60_appr_cmnt )                                                                          AS tdm54_confirm_cmnt
              FROM tdm53_chck_exct tdm53
                   INNER JOIN tdm51_chck_org       tdm51 ON tdm51.tdm51_chck_job_id  = tdm53.tdm53_chck_job_id
                   INNER JOIN tdm52_chck_manl      tdm52 ON tdm52.tdm52_chck_org_id  = tdm51.tdm51_chck_org_id
                   INNER JOIN tdm54_chck_insuff    tdm54 ON tdm54.tdm54_chck_manl_id = tdm52.tdm52_chck_manl_id
                   INNER JOIN tdm43_manl           tdm43 ON tdm43.tdm43_manl_id      = tdm52.tdm52_manl_id
                   INNER JOIN tdm10_task           tdm10 ON tdm10.tdm10_task_id      = tdm43.tdm43_task_id
                    LEFT JOIN tdm60_chck_manl_appr tdm60 ON tdm60.tdm60_chck_manl_id = tdm52.tdm52_chck_manl_id
             WHERE tdm53.tdm53_chck_exct_id = p_id
               AND tdm60.tdm60_appr_seq = (SELECT MIN(tdm60_2.tdm60_appr_seq)
                                             FROM tdm60_chck_manl_appr tdm60_2
                                            WHERE tdm60_2.tdm60_chck_manl_id =tdm52.tdm52_chck_manl_id)
        LOOP
            rr.sys99_string01  := 'CHCK_MANL';
            rr.sys99_text01    := r1.tdm54_task_info;
            rr.sys99_text02    := r1.tdm54_check_info;
            rr.sys99_text03    := r1.tdm54_plan_info;
            rr.sys99_text04    := r1.tdm54_confirm_cmnt;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
        ----------------------------------------------------------------------------------------------------------------------------------------------------
        
        --당월 기준 진행중 또는 종료된 미흡/개선 조치 사항
        ----------------------------------------------------------------------------------------------------------------------------------------------------
        for r2 in
            SELECT f_org_nm(tdm54_org_id, f_today())                                                                        AS tdm54_org_nm             -- 부서명
                 , '<b>(조치명)</b>'||COALESCE(tdm54_action_nm,'')                                                         AS tdm54_action_nm          -- 조치명
                 , '<b>(조치구분)</b>'||f_cdnm('TdmCheckResult', tdm52_check_result_cd, tdm54_company_id, tdm54_reg_date)       AS tdm54_insuff_type        -- 조치 구분
                 , '<b>(등록일자)</b>'||COALESCE(to_char(tdm54_reg_date, 'YYYY-MM-DD'),'')                                      AS tdm54_reg_date           -- 등록일
                 , '<b>(완료예정일자)</b>'||COALESCE(to_char(tdm54_due_date, 'YYYY-MM-DD'),'')                                    AS tdm54_due_date           -- 완료예정일
                 , '<b>(조치 담당자)</b>'||CASE WHEN tdm54_action_emp_id IS NOT NULL THEN f_emp_kor_nm(tdm54_action_emp_id)
                                           ELSE f_emp_kor_nm(tdm54_plan_action_emp_id) END                                  AS tdm54_action_emp_nm      -- 담당자
                 , '<b>(진행상태)</b>'||f_cdnm('TdmInsuffStatus', tdm54_status_cd, tdm54_company_id, tdm54_reg_date)            AS tdm54_status_nm          -- 진행 상태
                 , '<b>(조치계획내용)</b>'||COALESCE(tdm54_action_plan,'')                                                        AS tdm54_action_plan        -- 조치 계획 내용
                 , '<b>(조치계획의견)</b>'||COALESCE(tdm60_appr_cmnt,'')                                                      AS tdm54_appr_cmnt          -- 조치 계획 의견
                 , '<b>(조치결과)</b>'||COALESCE(tdm54_action_cmnt,'')                                                          AS tdm54_action_cmnt        -- 조치 결과
                 , '<b>(조치결과의견)</b>'||COALESCE(tdm61.tdm61_appr_cmnt,'')                                                    AS tdm54_appr_result_cmnt   -- 조치 결과 의견
                 , *
              FROM (SELECT *
                      FROM tdm54_chck_insuff
                           INNER JOIN tdm52_chck_manl ON tdm52_chck_manl_id = tdm54_chck_manl_id
                           INNER JOIN tdm51_chck_org  ON tdm51_chck_org_id = tdm52_chck_org_id
                     WHERE ( tdm54_status_cd IN ('10', '11', '26') AND (tdm51_check_ym||'.01')::date < (r_tdm53.tdm53_check_ym||'.01')::date)
                       AND tdm54_role_id = r_tdm53.tdm53_role_id
                     UNION ALL
                    SELECT *
                      FROM tdm54_chck_insuff
                           INNER JOIN tdm52_chck_manl ON tdm52_chck_manl_id = tdm54_chck_manl_id
                           INNER JOIN tdm51_chck_org  ON tdm51_chck_org_id = tdm52_chck_org_id
                      WHERE ( tdm54_status_cd NOT IN ('10', '11', '26') AND to_char(tdm54_action_date, 'YYYY.MM') = r_tdm53.tdm53_check_ym)
                        AND tdm54_role_id = r_tdm53.tdm53_role_id)t
              LEFT JOIN tdm61_chck_insuff_appr tdm61 ON tdm61_chck_insuff_id = t.tdm54_chck_insuff_id
              LEFT JOIN tdm60_chck_manl_appr tdm60 ON tdm60_chck_manl_id = tdm52_chck_manl_id
             WHERE tdm61.tdm61_appr_seq = (SELECT MIN(tdm61_2.tdm61_appr_seq)
                                             FROM tdm61_chck_insuff_appr tdm61_2
                                            WHERE tdm61_2.tdm61_chck_insuff_id = t.tdm54_chck_insuff_id)
               AND tdm60.tdm60_appr_seq = (SELECT MIN(tdm60_2.tdm60_appr_seq)
                                             FROM tdm60_chck_manl_appr tdm60_2
                                            WHERE tdm60_2.tdm60_chck_manl_id = t.tdm52_chck_manl_id)
        LOOP
            rr.sys99_string01  := 'CHCK_INSUFF';
            rr.sys99_string02  := r2.tdm54_org_nm;
            rr.sys99_string03  := r2.tdm54_action_nm;
            rr.sys99_string04  := r2.tdm54_insuff_type;
            rr.sys99_string05  := r2.tdm54_reg_date;
            rr.sys99_string06  := r2.tdm54_due_date;
            rr.sys99_string07  := r2.tdm54_action_emp_nm;
            rr.sys99_string08  := r2.tdm54_status_nm;
            rr.sys99_text01    := r2.tdm54_action_plan;
            rr.sys99_text02    := r2.tdm54_appr_cmnt;
            rr.sys99_text03    := r2.tdm54_action_cmnt;
            rr.sys99_text04    := r2.tdm54_appr_result_cmnt;
            rr.sys99_long01    := r2.tdm54_chck_insuff_id;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
        ------------------------------------------------------------------------- 
        
        --점검 종합 의견
        -------------------------------------------------------------------------- 
        for r2 in
            SELECT tdm59_chck_appr_cmnt_id      AS tdm59_chck_appr_cmnt_id
                 , tdm59_cmnt_type              AS tdm59_cmnt_type
                 , tdm59_appr_cmnt              AS tdm59_appr_cmnt
                 , tdm59_report_cmnt            AS tdm59_report_cmnt
                 , tdm59_submit_yn              AS tdm59_submit_yn
              FROM tdm59_chck_appr_cmnt
                   INNER JOIN tdm53_chck_exct ON tdm53_chck_exct_id = tdm59_chck_exct_id AND tdm53_exct_id = tdm59_appr_emp_id
             WHERE tdm53_chck_exct_id = p_id
               AND tdm59_cmnt_type = 'SELF'
        LOOP
            rr.sys99_string01  := 'CHCK_APPRCMNT';
            rr.sys99_text01    := r2.tdm59_report_cmnt;

            rr.sys99_print_id := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;
        end loop;
        

        RETURN  'Y';

    END;
    $inner$ language plpgsql;
*/
/*
    -------------------------------------------------------------------------------------------------------------------------------------------------------
    CREATE OR REPLACE FUNCTION tdm_create_data_fss (w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric, i_rpt_tp  character varying  ) 
    RETURNS text AS $inner$
    declare
        r1      record;
        rr sys99_print%ROWTYPE;

        R_tdm36_role_report   tdm36_role_report%ROWTYPE;
        w_cnt    integer ;
        w_bf_report_date date;

    BEGIN
        w_cnt  := 0;
        rr     := null;

        select *
        from   tdm36_role_report 
        into   R_tdm36_role_report
        where  tdm36_role_report_id = p_id  ;


        IF NOT FOUND THEN
            RAISE NOTICE 'Job not foud in tdm36_role_report  ' ;
            RETURN 'N';
        END IF;


        --최근 이사회 개최일 
        select coalesce ( max(tdm36_board_open_date),  to_date('20000101','yyyymmdd'))
        into   w_bf_report_date 
        from   tdm36_role_report
        where  tdm36_company_id      = R_tdm36_role_report.tdm36_company_id
        and    tdm36_board_open_date < R_tdm36_role_report.tdm36_board_open_date;

        
 
        rr.sys99_company_id := p_company_id;
        rr.sys99_person_id  := p_emp_id;
        rr.sys99_group_id   := p_sys99_group_id;
    
        delete from sys99_print 
        where  sys99_company_id   = rr.sys99_company_id
        and    sys99_person_id    = rr.sys99_person_id
        and    sys99_group_id     = rr.sys99_group_id
        and    sys99_string01     = 
                case when  i_rpt_tp = 'MK_FSS_COVER'   then 'FSS_COVER'
                    when i_rpt_tp = 'MK_FSS_OVERVIEW'  then 'FSS_OVERVIEW' 
                    when i_rpt_tp = 'MK_FSS_CEO_CFRM'  then 'FSS_CEO_CFRM' 
                    when i_rpt_tp = 'MK_FSS_BOARD'     then 'FSS_BOARD' 
                end;


        if i_rpt_tp = 'MK_FSS_COVER' then   -- 표지부 

            rr.sys99_string01  := 'FSS_COVER';
            rr.sys99_text01    := to_char(R_tdm36_role_report.tdm36_report_date, 'yyyy.mm.dd');
            rr.sys99_text02    := '작성자 : ' || R_tdm36_role_report.tdm36_upd_nm ;
            rr.sys99_text03    := '전화번호 : ' ; -- 02-123-4567';

            select rr.sys99_text02 || ' (' || f_get_emptrans(tdm01_person_id,  f_today(),   'pos_nm')  || ')'
            into   rr.sys99_text02
            from   tdm01_hr
            where  tdm01_company_id =  R_tdm36_role_report.tdm36_company_id
            and    tdm01_person_nm  = R_tdm36_role_report.tdm36_upd_nm;


            rr.sys99_print_id  := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;


        elsif i_rpt_tp = 'MK_FSS_CEO_CFRM' then    -- 대표이사 확인서  (첨부) 
 
            rr.sys99_string01  := 'FSS_CEO_CFRM';
            rr.sys99_text01    := to_char(R_tdm36_role_report.tdm36_report_date, 'yyyy년 mm월 dd일'); 
            --rr.sys99_text02    := '김 대 표 (인)';
            --rr.sys99_text03    := '공 대 표 (인)';

            w_cnt := 0;
            for r1 in (
                select  tdm01_person_nm  
                    , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
                    , tdm30_role_allc_date
                from   getTdm30RoleAllc(R_tdm36_role_report.tdm36_company_id, R_tdm36_role_report.tdm36_board_open_date, true)
                left outer join tdm20_role
                on     tdm30_role_id = tdm20_role_id
                left outer join tdm01_hr
                on     tdm30_person_id =  tdm01_person_id
                where  tdm20_role.tdm20_role_type='C'
            ) loop
                w_cnt := w_cnt + 1;
 
                if w_cnt = 1 then
                    rr.sys99_text02    :=  r1.tdm01_person_nm || ' (인)';
                elseif  w_cnt = 2 then
                    rr.sys99_text03    :=   r1.tdm01_person_nm || ' (인)';
                else
                    RAISE NOTICE '대표자 3인 이상은 화면을 수정해야 합니다. IT에 연락하십시오  ' ;
                    RETURN 'N';
                end if;
                
            end loop;


            rr.sys99_print_id  := f_create_seq();

            INSERT INTO sys99_print  SELECT (rr).*;

        elsif i_rpt_tp = 'MK_FSS_BOARD' then   -- 이사회 결의서   (첨부) 
 
            rr.sys99_string01  := 'FSS_BOARD';
            rr.sys99_string02  := 'FSS_BOARD_INFO';
            rr.sys99_text01    := to_char(R_tdm36_role_report.tdm36_report_date, 'yyyy년 mm월 dd일');  
            --rr.sys99_text02    := '대표자 : 김 대 표 (인)';
            --rr.sys99_text03    := '대표자 : 공 대 표 (인)';

            w_cnt := 0;
            for r1 in (
                select  tdm01_person_nm  
                    , f_get_emptrans(tdm30_person_id,  f_today(),   'pos_nm')  pos_nm
                    , tdm30_role_allc_date
                from   getTdm30RoleAllc(R_tdm36_role_report.tdm36_company_id, R_tdm36_role_report.tdm36_board_open_date, true)
                left outer join tdm20_role
                on     tdm30_role_id = tdm20_role_id
                left outer join tdm01_hr
                on     tdm30_person_id =  tdm01_person_id
                where  tdm20_role.tdm20_role_type='C'
            ) loop
                w_cnt := w_cnt + 1;
 
                if w_cnt = 1 then
                    rr.sys99_text02    := '대표자 : ' || r1.tdm01_person_nm || ' (인)';
                elseif  w_cnt = 2 then
                    rr.sys99_text03    := '대표자 : ' || r1.tdm01_person_nm || ' (인)';
                else
                    RAISE NOTICE '대표자 3인 이상은 화면을 수정해야 합니다. IT에 연락하십시오  ' ;
                    RETURN 'N';
                end if;
                
            end loop;

            rr.sys99_text04    := '1. 일   시 : ' ||  to_char(R_tdm36_role_report.tdm36_board_open_date, 'yyyy.mm.dd');  
            rr.sys99_text05    := '2. 장   소 : ' ||  R_tdm36_role_report.tdm36_board_open_loc ; 
            rr.sys99_text06    := '3. 이사총수 : ' ||  R_tdm36_role_report.tdm36_memb_tot_cnt ;
            rr.sys99_text07    := '4. 출석이사 : ' ||  R_tdm36_role_report.tdm36_memb_attend_cnt  ;
            rr.sys99_text08    := '5. 결의내용 : 책무구조도 및 책무체계도 제출의 건';

            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;

 
            for r1 in
                --select '이사 김이사 (인)' as str  union all
                --select '이사 조감사 (인)' as str
                select  trim( regexp_split_to_table(R_tdm36_role_report.tdm36_memb_yes_nm  , ',')) AS str
   
            loop
                rr.sys99_string01  := 'FSS_BOARD';
                rr.sys99_string02  := 'FSS_BOARD_YES';
                rr.sys99_text01    := r1.str || ' (인)';
                rr.sys99_print_id  := f_create_seq();
    
                INSERT INTO sys99_print  SELECT (rr).*;
            end loop;



        elsif i_rpt_tp = 'MK_FSS_OVERVIEW' then   -- 책무구조도 제출개요 (붙임1)

            rr.sys99_string01  := 'FSS_OVERVIEW';
            rr.sys99_string02  := 'ASIS_TOBE';


            -- 기간내에 변경분이 있을때만 생성된다 
            w_cnt := 0;
            for r1 in
                with lists
                as (
                    select tdm30_role_allc_id, tdm30_role_id , tdm30_person_id, tdm30_add_title_yn, tdm30_start_date
                        , (select tdm20_role_nm   from tdm20_role where tdm20_role_id   = tdm30_role_id )  role_nm
                        , (select tdm01_person_nm from tdm01_hr   where tdm01_person_id = tdm30_person_id ) person_nm
                        , (select max(tdm31_role_desc_id) from tdm31_role_desc  
                                where tdm31_role_allc_id = tdm30_role_allc_id 
                                and   tdm31_reg_date >  w_bf_report_date
                                and   tdm31_reg_date <= R_tdm36_role_report.tdm36_board_open_date
                            ) tdm31_role_desc_id
                        , row_number() over ( partition by tdm30_role_id  order by tdm30_start_date  desc  ) as start_seq 
                    from   tdm30_role_allc 
                    INNER JOIN tdm34_role_allc_detail ON tdm34_role_allc_id = tdm30_role_allc_id
                    INNER JOIN apr01_appr             ON apr01_appr_id = tdm34_appr_id AND apr01_status_cd  = '30' 
                    where  tdm30_company_id  = p_company_id
                    and    tdm30_start_date >= w_bf_report_date
                    and    tdm30_start_date <= R_tdm36_role_report.tdm36_board_open_date
                ) 
                , list_role_exct
                as (
                    select tdm30_role_id role_id, role_nm
                            , tdm30_person_id person_id, person_nm, tdm30_start_date start_date, start_seq
                            , f_cdnm ('TdmDescRegReason', 'D03', 0,  f_sysdate() )  Tdm_Desc_ReasonNm
                            , (select substr(to_decrypts(emp02_ctz_no),1,6) from emp02_others where  emp02_person_id  = tdm30_person_id)  ctz_no
                    from   lists
                    where  tdm30_role_id in (select tdm30_role_id from lists where start_seq =2 ) 
                ),
                list_detail 
                as  (
                    select  
                         tdm21_role_id role_id
                        , list.Tdm_Desc_ReasonNm
                        , list.ctz_no
                        , list.start_seq
                        , list.start_date
                        , list.role_nm
                        , list.person_nm
                        , tdm21_task_id
                        , tdm10_task_nm  task_nm
                        , tdm21_role_id
                        , tdm12_content  detail_nm
                        , row_number() over ( partition by list.role_id, list.start_seq   order by tdm21_role_id, tdm21_task_id,  tdm12_task_relate_detail_id  ) as seq
                    from tdm21_role_relate_task
                    join tdm10_task                on tdm21_task_id = tdm10_task_id
                    join tdm12_task_relate_detail  on tdm21_task_id = tdm12_task_id
                    join list_role_exct  list      on tdm21_role_id = list.role_id  
                    where list.start_date between tdm10_start_date and coalesce(tdm10_end_date, current_timestamp)
                )
                select  role_id, role_nm, seq
                    , max( Tdm_Desc_ReasonNm) Tdm_Desc_ReasonNm
                    , max(case when start_seq =1 then ctz_no        end) bf_ctz_no
                    , max(case when start_seq =1 then person_nm     end) bf_person_nm
                    , max(case when start_seq =1 then task_nm       end) bf_task_nm
                    , max(case when start_seq =1 then detail_nm     end) bf_detail_nm
                    , max(case when start_seq =2 then ctz_no        end) af_ctz_no
                    , max(case when start_seq =2 then person_nm     end) af_person_nm
                    , max(case when start_seq =2 then task_nm       end) af_task_nm
                    , max(case when start_seq =2 then detail_nm     end) af_detail_nm
                from    list_detail
                group by role_id, role_nm, seq
            loop

                rr.sys99_string10  := r1.role_id ;
                rr.sys99_string11  := r1.bf_person_nm;
                rr.sys99_string12  := coalesce( r1.bf_ctz_no, '미등록');
                rr.sys99_string13  := r1.role_nm;
                rr.sys99_string14  := r1.bf_task_nm;
                rr.sys99_string15  := r1.bf_detail_nm;

                rr.sys99_string16  := r1.af_person_nm;
                rr.sys99_string17  := coalesce( r1.af_ctz_no, '미등록');
                rr.sys99_string18  := r1.role_nm;
                rr.sys99_string19  := r1.af_task_nm;
                rr.sys99_string20  := r1.af_detail_nm;
                rr.sys99_string21  := r1.Tdm_Desc_ReasonNm ;

                rr.sys99_print_id  := f_create_seq();
                INSERT INTO sys99_print  SELECT (rr).*;

                w_cnt  := w_cnt +1;

            end loop;

            -----------------

            rr.sys99_string02  := 'REPORT_TP';

            if w_cnt = 0 then
                rr.sys99_string11  := '1. 구분 : 신규 제출';
                rr.sys99_string12  := '- 제출사유 : 금융관계법령 변경';
            else
                rr.sys99_string11  := '1. 구분 : 변경 제출';
                rr.sys99_string12  := '- 제출사유 : ' || rr.sys99_string21;   -- 마지막의 등록사유 
            end if;

            rr.sys99_print_id  := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;


            -- 신규, 변경분을 표시한다
            for r1 in  
                with lists
                as (
                select  sys99_print_id
                    , sys99_string10 as  group_nm
                    , sys99_string11 as  asis_exct_nm
                    , sys99_string12 as  asis_person_no
                    , sys99_string13 as  asis_position
                    , sys99_string14 as  asis_task
                    , sys99_string15 as  asis_detail
                    , sys99_string16 as  tobe_exct_nm
                    , sys99_string17 as  tobe_person_no
                    , sys99_string18 as  tobe_position
                    , sys99_string19 as  tobe_task
                    , sys99_string20 as  tobe_detail
                    , sys99_string21 as  chg_reason  
                from   sys99_print 
                where  sys99_company_id = rr.sys99_company_id 
                and    sys99_person_id  = rr.sys99_person_id
                and    sys99_group_id   = rr.sys99_group_id
                and    sys99_string01  = 'FSS_OVERVIEW'
                and    sys99_string02  = 'ASIS_TOBE'
                order by sys99_print_id
                )
                select sys99_print_id
                    ,(select 'Y' from lists where group_nm = a.group_nm and tobe_exct_nm   = a.asis_exct_nm  limit 1)    tobe_exct_nm_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and tobe_person_no = a.asis_person_no  limit 1)  tobe_person_no_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and tobe_position  = a.asis_position  limit 1)   tobe_position_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and tobe_task      = a.asis_task  limit 1)       tobe_task_exist_yn
                    ,(select 'Y' from lists where group_nm = a.group_nm and tobe_detail    = a.asis_detail  limit 1)     tobe_detail_exist_yn
                from   lists a
                order by sys99_print_id
            loop

                update sys99_print
                set sys99_string26  = coalesce( r1.tobe_exct_nm_exist_yn, 'N') ,
                    sys99_string27  = coalesce( r1.tobe_person_no_exist_yn, 'N'),
                    sys99_string28  = coalesce( r1.tobe_position_exist_yn, 'N'),
                    sys99_string29  = coalesce( r1.tobe_task_exist_yn, 'N'),
                    sys99_string30  = coalesce( r1.tobe_detail_exist_yn, 'N')
                where  sys99_print_id = r1.sys99_print_id;

            end loop;
 
        end if;



        RETURN  'Y';

    END;
    $inner$ language plpgsql;
 
*/

    -----------------------------------------------------------------------------------------------------------

    DECLARE
        w_ret   VARCHAR(1);   
    begin

        call p_log('kdj', 'tdm_create_data ' ||  to_char(now(),'hh24:mi:ss')
                || ' p_job_tp ' || p_job_tp 
                ||'  p_ymd '  || p_ymd
                ||'  p_id '  || p_id
                ||'  p_company_id '  || p_company_id
                ||'  p_emp_id '  || p_emp_id
                ||'  p_sys99_group_id '  || p_sys99_group_id
              );
    
 

        if p_job_tp = 'MK_MANUAL' then
            w_ret := tdm_create_data_manual (to_date( p_ymd, 'yyyymmdd') , p_id , p_company_id , p_emp_id , p_sys99_group_id );     
    
        elsif p_job_tp = 'MK_DESC' then
            w_ret := tdm_create_data_desc   (to_date( p_ymd, 'yyyymmdd') , p_id , p_company_id , p_emp_id , p_sys99_group_id );     
     
        elsif p_job_tp = 'MK_DIGM' then
            w_ret := tdm_create_data_digm   (to_date( p_ymd, 'yyyymmdd') , p_id , p_company_id , p_emp_id , p_sys99_group_id );     
    
        elsif p_job_tp = 'MK_CHCK' then   -- 책무 이행 점검 보고서(MK_CHCK)
            w_ret := tdm_create_data_chck   (to_date( p_ymd, 'yyyymmdd') , p_id , p_company_id , p_emp_id , p_sys99_group_id );     
 
        elsif p_job_tp in ('MK_FSS_COVER', 'MK_FSS_OVERVIEW', 'MK_FSS_CEO_CFRM', 'MK_FSS_BOARD') then   --  
            w_ret := tdm_create_data_fss   (to_date( p_ymd, 'yyyymmdd') , p_id , p_company_id , p_emp_id , p_sys99_group_id , p_job_tp);    
 
    
        end if;
    
        RETURN w_ret;

    end;

-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN 

    RETURN sqlerrm;
END;
$function$
```
