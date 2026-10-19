# f_create_tdm62

## FUNCTION public.f_create_tdm62(p_tdm59_id numeric, p_tdm51_id numeric)

- 반환: `character varying`
- 줄 수: 28

```sql
CREATE OR REPLACE FUNCTION public.f_create_tdm62(p_tdm59_id numeric, p_tdm51_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_TDM62     tdm62_chck_cmnt_relate_org%ROWTYPE;
    v_CNT       NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    v_TDM62 := NULL;
    -------------------------------------------------------------------------------------
    v_TDM62.tdm62_chck_cmnt_relate_org_id   := f_create_seq()   ;
    v_TDM62.tdm62_chck_appr_cmnt_id         := p_tdm59_id       ;
    v_TDM62.tdm62_chck_org_id               := p_tdm51_id       ;

    INSERT INTO tdm62_chck_cmnt_relate_org VALUES (v_TDM62.*);
    -------------------------------------------------------------------------------------
    RETURN 'Y';
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %', SQLERRM ;
    RETURN SQLERRM;
END;
$function$
```
