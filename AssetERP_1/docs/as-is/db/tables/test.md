# 테이블: test

2개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `test01_addr_book` | 주소록 | 9 |
| `test02_addr_book_detail` | 상세 주소록 | 4 |

## DBML

```dbml
Table "public"."test01_addr_book" {
  "test01_addr_book_id" "numeric" [pk, note: '주소록ID']
  "test01_contacter_nm" "character varying(100)"
  "test01_email_addr" "character varying(100)"
  "test01_mobile_telno" "character varying(20)" [note: '휴대전화번호']
  "test01_office_telno" "character varying(20)" [note: '회사전화번호']
  "test01_company_nm" "character varying(100)" [note: '회사명']
  "test01_pos_nm" "character varying(100)" [note: '직위']
  "test01_person_id" "numeric" [not null, note: 'empId']
  "test01_note" "character varying(400)" [note: '비고']

  Note: '주소록'
}

Table "public"."test02_addr_book_detail" {
  "test02_addr_book_detail_id" "numeric" [pk, note: '상세 주소록ID']
  "test02_addr_book_id" "numeric" [not null, note: '주소록ID']
  "test02_reg_date" "timestamp without time zone" [note: '등록일자']
  "test02_note" "character varying(500)" [note: '비고']

  Note: '상세 주소록'
}

```
