# RDViewer

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/RDViewer.java`
- 함께 쓰는 클래스 3개:
  - `LoginUser` `client/vi/LoginUser.java`
  - `Emp31_Lookup_Rd_Director` `client/vi/emp/Emp31_Lookup_Rd_Director.java`
  - `TempData` `client/vi/TempData.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr30_Link.selectByLinkCode` | Emp31_Lookup_Rd_Director:174 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys99_Print.insertRdCarJournal` | RDViewer:302 | [`Sys99_Print.java:945`](../../sys/services/Sys99_Print.md) | [`car04_journal.selectByRdJournal`](../../car/sql/car04_journal.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdContCorp` | RDViewer:269 | [`Sys99_Print.java:995`](../../sys/services/Sys99_Print.md) | [`biz10_cont_corp.selectByText`](../../biz/sql/biz10_cont_corp.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdDirector01` | RDViewer:335 | [`Sys99_Print.java:2944`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp31_director.selectByTextReport`](../../emp/sql/emp31_director.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdDirector02` | RDViewer:342 | [`Sys99_Print.java:3019`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp31_director.selectByText`](../../emp/sql/emp31_director.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md), [`car01_info`](../../../db/tables/car.md), [`car02_user`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`car04_journal`](../../../db/tables/car.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp07_career`](../../../db/tables/emp.md), [`emp31_director`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`, `f_today`, `gettdm30roleallc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### RDViewer (`client/vi/RDViewer.java`, 419줄)

- 툴바 `buttonBar`: 기준년월: {beforeDate} {yyyyMM} {nextDate} {interestYn} {retrieveButton} {radio1} {radio2} 년도: {stdYear} 월: {monthComboBox} {retrieveButton} 구분: {divisionComboBox} {retrieveButton} {directorNotice}
- 입력·하위 화면: `stdYear` TextField, `yyyyMM` TextField 빈칸="YYYY.MM", `interestYn` CheckBox, `radio1` Radio, `radio2` Radio, `monthComboBox` ComboBoxField("MonthsCode", "%", "전체"), `divisionComboBox` StringComboBox, `lookupRd` Emp31_Lookup_Rd_Director

#### 이벤트
[E0] 화면 열림 (생성자 L89-105) → 초기화
[E1] closeButton[닫기].Select (L97) → hide()
[E2] yyyyMM[yyyy.MM].KeyPress [Enter] (L115) → setRd()
[E3] beforeDate.MouseDown (L130) → getStdDate(), setRd()
[E4] nextDate.MouseDown (L145) → getStdDate(), setRd()
[E5] retrieveButton[조회].Select (L158) → setRd()
[E6] toggle.ValueChange (L180) → retrieveBiz10()
[E7] retrieveButton[조회].Select (L200) → retrieveCar10()
[E8] closeButton[닫기].Select (L260) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public viewer() | L107-109 | 공개 메서드 | 상태 처리 | 업무 |
| public openSch10() | L111-168 | 공개 메서드 | 상태 처리 | 업무 |
| public openBiz10() | L170-192 | 공개 메서드 | 상태 처리 | 업무 |
| public openCar04() | L194-209 | 공개 메서드 | 상태 처리 | 업무 |
| public openEmp31() | L211-221 | 공개 메서드 | 상태 처리 | 업무 |
| private buttonSetting() | L223-266 | setRd | 상태 처리 | 업무 |
| private retrieveBiz10() | L268-292 | E6,openBiz10 | 서비스 sys.Sys99_Print.insertRdContCorp(companyId, personId, windowClassName, searchText, check, stdYear, statusCode, statusCheck, endMonth, sortType) | 업무 |
| private retrieveCar10() | L294-326 | E7,openCar04 | 서비스 sys.Sys99_Print.insertRdCarJournal(companyId, personId, windowClassName, infoId, stdMonth, stdMonth, year, month) | 업무 |
| private retrieveEmp31() | L328-374 | openEmp31 | 조회창 Emp31_Lookup_Rd_Director 열기, 서비스 sys.Sys99_Print.insertRdDirector01, sys.Sys99_Print.insertRdDirector02(companyId, personId, windowClassName, companyId, personId, windowClassName, endCheck) | 업무 |
| private setRd() | L376-389 | E2,E3,E4,E5,viewer,openSch10,retrieveBiz10,retrieveCar10 | 상태 처리 | 업무 |
| private getStdDate() | L391-395 | E3,E4 | 서비스 yyyy.MM.dd | 업무 |
| private applyResponsiveSize() | L397-401 | setRd | 상태 처리 | 업무 |
| public setIconStyle() | L415-417 | 필드 초기화 | 상태 처리 | 업무 |
| private setHtmlStyle() | L403-405 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L406-408 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L409-411 | buttonSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L412-414 | openSch10,openBiz10 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="unknown" onClick={undefined}>상신하기</Button>
3. <Button type="search" onClick={retrieveCar10}>조회</Button>

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

### Emp31_Lookup_Rd_Director (`client/vi/emp/Emp31_Lookup_Rd_Director.java`, 246줄)

- 툴바 `buttonBar`: 구분: {divisionComboBox} {retrieveButton}
- 입력·하위 화면: `divisionComboBox` StringComboBox, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L66-124) → defaultName(), show()
[E1] retrieveButton[조회].Select (L89) → setRd()
[E2] apprButton[상신하기].Select (L95) → insertApproval()
[E3] closeButton[닫기].Select (L101) → hide()
[E4] divisionComboBox[선임].Collapse (L107) → setRd()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L126-132 | 공개 메서드 | 상태 처리 | 업무 |
| private setRd() | L134-171 | E1,E4,open | 상태 처리 | 업무 |
| private defaultName() | L173-194 | 생성자,setRd | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertApproval() | L196-208 | E2 | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| private insertLinkApproval() | L210-236 | insertApproval | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private setHtmlHeaderStyle() | L238-240 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L242-244 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={setRd}>조회</Button>
2. <Button type="unknown" onClick={insertApproval}>상신하기</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

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

