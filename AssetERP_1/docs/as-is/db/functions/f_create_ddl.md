# f_create_ddl

## FUNCTION public.f_create_ddl(p_table text, p_type text, p_drop_yn boolean)

- 반환: `text`
- 줄 수: 275

```sql
CREATE OR REPLACE FUNCTION public.f_create_ddl(p_table text, p_type text, p_drop_yn boolean)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_DROP_YN       BOOLEAN;

    c_TBL           RECORD;
    c_COL           RECORD;
    v_CNT           NUMERIC;

    v_BACKUP_TBL_ID TEXT;
    v_BACKUP_TBL_NM TEXT;
    v_COL_ID        TEXT;

    v_UPD_NM_SQL    TEXT;
    v_DROP_SQL      TEXT;
    v_CREATE_SQL    TEXT;
    v_COMMENT_SQL   TEXT;

    v_RESULT_MSG    TEXT;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_drop_yn IS NULL THEN
        v_DROP_YN := false;
    ELSE
        v_DROP_YN := p_drop_yn;
    END IF;

    --===================================================================================
    --
    -- 1. CREATE BACK-UP TABLE
    --
    --===================================================================================
    IF UPPER(p_type) IN ('ALL', '1') THEN
        ---------------------------------------------------------------------------------
        -- table get
        FOR c_TBL IN ( SELECT relname               AS tbl_id
                            , obj_description(oid)  AS tbl_nm
                         FROM pg_catalog.pg_class
                        WHERE relkind = 'r'
                          AND relname LIKE LOWER(p_table)
                          AND relname NOT LIKE 'tdm_bak%'
                          AND relname NOT LIKE 'tdmbak%'
                        ORDER BY 1
        ) LOOP
            -----------------------------------------------------------------------------
            v_BACKUP_TBL_ID := SUBSTR(c_TBL.tbl_id,1,3)||'bak'||SUBSTR(c_TBL.tbl_id,4);
            v_BACKUP_TBL_NM := CONCAT('[백업]', c_TBL.tbl_nm);
            -----------------------------------------------------------------------------
            IF v_DROP_YN THEN
                v_DROP_SQL := 'DROP TABLE IF EXISTS '||v_BACKUP_TBL_ID;
                RAISE NOTICE '---- 백업테이블 제거 : %', v_DROP_SQL;
                EXECUTE v_DROP_SQL;
            END IF;
            -----------------------------------------------------------------------------
            v_CREATE_SQL := 'CREATE TABLE IF NOT EXISTS '|| v_BACKUP_TBL_ID ||' ('                             ||CHR(10)
                         || '    '||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_id          numeric not null' ||CHR(10)
                         || '   ,'||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_dml_type    varchar(10)'      ||CHR(10)
                         || '   ,'||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_dml_user_nm varchar(50)'      ||CHR(10)
                         || '   ,'||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_dml_date    timestamp'        ||CHR(10);

            v_COMMENT_SQL := 'COMMENT ON TABLE  '|| v_BACKUP_TBL_ID ||' IS '''|| v_BACKUP_TBL_NM ||''';'                                                        ||CHR(10)
                          || 'COMMENT ON COLUMN '|| v_BACKUP_TBL_ID ||'.'||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_id            IS '''||v_BACKUP_TBL_NM||'ID(PK)'';'    ||CHR(10)
                          || 'COMMENT ON COLUMN '|| v_BACKUP_TBL_ID ||'.'||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_dml_type      IS ''데이터조작구분(UPDATE/DELETE)'';'  ||CHR(10)
                          || 'COMMENT ON COLUMN '|| v_BACKUP_TBL_ID ||'.'||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_dml_user_nm   IS ''데이터조작자'';'                   ||CHR(10)
                          || 'COMMENT ON COLUMN '|| v_BACKUP_TBL_ID ||'.'||SUBSTR(v_BACKUP_TBL_ID,1,8)||'_dml_date      IS ''데이터조작일시'';'                 ||CHR(10);

            -----------------------------------------------------------------------------
            -- column get
            FOR c_COL IN ( SELECT c.attnum                                  AS col_num
                                , c.attname                                 AS col_id
                                , col_description(c.attrelid, c.attnum)     AS col_nm
                                , format_type(c.atttypid, c.atttypmod)      AS data_type
                             FROM pg_catalog.pg_class t
                                  INNER JOIN pg_catalog.pg_attribute c ON c.attrelid = t.oid
                            WHERE t.relname         = c_TBL.tbl_id
                              AND t.relkind         = 'r'
                              AND c.attisdropped    = 'false'
                              AND c.attnum          > 0
                            ORDER BY c.attnum
            ) LOOP
                -------------------------------------------------------------------------
                v_COL_ID      := SUBSTR(v_BACKUP_TBL_ID,1,8)||'_'||SUBSTR(c_COL.col_id,7);
                v_CREATE_SQL  := v_CREATE_SQL  || '   ,'|| v_COL_ID ||' '|| c_COL.data_type ||CHR(10);
                IF c_COL.col_nm IS NOT NULL THEN
                    v_COMMENT_SQL := v_COMMENT_SQL || 'COMMENT ON COLUMN '|| v_BACKUP_TBL_ID ||'.'|| v_COL_ID ||' IS '''|| c_COL.col_nm ||''';' ||CHR(10);
                END IF;

            END LOOP;
            -----------------------------------------------------------------------------
            v_CREATE_SQL := v_CREATE_SQL || '   ,PRIMARY KEY('|| SUBSTR(v_BACKUP_TBL_ID,1,8) ||'_id) );'||CHR(10);

            RAISE NOTICE '---- 백업테이블 생성         : %', v_CREATE_SQL;
            EXECUTE v_CREATE_SQL;

            RAISE NOTICE '---- 백업테이블 COMMENT 생성 : %', v_COMMENT_SQL;
            EXECUTE v_COMMENT_SQL;

        END LOOP; --table end
    END IF;

    --===================================================================================
    --
    -- 2. CREATE 백업테이블 TRIGGER
    --
    --===================================================================================
    IF UPPER(p_type) IN ('ALL', '2') THEN
        ---------------------------------------------------------------------------------
        -- table get
        FOR c_TBL IN ( SELECT relname               AS tbl_id
                            , obj_description(oid)  AS tbl_nm
                         FROM pg_catalog.pg_class
                        WHERE relkind = 'r'
                          AND relname LIKE LOWER(p_table)
                          AND relname NOT LIKE 'tdm_bak%'
                          AND relname NOT LIKE 'tdmbak%'
                        ORDER BY 1
        ) LOOP
            -----------------------------------------------------------------------------
            IF v_DROP_YN THEN
                v_DROP_SQL := 'DROP FUNCTION IF EXISTS '|| c_TBL.tbl_id ||'_backup()';
                RAISE NOTICE '---- 백업트리거 제거 : %', v_DROP_SQL;
                EXECUTE v_DROP_SQL;
            END IF;
            -----------------------------------------------------------------------------

            --등록(변경)자가 없는 테이블이 존재함(예외처리필요)
            /*SELECT COUNT(*)
              INTO v_CNT
              FROM pg_catalog.pg_class t
                   INNER JOIN pg_catalog.pg_attribute c ON c.attrelid = t.oid
             WHERE t.relname         = c_TBL.tbl_id
               AND t.relkind         = 'r'
               AND c.attisdropped    = 'false'
               AND c.attnum          > 0
               AND SUBSTR(c.attname,7) = 'upd_nm';

            IF COALESCE(v_CNT,0) = 0 THEN*/
                v_UPD_NM_SQL := '     , current_setting(''app.current_user'', true)' ||CHR(10);
            /*ELSE
                v_UPD_NM_SQL := '     , CASE WHEN TG_OP = ''DELETE'' THEN current_setting(''app.current_user'', true)'  ||CHR(10)
                             || '            ELSE NEW.'|| SUBSTR(c_TBL.tbl_id,1,5) ||'_upd_nm END'                      ||CHR(10);
            END IF;*/

            v_CREATE_SQL := 'CREATE OR REPLACE FUNCTION '|| c_TBL.tbl_id ||'_backup()'                              ||CHR(10)
                         || 'RETURNS TRIGGER '                                                                      ||CHR(10)
                         || 'LANGUAGE ''plpgsql'' '                                                                 ||CHR(10)
                         || 'AS $B$ '                                                                               ||CHR(10)
                         || 'BEGIN'                                                                                 ||CHR(10)
                         || 'INSERT INTO ' || SUBSTR(c_TBL.tbl_id,1,3)||'bak'||SUBSTR(c_TBL.tbl_id,4)               ||CHR(10)
                         || 'SELECT f_create_batchseq()'                                                            ||CHR(10)
                         || '     , TG_OP'                                                                          ||CHR(10)
                         || v_UPD_NM_SQL
                         || '     , now()'                                                                          ||CHR(10);

            -----------------------------------------------------------------------------
            -- column get
            FOR c_COL IN ( SELECT c.attname     AS col_id
                             FROM pg_catalog.pg_class t
                                  INNER JOIN pg_catalog.pg_attribute c ON c.attrelid = t.oid
                            WHERE t.relname         = c_TBL.tbl_id
                              AND t.relkind         = 'r'
                              AND c.attisdropped    = 'false'
                              AND c.attnum          > 0
                            ORDER BY c.attnum
            ) LOOP
                -------------------------------------------------------------------------
                v_CREATE_SQL := v_CREATE_SQL ||'     , CASE WHEN TG_OP = ''DELETE'' THEN OLD.'|| c_COL.col_id || ' ELSE NEW.' || c_COL.col_id ||' END' ||CHR(10);

            END LOOP;
            -----------------------------------------------------------------------------
            v_CREATE_SQL := v_CREATE_SQL
                         || '     ;'                                    ||CHR(10)
                         || ' '                                         ||CHR(10)
                         || 'RETURN NULL;'                              ||CHR(10)
                         || 'EXCEPTION WHEN OTHERS THEN RETURN NULL;'   ||CHR(10)
                         || 'END;'                                      ||CHR(10)
                         || '$B$;'                                      ||CHR(10);

            RAISE NOTICE '---- 백업DATA INSERT Function 생성 : %', v_CREATE_SQL;
            EXECUTE v_CREATE_SQL;

            EXECUTE 'DROP TRIGGER IF EXISTS trigger_aft_'|| c_TBL.tbl_id ||' ON '|| c_TBL.tbl_id;
            EXECUTE 'CREATE TRIGGER trigger_aft_'|| c_TBL.tbl_id ||' AFTER INSERT OR UPDATE OR DELETE ON '|| c_TBL.tbl_id ||' FOR EACH ROW EXECUTE PROCEDURE '|| c_TBL.tbl_id ||'_backup();';

        END LOOP; --table end
    END IF;

    --===================================================================================
    --
    -- 3. CREATE 작업일시 UPDATE TRIGGER
    --
    --===================================================================================
    /*IF UPPER(p_type) IN ('ALL', '3') THEN
        ---------------------------------------------------------------------------------
        -- table get
        FOR c_TBL IN ( SELECT relname               AS tbl_id
                            , obj_description(oid)  AS tbl_nm
                         FROM pg_catalog.pg_class t
                        WHERE relkind = 'r'
                          AND relname LIKE LOWER(p_table)
                          AND relname NOT LIKE 'tdm_bak%'
                          AND relname NOT LIKE 'tdmbak%'
                          AND EXISTS ( --등록(변경)일시가 있는 테이블만 생성
                                       SELECT 1
                                         FROM pg_catalog.pg_attribute c
                                        WHERE c.attrelid        = t.oid
                                          AND c.attisdropped    = 'false'
                                          AND c.attnum          > 0
                                          AND SUBSTR(c.attname,7) = 'upd_date' )
                        ORDER BY 1
        ) LOOP
            -----------------------------------------------------------------------------
            IF v_DROP_YN THEN
                v_DROP_SQL := 'DROP FUNCTION IF EXISTS '|| c_TBL.tbl_id ||'_upd_date()';
                RAISE NOTICE '---- 작업일시 트리거 제거 : %', v_DROP_SQL;
                EXECUTE v_DROP_SQL;
            END IF;

            --등록(변경)자가 없는 테이블이 존재함(예외처리필요)
            SELECT COUNT(*)
              INTO v_CNT
              FROM pg_catalog.pg_class t
                   INNER JOIN pg_catalog.pg_attribute c ON c.attrelid = t.oid
             WHERE t.relname         = c_TBL.tbl_id
               AND t.relkind         = 'r'
               AND c.attisdropped    = 'false'
               AND c.attnum          > 0
               AND SUBSTR(c.attname,7) = 'upd_nm';

            v_UPD_NM_SQL := '';
            IF COALESCE(v_CNT,0) != 0 THEN
                v_UPD_NM_SQL := '    IF COALESCE(current_setting(''app.current_user'', true),'''') != '''' THEN'                        ||CHR(10)
                             || '        NEW.'|| SUBSTR(c_TBL.tbl_id,1,5) ||'_upd_nm := current_setting(''app.current_user'', true);'   ||CHR(10)
                             || '    END IF;'                                                                                           ||CHR(10);
            END IF;
            -----------------------------------------------------------------------------
            v_CREATE_SQL := 'CREATE OR REPLACE FUNCTION '|| c_TBL.tbl_id ||'_upd_date()'                                            ||CHR(10)
                         || 'RETURNS TRIGGER '                                                                                      ||CHR(10)
                         || 'LANGUAGE ''plpgsql'' '                                                                                 ||CHR(10)
                         || 'AS $B$ '                                                                                               ||CHR(10)
                         || 'BEGIN'                                                                                                 ||CHR(10)
                         || v_UPD_NM_SQL
                         || '    NEW.'|| SUBSTR(c_TBL.tbl_id,1,5) ||'_upd_date := now();'                                           ||CHR(10)
                         || '    RETURN NEW;'                                                                                       ||CHR(10)
                         || 'EXCEPTION WHEN OTHERS THEN RETURN NULL;'                                                               ||CHR(10)
                         || 'END;'                                                                                                  ||CHR(10)
                         || '$B$;'                                                                                                  ||CHR(10);

            RAISE NOTICE '---- 작업일시 UPDATE Function 생성 : %', v_CREATE_SQL;
            EXECUTE v_CREATE_SQL;

            EXECUTE 'DROP TRIGGER IF EXISTS trigger_bef_'|| c_TBL.tbl_id ||' ON '|| c_TBL.tbl_id;
            EXECUTE 'CREATE TRIGGER trigger_bef_'|| c_TBL.tbl_id ||' BEFORE INSERT OR UPDATE ON '|| c_TBL.tbl_id ||' FOR EACH ROW EXECUTE PROCEDURE '|| c_TBL.tbl_id ||'_upd_date();';

        END LOOP; --table end
    END IF;*/

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
