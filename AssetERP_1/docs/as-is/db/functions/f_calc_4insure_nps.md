# f_calc_4insure_nps

## FUNCTION public.f_calc_4insure_nps(p_person_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 305

```sql
CREATE OR REPLACE FUNCTION public.f_calc_4insure_nps(p_person_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY31             pay31_insure_apply%ROWTYPE;
    v_PAY29             pay29_other_setup%ROWTYPE;
    v_EMP               RECORD;

    v_CALC_START_DATE   DATE;
    v_CALC_CLOSE_DATE   DATE;
    v_APPLY_DATE        DATE;
    v_FIRST_PAY_DATE    DATE;
    v_CHECK_DATE        DATE;

    v_YEAR_INCOME_YN    BOOLEAN;
    v_WORK_DAYS         NUMERIC;
    v_YEAR_INCOME       NUMERIC;
    v_MONTH_INCOME      NUMERIC;
    v_PAY_PERIOD        NUMERIC;
    v_NPS_AMT           NUMERIC;
    v_NPS_PAY_AMT       NUMERIC;
    v_NPS_DIFF_AMT      NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        국민연금
    -------------------------------------------------------------------------------------
     1. 국민연금 납부월액
         = {전년도 소득총액(원천징수영수증의 16번 + 18번 금액합계) / 전년도 근무일수 * 30, 천원미만 절사} x 국민연금 요율(4.5%), 십원미만 절사
     2. 당해년도 입사자 또는 보수변동신고시 : {신고한 보수월액} * 국민연금 요율(4.5%), 십원미만 절사
     3. 계산기준년도 12/2 이후 입사자인 경우 신고한 보수월액으로 계산, 12/1 이전 입사자는 연보수총액으로 계산
     4. 기준소득월액 상하한액
        - 2022.7 ~ 2023.6 : 상한액 월553만원 초과는 553만원으로 계산
                            하한액 월35만원 미만은 35만원으로 계산
        - 2023.7 ~ 2024.6 : 상한액 월590만원 초과는 590만원으로 계산
                            하한액 월37만원 미만은 37만원으로 계산
     5. 소득총액 : 매년 7월 기준으로 1~6월은 전년도 원천징수소득금액, 7월~ 12월은 당해년도 원천징수소득금액
     6. 1일 입사자는 무조건 입사월 납부, 2일~말일은 입사월 납부 희망/미희망 선택가능
     7. 당월납부는 15일이전 신고까지만 적용. 이후 신고는 다음월에 납부
        (만약 입사월 납부희망인데 15일이후에 신고가 되면 다음달에 2개월분 납부)
     8. 60세이상(만나이 적용, 생일달까지 납부(1일은 미납부)) 연금납부 없음
     9. 기준소득액 신고기한은 매년 5월 31일까지 (국세청자료를 사용하므로 신경안써도 됨)
    ************************************************************************************/

    -- 국민연금 납부대상 체크(가입여부, 취득일, 납부연령 체크)
    v_errMsg := '국민연금 납부대상 체크 실패(f_get_4insure_yn) ['||p_person_id||']['||p_std_date||']';
    IF f_get_4insure_yn(p_person_id, p_std_date, '1') = false THEN
        RETURN 0;
    END IF;

    -------------------------------------------------------------------------------------
    -- 소득총액 가져오기 (1월~6월:전전년도 소득총액, 7월~12월:전년도 소득총액)
    -------------------------------------------------------------------------------------
    -- 1. 기준일자 기준의 적용기간 종료일 SET
    -- 2. 적용기간 종료일 이후 변경/취득 신청건 조회
    -- 3. 2번에 해당되는 건이 없으면 "적용기간종료일-1년+1일 ~ 적용기간종료일"의 총소득액 가져오기
    -- 4. 2번에 해당되는 건이 있으면 해당건으로 국민연금 계산
    -------------------------------------------------------------------------------------
    -- 기준일이 당해년도 6월 30일 이후면 => 계산적용기간은 전년도 1월~12월
    IF CAST(TO_CHAR(p_std_date,'YYYY')||'-06-30' AS DATE) < p_std_date THEN
        v_CALC_START_DATE := CAST(TO_CHAR(p_std_date + INTERVAL '-1year','YYYY')||'-01-01' AS DATE);
        v_CALC_CLOSE_DATE := v_CALC_START_DATE + INTERVAL '+1year -1day';
        v_APPLY_DATE      := CAST(TO_CHAR(p_std_date,'YYYY')||'-04-01' AS DATE);
    -------------------------------------------------------------------------------------
    -- 기준일이 당해년도 6월 30일 이전이면 => 계산적용기간은 전전년도 1월~12월
    ELSE
        v_CALC_START_DATE := CAST(TO_CHAR(p_std_date + INTERVAL '-2year','YYYY')||'-01-01' AS DATE);
        v_CALC_CLOSE_DATE := v_CALC_START_DATE + INTERVAL '+1year -1day';
        v_APPLY_DATE      := CAST(TO_CHAR(p_std_date + INTERVAL '-1year','YYYY')||'-04-01' AS DATE);
    END IF;

    RAISE NOTICE '계산적용기간   : v_CALC_START_DATE[%], v_CALC_CLOSE_DATE[%]', v_CALC_START_DATE, v_CALC_CLOSE_DATE;
    RAISE NOTICE '보수총액신고일 : v_APPLY_DATE[%]',v_APPLY_DATE;

    -------------------------------------------------------------------------------------
    -- 최근 신고건 가져오기
    v_errMsg := '최근 신고건 가져오기 실패 ['||p_person_id||']['||p_std_date||']';
    SELECT *
      INTO v_PAY31
      FROM pay31_insure_apply
     WHERE pay31_person_id          = p_person_id
       AND pay31_insure_cd          = '1'               --(1:국민연금)
       AND pay31_insure_apply_cd    IN ('1','2','3')    --(1:신규등록/2:보수변동/3:착오정정)
       AND CASE WHEN TO_CHAR(pay31_apply_date,'DD') <= '15' THEN pay31_apply_date
                ELSE CAST(TO_CHAR(pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||'.01' AS DATE) END <= p_std_date
       AND ( ( pay31_insure_apply_cd IN ('2','3')                       AND
               pay31_apply_month    <=  TO_CHAR(p_std_date,'YYYY.MM')   ) OR
             ( pay31_insure_apply_cd IN ('1')                           ) )
     ORDER BY pay31_apply_date DESC, pay31_insure_apply_cd DESC
     LIMIT 1;
     
    RAISE NOTICE '최근 신고구분 (1:신규등록/2:보수변동/3:착오정정/4:보수총액신고) [%], 신고일[%]', v_PAY31.pay31_insure_apply_cd, v_PAY31.pay31_apply_date ;

    ---------------------------------------------------------------------------------
    -- 사원정보(입사일, 퇴사일) 가져오기
    v_errMsg := '사원정보 가져오기 실패 ['||p_person_id||']';
    SELECT emp01_person.*
         , f_get_empTrans(p_person_id, p_std_date, 'retire_date')::date AS emp01_retire_date
      INTO v_EMP
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;

    -------------------------------------------------------------------------------------
    -- 신고건이 계산적용 종료일자 이후이면 신고금액으로 계산
    -- 신규등록이면 '취득일'로 체크, 보수변동/착오정정이면 '변경적용월'로 체크
    -------------------------------------------------------------------------------------
    IF v_PAY31 IS NULL THEN
        RAISE NOTICE '신고내역 없음!!!';
        RETURN 0;
    ELSE
        IF v_PAY31.pay31_insure_apply_cd = '1' THEN
            v_CHECK_DATE := CAST(TO_CHAR(v_CALC_CLOSE_DATE,'YYYY-MM')||'-01' AS DATE);
            RAISE NOTICE '계산종료일(%) <= 취득일(%)', v_CHECK_DATE, v_PAY31.pay31_init_date;

            IF v_CHECK_DATE <= v_PAY31.pay31_init_date THEN --('취득일'로 체크)
                v_YEAR_INCOME_YN := false;
                RAISE NOTICE '최근신고한 소득월액으로 계산';
            ELSE
                v_YEAR_INCOME_YN := true;
                RAISE NOTICE '보수총액신고내역 또는 급여정보로 계산';
            END IF;
        -------------------------------------------------------------------------------------
        ELSE
            IF v_CALC_CLOSE_DATE <= (v_PAY31.pay31_apply_month||'.01')::DATE THEN --('변경적용월'로 체크)
                v_YEAR_INCOME_YN := false;
                RAISE NOTICE '최근신고한 소득월액으로 계산';
            ELSE
                v_YEAR_INCOME_YN := true;
                RAISE NOTICE '보수총액신고내역 또는 급여정보로 계산';
            END IF;
        END IF;
    END IF;

    -------------------------------------------------------------------------------------
    -- 전년도 소득총액(원천징수영수증의 16번 + 18번 금액합계) / 전년도 근무일수 * 30, 천원미만 절사
    -------------------------------------------------------------------------------------
    IF v_YEAR_INCOME_YN THEN
        RAISE NOTICE '소득총액으로 계산!!';
        ---------------------------------------------------------------------------------
        -- 입사일 적용
        IF v_CALC_START_DATE < v_EMP.emp01_hire_date THEN
            v_CALC_START_DATE := v_EMP.emp01_hire_date;
        END IF;
        ---------------------------------------------------------------------------------
        -- 근무일수
        IF v_CALC_CLOSE_DATE > v_EMP.emp01_retire_date THEN
            v_WORK_DAYS := f_get_datedif(v_CALC_START_DATE, v_EMP.emp01_retire_date, 'D') + 1;
        ELSE
            v_WORK_DAYS := f_get_datedif(v_CALC_START_DATE, v_CALC_CLOSE_DATE, 'D') + 1;
        END IF;

        RAISE NOTICE '근무일수 : v_WORK_DAYS[%] (% ~ %)', v_WORK_DAYS, v_CALC_START_DATE, v_CALC_CLOSE_DATE;

        ---------------------------------------------------------------------------------
        -- 소득총액 가져오기 (기준년도 총보수신고금액(건강보험)으로 계산)
        v_errMsg := '기준년도 보수총액 신고내역 가져오기 실패 ['||p_person_id||']['||v_APPLY_DATE||']';
        SELECT pay31_pre_year_pay1
          INTO v_YEAR_INCOME
          FROM pay31_insure_apply
         WHERE pay31_person_id       = p_person_id
           AND pay31_insure_cd       = '2'  --(2:건강보험 <- 국민연금은 건강보험 신고내역으로 계산한다 )
           AND pay31_insure_apply_cd = '4'  --(4:전년도분 보수총액신고)
           AND pay31_apply_date      = v_APPLY_DATE;

        IF COALESCE(v_YEAR_INCOME,0) = 0 THEN

            RAISE NOTICE '기준년도 보수총액 신고내역 없음 (신고일:%)', v_APPLY_DATE;

            v_errMsg := '급여정보에서 소득총액 가져오기 실패 ['||p_person_id||']['||v_CALC_START_DATE||']['||v_CALC_CLOSE_DATE||']';
            SELECT SUM(COALESCE(pay11_item_amt,0))
              INTO v_YEAR_INCOME
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                   INNER JOIN pay20_item       ON pay20_item_cd  = pay11_item_cd
             WHERE pay10_person_id = p_person_id
               AND pay10_std_month BETWEEN TO_CHAR(v_CALC_START_DATE,'YYYY.MM') AND TO_CHAR(v_CALC_CLOSE_DATE,'YYYY.MM')
               AND pay20_item_type      = '1'   --(1:급여지급항목)
               AND pay20_non_tax_type   = '1';  --(1:과세)*/

            RAISE NOTICE '급여정보에서 소득총액 가져오기 : v_YEAR_INCOME[%]', v_YEAR_INCOME;
        ELSE
            RAISE NOTICE '기준년도 보수총액 신고금액 가져오기 : v_YEAR_INCOME[%]', v_YEAR_INCOME;
        END IF;

        ---------------------------------------------------------------------------------
        -- 보수월액 = 소득총액 / 연근무일수 * 30, 천원미만 절사
        v_MONTH_INCOME := TRUNC(v_YEAR_INCOME / v_WORK_DAYS * 30, -3);

        RAISE NOTICE '계산한 보수월액 : v_MONTH_INCOME[%]', v_MONTH_INCOME;

    -------------------------------------------------------------------------------------
    -- 신고한 보수월액
    -------------------------------------------------------------------------------------
    ELSE
        v_MONTH_INCOME := v_PAY31.pay31_apply_month_pay;
        RAISE NOTICE '신고한 보수월액 : v_MONTH_INCOME[%]', v_MONTH_INCOME;
    END IF;

    -------------------------------------------------------------------------------------
    -- 기준소득월액 상하한액 적용
    -------------------------------------------------------------------------------------
    v_errMsg := '국민연금 기준소득월 상하한액 가져오기 실패 ['||p_std_date||']';
    SELECT *
      INTO v_PAY29
      FROM pay29_other_setup
     WHERE pay29_start_date <= p_std_date
     ORDER BY pay29_start_date DESC
     LIMIT 1;
    -------------------------------------------------------------------------------------
    -- 상한액적용
    IF COALESCE(v_PAY29.pay29_np_max_amt,0) != 0                AND
       COALESCE(v_PAY29.pay29_np_max_amt,0) < v_MONTH_INCOME    THEN
        v_MONTH_INCOME := v_PAY29.pay29_np_max_amt;
    END IF;
    -------------------------------------------------------------------------------------
    -- 하한액적용
    IF COALESCE(v_PAY29.pay29_np_min_amt,0) != 0                AND
       COALESCE(v_PAY29.pay29_np_min_amt,0) >= v_MONTH_INCOME   THEN
        v_MONTH_INCOME := v_PAY29.pay29_np_min_amt;
    END IF;

    -------------------------------------------------------------------------------------
    -- 국민연금 = 보수월액 * 요율
    -------------------------------------------------------------------------------------
    v_NPS_AMT := TRUNC(v_MONTH_INCOME * f_get_rate('20', p_std_date), -1);
    
    RAISE NOTICE '당월 국민연금 : [%]', v_NPS_AMT;

    -------------------------------------------------------------------------------------
    -- 당월납부는 15일이전 신고까지만 적용. 이후 신고는 다음월에 소급하여 납부
    -------------------------------------------------------------------------------------
    v_errMsg := '국민연금 소급적용 실패';

    -- 최초납부(변동)월
    IF CAST(TO_CHAR(v_PAY31.pay31_apply_date,'DD') AS NUMERIC) <= 15 THEN
        v_FIRST_PAY_DATE := CAST(TO_CHAR(v_PAY31.pay31_apply_date, 'YYYY.MM')||TO_CHAR(p_std_date,'.DD') AS DATE);
    ELSE
        v_FIRST_PAY_DATE := CAST(TO_CHAR(v_PAY31.pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||TO_CHAR(p_std_date,'.DD') AS DATE);
    END IF;

    IF v_FIRST_PAY_DATE = p_std_date THEN
        ---------------------------------------------------------------------------------
        IF v_PAY31.pay31_insure_apply_cd = '1' THEN -- (1:신규등록)
            -----------------------------------------------------------------------------
            -- 계산기간 : 취득월 ~ 납부월
            v_PAY_PERIOD := f_get_datedif(v_PAY31.pay31_init_date, p_std_date, 'M');

            -- 1일 입사자는 당월 납부대상임. 2일이후 입사자는 입사월 납부를 희망한 경우에만 납부함
            IF TO_CHAR(v_PAY31.pay31_init_date,'DD') = '01'             OR
               COALESCE(v_PAY31.pay31_nps_init_pay_yn,'false') = 'true' THEN
                v_PAY_PERIOD := v_PAY_PERIOD + 1;
            END IF;

            -- 당월 납부금액 = 국민연금납부금액 * 납부기간
            v_NPS_AMT := v_NPS_AMT * v_PAY_PERIOD;

            RAISE NOTICE '소급반영 국민연금 당월납부액(1) : [%]', v_NPS_AMT;

        ---------------------------------------------------------------------------------
        ELSIF v_PAY31.pay31_insure_apply_cd IN ('2','3') THEN --(2:보수변동/3:착오정정)
            -----------------------------------------------------------------------------
            -- 계산기간 : 변경적용월 ~ 납부월
            v_PAY_PERIOD := f_get_datedif(CAST(v_PAY31.pay31_apply_month||'.01' AS DATE), p_std_date, 'M');

            IF v_PAY_PERIOD < 1 THEN
                v_NPS_DIFF_AMT := 0;
            ELSE
                -- 기납부액GET
                SELECT SUM(pay11_item_amt)
                  INTO v_NPS_PAY_AMT
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                 WHERE pay10_person_id = p_person_id
                   AND pay10_date BETWEEN CAST(v_PAY31.pay31_apply_month||'.01' AS DATE) AND p_std_date - 1
                   AND pay11_item_cd = '210'; --(210:국민연금)

                RAISE NOTICE '기납부 국민연금 : [%]', v_NPS_PAY_AMT;

                -- 소급분
                v_NPS_DIFF_AMT := (v_NPS_AMT * v_PAY_PERIOD) - v_NPS_PAY_AMT;

                RAISE NOTICE '소급분 국민연금 : [%]', v_NPS_DIFF_AMT;
            END IF;

            -- 소급분반영 당월 납부금액
            v_NPS_AMT := v_NPS_AMT + v_NPS_DIFF_AMT;

            RAISE NOTICE '소급반영 국민연금 당월납부액(2) : [%]', v_NPS_AMT;

        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_NPS_AMT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
    RETURN 0;
END;
$function$
```
