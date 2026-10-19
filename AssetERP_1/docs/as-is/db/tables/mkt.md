# 테이블: mkt

6개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `mkt01_target_company` | 업무활동처 | 8 |
| `mkt02_manager` | 업무활동처 담당자 | 10 |
| `mkt03_history` | 업무활동내역 | 10 |
| `mkt04_relate_fund` | 업무활동내역 연결펀드 | 4 |
| `mkt05_share` | 업무활동내역 공유지정 | 6 |
| `mkt06_favorite` | 업무활동처 즐겨찾기 | 4 |

## DBML

```dbml
Table "public"."mkt01_target_company" {
  "mkt01_target_company_id" "numeric" [pk, note: '업무활동처ID(PK)']
  "mkt01_company_id" "numeric" [note: '회사ID']
  "mkt01_item_type_cd" "character varying(3)" [note: '업무활동처구분(CrmItemTypeCode)']
  "mkt01_target_company_nm" "character varying(100)" [note: '업무활동처명']
  "mkt01_addr" "character varying(100)" [note: '주소']
  "mkt01_tel" "character varying(50)" [note: '전화']
  "mkt01_note" "text" [note: '비고(주요사항)']
  "mkt01_unuse_yn" "character varying(5)" [note: '미사용여부']

  indexes {
    (mkt01_company_id) [name: 'mkt01_target_company_idx01']
  }

  Note: '업무활동처'
}

Table "public"."mkt02_manager" {
  "mkt02_manager_id" "numeric" [pk, note: '업무활동처 담당자ID(PK)']
  "mkt02_target_company_id" "numeric" [note: '업무활동처ID(mkt01_target_company_id)']
  "mkt02_manager_nm" "character varying(50)" [note: '담당자명']
  "mkt02_org_nm" "character varying(100)" [note: '부서명']
  "mkt02_pos_nm" "character varying(50)" [note: '직위명']
  "mkt02_email_addr" "character varying(50)" [note: '이메일']
  "mkt02_tel" "character varying(50)" [note: '전화']
  "mkt02_retire_info" "text" [note: '퇴사정보']
  "mkt02_note" "text" [note: '비고']
  "mkt02_company_id" "numeric" [note: '회사ID']

  indexes {
    (mkt02_target_company_id) [name: 'mkt02_manager_idx01']
    (mkt02_company_id) [name: 'mkt02_manager_idx02']
  }

  Note: '업무활동처 담당자'
}

Table "public"."mkt03_history" {
  "mkt03_history_id" "numeric" [pk, note: '업무활동내역ID(PK)']
  "mkt03_company_id" "numeric" [note: '회사ID']
  "mkt03_person_id" "numeric" [note: '사원ID']
  "mkt03_reg_date" "date" [note: '등록일']
  "mkt03_target_company_id" "numeric" [note: '업무활동처ID(mkt01_target_company_id)']
  "mkt03_activity_date" "date" [note: '업무활동일']
  "mkt03_activity_title" "character varying(200)" [note: '업무활동명']
  "mkt03_activity_content" "text" [note: '업무활동내용']
  "mkt03_private_yn" "character varying(5)" [note: '비공개여부(사용안함)']
  "mkt03_note" "text" [note: '비고']

  indexes {
    (mkt03_target_company_id) [name: 'mkt03_history_idx01']
    (mkt03_company_id, mkt03_reg_date) [name: 'mkt03_history_idx02']
  }

  Note: '업무활동내역'
}

Table "public"."mkt04_relate_fund" {
  "mkt04_relate_fund_id" "numeric" [pk, note: '업무활동내역 연결펀드ID(PK)']
  "mkt04_history_id" "numeric" [note: '업무활동내역ID(mkt03_history_id)']
  "mkt04_fund_id" "numeric" [note: '펀드ID(fnd01_fund_code_id)']
  "mkt04_company_id" "numeric" [note: '회사ID']

  indexes {
    (mkt04_history_id) [name: 'mkt04_relate_fund_idx01']
    (mkt04_company_id) [name: 'mkt04_relate_fund_idx02']
  }

  Note: '업무활동내역 연결펀드'
}

Table "public"."mkt05_share" {
  "mkt05_share_id" "numeric" [pk, note: '업무활동내역 공유지정ID(PK)']
  "mkt05_parent_id" "numeric" [note: '상위ID(mkt01_target_company_id, mkt03_history_id)']
  "mkt05_share_cd" "character varying(1)" [note: '공유코드(ShareCode-1:사원/2:부서)']
  "mkt05_person_id" "numeric" [note: '사원ID']
  "mkt05_org_id" "numeric" [note: '조직ID']
  "mkt05_company_id" "numeric" [note: '회사ID']

  indexes {
    (mkt05_parent_id) [name: 'mkt05_share_idx01']
  }

  Note: '업무활동내역 공유지정'
}

Table "public"."mkt06_favorite" {
  "mkt06_favorite_id" "numeric" [pk, note: '업무활동처 즐겨찾기ID(PK)']
  "mkt06_person_id" "numeric" [note: '사원ID']
  "mkt06_target_company_id" "numeric" [note: '업무활동처ID(mkt01_target_company_id)']
  "mkt06_manager_id" "numeric" [note: '업무활동처 담당자ID(mkt02_manager_id)']

  indexes {
    (mkt06_person_id) [name: 'mkt06_favorite_idx01']
  }

  Note: '업무활동처 즐겨찾기'
}

```
