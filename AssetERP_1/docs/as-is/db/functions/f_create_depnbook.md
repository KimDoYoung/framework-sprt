# f_create_depnbook

## FUNCTION public.f_create_depnbook(p_proc_type character varying, p_tr_id numeric)

- 반환: `character varying`
- 줄 수: 219

```sql
CREATE OR REPLACE FUNCTION public.f_create_depnbook(p_proc_type character varying, p_tr_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_AST06             ast06_tr%ROWTYPE;
    v_AST13             ast13_book_depn%ROWTYPE;
    v_TR                RECORD;

    v_PRE_CLOSE_DATE    DATE;
    v_BOOK_IO           VARCHAR(1);
    v_CNT               NUMERIC;

    v_errMsg            VARCHAR(500);
-----------------------------------------------------------------------------------------
BEGIN
    v_errMsg := '비품원장 생성실패 ['||p_tr_id||']';

    -------------------------------------------------------------------------------------
    -- 거래정보 가져오기
    -------------------------------------------------------------------------------------
    SELECT *
      INTO v_AST06
      FROM ast06_tr
     WHERE ast06_tr_id = p_tr_id;

    IF v_AST06.ast06_tr_id IS NULL THEN
        IF p_proc_type = 'C' THEN
            RETURN 'Y';
        ELSE
            v_errMsg := '비품원장 생성 실패 - 거래내역이 존재하지 않습니다. ['||p_tr_id||']';
            RAISE USING ERRCODE = '90001';
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    -- 원장생성여부 체크
    v_errMsg := '원장생성여부 체크 실패 ['||v_AST06.ast06_company_id||']['||v_AST06.ast06_tr_cd||']';
    SELECT COALESCE(act11_book_io_type,'9')
      INTO v_BOOK_IO
      FROM ast05_tr_code
           LEFT OUTER JOIN act11_tr_map ON ( act11_company_id = ast05_company_id AND
                                             act11_tr_cd      = ast05_tr_cd      )
     WHERE ast05_company_id = v_AST06.ast06_company_id
       AND ast05_tr_cd      = v_AST06.ast06_tr_cd;

    IF v_BOOK_IO NOT IN ('1','2','5') THEN   --(1:입고/2:출고/5:원장변경)
        RAISE NOTICE '비품원장 반영 해당없음!!!' ;
        RETURN 'Y';
    END IF;

    -------------------------------------------------------------------------------------
    -- 정리전 감가상각분개 존재여부 체크
    -------------------------------------------------------------------------------------
    v_errMsg := '감가상각분개 존재여부 체크 실패';
    SELECT COUNT(*)
      INTO v_CNT
      FROM ast06_tr
     WHERE ast06_company_id = v_AST06.ast06_company_id
       AND ast06_pur_tr_id  = v_AST06.ast06_pur_tr_id
       AND ast06_tr_cd      = '5012' --(5012:감가상각)
       AND ast06_date       > v_AST06.ast06_date ;
    IF v_CNT > 0 THEN
        v_errMsg := '해당 자산의 감가상각 처리내역이 존재합니다. 감가상각 취소 후 거래해 주세요';
        RAISE USING ERRCODE = '90001';
    END IF;

    -------------------------------------------------------------------------------------
    -- 원장정리 (거래일 ~ 당일)
    -------------------------------------------------------------------------------------
    v_errMsg := '원장정리 (거래일이후 원장) 실패';
    DELETE
      FROM ast13_book_depn
     WHERE ast13_company_id         = v_AST06.ast06_company_id
       AND ast13_ast_class_tree_id  = v_AST06.ast06_ast_class_tree_id
       AND ast13_pur_tr_id          = v_AST06.ast06_pur_tr_id
       AND ast13_depn_date          >= v_AST06.ast06_date;

    -------------------------------------------------------------------------------------
    -- 원장생성 (거래일 ~ 당일 : 영업일만)
    -------------------------------------------------------------------------------------
    v_errMsg := '원장생성 (거래일 ~ 당일) 실패';
    FOR v_TR IN ( SELECT ast06_tr.*
                       , COALESCE(( SELECT act11_book_io_type
                                      FROM act11_tr_map
                                     WHERE act11_company_id              = ast06_company_id
                                       AND act11_tr_cd                   = ast06_tr_cd
                                       AND COALESCE(act11_use_yn,'true') = 'true'
                                     LIMIT 1 ),'9') as act11_book_io_type
                    FROM ast06_tr
                         INNER JOIN ast01_class_tree ON ast01_class_tree_id = ast06_ast_class_tree_id
                   WHERE ast06_company_id           = v_AST06.ast06_company_id
                     AND ast06_ast_class_tree_id    = v_AST06.ast06_ast_class_tree_id
                     AND ast06_pur_tr_id            = v_AST06.ast06_pur_tr_id
                     AND ast06_date BETWEEN v_AST06.ast06_date AND f_today()
                     AND 'Y' = ( CASE WHEN p_proc_type = 'C' AND ast06_tr_id = p_tr_id THEN 'N' -- 취소건은 제외하고 원장반영
                                      ELSE 'Y' END )
                   ORDER BY ast06_date, ast06_tr_id
    ) LOOP
        v_errMsg := '원장반영['||v_TR.ast06_date||'] 실패';
        ---------------------------------------------------------------------------------
        CONTINUE WHEN v_TR.act11_book_io_type NOT IN ('1','2','5');    --(1:입고/2:출고/5:원장변경)만 PASS
        ---------------------------------------------------------------------------------
        -- 입고거래반영
        ---------------------------------------------------------------------------------
        IF v_TR.act11_book_io_type = '1' THEN
            -----------------------------------------------------------------------------
            v_AST13.ast13_book_depn_id      := f_create_seq()               ;
            v_AST13.ast13_company_id        := v_TR.ast06_company_id        ;
            v_AST13.ast13_ast_class_tree_id := v_TR.ast06_ast_class_tree_id ;
            v_AST13.ast13_pur_tr_id         := v_TR.ast06_tr_id             ;
            v_AST13.ast13_pur_date          := v_TR.ast06_date              ;
            v_AST13.ast13_pur_amt           := v_TR.ast06_cont_amt          ;
            v_AST13.ast13_retire_date       := NULL                         ;
            v_AST13.ast13_depn_date         := v_TR.ast06_date              ;
            v_AST13.ast13_month_depn_cost   := 0                            ;
            v_AST13.ast13_depn_cost         := 0                            ;
            v_AST13.ast13_acm_depn_cost     := 0                            ;
            -----------------------------------------------------------------------------
            INSERT INTO ast13_book_depn VALUES (v_AST13.*);
        ---------------------------------------------------------------------------------
        -- 출고거래반영
        ---------------------------------------------------------------------------------
        ELSIF v_TR.act11_book_io_type = '2' THEN
            -----------------------------------------------------------------------------
            -- 원장 가져오기
            SELECT *
              INTO v_AST13
              FROM ast13_book_depn
             WHERE ast13_company_id         = v_TR.ast06_company_id
               AND ast13_ast_class_tree_id  = v_TR.ast06_ast_class_tree_id
               AND ast13_pur_tr_id          = v_TR.ast06_pur_tr_id
               AND ast13_depn_date         <= v_TR.ast06_date
             ORDER BY ast13_depn_date DESC
             LIMIT 1;
            -----------------------------------------------------------------------------
            IF v_AST13.ast13_depn_date = v_TR.ast06_date THEN
                -------------------------------------------------------------------------
                UPDATE ast13_book_depn
                   SET ast13_retire_date        = v_TR.ast06_date
                     , ast13_depn_cost          = 0
                     , ast13_acm_depn_cost      = 0
                     , ast13_month_depn_cost    = 0
                 WHERE ast13_book_depn_id = v_AST13.ast13_book_depn_id;
            -----------------------------------------------------------------------------
            ELSE
                v_AST13.ast13_book_depn_id      := f_create_seq()   ;
                v_AST13.ast13_depn_date         := v_TR.ast06_date  ;
                v_AST13.ast13_retire_date       := v_TR.ast06_date  ;
                v_AST13.ast13_depn_cost         := 0                ;
                v_AST13.ast13_acm_depn_cost     := 0                ;
                v_AST13.ast13_month_depn_cost   := 0                ;
                -------------------------------------------------------------------------
                INSERT INTO ast13_book_depn VALUES (v_AST13.*);
            END IF;
            -----------------------------------------------------------------------------
            -- 거래내역의 장부금액 최신데이터로 UPDATE
            UPDATE ast06_tr
               SET ast06_book_amt = v_AST13.ast13_pur_amt
             WHERE ast06_tr_id    = v_TR.ast06_tr_id;

        ---------------------------------------------------------------------------------
        -- 원장변경(감가상각처리)
        ---------------------------------------------------------------------------------
        ELSIF v_TR.act11_book_io_type = '5' THEN
            -----------------------------------------------------------------------------
            -- 최근 원장 가져오기
            SELECT *
              INTO v_AST13
              FROM ast13_book_depn
             WHERE ast13_company_id         = v_TR.ast06_company_id
               AND ast13_ast_class_tree_id  = v_TR.ast06_ast_class_tree_id
               AND ast13_pur_tr_id          = v_TR.ast06_pur_tr_id
               AND ast13_depn_date         <= v_TR.ast06_date
             ORDER BY ast13_depn_date DESC
             LIMIT 1;
            -----------------------------------------------------------------------------
            -- 전결산일
            v_PRE_CLOSE_DATE := f_get_account_close_date(v_TR.ast06_company_id, v_TR.ast06_date, -1);
            -----------------------------------------------------------------------------
            -- 감가상각비(당기분) 초기화
            IF v_AST13.ast13_depn_date = v_PRE_CLOSE_DATE THEN
                v_AST13.ast13_depn_cost := 0;
            END IF;
            -----------------------------------------------------------------------------
            IF v_AST13.ast13_depn_date = v_TR.ast06_date THEN
                -------------------------------------------------------------------------
                UPDATE ast13_book_depn
                   SET ast13_month_depn_cost = v_TR.ast06_amt
                     , ast13_depn_cost       = v_AST13.ast13_depn_cost     + v_TR.ast06_amt
                     , ast13_acm_depn_cost   = v_AST13.ast13_acm_depn_cost + v_TR.ast06_amt
                 WHERE ast13_book_depn_id = v_AST13.ast13_book_depn_id;
            -----------------------------------------------------------------------------
            ELSE
                v_AST13.ast13_book_depn_id      := f_create_seq()                               ;
                v_AST13.ast13_depn_date         := v_TR.ast06_date                              ;
                v_AST13.ast13_month_depn_cost   := v_TR.ast06_amt                               ;
                v_AST13.ast13_depn_cost         := v_AST13.ast13_depn_cost     + v_TR.ast06_amt ;
                v_AST13.ast13_acm_depn_cost     := v_AST13.ast13_acm_depn_cost + v_TR.ast06_amt ;
                -------------------------------------------------------------------------
                INSERT INTO ast13_book_depn VALUES (v_AST13.*);
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
