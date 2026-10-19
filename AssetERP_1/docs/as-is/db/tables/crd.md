# 테이블: crd

5개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `crd01_card` | 법인카드관리 | 12 |
| `crd02_data` | 법인카드내역 | 27 |
| `crd03_trans` | 법인카드 관리자 | 7 |
| `crd10_excel_company` |  | 4 |
| `crd11_excel_code` |  | 6 |

## DBML

```dbml
Table "public"."crd01_card" {
  "crd01_card_id" "numeric" [pk, note: '법인카드관리ID']
  "crd01_company_id" "numeric" [not null, note: '회사ID']
  "crd01_bank_cd" "character varying(10)" [note: '은행(카드)코드(CreditCardCompany)']
  "crd01_card_nm" "character varying(50)" [note: '카드명']
  "crd01_card_no_slip" "character varying(20)" [note: '카드번호']
  "crd01_card_no" "character varying(20)" [note: '카드번호(Excel)']
  "crd01_fr_dt" "timestamp without time zone" [note: '시작일']
  "crd01_to_dt" "timestamp without time zone" [note: '종료일']
  "crd01_close_yn" "character varying(10)" [note: '사용여부']
  "crd01_card_type" "character varying(1)" [note: '카드구분(CardType-1:신용카드/2:체크카드)']
  "crd01_note" "character varying(200)" [note: '비고']
  "crd01_deposit_id" "numeric" [note: '예금계좌ID(ast01_class_tree_id)']

  indexes {
    (crd01_company_id, crd01_bank_cd) [name: 'crd01_card_idx01']
  }

  Note: '법인카드관리'
}

Table "public"."crd02_data" {
  "crd02_data_id" "numeric" [pk, note: '법인카드내역ID']
  "crd02_company_id" "numeric" [not null, note: '회사ID']
  "crd02_data_ym" "character varying(10)" [note: '사용년월(YYYY.MM)']
  "crd02_data_bank_cd" "character varying(10)" [note: '은행(카드)코드(CreditCardCompany)']
  "crd02_approval_dt" "timestamp without time zone" [note: '승인일']
  "crd02_approval_time" "character varying(10)" [note: '승인시간']
  "crd02_part_cd" "character varying(10)" [note: '부서번호']
  "crd02_part_nm" "character varying(50)" [note: '부서명']
  "crd02_card_no" "character varying(20)" [note: '카드번호(Excel)']
  "crd02_card_nm" "character varying(50)" [note: '이용자명']
  "crd02_franchise_nm" "character varying(100)" [note: '가맹점명']
  "crd02_sector_nm" "character varying(30)" [note: '업종명']
  "crd02_payment_method" "character varying(30)" [note: '결제방법']
  "crd02_monthly_payments" "numeric" [note: '할부개월수']
  "crd02_approval_amount" "numeric" [note: '승인금액']
  "crd02_surtax" "numeric" [note: '부가세']
  "crd02_approval_classification" "character varying(10)" [note: '승인구분']
  "crd02_approval_method" "character varying(10)" [note: '승인방식']
  "crd02_approval_no" "character varying(10)" [note: '승인번호']
  "crd02_state_nm" "character varying(20)" [note: '상태']
  "crd02_tax_ty" "character varying(20)" [note: '과세유형']
  "crd02_merchant_status" "character varying(10)" [note: '가맹점상태']
  "crd02_merchant_no" "character varying(20)" [note: '가맹점번호']
  "crd02_biz_license_no" "character varying(10)" [note: '사업자번호']
  "crd02_representative_nm" "character varying(50)" [note: '대표자명']
  "crd02_merchant_addr" "character varying(200)" [note: '주소']
  "crd02_merchant_phone" "character varying(20)" [note: '전화번호']

  indexes {
    (crd02_company_id, crd02_data_ym, crd02_data_bank_cd) [name: 'crd02_data_idx01']
  }

  Note: '법인카드내역'
}

Table "public"."crd03_trans" {
  "crd03_trans_id" "numeric" [pk, note: '법인카드 관리자ID']
  "crd03_person_id" "numeric" [note: '사원ID']
  "crd03_card_id" "numeric" [note: '카드ID']
  "crd03_fr_dt" "timestamp without time zone" [note: '관리시작일']
  "crd03_to_dt" "timestamp without time zone" [note: '관리종료일']
  "crd03_use_yn" "character varying(10)" [note: '사용여부(사용안함)']
  "crd03_public_yn" "character varying(5)" [note: '공통카드 여부(보고서 사용자명 출력구분용으로 사용)']

  indexes {
    (crd03_card_id) [name: 'crd03_trans_idx01']
  }

  Note: '법인카드 관리자'
}

Table "public"."crd10_excel_company" {
  "crd10_excel_company_id" "numeric" [pk, note: '법인카드 업로드 회사구분ID(PK)']
  "crd10_company_id" "numeric" [not null, note: '회사ID']
  "crd10_bank_cd" "character varying(10)" [not null, note: '카드사 구분(CreditCardCompany)']
  "crd10_note" "text" [note: '비고']
}

Table "public"."crd11_excel_code" {
  "crd11_excel_code_id" "numeric" [pk, note: '법인카드 업로드 구분ID(PK)']
  "crd11_company_id" "numeric" [not null, note: '회사ID']
  "crd11_bank_cd" "character varying(10)" [not null, note: '카드사 구분(CreditCardCompany)']
  "crd11_bank_excel_cd" "character varying(10)" [not null, note: '법인카드 업로드 구분(CreditCardExcelCode)']
  "crd11_seq" "numeric" [not null, note: '순서']
  "crd11_note" "text" [note: '비고(형식)']
}

```
