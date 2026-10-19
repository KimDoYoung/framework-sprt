# f_create_tdm10copy

## FUNCTION public.f_create_tdm10copy(p_old_task_id numeric, p_new_task_id numeric)

- 반환: `character varying`
- 줄 수: 80

```sql
CREATE OR REPLACE FUNCTION public.f_create_tdm10copy(p_old_task_id numeric, p_new_task_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    c_DETAIL            tdm12_task_relate_detail%ROWTYPE;
    v_TDM12             tdm12_task_relate_detail%ROWTYPE;

    v_errMsg            TEXT;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 책무세부내용, 주요관리의무 생성
    FOR c_DETAIL IN ( SELECT *
                        FROM tdm12_task_relate_detail
                       WHERE tdm12_task_id = p_old_task_id
                         AND COALESCE(tdm12_use_yn,'false') = 'true'
                       ORDER BY tdm12_seq
    ) LOOP
        ---------------------------------------------------------------------------------
        v_TDM12 := NULL;
        ---------------------------------------------------------------------------------
        v_TDM12.tdm12_task_relate_detail_id := f_create_seq()                           ;
        v_TDM12.tdm12_task_id               := p_new_task_id                            ;
        v_TDM12.tdm12_content               := c_DETAIL.tdm12_content                   ;
        v_TDM12.tdm12_seq                   := c_DETAIL.tdm12_seq                       ;
        v_TDM12.tdm12_use_yn                := 'true'                                   ;
        v_TDM12.tdm12_upd_nm                := current_setting('app.current_user',true) ;
        v_TDM12.tdm12_upd_date              := f_sysdate()                              ;
        ---------------------------------------------------------------------------------
        INSERT INTO tdm12_task_relate_detail VALUES (v_TDM12.*);

        ---------------------------------------------------------------------------------
        INSERT
          INTO tdm13_task_relate_duty
        SELECT f_create_seq()
             , v_TDM12.tdm12_task_id
             , v_TDM12.tdm12_task_relate_detail_id
             , tdm13_content
             , tdm13_seq
             , 'true'
             , current_setting('app.current_user',true)
             , f_sysdate()
          FROM tdm13_task_relate_duty
         WHERE tdm13_task_id                    = p_old_task_id
           AND tdm13_task_relate_detail_id      = c_DETAIL.tdm12_task_relate_detail_id
           AND COALESCE(tdm13_use_yn,'false')   = 'true'
         ORDER BY tdm13_seq;
    END LOOP;

    -------------------------------------------------------------------------------------
    -- 연관 법규/내규 생성
    INSERT
      INTO tdm11_task_relate_rule
    SELECT f_create_seq()
         , p_new_task_id
         , tdm11_relate_type
         , tdm11_rule_cd
         , tdm11_seq
         , tdm11_company_id
         , current_setting('app.current_user',true)
         , f_sysdate()
      FROM tdm11_task_relate_rule
     WHERE tdm11_task_id = p_old_task_id;

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
