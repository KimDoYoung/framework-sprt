# f_conv_pay

## FUNCTION public.f_conv_pay()

- 반환: `character varying`
- 줄 수: 282

```sql
CREATE OR REPLACE FUNCTION public.f_conv_pay()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_PAY10     pay10_month%ROWTYPE;
    v_PAY11     pay11_month_item%ROWTYPE;
    v_PAY12     pay12_retire_insure%ROWTYPE;

    c_DATA      RECORD;

    v_errMsg    VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 01:급여 / 02:상여금 / 03:퇴직정산
    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT *
                      FROM pay02_month
    ) LOOP
        ---------------------------------------------------------------------------------
        v_PAY10 := NULL;
        v_PAY11 := NULL;
        ---------------------------------------------------------------------------------
        v_PAY10.pay10_month_id          := c_DATA.pay02_month_id                    ;
        v_PAY10.pay10_company_id        := c_DATA.pay02_company_id                  ;
        v_PAY10.pay10_pay_cd            := c_DATA.pay02_pay_cd                      ;
        v_PAY10.pay10_date              := c_DATA.pay02_pay_date                    ;
        v_PAY10.pay10_person_id         := c_DATA.pay02_person_id                   ;
        v_PAY10.pay10_work_day          := c_DATA.pay02_work_day                    ;
        v_PAY10.pay10_total_work_time   := c_DATA.pay02_total_work_time             ;
        v_PAY10.pay10_extend_work_time  := c_DATA.pay02_extend_work_time            ;
        v_PAY10.pay10_night_work_time   := c_DATA.pay02_night_work_time             ;
        v_PAY10.pay10_holiday_work_time := c_DATA.pay02_holiday_work_time           ;
        v_PAY10.pay10_note              := c_DATA.pay02_note                        ;
        v_PAY10.pay10_std_month         := TO_CHAR(c_DATA.pay02_pay_date,'YYYY.MM') ;

        INSERT INTO pay10_month VALUES (v_PAY10.*);

        ---------------------------------------------------------------------------------
        -- 기본급여
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '1'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '110'                            ; --(110:기본급)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_basic_pay           ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 중식대
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '1'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '111'                            ; --(111:중식대)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_meal_pay            ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 차량유지비
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '1'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '112'                            ; --(112:차량유지비)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_car_mt              ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 상여금
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '1'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '130'                            ; --(130:상여금)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_bonus_pay           ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 기타수당
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '1'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '190'                            ; --(190:기타수당)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_etc01_pay           ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 국민연금
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '210'                            ; --(210:국민연금)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_np_ddc              ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 건강보험
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '220'                            ; --(220:건강보험)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_hi_ddc              ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 장기요양보험
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '230'                            ; --(230:장기요양보험)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_lt_ddc              ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 고용보험
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '240'                            ; --(240:고용보험)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_ei_ddc              ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 소득세
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '250'                            ; --(250:소득세)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_income_tax          ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 지방세
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '260'                            ; --(260:지방세)
        v_PAY11.pay11_item_amt          := c_DATA.pay02_resident_tax        ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        --pay02_others01_ddc  -- 기타공제1
        --pay02_others02_ddc  -- 기타공제2


    END LOOP;

    -------------------------------------------------------------------------------------
    -- 퇴직정산(4대보험)
    -------------------------------------------------------------------------------------
    FOR c_DATA IN ( SELECT *
                      FROM pay02_month
                           INNER JOIN pay07_retire ON pay07_pay_month_id = pay02_month_id
    ) LOOP
        ---------------------------------------------------------------------------------
        UPDATE pay10_month
           SET pay10_pay_cd = '03'
         WHERE pay10_month_id = c_DATA.pay02_month_id;
        ---------------------------------------------------------------------------------
        v_PAY12 := NULL;

        ---------------------------------------------------------------------------------
        -- 건강보험
        v_PAY12.pay12_retire_insure_id  := f_create_seq()                                               ;
        v_PAY12.pay12_month_id          := c_DATA.pay02_month_id                                        ;
        v_PAY12.pay12_insure_cd         := '2'                                                          ; --(2:건강보험/3:장기요양/4:고용보험)
        v_PAY12.pay12_year              := TO_CHAR(c_DATA.pay02_pay_date,'YYYY')                        ;
        v_PAY12.pay12_apply_term        := TO_CHAR(c_DATA.pay07_calc_start_date,'YYYY-MM-DD')
                                           ||' ~ '||
                                           TO_CHAR(c_DATA.pay07_retire_date,'YYYY-MM-DD')               ;
        v_PAY12.pay12_work_month_cnt    := COALESCE(c_DATA.pay07_work_month, c_DATA.pay07_calc_month)   ;
        v_PAY12.pay12_pay_month_cnt     := c_DATA.pay07_calc_month                                      ;
        v_PAY12.pay12_total_pay         := c_DATA.pay07_total_pay                                       ; -- 보수총액
        v_PAY12.pay12_month_pay         := c_DATA.pay07_month_pay                                       ; -- 보수월액(장기요양보험은 월건강보험료금액이 들어감)
        v_PAY12.pay12_insure_rate       := c_DATA.pay07_hi_rate                                         ; -- 보험료율(%)
        v_PAY12.pay12_month_amt         := c_DATA.pay07_month_hi                                        ; -- 월보험료(건강보험=평균보수월액*보험료율/장기요양=월건강보험료*보험료율/고용보험=해당없음)
        v_PAY12.pay12_fix_amt           := c_DATA.pay07_fix_hi                                          ; -- 확정보험료(건강보험,장기요양=월보험료 * 정산월수,고용보험=보수총액 * 보험료율)
        v_PAY12.pay12_pay_amt           := c_DATA.pay07_hi_sum                                          ; -- 납부보험료
        v_PAY12.pay12_unpay_amt         := c_DATA.pay07_hi_unsettled                                    ; -- 전년도 미정산보험료
        v_PAY12.pay12_settle_amt        := c_DATA.pay07_settle_hi                                       ; -- 정산보험료(확정보험료 - 납부보험료 + 전년도 미정산보험료)

        INSERT INTO pay12_retire_insure VALUES (v_PAY12.*);

        ---------------------------------------------------------------------------------
        -- 건강보험(퇴직정산)
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '222'                            ; --(222:건강보험(퇴직정산))
        v_PAY11.pay11_item_amt          := c_DATA.pay07_settle_hi           ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 장기요양
        v_PAY12.pay12_retire_insure_id  := f_create_seq()                                               ;
        v_PAY12.pay12_month_id          := c_DATA.pay02_month_id                                        ;
        v_PAY12.pay12_insure_cd         := '3'                                                          ; --(2:건강보험/3:장기요양/4:고용보험)
        v_PAY12.pay12_year              := TO_CHAR(c_DATA.pay02_pay_date,'YYYY')                        ;
        v_PAY12.pay12_apply_term        := TO_CHAR(c_DATA.pay07_calc_start_date,'YYYY-MM-DD')
                                           ||' ~ '||
                                           TO_CHAR(c_DATA.pay07_retire_date,'YYYY-MM-DD')               ;
        v_PAY12.pay12_work_month_cnt    := COALESCE(c_DATA.pay07_work_month, c_DATA.pay07_calc_month)   ;
        v_PAY12.pay12_pay_month_cnt     := c_DATA.pay07_calc_month                                      ;
        v_PAY12.pay12_total_pay         := c_DATA.pay07_total_pay                                       ; -- 보수총액
        v_PAY12.pay12_month_pay         := c_DATA.pay07_month_hi                                        ; -- 보수월액(장기요양보험은 월건강보험료금액이 들어감)
        v_PAY12.pay12_insure_rate       := c_DATA.pay07_lt_rate                                         ; -- 보험료율(%)
        v_PAY12.pay12_month_amt         := c_DATA.pay07_month_lt                                        ; -- 월보험료(건강보험=평균보수월액*보험료율/장기요양=월건강보험료*보험료율/고용보험=해당없음)
        v_PAY12.pay12_fix_amt           := c_DATA.pay07_fix_lt                                          ; -- 확정보험료(건강보험,장기요양=월보험료 * 정산월수,고용보험=보수총액 * 보험료율)
        v_PAY12.pay12_pay_amt           := c_DATA.pay07_lt_sum                                          ; -- 납부보험료
        v_PAY12.pay12_unpay_amt         := c_DATA.pay07_lt_unsettled                                    ; -- 전년도 미정산보험료
        v_PAY12.pay12_settle_amt        := c_DATA.pay07_settle_lt                                       ; -- 정산보험료(확정보험료 - 납부보험료 + 전년도 미정산보험료)

        INSERT INTO pay12_retire_insure VALUES (v_PAY12.*);

        ---------------------------------------------------------------------------------
        -- 장기요양(퇴직정산)
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '232'                            ; --(232:장기요양(퇴직정산))
        v_PAY11.pay11_item_amt          := c_DATA.pay07_settle_lt           ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

        ---------------------------------------------------------------------------------
        -- 고용보험
        v_PAY12.pay12_retire_insure_id  := f_create_seq()                                               ;
        v_PAY12.pay12_month_id          := c_DATA.pay02_month_id                                        ;
        v_PAY12.pay12_insure_cd         := '4'                                                          ; --(2:건강보험/3:장기요양/4:고용보험)
        v_PAY12.pay12_year              := TO_CHAR(c_DATA.pay02_pay_date,'YYYY')                        ;
        v_PAY12.pay12_apply_term        := TO_CHAR(c_DATA.pay07_calc_start_date,'YYYY-MM-DD')
                                           ||' ~ '||
                                           TO_CHAR(c_DATA.pay07_retire_date,'YYYY-MM-DD')               ;
        v_PAY12.pay12_work_month_cnt    := COALESCE(c_DATA.pay07_work_month, c_DATA.pay07_calc_month)   ;
        v_PAY12.pay12_pay_month_cnt     := c_DATA.pay07_calc_month                                      ;
        v_PAY12.pay12_total_pay         := c_DATA.pay07_total_pay                                       ; -- 보수총액
        v_PAY12.pay12_month_pay         := c_DATA.pay07_month_pay                                       ; -- 보수월액(장기요양보험은 월건강보험료금액이 들어감)
        v_PAY12.pay12_insure_rate       := c_DATA.pay07_ei_rate                                         ; -- 보험료율(%)
        v_PAY12.pay12_month_amt         := 0                                                            ; -- 월보험료(건강보험=평균보수월액*보험료율/장기요양=월건강보험료*보험료율/고용보험=해당없음)
        v_PAY12.pay12_fix_amt           := c_DATA.pay07_fix_ei                                          ; -- 확정보험료(건강보험,장기요양=월보험료 * 정산월수,고용보험=보수총액 * 보험료율)
        v_PAY12.pay12_pay_amt           := c_DATA.pay07_ei_sum                                          ; -- 납부보험료
        v_PAY12.pay12_unpay_amt         := c_DATA.pay07_ei_unsettled                                    ; -- 전년도 미정산보험료
        v_PAY12.pay12_settle_amt        := c_DATA.pay07_settle_ei                                       ; -- 정산보험료(확정보험료 - 납부보험료 + 전년도 미정산보험료)

        INSERT INTO pay12_retire_insure VALUES (v_PAY12.*);

        ---------------------------------------------------------------------------------
        -- 고용보험(퇴직정산)
        v_PAY11.pay11_month_item_id     := f_create_seq()                   ;
        v_PAY11.pay11_month_id          := c_DATA.pay02_month_id            ;
        v_PAY11.pay11_item_type         := '2'                              ; --(1:지급항목/2:공제항목)
        v_PAY11.pay11_item_cd           := '242'                            ; --(242:고용보험(퇴직정산))
        v_PAY11.pay11_item_amt          := c_DATA.pay07_settle_ei           ;

        INSERT INTO pay11_month_item VALUES (v_PAY11.*);

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
