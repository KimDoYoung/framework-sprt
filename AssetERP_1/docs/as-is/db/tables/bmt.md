# 테이블: bmt

5개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `bmt01_buy` | 물품구매내역  | 10 |
| `bmt10_info` | 전산장비기본 | 9 |
| `bmt11_history` | 전산장비-사용자이력 | 8 |
| `bmt12_pc_history` | PC History | 10 |
| `bmt20_relate_appr` | 연관문서(비품) | 5 |

## DBML

```dbml
Table "public"."bmt01_buy" {
  "bmt01_buy_id" "numeric" [pk, note: '물품구매내역ID(PK)']
  "bmt01_company_id" "numeric" [not null, note: '회사ID']
  "bmt01_buy_date" "date" [not null, note: '구매일자']
  "bmt01_provide_content_cd" "character varying(4)" [note: '구매품목(ProvideContentCode001(1003:선물/1004:상품권/1099:기타))']
  "bmt01_buy_qty" "numeric" [note: '구매수량']
  "bmt01_buy_amt" "numeric" [note: '구입금액']
  "bmt01_person_id" "numeric" [note: '담당자ID']
  "bmt01_reg_emp_id" "numeric" [note: '등록자ID']
  "bmt01_appr_id" "numeric" [note: '상신ID']
  "bmt01_note" "character varying(200)" [note: '비고']

  indexes {
    (bmt01_company_id, bmt01_buy_date) [name: 'bmt01_buy_idx01']
  }

  Note: '물품구매내역 '
}

Table "public"."bmt10_info" {
  "bmt10_info_id" "numeric" [pk, note: '비품상세정보ID']
  "bmt10_company_id" "numeric" [not null, note: '회사ID']
  "bmt10_ast_class_tree_id" "numeric" [not null, note: '자산분류ID']
  "bmt10_apply_date" "timestamp without time zone" [note: '매입일자']
  "bmt10_retire_date" "timestamp without time zone" [note: '폐기일자']
  "bmt10_acq_amount" "numeric" [note: '취득금액']
  "bmt10_acq_info" "character varying(500)" [note: '취득정보']
  "bmt10_note" "character varying(1500)" [note: '비고']
  "bmt10_spec" "text" [note: '세부사양']

  indexes {
    (bmt10_company_id) [name: 'bmt10_info_idx01']
    (bmt10_company_id, bmt10_ast_class_tree_id) [name: 'bmt10_info_idx02']
  }

  Note: '전산장비기본'
}

Table "public"."bmt11_history" {
  "bmt11_history_id" "numeric" [pk, note: '비품HistoryID']
  "bmt11_info_id" "numeric" [not null, note: '비품상세정보ID']
  "bmt11_company_id" "numeric" [not null, note: '회사ID']
  "bmt11_person_id" "numeric" [note: '사원ID']
  "bmt11_start_date" "date" [note: '시작일자']
  "bmt11_note" "character varying(1500)" [note: '비고']
  "bmt11_messenger" "text" [note: '사용 메신저']
  "bmt11_website" "text" [note: '사용 웹사이트']

  indexes {
    (bmt11_info_id) [name: 'bmt11_history_idx01']
  }

  Note: '전산장비-사용자이력'
}

Table "public"."bmt12_pc_history" {
  "bmt12_pc_history_id" "numeric" [pk, note: 'PC HistoryID']
  "bmt12_info_id" "numeric" [not null, note: '비품상세정보ID']
  "bmt12_company_id" "numeric" [not null, note: '회사ID']
  "bmt12_start_date" "date" [not null, note: '시작일자']
  "bmt12_host_nm" "character varying(50)" [note: '호스트']
  "bmt12_setting_date" "date" [note: '설치(포맷)날짜']
  "bmt12_internal_ip" "character varying(20)" [note: '내부IP']
  "bmt12_mac_address" "character varying(50)" [note: 'MAC주소']
  "bmt12_etc" "text" [note: '기타사항(모델명, 프로세서, 제품ID, RAM, OS)']
  "bmt12_note" "text" [note: '비고']

  indexes {
    (bmt12_info_id) [name: 'bmt12_pc_history_idx01']
  }

  Note: 'PC History'
}

Table "public"."bmt20_relate_appr" {
  "bmt20_relate_appr_id" "numeric" [pk, note: '연관문서(비품)ID']
  "bmt20_company_id" "numeric" [not null, note: '회사ID']
  "bmt20_info_id" "numeric" [not null, note: '비품상세정보ID']
  "bmt20_appr_id" "numeric" [note: '문서ID']
  "bmt20_note" "character varying(1500)" [note: '비고']

  Note: '연관문서(비품)'
}

```
