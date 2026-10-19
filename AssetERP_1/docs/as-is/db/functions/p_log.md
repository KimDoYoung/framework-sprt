# p_log

## PROCEDURE public.p_log(IN p_job_tp character varying, IN p_str character varying)

- 반환: `-`
- 줄 수: 54

```sql
CREATE OR REPLACE PROCEDURE public.p_log(IN p_job_tp character varying, IN p_str character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
	w_ymd  VARCHAR(8);
BEGIN

	-- w_ymd :=  to_char( now(),'yyyymmdd')  ;


 
	if p_job_tp = 'kdj' then
		delete from sys99_print where sys99_print_id = 0 and sys99_string01 = p_job_tp;
	
		insert into  sys99_print (sys99_print_id, sys99_string01, sys99_text01 ) values(0, p_job_tp, p_str );

		COPY (SELECT sys99_text01 from  sys99_print where sys99_print_id = 0 and sys99_string01 = 'kdj'  ) TO PROGRAM 'cat >> /data1/postgresql/log_psql/kdj.log' ;

	elsif p_job_tp = 'cyy' then		
		delete from sys99_print where sys99_print_id = 1 and sys99_string01 = p_job_tp;
	
		insert into  sys99_print (sys99_print_id, sys99_string01, sys99_text01 ) values(1, p_job_tp, p_str );
		COPY (SELECT '['||f_sysdate()||']'|| sys99_text01 from  sys99_print where sys99_print_id = 1 and sys99_string01 = 'cyy'  ) TO PROGRAM 'cat >> /data1/postgresql/log_psql/cyy.log' ;

	elsif p_job_tp = 'jsh' then		
		delete from sys99_print where sys99_print_id = 3 and sys99_string01 = p_job_tp;
	
		insert into  sys99_print (sys99_print_id, sys99_string01, sys99_text01 ) values(3, p_job_tp, p_str );
		COPY (SELECT sys99_text01 from  sys99_print where sys99_print_id = 3 and sys99_string01 = 'jsh'  ) TO PROGRAM 'cat >> /data1/postgresql/log_psql/jsh.log' ;

	elsif p_job_tp = 'pjm' then		
		delete from sys99_print where sys99_print_id = 4 and sys99_string01 = p_job_tp;
	
		insert into  sys99_print (sys99_print_id, sys99_string01, sys99_text01 ) values(4, p_job_tp, p_str );
		COPY (SELECT sys99_text01 from  sys99_print where sys99_print_id = 4 and sys99_string01 = 'pjm'  ) TO PROGRAM 'cat >> /data1/postgresql/log_psql/pjm.log' ;

	else
		RAISE EXCEPTION '정의되지 않은 작업입니다 ' USING ERRCODE = '290001';
	end if;
 

/*		
		delete from tmp_log where tmp_id = 'kdj';
		
		insert into  tmp_log (tmp_id, tmp_str ) values('kdj', p_str ); 
		
		COPY (SELECT tmp_str from  tmp_log where tmp_id = 'kdj'  ) TO PROGRAM 'cat >> /tmp/qaz' ;
*/


END;
$procedure$
```
