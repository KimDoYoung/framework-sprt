# 도메인: ics

화면 28개, 컴포넌트 12개, 서버 클래스 23개, 매퍼 23개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Ics01_Tab_ApprList`](screens/Ics01_Tab_ApprList.md) | 문서작성 > 01. 문서작성 > 법규별 문서작성 | 2 | 2 |
| [`Ics01_Tab_ClassTree`](screens/Ics01_Tab_ClassTree.md) | 기초자료 > 00. 내부통제 > 법규관리(관리자) | 12 | 18 |
| [`Ics01_Tab_ClassTreeUser`](screens/Ics01_Tab_ClassTreeUser.md) | 준법감시 > 01. 법규관리 > 법규관리 | 9 | 18 |
| [`Ics01_Tab_ClassTreeUserView`](screens/Ics01_Tab_ClassTreeUserView.md) | 준법감시 > 00. 법규정보 > 법규조회 | 6 | 8 |
| [`Ics01_Tab_FileList`](screens/Ics01_Tab_FileList.md) | - | 1 | 1 |
| [`Ics01_Tab_IcsFileUpload`](screens/Ics01_Tab_IcsFileUpload.md) | 기초자료 > 00. 내부통제 > 법규보고 서식파일 등록 | 2 | 3 |
| [`Ics01_Tab_IcsFileUser`](screens/Ics01_Tab_IcsFileUser.md) | 준법감시 > 00. 법규정보 > 법규보고 서식파일 | 1 | 1 |
| [`Ics01_Tab_PeriodList`](screens/Ics01_Tab_PeriodList.md) | 준법감시 > 00. 법규정보 > 월별 법규조회 | 3 | 5 |
| [`Ics02_Tab_IcsList`](screens/Ics02_Tab_IcsList.md) | 준법감시 > 90. 법규통제 현황(사용X) > 법규통제 운영현황표 | 1 | 1 |
| [`Ics02_Tab_Manager`](screens/Ics02_Tab_Manager.md) | 준법감시 > 01. 법규관리 > 법규 관리그룹 등록 | 2 | 8 |
| [`Ics10_Tab_Checklist`](screens/Ics10_Tab_Checklist.md) | 준법감시 > 30. 내부통제 체크리스트 > 내부통제 체크리스트 관리 | 7 | 18 |
| [`Ics10_Tab_ChecklistAdmin`](screens/Ics10_Tab_ChecklistAdmin.md) | 기초자료 > 00. 내부통제 > 내부통제 체크리스트(관리자) | 4 | 14 |
| [`Ics15_Tab_ChecklistConfirm`](screens/Ics15_Tab_ChecklistConfirm.md) | 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 확인(부서장) | 4 | 14 |
| [`Ics15_Tab_ChecklistStatus`](screens/Ics15_Tab_ChecklistStatus.md) | 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 현황(준감인) | 3 | 7 |
| [`Ics15_Tab_ChecklistStatusDetail`](screens/Ics15_Tab_ChecklistStatusDetail.md) | 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 상세(준감인) | 3 | 7 |
| [`Ics15_Tab_ChecklistWrite`](screens/Ics15_Tab_ChecklistWrite.md) | 준법감시 > 30. 내부통제 체크리스트 > 내부통제 체크리스트 작성 | 3 | 11 |
| [`Ics17_Tab_UserRequest`](screens/Ics17_Tab_UserRequest.md) | 준법감시 > 01. 법규관리 > 법규등록신청 | 4 | 6 |
| [`Ics17_Tab_UserRequestAdmin`](screens/Ics17_Tab_UserRequestAdmin.md) | 기초자료 > 00. 내부통제 > 법규등록신청확인 | 4 | 6 |
| [`Ics20_Tab_RevisionHistory`](screens/Ics20_Tab_RevisionHistory.md) | 준법감시 > 00. 법규정보 > 법규개정내역 | 3 | 3 |
| [`Ics20_Tab_RevisionHistoryAdmin`](screens/Ics20_Tab_RevisionHistoryAdmin.md) | 기초자료 > 00. 내부통제 > 법규개정내역 등록 | 3 | 6 |
| [`Ics30_Tab_Compliance`](screens/Ics30_Tab_Compliance.md) | 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수리스트 관리; 기초자료 > 00. 내부통제 > 임직원 내부통제 준수리스트 | 3 | 11 |
| [`Ics31_Tab_ComplianceConfirm`](screens/Ics31_Tab_ComplianceConfirm.md) | 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수점검(준감인) | 2 | 10 |
| [`Ics31_Tab_ComplianceReport`](screens/Ics31_Tab_ComplianceReport.md) | 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수보고(준감인) | 2 | 8 |
| [`Ics31_Tab_ComplianceWrite`](screens/Ics31_Tab_ComplianceWrite.md) | 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수확인서 작성 | 2 | 8 |
| [`Ics35_Tab_ExtrActivity`](screens/Ics35_Tab_ExtrActivity.md) | 준법감시 > 12. 대외활동 > 대외활동신청 | 3 | 7 |
| [`Ics35_Tab_ExtrActivityList`](screens/Ics35_Tab_ExtrActivityList.md) | 준법감시 > 12. 대외활동 > 대외활동 신청내역 | 1 | 1 |
| [`Ics40_Tab_DcrPreConfirm`](screens/Ics40_Tab_DcrPreConfirm.md) | 준법감시 > 90. 기타 > 준감인 사전확인대장 | 2 | 10 |
| [`Ics40_Tab_DcrReviewConfirm`](screens/Ics40_Tab_DcrReviewConfirm.md) | 준법감시 > 90. 기타 > 심사필 확인대장 | 1 | 2 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Ics01_Lookup_CheckList`](components/Ics01_Lookup_CheckList.md) | sch | 1 | 2 |
| [`Ics01_Lookup_ClassTreeDetail`](components/Ics01_Lookup_ClassTreeDetail.md) | sch, tdm | 1 | 1 |
| [`Ics01_Lookup_Content`](components/Ics01_Lookup_Content.md) | sch | 1 | 1 |
| [`Ics01_Lookup_Info`](components/Ics01_Lookup_Info.md) | sch | 1 | 2 |
| [`Ics01_Lookup_SelectMulti`](components/Ics01_Lookup_SelectMulti.md) | apr, dcr, icam, tdm | 1 | 2 |
| [`Ics01_Lookup_SelectParent`](components/Ics01_Lookup_SelectParent.md) | sch | 1 | 2 |
| [`Ics01_Move_IcsClass`](components/Ics01_Move_IcsClass.md) | apr | 1 | 3 |
| [`Ics01_Page_IcsFile`](components/Ics01_Page_IcsFile.md) | apr, sch, tdm | 1 | 1 |
| [`Ics01_Page_RevisionHistory`](components/Ics01_Page_RevisionHistory.md) | sch | 3 | 3 |
| [`Ics40_Edit_DcrPreconfirm`](components/Ics40_Edit_DcrPreconfirm.md) | apr | 2 | 5 |
| [`Ics40_Edit_Msg`](components/Ics40_Edit_Msg.md) | apr | 1 | 1 |
| [`IcsComboBoxField`](components/IcsComboBoxField.md) | sch | 1 | 1 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`ics.Ics01_ClassTree`](../ics/services/Ics01_ClassTree.md) | 19 |
| [`ics.Ics02_Manager`](../ics/services/Ics02_Manager.md) | 9 |
| [`ics.Ics03_CompanyInfo`](../ics/services/Ics03_CompanyInfo.md) | 5 |
| [`ics.Ics04_Share`](../ics/services/Ics04_Share.md) | 4 |
| [`ics.Ics05_RelateManager`](../ics/services/Ics05_RelateManager.md) | 6 |
| [`ics.Ics10_Checklist`](../ics/services/Ics10_Checklist.md) | 8 |
| [`ics.Ics11_ChecklistCompany`](../ics/services/Ics11_ChecklistCompany.md) | 7 |
| [`ics.Ics15_ChecklistWrite`](../ics/services/Ics15_ChecklistWrite.md) | 8 |
| [`ics.Ics16_RelateAppr`](../ics/services/Ics16_RelateAppr.md) | 6 |
| [`ics.Ics17_UserRequest`](../ics/services/Ics17_UserRequest.md) | 6 |
| [`ics.Ics19_RevisionRelateIcs`](../ics/services/Ics19_RevisionRelateIcs.md) | 4 |
| [`ics.Ics20_RevisionHistory`](../ics/services/Ics20_RevisionHistory.md) | 6 |
| [`ics.Ics21_ChecklistLClass`](../ics/services/Ics21_ChecklistLClass.md) | 5 |
| [`ics.Ics22_ChecklistLClassCompany`](../ics/services/Ics22_ChecklistLClassCompany.md) | 3 |
| [`ics.Ics23_ChecklistMClass`](../ics/services/Ics23_ChecklistMClass.md) | 5 |
| [`ics.Ics24_ChecklistMClassCompany`](../ics/services/Ics24_ChecklistMClassCompany.md) | 3 |
| [`ics.Ics30_Compliance`](../ics/services/Ics30_Compliance.md) | 14 |
| [`ics.Ics31_ComplianceWrite`](../ics/services/Ics31_ComplianceWrite.md) | 9 |
| [`ics.Ics32_RelateAppr`](../ics/services/Ics32_RelateAppr.md) | 7 |
| [`ics.Ics33_ComplianceAnswer`](../ics/services/Ics33_ComplianceAnswer.md) | 4 |
| [`ics.Ics35_ExtrActivity`](../ics/services/Ics35_ExtrActivity.md) | 8 |
| [`ics.Ics40_DcrPreconfirm`](../ics/services/Ics40_DcrPreconfirm.md) | 11 |
| [`ics.Ics41_DcrType`](../ics/services/Ics41_DcrType.md) | 6 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`ics01_class_tree`](sql/ics01_class_tree.md) | 22 |
| [`ics02_manager`](sql/ics02_manager.md) | 5 |
| [`ics03_company_info`](sql/ics03_company_info.md) | 3 |
| [`ics04_share`](sql/ics04_share.md) | 2 |
| [`ics05_relate_manager`](sql/ics05_relate_manager.md) | 7 |
| [`ics10_checklist`](sql/ics10_checklist.md) | 6 |
| [`ics11_checklist_company`](sql/ics11_checklist_company.md) | 11 |
| [`ics15_checklist_write`](sql/ics15_checklist_write.md) | 9 |
| [`ics16_relate_appr`](sql/ics16_relate_appr.md) | 4 |
| [`ics17_user_request`](sql/ics17_user_request.md) | 4 |
| [`ics19_revision_relate_ics`](sql/ics19_revision_relate_ics.md) | 2 |
| [`ics20_revision_history`](sql/ics20_revision_history.md) | 4 |
| [`ics21_checklist_l_class`](sql/ics21_checklist_l_class.md) | 3 |
| [`ics22_checklist_l_class_company`](sql/ics22_checklist_l_class_company.md) | 2 |
| [`ics23_checklist_m_class`](sql/ics23_checklist_m_class.md) | 3 |
| [`ics24_checklist_m_class_company`](sql/ics24_checklist_m_class_company.md) | 2 |
| [`ics30_compliance`](sql/ics30_compliance.md) | 15 |
| [`ics31_compliance_write`](sql/ics31_compliance_write.md) | 10 |
| [`ics32_relate_appr`](sql/ics32_relate_appr.md) | 5 |
| [`ics33_compliance_answer`](sql/ics33_compliance_answer.md) | 5 |
| [`ics35_extr_activity`](sql/ics35_extr_activity.md) | 5 |
| [`ics40_dcr_preconfirm`](sql/ics40_dcr_preconfirm.md) | 9 |
| [`ics41_dcr_type`](sql/ics41_dcr_type.md) | 4 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Ics01_Grid_FileList` | `client/vi/ics/Ics01_Grid_FileList.java` | `sys.Sys11_RelateFile.selectByIcsFileAll` |
| `Ics01_Lookup_Manager` | `client/vi/ics/Ics01_Lookup_Manager.java` | `ics.Ics02_Manager.selectByCompanyId`, `ics.Ics02_Manager.update` |
| `Ics01_Lookup_PeriodList` | `client/vi/ics/Ics01_Lookup_PeriodList.java` | `apr.Apr01_Appr.selectById` |
| `Ics02_Lookup_ManagerGroup` | `client/vi/ics/Ics02_Lookup_ManagerGroup.java` | `ics.Ics05_RelateManager.relateUpdate`, `ics.Ics05_RelateManager.updateList` |
| `Ics41_Lookup_SelectSingle` | `client/vi/ics/Ics41_Lookup_SelectSingle.java` | `ics.Ics41_DcrType.selectByText` |
| `ics19_Grid_IcsList` | `client/vi/ics/ics19_Grid_IcsList.java` | `ics.Ics19_RevisionRelateIcs.selectByRevisionHistoryId` |
| `ics20_Grid_FileList` | `client/vi/ics/ics20_Grid_FileList.java` | `sys.Sys10_File.selectByParentId`, `sys.Sys11_RelateFile.checkFileDelete` |
