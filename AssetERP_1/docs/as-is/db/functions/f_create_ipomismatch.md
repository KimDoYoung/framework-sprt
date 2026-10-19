# f_create_ipomismatch

## FUNCTION public.f_create_ipomismatch()

- 반환: `character varying`
- 줄 수: 244

```sql
CREATE OR REPLACE FUNCTION public.f_create_ipomismatch()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_DATA          RECORD;
    v_SCH10         sch10_ipo%ROWTYPE;
    v_SCH14         sch14_ipo_mismatch%ROWTYPE;

    v_cnt           NUMERIC;
    v_target1       TEXT;
    v_target2       TEXT;
    v_marketCode1   VARCHAR(10);
    v_marketCode2   VARCHAR(10);
    v_PRICE         NUMERIC;
    v_DATES         DATE[];

    v_errMsg        VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := 'IPO 미일치내역 생성 실패';

    -------------------------------------------------------------------------------------
    -- 미일치내역 정리(체크완료건은 제외하고 삭제한다)
    -------------------------------------------------------------------------------------
    DELETE
      FROM sch14_ipo_mismatch
     WHERE COALESCE(sch14_check_yn,'false') != 'true';

    -------------------------------------------------------------------------------------
    -- IPOStock 스크래핑 데이터 가져오기 (상장일이 지난 종목은 제외)
    -------------------------------------------------------------------------------------
    FOR v_DATA IN ( SELECT *
                      FROM sch13_ipo_crawling
                     WHERE sch13_track_id = ( SELECT MAX(sch13_track_id)
                                                FROM sch13_ipo_crawling
                                               WHERE sch13_target_type = '2')   --(1:공모주38 / 2:IPO-Stock)
                       AND (CASE WHEN COALESCE(sch13_list_date,'') = '' THEN '9999-12-31' ELSE sch13_list_date END)::date >= f_today()
    ) LOOP
        ---------------------------------------------------------------------------------
        v_marketCode1   := '';
        v_marketCode2   := '';
        v_target1       := '';
        v_target2       := '';
        v_SCH14         := NULL;
        ---------------------------------------------------------------------------------
        -- 공모주일정(sch10) 가져오기
        ---------------------------------------------------------------------------------
        v_errMsg := CONCAT('공모주일정(sch10) 가져오기 실패', v_DATA.sch13_stk_code);
        SELECT *
          INTO v_SCH10
          FROM sch10_ipo
         WHERE sch10_iss_corp_cd = SUBSTR(v_DATA.sch13_stk_code, 1,5)
         ORDER BY sch10_demand_start_date DESC
         LIMIT 1;

        ---------------------------------------------------------------------------------
        -- 공모주일정 없음
        ---------------------------------------------------------------------------------
        IF v_SCH10 IS NULL THEN
            -----------------------------------------------------------------------------
            v_SCH14.sch14_ipo_mismatch_id   := f_create_batchseq()      ;
            v_SCH14.sch14_insert_date_time  := f_sysdate()              ;
            v_SCH14.sch14_ipo_id            := NULL                     ;
            v_SCH14.sch14_stk_cd            := v_DATA.sch13_stk_code    ;
            v_SCH14.sch14_stk_nm            := v_DATA.sch13_stk_name    ;
            v_SCH14.sch14_note              := NULL                     ;
            v_SCH14.sch14_check_yn          := 'false'                  ;
            v_SCH14.sch14_target1           := '공모주일정 없음'        ;
            v_SCH14.sch14_target2           := CONCAT( '종목('||v_DATA.sch13_stk_name||')/'
                                                     , '시장구분('||v_DATA.sch13_market_type||')/'
                                                     , '발행기관코드('||SUBSTR(v_DATA.sch13_stk_code, 1,5)||')/'
                                                     , '희망공모가('||v_DATA.sch13_price_bracket||')/'
                                                     , '확정공모가('||v_DATA.sch13_final_price||')/'
                                                     , '철회여부('||CASE WHEN v_DATA.sch13_status = '공모철회' THEN '철회' ELSE '정상' END||')/'
                                                     , '수요예측기간('||v_DATA.sch13_demand_date||')/'
                                                     , '청약기간('||v_DATA.sch13_subscription_date||')/'
                                                     , '납입일('||v_DATA.sch13_pay_date||')/'
                                                     , '상장일('||v_DATA.sch13_list_date||')'
                                                     );
            -----------------------------------------------------------------------------
            INSERT INTO sch14_ipo_mismatch VALUES (v_SCH14.*);

        ---------------------------------------------------------------------------------
        -- 공모주일정 있음
        ---------------------------------------------------------------------------------
        ELSE
            -- 미일치내역 확인완료여부 체크
            SELECT COUNT(*)
              INTO v_cnt
              FROM sch14_ipo_mismatch
             WHERE sch14_ipo_id = v_SCH10.sch10_ipo_id
               AND COALESCE(sch14_check_yn,'false') = 'true';

            IF v_cnt = 0 THEN   --(확인완료된 공모주 일정이면 미일치내역 생성하지 않는다)

                -------------------------------------------------------------------------
                -- 시장구분 체크
                -------------------------------------------------------------------------
                v_errMsg := '시장구분 체크 실패';
                IF v_SCH10.sch10_market_cd = '1' THEN -- 거래소(1) => 유가증권(4)
                    v_marketCode1 := '4';
                ELSE
                    v_marketCode1 := v_SCH10.sch10_market_cd;
                END IF;

                IF    v_DATA.sch13_market_type = '코스닥'   THEN v_marketCode2 := '2';
                ELSIF v_DATA.sch13_market_type = '코넥스'   THEN v_marketCode2 := '3';
                ELSIF v_DATA.sch13_market_type = '유가증권' THEN v_marketCode2 := '4';
                ELSE  v_marketCode2 := '';
                END IF;

                IF v_marketCode1 != v_marketCode2 THEN
                    v_target1 := '/시장구분('||f_cdnm('MarketCode', v_SCH10.sch10_market_cd, 0, f_today())||')';
                    v_target2 := '/시장구분('||v_DATA.sch13_market_type||')';
                END IF;

                -------------------------------------------------------------------------
                -- 수요예측 시작일,종료일 체크
                -------------------------------------------------------------------------
                v_errMsg := CONCAT('수요예측 시작일,종료일 체크 실패..', v_DATA.sch13_demand_date);
                v_DATES := f_get_extrDate2(v_DATA.sch13_demand_date);
                IF v_SCH10.sch10_demand_start_date != v_DATES[1] THEN
                    v_target1 := CONCAT(v_target1, '/수요예측시작일(', v_SCH10.sch10_demand_start_date, ')');
                    v_target2 := CONCAT(v_target2, '/수요예측시작일(', v_DATES[1]                     , ')');
                END IF;

                IF v_SCH10.sch10_demand_close_date != v_DATES[2] THEN
                    v_target1 := CONCAT(v_target1, '/수요예측종료일(', v_SCH10.sch10_demand_close_date, ')');
                    v_target2 := CONCAT(v_target2, '/수요예측종료일(', v_DATES[2]                     , ')');
                END IF;

                -------------------------------------------------------------------------
                -- 청약 시작일,종료일 체크
                -------------------------------------------------------------------------
                v_errMsg := CONCAT('청약 시작일,종료일 체크 실패..', v_DATA.sch13_subscription_date);
                v_DATES := f_get_extrDate2(v_DATA.sch13_subscription_date);
                IF v_SCH10.sch10_subscription_start_date != v_DATES[1] THEN
                    v_target1 := CONCAT(v_target1, '/청약시작일(', v_SCH10.sch10_subscription_start_date, ')');
                    v_target2 := CONCAT(v_target2, '/청약시작일(', v_DATES[1]                           , ')');
                END IF;

                IF v_SCH10.sch10_subscription_close_date != v_DATES[2] THEN
                    v_target1 := CONCAT(v_target1, '/청약종료일(', v_SCH10.sch10_subscription_close_date, ')');
                    v_target2 := CONCAT(v_target2, '/청약종료일(', v_DATES[2]                           , ')');
                END IF;

                -------------------------------------------------------------------------
                -- 납입일 체크
                -------------------------------------------------------------------------
                v_errMsg := CONCAT('납입일 체크 실패..', v_DATA.sch13_pay_date);
                v_DATES := f_get_extrDate(v_DATA.sch13_pay_date);
                IF v_SCH10.sch10_pay_date != v_DATES[1] THEN
                    v_target1 := CONCAT(v_target1, '/납입일(', v_SCH10.sch10_pay_date, ')');
                    v_target2 := CONCAT(v_target2, '/납입일(', v_DATES[1]            , ')');
                END IF;

                -------------------------------------------------------------------------
                -- 상장일 체크
                -------------------------------------------------------------------------
                v_errMsg := CONCAT('상장일 체크 실패..', v_DATA.sch13_list_date);
                v_DATES := f_get_extrDate(v_DATA.sch13_list_date);
                IF v_SCH10.sch10_list_date != v_DATES[1] THEN
                    v_target1 := CONCAT(v_target1, '/상장일(', v_SCH10.sch10_list_date, ')');
                    v_target2 := CONCAT(v_target2, '/상장일(', v_DATES[1]             , ')');
                END IF;

                -------------------------------------------------------------------------
                -- 공모가 체크
                -------------------------------------------------------------------------
                v_errMsg := CONCAT('공모가 체크 실패..', v_DATA.sch13_final_price);
                v_PRICE := COALESCE(NULLIF(regexp_replace(v_DATA.sch13_final_price, '[^0-9]', '', 'g'),''),'0')::NUMERIC;
                IF COALESCE(v_SCH10.sch10_price,0) != v_PRICE THEN
                    v_target1 := CONCAT(v_target1, '/공모가(', v_SCH10.sch10_price           , ')');
                    v_target2 := CONCAT(v_target2, '/공모가(', TRIM(v_DATA.sch13_final_price), ')');
                END IF;

                -------------------------------------------------------------------------
                -- 발행기관코드 체크
                -------------------------------------------------------------------------
                v_errMsg := CONCAT('발행기관코드 체크 실패..', v_DATA.sch13_stk_code);
                IF v_SCH10.sch10_iss_corp_cd != SUBSTR(v_DATA.sch13_stk_code,1,5) THEN
                    v_target1 := CONCAT(v_target1, '/발행기관코드(', v_SCH10.sch10_iss_corp_cd        , ')');
                    v_target2 := CONCAT(v_target2, '/발행기관코드(', SUBSTR(v_DATA.sch13_stk_code,1,5), ')');
                END IF;

                -------------------------------------------------------------------------
                -- 철회여부 체크
                -------------------------------------------------------------------------
                IF COALESCE(v_SCH10.sch10_cancel_yn,'false') = 'true' THEN
                    IF COALESCE(TRIM(v_DATA.sch13_status),'') != '공모철회' THEN
                        v_target1 := CONCAT(v_target1, '/철회여부(철회)');
                        v_target2 := CONCAT(v_target2, '/철회여부(정상)');
                    END IF;
                ELSE
                    IF COALESCE(TRIM(v_DATA.sch13_status),'') = '공모철회' THEN
                        v_target1 := CONCAT(v_target1, '/철회여부(정상)');
                        v_target2 := CONCAT(v_target2, '/철회여부(철회)');
                    END IF;
                END IF;

                --두군데 다 철회면 생성안함
                IF COALESCE(v_SCH10.sch10_cancel_yn,'false') = 'true'   AND
                   COALESCE(TRIM(v_DATA.sch13_status),'') = '공모철회'  THEN
                    v_target1 := '';
                    v_target2 := '';
                END IF;

                -------------------------------------------------------------------------
                -- 미일치내역 INSERT
                IF v_target2 != '' THEN
                    v_errMsg := '미일치내역 INSERT 실패';
                    ---------------------------------------------------------------------
                    v_SCH14.sch14_ipo_mismatch_id   := f_create_batchseq()      ;
                    v_SCH14.sch14_insert_date_time  := f_sysdate()              ;
                    v_SCH14.sch14_ipo_id            := v_SCH10.sch10_ipo_id     ;
                    v_SCH14.sch14_stk_cd            := v_DATA.sch13_stk_code    ;
                    v_SCH14.sch14_stk_nm            := v_DATA.sch13_stk_name    ;
                    v_SCH14.sch14_note              := NULL                     ;
                    v_SCH14.sch14_check_yn          := 'false'                  ;
                    v_SCH14.sch14_target1           := CONCAT('종목(', v_SCH10.sch10_item_nm, ')', v_target1);
                    v_SCH14.sch14_target2           := CONCAT('종목(', v_DATA.sch13_stk_name, ')', v_target2);
                    ---------------------------------------------------------------------
                    INSERT INTO sch14_ipo_mismatch VALUES (v_SCH14.*);
                END IF;
            END IF;
        END IF;
    END LOOP;

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
