# 테이블: com

4개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `com01_relate_appr` | 상신문서 연결(공통사용) | 4 |
| `com10_form_mapping` | 문서양식관리(데이터맵핑문서) | 6 |
| `com11_form_mapping_multi` | 상세코드별 문서분류연결코드 및 데이터맵핑양식관리 | 7 |
| `com50_item` | 종목정보(공통사용) | 5 |

## DBML

```dbml
Table "public"."com01_relate_appr" {
  "com01_relate_appr_id" "numeric" [pk, note: '상신문서 연결ID(PK)']
  "com01_key_table" "character varying(5)" [note: '연결Table(테이블명 앞5자리)']
  "com01_key_table_id" "numeric" [note: '연결Table ID']
  "com01_appr_id" "numeric" [note: '상신ID(apr01_appr_id)']

  indexes {
    (com01_key_table_id) [name: 'com01_relate_appr_idx01']
  }

  Note: '상신문서 연결(공통사용)'
}

Table "public"."com10_form_mapping" {
  "com10_form_mapping_id" "numeric" [pk, note: '문서양식관리ID(PK)']
  "com10_company_id" "numeric" [not null, note: '회사ID']
  "com10_title" "character varying(150)" [note: '제목']
  "com10_content" "text" [note: '내용']
  "com10_default_yn" "character varying(5)" [note: '기본사용설정여부']
  "com10_note" "character varying(500)" [note: '비고']

  Note: '문서양식관리(데이터맵핑문서)'
}

Table "public"."com11_form_mapping_multi" {
  "com11_form_mapping_multi_id" "numeric" [pk, note: '상세코드별 문서분류연결코드 및 데이터맵핑양식관리ID(PK)']
  "com11_company_id" "numeric" [note: '회사ID']
  "com11_sys_kind_cd" "character varying(50)" [note: '시스템코드(sys08_kind_cd)']
  "com11_sys_detail_cd" "character varying(10)" [note: '시스템상세코드(sys09_code)']
  "com11_link_cd" "character varying(3)" [note: '문서분류연결코드(dcr30_link_cd)']
  "com11_content" "text" [note: '내용(양식)']
  "com11_note" "text" [note: '비고']

  Note: '상세코드별 문서분류연결코드 및 데이터맵핑양식관리'
}

Table "public"."com50_item" {
  "com50_item_id" "numeric" [pk, note: '종목정보ID(PK)']
  "com50_item_cd" "character varying(12)" [note: '종목코드']
  "com50_item_nm" "character varying(100)" [note: '종목명']
  "com50_item_type" "character varying(4)" [note: '종목구분(ItemMClassCode001-2010:주식/2050:집합투자증권)']
  "com50_item_short_cd" "character varying(12)" [note: '종목단축코드(코스콤코드)']

  indexes {
    (com50_item_cd) [name: 'com50_item_idx01']
  }

  Note: '종목정보(공통사용)'
}

```
