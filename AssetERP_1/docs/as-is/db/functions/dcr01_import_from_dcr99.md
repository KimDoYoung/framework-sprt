# dcr01_import_from_dcr99

## PROCEDURE public.dcr01_import_from_dcr99(IN p_company_id numeric)

- 반환: `-`
- 줄 수: 59

```sql
CREATE OR REPLACE PROCEDURE public.dcr01_import_from_dcr99(IN p_company_id numeric)
 LANGUAGE plpgsql
AS $procedure$
declare  
	 v_dcr01 record;
	 v_count integer := 0; 
	 v_now_id  numeric ;
	 v_base numeric;
	 v_exist_count integer;
	 v_company_id numeric; 
	 v_start_id  numeric ; -- 시작 seq	 
	 v_nextseq numeric;  -- 넣을 seq
begin
	v_company_id = -99999;
	-- ---------------------------------------------------------------------
	-- 1. dcr99 의 note를 X로 만든다.
	-- ---------------------------------------------------------------------
	update dcr99_class_tree_temp set dcr99_note = 'X' where dcr99_company_id = v_company_id ;
	
	-- ---------------------------------------------------------------------
	-- 2. dcr99를 현재의 dcr01 max(id) + 100 부터 번호를 다시 만든다.
	-- ---------------------------------------------------------------------
	
	-- start id는 현재 dcr01의 max id
	select coalesce(max(dcr01_class_tree_id),1) into v_start_id from  dcr01_class_tree;
	
	select f_create_seq() into v_nextseq;
	
	LOOP	
		-- id를 변경해야할 갯수가 있는가? 즉 note가 X로 설정된 것이 있는가?
        select coalesce( count(*), 0) into v_count from dcr99_class_tree_temp where dcr99_note is not null  and dcr99_company_id = v_company_id ;
        EXIT WHEN v_count  = 0;
		
		-- note가 X로 설정된 것 1개 고른다.
		select * into v_dcr01 from dcr99_class_tree_temp where  dcr99_note is not null	 and dcr99_company_id = v_company_id 	limit 1;
		-- 골라낸 것의 id를 seq로 바꾸고 note를 null로 바꾼다.
		update dcr99_class_tree_temp set dcr99_class_tree_id = v_nextseq, dcr99_note = null where dcr99_class_tree_id = v_dcr01.dcr99_class_tree_id  and dcr99_company_id =v_company_id ;
		-- 골라낸 것을 parent로 하는 것들의  parent를 seq로 바꾼다.
		update dcr99_class_tree_temp set dcr99_parent_tree_id = v_nextseq where dcr99_parent_tree_id = v_dcr01.dcr99_class_tree_id  and dcr99_company_id =v_company_id ;

        -- v_nextseq := v_nextseq + 1;
		select f_create_seq() into v_nextseq;
    END LOOP;	
	-- RAISE NOTICE 'end numbering';
	-- ---------------------------------------------------------------------
	-- 3. dcr01을 dcr99로 채운다. dcr99의 company_id 는 99999이다
	-- ---------------------------------------------------------------------
	insert into dcr01_class_tree select * from dcr99_class_tree_temp where dcr99_company_id = v_company_id ;
	--RAISE NOTICE 'end dcr01 insert';
	-- ---------------------------------------------------------------------
	-- 4. dcr01의 company_id가 99999인 것을 인자로 받은 p_company_id로 update한다
	-- ---------------------------------------------------------------------
	update dcr01_class_tree set dcr01_company_id = p_company_id where dcr01_company_id = v_company_id;
	--RAISE NOTICE 'end dcr01 update';
	
end 
$procedure$
```
