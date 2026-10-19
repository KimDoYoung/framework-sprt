# f_get_tdmorg_id

## FUNCTION public.f_get_tdmorg_id(p_person_id numeric, p_std_date date)

- 반환: `numeric`
- 줄 수: 31

```sql
CREATE OR REPLACE FUNCTION public.f_get_tdmorg_id(p_person_id numeric, p_std_date date)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
-----------------------------------------------------------------------------------------
DECLARE
    v_COMPANY_ID    NUMERIC;
    v_ORG_ID        NUMERIC;
-----------------------------------------------------------------------------------------
BEGIN
    /*-----------------------------------------------------------------------------------

          소속 책무이행 점검조직ID 리턴

    -----------------------------------------------------------------------------------*/
    SELECT emp00_org_code_id
         , emp01_company_id
      INTO v_ORG_ID
         , v_COMPANY_ID
      FROM emp01_person
           INNER JOIN LATERAL getPerson(emp01_company_id, p_std_date) ON emp00_person_id = emp01_person_id
     WHERE emp01_person_id = p_person_id ;

    -------------------------------------------------------------------------------------
    RETURN f_get_tdmOrg_id2(v_COMPANY_ID, v_ORG_ID, p_std_date);
-----------------------------------------------------------------------------------------
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
```
