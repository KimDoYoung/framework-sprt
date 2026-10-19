# 도메인: bbs

화면 13개, 컴포넌트 6개, 서버 클래스 18개, 매퍼 18개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Bbs02_Tab_NoticeAdmin`](screens/Bbs02_Tab_NoticeAdmin.md) | 커뮤니티 > 02. 공지사항 > KFS공지등록 | 4 | 15 |
| [`Bbs02_Tab_NoticeManager`](screens/Bbs02_Tab_NoticeManager.md) | 커뮤니티 > 02. 공지사항 > 사내공지등록 | 5 | 15 |
| [`Bbs02_Tab_NoticeView`](screens/Bbs02_Tab_NoticeView.md) | 커뮤니티 > 02. 공지사항 > 공지사항 | 1 | 2 |
| [`Bbs02_Tab_NoticeViewLaw`](screens/Bbs02_Tab_NoticeViewLaw.md) | 준법감시 > 00. 법규정보 > 법규공지 | 1 | 3 |
| [`Bbs02_Tab_NoticeViewMgt`](screens/Bbs02_Tab_NoticeViewMgt.md) | 경영관리 > 00. 경영정보 > 경영공지 | 1 | 3 |
| [`Bbs10_Tab_BizShare`](screens/Bbs10_Tab_BizShare.md) | 커뮤니티 > 03. 업무활동 > 업무공유 | 2 | 3 |
| [`Bbs11_Tab_Application`](screens/Bbs11_Tab_Application.md) | 신청 > 90. 기타신청 > 기타신청서 작성 | 2 | 5 |
| [`Bbs11_Tab_ApplicationMng`](screens/Bbs11_Tab_ApplicationMng.md) | 경영관리 > 90. 신청서관리 > 기타신청서 확인 | 2 | 8 |
| [`Bbs15_Tab_CompanyRule`](screens/Bbs15_Tab_CompanyRule.md) | 준법감시 > 02. 회사규정 > 회사규정; 커뮤니티 > 01. 회사규정 > 회사규정 | 2 | 2 |
| [`Bbs15_Tab_CompanyRuleManager`](screens/Bbs15_Tab_CompanyRuleManager.md) | 준법감시 > 02. 회사규정 > 회사규정(관리자); 커뮤니티 > 01. 회사규정 > 회사규정(관리자); 기초자료 > 10. 책무 > 회사규정관리 | 3 | 8 |
| [`Bbs20_Tab_FloralRequest`](screens/Bbs20_Tab_FloralRequest.md) | 신청 > 90. 기타신청 > 화환 신청 | 3 | 8 |
| [`Bbs20_Tab_FloralRequestMng`](screens/Bbs20_Tab_FloralRequestMng.md) | 경영관리 > 90. 신청서관리 > 화환신청 확인 | 4 | 9 |
| [`Bbs30_Tab_ClassTree`](screens/Bbs30_Tab_ClassTree.md) | 커뮤니티 > 05. 게시판 > 게시판 | 9 | 23 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Bbs02_Lookup_File`](components/Bbs02_Lookup_File.md) | mrb, sch | 1 | 2 |
| [`Bbs02_Lookup_NoticeAdmin`](components/Bbs02_Lookup_NoticeAdmin.md) | frm | 1 | 2 |
| [`Bbs02_Popup_Notice`](components/Bbs02_Popup_Notice.md) | frm | 3 | 6 |
| [`Bbs02_Popup_NoticeAdmin`](components/Bbs02_Popup_NoticeAdmin.md) | frm | 3 | 7 |
| [`Bbs15_Lookup_CompanyRule`](components/Bbs15_Lookup_CompanyRule.md) | tdm | 1 | 1 |
| [`Bbs20_Edit_FloralRequest`](components/Bbs20_Edit_FloralRequest.md) | frm | 4 | 12 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`bbs.Bbs01_Board`](../bbs/services/Bbs01_Board.md) | 5 |
| [`bbs.Bbs02_Notice`](../bbs/services/Bbs02_Notice.md) | 18 |
| [`bbs.Bbs03_Target`](../bbs/services/Bbs03_Target.md) | 5 |
| [`bbs.Bbs04_TargetCompany`](../bbs/services/Bbs04_TargetCompany.md) | 5 |
| [`bbs.Bbs05_History`](../bbs/services/Bbs05_History.md) | 4 |
| [`bbs.Bbs07_Comment`](../bbs/services/Bbs07_Comment.md) | 6 |
| [`bbs.Bbs09_NoticeHistory`](../bbs/services/Bbs09_NoticeHistory.md) | 5 |
| [`bbs.Bbs10_BizShare`](../bbs/services/Bbs10_BizShare.md) | 5 |
| [`bbs.Bbs11_Application`](../bbs/services/Bbs11_Application.md) | 8 |
| [`bbs.Bbs12_ApplicationForm`](../bbs/services/Bbs12_ApplicationForm.md) | 7 |
| [`bbs.Bbs15_CompanyRule`](../bbs/services/Bbs15_CompanyRule.md) | 6 |
| [`bbs.Bbs20_FloralRequest`](../bbs/services/Bbs20_FloralRequest.md) | 7 |
| [`bbs.Bbs21_FloralRequestShare`](../bbs/services/Bbs21_FloralRequestShare.md) | 7 |
| [`bbs.Bbs22_FloralMessage`](../bbs/services/Bbs22_FloralMessage.md) | 6 |
| [`bbs.Bbs30_ClassTree`](../bbs/services/Bbs30_ClassTree.md) | 10 |
| [`bbs.Bbs31_Content`](../bbs/services/Bbs31_Content.md) | 8 |
| [`bbs.Bbs32_Comment`](../bbs/services/Bbs32_Comment.md) | 6 |
| [`bbs.Bbs33_Role`](../bbs/services/Bbs33_Role.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`bbs01_board`](sql/bbs01_board.md) | 4 |
| [`bbs02_notice`](sql/bbs02_notice.md) | 24 |
| [`bbs03_target`](sql/bbs03_target.md) | 4 |
| [`bbs04_target_company`](sql/bbs04_target_company.md) | 5 |
| [`bbs05_history`](sql/bbs05_history.md) | 3 |
| [`bbs07_comment`](sql/bbs07_comment.md) | 3 |
| [`bbs09_notice_history`](sql/bbs09_notice_history.md) | 3 |
| [`bbs10_biz_share`](sql/bbs10_biz_share.md) | 2 |
| [`bbs11_application`](sql/bbs11_application.md) | 5 |
| [`bbs12_application_form`](sql/bbs12_application_form.md) | 7 |
| [`bbs15_company_rule`](sql/bbs15_company_rule.md) | 8 |
| [`bbs20_floral_request`](sql/bbs20_floral_request.md) | 3 |
| [`bbs21_floral_request_share`](sql/bbs21_floral_request_share.md) | 5 |
| [`bbs22_floral_message`](sql/bbs22_floral_message.md) | 5 |
| [`bbs30_class_tree`](sql/bbs30_class_tree.md) | 8 |
| [`bbs31_content`](sql/bbs31_content.md) | 5 |
| [`bbs32_comment`](sql/bbs32_comment.md) | 3 |
| [`bbs33_role`](sql/bbs33_role.md) | 3 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Bbs01_Edit_Board` | `client/vi/bbs/Bbs01_Edit_Board.java` | `bbs.Bbs01_Board.delete` |
| `Bbs01_Lookup_BoardInsert` | `client/vi/bbs/Bbs01_Lookup_BoardInsert.java` | `bbs.Bbs01_Board.update` |
| `Bbs01_Lookup_BoardUpdate` | `client/vi/bbs/Bbs01_Lookup_BoardUpdate.java` | `bbs.Bbs01_Board.delete`, `bbs.Bbs01_Board.update` |
| `Bbs01_Tab_Board` | `client/vi/bbs/Bbs01_Tab_Board.java` | `bbs.Bbs01_Board.delete`, `bbs.Bbs01_Board.selectByCompanyId` |
| `Bbs01_Tab_BoardManager` | `client/vi/bbs/Bbs01_Tab_BoardManager.java` | `bbs.Bbs01_Board.delete`, `bbs.Bbs01_Board.selectByCompanyId` |
| `Edit_BoardOriginal` | `client/vi/bbs/Edit_BoardOriginal.java` | `bbs.Bbs01_Board.delete`, `bbs.Bbs01_Board.update` |
| `Grid_File` | `client/vi/bbs/Grid_File.java` | `sys.File.delete`, `sys.File.selectByParentId` |
| `Grid_FileDownload` | `client/vi/bbs/Grid_FileDownload.java` | `sys.File.delete`, `sys.File.selectByParentId` |
| `Page_Board` | `client/vi/bbs/Page_Board.java` | `bbs.Bbs01_Board.selectByCompanyId` |
