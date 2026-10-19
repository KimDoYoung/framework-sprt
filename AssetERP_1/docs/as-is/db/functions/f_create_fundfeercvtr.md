# f_create_fundfeercvtr

## FUNCTION public.f_create_fundfeercvtr(p_company_id numeric, p_std_date date)

- 반환: `character varying`
- 줄 수: 413

```sql
CREATE OR REPLACE FUNCTION public.f_create_fundfeercvtr(p_company_id numeric, p_std_date date)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST06                 ast06_tr%ROWTYPE;
    v_AST06_UNRCV           ast06_tr%ROWTYPE;
    v_AST07                 ast07_settle%ROWTYPE;
    v_AST90                 ast90_tr_back%ROWTYPE;

    v_TR                    RECORD;
    v_DEL                   RECORD;
    v_TGT                   RECORD;

    v_PRE_ACT_CLOSE_DATE    DATE;
    v_FOR_RCV_AMT           NUMERIC;
    v_RCV_AMT               NUMERIC;
    v_FOR_REM_AMT           NUMERIC;
    v_REM_AMT               NUMERIC;

    v_CNT                   NUMERIC;
    v_AST07_YN              BOOLEAN;

    v_PERSON_ID             NUMERIC := 9000100  ; --(batchFundFee)

    v_errMsg                VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '펀드보수 수령거래 및 분개생성 ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']';

    -- 전결산일
    v_PRE_ACT_CLOSE_DATE := f_get_account_close_date(p_company_id, p_std_date, -1);

    -------------------------------------------------------------------------------------
    -- 회계마감 체크
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id = p_company_id
       AND act05_std_date  >= p_std_date;
    IF v_CNT > 0 THEN
        v_errMsg := '회계마감 되었습니다.';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 기생성자료 제거
    -------------------------------------------------------------------------------------
    -- 거래코드 : 9004  미수보수 결제(자동)
    --            9912  펀드운용보수 수익처리(자동)
    --            9913  펀드운용보수 유보처리(자동)
    --            9922  펀드사무관리보수 수익처리(자동)
    --            9923  펀드사무관리보수 유보처리(자동)
    -------------------------------------------------------------------------------------
    v_errMsg := '기생성자료 제거 실패 ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']';
    FOR v_DEL IN ( SELECT 1                 AS seq
                        , ast07_settle_id   AS tr_id
                     FROM ast06_tr
                          INNER JOIN ast07_settle ON ast07_tr_id = ast06_tr_id
                    WHERE ast06_company_id  = p_company_id
                      AND ast07_settle_date >= p_std_date
                      AND ast07_tr_cd       = '9004'
                    UNION ALL
                   SELECT 2                 AS seq
                        , ast06_tr_id       AS tr_id
                     FROM ast06_tr
                    WHERE ast06_company_id  = p_company_id
                      AND ast06_date        >= p_std_date
                      AND ast06_tr_cd       IN ('9912','9913','9922','9923','9004')
                    ORDER BY seq, tr_id
    ) LOOP
        ---------------------------------------------------------------------------------
        -- 전표승인여부 체크
        SELECT COUNT(*)
          INTO v_CNT
          FROM act02_journal
         WHERE act02_tr_id = v_DEL.tr_id
           AND COALESCE(act02_fix_yn,'false') = 'true';
        IF v_CNT > 0 THEN
            v_errMsg := '승인완료 전표가 존재합니다.(거래ID:'||v_DEL.tr_id||')';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        DELETE FROM act80_relate_appr WHERE act80_journal_id IN ( SELECT act02_journal_id FROM act02_journal WHERE act02_tr_id = v_DEL.tr_id );
        ---------------------------------------------------------------------------------
        DELETE FROM act03_journal_dtl WHERE act03_journal_id IN ( SELECT act02_journal_id FROM act02_journal WHERE act02_tr_id = v_DEL.tr_id );
        DELETE FROM act06_journal_tmp WHERE act06_journal_id IN ( SELECT act02_journal_id FROM act02_journal WHERE act02_tr_id = v_DEL.tr_id );
        DELETE FROM act02_journal     WHERE act02_tr_id = v_DEL.tr_id;
        ---------------------------------------------------------------------------------
        IF v_DEL.seq = 1 THEN
            DELETE FROM ast07_settle WHERE ast07_settle_id = v_DEL.tr_id;
        ELSE
            DELETE FROM ast06_tr     WHERE ast06_tr_id     = v_DEL.tr_id;
        END IF;
        ---------------------------------------------------------------------------------
    END LOOP;

    -------------------------------------------------------------------------------------
    -- 거래생성
    -------------------------------------------------------------------------------------
    -- 적요코드 D20 보수인출
    --          D30 해지금/보수인출
    --          D31 보수유보
    --          D32 보수유보분인출
    -------------------------------------------------------------------------------------
    v_errMsg := '펀드보수 인출내역 가져오기 실패 ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']';
    FOR v_TR IN ( SELECT sys15_corp_id                                      AS corp_id
                       , icam10_icam_company_cd                             AS icam_company_cd
                       , icam10_icam_company_nm                             AS icam_company_nm
                       , icam10_consignment_cd                              AS consignment_cd
                       , icam10_consignment_nm                              AS consignment_nm
                       , icam10_deposit_id                                  AS deposit_id
                       , icam10_tr_cd                                       AS tr_cd
                       , icam10_note                                        AS note
                       , SUM(icam10_calc_fee)                               AS for_fee
                       , SUM(TRUNC(icam10_calc_fee * icam10_fx_rate))       AS fee
                       , SUM(icam10_unfee)                                  AS for_unfee
                       , SUM(TRUNC(icam10_unfee * icam10_fx_rate))          AS unfee
                       , SUM(icam10_fix_fee)                                AS for_fix_fee
                       , SUM(TRUNC(icam10_fix_fee * icam10_fx_rate))        AS fix_fee
                       , icam10_fx_rate                                     AS fx_rate
                       , icam10_cur_cd                                      AS cur_cd
                       , ( SELECT ast05_ast_class_tree_id
                             FROM ast05_tr_code
                            WHERE ast05_company_id = icam10_company_id
                              AND ast05_tr_cd      = CASE icam10_fee_type WHEN '24923' THEN '9912'  --(24923:현금미지급금 운용보수) => 9912:펀드운용보수 수익처리(자동)
                                                                          WHEN '24926' THEN '9922'  --(24926:현금미지급금 사무보수) => 9922:펀드사무관리보수 수익처리(자동)
                                                                          ELSE icam10_tr_cd END )   AS ast_class_tree_id
                    FROM (
                           SELECT t.*
                                , CASE WHEN icam10_unfee = 0 THEN icam10_rmk_nm ELSE '보수유보' END    AS icam10_note
                                , CASE WHEN icam10_rmk_cd = 'D32' THEN '9004'    --(9004:미수보수 결제(자동))
                                       ELSE (CASE icam10_fee_type WHEN '20407' THEN -- 수수료구분(20407:사무관리보수)
                                                                     (CASE WHEN icam10_unfee = 0
                                                                           THEN '9922'   -- 거래코드(9922:펀드사무관리보수 수익처리(자동))
                                                                           ELSE '9923'   -- 거래코드(9923:펀드사무관리보수 유보처리(자동))
                                                                      END)
                                                                  WHEN '20402' THEN -- 수수료구분(20402:운용보수) 
                                                                     (CASE WHEN icam10_unfee = 0
                                                                           THEN '9912'   -- 거래코드(9912:펀드운용보수 수익처리(자동))
                                                                           ELSE '9913'   -- 거래코드(9913:펀드운용보수 유보처리(자동))
                                                                      END) END) END AS icam10_tr_cd
                             FROM ( SELECT *
                                           ------------------------------------------------------------------
                                           -- 유보금액(icam10_unfee)
                                         , CASE WHEN icam10_rmk_cd = 'D32' THEN 0
                                                ELSE COALESCE(( SELECT f_calc_dual_fund_fee(icam10_company_id, icam10_icam_company_cd, icam10_fund_cd, icam10_std_date, icam10_fee)
                                                                  FROM icam10_fee
                                                                 WHERE icam10_company_id      = t1.icam10_company_id
                                                                   AND icam10_std_date        = t1.icam10_std_date
                                                                   AND icam10_icam_company_cd = t1.icam10_icam_company_cd
                                                                   AND icam10_fund_cd         = t1.icam10_fund_cd
                                                                   AND icam10_rmk_cd          = 'D31'                 -- (D31:보수유보)
                                                                   AND icam10_fee_type        IN ('24923','24926')    -- (24923:현금미지급운용보수 / 24926:현금미지급사무보수)
                                                              ),0) END AS icam10_unfee
                                           ------------------------------------------------------------------
                                           -- 전기보수(icam10_fix_fee)
                                         , COALESCE(( SELECT CASE WHEN ast30_cur_cd = 'KRW' THEN ast30_fix_fee ELSE ast30_for_fix_fee END
                                                        FROM ast30_book_fund_fee
                                                       WHERE ast30_company_id   = icam10_company_id
                                                         AND ast30_hold_date    = icam10_std_date - 1
                                                         AND ast30_corp_id      = CASE WHEN icam10_company_id = 1 THEN sys15_corp_id ELSE icam10_company_id END
                                                         AND ast30_fund_cd      = icam10_fund_cd ),0)   AS icam10_fix_fee
                                           ------------------------------------------------------------------
                                           -- 계좌ID(icam10_deposit_id)
                                         , ( SELECT icam11_deposit_id
                                               FROM icam11_fee_deposit
                                              WHERE icam11_company_id       = icam10_company_id
                                                AND icam11_icam_company_cd  = icam10_icam_company_cd
                                                AND icam11_fund_cd          = icam10_fund_cd
                                                AND icam11_start_date      <= icam10_std_date
                                              ORDER BY icam11_start_date DESC
                                              LIMIT 1 ) AS icam10_deposit_id
                                         ---------------------------------------------------------------------------
                                      FROM ( SELECT *
                                                  , f_calc_dual_fund_fee(icam10_company_id, icam10_icam_company_cd, icam10_fund_cd, icam10_std_date, icam10_fee) icam10_calc_fee
                                               FROM icam10_fee
                                                    LEFT OUTER JOIN sys15_corp ON ( sys15_company_id              = icam10_company_id      AND
                                                                                    REPLACE(sys15_corp_cd,'*','') = icam10_icam_company_cd )
                                              WHERE icam10_company_id = p_company_id
                                                AND icam10_std_date   = p_std_date
                                                AND icam10_rmk_cd     IN ('D20','D30','D32')   -- (D20:보수인출/D30:해지금,보수인출/D32:보수유보분인출)
                                           ) t1
                                  ) t
                         ) tt
                   GROUP BY sys15_corp_id
                          , icam10_icam_company_cd
                          , icam10_icam_company_nm
                          , icam10_consignment_cd
                          , icam10_consignment_nm
                          , icam10_deposit_id
                          , icam10_tr_cd
                          , icam10_fee_type
                          , icam10_note
                          , icam10_fx_rate
                          , icam10_cur_cd
                          , icam10_company_id
                   ORDER BY icam10_icam_company_nm, icam10_consignment_nm, icam10_deposit_id, icam10_tr_cd
    ) LOOP

        RAISE NOTICE '거래내역 IN - [%][%]',v_TR.tr_cd, v_TR.note;

        v_errMsg := '거래내역 생성 실패 ['||v_TR.tr_cd||']['||v_TR.corp_id||']['||v_TR.icam_company_nm||']['||v_TR.note||']';
        ---------------------------------------------------------------------------------
        -- 사무관리보수는 거래처ID 필수임.
        IF v_TR.tr_cd IN ('9922','9923') AND v_TR.corp_id IS NULL THEN
            v_errMsg := '운용사ID를 가져올 수 없습니다. 거래처등록 화면에서 거래처코드를 확인해주세요 ['||v_TR.icam_company_cd||' : '||v_TR.icam_company_nm||']';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        v_AST07_YN := false;
        ---------------------------------------------------------------------------------
        -- 유보거래 가져오기
        ---------------------------------------------------------------------------------
        IF v_TR.tr_cd = '9004' THEN
            v_errMsg := '유보처리 거래가져오기 실패 ['||p_std_date||']['||v_TR.ast_class_tree_id||']['||v_TR.corp_id||']['||v_TR.cur_cd||']';
            SELECT *
              INTO v_AST06_UNRCV
              FROM ast06_tr
             WHERE ast06_company_id         = p_company_id
               AND ast06_date              <= p_std_date
               AND ast06_ast_class_tree_id  = v_TR.ast_class_tree_id
               AND ( ( ast06_tr_cd          = '9923'        AND
                       ast06_corp_id        = v_TR.corp_id  ) OR
                     ( ast06_tr_cd         != '9923'        ) )
               AND ast06_cur_cd             = v_TR.cur_cd
               AND ast06_tr_cd              IN ('9913','9923')    -- (9913:펀드운용보수 유보처리(자동) / 9923:펀드사무관리보수 유보처리(자동))
               AND ast06_deposit_id IS NULL
               AND ast06_for_amt > COALESCE(( SELECT SUM(ast07_for_amt)
                                                FROM ast07_settle
                                               WHERE ast07_tr_id        = ast06_tr_id
                                                 AND ast07_settle_date <= p_std_date ),0)
             ORDER BY ast06_date
             LIMIT 1;
            -----------------------------------------------------------------------------
            IF v_AST06_UNRCV.ast06_tr_id IS NOT NULL THEN
                -----------------------------------------------------------------------------
                -- 총수령금액 가져오기
                SELECT COALESCE(SUM(ast07_for_amt), 0)
                     , COALESCE(SUM(ast07_amt)    , 0)
                  INTO v_FOR_RCV_AMT
                     , v_RCV_AMT
                  FROM ast07_settle
                 WHERE ast07_tr_id        = v_AST06_UNRCV.ast06_tr_id
                   AND ast07_settle_date <= p_std_date ;
                -----------------------------------------------------------------------------
                IF v_AST06_UNRCV.ast06_for_amt > v_FOR_RCV_AMT THEN
                    v_AST07_YN := true;     -- 미수보수 있음.
                END IF;
                RAISE NOTICE '==============================> 총수령금액 : [%][%]', v_FOR_RCV_AMT, v_RCV_AMT;
            END IF;
        END IF;

        ---------------------------------------------------------------------------------
        -- 미수보수가 존재하는 경우 => 미수보수 결제(ast07)
        ---------------------------------------------------------------------------------
        IF v_AST07_YN THEN
            v_errMsg := '미수보수 결제(ast07) 실패';
            -----------------------------------------------------------------------------
            v_AST07 := NULL;
            -----------------------------------------------------------------------------
            v_AST07.ast07_settle_id      := f_create_seq()                              ; 
            v_AST07.ast07_tr_id          := v_AST06_UNRCV.ast06_tr_id                   ;
            v_AST07.ast07_settle_date    := p_std_date                                  ;
            v_AST07.ast07_tr_cd          := '9004'                                      ; --(9004:미수보수 결제(자동))
            v_AST07.ast07_for_settle_amt := v_TR.for_fee                                ;
            v_AST07.ast07_settle_amt     := v_TR.fee                                    ;
            v_AST07.ast07_fx_rate        := v_TR.fx_rate                                ;
            v_AST07.ast07_deposit_id     := v_TR.deposit_id                             ;
            v_AST07.ast07_note           := v_TR.note||'-'||v_TR.consignment_nm         ;
            v_AST07.ast07_person_id      := v_PERSON_ID                                 ;
            -----------------------------------------------------------------------------
            -- 잔여미수보수
            v_FOR_REM_AMT := v_AST06_UNRCV.ast06_for_amt - v_FOR_RCV_AMT                ;
            v_REM_AMT     := v_AST06_UNRCV.ast06_amt     - v_RCV_AMT                    ;
            -----------------------------------------------------------------------------
            IF v_FOR_REM_AMT > v_TR.for_fee THEN
                --v_AST07.ast07_for_amt := v_FOR_REM_AMT - v_TR.for_fee ;
                v_AST07.ast07_for_amt := v_TR.for_fee ;
                v_AST07.ast07_amt     := TRUNC(v_REM_AMT / v_FOR_REM_AMT * v_AST07.ast07_for_amt) ;
            ELSE
                v_AST07.ast07_for_amt := v_FOR_REM_AMT  ;
                v_AST07.ast07_amt     := v_REM_AMT      ;
            END IF;
            -----------------------------------------------------------------------------
            INSERT INTO ast07_settle VALUES (v_AST07.*);

            -----------------------------------------------------------------------------
            -- 분개발생        
            v_errMsg := f_create_journal ( 'P'
                                         , p_company_id
                                         , v_AST07.ast07_person_id
                                         , v_AST07.ast07_tr_cd
                                         , v_AST07.ast07_settle_id
                                         , TRUE );
            IF v_errMsg != 'Y' THEN
                RAISE USING ERRCODE = '90001';
            END IF;

        ---------------------------------------------------------------------------------
        -- 미수보수가 없는 경우 => 수익처리(ast06)
        ---------------------------------------------------------------------------------
        ELSE
            v_errMsg := '수익처리(ast06) 실패';
            v_AST06 := NULL;
            -----------------------------------------------------------------------------
            v_AST06.ast06_tr_id             := f_create_seq()                           ;
            v_AST06.ast06_company_id        := p_company_id                             ;
            v_AST06.ast06_date              := p_std_date                               ;
            v_AST06.ast06_tr_cd             := v_TR.tr_cd                               ;
            v_AST06.ast06_ast_class_tree_id := v_TR.ast_class_tree_id                   ;
            v_AST06.ast06_corp_id           := v_TR.corp_id                             ;
            v_AST06.ast06_cur_cd            := v_TR.cur_cd                              ;
            v_AST06.ast06_fx_rate           := v_TR.fx_rate                             ;
            v_AST06.ast06_note              := v_TR.note||'-'||v_TR.consignment_nm      ;
            v_AST06.ast06_person_id         := v_PERSON_ID                              ;
            -----------------------------------------------------------------------------
            IF v_TR.for_unfee != 0 THEN -- 유보금액 존재
                v_AST06.ast06_amt           := v_TR.unfee                               ;
                v_AST06.ast06_for_amt       := v_TR.for_unfee                           ;
                v_AST06.ast06_cont_amt      := v_TR.unfee                               ;
                v_AST06.ast06_for_cont_amt  := v_TR.for_unfee                           ;
                v_AST06.ast06_deposit_id    := NULL                                     ;
            -----------------------------------------------------------------------------
            ELSE
                v_AST06.ast06_amt           := v_TR.fee                                 ;
                v_AST06.ast06_for_amt       := v_TR.for_fee                             ;
                v_AST06.ast06_cont_amt      := v_TR.fee                                 ;
                v_AST06.ast06_for_cont_amt  := v_TR.for_fee                             ;
                v_AST06.ast06_deposit_id    := v_TR.deposit_id                          ;
            END IF;
            -----------------------------------------------------------------------------
            IF v_AST06.ast06_deposit_id IS NULL THEN
                v_AST06.ast06_settle_mng_yn := 'true'  ;
            ELSE
                v_AST06.ast06_settle_mng_yn := 'false' ;
            END IF;
            -----------------------------------------------------------------------------
            INSERT INTO ast06_tr VALUES (v_AST06.*);

            RAISE NOTICE '==============================> ast06_tr insert';

            -----------------------------------------------------------------------------
            -- 분개발생        
            v_errMsg := f_create_journal ( 'P'
                                         , p_company_id
                                         , v_AST06.ast06_person_id
                                         , v_AST06.ast06_tr_cd
                                         , v_AST06.ast06_tr_id
                                         , TRUE );
            IF v_errMsg != 'Y' THEN
                RAISE USING ERRCODE = '90001';
            END IF;
        END IF;
    END LOOP;
    -------------------------------------------------------------------------------------
    -- 9002 미수금 결제 => 사용자가 화면에서 직접 입력한 결제건중 ast06이 재생성된 경우
    --                     새로 생성된 tr_id로 UPDATE하기
    -------------------------------------------------------------------------------------
    FOR v_TGT IN ( SELECT *
                     FROM ast07_settle
                    WHERE ast07_settle_date >= p_std_date
                      AND ast07_tr_cd        = '9002'
                      AND NOT EXISTS ( SELECT 1
                                         FROM ast06_tr
                                        WHERE ast06_tr_id = ast07_tr_id )
    ) LOOP
        ---------------------------------------------------------------------------------
        -- 삭제된 거래내역 가져오기
        SELECT *
          INTO v_AST90
          FROM ast90_tr_back
         WHERE ast90_tr_id = v_TGT.ast07_tr_id
           AND ast90_dml_type = 'DELETE'
         LIMIT 1;
        ---------------------------------------------------------------------------------
        IF v_AST90.ast90_tr_back_id IS NOT NULL THEN
            -----------------------------------------------------------------------------
            -- 생성된 거래내역 가져오기
            SELECT *
              INTO v_AST06
              FROM ast06_tr
             WHERE ast06_company_id         = p_company_id
               AND ast06_corp_id            = v_AST90.ast90_corp_id
               AND ast06_date               = v_AST90.ast90_date
               AND ast06_ast_class_tree_id  = v_AST90.ast90_ast_class_tree_id
               AND ast06_tr_cd              = v_AST90.ast90_tr_cd
               AND ast06_cur_cd             = v_AST90.ast90_cur_cd;
            -----------------------------------------------------------------------------
            IF v_AST06.ast06_tr_id IS NOT NULL THEN
                -- 결제내역의 거래코드 UPDATE
                UPDATE ast07_settle
                   SET ast07_tr_id = v_AST06.ast06_tr_id
                 WHERE ast07_settle_id = v_TGT.ast07_settle_id;
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
