# f_booking_check1

## FUNCTION public.f_booking_check1(p_booking_id numeric, p_room_cd character varying, p_booking_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying, p_company_id numeric)

- 반환: `character varying`
- 줄 수: 48

```sql
CREATE OR REPLACE FUNCTION public.f_booking_check1(p_booking_id numeric, p_room_cd character varying, p_booking_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying, p_company_id numeric)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE 
	w_start_hour	mrb01_booking.mrb01_start_hour%type;
	w_start_min		mrb01_booking.mrb01_start_min%type;
	w_close_hour	mrb01_booking.mrb01_close_hour%type;
	w_close_min		mrb01_booking.mrb01_close_min%type;

	w_booking_id	numeric	:=	0;
	w_start_time	timestamp	:=	to_timestamp(to_char(p_booking_dt,'YYYYMMDD')||p_start_hour||p_start_min||'01','YYYYMMDDHH24MISS');
	w_close_time	timestamp	:=	to_timestamp(to_char(p_booking_dt,'YYYYMMDD')||p_close_hour||p_close_min||'00','YYYYMMDDHH24MISS');
	v_count integer;
begin
begin

		select	mrb01_booking_id
			,	mrb01_start_hour
			,	mrb01_start_min
			,	mrb01_close_hour
			,	mrb01_close_min
		into 	strict	w_booking_id
			,	w_start_hour
			,	w_start_min
			,	w_close_hour
			,	w_close_min
		from	mrb01_booking
		where	mrb01_room_cd		=	p_room_cd
		and		mrb01_company_id	=	p_company_id
		and		mrb01_booking_dt	=	p_booking_dt
		and	(((	to_timestamp(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_start_hour||mrb01_start_min||'01','YYYYMMDDHH24MISS')	between	w_start_time	and	w_close_time	)
		or	 (	to_timestamp(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_close_hour||mrb01_close_min||'00','YYYYMMDDHH24MISS')	between	w_start_time	and	w_close_time	))
		or	(	to_timestamp(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_start_hour||mrb01_start_min||'01','YYYYMMDDHH24MISS')	<	w_start_time
		and		to_timestamp(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_close_hour||mrb01_close_min||'00','YYYYMMDDHH24MISS')	>	w_close_time	))
		and		mrb01_booking_id	<>	p_booking_id
		LIMIT 1;

	exception	when	NO_DATA_FOUND	then
		return	'0'; 
	end;
	
	return	'이미 등록된 예약 ('||w_start_hour||':'||w_start_min||' ~ '||w_close_hour||':'||w_close_min||') 이 있습니다.';

end;
$function$
```

## FUNCTION public.f_booking_check1(p_room_cd character varying, p_booking_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying)

- 반환: `character varying`
- 줄 수: 41

```sql
CREATE OR REPLACE FUNCTION public.f_booking_check1(p_room_cd character varying, p_booking_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$ DECLARE 
	w_start_hour	mrb01_booking.mrb01_start_hour%type;
	w_start_min		mrb01_booking.mrb01_start_min%type;
	w_close_hour	mrb01_booking.mrb01_close_hour%type;
	w_close_min		mrb01_booking.mrb01_close_min%type;

	w_booking_id	numeric	:=	0;
	w_start_time	timestamp	:=	to_date(to_char(p_booking_dt,'YYYYMMDD')||p_start_hour||p_start_min||'01','YYYYMMDDHH24MISS');
	w_close_time	timestamp	:=	to_date(to_char(p_booking_dt,'YYYYMMDD')||p_close_hour||p_close_min||'00','YYYYMMDDHH24MISS');
begin
	begin
		select	mrb01_booking_id
			,	mrb01_start_hour
			,	mrb01_start_min
			,	mrb01_close_hour
			,	mrb01_close_min
		into	w_booking_id
			,	w_start_hour
			,	w_start_min
			,	w_close_hour
			,	w_close_min
		from	mrb01_booking
		where	mrb01_room_cd		=	p_room_cd
		and		mrb01_booking_dt	=	p_booking_dt
		and	(((	to_date(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_start_hour||mrb01_start_min||'01','YYYYMMDDHH24MISS')	between	w_start_time	and	w_close_time	)
		or	 (	to_date(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_close_hour||mrb01_close_min||'00','YYYYMMDDHH24MISS')	between	w_start_time	and	w_close_time	))
		or	(	to_date(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_start_hour||mrb01_start_min||'01','YYYYMMDDHH24MISS')	<	w_start_time
		and		to_date(to_char(mrb01_booking_dt,'YYYYMMDD')||mrb01_close_hour||mrb01_close_min||'00','YYYYMMDDHH24MISS')	>	w_close_time	));

	exception	when	NO_DATA_FOUND	then
		return	'0'; 
	end;
	
	return	'회의실코드['||p_room_cd||']에 이미 등록된 예약('||to_char(p_booking_dt,'YYYY-MM-DD')||' '||w_start_hour||':'||w_start_min||' ~ '||w_close_hour||':'||w_close_min||')이 있습니다. 확인후 다시 예약등록하세요.';

end;$function$
```
