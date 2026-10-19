# 테이블: pcd

1개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `pcd01_pickup` |  | 20 |

## DBML

```dbml
Table "public"."pcd01_pickup" {
  "pcd01_pickup_id" "numeric" [pk]
  "pcd01_company_id" "numeric" [not null]
  "pcd01_emp_id" "numeric" [not null]
  "pcd01_subject" "character varying(100)"
  "pcd01_car_cd" "character varying(10)"
  "pcd01_pickup_dt" "timestamp without time zone"
  "pcd01_start_hour" "character varying(2)"
  "pcd01_start_min" "character varying(2)"
  "pcd01_close_hour" "character varying(2)"
  "pcd01_close_min" "character varying(2)"
  "pcd01_attendance" "character varying(100)"
  "pcd01_forwarding" "character varying(400)"
  "pcd01_parent_id" "numeric"
  "pcd01_resrv_start_dt" "timestamp without time zone"
  "pcd01_resrv_close_dt" "timestamp without time zone"
  "pcd01_repeat_type" "character varying(10)"
  "pcd01_months" "character varying(10)"
  "pcd01_week_cnt" "character varying(10)"
  "pcd01_day_of_week" "character varying(10)"
  "pcd01_resrv_workday" "character varying(10)"
}

```
