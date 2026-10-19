# f_create_compliancestatelist

## FUNCTION public.f_create_compliancestatelist(p_group_id numeric)

- 반환: `numeric`
- 줄 수: 143

```sql
CREATE OR REPLACE FUNCTION public.f_create_compliancestatelist(p_group_id numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_COL           RECORD;
    c_ROW           RECORD;
    c_DATA          RECORD;

    v_CNT           NUMERIC := 0;
    v_COL_CNT       NUMERIC := 2;
    v_COLUMN        VARCHAR(14);
    v_SQL           TEXT;

    v_GROUP_ID      NUMERIC;
    v_LIST_SQL      TEXT;

    v_TMP_CD        sys99_print.sys99_string05%TYPE;

    v_errMsg        VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_GROUP_ID   := f_create_seq();
    v_LIST_SQL   := 'SELECT sys99_print_id, ';
    -------------------------------------------------------------------------------------
    SELECT MIN(sys99_string05)
      INTO v_TMP_CD
      FROM sys99_print
     WHERE sys99_group_id = p_group_id;
    -------------------------------------------------------------------------------------
    -- 부서/사원정보 INSERT
    -------------------------------------------------------------------------------------
    INSERT
      INTO sys99_print ( sys99_print_id
                       , sys99_company_id
                       , sys99_person_id
                       , sys99_window_class_nm
                       , sys99_group_id
                       , sys99_long01
                       , sys99_string01
                       , sys99_string02
    ) SELECT f_create_batchseq()
           , sys99_company_id
           , sys99_person_id
           , sys99_window_class_nm
           , v_GROUP_ID
           , sys99_long01
           , sys99_string01
           , sys99_string02
        FROM sys99_print
       WHERE sys99_group_id = p_group_id
         --AND sys99_string05 = '000' (2024.11.01 CYY - 기준코드는 변경하면 안되는데... 변경해버린 회사가 존재함.)
         AND sys99_string05 = v_TMP_CD
         AND sys99_long01  != 0
       UNION ALL
      SELECT *
        FROM ( SELECT f_create_batchseq()
                    , sys99_company_id
                    , sys99_person_id
                    , sys99_window_class_nm
                    , v_GROUP_ID
                    , 0         sys99_long01
                    , '사원'    sys99_string01
                    , '부서'    sys99_string02
                 FROM sys99_print
                WHERE sys99_group_id = p_group_id
                LIMIT 1 ) header
       ORDER BY sys99_long01;

    -------------------------------------------------------------------------------------
    -- 집계표 양식으로 생성
    -------------------------------------------------------------------------------------
    FOR c_COL IN ( SELECT sys99_long01      seq
                        , sys99_string05    complianceTypeCode
                        , sys99_string06    complianceTypeName
                     FROM sys99_print
                    WHERE sys99_group_id = p_group_id
                      AND sys99_long01   = 0
                    ORDER BY sys99_string05
    ) LOOP
        ---------------------------------------------------------------------------------
        v_COL_CNT    := v_COL_CNT + 1;
        v_COLUMN     := 'sys99_string'||LPAD(v_COL_CNT||'',2,'0');
        ---------------------------------------------------------------------------------
        IF v_CNT = 0 THEN
            v_LIST_SQL := v_LIST_SQL||v_COLUMN;
        ELSE
            v_LIST_SQL := v_LIST_SQL||'||''##''||'||v_COLUMN;
        END IF;
        v_CNT := v_CNT + 1;
        ---------------------------------------------------------------------------------
        v_SQL := 'UPDATE sys99_print'
               ||'   SET '||v_COLUMN||' = '''||c_COL.complianceTypeName||''''
               ||' WHERE sys99_group_id = '||v_GROUP_ID
               ||'   AND sys99_long01   = '||c_COL.seq;
        
        --RAISE NOTICE 'v_SQL : %', v_SQL;
        ---------------------------------------------------------------------------------
        EXECUTE v_SQL;
        ---------------------------------------------------------------------------------
        FOR c_ROW IN ( SELECT sys99_long01      seq
                            , sys99_string07    complianceResult
                         FROM sys99_print
                        WHERE sys99_group_id = p_group_id
                          AND sys99_string05 = c_COL.complianceTypeCode
                          AND sys99_long01  != 0
                        ORDER BY sys99_long01
        ) LOOP
            -----------------------------------------------------------------------------
            v_SQL := 'UPDATE sys99_print'
                   ||'   SET '||v_COLUMN||' = '''||c_ROW.complianceResult||''''
                   ||' WHERE sys99_group_id = '||v_GROUP_ID
                   ||'   AND sys99_long01   = '||c_ROW.seq;
            
            RAISE NOTICE 'v_SQL : %', v_SQL;
            -----------------------------------------------------------------------------
            EXECUTE v_SQL;
        END LOOP;
    END LOOP;
    -------------------------------------------------------------------------------------
    v_LIST_SQL   := v_LIST_SQL||' as sys99_text01'
                 ||'  FROM sys99_print'
                 ||' WHERE sys99_group_id = '||v_GROUP_ID
                 ||' ORDER BY sys99_long01';
    RAISE NOTICE 'v_LIST_SQL : %', v_LIST_SQL;
    -------------------------------------------------------------------------------------
    FOR c_DATA IN EXECUTE v_LIST_SQL LOOP
        UPDATE sys99_print
           SET sys99_text01 = c_DATA.sys99_text01
         WHERE sys99_print_id = c_DATA.sys99_print_id;
    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN v_GROUP_ID;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN NULL;
END;
$function$
```
