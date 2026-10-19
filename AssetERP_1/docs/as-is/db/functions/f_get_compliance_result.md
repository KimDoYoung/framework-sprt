# f_get_compliance_result

## FUNCTION public.f_get_compliance_result(p_person_id numeric, p_std_date date, p_cycle_type character varying, p_compliance_type character varying, p_start_date date)

- 반환: `character varying`
- 줄 수: 137

```sql
CREATE OR REPLACE FUNCTION public.f_get_compliance_result(p_person_id numeric, p_std_date date, p_cycle_type character varying, p_compliance_type character varying, p_start_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_ICS31             RECORD;

    v_COMPANY_ID        NUMERIC;
    v_CHK_CNT           NUMERIC;
    v_CNT               NUMERIC := 0;
    v_COMPLY_CNT        NUMERIC := 0;
    v_NO_CONFIRM_CNT    NUMERIC := 0;
    v_EXCP_EMP_CNT      NUMERIC := 0;
    v_ANSWER1           VARCHAR(1) := 'Z';
    v_ANSWER2           VARCHAR(1) := 'Z';
    v_ANSWER3           VARCHAR(1) := 'Z';
    v_ANSWER4           VARCHAR(1) := 'Z';
    v_ANSWER5           VARCHAR(1) := 'Z';

    v_RESULT            VARCHAR(50);
    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 회사ID GET
    v_errMsg := '회사ID 가져오기 실패';
    SELECT emp01_company_id
      INTO v_COMPANY_ID
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;
    -------------------------------------------------------------------------------------
    -- 준수항목 체크건수 GET
    v_errMsg := '준수항목 체크건수 가져오기 실패';
    SELECT COUNT(*)
      INTO v_CHK_CNT
      FROM ics30_compliance
     WHERE ics30_company_id         = v_COMPANY_ID
       AND ics30_start_date         = p_start_date
       AND ics30_compliance_type    = p_compliance_type
       AND ( ( ics30_use_yn          = 'false'      AND
               ics30_use_close_date >= p_std_date   ) OR
             ( ics30_use_yn         != 'false'      ) );

    -------------------------------------------------------------------------------------
    -- 작성내역 가져오기
    -------------------------------------------------------------------------------------
    v_errMsg := '작성내역 가져오기 실패';
    FOR c_ICS31 IN ( SELECT *
                          , CAST(SUBSTR(ics30_sub_num, POSITION('-' IN ics30_sub_num) + 1) AS NUMERIC) ANSWER_NO
                       FROM ics31_compliance_write a
                            INNER JOIN ics30_compliance ON (    ics30_compliance_id = ics31_compliance_id
                                                            AND ics30_start_date    = p_start_date )
                      WHERE ics31_person_id               = p_person_id
                        AND ics31_yyyymm                  = TO_CHAR(p_std_date,'YYYY.MM')
                        AND ics31_cycle_type              = p_cycle_type
                        AND ics30_compliance_type         = p_compliance_type
                        AND COALESCE(ics31_answer_cd,'') != ''
    ) LOOP

        RAISE NOTICE '..... ANSWER_NO(%) - ics31_answer_cd : % ', c_ICS31.ANSWER_NO, c_ICS31.ics31_answer_cd;

        ---------------------------------------------------------------------------------
        v_CNT := v_CNT + 1;
        ---------------------------------------------------------------------------------
        IF    c_ICS31.ANSWER_NO = 1 THEN v_ANSWER1 := c_ICS31.ics31_answer_cd;
        ELSIF c_ICS31.ANSWER_NO = 2 THEN v_ANSWER2 := c_ICS31.ics31_answer_cd;
        ELSIF c_ICS31.ANSWER_NO = 3 THEN v_ANSWER3 := c_ICS31.ics31_answer_cd;
        ELSIF c_ICS31.ANSWER_NO = 4 THEN v_ANSWER4 := c_ICS31.ics31_answer_cd;
        ELSIF c_ICS31.ANSWER_NO = 5 THEN v_ANSWER5 := c_ICS31.ics31_answer_cd;
        END IF;
        ---------------------------------------------------------------------------------
        IF COALESCE(c_ICS31.ics31_confirm_yn,'false') = 'false' THEN
            v_NO_CONFIRM_CNT := v_NO_CONFIRM_CNT + 1;
        END IF;
        ---------------------------------------------------------------------------------
    END LOOP;
    -------------------------------------------------------------------------------------
    RAISE NOTICE 'v_CHK_CNT[%] / v_CNT[%]', v_CHK_CNT, v_CNT;

    IF v_CHK_CNT > v_CNT THEN
        ---------------------------------------------------------------------------------
        -- 예외사원 체크
        SELECT COUNT(*)
          INTO v_EXCP_EMP_CNT
          FROM emp33_except_biz
         WHERE emp33_person_id      = p_person_id
           AND emp33_except_biz_cd  = '10'  --(10:내부통제 준수확인서 작성)
           AND p_std_date BETWEEN emp33_start_date AND COALESCE(emp33_close_date, '2999-12-31'::date);

        IF v_EXCP_EMP_CNT != 0 THEN
            RETURN '해당없음';
        ELSE
            RETURN '미작성';
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 준수답변 체크
    -------------------------------------------------------------------------------------
    v_errMsg := '준수답변 체크 실패';

    RAISE NOTICE '%', CONCAT(v_ANSWER1, v_ANSWER2, v_ANSWER3, v_ANSWER4, v_ANSWER5);

    SELECT COUNT(*)
      INTO v_COMPLY_CNT
      FROM ics33_compliance_answer
     WHERE ics33_company_id               = v_COMPANY_ID
       AND ics33_start_date               = p_start_date
       AND ics33_compliance_type          = p_compliance_type
       AND COALESCE(ics33_answer1_cd,'Z') = v_ANSWER1
       AND COALESCE(ics33_answer2_cd,'Z') = v_ANSWER2
       AND COALESCE(ics33_answer3_cd,'Z') = v_ANSWER3
       AND COALESCE(ics33_answer4_cd,'Z') = v_ANSWER4
       AND COALESCE(ics33_answer5_cd,'Z') = v_ANSWER5;
    -------------------------------------------------------------------------------------
    IF v_COMPLY_CNT = 0 THEN
        v_RESULT := '미준수';
    ELSE
        v_RESULT := '준수';
    END IF;
    -------------------------------------------------------------------------------------
    
    RAISE NOTICE 'v_NO_CONFIRM_CNT : %', v_NO_CONFIRM_CNT;

    IF v_NO_CONFIRM_CNT > 0 THEN
        v_RESULT := v_RESULT||'(미확인)';
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_RESULT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN '오류-전산팀에 문의하세요';
END;
$function$
```
