# f_calc_chargefee

## FUNCTION public.f_calc_chargefee(p_cont_corp_id numeric, p_charge_date date)

- 반환: `character varying`
- 줄 수: 222

```sql
CREATE OR REPLACE FUNCTION public.f_calc_chargefee(p_cont_corp_id numeric, p_charge_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_BIZ20         biz20_fee_charge%ROWTYPE;
    
    v_DATA          RECORD;
    v_WITH_FEE      RECORD;
    
    v_OCC_FEE_SUM   NUMERIC;
    v_MIN_FEE_SUM   NUMERIC;
    v_DIFF_AMT      NUMERIC;

    v_CNT           NUMERIC;
    v_TARGET_YN     BOOLEAN := true;

    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    /*-----------------------------------------------------------------------------------
      1. 청구대상 계약사이면서, 병행보수대상인 경우만 해당됨 !!! (화면에서 걸러서 들어옴)
      2. 병행기간의 병행보수보다 병행사의 발생보수 합계금액이 많으면 청구대상 아님
      3. 청구대상 운영사에 대해 청구금액을 계산함 (병행구간 / 최저보수구간 따로 계산)
    -----------------------------------------------------------------------------------*/

    -- 병행보수정보 가져오기
    v_errMsg := '병행보수정보 가져오기 실패 ['||p_cont_corp_id||']['||p_charge_date||']';
    SELECT *
      INTO v_WITH_FEE
      FROM biz20_fee_charge
     WHERE biz20_cont_corp_id = p_cont_corp_id
       AND biz20_charge_date  = p_charge_date
     LIMIT 1 ;

    -- 병행기간의 발생보수합계 가져오기
    v_errMsg := '병행기간의 발생보수합계 가져오기 실패 ['||p_cont_corp_id||']['||p_charge_date||']['||
                TO_CHAR(v_WITH_FEE.biz20_with_start_date,'yyyy-mm-dd')||']['||TO_CHAR(v_WITH_FEE.biz20_with_close_date,'yyyy-mm-dd')||']';
    SELECT SUM(biz21_occ_fee)
      INTO v_OCC_FEE_SUM
      FROM biz20_fee_charge
           INNER JOIN biz21_fee_charge_dtl ON biz21_fee_charge_id = biz20_fee_charge_id
     WHERE biz20_cont_corp_id = p_cont_corp_id
       AND biz20_charge_date  = p_charge_date
       AND biz21_occ_date BETWEEN v_WITH_FEE.biz20_with_start_date AND v_WITH_FEE.biz20_with_close_date;

    RAISE NOTICE '병행보수 : %, 발생보수 : %', v_WITH_FEE.biz20_with_fee, v_OCC_FEE_SUM ;

    v_DIFF_AMT := v_OCC_FEE_SUM - v_WITH_FEE.biz20_with_fee;

    RAISE NOTICE 'v_DIFF_AMT : %', v_DIFF_AMT ;

    -------------------------------------------------------------------------------------
    -- [발생보수 >= 병행보수]이면 청구보수 없음.
    IF v_DIFF_AMT >= 0 THEN
    
        RAISE NOTICE '차액이 -가 아니므로 청구보수 없음!!!';

        RAISE NOTICE '계산구간 : % ~ % ', TO_CHAR(v_WITH_FEE.biz20_calc_start_date,'yyyy-mm-dd'), TO_CHAR(v_WITH_FEE.biz20_calc_close_date,'yyyy-mm-dd');
        RAISE NOTICE '병행구간 : % ~ % ', TO_CHAR(v_WITH_FEE.biz20_with_start_date,'yyyy-mm-dd'), TO_CHAR(v_WITH_FEE.biz20_with_close_date,'yyyy-mm-dd');

        -- 계산구간과 병행구간이 다른경우 병행구간외 구간의 최저보수 확인해야함.
        IF v_WITH_FEE.biz20_calc_start_date = v_WITH_FEE.biz20_with_start_date AND
           v_WITH_FEE.biz20_calc_close_date = v_WITH_FEE.biz20_with_close_date THEN
            RAISE NOTICE '청구보수 없음!!';
            v_TARGET_YN := false;
        END IF;
    END IF;

    -------------------------------------------------------------------------------------
    -- 청구금액 존재시
    -------------------------------------------------------------------------------------
    IF v_TARGET_YN THEN
        v_errMsg := '청구금액 계산실패(1)';
        ---------------------------------------------------------------------------------
        -- 청구대상 건수 및 최저보수합계(분모) 가져오기
        SELECT SUM(CASE biz13_manage_type
                        WHEN '1' THEN biz12_manage_min_fee
                        WHEN '2' THEN biz12_adv_min_fee
                        WHEN '3' THEN biz12_discr_min_fee
                        ELSE 0 END)
              , COUNT(*)
          INTO v_MIN_FEE_SUM
             , v_CNT
          FROM biz20_fee_charge
               INNER JOIN biz13_with_corp    ON (     biz13_corp_id = biz20_corp_id
                                                  AND biz20_charge_date BETWEEN biz13_first_start_date AND COALESCE(biz13_last_close_date,'9999-12-31') )
               INNER JOIN biz11_cont_history ON biz11_cont_corp_id    = biz20_cont_corp_id
               INNER JOIN biz12_fee_info     ON biz12_cont_history_id = biz11_cont_history_id
         WHERE biz20_cont_corp_id = p_cont_corp_id
           AND biz20_charge_date  = p_charge_date
           AND biz20_target_yn    = 'true'
           AND biz11_reg_date IN ( SELECT MAX(biz11_reg_date)
                                     FROM biz11_cont_history
                                    WHERE biz11_cont_corp_id = p_cont_corp_id
                                      AND biz11_reg_date    <= p_charge_date );
        ---------------------------------------------------------------------------------
        -- 최저보수 비율로 청구금액 안분계산
        FOR v_DATA IN ( SELECT *
                             , CASE biz13_manage_type WHEN '1' THEN biz12_manage_min_fee
                                                      WHEN '2' THEN biz12_adv_min_fee
                                                      WHEN '3' THEN biz12_discr_min_fee
                                                      ELSE 0
                               END  AS min_fee
                          FROM biz20_fee_charge
                               INNER JOIN biz13_with_corp    ON (     biz13_corp_id = biz20_corp_id
                                                                  AND biz20_charge_date BETWEEN biz13_first_start_date AND COALESCE(biz13_last_close_date,'9999-12-31') )
                               INNER JOIN biz11_cont_history ON biz11_cont_corp_id    = biz20_cont_corp_id
                               INNER JOIN biz12_fee_info     ON biz12_cont_history_id = biz11_cont_history_id
                         WHERE biz11_reg_date IN ( SELECT MAX(biz11_reg_date)
                                                     FROM biz11_cont_history
                                                    WHERE biz11_cont_corp_id = biz20_cont_corp_id
                                                      AND biz11_reg_date    <= biz20_charge_date  )
                           AND biz13_cont_corp_id = p_cont_corp_id
                           AND biz20_charge_date  = p_charge_date
                           AND biz20_target_yn    = 'true'
        ) LOOP
            v_errMsg := '청구금액 계산실패(2)';
            -------------------------------------------------------------------------
            SELECT *
              INTO v_BIZ20
              FROM biz20_fee_charge
             WHERE biz20_fee_charge_id = v_DATA.biz20_fee_charge_id;
            -------------------------------------------------------------------------
            -- 병행기간내의 청구금액 SET
            -------------------------------------------------------------------------
            IF v_DIFF_AMT < 0 THEN
                IF v_CNT = 1 THEN
                    v_BIZ20.biz20_charge_fee := ABS(v_DIFF_AMT);
                ELSE
                    v_BIZ20.biz20_charge_fee := ROUND(ABS(v_DIFF_AMT) * (v_DATA.min_fee / v_MIN_FEE_SUM));
                END IF;
            ELSE
                v_BIZ20.biz20_charge_fee := 0;
            END IF;

            -------------------------------------------------------------------------
            -- 계산구간과 병행구간이 다른경우 병행구간외의 청구비용 계산!!
            -------------------------------------------------------------------------
            IF v_DATA.biz20_calc_start_date != v_DATA.biz20_with_start_date OR
               v_DATA.biz20_calc_close_date != v_DATA.biz20_with_close_date THEN
                ---------------------------------------------------------------------
                v_errMsg := '청구금액 계산실패(3)';

                -- 병행보수기간을 제외한 최저보수기간 SET
                IF v_DATA.biz20_calc_start_date < v_DATA.biz20_with_start_date THEN
                    v_BIZ20.biz20_min_start_date := v_DATA.biz20_calc_start_date;
                    v_BIZ20.biz20_min_close_date := f_get_date(v_DATA.biz20_with_start_date, -1);
                ELSE
                    v_BIZ20.biz20_min_start_date := f_get_date(v_DATA.biz20_with_close_date, +1);
                    v_BIZ20.biz20_min_close_date := v_DATA.biz20_calc_close_date;
                END IF;

                -- 최저보수기간은 최초업무시작일~최종업무종료일 사이어야한다.
                IF v_BIZ20.biz20_min_start_date < v_DATA.biz13_first_start_date THEN
                    v_BIZ20.biz20_min_start_date := v_DATA.biz13_first_start_date;
                END IF;
                IF v_BIZ20.biz20_min_close_date > COALESCE(v_DATA.biz13_last_close_date,'9999-12-31') THEN
                    v_BIZ20.biz20_min_close_date := v_DATA.biz13_last_close_date;
                END IF;
                ---------------------------------------------------------------------
                -- 최저보수 기간의 최저보수 계산
                v_BIZ20.biz20_min_days := f_get_datedif(v_BIZ20.biz20_min_start_date, v_BIZ20.biz20_min_close_date, 'D') + 1;
                v_BIZ20.biz20_min_fee  := TRUNC(v_DATA.min_fee * (v_BIZ20.biz20_min_days / v_DATA.biz20_calc_days));
                ---------------------------------------------------------------------
                -- 최저보수 기간의 발생보수 가져오기
                v_errMsg := '청구금액 계산실패(4)';
                SELECT SUM(biz21_occ_fee)
                  INTO v_OCC_FEE_SUM
                  FROM biz21_fee_charge_dtl
                 WHERE biz21_fee_charge_id = v_DATA.biz20_fee_charge_id
                   AND biz21_occ_date BETWEEN v_BIZ20.biz20_min_start_date AND v_BIZ20.biz20_min_close_date;
                ---------------------------------------------------------------------
                -- 청구보수 SET = 병행기간의 청구금액 + 최저보수기간의 청구금액
                IF v_BIZ20.biz20_min_fee > v_OCC_FEE_SUM THEN
                    v_BIZ20.biz20_charge_fee := v_BIZ20.biz20_charge_fee + (v_BIZ20.biz20_min_fee - v_OCC_FEE_SUM);
                ELSE
                    -- 최저보수 청구금액이 없고, 병행보수 청구금액도 없으므로 청구대상이 아님!!
                    IF v_BIZ20.biz20_charge_fee = 0 THEN
                        v_BIZ20.biz20_target_yn := 'false';
                    END IF;
                END IF;
            END IF;
            -------------------------------------------------------------------------
            v_errMsg := '청구금액 UPDATE 실패 ['||v_BIZ20.biz20_fee_charge_id||']';
            UPDATE biz20_fee_charge
               SET biz20_target_yn      = v_BIZ20.biz20_target_yn
                 , biz20_charge_fee     = v_BIZ20.biz20_charge_fee
                 , biz20_min_start_date = v_BIZ20.biz20_min_start_date
                 , biz20_min_close_date = v_BIZ20.biz20_min_close_date
                 , biz20_min_days       = v_BIZ20.biz20_min_days
                 , biz20_min_fee        = v_BIZ20.biz20_min_fee
             WHERE biz20_fee_charge_id = v_BIZ20.biz20_fee_charge_id;
        END LOOP;

    -------------------------------------------------------------------------------------
    -- 청구금액 없음!!!
    -------------------------------------------------------------------------------------
    ELSE
        UPDATE biz20_fee_charge
           SET biz20_target_yn  = 'false'
             , biz20_charge_fee = 0
             , biz20_tax        = 0
         WHERE biz20_cont_corp_id = p_cont_corp_id
           AND biz20_charge_date  = p_charge_date;
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
