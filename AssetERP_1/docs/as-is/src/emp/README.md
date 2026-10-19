# 도메인: emp

화면 40개, 컴포넌트 16개, 서버 클래스 55개, 매퍼 53개.

## 화면

| 화면 | 메뉴 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Emp00_RDR_OrgPerson`](screens/Emp00_RDR_OrgPerson.md) | - | 1 | 1 |
| [`Emp00_RD_OrgPerson`](screens/Emp00_RD_OrgPerson.md) | - | 2 | 0 |
| [`Emp00_Tab_ChangeHistory`](screens/Emp00_Tab_ChangeHistory.md) | 경영관리 > 01. 조직 및 사원관리 > 사원정보 변경조회 | 1 | 6 |
| [`Emp00_Tab_OrgEmpManager`](screens/Emp00_Tab_OrgEmpManager.md) | 관리자 > 06. 경영관리 > 조직별 사원조회(관리자) | 1 | 1 |
| [`Emp00_Tab_OrgPerson`](screens/Emp00_Tab_OrgPerson.md) | 경영관리 > 01. 조직 및 사원관리 > 조직별 사원조회 | 1 | 1 |
| [`Emp00_Tab_RoleMenu`](screens/Emp00_Tab_RoleMenu.md) | 관리자 > 01. 화면권한관리 > 사원별 메뉴권한(View) | 1 | 1 |
| [`Emp00_Tab_TransInfo`](screens/Emp00_Tab_TransInfo.md) | 경영관리 > 01. 조직 및 사원관리 > 사원정보 관리; 기본정보 > 기본정보 > 사원정보 등록 | 29 | 66 |
| [`Emp01_Tab_DueDiligence`](screens/Emp01_Tab_DueDiligence.md) | 경영관리 > 20. 대외보고서 > 인력현황 | 2 | 0 |
| [`Emp01_Tab_InoutState`](screens/Emp01_Tab_InoutState.md) | 경영관리 > 20. 대외보고서 > 기간별 입퇴사현황 | 2 | 0 |
| [`Emp01_Tab_UserInfo`](screens/Emp01_Tab_UserInfo.md) | 관리자 > 01. 고객관리 > 사용자정보 조회 | 2 | 3 |
| [`Emp10_Tab_AddrBook`](screens/Emp10_Tab_AddrBook.md) | 문서작성 > 05. 메일관리 > 주소록 관리 | 1 | 3 |
| [`Emp10_Tab_PublicAddrBook`](screens/Emp10_Tab_PublicAddrBook.md) | 문서작성 > 05. 메일관리 > 공용주소록 관리 | 1 | 3 |
| [`Emp15_Tab_Cert`](screens/Emp15_Tab_Cert.md) | 경영관리 > 01. 조직 및 사원관리 > 증명서 발급 | 4 | 10 |
| [`Emp17_Tab_Benefit`](screens/Emp17_Tab_Benefit.md) | 신청 > 80. 사업비 신청 > 복리후생비 신청 | 2 | 9 |
| [`Emp17_Tab_BenefitManager`](screens/Emp17_Tab_BenefitManager.md) | 자금관리 > 20. 사업비관리 > 복리후생비 관리 | 3 | 18 |
| [`Emp20_Tab_Leave`](screens/Emp20_Tab_Leave.md) | 신청 > 01. 외출/출장/휴가 > 휴가신청 | 3 | 19 |
| [`Emp20_Tab_LeaveList`](screens/Emp20_Tab_LeaveList.md) | 신청 > 01. 외출/출장/휴가 > 휴가신청조회 | 1 | 2 |
| [`Emp20_Tab_LeaveManager`](screens/Emp20_Tab_LeaveManager.md) | 경영관리 > 02. 휴가/출장 관리 > 휴가관리(경영관리팀) | 3 | 10 |
| [`Emp20_Tab_YearList`](screens/Emp20_Tab_YearList.md) | 경영관리 > 02. 휴가/출장 관리 > 연월차휴가 현황 | 1 | 2 |
| [`Emp21_Tab_PersonList`](screens/Emp21_Tab_PersonList.md) | 신청 > 01. 외출/출장/휴가 > 연월차휴가 지정통보 | 1 | 4 |
| [`Emp21_Tab_UnLeaveList`](screens/Emp21_Tab_UnLeaveList.md) | 경영관리 > 02. 휴가/출장 관리 > 연차휴가 사용촉진 | 4 | 12 |
| [`Emp22_Tab_EtcLeave`](screens/Emp22_Tab_EtcLeave.md) | 경영관리 > 02. 휴가/출장 관리 > 포상휴가관리 | 2 | 11 |
| [`Emp24_Tab_JointLeave`](screens/Emp24_Tab_JointLeave.md) | 경영관리 > 02. 휴가/출장 관리 > 공동연차관리 | 1 | 10 |
| [`Emp30_Tab_ApprStepExcept`](screens/Emp30_Tab_ApprStepExcept.md) | 문서작성 > 04. 전자결재 > 결재선 예외처리 | 1 | 3 |
| [`Emp31_Tab_Director`](screens/Emp31_Tab_Director.md) | 경영관리 > 01. 조직 및 사원관리 > 임원정보 관리 | 2 | 6 |
| [`Emp35_Tab_DeductPerson`](screens/Emp35_Tab_DeductPerson.md) | 경영관리 > 04. 급여관리 > 급여공제정보 | 5 | 7 |
| [`Emp41_Tab_EvalList`](screens/Emp41_Tab_EvalList.md) | 경영관리 > 05. 인사평가 > 인사평가 항목; 기초자료 > 30. 자산&경영 > 인사평가 항목(Admin) | 3 | 9 |
| [`Emp43_Tab_EvalExecute`](screens/Emp43_Tab_EvalExecute.md) | 경영관리 > 05. 인사평가 > 인사평가수행(평가자) | 2 | 12 |
| [`Emp43_Tab_EvalResult`](screens/Emp43_Tab_EvalResult.md) | 경영관리 > 05. 인사평가 > 인사평가 결과조회 | 1 | 4 |
| [`Emp43_Tab_EvalTarget`](screens/Emp43_Tab_EvalTarget.md) | 경영관리 > 05. 인사평가 > 인사평가 대상자 | 4 | 13 |
| [`Emp43_Tab_FinalAppr`](screens/Emp43_Tab_FinalAppr.md) | 경영관리 > 05. 인사평가 > 인사평가보고(대표이사) | 2 | 9 |
| [`Emp43_Tab_FirstAppr`](screens/Emp43_Tab_FirstAppr.md) | 경영관리 > 05. 인사평가 > 인사평가결과(인사부) | 2 | 9 |
| [`Emp50_Tab_TransportExpense`](screens/Emp50_Tab_TransportExpense.md) | 신청 > 80. 사업비 신청 > 여비교통비 신청 | 1 | 12 |
| [`Emp50_Tab_TransportExpenseMng`](screens/Emp50_Tab_TransportExpenseMng.md) | 자금관리 > 20. 사업비관리 > 여비교통비 관리 | 1 | 9 |
| [`Emp53_Tab_BizTrip`](screens/Emp53_Tab_BizTrip.md) | 신청 > 01. 외출/출장/휴가 > 출장품의 및 결과보고 | 4 | 11 |
| [`Emp53_Tab_BizTripManager`](screens/Emp53_Tab_BizTripManager.md) | 경영관리 > 02. 휴가/출장 관리 > 출장관리 | 1 | 3 |
| [`Emp54_Tab_Errand`](screens/Emp54_Tab_Errand.md) | 신청 > 01. 외출/출장/휴가 > 외출등록 | 3 | 11 |
| [`Emp54_Tab_ErrandManager`](screens/Emp54_Tab_ErrandManager.md) | 경영관리 > 02. 휴가/출장 관리 > 외출관리 | 1 | 2 |
| [`Emp55_Tab_benefitInfoManager`](screens/Emp55_Tab_benefitInfoManager.md) | 기초자료 > 30. 자산&경영 > 복리후생비 코드관리 | 1 | 4 |
| [`Emp60_Tab_Sign`](screens/Emp60_Tab_Sign.md) | 문서작성 > 04. 전자결재 > 결재서명관리 | 1 | 5 |

## 컴포넌트

다른 도메인 화면에서도 쓰는 클래스. 화면 파일은 여기까지만 적고 링크한다.

| 컴포넌트 | 사용 도메인 | 클래스 | 서비스 |
|:---|:---|---:|---:|
| [`Emp00_Lookup_SelectMulti`](components/Emp00_Lookup_SelectMulti.md) | apr, ast, att, bbs, biz, crm, dcr, ics, mkt, pay, sch, scm, sms, sys, tdm | 1 | 1 |
| [`Emp00_Lookup_SelectSingle`](components/Emp00_Lookup_SelectSingle.md) | apr, att, bbs, biz, bmt, car, crd, crm, est, flt, fnd, icr, ics, mrb, opr, pay, pln, sch, scm, sys, tdm | 1 | 1 |
| [`Emp00_Lookup_SelectSingleTdm`](components/Emp00_Lookup_SelectSingleTdm.md) | tdm | 1 | 1 |
| [`Emp00_Popup_Emp`](components/Emp00_Popup_Emp.md) | frm | 1 | 0 |
| [`Emp01_Lookup_PersonModel`](components/Emp01_Lookup_PersonModel.md) | bbs, cmp, sys, tdm | 1 | 1 |
| [`Emp01_Lookup_TransDate`](components/Emp01_Lookup_TransDate.md) | pay | 1 | 1 |
| [`Emp01_Rd_FinanceProState`](components/Emp01_Rd_FinanceProState.md) | rpt | 1 | 1 |
| [`Emp01_Rd_OfficerState`](components/Emp01_Rd_OfficerState.md) | rpt | 1 | 1 |
| [`Emp01_Rd_PersonState`](components/Emp01_Rd_PersonState.md) | rpt | 1 | 1 |
| [`Emp01_Rd_ProPersonState`](components/Emp01_Rd_ProPersonState.md) | rpt | 1 | 1 |
| [`Emp10_Lookup_MailAddress`](components/Emp10_Lookup_MailAddress.md) | dcr | 1 | 3 |
| [`Emp10_Lookup_MailRetrieve`](components/Emp10_Lookup_MailRetrieve.md) | dcr | 1 | 4 |
| [`Emp33_Lookup_ExceptBiz`](components/Emp33_Lookup_ExceptBiz.md) | ics | 1 | 3 |
| [`Emp57_Lookup_Insert`](components/Emp57_Lookup_Insert.md) | bbs | 4 | 9 |
| [`Emp57_Lookup_List`](components/Emp57_Lookup_List.md) | bbs, sms | 2 | 2 |
| [`Emp93_Lookup_SmsNoticeTarget`](components/Emp93_Lookup_SmsNoticeTarget.md) | flt, ics | 1 | 3 |

## 서버 클래스

| 클래스 | 서비스 메서드 |
|:---|---:|
| [`emp.Emp00_TransInfo`](../emp/services/Emp00_TransInfo.md) | 28 |
| [`emp.Emp01_Person`](../emp/services/Emp01_Person.md) | 20 |
| [`emp.Emp02_Others`](../emp/services/Emp02_Others.md) | 8 |
| [`emp.Emp03_Trans`](../emp/services/Emp03_Trans.md) | 14 |
| [`emp.Emp04_AddTitle`](../emp/services/Emp04_AddTitle.md) | 6 |
| [`emp.Emp05_Academic`](../emp/services/Emp05_Academic.md) | 3 |
| [`emp.Emp06_Family`](../emp/services/Emp06_Family.md) | 3 |
| [`emp.Emp07_Career`](../emp/services/Emp07_Career.md) | 3 |
| [`emp.Emp08_License`](../emp/services/Emp08_License.md) | 4 |
| [`emp.Emp09_Evaluation`](../emp/services/Emp09_Evaluation.md) | 3 |
| [`emp.Emp10_AddrBook`](../emp/services/Emp10_AddrBook.md) | 5 |
| [`emp.Emp11_Reward`](../emp/services/Emp11_Reward.md) | 4 |
| [`emp.Emp12_Event`](../emp/services/Emp12_Event.md) | 3 |
| [`emp.Emp13_Project`](../emp/services/Emp13_Project.md) | 3 |
| [`emp.Emp14_Account`](../emp/services/Emp14_Account.md) | 3 |
| [`emp.Emp15_Cert`](../emp/services/Emp15_Cert.md) | 6 |
| [`emp.Emp16_CertMapping`](../emp/services/Emp16_CertMapping.md) | 6 |
| [`emp.Emp17_Benefit`](../emp/services/Emp17_Benefit.md) | 17 |
| [`emp.Emp18_RelateFile`](../emp/services/Emp18_RelateFile.md) | 3 |
| [`emp.Emp19_Education`](../emp/services/Emp19_Education.md) | 4 |
| [`emp.Emp20_Leave`](../emp/services/Emp20_Leave.md) | 14 |
| [`emp.Emp21_UnLeave`](../emp/services/Emp21_UnLeave.md) | 14 |
| [`emp.Emp22_EtcLeave`](../emp/services/Emp22_EtcLeave.md) | 11 |
| [`emp.Emp23_EtcLeavePerson`](../emp/services/Emp23_EtcLeavePerson.md) | 5 |
| [`emp.Emp24_JointLeave`](../emp/services/Emp24_JointLeave.md) | 7 |
| [`emp.Emp25_MypageNotice`](../emp/services/Emp25_MypageNotice.md) | 4 |
| [`emp.Emp26_InitLeave`](../emp/services/Emp26_InitLeave.md) | 5 |
| [`emp.Emp28_JointLeaveExcept`](../emp/services/Emp28_JointLeaveExcept.md) | 4 |
| [`emp.Emp30_ApprStepExcept`](../emp/services/Emp30_ApprStepExcept.md) | 4 |
| [`emp.Emp31_Director`](../emp/services/Emp31_Director.md) | 6 |
| [`emp.Emp32_RelateLicense`](../emp/services/Emp32_RelateLicense.md) | 4 |
| [`emp.Emp33_ExceptBiz`](../emp/services/Emp33_ExceptBiz.md) | 4 |
| [`emp.Emp35_Deduct`](../emp/services/Emp35_Deduct.md) | 7 |
| [`emp.Emp36_AddDeduct`](../emp/services/Emp36_AddDeduct.md) | 6 |
| [`emp.Emp40_EvalListStd`](../emp/services/Emp40_EvalListStd.md) | 8 |
| [`emp.Emp41_EvalList`](../emp/services/Emp41_EvalList.md) | 5 |
| [`emp.Emp42_EvalGrade`](../emp/services/Emp42_EvalGrade.md) | 5 |
| [`emp.Emp43_EvalTarget`](../emp/services/Emp43_EvalTarget.md) | 16 |
| [`emp.Emp44_EvalWrite`](../emp/services/Emp44_EvalWrite.md) | 10 |
| [`emp.Emp45_EvalRelateAppr`](../emp/services/Emp45_EvalRelateAppr.md) | 8 |
| [`emp.Emp50_TransportExpense`](../emp/services/Emp50_TransportExpense.md) | 5 |
| [`emp.Emp51_RelateAppr`](../emp/services/Emp51_RelateAppr.md) | 10 |
| [`emp.Emp52_RelateAppr`](../emp/services/Emp52_RelateAppr.md) | 7 |
| [`emp.Emp53_BizTrip`](../emp/services/Emp53_BizTrip.md) | 7 |
| [`emp.Emp54_Errand`](../emp/services/Emp54_Errand.md) | 8 |
| [`emp.Emp55_BenefitInfo`](../emp/services/Emp55_BenefitInfo.md) | 8 |
| [`emp.Emp56_Share`](../emp/services/Emp56_Share.md) | 5 |
| [`emp.Emp57_AddrBookGroup`](../emp/services/Emp57_AddrBookGroup.md) | 8 |
| [`emp.Emp60_Sign`](../emp/services/Emp60_Sign.md) | 6 |
| [`emp.Emp90_Notice`](../emp/services/Emp90_Notice.md) | 6 |
| [`emp.Emp91_MenuInfoNotice`](../emp/services/Emp91_MenuInfoNotice.md) | 8 |
| [`emp.Emp92_SmsNotice`](../emp/services/Emp92_SmsNotice.md) | 5 |
| [`emp.Emp93_SmsNoticeTarget`](../emp/services/Emp93_SmsNoticeTarget.md) | 5 |
| [`emp.Hire`](../emp/services/Hire.md) | 7 |
| [`emp.License`](../emp/services/License.md) | 5 |

## 매퍼

| namespace | SQL 수 |
|:---|---:|
| [`emp00_trans_info`](sql/emp00_trans_info.md) | 35 |
| [`emp01_person`](sql/emp01_person.md) | 32 |
| [`emp02_others`](sql/emp02_others.md) | 7 |
| [`emp03_trans`](sql/emp03_trans.md) | 21 |
| [`emp04_add_title`](sql/emp04_add_title.md) | 3 |
| [`emp05_academic`](sql/emp05_academic.md) | 2 |
| [`emp06_family`](sql/emp06_family.md) | 2 |
| [`emp07_career`](sql/emp07_career.md) | 2 |
| [`emp08_license`](sql/emp08_license.md) | 3 |
| [`emp09_evaluation`](sql/emp09_evaluation.md) | 2 |
| [`emp10_addr_book`](sql/emp10_addr_book.md) | 4 |
| [`emp11_reward`](sql/emp11_reward.md) | 3 |
| [`emp12_event`](sql/emp12_event.md) | 2 |
| [`emp13_project`](sql/emp13_project.md) | 3 |
| [`emp14_account`](sql/emp14_account.md) | 2 |
| [`emp15_cert`](sql/emp15_cert.md) | 4 |
| [`emp16_cert_mapping`](sql/emp16_cert_mapping.md) | 3 |
| [`emp17_benefit`](sql/emp17_benefit.md) | 10 |
| [`emp18_relate_file`](sql/emp18_relate_file.md) | 2 |
| [`emp19_education`](sql/emp19_education.md) | 2 |
| [`emp20_leave`](sql/emp20_leave.md) | 14 |
| [`emp21_un_leave`](sql/emp21_un_leave.md) | 7 |
| [`emp22_etc_leave`](sql/emp22_etc_leave.md) | 9 |
| [`emp23_etc_leave_person`](sql/emp23_etc_leave_person.md) | 3 |
| [`emp24_joint_leave`](sql/emp24_joint_leave.md) | 4 |
| [`emp25_mypage_notice`](sql/emp25_mypage_notice.md) | 2 |
| [`emp26_init_leave`](sql/emp26_init_leave.md) | 3 |
| [`emp28_joint_leave_except`](sql/emp28_joint_leave_except.md) | 2 |
| [`emp30_appr_step_except`](sql/emp30_appr_step_except.md) | 2 |
| [`emp31_director`](sql/emp31_director.md) | 4 |
| [`emp32_relate_license`](sql/emp32_relate_license.md) | 2 |
| [`emp33_except_biz`](sql/emp33_except_biz.md) | 2 |
| [`emp35_deduct`](sql/emp35_deduct.md) | 6 |
| [`emp36_add_deduct`](sql/emp36_add_deduct.md) | 5 |
| [`emp40_eval_list_std`](sql/emp40_eval_list_std.md) | 7 |
| [`emp41_eval_list`](sql/emp41_eval_list.md) | 6 |
| [`emp42_eval_grade`](sql/emp42_eval_grade.md) | 6 |
| [`emp43_eval_target`](sql/emp43_eval_target.md) | 13 |
| [`emp44_eval_write`](sql/emp44_eval_write.md) | 8 |
| [`emp45_eval_relate_appr`](sql/emp45_eval_relate_appr.md) | 5 |
| [`emp50_transport_expense`](sql/emp50_transport_expense.md) | 2 |
| [`emp51_relate_appr`](sql/emp51_relate_appr.md) | 9 |
| [`emp52_relate_appr`](sql/emp52_relate_appr.md) | 5 |
| [`emp53_biz_trip`](sql/emp53_biz_trip.md) | 4 |
| [`emp54_errand`](sql/emp54_errand.md) | 7 |
| [`emp55_benefit_info`](sql/emp55_benefit_info.md) | 7 |
| [`emp56_share`](sql/emp56_share.md) | 3 |
| [`emp57_addr_book_group`](sql/emp57_addr_book_group.md) | 5 |
| [`emp60_sign`](sql/emp60_sign.md) | 4 |
| [`emp90_notice`](sql/emp90_notice.md) | 5 |
| [`emp91_menu_info_notice`](sql/emp91_menu_info_notice.md) | 7 |
| [`emp92_sms_notice`](sql/emp92_sms_notice.md) | 8 |
| [`emp93_sms_notice_target`](sql/emp93_sms_notice_target.md) | 3 |

## 화면·컴포넌트에서 도달하지 않는 클래스

메뉴에 없거나 다른 방식으로 열리는 클래스 중 서비스를 호출하는 것.

| 클래스 | 파일 | 서비스 |
|:---|:---|:---|
| `Emp00_Lookup_SendMessage` | `client/vi/emp/Emp00_Lookup_SendMessage.java` | `emp.Emp00_TransInfo.getOnlineList` |
| `Emp03_Edit_Trans` | `client/vi/emp/Emp03_Edit_Trans.java` | `emp.Emp03_Trans.delete`, `emp.Emp03_Trans.update` |
| `Emp04_Lookup_AddTitleList` | `client/vi/emp/Emp04_Lookup_AddTitleList.java` | `emp.Emp04_AddTitle.getAddTitleList`, `sys.Sys02_User.getChangeInfo`, `sys.Sys06_Menu.getMenuList` |
| `Emp16_Lookup_CertList` | `client/vi/emp/Emp16_Lookup_CertList.java` | `emp.Emp16_CertMapping.delete`, `emp.Emp16_CertMapping.selectByCompanyId`, `emp.Emp16_CertMapping.update`, `sys.Sys00_Common.selectCertCode` |
| `Emp16_TabPage_CertMapping` | `client/vi/emp/Emp16_TabPage_CertMapping.java` | `emp.Emp16_CertMapping.delete`, `emp.Emp16_CertMapping.selectByCompanyId`, `emp.Emp16_CertMapping.update`, `sys.Sys00_Common.selectCertCode` |
| `Emp17_TabPage_RelateFile` | `client/vi/emp/Emp17_TabPage_RelateFile.java` | `sys.Sys10_File.selectByParentId`, `sys.Sys11_RelateFile.checkFileDelete` |
| `Emp90_Lookup_Notice` | `client/vi/emp/Emp90_Lookup_Notice.java` | `emp.Emp90_Notice.deleteList`, `emp.Emp90_Notice.selectByPersonId`, `emp.Emp90_Notice.updateList` |
| `Emp91_Lookup_List` | `client/vi/emp/Emp91_Lookup_List.java` | `emp.Emp91_MenuInfoNotice.deletePersonId`, `emp.Emp91_MenuInfoNotice.delete`, `emp.Emp91_MenuInfoNotice.selectByText`, `emp.Emp91_MenuInfoNotice.updatePersonId` |
| `Emp92_Lookup_SmsNotice` | `client/vi/emp/Emp92_Lookup_SmsNotice.java` | `emp.Emp92_SmsNotice.selectByPersonId`, `emp.Emp92_SmsNotice.updateList` |
| `Emp93_Lookup_SmsNoticeTargetList` | `client/vi/emp/Emp93_Lookup_SmsNoticeTargetList.java` | `emp.Emp93_SmsNoticeTarget.getSmsNoticeList` |
| `Emp93_Tabpage_SmsNoticeTargetList` | `client/vi/emp/Emp93_Tabpage_SmsNoticeTargetList.java` | `emp.Emp93_SmsNoticeTarget.delete`, `emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode`, `emp.Emp93_SmsNoticeTarget.update` |
