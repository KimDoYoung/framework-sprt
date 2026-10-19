# 도메인: dcr

화면 16개, 컴포넌트 10개, 서버 클래스 14개, 매퍼 14개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Dcr00_Tab_ApprList`](screens/Dcr00_Tab_ApprList.md) | 문서작성 > 02. 문서검색 > 문서 다운로드 | 1 | 3 |
| [`Dcr00_Tab_DocList`](screens/Dcr00_Tab_DocList.md) | 문서작성 > 02. 문서검색 > 통합 문서검색 | 1 | 2 |
| [`Dcr00_Tab_Download`](screens/Dcr00_Tab_Download.md) | - | 1 | 2 |
| [`Dcr00_Tab_FileList`](screens/Dcr00_Tab_FileList.md) | 문서작성 > 02. 문서검색 > 문서별 첨부파일 검색 | 1 | 1 |
| [`Dcr01_Tab_ClassTree`](screens/Dcr01_Tab_ClassTree.md) | 관리자 > 03. 문서관리 > 문서분류; 기초자료 > 20. 문서(전자결재) > 문서분류 | 13 | 24 |
| [`Dcr01_Tab_DcrClassModify`](screens/Dcr01_Tab_DcrClassModify.md) | 관리자 > 03. 문서관리 > 문서이동 | 3 | 3 |
| [`Dcr01_Tab_DcrManager`](screens/Dcr01_Tab_DcrManager.md) | 관리자 > 03. 문서관리 > 업무별 문서작성(관리자) | 1 | 1 |
| [`Dcr01_Tab_DcrUser`](screens/Dcr01_Tab_DcrUser.md) | 문서작성 > 01. 문서작성 > 업무별 문서작성 | 1 | 1 |
| [`Dcr01_Tab_DcrWrite`](screens/Dcr01_Tab_DcrWrite.md) | 문서작성 > 01. 문서작성 > 신규 문서작성 | 2 | 10 |
| [`Dcr03_Tab_DcrAuth`](screens/Dcr03_Tab_DcrAuth.md) | 관리자 > 02. 문서권한관리 > 문서분류별 조직 맵핑 | 2 | 4 |
| [`Dcr03_Tab_OrgAuth`](screens/Dcr03_Tab_OrgAuth.md) | 관리자 > 02. 문서권한관리 > 조직별 문서분류 맵핑 | 2 | 5 |
| [`Dcr04_Tab_EmpAuth`](screens/Dcr04_Tab_EmpAuth.md) | 관리자 > 02. 문서권한관리 > 조회권한 예외사원 등록 | 4 | 7 |
| [`Dcr05_Tab_DocType`](screens/Dcr05_Tab_DocType.md) | 문서작성 > 03. 파일 및 양식관리 > 문서양식등록; 기초자료 > 20. 문서(전자결재) > 문서양식등록 | 3 | 6 |
| [`Dcr10_Tab_MailHistory`](screens/Dcr10_Tab_MailHistory.md) | 문서작성 > 05. 메일관리 > 발신메일목록 | 2 | 3 |
| [`Dcr10_Tab_MailHistory_Manager`](screens/Dcr10_Tab_MailHistory_Manager.md) | 관리자 > 04. 전자결재 > 발신메일 목록(관리자) | 2 | 3 |
| [`Dcr30_Tab_LinkAdmin`](screens/Dcr30_Tab_LinkAdmin.md) | 기초자료 > 20. 문서(전자결재) > 문서분류지정 | 3 | 9 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Dcr00_Lookup_FundPlan`](components/Dcr00_Lookup_FundPlan.md) | fnd | 4 | 3 |
| [`Dcr01_Lookup_Class`](components/Dcr01_Lookup_Class.md) | act, biz, bmt, com, emp, est, flt, fnd, ics, pay, sch, sys, tdm | 1 | 1 |
| [`Dcr01_Lookup_ClassTree`](components/Dcr01_Lookup_ClassTree.md) | pln | 1 | 1 |
| [`Dcr01_Lookup_DcrClass`](components/Dcr01_Lookup_DcrClass.md) | apr, fbx | 1 | 2 |
| [`Dcr01_Lookup_SelectMulti`](components/Dcr01_Lookup_SelectMulti.md) | tdm | 1 | 1 |
| [`Dcr05_Lookup_FormView`](components/Dcr05_Lookup_FormView.md) | apr | 1 | 2 |
| [`Dcr10_Lookup_MailSender`](components/Dcr10_Lookup_MailSender.md) | apr, biz, emp | 1 | 6 |
| [`Dcr30_Lookup_Link`](components/Dcr30_Lookup_Link.md) | apr, ast, biz, emp, fnd, pay, sch | 2 | 6 |
| [`Dcr30_Move_DcrClass`](components/Dcr30_Move_DcrClass.md) | act, apr, ast, biz, car, emp, flt, ics, pay | 1 | 2 |
| [`Dcr40_Lookup_StampAuth`](components/Dcr40_Lookup_StampAuth.md) | apr | 1 | 2 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`dcr.Dcr00_DocList`](../dcr/services/Dcr00_DocList.md) | 5 |
| [`dcr.Dcr01_ClassTree`](../dcr/services/Dcr01_ClassTree.md) | 22 |
| [`dcr.Dcr03_OrgAuth`](../dcr/services/Dcr03_OrgAuth.md) | 4 |
| [`dcr.Dcr04_EmpAuth`](../dcr/services/Dcr04_EmpAuth.md) | 7 |
| [`dcr.Dcr05_DocType`](../dcr/services/Dcr05_DocType.md) | 9 |
| [`dcr.Dcr06_RelateDocType`](../dcr/services/Dcr06_RelateDocType.md) | 4 |
| [`dcr.Dcr07_ClassDetail`](../dcr/services/Dcr07_ClassDetail.md) | 4 |
| [`dcr.Dcr08_OftenUse`](../dcr/services/Dcr08_OftenUse.md) | 5 |
| [`dcr.Dcr10_MailHistory`](../dcr/services/Dcr10_MailHistory.md) | 7 |
| [`dcr.Dcr11_MailFileHistory`](../dcr/services/Dcr11_MailFileHistory.md) | 3 |
| [`dcr.Dcr20_RelateIcs`](../dcr/services/Dcr20_RelateIcs.md) | 5 |
| [`dcr.Dcr21_RelateIcr`](../dcr/services/Dcr21_RelateIcr.md) | 5 |
| [`dcr.Dcr30_Link`](../dcr/services/Dcr30_Link.md) | 14 |
| [`dcr.Dcr40_StampAuth`](../dcr/services/Dcr40_StampAuth.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`dcr00_doc_list`](sql/dcr00_doc_list.md) | 5 |
| [`dcr01_class_tree`](sql/dcr01_class_tree.md) | 43 |
| [`dcr03_org_auth`](sql/dcr03_org_auth.md) | 6 |
| [`dcr04_emp_auth`](sql/dcr04_emp_auth.md) | 8 |
| [`dcr05_doc_type`](sql/dcr05_doc_type.md) | 8 |
| [`dcr06_relate_doc_Type`](sql/dcr06_relate_doc_Type.md) | 4 |
| [`dcr07_class_detail`](sql/dcr07_class_detail.md) | 2 |
| [`dcr08_often_use`](sql/dcr08_often_use.md) | 3 |
| [`dcr10_mail_history`](sql/dcr10_mail_history.md) | 4 |
| [`dcr11_mail_file_history`](sql/dcr11_mail_file_history.md) | 2 |
| [`dcr20_relate_ics`](sql/dcr20_relate_ics.md) | 11 |
| [`dcr21_relate_icr`](sql/dcr21_relate_icr.md) | 11 |
| [`dcr30_link`](sql/dcr30_link.md) | 13 |
| [`dcr40_stamp_auth`](sql/dcr40_stamp_auth.md) | 3 |

