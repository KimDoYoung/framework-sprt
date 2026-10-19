# tdm_create_data_desc

## FUNCTION public.tdm_create_data_desc(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)

- 반환: `text`
- 줄 수: 367

```sql
CREATE OR REPLACE FUNCTION public.tdm_create_data_desc(w_std_date date, p_id numeric, p_company_id numeric, p_emp_id numeric, p_sys99_group_id numeric)
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

        IF p_id IS NULL THEN
            w_person_id := p_emp_id;
        ELSE
            select tdm31_company_id,   tdm31_person_id 
            from   tdm31_role_desc 
            into   rr.sys99_company_id,  w_person_id
            where  tdm31_role_desc_id = p_id  ;
        
            IF NOT FOUND THEN
                RAISE NOTICE 'Job not foud in tdm31_role_desc  ' ;
                RETURN 'N';
            END IF;
        END IF;
    
        ------------------------------------------
        -- 첫 번째 LOOP
        FOR r1 IN
            with lists
            as (select tdm30_role_allc_id, tdm30_role_id, tdm20_role_nm, tdm01_person_nm
                    -- , case when coalesce(tdm30_add_title_yn,'false') = 'false' then  tdm30_deputy_emp_nm  end    tdm30_deputy_emp_nm
                    , case when coalesce(tdm30_deputy_emp_nm,'미등록') <> '미등록' then tdm20_role_nm || ':' || tdm30_deputy_emp_nm  end  tdm30_deputy_emp_nm_role 
                    , replace(tdm30_deputy_emp_nm,'미등록','' )  tdm30_deputy_emp_nm
                    , case when coalesce(tdm30_add_title_yn,'false') = 'false' then  tdm30_start_date end       tdm30_start_date
                    , case when coalesce(tdm30_add_title_yn,'false') = 'false' then  tdm20_role_nm end          main_role_nm 
                    , f_get_tdmPersonInfo(w_person_id, w_std_date,'3')                                          add_role_nm 
                    , tdm30_add_title_yn
                    , tdm01_pos_cd,  f_Cdnm('EmpPosCode',tdm01_pos_cd, tdm01_company_id, f_today() ) pos_nm
                    , tdm01_title_cd
                    , tdm01_org_id
                    , tdm01_org_nm
                    , row_number() over (   partition by tdm30_person_id       order by tdm30_add_title_yn    )  as seq
                from   getTdm30RoleAllc(p_company_id, w_std_date, false)
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
                -- , max(tdm30_deputy_emp_nm)                                                               deputy_emp_nm
                , case when count(*) = 0 then ''
                        when count(*) = 1 then max( tdm30_deputy_emp_nm) 
                        else STRING_AGG( distinct tdm30_deputy_emp_nm_role, ', ')     
                    end  deputy_emp_nm
            from   lists
        LOOP

    
            rr.sys99_string01 := 'DESC_HR';
    
            rr.sys99_text01   := '직책';  rr.sys99_text02 := r1.main_role_nm;   rr.sys99_text03  := '성명';  rr.sys99_text04 := r1.person_nm;   rr.sys99_long01 := 0;
            rr.sys99_print_id := f_create_seq() ;
            INSERT INTO sys99_print  SELECT (rr).*;
    
            rr.sys99_text01   = '직위';  rr.sys99_text02 := r1.pos_nm;           rr.sys99_text03  := '현직책부여일';  rr.sys99_text04 := r1.role_start_date;   rr.sys99_long01 := 1;
            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;
    

--             rr.sys99_text01   := '겸직여부³?';  rr.sys99_text02 := r1.add_role_yn ;  rr.sys99_text03  := '겸직사항⁴?';  rr.sys99_text04 := r1.sub_role_nm   ;   rr.sys99_long01 := 2;
--          if r1.add_role_nm is  not null then
--              rr.sys99_text04 := r1.add_role_nm  || ' ' || r1.sub_role_nm   ;
--          end if; 
            rr.sys99_text01   := '겸직여부';  rr.sys99_text02 := r1.add_role_yn ;  rr.sys99_text03  := '겸직사항';  rr.sys99_text04 := r1.add_role_nm   ;   rr.sys99_long01 := 2;
            rr.sys99_print_id := f_create_seq();
            INSERT INTO sys99_print  SELECT (rr).*;
    
    
            rr.sys99_text01  := '소관부서';  rr.sys99_text02 :=  r1.org_nm;       rr.sys99_text03  := '유고시 책무 대행자';  rr.sys99_text04 := r1.deputy_emp_nm;   rr.sys99_long01 := 3;
--            rr.sys99_text01  := '소관부서';  rr.sys99_text02 :=  r1.org_nm;       rr.sys99_text03  := '겸직사항';  rr.sys99_text04 := r1.add_role_nm;   rr.sys99_long01 := 3;
            rr.sys99_print_id := f_create_seq();


            -- 2026.5.18 
            -- CEO이면 전부서로 표시 , 나머지는 연결부서 
            begin
                select '전부서'  into strict rr.sys99_text02 
                from   getTdm30RoleAllc(p_company_id, w_std_date, false)
                join   tdm20_role on  tdm20_role_id = tdm30_role_id  
                where  tdm30_person_id = w_person_id
                and    tdm20_role_type = 'C' ;
            exception when no_data_found then           
                select STRING_AGG( distinct f_org_nm(tdm23_org_id, f_today()) , ', ')  
                into   rr.sys99_text02 
                from   getTdm30RoleAllc(p_company_id, w_std_date, false)
                join   tdm23_role_relate_org on  tdm23_role_id = tdm30_role_id  
                where  tdm30_person_id = w_person_id  ;
            end;

			if r1.main_role_nm = '감사' then
				rr.sys99_text02 := '-';
			end if;

            if r1.deputy_emp_nm = '미등록' then
                rr.sys99_text04 := '';
            end if;


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
                from   getTdm30RoleAllc(p_company_id, w_std_date, false)
                where  tdm30_person_id = w_person_id 
            )
            , list_2
            as (
                select  distinct tdm22_cncl_id cncl_id, tdm05_cncl_nm cncl_nm -- tdm22_role_relate_cncl_id, tdm22_role_id, 
                    , tdm22_member_type, f_cdnm ('TdmCnclMemberType', tdm22_member_type, 0,  f_sysdate() ) cncl_memb_tp_nm
                    , tdm05_open_cycle_cd, f_cdnm ( 'CycleCode', tdm05_open_cycle_cd, 0,  f_sysdate() ) open_cycle_nm
                    , tdm05_main_decision
                from   tdm22_role_relate_cncl 
                join list_tdm30_role_allc
                on   tdm22_role_id = tdm30_role_id  
                left outer join tdm05_cncl
                on   tdm22_cncl_id = tdm05_cncl_id  
                where  tdm05_start_date <=w_std_date
                and    coalesce(tdm05_end_date  , w_std_date +1)  >= w_std_date
				and    coalesce(tdm22_start_date, w_std_date -1)  <= w_std_date 
				and    coalesce(tdm22_end_date  , w_std_date +1)  >= w_std_date

            )
            select cncl_id, cncl_nm 
                , string_agg(cncl_memb_tp_nm::text, ',' order by tdm22_member_type) as cncl_memb_tp_nm
                , string_agg(tdm22_member_type::text, ',' order by tdm22_member_type) as cncl_memb_tp_cd
                , max( open_cycle_nm) open_cycle_nm
                , max(tdm05_main_decision) main_decision  --, ;  rr.sys99_text02 := r1.cncl_memb_tp_nm;  rr.sys99_text03  := r1.open_cycle_nm;  rr.sys99_text04 := r1.tdm05_main_decision
            from  list_2
            group by  cncl_id, cncl_nm

        LOOP

            if    r1.cncl_memb_tp_cd in ('CM,MB', 'CM,MB,SE', 'CM,SE' ) then  r1.cncl_memb_tp_nm := '위원장';
            elsif r1.cncl_memb_tp_cd in ('MB,SE' ) then  r1.cncl_memb_tp_nm := '위원';
            end if;

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
            from   getTdm30RoleAllc(p_company_id, w_std_date, false)
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
                 , case when coalesce(tdm30_add_title_yn,'false') = 'false' then  1 else  2 end    AS add_title_yn_seq
                 , tdm30_role_id                                            AS tdm30_role_id
                 , tdm30_role_allc_detail_id                                AS tdm30_role_allc_detail_id
              FROM getTdm30RoleAllc(p_company_id, w_std_date, false)
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
                    if rr.sys99_text03 is null then
                        rr.sys99_text03 := '';
                    else
                        rr.sys99_text03 := rr.sys99_text03 || chr(10);
                    end if;
                    rr.sys99_text03 := rr.sys99_text03 || '[관련내규]' || chr(10)  || r2.raw_nms ;
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
    $function$
```
