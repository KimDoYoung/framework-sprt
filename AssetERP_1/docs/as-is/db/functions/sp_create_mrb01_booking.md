# sp_create_mrb01_booking

## PROCEDURE public.sp_create_mrb01_booking(IN p_type character varying, IN p_booking_id numeric, IN p_company_id numeric, IN p_emp_id numeric, IN p_subject character varying, IN p_room_cd character varying, IN p_booking_dt timestamp without time zone, IN p_start_hour character varying, IN p_start_min character varying, IN p_close_hour character varying, IN p_close_min character varying, IN p_attendance character varying, IN p_forwarding character varying, IN p_parent_id numeric, IN p_resrv_start_dt timestamp without time zone, IN p_resrv_close_dt timestamp without time zone, IN p_repeat_type character varying, IN p_months character varying, IN p_week_cnt character varying, IN p_day_of_week character varying, IN p_resrv_workday character varying, INOUT p_msg character varying)

- 반환: `-`
- 줄 수: 161

```sql
CREATE OR REPLACE PROCEDURE public.sp_create_mrb01_booking(IN p_type character varying, IN p_booking_id numeric, IN p_company_id numeric, IN p_emp_id numeric, IN p_subject character varying, IN p_room_cd character varying, IN p_booking_dt timestamp without time zone, IN p_start_hour character varying, IN p_start_min character varying, IN p_close_hour character varying, IN p_close_min character varying, IN p_attendance character varying, IN p_forwarding character varying, IN p_parent_id numeric, IN p_resrv_start_dt timestamp without time zone, IN p_resrv_close_dt timestamp without time zone, IN p_repeat_type character varying, IN p_months character varying, IN p_week_cnt character varying, IN p_day_of_week character varying, IN p_resrv_workday character varying, INOUT p_msg character varying)
 LANGUAGE plpgsql
AS $procedure$
DECLARE
	w_msg				varchar(200)	:=	'';
	w_week_cnt			numeric			:=	cast(p_week_cnt as numeric);
	w_day_of_week		numeric			:=	cast(p_day_of_week as numeric);
	w_resrv_workday		numeric			:=	cast(p_resrv_workday as numeric);
	r1 record;
BEGIN

	if		p_repeat_type	=	'1'	then	--	매일:p_repeat_type															공휴일전후:p_resrv_workday(공휴일이면 빠질것.)
		begin
			for	r1	in	(	select	find_day																						as	booking_dt
								,	to_date(to_char(trunc(find_day),'YYYY-MM-DD')||' '||p_start_hour||':'||p_start_min||':'||'01','YYYY-MM-DD HH24:MI:SS')	as	start_time
								,	to_date(to_char(trunc(find_day),'YYYY-MM-DD')||' '||p_close_hour||':'||p_close_min||':'||'00','YYYY-MM-DD HH24:MI:SS')	as	close_time
							from	(	
										select	sys12_day	as	find_day
										from	sys12_calendar
										where	sys12_day	between	p_resrv_start_dt and p_resrv_close_dt
										and		sys12_working_yn	=	'true'
									)a
			)	loop
				begin
					select	f_mrb01_booking_check(p_room_cd,r1.booking_dt,r1.start_time,r1.close_time)	into	w_msg	from	dual;

					exit	when	w_msg	<>	'0';
					
					begin
						insert into mrb01_booking	(	mrb01_booking_id			,	mrb01_company_id			,	mrb01_emp_id
													,	mrb01_subject				,	mrb01_room_cd				,	mrb01_booking_dt
													,	mrb01_start_hour			,	mrb01_start_min				,	mrb01_close_hour
													,	mrb01_close_min				,	mrb01_attendance			,	mrb01_forwarding
													,	mrb01_parent_id				,	mrb01_resrv_start_dt		,	mrb01_resrv_close_dt
													,	mrb01_repeat_type			,	mrb01_months
													,	mrb01_week_cnt				,	mrb01_day_of_week			,	mrb01_resrv_workday
													)	
											values	(	temp_seq.nextval			,	p_company_id				,	p_emp_id
													,	p_subject					,	p_room_cd					,	r1.booking_dt
													,	p_start_hour				,	p_start_min					,	p_close_hour
													,	p_close_min					,	p_attendance				,	p_forwarding
													,	p_parent_id       			,	p_resrv_start_dt			,	p_resrv_close_dt
													,	p_repeat_type    			,	to_char(trunc(r1.booking_dt),'MM')
													,	p_week_cnt 					,	p_day_of_week				,	p_resrv_workday
													);
					exception	when	others	then
						w_msg	:=	w_msg||'-'||'insert errors : '||p_room_cd||' '||r1.booking_dt||' '||to_char(r1.start_time,'YYYY-MM-DD HH24:MI:SS')||' '||to_char(r1.close_time,'YYYY-MM-DD HH24:MI:SS')||'~r~n이미 등록된 예약이 있습니다.';
						exit;
					end;
				exception	when	no_data_found	then
					w_msg	:=	w_msg||'-'||'select into errors : '||w_msg||p_room_cd||' '||r1.booking_dt||' '||to_char(r1.start_time,'YYYY-MM-DD HH24:MI:SS')||' '||to_char(r1.close_time,'YYYY-MM-DD HH24:MI:SS')||'~r~n이미 등록된 예약이 있습니다.';
					exit;
				end;
			end	loop;
		end;
	elsif	p_repeat_type	=	'2'	then	--	매주:p_repeat_type						무슨요일:p_day_of_week				공휴일전후:p_resrv_workday
		begin
			for	r1	in	(	select	find_day																						as	booking_dt
								,	to_date(to_char(trunc(find_day),'YYYY-MM-DD')||' '||p_start_hour||':'||p_start_min||':'||'01','YYYY-MM-DD HH24:MI:SS')	as	start_time
								,	to_date(to_char(trunc(find_day),'YYYY-MM-DD')||' '||p_close_hour||':'||p_close_min||':'||'00','YYYY-MM-DD HH24:MI:SS')	as	close_time
							from	(	
										select	f_workday(trunc(sys12_day),w_resrv_workday)	find_day
										from	sys12_calendar
										where	sys12_day	between	p_resrv_start_dt and p_resrv_close_dt
										and		sys12_weekday	=	case	p_day_of_week	when	0	then	'일요일'
																							when	1	then	'월요일'
																							when	2	then	'화요일'
																							when	3	then	'수요일'
																							when	4	then	'목요일'
																							when	5	then	'금요일'
																							when	6	then	'토요일'
																	end
--										and		sys12_working_yn	=	'true'
									)a
			)	loop
				begin
					select	f_mrb01_booking_check(p_room_cd,r1.booking_dt,r1.start_time,r1.close_time)	into	w_msg	from	dual;

					exit	when	w_msg	<>	'0';
					
					begin
						insert into mrb01_booking	(	mrb01_booking_id			,	mrb01_company_id			,	mrb01_emp_id
													,	mrb01_subject				,	mrb01_room_cd				,	mrb01_booking_dt
													,	mrb01_start_hour			,	mrb01_start_min				,	mrb01_close_hour			,	mrb01_close_min				,	mrb01_attendance
													,	mrb01_forwarding			,	mrb01_parent_id				,	mrb01_resrv_start_dt
													,	mrb01_resrv_close_dt		,	mrb01_repeat_type			,	mrb01_months
													,	mrb01_week_cnt				,	mrb01_day_of_week			,	mrb01_resrv_workday
													)	
											values	(	temp_seq.nextval			,	p_company_id				,	p_emp_id
													,	p_subject					,	p_room_cd					,	r1.booking_dt
													,	p_start_hour				,	p_start_min					,	p_close_hour				,	p_close_min					,	p_attendance
													,	p_forwarding     			,	p_parent_id       			,	p_resrv_start_dt
													,	p_resrv_close_dt			,	p_repeat_type    			,	to_char(trunc(r1.booking_dt),'MM')
													,	p_week_cnt 					,	p_day_of_week				,	p_resrv_workday
													);
					exception	when	others	then
						w_msg	:=	w_msg||'-'||'insert errors : '||p_room_cd||' '||r1.booking_dt||' '||to_char(r1.start_time,'YYYY-MM-DD HH24:MI:SS')||' '||to_char(r1.close_time,'YYYY-MM-DD HH24:MI:SS')||'~r~n이미 등록된 예약이 있습니다.';
						exit;
					end;
				exception	when	no_data_found	then
					w_msg	:=	w_msg||'-'||'select into errors : '||w_msg||p_room_cd||' '||r1.booking_dt||' '||to_char(r1.start_time,'YYYY-MM-DD HH24:MI:SS')||' '||to_char(r1.close_time,'YYYY-MM-DD HH24:MI:SS')||'~r~n이미 등록된 예약이 있습니다.';
					exit;
				end;
			end	loop;
		end;
	elsif	p_repeat_type	=	'3'	then	--	매월:p_repeat_type	몇째주:p_week_cnt	무슨요일:p_day_of_week				공휴일전후:p_resrv_workday
											--	분기:p_repeat_type												몇일:		공휴일전후:p_resrv_workday	->	X
		begin
			for	r1	in	(	select	find_day																													as	booking_dt
								,	to_date(to_char(trunc(find_day),'YYYY-MM-DD')||' '||p_start_hour||':'||p_start_min||':'||'01','YYYY-MM-DD HH24:MI:SS')		as	start_time
								,	to_date(to_char(trunc(find_day),'YYYY-MM-DD')||' '||p_close_hour||':'||p_close_min||':'||'00','YYYY-MM-DD HH24:MI:SS')		as	close_time
--								,	to_date(to_char(trunc(find_day),'YYYYMMDD')||p_resrv_start_time,'YYYYMMDDHH24MI')											as	start_time
--								,	to_date(to_char(trunc(find_day),'YYYYMMDD')||p_resrv_close_time,'YYYYMMDDHH24MI')											as	close_time
							from	(	SELECT	everyday																										as	to_day		--	"매월 ?날"
											,	f_workday(everyday,w_resrv_workday)																				as	first_date	--	"매월 ?번째 일하는 날"
--											,	f_workday(everyday	+	((w_week_cnt - 1) * 7)	+	(w_day_of_week - TO_CHAR(everyday, 'D')),w_resrv_workday)	as	find_day	--	"매월 ?번째 금요일"
											,	f_workday(next_day((trunc(everyday)-1),w_day_of_week)	+	((w_week_cnt - 1) * 7),w_resrv_workday)				as	find_day
										FROM	(
													select	distinct f_trunc(sys12_day,'month')	everyday
													from	sys12_calendar
													where	sys12_day	between	p_resrv_start_dt and p_resrv_close_dt
												)a
									)b
			)	loop
				begin
					select	f_mrb01_booking_check(p_room_cd,r1.booking_dt,r1.start_time,r1.close_time)	into	w_msg	from	dual;

					exit	when	w_msg	<>	'0';
						begin
							insert into mrb01_booking	(	mrb01_booking_id			,	mrb01_company_id			,	mrb01_emp_id
														,	mrb01_subject				,	mrb01_room_cd				,	mrb01_booking_dt
														,	mrb01_start_hour			,	mrb01_start_min				,	mrb01_close_hour
														,	mrb01_close_min				,	mrb01_attendance			,	mrb01_forwarding
														,	mrb01_parent_id				,	mrb01_resrv_start_dt		,	mrb01_resrv_close_dt
														,	mrb01_repeat_type			,	mrb01_months
														,	mrb01_week_cnt				,	mrb01_day_of_week			,	mrb01_resrv_workday
														)
												values	(	temp_seq.nextval			,	p_company_id				,	p_emp_id
														,	p_subject					,	p_room_cd					,	r1.booking_dt
														,	p_start_hour				,	p_start_min					,	p_close_hour
														,	p_close_min					,	p_attendance				,	p_forwarding
														,	p_parent_id       			,	p_resrv_start_dt			,	p_resrv_close_dt
														,	p_repeat_type    			,	to_char(trunc(r1.booking_dt),'MM')
														,	p_week_cnt 					,	p_day_of_week				,	p_resrv_workday
														);
						exception	when	others	then
							w_msg	:=	w_msg||'-'||'insert errors : '||p_room_cd||' '||r1.booking_dt||' '||to_char(r1.start_time,'YYYY-MM-DD HH24:MI:SS')||' '||to_char(r1.close_time,'YYYY-MM-DD HH24:MI:SS')||'~r~n이미 등록된 예약이 있습니다.';
							exit;
						end;
				exception	when	others	then
					w_msg	:=	w_msg||'-'||'select into errors : '||w_msg||p_room_cd||' '||r1.booking_dt||' '||to_char(r1.start_time,'YYYY-MM-DD HH24:MI:SS')||' '||to_char(r1.close_time,'YYYY-MM-DD HH24:MI:SS')||'~r~n이미 등록된 예약이 있습니다.';
					exit;
				end;
			end	loop;
		end;

	end	if;
	p_msg	:=	w_msg;
END$procedure$
```
