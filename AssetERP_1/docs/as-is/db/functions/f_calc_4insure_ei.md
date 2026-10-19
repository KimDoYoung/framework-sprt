# f_calc_4insure_ei

## FUNCTION public.f_calc_4insure_ei(p_person_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 304

```sql
CREATE OR REPLACE FUNCTION public.f_calc_4insure_ei(p_person_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY31             pay31_insure_apply%ROWTYPE;

    v_YEAR_AMT          NUMERIC;
    v_MONTH_AMT         NUMERIC;
    v_EI_AMT            NUMERIC;
    v_EI_PAY_AMT        NUMERIC;
    v_EI_DIFF_AMT       NUMERIC;

    v_HIRE_DATE         DATE;
    v_FIRST_PAY_DATE    DATE;
    v_START_DATE        DATE;
    v_CLOSE_DATE        DATE;
    v_CALC_START_DATE   DATE;

    c_CALC              RECORD;

    v_HIRE_WORK_DAYS    NUMERIC;
    v_MONTH_DAYS        NUMERIC;
    v_YEAR_WORK_DAYS    NUMERIC;
    v_WORK_MONTHS       NUMERIC;

    v_PAY_PERIOD        NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        고용보험
    -------------------------------------------------------------------------------------
     1. 고용보험 납부월액
         - 근로자가 월의 중간에 입사,퇴사,휴직,전보의 사유가 발생한 경우
            : 월평균보수를 일할 계산하여 보험료 산정 = 월평균보수 * (월의 근무일수 / 월의 총일수) * 보험료율(0.9%), 십원미만 절사

     2. 월평균보수
         - 고용일이 12/12 이전인 경우(한달을 30으로 계산) = 연보수총액 / 연근무개월수
         - 고용일이 보수총액 신고년도 1/1 ~ 12/12 이고, 고용월 근무 일수가 20일 미만인 경우
           = (연보수총액 / 연근무일수) * {(연근무일수 - 고용월근무일수) / 고용월을 제외한 근무개월수}
         - 고용일이 보수총액 신고년도 1/1 ~ 12/12 이고, 고용월 근무 일수가 20일 이상인 경우
           고용월을 한달로 계산 = 연보수총액 / 연근무개월수

     3. 월별보험료의 재산정시(고용정보 변경 및 월평균보수를 변경신고하는 경우)
         - 신고일의 다음달부터 반영됨
           => 실제 데이터 확인해보니 15일이전 보수변동 신고된 건들이 당월에 반영되었음..ㅡ,.ㅡ;;; => 이걸 반영하니 4월 보수총액건이랑 엮이네... 어쩌지...
         - 신고시 등록한 보수변경월부터 소급적용하여 납부
         - 단, 착오정정으로 등록시엔 신고일이 15일이전이면 당월부터 적용됨

     4. 보수총액을 신고(매년 3월15일까지) 후 정산금액(추가부과 또는 환급)은 4월분 보험료에 합산고지하며,
        추가납부 보험료가 월보험료보다 큰 경우 2회 분납함(일시납 선택가능)

     5. 대표자는 납부대상 아님
    ************************************************************************************/

    -- 납부대상 체크(가입여부, 취득일, 납부연령 체크)
    v_errMsg := '고용보험 납부대상 체크 실패(f_get_4insure_yn) ['||p_person_id||']['||p_std_date||']';
    IF f_get_4insure_yn(p_person_id, p_std_date, '4') = false THEN
        RETURN 0;
    END IF;

    -------------------------------------------------------------------------------------
    -- 최근 신고건 가져오기
    v_errMsg := '최근 신고건 가져오기 실패 ['||p_person_id||']['||p_std_date||']';
    SELECT *
      INTO v_PAY31
      FROM pay31_insure_apply
     WHERE pay31_person_id       = p_person_id
       AND pay31_insure_cd       = '4'                  --(4:고용보험)
       AND pay31_insure_apply_cd IN ('1','2','3','4')   --(1:신규등록/2:보수변동/3:착오정정/4:보수총액신고(전년도분))
       AND ( ----------------------------------------------------------------------------
             --(1:신규등록/3:착오정정/4:보수총액신고)이면 15일이전 신고는 당월, 이후는 익월부터 반경
             ( pay31_insure_apply_cd IN ('1','3','4')                                                                       AND
               CASE WHEN TO_CHAR(pay31_apply_date,'DD') <= '15' THEN pay31_apply_date
                    ELSE CAST(TO_CHAR(pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||'.01' AS DATE) END <= p_std_date   ) OR
             ----------------------------------------------------------------------------
             --(2:보수변동)이면 익월부터 반영
             ( pay31_insure_apply_cd = '2'                                                                                  AND
               CAST(TO_CHAR(pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||'.01' AS DATE) <= p_std_date                 ) )
     ORDER BY pay31_apply_date DESC, pay31_insure_apply_cd DESC
     LIMIT 1;

    IF v_PAY31 IS NULL THEN
        RAISE NOTICE '신고내역 없음!!!';
        RETURN 0;
    END IF;

    RAISE NOTICE '최근 신고구분 (1:신규등록/2:보수변동/3:착오정정/4:보수총액신고) [%], 신고일[%]', v_PAY31.pay31_insure_apply_cd, v_PAY31.pay31_apply_date ;

    -------------------------------------------------------------------------------------
    -- 입사일 GET
    v_errMsg := '입사일 가져오기 실패 ['||p_person_id||']';
    SELECT emp01_hire_date
      INTO v_HIRE_DATE
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;
    
    -- 입사월의 근무일수
    v_HIRE_WORK_DAYS := f_get_datedif(v_HIRE_DATE, f_get_last_day(v_HIRE_DATE), 'D') + 1;

    RAISE NOTICE '입사일            : [%]', v_HIRE_DATE;
    RAISE NOTICE '입사월의 근무일수 : [%]', v_HIRE_WORK_DAYS;

    -------------------------------------------------------------------------------------
    --  월평균보수 SET
    -------------------------------------------------------------------------------------
    v_errMsg := '월평균보수 계산 실패 ['||v_PAY31.pay31_insure_apply_cd||']';

    -- 최근신고건이 '4:보수총액신고'인 경우 "보수총액 / 근무월수"
    IF v_PAY31.pay31_insure_apply_cd = '4' THEN
        ---------------------------------------------------------------------------------
        -- 입사년도가 전년도 12/12 이전인 경우
        IF v_HIRE_DATE <= DATE_TRUNC('year', p_std_date + INTERVAL '-1year') + INTERVAL '+11month +11day' THEN
            -----------------------------------------------------------------------------
            -- 기간계산 시작일
            v_START_DATE := DATE_TRUNC('year', p_std_date + INTERVAL '-1year');
            v_START_DATE := GREATEST(v_START_DATE, v_HIRE_DATE) ;

            -- 기간계산 종료일
            v_CLOSE_DATE := CAST(TO_CHAR(v_START_DATE,'YYYY')||'-12-31' AS DATE);

            -- 연근무개월수
            v_WORK_MONTHS := f_get_datedif(v_START_DATE, v_CLOSE_DATE, 'M') + 1;

            -- 연보수총액
            v_YEAR_AMT := COALESCE(v_PAY31.pay31_pre_year_pay1,0)
                        + COALESCE(v_PAY31.pay31_pre_year_pay2,0)
                        + COALESCE(v_PAY31.pay31_pre_year_pay3,0);

            RAISE NOTICE '연보수총액    : [%]', v_YEAR_AMT;
            RAISE NOTICE '기간계산      : [%] ~ [%]', v_START_DATE, v_CLOSE_DATE;
            RAISE NOTICE '연근무개월수  : [%]', v_WORK_MONTHS;

            -----------------------------------------------------------------------------
            -- 전년도에 입사했으며, 입사월의 근무일수가 20일 미만인 경우
            IF DATE_TRUNC('year', p_std_date + INTERVAL '-1year') <= v_HIRE_DATE AND
               v_HIRE_WORK_DAYS < 20                                             THEN
                -------------------------------------------------------------------------
                -- 연근무일수
                v_YEAR_WORK_DAYS := f_get_datedif(v_START_DATE, v_CLOSE_DATE, 'D') + 1;
                RAISE NOTICE '연근무일수 : [%]', v_YEAR_WORK_DAYS;

                -- 월평균보수 = (연보수총액 / 연근무일수) * {(연근무일수 - 입사월의 근무일수) / 입사월을 제외한 근무개월수}
                v_MONTH_AMT := TRUNC((v_YEAR_AMT / v_YEAR_WORK_DAYS) * ((v_YEAR_WORK_DAYS - v_HIRE_WORK_DAYS) / (v_WORK_MONTHS - 1)));

                RAISE NOTICE '월평균보수(1) : % = ((% / %) * {(% - %) / %} ', v_MONTH_AMT, v_YEAR_AMT, v_WORK_MONTHS, v_YEAR_WORK_DAYS, v_HIRE_WORK_DAYS, v_WORK_MONTHS ;

            -----------------------------------------------------------------------------
            ELSE
                -- 월평균보수 = 연보수총액 / 연근무개월수
                v_MONTH_AMT := TRUNC(v_YEAR_AMT / v_WORK_MONTHS);

                RAISE NOTICE '월평균보수(2) : [%]', v_MONTH_AMT;
            END IF;

        ---------------------------------------------------------------------------------
        -- 입사년도가 전년도 12/13 이후인 경우 : 보수총액신고금액이 아닌 취득시 신고한 소득월액으로 계산
        ELSE
            v_errMsg := '입사년도가 전년도 12/13 이후인 경우 신고보수 가져오기 실패';
            SELECT COALESCE(pay31_apply_month_pay,0)
              INTO v_MONTH_AMT
              FROM pay31_insure_apply
             WHERE pay31_person_id       = p_person_id
               AND pay31_insure_cd       = '4'              --(4:고용보험)
               AND pay31_insure_apply_cd IN ('1','2','3')   --(1:신규등록/2:보수변동/3:착오정정)
               AND ( --------------------------------------------------------------------
                     --(1:신규등록)
                     ( pay31_insure_apply_cd = '1' AND pay31_apply_date < p_std_date ) OR
                     --------------------------------------------------------------------
                     --(2:보수변동)
                     ( pay31_insure_apply_cd = '2'                                                                  AND
                       pay31_apply_month    <= TO_CHAR(p_std_date,'YYYY.MM')                                        AND
                       CAST(TO_CHAR(pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||'.01' AS DATE) <= p_std_date ) OR
                     --------------------------------------------------------------------
                     --(3:착오정정)
                     ( pay31_insure_apply_cd = '3' AND
                       CASE WHEN TO_CHAR(pay31_apply_date,'DD') <= '15' THEN pay31_apply_date
                            ELSE CAST(TO_CHAR(pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||'.01' AS DATE) END <= p_std_date  ) )
             ORDER BY pay31_apply_date DESC, pay31_insure_apply_cd DESC
             LIMIT 1;
             RAISE NOTICE '월평균보수(3) : [%]', v_MONTH_AMT;
        END IF;

    -------------------------------------------------------------------------------------
    -- 신규등록이면서 입사월인 경우 근무일수 반영하여 계산
    ELSIF v_PAY31.pay31_insure_apply_cd = '1'                                AND
          DATE_TRUNC('month', v_HIRE_DATE) = DATE_TRUNC('month', p_std_date) THEN
        ---------------------------------------------------------------------------------
        v_MONTH_AMT := TRUNC(v_PAY31.pay31_apply_month_pay * v_HIRE_WORK_DAYS / (f_get_datedif(DATE_TRUNC('month', v_HIRE_DATE)::date, f_get_last_day(v_HIRE_DATE), 'D') + 1));
        RAISE NOTICE '월평균보수(4) : [%]', v_MONTH_AMT;

    -------------------------------------------------------------------------------------
    ELSE
        v_MONTH_AMT := v_PAY31.pay31_apply_month_pay;
        RAISE NOTICE '월평균보수(5) : [%]', v_MONTH_AMT;
    END IF;

    -------------------------------------------------------------------------------------
    -- 고용보험료 = 월평균보수 * 요율, 십원미만 절사
    -------------------------------------------------------------------------------------
    v_EI_AMT := TRUNC(v_MONTH_AMT * f_get_rate('23', p_std_date), -1);
    
    RAISE NOTICE '당월 고용보험료 : [%]', v_EI_AMT;

    -------------------------------------------------------------------------------------
    -- 신고일의 다음달부터 반영됨. 신고시 등록한 보수변경월부터 소급적용하여 납부
    -- 단, 착오정정으로 등록시엔 신고일이 15일 이전이면 당월부터 적용됨
    -------------------------------------------------------------------------------------
    v_errMsg := '고용보험 소급적용 실패';

    -- 최초납부(변동)일 SET
    IF v_PAY31.pay31_insure_apply_cd IN ('1','3')                AND --(1:신규등록/3:착오정정)
       CAST(TO_CHAR(v_PAY31.pay31_apply_date,'DD') AS NUMERIC) <= 15 THEN
        v_FIRST_PAY_DATE := CAST(TO_CHAR(v_PAY31.pay31_apply_date, 'YYYY.MM')||TO_CHAR(p_std_date,'.DD') AS DATE);
    ELSE
        v_FIRST_PAY_DATE := CAST(TO_CHAR(v_PAY31.pay31_apply_date + INTERVAL '+1month', 'YYYY.MM')||TO_CHAR(p_std_date,'.DD') AS DATE);
    END IF;
    RAISE NOTICE '최초납부(변동)일 : [%]', v_FIRST_PAY_DATE;

    IF v_FIRST_PAY_DATE = p_std_date THEN
        ---------------------------------------------------------------------------------
        v_EI_DIFF_AMT := 0;
        ---------------------------------------------------------------------------------
        IF v_PAY31.pay31_insure_apply_cd = '1' THEN -- (1:신규등록)
            -----------------------------------------------------------------------------
            -- 계산기간 : 취득월 ~ 납부월
            v_CALC_START_DATE := v_PAY31.pay31_init_date;
        ---------------------------------------------------------------------------------
        ELSE --(2:보수변동/3:착오정정/4:보수총액신고)
            -----------------------------------------------------------------------------
            -- 계산기간 : 변경적용월 ~ 납부월
            v_CALC_START_DATE := CAST(v_PAY31.pay31_apply_month||'.01' AS DATE);

            -- 기납부액GET
            SELECT SUM(pay11_item_amt)
              INTO v_EI_PAY_AMT
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id = p_person_id
               AND pay10_date BETWEEN v_CALC_START_DATE AND p_std_date - 1
               AND pay11_item_cd = '240'; --(240:고용보험)

            RAISE NOTICE '기납부 고용보험료 : [%]', v_EI_PAY_AMT;

            v_EI_DIFF_AMT := v_EI_PAY_AMT * -1;
        END IF;

        v_PAY_PERIOD := f_get_datedif(v_CALC_START_DATE, p_std_date, 'M');
        RAISE NOTICE '계산개월수 : [%], 계산시작일 : [%]', v_PAY_PERIOD, v_CALC_START_DATE;

        IF v_PAY_PERIOD >= 1 THEN
            -----------------------------------------------------------------------------
            -- 소급기간의 적용율로 계산
            FOR c_CALC IN ( SELECT TO_CHAR(sys12_day,'YYYY.MM')     std_month
                                 , f_get_rate('23',sys12_day::date) rate
                              FROM sys12_calendar
                             WHERE sys12_company_id = 0
                               AND sys12_day        = DATE_TRUNC('month', sys12_day)
                               AND sys12_day  BETWEEN DATE_TRUNC('month', v_CALC_START_DATE) AND p_std_date + INTERVAL '-1month'
                             ORDER BY sys12_day
            ) LOOP
                RAISE NOTICE '입사월[%], 계산기준월[%], 입사월의근무일수[%]', TO_CHAR(v_HIRE_DATE,'YYYY.MM'), c_CALC.std_month, v_HIRE_WORK_DAYS;

                -------------------------------------------------------------------------
                -- 신규등록시 입사월의 근무일수가 20일미만인 경우 일할 계산
                IF v_PAY31.pay31_insure_apply_cd = '1'                  AND
                   TO_CHAR(v_HIRE_DATE,'YYYY.MM') = c_CALC.std_month    AND
                   v_HIRE_WORK_DAYS < 20                                THEN
                    ---------------------------------------------------------------------
                    -- 입사월의 일수
                    v_MONTH_DAYS := f_get_datedif(DATE_TRUNC('month',v_HIRE_DATE)::date, f_get_last_day(v_HIRE_DATE),'D') + 1;

                    -- 입사월의 납부금액(= 월납부금액 * 입사월의 근무일수 / 입사월의 일수) * 적용율
                    v_EI_DIFF_AMT := TRUNC(TRUNC(v_MONTH_AMT * v_HIRE_WORK_DAYS / v_MONTH_DAYS) * c_CALC.rate, -1);

                    RAISE NOTICE ' - 입사월(%)의 납부금액[%] = (% * % / %) * %', c_CALC.std_month, v_EI_DIFF_AMT, v_MONTH_AMT, v_HIRE_WORK_DAYS, v_MONTH_DAYS, c_CALC.rate ;

                ---------------------------------------------------------------------
                ELSE
                    RAISE NOTICE ' - % 월의 납부금액 = % + (% * %)', c_CALC.std_month, v_EI_DIFF_AMT, v_MONTH_AMT, c_CALC.rate ;
                    v_EI_DIFF_AMT := v_EI_DIFF_AMT + TRUNC(v_MONTH_AMT * c_CALC.rate, -1);

                END IF;
            END LOOP;
        END IF;
        ---------------------------------------------------------------------------------
        -- 소급분반영 당월 납부금액
        v_EI_AMT := v_EI_AMT + v_EI_DIFF_AMT;

        RAISE NOTICE '소급반영 고용보험 당월납부액[%], 소급금액[%]', v_EI_AMT, v_EI_DIFF_AMT;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_EI_AMT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
    RETURN 0;
END;
$function$
```
