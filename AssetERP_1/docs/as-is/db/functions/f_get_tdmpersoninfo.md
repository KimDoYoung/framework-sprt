# f_get_tdmpersoninfo

## FUNCTION public.f_get_tdmpersoninfo(p_person_id numeric, p_std_date date, p_type character varying)

- 반환: `character varying`
- 줄 수: 185

```sql
CREATE OR REPLACE FUNCTION public.f_get_tdmpersoninfo(p_person_id numeric, p_std_date date, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_COMPANY_ID        NUMERIC;
    v_SEPAR             VARCHAR(7);
    v_TEXT              TEXT;
    v_TEXT1             TEXT;
    v_TEXT2             TEXT;
    v_ADD_TITLE_EXTR    TEXT;
    v_COUNT             NUMERIC;

-----------------------------------------------------------------------------------------
BEGIN

    --call p_log('cyy', 'f_get_tdmPersonInfo IN - p_person_id['||p_person_id||'], p_std_date['||p_std_date||'], p_type['||p_type||']');

    /*
        책무대상 임원의 겸직사항 or 소관부서 return
    */
    -------------------------------------------------------------------------------------
    SELECT emp01_company_id
      INTO v_COMPANY_ID
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;

    -------------------------------------------------------------------------------------
    -- 겸직사항
    IF p_type IN ('1','3','4') THEN
        ---------------------------------------------------------------------------------
        IF p_type = '3' THEN
            v_SEPAR := CHR(10);
        ELSE
            v_SEPAR := ', ';
        END IF;
        ---------------------------------------------------------------------------------
        IF p_type != '4' THEN
            SELECT STRING_AGG(title_nm, v_SEPAR)
                 , STRING_AGG(  title_nm
                              ||'(' || TO_CHAR(start_date,'YYYY.MM.DD') ||' ~ '
                              || CASE WHEN end_date IS NULL THEN '현재' ELSE TO_CHAR(end_date,'YYYY.MM.DD') END ||')'
                             ,v_SEPAR)
                 , STRING_AGG('· '
                              ||title_nm
                              ||'(' || TO_CHAR(start_date,'YYYY.MM.DD') ||' ~ '
                              || CASE WHEN end_date IS NULL THEN '현재' ELSE TO_CHAR(end_date,'YYYY.MM.DD') END ||')'
                             ,v_SEPAR)
                 , COUNT(*)
              INTO v_TEXT, v_TEXT1, v_TEXT2, v_COUNT
              FROM (
                     SELECT tdm20_role_nm           AS title_nm
                          , tdm30_start_date        AS start_date
                          , tdm30_end_date          AS end_date
                       FROM tdm30_role_allc
                            INNER JOIN tdm20_role ON tdm20_role_id = tdm30_role_id
                      WHERE tdm30_person_id                      = p_person_id
                        AND COALESCE(tdm30_add_title_yn,'false') = 'true'
                        AND p_std_date::date BETWEEN tdm30_start_date AND COALESCE(tdm30_end_date,'9999-12-31'::date)
                      UNION ALL
                     SELECT tdm03_add_title_nm      AS title_nm
                          , tdm03_start_date        AS start_date
                          , tdm03_close_date        AS end_date
                       FROM tdm03_add_title
                      WHERE tdm03_person_id = p_person_id
                        AND p_std_date::date BETWEEN tdm03_start_date AND COALESCE(tdm03_close_date,'9999-12-31'::date)
                   ) t;

            RAISE NOTICE '... v_TEXT 1 [%]', v_TEXT;
            RAISE NOTICE '... v_TEXT 2 [%]', v_TEXT2;
        END IF;
        ---------------------------------------------------------------------------------
        SELECT CASE WHEN p_type = '3' THEN '[사외겸직]'|| v_SEPAR ||
                                            STRING_AGG('· '         || emp07_company_nm  || v_SEPAR ||
                                                      '  - 업종 : ' || emp07_industry    || v_SEPAR ||
                                                      '  - 직위 : ' || emp07_final_title || v_SEPAR ||
                                                      '  - 업무 : ' || emp07_final_role  || v_SEPAR ||
                                                      '  - 기간 : ' || emp07_fr_ym ||' ~ ' || (CASE WHEN emp07_to_ym = '2999.12' THEN '현재' ELSE emp07_to_ym END)
                                                     ,v_SEPAR)
                    WHEN p_type = '4' THEN STRING_AGG(emp07_company_nm, v_SEPAR)
                    ELSE STRING_AGG('[사외]'||emp07_company_nm ||'('
                                        || emp07_fr_ym ||' ~ '
                                        || CASE WHEN emp07_to_ym = '2999.12' THEN '현재' ELSE emp07_to_ym END ||')'
                                   ,v_SEPAR)
                    END
          INTO v_ADD_TITLE_EXTR                    
          FROM (
                SELECT emp07_company_nm
                     , emp07_industry
                     , emp07_final_title
                     , emp07_final_role
                     , TO_CHAR(CASE WHEN (LENGTH(emp07_fr_ym) = 6 AND RIGHT(emp07_fr_ym,2)::numeric > 12) OR (LENGTH(emp07_to_ym) = 6 AND RIGHT(emp07_to_ym,2)::numeric > 12)
                                    THEN TO_DATE(emp07_fr_ym,'YYMMDD')
                                    ELSE TO_DATE(emp07_fr_ym,'YYYYMM') END, 'YYYY.MM') emp07_fr_ym
                     , TO_CHAR(CASE WHEN (LENGTH(emp07_fr_ym) = 6 AND RIGHT(emp07_fr_ym,2)::numeric > 12) OR (LENGTH(emp07_to_ym) = 6 AND RIGHT(emp07_to_ym,2)::numeric > 12)
                                    THEN TO_DATE(emp07_to_ym,'YYMMDD')
                                    ELSE TO_DATE(emp07_to_ym,'YYYYMM') END, 'YYYY.MM') emp07_to_ym
                  FROM (
                         SELECT emp07_company_nm
                              , COALESCE(emp07_industry     ,'') emp07_industry
                              , COALESCE(emp07_final_title  ,'') emp07_final_title
                              , COALESCE(emp07_final_role   ,'') emp07_final_role
                              , TRIM(TRANSLATE(emp07_fr_ym,'-.년월','')) emp07_fr_ym
                              , CASE WHEN TRIM(COALESCE(TRANSLATE(emp07_to_ym,'-.년월',''),'')) IN ('','현재') THEN '299912' ELSE TRANSLATE(emp07_to_ym,'-.년월','') END emp07_to_ym
                           FROM emp07_career
                          WHERE emp07_person_id = p_person_id
                            AND emp07_extr_add_title_yn = 'true'
                            AND emp07_fr_ym IS NOT NULL
                       ) t
                 order by emp07_fr_ym
               ) tt
         WHERE TO_CHAR(p_std_date,'YYYY.MM') BETWEEN emp07_fr_ym AND emp07_to_ym;

        RAISE NOTICE '... v_ADD_TITLE_EXTR [%]', v_ADD_TITLE_EXTR;

        IF p_type = '4' THEN
            RETURN v_ADD_TITLE_EXTR;
        END IF;

        RAISE NOTICE '... v_COUNT [%]', v_COUNT;
/*
        IF p_type = '3' THEN
            IF v_COUNT > 1 THEN
                v_TEXT := v_TEXT2;
            ELSIF v_COUNT = 1 THEN
                IF COALESCE(v_ADD_TITLE_EXTR,'') != '' THEN 
                    v_TEXT := v_TEXT2;
                ELSE
                    v_TEXT := v_TEXT1;
                END IF;
            END IF;
        END IF;
*/
        IF p_type = '3' THEN
            v_TEXT := '[사내겸직]'|| v_SEPAR || v_TEXT2;
        END IF;

        IF COALESCE(v_ADD_TITLE_EXTR,'') != '' THEN
            IF v_TEXT IS NULL THEN
                v_TEXT := v_ADD_TITLE_EXTR;
            ELSE
                /*IF p_type = '3' THEN 
                    v_TEXT := '[사내겸직]'|| v_SEPAR || v_TEXT;
                END IF;*/

                v_TEXT := v_TEXT || v_SEPAR || v_ADD_TITLE_EXTR;
            END IF;
        END IF;


        RAISE NOTICE '... v_TEXT 2 [%]', v_TEXT;

    -------------------------------------------------------------------------------------
    -- 소관부서
    ELSIF p_type = '2' THEN
        ---------------------------------------------------------------------------------
        SELECT STRING_AGG(emp00_org_code_nm, ', ')
          INTO v_TEXT
          FROM (
                 SELECT 1 seq, emp00_org_code_nm
                   FROM getPerson(v_COMPANY_ID, p_std_date)
                  WHERE emp00_person_id = p_person_id
                  UNION
                 SELECT 2, f_org_nm(emp04_org_code_id, p_std_date)
                   FROM emp04_add_title
                  WHERE emp04_person_id = p_person_id
                    AND p_std_date::timestamp BETWEEN emp04_start_date AND COALESCE(emp04_close_date,'9999-12-31'::timestamp)
                  ORDER BY seq
               ) t;

    -------------------------------------------------------------------------------------
    ELSE
        v_TEXT := '미정의 구분코드['||p_type||']';
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_TEXT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN null;
END;
$function$
```
