# 테이블: bbs

20개. 컬럼 주석은 DBML의 `note`에 있다. FK(ref)는 DB에 정의돼 있지 않다.

| 테이블 | 설명 | 컬럼 수 |
|:---|:---|---:|
| `bbs01_board` | 공지사항자료 | 8 |
| `bbs02_notice` | 공지사항 | 20 |
| `bbs03_target` | 개별공지대상 | 4 |
| `bbs04_target_company` | 개별공지대상 | 4 |
| `bbs05_history` | 공지사항 History | 4 |
| `bbs06_notice_no` | 공지번호 관리 | 4 |
| `bbs07_comment` | 공지사항 댓글 | 7 |
| `bbs08_notice_law_record` | 법규/경영공지 DML기록 | 21 |
| `bbs09_notice_history` | 공지사항 History | 7 |
| `bbs10_biz_share` | 업무공유 | 8 |
| `bbs11_application` | 요청서 작성 | 11 |
| `bbs12_application_form` | 요청서 양식 | 6 |
| `bbs15_company_rule` | 회사규정 | 16 |
| `bbs20_floral_request` | 화환신청 | 25 |
| `bbs21_floral_request_share` | 화환신청 공유지정 | 5 |
| `bbs22_floral_message` | 화환신청 문구 관리 | 4 |
| `bbs30_class_tree` | 게시판분류 | 9 |
| `bbs31_content` | 게시판내용 | 10 |
| `bbs32_comment` | 게시판 댓글 | 7 |
| `bbs33_role` | 게시판분류권한 | 6 |

## DBML

```dbml
Table "public"."bbs01_board" {
  "bbs01_board_id" "numeric" [pk, note: '게시판ID']
  "bbs01_type_cd" "character varying(10)" [note: '게시판유형코드']
  "bbs01_title" "character varying(1000)" [note: '제목']
  "bbs01_content" "text" [note: '내용']
  "bbs01_write_user_id" "numeric" [not null, note: '작성자ID']
  "bbs01_company_id" "numeric" [not null, note: '회사ID']
  "bbs01_write_date" "timestamp without time zone" [not null, note: '작성일자']
  "bbs01_note" "character varying(400)" [note: '비고']

  indexes {
    (bbs01_company_id) [name: 'bbs01_board_idx01']
  }

  Note: '공지사항자료'
}

Table "public"."bbs02_notice" {
  "bbs02_notice_id" "numeric" [pk, note: '공지사항ID']
  "bbs02_company_id" "numeric" [not null, note: '회사id']
  "bbs02_title" "character varying(400)" [not null, note: '제목']
  "bbs02_notice" "text" [note: '공지내용']
  "bbs02_from_date" "timestamp without time zone" [not null, note: '공지일']
  "bbs02_to_date" "timestamp without time zone" [not null, note: '종료일']
  "bbs02_open_yn" "character varying(10)" [note: '상태(대기, 알림)']
  "bbs02_create_user_id" "numeric" [note: '작성자']
  "bbs02_create_date" "timestamp without time zone" [note: '생성일']
  "bbs02_note" "character varying(400)" [note: '메모']
  "bbs02_user_nm" "character varying(100)" [note: '생성자nm']
  "bbs02_user_id" "numeric" [note: '생성자id']
  "bbs02_notice_type" "character varying(2)" [note: '공지구분(NoticeType)']
  "bbs02_notice_detail_cd" "character varying(4)" [note: '공지구분상세코드(NoticeDetailCode)']
  "bbs02_public_yn" "character varying(5)" [note: '전체공지여부']
  "bbs02_notice_no" "character varying(9)" [note: '공지번호(고객사별 채번)']
  "bbs02_public_company_yn" "character varying(5)" [note: '전체고객사 공개여부']
  "bbs02_comment_yn" "character varying(5)" [note: '댓글허용여부']
  "bbs02_top_notice_yn" "character varying(5)" [note: '상단고정 여부']
  "bbs02_top_notice_close_date" "timestamp without time zone" [note: '상단고정 종료일']

  indexes {
    (bbs02_company_id) [name: 'bbs02_notice_idx01']
  }

  Note: '공지사항'
}

Table "public"."bbs03_target" {
  "bbs03_target_id" "numeric" [pk, note: '개별공지대상id']
  "bbs03_notice_id" "numeric" [note: '비고']
  "bbs03_person_id" "numeric" [not null, note: '공지대상 empid']
  "bbs03_note" "character varying(400)"

  indexes {
    (bbs03_person_id) [name: 'bbs03_target_idx01']
  }

  Note: '개별공지대상'
}

Table "public"."bbs04_target_company" {
  "bbs04_target_company_id" "numeric" [pk, note: '개별공지대상ID']
  "bbs04_notice_id" "numeric" [note: '공지사항ID']
  "bbs04_company_id" "numeric" [not null, note: '회사ID']
  "bbs04_note" "character varying(400)"

  indexes {
    (bbs04_notice_id) [name: 'bbs04_target_company_idx01']
  }

  Note: '개별공지대상'
}

Table "public"."bbs05_history" {
  "bbs05_history_id" "numeric" [pk, note: '공지사항 HistoryID']
  "bbs05_notice_id" "numeric" [not null, note: '공지사항ID']
  "bbs05_date" "timestamp without time zone" [note: '공지사항 확인날짜']
  "bbs05_person_id" "numeric" [not null, note: '사원ID']

  indexes {
    (bbs05_notice_id) [name: 'bbs05_history_idx01']
  }

  Note: '공지사항 History'
}

Table "public"."bbs06_notice_no" {
  "bbs06_notice_no_id" "numeric" [pk, note: '공지번호 관리ID(PK)']
  "bbs06_company_id" "numeric" [not null, note: '회사ID']
  "bbs06_yymm" "character varying(4)" [note: '기준년월(YYYYMM)']
  "bbs06_no" "numeric" [note: '번호']

  indexes {
    (bbs06_company_id, bbs06_yymm) [name: 'bbs06_notice_no_idx01']
  }

  Note: '공지번호 관리'
}

Table "public"."bbs07_comment" {
  "bbs07_comment_id" "numeric" [pk, note: '공지사항 댓글ID(PK)']
  "bbs07_company_id" "numeric" [not null, note: '회사ID']
  "bbs07_person_id" "numeric" [not null, note: '사원ID']
  "bbs07_notice_id" "numeric" [not null, note: '공지사항ID']
  "bbs07_date" "timestamp without time zone" [not null, note: '일자']
  "bbs07_time" "character varying(8)" [not null, note: '내용']
  "bbs07_comment" "text" [not null]

  Note: '공지사항 댓글'
}

Table "public"."bbs08_notice_law_record" {
  "bbs08_notice_law_record_id" "numeric" [pk, note: '법규/경영공지 DML기록ID']
  "bbs08_dml_type" "character varying(10)" [not null, note: '데이터조작구분(INSERT/UPDATE/DELETE)']
  "bbs08_dml_date" "timestamp without time zone" [not null, note: '데이터조작일시']
  "bbs08_notice_id" "numeric" [not null, note: '공지사항ID(bbs02_notice_id)']
  "bbs08_company_id" "numeric" [note: '회사ID']
  "bbs08_title" "character varying(400)" [note: '제목']
  "bbs08_notice" "text" [note: '공지내용']
  "bbs08_from_date" "timestamp without time zone" [note: '공지일']
  "bbs08_to_date" "timestamp without time zone" [note: '종료일']
  "bbs08_open_yn" "character varying(10)" [note: '상태(대기, 알림)']
  "bbs08_create_user_id" "numeric" [note: '작성자ID']
  "bbs08_create_date" "timestamp without time zone" [note: '생성일']
  "bbs08_note" "character varying(400)" [note: '메모']
  "bbs08_user_nm" "character varying(100)" [note: '생성자명']
  "bbs08_user_id" "numeric" [note: '생성자ID']
  "bbs08_notice_type" "character varying(2)" [note: '공지구분(NoticeType)']
  "bbs08_notice_detail_cd" "character varying(4)" [note: '공지구분상세코드(NoticeDetailCode)']
  "bbs08_public_yn" "character varying(5)" [note: '전체공지여부']
  "bbs08_notice_no" "character varying(9)" [note: '공지번호(고객사별 채번)']
  "bbs08_public_company_yn" "character varying(5)" [note: '전체고객사 공개여부']
  "bbs08_comment_yn" "character varying(5)" [note: '댓글허용여부']

  Note: '법규/경영공지 DML기록'
}

Table "public"."bbs09_notice_history" {
  "bbs09_notice_history_id" "numeric" [pk, note: '공지사항 HistoryID']
  "bbs09_notice_id" "numeric" [not null, note: '공지사항 ID']
  "bbs09_person_id" "numeric" [not null, note: '사원ID']
  "bbs09_reg_date" "timestamp without time zone" [not null, note: '변경일자']
  "bbs09_open_yn" "character varying(10)" [note: '상태(대기, 알림)']
  "bbs09_notice" "text" [note: '공지내용']
  "bbs09_note" "text" [note: '비고']

  Note: '공지사항 History'
}

Table "public"."bbs10_biz_share" {
  "bbs10_biz_share_id" "numeric" [pk, note: '업무공유ID(PK)']
  "bbs10_company_id" "numeric" [not null, note: '회사ID']
  "bbs10_date" "date" [note: '등록일']
  "bbs10_biz_share_type" "character varying(2)" [note: '업무공유구분(BizShareType)']
  "bbs10_content" "text" [note: '내용']
  "bbs10_note" "text" [note: '비고']
  "bbs10_person_id" "numeric" [note: '등록자ID']
  "bbs10_keyword" "character varying(50)" [note: '키워드']

  Note: '업무공유'
}

Table "public"."bbs11_application" {
  "bbs11_application_id" "numeric" [pk, note: '요청서작성ID(PK)']
  "bbs11_company_id" "numeric" [note: '회사ID']
  "bbs11_app_date" "date" [note: '요청일자']
  "bbs11_app_emp_id" "numeric" [note: '요청 사원ID']
  "bbs11_app_type" "character varying(2)" [note: '요청구분(ApplicationType)']
  "bbs11_app_status" "character varying(2)" [note: '요청상태(ApplicationStatusCode)']
  "bbs11_content" "text" [note: '내용']
  "bbs11_close_date" "date" [note: '완료일자']
  "bbs11_person_id" "numeric" [note: '처리자ID']
  "bbs11_note" "text" [note: '비고']
  "bbs11_login_mode" "character varying(1)"

  indexes {
    (bbs11_company_id) [name: 'bbs11_application_idx01']
    (bbs11_company_id, bbs11_app_date) [name: 'bbs11_application_idx02']
    (bbs11_company_id, bbs11_app_emp_id) [name: 'bbs11_application_idx03']
  }

  Note: '요청서 작성'
}

Table "public"."bbs12_application_form" {
  "bbs12_application_form_id" "numeric" [pk, note: '요청서 양식ID(PK)']
  "bbs12_company_id" "numeric" [not null, note: '회사ID']
  "bbs12_app_type" "character varying(2)" [not null, note: '요청구분(ApplicationType)']
  "bbs12_content" "text" [note: '내용']
  "bbs12_public_yn" "character varying(5)" [note: '공개여부']
  "bbs12_content_mobi" "text" [note: '내용(모바일용)']

  indexes {
    (bbs12_company_id) [name: 'bbs12_application_form_idx01']
    (bbs12_company_id, bbs12_app_type) [name: 'bbs12_application_form_idx02']
  }

  Note: '요청서 양식'
}

Table "public"."bbs15_company_rule" {
  "bbs15_company_rule_id" "numeric" [pk, note: '회사규정ID(PK)']
  "bbs15_company_id" "numeric" [note: '회사ID']
  "bbs15_rule_type" "character varying(3)" [note: '회사규정구분(CompanyRuleType)']
  "bbs15_title" "character varying(200)" [note: '회사규정명']
  "bbs15_content" "text" [note: '내용']
  "bbs15_note" "text" [note: '비고']
  "bbs15_seq" "numeric" [note: '조회순서']
  "bbs15_work_date" "timestamp without time zone" [note: '등록(수정)일자(사용X)']
  "bbs15_revision_date" "date" [note: '제개정일']
  "bbs15_revision_no" "numeric" [note: '개정회차']
  "bbs15_public_yn" "character varying(5)" [note: '공개여부']
  "bbs15_company_rule_cd" "character varying(10)" [note: '회사규정코드']
  "bbs15_close_date" "date" [note: '종료일자']
  "bbs15_cre_nm" "character varying(50)" [note: '작성자']
  "bbs15_upd_nm" "character varying(50)" [note: '변경자']
  "bbs15_upd_date" "timestamp without time zone" [note: '등록(변경)일시']

  Note: '회사규정'
}

Table "public"."bbs20_floral_request" {
  "bbs20_floral_request_id" "numeric" [pk, note: '화환신청ID(PK)']
  "bbs20_company_id" "numeric" [note: '회사ID']
  "bbs20_reg_date" "date" [note: '신청일']
  "bbs20_person_id" "numeric" [note: '신청사원ID']
  "bbs20_occasions_cd" "character varying(2)" [note: '경조구분(OccasionsCode-10:결혼/20:근조/30:승진/..)']
  "bbs20_message" "character varying(200)" [note: '문구']
  "bbs20_send_company" "character varying(200)" [note: '발송처-회사명']
  "bbs20_send_emp" "character varying(100)" [note: '발송처-사원명']
  "bbs20_send_pos" "character varying(100)" [note: '발송처-직위']
  "bbs20_rcv_company" "character varying(200)" [note: '수신처-회사명']
  "bbs20_rcv_emp" "character varying(100)" [note: '수신처-담당자명']
  "bbs20_rcv_pos" "character varying(100)" [note: '수신처-직위']
  "bbs20_rcv_dept" "character varying(200)" [note: '수신처-부서']
  "bbs20_rcv_tel" "character varying(50)" [note: '수신처-연락처']
  "bbs20_rcv_addr" "character varying(200)" [note: '배달장소']
  "bbs20_send_request_date" "date" [note: '발송요청일']
  "bbs20_status_cd" "character varying(2)" [note: '신청상태(ApplicationStatusCode-10:신청/20:접수/92:발송완료)']
  "bbs20_end_date" "date" [note: '발송완료일']
  "bbs20_note" "text" [note: '확인자 비고']
  "bbs20_reason" "text" [note: '신청사유']
  "bbs20_add_info" "text" [note: '추가정보사항(결혼-신랑/신부여부, 근조-상주,발인일)']
  "bbs20_requests" "text" [note: '요청사항']
  "bbs20_send_request_time" "character varying(50)" [note: '발송요청시간(오전/오후/즉시/특정시간)']
  "bbs20_reject_reason" "text" [note: '반려사유']
  "bbs20_private_yn" "character varying(5)" [note: '비공개여부']

  indexes {
    (bbs20_company_id, bbs20_reg_date) [name: 'bbs20_floral_request_idx01']
  }

  Note: '화환신청'
}

Table "public"."bbs21_floral_request_share" {
  "bbs21_floral_request_share_id" "numeric" [pk, note: '화환신청 공유지정ID(PK)']
  "bbs21_floral_request_id" "numeric" [note: '화환신청ID(bbs20_floral_request_id)']
  "bbs21_share_cd" "character varying(1)" [note: '공유구분(ShareCode-1:직원/2:부서)']
  "bbs21_person_id" "numeric" [note: '사원ID']
  "bbs21_org_id" "numeric" [note: '부서ID']

  indexes {
    (bbs21_floral_request_id) [name: 'bbs21_floral_request_share_idx01']
  }

  Note: '화환신청 공유지정'
}

Table "public"."bbs22_floral_message" {
  "bbs22_floral_message_id" "numeric" [pk, note: '화환신청 공유지정ID(PK)']
  "bbs22_company_id" "numeric" [note: '회사ID']
  "bbs22_occasions_cd" "character varying(2)" [note: '경조구분(OccasionsCode-10:결혼/20:근조/30:승진/..)']
  "bbs22_message" "text" [note: '문구']

  indexes {
    (bbs22_company_id) [name: 'bbs22_floral_message_idx01']
  }

  Note: '화환신청 문구 관리'
}

Table "public"."bbs30_class_tree" {
  "bbs30_class_tree_id" "numeric" [pk, note: '게시판분류ID(PK)']
  "bbs30_company_id" "numeric" [not null, note: '회사ID']
  "bbs30_class_tree_nm" "character varying(200)" [note: '게시판분류명']
  "bbs30_parent_tree_id" "numeric" [not null, note: '상위게시판분류ID']
  "bbs30_seq" "numeric" [note: '순번']
  "bbs30_note" "text" [note: '비고']
  "bbs30_type_cd" "character varying(1)" [note: '게시판유형코드']
  "bbs30_use_yn" "character varying(5)" [note: '사용여부']
  "bbs30_public_yn" "character varying(5)" [note: '전체 사용여부']

  Note: '게시판분류'
}

Table "public"."bbs31_content" {
  "bbs31_content_id" "numeric" [pk, note: '게시판내용ID(PK)']
  "bbs31_company_id" "numeric" [not null, note: '회사ID']
  "bbs31_class_tree_id" "numeric" [not null, note: '게시판분류ID']
  "bbs31_person_id" "numeric" [not null, note: '등록자ID']
  "bbs31_title" "character varying(400)" [note: '제목']
  "bbs31_reg_date" "timestamp without time zone" [note: '등록일']
  "bbs31_content" "text" [note: '내용']
  "bbs31_note" "text" [note: '비고']
  "bbs31_time" "character varying(10)"
  "bbs31_hide_yn" "character varying(5)"

  Note: '게시판내용'
}

Table "public"."bbs32_comment" {
  "bbs32_comment_id" "numeric" [pk, note: '게시판댓글ID(PK)']
  "bbs32_company_id" "numeric" [not null, note: '회사ID']
  "bbs32_person_id" "numeric" [not null, note: '사원ID']
  "bbs32_content_id" "numeric" [not null, note: '게시판내용ID']
  "bbs32_reg_date" "timestamp without time zone" [note: '등록일']
  "bbs32_comment" "text" [note: '댓글내용']
  "bbs32_time" "character varying(10)"

  Note: '게시판 댓글'
}

Table "public"."bbs33_role" {
  "bbs33_role_id" "numeric" [pk, note: '게시판분류권한ID(PK)']
  "bbs33_class_tree_id" "numeric" [not null, note: '게시판분류ID']
  "bbs33_role_cd" "character varying(5)" [not null, note: '사원/조직']
  "bbs33_person_id" "numeric" [note: '사원ID']
  "bbs33_org_code_id" "numeric" [note: '조직코드ID']
  "bbs33_note" "text" [note: '비고']

  Note: '게시판분류권한'
}

```
