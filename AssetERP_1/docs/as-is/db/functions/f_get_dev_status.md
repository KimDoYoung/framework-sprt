# f_get_dev_status

## FUNCTION public.f_get_dev_status(p_dev_id numeric)

- 반환: `character varying`
- 줄 수: 65

```sql
CREATE OR REPLACE FUNCTION public.f_get_dev_status(p_dev_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_SCM11     scm11_dev_step%ROWTYPE;
    c_DATA      RECORD;
    v_STATUS    VARCHAR(100) := NULL;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 마지막 STEP 상태체크
    SELECT *
      INTO v_SCM11
      FROM scm11_dev_step
     WHERE scm11_dev_id = p_dev_id
     ORDER BY scm11_dev_step_seq DESC
     LIMIT 1;

    IF v_SCM11.scm11_dev_step_cd = '10' AND COALESCE(v_SCM11.scm11_dev_status_cd,'00') = '90' THEN
        RETURN '완료';
    ELSIF v_SCM11.scm11_dev_step_cd != '10' AND COALESCE(v_SCM11.scm11_result_cd,'') IN ('1','2') THEN
        RETURN f_cdnm('DevStepResultCode', v_SCM11.scm11_result_cd, 0, f_today());
    END IF;

    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT scm11_dev_step.*
                         , f_cdnm('DevStepCode'      , scm11_dev_step_cd   , 0, f_today()) scm11_dev_step_nm
                         , f_cdnm('AfterStateCode'   , scm11_dev_status_cd , 0, f_today()) scm11_dev_status_nm
                         , f_cdnm('DevStepResultCode', scm11_result_cd     , 0, f_today()) scm11_result_nm
                      FROM scm11_dev_step
                     WHERE scm11_dev_id = p_dev_id
                     ORDER BY scm11_dev_step_seq
    ) LOOP
        ---------------------------------------------------------------------------------
        IF c_DATA.scm11_dev_step_cd IN ('05','10') THEN
            IF c_DATA.scm11_dev_status_cd IS NULL OR c_DATA.scm11_dev_status_cd = '' THEN
                RETURN CONCAT(c_DATA.scm11_dev_step_nm, '대기중');
            ELSIF c_DATA.scm11_dev_status_cd = '10' THEN --(10:이행불가)
                RETURN c_DATA.scm11_dev_status_nm;
            ELSIF c_DATA.scm11_dev_status_cd = '20' THEN --(20:진행중)
                RETURN CONCAT(c_DATA.scm11_dev_step_nm, c_DATA.scm11_dev_status_nm);
            ELSE
                v_STATUS := CONCAT(c_DATA.scm11_dev_step_nm, c_DATA.scm11_dev_status_nm);
            END IF;
        ---------------------------------------------------------------------------------
        ELSE
            IF c_DATA.scm11_result_cd IS NULL OR c_DATA.scm11_result_cd = '' THEN
                RETURN CONCAT(c_DATA.scm11_dev_step_nm, '대기중');
            ELSIF c_DATA.scm11_result_cd = '2' THEN 
                RETURN c_DATA.scm11_result_nm;
            ELSE
                v_STATUS := CONCAT(c_DATA.scm11_dev_step_nm, c_DATA.scm11_result_nm);
            END IF;
        END IF;
    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN v_STATUS;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN '';
END;
$function$
```
