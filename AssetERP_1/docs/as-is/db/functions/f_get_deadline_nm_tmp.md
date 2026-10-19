# f_get_deadline_nm_tmp

## FUNCTION public.f_get_deadline_nm_tmp(p_deadline_id numeric, p_type character varying)

- 반환: `character varying`
- 줄 수: 31

```sql
CREATE OR REPLACE FUNCTION public.f_get_deadline_nm_tmp(p_deadline_id numeric, p_type character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_NM VARCHAR;
-----------------------------------------------------------------------------------------
BEGIN

    SELECT CASE WHEN p_type IN ('2','4') THEN '('||f_cdnm('CycleCode', sch03_cycle_cd, sch03_company_id, f_sysdate())||')' ELSE '' END
           ||CASE WHEN sch03_y_cd    IN ('0','00') THEN '' ELSE f_cdnm('YCode'        , sch03_y_cd   , sch03_company_id, f_sysdate()) END 
           ||CASE WHEN sch03_ys_cd   IN ('0','00') THEN '' ELSE f_cdnm('YsCode'       , sch03_ys_cd  , sch03_company_id, f_sysdate()) END	
           ||CASE WHEN sch03_m_cd    IN ('0','00') THEN '' ELSE f_cdnm('MCode'        , sch03_m_cd   , sch03_company_id, f_sysdate()) END	
           ||CASE WHEN sch03_ms_cd   IN ('0','00') THEN '' ELSE f_cdnm('MsCode'       , sch03_ms_cd  , sch03_company_id, f_sysdate()) END
           ||CASE WHEN sch03_d_cd    IN ('0','00') THEN '' ELSE f_cdnm('DCode'        , sch03_d_cd   , sch03_company_id, f_sysdate()) END	
           ||CASE WHEN sch03_ds_cd   IN ('0','00') THEN '' ELSE f_cdnm('DsCode'       , sch03_ds_cd  , sch03_company_id, f_sysdate()) END	
           ||CASE WHEN sch03_week_cd IN ('0','00') THEN '' ELSE f_cdnm('WeekOfMonth'  , sch03_week_cd, sch03_company_id, f_sysdate()) END
           ||CASE WHEN sch03_day_cd  IN ('0','00') THEN '' ELSE f_cdnm('DayOfWeekCode', sch03_day_cd , sch03_company_id, f_sysdate()) END
           ||CASE WHEN p_type IN ('3','4') THEN ' - '||sch03_note ELSE '' END
      INTO v_NM
      FROM sch03_deadline_100_old
     WHERE sch03_deadline_id = p_deadline_id;
    -------------------------------------------------------------------------------------
    RETURN v_NM ;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
