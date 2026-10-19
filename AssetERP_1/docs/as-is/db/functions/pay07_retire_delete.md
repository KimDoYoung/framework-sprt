# pay07_retire_delete

## PROCEDURE public.pay07_retire_delete(IN p_person_id numeric, IN p_user_id numeric)

- 반환: `-`
- 줄 수: 90

```sql
CREATE OR REPLACE PROCEDURE public.pay07_retire_delete(IN p_person_id numeric, IN p_user_id numeric)
 LANGUAGE plpgsql
AS $procedure$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY07 pay07_retire%ROWTYPE;
    v_APR   apr01_appr%ROWTYPE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    --  0. DATA CLEAR => 상신여부 체크는 java server단에서 체크하고 넘어옴.
    -------------------------------------------------------------------------------------
    SELECT apr01_appr.*
      INTO v_APR
      FROM pay07_retire
         , apr01_appr
     WHERE pay07_appr_id   = apr01_appr_id
       AND pay07_person_id = p_person_id ;
    -------------------------------------------------------------------------------------
    -- 상신문서가 있는 경우 상신문서 폐기
    IF v_APR.apr01_appr_id IS NOT NULL THEN
        INSERT
          INTO apr99_appr_del
        SELECT f_create_seq()
             , apr01_appr_id
             , apr01_title
             , apr01_reg_date
             , apr01_status_cd
             , apr01_content
             , apr01_note
             , apr01_reg_emp_id
             , apr01_effect_date
             , apr01_class_tree_id
             , apr01_stamp_id
             , apr01_receive_nm
             , apr01_reference_nm
             , apr01_stamp_seq
             , apr01_inout_cd
             , f_sysdate()
             , p_user_id
             , apr01_company_id
             , apr01_form_type
          FROM apr01_appr
         WHERE apr01_appr_id = v_APR.apr01_appr_id;
        ---------------------------------------------------------------------------------
        DELETE
          FROM apr01_appr
         WHERE apr01_appr_id = v_APR.apr01_appr_id;
    END IF;
    -------------------------------------------------------------------------------------
    -- 퇴직정산서 가져오기
    SELECT *
      INTO v_PAY07
      FROM pay07_retire
     WHERE pay07_person_id = p_person_id;
    -------------------------------------------------------------------------------------
    -- 퇴직정산금액 초기화
    UPDATE pay02_month
       SET pay02_real_pay = ( COALESCE(pay02_basic_pay    ,0)
                            + COALESCE(pay02_bonus_pay    ,0)
                            + COALESCE(pay02_meal_pay     ,0)
                            + COALESCE(pay02_car_mt       ,0)
                            + COALESCE(pay02_etc01_pay    ,0)
                            + COALESCE(pay02_etc02_pay    ,0)
                            + COALESCE(pay02_etc03_pay    ,0)
                            + COALESCE(pay02_etc04_pay    ,0)
                            + COALESCE(pay02_extend_pay   ,0)
                            + COALESCE(pay02_night_pay    ,0)
                            + COALESCE(pay02_holiday_pay  ,0) )
                          - ( COALESCE(pay02_income_tax   ,0)
                            + COALESCE(pay02_resident_tax ,0)
                            + COALESCE(pay02_np_ddc       ,0)
                            + COALESCE(pay02_hi_ddc       ,0)
                            + COALESCE(pay02_lt_ddc       ,0)
                            + COALESCE(pay02_ei_ddc       ,0)
                            + COALESCE(pay02_year_end_tax ,0)
                            + COALESCE(pay02_others01_ddc ,0)
                            + COALESCE(pay02_others02_ddc ,0) )
         , pay02_retire_amt = 0
     WHERE pay02_month_id = v_PAY07.pay07_pay_month_id;
    -------------------------------------------------------------------------------------
    -- 퇴직정산서 삭제
    DELETE
      FROM pay07_retire
     WHERE pay07_retire_id = v_PAY07.pay07_retire_id;
-----------------------------------------------------------------------------------------
END;
$procedure$
```
