# f_get_floortrrcntbuydate

## FUNCTION public.f_get_floortrrcntbuydate(p_company_id numeric, p_person_id numeric, p_account_id numeric, p_item_type character varying, p_item_nm character varying, p_item_cd character varying, p_std_date date, p_expect_yn boolean)

- 반환: `date`
- 줄 수: 104

```sql
CREATE OR REPLACE FUNCTION public.f_get_floortrrcntbuydate(p_company_id numeric, p_person_id numeric, p_account_id numeric, p_item_type character varying, p_item_nm character varying, p_item_cd character varying, p_std_date date, p_expect_yn boolean)
 RETURNS date
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_MIN_DATE      DATE;
    v_RCNT_BUY_DATE DATE;
    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 최근 정기보고일 GET
    SELECT MAX(apr01_effect_date)
      INTO v_MIN_DATE
      FROM apr01_appr
     WHERE apr01_company_id    = p_company_id
       AND apr01_reg_emp_id    = p_person_id
       AND apr01_effect_date  <= p_std_date
       AND apr01_status_cd NOT IN ('40','99')  --(40:반려/99:임시저장)
       AND apr01_class_tree_id IN ( SELECT dcr30_class_tree_id
                                      FROM dcr30_link
                                     WHERE dcr30_company_id = apr01_company_id
                                       AND dcr30_link_cd    = 'A09' );  /* (A09:자기매매 실거래 보고) */
    IF v_MIN_DATE IS NULL THEN
        v_MIN_DATE := '1900-01-01';
    END IF;
    -------------------------------------------------------------------------------------
    -- 최근 매수일 GET
    SELECT MAX(buy_date)
      INTO v_RCNT_BUY_DATE
      FROM (
             SELECT MAX(flt10_tr_date) buy_date
               FROM flt10_tr
                    INNER JOIN flt05_item_type ON ( flt05_company_id   = flt10_company_id       AND
                                                    flt05_item_type_cd = flt10_tr_item_type     AND
                                                    flt05_start_date   = ( SELECT MAX(flt05_start_date)
                                                                             FROM flt05_item_type
                                                                            WHERE flt05_company_id   = flt10_company_id
                                                                              AND flt05_item_type_cd = flt10_tr_item_type
                                                                              AND flt05_start_date  <= flt10_tr_date ) )
              WHERE flt10_company_id    = p_company_id
                AND flt10_person_id     = p_person_id
                AND flt10_account_id    = p_account_id
                AND flt10_tr_item_type  = p_item_type
                AND ( ( COALESCE(flt05_stk_price_yn,'false')  = 'true' AND flt10_tr_item_cd = p_item_cd ) OR
                      ( COALESCE(flt05_stk_price_yn,'false') != 'true' AND flt10_tr_item_nm = p_item_nm ) )
                AND flt10_tr_date      <= p_std_date
                AND flt10_tr_type       = '10I'  --(10I:매수)
              UNION
             SELECT MAX(flt10_reg_date) buy_date
               FROM flt10_tr
                    INNER JOIN flt05_item_type ON ( flt05_company_id   = flt10_company_id       AND
                                                    flt05_item_type_cd = flt10_item_type        AND
                                                    flt05_start_date   = ( SELECT MAX(flt05_start_date)
                                                                             FROM flt05_item_type
                                                                            WHERE flt05_company_id   = flt10_company_id
                                                                              AND flt05_item_type_cd = flt10_item_type
                                                                              AND flt05_start_date  <= flt10_reg_date ) )
                    INNER JOIN apr01_appr ON ( apr01_appr_id   = flt10_expect_appr_id   AND
                                               apr01_status_cd NOT IN ('99','40')       ) --(임시저장,반려)
              WHERE flt10_company_id    = p_company_id
                AND flt10_person_id     = p_person_id
                AND flt10_account_id    = p_account_id
                AND flt10_item_type     = p_item_type
                AND ( ( COALESCE(flt05_stk_price_yn,'false')  = 'true' AND flt10_item_cd = p_item_cd ) OR
                      ( COALESCE(flt05_stk_price_yn,'false') != 'true' AND flt10_item_nm = p_item_nm ) )
                AND flt10_reg_date      BETWEEN v_MIN_DATE AND p_std_date
                AND flt10_tr_type       = '10I'                 --(10I:매수)
                AND COALESCE(flt10_unfill_yn,'false') != 'true' --미체결 사전신고거래 제외
                AND COALESCE(p_expect_yn,'false') = 'true'
           ) t;
    -------------------------------------------------------------------------------------
    -- 최근 매수일이 없는 경우 최초매수일 SET
    IF v_RCNT_BUY_DATE IS NULL THEN
        ---------------------------------------------------------------------------------
        SELECT flt11_init_buy_date
          INTO v_RCNT_BUY_DATE
          FROM flt11_book
               INNER JOIN flt05_item_type ON ( flt05_company_id   = flt11_company_id       AND
                                               flt05_item_type_cd = flt11_item_type        AND
                                               flt05_start_date   = ( SELECT MAX(flt05_start_date)
                                                                        FROM flt05_item_type
                                                                       WHERE flt05_company_id   = flt11_company_id
                                                                         AND flt05_item_type_cd = flt11_item_type
                                                                         AND flt05_start_date  <= p_std_date ) )
         WHERE flt11_company_id = p_company_id
           AND flt11_person_id  = p_person_id
           AND flt11_account_id = p_account_id
           AND flt11_item_type  = p_item_type
           AND ( ( COALESCE(flt05_stk_price_yn,'false')  = 'true' AND flt11_item_cd = p_item_cd ) OR
                 ( COALESCE(flt05_stk_price_yn,'false') != 'true' AND flt11_item_nm = p_item_nm ) )
           AND flt11_book_date <= p_std_date
         ORDER BY flt11_book_date DESC
         LIMIT 1;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_RCNT_BUY_DATE;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
