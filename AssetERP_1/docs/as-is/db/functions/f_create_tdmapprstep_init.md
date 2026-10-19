# f_create_tdmapprstep_init

## FUNCTION public.f_create_tdmapprstep_init(p_company_id numeric)

- 반환: `character varying`
- 줄 수: 163

```sql
CREATE OR REPLACE FUNCTION public.f_create_tdmapprstep_init(p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_STD_DATE          DATE := f_today();

    c_ORG               RECORD;
    c_ROLE              RECORD;
    c_SUB_ORG           RECORD;
    v_TDM09             tdm09_appr_step%ROWTYPE;

    c_OTHER             RECORD;
    c_OTHER_SUB         RECORD;

    v_SEQ               NUMERIC;
    v_LAST_APPR_EMP_ID  NUMERIC;
    v_PARENT_ID         NUMERIC;
    v_CNT               NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 책무이행점검을 수행하는 부서List
    FOR c_ORG IN ( SELECT *
                     FROM getOrg(p_company_id, v_STD_DATE)
                    WHERE 1=1
                      AND COALESCE(org00_tdm_yn,'false') = 'true'
                    ORDER BY org00_parent_code_id, org00_sort_order
    ) LOOP
        ---------------------------------------------------------------------------------
        v_SEQ           := 0;
        v_PARENT_ID     := 0;

        RAISE NOTICE '책무이행점검 수행조직 : %', c_ORG.org00_org_id;
        ---------------------------------------------------------------------------------
        -- 연결된 직책List (이미 등록되어 있는 경우 SKIP)
        FOR c_ROLE IN ( SELECT DISTINCT tdm30_role_id, tdm30_person_id
                          FROM getTdm30RoleAllc(p_company_id, null, false)
                               INNER JOIN tdm23_role_relate_org ON tdm23_role_id = tdm30_role_id
                         WHERE tdm23_org_id = c_ORG.org00_org_id
                           AND NOT EXISTS ( SELECT 1
                                              FROM tdm09_appr_step
                                             WHERE tdm09_company_id = tdm30_company_id
                                               AND tdm09_role_id    = tdm30_role_id
                                               AND tdm09_org_id     = tdm23_org_id )
                         ORDER BY tdm30_role_id
        ) LOOP
            -----------------------------------------------------------------------------
            v_TDM09 := NULL;

            v_TDM09.tdm09_appr_step_id  := f_create_seq()           ;
            v_TDM09.tdm09_company_id    := p_company_id             ;
            v_TDM09.tdm09_role_id       := c_ROLE.tdm30_role_id     ;
            v_TDM09.tdm09_org_id        := c_ORG.org00_org_id       ;
            v_TDM09.tdm09_type_cd       := 'C'                      ;
            v_TDM09.tdm09_parent_id     := 0                        ;
            v_TDM09.tdm09_appr_seq      := NULL                     ;
            v_TDM09.tdm09_appr_emp_id   := NULL                     ;
            v_TDM09.tdm09_upd_nm        := 'system'                 ;
            v_TDM09.tdm09_upd_date      := f_sysdate()              ;

            INSERT INTO tdm09_appr_step VALUES (v_TDM09.*);

            v_PARENT_ID := v_TDM09.tdm09_appr_step_id;
            v_LAST_APPR_EMP_ID := NULL;

            -----------------------------------------------------------------------------
            -- 승인선 생성
            FOR c_SUB_ORG IN ( WITH RECURSIVE org ( org_id
                                                  , parent_id
                                                  , depth
                                                  , path
                                                  , org_nm
                               ) AS (
                                    SELECT org00_org_id                                    as org_id
                                         , org00_parent_code_id                            as parent_id
                                         , 0                                               as depth
                                         , ARRAY[org00_kor_nm::text]                       as path
                                         , org00_kor_nm                                    as org_nm
                                      FROM getOrg(p_company_id, v_STD_DATE)
                                     WHERE org00_org_id = c_ORG.org00_org_id
                                     UNION ALL
                                    SELECT org00_org_id
                                         , org00_parent_code_id
                                         , depth + 1
                                         , ARRAY_APPEND(path, org00_kor_nm::text)
                                         , org00_kor_nm
                                      FROM getOrg(p_company_id, v_STD_DATE)
                                           INNER JOIN org ON parent_id = org00_org_id
                                     WHERE NOT (org00_kor_nm = ANY(org.path))
                               )
                               SELECT org.*
                                    , emp00_org_head_id as org_head_id
                                 FROM org
                                      LEFT JOIN LATERAL ( SELECT emp00_org_code_id
                                                               , emp00_person_id    emp00_org_head_id
                                                            FROM getPerson(p_company_id, v_STD_DATE)
                                                           WHERE emp00_org_code_id = org_id
                                                             AND emp00_org_head_yn = 'true' ) t ON TRUE
                                WHERE emp00_org_head_id IS NOT NULL
                                  AND parent_id != 0
            ) LOOP
                -------------------------------------------------------------------------
                v_TDM09 := NULL;
                v_SEQ   := v_SEQ + 1;

                --RAISE NOTICE '%) %, %', v_SEQ, c_SUB_ORG.org_nm, c_SUB_ORG.path;

                -------------------------------------------------------------------------
                v_TDM09.tdm09_appr_step_id  := f_create_seq()           ;
                v_TDM09.tdm09_company_id    := p_company_id             ;
                v_TDM09.tdm09_role_id       := c_ROLE.tdm30_role_id     ;
                v_TDM09.tdm09_org_id        := c_ORG.org00_org_id       ;
                v_TDM09.tdm09_type_cd       := 'T'                      ;
                v_TDM09.tdm09_parent_id     := v_PARENT_ID              ;
                v_TDM09.tdm09_appr_seq      := v_SEQ                    ;
                v_TDM09.tdm09_appr_emp_id   := c_SUB_ORG.org_head_id    ;
                v_TDM09.tdm09_upd_nm        := 'system'                 ;
                v_TDM09.tdm09_upd_date      := f_sysdate()              ;
                
                INSERT INTO tdm09_appr_step VALUES (v_TDM09.*);
                RAISE NOTICE 'insert!!';

                v_LAST_APPR_EMP_ID := v_TDM09.tdm09_appr_emp_id;
                -------------------------------------------------------------------------
            END LOOP;   -- c_SUB_ORG end

            -- 최종승인자가 임원이 아닌 경우 강제로 추가 (조직도상 상위조직장이 임원이 아닌 경우임)
            --RAISE NOTICE ' - 최종승인자 : %', v_LAST_APPR_EMP_ID;
            --RAISE NOTICE ' - 임원       : %', c_ROLE.tdm30_person_id;

            IF COALESCE(v_LAST_APPR_EMP_ID,-1) != c_ROLE.tdm30_person_id THEN
                -------------------------------------------------------------------------
                v_TDM09 := NULL;
                v_TDM09.tdm09_appr_step_id  := f_create_seq()           ;
                v_TDM09.tdm09_company_id    := p_company_id             ;
                v_TDM09.tdm09_role_id       := c_ROLE.tdm30_role_id     ;
                v_TDM09.tdm09_org_id        := c_ORG.org00_org_id       ;
                v_TDM09.tdm09_type_cd       := 'T'                      ;
                v_TDM09.tdm09_parent_id     := v_PARENT_ID              ;
                v_TDM09.tdm09_appr_seq      := v_SEQ + 1                ;
                v_TDM09.tdm09_appr_emp_id   := c_ROLE.tdm30_person_id   ;
                v_TDM09.tdm09_upd_nm        := 'system'                 ;
                v_TDM09.tdm09_upd_date      := f_sysdate()              ;
                
                INSERT INTO tdm09_appr_step VALUES (v_TDM09.*);
                RAISE NOTICE 'insert!!';
            END IF;

        END LOOP; --c_ROLE end
    END LOOP;       -- c_ORG end

    RAISE NOTICE 'end!!';

    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN SQLERRM;
END;
$function$
```
