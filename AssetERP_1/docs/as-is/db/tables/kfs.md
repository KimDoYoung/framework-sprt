# 테이블: kfs

1개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `kfs01_remote_view` | 계정코드 | 9 |

## DBML

```dbml
Table "public"."kfs01_remote_view" {
  "kfs01_remote_view_id" "numeric" [pk, note: '리모트뷰ID(PK)']
  "kfs01_company_id" "numeric" [not null, note: '회사ID']
  "kfs01_person_nm" "character varying(10)" [note: '사용자이름']
  "kfs01_date" "timestamp without time zone" [note: '사용일자']
  "kfs01_start_time" "character varying(5)" [note: '시작시간']
  "kfs01_close_time" "character varying(5)" [note: '종료시간']
  "kfs01_reason" "character varying(200)" [note: '사유']
  "kfs01_note" "character varying(200)" [note: '비고']
  "kfs01_manager_yn" "character varying(5)"

  Note: '계정코드'
}

```
