# f_get_corp_cd

## FUNCTION public.f_get_corp_cd(p_company_id numeric, p_corp_type character varying, p_corp_cd character varying, p_office_type character varying, p_office_work_cd character varying)

- 반환: `character varying`
- 줄 수: 91

```sql
CREATE OR REPLACE FUNCTION public.f_get_corp_cd(p_company_id numeric, p_corp_type character varying, p_corp_cd character varying, p_office_type character varying, p_office_work_cd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_office_work_cd    VARCHAR;
v_office_work_type  VARCHAR;
v_corp_cd           VARCHAR;
v_errMsg            VARCHAR;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 사무수탁사코드가 협회코드로 들어온 경우 ICAM코드를 찾는다.
    IF p_office_type = '2' THEN
        v_errMsg := '협회코드로 ICAM코드 찾기 실패..['||p_company_id||']['||p_office_work_cd||']' ;
        SELECT fnd06_office_work_cd
          INTO v_office_work_cd
          FROM fnd06_office_work
         WHERE fnd06_company_id = p_company_id
           AND fnd06_kofia_cd   = p_office_work_cd;
    ELSE
        v_office_work_cd := p_office_work_cd;
    END IF;
    -------------------------------------------------------------------------------------
    CASE v_office_work_cd
        WHEN '80005' THEN v_office_work_type := '00';  -- 00 한국펀드서비스
        WHEN '80003' THEN v_office_work_type := '01';  -- 01 신한아이타드
        WHEN '00950' THEN v_office_work_type := '02';  -- 02 우리펀드
        WHEN '03269' THEN v_office_work_type := '03';  -- 03 하나펀드
        WHEN '03254' THEN v_office_work_type := '04';  -- 04 미래에셋
        WHEN '09900' THEN v_office_work_type := '05';  -- 05 예탁원
        WHEN '01001' THEN v_office_work_type := '06';  -- 06 KB펀드파트너스
        WHEN '80001' THEN v_office_work_type := '07';  -- 07 코스콤(HSBC)
        WHEN '80006' THEN v_office_work_type := '08';  -- 08 삼정
        WHEN '80007' THEN v_office_work_type := '09';  -- 09 스카이
        ELSE v_errMsg := '미등록 사무수탁코드 ['||v_office_work_cd||']';
        RAISE;
    END CASE;
    -------------------------------------------------------------------------------------
    -- 수탁사 자체(ICAM)코드 가져오기
    IF p_corp_type = '1' THEN
        v_errMsg := '수탁사 자체(ICAM)코드 가져오기 실패..['||p_company_id||']['||v_office_work_type||']['||p_corp_cd||']' ;
        SELECT fnd03_consignment_cd
          INTO v_corp_cd
          FROM fnd03_consignment
         WHERE fnd03_company_id = p_company_id
           AND p_corp_cd = ( CASE v_office_work_type WHEN '01' THEN fnd03_etc_consignment_cd01
                                                     WHEN '02' THEN fnd03_etc_consignment_cd02
                                                     WHEN '03' THEN fnd03_etc_consignment_cd03
                                                     WHEN '04' THEN fnd03_etc_consignment_cd04
                                                     WHEN '05' THEN fnd03_etc_consignment_cd05
                                                     WHEN '06' THEN fnd03_etc_consignment_cd06
                                                     WHEN '07' THEN fnd03_etc_consignment_cd07
                                                     WHEN '08' THEN fnd03_etc_consignment_cd08
                                                     WHEN '09' THEN fnd03_etc_consignment_cd09
                                                     WHEN '10' THEN fnd03_etc_consignment_cd10
                                                               ELSE fnd03_consignment_cd END );
    -------------------------------------------------------------------------------------
    -- 수탁은행 자체(ICAM)코드 가져오기
    ELSIF p_corp_type = '2' THEN
        v_errMsg := '수탁은행 자체(ICAM)코드 가져오기 실패..['||p_company_id||']['||v_office_work_type||']['||p_corp_cd||']' ;
        SELECT fnd09_trust_bank_cd
          INTO v_corp_cd
          FROM fnd09_trust_bank
         WHERE fnd09_company_id = p_company_id
           AND p_corp_cd = ( CASE v_office_work_type WHEN '01' THEN fnd09_etc_trust_bank_cd01
                                                     WHEN '02' THEN fnd09_etc_trust_bank_cd02
                                                     WHEN '03' THEN fnd09_etc_trust_bank_cd03
                                                     WHEN '04' THEN fnd09_etc_trust_bank_cd04
                                                     WHEN '05' THEN fnd09_etc_trust_bank_cd05
                                                     WHEN '06' THEN fnd09_etc_trust_bank_cd06
                                                     WHEN '07' THEN fnd09_etc_trust_bank_cd07
                                                     WHEN '08' THEN fnd09_etc_trust_bank_cd08
                                                     WHEN '09' THEN fnd09_etc_trust_bank_cd09
                                                     WHEN '10' THEN fnd09_etc_trust_bank_cd10
                                                               ELSE fnd09_trust_bank_cd END );
    ELSE
        v_errMsg := '미등록 기관구분코드 ['||p_corp_type||']';
        RAISE;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_corp_cd;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - % (%)', v_errMsg, SQLERRM ;
    RETURN null;
END;
$function$
```
