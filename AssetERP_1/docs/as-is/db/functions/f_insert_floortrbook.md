# f_insert_floortrbook

## FUNCTION public.f_insert_floortrbook(p_company_id numeric, p_person_id numeric, p_account_id character varying, p_item_type character varying, p_item_nm character varying, p_item_cd character varying, p_std_date date)

- 반환: `character varying`
- 줄 수: 387

```sql
CREATE OR REPLACE FUNCTION public.f_insert_floortrbook(p_company_id numeric, p_person_id numeric, p_account_id character varying, p_item_type character varying, p_item_nm character varying, p_item_cd character varying, p_std_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_FLT11         flt11_book%ROWTYPE;
    v_FLT11_OUT     flt11_book%ROWTYPE;
    v_FLT12         RECORD;
    v_DATE          RECORD;
    v_TR            RECORD;

    v_QTY           NUMERIC;
    v_BOOK_AMT      NUMERIC;
    v_PUR_AMT       NUMERIC;

    v_ACCOUNT_ID    NUMERIC;
    v_STK_PRICE_YN  VARCHAR(5);
    v_PRE_BIZDATE   DATE;

    v_CNT           NUMERIC;
    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := CONCAT('자기매매 보유원장 생성 실패 [',p_company_id,'][',p_person_id,'][',p_account_id,'][',p_item_type,'][',p_item_nm,'][',p_item_cd,'][',p_std_date,']');
    -------------------------------------------------------------------------------------
    /* 계좌대체(30N) 거래가 생기면서, 계좌별 정리가 불가능해짐. 무조건 전체 계좌정리만 가능!!!!
    IF p_account_id = '%' THEN
        v_ACCOUNT_ID := 0;
    ELSE
        v_ACCOUNT_ID := CAST(p_account_id AS NUMERIC);
    END IF;*/
    v_ACCOUNT_ID := 0;
    -------------------------------------------------------------------------------------
    -- 주식시세적용 종목유형인 경우 종목코드를 Key로 사용 (2024.10.18 CYY)
    IF p_item_type = '%' THEN
        v_STK_PRICE_YN := 'false';
    ELSE
        SELECT COALESCE(flt05_stk_price_yn, 'false')
          INTO v_STK_PRICE_YN
          FROM flt05_item_type
         WHERE flt05_company_id   = p_company_id
           AND flt05_item_type_cd = p_item_type
           AND flt05_start_date  <= p_std_date
         ORDER BY flt05_start_date DESC
         LIMIT 1;
    END IF;

    IF v_STK_PRICE_YN = 'true' THEN
        IF p_item_cd IS NULL OR p_item_cd = '' THEN
            v_errMsg := '종목코드가 존재하지 않습니다.(주식시세적용 종목유형)';
            RAISE USING ERRCODE = '90001';
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 처리전 원장 정리
    DELETE
      FROM flt11_book
     WHERE flt11_company_id =    p_company_id
       AND flt11_person_id  =    p_person_id
       AND flt11_item_type  LIKE p_item_type
       AND ( ( v_STK_PRICE_YN  = 'true' AND flt11_item_cd LIKE p_item_cd ) OR
             ( v_STK_PRICE_YN != 'true' AND flt11_item_nm LIKE p_item_nm ) )
       AND flt11_account_id =    CASE WHEN v_ACCOUNT_ID = 0 THEN flt11_account_id ELSE v_ACCOUNT_ID END
       AND flt11_book_date  >=   p_std_date;

    RAISE NOTICE '처리전 원장 정리 완료 !!!';
    -------------------------------------------------------------------------------------
    -- 처리전 월말평가원장 정리. (2025.01.20 CYY)
    -- 주식시세적용 종목들만 제거. 미적용 종목들은 잔고증명서의 평가금액을 직접 입력하기 때문에 제거할 필요 없음
    DELETE
      FROM flt12_book_month
     WHERE flt12_company_id = p_company_id
       AND flt12_person_id  = p_person_id
       AND flt12_item_type  LIKE p_item_type
       AND ( ( v_STK_PRICE_YN  = 'true' AND flt12_item_cd LIKE p_item_cd ) OR
             ( v_STK_PRICE_YN != 'true' AND flt12_item_nm LIKE p_item_nm ) )
       AND flt12_account_id = CASE WHEN v_ACCOUNT_ID = 0 THEN flt12_account_id ELSE v_ACCOUNT_ID END
       AND flt12_book_date  >=   p_std_date
       AND EXISTS ( SELECT 1
                      FROM flt05_item_type
                     WHERE flt05_company_id     = flt12_company_id
                       AND flt05_item_type_cd   = flt12_item_type
                       AND COALESCE(flt05_stk_price_yn,'false') = 'true'
                       AND flt05_start_date = ( SELECT MAX(flt05_start_date)
                                                  FROM flt05_item_type
                                                 WHERE flt05_company_id     = flt12_company_id
                                                   AND flt05_item_type_cd   = flt12_item_type
                                                   AND flt05_start_date    <= p_std_date ) );

    RAISE NOTICE '처리전 월말평가원장 정리 완료 !!!';
    -------------------------------------------------------------------------------------
    -- 영업일별 거래내역 가져오기
    FOR v_DATE IN ( SELECT sys12_day
                      FROM sys12_calendar
                     WHERE sys12_company_id                   = p_company_id
                       AND COALESCE(sys12_working_yn,'false') = 'true'
                       AND sys12_day BETWEEN p_std_date AND f_sysdate()
                     ORDER BY sys12_day
    ) LOOP
        RAISE NOTICE '###################################################################';
        RAISE NOTICE '생성일 : %', v_DATE.sys12_day;
        ---------------------------------------------------------------------------------
        -- 전영업일 SET
        v_PRE_BIZDATE := f_get_biz_date(p_company_id, v_DATE.sys12_day::date, '-1');

        RAISE NOTICE '전영업일 : %', v_PRE_BIZDATE;

        --RAISE NOTICE '원장이월 : [%], [%], [%], [%], [%], [%], [%]', p_company_id, p_person_id, v_ACCOUNT_ID, p_item_nm, p_item_cd, p_item_type, v_PRE_BIZDATE ;

        -- 원장이월
        v_errMsg := '원장이월 실패 ['||v_DATE.sys12_day||']';
        INSERT
          INTO flt11_book
        SELECT f_create_seq()
             , t.*
          FROM (
                 SELECT flt11_company_id
                      , flt11_person_id
                      , flt11_account_id
                      , flt11_item_nm
                      , flt11_item_type
                      , v_DATE.sys12_day
                      , COALESCE(flt11_book_amt,0)
                      , COALESCE(flt11_book_qty,0)
                      , flt11_note
                      , flt11_init_buy_date
                      , flt11_pur_price
                      , flt11_pur_amt
                      , flt11_item_cd
                   FROM flt11_book
                        INNER JOIN flt05_item_type ON (    flt05_company_id   = flt11_company_id
                                                       AND flt05_item_type_cd = flt11_item_type
                                                       AND flt05_start_date   = ( SELECT MAX(flt05_start_date)
                                                                                    FROM flt05_item_type
                                                                                   WHERE flt05_company_id   = flt11_company_id
                                                                                     AND flt05_item_type_cd = flt11_item_type
                                                                                     AND flt05_start_date  <= v_DATE.sys12_day ) )
                  WHERE flt11_company_id =    p_company_id
                    AND flt11_person_id  =    p_person_id
                    AND flt11_item_type  LIKE p_item_type
                    AND ( ( COALESCE(flt05_stk_price_yn,'false')  = 'true' AND flt11_item_cd LIKE p_item_cd ) OR
                          ( COALESCE(flt05_stk_price_yn,'false') != 'true' AND flt11_item_nm LIKE p_item_nm ) )
                    AND flt11_account_id =    CASE WHEN v_ACCOUNT_ID = 0 THEN flt11_account_id ELSE v_ACCOUNT_ID END
                    AND flt11_book_date  =    v_PRE_BIZDATE
                    AND COALESCE(flt11_book_qty,0) > 0
                  UNION
                 SELECT flt13_company_id
                      , flt13_person_id
                      , flt13_account_id
                      , flt13_item_nm
                      , flt13_item_type
                      , flt13_book_date
                      , flt13_book_amt
                      , flt13_book_qty
                      , flt13_note
                      , flt13_book_date
                      , TRUNC(flt13_book_amt / flt13_book_qty)
                      , flt13_book_amt
                      , flt13_item_cd
                   FROM flt13_book_init
                        INNER JOIN flt05_item_type ON (    flt05_company_id   = flt13_company_id
                                                       AND flt05_item_type_cd = flt13_item_type
                                                       AND flt05_start_date   = ( SELECT MAX(flt05_start_date)
                                                                                    FROM flt05_item_type
                                                                                   WHERE flt05_company_id   = flt13_company_id
                                                                                     AND flt05_item_type_cd = flt13_item_type
                                                                                     AND flt05_start_date  <= v_DATE.sys12_day ) )
                  WHERE flt13_company_id =    p_company_id
                    AND flt13_person_id  =    p_person_id
                    AND flt13_item_type  LIKE p_item_type
                    AND ( ( COALESCE(flt05_stk_price_yn,'false')  = 'true' AND flt13_item_cd LIKE p_item_cd ) OR
                          ( COALESCE(flt05_stk_price_yn,'false') != 'true' AND flt13_item_nm LIKE p_item_nm ) )
                    AND flt13_account_id =    CASE WHEN v_ACCOUNT_ID = 0 THEN flt13_account_id ELSE v_ACCOUNT_ID END
                    AND flt13_book_date  =    v_DATE.sys12_day
               ) t;

        ---------------------------------------------------------------------------------
        -- 거래반영
        v_errMsg := CONCAT('거래내역 가져오기 실패 [',p_company_id,'][',p_person_id,'][',v_ACCOUNT_ID,'][',p_item_type,'][',p_item_nm,'][',p_item_cd,'][',v_DATE.sys12_day,']');

        RAISE NOTICE '거래내역 가져오기 : %, %, %, %, %, %, %', p_company_id, p_person_id, v_ACCOUNT_ID, p_item_type, p_item_nm, p_item_cd, v_DATE.sys12_day  ;

        FOR v_TR IN ( SELECT *
                        FROM flt10_tr
                             INNER JOIN flt05_item_type ON (    flt05_company_id   = flt10_company_id
                                                            AND flt05_item_type_cd = flt10_tr_item_type
                                                            AND flt05_start_date   = ( SELECT MAX(flt05_start_date)
                                                                                         FROM flt05_item_type
                                                                                        WHERE flt05_company_id   = flt10_company_id
                                                                                          AND flt05_item_type_cd = flt10_tr_item_type
                                                                                          AND flt05_start_date  <= v_DATE.sys12_day ) )
                       WHERE flt10_company_id   =    p_company_id
                         AND flt10_person_id    =    p_person_id
                         AND flt10_tr_item_type LIKE p_item_type
                         AND ( ( COALESCE(flt05_stk_price_yn,'false')  = 'true' AND flt10_tr_item_cd LIKE p_item_cd ) OR
                               ( COALESCE(flt05_stk_price_yn,'false') != 'true' AND flt10_tr_item_nm LIKE p_item_nm ) )
                         AND flt10_account_id   =    CASE WHEN v_ACCOUNT_ID = 0 THEN flt10_account_id ELSE v_ACCOUNT_ID END
                         AND flt10_tr_date      =    v_DATE.sys12_day
                         AND flt10_tr_qty       !=   0
                         --AND flt10_tr_amt     >    0
                         AND flt10_tr_type      !=   '55N'  --(55I:배당금(원장생성O)/55N:배당금(원장생성X))
                       ORDER BY flt10_tr_date, flt10_tr_type, flt10_tr_id
        ) LOOP
            RAISE NOTICE '거래반영--------------------------!!!! IN!!!! ..% / % / %',v_TR.flt10_tr_date, v_TR.flt10_tr_type, v_TR.flt10_tr_item_nm ;
            -----------------------------------------------------------------------------
            v_QTY       := 0    ;
            v_BOOK_AMT  := 0    ;
            v_PUR_AMT   := 0    ;
            v_FLT11     := NULL ;
            v_FLT11_OUT := NULL ;
            -----------------------------------------------------------------------------
            -- 보유내역 가져오기
            v_errMsg := CONCAT('보유내역 가져오기 실패 [',p_company_id,'][',p_person_id,'][',v_TR.flt10_account_id,'][',v_TR.flt10_tr_item_type,'][',v_TR.flt10_tr_item_nm,'][',v_TR.flt10_tr_item_cd,'][',v_TR.flt10_tr_date,']');
            SELECT *
              INTO v_FLT11
              FROM flt11_book
             WHERE flt11_company_id =  v_TR.flt10_company_id
               AND flt11_person_id  =  v_TR.flt10_person_id
               AND flt11_account_id =  v_TR.flt10_account_id
               AND flt11_book_date  =  v_TR.flt10_tr_date
               AND flt11_item_type  =  v_TR.flt10_tr_item_type
               AND ( ( COALESCE(v_TR.flt05_stk_price_yn,'false')  = 'true' AND flt11_item_cd = v_TR.flt10_tr_item_cd ) OR
                     ( COALESCE(v_TR.flt05_stk_price_yn,'false') != 'true' AND flt11_item_nm = v_TR.flt10_tr_item_nm ) );

            RAISE NOTICE '거래반영---### % % % % - 거래전 보유수량 : %', v_TR.flt10_account_id, v_TR.flt10_tr_item_type, v_TR.flt10_tr_item_cd, v_TR.flt10_tr_item_nm, v_FLT11.flt11_book_qty;

            -----------------------------------------------------------------------------
            -- 입고(10I:매수/41I:전환권행사/42I:신주인수권행사/45I:유상증자/46I:무상증자), 계좌대체(30N), 입금(50I)
            IF SUBSTR(v_TR.flt10_tr_type,3,1) = 'I' OR v_TR.flt10_tr_type = '30N' THEN
                v_errMsg := '입고수량 및 장부금액 계산 실패';
                v_QTY      := v_TR.flt10_tr_qty;
                v_BOOK_AMT := COALESCE(v_TR.flt10_tr_amt,0);
                v_PUR_AMT  := COALESCE(v_TR.flt10_tr_amt,0);

            -- 출고(20O:매도/47O:감자), 출금(51O)
            ELSIF SUBSTR(v_TR.flt10_tr_type,3,1) = 'O' THEN
                v_errMsg := '출고수량 및 장부금액 계산 실패';
                v_QTY      := v_TR.flt10_tr_qty * -1;
                v_BOOK_AMT := COALESCE(v_TR.flt10_tr_amt,0) * -1;
                v_PUR_AMT  := TRUNC(v_FLT11.flt11_pur_amt / f_nvl(v_FLT11.flt11_book_qty,1) * v_TR.flt10_tr_qty) * -1;

                IF v_TR.flt10_tr_type IN ('47O') THEN --(47:감자)
                    v_PUR_AMT  := 0;
                ELSIF v_TR.flt10_tr_type IN ('51O') THEN --(51:출금)
                    v_PUR_AMT  := v_BOOK_AMT;
                END IF;

            END IF;

            -----------------------------------------------------------------------------
            -- 계좌대체(30N) 거래 출고계좌 원장정리
            IF v_TR.flt10_tr_type = '30N' THEN
                v_errMsg := '출고원장 가져오기 실패'; 
                SELECT *
                  INTO v_FLT11_OUT
                  FROM flt11_book
                 WHERE flt11_company_id =  v_TR.flt10_company_id
                   AND flt11_person_id  =  v_TR.flt10_person_id
                   AND flt11_account_id =  v_TR.flt10_out_account_id
                   AND flt11_book_date  =  v_TR.flt10_tr_date
                   AND flt11_item_type  =  v_TR.flt10_tr_item_type
                   AND ( ( COALESCE(v_TR.flt05_stk_price_yn,'false')  = 'true' AND flt11_item_cd = v_TR.flt10_tr_item_cd ) OR
                         ( COALESCE(v_TR.flt05_stk_price_yn,'false') != 'true' AND flt11_item_nm = v_TR.flt10_tr_item_nm ) );

                v_errMsg := '출고원장 반영 실패'; 
                UPDATE flt11_book
                   SET flt11_book_qty  = flt11_book_qty - v_QTY
                     , flt11_book_amt  = flt11_book_amt - v_BOOK_AMT
                     , flt11_pur_amt   = flt11_pur_amt  - v_PUR_AMT
                 WHERE flt11_book_id = v_FLT11_OUT.flt11_book_id;
            END IF;

            -----------------------------------------------------------------------------
            -- 보유내역 있음 => UPDATE
            IF v_FLT11.flt11_book_id IS NOT NULL THEN

                RAISE NOTICE '거래반영!!!! IN!!!! 보유내역 있음 : v_QTY(%), v_BOOK_AMT(%), v_PUR_AMT(%)', v_QTY, v_BOOK_AMT, v_PUR_AMT;
                RAISE NOTICE '거래반영!!!! IN!!!! 보유내역 있음 : flt11_book_amt 보유분 현시세로 재평가: % = % * (% / %) ', TRUNC(v_FLT11.flt11_book_qty * (v_TR.flt10_tr_amt / v_TR.flt10_tr_qty)), v_FLT11.flt11_book_qty, v_TR.flt10_tr_amt, v_TR.flt10_tr_qty;

                -------------------------------------------------------------------------
                IF COALESCE(v_TR.flt10_tr_amt,0) = 0 THEN
                    v_FLT11.flt11_book_amt := v_FLT11.flt11_book_amt;
                ELSE
                    IF v_TR.flt10_tr_type IN ('10I','20O') THEN
                        v_FLT11.flt11_book_amt := TRUNC(v_FLT11.flt11_book_qty * (v_TR.flt10_tr_amt / v_TR.flt10_tr_qty));
                    ELSE
                        v_FLT11.flt11_book_amt := v_FLT11.flt11_book_amt;
                    END IF;
                END IF;
                v_FLT11.flt11_book_amt := v_FLT11.flt11_book_amt + v_BOOK_AMT ;
                v_FLT11.flt11_book_qty := v_FLT11.flt11_book_qty + v_QTY      ;
                v_FLT11.flt11_pur_amt  := v_FLT11.flt11_pur_amt  + v_PUR_AMT  ;

                IF v_TR.flt10_tr_type = '10I' THEN --(10I:매수)
                    v_FLT11.flt11_pur_price := v_FLT11.flt11_pur_amt / v_FLT11.flt11_book_qty;
                END IF;
                
                RAISE NOTICE '거래반영!!!! IN!!!! 보유내역 있음 : 최종 update 금액 book_amt(%)', v_FLT11.flt11_book_amt;

                -------------------------------------------------------------------------
                UPDATE flt11_book
                   SET flt11_book_qty  = v_FLT11.flt11_book_qty
                     , flt11_book_amt  = v_FLT11.flt11_book_amt
                     , flt11_pur_amt   = v_FLT11.flt11_pur_amt
                     , flt11_pur_price = v_FLT11.flt11_pur_price
                 WHERE flt11_book_id   = v_FLT11.flt11_book_id;
            
            -----------------------------------------------------------------------------
            -- 보유내역 없음 => INSERT
            ELSE
            
                RAISE NOTICE '거래반영!!!! IN!!!! 보유내역 없음 : v_QTY(%), v_BOOK_AMT(%), v_PUR_AMT(%)', v_QTY, v_BOOK_AMT, v_PUR_AMT;

                v_errMsg := CONCAT('보유원장 생성 실패 [',v_TR.flt10_account_id,'][',v_TR.flt10_tr_item_type,'][',v_TR.flt10_tr_item_nm,'][',v_TR.flt10_tr_item_cd,'][',v_TR.flt10_tr_date,']');
                v_FLT11.flt11_book_id       := f_create_seq()                                                   ;
                v_FLT11.flt11_company_id    := v_TR.flt10_company_id                                            ;
                v_FLT11.flt11_person_id     := v_TR.flt10_person_id                                             ;
                v_FLT11.flt11_account_id    := v_TR.flt10_account_id                                            ;
                v_FLT11.flt11_item_nm       := v_TR.flt10_tr_item_nm                                            ;
                v_FLT11.flt11_item_cd       := v_TR.flt10_tr_item_cd                                            ;
                v_FLT11.flt11_item_type     := v_TR.flt10_tr_item_type                                          ;
                v_FLT11.flt11_book_date     := v_TR.flt10_tr_date                                               ;
                v_FLT11.flt11_book_qty      := v_QTY                                                            ;
                v_FLT11.flt11_book_amt      := v_BOOK_AMT                                                       ;
                v_FLT11.flt11_pur_amt       := v_PUR_AMT                                                        ;
                v_FLT11.flt11_pur_price     := TRUNC(v_BOOK_AMT / v_QTY)                                        ;
                v_FLT11.flt11_init_buy_date := COALESCE(v_FLT11_OUT.flt11_init_buy_date, v_TR.flt10_tr_date)    ;
                INSERT INTO flt11_book VALUES (v_FLT11.*);
            END IF;
            -----------------------------------------------------------------------------
            -- 매매내역(flt10) 취득금액 UPDATE
            UPDATE flt10_tr
               SET flt10_pur_amt = ABS(v_PUR_AMT)
             WHERE flt10_tr_id   = v_TR.flt10_tr_id;
        END LOOP;

        ---------------------------------------------------------------------------------
        -- 월말 영업일인 경우 월말원장 데이터 가져오기
        IF v_DATE.sys12_day = f_get_biz_date(p_company_id, f_get_last_day(v_DATE.sys12_day::date), '-0') THEN
            v_errMsg := CONCAT('월말원장 가져오기 실패 [',v_ACCOUNT_ID,'][',p_item_type,'][',p_item_nm,'][',p_item_cd,'][',v_DATE.sys12_day,']');
            FOR v_FLT12 IN ( SELECT *
                               FROM flt12_book_month
                                    INNER JOIN flt05_item_type ON (    flt05_company_id   = flt12_company_id
                                                                   AND flt05_item_type_cd = flt12_item_type
                                                                   AND flt05_start_date   = ( SELECT MAX(flt05_start_date)
                                                                                                FROM flt05_item_type
                                                                                               WHERE flt05_company_id   = flt12_company_id
                                                                                                 AND flt05_item_type_cd = flt12_item_type
                                                                                                 AND flt05_start_date  <= v_DATE.sys12_day ) )
                              WHERE flt12_company_id    =    p_company_id
                                AND flt12_person_id     =    p_person_id
                                AND flt12_item_type     LIKE p_item_type
                                AND ( ( COALESCE(flt05_stk_price_yn,'false')  = 'true' AND flt12_item_cd LIKE p_item_cd ) OR
                                      ( COALESCE(flt05_stk_price_yn,'false') != 'true' AND flt12_item_nm LIKE p_item_nm ) )
                                AND flt12_account_id    =    CASE WHEN v_ACCOUNT_ID = 0 THEN flt12_account_id ELSE v_ACCOUNT_ID END
                                AND flt12_book_date     =    v_DATE.sys12_day
            ) LOOP
                -------------------------------------------------------------------------
                v_errMsg := '월말원장금액 반영 실패 ['||v_FLT12.flt12_account_id||']['||v_FLT12.flt12_item_nm||']['||v_FLT12.flt12_book_date||']';
                UPDATE flt11_book
                   SET flt11_book_amt = v_FLT12.flt12_book_amt
                 WHERE flt11_company_id =  v_FLT12.flt12_company_id
                   AND flt11_person_id  =  v_FLT12.flt12_person_id
                   AND flt11_account_id =  v_FLT12.flt12_account_id
                   AND flt11_book_date  =  v_FLT12.flt12_book_date
                   AND flt11_item_type  =  v_FLT12.flt12_item_type
                   AND ( ( COALESCE(v_FLT12.flt05_stk_price_yn,'false')  = 'true' AND flt11_item_cd LIKE v_FLT12.flt12_item_cd ) OR
                         ( COALESCE(v_FLT12.flt05_stk_price_yn,'false') != 'true' AND flt11_item_nm LIKE v_FLT12.flt12_item_nm ) );
            END LOOP;
        END IF;
        -----------------------------------------------------------------------------
    END LOOP ;
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
