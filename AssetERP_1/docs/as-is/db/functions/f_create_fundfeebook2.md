# f_create_fundfeebook2

## FUNCTION public.f_create_fundfeebook2(p_company_id numeric, p_std_date date, p_corp_id numeric, p_fund_cd character varying)

- 반환: `character varying`
- 줄 수: 475

```sql
CREATE OR REPLACE FUNCTION public.f_create_fundfeebook2(p_company_id numeric, p_std_date date, p_corp_id numeric, p_fund_cd character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST30             ast30_book_fund_fee%ROWTYPE;
    v_ICAM10            icam10_fee%ROWTYPE;
    v_DATE              RECORD;
    v_TR                RECORD;
    v_RMK               RECORD;

    v_CORP_ID           NUMERIC;
    v_FUND_CD           VARCHAR(12);
    v_CLOSE_DATE        DATE;
    v_ACT_CLOSE_DATE    DATE;

    v_CNT               NUMERIC;

    v_KFS_CORP_CD       NUMERIC := 1 ;  --(1:한국펀드서비스)

    v_update_rows       NUMERIC;
    v_errMsg            VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN

    -------------------------------------------------------------------------------------
    v_KFS_CORP_CD := 28000; --개발계에서 처리를 위해 임시로 바꿈
    -------------------------------------------------------------------------------------

    v_errMsg := '펀드보수원장 생성실패 ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']['||p_fund_cd||']';
    -------------------------------------------------------------------------------------
    IF COALESCE(p_fund_cd,'x') = 'x' THEN
        v_FUND_CD := '%';
    ELSE
        v_FUND_CD = p_fund_cd;
    END IF;

    -------------------------------------------------------------------------------------
    -- 원장정리 종료일
    v_CLOSE_DATE :=  f_get_date(f_today(), -1);
    IF v_CLOSE_DATE < p_std_date THEN
        v_CLOSE_DATE := p_std_date;
    END IF;
    -------------------------------------------------------------------------------------
    -- 회기결산일
    v_ACT_CLOSE_DATE := f_get_account_close_date(p_company_id, p_std_date, 0);
    IF v_ACT_CLOSE_DATE < v_CLOSE_DATE THEN
        v_CLOSE_DATE := v_ACT_CLOSE_DATE;   -- 결산처리를 위해 정리종료일은 회기결산일까지만 가능.
    END IF;

    --RAISE NOTICE '회기결산일 : %', v_CLOSE_DATE;

    -------------------------------------------------------------------------------------
    -- 원장정리
    -------------------------------------------------------------------------------------
    -- 정리전 회계마감 체크
    SELECT COUNT(*)
      INTO v_CNT
      FROM act05_gen_ledger_close
     WHERE act05_company_id = p_company_id
       AND act05_std_date  >= p_std_date;
    IF v_CNT > 0 THEN
        v_errMsg := '회계마감 되었습니다.';
        RAISE USING ERRCODE = '90001';
    END IF;

    --RAISE NOTICE '정리전 회계마감 체크 완료';

    -- 기준일이후 결산처리여부 체크
    SELECT COUNT(*)
      INTO v_CNT
      FROM ast31_book_fund_fee_close
     WHERE ast31_company_id = p_company_id
       AND ast31_hold_date >= p_std_date
       AND ast31_corp_id    = p_corp_id
       AND ast31_fund_cd    LIKE v_FUND_CD;
    IF v_CNT > 0 THEN
        v_errMsg := '기준일이후 펀드보수 결산자료가 존재합니다. ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-mm-dd')||']['||p_corp_id||']['||v_FUND_CD||']';
        RAISE USING ERRCODE = '90001';
    END IF;

    --RAISE NOTICE '기준일이후 결산처리여부 체크 완료';

    -- 기준일이후 원장 삭제
    v_errMsg := '원장정리 실패 ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']['||v_FUND_CD||']';
    DELETE
      FROM ast30_book_fund_fee
     WHERE ast30_company_id  = p_company_id
       AND ast30_hold_date  >= p_std_date
       AND ast30_corp_id     = p_corp_id
       AND ast30_fund_cd    LIKE v_FUND_CD;

    --RAISE NOTICE '기준일이후 원장 삭제 : %', p_std_date;

    -------------------------------------------------------------------------------------
    -- 원장생성
    -------------------------------------------------------------------------------------
    v_errMsg := '원장생성 실패 1 ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']['||TO_CHAR(v_CLOSE_DATE,'yyyy-MM-dd')||']['||v_FUND_CD||']';
    FOR v_DATE IN ( SELECT sys12_day::DATE AS sys12_day
                      FROM sys12_calendar
                     WHERE sys12_company_id = p_company_id
                       AND sys12_day BETWEEN p_std_date AND v_CLOSE_DATE
                     ORDER BY sys12_day
    ) LOOP
        --RAISE NOTICE '-----------------------------------------------------------------';
        --RAISE NOTICE '[%]일 원장 생성합시다 !!', v_DATE.sys12_day;
        ---------------------------------------------------------------------------------
        -- 원장이월
        v_errMsg := '원장이월 실패 1 ['||p_company_id||']['||TO_CHAR(F_GET_DATE(v_DATE.sys12_day, -1),'yyyy-MM-dd')||']['||v_FUND_CD||']';
        INSERT
          INTO ast30_book_fund_fee
        SELECT f_create_seq()
             , v_DATE.sys12_day
             , ast30_company_id
             , ast30_ast_class_tree_id
             , ast30_corp_id
             , ast30_fund_cd
             , ast30_fund_nm
             , ast30_cur_cd
             , 0                        -- 외화 당일보수
             , 0                        -- 당일보수
             , ast30_for_fee
             , ast30_fee
             , ast30_fx_rate            -- 적용환율
             , ast30_note
             , ast30_consignment_cd
             , ast30_consignment_nm
             , ast30_calc_start_date
             , ast30_calc_close_date
             , ast30_for_un_rcv_fee     -- 외화 유보보수
             , ast30_un_rcv_fee         -- 유보보수
             , ast30_for_fix_fee        -- 외화 확정 미수보수(연결산시SET)
             , ast30_fix_fee            -- 확정 미수보수(연결산시SET)
          FROM ( ------------------------------------------------------------------------
                 -- 사무관리사
                 SELECT ast30_book_fund_fee.*
                   FROM ast30_book_fund_fee
                        INNER JOIN biz13_with_corp ON ( biz13_corp_id    = ast30_corp_id     AND
                                                        biz13_company_id = ast30_company_id  )
                  WHERE ast30_company_id = p_company_id
                    AND ast30_hold_date  = F_GET_DATE(v_DATE.sys12_day, -1)
                    AND v_DATE.sys12_day BETWEEN biz13_first_start_date AND COALESCE(biz13_last_close_date,'9999-12-31')
                    AND ast30_corp_id    = p_corp_id
                    AND ast30_fund_cd    LIKE v_FUND_CD
                    AND p_company_id     = v_KFS_CORP_CD     /* '1:한국펀드서비스'인 경우 */
                  UNION
                 ------------------------------------------------------------------------
                 -- 운용사
                 SELECT ast30_book_fund_fee.*
                   FROM ast30_book_fund_fee
                  WHERE ast30_company_id = p_company_id
                    AND ast30_hold_date  = F_GET_DATE(v_DATE.sys12_day, -1)
                    AND ast30_corp_id    = p_corp_id
                    AND ast30_fund_cd    LIKE v_FUND_CD
                    AND p_company_id     != v_KFS_CORP_CD    /* '1:한국펀드서비스'가 아닌경우 */
               ) t
         WHERE NOT EXISTS ( SELECT 1
                               FROM ast33_fund_trans
                              WHERE ast33_company_id = ast30_company_id
                                AND ast33_corp_id    = ast30_corp_id
                                AND ast33_fund_cd    = ast30_fund_cd
                                AND ( ( ast33_fund_trans_cd = '1'               AND --(1:이관(출))
                                        ast33_date          < v_DATE.sys12_day  ) OR
                                      ( ast33_fund_trans_cd = '2'               AND --(2:이관(입))
                                        ast33_date         >= v_DATE.sys12_day  ) ) )
           AND NOT( ast30_for_fee_today   = 0 AND
                    ast30_fee_today       = 0 AND
                    ast30_for_fee         = 0 AND
                    ast30_fee             = 0 AND
                    ast30_for_un_rcv_fee  = 0 AND
                    ast30_un_rcv_fee      = 0 );

        IF NOT FOUND THEN
            --RAISE NOTICE '보수원장 이월 없음!! - [%][%]', TO_CHAR(F_GET_DATE(v_DATE.sys12_day, -1),'yyyy-MM-dd'), v_FUND_CD;
        ELSIF FOUND THEN
            GET DIAGNOSTICS v_update_rows := ROW_COUNT;
              -- the above line used to get row_count
            --RAISE NOTICE '보수원장 이월 있음!! - [%][%] - %건', TO_CHAR(F_GET_DATE(v_DATE.sys12_day, -1),'yyyy-MM-dd'), v_FUND_CD, v_update_rows;
        END IF;

        ---------------------------------------------------------------------------------
        -- 당일 보수변동분 반영
        v_errMsg := '당일 보수변동분 반영 실패 ['||p_company_id||']['||TO_CHAR(p_std_date,'yyyy-MM-dd')||']['||p_corp_id||']['||v_FUND_CD||']['||v_DATE.sys12_day||']';
        FOR v_TR IN ( SELECT t.*
                           , ( SELECT ast01_class_tree_id
                                 FROM ast01_class_tree
                                WHERE ast01_company_id      = icam10_company_id
                                  AND ast01_item_s_class_cd = CASE WHEN icam10_fee_type IN ('20407','24926') THEN '902013'   -- (20407:사무관리보수) => (902013:펀드사무관리보수)
                                                                   WHEN icam10_fee_type IN ('20402','24923') THEN '902001'   -- (20402:운용보수)     => (902001:투자신탁운용보수)
                                                                                   ELSE '' END ) AS icam10_ast_class_tree_id
                        FROM ( ----------------------------------------------------------
                               -- ICAM 발생거래
                               SELECT icam10_company_id
                                    , icam10_icam_company_cd
                                    , icam10_fund_cd
                                    --, icam10_fund_nm
                                    --, icam10_bf_pay_date
                                    --, icam10_af_pay_date
                                    --, icam10_consignment_cd
                                    --, icam10_consignment_nm
                                    , icam10_cur_cd
                                    , icam10_fee_type
                                    , sys15_corp_id
                                 FROM icam10_fee
                                      INNER JOIN ( --------------------------------------------------------
                                                   -- 운용사
                                                   SELECT sys01_company_id      sys15_corp_id
                                                        , sys01_company_id      sys15_company_id
                                                        , sys01_icam_company_cd sys15_corp_cd
                                                     FROM sys01_company
                                                    WHERE sys01_company_id  = p_company_id
                                                      AND sys01_company_id != v_KFS_CORP_CD
                                                    UNION
                                                   --------------------------------------------------------
                                                   -- 사무관리사
                                                   SELECT sys15_corp_id
                                                        , sys15_company_id
                                                        , REPLACE(sys15_corp_cd,'*','') sys15_corp_cd
                                                     FROM sys15_corp
                                                    WHERE sys15_company_id = p_company_id
                                                      AND p_company_id     = v_KFS_CORP_CD ) sys15 ON ( sys15_company_id = icam10_company_id      AND
                                                                                                        sys15_corp_cd    = icam10_icam_company_cd )
                                WHERE icam10_std_date   = v_DATE.sys12_day
                                  AND sys15_corp_id     = p_corp_id
                                  AND icam10_fund_cd    LIKE v_FUND_CD
                                  --AND icam10_fee_type   NOT IN ('24923','24926')    -- (24923:현금미지급운용보수 / 24926:현금미지급사무보수) 제외
                                UNION ALL
                               ----------------------------------------------------------
                               -- 이관(출)거래 추가
                               SELECT ast33_company_id                                              AS icam10_company_id
                                    , CASE WHEN ast33_company_id = v_KFS_CORP_CD THEN sys15_corp_cd
                                           ELSE ( SELECT sys01_icam_company_cd
                                                    FROM sys01_company
                                                   WHERE sys01_company_id = ast33_company_id ) END  AS icam10_icam_company_cd
                                    , ast33_fund_cd                                                 AS icam10_fund_cd
                                    --, ast30_fund_nm                                                 AS icam10_fund_nm
                                    --, ast30_calc_start_date                                         AS icam10_bf_pay_date
                                    --, F_GET_DATE(ast30_calc_close_date, 1)                          AS icam10_af_pay_date
                                    --, ast30_consignment_cd                                          AS icam10_consignment_cd
                                    --, ast30_consignment_nm                                          AS icam10_consignment_nm
                                    , ast33_cur_cd                                                  AS icam10_cur_cd
                                    , CASE WHEN ast33_company_id = v_KFS_CORP_CD
                                           THEN '20407'
                                           ELSE '20402' END                                         AS icam10_fee_type
                                    , ast33_corp_id                                                 AS sys15_corp_id
                                 FROM ast33_fund_trans
                                      INNER JOIN ast30_book_fund_fee ON ( ast30_company_id  = ast33_company_id  AND
                                                                          ast30_hold_date   = ast33_date        AND
                                                                          ast30_corp_id     = ast33_corp_id     AND
                                                                          ast30_fund_cd     = ast33_fund_cd     )
                                      LEFT OUTER JOIN sys15_corp ON sys15_corp_id = ast33_corp_id
                                WHERE ast33_company_id      = p_company_id
                                  AND ast33_fund_trans_cd   = '1'   --(1:이관(출))
                                  AND ast33_date            = v_DATE.sys12_day
                                  AND ast33_corp_id         = p_corp_id
                                  AND ast33_fund_cd         LIKE v_FUND_CD
                             ) t
                        GROUP BY icam10_company_id, icam10_icam_company_cd, icam10_fund_cd--, icam10_fund_nm
                               --, icam10_bf_pay_date, icam10_af_pay_date
                               --, icam10_consignment_cd, icam10_consignment_nm
                               , icam10_cur_cd, icam10_fee_type, sys15_corp_id
        ) LOOP
            -----------------------------------------------------------------------------
            IF v_TR.icam10_ast_class_tree_id IS NULL THEN
                v_errMsg := '자산ID를 가져올 수 없습니다. 보수구분을 확인해주세요 ['||v_TR.icam10_fee_type||']';
                RAISE USING ERRCODE = '90001';
            END IF;
            -----------------------------------------------------------------------------
            IF v_TR.icam10_fee_type IN ('20407','24926') AND v_TR.sys15_corp_id IS NULL THEN
                v_errMsg := '운용사ID를 가져올 수 없습니다. 거래처등록 화면에서 거래처코드를 확인해주세요 ['||v_TR.icam10_icam_company_cd||']';
                RAISE USING ERRCODE = '90001';
            END IF;
            -----------------------------------------------------------------------------
            IF p_company_id = v_KFS_CORP_CD THEN
                v_CORP_ID := v_TR.sys15_corp_id ;
            ELSE
                v_CORP_ID := p_company_id ;
            END IF;
            -----------------------------------------------------------------------------
            -- 펀드이관 체크
            SELECT COUNT(*)
              INTO v_CNT
              FROM ast33_fund_trans
             WHERE ast33_company_id = p_company_id
               AND ast33_corp_id    = v_CORP_ID
               AND ast33_fund_cd    = v_TR.icam10_fund_cd
               AND ( ( ast33_fund_trans_cd = '1'               AND --(1:이관(출))
                       ast33_date          < v_DATE.sys12_day  ) OR
                     ( ast33_fund_trans_cd = '2'               AND --(2:이관(입))
                       ast33_date          > v_DATE.sys12_day  ) );

            --RAISE NOTICE '    펀드이관 체크 : %', v_CNT;

            CONTINUE WHEN v_CNT > 0;    -- 이관체크 대상건이면 SKIP!!

            -----------------------------------------------------------------------------
            -- 원장 가져오기
            -----------------------------------------------------------------------------
            SELECT *
              INTO v_AST30
              FROM ast30_book_fund_fee
             WHERE ast30_company_id         = p_company_id
               AND ast30_hold_date          = v_DATE.sys12_day
               AND ast30_ast_class_tree_id  = v_TR.icam10_ast_class_tree_id
               AND ast30_corp_id            = v_CORP_ID
               AND ast30_fund_cd            = v_TR.icam10_fund_cd ;

            -----------------------------------------------------------------------------
            -- 당일원장 SET
            -----------------------------------------------------------------------------
            -- 신규원장 초기셋팅
            IF v_AST30.ast30_book_fund_fee_id IS NULL THEN
                v_errMsg := '신규원장 초기셋팅 실패';
                v_AST30.ast30_book_fund_fee_id  := f_create_seq()                               ;
                v_AST30.ast30_hold_date         := v_DATE.sys12_day                             ;
                v_AST30.ast30_company_id        := p_company_id                                 ;
                v_AST30.ast30_ast_class_tree_id := v_TR.icam10_ast_class_tree_id                ;
                v_AST30.ast30_corp_id           := v_CORP_ID                                    ;
                v_AST30.ast30_fund_cd           := v_TR.icam10_fund_cd                          ;
                v_AST30.ast30_cur_cd            := v_TR.icam10_cur_cd                           ;
                v_AST30.ast30_for_fee_today     := 0                                            ; -- 외화 당일보수
                v_AST30.ast30_fee_today         := 0                                            ; -- 당일보수
                v_AST30.ast30_for_fee           := 0                                            ; -- 외화 보수(누적)
                v_AST30.ast30_fee               := 0                                            ; -- 보수(누적)
                v_AST30.ast30_fx_rate           := 1                                            ; -- 적용환율
                v_AST30.ast30_for_un_rcv_fee    := 0                                            ; -- 외화 유보보수
                v_AST30.ast30_un_rcv_fee        := 0                                            ; -- 유보보수
                v_AST30.ast30_for_fix_fee       := 0                                            ; -- 외화 확정 미수보수(연결산시SET)
                v_AST30.ast30_fix_fee           := 0                                            ; -- 확정 미수보수(연결산시SET)
            END IF;

            -----------------------------------------------------------------------------
            -- 변경데이터 반영
            SELECT *
              INTO v_ICAM10
              FROM icam10_fee
             WHERE icam10_company_id        = v_TR.icam10_company_id
               AND icam10_std_date          = v_DATE.sys12_day
               AND icam10_icam_company_cd   = v_TR.icam10_icam_company_cd
               AND icam10_fee_type          = v_TR.icam10_fee_type
               AND icam10_fund_cd           = v_TR.icam10_fund_cd
             LIMIT 1;
            -----------------------------------------------------------------------------
            v_AST30.ast30_fund_nm           := v_ICAM10.icam10_fund_nm                    ;
            v_AST30.ast30_consignment_cd    := v_ICAM10.icam10_consignment_cd             ;
            v_AST30.ast30_consignment_nm    := v_ICAM10.icam10_consignment_nm             ;
            v_AST30.ast30_calc_start_date   := v_ICAM10.icam10_bf_pay_date                ;
            v_AST30.ast30_calc_close_date   := F_GET_DATE(v_ICAM10.icam10_af_pay_date, -1);

            -----------------------------------------------------------------------------
            -- 적요별 분리 : B55 보수보정
            --               D20 보수인출
            --               D30 해지금/보수인출
            --               D31 보수유보
            --               D32 보수유보분인출
            --               P00 보수 및 수수료(비용)발생
            --               Z90 멀티클레스전환분개
            --               Z98 계정및거래변경
            --               FUND_OUT 이관(출)
            -----------------------------------------------------------------------------
            v_errMsg := '원장정리(적요별 분리) 실패';
            FOR v_RMK IN ( SELECT icam10_rmk_cd
                                , icam10_fx_rate
                                , icam10_calc_fee * CASE WHEN icam10_drcr_type = 'C' THEN 1 ELSE -1 END                         AS icam10_for_fee
                                , TRUNC(icam10_calc_fee * CASE WHEN icam10_drcr_type = 'C' THEN 1 ELSE -1 END * icam10_fx_rate) AS icam10_fee
                             FROM ( SELECT icam10_fee.*
                                         , f_calc_dual_fund_fee(icam10_company_id, icam10_icam_company_cd, icam10_fund_cd, icam10_std_date, icam10_fee) icam10_calc_fee
                                      FROM icam10_fee
                                     WHERE icam10_company_id      = p_company_id
                                       AND icam10_std_date        = v_DATE.sys12_day
                                       AND icam10_icam_company_cd = v_TR.icam10_icam_company_cd
                                       AND icam10_fund_cd         = v_TR.icam10_fund_cd
                                       AND icam10_fee_type        = v_TR.icam10_fee_type
                                  ) t
                            UNION ALL
                           SELECT 'FUND_OUT'            AS icam10_rmk_cd
                                , 1                     AS icam10_fx_rate
                                , ast33_for_fee * -1    AS icam10_for_fee
                                , ast33_fee     * -1    AS icam10_fee
                             FROM ast33_fund_trans
                            WHERE ast33_company_id      = p_company_id
                              AND ast33_fund_trans_cd   = '1'   --(1:이관(출))
                              AND ast33_date            = v_DATE.sys12_day
                              AND ast33_corp_id         = v_CORP_ID
                              AND ast33_fund_cd         = v_TR.icam10_fund_cd
            ) LOOP

                --RAISE NOTICE '    ------------------------------------------------------------------------';
                --RAISE NOTICE '    적요별 원장반영 : 적요[%] 반영금액[% / %]', v_RMK.icam10_rmk_cd, v_RMK.icam10_for_fee, v_RMK.icam10_fee;

                -------------------------------------------------------------------------
                -- 당일 발생보수 SET
                IF v_RMK.icam10_rmk_cd = 'P00' THEN
                    v_AST30.ast30_for_fee_today := v_RMK.icam10_for_fee ; -- 외화 당일보수
                    v_AST30.ast30_fee_today     := v_RMK.icam10_fee     ; -- 원화 당일보수
                ELSE
                    v_AST30.ast30_for_fee_today := 0                    ; -- 외화 당일보수
                    v_AST30.ast30_fee_today     := 0                    ; -- 원화 당일보수
                END IF;
                -------------------------------------------------------------------------
                -- 유보 보수 SET
                IF v_RMK.icam10_rmk_cd IN ('D31','D32') THEN
                    v_AST30.ast30_for_un_rcv_fee := v_AST30.ast30_for_un_rcv_fee + v_RMK.icam10_for_fee ;
                    v_AST30.ast30_un_rcv_fee     := v_AST30.ast30_un_rcv_fee     + v_RMK.icam10_fee     ;
                -------------------------------------------------------------------------
                -- 누적 보수 SET
                ELSE

                    --RAISE NOTICE '    적요별 원장반영 : 반영전 누적보수 [%] + 반영보수 [%]', v_AST30.ast30_for_fee, v_RMK.icam10_for_fee;

                    v_AST30.ast30_for_fee   := v_AST30.ast30_for_fee + v_RMK.icam10_for_fee  ;
                    v_AST30.ast30_fee       := v_AST30.ast30_fee     + v_RMK.icam10_fee      ;

                    --RAISE NOTICE '    적요별 원장반영 : 반영후 누적보수 [%]', v_AST30.ast30_for_fee;
                
                END IF;

                -------------------------------------------------------------------------
                -- 확정 미수보수 Clear
                IF COALESCE(v_AST30.ast30_for_fix_fee,0) != 0   AND
                   v_RMK.icam10_rmk_cd IN ('D20','D30')         THEN
                    ---------------------------------------------------------------------
                    IF v_AST30.ast30_for_fix_fee <= ABS(v_RMK.icam10_for_fee) THEN
                        v_AST30.ast30_for_fix_fee := 0;
                        v_AST30.ast30_fix_fee     := 0;
                    ELSE
                        v_AST30.ast30_for_fix_fee := v_AST30.ast30_for_fix_fee + v_RMK.icam10_for_fee ;
                        v_AST30.ast30_fix_fee     := v_AST30.ast30_fix_fee     + v_RMK.icam10_fee     ;
                    END IF;
                END IF;
                -------------------------------------------------------------------------
                -- 적용환율
                v_AST30.ast30_fx_rate   := v_RMK.icam10_fx_rate;

                -------------------------------------------------------------------------
                -- 미수 보수 SET
                /*IF v_RMK.icam10_rmk_cd IN ('D20','D30') AND v_AST14.ast14_for_unrcv_fee > 0 THEN
                    ---------------------------------------------------------------------
                    -- 당일 미수보수 수령액
                    IF v_AST14.ast14_for_unrcv_fee < v_RMK.icam10_for_fee THEN
                        v_AST14.ast14_for_rcv_fee   := v_AST14.ast14_for_unrcv_fee                                                          ; -- 외화 미수보수 수령금액(당일분)
                        v_AST14.ast14_rcv_fee       := v_AST14.ast14_unrcv_fee                                                              ; -- 원화 미수보수 수령금액(당일분)
                    ELSE
                        v_AST14.ast14_for_rcv_fee   := v_RMK.icam10_for_fee                                                                 ; -- 외화 미수보수 수령금액(당일분)
                        v_AST14.ast14_rcv_fee       := TRUNC(v_AST14.ast14_unrcv_fee / v_AST14.ast14_for_unrcv_fee * v_RMK.icam10_for_fee)  ; -- 원화 미수보수 수령금액(당일분)
                    END IF;
                    ---------------------------------------------------------------------
                    -- 잔여 미수보수
                    v_AST14.ast14_for_unrcv_fee := v_AST14.ast14_for_unrcv_fee - v_AST14.ast14_for_rcv_fee  ; -- 외화 미수보수
                    v_AST14.ast14_unrcv_fee     := v_AST14.ast14_unrcv_fee     - v_AST14.ast14_rcv_fee      ; -- 미수보수
                END IF;*/
                -------------------------------------------------------------------------
            END LOOP ; -- (적요별 금액정리 END)
            ------------------------------------------------------------------------------
            DELETE FROM ast30_book_fund_fee WHERE ast30_book_fund_fee_id = v_AST30.ast30_book_fund_fee_id;
            INSERT INTO ast30_book_fund_fee VALUES (v_AST30.*);
            ------------------------------------------------------------------------------
        END LOOP; -- (당일 보수변동분 반영 END)
        ---------------------------------------------------------------------------------
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
