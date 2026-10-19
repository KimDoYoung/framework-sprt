# 테이블: dcr

16개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `dcr01_class_tree` | 문서분류 | 21 |
| `dcr03_org_auth` | 조직별 권한등록 | 6 |
| `dcr04_doc` | 문서 (사용안함!!) | 7 |
| `dcr04_emp_auth` | 사원별 권한등록 | 5 |
| `dcr05_doc_type` | 문서양식 | 6 |
| `dcr06_relate_doc_type` | 연관 문서양식 | 6 |
| `dcr07_class_detail` | 문서분류-세부분류 | 8 |
| `dcr08_often_use` | 문서분류-자주사용 | 7 |
| `dcr10_mail_history` | 메일History | 13 |
| `dcr11_mail_file_history` | 메일첨부파일History | 3 |
| `dcr20_relate_ics` | 연관내부통제 | 5 |
| `dcr21_relate_icr` | 연관내규 | 5 |
| `dcr30_link` | 문서분류연결 | 6 |
| `dcr40_stamp_auth` | 문서분류별 권한등록 | 5 |
| `dcr99_class_tree_del` | 문서분류 삭제이력 | 22 |
| `dcr99_class_tree_temp` |  | 17 |

## DBML

```dbml
Table "public"."dcr01_class_tree" {
  "dcr01_class_tree_id" "numeric" [pk, note: '문서분류ID']
  "dcr01_company_id" "numeric" [not null, note: '회사ID']
  "dcr01_class_tree_nm" "character varying(200)" [not null, note: '문서분류명']
  "dcr01_parent_tree_id" "numeric" [not null, note: '상위문서분류ID']
  "dcr01_seq" "character varying(10)" [not null, note: '순번']
  "dcr01_note" "character varying(400)" [note: 'REmark']
  "dcr01_class_tree_cd" "character varying(10)" [not null, note: '문서분류코드']
  "dcr01_type_cd" "character varying(10)" [note: '문서유형코드']
  "dcr01_approval_type_cd" "character varying(10)" [note: '최종결재자분류코드(ApprovalTypeCode)']
  "dcr01_item_type_cd" "character varying(10)" [note: '문서상품분류코드(DocItemTypeCode)']
  "dcr01_seal_cd" "character varying(15)" [note: '인감코드(SealCode)']
  "dcr01_use_yn" "character varying(10)" [note: '사용여부']
  "dcr01_resrch_use_yn" "character varying(10)" [note: '리서치사용여부']
  "dcr01_advert_yn" "character varying(10)" [note: '광고심사여부(true/false)']
  "dcr01_comp_yn" "character varying(10)" [note: '준법감시여부(true/false)']
  "dcr01_risk_yn" "character varying(10)" [note: '위험관리여부(true/false)']
  "dcr01_mngm_yn" "character varying(10)" [note: '경영관리여부(true/false)']
  "dcr01_insert_bak_dcr_id" "numeric" [note: '문서분류ID(신규회사 생성작업용, 0번회사 문서분류ID)']
  "dcr01_admin_yn" "character varying(5)" [note: '관리자 관리여부']
  "dcr01_print_fund_yn" "character varying(10)" [note: '대외문서 출력여부']
  "dcr01_appr_step_group_id" "numeric" [note: '결재선 지정그룹ID']

  indexes {
    (dcr01_company_id) [name: 'dcr01_class_tree_idx01']
    (dcr01_parent_tree_id) [name: 'dcr01_class_tree_idx02']
    (dcr01_parent_tree_id) [name: 'idx_dcr01_parent_id']
  }

  Note: '문서분류'
}

Table "public"."dcr03_org_auth" {
  "dcr03_org_auth_id" "numeric" [pk, note: 'KeyId']
  "dcr03_org_code_id" "numeric" [not null, note: '조직코드ID']
  "dcr03_retrieve_yn" "character varying(10)" [not null, note: '문서조회여부']
  "dcr03_update_yn" "character varying(10)" [not null, note: '문서수정여부']
  "dcr03_class_tree_id" "numeric" [not null, note: '문서분류ID']
  "dcr03_note" "character varying(400)" [note: '비고']

  indexes {
    (dcr03_org_code_id) [name: 'dcr03_org_auth_idx01']
  }

  Note: '조직별 권한등록'
}

Table "public"."dcr04_doc" {
  "dcr04_doc_id" "numeric" [pk, note: '문서ID']
  "dcr04_doc_type_id" "numeric" [not null, note: '문서분류ID']
  "dcr04_doc_nm" "character varying(200)" [not null, note: '문서명']
  "dcr04_reg_emp_id" "numeric" [not null, note: '문서등록사원ID']
  "dcr04_reg_date" "timestamp without time zone" [not null, note: '문서등록일자']
  "dcr04_note" "character varying(400)" [note: '비고']
  "dcr04_appr_id" "numeric" [note: '상신ID']

  indexes {
    (dcr04_doc_type_id) [name: 'dcr04_doc_idx01']
  }

  Note: '문서 (사용안함!!)'
}

Table "public"."dcr04_emp_auth" {
  "dcr04_emp_auth_id" "numeric" [pk, note: '사원별 권한등록 id']
  "dcr04_person_id" "numeric" [not null, note: '사원id']
  "dcr04_retrieve_yn" "character varying(10)" [not null, note: '문서조회여부']
  "dcr04_class_tree_id" "numeric" [not null, note: '문서분류ID']
  "dcr04_note" "character varying(400)" [note: '비고']

  Note: '사원별 권한등록'
}

Table "public"."dcr05_doc_type" {
  "dcr05_doc_type_id" "numeric" [pk, note: '문서양식ID']
  "dcr05_title" "character varying(400)" [not null, note: '문서양식 제목']
  "dcr05_content" "text" [note: '문서양식 내용']
  "dcr05_note" "character varying(400)" [note: '문서양식 비고']
  "dcr05_company_id" "numeric"
  "dcr05_doc_form_class_cd" "character varying(3)" [note: '문서양식분류코드(DocFormClassCode)']

  Note: '문서양식'
}

Table "public"."dcr06_relate_doc_type" {
  "dcr06_relate_doc_type_id" "numeric" [pk, note: '연관 문서양식ID']
  "dcr06_class_tree_id" "numeric" [note: '문서(내부통제)분류ID']
  "dcr06_doc_type_id" "numeric" [note: '문서양식ID']
  "dcr06_company_id" "numeric" [note: '회사ID']
  "dcr06_note" "character varying(500)" [note: '비고']
  "dcr06_default_yn" "character varying(10)" [note: '대표양식']

  indexes {
    (dcr06_class_tree_id) [name: 'dcr06_relate_doc_type_idx01']
  }

  Note: '연관 문서양식'
}

Table "public"."dcr07_class_detail" {
  "dcr07_class_detail_id" "numeric" [pk, note: '문서세부분류ID(PK)']
  "dcr07_class_tree_id" "numeric" [not null, note: '문서분류ID(dcr01_class_tree_id)']
  "dcr07_class_detail_nm" "character varying(100)" [not null, note: '세부분류명']
  "dcr07_seq" "numeric" [not null, note: '조회순번']
  "dcr07_keyword" "character varying(200)" [note: '키워드']
  "dcr07_guide" "text" [note: '작성요령']
  "dcr07_use_yn" "character varying(5)" [note: '사용여부']
  "dcr07_link_yn" "character varying(5)" [note: '특정화면 Link 여부']

  indexes {
    (dcr07_class_tree_id) [name: 'dcr07_class_detail_idx01']
  }

  Note: '문서분류-세부분류'
}

Table "public"."dcr08_often_use" {
  "dcr08_often_use_id" "numeric" [pk, note: '문서분류-자주사용ID(PK)']
  "dcr08_company_id" "numeric" [note: '회사ID']
  "dcr08_person_id" "numeric" [note: '사원ID']
  "dcr08_class_tree_id" "numeric" [note: '문서분류ID']
  "dcr08_count" "numeric" [note: '사용횟수']
  "dcr08_bookmark" "character varying(5)" [note: '북마크']
  "dcr08_class_detail_id" "numeric" [note: '문서세부분류ID']

  Note: '문서분류-자주사용'
}

Table "public"."dcr10_mail_history" {
  "dcr10_mail_history_id" "numeric" [pk, note: '메일History ID']
  "dcr10_doc_id" "numeric" [note: '문서ID']
  "dcr10_apr_id" "numeric" [note: '결재ID']
  "dcr10_sender_email" "character varying(100)" [note: '보내는사람']
  "dcr10_send_time" "timestamp without time zone" [note: '보낸시간']
  "dcr10_receiver_email" "text" [note: '받는사람']
  "dcr10_referencer_email" "text" [note: '참조']
  "dcr10_attached_file" "character varying(100)" [note: '첨부파일']
  "dcr10_pdf_file" "character varying(100)" [note: 'PDF파일']
  "dcr10_seal_file" "character varying(100)" [note: '인감파일']
  "dcr10_title_text" "character varying(200)" [note: '제목']
  "dcr10_body_text" "text" [note: '본문내용']
  "dcr10_person_id" "numeric"

  indexes {
    (dcr10_doc_id) [name: 'dcr10_mail_history_idx01']
  }

  Note: '메일History'
}

Table "public"."dcr11_mail_file_history" {
  "dcr11_mail_file_history_id" "numeric" [pk, note: '메일첨부파일History ID']
  "dcr11_mail_history_id" "numeric" [not null, note: '메일History ID']
  "dcr11_file_id" "numeric" [not null, note: '파일ID']

  Note: '메일첨부파일History'
}

Table "public"."dcr20_relate_ics" {
  "dcr20_relate_ics_id" "numeric" [pk, note: '연관내부통제ID']
  "dcr20_dcr_class_tree_id" "numeric" [note: '문서분류ID']
  "dcr20_ics_class_tree_id" "numeric" [note: '내부통제ID']
  "dcr20_company_id" "numeric" [note: '회사ID']
  "dcr20_note" "character varying(200)" [note: '비고']

  indexes {
    (dcr20_dcr_class_tree_id) [name: 'dcr20_relate_ics_idx01']
    (dcr20_ics_class_tree_id) [name: 'dcr20_relate_ics_idx02']
  }

  Note: '연관내부통제'
}

Table "public"."dcr21_relate_icr" {
  "dcr21_relate_icr_id" "numeric" [pk, note: '연관내규ID']
  "dcr21_dcr_class_tree_id" "numeric" [note: '문서분류ID']
  "dcr21_icr_class_tree_id" "numeric" [note: '내규ID']
  "dcr21_company_id" "numeric" [note: '회사ID']
  "dcr21_note" "character varying(200)" [note: '비고ID']

  Note: '연관내규'
}

Table "public"."dcr30_link" {
  "dcr30_link_id" "numeric" [pk, note: '문서분류연결ID']
  "dcr30_link_cd" "character varying(3)" [not null, note: '문서분류연결코드(LinkCode)']
  "dcr30_class_tree_id" "numeric" [note: '문서분류ID']
  "dcr30_company_id" "numeric" [not null, note: '회사ID']
  "dcr30_form_mapping_id" "numeric" [note: '데이터매핑문서양식ID(com10_form_mapping_id)']
  "dcr30_note" "text"

  indexes {
    (dcr30_company_id, dcr30_link_cd) [name: 'dcr30_link_idx01']
  }

  Note: '문서분류연결'
}

Table "public"."dcr40_stamp_auth" {
  "dcr40_stamp_auth_id" "numeric" [pk, note: 'KeyId']
  "dcr40_stamp_id" "numeric" [not null, note: '인감ID']
  "dcr40_class_tree_id" "numeric" [not null, note: '문서분류ID']
  "dcr40_except_yn" "character varying(5)" [not null, note: '예외여부']
  "dcr40_note" "character varying(400)" [note: '비고']

  Note: '문서분류별 권한등록'
}

Table "public"."dcr99_class_tree_del" {
  "dcr99_class_tree_del_id" "numeric" [pk]
  "dcr99_person_id" "numeric" [not null]
  "dcr99_delete_date" "date" [not null]
  "dcr99_class_tree_id" "numeric" [not null]
  "dcr99_company_id" "numeric" [not null]
  "dcr99_class_tree_nm" "character varying(200)"
  "dcr99_parent_tree_id" "numeric" [not null]
  "dcr99_seq" "character varying(10)"
  "dcr99_note" "character varying(400)"
  "dcr99_class_tree_cd" "character varying(10)"
  "dcr99_type_cd" "character varying(10)"
  "dcr99_approval_type_cd" "character varying(10)"
  "dcr99_item_type_cd" "character varying(10)"
  "dcr99_seal_cd" "character varying(15)"
  "dcr99_use_yn" "character varying(10)"
  "dcr99_resrch_use_yn" "character varying(10)"
  "dcr99_advert_yn" "character varying(10)"
  "dcr99_comp_yn" "character varying(10)"
  "dcr99_risk_yn" "character varying(10)"
  "dcr99_mngm_yn" "character varying(10)"
  "dcr99_insert_bak_dcr_id" "numeric" [note: '문서분류ID(0번회사ID)']
  "dcr99_admin_yn" "character varying(5)" [note: '관리자 관리여부']

  Note: '문서분류 삭제이력'
}

Table "public"."dcr99_class_tree_temp" {
  "dcr99_class_tree_id" "numeric" [pk]
  "dcr99_company_id" "numeric" [not null]
  "dcr99_class_tree_nm" "character varying(200)" [not null]
  "dcr99_parent_tree_id" "numeric" [not null]
  "dcr99_seq" "character varying(10)" [not null]
  "dcr99_note" "character varying(400)"
  "dcr99_class_tree_cd" "character varying(10)" [not null]
  "dcr99_type_cd" "character varying(10)"
  "dcr99_approval_type_cd" "character varying(10)"
  "dcr99_item_type_cd" "character varying(10)"
  "dcr99_seal_cd" "character varying(10)"
  "dcr99_use_yn" "character varying(10)"
  "dcr99_resrch_use_yn" "character varying(10)"
  "dcr99_advert_yn" "character varying(10)"
  "dcr99_comp_yn" "character varying(10)"
  "dcr99_risk_yn" "character varying(10)"
  "dcr99_mngm_yn" "character varying(10)"
}

```
