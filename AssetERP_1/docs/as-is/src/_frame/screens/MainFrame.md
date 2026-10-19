# MainFrame

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/MainFrame.java`
- 함께 쓰는 클래스 15개:
  - `TempData` `client/vi/TempData.java`
  - `Sys01_Tab_UserCompany` `client/vi/sys/Sys01_Tab_UserCompany.java`
  - `LoginUser` `client/vi/LoginUser.java`
  - `Frm01_Lookup_CheckList` `client/vi/frm/Frm01_Lookup_CheckList.java`
  - `Frm01_Lookup_Outstanding` `client/vi/frm/Frm01_Lookup_Outstanding.java`
  - `Frm01_Lookup_NoticeList` `client/vi/frm/Frm01_Lookup_NoticeList.java`
  - `Frm01_Lookup_DailyCheckList` `client/vi/frm/Frm01_Lookup_DailyCheckList.java`
  - `Emp04_Lookup_AddTitleList` `client/vi/emp/Emp04_Lookup_AddTitleList.java`
  - `Emp00_Lookup_SendMessage` `client/vi/emp/Emp00_Lookup_SendMessage.java`
  - `Emp00_Popup_Example` `client/vi/emp/Emp00_Popup_Example.java`
  - `Att02_Lookup_Commute` `client/vi/att/Att02_Lookup_Commute.java`
  - `Att05_Lookup_PmWork` `client/vi/att/Att05_Lookup_PmWork.java`
  - `Att03_Lookup_OvertimeReq` `client/vi/att/Att03_Lookup_OvertimeReq.java`
  - `Att02_Edit_Reason` `client/vi/att/Att02_Edit_Reason.java`
  - `Att02_Edit_CheckOutTime` `client/vi/att/Att02_Edit_CheckOutTime.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Bbs02_Popup_NoticeAdmin`](../../bbs/components/Bbs02_Popup_NoticeAdmin.md), [`Bbs02_Tab_NoticeView`](../../bbs/screens/Bbs02_Tab_NoticeView.md), [`MenuGrid`](../../_frame/screens/MenuGrid.md), [`MenuOpener`](../../_frame/screens/MenuOpener.md), [`MyInfoPopup`](../../_frame/screens/MyInfoPopup.md), [`MySetting`](../../_frame/screens/MySetting.md), [`MyTabItemConfig`](../../_frame/screens/MyTabItemConfig.md), [`MyThemePopup`](../../_frame/screens/MyThemePopup.md), [`Sch01_Lookup_InfoView`](../../sch/components/Sch01_Lookup_InfoView.md), [`Sch10_Lookup_Ipo`](../../sch/components/Sch10_Lookup_Ipo.md), [`Sms10_Lookup_AlarmList`](../../sms/components/Sms10_Lookup_AlarmList.md), [`Sys01_Tab_Company`](../../sys/screens/Sys01_Tab_Company.md), [`Sys06_Lookup_SearchMenu`](../../sys/components/Sys06_Lookup_SearchMenu.md), [`TabBorder`](../../_frame/screens/TabBorder.md), [`Tdm50_Tab_CheckJob`](../../tdm/screens/Tdm50_Tab_CheckJob.md), [`Tdm51_Tab_CheckOrg`](../../tdm/screens/Tdm51_Tab_CheckOrg.md), [`Tdm52_Tab_CheckManl`](../../tdm/screens/Tdm52_Tab_CheckManl.md), [`Tdm59_Tab_CheckAppr`](../../tdm/screens/Tdm59_Tab_CheckAppr.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectOutstandingPopup` | Frm01_Lookup_Outstanding:85 | [`Apr01_Appr.java:879`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectOutstandingPopup`](../../apr/sql/apr01_appr.md) |
| `att.Att01_WorkPolicy.getModel` | Att02_Lookup_Commute:126, Att03_Lookup_OvertimeReq:167 | [`Att01_WorkPolicy.java:46`](../../att/services/Att01_WorkPolicy.md) | [`att01_work_policy.getModel`](../../att/sql/att01_work_policy.md) |
| `att.Att02_Commute.getLastInfo` | Att02_Lookup_Commute:147, MainFrame:370 | [`Att02_Commute.java:80`](../../att/services/Att02_Commute.md) | [`att02_commute.getLastInfo`](../../att/sql/att02_commute.md) |
| `att.Att02_Commute.insert` | Att02_Lookup_Commute:378 | [`Att02_Commute.java:91`](../../att/services/Att02_Commute.md) | [`att02_commute.checkWorkDate`](../../att/sql/att02_commute.md), [`att02_commute.insert`](../../att/sql/att02_commute.md), [`att02_commute.updateOff`](../../att/sql/att02_commute.md) |
| `att.Att02_Commute.insertOffWork` | Att02_Lookup_Commute:423 | [`Att02_Commute.java:120`](../../att/services/Att02_Commute.md) | [`att02_commute.selectByDate`](../../att/sql/att02_commute.md), [`att02_commute.updateOffWork`](../../att/sql/att02_commute.md) |
| `att.Att02_Commute.selectByDate` | Att02_Lookup_Commute:276 | [`Att02_Commute.java:27`](../../att/services/Att02_Commute.md) | [`att02_commute.selectByDate`](../../att/sql/att02_commute.md) |
| `att.Att02_Commute.updateCheckOutTime` | Att02_Edit_CheckOutTime:132 | [`Att02_Commute.java:163`](../../att/services/Att02_Commute.md) | [`att02_commute.updateCheckOutTime`](../../att/sql/att02_commute.md) |
| `att.Att02_Commute.updateReason` | Att02_Edit_Reason:73 | [`Att02_Commute.java:153`](../../att/services/Att02_Commute.md) | [`att02_commute.updateReason`](../../att/sql/att02_commute.md) |
| `att.Att03_OvertimeReq.checkWeekMaxTime` | Att03_Lookup_OvertimeReq:693 | [`Att03_OvertimeReq.java:153`](../../att/services/Att03_OvertimeReq.md) | - |
| `att.Att03_OvertimeReq.delete` | Att03_Lookup_OvertimeReq:717 | [`Att03_OvertimeReq.java:188`](../../att/services/Att03_OvertimeReq.md) | `UpdateDataModel(att03_overtime_req)` 동적 DELETE |
| `att.Att03_OvertimeReq.getInfo` | Att03_Lookup_OvertimeReq:752 | [`Att03_OvertimeReq.java:65`](../../att/services/Att03_OvertimeReq.md) | [`att03_overtime_req.getInfo`](../../att/sql/att03_overtime_req.md) |
| `att.Att03_OvertimeReq.notInOvertimeReqIdList` | Att03_Lookup_OvertimeReq:645 | [`Att03_OvertimeReq.java:110`](../../att/services/Att03_OvertimeReq.md) | [`att03_overtime_req.notInOvertimeReqIdList`](../../att/sql/att03_overtime_req.md) |
| `att.Att03_OvertimeReq.selectByPersonId` | Att03_Lookup_OvertimeReq:742, Att05_Lookup_PmWork:347 | [`Att03_OvertimeReq.java:43`](../../att/services/Att03_OvertimeReq.md) | [`att03_overtime_req.selectByPersonId`](../../att/sql/att03_overtime_req.md) |
| `att.Att03_OvertimeReq.update` | Att03_Lookup_OvertimeReq:337 | [`Att03_OvertimeReq.java:183`](../../att/services/Att03_OvertimeReq.md) | `UpdateDataModel(att03_overtime_req)` 동적 INSERT/UPDATE → [`att03_overtime_req.selectById`](../../att/sql/att03_overtime_req.md) |
| `att.Att05_PmWork.delete` | Att05_Lookup_PmWork:408 | [`Att05_PmWork.java:85`](../../att/services/Att05_PmWork.md) | `UpdateDataModel(att05_pm_work)` 동적 DELETE |
| `att.Att05_PmWork.getWorkDateInfo` | Att03_Lookup_OvertimeReq:486 | [`Att05_PmWork.java:59`](../../att/services/Att05_PmWork.md) | [`att05_pm_work.getWorkDateInfo`](../../att/sql/att05_pm_work.md) |
| `att.Att05_PmWork.notInPmWorkIdList` | Att05_Lookup_PmWork:299 | [`Att05_PmWork.java:46`](../../att/services/Att05_PmWork.md) | [`att05_pm_work.notInPmWorkIdList`](../../att/sql/att05_pm_work.md) |
| `att.Att05_PmWork.selectByWorkDate` | Att05_Lookup_PmWork:383 | [`Att05_PmWork.java:35`](../../att/services/Att05_PmWork.md) | [`att05_pm_work.selectByWorkDate`](../../att/sql/att05_pm_work.md) |
| `att.Att05_PmWork.update` | Att05_Lookup_PmWork:238 | [`Att05_PmWork.java:80`](../../att/services/Att05_PmWork.md) | `UpdateDataModel(att05_pm_work)` 동적 INSERT/UPDATE → [`att05_pm_work.selectById`](../../att/sql/att05_pm_work.md) |
| `bbs.Bbs02_Notice.selectByTargetPerson` | Frm01_Lookup_NoticeList:91 | [`Bbs02_Notice.java:111`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectByTargetPerson`](../../bbs/sql/bbs02_notice.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Att03_Lookup_OvertimeReq:214, Att05_Lookup_PmWork:148 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp00_TransInfo.getOnlineList` | Emp00_Lookup_SendMessage:162 | [`Emp00_TransInfo.java:569`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.getOnlineList`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp02_Others.selectById` | MainFrame:694 | [`Emp02_Others.java:18`](../../emp/services/Emp02_Others.md) | [`emp02_others.selectById`](../../emp/sql/emp02_others.md) |
| `emp.Emp04_AddTitle.getAddTitleList` | Emp04_Lookup_AddTitleList:135 | [`Emp04_AddTitle.java:39`](../../emp/services/Emp04_AddTitle.md) | [`emp04_add_title.getAddTitleList`](../../emp/sql/emp04_add_title.md) |
| `frm.Frm01_List.getNoticeCnt` | Frm01_Lookup_CheckList:263, MainFrame:427 | [`Frm01_List.java:59`](../../frm/services/Frm01_List.md) | [`frm01_list.getNoticeCnt`](../../frm/sql/frm01_list.md) |
| `pay.Pay34_WorkTimeConfig.getModel` | Att03_Lookup_OvertimeReq:181 | [`Pay34_WorkTimeConfig.java:34`](../../pay/services/Pay34_WorkTimeConfig.md) | [`pay34_work_time_config.getModel`](../../pay/sql/pay34_work_time_config.md) |
| `sch.Sch04_List.selectByManagerId` | Frm01_Lookup_DailyCheckList:178 | [`Sch04_List.java:34`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByManagerId`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.statusUpdateCheck` | Frm01_Lookup_DailyCheckList:103 | [`Sch04_List.java:254`](../../sch/services/Sch04_List.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.selectByCheck`](../../sch/sql/sch04_list.md), [`sch04_list.updateStatusCode`](../../sch/sql/sch04_list.md), `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE → [`sch04_list.selectById`](../../sch/sql/sch04_list.md) |
| `sch.Sch10_Ipo.selectById` | Frm01_Lookup_DailyCheckList:218 | [`Sch10_Ipo.java:16`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |
| `sys.Sys02_User.getChangeInfo` | Emp04_Lookup_AddTitleList:171 | [`Sys02_User.java:275`](../../sys/services/Sys02_User.md) | [`emp00_trans_info.selectByComplianceCheck`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByPersonId`](../../emp/sql/emp00_trans_info.md) |
| `sys.Sys06_Menu.checkMenualUrl` | MainFrame:189 | [`Sys06_Menu.java:65`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.checkMenualUrl`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.getMenuList` | Emp04_Lookup_AddTitleList:197, MainFrame:347 | [`Sys06_Menu.java:286`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.getMenuList`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByHeaderMenuCompanyId` | MainFrame:1071 | [`Sys06_Menu.java:402`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByHeaderMenuCompanyId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByHeaderMenuUserId` | MainFrame:738 | [`Sys06_Menu.java:415`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByHeaderMenuUserId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByMenuNoPlusName` | MainFrame:510 | [`Sys06_Menu.java:520`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByMenuNoPlusName`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByText` | MainFrame:1102 | [`Sys06_Menu.java:470`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByText`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByTextManager` | MainFrame:1102 | [`Sys06_Menu.java:452`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByTextManager`](../../sys/sql/sys06_menu.md) |
| `sys.Sys28_LoginRealTime.updateIpAddress` | MainFrame:463 | [`Sys28_LoginRealTime.java:32`](../../sys/services/Sys28_LoginRealTime.md) | [`sys28_login_real_time.insertInfo`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.selectByDate`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.selectByPersonId`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.updateInfo`](../../sys/sql/sys28_login_real_time.md) |
| `sys.Sys96_OpenMenuLog.insert` | MainFrame:1137 | [`Sys96_OpenMenuLog.java:40`](../../sys/services/Sys96_OpenMenuLog.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys96_open_menu_log.insert`](../../sys/sql/sys96_open_menu_log.md) |
| `sys.Sys96_OpenMenuLog.updateSecond` | MainFrame:1154 | [`Sys96_OpenMenuLog.java:55`](../../sys/services/Sys96_OpenMenuLog.md) | [`sys96_open_menu_log.updateSecond`](../../sys/sql/sys96_open_menu_log.md) |
| `utils.token.TokenService.makeToken` | MainFrame:591, MainFrame:622 | [`TokenService.java:19`](../../utils/services/token.TokenService.md) | [`tmp_token.insertByToken`](../../utils/sql/tmp_token.md), [`tmp_token.selectByPersonId`](../../utils/sql/tmp_token.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md), [`bbs02_notice`](../../../db/tables/bbs.md), [`bbs03_target`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`bbs05_history`](../../../db/tables/bbs.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`flt10_tr`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay34_work_time_config`](../../../db/tables/pay.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch09_deadline_day`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch11_ipo_company`](../../../db/tables/sch.md), [`sms10_alarm_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys28_login_real_time`](../../../db/tables/sys.md), [`sys40_bookmark`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys82_admin_user_menu`](../../../db/tables/sys.md), [`sys96_open_menu_log`](../../../db/tables/sys.md), [`tmp_token`](../../../db/tables/_etc.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_get_std_date`, `f_menu_nm_allpath`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### MainFrame (`client/vi/MainFrame.java`, 1354줄)

- 레이아웃: west=menuGrid, center=tabPanel, north=getNorthLayout(), center=hlc, north=getNorthLayout(), north=getNorthLayout(), center=tabPanel, center=menuHeaderGrid
- 툴바 `botBar`: {botAnchor}
- 툴바 `talkBar`: {talkAnchor}
- 툴바 `webAlarmBar`: {webAlarmAnchor}
- 툴바 `bullhornBar`: {bullhornAnchor}
- 툴바 `nameBar`: {nameLabel}
- 툴바 `searchBar`: {searchAnchor}
- 툴바 `userBar`: {userAnchor}
- 툴바 `logoutBar`: {logoutAnchor}
- 툴바 `settingBar`: {settingAnchor}
- 입력·하위 화면: `menuName` CustomTextField 빈칸="화면번호/매뉴명/기능설명", `lookup` Frm01_Lookup_CheckList
- 그리드 `menuHeaderGrid` (buildMenuHeaderGrid(), 행번호숨김):
  - menuName 73 "" MenuHeaderText

#### 이벤트
[E0] 화면 열림 (생성자 L210-344) → retrieve(), getWestLayout(), getNorthLayout(), checkActive(), setMenuList(), checkCommute()
[E1] tabPanel.Selection (L238) → checkManuel(), insertMenuLog(), updateMenuLog()
[E2] Window.WindowClosing [LoginUser.getLogoutYn()] (L303) → 인라인 L303-312 (메시지: )
[E3] manualing[].MouseDown [menualUrl != null] (L316) → 인라인 L316-325 (메시지: menualUrl)
[E4] warning.MouseDown (L327) → 인라인 L327-333 (new MouseDownHandler() { @Override pu…)
[E5] tabPanel.BeforeSelection (L479) → retrieveMenuGrid()
[E6] botAnchor.MouseDown [!LoginUser.getIsManager()] (L587) → getServiceResult()
[E7] talkAnchor.MouseDown [!LoginUser.getIsManager()] (L618) → getServiceResult()
[E8] webAlarmAnchor.MouseDown [!LoginUser.getIsManager()] (L650) → 메시지 "관리자는 해당기능을 제공하지않습니다"
[E9] bullhornAnchor.MouseDown (L666) → 인라인 L666-678 (new MouseDownHandler() { @Override pu…)
[E10] userAnchor.MouseDown (L687) → getServiceResult()
[E11] addTitleAnchor.MouseDown (L715) → getNorthLayout()
[E12] logoutAnchor.MouseDown (L771) → 인라인 L771-785 (new MouseDownHandler() { @Override pu…)
[E13] requestForm.SubmitComplete (L778) → 인라인 L778-783 (new SubmitCompleteHandler() { @Overri…)
[E14] settingAnchor.MouseDown (L791) → 인라인 L791-797 (new MouseDownHandler() { @Override pu…)
[E15] helpAnchor.MouseDown [LoginUser.getIsManager()] (L803) → 인라인 L803-812 (메시지: "user_manual.jsp?personId=admi)
[E16] nameLabel.MouseDown (L834) → 인라인 L834-839 (new MouseDownHandler() { @Override pu…)
[E17] nameLabel.DoubleClick [OK] (L840) → setHtmlHeaderStyle(), setHtmlContentStyle()
[E18] searchAnchor.MouseDown [result != null] (L855) → retrieve()
[E19] notice.MouseDown (L877) → 인라인 L877-882 (new MouseDownHandler() { @Override pu…)
[E20] menuName.KeyPress [Enter] (L968) → openMenu()
[E21] menuHeaderGrid.CellClick [event.getCellIndex() == 1] (L1016) → 인라인 L1016-1038 (new CellClickHandler(){ @Override pub…)
[E22] requestForm.SubmitComplete (L1184) → 인라인 L1184-1189 (new SubmitCompleteHandler() { @Overri…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private checkManuel() | L188-207 | E1 | 서비스 sys.Sys06_Menu.checkMenualUrl(headerStr, classStr) | 업무 |
| private setMenuList() | L346-367 | 생성자 | 서비스 sys.Sys06_Menu.getMenuList(companyId, userId) | 업무 |
| private checkCommute() | L369-407 | 생성자 | 조회창 Att02_Lookup_Commute 열기, 서비스 att.Att02_Commute.getLastInfo(companyId, personId) | 업무 |
| private checkActive() | L415-504 | 생성자 | 서비스 frm.Frm01_List.getNoticeCnt, sys.Sys28_LoginRealTime.updateIpAddress(companyId, personId, orgId, personId, ipAddress) | 업무 |
| private retrieveMenuGrid() | L506-539 | E5 | 서비스 sys.Sys06_Menu.selectByMenuNoPlusName(companyId, userId, menuNoPlusName) | 업무 |
| private retrieveMenu() | L541-567 | retrieveMenuGrid | 상태 처리 | 업무 |
| private getNorthLayout() | L573-1009 | 생성자,E11 | 조회창 Emp00_Lookup_SendMessage 열기 → 콜백: unmask, 팝업 MyInfoPopup 열기, 조회창 Emp04_Lookup_AddTitleList 열기 → 콜백: unmask, 조회창 Sys06_Lookup_SearchMenu 열기 → 콜백: unmask, 팝업 MyThemePopup 열기, 서비스 emp.Emp02_Others.selectById, sys.Sys06_Menu.selectByHeaderMenuUserId(companyId, personId, companyId, personId, personId, companyId, userId) | 업무 |
| private getWestLayout() | L1011-1046 | 생성자 | 상태 처리 | 업무 |
| public getServiceResult() | L1049-1054 | E6,E7,E10,checkManuel,setMenuList,checkCommute,checkActive,retrieveMenuGrid,openMenu,insertMenuLog,updateMenuLog | 상태 처리 | 업무 |
| private buildMenuHeaderGrid() | L1056-1063 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L1065-1093 | 생성자,E18,openMenu | 서비스 sys.Sys06_Menu.selectByHeaderMenuCompanyId, sys.Sys06_Menu.selectByHeaderMenuUserId(companyId, adminYn, userId, companyId, userId) | 업무 |
| private openMenu() | L1095-1132 | E20 | 조회창 Sys06_Lookup_SearchMenu 열기, 서비스 sys.Sys06_Menu.selectByText, sys.Sys06_Menu.selectByTextManager(userId, companyId, searchText) | 업무 |
| private insertMenuLog() | L1134-1150 | E1 | 서비스 sys.Sys96_OpenMenuLog.insert(companyId, personId, loginId, className) | 업무 |
| private updateMenuLog() | L1152-1165 | E1,insertMenuLog | 서비스 sys.Sys96_OpenMenuLog.updateSecond(openMenuLogId) | 업무 |
| public lookupMessage() | L1167-1170 | 공개 메서드 | 상태 처리 | 업무 |
| public LogoutMessage() | L1172-1175 | 공개 메서드 | 상태 처리 | 업무 |
| public Logout() | L1177-1192 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L176-178 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlContentStyle() | L180-182 | E17 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L184-186 | E17 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlMenuHeaderStyle() | L1351-1353 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildMenuHeaderGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L1060) addMenuHeaderText
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### TempData (`client/vi/TempData.java`, 1021줄)


#### 이벤트

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getStartDate() | L81-83 | 공개 메서드 | 상태 처리 | 업무 |
| public setStartDate() | L84-86 | 공개 메서드 | 상태 처리 | 업무 |
| public getCloseDate() | L88-90 | 공개 메서드 | 상태 처리 | 업무 |
| public setCloseDate() | L91-93 | 공개 메서드 | 상태 처리 | 업무 |
| public getPeriodString() | L95-97 | 공개 메서드 | 상태 처리 | 업무 |
| public setPeriodString() | L98-100 | 공개 메서드 | 상태 처리 | 업무 |
| public getSelectPersonName() | L102-104 | 공개 메서드 | 상태 처리 | 업무 |
| public setSelectPersonName() | L105-107 | 공개 메서드 | 상태 처리 | 업무 |
| public getSelectOrgName() | L109-111 | 공개 메서드 | 상태 처리 | 업무 |
| public setSelectOrgName() | L112-114 | 공개 메서드 | 상태 처리 | 업무 |
| public getLeaveCount() | L116-118 | 공개 메서드 | 상태 처리 | 업무 |
| public setLeaveCount() | L119-121 | 공개 메서드 | 상태 처리 | 업무 |
| public getEtcLeaveCount() | L123-125 | 공개 메서드 | 상태 처리 | 업무 |
| public setEtcLeaveCount() | L126-128 | 공개 메서드 | 상태 처리 | 업무 |
| public getLevel1Name() | L130-132 | 공개 메서드 | 상태 처리 | 업무 |
| public setLevel1Name() | L134-136 | 공개 메서드 | 상태 처리 | 업무 |
| public getLevel2Name() | L138-140 | 공개 메서드 | 상태 처리 | 업무 |
| public setLevel2Name() | L141-143 | 공개 메서드 | 상태 처리 | 업무 |
| public getDailyYn() | L145-147 | 공개 메서드 | 상태 처리 | 업무 |
| public setDailyYn() | L148-150 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserName() | L152-154 | 공개 메서드 | 상태 처리 | 업무 |
| public setUserName() | L155-157 | 공개 메서드 | 상태 처리 | 업무 |
| public setActMappingList() | L160-170 | 공개 메서드 | 상태 처리 | 업무 |
| public getActMappingList() | L172-219 | 공개 메서드 | 상태 처리 | 업무 |
| public getActMapping() | L221-223 | 공개 메서드 | 상태 처리 | 업무 |
| public setCertMappingList() | L226-236 | 공개 메서드 | 상태 처리 | 업무 |
| public getCertMappingList() | L238-276 | 공개 메서드 | 상태 처리 | 업무 |
| public getCertMapping() | L278-280 | 공개 메서드 | 상태 처리 | 업무 |
| public setRetireMappingList() | L283-293 | 공개 메서드 | 상태 처리 | 업무 |
| public getRetireMappingList() | L295-343 | 공개 메서드 | 상태 처리 | 업무 |
| public getRetireMapping() | L345-347 | 공개 메서드 | 상태 처리 | 업무 |
| public setLeaveMappingList() | L350-360 | 공개 메서드 | 상태 처리 | 업무 |
| public getLeaveMappingList() | L362-395 | 공개 메서드 | 상태 처리 | 업무 |
| public getLeaveMapping() | L397-399 | 공개 메서드 | 상태 처리 | 업무 |
| public setEachContMappingList() | L403-413 | 공개 메서드 | 상태 처리 | 업무 |
| public getEachContMappingList() | L415-447 | 공개 메서드 | 상태 처리 | 업무 |
| public getEachContMapping() | L449-451 | 공개 메서드 | 상태 처리 | 업무 |
| public setUserRegApprMappingList() | L454-464 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserRegApprMappingList() | L466-491 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserRegApprMapping() | L493-495 | 공개 메서드 | 상태 처리 | 업무 |
| public setBizTripApprMappingList() | L498-508 | 공개 메서드 | 상태 처리 | 업무 |
| public getBizTripApprMappingList() | L510-535 | 공개 메서드 | 상태 처리 | 업무 |
| public getBizTripApprMapping() | L537-539 | 공개 메서드 | 상태 처리 | 업무 |
| public setBizTripResultApprMappingList() | L542-552 | 공개 메서드 | 상태 처리 | 업무 |
| public getBizTripResultApprMappingList() | L554-579 | 공개 메서드 | 상태 처리 | 업무 |
| public getBizTripResultApprMapping() | L581-583 | 공개 메서드 | 상태 처리 | 업무 |
| public setErrandMappingList() | L586-596 | 공개 메서드 | 상태 처리 | 업무 |
| public getErrandMappingList() | L598-626 | 공개 메서드 | 상태 처리 | 업무 |
| public getErrandMapping() | L628-630 | 공개 메서드 | 상태 처리 | 업무 |
| public setBenefitMappingList() | L633-643 | 공개 메서드 | 상태 처리 | 업무 |
| public getBenefitMappingList() | L645-675 | 공개 메서드 | 상태 처리 | 업무 |
| public getBenefitMapping() | L677-679 | 공개 메서드 | 상태 처리 | 업무 |
| public setPfContractMappingList01() | L682-692 | 공개 메서드 | 상태 처리 | 업무 |
| public getPfContractMappingList01() | L694-721 | 공개 메서드 | 상태 처리 | 업무 |
| public getPfContractMapping01() | L723-725 | 공개 메서드 | 상태 처리 | 업무 |
| public setPfContractMappingList02() | L728-738 | 공개 메서드 | 상태 처리 | 업무 |
| public getPfContractMappingList02() | L740-767 | 공개 메서드 | 상태 처리 | 업무 |
| public getPfContractMapping02() | L769-771 | 공개 메서드 | 상태 처리 | 업무 |
| public setExtrActivityMappingList() | L774-784 | 공개 메서드 | 상태 처리 | 업무 |
| public getExtrActivityMappingList() | L786-815 | 공개 메서드 | 상태 처리 | 업무 |
| public getExtrActivityMapping() | L817-819 | 공개 메서드 | 상태 처리 | 업무 |
| public setResultExtrActivityMappingList() | L822-832 | 공개 메서드 | 상태 처리 | 업무 |
| public getResultExtrActivityMappingList() | L834-862 | 공개 메서드 | 상태 처리 | 업무 |
| public getResultExtrActivityMapping() | L864-866 | 공개 메서드 | 상태 처리 | 업무 |
| public setMailMappingList() | L869-879 | 공개 메서드 | 상태 처리 | 업무 |
| public getMailMappingList() | L881-902 | 공개 메서드 | 상태 처리 | 업무 |
| public setOvertimeReqMappingList() | L905-915 | 공개 메서드 | 상태 처리 | 업무 |
| public getOvertimeReqMappingList() | L917-949 | 공개 메서드 | 상태 처리 | 업무 |
| public getOvertimeReqMapping() | L951-953 | 공개 메서드 | 상태 처리 | 업무 |
| public setPmWorkMappingList() | L956-966 | 공개 메서드 | 상태 처리 | 업무 |
| public getPmWorkMappingList() | L968-999 | 공개 메서드 | 상태 처리 | 업무 |
| public getPmWorkMapping() | L1001-1003 | 공개 메서드 | 상태 처리 | 업무 |
| public getMailMapping() | L1005-1007 | 공개 메서드 | 상태 처리 | 업무 |
| public getFirstWeight() | L1009-1011 | 공개 메서드 | 상태 처리 | 업무 |
| public setFirstWeight() | L1012-1014 | 공개 메서드 | 상태 처리 | 업무 |
| public getSecondWeight() | L1015-1017 | 공개 메서드 | 상태 처리 | 업무 |
| public setSecondWeight() | L1018-1020 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sys01_Tab_UserCompany (`client/vi/sys/Sys01_Tab_UserCompany.java`, 39줄)

- 레이아웃: center=layout

#### 이벤트
[E0] 화면 열림 (생성자 L15-28) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setHtmlStyle() | L30-33 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBigStyle() | L35-38 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### LoginUser (`client/vi/LoginUser.java`, 331줄)


#### 이벤트

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getMobile() | L38-40 | 공개 메서드 | 상태 처리 | 업무 |
| public setMobile() | L42-44 | 공개 메서드 | 상태 처리 | 업무 |
| public setToDoDate() | L46-48 | 공개 메서드 | 상태 처리 | 업무 |
| public getToDoDate() | L50-52 | 공개 메서드 | 상태 처리 | 업무 |
| public setSubDomain() | L54-56 | 공개 메서드 | 상태 처리 | 업무 |
| public getSubDomain() | L58-60 | 공개 메서드 | 상태 처리 | 업무 |
| public setMacAddress() | L62-64 | 공개 메서드 | 상태 처리 | 업무 |
| public getMacAddress() | L66-68 | 공개 메서드 | 상태 처리 | 업무 |
| public setIpAddress() | L70-72 | 공개 메서드 | 상태 처리 | 업무 |
| public getIpAddress() | L74-76 | 공개 메서드 | 상태 처리 | 업무 |
| public setMode() | L78-80 | 공개 메서드 | 상태 처리 | 업무 |
| public getMode() | L82-84 | 공개 메서드 | 상태 처리 | 업무 |
| public setSelectDate() | L86-88 | 공개 메서드 | 상태 처리 | 업무 |
| public getSelectDate() | L90-92 | 공개 메서드 | 상태 처리 | 업무 |
| public setConfirmTransId() | L94-96 | 공개 메서드 | 상태 처리 | 업무 |
| public getConfirmTransId() | L98-100 | 공개 메서드 | 상태 처리 | 업무 |
| public setIsManager() | L102-104 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsManager() | L106-108 | 공개 메서드 | 상태 처리 | 업무 |
| public setIsUserManager() | L110-112 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsUserManager() | L114-116 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuFixYn() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuFixYn() | L122-124 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsIcam() | L126-132 | 공개 메서드 | 상태 처리 | 업무 |
| public setManagerModel() | L134-137 | 공개 메서드 | 상태 처리 | 업무 |
| public getManagerModel() | L139-141 | 공개 메서드 | 상태 처리 | 업무 |
| public setUserModel() | L143-147 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserModel() | L149-151 | 공개 메서드 | 상태 처리 | 업무 |
| public getCompanyId() | L153-161 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserId() | L163-170 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserIdStr() | L172-179 | 공개 메서드 | 상태 처리 | 업무 |
| public getThemeCode() | L181-183 | 공개 메서드 | 상태 처리 | 업무 |
| public getThemeName() | L185-187 | 공개 메서드 | 상태 처리 | 업무 |
| public getIconColor() | L189-191 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserName() | L193-200 | 공개 메서드 | 상태 처리 | 업무 |
| public getEmpNo() | L202-209 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserInfoString() | L211-224 | 공개 메서드 | 상태 처리 | 업무 |
| public getOrgCodeId() | L226-233 | 공개 메서드 | 상태 처리 | 업무 |
| public getParentCodeId() | L235-237 | 공개 메서드 | 상태 처리 | 업무 |
| public getParentCodeName() | L239-241 | 공개 메서드 | 상태 처리 | 업무 |
| public getMailInfo() | L243-245 | 공개 메서드 | 상태 처리 | 업무 |
| public getSmsId() | L247-249 | 공개 메서드 | 상태 처리 | 업무 |
| public getSmsAPIKey() | L251-253 | 공개 메서드 | 상태 처리 | 업무 |
| public getYear() | L255-257 | getNewYearDay | 상태 처리 | 업무 |
| public getYearMonth() | L259-261 | getMonthFirstDay | 상태 처리 | 업무 |
| public getTodayString() | L263-265 | 공개 메서드 | 상태 처리 | 업무 |
| public getTodayInt() | L267-269 | 공개 메서드 | 상태 처리 | 업무 |
| public getToday() | L271-274 | 공개 메서드 | 상태 처리 | 업무 |
| public getNewYearDay() | L276-278 | 공개 메서드 | 상태 처리 | 업무 |
| public getMonthFirstDay() | L280-282 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuInfoNoticeList() | L284-286 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuInfoNoticeList() | L288-290 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuInfoYn() | L292-294 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuInfoYn() | L296-298 | 공개 메서드 | 상태 처리 | 업무 |
| public getCompanyModel() | L300-302 | 공개 메서드 | 상태 처리 | 업무 |
| public setCompanyModel() | L304-306 | 공개 메서드 | 상태 처리 | 업무 |
| public getLogoutYn() | L308-310 | 공개 메서드 | 상태 처리 | 업무 |
| public setLogoutYn() | L312-314 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuList() | L316-318 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuList() | L320-322 | 공개 메서드 | 상태 처리 | 업무 |
| public getLoginId() | L324-326 | 공개 메서드 | 상태 처리 | 업무 |
| public setLoginId() | L328-330 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Frm01_Lookup_CheckList (`client/vi/frm/Frm01_Lookup_CheckList.java`, 322줄)

- 입력·하위 화면: `lookup` Frm01_Lookup_Outstanding

#### 이벤트
[E0] 화면 열림 (생성자 L68-93) → settings(), getEditor(), show()
[E1] anchor01.MouseDown (L110) → retrieve()
[E2] anchor01_1.MouseDown (L122) → retrieve()
[E3] anchor02.MouseDown (L134) → retrieve()
[E4] anchor02_1.MouseDown (L146) → retrieve()
[E5] anchor03.MouseDown (L158) → retrieve()
[E6] anchor03_1.MouseDown (L172) → retrieve()
[E7] anchor04.MouseDown (L186) → 인라인 L186-192 (new MouseDownHandler() { @Override pu…)
[E8] anchor04_1.MouseDown (L193) → 인라인 L193-199 (new MouseDownHandler() { @Override pu…)
[E9] anchor05.MouseDown (L200) → hide()
[E10] anchor05_1.MouseDown (L212) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-66 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L226-260 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L262-317 | E1,E2,E3,E4,E5,E6,open | 서비스 frm.Frm01_List.getNoticeCnt(companyId, personId, orgId) | 업무 |
| private settings() | L95-224 | 생성자 | 조회창 Frm01_Lookup_Outstanding 열기, 조회창 Frm01_Lookup_DailyCheckList 열기, 조회창 Frm01_Lookup_NoticeList 열기, 조회창 Sms10_Lookup_AlarmList 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L319-321 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Frm01_Lookup_Outstanding (`client/vi/frm/Frm01_Lookup_Outstanding.java`, 100줄)

- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - regDate 100 "등록일" DateFix
  - title 240 "제목" Text
  - regEmpName 100 "상신자" TextCenter
  - actionCell 80 "상세보기" CellFix 편집:apprButton

#### 이벤트
[E0] 화면 열림 (생성자 L35-50) → show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L30-33 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L80-95 | open,buildGrid | 서비스 apr.Apr01_Appr.selectOutstandingPopup(companyId, empId, toDay) | 업무 |
| private buildGrid() | L52-78 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L97-99 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L71) addDateFix
  gb.text('title', 240, '제목'),  // L72
  gb.textCenter('regEmpNm', 100, '상신자'),  // L73
  // ⚠ 대응 없음 (GridBuilder L74) addCellFix
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Frm01_Lookup_NoticeList (`client/vi/frm/Frm01_Lookup_NoticeList.java`, 102줄)

- 입력·하위 화면: `popup` Bbs02_Popup_NoticeAdmin
- 그리드 `grid` (buildGrid()):
  - fromDate 40 "" New
  - noticeNo 100 "공지번호" TextCenter
  - title2 420 "공지사항" TextHtml
  - fromDate 90 "등록일" Date
  - actionCell 50 " " Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L32-46) → show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L27-30 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L85-97 | open,buildGrid | 서비스 bbs.Bbs02_Notice.selectByTargetPerson(companyId, personId) | 업무 |
| private buildGrid() | L48-83 | 필드 초기화 | 팝업 Bbs02_Popup_NoticeAdmin 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L99-101 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L76) addNew
  gb.textCenter('noticeNo', 100, '공지번호'),  // L77
  // ⚠ 대응 없음 (GridBuilder L78) addTextHtml
  gb.date('fromDate', 90, '등록일'),  // L79
  // ⚠ 대응 없음 (GridBuilder L80) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Frm01_Lookup_DailyCheckList (`client/vi/frm/Frm01_Lookup_DailyCheckList.java`, 246줄)

- 입력·하위 화면: `lookup` Sch01_Lookup_InfoView
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - scheduleName 120 "업무구분" TextCenter
  - title 500 "제목" Text
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - yes 100 "처리완료" Boolean
  - not 100 "해당없음" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L48-65) → settings(), show()
[E1] grid.getStore().StoreRecordChange (L68) → 서비스 sch.Sch04_List.statusUpdateCheck(listId, manageDate, closeDate, infoId, title, scheduleCode, cycleCode, mngOrgId, managerId, personId, statusCode, note, companyId, deadlineId), 메시지 "상신중인 업무는 수정이 불가능합니다."

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-46 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L159-185 | open | 서비스 sch.Sch04_List.selectByManagerId(companyId, personId, orgId, startDate, aprYn, exceptYn, cancelYn, privateYn, dailyChkYn, statusCode, cycleCode, manageCheck, shareType, searchText) | 업무 |
| private view() | L187-236 | buildGrid | 조회창 Sch01_Lookup_InfoView 열기, 조회창 Sch10_Lookup_Ipo 열기, 서비스 sch.Sch10_Ipo.selectById | 업무 |
| private settings() | L67-139 | 생성자 | 서비스 sch.Sch04_List.statusUpdateCheck(listId, manageDate, closeDate, infoId, title, scheduleCode, cycleCode, mngOrgId, managerId, personId, statusCode, note, companyId, deadlineId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L141-157 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L238-241 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L243-245 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L149 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle12 100 "체크" (emp03_new_header_group_map04new_header_group_configset_html_grid_style12 컬럼 없음)
  gb.textCenter('scheduleNm', 120, '업무구분'),  // L150
  gb.text('title', 500, '제목'),  // L151
  // ⚠ 대응 없음 (GridBuilder L152) addCell
  // ⚠DB없음 L153 yes 100 "처리완료" (emp03_yes 컬럼 없음)
  // ⚠DB없음 L154 not 100 "해당없음" (emp03_not 컬럼 없음)
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Emp04_Lookup_AddTitleList (`client/vi/emp/Emp04_Lookup_AddTitleList.java`, 222줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - mainTitleYn 50 "본업무" BooleanYn2
  - orgFullName 250 "부서명" TextArea
  - titleName 110 "직책" TextCenter
  - outstandingCnt 100 "미결함" LongCenter
  - closeDate 100 "겸직종료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L64-117) → show(), retrieve()
[E1] confirmButton[확인].Select (L72) → login()
[E2] loginButton[전환].Select (L83) → loginChk()
       └ [E5] msgBox.DialogHide [YES] (L148) → login()
[E3] hideButton[닫기].Select (L89) → hide()
[E4] grid.CellDoubleClick (L96) → loginChk(), login()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public login() | L50-56 | E1,E4,E5 | 상태 처리 | 업무 |
| public open() | L58-62 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L132-136 | 생성자,login,open | 서비스 emp.Emp04_AddTitle.getAddTitleList(personId) | 업무 |
| private loginChk() | L138-165 | E2,E4 | ConfirmBox → E5 | 업무 |
| private login() | L167-194 | E1,E4,E5 | 서비스 sys.Sys02_User.getChangeInfo(personId, companyId, transDate) | 업무 |
| private setMenuList() | L196-217 | login | 서비스 sys.Sys06_Menu.getMenuList(companyId, userId) | 업무 |
| public buildGrid() | L119-130 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L219-221 | 생성자,login | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.booleanYn2('mainTitleYn', 50, '본업무'),  // L123 SQL 계산 컬럼(getAddTitleList: 'true')
  gb.textArea('orgFullNm', 250, '부서명'),  // L124 SQL 계산 컬럼(getAddTitleList: f_org_parent_full_nm(emp03_org_code_id,…)
  gb.textCenter('titleNm', 110, '직책'),  // L125 SQL 계산 컬럼(getAddTitleList: f_cdnm('EmpTitleCode', emp03_title_cd, …)
  gb.longCenter('outstandingCnt', 100, '미결함'),  // L126 SQL 계산 컬럼(getAddTitleList: ( SELECT COUNT(a.apr01_appr_id) FROM ap…)
  gb.date('closeDate', 100, '겸직종료일'),  // L127
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={login}>확인</Button>
2. <Button type="unknown" onClick={loginChk}>전환</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp00_Lookup_SendMessage (`client/vi/emp/Emp00_Lookup_SendMessage.java`, 273줄)

- 툴바 `buttonBar`: 기준일: {baseDate} 조직/직무/성명: {searchText} {retrieveButton}
- 툴바 `messageBar`: 알림내용: ※ 해당 사용자가 오프라인 상태일 경우 알림이 발송되지 않습니다 ※: {label01}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField, `message` MyTextArea
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentFullName 200 "조직" Text
  - titleName 120 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text
  - transDate 100 "발령일" Date

#### 이벤트
[E1] label01.MouseDown (L75) → 인라인 L75-80 (new MouseDownHandler() { @Override pu…)
[E2] searchText.KeyPress [Enter] (L112) → retrieve()
[E3] retrieveButton[조회].Select (L120) → retrieve()
[E4] sendButton[전송].Select (L126) → sendMessage()
[E5] closeButton[닫기].Select (L132) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-102 | 공개 메서드 | 팝업 Emp00_Popup_Example 열기 | 업무 |
| public retrieve() | L154-168 | E2,E3,open | 서비스 emp.Emp00_TransInfo.getOnlineList(companyId, searchText, transDate) | 업무 |
| public sendMessage() | L170-218 | E4 | 미선택 시 alert "선택된 사원이 없습니다" | 업무 |
| public sendMessageAll() | L220-241 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L104-138 | open | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L140-152 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L243-245 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L247-249 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlCheckBoxStyle() | L251-253 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L145
  gb.text('titleNm', 120, '직책'),  // L146
  gb.text('empNo', 80, '사번'),  // L147
  gb.text('korNm', 100, '성명'),  // L148
  gb.date('transDate', 100, '발령일'),  // L149
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={sendMessage}>전송</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp00_Popup_Example (`client/vi/emp/Emp00_Popup_Example.java`, 43줄)


#### 이벤트
[E0] 화면 열림 (생성자 L17-38) → show()
[E1] anchor.MouseDown (L27) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setHtmlHeaderStyle() | L40-42 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Att02_Lookup_Commute (`client/vi/att/Att02_Lookup_Commute.java`, 450줄)

- 입력·하위 화면: `lookup` Att02_Edit_CheckOutTime

#### 이벤트
[E0] 화면 열림 (생성자 L84-123) → settings(), show(), changeHeading(), getClock(), getLastInfo(), defaultInfo()
[E1] inButton[출근].Select (L190) → commute()
[E2] outButton[퇴근].Select [YES] (L196) → commute()
[E3] msgBox.DialogHide [YES] (L205) → commute()
[E4] offWorkButton[외근 후 퇴근].Select [YES] (L223) → commuteOffWork()
[E5] msgBox.DialogHide [YES] (L228) → commuteOffWork()
[E6] overButton[연장근무신청].Select (L246) → 인라인 L246-252 (new SelectHandler(){ @Override public…)
[E7] afternoonButton[오후근무신청].Select (L253) → 인라인 L253-259 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private startProcessing() | L62-74 | commute,commuteOffWork | 상태 처리 | 업무 |
| private endProcessing() | L76-82 | commute,commuteOffWork | 상태 처리 | 업무 |
| private defaultInfo() | L125-140 | 생성자 | 서비스 att.Att01_WorkPolicy.getModel(companyId) | 업무 |
| private changeHeading() | L142-144 | 생성자,getInOutTime | 상태 처리 | 업무 |
| private getLastInfo() | L146-187 | 생성자 | 팝업 Att02_Edit_CheckOutTime 열기, 서비스 att.Att02_Commute.getLastInfo(companyId, personId) | 업무 |
| private getClock() | L262-273 | 생성자 | 상태 처리 | 업무 |
| private getInOutTime() | L275-361 | defaultInfo,commute,commuteOffWork | 서비스 att.Att02_Commute.selectByDate(companyId, personId, baseDate) | 업무 |
| private updateReason() | L363-371 | getInOutTime | 팝업 Att02_Edit_Reason 열기 | 업무 |
| private commute() | L373-416 | E1,E2,E3 | 서비스 att.Att02_Commute.insert(companyId, personId, on, baseDate, baseDate, baseDate) | 업무 |
| private commuteOffWork() | L418-445 | E4,E5 | 서비스 att.Att02_Commute.insertOffWork(companyId, personId, baseDate) | 업무 |
| private settings() | L189-260 | 생성자 | 조회창 Att03_Lookup_OvertimeReq 열기, 조회창 Att05_Lookup_PmWork 열기, 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L54-56 | getInOutTime,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L447-449 | changeHeading | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={commute}>출근</Button>
2. <Button type="unknown" onClick={commute}>퇴근</Button>
3. <Button type="unknown" onClick={commuteOffWork}>외근 후 퇴근</Button>
4. <Button type="unknown" onClick={() => /* 인라인 L246-252 (new SelectHandler(){ @Override public…) */}>연장근무신청</Button>
5. <Button type="unknown" onClick={() => /* 인라인 L253-259 (new SelectHandler(){ @Override public…) */}>오후근무신청</Button>

### Att05_Lookup_PmWork (`client/vi/att/Att05_Lookup_PmWork.java`, 484줄)

- 툴바 `buttonBar`: 근무일자: {baseDate} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `baseDate` QuickMoveDateField, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - workDate 100 "근무일자" Date
  - reason 450 "사유" Text 편집:TextField
  - statusName 100 "상태" TextStatus
  - actionCell 80 "상신(보기)" Cell 편집:actionCell01

#### 이벤트
[E0] 화면 열림 (생성자 L80-109) → settings(), show()
[E1] retrieveButton[조회].Select (L115) → retrieve()
[E2] insertButton[등록].Select (L121) → insertRow()
[E3] updateButton[저장].Select (L127) → updateChk01()
[E4] deleteButton[삭제].Select (L133) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L401) → 서비스 att.Att05_PmWork.delete
[E5] closeButton[닫기].Select (L139) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L63-65 | buildGrid,insertLinkApproval,updateApprId,update,retrieve | 상태 처리 | 업무 |
| public open() | L76-78 | 공개 메서드 | 상태 처리 | 업무 |
| private defaultCheck() | L147-163 | settings | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L213-231 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "관련 문서분류가 존재하지않습니다. 관리자에게 연락해주세요" | 업무 |
| private updateApprId() | L233-250 | insertLinkApproval | 서비스 att.Att05_PmWork.update | 업무 |
| private insertRow() | L252-265 | E2 | 상태 처리 | 업무 |
| private updateChk01() | L267-291 | E3 | 상태 처리 | 업무 |
| private updateChk02() | L293-344 | updateChk01 | 서비스 att.Att05_PmWork.notInPmWorkIdList(companyId, personId, pmWorkIdList) | 업무 |
| private updateChk03() | L346-364 | updateChk02 | 서비스 att.Att03_OvertimeReq.selectByPersonId(companyId, personId, baseDate) | 업무 |
| private update() | L366-374 | updateChk03 | 서비스 att.Att05_PmWork.update | 업무 |
| public retrieve() | L376-389 | E1,execute,open,buildGrid,updateApprId,update | 서비스 att.Att05_PmWork.selectByWorkDate(companyId, personId, workDate) | 업무 |
| public deleteRow() | L391-419 | E4 | ConfirmBox → E6 | 업무 |
| public createMapping() | L422-440 | buildGrid | 상태 처리 | 업무 |
| private checkStringNull() | L442-450 | createMapping | 상태 처리 | 업무 |
| private checkDateNull() | L452-462 | createMapping | 상태 처리 | 업무 |
| private checkLongNull02() | L464-475 | createMapping | 상태 처리 | 업무 |
| private settings() | L111-145 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L165-211 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "저장 후 진행가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L477-479 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L481-483 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('workDate', 100, '근무일자'),  // L205
  gb.text('reason', 450, '사유', { editor: 'text' }),  // L206
  gb.textStatus('statusNm', 100, '상태'),  // L207 SQL 계산 컬럼(selectByPersonId: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L208) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={updateChk01}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Att03_Lookup_OvertimeReq (`client/vi/att/Att03_Lookup_OvertimeReq.java`, 901줄)

- 툴바 `buttonBar`: 근무일자: {baseDate} {retrieveButton} {insertButton} {updateButton} {deleteButton} {label01}
- 입력·하위 화면: `baseDate` QuickMoveDateField, `workType` ComboBoxField("WorkTypeCode"), `rewardType` ComboBoxField("WorkRewardTypeCode"), `overtimeField` LongField, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - workDate 100 "근무일자" Date
  - workTypeName 100 "구분" TextCenter
  - overtimeMin 100 "연장시간(분)" Long 편집:overtimeField
  - overTimeStr 200 "근무시간" TextCenter
  - reason 350 "사유" Text 편집:TextField
  - workRewardTypeName 150 "보상" TextCenter 편집:rewardType
  - statusName 100 "상태" TextStatus
  - actionCell 80 "상신(보기)" Cell 편집:actionCell01

#### 이벤트
[E0] 화면 열림 (생성자 L97-128) → settings(), show()
[E1] retrieveButton[조회].Select (L133) → retrieve()
[E2] insertButton[등록].Select (L139) → insertRow01()
[E3] updateButton[저장].Select (L145) → updateChk01()
[E4] deleteButton[삭제].Select (L151) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L801) → 서비스 att.Att03_OvertimeReq.delete
[E5] closeButton[닫기].Select (L157) → hide()
[E6] workType[WorkTypeCode].Collapse (L233) → 인라인 L233-236 (e -> { Att03_OvertimeReqModel selectM…)
[E7] rewardType[WorkRewardTypeCode].Collapse (L238) → 인라인 L238-241 (e -> { Att03_OvertimeReqModel m = gri…)
[E8] overtimeField.ValueChange [selectModel == null] (L243) → handleChildRows(), recalcFrom()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L69-72 | buildGrid,insertLinkApproval,updateApprId,insertNightRow,update,retrieve | 상태 처리 | 업무 |
| public open() | L93-95 | 공개 메서드 | 상태 처리 | 업무 |
| private defaultInfo() | L166-229 | execute,settings | 서비스 att.Att01_WorkPolicy.getModel, pay.Pay34_WorkTimeConfig.getModel, dcr.Dcr30_Link.selectByLinkCode(companyId, startDate, companyId) | 업무 |
| private insertLinkApproval() | L312-330 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "관련 문서분류가 존재하지않습니다. 관리자에게 연락해주세요" | 업무 |
| private updateApprId() | L332-349 | insertLinkApproval | 서비스 att.Att03_OvertimeReq.update | 업무 |
| private handleChildRows() | L351-375 | E8 | 상태 처리 | 업무 |
| private recalcFrom() | L377-447 | E8 | 상태 처리 | 업무 |
| private setTime() | L449-454 | recalcFrom,insertNightRow | 상태 처리 | 업무 |
| private timeToMinutes() | L456-462 | defaultInfo,recalcFrom,insertRow02,updateChk01 | 상태 처리 | 업무 |
| private minutesToTime() | L464-478 | recalcFrom,insertNightRow | 상태 처리 | 업무 |
| private insertRow01() | L480-515 | E2 | 서비스 att.Att05_PmWork.getWorkDateInfo(companyId, personId, workDate) | 업무 |
| private insertRow02() | L517-550 | insertRow01 | 상태 처리 | 업무 |
| private insertNightRow() | L552-577 | recalcFrom | 상태 처리 | 업무 |
| private updateChk01() | L579-637 | E3 | 상태 처리 | 업무 |
| private updateChk02() | L639-712 | updateChk01 | 서비스 att.Att03_OvertimeReq.notInOvertimeReqIdList, att.Att03_OvertimeReq.checkWeekMaxTime(companyId, personId, overtimeReqIdList, baseDate, weekMaxAddHours) | 업무 |
| private update() | L714-732 | updateChk02 | GridDeleteData att.Att03_OvertimeReq.delete, att.Att03_OvertimeReq.update | 업무 |
| public retrieve() | L734-749 | E1,execute,open,buildGrid,updateApprId,update | 서비스 att.Att03_OvertimeReq.selectByPersonId(companyId, personId, baseDate) | 업무 |
| private retrieveLabel() | L751-781 | retrieve | 서비스 att.Att03_OvertimeReq.getInfo(companyId, personId, baseDate) | 업무 |
| public deleteRow() | L783-819 | E4 | 미선택 시 alert "결재완료된 항목은 삭제불가능합니다" → 확인창 E9 | 업무 |
| public createMapping() | L822-841 | buildGrid | 상태 처리 | 업무 |
| private checkStringNull() | L843-851 | createMapping | 상태 처리 | 업무 |
| private checkDateNull() | L853-863 | createMapping | 상태 처리 | 업무 |
| private checkLongNull01() | L865-875 | createMapping | 상태 처리 | 업무 |
| private checkLongNull02() | L877-888 | 미사용 후보 | 상태 처리 | 업무 |
| private settings() | L130-164 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L231-310 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "저장 후 진행가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L890-892 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L894-896 | defaultInfo,retrieveLabel | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L898-900 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('workDate', 100, '근무일자'),  // L300
  gb.textCenter('workTypeNm', 100, '구분'),  // L301 SQL 계산 컬럼(notInOvertimeReqIdList: f_cdnm('WorkTypeCode', att03_work_type_…)
  gb.long('overtimeMin', 100, '연장시간(분)'),  // L302
  gb.textCenter('overTimeStr', 200, '근무시간'),  // L303 SQL 계산 컬럼(selectByPersonId: CASE WHEN a.att03_work_type_cd = '10' T…)
  gb.text('reason', 350, '사유', { editor: 'text' }),  // L304
  gb.textCenter('workRewardTypeNm', 150, '보상'),  // L305 SQL 계산 컬럼(notInOvertimeReqIdList: f_cdnm('WorkRewardTypeCode', att03_work…)
  gb.textStatus('statusNm', 100, '상태'),  // L306 SQL 계산 컬럼(selectByPersonId: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L307) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow01}>등록</Button>
3. <Button type="save" onClick={updateChk01}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Att02_Edit_Reason (`client/vi/att/Att02_Edit_Reason.java`, 91줄)

- 입력·하위 화면: `reason` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L45-56) → show()
[E1] updateButton[제출].Select (L59) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L30-43 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L67-86 | E1 | 서비스 att.Att02_Commute.updateReason(commuteId, actionCode, reason) | 업무 |
| private settings() | L58-65 | edit | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L88-90 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>제출</Button>

### Att02_Edit_CheckOutTime (`client/vi/att/Att02_Edit_CheckOutTime.java`, 177줄)

- 입력·하위 화면: `checkInTime` MyDateField, `checkOutTime` MyDateField, `checkInTimeStr` TextField, `checkOutTimeStr` TextField 빈칸="HH24:MI"

#### 이벤트
[E0] 화면 열림 (생성자 L67-97) → show()
[E1] checkOutTimeStr[퇴근시간].Blur (L101) → formatTime()
[E2] checkOutTimeStr[퇴근시간].KeyPress (L106) → 인라인 L106-111 (event -> { char c = event.getCharCode())
[E3] updateButton[제출].Select (L112) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L48-65 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L120-145 | E3 | 서비스 att.Att02_Commute.updateCheckOutTime(commuteId, checkOutTime, checkOutTimeStr) | 업무 |
| private isValidTime() | L147-149 | update | 상태 처리 | 업무 |
| private formatTime() | L151-168 | E1 | 상태 처리 | 업무 |
| private settings() | L99-118 | edit | 이벤트 연결, 초기값: checkOutTimeStr=formatted("퇴근시간") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L170-172 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L174-176 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>제출</Button>

