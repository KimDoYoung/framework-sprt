# 테이블: crm

11개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `crm01_item` |  | 15 |
| `crm02_inspection` |  | 10 |
| `crm05_counsel` |  | 12 |
| `crm06_market` |  | 8 |
| `crm09_contact` |  | 15 |
| `crm10_cmnt` |  | 5 |
| `crm11_count` |  | 4 |
| `crm12_work_detail` | 업무활동상세 | 10 |
| `crm13_relate_fund` | 업무활동상세 연결펀드 | 3 |
| `crm14_share_default` | 영업거래처 공유지정(업무활동내용 공유지정 Default Data) | 6 |
| `crm15_share` | 업무활동내용 공유지정 | 6 |

## DBML

```dbml
Table "public"."crm01_item" {
  "crm01_item_id" "numeric" [pk]
  "crm01_title" "character varying(400)" [not null]
  "crm01_reg_date" "timestamp without time zone" [not null]
  "crm01_reg_person_id" "numeric" [not null]
  "crm01_contact_company" "character varying(200)" [not null]
  "crm01_contact_emp_nm" "character varying(100)"
  "crm01_contact_dept" "character varying(200)"
  "crm01_contact_emp_pos" "character varying(100)"
  "crm01_close_date" "timestamp without time zone"
  "crm01_item_type_cd" "character varying(10)" [not null]
  "crm01_project_nm" "character varying(200)"
  "crm01_meeting_content" "character varying(4000)" [not null]
  "crm01_note" "character varying(400)"
  "crm01_parent_id" "numeric" [not null]
  "crm01_org_code_id" "numeric" [not null]
}

Table "public"."crm02_inspection" {
  "crm02_inspection_id" "numeric" [pk]
  "crm02_company_id" "numeric" [not null]
  "crm02_type_cd" "character varying(10)" [not null]
  "crm02_title" "character varying(400)" [not null]
  "crm02_inspection_info" "character varying(1000)"
  "crm02_from_date" "timestamp without time zone" [not null]
  "crm02_to_date" "timestamp without time zone"
  "crm02_person_id" "numeric"
  "crm02_create_date" "timestamp without time zone"
  "crm02_note" "character varying(400)"
}

Table "public"."crm05_counsel" {
  "crm05_counsel_id" "numeric" [pk]
  "crm05_company_id" "numeric" [not null]
  "crm05_inout_cd" "character varying(10)" [not null]
  "crm05_work_cd" "character varying(10)" [not null]
  "crm05_type_cd" "character varying(10)" [not null]
  "crm05_title" "character varying(400)" [not null]
  "crm05_counsel_info" "character varying(1000)"
  "crm05_from_date" "timestamp without time zone" [not null]
  "crm05_to_date" "timestamp without time zone"
  "crm05_create_date" "timestamp without time zone"
  "crm05_person_id" "numeric"
  "crm05_note" "character varying(400)"
}

Table "public"."crm06_market" {
  "crm06_market_id" "numeric" [pk]
  "crm06_company_id" "numeric" [not null]
  "crm06_type_cd" "character varying(10)" [not null]
  "crm06_title" "character varying(1000)" [not null]
  "crm06_market_news" "character varying(4000)"
  "crm06_create_date" "timestamp without time zone"
  "crm06_person_id" "numeric"
  "crm06_note" "character varying(400)"
}

Table "public"."crm09_contact" {
  "crm09_contact_id" "numeric" [pk]
  "crm09_contact_nm" "character varying(90)" [not null]
  "crm09_item_type_cd" "character varying(10)" [not null]
  "crm09_contact_emp_nm" "character varying(50)"
  "crm09_contact_org_nm" "character varying(100)"
  "crm09_contact_title" "character varying(50)"
  "crm09_contact_pos" "character varying(50)"
  "crm09_contact_tel_no" "character varying(20)"
  "crm09_contact_mobile_no" "character varying(20)"
  "crm09_contact_email_addr" "character varying(100)"
  "crm09_contact_dt" "timestamp without time zone"
  "crm09_person_id" "numeric"
  "crm09_company_id" "numeric" [not null]
  "crm09_major_issues" "character varying(2000)"
  "crm09_note" "character varying(1000)"
}

Table "public"."crm10_cmnt" {
  "crm10_cmnt_id" "numeric" [pk]
  "crm10_person_id" "numeric" [not null]
  "crm10_reg_date" "timestamp without time zone" [not null]
  "crm10_item_id" "numeric" [not null]
  "crm10_cmnt" "character varying(2000)" [not null]
}

Table "public"."crm11_count" {
  "crm11_count_id" "numeric" [pk]
  "crm11_person_id" "numeric" [not null]
  "crm11_item_id" "numeric" [not null]
  "crm11_view_date" "timestamp without time zone"
}

Table "public"."crm12_work_detail" {
  "crm12_work_detail_id" "numeric" [pk, note: '업무활동상세ID(PK)']
  "crm12_company_id" "numeric" [note: '회사ID']
  "crm12_person_id" "numeric" [note: '등록자ID']
  "crm12_reg_date" "date" [note: '등록일']
  "crm12_contact_id" "numeric" [note: '영업거래처ID(crm09_contact_id)']
  "crm12_work_date" "date" [note: '업무활동일자']
  "crm12_work_nm" "character varying(100)" [note: '업무활동명']
  "crm12_work_content" "text" [note: '업무활동내용']
  "crm12_private_yn" "character varying(5)" [note: '비공개여부']
  "crm12_note" "text" [note: '비고']

  indexes {
    (crm12_company_id, crm12_work_date) [name: 'crm12_work_detail_idx01']
    (crm12_contact_id, crm12_work_date) [name: 'crm12_work_detail_idx02']
  }

  Note: '업무활동상세'
}

Table "public"."crm13_relate_fund" {
  "crm13_relate_fund_id" "numeric" [pk, note: '업무활동상세 연결펀드ID(PK)']
  "crm13_work_detail_id" "numeric" [note: '업무활동상세ID(crm12_work_detail_id)']
  "crm13_fund_id" "numeric" [note: '펀드ID(fnd01_fund_code_id)']

  indexes {
    (crm13_work_detail_id) [name: 'crm13_relate_fund_idx01']
  }

  Note: '업무활동상세 연결펀드'
}

Table "public"."crm14_share_default" {
  "crm14_share_default_id" "numeric" [pk, note: '영업거래처 공유지정ID(PK)']
  "crm14_contact_id" "numeric" [note: '영업거래처ID(crm09_contact_id)']
  "crm14_share_cd" "character varying(1)" [note: '공유구분(ShareCode-1:직원/2:부서)']
  "crm14_person_id" "numeric" [note: '사원ID']
  "crm14_org_id" "numeric" [note: '부서ID']
  "crm14_company_id" "numeric" [note: '회사ID']

  indexes {
    (crm14_contact_id) [name: 'crm14_share_default_idx01']
  }

  Note: '영업거래처 공유지정(업무활동내용 공유지정 Default Data)'
}

Table "public"."crm15_share" {
  "crm15_share_id" "numeric" [pk, note: '업무활동내용 공유지정ID(PK)']
  "crm15_work_detail_id" "numeric" [note: '업무활동상세ID(crm12_work_detail_id)']
  "crm15_share_cd" "character varying(1)" [note: '공유구분(ShareCode-1:직원/2:부서)']
  "crm15_person_id" "numeric" [note: '사원ID']
  "crm15_org_id" "numeric" [note: '부서ID']
  "crm15_company_id" "numeric" [note: '회사ID']

  indexes {
    (crm15_work_detail_id) [name: 'crm15_share_idx01']
  }

  Note: '업무활동내용 공유지정'
}

```
