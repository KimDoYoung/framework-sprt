# f_dud2

## FUNCTION public.f_dud2()

- 반환: `character varying`
- 줄 수: 146

```sql
CREATE OR REPLACE FUNCTION public.f_dud2()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c1              RECORD;
    c2              RECORD;
    c3              RECORD;
    
    v_MKT01         mkt01_target_company%rowtype;
    v_MKT02         mkt02_manager%rowtype;
    v_MKT03         mkt03_history%rowtype;
    v_MKT04         mkt04_relate_fund%rowtype;
    v_MKT05         mkt05_share%rowtype;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 영임 작업용 Function !!!!
    -------------------------------------------------------------------------------------
    -- 20205.08.01 업무활동처 및 이익제공처 Table 변경 (crm -> mkt)
    /*FOR c1 IN ( SELECT crm09_company_id
                     , crm09_item_type_cd
                     , crm09_contact_nm
                  FROM crm09_contact
                       INNER JOIN sys01_company ON sys01_company_id = crm09_company_id
                 WHERE COALESCE(sys01_use_yn,'false') = 'true'
                   AND crm09_company_id = 202307058004523      ------------------------------------------------{회사ID 입력}
                 GROUP BY crm09_company_id, crm09_item_type_cd, crm09_contact_nm
    ) LOOP

        RAISE NOTICE '활동처 : %', c1.crm09_contact_nm;

        ---------------------------------------------------------------------------------
        -- 1. 활동처 생성
        ---------------------------------------------------------------------------------
        v_MKT01 := NULL;
        ---------------------------------------------------------------------------------
        v_MKT01.mkt01_target_company_id := f_create_seq()           ;
        v_MKT01.mkt01_company_id        := c1.crm09_company_id      ;
        v_MKT01.mkt01_item_type_cd      := c1.crm09_item_type_cd    ;
        v_MKT01.mkt01_target_company_nm := c1.crm09_contact_nm      ;
        v_MKT01.mkt01_addr              := null                     ;
        v_MKT01.mkt01_tel               := null                     ;
        v_MKT01.mkt01_note              := NULL                     ;
        v_MKT01.mkt01_unuse_yn          := 'false'                  ;

        INSERT INTO mkt01_target_company VALUES (v_MKT01.*);

        ---------------------------------------------------------------------------------
        FOR c2 IN ( SELECT * 
                      FROM crm09_contact
                     WHERE crm09_company_id    = c1.crm09_company_id
                       AND crm09_item_type_cd  = c1.crm09_item_type_cd
                       AND crm09_contact_nm    = c1.crm09_contact_nm
        ) LOOP
        
            RAISE NOTICE '담당자 : %', c2.crm09_contact_emp_nm;

            -----------------------------------------------------------------------------
            -- 2. 담당자 생성
            -----------------------------------------------------------------------------
            v_MKT02 := NULL;
            -----------------------------------------------------------------------------
            v_MKT02.mkt02_manager_id        := c2.crm09_contact_id                                      ;
            v_MKT02.mkt02_target_company_id := v_MKT01.mkt01_target_company_id                          ;
            v_MKT02.mkt02_manager_nm        := c2.crm09_contact_emp_nm                                  ;
            v_MKT02.mkt02_org_nm            := c2.crm09_contact_org_nm                                  ;
            v_MKT02.mkt02_pos_nm            := COALESCE(c2.crm09_contact_pos, c2.crm09_contact_title)   ;
            v_MKT02.mkt02_email_addr        := c2.crm09_contact_email_addr                              ;
            v_MKT02.mkt02_retire_info       := null                                                     ;
            v_MKT02.mkt02_note              := c2.crm09_major_issues                                    ;
            v_MKT02.mkt02_company_id        := c2.crm09_company_id                                      ;

            IF COALESCE(c2.crm09_contact_tel_no,'') != '' THEN
                v_MKT02.mkt02_tel   := c2.crm09_contact_tel_no;

                IF COALESCE(c2.crm09_contact_mobile_no,'') != '' THEN
                    v_MKT02.mkt02_tel := v_MKT02.mkt02_tel || ', ' ||c2.crm09_contact_mobile_no;
                END IF;
            ELSE
                v_MKT02.mkt02_tel := c2.crm09_contact_mobile_no;
            END IF;

            INSERT INTO mkt02_manager VALUES (v_MKT02.*);

            -----------------------------------------------------------------------------
            -- 3. 업무활동내역 생성
            -----------------------------------------------------------------------------
            FOR c3 IN ( SELECT *
                          FROM crm12_work_detail
                         WHERE crm12_contact_id = c2.crm09_contact_id
            ) LOOP
                -------------------------------------------------------------------------
                v_MKT03 := NULL;
                -------------------------------------------------------------------------
                v_MKT03.mkt03_history_id        := c3.crm12_work_detail_id          ;
                v_MKT03.mkt03_company_id        := c3.crm12_company_id              ;
                v_MKT03.mkt03_person_id         := c3.crm12_person_id               ;
                v_MKT03.mkt03_reg_date          := c3.crm12_reg_date                ;
                v_MKT03.mkt03_target_company_id := v_MKT01.mkt01_target_company_id  ;
                v_MKT03.mkt03_activity_date     := c3.crm12_work_date               ;
                v_MKT03.mkt03_activity_title    := c3.crm12_work_nm                 ;
                v_MKT03.mkt03_activity_content  := c3.crm12_work_content            ;
                v_MKT03.mkt03_private_yn        := c3.crm12_private_yn              ;
                v_MKT03.mkt03_note              := c3.crm12_note                    ;

                INSERT INTO mkt03_history VALUES (v_MKT03.*);

                -- 연관펀드(MKT04) 생성
                INSERT
                  INTO mkt04_relate_fund
                SELECT crm13_relate_fund_id
                     , crm13_work_detail_id
                     , crm13_fund_id
                     , c3.crm12_company_id
                  FROM crm13_relate_fund
                 WHERE crm13_work_detail_id = c3.crm12_work_detail_id;

                -- 공유정보(MKT05) 생성
                INSERT
                  INTO mkt05_share
                SELECT crm15_share_id
                     , crm15_work_detail_id
                     , crm15_share_cd
                     , crm15_person_id
                     , crm15_org_id
                     , crm15_company_id
                  FROM crm15_share
                 WHERE crm15_work_detail_id = c3.crm12_work_detail_id;

            END LOOP;
        END LOOP;
    END LOOP;*/

    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN SQLERRM;

END;
$function$
```
