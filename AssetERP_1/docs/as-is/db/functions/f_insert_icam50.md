# f_insert_icam50

## FUNCTION public.f_insert_icam50(p_std_date date, p_source_nm character varying)

- 반환: `character varying`
- 줄 수: 74

```sql
CREATE OR REPLACE FUNCTION public.f_insert_icam50(p_std_date date, p_source_nm character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_ICAM50        icam50_source%ROWTYPE;

v_LIST          RECORD;
v_SRC           RECORD;

v_errMsg        VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := 'ICAM DB소스 생성 시작 ['||p_std_date||']['||p_source_nm||']';
    -------------------------------------------------------------------------------------
    FOR v_LIST IN ( SELECT icam51_server_type
                         , icam51_owner
                         , icam51_type
                         , icam51_name
                         , icam51_std_date
                         , MAX(icma51_line) icma51_line
                      FROM icam51_source_tmp
                     WHERE icam51_std_date = p_std_date
                       AND icam51_name LIKE p_source_nm  
                     GROUP BY icam51_server_type
                            , icam51_owner
                            , icam51_type
                            , icam51_name
                            , icam51_std_date
                     ORDER BY 1,2,3,4
    ) LOOP
        ---------------------------------------------------------------------------------
        v_ICAM50 := NULL;
        ---------------------------------------------------------------------------------
        v_ICAM50.icam50_source_id   := f_create_batchseq();
        v_ICAM50.icam50_server_type := v_LIST.icam51_server_type;
        v_ICAM50.icam50_std_date    := v_LIST.icam51_std_date;
        v_ICAM50.icam50_owner       := v_LIST.icam51_owner;
        v_ICAM50.icam50_type        := v_LIST.icam51_type;
        v_ICAM50.icam50_name        := v_LIST.icam51_name;
        v_ICAM50.icam50_line_cnt    := v_LIST.icma51_line;
        ---------------------------------------------------------------------------------
        FOR v_SRC IN ( SELECT icam51_text
                         FROM icam51_source_tmp
                        WHERE icam51_server_type = v_LIST.icam51_server_type
                          AND icam51_std_date    = v_LIST.icam51_std_date
                          AND icam51_owner       = v_LIST.icam51_owner
                          AND icam51_type        = v_LIST.icam51_type
                          AND icam51_name        = v_LIST.icam51_name
                        ORDER BY icma51_line
        ) LOOP
            v_ICAM50.icam50_text := CONCAT(v_ICAM50.icam50_text, v_SRC.icam51_text);
        END LOOP;
        ---------------------------------------------------------------------------------
        v_ICAM50.icam50_work_date := f_sysdate();
        ---------------------------------------------------------------------------------
        INSERT INTO icam50_source VALUES (v_ICAM50.*);

    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_errMsg ;
        RETURN v_errMsg;
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN v_errMsg||'-'||SQLERRM;
END;
$function$
```
