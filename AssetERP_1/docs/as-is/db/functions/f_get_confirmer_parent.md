# f_get_confirmer_parent

## FUNCTION public.f_get_confirmer_parent(p_person_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 90

```sql
CREATE OR REPLACE FUNCTION public.f_get_confirmer_parent(p_person_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
v_COMPANY_ID    NUMERIC;
v_ORG_ID        NUMERIC;
v_PERSON_ID     NUMERIC;

c_ORG           RECORD;
-----------------------------------------------------------------------------------------
BEGIN
    /*
        조직장 return, 조직장이 공석인 경우 상위조직장으로 return
    */
    -------------------------------------------------------------------------------------
    SELECT emp01_company_id
         , f_get_emptrans(emp01_person_id, p_std_date, 'org_code_id') org_id
      INTO v_COMPANY_ID
         , v_ORG_ID
      FROM emp01_person
     WHERE emp01_person_id = p_person_id;
    -------------------------------------------------------------------------------------
    FOR c_ORG IN ( WITH RECURSIVE org ( org_id, parent_id, depth, path, cycle )
                   AS ( SELECT org01_code_id              as org_id
                             , org02_parent_code_id       as parent_id
                             , 0                          as depth
                             , ARRAY[org02_kor_nm::text]  as path
                             , false                      as cycle
                          FROM org01_code
                               INNER JOIN org02_info ON ( org02_code_id  = org01_code_id AND
                                                          org02_mod_date = (SELECT MAX(org02_mod_date)
                                                                              FROM org02_info
                                                                             WHERE org02_code_id   = org01_code_id
                                                                               AND org02_mod_date <= p_std_date) )
                         WHERE org01_company_id = v_COMPANY_ID
                           AND org01_code_id    = v_ORG_ID
                         UNION ALL
                        SELECT org01_code_id
                             , org02_parent_code_id
                             , depth + 1
                             , ARRAY_APPEND(path, org02_kor_nm::text)
                             , org02_kor_nm = ANY(path)
                          FROM org01_code
                               INNER JOIN org02_info ON ( org02_code_id  = org01_code_id AND
                                                          org02_mod_date = (SELECT MAX(org02_mod_date)
                                                                              FROM org02_info
                                                                             WHERE org02_code_id   = org01_code_id
                                                                               AND org02_mod_date <= p_std_date) )
                               INNER JOIN org ON parent_id = org01_code_id
                         WHERE org01_company_id = v_COMPANY_ID
                           AND NOT CYCLE
                      )
                      SELECT org_id FROM org
    ) LOOP
        ---------------------------------------------------------------------------------
        SELECT emp03_person_id
          INTO v_PERSON_ID
          FROM emp01_person
               INNER JOIN emp03_trans ON (    emp03_person_id = emp01_person_id
                                          AND emp03_trans_date = (SELECT MAX(emp03_trans_date)
                                                                    FROM emp03_trans
                                                                   WHERE emp03_person_id   = emp01_person_id
                                                                     AND emp03_trans_date <= p_std_date) )
         WHERE emp01_company_id  = v_COMPANY_ID
           AND emp03_org_code_id = c_ORG.org_id
           AND emp03_trans_cd   != '900'
           AND emp03_org_head_yn = 'true'
           AND NOT EXISTS ( SELECT 1
                              FROM emp04_add_title
                             WHERE emp04_add_person_id = emp03_person_id
                               AND ( ( emp04_start_date                        > p_std_date ) OR
                                       COALESCE(emp04_close_date,'9999-12-31') < p_std_date ) )
         ORDER BY emp03_title_cd
         LIMIT 1;
        ---------------------------------------------------------------------------------
        IF v_PERSON_ID IS NOT NULL THEN
            EXIT;
        END IF;
    END LOOP;

    -------------------------------------------------------------------------------------
    RETURN v_PERSON_ID;
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN null;
END;
$function$
```
