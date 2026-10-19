# f_conv_emptitlecode

## FUNCTION public.f_conv_emptitlecode(p_type character varying, p_code character varying, p_company_id numeric)

- 반환: `character varying`
- 줄 수: 103

```sql
CREATE OR REPLACE FUNCTION public.f_conv_emptitlecode(p_type character varying, p_code character varying, p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_CONV_CD       VARCHAR(3);
    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN

    IF p_company_id IN (202403273621336, 202404021662972) THEN
        ---------------------------------------------------------------------------------
        -- 직책
        IF p_type = 'TITLE' THEN
        /*-------------------------------------------------------------------------------
                 미래에셋자산운용 자체코드      ==>     AssetERP 코드 (EmpTitleCode)
            ---------------------------------        ----------------------------------
             - 520 : 대표                               100 : 대표이사
             - 610 : 상무
             - 511 : 부문장                             110 : 부문대표
             - 430 : 본부장                             230 : 본부장
             - 432 : 본부장 대행                        232 : 본부장대우
             - 522 : 센터장                             233 : 센터장
             - 360 : 팀장                               240 : 팀장
             - 500 : 실장                               235 : 실장
             - 701 : 선임매니저                         250 : 팀원
             - 702 : 매니저                             250 : 팀원
             - 703 : 수석매니저                         250 : 팀원
             - 321 : 인턴사원                           250 : 팀원
             - 540 : 담당임원                           930 : 담당임원
             - 620 : 준법감시인                         999 : 특정직위
             - 621 : 금융소비자보호총괄책임자           920 : 금융소비자보호총괄책임자
             - 630 : 사외이사                           940 : 사외이사
             - 900 : 고문                               910 : 고문
             - 901 : 고문                               910 : 고문
        -------------------------------------------------------------------------------*/
            IF    p_code = '520' THEN v_CONV_CD := '100';
            ELSIF p_code = '610' THEN v_CONV_CD := NULL ;
            ELSIF p_code = '511' THEN v_CONV_CD := '110';
            ELSIF p_code = '430' THEN v_CONV_CD := '230';
            ELSIF p_code = '432' THEN v_CONV_CD := '232';
            ELSIF p_code = '522' THEN v_CONV_CD := '233';
            ELSIF p_code = '360' THEN v_CONV_CD := '240';
            ELSIF p_code = '500' THEN v_CONV_CD := '235';
            ELSIF p_code = '701' THEN v_CONV_CD := '250';
            ELSIF p_code = '702' THEN v_CONV_CD := '250';
            ELSIF p_code = '703' THEN v_CONV_CD := '250';
            ELSIF p_code = '321' THEN v_CONV_CD := '250';
            ELSIF p_code = '540' THEN v_CONV_CD := '930';
            ELSIF p_code = '620' THEN v_CONV_CD := '999';
            ELSIF p_code = '621' THEN v_CONV_CD := '920';
            ELSIF p_code = '630' THEN v_CONV_CD := '940';
            ELSIF p_code = '900' THEN v_CONV_CD := '910';
            ELSIF p_code = '901' THEN v_CONV_CD := '910';
            END IF;

        -- 직위
        ELSIF p_type = 'POS' THEN
        /*-------------------------------------------------------------------------------
                 미래에셋자산운용 자체코드      ==>     AssetERP 코드 (EmpPosCode)
            ---------------------------------        ----------------------------------
             - 190 : 부회장                             005    부회장
             - 180 : 사장                               100   사장  
             - 170 : 부사장                             200    부사장
             - 110 : 전무                               250   전무  
             - 100 : 상무                               300   상무  
             -  70 : 이사대우                           351 이사대우
             - 500 : 수석매니저                         550  수석매니저
             - 703 : 수석매니저                         550  수석매니저
             - 400 : 선임매니저                         600  선임매니저
             - 300 : 매니저                             650    매니저    
             - 250 : 인턴사원                           900 인턴사원
             - 260 : 사외이사                           940 사외이사
             - 900 : 고문                               910   고문
             - 901 : 고문                               910   고문
        -------------------------------------------------------------------------------*/
            IF    p_code = '190' THEN v_CONV_CD := '005';
            ELSIF p_code = '180' THEN v_CONV_CD := '100';
            ELSIF p_code = '170' THEN v_CONV_CD := '200';
            ELSIF p_code = '110' THEN v_CONV_CD := '250';
            ELSIF p_code = '100' THEN v_CONV_CD := '300';
            ELSIF p_code = '70'  THEN v_CONV_CD := '351';
            ELSIF p_code = '500' THEN v_CONV_CD := '550';
            ELSIF p_code = '703' THEN v_CONV_CD := '550';
            ELSIF p_code = '400' THEN v_CONV_CD := '600';
            ELSIF p_code = '300' THEN v_CONV_CD := '650';
            ELSIF p_code = '250' THEN v_CONV_CD := '900';
            ELSIF p_code = '260' THEN v_CONV_CD := '940';
            ELSIF p_code = '900' THEN v_CONV_CD := '910';
            ELSIF p_code = '901' THEN v_CONV_CD := '910';
            END IF;

        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_CONV_CD;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
