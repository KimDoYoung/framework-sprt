# f_get_emptrans

## FUNCTION public.f_get_emptrans(p_person_id numeric, p_std_date date, p_type character varying)

- 반환: `character varying`
- 줄 수: 87

```sql
CREATE OR REPLACE FUNCTION public.f_get_emptrans(p_person_id numeric, p_std_date date, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_EMP01     EMP01_PERSON%ROWTYPE;
v_EMP03     EMP03_TRANS%ROWTYPE;
v_DATA      VARCHAR;
-----------------------------------------------------------------------------------------
BEGIN
    IF p_type = 'retire_date' THEN -- 퇴사일
        SELECT TO_CHAR(emp03_trans_date,'YYYY-MM-DD')
          INTO v_DATA
          FROM emp03_trans
         WHERE emp03_person_id  = p_person_id
           AND emp03_trans_cd   = '900'
           AND ( ( p_std_date IS NOT NULL           AND
                   emp03_trans_date <= p_std_date   ) OR
                 ( p_std_date IS NULL               ) )
         ORDER BY emp03_trans_date DESC
         LIMIT 1;
    -------------------------------------------------------------------------------------
    ELSE
        ---------------------------------------------------------------------------------
        SELECT *
          INTO v_EMP01
          FROM emp01_person
         WHERE emp01_person_id = p_person_id;
        ---------------------------------------------------------------------------------
        SELECT emp03_trans.*
          INTO v_EMP03
          FROM emp03_trans
         WHERE emp03_person_id  = p_person_id
           AND emp03_trans_date <= p_std_date
         ORDER BY emp03_trans_date DESC
         LIMIT 1;
        ---------------------------------------------------------------------------------
        IF    p_type = 'pos_cd'         THEN v_DATA := v_EMP03.emp03_pos_cd;
        ELSIF p_type = 'pos_nm'         THEN v_DATA := f_cdnm('EmpPosCode', v_EMP03.emp03_pos_cd, v_EMP01.emp01_company_id, p_std_date);
        ELSIF p_type = 'title_cd'       THEN v_DATA := v_EMP03.emp03_title_cd;
        ---------------------------------------------------------------------------------
        ELSIF p_type = 'title_nm'       THEN
            -- 직책코드가 '999:미지정'인 경우 특정직위가 직책이 됨
            IF v_EMP03.emp03_title_cd = '999' AND COALESCE(v_EMP03.emp03_grade_cd,'') != '' THEN
                v_DATA := f_cdnm('EmpGradeCode', v_EMP03.emp03_grade_cd, v_EMP01.emp01_company_id, p_std_date);
            ELSE
                /*v_DATA := f_cdnm('EmpTitleCode', v_EMP03.emp03_title_cd, v_EMP01.emp01_company_id, p_std_date)
                       || CASE WHEN v_EMP03.emp03_grade_cd IS NULL THEN ''
                               ELSE '('||f_cdnm('EmpGradeCode', v_EMP03.emp03_grade_cd, v_EMP01.emp01_company_id, p_std_date)||')' END;*/
                v_DATA := f_cdnm('EmpTitleCode', v_EMP03.emp03_title_cd, v_EMP01.emp01_company_id, p_std_date);
            END IF;
        ---------------------------------------------------------------------------------
        ELSIF p_type = 'grade_cd'           THEN v_DATA := v_EMP03.emp03_grade_cd;
        ELSIF p_type = 'grade_nm'           THEN v_DATA := f_cdnm('EmpGradeCode', v_EMP03.emp03_grade_cd, v_EMP01.emp01_company_id, p_std_date);
        ELSIF p_type = 'org_code_id'        THEN v_DATA := v_EMP03.emp03_org_code_id;
        ELSIF p_type = 'org_code_nm'        THEN v_DATA := f_org_nm(v_EMP03.emp03_org_code_id, p_std_date);
        ELSIF p_type = 'person_org_info'    THEN v_DATA := v_EMP01.emp01_kor_nm||'('||f_org_nm(v_EMP03.emp03_org_code_id, p_std_date)||')';
        ELSIF p_type = 'note'               THEN v_DATA := v_EMP03.emp03_note;
        ELSIF p_type = 'kind_cd'            THEN v_DATA := v_EMP03.emp03_kind_cd;
        ELSIF p_type = 'kind_nm'            THEN v_DATA := f_cdnm('EmpKindCode', v_EMP03.emp03_kind_cd, v_EMP01.emp01_company_id, p_std_date);
        ---------------------------------------------------------------------------------
        ELSIF p_type = 'org_cd' THEN
            -----------------------------------------------------------------------------
            SELECT org01_org_cd
              INTO v_DATA
              FROM org01_code
             WHERE org01_code_id = v_EMP03.emp03_org_code_id;
        ---------------------------------------------------------------------------------
        ELSIF p_type = 'non_stay_yn' THEN
            -----------------------------------------------------------------------------
            IF COALESCE(v_EMP03.emp03_non_stay_yn,'false') = 'true' OR
               v_EMP03.emp03_title_cd = '900'                       THEN --(900:비상근)
                v_DATA := 'true';
            ELSE
                v_DATA := 'false';
            END IF;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_DATA;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
