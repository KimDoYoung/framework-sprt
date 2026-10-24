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


-- sch22_write_group  변경
ALTER TABLE sch22_write_group 
ADD COLUMN sch22_confirmer_id numeric NULL;
```    

---

```sql
  ALTER TABLE tdm54_chck_insuff ADD COLUMN tdm54_occ_ym         VARCHAR(7);
  ALTER TABLE tdm54_chck_insuff ADD COLUMN tdm54_action_appr_ym VARCHAR(7);

  COMMENT ON COLUMN tdm54_chck_insuff.tdm54_occ_ym         IS '미흡 발생년월(YYYY.MM)';
  COMMENT ON COLUMN tdm54_chck_insuff.tdm54_action_appr_ym IS '조치 승인년월(YYYY.MM)';

  -- (선택) 기존 행의 발생년월 채우기: 원 이행점검이 속한 점검년월
  UPDATE tdm54_chck_insuff i
     SET tdm54_occ_ym = ( SELECT o.tdm51_check_ym
                            FROM tdm52_chck_manl m
                                 INNER JOIN tdm51_chck_org o ON o.tdm51_chck_org_id =
  m.tdm52_chck_org_id
                           WHERE m.tdm52_chck_manl_id = i.tdm54_chck_manl_id )
   WHERE tdm54_occ_ym IS NULL;
```