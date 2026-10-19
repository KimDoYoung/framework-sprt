# 테이블: sms

4개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `sms02_history` | SMS발신기록 | 5 |
| `sms03_group_send` | 단체문자 | 7 |
| `sms04_group_send_history` | 단체문자 SMS발신기록 | 8 |
| `sms10_alarm_history` | 알림기록 | 6 |

## DBML

```dbml
Table "public"."sms02_history" {
  "sms02_history_id" "numeric" [pk, note: 'SMS발신기록ID']
  "sms02_company_id" "numeric" [not null, note: '회사ID']
  "sms02_send_date" "timestamp without time zone" [not null, default: `CURRENT_TIMESTAMP`, note: '보낸날짜']
  "sms02_content" "character varying(400)" [note: '발신내용']
  "sms02_note" "character varying(400)" [note: '비고']

  indexes {
    (sms02_company_id, sms02_send_date) [name: 'sms02_history_idx01']
  }

  Note: 'SMS발신기록'
}

Table "public"."sms03_group_send" {
  "sms03_group_send_id" "numeric" [pk, note: '단체문자ID(PK)']
  "sms03_company_id" "numeric" [not null, note: '회사ID']
  "sms03_person_id" "numeric" [not null, note: '생성자ID']
  "sms03_start_date" "date" [not null, note: '생성일자']
  "sms03_title" "character varying(100)" [not null, note: '제목']
  "sms03_content" "text" [not null, note: '내용']
  "sms03_note" "character varying(200)" [note: '비고']

  indexes {
    (sms03_company_id, sms03_person_id) [name: 'sms03_group_send_idx01']
  }

  Note: '단체문자'
}

Table "public"."sms04_group_send_history" {
  "sms04_group_send_history_id" "numeric" [pk, note: '단체문자 SMS발신기록ID']
  "sms04_company_id" "numeric" [not null, note: '회사ID']
  "sms04_group_send_id" "numeric" [not null, note: '단체문자ID']
  "sms04_send_date" "timestamp without time zone" [not null, note: '보낸날짜']
  "sms04_target_tel_no" "character varying(13)" [note: '수신번호']
  "sms04_target_nm" "character varying(50)" [note: '수신자']
  "sms04_content" "character varying(400)" [note: '발신내용']
  "sms04_note" "character varying(400)" [note: '비고']

  Note: '단체문자 SMS발신기록'
}

Table "public"."sms10_alarm_history" {
  "sms10_alarm_history_id" "numeric" [pk, note: '알림기록ID']
  "sms10_send_date" "timestamp without time zone" [not null, note: '보낸날짜']
  "sms10_person_id" "numeric" [not null, note: '사원ID']
  "sms10_target_person_id" "numeric" [not null, note: '타겟사원ID']
  "sms10_content" "text" [not null, note: '내용']
  "sms10_send_yn" "character varying(5)" [not null, note: '성공여부']

  Note: '알림기록'
}

```
