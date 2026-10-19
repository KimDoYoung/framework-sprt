# f_calc_dual_fund_fee

## FUNCTION public.f_calc_dual_fund_fee(p_company_id numeric, p_corp_cd character varying, p_fund_cd character varying, p_std_date date, p_fee numeric)

- 반환: `numeric`
- 줄 수: 98

```sql
CREATE OR REPLACE FUNCTION public.f_calc_dual_fund_fee(p_company_id numeric, p_corp_cd character varying, p_fund_cd character varying, p_std_date date, p_fee numeric)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_BIZ17             biz17_dual_manage_fund%ROWTYPE;
    c01                 RECORD;

    v_MAIN_FEE          NUMERIC ;
    v_SUB_FEE           NUMERIC ;

    v_KFS_CORP_CD       NUMERIC := 1 ;  --(1:한국펀드서비스)
    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    --v_KFS_CORP_CD := 28000; --개발계에서 처리를 위해 임시로 바꿈
    -------------------------------------------------------------------------------------

    -------------------------------------------------------------------------------------
    IF p_company_id != v_KFS_CORP_CD THEN
        RETURN p_fee;
    END IF;
    -------------------------------------------------------------------------------------
    -- 이관펀드(출) 체크
    v_errMsg := '이관펀드(출) 체크 실패 ['||p_company_id||']['||p_corp_cd||']['||p_fund_cd||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']';
    FOR c01 IN ( SELECT *
                   FROM ast33_fund_trans
                        INNER JOIN sys15_corp ON ( sys15_company_id = ast33_company_id   AND
                                                   sys15_corp_id    = ast33_corp_id      )
                  WHERE ast33_company_id     = p_company_id
                    AND sys15_corp_cd        = p_corp_cd
                    AND ast33_fund_cd        = p_fund_cd
    ) LOOP
        --(1:이관(출))
        IF c01.ast33_fund_trans_cd = '1' THEN
            IF COALESCE(c01.ast33_date,'9999-12-31') <= p_std_date THEN
                RETURN 0;
            END IF;

        --(2:이관(입))
        ELSE
            IF COALESCE(c01.ast33_date, '1900-01-01') > p_std_date THEN
                RETURN 0;
            END IF;
        END IF;
    END LOOP;
    -------------------------------------------------------------------------------------
    RAISE NOTICE '이중사무펀드 보수율 가져오기 : [p_corp_cd:%],[p_fund_cd:%]', p_corp_cd, p_fund_cd;

    -- 이중사무펀드 보수율 가져오기
    v_errMsg := '이중사무펀드 보수율 가져오기 실패 ['||p_company_id||']['||p_corp_cd||']['||p_fund_cd||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']['||p_fee||']';
    SELECT *
      INTO v_BIZ17
      FROM biz17_dual_manage_fund
     WHERE biz17_company_id  = p_company_id
       AND biz17_fund_cd     = p_fund_cd
       AND biz17_start_date <= p_std_date
       AND biz17_cont_corp_id IN ( SELECT DISTINCT biz13_cont_corp_id
                                     FROM biz13_with_corp
                                          INNER JOIN sys15_corp ON sys15_corp_id = biz13_corp_id
                                    WHERE biz13_company_id  = biz17_company_id
                                      AND biz13_manage_type = '1'      --(1:자산운용)
                                      AND sys15_corp_cd     = p_corp_cd )
     ORDER BY biz17_start_date DESC
     LIMIT 1;

    IF v_BIZ17.biz17_dual_manage_fund_id IS NULL THEN
        RAISE NOTICE '이중사무펀드 보수율정보 NO_DATA... return fee[%]', p_fee;
        RETURN p_fee;
    END IF;

    RAISE NOTICE '[%] / [%]', v_BIZ17.biz17_fund_sub_fee, v_BIZ17.biz17_fund_fee;

    -------------------------------------------------------------------------------------
    v_errMsg := '실보수 계산 실패 ['||p_fee||']['||v_BIZ17.biz17_fund_sub_fee||']['||v_BIZ17.biz17_fund_fee||']';
    v_SUB_FEE := TRUNC(p_fee * (COALESCE(v_BIZ17.biz17_fund_sub_fee,0) / COALESCE(v_BIZ17.biz17_fund_fee,1)));
    v_MAIN_FEE := p_fee - v_SUB_FEE;

    RAISE NOTICE 'v_SUB_FEE [%] / v_MAIN_FEE[%]', v_SUB_FEE, v_MAIN_FEE;
    RAISE NOTICE '[%] / [%]', v_BIZ17.biz17_fund_sub_fee, v_BIZ17.biz17_fund_fee;
    -------------------------------------------------------------------------------------
    IF v_BIZ17.biz17_position_type = '1' THEN
        RETURN v_MAIN_FEE;
    ELSIF v_BIZ17.biz17_position_type = '2' THEN
        RETURN v_SUB_FEE;
    ELSE
        RETURN p_fee;
    END IF;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - % (%)', v_errMsg, SQLERRM ;
    RETURN 0;
END;
$function$
```
