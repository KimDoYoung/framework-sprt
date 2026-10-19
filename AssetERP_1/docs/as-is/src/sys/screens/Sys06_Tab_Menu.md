# Sys06_Tab_Menu

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 메뉴 관리 (#1077)
- 파일: `client/vi/sys/Sys06_Tab_Menu.java`
- 함께 쓰는 클래스 4개:
  - `Sys06_Select_Menu` `client/vi/sys/Sys06_Select_Menu.java`
  - `Sys06_Lookup_CopyMulti` `client/vi/sys/Sys06_Lookup_CopyMulti.java`
  - `Sys06_Edit_Menu` `client/vi/sys/Sys06_Edit_Menu.java`
  - `Sys01_Grid_CompanyMenu` `client/vi/sys/Sys01_Grid_CompanyMenu.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectByCode` | Sys01_Grid_CompanyMenu:123 | [`Sys01_Company.java:81`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByCode`](../../sys/sql/sys01_company.md) |
| `sys.Sys01_Company.selectByCopyList` | Sys06_Lookup_CopyMulti:264 | [`Sys01_Company.java:92`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByCopyList`](../../sys/sql/sys01_company.md) |
| `sys.Sys01_Company.updateByMenuYn` | Sys01_Grid_CompanyMenu:135 | [`Sys01_Company.java:135`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys03_company_menu)` 동적 INSERT/UPDATE → [`sys03_company_menu.selectById`](../../sys/sql/sys03_company_menu.md), `UpdateDataModel(sys03_company_menu)` 동적 DELETE |
| `sys.Sys06_Menu.delete` | Sys06_Edit_Menu:128 | [`Sys06_Menu.java:700`](../../sys/services/Sys06_Menu.md) | `UpdateDataModel(sys06_menu)` 동적 DELETE |
| `sys.Sys06_Menu.getAllMenuList` | Sys06_Lookup_CopyMulti:246 | [`Sys06_Menu.java:493`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.getAllMenuList`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.insertByMenuYn` | Sys06_Lookup_CopyMulti:295 | [`Sys06_Menu.java:650`](../../sys/services/Sys06_Menu.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.getInfoByMenuId`](../../sys/sql/sys01_company.md), [`sys03_company_menu.deleteByCompanyId`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.insert`](../../sys/sql/sys03_company_menu.md), [`sys06_menu.selectById`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByAll` | Sys06_Select_Menu:95, Sys06_Tab_Menu:254 | [`Sys06_Menu.java:24`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByParentId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.update` | Sys06_Edit_Menu:94, Sys06_Select_Menu:128 | [`Sys06_Menu.java:695`](../../sys/services/Sys06_Menu.md) | `UpdateDataModel(sys06_menu)` 동적 INSERT/UPDATE → [`sys06_menu.selectById`](../../sys/sql/sys06_menu.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_menu_nm_allpath`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys06_Tab_Menu (`client/vi/sys/Sys06_Tab_Menu.java`, 372줄)

- 레이아웃: center=cp, east=companyMenu
- 툴바 `buttonBar`: 매뉴구성: {searchText} {retrieveButton} {createRoot} {addSubMenu} {collapseAll} {copyButton}
- 입력·하위 화면: `searchText` TextField, `lookup` Sys06_Lookup_CopyMulti, `editMenu` Sys06_Edit_Menu
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - menuName 400 "매뉴명" Text
  - actionCell 45 "수정" Cell 편집:editCell
  - actionCell 45 "이동" Cell 편집:moveCell
  - useYn 45 "사용" BooleanYn2
  - addTitleUseYn 45 "겸직<br>사용" BooleanYn2
  - mobiUseYn 50 "모바일" BooleanYn2
  - sensitiveInfoYn 45 "민감<br>정보" BooleanYn2
  - personalInfoYn 45 "개인<br>정보" BooleanYn2
  - menuNo 60 "화면번호" TextCenter
  - seq 50 "순서" TextCenter
  - className 200 "클래스명" Text 편집:TextField
  - note 300 "화면안내" Text
  - note2 300 "비고" Text
  - menualUrl 600 "매뉴얼 URL" Text

#### 이벤트
[E0] 화면 열림 (생성자 L58-96) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L100) → search()
[E2] retrieveButton[새로고침].Select (L108) → retrieve()
[E3] createRoot[루트매뉴 등록].Select (L114) → insertMenu()
[E4] addSubMenu[하위매뉴 등록].Select (L121) → insertChildMenu()
[E5] collapseAll[감추기].Select (L127) → 인라인 L127-132 (new SelectHandler(){ @Override public…)
[E6] copyButton[일괄복사].Select (L133) → retrieve()
[E7] treeGrid.SelectionChanged [data != null] (L146) → 인라인 L146-154 (new SelectionChangedHandler<Sys06_Men…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private search() | L157-196 | E1 | 상태 처리 | 업무 |
| public buildTreeGrid() | L198-232 | 필드 초기화 | 상태 처리 | 업무 |
| private moveMenu() | L234-237 | buildTreeGrid | 상태 처리 | 업무 |
| private editMenu() | L239-248 | buildTreeGrid | 팝업 Sys06_Edit_Menu 열기 | 업무 |
| public retrieve() | L250-257 | 생성자,E2,E6,editMenu,insertMenu | 서비스 sys.Sys06_Menu.selectByAll | 업무 |
| private setChildMenuItem() | L259-268 | getServiceResult | 상태 처리 | 업무 |
| private insertMenu() | L270-290 | E3,insertChildMenu | 팝업 Sys06_Edit_Menu 열기 | 업무 |
| private insertChildMenu() | L292-308 | E4 | 미선택 시 alert "선택된 상위 매뉴가 없습니다" | 업무 |
| public getServiceResult() | L311-349 | 공개 메서드 | 상태 처리 | 업무 |
| private saveExpandedState() | L351-358 | retrieve | 상태 처리 | 업무 |
| private restoreExpandedState() | L360-366 | getServiceResult | 상태 처리 | 업무 |
| private settings() | L98-155 | 생성자 | 조회창 Sys06_Lookup_CopyMulti 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L368-370 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('menuNm', 400, '매뉴명'),  // L215
  // ⚠ 대응 없음 (GridBuilder L216) addCell
  // ⚠ 대응 없음 (GridBuilder L217) addCell
  gb.booleanYn2('useYn', 45, '사용'),  // L218
  gb.booleanYn2('addTitleUseYn', 45, '겸직<br>사용'),  // L219
  gb.booleanYn2('mobiUseYn', 50, '모바일'),  // L220
  gb.booleanYn2('sensitiveInfoYn', 45, '민감<br>정보'),  // L221
  gb.booleanYn2('personalInfoYn', 45, '개인<br>정보'),  // L222
  gb.textCenter('menuNo', 60, '화면번호'),  // L223
  gb.textCenter('seq', 50, '순서'),  // L224
  gb.text('classNm', 200, '클래스명', { editor: 'text' }),  // L225
  gb.text('note', 300, '화면안내'),  // L226
  gb.text('note2', 300, '비고'),  // L227
  gb.text('menualUrl', 600, '매뉴얼 URL'),  // L228
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="register" onClick={insertMenu}>루트매뉴 등록</Button>
3. <Button type="register" onClick={insertChildMenu}>하위매뉴 등록</Button>
4. <Button type="collapse" onClick={() => /* 인라인 L127-132 (new SelectHandler(){ @Override public…) */}>감추기</Button>
5. <Button type="change" onClick={retrieve}>일괄복사</Button>

### Sys06_Select_Menu (`client/vi/sys/Sys06_Select_Menu.java`, 182줄)


#### 이벤트
[E1] okButton[확인].Select (L99) → moveTree()
[E2] closeButton[닫기].Select (L107) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getKey() | L40-42 | 공개 메서드 | 상태 처리 | 업무 |
| public getValue() | L48-50 | 공개 메서드 | 상태 처리 | 업무 |
| public setValue() | L53-54 | 공개 메서드 | 상태 처리 | 업무 |
| public getPath() | L57-59 | 공개 메서드 | 상태 처리 | 업무 |
| private getMenuTree() | L62-77 | open | 상태 처리 | 업무 |
| public open() | L79-117 | 공개 메서드 | 서비스 sys.Sys06_Menu.selectByAll | 업무 |
| private moveTree() | L120-149 | E1 | 서비스 sys.Sys06_Menu.update | 업무 |
| private addChild() | L151-160 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L163-176 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L178-180 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={moveTree}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys06_Lookup_CopyMulti (`client/vi/sys/Sys06_Lookup_CopyMulti.java`, 325줄)

- 툴바 `buttonBar01`: 검색: {searchText01} {retrieveButton01} {menuNameYn}
- 툴바 `buttonBar02`: 검색: {searchText02} {erpProductComboBox} {retrieveButton02}
- 입력·하위 화면: `searchText01` TextField, `searchText02` TextField, `menuNameYn` CheckBox, `erpProductComboBox` ComboBoxField("ErpProductCode", "%", "전체")
- 그리드 `grid01` (buildGrid01(), 체크박스(다중)):
  - parentPathName 300 "경로" Text
  - menuNoPlusName 210 "매뉴명" Text
- 그리드 `grid02` (buildGrid02(), 체크박스(다중)):
  - companyName 290 "고객명" Text
  - erpProductCode 50 "상품" TextCenter
  - assetYn 50 "운용" BooleanYn2
  - advisYn 50 "자문" BooleanYn2
  - icamCompanyCode 80 "ICAM코드" TextCenter

#### 이벤트
[E1] searchText01.KeyPress [Enter] (L123) → retrieve01()
[E2] searchText02.KeyPress [Enter] (L132) → retrieve02()
[E3] erpProductComboBox[ErpProductCode].Collapse (L145) → retrieve02()
[E4] retrieveButton01[조회].Select (L151) → retrieve01()
[E5] retrieveButton02[조회].Select (L157) → retrieve02()
[E6] grantButton[권한부여].Select [YES] (L163) → confirm()
[E7] msgBox.DialogHide [YES] (L168) → confirm()
[E8] revokeButton[권한삭제].Select [YES] (L186) → confirm()
[E9] msgBox.DialogHide [YES] (L191) → confirm()
[E10] closeButton[닫기].Select (L209) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-117 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid01() | L218-225 | 필드 초기화 | 상태 처리 | 업무 |
| private buildGrid02() | L227-238 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve01() | L240-252 | E1,E4,open | 서비스 sys.Sys06_Menu.getAllMenuList(searchText, menuNameYn) | 업무 |
| private retrieve02() | L254-270 | E2,E3,E5,open | 서비스 sys.Sys01_Company.selectByCopyList(searchText, erpProductCode, erpProductCode) | 업무 |
| private confirm() | L272-312 | E6,E7,E8,E9 | 서비스 sys.Sys06_Menu.insertByMenuYn(menuIdList, companyIdList, useYn) | 업무 |
| private settings() | L119-216 | open | 확인창 표시, 이벤트 연결, 초기값: menuNameYn=false("매뉴명만 검색") | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L314-316 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L318-320 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L322-324 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('parentPathNm', 300, '경로'),  // L222 SQL 계산 컬럼(getAllMenuList: TRIM(TRAILING sys06_menu_nm FROM f_menu…)
  gb.text('menuNoPlusNm', 210, '매뉴명'),  // L223 SQL 계산 컬럼(getAllMenuList: ( CASE WHEN sys06_menu_no IS NULL THEN …)
];

const buildGrid02 = () => [
  gb.text('companyNm', 290, '고객명'),  // L231
  gb.textCenter('erpProductCd', 50, '상품'),  // L232
  gb.booleanYn2('assetYn', 50, '운용'),  // L233
  gb.booleanYn2('advisYn', 50, '자문'),  // L234
  gb.textCenter('icamCompanyCd', 80, 'ICAM코드'),  // L236
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve01}>조회</Button>
2. <Button type="search" onClick={retrieve02}>조회</Button>
3. <Button type="unknown" onClick={confirm}>권한부여</Button>
4. <Button type="unknown" onClick={confirm}>권한삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys06_Edit_Menu (`client/vi/sys/Sys06_Edit_Menu.java`, 218줄)

- 입력·하위 화면: `menuName` TextField, `className` TextField, `menuNo` TextField, `seq` TextField, `mobiClassName` TextField, `addTitleUseYn` CheckBox, `mobiUseYn` CheckBox, `sensitiveInfoYn` CheckBox, `personalInfoYn` CheckBox, `note` TextArea, `note2` TextArea, `menualUrl` TextArea, `useYnComboBox` StringComboBox

#### 이벤트
[E2] useYnComboBox[사용여부].Collapse (L142) → 인라인 L142-152 (new CollapseHandler() { @Override pub…)
[E3] deleteButton[삭제].Select (L153) → deleteChk()
       └ [E1] msgBox.DialogHide [YES] (L106) → delete()
[E4] updateButton[저장].Select (L159) → update()
[E5] closeButton[닫기].Select (L165) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editMenu() | L69-89 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L91-101 | E4 | 서비스 sys.Sys06_Menu.update | 업무 |
| private deleteChk() | L103-121 | E3 | ConfirmBox → E1 | 업무 |
| private delete() | L123-135 | E1 | 서비스 sys.Sys06_Menu.delete | 업무 |
| public setForm() | L137-209 | editMenu | 상태 처리 | 업무 |
| private setHtmlStyle() | L211-213 | setForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L215-217 | editMenu | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteChk}>삭제</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys01_Grid_CompanyMenu (`client/vi/sys/Sys01_Grid_CompanyMenu.java`, 141줄)

- 툴바 `buttonBar`: 적용상품: {erpProductComboBox} {selectAllButton} {deSelectAllButton} {updateButton}
- 입력·하위 화면: `erpProductComboBox` ComboBoxField("ErpProductCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - companyName 200 "고객명" Text
  - menuYn 60 "등록" Boolean
  - erpProductCode 50 "상품" TextCenter
  - assetYn 50 "운용" BooleanYn2
  - advisYn 50 "자문" BooleanYn2
  - icamCompanyCode 80 "ICAM코드" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L41-60) → settings()
[E1] erpProductComboBox[ErpProductCode].Collapse (L66) → retrieve()
[E2] selectAllButton[전체선택].Select (L72) → 인라인 L72-79 (new SelectHandler(){ @Override public…)
[E3] deSelectAllButton[전체취소].Select (L80) → 인라인 L80-87 (new SelectHandler(){ @Override public…)
[E4] updateButton[저장].Select (L88) → update()
[E5] grid.CellMouseDown [event.getCellIndex() >= 4] (L94) → 인라인 L94-101 (new CellMouseDownHandler() { @Overrid…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L117-130 | E1 | 서비스 sys.Sys01_Company.selectByCode(menuId, erpProductCode) | 업무 |
| private update() | L132-136 | E4 | 서비스 sys.Sys01_Company.updateByMenuYn(menuId) | 업무 |
| private settings() | L62-102 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L104-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L138-140 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '고객명'),  // L106
  gb.boolean('menuYn', 60, '등록'),  // L107 SQL 계산 컬럼(selectByCode: ( CASE WHEN sys03_company_menu_id IS NU…)
  gb.textCenter('erpProductCd', 50, '상품'),  // L108
  gb.booleanYn2('assetYn', 50, '운용'),  // L110
  gb.booleanYn2('advisYn', 50, '자문'),  // L111
  gb.textCenter('icamCompanyCd', 80, 'ICAM코드'),  // L113
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={() => /* 인라인 L72-79 (new SelectHandler(){ @Override public…) */}>전체선택</Button>
2. <Button type="cancel" onClick={() => /* 인라인 L80-87 (new SelectHandler(){ @Override public…) */}>전체취소</Button>
3. <Button type="save" onClick={update}>저장</Button>

