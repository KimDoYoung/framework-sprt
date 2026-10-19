# 도메인: apr

화면 33개, 컴포넌트 14개, 서버 클래스 33개, 매퍼 33개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Apr01_Tab_BizPriorApproval`](screens/Apr01_Tab_BizPriorApproval.md) | 준법감시 > 40. 이익제공(수령)현황 > 이익제공 사전승인신청 | 1 | 2 |
| [`Apr01_Tab_ExternalBiz`](screens/Apr01_Tab_ExternalBiz.md) | 신청 > 90. 기타신청 > 대외활동 신청서 작성 | 1 | 2 |
| [`Apr01_Tab_FundDocument`](screens/Apr01_Tab_FundDocument.md) | 문서작성 > 02. 문서검색 > 펀드별 문서검색 | 2 | 2 |
| [`Apr01_Tab_ItemDocument`](screens/Apr01_Tab_ItemDocument.md) | 문서작성 > 02. 문서검색 > (X)종목별 문서검색 | 2 | 2 |
| [`Apr01_Tab_MyApproveList`](screens/Apr01_Tab_MyApproveList.md) | 문서작성 > 04. 전자결재 > 결재내역 조회 | 1 | 2 |
| [`Apr01_Tab_MyAuthList`](screens/Apr01_Tab_MyAuthList.md) | 문서작성 > 04. 전자결재 > 공람내역 조회 | 1 | 3 |
| [`Apr01_Tab_MyReferenceList`](screens/Apr01_Tab_MyReferenceList.md) | 문서작성 > 04. 전자결재 > 참조내역 조회 | 1 | 3 |
| [`Apr01_Tab_MyRequestList`](screens/Apr01_Tab_MyRequestList.md) | 문서작성 > 04. 전자결재 > 상신내역 조회 | 1 | 4 |
| [`Apr01_Tab_Restore`](screens/Apr01_Tab_Restore.md) | 관리자 > 03. 문서관리 > 폐기문서 복구 | 1 | 2 |
| [`Apr01_Tab_StampSeq`](screens/Apr01_Tab_StampSeq.md) | 문서작성 > 04. 전자결재 > (X)인감대장 | 1 | 3 |
| [`Apr01_Tab_SubList`](screens/Apr01_Tab_SubList.md) | 문서작성 > 06. 문서작성현황 > 건별명세 | 1 | 1 |
| [`Apr01_Tab_TotalList`](screens/Apr01_Tab_TotalList.md) | 문서작성 > 06. 문서작성현황 > 운영현황표 | 1 | 1 |
| [`Apr06_Tab_ApprStepRule`](screens/Apr06_Tab_ApprStepRule.md) | - | 1 | 3 |
| [`Apr07_Tab_AltAppr`](screens/Apr07_Tab_AltAppr.md) | 문서작성 > 04. 전자결재 > 대결자 지정 | 1 | 4 |
| [`Apr07_Tab_AltApprMgr`](screens/Apr07_Tab_AltApprMgr.md) | 관리자 > 04. 전자결재 > 대결자 지정(관리자) | 1 | 4 |
| [`Apr08_Tab_ApprRole`](screens/Apr08_Tab_ApprRole.md) | 문서작성 > 05. 메일관리 > (X)직책별 결재자 등록 | 1 | 3 |
| [`Apr09_Tab_ApprAgree`](screens/Apr09_Tab_ApprAgree.md) | - | 1 | 3 |
| [`Apr10_Tab_Stamp`](screens/Apr10_Tab_Stamp.md) | 문서작성 > 04. 전자결재 > 사용인감등록 | 2 | 4 |
| [`Apr11_Tab_AdvertBook`](screens/Apr11_Tab_AdvertBook.md) | - | 1 | 2 |
| [`Apr15_Tab_ReprCorp`](screens/Apr15_Tab_ReprCorp.md) | 문서작성 > 04. 전자결재 > 추가 대표명의 등록 | 1 | 3 |
| [`Apr16_Tab_StampDocAppl`](screens/Apr16_Tab_StampDocAppl.md) | 신청 > 90. 기타신청 > 법인서류 및 날인 신청 | 3 | 6 |
| [`Apr16_Tab_StampDocManager`](screens/Apr16_Tab_StampDocManager.md) | 경영관리 > 91. 법인서류 > 법인서류 매수관리 | 5 | 12 |
| [`Apr16_Tab_StampFileCheck`](screens/Apr16_Tab_StampFileCheck.md) | 경영관리 > 91. 법인서류 > 인감날인본 업로드확인 | 1 | 2 |
| [`Apr16_Tab_StampList`](screens/Apr16_Tab_StampList.md) | 경영관리 > 91. 법인서류 > 인감날인대장 | 2 | 4 |
| [`Apr16_Tab_StampListOrg`](screens/Apr16_Tab_StampListOrg.md) | 경영관리 > 91. 법인서류 > 부서 인감날인대장 | 2 | 4 |
| [`Apr17_Tab_CorpDoc`](screens/Apr17_Tab_CorpDoc.md) | 경영관리 > 91. 법인서류 > 구)법인서류 매수관리 | 3 | 11 |
| [`Apr17_Tab_CorpDocApp`](screens/Apr17_Tab_CorpDocApp.md) | 신청 > 90. 기타신청 > 구)법인서류 및 날인 신청 | 3 | 11 |
| [`Apr19_Tab_StampFileCheck`](screens/Apr19_Tab_StampFileCheck.md) | 경영관리 > 91. 법인서류 > 구)인감날인본 업로드확인 | 2 | 3 |
| [`Apr19_Tab_StampList`](screens/Apr19_Tab_StampList.md) | 경영관리 > 91. 법인서류 > 구)인감날인대장 | 2 | 4 |
| [`Apr30_Tab_ApprStepGroup`](screens/Apr30_Tab_ApprStepGroup.md) | 관리자 > 03. 문서관리 > 문서결재선 그룹관리 | 2 | 7 |
| [`Apr90_Tab_DisposalAppr`](screens/Apr90_Tab_DisposalAppr.md) | 문서작성 > 02. 문서검색 > 폐기문서 승인 | 1 | 3 |
| [`Apr90_Tab_DisposalList`](screens/Apr90_Tab_DisposalList.md) | 문서작성 > 01. 문서작성 > 폐기문서 신청현황 | 1 | 2 |
| [`Apr90_Tab_DisposalListAdmin`](screens/Apr90_Tab_DisposalListAdmin.md) | 관리자 > 03. 문서관리 > 폐기문서 승인(관리자) | 1 | 3 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Apr01_Edit_ApprDoc`](components/Apr01_Edit_ApprDoc.md) | act, ast, att, biz, bmt, car, com, dcr, emp, est, flt, fnd, frm, icam, ics, opr, pay, pln, sch, sys, tdm | 31 | 132 |
| [`Apr01_Grid_DocList`](components/Apr01_Grid_DocList.md) | dcr | 1 | 2 |
| [`Apr01_Lookup_ApprFileList`](components/Apr01_Lookup_ApprFileList.md) | sys | 1 | 2 |
| [`Apr01_Lookup_ApprLink`](components/Apr01_Lookup_ApprLink.md) | flt, tdm | 1 | 2 |
| [`Apr03_TabPage_Relate`](components/Apr03_TabPage_Relate.md) | dcr | 1 | 2 |
| [`Apr05_Lookup_LoadDoc`](components/Apr05_Lookup_LoadDoc.md) | act, biz, bmt | 2 | 3 |
| [`Apr05_Lookup_LoadDoc2`](components/Apr05_Lookup_LoadDoc2.md) | com, pay | 1 | 1 |
| [`Apr07_Lookup_AltAppr`](components/Apr07_Lookup_AltAppr.md) | emp | 1 | 4 |
| [`Apr10_Lookup_DocStamp`](components/Apr10_Lookup_DocStamp.md) | dcr | 1 | 2 |
| [`Apr10_Lookup_Stamp`](components/Apr10_Lookup_Stamp.md) | dcr | 1 | 3 |
| [`Apr30_Lookup_ApprStepGroup`](components/Apr30_Lookup_ApprStepGroup.md) | dcr | 1 | 1 |
| [`Apr40_Lookup_DownloadHistory`](components/Apr40_Lookup_DownloadHistory.md) | dcr | 1 | 1 |
| [`Apr42_Lookup_CommentView`](components/Apr42_Lookup_CommentView.md) | dcr | 2 | 4 |
| [`Apr50_Lookup_ApprList`](components/Apr50_Lookup_ApprList.md) | dcr | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`apr.Apr00_StampSeq`](../apr/services/Apr00_StampSeq.md) | 2 |
| [`apr.Apr01_Appr`](../apr/services/Apr01_Appr.md) | 46 |
| [`apr.Apr01_ApprTemp`](../apr/services/Apr01_ApprTemp.md) | 2 |
| [`apr.Apr03_RelateFund`](../apr/services/Apr03_RelateFund.md) | 9 |
| [`apr.Apr04_ApprStep`](../apr/services/Apr04_ApprStep.md) | 16 |
| [`apr.Apr05_RelateDoc`](../apr/services/Apr05_RelateDoc.md) | 5 |
| [`apr.Apr06_ApprStepRule`](../apr/services/Apr06_ApprStepRule.md) | 3 |
| [`apr.Apr07_AltAppr`](../apr/services/Apr07_AltAppr.md) | 10 |
| [`apr.Apr08_ApprRole`](../apr/services/Apr08_ApprRole.md) | 4 |
| [`apr.Apr09_ApprAgree`](../apr/services/Apr09_ApprAgree.md) | 4 |
| [`apr.Apr10_Stamp`](../apr/services/Apr10_Stamp.md) | 12 |
| [`apr.Apr11_AdvertBook`](../apr/services/Apr11_AdvertBook.md) | 3 |
| [`apr.Apr12_RelateAdv`](../apr/services/Apr12_RelateAdv.md) | 3 |
| [`apr.Apr13_PersonAuth`](../apr/services/Apr13_PersonAuth.md) | 4 |
| [`apr.Apr14_RelateAst`](../apr/services/Apr14_RelateAst.md) | 3 |
| [`apr.Apr15_ReprCorp`](../apr/services/Apr15_ReprCorp.md) | 5 |
| [`apr.Apr16_StampDoc`](../apr/services/Apr16_StampDoc.md) | 18 |
| [`apr.Apr17_CorpDoc`](../apr/services/Apr17_CorpDoc.md) | 12 |
| [`apr.Apr18_RelateCorpDoc`](../apr/services/Apr18_RelateCorpDoc.md) | 5 |
| [`apr.Apr19_RelateStamp`](../apr/services/Apr19_RelateStamp.md) | 9 |
| [`apr.Apr20_RelateIcs`](../apr/services/Apr20_RelateIcs.md) | 12 |
| [`apr.Apr21_RelateAppr`](../apr/services/Apr21_RelateAppr.md) | 5 |
| [`apr.Apr22_RelateIcr`](../apr/services/Apr22_RelateIcr.md) | 12 |
| [`apr.Apr30_ApprStepGroup`](../apr/services/Apr30_ApprStepGroup.md) | 4 |
| [`apr.Apr31_ApprStepGroupMember`](../apr/services/Apr31_ApprStepGroupMember.md) | 4 |
| [`apr.Apr40_DownloadHistory`](../apr/services/Apr40_DownloadHistory.md) | 7 |
| [`apr.Apr41_OpenHistory`](../apr/services/Apr41_OpenHistory.md) | 4 |
| [`apr.Apr42_Comment`](../apr/services/Apr42_Comment.md) | 6 |
| [`apr.Apr50_Bookmark`](../apr/services/Apr50_Bookmark.md) | 9 |
| [`apr.Apr90_DisposalList`](../apr/services/Apr90_DisposalList.md) | 8 |
| [`apr.Apr91_DisposalHistory`](../apr/services/Apr91_DisposalHistory.md) | 4 |
| [`apr.Apr92_ApprModi`](../apr/services/Apr92_ApprModi.md) | 6 |
| [`apr.Apr99_ApprDel`](../apr/services/Apr99_ApprDel.md) | 3 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`apr00_stamp_seq`](sql/apr00_stamp_seq.md) | 1 |
| [`apr01_appr`](sql/apr01_appr.md) | 53 |
| [`apr01_appr_temp`](sql/apr01_appr_temp.md) | 2 |
| [`apr03_relate_fund`](sql/apr03_relate_fund.md) | 13 |
| [`apr04_appr_step`](sql/apr04_appr_step.md) | 27 |
| [`apr05_relate_doc`](sql/apr05_relate_doc.md) | 4 |
| [`apr06_appr_step_rule`](sql/apr06_appr_step_rule.md) | 3 |
| [`apr07_alt_appr`](sql/apr07_alt_appr.md) | 13 |
| [`apr08_appr_role`](sql/apr08_appr_role.md) | 2 |
| [`apr09_appr_agree`](sql/apr09_appr_agree.md) | 3 |
| [`apr10_stamp`](sql/apr10_stamp.md) | 16 |
| [`apr11_advert_book`](sql/apr11_advert_book.md) | 5 |
| [`apr12_relate_adv`](sql/apr12_relate_adv.md) | 3 |
| [`apr13_person_auth`](sql/apr13_person_auth.md) | 3 |
| [`apr14_relate_ast`](sql/apr14_relate_ast.md) | 3 |
| [`apr15_repr_corp`](sql/apr15_repr_corp.md) | 3 |
| [`apr16_stamp_doc`](sql/apr16_stamp_doc.md) | 18 |
| [`apr17_corp_doc`](sql/apr17_corp_doc.md) | 10 |
| [`apr18_relate_corp_doc`](sql/apr18_relate_corp_doc.md) | 3 |
| [`apr19_relate_stamp`](sql/apr19_relate_stamp.md) | 8 |
| [`apr20_relate_ics`](sql/apr20_relate_ics.md) | 5 |
| [`apr21_relate_appr`](sql/apr21_relate_appr.md) | 3 |
| [`apr22_relate_icr`](sql/apr22_relate_icr.md) | 5 |
| [`apr30_appr_step_group`](sql/apr30_appr_step_group.md) | 2 |
| [`apr31_appr_step_group_member`](sql/apr31_appr_step_group_member.md) | 3 |
| [`apr40_download_history`](sql/apr40_download_history.md) | 5 |
| [`apr41_open_history`](sql/apr41_open_history.md) | 5 |
| [`apr42_comment`](sql/apr42_comment.md) | 3 |
| [`apr50_bookmark`](sql/apr50_bookmark.md) | 10 |
| [`apr90_disposal_list`](sql/apr90_disposal_list.md) | 6 |
| [`apr91_disposal_history`](sql/apr91_disposal_history.md) | 2 |
| [`apr92_appr_modi`](sql/apr92_appr_modi.md) | 5 |
| [`apr99_appr_del`](sql/apr99_appr_del.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Apr05_Grid_RelateDocList` | `client/vi/apr/Apr05_Grid_RelateDocList.java` | `apr.Apr05_RelateDoc.selectByClassTreeId` |
| `Apr05_Lookup_RelateDoc` | `client/vi/apr/Apr05_Lookup_RelateDoc.java` | `dcr.Dcr01_ClassTree.selectByCompanyIdRole` |
| `Apr18_Grid_RelateCorpDoc_20260904` | `client/vi/apr/Apr18_Grid_RelateCorpDoc_20260904.java` | `apr.Apr04_ApprStep.checkApprId`, `apr.Apr17_CorpDoc.selectByApprId` |
| `Apr18_Lookup_Appr` | `client/vi/apr/Apr18_Lookup_Appr.java` | `apr.Apr01_Appr.getApprId`, `apr.Apr01_Appr.selectById` |
| `Apr19_Grid_List_20260904` | `client/vi/apr/Apr19_Grid_List_20260904.java` | `apr.Apr19_RelateStamp.delete`, `apr.Apr19_RelateStamp.modelUpdate`, `apr.Apr19_RelateStamp.selectByApprId`, `apr.Apr19_RelateStamp.update` |
| `Apr19_Tab_OrgStampList` | `client/vi/apr/Apr19_Tab_OrgStampList.java` | `apr.Apr19_RelateStamp.selectById`, `apr.Apr19_RelateStamp.selectByOrgCodeId`, `sys.Sys99_Print.insertRdOrgStampList` |
| `Apr20_Edit_RelateIcs` | `client/vi/apr/Apr20_Edit_RelateIcs.java` | `apr.Apr20_RelateIcs.modelUpdate` |
| `Apr20_Grid_RelateIcs` | `client/vi/apr/Apr20_Grid_RelateIcs.java` | `apr.Apr20_RelateIcs.selectByApprId` |
| `Apr31_Edit_ApprStep` | `client/vi/apr/Apr31_Edit_ApprStep.java` | `emp.Emp00_TransInfo.selectByOrgCodeId` |
