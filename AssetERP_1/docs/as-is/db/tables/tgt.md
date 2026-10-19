# 테이블: tgt

3개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `tgt01_co` | 매매처 | 20 |
| `tgt02_co_acct` | 매매처별 계좌관리 | 11 |
| `tgt03_trans` | 거래코드 | 4 |

## DBML

```dbml
Table "public"."tgt01_co" {
  "tgt01_co_id" "numeric" [pk, note: '매매처 ID']
  "tgt01_company_id" "numeric" [note: '회사 ID']
  "tgt01_co_cd" "character varying(5)" [note: '매매처코드']
  "tgt01_co_nm" "character varying(40)" [note: '매매처명']
  "tgt01_gb" "character varying(1)" [note: '매매처구분[MM]']
  "tgt01_fss_tgt_co_cd" "character varying(7)" [note: '금융감독원코드']
  "tgt01_comp_cd" "character varying(5)" [note: 'KOSCOM코드']
  "tgt01_bank_cd" "character varying(3)" [note: '예탁원은행코드[K02]']
  "tgt01_use_yn" "character varying(10)" [default: `'true'::character varying`, note: '사용여부']
  "tgt01_cut_gb" "character varying(1)" [note: '거래세절사구분(0:반올림/1:절사)']
  "tgt01_ins_user" "character varying(10)" [note: '신규생성자']
  "tgt01_map" "character varying(6)" [note: 'MAP매매처코드']
  "tgt01_div_pre_per" "numeric" [default: `0`, note: '선취수수료 매매처안분율']
  "tgt01_div_basic_per" "numeric" [default: `0`, note: '운용보수 매매처안분율']
  "tgt01_div_success_per" "numeric" [default: `0`, note: '성과수수료 매매처안분율']
  "tgt01_note" "character varying(200)" [note: '비고']
  "tgt01_ksd_ref" "character varying(4)" [note: '예탁원 SUB코드']
  "tgt01_tax_rt" "numeric" [default: `0`, note: '세율']
  "tgt01_fen0317" "character varying(1)" [note: 'FX보고 역내외구분']
  "tgt01_fen0080" "character varying(3)" [note: 'FX보고 거래주체성격구분']

  indexes {
    ("tgt01_company_id", "tgt01_co_cd") [unique, name: 'tgt01_co_uk']
  }

  Note: '매매처'
}

Table "public"."tgt02_co_acct" {
  "tgt02_co_acct_id" "numeric" [pk, note: '매매처별 계좌관리 ID']
  "tgt02_co_id" "numeric" [note: '매매처 ID']
  "tgt02_co_cd" "character varying(5)" [note: '매매처']
  "tgt02_enc_acct_no" "character varying(40)" [note: '계좌번호']
  "tgt02_acct_nm" "character varying(120)" [note: '계좌명']
  "tgt02_open_date" "timestamp without time zone" [note: '개설일자']
  "tgt02_close_date" "timestamp without time zone" [note: '폐쇠일자']
  "tgt02_stock_tax" "character varying(1)" [note: '주식매매 거래세 과세여부(1:과세. 0:비과세)']
  "tgt02_fund_cd" "character varying(12)" [note: '연계펀드']
  "tgt02_def" "character varying(1)" [note: 'Default']
  "tgt02_note" "character varying(200)" [note: '참고사항']

  Note: '매매처별 계좌관리'
}

Table "public"."tgt03_trans" {
  "tgt03_trans_id" "numeric" [pk, note: '거래코드 ID']
  "tgt03_cd" "character varying(3)" [note: '거래코드']
  "tgt03_nm" "character varying(26)" [note: '거래코드 한글명칭']
  "tgt03_dr_gb" "character varying(1)" [note: '거래증감구분']

  Note: '거래코드'
}

```
