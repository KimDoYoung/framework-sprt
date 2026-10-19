# dcr01_import_from_admin

## PROCEDURE public.dcr01_import_from_admin(IN p_company_id numeric)

- 반환: `-`
- 줄 수: 64

```sql
CREATE OR REPLACE PROCEDURE public.dcr01_import_from_admin(IN p_company_id numeric)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
v_company_id numeric;
BEGIN

	-- 문서분류 관리회사
	v_company_id := 0;

	-- 1. 신규회사 Dcr01 생성
	INSERT INTO dcr01_class_tree
	SELECT f_create_seq()
	     , p_company_id
	     , dcr01_class_tree_nm
	     , dcr01_parent_tree_id
	     , dcr01_seq
	     , dcr01_note
	     , dcr01_class_tree_cd
	     , dcr01_type_cd
	     , dcr01_approval_type_cd
	     , dcr01_item_type_cd
	     , dcr01_seal_cd
	     , dcr01_use_yn
	     , dcr01_resrch_use_yn
	     , dcr01_advert_yn
	     , dcr01_comp_yn
	     , dcr01_risk_yn
	     , dcr01_mngm_yn
	     , dcr01_class_tree_id
		 , 'true'
	  FROM dcr01_class_tree
 	 WHERE dcr01_company_id = v_company_id;

	-- 2. 신규회사 Dcr01의 parentId Update
	UPDATE dcr01_class_tree a SET dcr01_parent_tree_id = (SELECT b.dcr01_class_tree_id
								 					        FROM dcr01_class_tree b
														   WHERE b.dcr01_insert_bak_dcr_id = a.dcr01_parent_tree_id
														     AND dcr01_company_id = p_company_id ) --new_parent_id
	WHERE a.dcr01_company_id     = p_company_id
  	  AND a.dcr01_parent_tree_id <> 0;

	-- 3. 신규회사 Dcr20 생성
	INSERT
	  INTO dcr20_relate_ics
	SELECT f_create_seq()
		 , (SELECT dcr01_class_tree_id
              FROM dcr01_class_tree b
             WHERE b.dcr01_class_tree_cd = a.dcr01_class_tree_cd
               AND b.dcr01_admin_yn      = 'true'
               AND b.dcr01_company_id    = p_company_id
             LIMIT 1)
		 , dcr20_ics_class_tree_id
		 , p_company_id
		 , dcr20_note
	  FROM dcr20_relate_ics
         , dcr01_class_tree a
	 WHERE dcr20_dcr_class_tree_id = dcr01_class_tree_id
	   AND dcr20_company_id        = v_company_id;

end
$procedure$
```
