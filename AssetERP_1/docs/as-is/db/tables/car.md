# 테이블: car

5개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `car01_info` | 차량정보관리 | 8 |
| `car02_user` | 전용차량 사용자관리 | 5 |
| `car03_booking` | 공용차량 예약관리 | 15 |
| `car04_journal` | 차량운행일지 | 17 |
| `car05_relate_appr` | 상신 연관 차량일지 | 5 |

## DBML

```dbml
Table "public"."car01_info" {
  "car01_info_id" "numeric" [pk, note: '차량정보관리ID(PK)']
  "car01_company_id" "numeric" [note: '회사ID']
  "car01_car_type" "character varying(1)" [note: '차량구분(1:전용차량 / 2:공용차량)']
  "car01_car_no" "character varying(50)" [note: '차량번호']
  "car01_car_nm" "character varying(100)" [note: '차량명']
  "car01_car_info" "character varying(200)" [note: '차량정보']
  "car01_note" "character varying(200)" [note: '비고']
  "car01_init_mileage" "numeric" [note: '초기설정 주행거리(km)']

  indexes {
    (car01_company_id, car01_car_type) [name: 'car01_info_idx01']
  }

  Note: '차량정보관리'
}

Table "public"."car02_user" {
  "car02_user_id" "numeric" [pk, note: '전용차량 사용자관리ID(PK)']
  "car02_info_id" "numeric" [note: '차량정보ID(car01_info_id)']
  "car02_person_id" "numeric" [note: '사용자ID']
  "car02_start_date" "date" [note: '사용시작일']
  "car02_close_date" "date" [note: '사용종료일']

  indexes {
    (car02_info_id) [name: 'car02_user_idx01']
  }

  Note: '전용차량 사용자관리'
}

Table "public"."car03_booking" {
  "car03_booking_id" "numeric" [pk, note: '공용차량 예약관리ID(PK)']
  "car03_info_id" "numeric" [note: '차량정보ID(car01_info_id)']
  "car03_person_id" "numeric" [note: '사용자ID']
  "car03_start_date" "date" [note: '예약시작일']
  "car03_start_hour" "character varying(2)" [note: '예약시작(시)']
  "car03_start_min" "character varying(2)" [note: '예약시작(분)']
  "car03_close_date" "date" [note: '예약종료일']
  "car03_close_hour" "character varying(2)" [note: '예약종료(시)']
  "car03_close_min" "character varying(2)" [note: '예약종료(분)']
  "car03_destination" "character varying(100)" [note: '행선지']
  "car03_reason" "character varying(200)" [note: '사유, 목적']
  "car03_attendance" "character varying(100)" [note: '참석자']
  "car03_note" "character varying(200)" [note: '비고']
  "car03_parent_id" "numeric" [note: '상위ID']
  "car03_reg_emp_id" "numeric" [note: '등록자ID']

  indexes {
    (car03_info_id) [name: 'car03_booking_idx01']
  }

  Note: '공용차량 예약관리'
}

Table "public"."car04_journal" {
  "car04_journal_id" "numeric" [pk, note: '차량운행일지ID(PK)']
  "car04_company_id" "numeric" [note: '회사ID']
  "car04_info_id" "numeric" [note: '차량정보ID(car01_info_id)']
  "car04_date" "date" [note: '사용일자']
  "car04_person_id" "numeric" [note: '작성자ID']
  "car04_mileage" "numeric" [note: '주행거리(km)']
  "car04_before_mileage" "numeric" [note: '주행전 주행거리(km)']
  "car04_after_mileage" "numeric" [note: '주행후 주행거리(km)']
  "car04_commute_mileage" "numeric" [note: '출퇴근용 주행거리(km)']
  "car04_biz_mileage" "numeric" [note: '일반업무용 주행거리(km)']
  "car04_un_biz_mileage" "numeric" [note: '비업무용 사용거리(km)']
  "car04_destination" "character varying(100)" [note: '행선지']
  "car04_reason" "character varying(200)" [note: '사유, 목적']
  "car04_note" "character varying(200)" [note: '비고']
  "car04_booking_id" "numeric" [note: '공용차량 예약ID(car03_booking_id)']
  "car04_fix_yn" "character varying(5)" [note: '확정여부']
  "car04_close_yn" "character varying(5)" [note: '마감여부']

  indexes {
    (car04_company_id, car04_date) [name: 'car04_journal_idx01']
    (car04_company_id, car04_date, car04_info_id) [name: 'car04_journal_idx02']
    (car04_info_id) [name: 'car04_journal_idx03']
  }

  Note: '차량운행일지'
}

Table "public"."car05_relate_appr" {
  "car05_relate_appr_id" "numeric" [pk, note: '상신 연관 차량일지ID(PK)']
  "car05_company_id" "numeric" [note: '회사ID']
  "car05_yyyymm" "character varying(7)" [note: '사용년월']
  "car05_appr_id" "numeric" [note: '상신ID']
  "car05_info_id" "numeric" [note: '차량정보관리']

  indexes {
    (car05_company_id, car05_yyyymm) [name: 'car05_relate_appr_idx01']
  }

  Note: '상신 연관 차량일지'
}

```
