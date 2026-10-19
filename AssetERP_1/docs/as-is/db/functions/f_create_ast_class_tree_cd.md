# f_create_ast_class_tree_cd

## FUNCTION public.f_create_ast_class_tree_cd(p_parent_id numeric, p_type_cd character varying, p_company_id numeric)

- 반환: `character varying`
- 줄 수: 47

```sql
CREATE OR REPLACE FUNCTION public.f_create_ast_class_tree_cd(p_parent_id numeric, p_type_cd character varying, p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_asset_cd  VARCHAR;
v_parent_cd VARCHAR;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    -- 3자리 + '0000000'
    IF p_type_cd = 'IC' THEN
        SELECT LPAD(CAST(COALESCE(CAST(MAX(SUBSTR(ast01_class_tree_cd,1,3)) AS numeric),0) + 1 AS VARCHAR), 3, '0')||'0000000'
          INTO v_asset_cd 
          FROM ast01_class_tree
         WHERE ast01_company_id = p_company_id
           AND ast01_type_cd    = 'IC';
    -------------------------------------------------------------------------------------
    -- 상위코드3자리 + 7자리
    ELSIF p_type_cd = 'IT' THEN              

        -- 상위분류코드 가져오기
        SELECT ast01_class_tree_cd
          INTO v_parent_cd
          FROM ast01_class_tree
         WHERE ast01_class_tree_id = p_parent_id;

        IF v_parent_cd IS NULL THEN
            RETURN '상위코드미존재' ;
        END IF;

        SELECT SUBSTR(v_parent_cd,1,3)||LPAD(CAST(COALESCE(CAST(MAX(SUBSTR(ast01_class_tree_cd,4,7)) AS numeric),0) + 1 AS VARCHAR), 7, '0')
          INTO v_asset_cd
          FROM ast01_class_tree
         WHERE ast01_company_id     = p_company_id
           AND ast01_parent_tree_id = p_parent_id
           AND ast01_type_cd        = 'IT';
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_asset_cd;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
