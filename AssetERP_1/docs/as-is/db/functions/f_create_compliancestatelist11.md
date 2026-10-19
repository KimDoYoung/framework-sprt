# f_create_compliancestatelist11

## FUNCTION public.f_create_compliancestatelist11(p_group_id numeric)

- 반환: `text`
- 줄 수: 120

```sql
CREATE OR REPLACE FUNCTION public.f_create_compliancestatelist11(p_group_id numeric)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_COL           RECORD;
    c_ROW           RECORD;

    v_COL_CNT       NUMERIC := 2;
    v_COLUMN        VARCHAR(14);
    v_SQL           TEXT;

    v_GROUP_ID      NUMERIC;
    v_RETURN_SQL    TEXT;

    v_errMsg        VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_GROUP_ID   := f_create_seq();
    v_RETURN_SQL := 'SELECT row_number() over(order by sys99_long01) as sys99_print_id'
                  ||'     , sys99_string01, sys99_string02';
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
         AND sys99_string05 = '000'
         AND sys99_long01  != 0
       UNION ALL
      SELECT *
        FROM ( SELECT f_create_batchseq()
                    , sys99_company_id
                    , sys99_person_id
                    , sys99_window_class_nm
                    , v_GROUP_ID
                    , 0         sys99_long01
                    , '부서'    sys99_string01
                    , '사원'    sys99_string02
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
        v_RETURN_SQL := v_RETURN_SQL||', '||v_COLUMN;
        ---------------------------------------------------------------------------------
        v_SQL := 'UPDATE sys99_print'
               ||'   SET '||v_COLUMN||' = '''||c_COL.complianceTypeName||''''
               ||' WHERE sys99_group_id = '||v_GROUP_ID
               ||'   AND sys99_long01   = '||c_COL.seq;
        
        RAISE NOTICE 'v_SQL : %', v_SQL;
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
    v_RETURN_SQL := v_RETURN_SQL
                 ||'  FROM sys99_print'
                 ||' WHERE sys99_group_id = '||v_GROUP_ID;
    -------------------------------------------------------------------------------------
    RETURN v_RETURN_SQL;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN NULL;
END;
$function$
```
