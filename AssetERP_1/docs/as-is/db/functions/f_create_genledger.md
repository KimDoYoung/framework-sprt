# f_create_genledger

## FUNCTION public.f_create_genledger(p_company_id numeric, p_fromdate date, p_todate date)

- 반환: `character varying`
- 줄 수: 234

```sql
CREATE OR REPLACE FUNCTION public.f_create_genledger(p_company_id numeric, p_fromdate date, p_todate date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_SYS12         sys12_calendar%ROWTYPE;
    v_ACT04         act04_gen_ledger%ROWTYPE;
    v_CLOSE_DATE    DATE;
    v_ACT           RECORD;
    v_CNT           NUMERIC;
    v_DEL_ROW       NUMERIC;
    v_errMsg        VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '계정원장 정리 실패 ['||p_company_id||']['||p_fromDate||']['||p_toDate||']';

    RAISE NOTICE 'IN) p_company_id : %', p_company_id;
    RAISE NOTICE 'IN) p_fromDate   : %', p_fromDate;
    RAISE NOTICE 'IN) p_toDate     : %', p_toDate;

    -------------------------------------------------------------------------------------
    --  원장정리
    -------------------------------------------------------------------------------------
    -- 정리전 마감여부 체크
    v_errMsg := '정리전 마감여부 체크시 오류발생';
    SELECT TO_CHAR(MIN(act05_std_date),'yyyy-mm-dd')
      INTO v_CLOSE_DATE
      FROM act05_gen_ledger_close
     WHERE act05_company_id = p_company_id
       AND act05_std_date  >= p_fromDate;

    IF v_CLOSE_DATE IS NOT NULL THEN
        v_errMsg := v_CLOSE_DATE||'의 계정원장이 마감되었습니다.';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    v_errMsg := '계정원장 삭제 실패 ['||p_fromDate||']['||p_toDate||']';
    DELETE
      FROM act04_gen_ledger
     WHERE act04_company_id = p_company_id
       AND act04_std_date BETWEEN p_fromDate AND p_toDate;

    GET DIAGNOSTICS v_DEL_ROW := ROW_COUNT;
    RAISE NOTICE '원장정리 완료 (deleteRows : %)', v_DEL_ROW;
    -------------------------------------------------------------------------------------
    FOR v_SYS12 IN ( SELECT *
                       FROM sys12_calendar
                      WHERE sys12_company_id = p_company_id
                        AND sys12_day BETWEEN p_fromDate AND p_toDate
                      ORDER BY sys12_day
    ) LOOP
        ---------------------------------------------------------------------------------
        --  1. 기준일원장 최하위계정 당일증감분, 전일잔액 생성
        ---------------------------------------------------------------------------------
        v_errMsg := '기준일원장 최하위계정 당일증감분, 전일잔액 생성실패 ['||v_SYS12.sys12_day||']';
        INSERT
          INTO act04_gen_ledger
        SELECT f_create_seq()
             , v_SYS12.sys12_company_id
             , v_SYS12.sys12_day
             , account_cd
             , 0
             , SUM(dr_today_diff_amt)
             , SUM(dr_preday_bal_amt)
             , 0
             , SUM(cr_today_diff_amt)
             , SUM(cr_preday_bal_amt)
             , f_sysdate()
             , ast_id
          FROM (
                 -- 전일잔액
                 SELECT act04_account_cd                                                                                as account_cd
                      , 0                                                                                               as dr_today_diff_amt
                      , CASE WHEN (act04_std_date = f_get_account_close_date(act04_company_id, act04_std_date, 0) AND
                                   act01_attribute_cd IN ('4','5')                                                )
                             THEN 0
                             ELSE act04_dr_today_bal_amt END                                                            as dr_preday_bal_amt
                      , 0                                                                                               as cr_today_diff_amt
                      , CASE WHEN (act04_std_date = f_get_account_close_date(act04_company_id, act04_std_date, 0) AND
                                   act01_attribute_cd IN ('4','5')                                                )
                             THEN 0
                             ELSE act04_cr_today_bal_amt END                                                            as cr_preday_bal_amt
                      , act04_ast_class_tree_id                                                                         as ast_id
                   FROM act04_gen_ledger
                        INNER JOIN act01_account_code ON ( act01_account_cd = act04_account_cd         AND
                                                           act01_company_id = v_SYS12.sys12_company_id AND
                                                           act01_slip_yn    = 'true'                   AND
                                                           act01_use_yn     = 'true'                   )
                  WHERE act04_company_id = v_SYS12.sys12_company_id
                    AND act04_std_date   = f_get_date(v_SYS12.sys12_day::date, -1)
                  UNION ALL
                 -- 차변당일증감
                 SELECT act03_dr_account_cd         as account_cd
                      , act03_dr_amt                as dr_today_diff_amt
                      , 0                           as dr_preday_bal_amt
                      , 0                           as cr_today_diff_amt
                      , 0                           as cr_preday_bal_amt
                      , COALESCE(act03_dr_ast_id,0) as ast_id
                   FROM act02_journal
                        INNER JOIN act03_journal_dtl ON act03_journal_id = act02_journal_id
                  WHERE act02_company_id = v_SYS12.sys12_company_id
                    AND act02_date       = v_SYS12.sys12_day
                    AND act03_dr_account_cd IS NOT NULL
                  UNION ALL
                 -- 대변당일증감
                 SELECT act03_cr_account_cd         as account_cd
                      , 0                           as dr_today_diff_amt
                      , 0                           as dr_preday_bal_amt
                      , act03_cr_amt                as cr_today_diff_amt
                      , 0                           as cr_preday_bal_amt
                      , COALESCE(act03_cr_ast_id,0) as ast_id
                   FROM act02_journal
                        INNER JOIN act03_journal_dtl ON act03_journal_id = act02_journal_id
                  WHERE act02_company_id = v_SYS12.sys12_company_id
                    AND act02_date       = v_SYS12.sys12_day
                    AND act03_cr_account_cd IS NOT NULL
               ) a
         GROUP BY account_cd, ast_id;
        RAISE NOTICE '기준일원장 최하위계정 당일증감분, 전일잔액 생성성공!!!';
        ---------------------------------------------------------------------------------
        -- 2. 상위계정 집계
        ---------------------------------------------------------------------------------
        v_errMsg := '상위계정 집계실패 ['||v_SYS12.sys12_day||']';
        FOR v_ACT04 IN ( SELECT *
                           FROM act04_gen_ledger
                          WHERE act04_company_id = v_SYS12.sys12_company_id
                            AND act04_std_date   = v_SYS12.sys12_day
                          ORDER BY act04_account_cd
        ) LOOP
            --RAISE NOTICE '상위집계 IN!!!...%', v_ACT04.act04_account_cd;
            v_errMsg := '상위계정 집계실패...['||v_SYS12.sys12_day||']['||v_ACT04.act04_account_cd||']';
            -----------------------------------------------------------------------------
            FOR v_ACT IN ( WITH RECURSIVE act_list ( act01_account_cd
                                                   , act01_parent_cd
                           ) AS (
                                   /** 시작 조건 */
                                   SELECT act01_account_cd
                                        , act01_parent_cd
                                     FROM act01_account_code
                                    WHERE act01_company_id = v_ACT04.act04_company_id
                                      AND act01_account_cd = v_ACT04.act04_account_cd
                                    UNION
                                   /** 상위 데이터 반복 */
                                   SELECT a.act01_account_cd
                                        , a.act01_parent_cd
                                     FROM act01_account_code a
                                        , act_list b 
                                    WHERE 1=1
                                      AND a.act01_company_id = v_ACT04.act04_company_id
                                      AND a.act01_account_cd = b.act01_parent_cd
                                      AND a.act01_use_yn     = 'true'
                           )
                           SELECT *
                             FROM act_list
                            WHERE act01_account_cd != v_ACT04.act04_account_cd
            ) LOOP
                --RAISE NOTICE '상위집계 LOOP IN!!!...%', v_ACT.act01_account_cd;
                v_errMsg := '상위계정 집계실패...LOOP IN ['||v_SYS12.sys12_day||']['||v_ACT.act01_account_cd||']';
                -------------------------------------------------------------------------
                WITH upsert AS (
                    UPDATE act04_gen_ledger
                       SET act04_dr_today_diff_amt = act04_dr_today_diff_amt + v_ACT04.act04_dr_today_diff_amt
                         , act04_dr_preday_bal_amt = act04_dr_preday_bal_amt + v_ACT04.act04_dr_preday_bal_amt
                         , act04_cr_today_diff_amt = act04_cr_today_diff_amt + v_ACT04.act04_cr_today_diff_amt
                         , act04_cr_preday_bal_amt = act04_cr_preday_bal_amt + v_ACT04.act04_cr_preday_bal_amt
                     WHERE act04_company_id = v_ACT04.act04_company_id
                       AND act04_std_date   = v_ACT04.act04_std_date
                       AND act04_account_cd = v_ACT.act01_account_cd
                     RETURNING *
                )
                    INSERT
                      INTO act04_gen_ledger
                    SELECT f_create_seq()
                         , v_ACT04.act04_company_id
                         , v_ACT04.act04_std_date
                         , v_ACT.act01_account_cd
                         , 0
                         , v_ACT04.act04_dr_today_diff_amt
                         , v_ACT04.act04_dr_preday_bal_amt
                         , 0
                         , v_ACT04.act04_cr_today_diff_amt
                         , v_ACT04.act04_cr_preday_bal_amt
                         , f_sysdate()
                         , 0
                     WHERE NOT EXISTS ( SELECT * FROM upsert );
            END LOOP;
        END LOOP;
        RAISE NOTICE '상위계정 집계 성공!!!';
        ---------------------------------------------------------------------------------
        --  3. 당일잔액SET
        ---------------------------------------------------------------------------------
        -- 차변
        v_errMsg := '차변 당일잔액SET 실패 ['||v_SYS12.sys12_day||']';
        UPDATE act04_gen_ledger
           SET act04_dr_today_bal_amt = (act04_dr_preday_bal_amt + act04_dr_today_diff_amt) 
                                      - (act04_cr_preday_bal_amt + act04_cr_today_diff_amt)
         WHERE act04_company_id = v_SYS12.sys12_company_id
           AND act04_std_date   = v_SYS12.sys12_day
           AND act04_account_cd IN ( SELECT act01_account_cd
                                       FROM act01_account_code
                                      WHERE act01_company_id = v_SYS12.sys12_company_id
                                        AND act01_use_yn     = 'true'
                                        AND act01_drcr_type  = 'D' );
        RAISE NOTICE '차변 당일잔액SET 성공!!!';
        ---------------------------------------------------------------------------------
        -- 대변
        v_errMsg := '대변 당일잔액SET 실패 ['||v_SYS12.sys12_day||']';
        UPDATE act04_gen_ledger
           SET act04_cr_today_bal_amt = (act04_cr_preday_bal_amt + act04_cr_today_diff_amt) 
                                      - (act04_dr_preday_bal_amt + act04_dr_today_diff_amt)
         WHERE act04_company_id = v_SYS12.sys12_company_id
           AND act04_std_date   = v_SYS12.sys12_day
           AND act04_account_cd IN ( SELECT act01_account_cd
                                       FROM act01_account_code
                                      WHERE act01_company_id = v_SYS12.sys12_company_id
                                        AND act01_use_yn     = 'true'
                                        AND act01_drcr_type  = 'C' );
        RAISE NOTICE '대변 당일잔액SET 성공!!!';
    END LOOP;
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
