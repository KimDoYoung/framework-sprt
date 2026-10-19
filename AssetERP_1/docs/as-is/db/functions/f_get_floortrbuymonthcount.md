# f_get_floortrbuymonthcount

## FUNCTION public.f_get_floortrbuymonthcount(p_person_id numeric, p_startdate date, p_closedate date)

- 반환: `numeric`
- 줄 수: 143

```sql
CREATE OR REPLACE FUNCTION public.f_get_floortrbuymonthcount(p_person_id numeric, p_startdate date, p_closedate date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_TR                RECORD;

    v_EXPECT_ID         NUMERIC;
    v_EXPECT_QTY        NUMERIC;
    v_EXPECT_TR_DATE    DATE;        --매매유효일
    v_EXPECT_END_ID     NUMERIC[];
    v_ARRAY_NO          NUMERIC;

    v_ITEM_CD           VARCHAR(12);
    v_REMAIN_QTY        NUMERIC;

    v_MONTH_CNT         NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    /*
       [월간 매수주문횟수 리턴]
       사전매수수량은 분할매수인정하여 1회로 계산함
       사전매수신고를 100주 한 경우 주문유효기간(2일)안의 분할매수건은 사전매수신고한 수량안에서 1건으로 체크한다.

        예1) 12/26 매수사전신고 삼성전자 100주
             12/26 매수         삼성전자  50주
             12/26 매수         삼성전자  10주
             12/27 매수         삼성전자  40주
            => 3건의 매수지만 100주를 사전신고했기 때문에 1건으로 계산
               만약 12/27 삼성전자 10주 매수가 또 있다면 100주를 넘어갔기 때문에 2건으로 계산한다
      
        예2) 12/26 매수사전신고 삼성전자 100주
             12/26 매수         삼성전자  60주
             12/27 매수         삼성전자  30주
             12/28 매수         삼성전자  10주
            => 100주를 초과하지 않았지만, 주문유효일이 27일까지이기 때문에, 28일의 매수건은 별도의 1건으로 계산해서 2건으로 계산한다
    */

    -------------------------------------------------------------------------------------
    v_MONTH_CNT     := 0;
    v_ARRAY_NO      := 0;
    v_EXPECT_END_ID := '{}';
    v_ITEM_CD       := '';
    v_REMAIN_QTY    := 0;
    -------------------------------------------------------------------------------------
    FOR c_TR IN ( SELECT flt10_tr_date
                       , flt10_account_id
                       , flt10_tr_item_type
                       , flt10_tr_item_cd
                       , flt10_tr_item_nm
                       , flt10_tr_qty
                    FROM flt10_tr
                         INNER JOIN flt03_account   ON flt03_account_id = flt10_account_id
                         INNER JOIN flt05_item_type ON (    flt05_company_id   = flt10_company_id
                                                        AND flt05_item_type_cd = flt10_tr_item_type
                                                        AND flt05_start_date   = (SELECT MAX(flt05_start_date)
                                                                                    FROM flt05_item_type
                                                                                   WHERE flt05_company_id   = flt10_company_id
                                                                                     AND flt05_item_type_cd = flt10_tr_item_type
                                                                                     AND flt05_start_date  <= flt10_tr_date) )
                   WHERE flt10_person_id  = p_person_id
                     AND flt10_tr_type    = '10I'                                --(10I:매수)
                     AND flt10_tr_date    BETWEEN p_startDate AND p_closeDate
                     AND COALESCE(flt05_lock_up_check_yn,'false') = 'true'
                     AND flt03_family_relate_cd  = '1'                          --(1:본인/2:배우자/3:자녀1/..)
                   ORDER BY flt10_tr_item_cd, flt10_tr_date, flt10_tr_id
    ) LOOP
        RAISE NOTICE '---------------------------------------------';
        RAISE NOTICE ' 매수일  [%]', c_TR.flt10_tr_date;
        RAISE NOTICE ' 계좌ID  [%]', c_TR.flt10_account_id;
        RAISE NOTICE ' 종목유형[%]', c_TR.flt10_tr_item_type;
        RAISE NOTICE ' 종목코드[%]', c_TR.flt10_tr_item_cd;
        RAISE NOTICE ' 종목명  [%]', c_TR.flt10_tr_item_nm;

        -- 종목이 변경되었거나 실거래일이 매매유효일보다 크면, 신고잔여수량 초기화
        IF v_ITEM_CD != c_TR.flt10_tr_item_cd                           OR
           COALESCE(v_EXPECT_TR_DATE,'1900-01-01') < c_TR.flt10_tr_date THEN
            v_REMAIN_QTY := 0;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_REMAIN_QTY <= 0 THEN
            -----------------------------------------------------------------------------
            v_MONTH_CNT := v_MONTH_CNT + 1;
            RAISE NOTICE ' v_MONTH_CNT : %', v_MONTH_CNT;
            -----------------------------------------------------------------------------
            -- 사전신고수량 GET
            SELECT flt10_tr_id, flt10_expect_tr_qty, flt10_expect_tr_date
              INTO v_EXPECT_ID, v_EXPECT_QTY, v_EXPECT_TR_DATE
              FROM flt10_tr
                   /*INNER JOIN apr01_appr ON ( apr01_appr_id   = flt10_expect_appr_id  AND
                                              apr01_status_cd NOT IN ('40','99')      )*/
             WHERE flt10_person_id  = p_person_id
               AND flt10_account_id = c_TR.flt10_account_id
               AND flt10_item_type  = c_TR.flt10_tr_item_type
               AND flt10_item_cd    = c_TR.flt10_tr_item_cd
               AND flt10_status_cd  IN ('10','20')
               AND flt10_tr_type    = '10I'    --(10I:매수)
               AND c_TR.flt10_tr_date BETWEEN flt10_reg_date AND flt10_expect_tr_date
               AND flt10_tr_id NOT IN (SELECT UNNEST(v_EXPECT_END_ID))
             ORDER BY flt10_tr_id
             LIMIT 1;

            RAISE NOTICE ' 사전신고수량 : %', v_EXPECT_QTY;
            -----------------------------------------------------------------------------
            IF COALESCE(v_EXPECT_QTY,0) > 0 THEN
                v_ARRAY_NO                  := v_ARRAY_NO  + 1;
                v_EXPECT_END_ID[v_ARRAY_NO] := v_EXPECT_ID;
                v_ITEM_CD                   := c_TR.flt10_tr_item_cd;
                v_REMAIN_QTY                := v_REMAIN_QTY + v_EXPECT_QTY;
                RAISE NOTICE ' 잔여수량 : %', v_REMAIN_QTY;
            END IF;
            -----------------------------------------------------------------------------
            -- 사전신고수량을 ADD했는데도, 잔여수량이 '-'이면, 건수를 한번더 Count하고 잔여수량을 초기화한다.
            IF v_REMAIN_QTY < 0 THEN
                RAISE NOTICE ' (분할매수)사전신고수량 OVER - 매수횟수 추가 Count';
                v_MONTH_CNT  := v_MONTH_CNT + 1;
                v_ITEM_CD    := '';
                v_REMAIN_QTY := 0;
            END IF;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_REMAIN_QTY != 0 AND v_REMAIN_QTY < c_TR.flt10_tr_qty THEN
            RAISE NOTICE ' (단일매수)사전신고수량 OVER - 매수횟수 추가 Count';
            v_MONTH_CNT  := v_MONTH_CNT + 1;
        END IF;
        ---------------------------------------------------------------------------------            
        v_REMAIN_QTY := v_REMAIN_QTY - c_TR.flt10_tr_qty;

        RAISE NOTICE ' 매수횟수(v_MONTH_CNT) : %', v_MONTH_CNT;
        RAISE NOTICE ' 매수수량              : %', c_TR.flt10_tr_qty;
        RAISE NOTICE ' 잔여신고수량          : %', v_REMAIN_QTY;
        RAISE NOTICE ' v_EXPECT_END_ID[]     : %', v_EXPECT_END_ID;

    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN v_MONTH_CNT;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 0;
END;
$function$
```
