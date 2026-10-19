# f_get_insert_script

## FUNCTION public.f_get_insert_script(p_table_name character varying, p_id numeric)

- 반환: `text`
- 줄 수: 275

```sql
CREATE OR REPLACE FUNCTION public.f_get_insert_script(p_table_name character varying, p_id numeric)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_SQL           TEXT;
v_INSERT_TXT    TEXT;
v_VALUES        TEXT;
v_COLUMN        TEXT;
v_DATA          TEXT;

c_DATA          record;
c_INFO          record;
-----------------------------------------------------------------------------------------
BEGIN

    /*
     SELECT ARRAY_TO_STRING(ARRAY_AGG(column_name),', ')
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = 'sys30_leave_year' ;*/

    SELECT 'insert into '||p_table_name||' ('||ARRAY_TO_STRING(ARRAY_AGG(column_name),', ')||') values ('
      INTO v_INSERT_TXT
      FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name   = p_table_name ;

    v_VALUES := '';

    -------------------------------------------------------------------------------------
    IF p_table_name = 'dcr01_class_tree' THEN

    /*
    select f_get_insert_script('dcr01_class_tree', dcr01_class_tree_id)
    from dcr01_class_tree
    where dcr01_company_id = 0
    */

        FOR c_DATA IN ( SELECT *
                          FROM dcr01_class_tree
                         WHERE dcr01_company_id = 0
                           AND dcr01_class_tree_id = p_id
        ) LOOP
            -----------------------------------------------------------------------------
            FOR c_INFO IN ( SELECT column_name, data_type
                              FROM information_schema.COLUMNS
                             WHERE table_schema = 'public'
                               AND table_name   = p_table_name
            ) LOOP
                -------------------------------------------------------------------------
                IF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('CHAR','TEXT') THEN
                    v_COLUMN := 'SELECT ''''''''||replace('||c_INFO.column_name||', '''''''', '''''''''''')||''''''''';
                ELSIF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('DATE','TIME') THEN
                    v_COLUMN := 'SELECT ''''''''||TO_CHAR('||c_INFO.column_name||',''yyyy-mm-dd'')||'''''''' ';
                ELSE
                    v_COLUMN := 'SELECT '||c_INFO.column_name;
                END IF;
                -------------------------------------------------------------------------
                v_SQL := v_COLUMN
                        ||' FROM '||p_table_name
                        ||' WHERE '||p_table_name||'_id = '||c_DATA.dcr01_class_tree_id;
                --RAISE NOTICE 'v_SQL : %', v_SQL;

                EXECUTE v_SQL INTO v_DATA;
                --RAISE NOTICE 'v_DATA : %', v_DATA;

                IF v_DATA IS NULL THEN
                    v_DATA := 'null';
                END IF;
                IF v_VALUES != '' THEN
                    v_VALUES := v_VALUES||',';
                END IF;
                v_VALUES := v_VALUES||v_DATA;
            END LOOP;
        END LOOP;
    -------------------------------------------------------------------------------------
    ELSIF p_table_name = 'dcr20_relate_ics' THEN

        /*
        select f_get_insert_script('dcr20_relate_ics', dcr20_relate_ics_id)
        from dcr20_relate_ics
        where dcr20_company_id = 0
        */

        FOR c_DATA IN ( SELECT *
                          FROM dcr20_relate_ics
                         WHERE dcr20_company_id = 0
                           AND dcr20_relate_ics_id = p_id
        ) LOOP
            -----------------------------------------------------------------------------
            FOR c_INFO IN ( SELECT column_name, data_type
                              FROM information_schema.COLUMNS
                             WHERE table_schema = 'public'
                               AND table_name   = p_table_name
            ) LOOP
                -------------------------------------------------------------------------
                IF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('CHAR','TEXT') THEN
                    v_COLUMN := 'SELECT ''''''''||'||c_INFO.column_name||'||'''''''' ';
                ELSIF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('DATE','TIME') THEN
                    v_COLUMN := 'SELECT ''''''''||TO_CHAR('||c_INFO.column_name||',''yyyy-mm-dd'')||'''''''' ';
                ELSE
                    v_COLUMN := 'SELECT '||c_INFO.column_name;
                END IF;
                -------------------------------------------------------------------------
                v_SQL := v_COLUMN
                        ||' FROM '||p_table_name
                        ||' WHERE '||p_table_name||'_id = '||c_DATA.dcr20_relate_ics_id;
                --RAISE NOTICE 'v_SQL : %', v_SQL;

                EXECUTE v_SQL INTO v_DATA;
                --RAISE NOTICE 'v_DATA : %', v_DATA;

                IF v_DATA IS NULL THEN
                    v_DATA := 'null';
                END IF;
                IF v_VALUES != '' THEN
                    v_VALUES := v_VALUES||',';
                END IF;
                v_VALUES := v_VALUES||v_DATA;
            END LOOP;
        END LOOP;
    -------------------------------------------------------------------------------------
    ELSIF p_table_name = 'ics01_class_tree' THEN

        /*
        select f_get_insert_script('ics01_class_tree', ics01_class_tree_id)
        from ics01_class_tree
        where ics01_company_id = 0
        */

        FOR c_DATA IN ( SELECT *
                          FROM ics01_class_tree
                         WHERE ics01_company_id = 0
                           AND ics01_class_tree_id = p_id
        ) LOOP
            -----------------------------------------------------------------------------
            FOR c_INFO IN ( SELECT column_name, data_type
                              FROM information_schema.COLUMNS
                             WHERE table_schema = 'public'
                               AND table_name   = p_table_name
            ) LOOP
                -------------------------------------------------------------------------
                IF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('CHAR','TEXT') THEN
                    v_COLUMN := 'SELECT ''''''''||'||c_INFO.column_name||'||'''''''' ';
                ELSIF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('DATE','TIME') THEN
                    v_COLUMN := 'SELECT ''''''''||TO_CHAR('||c_INFO.column_name||',''yyyy-mm-dd'')||'''''''' ';
                ELSE
                    v_COLUMN := 'SELECT '||c_INFO.column_name;
                END IF;
                -------------------------------------------------------------------------
                v_SQL := v_COLUMN
                        ||' FROM '||p_table_name
                        ||' WHERE '||p_table_name||'_id = '||c_DATA.ics01_class_tree_id;
                --RAISE NOTICE 'v_SQL : %', v_SQL;

                EXECUTE v_SQL INTO v_DATA;
                --RAISE NOTICE 'v_DATA : %', v_DATA;

                IF v_DATA IS NULL THEN
                    v_DATA := 'null';
                END IF;
                IF v_VALUES != '' THEN
                    v_VALUES := v_VALUES||',';
                END IF;
                v_VALUES := v_VALUES||v_DATA;
            END LOOP;
        END LOOP;
    -------------------------------------------------------------------------------------
    ELSIF p_table_name = 'sch03_deadline' THEN

        /*
        select f_get_insert_script('sch03_deadline', sch03_deadline_id)
        from sch03_deadline
        where sch03_company_id = 0
        and sch03_schedule_cd = '2'
        */

        FOR c_DATA IN ( SELECT *
                          FROM sch03_deadline
                         --WHERE sch03_company_id  = 0
                           --AND sch03_schedule_cd = '2'
                         WHERE sch03_deadline_id = p_id
        ) LOOP
            -----------------------------------------------------------------------------
            FOR c_INFO IN ( SELECT column_name, data_type
                              FROM information_schema.COLUMNS
                             WHERE table_schema = 'public'
                               AND table_name   = p_table_name
            ) LOOP
                -------------------------------------------------------------------------
                IF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('CHAR','TEXT') THEN
                    v_COLUMN := 'SELECT ''''''''||'||c_INFO.column_name||'||'''''''' ';
                ELSIF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('DATE','TIME') THEN
                    v_COLUMN := 'SELECT ''''''''||TO_CHAR('||c_INFO.column_name||',''yyyy-mm-dd'')||'''''''' ';
                ELSE
                    v_COLUMN := 'SELECT '||c_INFO.column_name;
                END IF;
                -------------------------------------------------------------------------
                v_SQL := COALESCE(v_COLUMN,'')
                        ||' FROM '||p_table_name
                        ||' WHERE '||p_table_name||'_id = '||c_DATA.sch03_deadline_id;
                RAISE NOTICE 'v_SQL : %', v_SQL;

                EXECUTE v_SQL INTO v_DATA;
                RAISE NOTICE 'v_DATA : %', v_DATA;

                IF v_DATA IS NULL THEN
                    v_DATA := 'null';
                END IF;
                IF v_VALUES != '' THEN
                    v_VALUES := v_VALUES||',';
                END IF;
                v_VALUES := v_VALUES||v_DATA;
            END LOOP;
        END LOOP;
    -------------------------------------------------------------------------------------
    ELSIF p_table_name = 'sys09_code' THEN

        /*
        SELECT f_get_insert_script('sys09_code', sys09_code_id)
          FROM sys09_code
         WHERE sys09_code_kind_id IN ( SELECT sys08_code_kind_id
                                         FROM sys08_code_kind
                                        WHERE sys08_kind_cd = 'BankCode')*/

        FOR c_DATA IN ( SELECT *
                          FROM sys09_code
                         WHERE sys09_code_id = p_id
        ) LOOP
            -----------------------------------------------------------------------------
            FOR c_INFO IN ( SELECT column_name, data_type
                              FROM information_schema.COLUMNS
                             WHERE table_schema = 'public'
                               AND table_name   = p_table_name
            ) LOOP
                -------------------------------------------------------------------------
                IF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('CHAR','TEXT') THEN
                    v_COLUMN := 'SELECT ''''''''||'||c_INFO.column_name||'||'''''''' ';
                ELSIF UPPER(SUBSTR(c_INFO.data_type,1,4)) IN ('DATE','TIME') THEN
                    v_COLUMN := 'SELECT ''''''''||TO_CHAR('||c_INFO.column_name||',''yyyy-mm-dd'')||'''''''' ';
                ELSE
                    v_COLUMN := 'SELECT '||c_INFO.column_name;
                END IF;
                -------------------------------------------------------------------------
                v_SQL := v_COLUMN
                        ||' FROM '||p_table_name
                        ||' WHERE '||p_table_name||'_id = '||c_DATA.sys09_code_id;
                RAISE NOTICE 'v_SQL : %', v_SQL;

                EXECUTE v_SQL INTO v_DATA;
                RAISE NOTICE 'v_DATA : %', v_DATA;

                IF v_DATA IS NULL THEN
                    v_DATA := 'null';
                END IF;
                IF v_VALUES != '' THEN
                    v_VALUES := v_VALUES||',';
                END IF;
                v_VALUES := v_VALUES||v_DATA;
            END LOOP;
        END LOOP;

    END IF;

    RAISE NOTICE 'v_VALUES : %', v_VALUES;
    -------------------------------------------------------------------------------------
    RETURN v_INSERT_TXT||v_VALUES||');';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
