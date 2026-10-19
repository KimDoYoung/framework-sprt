# ld_fundhouse_data

## FUNCTION public.ld_fundhouse_data(p_file_name character varying, p_fundhouse_name character varying)

- 반환: `text`
- 줄 수: 316

```sql
CREATE OR REPLACE FUNCTION public.ld_fundhouse_data(p_file_name character varying, p_fundhouse_name character varying)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
declare
	r0      record;
	r1      record;
	w_if_cd  ifi30_fund.ifi30_if_cd%type;
	w_ret   VARCHAR(1);   
	w_cnt   integer;

BEGIN


	if p_fundhouse_name = 'shinhan' then
		w_if_cd :='SFTP_SHFP_01';
	elsif p_fundhouse_name = 'kb' then
		w_if_cd :='SFTP_KBFP_01';
	else
		raise '사무수탁사 Not defined %', p_fundhouse_name;
	end if;


	for r0 in 
  		select   file_name 
			, substr(file_name,1,8)  file_name_send_date
		  	, split_part(file_name, '_',2) file_name_amc_cd
		  	, split_part(file_name, '_',3) file_name_part2
			, split_part(contents, '|',1) send_date
			, split_part(contents, '|',2) am_corp_cd
			, count(*)  
  		from      ifi_recv  
		where   file_name = p_file_name
  		group by  file_name, substr(file_name,1,8)
			, split_part(file_name, '_',2) , split_part(file_name, '_',3)
			, split_part(contents, '|',1), split_part(contents, '|',2) 
	loop

		if r0.file_name_part2='fund.txt' then
			delete from ifi30_fund       where ifi30_if_cd = w_if_cd and ifi30_send_date = r0.file_name_send_date  and  ifi30_am_corp_cd = r0.am_corp_cd;

		elsif r0.file_name_part2='fee.txt' then
			delete from ifi31_fund_fee   where ifi31_if_cd = w_if_cd and ifi31_send_date = r0.file_name_send_date  and  ifi31_am_corp_cd = r0.am_corp_cd;
			
		elsif r0.file_name_part2='price.txt' then
			delete from ifi32_fund_price where ifi32_if_cd = w_if_cd and ifi32_send_date = r0.file_name_send_date  and  ifi32_am_corp_cd = r0.am_corp_cd;

		elsif r0.file_name_part2='adv.txt' then
			delete from ifi33_adv        where ifi33_if_cd = w_if_cd and ifi33_send_date = r0.file_name_send_date  and  ifi33_am_corp_cd = r0.am_corp_cd;

		elsif r0.file_name_part2='equity.txt' then
			delete from ifi34_stk        where ifi34_if_cd = w_if_cd and ifi34_send_date = r0.file_name_send_date  and  ifi34_am_corp_cd = r0.am_corp_cd;
		end if;
	end loop;		


	----------------------------------------------------------------------------
	for r0 in 
  		select    file_name
			, substr(file_name,1,8)  file_name_send_date
			, split_part(file_name, '_',3) file_name_part2	, count(*)  
  		from      ifi_recv  
		where   file_name = p_file_name
  		group by  file_name, substr(file_name,1,8), split_part(file_name, '_',3)
	loop

		for r1 in 
			select contents 
			from   ifi_recv
			where  file_name = r0.file_name
		loop
 
			if r0.file_name_part2 = 'fund.txt'  then

				insert into ifi30_fund
				(
					ifi30_fund_id ,
					ifi30_if_cd ,
					ifi30_send_date ,
					ifi30_am_corp_cd ,
					ifi30_am_corp_nm ,
					ifi30_fund_cd ,
					ifi30_fund_nm ,
					ifi30_first_set_date ,
					ifi30_end_date ,
					ifi30_end_yn ,
					ifi30_kofia_fund_cd ,
					ifi30_ksd_fund_cd ,
					ifi30_ksd_item_cd ,
					ifi30_kofia_trust_cd ,
					ifi30_kofia_fund_type_cd ,
					ifi30_kofia_public_cd ,
					ifi30_kofia_parent_cd ,
					ifi30_kofia_class_type_cd ,
					ifi30_kofia_fund_unit_cd ,
					ifi30_kofia_char_class_cd ,
					ifi30_set_amt ,
					ifi30_nav ,
					ifi30_opr_dept ,
					ifi30_operator1 ,
					ifi30_operator2 ,
					ifi30_cust_cd ,
					ifi30_cust_nm ,
					ifi30_office_work_cd ,
					ifi30_office_work_nm ,
					ifi30_am_rate ,
					ifi30_sales_rate ,
					ifi30_cust_rate ,
					ifi30_office_work_rate ,
					ifi30_cur_cd ,
					ifi30_mat_due_date ,
					ifi30_next_close_date ,
					ifi30_next_fee_date ,
					ifi30_work_date 
				)
				values
				(
					f_create_batchseq() ,
					w_if_cd ,
					-- split_part(r1.contents, '|', 1),   --ifi30_send_date 
					r0.file_name_send_date ,
					split_part(r1.contents, '|', 2),   --ifi30_am_corp_cd
					split_part(r1.contents, '|', 3),   --ifi30_am_corp_nm
					split_part(r1.contents, '|', 4),   --ifi30_fund_cd 
					split_part(r1.contents, '|', 5),   --ifi30_fund_nm 
					split_part(r1.contents, '|', 6),   --ifi30_first_set_date 
					split_part(r1.contents, '|', 7),   --ifi30_end_date 
					split_part(r1.contents, '|', 8),   --ifi30_end_yn 
					split_part(r1.contents, '|', 9),   --ifi30_kofia_fund_cd 
					split_part(r1.contents, '|', 10),   --ifi30_ksd_fund_cd 
					split_part(r1.contents, '|', 11),   --ifi30_ksd_item_cd 
					split_part(r1.contents, '|', 12),   --ifi30_kofia_trust_cd 
					split_part(r1.contents, '|', 13),   --ifi30_kofia_fund_type_cd 
					split_part(r1.contents, '|', 14),   --ifi30_kofia_public_cd 
					split_part(r1.contents, '|', 15),   --ifi30_kofia_parent_cd 
					split_part(r1.contents, '|', 16),   --ifi30_kofia_class_type_cd 
					split_part(r1.contents, '|', 17),   --ifi30_kofia_fund_unit_cd 
					split_part(r1.contents, '|', 18),   --ifi30_kofia_char_class_cd
					to_number(split_part(r1.contents, '|', 19),'999999999999999.99999999') ,   --ifi30_set_amt 
					to_number(split_part(r1.contents, '|', 20),'999999999999999.99999999'),   --ifi30_nav 
					split_part(r1.contents, '|', 21),   --ifi30_opr_dept 
					split_part(r1.contents, '|', 22),   --ifi30_operator1
					split_part(r1.contents, '|', 23),   --ifi30_operator2 
					split_part(r1.contents, '|', 24),   --ifi30_cust_cd 
					split_part(r1.contents, '|', 25),   --ifi30_cust_nm 
					split_part(r1.contents, '|', 26),   --ifi30_office_work_cd
					split_part(r1.contents, '|', 27),   --ifi30_office_work_nm 
					to_number(split_part(r1.contents, '|', 28),'999999999999999.99999999'),   --ifi30_am_rate 
					to_number(split_part(r1.contents, '|', 29),'999999999999999.99999999'),   --ifi30_sales_rate
					to_number(split_part(r1.contents, '|', 30),'999999999999999.99999999'),   --ifi30_cust_rate 
					to_number(split_part(r1.contents, '|', 31),'999999999999999.99999999'),   --ifi30_office_work_rate 
					split_part(r1.contents, '|', 32),   --ifi30_cur_cd
					split_part(r1.contents, '|', 33),  --ifi30_mat_due_date
					split_part(r1.contents, '|', 34),  --ifi30_next_close_date
					split_part(r1.contents, '|', 35),   --ifi30_next_fee_date
					current_timestamp
				);


			elsif r0.file_name_part2='fee.txt' then
				insert into ifi31_fund_fee  
				(
					ifi31_fund_fee_id ,
					ifi31_if_cd ,
					ifi31_send_date ,
					ifi31_am_corp_cd ,
					ifi31_am_corp_nm ,
					ifi31_std_date ,
					ifi31_fund_cd ,
					ifi31_fund_nm ,
					ifi31_occ_fee ,
					ifi31_cur_cd ,
					ifi31_fx_rate ,
					ifi31_work_date 
				)
				values
				(
					f_create_batchseq() ,
					w_if_cd ,
					r0.file_name_send_date ,
					-- split_part(r1.contents, '|', 1),   --ifi31_send_date 
					split_part(r1.contents, '|', 2),   --ifi31_am_corp_cd 
					split_part(r1.contents, '|', 3),   --ifi31_am_corp_nm 
					split_part(r1.contents, '|', 4),   --ifi31_std_date 
					split_part(r1.contents, '|', 5),   --ifi31_fund_cd 
					split_part(r1.contents, '|', 6),   --ifi31_fund_nm 
					to_number(split_part(r1.contents, '|', 7),'999999999999999.99999999'),   --ifi31_occ_fee 
					split_part(r1.contents, '|', 8),   --ifi31_cur_cd 
					to_number(split_part(r1.contents, '|', 9),'999999999999999.99999999'),   --ifi31_fx_rate 
					current_timestamp
				);
				
			elsif r0.file_name_part2='price.txt' then
				insert into  ifi32_fund_price
				(
					ifi32_fund_price_id ,
					ifi32_if_cd ,
					ifi32_send_date ,
					ifi32_am_corp_cd ,
					ifi32_am_corp_nm ,
					ifi32_std_date ,
					ifi32_fund_cd ,
					ifi32_fund_nm ,
					ifi32_multi_class_func_cd ,
					ifi32_cur_cd ,
					ifi32_set_qty ,
					ifi32_set_amt ,
					ifi32_principal ,
					ifi32_nav ,
					ifi32_total_asset ,
					ifi32_price ,
					ifi32_tax_price  ,
					ifi32_work_date
				)
				values
				(
					f_create_batchseq() ,
					w_if_cd ,
					r0.file_name_send_date ,
					-- split_part(r1.contents, '|', 1),   --ifi32_send_date 
					split_part(r1.contents, '|', 2),   --ifi32_am_corp_cd 
					split_part(r1.contents, '|', 3),   --ifi32_am_corp_nm 
					split_part(r1.contents, '|', 4),   --ifi32_std_date 
					split_part(r1.contents, '|', 5),   --ifi32_fund_cd 
					split_part(r1.contents, '|', 6),   --ifi32_fund_nm 
					split_part(r1.contents, '|', 7),   --ifi32_multi_class_func_cd , Multi Class
					split_part(r1.contents, '|', 8),   --ifi32_cur_cd 
					to_number(split_part(r1.contents, '|', 9),'999999999999999.99999999'),   --ifi32_set_qty 
					to_number(split_part(r1.contents, '|', 10),'999999999999999.99999999'),   --ifi32_set_amt
					to_number(split_part(r1.contents, '|', 11),'999999999999999.99999999'),   --ifi32_principal
					to_number(split_part(r1.contents, '|', 12),'999999999999999.99999999'),   --ifi32_nav 
					to_number(split_part(r1.contents, '|', 13),'999999999999999.99999999'),   --ifi32_total_asset 
					to_number(split_part(r1.contents, '|', 14),'999999999999999.99999999'),   --ifi32_price 
					to_number(split_part(r1.contents, '|', 15),'999999999999999.99999999') ,  --ifi32_tax_price
					current_timestamp 
				);
	
			elsif r0.file_name_part2='adv.txt' then
				insert into  ifi33_adv
				(
					ifi33_adv_id ,
					ifi33_if_cd ,
					ifi33_send_date ,
					ifi33_am_corp_cd ,
					ifi33_am_corp_nm ,
					ifi33_manage_cd ,
					ifi33_manage_nm ,
					ifi33_tr_corp_cd ,
					ifi33_tr_corp_nm ,
					ifi33_account_no ,
					ifi33_first_set_date ,
					ifi33_end_date ,
					ifi33_work_date
				)
				values
				(
					f_create_batchseq() ,
					w_if_cd ,
					r0.file_name_send_date ,
					-- split_part(r1.contents, '|', 1),   --ifi33_send_date 
					split_part(r1.contents, '|', 2),   --ifi33_am_corp_cd 
					split_part(r1.contents, '|', 3),   --ifi33_am_corp_nm 
					split_part(r1.contents, '|', 4),   --ifi33_manage_cd 
					split_part(r1.contents, '|', 5),   --ifi33_manage_nm 
					split_part(r1.contents, '|', 6),   --ifi33_tr_corp_cd 
					split_part(r1.contents, '|', 7),   --ifi33_tr_corp_nm 
					split_part(r1.contents, '|', 8),   --ifi33_account_no 
					split_part(r1.contents, '|', 9),   --ifi33_first_set_date
					split_part(r1.contents, '|', 10),   --ifi33_end_date 
					current_timestamp
				);
	
			elsif r0.file_name_part2='equity.txt' then
				insert into  ifi34_stk
				(
					ifi34_stk_id ,
					ifi34_if_cd ,
					ifi34_send_date ,
					ifi34_am_corp_cd ,
					ifi34_am_corp_nm ,
					ifi34_std_date ,
					ifi34_item_cd ,
					ifi34_item_nm ,
					ifi34_hold_qty ,
					ifi34_eval_amt ,
					ifi34_work_date
				)
				values
				(
					f_create_batchseq() ,
					w_if_cd ,
					r0.file_name_send_date ,
					-- split_part(r1.contents, '|', 1),   --ifi34_send_date 
					split_part(r1.contents, '|', 2),   --ifi34_am_corp_cd 
					split_part(r1.contents, '|', 3),   --ifi34_am_corp_nm 
					split_part(r1.contents, '|', 4),   --ifi34_std_date 
					split_part(r1.contents, '|', 5),   --ifi34_item_cd 
					split_part(r1.contents, '|', 6),   --ifi34_item_nm 
					to_number(split_part(r1.contents, '|', 7),'999999999999999.99999999'),   --ifi34_hold_qty 
					to_number(split_part(r1.contents, '|', 8),'999999999999999.99999999'),   --ifi34_eval_amt 
					current_timestamp
				);
			end if;


		end loop;
		
	end loop;


	return 'Y';

END;
$function$
```
