# f_create_journal_r

## FUNCTION public.f_create_journal_r(p_journal_id numeric)

- 반환: `character varying`
- 줄 수: 306

```sql
CREATE OR REPLACE FUNCTION public.f_create_journal_r(p_journal_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_ACT06                 act06_journal_tmp%ROWTYPE;
    v_DRCR                  VARCHAR(1);

    v_TR                    RECORD;
    v_JNL                   RECORD;
    v_DIFF_AMT              NUMERIC;
    v_FOR_DIFF_AMT          NUMERIC;
    v_SEQ                   NUMERIC;

    v_errMsg                VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN

    RAISE NOTICE '------------------- 매매손익계산 -----------------------------';
    --PERFORM log_message('INFO', '------------------- 매매손익계산 -----------------------------');
     
    -------------------------------------------------------------------------------------
    -- 1. 매매손익계산
    -------------------------------------------------------------------------------------
    v_errMsg := '손익계산 실패 ['||p_journal_id||']';
    SELECT CASE WHEN ast07_settle_id IS NOT NULL
                THEN ast07_company_id
                ELSE ast06_company_id END                       AS ast06_company_id
         , CASE WHEN ast07_settle_id IS NOT NULL
                THEN ast07_fx_rate
                ELSE ast06_fx_rate END                          AS ast06_fx_rate
         , ( SELECT act11_pl_repr_account_cd
               FROM act11_tr_map
              WHERE act11_company_id = COALESCE(ast06_company_id, ast07_company_id)
                AND act11_tr_cd      = COALESCE(ast06_tr_cd, ast07_tr_cd)
                AND COALESCE(act11_use_yn,'false') = 'true'
              LIMIT 1 )                                         AS act11_pl_repr_account_cd
         , act02_cur_cd                                         AS act02_cur_cd
         , ast01_class_tree.*
      INTO v_TR
      FROM (
             SELECT *
               FROM act02_journal
                    LEFT OUTER JOIN ast06_tr ON ast06_tr_id = act02_tr_id
                    LEFT OUTER JOIN ( SELECT ast07_settle.*
                                           , COALESCE(ast06_company_id, pay50_company_id)   AS ast07_company_id
                                           , ast06_ast_class_tree_id                        AS ast07_ast_class_tree_id
                                           , COALESCE(ast06_cur_cd, 'KRW')                  AS ast07_cur_cd
                                        FROM ast07_settle
                                             LEFT OUTER JOIN ast06_tr       ON ast06_tr_id      = ast07_tr_id
                                             LEFT OUTER JOIN pay50_expense  ON pay50_expense_id = ast07_expense_id
                                    ) ast07 ON ast07_settle_id = act02_tr_id
              WHERE act02_journal_id = p_journal_id
           ) tr
           LEFT OUTER JOIN ast01_class_tree ON ast01_class_tree_id = COALESCE(ast07_ast_class_tree_id, ast06_ast_class_tree_id);

    RAISE NOTICE 'v_TR.ast06_company_id         : %', v_TR.ast06_company_id;
    RAISE NOTICE 'v_TR.ast06_fx_rate            : %', v_TR.ast06_fx_rate;
    RAISE NOTICE 'v_TR.act11_pl_repr_account_cd : %', v_TR.act11_pl_repr_account_cd;

    --PERFORM log_message('INFO', '------------- fx_rate            : '||v_TR.ast06_fx_rate);
    --PERFORM log_message('INFO', '------------- pl_repr_account_cd : '||v_TR.act11_pl_repr_account_cd);


    -------------------------------------------------------------------------------------
    IF v_TR.act11_pl_repr_account_cd IS NOT NULL THEN -- 거래맵핑에 손익대표계정이 있는 경우만 생성함.

        -- 차이금액 GET
        SELECT SUM(CASE WHEN act06_drcr_type = 'D' THEN act06_amt     ELSE 0 END)
             - SUM(CASE WHEN act06_drcr_type = 'C' THEN act06_amt     ELSE 0 END)
             , SUM(CASE WHEN act06_drcr_type = 'D' THEN act06_for_amt ELSE 0 END)
             - SUM(CASE WHEN act06_drcr_type = 'C' THEN act06_for_amt ELSE 0 END)
             , MAX(act06_seq) + 1
          INTO v_DIFF_AMT
             , v_FOR_DIFF_AMT
             , v_SEQ
          FROM act06_journal_tmp
         WHERE act06_journal_id = p_journal_id;
        ---------------------------------------------------------------------------------
        RAISE NOTICE '통화 : % / 외화차이금액 : % / 원화차이금액 : %', v_TR.act02_cur_cd, v_FOR_DIFF_AMT, v_DIFF_AMT;

        -- 손익발생!!
        IF ( COALESCE(v_TR.act02_cur_cd,'KRW')  = 'KRW' AND COALESCE(v_DIFF_AMT    ,0) != 0 ) OR
           ( COALESCE(v_TR.act02_cur_cd,'KRW') != 'KRW' AND COALESCE(v_FOR_DIFF_AMT,0) != 0 ) THEN
            -----------------------------------------------------------------------------
            -- 손익대표계정의 차대구분 가져오기
            SELECT CASE WHEN act10_attribute_cd IN ('1','5') THEN 'D' ELSE 'C' END
              INTO v_DRCR
              FROM act10_repr_account
             WHERE act10_company_id      = v_TR.ast06_company_id
               AND act10_repr_account_cd = v_TR.act11_pl_repr_account_cd;

            IF v_DRCR IS NULL THEN
                v_errMsg := '대표손익계정의 계정속성구분값이 없습니다. 관리자에게 문의하세요.['||COALESCE(v_TR.act11_pl_repr_account_cd,'null')||']';
                RAISE USING ERRCODE = '90001';
            END IF;
            -----------------------------------------------------------------------------
            v_ACT06.act06_journal_tmp_id    := f_create_seq()                       ;
            v_ACT06.act06_journal_id        := p_journal_id                         ;
            v_ACT06.act06_seq               := v_SEQ                                ;
            v_ACT06.act06_repr_account_cd   := v_TR.act11_pl_repr_account_cd        ;
            v_ACT06.act06_drcr_type         := v_DRCR                               ;
            -----------------------------------------------------------------------------
            IF v_ACT06.act06_drcr_type = 'D' THEN
                v_FOR_DIFF_AMT := v_FOR_DIFF_AMT * -1;
                v_DIFF_AMT     := v_DIFF_AMT     * -1;
            END IF;
            -----------------------------------------------------------------------------
            v_ACT06.act06_for_amt           := v_FOR_DIFF_AMT                       ;
            -----------------------------------------------------------------------------
            IF COALESCE(v_TR.act02_cur_cd,'KRW') = 'KRW' THEN
                v_ACT06.act06_amt           := v_DIFF_AMT                           ;
            ELSE
                v_ACT06.act06_amt           := TRUNC(v_FOR_DIFF_AMT * COALESCE(v_TR.ast06_fx_rate,1));
            END IF;
            RAISE NOTICE 'v_TR.act02_cur_cd : % / v_ACT06.act06_amt : %', v_TR.act02_cur_cd, v_ACT06.act06_amt;
            -----------------------------------------------------------------------------
            v_ACT06.act06_deposit_id        := NULL                                 ;
            v_ACT06.act06_note              := NULL                                 ;
            -----------------------------------------------------------------------------
            RAISE NOTICE '대표손익계정 : %', v_ACT06.act06_repr_account_cd;
            RAISE NOTICE 'ast01_item_s_class_cd(%), ast01_account_type(%)', v_TR.ast01_item_s_class_cd, v_TR.ast01_account_type;

            -- 실계정코드 가져오기
            v_errMsg := '실계정코드 가져오기 실패 ['||v_TR.ast01_item_s_class_cd||']['||v_TR.ast01_account_type||']';
            SELECT act13_real_account_cd
                 , act13_account_map
              INTO v_ACT06.act06_real_account_cd
                 , v_ACT06.act06_account_map
              FROM ( SELECT 1 seq
                          , act13_real_account_cd
                          , act13_account_map
                       FROM act13_real_account_map
                      WHERE act13_company_id        = v_TR.ast06_company_id
                        AND act13_repr_account_cd   = v_ACT06.act06_repr_account_cd
                        AND act13_account_map       = COALESCE(v_TR.ast01_item_s_class_cd,'000000')||COALESCE(v_TR.ast01_account_type,'99')||COALESCE(SUBSTR(v_TR.ast01_item_d_class_cd,7,2),'00')
                      UNION
                     SELECT 2 seq
                          , act13_real_account_cd
                          , act13_account_map
                       FROM act13_real_account_map
                      WHERE act13_company_id        = v_TR.ast06_company_id
                        AND act13_repr_account_cd   = v_ACT06.act06_repr_account_cd
                        AND act13_account_map       = COALESCE(v_TR.ast01_item_s_class_cd,'000000')||COALESCE(v_TR.ast01_account_type,'99')||'00'
                      UNION
                     SELECT 3 seq
                          , act13_real_account_cd
                          , act13_account_map
                       FROM act13_real_account_map
                      WHERE act13_company_id        = v_TR.ast06_company_id
                        AND act13_repr_account_cd   = v_ACT06.act06_repr_account_cd
                        AND act13_account_map       = COALESCE(v_TR.ast01_item_m_class_cd,'0000')||'00'||COALESCE(v_TR.ast01_account_type,'99')||'00'
                      UNION
                     SELECT 4 seq
                          , act13_real_account_cd
                          , act13_account_map
                       FROM act13_real_account_map
                      WHERE act13_company_id        = v_TR.ast06_company_id
                        AND act13_repr_account_cd   = v_ACT06.act06_repr_account_cd
                        AND act13_account_map       = COALESCE(v_TR.ast01_item_l_class_cd,'00')||'0000'||COALESCE(v_TR.ast01_account_type,'99')||'00'
                      UNION
                     SELECT 5 seq
                          , act13_real_account_cd
                          , act13_account_map
                       FROM act13_real_account_map
                      WHERE act13_company_id        = v_TR.ast06_company_id
                        AND act13_repr_account_cd   = v_ACT06.act06_repr_account_cd
                        AND act13_account_map       = '0000000000'
                   ) t
             ORDER BY seq
             LIMIT 1;
            -----------------------------------------------------------------------------
            IF v_ACT06.act06_real_account_cd IS NULL THEN
                v_errMsg := '손익에 대한 실계정코드가 없습니다.';
                RAISE USING ERRCODE = '90001';
            END IF;
            -----------------------------------------------------------------------------
            INSERT INTO act06_journal_tmp VALUES (v_ACT06.*);

        END IF;
    END IF;

    RAISE NOTICE '------------------- 환차손익계산 -----------------------------';
     
    -------------------------------------------------------------------------------------
    -- 2. 환차손익계산
    -------------------------------------------------------------------------------------
    SELECT SUM(CASE WHEN act06_drcr_type = 'D' THEN act06_amt ELSE 0 END)
         - SUM(CASE WHEN act06_drcr_type = 'C' THEN act06_amt ELSE 0 END)
         , MAX(act06_seq) + 1
      INTO v_DIFF_AMT
      FROM act06_journal_tmp
     WHERE act06_journal_id = p_journal_id;
    -------------------------------------------------------------------------------------
    -- 환차손익발생!!
    RAISE NOTICE '환차손익발생 ===> %', COALESCE(v_DIFF_AMT,0);
    
    IF COALESCE(v_DIFF_AMT,0) != 0 THEN
        ---------------------------------------------------------------------------------
        v_ACT06.act06_journal_tmp_id    := f_create_seq()                       ;
        v_ACT06.act06_journal_id        := p_journal_id                         ;
        v_ACT06.act06_seq               := v_SEQ                                ;
        v_ACT06.act06_repr_account_cd   := '4401'                               ; --(4401:환차이익계정)
        v_ACT06.act06_drcr_type         := 'C'                                  ; --(C:대변)
        v_ACT06.act06_for_amt           := 0                                    ;
        v_ACT06.act06_amt               := v_DIFF_AMT                           ;
        v_ACT06.act06_deposit_id        := NULL                                 ;
        v_ACT06.act06_note              := NULL                                 ;
        v_ACT06.act06_account_map       := '0000000000'                         ;
        ---------------------------------------------------------------------------------

        RAISE NOTICE '실계정코드 가져오기!!!! ===> v_TR.ast06_company_id         : %', v_TR.ast06_company_id;
        RAISE NOTICE '실계정코드 가져오기!!!! ===> v_ACT06.act06_repr_account_cd : %', v_ACT06.act06_repr_account_cd;
        RAISE NOTICE '실계정코드 가져오기!!!! ===> v_ACT06.act06_account_map     : %', v_ACT06.act06_account_map;

        -- 실계정코드 가져오기
        v_errMsg := '실계정코드 가져오기 실패 ['||v_TR.ast01_item_s_class_cd||']['||v_TR.ast01_account_type||']';
        SELECT act13_real_account_cd
          INTO v_ACT06.act06_real_account_cd
          FROM act13_real_account_map
         WHERE act13_company_id        = v_TR.ast06_company_id
           AND act13_repr_account_cd   = v_ACT06.act06_repr_account_cd
           AND act13_account_map       = v_ACT06.act06_account_map;
        ---------------------------------------------------------------------------------
        IF v_ACT06.act06_real_account_cd IS NULL THEN
            v_errMsg := '환차손익에 대한 실계정코드가 없습니다.';
            RAISE USING ERRCODE = '90001';
        END IF;
        ---------------------------------------------------------------------------------
        INSERT INTO act06_journal_tmp VALUES (v_ACT06.*);
    END IF;

    -------------------------------------------------------------------------------------
    -- 3. 금액이 '-'인 경우 상대계정으로 변경
    -------------------------------------------------------------------------------------
    v_errMsg := '상대계정처리 실패';
    FOR v_JNL IN ( SELECT *
                     FROM act06_journal_tmp
                    WHERE act06_journal_id = p_journal_id
                      AND act06_amt < 0
    ) LOOP 
        ---------------------------------------------------------------------------------
        v_ACT06 := NULL;
        ---------------------------------------------------------------------------------

        RAISE NOTICE '대표손익계정 : %', v_JNL.act06_repr_account_cd;

        -- 상대대표계정코드 가져오기
        SELECT act10_tgt_repr_account_cd
          INTO v_ACT06.act06_repr_account_cd
          FROM act10_repr_account
         WHERE act10_company_id      = v_TR.ast06_company_id
           AND act10_repr_account_cd = v_JNL.act06_repr_account_cd;

        RAISE NOTICE '상대대표계정코드 : %', v_ACT06.act06_repr_account_cd;

        ---------------------------------------------------------------------------------
        IF v_ACT06.act06_repr_account_cd IS NOT NULL THEN
            -----------------------------------------------------------------------------
            v_ACT06.act06_real_account_cd   := f_get_real_account_code ( v_TR.ast06_company_id
                                                                       , v_ACT06.act06_repr_account_cd
                                                                       , v_JNL.act06_account_map
                                                                       );
            -----------------------------------------------------------------------------
            IF v_JNL.act06_drcr_type = 'C' THEN
                v_ACT06.act06_drcr_type := 'D';
            ELSE
                v_ACT06.act06_drcr_type := 'C';
            END IF;
            -----------------------------------------------------------------------------
            v_ACT06.act06_amt     := v_JNL.act06_amt     * -1;
            v_ACT06.act06_for_amt := v_JNL.act06_for_amt * -1;
            -----------------------------------------------------------------------------
            UPDATE act06_journal_tmp
               SET act06_repr_account_cd = v_ACT06.act06_repr_account_cd
                 , act06_real_account_cd = v_ACT06.act06_real_account_cd
                 , act06_drcr_type       = v_ACT06.act06_drcr_type
                 , act06_amt             = v_ACT06.act06_amt
                 , act06_for_amt         = v_ACT06.act06_for_amt
             WHERE act06_journal_tmp_id  = v_JNL.act06_journal_tmp_id;
        END IF;
    END LOOP;

    -------------------------------------------------------------------------------------
    -- 4. 실분개장 생성
    -------------------------------------------------------------------------------------
    v_errMsg := f_create_journal_rr(p_journal_id);
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
