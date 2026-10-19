# f_calc_4insure_adjust

## FUNCTION public.f_calc_4insure_adjust(p_person_id numeric, p_std_year character varying, p_insure_cd character varying)

- 반환: `character varying`
- 줄 수: 577

```sql
CREATE OR REPLACE FUNCTION public.f_calc_4insure_adjust(p_person_id numeric, p_std_year character varying, p_insure_cd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY32             pay32_insure_pay%ROWTYPE;
    v_PAY33             pay33_insure_adjust%ROWTYPE;
    v_PAY30             pay30_basic_setup%ROWTYPE;

    v_EMP               RECORD;
    c_TERM              RECORD;
    c_PAY33             RECORD;
    c_HI                RECORD;

    v_STD_DATE          DATE;
    v_WORK_START_DATE   DATE;
    v_WORK_CLOSE_DATE   DATE;
    v_TERM_CLOSE_DATE   DATE;

    v_YEAR_AMT          NUMERIC;
    v_YEAR_AMT1         NUMERIC;
    v_YEAR_AMT2         NUMERIC;
    v_YEAR_AMT3         NUMERIC;
    v_CHECK_YEAR_AMT    NUMERIC;
    v_WORK_MONTHS       NUMERIC;
    v_ADJUST_MONTHS     NUMERIC;

    v_errMsg            VARCHAR(100);
    v_fixMsg            VARCHAR(50);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        [보수총액 신고 후 호출하는 Function]
        4대보험 정산금액을 산출하여 납부기초데이터를 생성한다 (PAY32)
    ************************************************************************************/

    IF p_insure_cd = '2' THEN
        v_fixMsg := '건강보험 정산금액 산출시 ';
    ELSE
        v_fixMsg := '고용보험 정산금액 산출시 ';
    END IF;

    -- 기정산내역 제거
    v_errMsg := v_fixMsg||'기존 정산내역 정리 실패(PAY33) ['||p_person_id||']['||p_std_year||']['||p_insure_cd||']';
    DELETE
      FROM pay33_insure_adjust
     WHERE pay33_person_id      = p_person_id
       AND pay33_year           = p_std_year
       AND ( ( p_insure_cd      = '2'           AND
               pay33_insure_cd  IN ('2','3')    ) OR
             ( p_insure_cd     != '2'           AND
               pay33_insure_cd  = p_insure_cd   ) );

    v_errMsg := v_fixMsg||'기존 정산내역 정리 실패(PAY32) ['||p_person_id||']['||p_std_year||']['||p_insure_cd||']';
    DELETE
      FROM pay32_insure_pay
     WHERE pay32_person_id      = p_person_id
       AND pay32_year           = p_std_year
       AND ( ( p_insure_cd      = '2'           AND
               pay32_insure_cd  IN ('2','3')    ) OR
             ( p_insure_cd     != '2'           AND
               pay32_insure_cd  = p_insure_cd   ) );

    -------------------------------------------------------------------------------------
    -- 사원정보 가져오기
    v_errMsg := v_fixMsg||'사원정보 가져오기 실패['||p_person_id||']';
    SELECT *
      INTO v_EMP
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;

    -------------------------------------------------------------------------------------
    -- 납부정보 가져오기
    v_errMsg := v_fixMsg||'납부정보 가져오기 실패['||v_EMP.emp01_company_id||']';
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

    -------------------------------------------------------------------------------------
    -- 기준일자 SET : 연말정산인 경우 기준년도 다음해의 4월 1일
    --                퇴직정산인 경우 퇴사일
    -------------------------------------------------------------------------------------
    v_errMsg := v_fixMsg||'4대보험 정산 기준일자 설정 실패 ['||p_person_id||']['||p_std_year||']';

    v_STD_DATE        := CAST(p_std_year||'-04-01' AS DATE) + INTERVAL '+1year';
    v_WORK_START_DATE := CAST(p_std_year||'-01-01' AS DATE);
    v_WORK_CLOSE_DATE := CAST(p_std_year||'-12-31' AS DATE);

    -- 입사일 체크
    IF v_EMP.emp01_hire_date > v_WORK_START_DATE THEN
        v_WORK_START_DATE := v_EMP.emp01_hire_date;
    END IF;

    -- 근무개월수
    v_WORK_MONTHS := f_get_datedif(v_WORK_START_DATE, v_WORK_CLOSE_DATE, 'M') + 1;

    RAISE NOTICE '근무시작일(v_WORK_START_DATE) : %', v_WORK_START_DATE;
    RAISE NOTICE '근무종료일(v_WORK_CLOSE_DATE) : %', v_WORK_CLOSE_DATE;
    RAISE NOTICE '근무개월수(v_WORK_MONTHS)     : %', v_WORK_MONTHS;

    --===================================================================================
    --
    -- 건강보험 정산
    --
    --===================================================================================
    IF p_insure_cd = '2' THEN
        ---------------------------------------------------------------------------------
        -- 기준년도의 보수총액 GET
        v_errMsg := '건강보험 연말정산 보수총액 가져오기 실패';
        SELECT pay31_pre_year_pay1
          INTO v_YEAR_AMT
          FROM pay31_insure_apply
         WHERE pay31_person_id          = p_person_id
           AND pay31_insure_cd          = '2'   --(2:건강보험)
           AND pay31_insure_apply_cd    = '4'   --(4:보수총액신고)
           AND pay31_apply_date         = v_STD_DATE;

        IF COALESCE(v_YEAR_AMT,0) = 0 THEN
            v_errMsg := '건강보험 보수총액 등록내역이 없습니다';
            RAISE USING ERRCODE = '90001';
        END IF;

        ---------------------------------------------------------------------------------
        -- 보험료율 적용구간별 정산구간 생성
        ---------------------------------------------------------------------------------
        v_PAY33           := NULL;
        v_TERM_CLOSE_DATE := v_WORK_CLOSE_DATE;
        v_CHECK_YEAR_AMT  := v_YEAR_AMT;

        v_errMsg := v_fixMsg||'보험료율 적용구간별 정산구간 생성 실패['||v_EMP.emp01_company_id||']['||v_WORK_START_DATE||']['||v_WORK_CLOSE_DATE||']';
        FOR c_TERM IN (  SELECT MIN(sys12_day::date)              start_date
                              , f_get_rate('21',sys12_day::date)  rate
                           FROM sys12_calendar
                          WHERE sys12_company_id = v_EMP.emp01_company_id
                            AND sys12_day        = DATE_TRUNC('month', sys12_day)
                            AND sys12_day  BETWEEN DATE_TRUNC('month', v_WORK_START_DATE) AND v_WORK_CLOSE_DATE
                          GROUP BY rate
                          ORDER BY start_date DESC
        ) LOOP

            RAISE NOTICE '보험료율 적용구간별 정산구간 생성-------[%]~[%]', c_TERM.start_date, v_TERM_CLOSE_DATE;
            -----------------------------------------------------------------------------
            v_PAY33.pay33_insure_adjust_id  := f_create_seq()           ;
            v_PAY33.pay33_company_id        := v_EMP.emp01_company_id   ;
            v_PAY33.pay33_person_id         := v_EMP.emp01_person_id    ;
            v_PAY33.pay33_insure_cd         := '2'                      ; --(2:건강보험)
            v_PAY33.pay33_year              := p_std_year               ;
            v_PAY33.pay33_start_date        := c_TERM.start_date        ;
            v_PAY33.pay33_close_date        := v_TERM_CLOSE_DATE        ;
            v_PAY33.pay33_insure_rate       := c_TERM.rate * 100.0      ; -- 보험료율
            -----------------------------------------------------------------------------
            -- 근무월수
            v_errMsg := v_fixMsg||'근무월수 계산실패['||v_PAY33.pay33_start_date||']['||v_PAY33.pay33_close_date||']';
            v_PAY33.pay33_work_month_cnt := f_get_datedif(v_PAY33.pay33_start_date, v_PAY33.pay33_close_date, 'M') + 1;
            -----------------------------------------------------------------------------
            -- 정산월수 / 납부보험료
            v_errMsg := v_fixMsg||'정산월수 계산실패['||v_PAY33.pay33_start_date||']['||v_PAY33.pay33_close_date||']';
            SELECT f_get_datedif(MIN(pay10_date), MAX(pay10_date), 'M') + 1
                 , COALESCE(SUM(pay11_item_amt),0)
              INTO v_PAY33.pay33_pay_month_cnt
                 , v_PAY33.pay33_pay_amt
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id = p_person_id
               AND pay10_date BETWEEN v_PAY33.pay33_start_date AND v_PAY33.pay33_close_date
               AND pay11_item_cd   = '220' --(220:건강보험)
               AND pay11_item_amt != 0;
            -----------------------------------------------------------------------------
            -- 보수총액
            v_errMsg := v_fixMsg||'보수총액 계산실패['||v_YEAR_AMT||']['||v_PAY33.pay33_work_month_cnt||']['||v_WORK_MONTHS||']';
            v_PAY33.pay33_total_pay := TRUNC(v_YEAR_AMT * v_PAY33.pay33_work_month_cnt / v_WORK_MONTHS) ; -- 보수총액

            RAISE NOTICE ' - 근무월수   : %', v_PAY33.pay33_work_month_cnt;
            RAISE NOTICE ' - 정산월수   : %', v_PAY33.pay33_pay_month_cnt;
            RAISE NOTICE ' - 납부보험료 : %', v_PAY33.pay33_pay_amt;
            RAISE NOTICE ' - 보수총액   : %', v_PAY33.pay33_total_pay;

            -----------------------------------------------------------------------------
            v_errMsg := '건강보험 연말정산금액 계산내역 생성실패';
            INSERT INTO pay33_insure_adjust VALUES (v_PAY33.*);
            -----------------------------------------------------------------------------
            v_CHECK_YEAR_AMT  := v_CHECK_YEAR_AMT - v_PAY33.pay33_total_pay;
            v_TERM_CLOSE_DATE := CAST(c_TERM.start_date + INTERVAL '-1day' AS DATE);

        END LOOP;
        RAISE NOTICE ' ---- out ---------------[v_CHECK_YEAR_AMT:%]', v_CHECK_YEAR_AMT;
        ---------------------------------------------------------------------------------
        IF v_CHECK_YEAR_AMT != 0 THEN
            v_errMsg := v_fixMsg||'보수총액 잔액 정리실패['||v_CHECK_YEAR_AMT||']';
            UPDATE pay33_insure_adjust
               SET pay33_total_pay = pay33_total_pay + v_CHECK_YEAR_AMT
             WHERE pay33_person_id  = p_person_id
               AND pay33_year       = p_std_year
               AND pay33_insure_cd  = '2'   --(2:건강보험)
               AND pay33_close_date = v_WORK_CLOSE_DATE;
        END IF;

        ---------------------------------------------------------------------------------
        -- 정산구간별 정산금액 계산
        v_errMsg := v_fixMsg||'정산구간별 정산금액 계산 실패['||p_person_id||']['||p_std_year||']';
        FOR c_PAY33 IN ( SELECT *
                          FROM pay33_insure_adjust
                         WHERE pay33_person_id  = p_person_id
                           AND pay33_year       = p_std_year
                           AND pay33_insure_cd  = '2'   --(2:건강보험)
                         ORDER BY pay33_start_date
        ) LOOP
            ---------------------------------------------------------------------------------
            v_PAY33 := NULL;
            ---------------------------------------------------------------------------------
            v_PAY33.pay33_month_pay     := TRUNC(c_PAY33.pay33_total_pay / c_PAY33.pay33_work_month_cnt)        ; -- 보수월액(=보수총액 / 근무월수)
            v_PAY33.pay33_month_amt     := TRUNC(v_PAY33.pay33_month_pay * c_PAY33.pay33_insure_rate / 100, -1) ; -- 월보험료(=보수월액 * 보험료율)
            v_PAY33.pay33_fix_amt       := v_PAY33.pay33_month_amt * c_PAY33.pay33_pay_month_cnt                ; -- 확정보험료(=월보험료 * 정산월수)
            v_PAY33.pay33_adjust_amt    := v_PAY33.pay33_fix_amt - c_PAY33.pay33_pay_amt                        ; -- 정산보험료(=확정보험료 - 납부보험료)
            ---------------------------------------------------------------------------------
            UPDATE pay33_insure_adjust
               SET pay33_month_pay  = v_PAY33.pay33_month_pay 
                 , pay33_month_amt  = v_PAY33.pay33_month_amt 
                 , pay33_fix_amt    = v_PAY33.pay33_fix_amt   
                 , pay33_adjust_amt = v_PAY33.pay33_adjust_amt
             WHERE pay33_insure_adjust_id = c_PAY33.pay33_insure_adjust_id;
        END LOOP;

        ---------------------------------------------------------------------------------
        -- 건강보험 정산금액 납부정보 생성
        ---------------------------------------------------------------------------------
        v_errMsg := '건강보험 정산금액 납부정보 생성실패';
        ---------------------------------------------------------------------------------
        v_PAY32 := NULL;
        ---------------------------------------------------------------------------------
        v_PAY32.pay32_insure_pay_id := f_create_seq()               ;
        v_PAY32.pay32_company_id    := v_EMP.emp01_company_id       ;
        v_PAY32.pay32_person_id     := v_EMP.emp01_person_id        ;
        v_PAY32.pay32_year          := p_std_year                   ;
        v_PAY32.pay32_insure_cd     := '2'                          ; -- 보험구분(2:건강보험)
        v_PAY32.pay32_pay_cd        := v_PAY30.pay30_hi_div_pay_cd  ;
        v_PAY32.pay32_date          := v_STD_DATE                   ;
        v_PAY32.pay32_cnt           := 0                            ; -- 납부회차
        v_PAY32.pay32_amt           := 0                            ; -- 납부금액
        ---------------------------------------------------------------------------------
        -- 납부방법(1:일시납/2:분할납부)
        IF v_PAY32.pay32_pay_cd = '1' THEN
            v_PAY32.pay32_pay_div   := 1                            ;
        ELSE
            v_PAY32.pay32_pay_div   := v_PAY30.pay30_hi_max_div     ;
        END IF;
        ---------------------------------------------------------------------------------
        -- 정산금액
        v_errMsg := '건강보험 정산금액 가져오기 실패';
        SELECT SUM(pay33_adjust_amt)
          INTO v_PAY32.pay32_tgt_amt
          FROM pay33_insure_adjust
         WHERE pay33_person_id  = v_PAY32.pay32_person_id
           AND pay33_insure_cd  = v_PAY32.pay32_insure_cd
           AND pay33_year       = v_PAY32.pay32_year;
        ---------------------------------------------------------------------------------
        v_PAY32.pay32_rem_amt       := v_PAY32.pay32_tgt_amt        ; -- 잔여정산금액
        ---------------------------------------------------------------------------------
        INSERT INTO pay32_insure_pay VALUES (v_PAY32.*);

        ---------------------------------------------------------------------------------
        -- 정산일 이후 납부내역 재생성
        ---------------------------------------------------------------------------------
        v_errMsg := v_fixMsg||'정산일 이후 납부내역 재생성 실패(f_create_4insure_adjust_modi)';
        v_errMsg := f_create_4insure_adjust_modi ( v_PAY32.pay32_person_id
                                                 , v_PAY32.pay32_insure_cd
                                                 , CAST(v_STD_DATE + INTERVAL '+1day' AS DATE)
                                                 );
        IF v_errMsg != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;
    END IF;

    --===================================================================================
    --
    -- 장기요양보험 정산
    --
    --===================================================================================
    IF p_insure_cd IN ('2','3') THEN
        ---------------------------------------------------------------------------------
        v_errMsg := '건강보험 정산내역 가져오기 실패';
        FOR c_HI IN ( SELECT *
                           , f_get_rate('22',pay33_start_date) ltc_rate
                        FROM pay33_insure_adjust
                       WHERE pay33_person_id  = p_person_id
                         AND pay33_year       = p_std_year
                         AND pay33_insure_cd  = '2'   --(2:건강보험)
                       ORDER BY pay33_start_date
        ) LOOP
            RAISE NOTICE '장기요양보험 생성 IN ----------[%]~[%]', c_HI.pay33_start_date, c_HI.pay33_close_date;
            -----------------------------------------------------------------------------
            v_PAY33 := NULL;
            -----------------------------------------------------------------------------
            v_PAY33.pay33_insure_adjust_id  := f_create_seq()                                       ;
            v_PAY33.pay33_company_id        := c_HI.pay33_company_id                                ;
            v_PAY33.pay33_person_id         := c_HI.pay33_person_id                                 ;
            v_PAY33.pay33_insure_cd         := '3'                                                  ; --(3:장기요양보험)
            v_PAY33.pay33_year              := c_HI.pay33_year                                      ;
            v_PAY33.pay33_start_date        := c_HI.pay33_start_date                                ;
            v_PAY33.pay33_close_date        := c_HI.pay33_close_date                                ;
            v_PAY33.pay33_work_month_cnt    := c_HI.pay33_work_month_cnt                            ;
            v_PAY33.pay33_pay_month_cnt     := c_HI.pay33_pay_month_cnt                             ;
            v_PAY33.pay33_total_pay         := c_HI.pay33_total_pay                                 ;
            v_PAY33.pay33_month_pay         := c_HI.pay33_month_amt                                 ;
            v_PAY33.pay33_insure_rate       := c_HI.ltc_rate * 100.0                                ;
            v_PAY33.pay33_month_amt         := TRUNC(c_HI.pay33_month_amt * c_HI.ltc_rate, -1)      ; -- 월보험료 = 월건강보험료 * 보험료율
            v_PAY33.pay33_fix_amt           := v_PAY33.pay33_month_amt * v_PAY33.pay33_pay_month_cnt; -- 확정보험료 = 월보험료 * 정산월수
            -----------------------------------------------------------------------------
            -- 납부보험료
            v_errMsg := '장기요양보험 납부보험료 가져오기 실패['||v_PAY33.pay33_person_id||']['||v_PAY33.pay33_start_date||']['||v_PAY33.pay33_close_date||']';
            SELECT COALESCE(SUM(pay11_item_amt),0)
              INTO v_PAY33.pay33_pay_amt
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id = v_PAY33.pay33_person_id
               AND pay10_date BETWEEN v_PAY33.pay33_start_date AND v_PAY33.pay33_close_date
               AND pay11_item_cd   = '230' --(230:장기요양보험)
               AND pay11_item_amt != 0;        

            RAISE NOTICE ' - 장기요양보험 납부보험료 : %', v_PAY33.pay33_pay_amt;

            -----------------------------------------------------------------------------
            -- 정산보험료(=확정보험료 - 납부보험료)
            v_PAY33.pay33_adjust_amt := v_PAY33.pay33_fix_amt - v_PAY33.pay33_pay_amt ;

            -----------------------------------------------------------------------------
            v_errMsg := '장기요양보험 연말정산금액 계산내역 생성실패';
            INSERT INTO pay33_insure_adjust VALUES (v_PAY33.*);
            RAISE NOTICE ' - 장기요양보험 insert ok!!';

        END LOOP;

        ---------------------------------------------------------------------------------
        -- 장기요양보험 정산금액 납부정보 생성
        ---------------------------------------------------------------------------------
        v_errMsg := '장기요양보험 정산금액 납부정보 생성실패';
        ---------------------------------------------------------------------------------
        v_PAY32 := NULL;
        ---------------------------------------------------------------------------------
        v_PAY32.pay32_insure_pay_id := f_create_seq()               ;
        v_PAY32.pay32_company_id    := v_EMP.emp01_company_id       ;
        v_PAY32.pay32_person_id     := v_EMP.emp01_person_id        ;
        v_PAY32.pay32_year          := p_std_year                   ;
        v_PAY32.pay32_insure_cd     := '3'                          ; -- 보험구분(3:장기요양)
        v_PAY32.pay32_pay_cd        := v_PAY30.pay30_hi_div_pay_cd  ;
        v_PAY32.pay32_date          := v_STD_DATE                   ;
        v_PAY32.pay32_cnt           := 0                            ; -- 납부회차
        v_PAY32.pay32_amt           := 0                            ; -- 납부금액
        ---------------------------------------------------------------------------------
        -- 납부방법(1:일시납/2:분할납부)
        IF v_PAY32.pay32_pay_cd = '1' THEN
            v_PAY32.pay32_pay_div   := 1                            ;
        ELSE
            v_PAY32.pay32_pay_div   := v_PAY30.pay30_hi_max_div     ;
        END IF;
        ---------------------------------------------------------------------------------
        -- 정산금액
        v_errMsg := '요양보험 정산금액 가져오기 실패';
        SELECT SUM(pay33_adjust_amt)
          INTO v_PAY32.pay32_tgt_amt
          FROM pay33_insure_adjust
         WHERE pay33_person_id  = v_PAY32.pay32_person_id
           AND pay33_insure_cd  = v_PAY32.pay32_insure_cd
           AND pay33_year       = v_PAY32.pay32_year;
        ---------------------------------------------------------------------------------
        v_PAY32.pay32_rem_amt       := v_PAY32.pay32_tgt_amt        ; -- 잔여정산금액
        ---------------------------------------------------------------------------------
        INSERT INTO pay32_insure_pay VALUES (v_PAY32.*);

        ---------------------------------------------------------------------------------
        -- 정산일 이후 납부내역 재생성
        ---------------------------------------------------------------------------------
        v_errMsg := '장기요양 정산일 이후 납부내역 재생성 실패(f_create_4insure_adjust_modi)';
        v_errMsg := f_create_4insure_adjust_modi ( v_PAY32.pay32_person_id
                                                 , v_PAY32.pay32_insure_cd
                                                 , CAST(v_STD_DATE + INTERVAL '+1day' AS DATE)
                                                 );
        IF v_errMsg != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;    
    
    END IF;

    --===================================================================================
    --
    -- 고용보험 정산
    --
    --===================================================================================
    IF p_insure_cd = '4' THEN
        ---------------------------------------------------------------------------------
        -- 기준년도의 보수총액 GET
        v_errMsg := '고용보험 연말정산 보수총액 가져오기 실패';
        SELECT pay31_pre_year_pay1
             , pay31_pre_year_pay2
             , pay31_pre_year_pay3
          INTO v_YEAR_AMT1
             , v_YEAR_AMT2
             , v_YEAR_AMT3
          FROM pay31_insure_apply
         WHERE pay31_person_id          = p_person_id
           AND pay31_insure_cd          = '4'   --(4:고용보험)
           AND pay31_insure_apply_cd    = '4'   --(4:보수총액신고)
           AND pay31_apply_date         = v_STD_DATE;

        IF COALESCE(v_YEAR_AMT1,0) = 0 THEN
            v_errMsg := '고용보험 보수총액 등록내역이 없습니다';
            RAISE USING ERRCODE = '90001';
        END IF;

        ---------------------------------------------------------------------------------
        -- 보험료율 적용구간별 정산구간 생성
        ---------------------------------------------------------------------------------
        v_PAY33           := NULL;
        v_TERM_CLOSE_DATE := v_WORK_CLOSE_DATE;

        v_errMsg := '고용보험 보험료율 적용구간별 정산구간 생성 실패['||v_EMP.emp01_company_id||']['||v_WORK_START_DATE||']['||v_WORK_CLOSE_DATE||']';
        FOR c_TERM IN (  SELECT MIN(sys12_day::date)             start_date
                              , f_get_rate('23',sys12_day::date) rate
                              , row_number() over()              cnt
                           FROM sys12_calendar
                          WHERE sys12_company_id = v_EMP.emp01_company_id
                            AND sys12_day        = DATE_TRUNC('month', sys12_day)
                            AND sys12_day  BETWEEN DATE_TRUNC('month', v_WORK_START_DATE) AND v_WORK_CLOSE_DATE
                          GROUP BY rate
                          ORDER BY start_date DESC
        ) LOOP

            RAISE NOTICE '고용보험 보험료율 적용구간별 정산구간 생성------- %) [%]~[%]', c_TERM.cnt, c_TERM.start_date, v_TERM_CLOSE_DATE;
            -----------------------------------------------------------------------------
            v_PAY33.pay33_insure_adjust_id  := f_create_seq()           ;
            v_PAY33.pay33_company_id        := v_EMP.emp01_company_id   ;
            v_PAY33.pay33_person_id         := v_EMP.emp01_person_id    ;
            v_PAY33.pay33_insure_cd         := '4'                      ; --(4:고용보험)
            v_PAY33.pay33_year              := p_std_year               ;
            v_PAY33.pay33_start_date        := c_TERM.start_date        ;
            v_PAY33.pay33_close_date        := v_TERM_CLOSE_DATE        ;
            v_PAY33.pay33_insure_rate       := c_TERM.rate * 100.0      ; -- 보험료율
            -----------------------------------------------------------------------------
            -- 근무월수
            v_errMsg := v_fixMsg||'근무월수 계산실패['||v_PAY33.pay33_start_date||']['||v_PAY33.pay33_close_date||']';
            v_PAY33.pay33_work_month_cnt := f_get_datedif(v_PAY33.pay33_start_date, v_PAY33.pay33_close_date, 'M') + 1;
            -----------------------------------------------------------------------------
            -- 정산월수 / 납부보험료
            v_errMsg := v_fixMsg||'정산월수 계산실패['||v_PAY33.pay33_start_date||']['||v_PAY33.pay33_close_date||']';
            SELECT f_get_datedif(MIN(pay10_date), MAX(pay10_date), 'M') + 1
                 , COALESCE(SUM(pay11_item_amt),0)
              INTO v_PAY33.pay33_pay_month_cnt
                 , v_PAY33.pay33_pay_amt
              FROM pay10_month
                   INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
             WHERE pay10_person_id = p_person_id
               AND pay10_date BETWEEN v_PAY33.pay33_start_date AND v_PAY33.pay33_close_date
               AND pay11_item_cd   = '240' --(240:고용보험)
               AND pay11_item_amt != 0;
            -----------------------------------------------------------------------------
            -- 보수총액
            v_errMsg := v_fixMsg||'보수총액 계산실패['||c_TERM.cnt||']';
            IF c_TERM.cnt = 1 THEN
                v_PAY33.pay33_total_pay := v_YEAR_AMT1;
            ELSIF c_TERM.cnt = 2 THEN
                v_PAY33.pay33_total_pay := v_YEAR_AMT2;
            ELSE
                v_PAY33.pay33_total_pay := v_YEAR_AMT3;
            END IF;

            RAISE NOTICE ' - 근무월수   : %', v_PAY33.pay33_work_month_cnt;
            RAISE NOTICE ' - 정산월수   : %', v_PAY33.pay33_pay_month_cnt;
            RAISE NOTICE ' - 납부보험료 : %', v_PAY33.pay33_pay_amt;
            RAISE NOTICE ' - 보수총액   : %', v_PAY33.pay33_total_pay;

            -----------------------------------------------------------------------------
            v_errMsg := '고용보험 연말정산금액 계산내역 생성실패';
            INSERT INTO pay33_insure_adjust VALUES (v_PAY33.*);
            RAISE NOTICE ' - 고용보험 insert ok!!';
            -----------------------------------------------------------------------------
            v_TERM_CLOSE_DATE := CAST(c_TERM.start_date + INTERVAL '-1day' AS DATE);

        END LOOP;

        ---------------------------------------------------------------------------------
        -- 정산구간별 정산금액 계산
        v_errMsg := v_fixMsg||'정산구간별 정산금액 계산 실패['||p_person_id||']['||p_std_year||']';
        FOR c_PAY33 IN ( SELECT *
                          FROM pay33_insure_adjust
                         WHERE pay33_person_id  = p_person_id
                           AND pay33_year       = p_std_year
                           AND pay33_insure_cd  = '4'   --(4:고용보험)
                         ORDER BY pay33_start_date
        ) LOOP
            -----------------------------------------------------------------------------
            v_PAY33 := NULL;
            -----------------------------------------------------------------------------
            v_PAY33.pay33_fix_amt       := TRUNC(c_PAY33.pay33_total_pay * c_PAY33.pay33_insure_rate / 100, -1) ; -- 확정보험료(=보수총액 * 보험료율)
            v_PAY33.pay33_adjust_amt    := v_PAY33.pay33_fix_amt - c_PAY33.pay33_pay_amt                        ; -- 정산보험료(=확정보험료 - 납부보험료)
            -----------------------------------------------------------------------------
            UPDATE pay33_insure_adjust
               SET pay33_fix_amt    = v_PAY33.pay33_fix_amt   
                 , pay33_adjust_amt = v_PAY33.pay33_adjust_amt
             WHERE pay33_insure_adjust_id = c_PAY33.pay33_insure_adjust_id;
        END LOOP;

        ---------------------------------------------------------------------------------
        -- 고용보험 정산금액 납부정보 생성
        ---------------------------------------------------------------------------------
        v_errMsg := '고용보험 정산금액 납부정보 생성실패';
        ---------------------------------------------------------------------------------
        v_PAY32 := NULL;
        ---------------------------------------------------------------------------------
        v_PAY32.pay32_insure_pay_id := f_create_seq()               ;
        v_PAY32.pay32_company_id    := v_EMP.emp01_company_id       ;
        v_PAY32.pay32_person_id     := v_EMP.emp01_person_id        ;
        v_PAY32.pay32_year          := p_std_year                   ;
        v_PAY32.pay32_insure_cd     := '4'                          ; -- 보험구분(4:고용보험)
        v_PAY32.pay32_pay_cd        := v_PAY30.pay30_ei_div_pay_cd  ;
        v_PAY32.pay32_date          := v_STD_DATE                   ;
        v_PAY32.pay32_cnt           := 0                            ; -- 납부회차
        v_PAY32.pay32_amt           := 0                            ; -- 납부금액
        ---------------------------------------------------------------------------------
        -- 납부방법(1:일시납/2:분할납부)
        IF v_PAY32.pay32_pay_cd = '1' THEN
            v_PAY32.pay32_pay_div   := 1                            ;
        ELSE
            v_PAY32.pay32_pay_div   := v_PAY30.pay30_ei_max_div     ;
        END IF;
        ---------------------------------------------------------------------------------
        -- 정산금액
        v_errMsg := '고용보험 정산금액 가져오기 실패';
        SELECT SUM(pay33_adjust_amt)
          INTO v_PAY32.pay32_tgt_amt
          FROM pay33_insure_adjust
         WHERE pay33_person_id  = v_PAY32.pay32_person_id
           AND pay33_insure_cd  = v_PAY32.pay32_insure_cd
           AND pay33_year       = v_PAY32.pay32_year;
        ---------------------------------------------------------------------------------
        v_PAY32.pay32_rem_amt       := v_PAY32.pay32_tgt_amt        ; -- 잔여정산금액
        ---------------------------------------------------------------------------------
        INSERT INTO pay32_insure_pay VALUES (v_PAY32.*);

        ---------------------------------------------------------------------------------
        -- 정산일 이후 납부내역 재생성
        ---------------------------------------------------------------------------------
        v_errMsg := v_fixMsg||'정산일 이후 납부내역 재생성 실패(f_create_4insure_adjust_modi)';
        v_errMsg := f_create_4insure_adjust_modi ( v_PAY32.pay32_person_id
                                                 , v_PAY32.pay32_insure_cd
                                                 , CAST(v_STD_DATE + INTERVAL '+1day' AS DATE)
                                                 );
        IF v_errMsg != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;

    END IF;
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION
    WHEN SQLSTATE '90001' THEN
        RAISE NOTICE 'EXCEPTION USER ERR!!! - %', v_errMsg ;
        RETURN v_errMsg;
    WHEN OTHERS THEN
        RAISE NOTICE 'EXCEPTION ERR!!! - %(%)', v_errMsg, SQLERRM ;
        RETURN v_errMsg||'-'||SQLERRM;
END;
$function$
```
