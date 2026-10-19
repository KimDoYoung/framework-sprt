# 테이블: mrb

1개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `mrb01_booking` | 회의실 예약관리 | 14 |

## DBML

```dbml
Table "public"."mrb01_booking" {
  "mrb01_booking_id" "numeric" [pk, note: '회의실 예약관리 ID']
  "mrb01_company_id" "numeric" [not null, note: '회사 ID']
  "mrb01_emp_id" "numeric" [not null, note: '등록자 ID']
  "mrb01_subject" "character varying(100)" [note: '제목(주제)']
  "mrb01_room_cd" "character varying(10)" [note: 'Room Code']
  "mrb01_booking_dt" "timestamp without time zone" [note: '예약일']
  "mrb01_start_hour" "character varying(2)" [note: '시작(시)']
  "mrb01_start_min" "character varying(2)" [note: '시작(분)']
  "mrb01_close_hour" "character varying(2)" [note: '종료(시)']
  "mrb01_close_min" "character varying(2)" [note: '종료(분)']
  "mrb01_attendance" "character varying(100)" [note: '참석자']
  "mrb01_forwarding" "character varying(400)" [note: '전달사항']
  "mrb01_parent_id" "numeric" [note: 'parentId']
  "mrb01_booking_close_dt" "timestamp without time zone" [note: '예약종료일자']

  Note: '회의실 예약관리'
}

```
