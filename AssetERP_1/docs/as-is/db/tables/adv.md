# 테이블: adv

4개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `adv02_account` | 일임/자문 고객계좌 | 11 |
| `adv05_org_auth` | 부서별 일임/자문 계좌권한 | 5 |
| `adv10_book` | 자문/일임 운용자산 | 15 |
| `adv11_book_extr` | 일임/자문 운용자산(외부) | 8 |

## DBML

```dbml
Table "public"."adv02_account" {
  "adv02_account_id" "numeric" [pk, note: '일임/자문 고객계좌ID(PK)']
  "adv02_company_id" "numeric" [note: '회사ID']
  "adv02_manage_cd" "character varying(12)" [note: '관리코드(ICAM 펀드코드)']
  "adv02_manage_nm" "character varying(100)" [note: '관리코드명(ICAM 펀드명)']
  "adv02_tr_corp_cd" "character varying(5)" [note: '증권사코드(ICAM 코드-szx2mm)']
  "adv02_tr_corp_nm" "character varying(100)" [note: '증권사명']
  "adv02_account_no" "character varying(128)" [note: '계좌번호']
  "adv02_start_date" "date" [note: '최초설정일자']
  "adv02_close_date" "date" [note: '해지일자']
  "adv02_work_date" "timestamp without time zone" [note: '작업일시']
  "adv02_worker" "character varying(50)" [note: '작업자']

  indexes {
    (adv02_company_id, adv02_manage_cd) [name: 'adv02_account_idx01']
  }

  Note: '일임/자문 고객계좌'
}

Table "public"."adv05_org_auth" {
  "adv05_org_auth_id" "numeric" [pk, note: '부서별 일임/자문 계좌권한ID(PK)']
  "adv05_account_id" "numeric" [note: '일임/자문 고객계좌ID(adv02_account_id)']
  "adv05_org_code_id" "numeric" [note: '조직ID(org01_code_id)']
  "adv05_auth_yn" "character varying(5)" [note: '권한여부']
  "adv05_note" "text" [note: '비고']

  indexes {
    (adv05_account_id) [name: 'adv05_org_auth_idx01']
  }

  Note: '부서별 일임/자문 계좌권한'
}

Table "public"."adv10_book" {
  "adv10_book_id" "numeric" [pk, note: '자문/일임 운용자산ID(PK)']
  "adv10_std_date" "date" [note: '기준일자']
  "adv10_company_id" "numeric" [note: '회사ID']
  "adv10_manage_cd" "character varying(12)" [note: '관리계좌코드']
  "adv10_manage_nm" "character varying(100)" [note: '관리계좌명']
  "adv10_item_cd" "character varying(12)" [note: '종목코드']
  "adv10_item_nm" "character varying(100)" [note: '종목명']
  "adv10_qty" "numeric" [note: '보유수량']
  "adv10_eval_amt" "numeric" [note: '평가금액']
  "adv10_item_group_cd" "character varying(2)" [note: '종목그룹코드(ICAM코드:96)']
  "adv10_item_group_nm" "character varying(50)" [note: '종목그룹명(ICAM코드:96)']
  "adv10_market_cd" "character varying(1)" [note: '시장구분코드(ICAM코드:53)']
  "adv10_market_nm" "character varying(50)" [note: '시장구분명(ICAM코드:53)']
  "adv10_create_date" "timestamp without time zone" [note: '생성일시']
  "adv10_creater" "character varying(50)" [note: '생성자']

  indexes {
    (adv10_company_id, adv10_std_date) [name: 'adv10_book_idx01']
  }

  Note: '자문/일임 운용자산'
}

Table "public"."adv11_book_extr" {
  "adv11_book_extr_id" "numeric" [pk, note: '일임/자문 운용자산(외부)ID(PK)']
  "adv11_company_id" "numeric" [note: '회사ID']
  "adv11_std_date" "date" [note: '기준일자']
  "adv11_manage_cd" "character varying(12)" [note: '관리계좌코드']
  "adv11_manage_nm" "character varying(100)" [note: '관리계좌명']
  "adv11_item_cd" "character varying(12)" [note: '종목코드']
  "adv11_item_nm" "character varying(100)" [note: '종목명']
  "adv11_item_type" "character varying(4)" [note: '종목구분(ItemMClassCode001-2010:주식/2050:집합투자증권)']

  indexes {
    (adv11_company_id, adv11_std_date) [name: 'adv11_book_extr_idx01']
  }

  Note: '일임/자문 운용자산(외부)'
}

```
