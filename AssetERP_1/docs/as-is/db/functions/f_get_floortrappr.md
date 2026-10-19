# f_get_floortrappr

## FUNCTION public.f_get_floortrappr(p_company_id numeric, p_person_id numeric, p_stddate date, p_checkcycle character varying)

- 반환: `character varying`
- 줄 수: 172

```sql
CREATE OR REPLACE FUNCTION public.f_get_floortrappr(p_company_id numeric, p_person_id numeric, p_stddate date, p_checkcycle character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_APR01                 apr01_appr%ROWTYPE;
    v_START_DATE            DATE;
    v_CNT1                  NUMERIC; -- 완료
    v_CNT2                  NUMERIC; -- 결재중
    v_CNT3                  NUMERIC; -- 반려/임시저장
    v_CNT                   NUMERIC;

    v_STATUS_CD             VARCHAR(2);
    v_NO_ACCOUNT_SKIP_YN    VARCHAR(5) := NULL;

    v_RTN                   VARCHAR(50);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_checkCycle = '1' THEN
        v_START_DATE := f_get_quarter_date(p_stdDate,'1') + 1;   -- 분기초일
    ELSE
        v_START_DATE := DATE_TRUNC('month', p_stdDate)::date;    -- 월초일
    END IF;

    -------------------------------------------------------------------------------------
    /*( 2026.04.10 CYY - 기존 정기보고 상신문서를 거래내역별로 연결해서 관리했던 부분을
        월(또는 분기)단위로 연결되도록 변경함 )*/
    
    SELECT COALESCE(apr01_status_cd,'99')
      INTO v_STATUS_CD
      FROM flt14_relate_appr
           LEFT JOIN apr01_appr ON apr01_appr_id = flt14_appr_id
     WHERE flt14_person_id = p_person_id
       AND flt14_std_date  = p_stdDate
     ORDER BY flt14_relate_appr_id DESC
     LIMIT 1;

    IF COALESCE(v_STATUS_CD,'99') != '99' THEN
        IF v_STATUS_CD = '30' THEN
            RETURN '완료';
        ELSIF v_STATUS_CD = '40' THEN
            RETURN '반려';
        ELSE
            RETURN '결재중';
        END IF;
    END IF;

    -- 계좌미존재시 정기보고 안함 체크 고객사인 경우 계좌체크
    SELECT flt01_no_account_skip_yn
      INTO v_NO_ACCOUNT_SKIP_YN
      FROM flt01_company_std
     WHERE flt01_company_id  = p_company_id
       AND flt01_start_date <= p_stdDate
     ORDER BY flt01_start_date DESC
     LIMIT 1;

    IF COALESCE(v_NO_ACCOUNT_SKIP_YN,'false') = 'true' THEN
        SELECT COUNT(*)
          INTO v_CNT
          FROM flt03_account
         WHERE flt03_company_id  = p_company_id
           AND flt03_person_id   = p_person_id
           AND flt03_setup_date <= p_stdDate
           AND NOT EXISTS ( SELECT 1
                              FROM flt06_account_close
                                   INNER JOIN apr01_appr ON apr01_appr_id = flt06_appr_id
                             WHERE flt06_account_id = flt03_account_id
                               AND COALESCE(apr01_status_cd,'99') NOT IN ('99','40') );

        IF v_CNT = 0 THEN
            RETURN '대상아님(계좌없음)';
        END IF;
    END IF;

    /* (2026.4.23 CYY 운영계 반영) 기존 데이터들은 flt14 데이터가 없으므로 원래 로직을 타도록 그냥 둠 */

    RAISE NOTICE 'v_START_DATE : %', v_START_DATE;
    -------------------------------------------------------------------------------------
    v_CNT1  := 0;
    v_CNT2  := 0;
    v_CNT3  := 0;
    v_RTN   := '';
    -------------------------------------------------------------------------------------
    -- 자기매매 존재
    FOR v_APR01 IN ( SELECT *
                       FROM apr01_appr
                      WHERE apr01_appr_id IN ( SELECT flt10_appr_id
                                                 FROM flt10_tr
                                                WHERE flt10_company_id  = p_company_id
                                                  AND flt10_person_id   = p_person_id
                                                  AND flt10_tr_date BETWEEN v_START_DATE AND p_stdDate )
    ) LOOP
        ---------------------------------------------------------------------------------

        RAISE NOTICE '거래있음 - v_APR01.apr01_status_cd : %', v_APR01.apr01_status_cd ;

        IF v_APR01.apr01_status_cd = '30' THEN
            v_CNT1 := v_CNT1 + 1;
        ELSIF v_APR01.apr01_status_cd IN ('40','99') THEN
            v_CNT3 := v_CNT3 + 1;
        ELSE
            v_CNT2 := v_CNT2 + 1;
        END IF;
    END LOOP;
    -------------------------------------------------------------------------------------
    -- 거래없음
    IF (v_CNT1 + v_CNT2 + v_CNT3) = 0 THEN

        RAISE NOTICE '거래없음';

        SELECT *
          INTO v_APR01
          FROM apr01_appr
         WHERE apr01_company_id    = p_company_id
           AND apr01_reg_emp_id    = p_person_id
           AND apr01_effect_date BETWEEN v_START_DATE AND p_stdDate
           AND apr01_status_cd NOT IN ('40','99')  --(40:반려/99:임시저장)
           AND apr01_class_tree_id IN ( SELECT dcr30_class_tree_id
                                          FROM dcr30_link
                                         WHERE dcr30_company_id = apr01_company_id
                                           AND dcr30_link_cd    = 'A09' )   /* (A09:자기매매 실거래 보고) */
         ORDER BY apr01_appr_id DESC
         LIMIT 1;

        IF v_APR01.apr01_appr_id IS NULL THEN
            v_RTN := null;
        ELSE
            --v_RTN := f_cdnm('AprStatusCode', v_APR01.apr01_status_cd, v_APR01.apr01_company_id, p_stdDate);
            IF v_APR01.apr01_status_cd = '30' THEN
                v_RTN := '완료';
            ELSE
                v_RTN := '결재중';
            END IF;
        END IF;
    -------------------------------------------------------------------------------------
    -- 거래있음
    ELSE

        RAISE NOTICE '거래있음 - %, %', v_CNT1, v_CNT2 ;

        /*IF v_CNT1 > 0 THEN
            v_RTN := v_RTN || '완료:'||v_CNT1||'건';
        END IF;

        IF v_CNT2 > 0 THEN
            IF v_CNT1 > 0 THEN v_RTN := v_RTN || ' / '; END IF;
            v_RTN := v_RTN || '결재중:'||v_CNT2||'건';
        END IF;*/

        IF v_CNT3 > 0 THEN 
            RETURN null;
        END IF;

        IF v_CNT2 > 0 THEN
            v_RTN := '결재중';
        ELSE
            IF v_CNT1 > 0 THEN
                v_RTN := '완료';
            END IF;
        END IF;

    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_RTN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
