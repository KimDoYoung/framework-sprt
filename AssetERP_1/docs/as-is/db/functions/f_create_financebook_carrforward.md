# f_create_financebook_carrforward

## FUNCTION public.f_create_financebook_carrforward(p_company_id numeric, p_ast_class_tree_id numeric, p_account_id numeric, p_date date)

- 반환: `character varying`
- 줄 수: 190

```sql
CREATE OR REPLACE FUNCTION public.f_create_financebook_carrforward(p_company_id numeric, p_ast_class_tree_id numeric, p_account_id numeric, p_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '원장이월 실패';

    -- 원장이월(결산원장 존재시엔 결산원장에서 이월)
    INSERT
      INTO ast09_book
    SELECT f_create_seq()
         , p_date as ast09_hold_date
         , ast09_ast_class_tree_id
         , ast09_keep_account_id
         , ast09_hold_qty
         , ast09_pur_amt
         , ast09_book_amt
         , ast09_eval_amt
         , ast09_eval_pl
         , ast09_first_pur_amt
         , ast09_first_pur_date
         , ast09_company_id
         , ast09_for_pur_amt
         , ast09_for_book_amt
         , ast09_for_eval_amt
         , ast09_for_eval_pl
         , ast09_fx_pl
         , ast09_book_end_yn
         , ast09_acr_int_amt
         , ast09_for_acr_int_amt
         , ast09_oci
         , ast09_for_oci
         , ast09_lock_up_period_cd
         , ast09_lock_up_date
         , ast09_lock_up_qty
      FROM (
             SELECT ast09_hold_date
                  , ast09_ast_class_tree_id
                  , ast09_keep_account_id
                  , ast09_hold_qty
                  , ast09_pur_amt
                  -----------------------------------------------------------------------
                  , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                         THEN (CASE WHEN ast01_eval_type = '2' THEN ast09_book_amt ELSE ast09_eval_amt END)
                         ELSE ast09_book_amt END ast09_book_amt
                  -----------------------------------------------------------------------
                  , ast09_eval_amt
                  -----------------------------------------------------------------------
                  , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                         THEN 0
                         ELSE ast09_eval_pl END ast09_eval_pl
                  -----------------------------------------------------------------------
                  , ast09_first_pur_amt
                  , ast09_first_pur_date
                  , ast09_company_id
                  , ast09_for_pur_amt
                  -----------------------------------------------------------------------
                  , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                         THEN (CASE WHEN ast01_eval_type = '2' THEN ast09_for_book_amt ELSE ast09_for_eval_amt END)
                         ELSE ast09_for_book_amt END ast09_for_book_amt
                  -----------------------------------------------------------------------
                  , ast09_for_eval_amt
                  -----------------------------------------------------------------------
                  , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                         THEN 0
                         ELSE ast09_for_eval_pl END ast09_for_eval_pl
                  -----------------------------------------------------------------------
                  , CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                         THEN 0
                         ELSE ast09_fx_pl END ast09_fx_pl
                  -----------------------------------------------------------------------
                  , COALESCE(ast09_book_end_yn,'false') ast09_book_end_yn
                  -----------------------------------------------------------------------
                  , ast09_acr_int_amt
                  , ast09_for_acr_int_amt
                  -----------------------------------------------------------------------
                  , CASE WHEN COALESCE(ast01_account_type,'99') IN ('20','41','42') -- 회계구분이 '20:기타포괄손익(OCI)/41:지분법-연결/42:지분법-비연결'인 경우
                         THEN (CASE WHEN ast01_eval_type = '2' THEN 0
                                    ELSE COALESCE(ast09_oci,0) + (CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                                                                       THEN ast09_eval_pl
                                                                       ELSE 0 END)
                               END)
                         ELSE 0 END ast09_oci
                  -----------------------------------------------------------------------
                  , CASE WHEN COALESCE(ast01_account_type,'99') IN ('20','41','42') -- 회계구분이 '20:기타포괄손익(OCI)/41:지분법-연결/42:지분법-비연결'인 경우
                         THEN (CASE WHEN ast01_eval_type = '2' THEN 0
                                    ELSE COALESCE(ast09_for_oci,0) + (CASE WHEN f_get_account_close_date(ast09_company_id, ast09_hold_date, 0) = ast09_hold_date
                                                                           THEN ast09_for_eval_pl
                                                                           ELSE 0 END)
                               END)
                         ELSE 0 END ast09_for_oci
                  -----------------------------------------------------------------------
                  , ast09_lock_up_period_cd
                  , ast09_lock_up_date
                  , COALESCE(ast09_lock_up_qty,0) ast09_lock_up_qty
                  -----------------------------------------------------------------------
               FROM ast09_book
                    INNER JOIN ast01_class_tree ON ast01_class_tree_id = ast09_ast_class_tree_id
              WHERE ast09_company_id         = p_company_id
                AND ast09_ast_class_tree_id  = p_ast_class_tree_id
                AND ast09_keep_account_id    = p_account_id
                AND ast09_hold_date          < p_date
                AND NOT EXISTS ( SELECT 1
                                   FROM ast11_book_close
                                  WHERE ast11_company_id        = ast09_company_id
                                    AND ast11_ast_class_tree_id = ast09_ast_class_tree_id
                                    AND ast11_keep_account_id   = ast09_keep_account_id
                                    AND ast11_hold_date         = ast09_hold_date )
              UNION ALL
             SELECT ast11_hold_date
                  , ast11_ast_class_tree_id
                  , ast11_keep_account_id
                  , ast11_hold_qty
                  , ast11_pur_amt
                  , ast11_book_amt
                  , ast11_eval_amt
                  , ast11_eval_pl
                  , ast11_first_pur_amt
                  , ast11_first_pur_date
                  , ast11_company_id
                  , ast11_for_pur_amt
                  , ast11_for_book_amt
                  , ast11_for_eval_amt
                  , ast11_for_eval_pl
                  , ast11_fx_pl
                  , ast11_book_end_yn
                  , ast11_acr_int_amt
                  , ast11_for_acr_int_amt
                  , ast11_oci
                  , ast11_for_oci
                  , ast11_lock_up_period_cd
                  , ast11_lock_up_date
                  , ast11_lock_up_qty
               FROM ast11_book_close
              WHERE ast11_company_id         = p_company_id
                AND ast11_ast_class_tree_id  = p_ast_class_tree_id
                AND ast11_keep_account_id    = p_account_id
                AND ast11_hold_date          < p_date
              UNION ALL
            /* (2023.09.12 CYY - 신규고객사 초기원장 SET) */
             SELECT ast14_hold_date             
                  , ast14_ast_class_tree_id     
                  , ast14_keep_account_id       
                  , ast14_hold_qty              
                  , ast14_pur_amt               
                  , ast14_book_amt              
                  , ast14_eval_amt              
                  , ast14_eval_pl               
                  , ast14_first_pur_amt         
                  , ast14_first_pur_date        
                  , ast14_company_id            
                  , ast14_for_pur_amt           
                  , ast14_for_book_amt          
                  , ast14_for_eval_amt          
                  , ast14_for_eval_pl           
                  , ast14_fx_pl                 
                  , ast14_book_end_yn           
                  , ast14_acr_int_amt           
                  , ast14_for_acr_int_amt       
                  , ast14_oci                   
                  , ast14_for_oci               
                  , ast14_lock_up_period_cd     
                  , ast14_lock_up_date          
                  , ast14_lock_up_qty           
               FROM ast14_book_init
              WHERE ast14_company_id         = p_company_id
                AND ast14_ast_class_tree_id  = p_ast_class_tree_id
                AND ast14_keep_account_id    = p_account_id
                AND ast14_hold_date          = p_date
              ORDER BY ast09_hold_date DESC
              LIMIT 1
           ) t ;
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
