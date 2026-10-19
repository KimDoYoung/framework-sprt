# MenuGrid

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/MenuGrid.java`
- 함께 쓰는 클래스 1개:
  - `LoginUser` `client/vi/LoginUser.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`MenuOpener`](../../_frame/screens/MenuOpener.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp01_Person.updateMenuFixYn` | MenuGrid:79 | [`Emp01_Person.java:248`](../../emp/services/Emp01_Person.md) | [`emp01_person.updateMenuFixYn`](../../emp/sql/emp01_person.md) |
| `sys.Sys06_Menu.selectByTailMenuCompanyId` | MenuGrid:162 | [`Sys06_Menu.java:427`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByTailMenuCompanyId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByTailMenuUserId` | MenuGrid:173 | [`Sys06_Menu.java:440`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByTailMenuUserId`](../../sys/sql/sys06_menu.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), `sys06_menu_down` ⚠DB없음, [`sys07_role_menu`](../../../db/tables/sys.md), [`sys40_bookmark`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys82_admin_user_menu`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### MenuGrid (`client/vi/MenuGrid.java`, 226줄)

- 레이아웃: center=menuGrid, south=hlc
- 툴바 `buttonBar`: {checkBox}
- 입력·하위 화면: `checkBox` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L56-137) → 초기화
[E1] menuGrid.CellClick [event.getCellIndex() == 1] (L62) → 인라인 L62-72 (new CellClickHandler(){ @Override pub…)
[E2] checkBox.ValueChange (L76) → 서비스 emp.Emp01_Person.updateMenuFixYn(personId, companyId, menuFixYn)
[E3] plus.MouseDown (L96) → 인라인 L96-102 (new MouseDownHandler() { @Override pu…)
[E4] minus.MouseDown (L105) → 인라인 L105-111 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getMenuId() | L48-50 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuId() | L52-54 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuGrid() | L139-141 | 공개 메서드 | 상태 처리 | 업무 |
| private buildMenuGrid() | L143-151 | 필드 초기화 | 상태 처리 | 업무 |
| public getMenu() | L153-180 | 공개 메서드 | 서비스 sys.Sys06_Menu.selectByTailMenuCompanyId, sys.Sys06_Menu.selectByTailMenuUserId(companyId, userId, adminYn, parentId, companyId, userId, parentId) | 업무 |
| public getSelectionModel() | L182-213 | 공개 메서드 | 서비스 sys.Sys06_Menu.selectByTailMenuCompanyId, sys.Sys06_Menu.selectByTailMenuUserId(companyId, parentId, userId, adminYn, companyId, userId, parentId) | 업무 |
| public setTabPanel() | L215-217 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuFixYn() | L223-225 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L219-221 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildMenuGrid = () => [
  gb.text('parentMenuNm', 50, 'parentName'),  // L146 SQL 계산 컬럼(selectByTailMenuCompanyId: ( SELECT '&#160;'||sys06_menu_nm FROM s…)
  // ⚠ 대응 없음 (GridBuilder L148) addMenuText
];
```

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

