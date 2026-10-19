# f_get_floortrcheck

## FUNCTION public.f_get_floortrcheck(p_type character varying, p_company_id numeric, p_person_id numeric, p_stddate date, p_expect_yn boolean)

- 반환: `numeric`
- 줄 수: 462

```sql
CREATE OR REPLACE FUNCTION public.f_get_floortrcheck(p_type character varying, p_company_id numeric, p_person_id numeric, p_stddate date, p_expect_yn boolean)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_FLT01                 flt01_company_std%ROWTYPE;
    v_CHECK_CYCLE           flt02_emp.flt02_check_cycle%TYPE;

    v_YEAR_DATE             DATE; 
    v_MONTH_DATE            DATE;
    v_CHECK_START_DATE      DATE;

    v_MONTH_TR_AMT          NUMERIC;
    v_EXPECT_MONTH_TR_AMT   NUMERIC;
    v_MONTH_AVG_AMT         NUMERIC;
    v_BOOK_SUM              NUMERIC;
    v_STD_BOOK_AMT          NUMERIC;
    v_BOOK_CNT              NUMERIC;

    v_INIT_BOOK_SUM         NUMERIC;
    v_EXPECT_AMT            NUMERIC;
    v_RTN                   NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_RTN           := 0;
    v_EXPECT_AMT    := 0;
    v_INIT_BOOK_SUM := 0;
    v_YEAR_DATE     := CAST(substr(to_char(p_stdDate,'yyyymmdd'),1,4)||'0101' AS DATE);
    v_MONTH_DATE    := CAST(substr(to_char(p_stdDate,'yyyymmdd'),1,6)||'01'   AS DATE);
    -------------------------------------------------------------------------------------
    --기준정보 가져오기
    SELECT *
      INTO v_FLT01
      FROM flt01_company_std
     WHERE flt01_company_id = p_company_id
       AND flt01_start_date = ( SELECT MAX(flt01_start_date)
                                  FROM flt01_company_std
                                 WHERE flt01_company_id  = p_company_id
                                   AND flt01_start_date <= p_stdDate );

    IF v_FLT01.flt01_invest_amt_calc_target_cd IS NULL THEN
        v_FLT01.flt01_invest_amt_calc_target_cd := '1'; --(1:매매금액/2:입출금액)
    END IF;
    -------------------------------------------------------------------------------------
    --보고주기 가져오기 및 사전신고 체크시작일 SET
    SELECT flt02_check_cycle
      INTO v_CHECK_CYCLE
      FROM flt02_emp
     WHERE flt02_company_id  = p_company_id
       AND flt02_person_id   = p_person_id
       AND flt02_start_date <= p_stdDate
     ORDER BY flt02_start_date DESC
     LIMIT 1;

    IF v_CHECK_CYCLE IS NULL THEN
        v_CHECK_CYCLE := '1' ; --(1:분기별/2:월별)
    END IF;

    IF v_CHECK_CYCLE = '1' THEN
        v_CHECK_START_DATE := f_get_quarter_date(p_stdDate,'1') + 1;
    ELSE
        v_CHECK_START_DATE := (date_trunc('month', p_stdDate::date) + INTERVAL '-1month')::date;
    END IF;

    RAISE NOTICE '사전신고 체크시작일 : %', to_char(v_CHECK_START_DATE,'yyyy-mm-dd');

    --===================================================================================
    --
    -- 1 : 연간 투자금액 = 연간 매수합계 - 연간 매도합계
    --
    --===================================================================================
    IF p_type = '1' THEN

        SELECT COALESCE(SUM(flt10_tr_amt * CASE WHEN SUBSTR(flt10_tr_type,3,1) = 'I' THEN 1 ELSE -1 END),0)
          INTO v_RTN
          FROM flt10_tr
               INNER JOIN flt03_account   ON flt03_account_id = flt10_account_id
               INNER JOIN flt05_item_type ON ( flt05_company_id    = flt10_company_id      AND
                                               flt05_item_type_cd  = flt10_tr_item_type    AND
                                               flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                         FROM flt05_item_type
                                                                        WHERE flt05_company_id   = flt10_company_id
                                                                          AND flt05_item_type_cd = flt10_tr_item_type
                                                                          AND flt05_start_date  <= flt10_tr_date ) )
         WHERE flt10_company_id = p_company_id
           AND flt10_person_id  = p_person_id
           AND ( ( v_FLT01.flt01_invest_amt_calc_target_cd  = '2'   AND     --(2:입출금액)
                   flt10_tr_type IN ('50I','51O','55I')             ) OR
                 ( v_FLT01.flt01_invest_amt_calc_target_cd != '2'   AND     --(1:매매금액)
                   flt10_tr_type IN ('10I','20O')                   AND
                   flt05_target_yn   = 'true'                       ) )
           AND COALESCE(flt10_tr_amt,0) > 0
           AND flt10_tr_date BETWEEN v_YEAR_DATE AND p_stdDate
           AND flt03_family_relate_cd   = '1'   --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
           AND flt10_tr_type IN ( SELECT sys09_code
                                    FROM sys13_code_group
                                         INNER JOIN sys09_code ON sys09_code_id = sys13_code_id
                                   WHERE sys13_kind_group_cd = 'FloorTrCode0001' );

        IF v_RTN IS NULL THEN
            v_RTN := 0;
        END IF;

        ---------------------------------------------------------------------------------
        -- 사전신고금액
        IF p_expect_yn THEN
            IF v_FLT01.flt01_invest_amt_calc_target_cd = '1' THEN
                SELECT COALESCE(SUM(flt10_expect_tr_amt * CASE WHEN SUBSTR(flt10_tr_type,3,1) = 'I' THEN 1 ELSE -1 END),0)
                  INTO v_EXPECT_AMT
                  FROM flt10_tr
                       INNER JOIN flt03_account   ON flt03_account_id = flt10_account_id
                       INNER JOIN flt05_item_type ON ( flt05_company_id    = flt10_company_id      AND
                                                       flt05_item_type_cd  = flt10_item_type       AND
                                                       flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                                 FROM flt05_item_type
                                                                                WHERE flt05_company_id   = flt10_company_id
                                                                                  AND flt05_item_type_cd = flt10_item_type
                                                                                  AND flt05_start_date  <= flt10_reg_date ) )
                 WHERE flt10_company_id = p_company_id
                   AND flt10_person_id  = p_person_id
                   --AND flt10_reg_date   = p_stdDate
                   --AND COALESCE(flt10_tr_date, flt10_expect_tr_date) != p_stdDate
                   AND flt10_reg_date BETWEEN v_CHECK_START_DATE AND p_stdDate
                   AND flt10_tr_date IS NULL
                   AND flt05_target_yn          = 'true'
                   AND flt03_family_relate_cd   = '1'               --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
                   AND flt10_status_cd IN ('10','20')               --승인상태(10:신청/20:승인)
                   AND COALESCE(flt10_unfill_yn,'false') != 'true'  --미체결 사전신고거래 제외
                   AND flt10_tr_type IN ( SELECT sys09_code
                                            FROM sys13_code_group
                                                 INNER JOIN sys09_code ON sys09_code_id = sys13_code_id
                                           WHERE sys13_kind_group_cd = 'FloorTrCode0001' );

                IF v_EXPECT_AMT IS NULL THEN
                    v_EXPECT_AMT := 0;
                END IF;
            END IF;
        END IF;

        v_RTN := v_RTN + v_EXPECT_AMT;

    --===================================================================================
    --
    -- 2 : 총누적 투자금액 = 총예탁자산금액(모든 금융투자상품 및 예수금 합산금액)
    --
    --===================================================================================
    ELSIF p_type = '2' THEN

        SELECT COALESCE(SUM(flt11_book_amt),0)
          INTO v_RTN
          FROM flt11_book
               INNER JOIN flt03_account   ON flt03_account_id = flt11_account_id
               INNER JOIN flt05_item_type ON ( flt05_company_id    = flt11_company_id   AND
                                               flt05_item_type_cd  = flt11_item_type    AND
                                               flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                         FROM flt05_item_type
                                                                        WHERE flt05_company_id   = flt11_company_id
                                                                          AND flt05_item_type_cd = flt11_item_type
                                                                          AND flt05_start_date  <= flt11_book_date ) )
         WHERE flt11_company_id =  p_company_id
           AND flt11_person_id  =  p_person_id
           AND flt11_book_date  IN ( SELECT MAX(flt11_book_date)
                                       FROM flt11_book a
                                            INNER JOIN flt05_item_type ON ( flt05_company_id    = a.flt11_company_id   AND
                                                                            flt05_item_type_cd  = a.flt11_item_type    AND
                                                                            flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                                                      FROM flt05_item_type
                                                                                                     WHERE flt05_company_id   = a.flt11_company_id
                                                                                                       AND flt05_item_type_cd = a.flt11_item_type
                                                                                                       AND flt05_start_date  <= a.flt11_book_date ) )
                                      WHERE flt11_company_id = p_company_id
                                        AND flt11_person_id  = p_person_id
                                        AND flt11_book_date <= p_stdDate
                                        AND ( ( v_FLT01.flt01_invest_amt_calc_target_cd  = '2'      AND     --(2:입출금액)
                                                flt11_item_type                          = '99'     ) OR    --(99:예치금)
                                              ( v_FLT01.flt01_invest_amt_calc_target_cd != '2'      AND     --(1:매매금액)
                                                flt11_item_type                         != '99'     AND
                                                flt05_target_yn                          = 'true'   ) )
                                   )

           AND ( ( v_FLT01.flt01_invest_amt_calc_target_cd  = '2'       AND     --(2:입출금액)
                    flt11_item_type                          = '99'     ) OR    --(99:예치금)
                  ( v_FLT01.flt01_invest_amt_calc_target_cd != '2'      AND     --(1:매매금액)
                    flt11_item_type                         != '99'     AND
                    flt05_target_yn                          = 'true'   ) )
           AND flt03_family_relate_cd   = '1' ;   --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)

        IF v_RTN IS NULL THEN
            v_RTN := 0;
        END IF;

        RAISE NOTICE '총누적 투자금액 : %', v_RTN;

        ---------------------------------------------------------------------------------
        -- 사전신고금액
        IF p_expect_yn THEN
            IF v_FLT01.flt01_invest_amt_calc_target_cd = '1' THEN
                SELECT COALESCE(SUM( flt10_expect_tr_amt * CASE WHEN SUBSTR(flt10_tr_type,3,1) = 'I' THEN 1 ELSE -1 END ),0)
                  INTO v_EXPECT_AMT
                  FROM flt10_tr
                       INNER JOIN flt03_account   ON flt03_account_id = flt10_account_id
                       INNER JOIN flt05_item_type ON ( flt05_company_id    = flt10_company_id      AND
                                                       flt05_item_type_cd  = flt10_item_type       AND
                                                       flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                                 FROM flt05_item_type
                                                                                WHERE flt05_company_id   = flt10_company_id
                                                                                  AND flt05_item_type_cd = flt10_item_type
                                                                                  AND flt05_start_date  <= flt10_reg_date ) )
                 WHERE flt10_company_id = p_company_id
                   AND flt10_person_id  = p_person_id
                   --AND flt10_reg_date   = p_stdDate
                   --AND COALESCE(flt10_tr_date, flt10_expect_tr_date) != p_stdDate
                   AND flt10_reg_date BETWEEN v_CHECK_START_DATE AND p_stdDate
                   AND flt10_tr_date IS NULL
                   AND COALESCE(flt10_expect_tr_amt,0) > 0
                   AND flt05_target_yn          = 'true'
                   AND flt03_family_relate_cd   = '1'               --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
                   AND flt10_status_cd IN ('10','20')               --승인상태(10:신청/20:승인)
                   AND COALESCE(flt10_unfill_yn,'false') != 'true'  --미체결 사전신고거래 제외
                   AND flt10_tr_type IN ( SELECT sys09_code
                                            FROM sys13_code_group
                                                 INNER JOIN sys09_code ON sys09_code_id = sys13_code_id
                                           WHERE sys13_kind_group_cd = 'FloorTrCode0001' );
                IF v_EXPECT_AMT IS NULL THEN
                    v_EXPECT_AMT := 0;
                END IF;
                RAISE NOTICE '사전신청금액 : %', v_EXPECT_AMT;
            END IF;
        END IF;

        ---------------------------------------------------------------------------------
        -- 투자금액 계산기준이 '2:입출금액'인 경우 최초원장의 유가증권 보유금액 포함
        IF v_FLT01.flt01_invest_amt_calc_target_cd = '2' THEN
            SELECT SUM(flt13_book_amt)
              INTO v_INIT_BOOK_SUM
              FROM flt13_book_init
                   INNER JOIN flt03_account   ON flt03_account_id = flt13_account_id
                   INNER JOIN flt05_item_type ON ( flt05_company_id    = flt13_company_id      AND
                                                   flt05_item_type_cd  = flt13_item_type    AND
                                                   flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                             FROM flt05_item_type
                                                                            WHERE flt05_company_id   = flt13_company_id
                                                                              AND flt05_item_type_cd = flt13_item_type
                                                                              AND flt05_start_date  <= p_stdDate ) )
             WHERE flt13_company_id         = p_company_id
               AND flt13_person_id          = p_person_id
               AND flt13_item_type         != '99'  --(99:예치금)제외
               AND flt03_family_relate_cd   = '1'   --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
               AND flt05_target_yn          = 'true';

            IF v_INIT_BOOK_SUM IS NULL THEN
                v_INIT_BOOK_SUM := 0;
            END IF;
            RAISE NOTICE '최초원장의 유가증권 보유금액 : %', v_INIT_BOOK_SUM;
        END IF;

        v_RTN := v_RTN + v_EXPECT_AMT + v_INIT_BOOK_SUM;

    --===================================================================================
    --
    -- 3 : 월간 매매회전율(%) = (월매수금액 + 월매도금액) / (월간 일평균잔액 * 2)
    -- 4 : 월간 일평균잔액
    --
    --===================================================================================
    ELSIF p_type IN ('3','4') THEN

        -- 기간시작일 SET = 1일(월중 입사자인 경우 입사일)
        SELECT GREATEST(emp01_hire_date, v_MONTH_DATE)
          INTO v_MONTH_DATE
          FROM emp01_person
         WHERE emp01_person_id = p_person_id;

        RAISE NOTICE '월매매회전율/월평잔 계산기준시작일 : %', to_char(v_MONTH_DATE,'yyyy-mm-dd');

        ---------------------------------------------------------------------------------
        -- (월매수금액 + 월매도금액)
        ---------------------------------------------------------------------------------
        SELECT COALESCE(SUM(flt10_tr_amt),0)
          INTO v_MONTH_TR_AMT
          FROM flt10_tr
               INNER JOIN flt03_account   ON flt03_account_id = flt10_account_id
               INNER JOIN flt05_item_type ON ( flt05_company_id    = flt10_company_id      AND
                                               flt05_item_type_cd  = flt10_tr_item_type    AND
                                               flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                         FROM flt05_item_type
                                                                        WHERE flt05_company_id   = flt10_company_id
                                                                          AND flt05_item_type_cd = flt10_tr_item_type
                                                                          AND flt05_start_date  <= flt10_tr_date ) )
         WHERE flt10_company_id = p_company_id
           AND flt10_person_id  = p_person_id
           AND COALESCE(flt10_tr_amt,0) > 0
           AND flt10_tr_date BETWEEN v_MONTH_DATE AND p_stdDate
           AND flt05_target_yn          = 'true'
           AND flt05_list_stk_yn        = 'true'    --상장지분증권만 체크
           AND flt03_family_relate_cd   = '1'       --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
           AND flt10_tr_type IN ('10I','20O')       --거래구분(10I:매수/20O:매도)
           AND 'Y' = CASE WHEN flt10_tr_type = '20O' AND 
                               trunc((flt10_tr_amt - COALESCE(flt10_pur_amt,0)) / f_nvl(flt10_pur_amt,1) * 100, 2) <= -10 THEN 'N'
                          ELSE 'Y' END;             --실현손실이 10% 이상인 매도거래 제외

        RAISE NOTICE '월매매금액 : %', v_MONTH_TR_AMT;

        IF p_type = '3' AND v_MONTH_TR_AMT = 0 AND p_expect_yn = false THEN
            RAISE NOTICE '월간 매매금액 0, 사전신고 미포함으로 월간 매매회전율은 0임!!';
            RETURN 0;
        END IF;

        IF p_expect_yn THEN
            -- (월매수사전신고금액 + 월매도사전신고금액)
            SELECT COALESCE(SUM(flt10_expect_tr_amt),0)
              INTO v_EXPECT_MONTH_TR_AMT
              FROM flt10_tr
                   INNER JOIN flt03_account   ON flt03_account_id = flt10_account_id
                   INNER JOIN flt05_item_type ON ( flt05_company_id    = flt10_company_id   AND
                                                   flt05_item_type_cd  = flt10_item_type    AND
                                                   flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                             FROM flt05_item_type
                                                                            WHERE flt05_company_id   = flt10_company_id
                                                                              AND flt05_item_type_cd = flt10_item_type
                                                                              AND flt05_start_date  <= flt10_reg_date ) )
             WHERE flt10_company_id = p_company_id
               AND flt10_person_id  = p_person_id
               AND flt10_reg_date BETWEEN v_MONTH_DATE AND p_stdDate
               AND flt10_tr_date IS NULL
               AND flt05_target_yn          = 'true'
               AND flt05_list_stk_yn        = 'true'            --상장지분증권만 체크
               AND flt03_family_relate_cd   = '1'               --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
               AND flt10_status_cd          IN ('10','20')      --승인상태(10:신청/20:승인)
               AND flt10_tr_type            IN ('10I','20O')    --거래구분(10I:매수/20O:매도)
               AND COALESCE(flt10_unfill_yn,'false') != 'true'  --미체결 사전신고거래 제외
               ;

            v_MONTH_TR_AMT := v_MONTH_TR_AMT + v_EXPECT_MONTH_TR_AMT;

            RAISE NOTICE '월매매금액(사전포함) : %', v_MONTH_TR_AMT;

            IF p_type = '3' AND v_MONTH_TR_AMT = 0 THEN
                RAISE NOTICE '월간 사전신고 포함 매매금액 0 이므로, 월간 매매회전율은 0임!!';
                RETURN 0;
            END IF;

            -----------------------------------------------------------------------------
            -- 월간 일평균잔액 계산 (사전신고 포함)
            -----------------------------------------------------------------------------
            SELECT AVG(book_amt)
              INTO v_MONTH_AVG_AMT
              FROM (
                     SELECT book_date
                          , COALESCE(SUM(book_amt),0) book_amt
                       FROM (
                              SELECT flt11_book_date        book_date
                                   , SUM(flt11_book_amt)    book_amt
                                FROM flt11_book
                                     INNER JOIN flt03_account   ON flt03_account_id = flt11_account_id
                                     INNER JOIN flt05_item_type ON ( flt05_company_id    = flt11_company_id  AND
                                                                     flt05_item_type_cd  = flt11_item_type   AND
                                                                     flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                                               FROM flt05_item_type
                                                                                              WHERE flt05_company_id   = flt11_company_id
                                                                                                AND flt05_item_type_cd = flt11_item_type
                                                                                                AND flt05_start_date  <= flt11_book_date ) )
                               WHERE flt11_company_id = p_company_id
                                 AND flt11_person_id  = p_person_id
                                 AND flt11_book_date  BETWEEN v_MONTH_DATE AND p_stdDate
                                 AND flt05_target_yn         = 'true'
                                 AND flt05_list_stk_yn       = 'true'    --상장지분증권만 체크
                                 AND flt03_family_relate_cd  = '1'       --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
                               GROUP BY flt11_book_date
                               UNION ALL
                              SELECT reg_date
                                   , sum(tr_amt)
                                FROM (
                                       SELECT sys12_day::date                       reg_date
                                            , SUM(tr_amt) OVER(ORDER BY sys12_day)  tr_amt
                                         FROM sys12_calendar
                                              LEFT JOIN ( SELECT flt10_reg_date
                                                               , SUM(COALESCE(flt10_expect_tr_amt,0) * CASE WHEN SUBSTR(flt10_tr_type,3,1) = 'I' THEN 1 ELSE -1 END) tr_amt
                                                            FROM flt10_tr
                                                                 INNER JOIN flt03_account   ON flt03_account_id = flt10_account_id
                                                                 INNER JOIN flt05_item_type ON ( flt05_company_id    = flt10_company_id  AND
                                                                                                 flt05_item_type_cd  = flt10_item_type   AND
                                                                                                 flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                                                                           FROM flt05_item_type
                                                                                                                          WHERE flt05_company_id   = flt10_company_id
                                                                                                                            AND flt05_item_type_cd = flt10_item_type
                                                                                                                            AND flt05_start_date  <= flt10_reg_date ) )
                                                           WHERE flt10_company_id = p_company_id
                                                             AND flt10_person_id  = p_person_id
                                                             AND flt10_reg_date   BETWEEN v_MONTH_DATE AND p_stdDate
                                                             AND flt10_tr_date    IS NULL
                                                             AND flt10_status_cd  IN ('10','20')                --승인상태(10:신청/20:승인)
                                                             AND COALESCE(flt10_unfill_yn,'false') != 'true'    --미체결 사전신고거래 제외
                                                             AND flt05_target_yn         = 'true'               --위반사항 체크대상 종목유형
                                                             AND flt05_list_stk_yn       = 'true'               --상장지분증권만 체크
                                                             AND flt03_family_relate_cd  = '1'                  --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
                                                           GROUP BY flt10_reg_date
                                                        ) flt10 ON flt10_reg_date = sys12_day
                                        WHERE sys12_company_id = 0
                                          AND sys12_working_yn = 'true'
                                          AND sys12_day BETWEEN v_MONTH_DATE::timestamp AND p_stdDate::timestamp
                                     ) t0
                               GROUP BY reg_date
                            ) t1
                      GROUP BY book_date
                   ) t;

            RAISE NOTICE '월간 일평균잔액(사전신고 포함) : %', v_MONTH_AVG_AMT;

        ELSE
            -----------------------------------------------------------------------------
            -- 월간 일평균잔액 계산 (사전신고 미포함)
            -----------------------------------------------------------------------------
            SELECT AVG(flt11_book_amt)
              INTO v_MONTH_AVG_AMT
              FROM (
                     SELECT flt11_book_date, SUM(flt11_book_amt) flt11_book_amt
                       FROM flt11_book
                            INNER JOIN flt03_account   ON flt03_account_id = flt11_account_id
                            INNER JOIN flt05_item_type ON ( flt05_company_id    = flt11_company_id  AND
                                                            flt05_item_type_cd  = flt11_item_type   AND
                                                            flt05_start_date    = ( SELECT MAX(flt05_start_date)
                                                                                      FROM flt05_item_type
                                                                                     WHERE flt05_company_id   = flt11_company_id
                                                                                       AND flt05_item_type_cd = flt11_item_type
                                                                                       AND flt05_start_date  <= flt11_book_date ) )
                      WHERE flt11_company_id = p_company_id
                        AND flt11_person_id  = p_person_id
                        AND flt11_book_date  BETWEEN v_MONTH_DATE AND p_stdDate
                        AND flt05_target_yn         = 'true'
                        AND flt05_list_stk_yn       = 'true'    --상장지분증권만 체크
                        AND flt03_family_relate_cd  = '1'       --본인계좌만 체크(1:본인/2:배우자/3:자녀1/..)
                      GROUP BY flt11_book_date
                   ) a ;

            RAISE NOTICE '월간 일평균잔액 : %', v_MONTH_AVG_AMT;
        
        END IF;

        -- 월매매회전율 = (월매수금액 + 월매도금액) / (월간 일평균잔액 * 2)
        SELECT TRUNC(COALESCE(v_MONTH_TR_AMT,0) / (f_nvl(v_MONTH_AVG_AMT,1) * 2) * 100, 2)
          INTO v_RTN;

        RAISE NOTICE '월간 매매회전율[%] = (월매수금액 + 월매도금액)[%] / (일평균잔액[%] * 2) * 100', v_RTN, v_MONTH_TR_AMT, v_MONTH_AVG_AMT;

        IF p_type = '4' THEN
            v_RTN := v_MONTH_AVG_AMT;
        END IF;

    END IF;

    -------------------------------------------------------------------------------------
    RETURN v_RTN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN 0;
END;
$function$
```
