# Ast05_Tab_TrCodeAdmin

- 종류: 화면
- 메뉴: 기초자료 > 40. 관리회계 > 거래유형 등록(관리자) (#1165)
- 파일: `client/vi/ast/Ast05_Tab_TrCodeAdmin.java`
- 함께 쓰는 클래스 2개:
  - `Ast15_Lookup_TrCodeWindow` `client/vi/ast/Ast15_Lookup_TrCodeWindow.java`
  - `Ast15_Page_TrCodeWindow` `client/vi/ast/Ast15_Page_TrCodeWindow.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys06_Lookup_SearchMenu`](../../sys/components/Sys06_Lookup_SearchMenu.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast05_TrCode.delete` | Ast05_Tab_TrCodeAdmin:368 | [`Ast05_TrCode.java:94`](../../ast/services/Ast05_TrCode.md) | `UpdateDataModel(ast05_tr_code)` 동적 DELETE |
| `ast.Ast05_TrCode.insertInitData` | Ast05_Tab_TrCodeAdmin:243 | [`Ast05_TrCode.java:49`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.deleteByTrCode`](../../ast/sql/ast05_tr_code.md), [`ast05_tr_code.insertInitData`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast05_TrCode.selectByCompanyId` | Ast05_Tab_TrCodeAdmin:284 | [`Ast05_TrCode.java:31`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectByCompanyId`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast05_TrCode.update` | Ast05_Tab_TrCodeAdmin:318 | [`Ast05_TrCode.java:66`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.checkTrCode`](../../ast/sql/ast05_tr_code.md), `UpdateDataModel(ast05_tr_code)` 동적 INSERT/UPDATE → [`ast05_tr_code.selectById`](../../ast/sql/ast05_tr_code.md) |
| `ast.Ast15_TrCodeWindow.delete` | Ast15_Lookup_TrCodeWindow:257 | [`Ast15_TrCodeWindow.java:105`](../../ast/services/Ast15_TrCodeWindow.md) | `UpdateDataModel(ast15_tr_code_window)` 동적 DELETE |
| `ast.Ast15_TrCodeWindow.getTrCode` | Ast15_Page_TrCodeWindow:177 | [`Ast15_TrCodeWindow.java:48`](../../ast/services/Ast15_TrCodeWindow.md) | [`ast15_tr_code_window.getTrCode`](../../ast/sql/ast15_tr_code_window.md) |
| `ast.Ast15_TrCodeWindow.insert` | Ast15_Page_TrCodeWindow:145 | [`Ast15_TrCodeWindow.java:66`](../../ast/services/Ast15_TrCodeWindow.md) | [`ast15_tr_code_window.deleteClassName`](../../ast/sql/ast15_tr_code_window.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast15_tr_code_window)` 동적 INSERT/UPDATE → [`ast15_tr_code_window.selectById`](../../ast/sql/ast15_tr_code_window.md) |
| `ast.Ast15_TrCodeWindow.modelUpdate` | Ast15_Lookup_TrCodeWindow:218 | [`Ast15_TrCodeWindow.java:87`](../../ast/services/Ast15_TrCodeWindow.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast15_tr_code_window)` 동적 INSERT/UPDATE → [`ast15_tr_code_window.selectById`](../../ast/sql/ast15_tr_code_window.md) |
| `ast.Ast15_TrCodeWindow.selectByAll` | Ast15_Lookup_TrCodeWindow:189 | [`Ast15_TrCodeWindow.java:24`](../../ast/services/Ast15_TrCodeWindow.md) | [`ast15_tr_code_window.selectByAll`](../../ast/sql/ast15_tr_code_window.md) |
| `ast.Ast15_TrCodeWindow.selectByClassName` | Ast15_Page_TrCodeWindow:171 | [`Ast15_TrCodeWindow.java:29`](../../ast/services/Ast15_TrCodeWindow.md) | [`ast15_tr_code_window.selectByClassName`](../../ast/sql/ast15_tr_code_window.md) |

## 테이블

[`act11_tr_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_menu_nm_allpath`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast05_Tab_TrCodeAdmin (`client/vi/ast/Ast05_Tab_TrCodeAdmin.java`, 378줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 거래코드/명: {searchText} {useYnBox} {retrieveButton} {updateButton} {addRowButton} {deleteRowButton} {windowUseButton} {companyField} {dataButton}
- 입력·하위 화면: `useYnBox` CheckBox, `searchText` TextField, `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `rcvPayComboBox` ComboBoxField("RcvPayCode"), `TrOccTypecomboBox` ComboBoxField("TrOccType"), `lookup` Ast15_Lookup_TrCodeWindow
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - trCode 100 "거래코드" TextCenter 편집:TextField
  - trName 300 "거래명" Text 편집:TextField
  - rcvPayName 100 "수령/지급" TextCenter 편집:rcvPayComboBox
  - trOccTypeName 100 "거래발생구분" TextCenter 편집:TrOccTypecomboBox
  - itemClassGroupCode 150 "종목그룹코드" Text 편집:TextField
  - financeYn 100 "금융상품거래" Boolean
  - lockYn 100 "잠금" Boolean
  - useYn 70 "사용여부" Boolean
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L78-190) → retrieve()
[E1] searchText.KeyPress [Enter] (L81) → retrieve()
[E2] retrieveButton[조회].Select (L90) → retrieve()
[E3] updateButton[저장].Select (L96) → update()
[E4] addRowButton[등록].Select (L102) → insertRow()
[E5] deleteRowButton[삭제].Select (L108) → deleteChk()
       └ [E11] msgBox.DialogHide [YES] (L347) → deleteRow()
[E6] windowUseButton[화면별 거래유형 등록].Select (L114) → lookupWindowUse()
[E7] companyField.TriggerClick [result == null] (L126) → 인라인 L126-148 (new TriggerClickHandler() { @Override…)
[E8] dataButton[기초데이터생성].Select (L149) → initData()
[E9] rcvPayComboBox[RcvPayCode].Collapse (L196) → 인라인 L196-203 (new CollapseHandler() { @Override pub…)
[E10] TrOccTypecomboBox[TrOccType].Collapse (L206) → 인라인 L206-213 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private initData() | L229-268 | E8 | 미선택 시 alert "선택한 고객사가 없습니다.", 서비스 ast.Ast05_TrCode.insertInitData(companyId) | 업무 |
| private lookupWindowUse() | L270-273 | E6 | 조회창 Ast15_Lookup_TrCodeWindow 열기 | 업무 |
| public retrieve() | L276-293 | 생성자,E1,E2 | 서비스 ast.Ast05_TrCode.selectByCompanyId(companyId, searchText, useYn, assetType) | 업무 |
| public update() | L296-330 | E3 | 서비스 ast.Ast05_TrCode.update | 업무 |
| public insertRow() | L333-342 | E4 | 상태 처리 | 업무 |
| private deleteChk() | L344-362 | E5 | ConfirmBox → E11 | 업무 |
| public deleteRow() | L365-369 | E11 | GridDeleteData ast.Ast05_TrCode.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L192-227 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L371-373 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L375-377 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('trCd', 100, '거래코드', { editor: 'text' }),  // L216
  gb.text('trNm', 300, '거래명', { editor: 'text' }),  // L217
  gb.textCenter('rcvPayNm', 100, '수령/지급', { editor: 'select' }),  // L218
  gb.textCenter('trOccTypeNm', 100, '거래발생구분'),  // L219
  gb.text('itemClassGroupCd', 150, '종목그룹코드', { editor: 'text' }),  // L220
  gb.boolean('financeYn', 100, '금융상품거래'),  // L221
  gb.boolean('lockYn', 100, '잠금'),  // L222
  gb.boolean('useYn', 70, '사용여부'),  // L223
  gb.text('note', 300, '비고', { editor: 'text' }),  // L224
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="register" onClick={lookupWindowUse}>화면별 거래유형 등록</Button>
6. <Button type="unknown" onClick={initData}>기초데이터생성</Button>

### Ast15_Lookup_TrCodeWindow (`client/vi/ast/Ast15_Lookup_TrCodeWindow.java`, 264줄)

- 레이아웃: west=cp, center=editPage
- 툴바 `buttonBar`: {companyField} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `editPage` Ast15_Page_TrCodeWindow, `companyField` LookupTriggerField 빈칸="운용사 선택", `lookupCompany` Sys01_Lookup_Company, `lookup` Sys06_Lookup_SearchMenu
- 그리드 `grid` (buildGrid()):
  - menuFullName 370 "메뉴명" Text
  - windowClassName 250 "Class명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L65-114) → settings(), show(), retrieve()
[E1] companyField.TriggerClick [result != null] (L122) → 인라인 L122-137 (new TriggerClickHandler() { @Override…)
[E2] grid.CellClick (L139) → retrievePage()
[E3] retrieveButton[조회].Select (L145) → retrieve()
[E4] insertButton[등록].Select (L151) → insertRow()
[E5] deleteButton[삭제].Select (L157) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L236) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-63 | 공개 메서드 | 상태 처리 | 업무 |
| private retrievePage() | L175-180 | E2,retrieve | 상태 처리 | 업무 |
| private retrieve() | L182-198 | 생성자,E3,insertRow | 서비스 ast.Ast15_TrCodeWindow.selectByAll(companyId) | 업무 |
| private insertRow() | L200-231 | E4 | 조회창 Sys06_Lookup_SearchMenu 열기, 팝업 Ast15_TrCodeWindowModel 열기, 서비스 ast.Ast15_TrCodeWindow.modelUpdate | 업무 |
| private deleteRow() | L233-252 | E5 | ConfirmBox → E6 | 업무 |
| private delete() | L254-258 | E6 | GridDeleteData ast.Ast15_TrCodeWindow.delete(체크된 행 목록) | 업무 |
| private settings() | L116-163 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: companyField=companyModel.getCompanyName( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L165-173 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L260-262 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('menuFullNm', 370, '메뉴명'),  // L169
  gb.text('windowClassNm', 250, 'Class명'),  // L170
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Ast15_Page_TrCodeWindow (`client/vi/ast/Ast15_Page_TrCodeWindow.java`, 218줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {updateButton} ▶ 사용할 거래코드를 우측에서 좌측으로 드래그하여 옮겨주세요:
- 입력·하위 화면: `searchText` TextField
- 그리드 `gridL` (buildGrid()):
  - trCode 100 "거래코드" TextCenter
  - trName 220 "거래코드명" Text
- 그리드 `gridR` (buildMainGrid()):
  - trCode 100 "거래코드" TextCenter
  - trName 220 "거래코드명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L52-108) → setGridGroup()
[E1] searchText.KeyPress [Enter] (L85) → search()
[E2] retrieveButton[찾기].Select (L94) → search()
[E3] updateButton[저장].Select (L102) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setGridGroup() | L110-121 | 생성자 | 상태 처리 | 업무 |
| private buildMainGrid() | L130-135 | 필드 초기화 | 상태 처리 | 업무 |
| private update() | L137-157 | E3 | 서비스 ast.Ast15_TrCodeWindow.insert | 업무 |
| public retrieve() | L159-179 | update | 서비스 ast.Ast15_TrCodeWindow.selectByClassName, ast.Ast15_TrCodeWindow.getTrCode(companyId, className, companyId, className) | 업무 |
| private search() | L181-205 | E1,E2 | 상태 처리 | 업무 |
| private buildGrid() | L123-128 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L207-209 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L211-213 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L215-217 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('trCd', 100, '거래코드'),  // L125
  gb.text('trNm', 220, '거래코드명'),  // L126
];

const buildMainGrid = () => [
  gb.textCenter('trCd', 100, '거래코드'),  // L132
  gb.text('trNm', 220, '거래코드명'),  // L133
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={update}>저장</Button>

