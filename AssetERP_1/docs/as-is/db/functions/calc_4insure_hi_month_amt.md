# calc_4insure_hi_month_amt

## PROCEDURE public.calc_4insure_hi_month_amt(IN p_person_id numeric, IN p_std_date date, INOUT o_insure_apply record, INOUT o_first_pay_date date, INOUT o_month_amt numeric)

- 반환: `-`
- 줄 수: 105

```sql
CREATE OR REPLACE PROCEDURE public.calc_4insure_hi_month_amt(IN p_person_id numeric, IN p_std_date date, INOUT o_insure_apply record, INOUT o_first_pay_date date, INOUT o_month_amt numeric)
 LANGUAGE plpgsql
AS $procedure$
-----------------------------------------------------------------------------------------
/* 실행문
do $$
DECLARE
    v_insure_apply  RECORD;
    v_month_amt     NUMERIC;
BEGIN
    call calc_4insure_hi_month_amt(23566, '2023-1-20', v_insure_apply, v_month_amt);
END;
$$
*/
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY31             RECORD; --pay31_insure_apply%ROWTYPE;
    v_PAY29             pay29_other_setup%ROWTYPE;

    v_MONTH_AMT         NUMERIC;
    v_HI_AMT            NUMERIC;
    v_HI_PAY_AMT        NUMERIC;
    v_HI_DIFF_AMT       NUMERIC;

    v_PAY_PERIOD        NUMERIC;
    v_FIRST_PAY_DATE    DATE;

    c_CALC              RECORD;
    v_CALC_START_DATE   DATE;
    v_CALC_CLOSE_DATE   DATE;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        건강보험료와 장기요양보험료 계산을 위한 최근신고정보, 최초납부일, 소득월액을 리턴한다
    ************************************************************************************/

    -- 납부대상 체크(가입여부, 취득일, 납부연령 체크)
    v_errMsg := '건강보험 납부대상 체크 실패(f_get_4insure_yn) ['||p_person_id||']['||p_std_date||']';
    IF f_get_4insure_yn(p_person_id, p_std_date, '2') = false THEN
        v_errMsg := '건강보험 납부대상이 아님';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 최근 신고건 가져오기
    v_errMsg := '최근 신고건 가져오기 실패 ['||p_person_id||']['||p_std_date||']';
    SELECT *
      INTO v_PAY31
      FROM pay31_insure_apply
     WHERE pay31_person_id          = p_person_id
       AND pay31_insure_cd          = '2'                   --(2:건강보험)
       AND pay31_insure_apply_cd    IN ('1','2','3','4')    --(1:신규등록/2:보수변동/3:착오정정/4:보수총액신고(전년도분))
       AND CASE WHEN TO_CHAR(pay31_apply_date,'DD') <= '15' THEN pay31_apply_date
                ELSE CAST(TO_CHAR(pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||'.01' AS DATE) END <= p_std_date
     ORDER BY pay31_apply_date DESC, pay31_insure_apply_cd DESC
     LIMIT 1;

    IF v_PAY31 IS NULL THEN
        v_errMsg := '신고내역 없음';
        RAISE USING ERRCODE = '90001';
    ELSE
        o_insure_apply := v_PAY31;
    END IF;

    RAISE NOTICE 'calc_4insure_hi_month_amt IN) 최근 신고구분 (1:신규등록/2:보수변동/3:착오정정/4:보수총액신고) [%], 신고일[%]', v_PAY31.pay31_insure_apply_cd, v_PAY31.pay31_apply_date ;

    ---------------------------------------------------------------------------------
    -- 최초납부(변동)일 SET
    ---------------------------------------------------------------------------------
    -- 당월납부는 15일이전 신고까지만 적용. 이후 신고는 다음월에 소급하여 납부
    IF CAST(TO_CHAR(v_PAY31.pay31_apply_date,'DD') AS NUMERIC) <= 15 THEN
        v_FIRST_PAY_DATE := CAST(TO_CHAR(v_PAY31.pay31_apply_date, 'YYYY.MM')||TO_CHAR(p_std_date,'.DD') AS DATE);
    ELSE
        v_FIRST_PAY_DATE := CAST(TO_CHAR(v_PAY31.pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||TO_CHAR(p_std_date,'.DD') AS DATE);
    END IF;
    RAISE NOTICE '최초납부(변동)일 : [%]', v_FIRST_PAY_DATE;
    o_first_pay_date := v_FIRST_PAY_DATE;

    -------------------------------------------------------------------------------------
    -- 소득월액 SET
    -------------------------------------------------------------------------------------
    -- 최근신고건이 '4:보수총액신고'인 경우 "보수총액 / 근무월수"
    IF v_PAY31.pay31_insure_apply_cd = '4' THEN
        v_MONTH_AMT := v_PAY31.pay31_pre_year_pay1 / v_PAY31.pay31_pre_year_work_month_cnt ;
    ELSE
        v_MONTH_AMT := v_PAY31.pay31_apply_month_pay;
    END IF;

    RAISE NOTICE 'calc_4insure_hi_month_amt IN) 소득월액 : [%]', v_MONTH_AMT;
    -------------------------------------------------------------------------------------
    o_month_amt := v_MONTH_AMT;
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'calc_4insure_hi_month_amt IN) USER EXCEPTION - %', v_errMsg ;
        o_month_amt := 0;
    WHEN OTHERS THEN
        RAISE NOTICE 'calc_4insure_hi_month_amt IN) EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        o_month_amt := NULL;
END;
$procedure$
```
