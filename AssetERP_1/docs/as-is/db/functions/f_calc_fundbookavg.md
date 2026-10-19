# f_calc_fundbookavg

## FUNCTION public.f_calc_fundbookavg(p_company_id numeric, p_std_date date, p_type character varying, p_fund_type character varying)

- 반환: `numeric`
- 줄 수: 70

```sql
CREATE OR REPLACE FUNCTION public.f_calc_fundbookavg(p_company_id numeric, p_std_date date, p_type character varying, p_fund_type character varying)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_SUM           NUMERIC;
    v_DAYS          NUMERIC;
    v_START_DATE    DATE;
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    IF p_type NOT IN ('1','2') THEN
        RETURN NULL;
    END IF;

    -------------------------------------------------------------------------------------
    v_START_DATE := (p_std_date + interval '-3month')::date;
    IF p_std_date = f_get_last_day(p_std_date) THEN
        v_START_DATE := f_get_last_day(v_START_DATE);
    END IF;

    raise notice 'v_START_DATE : %', v_START_DATE;
    -------------------------------------------------------------------------------------
    SELECT SUM(CASE WHEN p_type = '1' THEN icam06_nav ELSE icam06_total_asset END)
         , f_get_datedif(v_START_DATE, p_std_date, 'D')
      INTO v_SUM
         , v_DAYS
      FROM (
             SELECT icam06_std_date
                  , icam06_fund_cd
                  , icam06_multi_class_cd
                  , icam06_nav
                  , icam06_total_asset
               FROM icam06_fund_book
                    INNER JOIN sys01_company ON ( sys01_icam_company_cd = icam06_icam_company_cd AND
                                                  sys01_company_id      = p_company_id           )
              WHERE icam06_std_date BETWEEN v_START_DATE + INTERVAL '+1day' AND p_std_date
              UNION ALL
             SELECT ifi32_std_date::date        AS icam06_std_date
                  , ifi32_fund_cd               AS icam06_fund_cd
                  , ifi32_multi_class_func_cd   AS icam06_multi_class_cd
                  , ifi32_nav                   AS icam06_nav
                  , ifi32_total_asset           AS icam06_total_asset
               FROM ifi32_fund_price
                    INNER JOIN ifi29_am_corp_mapping ON (    ifi29_if_cd      = ifi32_if_cd
                                                         AND ifi29_am_corp_cd = ifi32_am_corp_cd
                                                         AND ifi32_std_date  BETWEEN TO_CHAR(ifi29_start_date,'YYYYMMDD')
                                                                             AND     COALESCE(TO_CHAR(ifi29_end_date,'YYYYMMDD'),'99991231') )
             WHERE ifi29_company_id = p_company_id
               AND ifi32_cur_cd     = 'KRW'
               AND ifi32_std_date BETWEEN TO_CHAR((v_START_DATE + INTERVAL '+1day')::date,'YYYYMMDD') AND TO_CHAR(p_std_date,'YYYYMMDD')
           ) t
     WHERE ( ( p_fund_type     = '1'    AND /*(1:운용펀드)*/
               icam06_fund_cd  = (CASE WHEN COALESCE(icam06_multi_class_cd,'') != '' THEN icam06_multi_class_cd ELSE icam06_fund_cd END)
             )
             OR
             ( p_fund_type     = '2'    AND /*(2:판매펀드)*/
               icam06_fund_cd != COALESCE(icam06_multi_class_cd, '')
             ) );
    -------------------------------------------------------------------------------------
    RETURN ROUND(v_SUM / v_DAYS);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'EXCEPTION ERR!!! - %/%/%', p_company_id, p_std_date, p_type;
    RETURN null;
END;
$function$
```
