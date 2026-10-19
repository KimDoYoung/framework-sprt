# MySetting

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/MySetting.java`
- 함께 쓰는 클래스 7개:
  - `Sys00_Lookup_Mapping` `client/vi/sys/Sys00_Lookup_Mapping.java`
  - `LoginUser` `client/vi/LoginUser.java`
  - `Emp93_Lookup_SmsNoticeTargetList` `client/vi/emp/Emp93_Lookup_SmsNoticeTargetList.java`
  - `Emp93_Tabpage_SmsNoticeTargetList` `client/vi/emp/Emp93_Tabpage_SmsNoticeTargetList.java`
  - `Emp92_Lookup_SmsNotice` `client/vi/emp/Emp92_Lookup_SmsNotice.java`
  - `Emp91_Lookup_List` `client/vi/emp/Emp91_Lookup_List.java`
  - `Emp03_Lookup_Grade` `client/vi/emp/Emp03_Lookup_Grade.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`MyThemePopup`](../../_frame/screens/MyThemePopup.md), [`Pay06_TabPage_ActMapping`](../../pay/components/Pay06_TabPage_ActMapping.md), [`Pay06_TabPage_RetireMapping`](../../pay/components/Pay06_TabPage_RetireMapping.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp03_Trans.selectByGrade` | Emp03_Lookup_Grade:161 | [`Emp03_Trans.java:68`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.selectByGrade`](../../emp/sql/emp03_trans.md) |
| `emp.Emp03_Trans.update` | Emp03_Lookup_Grade:228 | [`Emp03_Trans.java:195`](../../emp/services/Emp03_Trans.md) | `UpdateDataModel(emp03_trans)` 동적 INSERT/UPDATE → [`emp03_trans.selectById`](../../emp/sql/emp03_trans.md) |
| `emp.Emp25_MypageNotice.updateList` | Emp03_Lookup_Grade:231 | [`Emp25_MypageNotice.java:26`](../../emp/services/Emp25_MypageNotice.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp25_mypage_notice.selectByPersonId`](../../emp/sql/emp25_mypage_notice.md), `UpdateDataModel(emp25_mypage_notice)` 동적 INSERT/UPDATE → [`emp25_mypage_notice.selectById`](../../emp/sql/emp25_mypage_notice.md) |
| `emp.Emp91_MenuInfoNotice.delete` | Emp91_Lookup_List:201 | [`Emp91_MenuInfoNotice.java:98`](../../emp/services/Emp91_MenuInfoNotice.md) | `UpdateDataModel(emp91_menu_info_notice)` 동적 DELETE |
| `emp.Emp91_MenuInfoNotice.deletePersonId` | Emp91_Lookup_List:119 | [`Emp91_MenuInfoNotice.java:84`](../../emp/services/Emp91_MenuInfoNotice.md) | [`emp91_menu_info_notice.deletePersonId`](../../emp/sql/emp91_menu_info_notice.md) |
| `emp.Emp91_MenuInfoNotice.selectByText` | Emp91_Lookup_List:190 | [`Emp91_MenuInfoNotice.java:34`](../../emp/services/Emp91_MenuInfoNotice.md) | [`emp91_menu_info_notice.selectByText`](../../emp/sql/emp91_menu_info_notice.md) |
| `emp.Emp91_MenuInfoNotice.updatePersonId` | Emp91_Lookup_List:103 | [`Emp91_MenuInfoNotice.java:52`](../../emp/services/Emp91_MenuInfoNotice.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp91_menu_info_notice.insert`](../../emp/sql/emp91_menu_info_notice.md), [`emp91_menu_info_notice.selectByMenuId`](../../emp/sql/emp91_menu_info_notice.md), `UpdateDataModel(emp91_menu_info_notice)` 동적 INSERT/UPDATE → [`emp91_menu_info_notice.selectById`](../../emp/sql/emp91_menu_info_notice.md) |
| `emp.Emp92_SmsNotice.selectByPersonId` | Emp92_Lookup_SmsNotice:116 | [`Emp92_SmsNotice.java:26`](../../emp/services/Emp92_SmsNotice.md) | [`emp92_sms_notice.selectByPersonId`](../../emp/sql/emp92_sms_notice.md) |
| `emp.Emp92_SmsNotice.updateList` | Emp92_Lookup_SmsNotice:136 | [`Emp92_SmsNotice.java:34`](../../emp/services/Emp92_SmsNotice.md) | [`emp92_sms_notice.check`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.insert`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.updateNoticeYn`](../../emp/sql/emp92_sms_notice.md) |
| `emp.Emp93_SmsNoticeTarget.delete` | Emp93_Tabpage_SmsNoticeTargetList:178 | [`Emp93_SmsNoticeTarget.java:43`](../../emp/services/Emp93_SmsNoticeTarget.md) | `UpdateDataModel(emp93_sms_notice_target)` 동적 DELETE |
| `emp.Emp93_SmsNoticeTarget.getSmsNoticeList` | Emp93_Lookup_SmsNoticeTargetList:110 | [`Emp93_SmsNoticeTarget.java:33`](../../emp/services/Emp93_SmsNoticeTarget.md) | [`emp93_sms_notice_target.getSmsNoticeList`](../../emp/sql/emp93_sms_notice_target.md) |
| `emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode` | Emp93_Tabpage_SmsNoticeTargetList:108 | [`Emp93_SmsNoticeTarget.java:24`](../../emp/services/Emp93_SmsNoticeTarget.md) | [`emp93_sms_notice_target.selectBySmsNoticeCode`](../../emp/sql/emp93_sms_notice_target.md) |
| `emp.Emp93_SmsNoticeTarget.update` | Emp93_Tabpage_SmsNoticeTargetList:119 | [`Emp93_SmsNoticeTarget.java:38`](../../emp/services/Emp93_SmsNoticeTarget.md) | `UpdateDataModel(emp93_sms_notice_target)` 동적 INSERT/UPDATE → [`emp93_sms_notice_target.selectById`](../../emp/sql/emp93_sms_notice_target.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp25_mypage_notice`](../../../db/tables/emp.md), [`emp91_menu_info_notice`](../../../db/tables/emp.md), [`emp92_sms_notice`](../../../db/tables/emp.md), [`emp93_sms_notice_target`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### MySetting (`client/vi/MySetting.java`, 160줄)

- 입력·하위 화면: `lookup` Emp91_Lookup_List, `lookupManager` Sys00_Lookup_Mapping, `lookupGradeCode` Emp03_Lookup_Grade, `lookupSmsNotice` Emp92_Lookup_SmsNotice

#### 이벤트
[E0] 화면 열림 (생성자 L51-81) → settings()
[E1] anchor01.MouseDown (L84) → 인라인 L84-90 (메시지: "https://dusty-casquette-8e6.n)
[E2] anchor02.MouseDown (L91) → 인라인 L91-97 (new MouseDownHandler() { @Override pu…)
[E3] anchor03.MouseDown (L98) → 인라인 L98-103 (new MouseDownHandler() { @Override pu…)
[E4] anchor04.MouseDown (L104) → 인라인 L104-115 (new MouseDownHandler() { @Override pu…)
[E5] anchor05.MouseDown (L116) → 인라인 L116-122 (new MouseDownHandler() { @Override pu…)
[E6] anchor06.MouseDown (L123) → 인라인 L123-134 (new MouseDownHandler() { @Override pu…)
[E7] anchor07.MouseDown (L135) → 인라인 L135-141 (new MouseDownHandler() { @Override pu…)
[E8] anchor08.MouseDown (L142) → 인라인 L142-148 (new MouseDownHandler() { @Override pu…)
[E9] closeButton[닫기].Select (L149) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private makeHtmlStyle() | L33-35 | 미사용 후보 | 상태 처리 | 업무 |
| public open() | L47-49 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L83-155 | 생성자 | 조회창 Emp91_Lookup_List 열기, 팝업 MyThemePopup 열기, 조회창 Dcr30_Lookup_Link 열기, 조회창 Sys00_Lookup_Mapping 열기, 조회창 Emp03_Lookup_Grade 열기, 조회창 Emp93_Lookup_SmsNoticeTargetList 열기, 조회창 Emp92_Lookup_SmsNotice 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L157-159 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys00_Lookup_Mapping (`client/vi/sys/Sys00_Lookup_Mapping.java`, 79줄)

- 입력·하위 화면: `tab01` Pay06_TabPage_ActMapping, `tab02` Pay06_TabPage_RetireMapping

#### 이벤트
[E0] 화면 열림 (생성자 L31-49) → settings(), show()
[E1] updateButton[저장].Select (L52) → update()
[E2] closeButton[닫기].Select (L58) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L25-29 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L66-74 | E1 | 상태 처리 | 업무 |
| private settings() | L51-64 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L76-78 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Emp93_Lookup_SmsNoticeTargetList (`client/vi/emp/Emp93_Lookup_SmsNoticeTargetList.java`, 122줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - smsNoticeName 240 "구분" Text

#### 이벤트
[E0] 화면 열림 (생성자 L44-72) → settings(), show()
[E1] retrieveButton[조회].Select (L75) → retrieve()
[E2] cancelButton[닫기].Select (L81) → hide()
[E3] grid.RowClick (L87) → 인라인 L87-96 (new RowClickHandler(){ @Override publ…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-42 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L106-117 | E1,open | 서비스 emp.Emp93_SmsNoticeTarget.getSmsNoticeList | 업무 |
| private settings() | L74-97 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L99-104 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L119-121 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('smsNoticeNm', 240, '구분'),  // L102 SQL 계산 컬럼(getSmsNoticeList: sys09_name)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp93_Tabpage_SmsNoticeTargetList (`client/vi/emp/Emp93_Tabpage_SmsNoticeTargetList.java`, 180줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personInfo 250 "사원" Text
  - note 250 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L48-64) → settings()
[E1] retrieveButton[조회].Select (L67) → retrieve()
[E2] insertButton[등록].Select (L73) → insertRow()
[E3] updateButton[저장].Select (L79) → update()
[E4] deleteButton[삭제].Select (L85) → deleteChk()
       └ [E5] msgBox.DialogHide [YES] (L158) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L101-114 | E1 | 서비스 emp.Emp93_SmsNoticeTarget.selectBySmsNoticeCode(companyId, smsNoticeCode) | 업무 |
| public update() | L116-120 | E3 | 서비스 emp.Emp93_SmsNoticeTarget.update(personId) | 업무 |
| public insertRow() | L122-153 | E2 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private deleteChk() | L155-173 | E4 | ConfirmBox → E5 | 업무 |
| public deleteRow() | L175-179 | E5 | GridDeleteData emp.Emp93_SmsNoticeTarget.delete(체크된 행 목록) | 업무 |
| private settings() | L66-91 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L93-99 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personInfo', 250, '사원'),  // L96 SQL 계산 컬럼(selectBySmsNoticeCode: ( f_emp_kor_nm(emp93_person_id)||' ('||…)
  gb.text('note', 250, '비고', { editor: 'text' }),  // L97
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Emp92_Lookup_SmsNotice (`client/vi/emp/Emp92_Lookup_SmsNotice.java`, 156줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid()):
  - smsNoticeName 300 "항목" Text
  - talkNoticeYn 60 "앱" Boolean
  - smsNoticeYn 60 "문자" Boolean
  - mailNoticeYn 60 "메일" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L65-93) → show(), retrieve()
[E1] retrieveButton[새로고침].Select (L45) → retrieve()
[E2] updateButton[저장].Select (L51) → update()
[E3] closeButton[닫기].Select (L57) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-63 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L111-123 | 생성자,E1,update | 서비스 emp.Emp92_SmsNotice.selectByPersonId(personId) | 업무 |
| private update() | L125-151 | E2 | 서비스 emp.Emp92_SmsNotice.updateList | 업무 |
| private buildGrid() | L95-109 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L153-155 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('smsNoticeNm', 300, '항목'),  // L98 SQL 계산 컬럼(selectByPersonId: sys09_name)
  gb.boolean('talkNoticeYn', 60, '앱'),  // L102
  gb.boolean('smsNoticeYn', 60, '문자'),  // L105
  gb.boolean('mailNoticeYn', 60, '메일'),  // L106
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp91_Lookup_List (`client/vi/emp/Emp91_Lookup_List.java`, 220줄)

- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton} {checkBox}
- 입력·하위 화면: `searchTextField` TextField 빈칸="매뉴명", `checkBox` CheckBox
- 그리드 `grid` (buildGrid()):
  - menuName 240 "매뉴명" Text
  - date 100 "차단일자" Date
  - actionCell 60 "해제" Cell 편집:deleteCell
  - actionCell 60 "보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L57-84) → settings(), show()
[E1] checkBox[화면안내 전체 비활성화].ValueChange [event.getValue()] (L99) → 서비스 emp.Emp91_MenuInfoNotice.updatePersonId, emp.Emp91_MenuInfoNotice.deletePersonId(personId, date, menuId, personId, date, menuId)
[E2] searchTextField.KeyPress [Enter] (L139) → retrieve()
[E3] retrieveButton[조회].Select (L147) → retrieve()
[E4] cancelButton[닫기].Select (L153) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-55 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L185-196 | E2,E3,open | 서비스 emp.Emp91_MenuInfoNotice.selectByText(personId, searchText) | 업무 |
| private deleteRow() | L198-202 | buildGrid | GridDeleteData emp.Emp91_MenuInfoNotice.delete(체크된 행 목록) | 업무 |
| private settings() | L86-159 | 생성자 | 서비스 emp.Emp91_MenuInfoNotice.updatePersonId, emp.Emp91_MenuInfoNotice.deletePersonId(personId, date, menuId, personId, date, menuId), 이벤트 연결, 초기값: checkBox=false("화면안내 전체 비활성화"), checkBox=true("화면안내 전체 비활성화") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L161-183 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L204-206 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L208-211 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L213-215 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L217-219 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('menuNm', 240, '매뉴명'),  // L177 SQL 계산 컬럼(selectByText: sys06_menu_nm)
  gb.date('date', 100, '차단일자'),  // L178
  // ⚠ 대응 없음 (GridBuilder L179) addCell
  // ⚠ 대응 없음 (GridBuilder L180) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp03_Lookup_Grade (`client/vi/emp/Emp03_Lookup_Grade.java`, 255줄)

- 툴바 `searchBar`: 기준일: {baseDate} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `personName` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `gradeName` ComboBoxField("EmpGradeCode", "(선택안함)")
- 그리드 `grid` (buildGrid()):
  - orgFullName 200 "부서명" Text
  - titleName 110 "직책" TextCenter
  - empNo 70 "사원번호" TextCenter
  - empKorName 100 "사원명" TextCenter
  - gradeName 150 "특정직위" TextCenter 편집:gradeName
  - icsYn 100 "법규 알림" Boolean
  - apprYn 100 "상신문서 알림" Boolean

#### 이벤트
[E1] personName.TriggerClick (L91) → 인라인 L91-106 (new TriggerClickHandler(){ @Override …)
[E2] gradeName[EmpGradeCode].Collapse (L109) → 인라인 L109-116 (new CollapseHandler() { @Override pub…)
[E3] retrieveButton[조회].Select (L135) → retrieve()
[E4] updateButton[저장].Select (L141) → update()
[E5] closeButton[닫기].Select (L147) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-85 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L155-167 | E3,open,update | 서비스 emp.Emp03_Trans.selectByGrade(companyId, baseDate) | 업무 |
| public update() | L169-245 | E4 | 서비스 emp.Emp03_Trans.update, emp.Emp25_MypageNotice.updateList | 업무 |
| public settings() | L130-153 | open | 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L87-128 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L247-249 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L251-253 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgFullNm', 200, '부서명'),  // L119 SQL 계산 컬럼(selectByGrade: f_org_parent_full_nm(emp03_org_code_id,…)
  gb.textCenter('titleNm', 110, '직책'),  // L120 SQL 계산 컬럼(selectByGrade: f_get_empTrans(emp03_person_id, emp03_t…)
  gb.textCenter('empNo', 70, '사원번호'),  // L121
  gb.textCenter('korNm', 100, '사원명'),  // L122
  gb.textCenter('gradeNm', 150, '특정직위'),  // L123 SQL 계산 컬럼(selectByGrade: f_cdnm('EmpGradeCode', emp03_grade_cd, …)
  gb.boolean('icsYn', 100, '법규 알림'),  // L124
  gb.boolean('apprYn', 100, '상신문서 알림'),  // L125
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

