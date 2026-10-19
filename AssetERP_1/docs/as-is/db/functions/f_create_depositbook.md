# f_create_depositbook

## FUNCTION public.f_create_depositbook(p_company_id numeric, p_std_date date)

- 반환: `character varying`
- 줄 수: 64

```sql
CREATE OR REPLACE FUNCTION public.f_create_depositbook(p_company_id numeric, p_std_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_CLOSE_DATE    DATE;
    v_CNT           NUMERIC;

    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '예금 원장정리전 체크 실패 ['||p_std_date||']';

    v_CLOSE_DATE := f_today();

    -------------------------------------------------------------------------------------
    -- 회계결산여부 체크
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id =  p_company_id
       AND act05_std_date   >= p_std_date;
    IF v_CNT > 0 THEN
        v_errMsg := '해당일은 회계가 마감되었습니다. 마감취소 후 정리가 가능합니다.';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 거래일 이후 환평가처리건 존재유무 체크
    -------------------------------------------------------------------------------------
    v_errMsg := '거래일 이후 환평가처리건 존재유무 체크 실패';
    SELECT COUNT(*)
      INTO v_CNT
      FROM ast06_tr
     WHERE ast06_company_id = p_company_id
       AND ast06_tr_cd      = '3700'
       AND ast06_date      >= p_std_date;
    IF v_CNT > 0 THEN
        v_errMsg := '처리(취소)일 이후 환평가내역이 존재합니다. 환평가취소 후 진행하세요';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    -- 원장 정리 Call
    -------------------------------------------------------------------------------------
    RAISE NOTICE '---------- 원장 정리 Call (f_create_depositBook_run)';
    v_errMsg := f_create_depositBook_run(p_company_id, p_std_date);
    IF v_errMsg != 'Y' THEN
        RAISE USING ERRCODE = '90001';
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
