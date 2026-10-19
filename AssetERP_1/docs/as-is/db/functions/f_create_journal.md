# f_create_journal

## FUNCTION public.f_create_journal(p_proc_type character varying, p_company_id numeric, p_person_id numeric, p_tr_cd character varying, p_tr_id numeric, p_except_yn boolean)

- 반환: `character varying`
- 줄 수: 808

```sql
CREATE OR REPLACE FUNCTION public.f_create_journal(p_proc_type character varying, p_company_id numeric, p_person_id numeric, p_tr_cd character varying, p_tr_id numeric, p_except_yn boolean)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_BIZ01                 biz01_promo%ROWTYPE;
    v_CRD01                 crd01_card%ROWTYPE;
    v_CRD02                 crd02_data%ROWTYPE;
    v_AST01                 ast01_class_tree%ROWTYPE;
    v_AST06                 ast06_tr%ROWTYPE;
    v_AST07                 ast07_settle%ROWTYPE;
    v_PAY50                 pay50_expense%ROWTYPE;
    v_AST21                 ast21_tr_4insure%ROWTYPE;
    v_ACT02                 act02_journal%ROWTYPE;
    v_ACT06                 act06_journal_tmp%ROWTYPE;

    v_JNL                   RECORD;

    v_DML                   VARCHAR(1);

    v_CUST_ACNT_CD          act01_account_code.act01_account_cd%TYPE;
    v_ACNT_CD               act01_account_code.act01_account_cd%TYPE;
    v_ORG_TR_CD             VARCHAR(4) := NULL;
    v_DEPOSIT_ID            NUMERIC;
    v_OUT_DEPOSIT_ID        NUMERIC;
    v_IPO_DEPOSIT_ID        NUMERIC;    --청약계좌
    v_PRE_DEPOSIT_ID        NUMERIC;    --선급종목
    v_AMT                   NUMERIC;
    v_FOR_AMT               NUMERIC;
    v_SETTLE_AMT            NUMERIC;
    v_FOR_SETTLE_AMT        NUMERIC;
    v_CONT_AMT              NUMERIC;
    v_FOR_CONT_AMT          NUMERIC;
    v_BOOK_AMT              NUMERIC;
    v_TAX                   NUMERIC;
    v_FEE                   NUMERIC;
    v_DR_AMT                NUMERIC;
    v_CR_AMT                NUMERIC;
    v_DEPN_AMT              NUMERIC;
    v_JNL_AMT               NUMERIC;
    v_FOR_JNL_AMT           NUMERIC;

    v_NOTE                  act06_journal_tmp.act06_note%TYPE;

    v_MAP_ID                VARCHAR(10);
    v_TMP_MAP_ID            VARCHAR(10);
    v_DEPOSIT_MAP_ID        VARCHAR(10);
    v_IN_DEPOSIT_MAP_ID     VARCHAR(10);
    v_OUT_DEPOSIT_MAP_ID    VARCHAR(10);

    v_DR_CUR_CD             VARCHAR(3);
    v_CR_CUR_CD             VARCHAR(3);

    v_LOOP_CNT              NUMERIC;
    v_AST_ID                NUMERIC;

    v_CNT                   NUMERIC;
    v_DR_SEQ                NUMERIC;
    v_CR_SEQ                NUMERIC;

    v_COLUMN                TEXT;
    v_SQL                   TEXT;

    v_errMsg                VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '분개생성/취소 실패 ['||p_proc_type||']['||p_tr_cd||']['||p_tr_id||']';

    -------------------------------------------------------------------------------------
    -- 분개내역이 이미 존재하는 경우 분개내역 가져오고, 임시/상세분개장 삭제
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_ACT02
      FROM act02_journal
     WHERE p_tr_id IN (act02_tr_id, act02_biz_id);
    -------------------------------------------------------------------------------------
    v_errMsg := '분개생성/취소 실패 1 ['||p_proc_type||']['||p_tr_cd||']['||p_tr_id||']';
    IF p_proc_type = 'P' THEN
        IF v_ACT02.act02_journal_id IS NULL THEN
            v_DML := 'I';
        ELSE
            v_DML := 'U';
        END IF;
    -------------------------------------------------------------------------------------
    ELSIF p_proc_type = 'C' THEN
        v_DML := 'D';
    END IF;
    -------------------------------------------------------------------------------------
    v_errMsg := '분개생성/취소 실패 2 ['||p_proc_type||']['||p_tr_cd||']['||p_tr_id||']';
    IF v_DML IN ('U','D') AND COALESCE(v_ACT02.act02_fix_yn,'false') = 'true' THEN
        IF p_tr_cd != '9001' THEN ----(9001:법인카드사용)는 체크 제외!!
            v_errMsg := '승인완료된 전표는 변경 및 삭제가 불가합니다.';
            RAISE USING ERRCODE = '90001';
        END IF;
    END IF;
    /*-----------------------------------------------------------------------------------
        거래코드에 따라 1. 대상거래 가져오기
                        2. 분개일자, 연결ID, 비고 SET
                        3. 실계정코드MapID SET
                        4. AMT, TAX 금액 SET
                        5. 사용자지정 계정코드 SET
    -----------------------------------------------------------------------------------*/
    v_errMsg := '분개생성/취소 실패 3 ['||p_proc_type||']['||p_tr_cd||']['||p_tr_id||']';
    IF p_tr_cd = '9001' THEN    --(9001:법인카드사용)
        ---------------------------------------------------------------------------------
        SELECT *
          INTO v_BIZ01
          FROM biz01_promo
         WHERE biz01_promo_id = p_tr_id;

        IF v_BIZ01.biz01_promo_id IS NULL THEN
            v_errMsg := '분개생성/취소 실패 - 법인카드내역이 존재하지 않습니다. ['||p_tr_id||']';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        SELECT *
          INTO v_CRD01
          FROM crd01_card
         WHERE crd01_card_id = v_BIZ01.biz01_card_id;

        IF v_CRD01.crd01_card_id IS NULL THEN
            v_errMsg := '분개생성/취소 실패 - 법인카드 카드정보가 존재하지 않습니다. ['||p_tr_id||']';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        SELECT *
          INTO v_CRD02
          FROM crd02_data
         WHERE crd02_data_id = v_BIZ01.biz01_card_data_id;

        IF v_CRD02.crd02_data_id IS NULL THEN
            v_errMsg := '분개생성/취소 실패 - 법인카드 사용내역이 존재하지 않습니다. ['||p_tr_id||']';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        v_ACT02.act02_date          := v_BIZ01.biz01_provide_date           ; -- 분개일자
        v_ACT02.act02_biz_id        := v_BIZ01.biz01_promo_id               ; -- 이익제공ID(biz01_promo_id)
        v_ACT02.act02_cur_cd        := 'KRW'                                ; -- 통화코드
        v_ACT02.act02_fix_yn        := 'true'                               ; -- 전표승인여부
        v_ACT02.act02_fix_person_nm := 'PASS'                               ; -- 전표승인자
        v_ACT02.act02_fix_date      := f_sysdate()                          ; -- 전표승인일시
        ---------------------------------------------------------------------------------
        -- 비고
        /*SELECT crd01_card_nm
          INTO v_ACT02.act02_note
          FROM crd01_card
         WHERE crd01_card_id = v_BIZ01.biz01_card_id;*/
        SELECT CONCAT( v_CRD02.crd02_franchise_nm
                     , '('||f_cdnm('ProvideContentCode', v_BIZ01.biz01_provide_content_cd, v_BIZ01.biz01_company_id, v_BIZ01.biz01_provide_date)||')'
                     , ' - '||v_BIZ01.biz01_note )
          INTO v_ACT02.act02_note;
        RAISE NOTICE '====> 비고 : %', v_ACT02.act02_note;
        ---------------------------------------------------------------------------------
        v_FOR_AMT               := COALESCE(v_BIZ01.biz01_provide_amt,0);
        v_AMT                   := v_FOR_AMT                            ;
        ---------------------------------------------------------------------------------
        IF v_BIZ01.biz01_tax_type = '2' THEN -- (1:면세/2:과세/3:공통/4:불공)
            v_TAX := COALESCE(v_BIZ01.biz01_tax,0);
            IF v_TAX = 0 THEN
                v_TAX := TRUNC(v_AMT / 1.1 * 0.1);
            END IF;
        ELSE
            v_TAX := 0;
        END IF;
        ---------------------------------------------------------------------------------
        v_FOR_CONT_AMT          := v_FOR_AMT                            ;
        v_CONT_AMT              := v_AMT - v_TAX                        ;
        v_FEE                   := 0                                    ;
        v_DR_AMT                := 0                                    ;
        v_CR_AMT                := 0                                    ;
        ---------------------------------------------------------------------------------
        v_MAP_ID                := '0000000000'                         ; -- 실계정코드 Map ID
        ---------------------------------------------------------------------------------
        IF v_CRD01.crd01_card_type = '2' THEN   --(2:체크카드)
            v_DEPOSIT_ID := v_CRD01.crd01_deposit_id;
        END IF;
        ---------------------------------------------------------------------------------
        -- 사용자지정 계정코드 가져오기
        SELECT act01_account_cd
          INTO v_CUST_ACNT_CD
          FROM act01_account_code
         WHERE act01_account_code_id = v_BIZ01.biz01_account_code_id;

        IF v_CUST_ACNT_CD IS NULL THEN
            v_errMsg := CONCAT('분개생성/취소 실패 - 계정코드가 존재하지 않습니다. [',v_BIZ01.biz01_account_code_id,']');
            RAISE USING ERRCODE = '90001';
        END IF;
    -------------------------------------------------------------------------------------
    ELSIF p_tr_cd IN ('9002','9003','9004','9007') THEN    --(9002:미수금 결제/9003:미지급금 결제/9004:미수보수 결제(자동)/9007:미수보수 반제)
        v_errMsg := '분개생성/취소 실패 4 ['||p_proc_type||']['||p_tr_cd||']['||p_tr_id||']';
        SELECT *
          INTO v_AST07
          FROM ast07_settle
         WHERE ast07_settle_id = p_tr_id;
        ---------------------------------------------------------------------------------
        IF v_AST07.ast07_settle_id IS NOT NULL THEN
            v_errMsg := '분개생성/취소 실패 5 ['||p_proc_type||']['||p_tr_cd||']['||p_tr_id||']-'||v_AST07.ast07_settle_id;
            -----------------------------------------------------------------------------
            IF v_AST07.ast07_expense_id IS NOT NULL THEN -- 자금집행결의서
                v_errMsg := '분개생성/취소 실패 6 ['||p_proc_type||']['||p_tr_cd||']['||p_tr_id||']-'||v_AST07.ast07_expense_id;
                SELECT *
                  INTO v_PAY50
                  FROM pay50_expense
                 WHERE pay50_expense_id = v_AST07.ast07_expense_id;
                -------------------------------------------------------------------------
                v_ACT02.act02_date      := v_AST07.ast07_settle_date    ; -- 분개일자
                v_ACT02.act02_tr_id     := v_AST07.ast07_settle_id      ; -- 거래ID(ast07_settle_id)
                v_ACT02.act02_corp_id   := v_PAY50.pay50_corp_id        ; -- 거래처
                v_ACT02.act02_cur_cd    := 'KRW'                        ; -- 통화코드
                -------------------------------------------------------------------------
                -- 비고
                IF COALESCE(v_AST07.ast07_note,'') = '' THEN
                    v_ACT02.act02_note  := v_PAY50.pay50_desc           ; 
                ELSE
                    v_ACT02.act02_note  := v_AST07.ast07_note           ;
                END IF;
                -------------------------------------------------------------------------
                v_ORG_TR_CD             := '9100'                       ; -- 본거래의 거래코드(9100:사업비 발생)
                -------------------------------------------------------------------------
                v_FOR_AMT               := v_AST07.ast07_for_amt        ;
                v_AMT                   := v_AST07.ast07_amt            ;
                v_FOR_SETTLE_AMT        := v_AST07.ast07_for_settle_amt ;
                v_SETTLE_AMT            := v_AST07.ast07_settle_amt     ;
                v_TAX                   := 0                            ;
                v_FEE                   := 0                            ;
                v_DR_AMT                := 0                            ;
                v_CR_AMT                := 0                            ;
                v_DEPOSIT_ID            := v_AST07.ast07_deposit_id     ;

                --PERFORM log_message('INFO', 'v_AMT            = v_AST07.ast07_amt           ['||v_AMT||'] SET!!!');
                --PERFORM log_message('INFO', 'v_FOR_AMT        = v_AST07.ast07_for_amt       ['||v_FOR_AMT||'] SET!!!');
                --PERFORM log_message('INFO', 'v_SETTLE_AMT     = v_AST07.ast07_settle_amt    ['||v_SETTLE_AMT||'] SET!!!');
                --PERFORM log_message('INFO', 'v_FOR_SETTLE_AMT = v_AST07.ast07_for_settle_amt['||v_FOR_SETTLE_AMT||'] SET!!!');

            -----------------------------------------------------------------------------
            ELSE -- 일반 거래입력
                SELECT *
                  INTO v_AST06
                  FROM ast06_tr
                 WHERE ast06_tr_id = v_AST07.ast07_tr_id;
                -------------------------------------------------------------------------
                v_ACT02.act02_date      := v_AST07.ast07_settle_date    ; -- 분개일자
                v_ACT02.act02_tr_id     := v_AST07.ast07_settle_id      ; -- 거래ID(ast07_settle_id)
                v_ACT02.act02_corp_id   := v_AST06.ast06_corp_id        ; -- 거래처
                v_ACT02.act02_cur_cd    := v_AST06.ast06_cur_cd         ; -- 통화코드
                -------------------------------------------------------------------------
                -- 비고
                IF COALESCE(v_AST07.ast07_note,'') = '' THEN
                    v_ACT02.act02_note  := v_AST06.ast06_note           ;
                ELSE
                    v_ACT02.act02_note  := v_AST07.ast07_note           ;
                END IF;
                -------------------------------------------------------------------------
                IF v_AST06.ast06_tr_cd = '9006' THEN --본거래가 (9006:법인카드미지급금)인 경우 '9001:법인카드사용'로 SET
                    v_ORG_TR_CD         := '9001';
                ELSE
                    v_ORG_TR_CD         := v_AST06.ast06_tr_cd  ; -- 본거래의 거래코드
                END IF;
                -------------------------------------------------------------------------
                v_FOR_AMT               := v_AST07.ast07_for_amt        ;
                v_AMT                   := v_AST07.ast07_amt            ;
                v_FOR_SETTLE_AMT        := v_AST07.ast07_for_settle_amt ;
                v_SETTLE_AMT            := v_AST07.ast07_settle_amt     ;
                v_TAX                   := 0                            ;
                v_FEE                   := 0                            ;
                v_DR_AMT                := 0                            ;
                v_CR_AMT                := 0                            ;
                v_DEPOSIT_ID            := v_AST07.ast07_deposit_id     ;
            END IF;
        ---------------------------------------------------------------------------------
        ELSE
            SELECT *
              INTO v_AST06
              FROM ast06_tr
             WHERE ast06_tr_id = p_tr_id; 
            -----------------------------------------------------------------------------
            v_ACT02.act02_date      := v_AST06.ast06_date                   ; -- 분개일자
            v_ACT02.act02_tr_id     := v_AST06.ast06_tr_id                  ; -- 거래ID(ast06_tr_id)
            v_ACT02.act02_corp_id   := v_AST06.ast06_corp_id                ; -- 거래처
            v_ACT02.act02_cur_cd    := v_AST06.ast06_cur_cd                 ; -- 통화코드
            v_ACT02.act02_note      := v_AST06.ast06_note                   ; -- 비고
            -----------------------------------------------------------------------------
            v_FOR_AMT               := COALESCE(v_AST06.ast06_for_amt,0)    ;
            v_AMT                   := COALESCE(v_AST06.ast06_amt    ,0)    ;
            v_FOR_SETTLE_AMT        := v_FOR_AMT                            ;
            v_SETTLE_AMT            := v_AMT                                ;
            v_TAX                   := 0                                    ;
            v_FEE                   := 0                                    ;
            v_DR_AMT                := 0                                    ;
            v_CR_AMT                := 0                                    ;
            v_DEPOSIT_ID            := v_AST06.ast06_deposit_id             ;
        END IF;
        ---------------------------------------------------------------------------------
        -- 실계정코드 Map ID
        IF v_AST06.ast06_ast_class_tree_id IS NULL THEN
            v_MAP_ID := '0000000000' ;
        ELSE
            SELECT COALESCE(ast01_item_s_class_cd, '00')||
                   COALESCE(ast01_account_type   , '99')||
                   COALESCE(SUBSTR(ast01_item_d_class_cd,7,2), '00')
              INTO v_MAP_ID
              FROM ast01_class_tree
             WHERE ast01_class_tree_id = v_AST06.ast06_ast_class_tree_id;
        END IF;
        RAISE NOTICE 'v_MAP_ID : %' ,v_MAP_ID;
    -------------------------------------------------------------------------------------
    ELSE
        SELECT *
          INTO v_AST06
          FROM ast06_tr
         WHERE ast06_tr_id = p_tr_id;
        ---------------------------------------------------------------------------------
        IF v_AST06.ast06_tr_id IS NULL THEN
            v_errMsg := '분개생성/취소 실패 - 거래내역이 존재하지 않습니다. ['||p_tr_id||']';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        v_ACT02.act02_date      := v_AST06.ast06_date                      ; -- 분개일자
        v_ACT02.act02_tr_id     := v_AST06.ast06_tr_id                     ; -- 거래ID(ast06_tr_id)
        v_ACT02.act02_corp_id   := v_AST06.ast06_corp_id                   ; -- 거래처
        v_ACT02.act02_cur_cd    := v_AST06.ast06_cur_cd                    ; -- 통화코드
        v_ACT02.act02_note      := v_AST06.ast06_note                      ; -- 비고
        ---------------------------------------------------------------------------------
        -- 금액SET
        v_FOR_AMT               := COALESCE(v_AST06.ast06_for_amt       ,0);
        v_AMT                   := COALESCE(v_AST06.ast06_amt           ,0);
        v_FOR_SETTLE_AMT        := v_FOR_AMT                               ;
        v_SETTLE_AMT            := v_AMT                                   ;
        v_FOR_CONT_AMT          := COALESCE(v_AST06.ast06_for_cont_amt  ,0);
        v_CONT_AMT              := COALESCE(v_AST06.ast06_cont_amt      ,0);
        v_BOOK_AMT              := COALESCE(v_AST06.ast06_book_amt      ,0);
        v_TAX                   := COALESCE(v_AST06.ast06_tax           ,0);
        v_FEE                   := COALESCE(v_AST06.ast06_fee           ,0);
        v_DR_AMT                := 0                                       ;
        v_CR_AMT                := 0                                       ;
        ---------------------------------------------------------------------------------
        v_DEPN_AMT := 0;
        IF v_AST06.ast06_ast_class_tree_id IS NOT NULL THEN
            -----------------------------------------------------------------------------
            SELECT *
              INTO v_AST01
              FROM ast01_class_tree
             WHERE ast01_class_tree_id = v_AST06.ast06_ast_class_tree_id;
            -----------------------------------------------------------------------------
            -- 감가상각대상 자산은 감가상각누계액 가져오기
            IF COALESCE(v_AST01.ast01_item_l_class_cd,'00') IN ('50','55') THEN  --(50:유형자산/55:무형자산)
                SELECT ast13_acm_depn_cost
                  INTO v_DEPN_AMT
                  FROM ast13_book_depn
                 WHERE ast13_pur_tr_id  = v_AST06.ast06_pur_tr_id
                   AND ast13_depn_date  < v_AST06.ast06_date
                 ORDER BY ast13_depn_date DESC
                 LIMIT 1;
            END IF;
        END IF;
        ---------------------------------------------------------------------------------
        v_DEPOSIT_ID            := v_AST06.ast06_deposit_id             ;
        ---------------------------------------------------------------------------------
        IF v_AST06.ast06_tr_cd = '9005' THEN    --(9005:계좌이체)
            v_LOOP_CNT       := 2;
            v_OUT_DEPOSIT_ID := v_AST06.ast06_ast_class_tree_id;

            SELECT MAX(DR_CUR_CD), MAX(CR_CUR_CD)
              INTO v_DR_CUR_CD, v_CR_CUR_CD
              FROM ( SELECT CASE WHEN ast01_class_tree_id = v_DEPOSIT_ID     THEN COALESCE(ast01_cur_cd,'KRW') ELSE '' END DR_CUR_CD
                          , CASE WHEN ast01_class_tree_id = v_OUT_DEPOSIT_ID THEN COALESCE(ast01_cur_cd,'KRW') ELSE '' END CR_CUR_CD
                       FROM ast01_class_tree
                      WHERE ast01_class_tree_id IN (v_DEPOSIT_ID, v_OUT_DEPOSIT_ID) ) t;

            /*IF v_CR_CUR_CD = 'KRW' THEN
                v_DR_AMT := v_AMT;
                v_CR_AMT := COALESCE(v_AST06.ast06_book_amt,0) + v_FEE;
            ELSIF v_DR_CUR_CD = 'KRW' THEN
                v_DR_AMT := v_AMT - v_FEE;
                v_CR_AMT := COALESCE(v_AST06.ast06_book_amt,0);
            ELSE
                v_DR_AMT := v_AMT;
                v_CR_AMT := COALESCE(v_AST06.ast06_book_amt,0);
            END IF;*/
        ELSE
            v_LOOP_CNT       := 1;
            v_OUT_DEPOSIT_ID := NULL;
        END IF;
        RAISE NOTICE 'v_DEPOSIT_ID(%), v_OUT_DEPOSIT_ID(%)' ,v_DEPOSIT_ID, v_OUT_DEPOSIT_ID;
        ---------------------------------------------------------------------------------
        IF v_AST06.ast06_tr_cd IN ('3501','3502','3510','3504') THEN  --(3501:공모주청약/3502:청약금환불/3510:채권청약금납입/3504:유상청약)
            SELECT ast08_account_id
              INTO v_IPO_DEPOSIT_ID
              FROM ast08_tr_finance
             WHERE ast08_tr_id = v_AST06.ast06_tr_id;
        ELSIF v_AST06.ast06_tr_cd IN ('3503','3511') THEN      --(3503:청약입고/3511:채권청약입고)
            v_IPO_DEPOSIT_ID := v_AST06.ast06_deposit_id;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_AST06.ast06_tr_cd IN ('9010') THEN  --(9010:선급처리)
            v_PRE_DEPOSIT_ID := v_AST06.ast06_ast_class_tree_id;
        END IF;
        ---------------------------------------------------------------------------------
        IF v_AST06.ast06_tr_cd IN ('5052') THEN  --(5052:4대보험납부)
            SELECT *
              INTO v_AST21
              FROM ast21_tr_4insure
             WHERE ast21_tr_id = v_AST06.ast06_tr_id;
        END IF;
        ---------------------------------------------------------------------------------
        -- 실계정코드 MAP ID
        IF v_AST06.ast06_ast_class_tree_id IS NULL THEN
            v_MAP_ID := '0000000000' ;
        ELSE
            FOR i IN 1..v_LOOP_CNT LOOP
                RAISE NOTICE 'for cnt : %', i;

                IF i = 1 THEN
                    v_AST_ID := v_AST06.ast06_ast_class_tree_id;
                ELSE
                    v_AST_ID := v_AST06.ast06_deposit_id;
                END IF;
                RAISE NOTICE 'v_AST_ID : (%)' ,v_AST_ID;

                SELECT COALESCE(ast01_item_s_class_cd, '000000')||
                       COALESCE(ast01_account_type   , '99')||
                       COALESCE(SUBSTR(ast01_item_d_class_cd,7,2), '00')
                  INTO v_TMP_MAP_ID
                  FROM ast01_class_tree
                 WHERE ast01_class_tree_id = v_AST_ID;

                IF i = 1 THEN
                    v_MAP_ID             := v_TMP_MAP_ID;
                    v_OUT_DEPOSIT_MAP_ID := v_TMP_MAP_ID;
                ELSE
                    v_IN_DEPOSIT_MAP_ID  := v_TMP_MAP_ID;
                END IF;
            END LOOP;

            RAISE NOTICE 'v_MAP_ID(%), v_IN_DEPOSIT_MAP_ID(%)' ,v_MAP_ID, v_IN_DEPOSIT_MAP_ID;
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 회계결산여부 체크
    -------------------------------------------------------------------------------------
    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id =  p_company_id
       AND act05_std_date   >= v_ACT02.act02_date;
    IF v_CNT > 0 THEN
        v_errMsg := '회계마감 되었습니다.';
        RAISE USING ERRCODE = '90001';
    END IF;
    -------------------------------------------------------------------------------------
    IF v_DEPOSIT_ID IS NOT NULL THEN
        SELECT COALESCE(ast01_item_s_class_cd, '000000')||
               COALESCE(ast01_account_type   , '99')||
               COALESCE(SUBSTR(ast01_item_d_class_cd,7,2), '00')
          INTO v_DEPOSIT_MAP_ID
          FROM ast01_class_tree
         WHERE ast01_class_tree_id = v_DEPOSIT_ID;
    ELSE
        v_DEPOSIT_MAP_ID := '0000000000';
    END IF;
    
    -------------------------------------------------------------------------------------
    -- 분개취소(삭제)
    -------------------------------------------------------------------------------------
    -- 분개취소처리 또는 분개재처리인 경우 상세/임시 분개장 삭제
    IF v_DML IN ('U','D') THEN
        ---------------------------------------------------------------------------------
        -- 분개상세 삭제(act03_journal_dtl)
        DELETE
          FROM act03_journal_dtl
         WHERE act03_journal_id IN ( SELECT act02_journal_id
                                       FROM act02_journal
                                      WHERE (CASE WHEN p_tr_cd = '9001' THEN act02_biz_id
                                                  ELSE act02_tr_id END) = p_tr_id );
        -- 임시분개장 삭제(act06_journal_tmp)
        DELETE
          FROM act06_journal_tmp
         WHERE act06_journal_id IN ( SELECT act02_journal_id
                                       FROM act02_journal
                                      WHERE (CASE WHEN p_tr_cd = '9001' THEN act02_biz_id
                                                  ELSE act02_tr_id END) = p_tr_id );
        ---------------------------------------------------------------------------------
        -- 분개정보 삭제(act02_journal)
        IF v_DML = 'D' THEN   -- 분개취소인 경우에만 분개정보 삭제
            DELETE
              FROM act02_journal
             WHERE (CASE WHEN p_tr_cd = '9001' THEN act02_biz_id
                         ELSE act02_tr_id END) = p_tr_id ;
        END IF;
    END IF;

    -------------------------------------------------------------------------------------
    -- 분개처리
    -------------------------------------------------------------------------------------
    IF p_proc_type = 'P' THEN
        ---------------------------------------------------------------------------------
        -- 분개정보 생성(act02_journal)
        ---------------------------------------------------------------------------------
        v_ACT02.act02_company_id    := p_company_id     ;
        v_ACT02.act02_person_id     := p_person_id      ;
        v_ACT02.act02_close_yn      := 'false'          ;

        ---------------------------------------------------------------------------------
        IF v_DML = 'I' THEN
            -----------------------------------------------------------------------------
            v_ACT02.act02_journal_id := f_create_seq() ;
            v_ACT02.act02_journal_no := f_create_journal_no(v_ACT02.act02_company_id, v_ACT02.act02_date);
        ---------------------------------------------------------------------------------
        ELSE
            DELETE FROM act02_journal WHERE act02_journal_id = v_ACT02.act02_journal_id;
        END IF;
        ---------------------------------------------------------------------------------
        INSERT INTO act02_journal VALUES (v_ACT02.*);

        RAISE NOTICE '------------------- 임시분개장 생성 -----------------------------';
     
        ---------------------------------------------------------------------------------
        -- 임시분개장 생성(act06_journal_tmp)
        ---------------------------------------------------------------------------------
        FOR v_JNL IN ( SELECT act12_journal_map.*
                            , f_get_real_account_code(act12_company_id, act12_repr_account_cd, v_MAP_ID)  AS act13_real_account_cd
                         FROM act11_tr_map
                              INNER JOIN act12_journal_map ON ( act12_company_id    = act11_company_id      AND
                                                                act12_journal_group = act11_journal_group   AND
                                                                COALESCE(act12_use_yn,'false') = 'true'     )
                        WHERE act11_company_id  = p_company_id
                          AND act11_tr_cd       = p_tr_cd
                          AND COALESCE(act11_use_yn,'false') = 'true'
                        ORDER BY act12_seq
        ) LOOP
            -----------------------------------------------------------------------------
            v_ACT06 := NULL;
            v_ACT06.act06_account_map := v_MAP_ID;
            v_NOTE := NULL;
            -----------------------------------------------------------------------------
            -- 실계정코드 SET
            -----------------------------------------------------------------------------

            RAISE NOTICE '대표계정코드          ==> %', v_JNL.act12_repr_account_cd;
            RAISE NOTICE 'v_DEPOSIT_ID          ==> %', v_DEPOSIT_ID;
            RAISE NOTICE 'v_DEPOSIT_MAP_ID      ==> %', v_DEPOSIT_MAP_ID;
            RAISE NOTICE 'v_IN_DEPOSIT_MAP_ID   ==> %', v_IN_DEPOSIT_MAP_ID;
            RAISE NOTICE 'v_OUT_DEPOSIT_MAP_ID  ==> %', v_OUT_DEPOSIT_MAP_ID;
            RAISE NOTICE '실계정코드            ==> %', v_JNL.act13_real_account_cd;
            RAISE NOTICE 'p_tr_cd               ==> %', p_tr_cd;
            
            /* 1) 대표계정코드가 (1200:미수금/2200:미지급금)이며
               2) 예금관리계좌가 존재하며
               3) 미수/미지급금 결제(9002:미수금 결제/9003:미지급금 결제/9004:미수보수 결제(자동)) 거래가 아닌 경우 ===> '8888:예금계정'으로 변경 */
            -----------------------------------------------------------------------------
            IF ( SUBSTR(v_JNL.act12_repr_account_cd,1,2) IN ('12','22') AND
                 v_DEPOSIT_ID IS NOT NULL                               AND
                 p_tr_cd NOT IN ('9002','9003','9004')                  ) THEN

                RAISE NOTICE '======> 8888 예금계정으로 변경!!!';

                v_JNL.act12_repr_account_cd := '8888';
            END IF;

            RAISE NOTICE '======> 다시 대표계정코드 : %', v_JNL.act12_repr_account_cd;

            -----------------------------------------------------------------------------
            RAISE NOTICE '======> v_ORG_TR_CD 1 : %', v_ORG_TR_CD;

            v_errMsg := f_get_orgTrCode(v_PAY50.pay50_expense_id, v_ORG_TR_CD);
            IF LENGTH(v_errMsg) != 4 THEN
                RAISE USING ERRCODE = '90001';
            ELSE
                v_ORG_TR_CD := v_errMsg;
            END IF;

            RAISE NOTICE '======> v_ORG_TR_CD 2 : %', v_ORG_TR_CD;

            -----------------------------------------------------------------------------
            IF v_JNL.act12_repr_account_cd = '9999' THEN    -- 대표계정코드가 사용자지정코드이면 사용자지정 계정코드를 가져온다
                v_ACNT_CD := v_CUST_ACNT_CD;
            -----------------------------------------------------------------------------
            ELSIF v_JNL.act12_repr_account_cd = '8888' THEN -- 대표계정코드가 '8888:예금'인 경우
                -------------------------------------------------------------------------
                IF ( p_tr_cd = '9005' AND v_IN_DEPOSIT_MAP_ID IS NOT NULL AND v_JNL.act12_drcr_type = 'D' ) THEN -- 계좌이체(9005)인 경우 입금계좌의 MAP_ID로 실계정코드를 다시 가져와야한다.
                    RAISE NOTICE '차변 계정코드 가지러 가기!!!...%', v_IN_DEPOSIT_MAP_ID;
                    v_ACNT_CD := f_get_real_account_code(v_JNL.act12_company_id, v_JNL.act12_repr_account_cd, v_IN_DEPOSIT_MAP_ID);
                    v_ACT06.act06_account_map := v_IN_DEPOSIT_MAP_ID;
                    RAISE NOTICE '차변 계정코드 ==> %', v_ACNT_CD;
                -------------------------------------------------------------------------
                ELSIF ( p_tr_cd = '9005' AND v_OUT_DEPOSIT_MAP_ID IS NOT NULL AND v_JNL.act12_drcr_type = 'C' ) THEN -- 계좌이체(9005)인 경우 출금계좌의 MAP_ID로 실계정코드를 다시 가져와야한다.
                    v_ACNT_CD := f_get_real_account_code(v_JNL.act12_company_id, v_JNL.act12_repr_account_cd, v_OUT_DEPOSIT_MAP_ID);
                    v_ACT06.act06_account_map := v_OUT_DEPOSIT_MAP_ID;
                -------------------------------------------------------------------------
                ELSE
                    RAISE NOTICE '======> 예금 계정코드 가져오기!!! %, %', v_JNL.act12_repr_account_cd, v_DEPOSIT_MAP_ID;
                    --PERFORM log_message('INFO', '------------- 예금 계정코드 가져오기 : 대표계정['||v_JNL.act12_repr_account_cd||'], DEPOSIT_MAP_ID['||v_DEPOSIT_MAP_ID||']');

                    v_ACNT_CD := f_get_real_account_code(v_JNL.act12_company_id, v_JNL.act12_repr_account_cd, v_DEPOSIT_MAP_ID);
                    v_ACT06.act06_account_map := v_DEPOSIT_MAP_ID;

                    --PERFORM log_message('INFO', '------------- 예금 계정코드 가져오기 : v_ACNT_CD['||v_ACNT_CD||']');
                END IF;            
            -----------------------------------------------------------------------------
            ELSIF SUBSTR(v_JNL.act12_repr_account_cd,1,2) = '22' AND    -- 대표계정코드가 '2200:미지급금/2201:미지급비용'이면서
                  p_tr_cd = '9003'                               AND    -- 미지급결제거래이면서
                  v_ORG_TR_CD IS NOT NULL                        THEN   -- 본거래코드가 존재하는 경우 본거래의 발생계정을 가져온다
                -------------------------------------------------------------------------

                RAISE NOTICE '===============================================> 여기 안들어와?????????????????';

                SELECT act12_repr_account_cd
                     , f_get_real_account_code(act11_company_id, act12_repr_account_cd, v_MAP_ID)
                  INTO v_JNL.act12_repr_account_cd
                     , v_ACNT_CD
                  FROM act11_tr_map
                     , act12_journal_map
                 WHERE act11_company_id     = act12_company_id
                   AND act11_journal_group  = act12_journal_group
                   AND act11_company_id     = v_JNL.act12_company_id
                   AND act11_tr_cd          = v_ORG_TR_CD
                   AND act11_use_yn         = 'true'
                   AND substr(act12_repr_account_cd,1,2) = '22' ;

                RAISE NOTICE '======> 미지급금/비용 계정임. 본거래의 발생계정 GET : %, %', v_JNL.act12_repr_account_cd, v_ACNT_CD;
                --PERFORM log_message('INFO', '------------- 미지급금/비용 계정임. 본거래의 발생계정 GET : ['||v_JNL.act12_repr_account_cd||']['||v_ACNT_CD||']');

            -----------------------------------------------------------------------------
            ELSIF v_JNL.act12_repr_account_cd = '1300'  AND     -- 대표계정코드가 '1300:청약금계정'인 경우
                  v_IPO_DEPOSIT_ID IS NOT NULL          THEN
                -------------------------------------------------------------------------
                SELECT f_get_real_account_code ( v_JNL.act12_company_id
                                               , v_JNL.act12_repr_account_cd
                                               , COALESCE(ast01_item_s_class_cd,'000000')||
                                                 COALESCE(ast01_account_type   , '99')||
                                                 COALESCE(SUBSTR(ast01_item_d_class_cd,7,2), '00')
                                               )
                  INTO v_ACNT_CD
                  FROM ast01_class_tree
                 WHERE ast01_class_tree_id = v_IPO_DEPOSIT_ID;
            -----------------------------------------------------------------------------
            ELSE
                v_ACNT_CD := v_JNL.act13_real_account_cd;
            END IF;

            -----------------------------------------------------------------------------
            -- 금액 SET
            -----------------------------------------------------------------------------
            IF    UPPER(v_JNL.act12_formula) = 'AMT'            THEN v_JNL_AMT := v_AMT             ;
            ELSIF UPPER(v_JNL.act12_formula) = 'TAX'            THEN v_JNL_AMT := v_TAX             ;
            ELSIF UPPER(v_JNL.act12_formula) = 'SETTLE_AMT'     THEN v_JNL_AMT := v_SETTLE_AMT      ;
            ELSIF UPPER(v_JNL.act12_formula) = 'BOOK_AMT'       THEN v_JNL_AMT := v_BOOK_AMT        ;
            ELSIF UPPER(v_JNL.act12_formula) = 'DEPN_AMT'       THEN v_JNL_AMT := v_DEPN_AMT        ;
            ELSIF UPPER(v_JNL.act12_formula) = 'FEE'            THEN v_JNL_AMT := v_FEE             ;
            ELSIF UPPER(v_JNL.act12_formula) = 'CONT_AMT'       THEN v_JNL_AMT := v_CONT_AMT        ;
            ELSIF UPPER(v_JNL.act12_formula) = 'AMT-CONT_AMT'   THEN v_JNL_AMT := v_AMT - v_CONT_AMT;
            -----------------------------------------------------------------------------
            ELSE
                IF UPPER(SUBSTR(v_JNL.act12_formula,1,5)) = 'AST08' THEN
                    v_SQL := 'SELECT '||v_JNL.act12_formula
                           ||'  FROM ast08_tr_finance'
                           ||' WHERE ast08_tr_id = '||p_tr_id;
                -------------------------------------------------------------------------
                ELSIF UPPER(SUBSTR(v_JNL.act12_formula,1,5)) = 'AST20' THEN
                    v_SQL := 'SELECT '||v_JNL.act12_formula
                           ||'  FROM ast20_tr_tax'
                           ||' WHERE ast20_tr_id = '||p_tr_id;
                -------------------------------------------------------------------------
                ELSIF UPPER(SUBSTR(v_JNL.act12_formula,1,5)) = 'AST21' THEN
                    v_SQL := 'SELECT '||v_JNL.act12_formula
                           ||'  FROM ast21_tr_4insure'
                           ||' WHERE ast21_tr_id = '||p_tr_id;

                    -- 4대보험납부 기타금액 적요SET
                    IF v_JNL.act12_formula = 'ast21_np_etc' THEN
                        v_NOTE := TRIM(v_AST21.ast21_np_etc_note);
                    ELSIF v_JNL.act12_formula = 'ast21_hi_etc' THEN
                        v_NOTE := TRIM(v_AST21.ast21_hi_etc_note);
                    ELSIF v_JNL.act12_formula = 'ast21_ei_etc' THEN
                        v_NOTE := TRIM(v_AST21.ast21_ei_etc_note);
                    ELSIF v_JNL.act12_formula = 'ast21_oh_etc' THEN
                        v_NOTE := TRIM(v_AST21.ast21_oh_etc_note);
                    ELSE
                        v_NOTE := v_JNL.act12_note;
                    END IF;
                END IF;
                -------------------------------------------------------------------------
                RAISE NOTICE 'v_SQL : %', v_SQL;
                IF v_SQL IS NOT NULL THEN
                    EXECUTE v_SQL INTO v_JNL_AMT;
                ELSE
                    v_JNL_AMT := 0;
                END IF;
            END IF;
            -----------------------------------------------------------------------------
            IF v_JNL_AMT IS NULL THEN
                v_JNL_AMT     := 0;
                v_FOR_JNL_AMT := 0;
            ELSE
                v_FOR_JNL_AMT := v_JNL_AMT;
            END IF;
            -----------------------------------------------------------------------------
            IF    UPPER(v_JNL.act12_for_formula) = 'FOR_AMT'                THEN v_FOR_JNL_AMT := v_FOR_AMT                 ;
            ELSIF UPPER(v_JNL.act12_for_formula) = 'FOR_SETTLE_AMT'         THEN v_FOR_JNL_AMT := v_FOR_SETTLE_AMT          ;
            ELSIF UPPER(v_JNL.act12_for_formula) = 'FOR_CONT_AMT'           THEN v_FOR_JNL_AMT := v_FOR_CONT_AMT            ;
            ELSIF UPPER(v_JNL.act12_for_formula) = 'FOR_AMT-FOR_CONT_AMT'   THEN v_FOR_JNL_AMT := v_FOR_AMT - v_FOR_CONT_AMT;
            ELSIF UPPER(v_JNL.act12_for_formula) = '0'                      THEN v_FOR_JNL_AMT := 0                         ;
            ELSE
                IF UPPER(v_JNL.act12_formula) != UPPER(v_JNL.act12_for_formula) THEN
                    IF UPPER(SUBSTR(v_JNL.act12_for_formula,1,5)) = 'AST08' THEN
                        v_SQL := 'SELECT '||v_JNL.act12_for_formula
                               ||'  FROM ast08_tr_finance'
                               ||' WHERE ast08_tr_id = '||p_tr_id;
                    END IF;
                    -------------------------------------------------------------------------
                    RAISE NOTICE 'v_SQL : %', v_SQL;
                    IF v_SQL IS NOT NULL THEN
                        EXECUTE v_SQL INTO v_FOR_JNL_AMT;
                    END IF;
                END IF;
            END IF;

            RAISE NOTICE 'v_JNL.act12_formula     : % ', UPPER(v_JNL.act12_formula);
            RAISE NOTICE 'v_JNL.act12_for_formula : % ', UPPER(v_JNL.act12_for_formula);
            RAISE NOTICE 'v_JNL_AMT[%] = v_AMT[%], v_TAX[%] / v_FOR_JNL_AMT[%]', v_JNL_AMT, v_AMT, v_TAX, v_FOR_JNL_AMT;

            --PERFORM log_message('INFO', '------------- act12_formula     : ['||UPPER(v_JNL.act12_formula)||']');
            --PERFORM log_message('INFO', '------------- act12_for_formula : ['||UPPER(v_JNL.act12_for_formula)||']');
            --PERFORM log_message('INFO', '------------- v_JNL_AMT         : ['||v_JNL_AMT||']');
            --PERFORM log_message('INFO', '------------- v_FOR_JNL_AMT     : ['||v_FOR_JNL_AMT||']');

            -----------------------------------------------------------------------------
            IF p_except_yn AND v_JNL_AMT = 0 THEN
                RAISE NOTICE '금액이 0이므로 분개생성시 제외함!!';
            ELSE
                -------------------------------------------------------------------------
                v_ACT06.act06_journal_tmp_id    := f_create_seq()               ;
                v_ACT06.act06_journal_id        := v_ACT02.act02_journal_id     ;
                v_ACT06.act06_seq               := v_JNL.act12_seq              ;
                v_ACT06.act06_repr_account_cd   := v_JNL.act12_repr_account_cd  ;
                v_ACT06.act06_real_account_cd   := v_ACNT_CD                    ;
                v_ACT06.act06_drcr_type         := v_JNL.act12_drcr_type        ;
                v_ACT06.act06_amt               := v_JNL_AMT                    ;
                v_ACT06.act06_for_amt           := v_FOR_JNL_AMT                ;
                v_ACT06.act06_note              := v_NOTE                       ;
                -------------------------------------------------------------------------
                IF v_JNL.act12_repr_account_cd = '8888' THEN --(8888:예금계정)
                    ---------------------------------------------------------------------
                    IF ( v_OUT_DEPOSIT_ID IS NOT NULL  AND   -- 계좌이체(9005)인 경우 변수 'v_OUT_DEPOSIT_ID'을 사용하여 출금계좌 지정함.
                         v_ACT06.act06_drcr_type = 'C' ) THEN
                        -----------------------------------------------------------------
                        v_ACT06.act06_deposit_id := v_OUT_DEPOSIT_ID ;
                    ---------------------------------------------------------------------
                    ELSE
                        v_ACT06.act06_deposit_id := v_DEPOSIT_ID ;
                    END IF;
                -------------------------------------------------------------------------
                ELSIF v_JNL.act12_repr_account_cd = '1300' THEN --(1300:청약금계정)
                        -----------------------------------------------------------------
                        v_ACT06.act06_deposit_id := v_IPO_DEPOSIT_ID;
                -------------------------------------------------------------------------
                ELSE
                    v_ACT06.act06_deposit_id := NULL ;
                    IF v_JNL.act12_repr_account_cd = '1100' THEN    --(1100:자산계정)
                        -----------------------------------------------------------------
                        IF SUBSTR(v_MAP_ID,1,2) = '10' THEN --(10:현금 및 예치금)
                            v_ACT06.act06_deposit_id := v_DEPOSIT_ID ;
                        -----------------------------------------------------------------
                        ELSIF SUBSTR(v_MAP_ID,1,4) = '9030' AND     --(9030:선급금)
                              v_PRE_DEPOSIT_ID IS NOT NULL  THEN
                            v_ACT06.act06_deposit_id := v_PRE_DEPOSIT_ID ;
                        END IF;
                    END IF;
                END IF;
                -------------------------------------------------------------------------
                INSERT INTO act06_journal_tmp VALUES (v_ACT06.*);
            END IF;
        END LOOP;

        ---------------------------------------------------------------------------------
        -- 실분개장 생성(act03_journal_dtl)
        ---------------------------------------------------------------------------------
        v_errMsg := f_create_journal_r(v_ACT02.act02_journal_id);

        RAISE NOTICE '실분개장 생성(act03_journal_dtl) RETURN MSG : %', v_errMsg;

        IF v_errMsg != 'Y' THEN
            RAISE USING ERRCODE = '90001';
        END IF;
        v_errMsg := 'ING';

    -------------------------------------------------------------------------------------
    ELSE
        IF p_proc_type != 'C' THEN
            v_errMsg := '처리구분값 오류 ['||p_proc_type||']. 관리자에게 문의하여 주십시오.';
            RAISE USING ERRCODE = '90001';
        END IF;
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
