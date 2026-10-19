# f_create_4insure_adjust_pay

## FUNCTION public.f_create_4insure_adjust_pay(p_person_id numeric, p_insure_cd character varying, p_pay_date date)

- 반환: `numeric`
- 줄 수: 228

```sql
CREATE OR REPLACE FUNCTION public.f_create_4insure_adjust_pay(p_person_id numeric, p_insure_cd character varying, p_pay_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY32             pay32_insure_pay%ROWTYPE;
    v_PAY31             pay31_insure_apply%ROWTYPE;
    v_PAY30             pay30_basic_setup%ROWTYPE;

    v_EMP               RECORD;
    c_PAY               RECORD;

    v_STD_YEAR          VARCHAR(4);
    v_PAY_AMT           NUMERIC;

    v_errMsg            VARCHAR(100);
    v_fixMsg            VARCHAR(50);
-----------------------------------------------------------------------------------------
BEGIN

    IF p_insure_cd = '2' THEN
        v_fixMsg := '건강보험 정산금액 산출시 ';
    ELSIF p_insure_cd = '3' THEN
        v_fixMsg := '장기요양보험 정산금액 산출시 ';
    ELSE
        v_fixMsg := '고용보험 정산금액 산출시 ';
    END IF;

    /************************************************************************************
       [급여생성시 호출하는 Function]
        1. 건강보험/장기요양/고용보험 연말정산금액을 리턴한다
        2. 정산금액 납부내역을 생성한다 (pay32)
    ************************************************************************************/

    -- 기준년도 SET
    IF TO_CHAR(p_pay_date,'MM') >= '04' THEN
        v_STD_YEAR := TO_CHAR(p_pay_date + INTERVAL '-1year', 'YYYY');
    ELSE
        v_STD_YEAR := TO_CHAR(p_pay_date + INTERVAL '-2year', 'YYYY');
    END IF;

    -------------------------------------------------------------------------------------
    -- 이전 납부내역 가져오기
    v_errMsg := v_fixMsg||'이전 납부내역 가져오기 실패 ['||p_person_id||']['||v_STD_YEAR||']['||p_insure_cd||']['||p_pay_date||']';
    SELECT *
      INTO v_PAY32
      FROM pay32_insure_pay
     WHERE pay32_person_id  = p_person_id
       AND pay32_year       = v_STD_YEAR
       AND pay32_insure_cd  = p_insure_cd
       AND pay32_date      >= CAST((v_STD_YEAR||'-04-01')::DATE + INTERVAL '+1year' AS DATE)
       AND pay32_date       < p_pay_date
     ORDER BY pay32_date DESC
     LIMIT 1;

    -- 잔여금액이 없으면 0으로 리턴
    IF COALESCE(v_PAY32.pay32_rem_amt,0) = 0 THEN
        RETURN 0;
    END IF;

    -------------------------------------------------------------------------------------
    -- 납부일이후 납부내역 정리
    v_errMsg := v_fixMsg||'납부일이후 납부내역 정리실패(PAY33) ['||p_person_id||']['||p_insure_cd||']['||p_pay_date||']['||v_STD_YEAR||']';
    DELETE
      FROM pay32_insure_pay
     WHERE pay32_person_id  = p_person_id
       AND pay32_insure_cd  = p_insure_cd
       AND pay32_year       = v_STD_YEAR
       AND pay32_date      >= p_pay_date ;

    -------------------------------------------------------------------------------------
    -- 사원정보 가져오기
    v_errMsg := '사원정보 가져오기 실패['||p_person_id||']';
    SELECT *
      INTO v_EMP
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;

    -------------------------------------------------------------------------------------
    -- 고객사 기본납부정보 가져오기
    v_errMsg := v_fixMsg||'고객사 기본납부정보 가져오기 실패['||v_EMP.emp01_company_id||']';
    SELECT *
      INTO v_PAY30
      FROM pay30_basic_setup
     WHERE pay30_company_id = v_EMP.emp01_company_id
     LIMIT 1;

    -- 고객사 기준정보가 없는 경우 공통회사 정보를 사용
    IF v_PAY30 IS NULL THEN
        SELECT *
          INTO v_PAY30
          FROM pay30_basic_setup
         WHERE pay30_company_id = 0
         LIMIT 1;
    END IF;

    -- 일시납인 경우 회차는 1로 SET
    IF v_PAY30.pay30_hi_div_pay_cd = '1' THEN
        v_PAY30.pay30_hi_max_div := 1;
    END IF;
    IF v_PAY30.pay30_ei_div_pay_cd = '1' THEN
        v_PAY30.pay30_ei_max_div := 1;
    END IF;

    -------------------------------------------------------------------------------------
    -- 납부방법 변경신고내역 가져오기
    v_errMsg := v_fixMsg||'납부방법 변경신고내역 가져오기 실패 ['||p_person_id||']['||v_STD_YEAR||']['||p_insure_cd||']['||p_pay_date||']';
    SELECT *
      INTO v_PAY31
      FROM pay31_insure_apply
     WHERE pay31_person_id          = p_person_id
       AND pay31_insure_cd          = CASE WHEN p_insure_cd = '3' THEN '2' ELSE p_insure_cd END
       AND pay31_insure_apply_cd    = '5'   --(5:납부방법 변경)
       AND pay31_apply_date         BETWEEN CAST((v_STD_YEAR||'-03-10')::DATE + INTERVAL '+1year' AS DATE)
                                    AND     p_pay_date
     ORDER BY pay31_apply_date DESC
     LIMIT 1;

    -------------------------------------------------------------------------------------
    -- 당월 납부내역 생성
    -------------------------------------------------------------------------------------
    v_PAY32.pay32_insure_pay_id := f_create_seq()   ;
    v_PAY32.pay32_date          := p_pay_date       ;
    -------------------------------------------------------------------------------------
    -- 납부방법(1:일시납/2:분할납부), 분할납부지정회차
    IF v_PAY31 IS NOT NULL THEN
        v_PAY32.pay32_pay_cd    := v_PAY31.pay31_pay_cd;
        v_PAY32.pay32_pay_div   := v_PAY31.pay31_pay_div;
    ELSE
        IF p_insure_cd IN ('2','3') THEN
            v_PAY32.pay32_pay_cd    := v_PAY30.pay30_hi_div_pay_cd;
            v_PAY32.pay32_pay_div   := v_PAY30.pay30_hi_max_div;
        ELSE
            v_PAY32.pay32_pay_cd    := v_PAY30.pay30_ei_div_pay_cd;
            v_PAY32.pay32_pay_div   := v_PAY30.pay30_ei_max_div;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 납부금액
    v_errMsg := v_fixMsg||'당월 납부금액 계산 실패 ['||v_PAY32.pay32_rem_amt||']['||v_PAY32.pay32_pay_div||']['||v_PAY32.pay32_cnt||']';

    RAISE NOTICE '당월 납부금액 = 잔여금액[%] / (분할회수[%] - 이전납부회차[%])', v_PAY32.pay32_rem_amt, v_PAY32.pay32_pay_div, v_PAY32.pay32_cnt;

    v_PAY32.pay32_amt := TRUNC(v_PAY32.pay32_rem_amt / (v_PAY32.pay32_pay_div - v_PAY32.pay32_cnt), -1);

    RAISE NOTICE '짜투리금액 = %', (v_PAY32.pay32_rem_amt - v_PAY32.pay32_amt * (v_PAY32.pay32_pay_div - v_PAY32.pay32_cnt));

    v_PAY32.pay32_amt := v_PAY32.pay32_amt + (v_PAY32.pay32_rem_amt - v_PAY32.pay32_amt * (v_PAY32.pay32_pay_div - v_PAY32.pay32_cnt));

    RAISE NOTICE '계산 당월 납부금액 = %', v_PAY32.pay32_amt;

    v_PAY_AMT         := v_PAY32.pay32_amt;
    -------------------------------------------------------------------------------------
    v_PAY32.pay32_rem_amt   := v_PAY32.pay32_rem_amt - v_PAY32.pay32_amt    ;
    v_PAY32.pay32_cnt       := v_PAY32.pay32_cnt + 1                        ;
    -------------------------------------------------------------------------------------
    v_errMsg := v_fixMsg||'당월 납부내역생성 실패';
    INSERT INTO pay32_insure_pay VALUES (v_PAY32.*);

    -------------------------------------------------------------------------------------
    -- 이후 납부내역 생성
    FOR c_PAY IN ( SELECT pay10_date, SUM(pay11_item_amt) amt
                     FROM pay10_month
                          INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                    WHERE pay10_person_id   = p_person_id
                      AND pay10_date        > p_pay_date
                      AND pay11_item_cd     = CASE WHEN p_insure_cd = '2' THEN '221'
                                                   WHEN p_insure_cd = '3' THEN '231'
                                                   WHEN p_insure_cd = '4' THEN '241' END
                    GROUP BY pay10_date
                    ORDER BY pay10_date
    ) LOOP
        ---------------------------------------------------------------------------------
        -- 납부방법 변경신고내역 가져오기
        v_errMsg := v_fixMsg||'납부방법 변경신고내역 가져오기 실패 ['||p_person_id||']['||v_STD_YEAR||']['||p_insure_cd||']['||p_pay_date||']';
        SELECT *
          INTO v_PAY31
          FROM pay31_insure_apply
         WHERE pay31_person_id          = p_person_id
           AND pay31_insure_cd          = CASE WHEN p_insure_cd = '3' THEN '2' ELSE p_insure_cd END
           AND pay31_insure_apply_cd    = '5'   --(5:납부방법 변경)
           AND pay31_apply_date         BETWEEN CAST((v_STD_YEAR||'-03-10')::DATE + INTERVAL '+1year' AS DATE)
                                        AND     c_PAY.pay10_date
         ORDER BY pay31_apply_date DESC
         LIMIT 1;

        ---------------------------------------------------------------------------------
        -- 내역SET
        ---------------------------------------------------------------------------------
        v_PAY32.pay32_insure_pay_id := f_create_seq()                               ;
        v_PAY32.pay32_date          := c_PAY.pay10_date                             ;
        v_PAY32.pay32_amt           := c_PAY.amt                                    ;
        v_PAY32.pay32_rem_amt       := v_PAY32.pay32_rem_amt - v_PAY32.pay32_amt    ;
        v_PAY32.pay32_cnt           := v_PAY32.pay32_cnt + 1                        ;
        ---------------------------------------------------------------------------------
        -- 납부방법(1:일시납/2:분할납부), 분할납부지정회차
        IF v_PAY31 IS NOT NULL THEN
            v_PAY32.pay32_pay_cd    := v_PAY31.pay31_pay_cd;
            v_PAY32.pay32_pay_div   := v_PAY31.pay31_pay_div;
        ELSE
            IF p_insure_cd IN ('2','3') THEN
                v_PAY32.pay32_pay_cd    := v_PAY30.pay30_hi_div_pay_cd;
                v_PAY32.pay32_pay_div   := v_PAY30.pay30_hi_max_div;
            ELSE
                v_PAY32.pay32_pay_cd    := v_PAY30.pay30_ei_div_pay_cd;
                v_PAY32.pay32_pay_div   := v_PAY30.pay30_ei_max_div;
            END IF;
        END IF;
        ---------------------------------------------------------------------------------
        v_errMsg := v_fixMsg||'이후 납부내역 재생성 실패';
        INSERT INTO pay32_insure_pay VALUES (v_PAY32.*);

    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN v_PAY_AMT;
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_errMsg ;
        RETURN 0;
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN 0;
END;
$function$
```
