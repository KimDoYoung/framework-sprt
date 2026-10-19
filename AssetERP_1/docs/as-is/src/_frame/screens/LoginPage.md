# LoginPage

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/LoginPage.java`
- 함께 쓰는 클래스 7개:
  - `TempData` `client/vi/TempData.java`
  - `Sys83_Lookup_TempPassword` `client/vi/sys/Sys83_Lookup_TempPassword.java`
  - `Sys27_Lookup_Request` `client/vi/sys/Sys27_Lookup_Request.java`
  - `Sys25_Lookup_Reset` `client/vi/sys/Sys25_Lookup_Reset.java`
  - `Sys25_Lookup_Password` `client/vi/sys/Sys25_Lookup_Password.java`
  - `LoginUser` `client/vi/LoginUser.java`
  - `Emp04_Lookup_AddTitleList` `client/vi/emp/Emp04_Lookup_AddTitleList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`MainFrame`](../../_frame/screens/MainFrame.md), [`Sys01_Lookup_SelectSingle`](../../sys/components/Sys01_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.cookieLogin` | LoginPage:362 | [`Emp00_TransInfo.java:625`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.cookieLogin`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp03_Trans.LoginCheck` | LoginPage:372, LoginPage:401 | [`Emp03_Trans.java:146`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.LoginCheck`](../../emp/sql/emp03_trans.md) |
| `emp.Emp04_AddTitle.getAddTitleList` | Emp04_Lookup_AddTitleList:135, LoginPage:743 | [`Emp04_AddTitle.java:39`](../../emp/services/Emp04_AddTitle.md) | [`emp04_add_title.getAddTitleList`](../../emp/sql/emp04_add_title.md) |
| `sys.LoginServer.getSystemInfo` | LoginPage:177 | [`LoginServer.java:81`](../../sys/services/LoginServer.md) | - |
| `sys.Sys01_Company.selectByCompanyCode` | LoginPage:148, LoginPage:464 | [`Sys01_Company.java:31`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByCompanyCode`](../../sys/sql/sys01_company.md) |
| `sys.Sys02_User.checkUserName` | LoginPage:139 | [`Sys02_User.java:31`](../../sys/services/Sys02_User.md) | - |
| `sys.Sys02_User.getChangeInfo` | Emp04_Lookup_AddTitleList:171 | [`Sys02_User.java:275`](../../sys/services/Sys02_User.md) | [`emp00_trans_info.selectByComplianceCheck`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByPersonId`](../../emp/sql/emp00_trans_info.md) |
| `sys.Sys02_User.getLoginInfo` | LoginPage:449 | [`Sys02_User.java:43`](../../sys/services/Sys02_User.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp00_trans_info.checkRetire`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByComplianceCheck`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByLoginId`](../../emp/sql/emp00_trans_info.md), [`org00_org_info.selectByParentId`](../../org/sql/org00_org_info.md), [`sys02_user.selectByLoginId`](../../sys/sql/sys02_user.md), [`sys05_user_role.selectByUserId`](../../sys/sql/sys05_user_role.md), [`sys25_password.selectByPersonId`](../../sys/sql/sys25_password.md), [`sys26_login.insertSeq`](../../sys/sql/sys26_login.md) |
| `sys.Sys02_User.userLock` | LoginPage:777 | [`Sys02_User.java:333`](../../sys/services/Sys02_User.md) | [`emp01_person.selectByCompanyCode`](../../emp/sql/emp01_person.md), [`emp01_person.updateLockYn`](../../emp/sql/emp01_person.md) |
| `sys.Sys05_UserRole.getAdminCheck` | LoginPage:577 | [`Sys05_UserRole.java:43`](../../sys/services/Sys05_UserRole.md) | [`sys05_user_role.getAdminCheck`](../../sys/sql/sys05_user_role.md) |
| `sys.Sys06_Menu.getMenuList` | Emp04_Lookup_AddTitleList:197 | [`Sys06_Menu.java:286`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.getMenuList`](../../sys/sql/sys06_menu.md) |
| `sys.Sys25_Password.checkPassword` | Sys25_Lookup_Password:206 | [`Sys25_Password.java:57`](../../sys/services/Sys25_Password.md) | [`sys25_password.checkPassword`](../../sys/sql/sys25_password.md) |
| `sys.Sys25_Password.checkPasswordRule` | Sys25_Lookup_Password:222, Sys25_Lookup_Password:254 | [`Sys25_Password.java:67`](../../sys/services/Sys25_Password.md) | [`sys25_password.checkPasswordRule`](../../sys/sql/sys25_password.md) |
| `sys.Sys25_Password.extension` | Sys25_Lookup_Password:306 | [`Sys25_Password.java:118`](../../sys/services/Sys25_Password.md) | [`sys25_password.extension`](../../sys/sql/sys25_password.md), [`sys25_password.getPersonId`](../../sys/sql/sys25_password.md) |
| `sys.Sys25_Password.getCode` | Sys25_Lookup_Reset:148 | [`Sys25_Password.java:28`](../../sys/services/Sys25_Password.md) | [`sys25_password.check`](../../sys/sql/sys25_password.md) |
| `sys.Sys25_Password.insert` | Sys25_Lookup_Password:285 | [`Sys25_Password.java:79`](../../sys/services/Sys25_Password.md) | [`emp01_person.selectByCompanyCode`](../../emp/sql/emp01_person.md), [`sys25_password.checkInsert`](../../sys/sql/sys25_password.md), [`sys25_password.insert`](../../sys/sql/sys25_password.md), [`sys25_password.updatePassword`](../../sys/sql/sys25_password.md) |
| `sys.Sys27_LoginManage.checkMacAddress` | LoginPage:612 | [`Sys27_LoginManage.java:41`](../../sys/services/Sys27_LoginManage.md) | [`sys27_login_manage.checkMacAddress`](../../sys/sql/sys27_login_manage.md) |
| `sys.Sys27_LoginManage.insert` | Sys27_Lookup_Request:106 | [`Sys27_LoginManage.java:81`](../../sys/services/Sys27_LoginManage.md) | [`sys27_login_manage.insert`](../../sys/sql/sys27_login_manage.md), [`sys27_login_manage.selectByMacAddress`](../../sys/sql/sys27_login_manage.md) |
| `sys.Sys28_LoginRealTime.updateIpAddress` | LoginPage:678, LoginPage:699, LoginPage:721 | [`Sys28_LoginRealTime.java:32`](../../sys/services/Sys28_LoginRealTime.md) | [`sys28_login_real_time.insertInfo`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.selectByDate`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.selectByPersonId`](../../sys/sql/sys28_login_real_time.md), [`sys28_login_real_time.updateInfo`](../../sys/sql/sys28_login_real_time.md) |
| `sys.Sys29_LoginSecure.checkLoginSecure` | LoginPage:190 | [`Sys29_LoginSecure.java:28`](../../sys/services/Sys29_LoginSecure.md) | [`sys29_login_secure.checkLoginSecure`](../../sys/sql/sys29_login_secure.md) |
| `sys.Sys83_SecondaryAuthUser.selectByTempPassword` | Sys83_Lookup_TempPassword:156 | [`Sys83_SecondaryAuthUser.java:25`](../../sys/services/Sys83_SecondaryAuthUser.md) | [`sys83_secondary_auth_user.selectByTempPassword`](../../sys/sql/sys83_secondary_auth_user.md) |
| `sys.Sys83_SecondaryAuthUser.sendTempPassword` | Sys83_Lookup_TempPassword:132 | [`Sys83_SecondaryAuthUser.java:36`](../../sys/services/Sys83_SecondaryAuthUser.md) | [`sys83_secondary_auth_user.insert`](../../sys/sql/sys83_secondary_auth_user.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys25_password`](../../../db/tables/sys.md), [`sys26_login`](../../../db/tables/sys.md), [`sys27_login_manage`](../../../db/tables/sys.md), [`sys28_login_real_time`](../../../db/tables/sys.md), [`sys29_login_secure`](../../../db/tables/sys.md), [`sys40_bookmark`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys83_secondary_auth_user`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_password_rule`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### LoginPage (`client/vi/LoginPage.java`, 842줄)

- 입력·하위 화면: `loginStr` CustomTextField 빈칸="로그인 ID", `passWordStr` CustomPasswordField 빈칸="비밀번호", `subDomain` CustomLookupTriggerField 빈칸="admin (관리자)", `autoLoginCBox` CheckBox, `lookup` Sys01_Lookup_SelectSingle, `pwdModifyLookup` Sys25_Lookup_Password, `popup` Sys25_Lookup_Reset
- 버튼: loginButton

#### 이벤트
[E0] 화면 열림 (생성자 L114-213) → getServiceResult(), open()
[E1] subDomain.TriggerClick [result != null] (L222) → 인라인 L222-241 (new TriggerClickHandler(){ @Override …)
[E2] loginStr.KeyPress [Enter] (L247) → checkCapsLock(), loginCheck()
[E3] passWordStr.KeyPress [Enter] (L264) → checkCapsLock(), loginCheck()
[E4] loginButton[로그인].Select (L280) → loginCheck()
[E5] chromeDesc.Click (L298) → 인라인 L298-303 (메시지: "https://www.google.com/chrome)
[E6] passwordFind.Click (L304) → resetPassword()
[E7] requestForm.SubmitComplete (L356) → getServiceResult(), checkExt()
       └ [E9] msgBox.DialogHide [YES] (L495) → changePassword(), checkExt()
       └ [E10] msgBox.DialogHide [YES] (L542) → changePassword()
[E8] requestForm.SubmitComplete (L418) → newFormPanel(), login()
[E11] msgBox.DialogHide [YES] (L625) → 메시지 "사용승인요청이 완료되었습니다. 요청결과는 문자로 …"
[E12] requestForm.SubmitComplete (L696) → getServiceResult(), openFrame3()
[E13] requestForm.SubmitComplete (L718) → getServiceResult(), openFrame3()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L215-393 | 생성자 | 조회창 Sys01_Lookup_SelectSingle 열기, 서비스 emp.Emp00_TransInfo.cookieLogin, emp.Emp03_Trans.LoginCheck(loginId, companyCode, personId) | 업무 |
| public loginCheck() | L395-428 | E2,E3,E4 | 서비스 emp.Emp03_Trans.LoginCheck(loginStr, subDomain) | 업무 |
| private login() | L430-461 | E8 | 서비스 sys.Sys02_User.getLoginInfo | 업무 |
| private setCompanyModel() | L463-477 | login | 서비스 sys.Sys01_Company.selectByCompanyCode(companyCode) | 업무 |
| public getServiceResult() | L480-573 | 생성자,E7,E12,E13,loginCheck,setCompanyModel,checkExt,checkMacAddress,openFrame2,openFrame3,userLock | ConfirmBox → E9 | 업무 |
| private checkExt() | L575-607 | E7,E9,getServiceResult | 조회창 Sys83_Lookup_TempPassword 열기, 서비스 sys.Sys05_UserRole.getAdminCheck(companyId, userId) | 업무 |
| private checkMacAddress() | L610-655 | 미사용 후보 | 조회창 Sys27_Lookup_Request 열기, 확인창 표시, 서비스 sys.Sys27_LoginManage.checkMacAddress | 업무 |
| private openFrame() | L657-674 | checkExt,checkMacAddress | 상태 처리 | 업무 |
| private openFrame2() | L676-739 | openFrame | 서비스 sys.Sys28_LoginRealTime.updateIpAddress, sys.Sys28_LoginRealTime.updateIpAddress, sys.Sys28_LoginRealTime.updateIpAddress(personId, ipAddress, personId, ipAddress, personId, ipAddress) | 업무 |
| private openFrame3() | L741-766 | E12,E13,openFrame2 | 조회창 Emp04_Lookup_AddTitleList 열기, 서비스 emp.Emp04_AddTitle.getAddTitleList(personId) | 업무 |
| private openMainFrame() | L768-774 | openFrame3 | 상태 처리 | 업무 |
| private userLock() | L776-788 | getServiceResult | 서비스 sys.Sys02_User.userLock | 업무 |
| private changePassword() | L790-795 | E9,E10 | 조회창 Sys25_Lookup_Password 열기 | 업무 |
| private resetPassword() | L797-800 | E6 | 조회창 Sys25_Lookup_Reset 열기 | 업무 |
| protected onBlinkBorder() | L802-805 | 미사용 후보 | 상태 처리 | 업무 |
| private checkCapsLock() | L807-819 | E2,E3 | 상태 처리 | 업무 |
| private newFormPanel() | L821-825 | E8 | 상태 처리 | 업무 |
| private checkUpperCase() | L827-829 | checkCapsLock | 상태 처리 | 업무 |
| private checkLowerCase() | L831-833 | checkCapsLock | 상태 처리 | 업무 |
| private setHtmlMRBStyle() | L835-837 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={loginCheck}>로그인</Button>

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

### Sys83_Lookup_TempPassword (`client/vi/sys/Sys83_Lookup_TempPassword.java`, 201줄)

- 입력·하위 화면: `tempPasswordField` TextField 빈칸="발송된 숫자 6자리 입력"

#### 이벤트
[E0] 화면 열림 (생성자 L54-73) → settings(), getEditor(), show()
[E1] sendButton[발급].Select (L78) → getRendom(), sendTempPassword()
[E2] updateButton[인증].Select [sendButton.isEnabled()] (L92) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-52 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L108-129 | 생성자 | 상태 처리 | 업무 |
| private sendTempPassword() | L131-153 | E1 | 서비스 sys.Sys83_SecondaryAuthUser.sendTempPassword(companyId, personId, phone, tempPassword) | 업무 |
| private confirm() | L155-176 | E2 | 서비스 sys.Sys83_SecondaryAuthUser.selectByTempPassword(companyId, personId, phone, tempPassword) | 업무 |
| private getRendom() | L178-192 | E1 | 상태 처리 | 업무 |
| private settings() | L75-106 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L198-200 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* getRendom(), sendTempPassword() */}>발급</Button>
2. <Button type="unknown" onClick={confirm}>인증</Button>

### Sys27_Lookup_Request (`client/vi/sys/Sys27_Lookup_Request.java`, 135줄)

- 입력·하위 화면: `loginPlaceComboBox` ComboBoxField("LoginPlaceCode") 빈칸="선택해주세요", `reasonField` MyTextArea 빈칸="사유를 입력해주세요"

#### 이벤트
[E0] 화면 열림 (생성자 L42-74) → getEditor(), show()
[E1] updateButton[신청].Select (L52) → update()
[E2] closeButton[취소].Select (L58) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-40 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L76-92 | 생성자 | 상태 처리 | 업무 |
| private update() | L94-126 | E1 | 서비스 sys.Sys27_LoginManage.insert(placeCode, reason, personId, companyId, macAddress) | 업무 |
| private setHtmlHeaderStyle() | L128-130 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L132-134 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={update}>신청</Button>
2. <Button type="cancel" onClick={hide}>취소</Button>

### Sys25_Lookup_Reset (`client/vi/sys/Sys25_Lookup_Reset.java`, 225줄)

- 입력·하위 화면: `empNoField` TextField 빈칸="로그인 ID", `phoneField` TextField 빈칸="Asset-ERP에 등록된 휴대폰번호", `tempField` TextField 빈칸="6자리", `lookup` Sys25_Lookup_Password

#### 이벤트
[E0] 화면 열림 (생성자 L56-69) → getEditor(), show()
[E1] empNoField[로그인 ID].ValueChange (L75) → 인라인 L75-84 (new ValueChangeHandler<String>() { @O…)
[E2] phoneField[휴대폰 번호].ValueChange (L86) → 인라인 L86-95 (new ValueChangeHandler<String>() { @O…)
[E3] sendButton[전송].Select (L97) → sendCode()
[E4] resetButton[비밀번호 변경].Select (L103) → resetPassword()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-54 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L71-109 | open | 상태 처리 | 업무 |
| private getEditor() | L111-145 | 생성자 | 상태 처리 | 업무 |
| private sendCode() | L147-170 | E3 | 서비스 sys.Sys25_Password.getCode(companyCode, empNo, phone) | 업무 |
| private resetPassword() | L172-183 | E4 | 조회창 Sys25_Lookup_Password 열기 | 업무 |
| private setEnables() | L185-190 | setting,sendCode,startTimer | 상태 처리 | 업무 |
| private startTimer() | L192-215 | sendCode | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L218-220 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L222-224 | getEditor,startTimer | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={sendCode}>전송</Button>
2. <Button type="unknown" onClick={resetPassword}>비밀번호 변경</Button>

### Sys25_Lookup_Password (`client/vi/sys/Sys25_Lookup_Password.java`, 354줄)

- 입력·하위 화면: `beforePassword` PasswordField, `afterPassword1` PasswordField, `afterPassword2` PasswordField

#### 이벤트
[E0] 화면 열림 (생성자 L76-90) → getEditor(), show()
[E1] beforePassword[현재 비밀번호].KeyPress [checkCapsLock(event)] (L99) → checkCapsLock()
[E2] afterPassword1[변경 비밀번호].KeyPress [checkCapsLock(event)] (L111) → checkCapsLock()
[E3] afterPassword2[비밀번호 확인].KeyPress [checkCapsLock(event)] (L123) → checkCapsLock()
[E4] updateButton[확인].Select (L135) → insertChcek()
[E5] extensionButton[3개월 후 변경].Select [YES] (L141) → extension()
[E6] msgBox.DialogHide [YES] (L146) → extension()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNoExtension() | L58-65 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L67-74 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L92-164 | openNoExtension,open | 확인창 표시 | 업무 |
| private getEditor() | L166-202 | 생성자 | 상태 처리 | 업무 |
| public insertChcek() | L205-281 | E4 | 서비스 sys.Sys25_Password.checkPassword, sys.Sys25_Password.checkPasswordRule, sys.Sys25_Password.checkPasswordRule(companyCode, loginId, password, password, password) | 업무 |
| public insert() | L283-303 | insertChcek | 서비스 sys.Sys25_Password.insert(companyCode, loginId, password) | 업무 |
| public extension() | L305-322 | E5,E6 | 서비스 sys.Sys25_Password.extension(companyCode, loginId) | 업무 |
| private checkCapsLock() | L324-336 | E1,E2,E3 | 상태 처리 | 업무 |
| private checkUpperCase() | L338-340 | checkCapsLock | 상태 처리 | 업무 |
| private checkLowerCase() | L342-344 | checkCapsLock | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L346-348 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L350-352 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={insertChcek}>확인</Button>
2. <Button type="unknown" onClick={extension}>3개월 후 변경</Button>

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

