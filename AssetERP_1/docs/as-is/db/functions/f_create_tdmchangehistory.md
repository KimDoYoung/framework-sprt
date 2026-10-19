# f_create_tdmchangehistory

## FUNCTION public.f_create_tdmchangehistory(p_data jsonb)

- 반환: `text`
- 줄 수: 270

```sql
CREATE OR REPLACE FUNCTION public.f_create_tdmchangehistory(p_data jsonb)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_TDM95         tdm95_change_history%ROWTYPE;
    v_TDM96         tdm96_change_detail%ROWTYPE;

    v_COMPANY_ID    NUMERIC := (p_data->>'companyId')::NUMERIC;
    v_EMP_NAME      TEXT    := (p_data->>'empName');
    v_CHANGE_TYPE   TEXT    := (p_data->>'changeType');
    v_REASON        TEXT    := (p_data->>'reason');
    v_MENU_NO       TEXT    := (p_data->>'menuNo');
    v_TARGET_TABLE  TEXT    := (p_data->>'targetTable');
    v_TARGET_KEY_ID TEXT    := (p_data->>'targetKeyId');
    v_DETAIL        JSONB;

    v_COL           RECORD;
    v_SELECT_COL    TEXT;
    v_SQL           TEXT;
    v_RESULT_MSG    TEXT;

/*---test sample---
SELECT f_create_tdmChangeHistory('{
    "reason": "테스트 중입니다",
    "targetTable": "tdm10_task",
    "companyId": 28000,
    "menuNo": "1412",
    "modiColumnList": [
        {
            "windowItemName": "공통책무여부",
            "columnName": "tdm10_common_yn",
            "afterData": "true"
        }
    ],
    "targetKeyId": "202507250000087",
    "empName": "천영임",
    "changeType": "UPDATE"
}'::jsonb);
*/
-----------------------------------------------------------------------------------------
BEGIN
    v_RESULT_MSG := '변경이력 생성시 오류발생';
    -------------------------------------------------------------------------------------
    IF v_CHANGE_TYPE != 'G-UPDATE' THEN --Grid Update 제외(하단의 Loop안에서 insert!!)
        v_TDM95.tdm95_change_history_id := f_create_seq()       ;
        v_TDM95.tdm95_company_id        := v_COMPANY_ID         ;
        v_TDM95.tdm95_change_emp_nm     := v_EMP_NAME           ;
        v_TDM95.tdm95_change_date       := f_sysdate()          ;
        v_TDM95.tdm95_reason            := v_REASON             ;
        v_TDM95.tdm95_menu_no           := v_MENU_NO            ;
        v_TDM95.tdm95_target_table      := v_TARGET_TABLE       ;
        v_TDM95.tdm95_target_id         := v_TARGET_KEY_ID      ;

        IF UPPER(v_CHANGE_TYPE) = 'UPDATE' THEN
            v_TDM95.tdm95_change_type := '변경';
        ELSIF UPPER(v_CHANGE_TYPE) = 'DELETE' THEN
            v_TDM95.tdm95_change_type := '삭제';
        END IF;

        RAISE NOTICE 'tdm95_change_history_id : %', v_TDM95.tdm95_change_history_id;
        RAISE NOTICE 'tdm95_company_id        : %', v_TDM95.tdm95_company_id       ;
        RAISE NOTICE 'tdm95_change_emp_nm     : %', v_TDM95.tdm95_change_emp_nm    ;
        RAISE NOTICE 'tdm95_change_date       : %', v_TDM95.tdm95_change_date      ;
        RAISE NOTICE 'tdm95_change_type       : %', v_TDM95.tdm95_change_type      ;
        RAISE NOTICE 'tdm95_reason            : %', v_TDM95.tdm95_reason           ;
        RAISE NOTICE 'tdm95_menu_no           : %', v_TDM95.tdm95_menu_no          ;
        RAISE NOTICE 'tdm95_target_table      : %', v_TDM95.tdm95_target_table     ;
        RAISE NOTICE 'tdm95_target_id         : %', v_TDM95.tdm95_target_id        ;
    /*
        call p_log('cyy',CONCAT('change_history_id : ', v_TDM95.tdm95_change_history_id));
        call p_log('cyy',CONCAT('company_id        : ', v_TDM95.tdm95_company_id       ));
        call p_log('cyy',CONCAT('change_emp_nm     : ', v_TDM95.tdm95_change_emp_nm    ));
        call p_log('cyy',CONCAT('change_date       : ', v_TDM95.tdm95_change_date      ));
        call p_log('cyy',CONCAT('change_type       : ', v_TDM95.tdm95_change_type      ));
        call p_log('cyy',CONCAT('reason            : ', v_TDM95.tdm95_reason           ));
        call p_log('cyy',CONCAT('menu_no           : ', v_TDM95.tdm95_menu_no          ));
        call p_log('cyy',CONCAT('target_table      : ', v_TDM95.tdm95_target_table     ));
        call p_log('cyy',CONCAT('target_id         : ', v_TDM95.tdm95_target_id        ));
    */
        INSERT INTO tdm95_change_history VALUES (v_TDM95.*);
    END IF;

    -------------------------------------------------------------------------------------
    IF v_CHANGE_TYPE = 'UPDATE' THEN
        ---------------------------------------------------------------------------------
        FOR v_COL IN ( SELECT *
                         FROM jsonb_to_recordset(p_data->'modiColumnList') t("windowItemName" text, "columnName" text, "afterData" text, "targetKeyId" text)
        ) LOOP
            -----------------------------------------------------------------------------
            v_TDM96 := NULL;
            -----------------------------------------------------------------------------
            v_TDM96.tdm96_change_detail_id  := f_create_seq()                       ;
            v_TDM96.tdm96_change_history_id := v_TDM95.tdm95_change_history_id      ;
            v_TDM96.tdm96_window_item_nm    := v_COL."windowItemName"               ;
            v_TDM96.tdm96_column_nm         := v_COL."columnName"                   ;
            v_TDM96.tdm96_after_data        := v_COL."afterData"                    ;
/*
            IF SUBSTR(v_TDM96.tdm96_column_nm, LENGTH(v_TDM96.tdm96_column_nm) + 1 - 4) = 'date' THEN
                v_SELECT_COL := 'TO_CHAR('||v_TDM96.tdm96_column_nm||',''yyyy-mm-dd'')';
            ELSE
                v_SELECT_COL := v_TDM96.tdm96_column_nm||'::text';
            END IF;

            v_SQL := 'SELECT CASE WHEN '||v_TDM96.tdm96_column_nm||' IS NULL THEN NULL'
                  || '            ELSE '||v_SELECT_COL ||' END'
                  || '  FROM '||v_TDM95.tdm95_target_table
                  || ' WHERE '||v_TDM95.tdm95_target_table||'_id = '||v_TDM95.tdm95_target_id;
*/

            v_SQL := 'SELECT '||v_TDM96.tdm96_column_nm ||'::text'
                  || '  FROM '||v_TDM95.tdm95_target_table
                  || ' WHERE '||v_TDM95.tdm95_target_table||'_id = '||v_TDM95.tdm95_target_id;

            RAISE NOTICE 'v_SQL : %', v_SQL;

            EXECUTE v_SQL INTO v_TDM96.tdm96_before_data;

            RAISE NOTICE 'tdm96_before_data : %', v_TDM96.tdm96_before_data;

            INSERT INTO tdm96_change_detail VALUES (v_TDM96.*);
        END LOOP;
    -------------------------------------------------------------------------------------
    ELSIF v_CHANGE_TYPE = 'G-UPDATE' THEN
        ---------------------------------------------------------------------------------
        v_TARGET_KEY_ID := '';
        ---------------------------------------------------------------------------------
        FOR v_COL IN ( SELECT t.*
                         FROM (
                                SELECT jsonb_array_elements(p_data->'modiColumnList') AS modi_column
                              ) t1
                              CROSS JOIN LATERAL jsonb_to_recordset(t1.modi_column) t("targetKeyId" text, "windowItemName" text, "columnName" text, "afterData" text)
                        ORDER BY 1
        ) LOOP

            RAISE NOTICE ' targetKeyId : %', v_COL."targetKeyId";
            
            -----------------------------------------------------------------------------
            IF v_TARGET_KEY_ID != v_COL."targetKeyId" THEN

                RAISE NOTICE 'IN';
                -------------------------------------------------------------------------
                v_TDM95         := NULL;
                v_TARGET_KEY_ID := v_COL."targetKeyId";
                -------------------------------------------------------------------------
                v_TDM95.tdm95_change_history_id := f_create_seq()       ;
                v_TDM95.tdm95_company_id        := v_COMPANY_ID         ;
                v_TDM95.tdm95_change_emp_nm     := v_EMP_NAME           ;
                v_TDM95.tdm95_change_date       := f_sysdate()          ;
                v_TDM95.tdm95_change_type       := '변경'               ;
                v_TDM95.tdm95_reason            := v_REASON             ;
                v_TDM95.tdm95_menu_no           := v_MENU_NO            ;
                v_TDM95.tdm95_target_table      := v_TARGET_TABLE       ;
                v_TDM95.tdm95_target_id         := v_TARGET_KEY_ID      ;

                RAISE NOTICE 'tdm95_change_history_id : %', v_TDM95.tdm95_change_history_id;
                RAISE NOTICE 'tdm95_company_id        : %', v_TDM95.tdm95_company_id       ;
                RAISE NOTICE 'tdm95_change_emp_nm     : %', v_TDM95.tdm95_change_emp_nm    ;
                RAISE NOTICE 'tdm95_change_date       : %', v_TDM95.tdm95_change_date      ;
                RAISE NOTICE 'tdm95_change_type       : %', v_TDM95.tdm95_change_type      ;
                RAISE NOTICE 'tdm95_reason            : %', v_TDM95.tdm95_reason           ;
                RAISE NOTICE 'tdm95_menu_no           : %', v_TDM95.tdm95_menu_no          ;
                RAISE NOTICE 'tdm95_target_table      : %', v_TDM95.tdm95_target_table     ;
                RAISE NOTICE 'tdm95_target_id         : %', v_TDM95.tdm95_target_id        ;

                INSERT INTO tdm95_change_history VALUES (v_TDM95.*);

                RAISE NOTICE 'tdm95 INSERT!!';
            END IF;
            -----------------------------------------------------------------------------
            v_TDM96 := NULL;
            -----------------------------------------------------------------------------
            v_TDM96.tdm96_change_detail_id  := f_create_seq()                       ;
            v_TDM96.tdm96_change_history_id := v_TDM95.tdm95_change_history_id      ;
            v_TDM96.tdm96_window_item_nm    := v_COL."windowItemName"               ;
            v_TDM96.tdm96_column_nm         := v_COL."columnName"                   ;
            v_TDM96.tdm96_after_data        := v_COL."afterData"                    ;

            v_SQL := 'SELECT '||v_TDM96.tdm96_column_nm ||'::text'
                  || '  FROM '||v_TDM95.tdm95_target_table
                  || ' WHERE '||v_TDM95.tdm95_target_table||'_id = '||v_TDM95.tdm95_target_id;

            RAISE NOTICE 'v_SQL : %', v_SQL;

            EXECUTE v_SQL INTO v_TDM96.tdm96_before_data;

            RAISE NOTICE 'tdm96_before_data : %', v_TDM96.tdm96_before_data;

            INSERT INTO tdm96_change_detail VALUES (v_TDM96.*);
        END LOOP;
    -------------------------------------------------------------------------------------
    ELSIF v_CHANGE_TYPE = 'DELETE' THEN
        ---------------------------------------------------------------------------------
        FOR v_COL IN ( SELECT c.attname                                 AS col_nm
                            , col_description(c.attrelid, c.attnum)     AS col_comment
                            , format_type(c.atttypid, c.atttypmod)      AS data_type
                         FROM pg_catalog.pg_class t
                              INNER JOIN pg_catalog.pg_attribute c ON c.attrelid = t.oid
                        WHERE t.relname = v_TDM95.tdm95_target_table
                          AND c.attisdropped = 'false'
                          AND c.attnum > 0
                          AND c.attname NOT IN (v_TDM95.tdm95_target_table||'_id', SUBSTR(v_TDM95.tdm95_target_table,1,5)||'_company_id')
                        ORDER BY c.attnum
        ) LOOP
            -----------------------------------------------------------------------------
            v_TDM96 := NULL;
            -----------------------------------------------------------------------------
            v_TDM96.tdm96_change_detail_id  := f_create_seq()                   ;
            v_TDM96.tdm96_change_history_id := v_TDM95.tdm95_change_history_id  ;
            v_TDM96.tdm96_column_nm         := v_COL.col_nm                     ;
            v_TDM96.tdm96_after_data        := NULL                             ;

            IF v_COL.col_nm = 'tdm10_task_class_cd' THEN
                v_TDM96.tdm96_window_item_nm := '책무구분';
            ELSIF v_COL.col_nm = 'tdm10_task_type_cd' THEN
                v_TDM96.tdm96_window_item_nm := '책무유형';
            ELSIF v_COL.col_nm = 'tdm20_role_type' THEN
                v_TDM96.tdm96_window_item_nm := '직책그룹';
            ELSIF v_COL.col_nm = 'tdm20_role_type_etc_nm' THEN
                v_TDM96.tdm96_window_item_nm := '기타그룹명';
            ELSIF v_COL.col_nm = 'tdm20_ceo_role_id' THEN
                v_TDM96.tdm96_window_item_nm := '보고CEO';
            ELSE
                v_TDM96.tdm96_window_item_nm := v_COL.col_comment;
            END IF;

            RAISE NOTICE 'col_comment : %', v_COL.col_comment;
            RAISE NOTICE 'col_nm      : %', v_COL.col_nm;
            RAISE NOTICE 'data_type   : %', v_COL.data_type;

            IF v_COL.data_type LIKE 'timestamp%' THEN
                v_SELECT_COL := 'TO_CHAR('||v_COL.col_nm||',''yyyy-mm-dd HH24:MI:SS'')';
            ELSIF v_COL.data_type = 'date' THEN
                v_SELECT_COL := 'TO_CHAR('||v_COL.col_nm||',''yyyy-mm-dd'')';
            ELSE
                v_SELECT_COL := v_COL.col_nm||'::text';
            END IF;

            RAISE NOTICE 'v_SELECT_COL : %', v_SELECT_COL;

            v_SQL := 'SELECT '||v_SELECT_COL
                  || '  FROM '||v_TDM95.tdm95_target_table
                  || ' WHERE '||v_TDM95.tdm95_target_table||'_id = '||v_TDM95.tdm95_target_id;

            RAISE NOTICE 'v_SQL : %', v_SQL;

            EXECUTE v_SQL INTO v_TDM96.tdm96_before_data;

            RAISE NOTICE 'tdm96_before_data : %', v_TDM96.tdm96_before_data;

            INSERT INTO tdm96_change_detail VALUES (v_TDM96.*);


        END LOOP;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_RESULT_MSG ;
        RETURN v_RESULT_MSG;
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_RESULT_MSG, SQLERRM ;
        RETURN v_RESULT_MSG||'-'||SQLERRM;
END;
$function$
```
