# f_calc_income_tax_retire_c

## FUNCTION public.f_calc_income_tax_retire_c(p_person_id numeric, p_proc_step numeric)

- 반환: `character varying`
- 줄 수: 173

```sql
CREATE OR REPLACE FUNCTION public.f_calc_income_tax_retire_c(p_person_id numeric, p_proc_step numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY10             pay10_month%ROWTYPE;
    v_PAY13             pay13_retire_tax%ROWTYPE;

    v_errMsg            VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    /************************************************************************************
        소득세 퇴직정산내역 정리
        - 종(전)근무지 기납부세액이 없는 경우 DELETE
        - 종(전)근무지 기납부세액이 있는 경우 항목을 제외하고 0으로 UPDATE
    ************************************************************************************/

    RAISE NOTICE '=================== 소득세 퇴직정산내역 제거 IN !!!! (STEP : %) =====================', p_proc_step;

    -- 퇴직정산내역 가져오기
    v_errMsg := '퇴직정산내역 가져오기 실패 ['||p_person_id||']';
    SELECT *
      INTO v_PAY10
      FROM pay10_month
     WHERE pay10_person_id  = p_person_id
       AND pay10_pay_cd     = '03'  --(03:퇴직정산)
     ORDER BY pay10_date DESC
     LIMIT 1;

    IF v_PAY10 IS NULL THEN
        v_errMsg := '퇴직정산내역이 존재하지 않습니다. 급여관리에서 지급구분을 "퇴직정산"으로 생성한 후 진행하세요';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 소득세/지방세 퇴직정산 항목상세 삭제
    -------------------------------------------------------------------------------------
    v_errMsg := '소득세/지방세 퇴직정산 항목상세 삭제 실패(1) ['||v_PAY10.pay10_month_id||']';
    DELETE
      FROM pay11_month_item
     WHERE pay11_month_id = v_PAY10.pay10_month_id
       AND pay11_item_cd IN ('252','262') ; --(252:소득세(퇴직정산) / 262:지방세(퇴직정산))

    -------------------------------------------------------------------------------------
    -- 처리단계가 '0:전체진행'인 경우는 생성 또는 삭제이므로 완전제거함
    -------------------------------------------------------------------------------------
    IF p_proc_step = 0 THEN
        DELETE
          FROM pay13_retire_tax
         WHERE pay13_month_id = v_PAY10.pay10_month_id;

        DELETE
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id;

        RAISE NOTICE '=================== 완전제거함 (%) =====================', v_PAY10.pay10_month_id;

        -- 아래 단계별 정리가 필요 없으므로 내보낸다
        RETURN 'Y';
    END IF;

    -------------------------------------------------------------------------------------
    -- 단계에 맞춘 정리
    -------------------------------------------------------------------------------------
    -- 소득세 퇴직정산내역 가져오기
    v_errMsg := '소득세 퇴직정산내역 가져오기 실패 ['||v_PAY10.pay10_month_id||']';
    SELECT *
      INTO v_PAY13
      FROM pay13_retire_tax
     WHERE pay13_month_id = v_PAY10.pay10_month_id;

    IF v_PAY13 IS NULL THEN
        RETURN 'Y';
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 1 THEN
        RAISE NOTICE '1. 총소득액 정리';
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 2 THEN
        RAISE NOTICE '2. 근로소득공제 정리';
        v_PAY13.pay13_income_deduct     := 0;
        v_PAY13.pay13_py_income_deduct  := 0;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 3 THEN
        RAISE NOTICE '3. 근로소득금액 정리';
        v_PAY13.pay13_income_amt        := 0;
        v_PAY13.pay13_py_income_amt     := 0;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 4 THEN
        RAISE NOTICE '4. 종합소득공제 정리';

        DELETE
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '3'; --(3:종합소득공제항목)
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 5 THEN
        RAISE NOTICE '5. 차감소득금액(과세표준) 정리';
        v_PAY13.pay13_tax_base          := 0;
        v_PAY13.pay13_py_tax_base       := 0;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 6 THEN
        RAISE NOTICE '6. 산출세액 정리';
        v_PAY13.pay13_calc_tax          := 0;
        v_PAY13.pay13_py_calc_tax       := 0;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 7 THEN
        RAISE NOTICE '7. 세액공제 정리';

        DELETE
          FROM pay14_retire_tax_item
         WHERE pay14_month_id = v_PAY10.pay10_month_id
           AND pay14_item_type = '4'; --(4:세액공제항목)
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 8 THEN
        RAISE NOTICE '8. 결정세액 정리';
        v_PAY13.pay13_decide_tax        := 0;
        v_PAY13.pay13_py_decide_tax     := 0;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 9 THEN
        RAISE NOTICE '9. 기납부세액 정리';
        v_PAY13.pay13_cur_office_pay_tax    := 0;
        v_PAY13.pay13_py_cur_office_pay_tax := 0;
    END IF;
    -------------------------------------------------------------------------------------
    IF p_proc_step < 10 THEN
        RAISE NOTICE '10. 차감징수세액 정리';
        v_PAY13.pay13_settle_tax        := 0;
        v_PAY13.pay13_py_settle_tax     := 0;
    END IF;

    -------------------------------------------------------------------------------------
    UPDATE pay13_retire_tax
       SET pay13_income_deduct         = v_PAY13.pay13_income_deduct        
         , pay13_income_amt            = v_PAY13.pay13_income_amt           
         , pay13_tax_base              = v_PAY13.pay13_tax_base             
         , pay13_calc_tax              = v_PAY13.pay13_calc_tax             
         , pay13_decide_tax            = v_PAY13.pay13_decide_tax           
         , pay13_pre_office_pay_tax    = v_PAY13.pay13_pre_office_pay_tax   
         , pay13_cur_office_pay_tax    = v_PAY13.pay13_cur_office_pay_tax   
         , pay13_settle_tax            = v_PAY13.pay13_settle_tax           
         , pay13_py_income_deduct      = v_PAY13.pay13_py_income_deduct     
         , pay13_py_income_amt         = v_PAY13.pay13_py_income_amt        
         , pay13_py_tax_base           = v_PAY13.pay13_py_tax_base          
         , pay13_py_calc_tax           = v_PAY13.pay13_py_calc_tax          
         , pay13_py_decide_tax         = v_PAY13.pay13_py_decide_tax        
         , pay13_py_pre_office_pay_tax = v_PAY13.pay13_py_pre_office_pay_tax
         , pay13_py_cur_office_pay_tax = v_PAY13.pay13_py_cur_office_pay_tax
         , pay13_py_settle_tax         = v_PAY13.pay13_py_settle_tax        
     WHERE pay13_retire_tax_id = v_PAY13.pay13_retire_tax_id;
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
