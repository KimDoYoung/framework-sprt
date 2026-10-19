# f_get_itemtype_nm

## FUNCTION public.f_get_itemtype_nm(p_flt03_id numeric)

- 반환: `character varying`
- 줄 수: 70

```sql
CREATE OR REPLACE FUNCTION public.f_get_itemtype_nm(p_flt03_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_itemType_nm   VARCHAR(50);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    /*WITH T AS ( SELECT '1'                                              AS item_type_cd
                     , SUBSTR(COALESCE(flt03_item_type,'000000'),1,1)   AS item_type
                     , flt03_company_id                                 AS company_id
                  FROM flt03_account
                 WHERE flt03_account_id = p_flt03_id
                 UNION
                SELECT '2'                                              AS item_type_cd
                     , SUBSTR(COALESCE(flt03_item_type,'000000'),2,1)   AS item_type
                     , flt03_company_id                                 AS company_id
                  FROM flt03_account
                 WHERE flt03_account_id = p_flt03_id
                 UNION
                SELECT '3'                                              AS item_type_cd
                     , SUBSTR(COALESCE(flt03_item_type,'000000'),3,1)   AS item_type
                     , flt03_company_id                                 AS company_id
                  FROM flt03_account
                 WHERE flt03_account_id = p_flt03_id
                 UNION
                SELECT '4'                                              AS item_type_cd
                     , SUBSTR(COALESCE(flt03_item_type,'000000'),4,1)   AS item_type
                     , flt03_company_id                                 AS company_id
                  FROM flt03_account
                 WHERE flt03_account_id = p_flt03_id
                 UNION
                SELECT '5'                                              AS item_type_cd
                     , SUBSTR(COALESCE(flt03_item_type,'000000'),5,1)   AS item_type
                     , flt03_company_id                                 AS company_id
                  FROM flt03_account
                 WHERE flt03_account_id = p_flt03_id
                 UNION
                SELECT '6'                                              AS item_type_cd
                     , SUBSTR(COALESCE(flt03_item_type,'000000'),6,1)   AS item_type
                     , flt03_company_id                                 AS company_id
                  FROM flt03_account
                 WHERE flt03_account_id = p_flt03_id
    )
    SELECT CASE WHEN SUM(CAST(item_type AS NUMERIC)) = 0 THEN '미지정'
                ELSE ( SELECT f_cdnm('ItemType', item_type_cd, company_id, f_sysdate())
                         FROM T
                        WHERE item_type = '1'
                        ORDER BY item_type_cd
                        LIMIT 1 )
                     ||CASE WHEN SUM(CAST(item_type AS NUMERIC)) = 1 THEN ''
                            ELSE ' 외 '||SUM(CAST(item_type AS NUMERIC)) - 1 END
                END
      INTO v_itemType_nm
      FROM T;*/

    SELECT f_get_itemType_nm (flt03_item_type, flt03_company_id)
      INTO v_itemType_nm
      FROM flt03_account
     WHERE flt03_account_id = p_flt03_id;
    -------------------------------------------------------------------------------------
    RETURN v_itemType_nm;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```

## FUNCTION public.f_get_itemtype_nm(p_item_type character varying, p_company_id numeric)

- 반환: `character varying`
- 줄 수: 47

```sql
CREATE OR REPLACE FUNCTION public.f_get_itemtype_nm(p_item_type character varying, p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_itemType_nm   VARCHAR(50);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    WITH T AS ( SELECT '1'                                          AS item_type_cd
                     , SUBSTR(COALESCE(p_item_type,'000000'),1,1)   AS item_type
                 UNION
                SELECT '2'                                          AS item_type_cd
                     , SUBSTR(COALESCE(p_item_type,'000000'),2,1)   AS item_type
                 UNION
                SELECT '3'                                          AS item_type_cd
                     , SUBSTR(COALESCE(p_item_type,'000000'),3,1)   AS item_type
                 UNION
                SELECT '4'                                          AS item_type_cd
                     , SUBSTR(COALESCE(p_item_type,'000000'),4,1)   AS item_type
                 UNION
                SELECT '5'                                          AS item_type_cd
                     , SUBSTR(COALESCE(p_item_type,'000000'),5,1)   AS item_type
                 UNION
                SELECT '6'                                          AS item_type_cd
                     , SUBSTR(COALESCE(p_item_type,'000000'),6,1)   AS item_type
    )
    SELECT CASE WHEN SUM(CAST(item_type AS NUMERIC)) = 0 THEN '미지정'
                ELSE ( SELECT f_cdnm('ItemType', item_type_cd, p_company_id, f_sysdate())
                         FROM T
                        WHERE item_type = '1'
                        ORDER BY item_type_cd
                        LIMIT 1 )
                     ||CASE WHEN SUM(CAST(item_type AS NUMERIC)) = 1 THEN ''
                            ELSE ' 외 '||SUM(CAST(item_type AS NUMERIC)) - 1 END
                END
      INTO v_itemType_nm
      FROM T;
    -------------------------------------------------------------------------------------
    RETURN v_itemType_nm;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
