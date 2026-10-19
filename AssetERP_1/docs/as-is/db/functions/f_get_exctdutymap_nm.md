# f_get_exctdutymap_nm

## FUNCTION public.f_get_exctdutymap_nm(p_exct_duty_map character varying)

- 반환: `character varying`
- 줄 수: 47

```sql
CREATE OR REPLACE FUNCTION public.f_get_exctdutymap_nm(p_exct_duty_map character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_nm    VARCHAR(100);
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    WITH T AS ( SELECT '10'                                             AS exct_duty_cd
                     , SUBSTR(COALESCE(p_exct_duty_map,'000000'),1,1)   AS exct_duty_yn
                 UNION
                SELECT '20'                                             AS exct_duty_cd
                     , SUBSTR(COALESCE(p_exct_duty_map,'000000'),2,1)   AS exct_duty_yn
                 UNION
                SELECT '30'                                             AS exct_duty_cd
                     , SUBSTR(COALESCE(p_exct_duty_map,'000000'),3,1)   AS exct_duty_yn
                 UNION
                SELECT '40'                                             AS exct_duty_cd
                     , SUBSTR(COALESCE(p_exct_duty_map,'000000'),4,1)   AS exct_duty_yn
                 UNION
                SELECT '50'                                             AS exct_duty_cd
                     , SUBSTR(COALESCE(p_exct_duty_map,'000000'),5,1)   AS exct_duty_yn
                 UNION
                SELECT '60'                                             AS exct_duty_cd
                     , SUBSTR(COALESCE(p_exct_duty_map,'000000'),6,1)   AS exct_duty_yn
    )
    SELECT CASE WHEN SUM(CAST(exct_duty_yn AS NUMERIC)) = 0 THEN null
                ELSE ( SELECT f_cdnm('TdmExctDutyCode', exct_duty_cd, 0, f_today())
                         FROM T
                        WHERE exct_duty_yn = '1'
                        ORDER BY exct_duty_cd
                        LIMIT 1 )
                     ||CASE WHEN SUM(CAST(exct_duty_yn AS NUMERIC)) = 1 THEN ''
                            ELSE ' 외 '||SUM(CAST(exct_duty_yn AS NUMERIC)) - 1 END
                END
      INTO v_nm
      FROM T;
    -------------------------------------------------------------------------------------
    RETURN v_nm;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
