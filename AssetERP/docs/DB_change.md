# db  변경

## 개요

변환 작업 중 변경된 db 내용들


## flt16_except_person

```sql
-- public.flt16_except_person definition

-- Drop table

-- DROP TABLE public.flt16_except_person;

CREATE TABLE public.flt16_except_person (
	flt16_except_person_id numeric NOT NULL,
	flt16_company_id numeric NULL,
	flt16_person_id numeric NULL,
	flt16_rpt_start_date date NULL,
	flt16_reason text NULL,
	CONSTRAINT flt16_except_person_pkey PRIMARY KEY (flt16_except_person_id)
);
CREATE INDEX flt16_except_person_idx01 ON public.flt16_except_person USING btree (flt16_company_id, flt16_person_id);
CREATE INDEX flt16_except_person_idx02 ON public.flt16_except_person USING btree (flt16_person_id);

-- Table Triggers
-- DROP FUNCTION public.flt16_except_person_backup();

CREATE OR REPLACE FUNCTION public.flt16_except_person_backup()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$ 
BEGIN
INSERT INTO fltbak16_except_person
SELECT f_create_batchseq()
     , TG_OP
     , current_setting('app.current_user', true)
     , now()
     , CASE WHEN TG_OP = 'DELETE' THEN OLD.flt16_except_person_id ELSE NEW.flt16_except_person_id END
     , CASE WHEN TG_OP = 'DELETE' THEN OLD.flt16_company_id ELSE NEW.flt16_company_id END
     , CASE WHEN TG_OP = 'DELETE' THEN OLD.flt16_person_id ELSE NEW.flt16_person_id END
     , CASE WHEN TG_OP = 'DELETE' THEN OLD.flt16_rpt_start_date ELSE NEW.flt16_rpt_start_date END
     , CASE WHEN TG_OP = 'DELETE' THEN OLD.flt16_reason ELSE NEW.flt16_reason END
     ;
 
RETURN NULL;
EXCEPTION WHEN OTHERS THEN RETURN NULL;
END;
$function$
;

create trigger trigger_aft_flt16_except_person after
insert
    or
delete
    or
update
    on
    public.flt16_except_person for each row execute function flt16_except_person_backup();
```    