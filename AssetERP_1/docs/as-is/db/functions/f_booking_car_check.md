# f_booking_car_check

## FUNCTION public.f_booking_car_check(p_booking_id numeric, p_info_id numeric, p_start_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying)

- 반환: `character varying`
- 줄 수: 48

```sql
CREATE OR REPLACE FUNCTION public.f_booking_car_check(p_booking_id numeric, p_info_id numeric, p_start_dt timestamp without time zone, p_start_hour character varying, p_start_min character varying, p_close_hour character varying, p_close_min character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE 
	w_start_hour	car03_booking.car03_start_hour%type;
	w_start_min	car03_booking.car03_start_min%type;
	w_close_hour	car03_booking.car03_close_hour%type;
	w_close_min	car03_booking.car03_close_min%type;

	w_booking_id	numeric	:=	0;
	w_start_time	timestamp	:=	to_timestamp(to_char(p_start_dt,'YYYYMMDD')||p_start_hour||p_start_min||'01','YYYYMMDDHH24MISS');
	w_close_time	timestamp	:=	to_timestamp(to_char(p_start_dt,'YYYYMMDD')||p_close_hour||p_close_min||'00','YYYYMMDDHH24MISS');
	v_count integer;
begin
begin

		select	car03_booking_id
			,	car03_start_hour
			,	car03_start_min
			,	car03_close_hour
			,	car03_close_min
		into 	strict	w_booking_id
			,	w_start_hour
			,	w_start_min
			,	w_close_hour
			,	w_close_min
		from	car03_booking
			inner join car01_info on car01_info_id = car03_info_id
		where	car03_info_id		=	p_info_id
		and	car03_start_date	=	p_start_dt
		and	(((	to_timestamp(to_char(car03_start_date,'YYYYMMDD')||car03_start_hour||car03_start_min||'01','YYYYMMDDHH24MISS')	between	w_start_time	and	w_close_time	)
		or	 (	to_timestamp(to_char(car03_start_date,'YYYYMMDD')||car03_close_hour||car03_close_min||'00','YYYYMMDDHH24MISS')	between	w_start_time	and	w_close_time	))
		or	(	to_timestamp(to_char(car03_start_date,'YYYYMMDD')||car03_start_hour||car03_start_min||'01','YYYYMMDDHH24MISS')	<	w_start_time
		and		to_timestamp(to_char(car03_start_date,'YYYYMMDD')||car03_close_hour||car03_close_min||'00','YYYYMMDDHH24MISS')	>	w_close_time	))
		and		car03_booking_id	<>	p_booking_id
		LIMIT 1;

	exception	when	NO_DATA_FOUND	then
		return	'0'; 
	end;
	
	return	'이미 등록된 예약 ('||w_start_hour||':'||w_start_min||' ~ '||w_close_hour||':'||w_close_min||') 이 있습니다.';

end;
$function$
```
