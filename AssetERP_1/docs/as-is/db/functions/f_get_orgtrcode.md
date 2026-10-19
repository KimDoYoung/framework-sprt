# f_get_orgtrcode

## FUNCTION public.f_get_orgtrcode(p_expense_id numeric, p_tr_cd character varying)

- 반환: `text`
- 줄 수: 61

```sql
CREATE OR REPLACE FUNCTION public.f_get_orgtrcode(p_expense_id numeric, p_tr_cd character varying)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY50     pay50_expense%ROWTYPE;
    v_TR_CD     VARCHAR(4) := p_tr_cd;

    v_errMsg    TEXT;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF COALESCE(p_expense_id,0) = 0 THEN
        RETURN p_tr_cd;
    END IF;
    -------------------------------------------------------------------------------------
    -- (9100:사업비 발생)
    IF p_tr_cd != '9100' THEN
        RETURN p_tr_cd;
    END IF;

    -------------------------------------------------------------------------------------
    v_errMsg := CONCAT('지출결의서 정보 가져오기 실패..', p_expense_id);
    SELECT *
      INTO v_PAY50
      FROM pay50_expense
     WHERE pay50_expense_id = p_expense_id;

    IF v_PAY50 IS NULL THEN
        v_errMsg := CONCAT('지출결의서 정보가 존재하지 않습니다 [', p_expense_id, ']');
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 53 : 원천세/부가세
    -- 54 : 4대보험
    -------------------------------------------------------------------------------------
    v_errMsg := CONCAT('원천세/부가세/4대보험 거래코드 가져오기 실패..', p_expense_id);
    IF v_PAY50.pay50_expense_cd IN ('53','54') THEN
        ---------------------------------------------------------------------------------
        SELECT ast06_tr_cd
          INTO v_TR_CD
          FROM ast06_tr
         WHERE ast06_expense_id = p_expense_id ;
    END IF;

    -------------------------------------------------------------------------------------
    RETURN v_TR_CD;
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
