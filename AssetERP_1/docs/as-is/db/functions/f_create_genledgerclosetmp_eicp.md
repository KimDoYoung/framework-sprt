# f_create_genledgerclosetmp_eicp

## FUNCTION public.f_create_genledgerclosetmp_eicp(p_company_id numeric, p_date date)

- 반환: `character varying`
- 줄 수: 107

```sql
CREATE OR REPLACE FUNCTION public.f_create_genledgerclosetmp_eicp(p_company_id numeric, p_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    C01                 RECORD;

    v_PL_ACCOUNT_CD     VARCHAR(10) := '1200000000'; -- 당기순손익
    v_EICP_ACCOUNT_CD   VARCHAR(10) := '7507000000'; -- 미처분이익잉여금

    v_ADD_AMT           NUMERIC;
    v_CNT               NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 가결산원장 미처분이익잉여금 SET
    -- (당기순손익(1200000000) => 미처분이익잉여금(7507000000)" 계정대체)
    -------------------------------------------------------------------------------------
    -- 타이거자산운용(202602068093742) 예외처리
    IF p_company_id = 202602068093742 THEN
        v_PL_ACCOUNT_CD     := '99990'; -- 당기순손익
        v_EICP_ACCOUNT_CD   := '37700'; -- 미처분이익잉여금
    END IF;

    -------------------------------------------------------------------------------------
    -- 당기순손익(1200000000) 가져오기
    SELECT (act07_dr_today_bal_amt - act07_cr_today_bal_amt)
            * CASE WHEN act01_attribute_cd IN ('1','5','9') THEN 1 ELSE -1 END
      INTO v_ADD_AMT
      FROM act07_gen_ledger_closetmp
           INNER JOIN act01_account_code ON ( act01_company_id = act07_company_id AND
                                              act01_account_cd = act07_account_cd )
     WHERE act07_company_id  = p_company_id
       AND act07_std_date    = p_date
       AND act07_account_cd  = v_PL_ACCOUNT_CD;

    -------------------------------------------------------------------------------------
    -- 미처분이익잉여금 ADD 및 상위계정 정리
    FOR C01 IN ( WITH RECURSIVE act_list ( act01_account_cd
                                         , act01_parent_cd
                                         , act01_level )
                 AS ( SELECT act01_account_cd
                           , act01_parent_cd
                           , 0
                        FROM act01_account_code
                       WHERE act01_company_id = p_company_id
                         AND act01_account_cd = v_EICP_ACCOUNT_CD
                         AND COALESCE(act01_use_yn,'false') = 'true'
                       UNION ALL
                      SELECT a.act01_account_cd
                           , a.act01_parent_cd
                           , b.act01_level + 1
                        FROM act01_account_code a
                           , act_list b
                       WHERE a.act01_company_id = p_company_id
                         AND a.act01_account_cd = b.act01_parent_cd
                         AND COALESCE(a.act01_use_yn,'false') = 'true'
                 )
                 SELECT act_list.act01_level
                      , t.*
                   FROM act_list
                        INNER JOIN act01_account_code t ON ( t.act01_company_id = p_company_id               AND
                                                             t.act01_account_cd = act_list.act01_account_cd  )
                  ORDER BY act01_level ASC
    ) LOOP
        ---------------------------------------------------------------------------------
        SELECT COUNT(*)
          INTO v_CNT
          FROM act07_gen_ledger_closetmp
         WHERE act07_company_id = p_company_id
           AND act07_std_date   = p_date
           AND act07_account_cd = C01.act01_account_cd;

        IF v_CNT = 0 THEN
            INSERT
              INTO act07_gen_ledger_closetmp
            SELECT f_create_seq()
                 , f_create_seq()
                 , p_company_id
                 , p_date
                 , C01.act01_account_cd
                 , 0                    /* 차변당일잔액 */
                 , 0                    /* 차변당일증감액 */
                 , 0                    /* 차변전일잔액 */
                 , v_ADD_AMT            /* 대변당일잔액 */
                 , v_ADD_AMT            /* 대변당일증감액 */
                 , 0                    /* 대변전일잔액 */
                 , f_sysdate()
                 , null;
        ELSE
            UPDATE act07_gen_ledger_closetmp
               SET act07_cr_today_bal_amt  = act07_cr_preday_bal_amt + act07_cr_today_diff_amt + v_ADD_AMT
                 , act07_cr_today_diff_amt = act07_cr_today_diff_amt + v_ADD_AMT
             WHERE act07_company_id = p_company_id
               AND act07_std_date   = p_date
               AND act07_account_cd = C01.act01_account_cd;
        END IF;
    END LOOP;
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN SQLERRM;
END;
$function$
```
