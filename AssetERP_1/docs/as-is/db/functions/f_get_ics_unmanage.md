# f_get_ics_unmanage

## FUNCTION public.f_get_ics_unmanage(p_company_id numeric, p_ics_class_tree_id numeric, p_person_id numeric)

- 반환: `character varying`
- 줄 수: 72

```sql
CREATE OR REPLACE FUNCTION public.f_get_ics_unmanage(p_company_id numeric, p_ics_class_tree_id numeric, p_person_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_MANAGER_ID    NUMERIC;
    v_ORG_ID        NUMERIC;
    v_CNT           NUMERIC;
    v_YN            VARCHAR(1) := 'N';

-----------------------------------------------------------------------------------------
--  내부통제 통제그룹이 미지정되어 있으며, 유저가 미지정담당자 및 공유자이면 'Y' return
-----------------------------------------------------------------------------------------
BEGIN
    -------------------------------------------------------------------------------------
    SELECT ics05_manager_id
      INTO v_MANAGER_ID
      FROM ics05_relate_manager
           INNER JOIN ics02_manager ON ics02_manager_id = ics05_manager_id
     WHERE ics05_ics_class_tree_id = p_ics_class_tree_id
       AND ics02_company_id        = p_company_id ;
    -------------------------------------------------------------------------------------
    IF v_MANAGER_ID IS NOT NULL THEN
        SELECT COUNT(*)
          INTO v_CNT
          FROM ics02_manager
         WHERE ics02_manager_id = v_MANAGER_ID
           AND ics02_default_yn = 'true';

        IF v_CNT > 0 THEN
            v_YN := 'Y';
        END IF;
    -------------------------------------------------------------------------------------
    ELSE
        v_YN := 'Y';

        SELECT ics02_manager_id
          INTO v_MANAGER_ID
          FROM ics02_manager
         WHERE ics02_company_id = p_company_id
           AND ics02_default_yn = 'true'
         LIMIT 1;
    END IF;

    -------------------------------------------------------------------------------------
    IF v_YN = 'Y' THEN
        v_ORG_ID := f_get_emptrans(p_person_id, f_today(), 'org_code_id');

        SELECT COUNT(*)
          INTO v_CNT
          FROM ( SELECT *
                   FROM ics04_share
                  WHERE ics04_company_id = p_company_id
                    AND ics04_manager_id = v_MANAGER_ID
                    AND ( ( ics04_share_cd  = '1'           AND
                            ics04_person_id = p_person_id   ) OR
                          ( ics04_share_cd  = '2'           AND
                            ics04_org_id    = v_ORG_ID      ) ) ) t;

        IF v_CNT = 0 THEN
            v_YN := 'N';
        END IF;
    END IF;
    -------------------------------------------------------------------------------------
    RETURN v_YN;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN 'N';
END;
$function$
```
