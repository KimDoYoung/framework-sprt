# 테이블: msc

1개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `msc01_schedule` |  | 14 |

## DBML

```dbml
Table "public"."msc01_schedule" {
  "msc01_schedule_id" "numeric" [pk]
  "msc01_company_id" "numeric" [not null]
  "msc01_org_code_id" "numeric" [not null]
  "msc01_level_cd" "character varying(10)" [not null]
  "msc01_person_id" "numeric" [not null]
  "msc01_schedule_dt" "timestamp without time zone"
  "msc01_start_hour" "character varying(2)"
  "msc01_start_min" "character varying(2)"
  "msc01_close_hour" "character varying(2)"
  "msc01_close_min" "character varying(2)"
  "msc01_place" "character varying(200)"
  "msc01_attendance" "character varying(200)"
  "msc01_content" "character varying(1000)"
  "msc01_note" "character varying(1000)"
}

```
