# f_get_empperiod

## FUNCTION public.f_get_empperiod(p_person_id numeric, p_std_date date, p_period_type character varying)

- 반환: `character varying`
- 줄 수: 71

```sql
CREATE OR REPLACE FUNCTION public.f_get_empperiod(p_person_id numeric, p_std_date date, p_period_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_CAREER        RECORD;

    v_START_DATE    DATE;
    v_CLOSE_DATE    DATE;
    v_PERIOD        NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    --===================================================================================
    -- 당사재직기간
    --===================================================================================
    IF p_period_type IN ('1','2') THEN
        ---------------------------------------------------------------------------------
        SELECT emp01_hire_date::date
          INTO v_START_DATE
          FROM emp01_person
         WHERE emp01_person_id = p_person_id;

        IF COALESCE(v_START_DATE,'1900-01-01') = '1900-01-01' THEN
            RETURN '입사일 미입력';
        END IF;
        ---------------------------------------------------------------------------------
        v_PERIOD := f_get_datedif(v_START_DATE, p_std_date, 'D') / 365.0;
    END IF;

    --===================================================================================
    -- 업계경력
    --===================================================================================
    IF p_period_type = '2' THEN

        --RAISE NOTICE '당사재직기간 (v_PERIOD) : %', v_PERIOD;

        ---------------------------------------------------------------------------------
        FOR c_CAREER IN ( SELECT (REPLACE(emp07_fr_ym,'.','-')||'-01')::date                    AS start_date
                               , f_get_last_day((REPLACE(emp07_to_ym,'.','-')||'-01')::date)    AS close_date
                               , emp07_company_nm                                               AS company_nm
                            FROM emp07_career
                           WHERE emp07_person_id = p_person_id
                             AND COALESCE(emp07_finance_relate_yn,'false') = 'true'
                           ORDER BY emp07_fr_ym
        ) LOOP
            -----------------------------------------------------------------------------
            IF COALESCE(c_CAREER.start_date,'1900-01-01') = '1900-01-01' OR
               COALESCE(c_CAREER.close_date,'1900-01-01') = '1900-01-01' THEN
                RETURN '입/퇴사년월 미입력';
            END IF;
            -----------------------------------------------------------------------------

            --RAISE NOTICE '% : % ~ % ===> %', c_CAREER.company_nm, c_CAREER.start_date, c_CAREER.close_date, f_get_datedif(c_CAREER.start_date, c_CAREER.close_date, 'D') / 365.0;

            v_PERIOD := v_PERIOD + f_get_datedif(c_CAREER.start_date, c_CAREER.close_date, 'D') / 365.0;

            --RAISE NOTICE '----- v_PERIOD : %', v_PERIOD;

        END LOOP;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN ROUND(v_PERIOD,2)||'년';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN NULL;
END;
$function$
```
