# f_get_4insure_yn

## FUNCTION public.f_get_4insure_yn(p_person_id numeric, p_std_date date, p_4insure_cd character varying)

- 반환: `boolean`
- 줄 수: 129

```sql
CREATE OR REPLACE FUNCTION public.f_get_4insure_yn(p_person_id numeric, p_std_date date, p_4insure_cd character varying)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_EMP01             emp01_person%ROWTYPE;
    v_EMP35             emp35_deduct%ROWTYPE;

    v_4INSURE_CD        VARCHAR(1) := p_4insure_cd;
    
    v_STD_AGE           NUMERIC := 60;
    v_YEAR_DIFF         NUMERIC;
    v_BIRTH_MONTH       VARCHAR(7);
    v_BIRTH_DAY         VARCHAR(2);
    v_INIT_DATE         pay31_insure_apply.pay31_init_date%TYPE;

    v_RETURN            BOOLEAN := true;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 4대보험 가입여부 체크
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_EMP35
      FROM emp35_deduct
     WHERE emp35_person_id   = p_person_id
       AND emp35_start_date <= p_std_date
     ORDER BY emp35_start_date DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    IF COALESCE(v_EMP35.emp35_insure_yn,'false') = 'false' THEN
        RETURN false;
    END IF;

    -------------------------------------------------------------------------------------
    -- 보험구분이 '3:장기요양'이면 '2:건강보험'으로 체크
    IF p_4insure_cd = '3' THEN
        v_4INSURE_CD := '2';
    END IF;

    -------------------------------------------------------------------------------------
    -- 취득일 체크 (기준일이 취득일 이전이면 납부대상 아님)
    -------------------------------------------------------------------------------------
    SELECT pay31_init_date
      INTO v_INIT_DATE
      FROM pay31_insure_apply
     WHERE pay31_person_id       = p_person_id
       AND pay31_insure_cd       = v_4INSURE_CD
       AND pay31_init_date      <= p_std_date
       AND pay31_insure_apply_cd = '1'  --(1:신규등록)
     ORDER BY pay31_apply_date DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    IF v_INIT_DATE IS NULL THEN
        RETURN false;
    END IF;

    -------------------------------------------------------------------------------------
    -- 1:국민연금
    -------------------------------------------------------------------------------------
    IF v_4INSURE_CD = '1' THEN
        ---------------------------------------------------------------------------------
        -- 60세이상(만나이 적용, 생일달까지 납부(1일은 미납부)) 연금납부 없음
        ---------------------------------------------------------------------------------
        SELECT DATE_PART('year', p_std_date) - DATE_PART('year', emp02_birthday)
             , TO_CHAR(p_std_date,'yyyy-')||TO_CHAR(emp02_birthday,'mm')
             , TO_CHAR(emp02_birthday,'dd')
          INTO v_YEAR_DIFF
             , v_BIRTH_MONTH
             , v_BIRTH_DAY
          FROM emp02_others
         WHERE emp02_person_id = p_person_id
         LIMIT 1;
        ---------------------------------------------------------------------------------
        -- 60세 초과 --> 대상아님
        IF v_STD_AGE < v_YEAR_DIFF THEN
            v_RETURN := false;
        ---------------------------------------------------------------------------------
        -- 60세이면서 생일달이 지났음 --> 대상아님
        ELSIF v_STD_AGE                     = v_YEAR_DIFF   AND
              TO_CHAR(p_std_date,'yyyy-mm') > v_BIRTH_MONTH THEN
            v_RETURN := false;
        ---------------------------------------------------------------------------------
        -- 60세이면서 생일달인데 생일이 1일임 --> 대상아님
        ELSIF v_STD_AGE                     = v_YEAR_DIFF   AND
              TO_CHAR(p_std_date,'yyyy-mm') = v_BIRTH_MONTH AND
              '01'                          = v_BIRTH_DAY   THEN
            v_RETURN := false;
        END IF;

    -------------------------------------------------------------------------------------
    -- 2:건강보험(장기요양 포함)
    -------------------------------------------------------------------------------------
    ELSIF v_4INSURE_CD = '2' THEN
        ---------------------------------------------------------------------------------
        -- 사원정보GET
        SELECT *
          INTO v_EMP01
          FROM emp01_person
         WHERE emp01_person_id = p_person_id;
        ---------------------------------------------------------------------------------
        -- 납부월에 입사한 경우 1일 입사자만 납부대상임. (2일~말일은 납부대상 아님)
        ---------------------------------------------------------------------------------
        IF TO_CHAR(v_EMP01.emp01_hire_date, 'YYYYMM') = TO_CHAR(p_std_date,'YYYYMM') AND
           v_EMP01.emp01_hire_date > DATE_TRUNC('month', p_std_date)                 THEN
            v_RETURN := false;
        END IF;

    -------------------------------------------------------------------------------------
    -- 4:고용보험
    -------------------------------------------------------------------------------------
    ELSIF v_4INSURE_CD = '4' THEN
        ---------------------------------------------------------------------------------
        -- 대표자는 고용보험 납부대상이 아님
        ---------------------------------------------------------------------------------
        IF COALESCE(v_EMP35.emp35_repr_yn,'false') = 'true' THEN
            v_RETURN := false;
        END IF;
    END IF;

    -------------------------------------------------------------------------------------
    RETURN v_RETURN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN false;
END;
$function$
```
