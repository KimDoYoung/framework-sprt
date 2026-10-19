# f_calc_4insure_retire

## FUNCTION public.f_calc_4insure_retire(p_person_id numeric, p_per_year_yn character varying, p_proc_type character varying)

- 반환: `character varying`
- 줄 수: 425

```sql
CREATE OR REPLACE FUNCTION public.f_calc_4insure_retire(p_person_id numeric, p_per_year_yn character varying, p_proc_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY10             pay10_month%ROWTYPE;
    v_PAY11             pay11_month_item%ROWTYPE;
    v_PAY12             pay12_retire_insure%ROWTYPE;

    v_EMP               RECORD;
    c_TERM              RECORD;
    c_HI                RECORD;
    c_ADJ               RECORD;

    v_WORK_START_DATE   DATE;
    v_WORK_CLOSE_DATE   DATE;
    v_TERM_CLOSE_DATE   DATE;

    v_LOOP_CNT          NUMERIC;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        4대보험 퇴직정산내역 생성
    ************************************************************************************/

    -- 퇴직정산내역 가져오기
    v_errMsg := '퇴직정산내역 가져오기 실패 ['||p_person_id||']';
    SELECT *
      INTO v_PAY10
      FROM pay10_month
     WHERE pay10_person_id  = p_person_id
       AND pay10_pay_cd     = '03'  --(03:퇴직정산)
     ORDER BY pay10_date DESC
     LIMIT 1;

    IF v_PAY10 IS NULL THEN
        v_errMsg := '퇴직정산내역이 존재하지 않습니다. 급여관리에서 지급구분을 "퇴직정산"으로 생성한 후 진행하세요';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 기생성내역 삭제
    -------------------------------------------------------------------------------------
    v_errMsg := '퇴직정산내역 삭제 실패(1) ['||v_PAY10.pay10_month_id||']';
    DELETE
      FROM pay11_month_item
     WHERE pay11_month_id = v_PAY10.pay10_month_id
       AND pay11_item_cd IN ('222','232','242') ; --(222:건강보험(퇴직정산) / 232:장기요양(퇴직정산) / 242:고용보험(퇴직정산))

    v_errMsg := '퇴직정산내역 삭제 실패(2) ['||v_PAY10.pay10_month_id||']';
    DELETE
      FROM pay12_retire_insure
     WHERE pay12_month_id = v_PAY10.pay10_month_id;

    -------------------------------------------------------------------------------------
    -- 퇴직정산내역 생성
    -------------------------------------------------------------------------------------
    IF p_proc_type = 'P' THEN
        ---------------------------------------------------------------------------------
        -- 사원정보
        v_errMsg := '사원정보 가져오기 실패 ['||v_PAY10.pay10_person_id||']';
        SELECT *
             , CAST(f_get_empTrans(v_PAY10.pay10_person_id, '9999-12-31'::date, 'retire_date') AS DATE) emp01_retire_date
          INTO v_EMP
          FROM emp01_person
         WHERE emp01_person_id = v_PAY10.pay10_person_id ;

        IF v_EMP.emp01_retire_date IS NULL THEN
            v_errMsg := '퇴직자가 아닙니다(지급일 기준)';
            RAISE USING ERRCODE = '90001';
        END IF;

        ---------------------------------------------------------------------------------
        IF p_per_year_yn = 'true' THEN -- 전년도분 생성
            v_LOOP_CNT := 2;
        ELSE
            v_LOOP_CNT := 1;
        END IF;

        ---------------------------------------------------------------------------------
        FOR i IN 1..v_LOOP_CNT LOOP

            RAISE NOTICE '-------------------------- i : % --------------------------', i;

            IF i = 1 AND p_per_year_yn = 'true' THEN
                v_WORK_START_DATE := DATE_TRUNC('year', v_EMP.emp01_retire_date + INTERVAL '-1year');
                v_WORK_CLOSE_DATE := CAST(TO_CHAR(v_WORK_START_DATE,'YYYY')||'-12-31' AS DATE);
            ELSE
                v_WORK_START_DATE := DATE_TRUNC('year', v_EMP.emp01_retire_date);
                v_WORK_CLOSE_DATE := v_EMP.emp01_retire_date;
            END IF;

            -- 입사일 체크
            IF v_EMP.emp01_hire_date > v_WORK_START_DATE THEN
                v_WORK_START_DATE := v_EMP.emp01_hire_date;
            END IF;

            RAISE NOTICE '근무기간   : % ~ %', v_WORK_START_DATE, v_WORK_CLOSE_DATE;

            -----------------------------------------------------------------------------
            -- 건강보험
            -----------------------------------------------------------------------------
            v_TERM_CLOSE_DATE := v_WORK_CLOSE_DATE;

            v_errMsg := '건강보험 퇴직정산시 보험료율 적용구간별 정산구간 생성 실패['||v_EMP.emp01_company_id||']['||v_WORK_START_DATE||']['||v_WORK_CLOSE_DATE||']';
            FOR c_TERM IN (  SELECT MIN(sys12_day::date)              start_date
                                  , f_get_rate('21',sys12_day::date)  rate
                               FROM sys12_calendar
                              WHERE sys12_company_id = v_EMP.emp01_company_id
                                AND sys12_day        = DATE_TRUNC('month', sys12_day)
                                AND sys12_day  BETWEEN DATE_TRUNC('month', v_WORK_START_DATE) AND v_WORK_CLOSE_DATE
                              GROUP BY rate
                              ORDER BY start_date DESC
            ) LOOP
                -------------------------------------------------------------------------
                RAISE NOTICE '----- 건강보험료 보험료율 적용구간별 정산구간 생성-------[%]~[%]', c_TERM.start_date, v_TERM_CLOSE_DATE;
                -------------------------------------------------------------------------
                v_PAY12 := NULL;
                -------------------------------------------------------------------------
                v_PAY12.pay12_retire_insure_id  := f_create_seq()                                               ;
                v_PAY12.pay12_month_id          := v_PAY10.pay10_month_id                                       ;
                v_PAY12.pay12_insure_cd         := '2'                                                          ; --(2:건강보험)
                v_PAY12.pay12_year              := TO_CHAR(c_TERM.start_date,'YYYY')                            ;
                v_PAY12.pay12_work_month_cnt    := f_get_datedif(c_TERM.start_date, v_TERM_CLOSE_DATE, 'M') + 1 ;
                v_PAY12.pay12_insure_rate       := c_TERM.rate * 100.0                                          ;

                -------------------------------------------------------------------------
                v_PAY12.pay12_apply_term        := TO_CHAR(c_TERM.start_date,'YYYY-MM-DD')||' ~ '||
                                                   TO_CHAR(v_TERM_CLOSE_DATE,'YYYY-MM-DD');
                -------------------------------------------------------------------------
                -- 정산월수 / 납부보험료
                v_errMsg := '건강보험 퇴직정산시 정산월수 계산실패['||c_TERM.start_date||']['||v_TERM_CLOSE_DATE||']';
                SELECT f_get_datedif(MIN(pay10_date), MAX(pay10_date), 'M') + 1
                     , COALESCE(SUM(pay11_item_amt),0)
                  INTO v_PAY12.pay12_pay_month_cnt 
                     , v_PAY12.pay12_pay_amt
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                 WHERE pay10_person_id = p_person_id
                   AND pay10_date BETWEEN c_TERM.start_date AND v_TERM_CLOSE_DATE
                   AND pay11_item_cd   = '220' --(220:건강보험)
                   AND pay11_item_amt != 0;
                -------------------------------------------------------------------------
                -- 보수총액
                v_errMsg := '건강보험 퇴직정산시 보수총액 가져오기 실패 ['||p_person_id||']['||c_TERM.start_date||']['||v_TERM_CLOSE_DATE||']';
                SELECT SUM(pay11_item_amt)
                  INTO v_PAY12.pay12_total_pay
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                       INNER JOIN pay20_item       ON pay20_item_cd  = pay11_item_cd
                 WHERE pay10_person_id = p_person_id
                   AND pay10_date BETWEEN c_TERM.start_date AND v_TERM_CLOSE_DATE
                   AND pay20_item_type    = '1'     --(1:급여지급항목)
                   AND pay20_non_tax_type = '1' ;   --(1:과세)
                -------------------------------------------------------------------------
                v_PAY12.pay12_month_pay         := TRUNC(v_PAY12.pay12_total_pay / v_PAY12.pay12_work_month_cnt)    ; -- 보수월액(=보수총액 / 근무월수)
                v_PAY12.pay12_month_amt         := TRUNC(v_PAY12.pay12_month_pay * c_TERM.rate, -1)                 ; -- 월보험료(=보수월액 * 보험료율)
                v_PAY12.pay12_fix_amt           := v_PAY12.pay12_month_amt * v_PAY12.pay12_pay_month_cnt            ; -- 확정보험료(=월보험료 * 정산월수)
                -------------------------------------------------------------------------
                -- 전년도 미정산보험료
                IF v_WORK_CLOSE_DATE = v_TERM_CLOSE_DATE THEN -- 마지막구간에 미정산보험료 넣기
                    IF i = 1 THEN
                        v_errMsg := '건강보험 퇴직정산시 전년도 미정산보험료 가져오기 실패(1) ['||p_person_id||']['||c_TERM.start_date||']';
                        SELECT COALESCE(pay32_rem_amt,0)
                          INTO v_PAY12.pay12_unpay_amt
                          FROM pay32_insure_pay
                         WHERE pay32_person_id  = p_person_id
                           AND pay32_year       = TO_CHAR(c_TERM.start_date + INTERVAL '-1year', 'YYYY')
                           AND pay32_insure_cd  = '2'
                         ORDER BY pay32_date DESC
                         LIMIT 1;
                    ELSE
                        v_errMsg := '건강보험 퇴직정산시 전년도 미정산보험료 가져오기 실패(2) ['||v_PAY10.pay10_month_id||']['||c_TERM.start_date||']';
                        SELECT SUM(pay12_settle_amt)
                          INTO v_PAY12.pay12_unpay_amt
                          FROM pay12_retire_insure
                         WHERE pay12_month_id    = v_PAY10.pay10_month_id
                           AND pay12_year        = TO_CHAR(c_TERM.start_date + INTERVAL '-1year','YYYY')
                           AND pay12_insure_cd   = '2' ;
                    END IF;

                    IF v_PAY12.pay12_unpay_amt IS NULL THEN
                        v_PAY12.pay12_unpay_amt := 0 ;
                    END IF;
                ELSE
                    v_PAY12.pay12_unpay_amt := 0;
                END IF;
                -------------------------------------------------------------------------
                -- 정산보험료(= 확정보험료 - 납부보험료 + 전년도 미정산보험료)
                v_PAY12.pay12_settle_amt := v_PAY12.pay12_fix_amt
                                          - v_PAY12.pay12_pay_amt
                                          + v_PAY12.pay12_unpay_amt ;
                -------------------------------------------------------------------------
                v_errMsg := '건강보험 퇴직정산내역 생성실패';
                INSERT INTO pay12_retire_insure VALUES (v_PAY12.*);
                -------------------------------------------------------------------------
                v_TERM_CLOSE_DATE := CAST(c_TERM.start_date + INTERVAL '-1day' AS DATE);

            END LOOP;

            -----------------------------------------------------------------------------
            -- 장기요양보험
            -----------------------------------------------------------------------------
            v_errMsg := '건강보험 퇴직정산내역 가져오기 실패';
            FOR c_HI IN ( SELECT *
                               , f_get_rate('22',CAST(SUBSTR(pay12_apply_term, 1,10) AS DATE)) ltc_rate
                            FROM pay12_retire_insure
                           WHERE pay12_month_id   = v_PAY10.pay10_month_id
                             AND pay12_insure_cd  = '2'   --(2:건강보험)
                             AND pay12_year       = TO_CHAR(v_WORK_CLOSE_DATE,'YYYY')
                           ORDER BY pay12_apply_term
            ) LOOP
                RAISE NOTICE '----- 장기요양보험 생성 IN ----------[%]', c_HI.pay12_apply_term;
                -------------------------------------------------------------------------
                v_PAY12 := NULL;
                -------------------------------------------------------------------------
                v_PAY12.pay12_retire_insure_id  := f_create_seq()                                           ;
                v_PAY12.pay12_month_id          := c_HI.pay12_month_id                                      ;
                v_PAY12.pay12_insure_cd         := '3'                                                      ; --(3:장기요양보험)
                v_PAY12.pay12_year              := c_HI.pay12_year                                          ;
                v_PAY12.pay12_apply_term        := c_HI.pay12_apply_term                                    ;
                v_PAY12.pay12_work_month_cnt    := c_HI.pay12_work_month_cnt                                ;
                v_PAY12.pay12_pay_month_cnt     := c_HI.pay12_pay_month_cnt                                 ;
                v_PAY12.pay12_total_pay         := c_HI.pay12_total_pay                                     ;
                v_PAY12.pay12_month_pay         := c_HI.pay12_month_amt                                     ;
                v_PAY12.pay12_insure_rate       := c_HI.ltc_rate * 100.0                                    ;
                v_PAY12.pay12_month_amt         := TRUNC(c_HI.pay12_month_amt * c_HI.ltc_rate, -1)          ; -- 월보험료 = 월건강보험료 * 보험료율
                v_PAY12.pay12_fix_amt           := v_PAY12.pay12_month_amt * v_PAY12.pay12_pay_month_cnt    ; -- 확정보험료 = 월보험료 * 정산월수
                -------------------------------------------------------------------------
                -- 납부보험료
                v_errMsg := '장기요양보험 납부보험료 가져오기 실패';
                SELECT COALESCE(SUM(pay11_item_amt),0)
                  INTO v_PAY12.pay12_pay_amt
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                 WHERE pay10_person_id = p_person_id
                   AND pay10_date BETWEEN CAST(SUBSTR(c_HI.pay12_apply_term, 1,10) AS DATE)
                                      AND CAST(SUBSTR(c_HI.pay12_apply_term,14,10) AS DATE)
                   AND pay11_item_cd   = '230' --(230:장기요양보험)
                   AND pay11_item_amt != 0;
                -------------------------------------------------------------------------
                -- 전년도 미정산보험료
                IF v_WORK_CLOSE_DATE = CAST(SUBSTR(c_HI.pay12_apply_term,14,10) AS DATE) THEN -- 마지막구간에 미정산보험료 넣기
                    IF i = 1 THEN
                        v_errMsg := '장기요양보험 퇴직정산시 전년도 미정산보험료 가져오기 실패(1) ['||p_person_id||']['||c_HI.pay12_apply_term||']';
                        SELECT COALESCE(pay32_rem_amt,0)
                          INTO v_PAY12.pay12_unpay_amt
                          FROM pay32_insure_pay
                         WHERE pay32_person_id  = p_person_id
                           AND pay32_year       = CAST(SUBSTR(c_HI.pay12_apply_term,1,4)::INT -1 AS VARCHAR)
                           AND pay32_insure_cd  = '3'
                         ORDER BY pay32_date DESC
                         LIMIT 1;
                    ELSE
                        v_errMsg := '장기요양보험 퇴직정산시 전년도 미정산보험료 가져오기 실패(2) ['||v_PAY10.pay10_month_id||']['||c_HI.pay12_apply_term||']';
                        SELECT SUM(pay12_settle_amt)
                          INTO v_PAY12.pay12_unpay_amt
                          FROM pay12_retire_insure
                         WHERE pay12_month_id    = v_PAY10.pay10_month_id
                           AND pay12_year        = CAST(SUBSTR(c_HI.pay12_apply_term,1,4)::INT -1 AS VARCHAR)
                           AND pay12_insure_cd   = '3' ;
                    END IF;

                    IF v_PAY12.pay12_unpay_amt IS NULL THEN
                        v_PAY12.pay12_unpay_amt := 0 ;
                    END IF;
                ELSE
                    v_PAY12.pay12_unpay_amt := 0;
                END IF;
                -------------------------------------------------------------------------
                -- 정산보험료(= 확정보험료 - 납부보험료 + 전년도 미정산보험료)
                v_PAY12.pay12_settle_amt := v_PAY12.pay12_fix_amt
                                          - v_PAY12.pay12_pay_amt
                                          + v_PAY12.pay12_unpay_amt ;
                -----------------------------------------------------------------------------
                v_errMsg := '장기요양보험 퇴직정산내역 생성실패';
                INSERT INTO pay12_retire_insure VALUES (v_PAY12.*);

            END LOOP;

            -----------------------------------------------------------------------------
            -- 고용보험
            -----------------------------------------------------------------------------
            v_TERM_CLOSE_DATE := v_WORK_CLOSE_DATE;

            v_errMsg := '고용보험 퇴직정산시 보험료율 적용구간별 정산구간 생성 실패['||v_EMP.emp01_company_id||']['||v_WORK_START_DATE||']['||v_WORK_CLOSE_DATE||']';
            FOR c_TERM IN (  SELECT MIN(sys12_day::date)              start_date
                                  , f_get_rate('23',sys12_day::date)  rate
                               FROM sys12_calendar
                              WHERE sys12_company_id = v_EMP.emp01_company_id
                                AND sys12_day        = DATE_TRUNC('month', sys12_day)
                                AND sys12_day  BETWEEN DATE_TRUNC('month', v_WORK_START_DATE) AND v_WORK_CLOSE_DATE
                              GROUP BY rate
                              ORDER BY start_date DESC
            ) LOOP
                -------------------------------------------------------------------------
                RAISE NOTICE '----- 고용보험료 보험료율 적용구간별 정산구간 생성-------[%]~[%]', c_TERM.start_date, v_TERM_CLOSE_DATE;
                -------------------------------------------------------------------------
                v_PAY12 := NULL;
                -------------------------------------------------------------------------
                v_PAY12.pay12_retire_insure_id  := f_create_seq()                                               ;
                v_PAY12.pay12_month_id          := v_PAY10.pay10_month_id                                       ;
                v_PAY12.pay12_insure_cd         := '4'                                                          ; --(4:고용보험)
                v_PAY12.pay12_year              := TO_CHAR(c_TERM.start_date,'YYYY')                            ;
                v_PAY12.pay12_work_month_cnt    := f_get_datedif(c_TERM.start_date, v_TERM_CLOSE_DATE, 'M') + 1 ;
                v_PAY12.pay12_insure_rate       := c_TERM.rate * 100.0                                          ;

                -------------------------------------------------------------------------
                v_PAY12.pay12_apply_term        := TO_CHAR(c_TERM.start_date,'YYYY-MM-DD')||' ~ '||
                                                   TO_CHAR(v_TERM_CLOSE_DATE,'YYYY-MM-DD');
                -------------------------------------------------------------------------
                -- 정산월수 / 납부보험료
                v_errMsg := '고용보험 퇴직정산시 정산월수 계산실패['||c_TERM.start_date||']['||v_TERM_CLOSE_DATE||']';
                SELECT f_get_datedif(MIN(pay10_date), MAX(pay10_date), 'M') + 1
                     , COALESCE(SUM(pay11_item_amt),0)
                  INTO v_PAY12.pay12_pay_month_cnt 
                     , v_PAY12.pay12_pay_amt
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                 WHERE pay10_person_id = p_person_id
                   AND pay10_date BETWEEN c_TERM.start_date AND v_TERM_CLOSE_DATE
                   AND pay11_item_cd   = '240' --(240:고용보험)
                   AND pay11_item_amt != 0;
                -------------------------------------------------------------------------
                -- 보수총액
                v_errMsg := '고용보험 퇴직정산시 보수총액 가져오기 실패['||c_TERM.start_date||']['||v_TERM_CLOSE_DATE||']';
                SELECT SUM(pay11_item_amt)
                  INTO v_PAY12.pay12_total_pay
                  FROM pay10_month
                       INNER JOIN pay11_month_item ON pay11_month_id = pay10_month_id
                       INNER JOIN pay20_item       ON pay20_item_cd  = pay11_item_cd
                 WHERE pay10_person_id = p_person_id
                   AND pay10_date BETWEEN c_TERM.start_date AND v_TERM_CLOSE_DATE
                   AND pay20_item_type    = '1'     --(1:급여지급항목)
                   AND pay20_non_tax_type = '1' ;   --(1:과세)
                -------------------------------------------------------------------------
                v_PAY12.pay12_month_pay         := TRUNC(v_PAY12.pay12_total_pay / v_PAY12.pay12_work_month_cnt)    ; -- 보수월액(=보수총액 / 근무월수)
                v_PAY12.pay12_month_amt         := NULL                                                             ; -- 월보험료(해당없음)
                v_PAY12.pay12_fix_amt           := TRUNC(v_PAY12.pay12_total_pay * c_TERM.rate, -1)                 ; -- 확정보험료(=보수총액 * 보험료율)
                -------------------------------------------------------------------------
                -- 전년도 미정산보험료
                IF v_WORK_CLOSE_DATE = v_TERM_CLOSE_DATE THEN -- 마지막구간에 미정산보험료 넣기
                    IF i = 1 THEN
                        v_errMsg := '고용보험 퇴직정산시 전년도 미정산보험료 가져오기 실패(1) ['||p_person_id||']['||c_TERM.start_date||']';
                        SELECT COALESCE(pay32_rem_amt,0)
                          INTO v_PAY12.pay12_unpay_amt
                          FROM pay32_insure_pay
                         WHERE pay32_person_id  = p_person_id
                           AND pay32_year       = TO_CHAR(c_TERM.start_date + INTERVAL '-1year', 'YYYY')
                           AND pay32_insure_cd  = '4'
                         ORDER BY pay32_date DESC
                         LIMIT 1;
                    ELSE
                        v_errMsg := '고용보험 퇴직정산시 전년도 미정산보험료 가져오기 실패(2) ['||v_PAY10.pay10_month_id||']['||c_TERM.start_date||']';
                        SELECT SUM(pay12_settle_amt)
                          INTO v_PAY12.pay12_unpay_amt
                          FROM pay12_retire_insure
                         WHERE pay12_month_id    = v_PAY10.pay10_month_id
                           AND pay12_year        = TO_CHAR(c_TERM.start_date + INTERVAL '-1year','YYYY')
                           AND pay12_insure_cd   = '4' ;
                    END IF;

                    IF v_PAY12.pay12_unpay_amt IS NULL THEN
                        v_PAY12.pay12_unpay_amt := 0 ;
                    END IF;
                ELSE
                    v_PAY12.pay12_unpay_amt := 0;
                END IF;
                -------------------------------------------------------------------------
                -- 정산보험료(= 확정보험료 - 납부보험료 + 전년도 미정산보험료)
                v_PAY12.pay12_settle_amt := v_PAY12.pay12_fix_amt
                                          - v_PAY12.pay12_pay_amt
                                          + v_PAY12.pay12_unpay_amt ;
                -------------------------------------------------------------------------
                v_errMsg := '고용보험 퇴직정산내역 생성실패';
                INSERT INTO pay12_retire_insure VALUES (v_PAY12.*);
                -------------------------------------------------------------------------
                v_TERM_CLOSE_DATE := CAST(c_TERM.start_date + INTERVAL '-1day' AS DATE);

            END LOOP;
        END LOOP;

        ---------------------------------------------------------------------------------
        -- 퇴직정산 항목상세 생성
        v_errMsg := '퇴직정산 항목상세 생성실패 ['||v_PAY10.pay10_month_id||']['||v_PAY10.pay10_date||']';
        FOR c_ADJ IN ( SELECT CASE WHEN pay12_insure_cd = '2' THEN '222'    --(222:건강보험(퇴직정산))
                                   WHEN pay12_insure_cd = '3' THEN '232'    --(232:장기요양(퇴직정산))
                                   WHEN pay12_insure_cd = '4' THEN '242'    --(242:고용보험(퇴직정산))
                              END item_cd
                            , SUM(pay12_settle_amt) item_amt
                         FROM pay12_retire_insure
                        WHERE pay12_month_id = v_PAY10.pay10_month_id
                          AND pay12_year     = TO_CHAR(v_PAY10.pay10_date,'YYYY')
                        GROUP BY pay12_insure_cd
        ) LOOP
            -----------------------------------------------------------------------------
            v_PAY11 := NULL;
            -----------------------------------------------------------------------------
            v_PAY11.pay11_month_item_id := f_create_seq()           ;
            v_PAY11.pay11_month_id      := v_PAY10.pay10_month_id   ;
            v_PAY11.pay11_item_type     := '2'                      ;
            v_PAY11.pay11_item_cd       := c_ADJ.item_cd            ;
            v_PAY11.pay11_item_amt      := c_ADJ.item_amt           ;
            -----------------------------------------------------------------------------
            v_errMsg := '퇴직정산 항목상세 생성실패(INSERT)';
            INSERT INTO pay11_month_item VALUES (v_PAY11.*);
        END LOOP;
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
