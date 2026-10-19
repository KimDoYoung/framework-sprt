# Ast25_Tab_Price

- 종류: 화면
- 메뉴: 고유자산 > 20. 고유자산 거래처리 > 금융상품 시세관리 (#1295)
- 파일: `client/vi/ast/Ast25_Tab_Price.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast25_Price.delete` | Ast25_Tab_Price:346 | [`Ast25_Price.java:110`](../../ast/services/Ast25_Price.md) | `UpdateDataModel(ast25_price)` 동적 DELETE |
| `ast.Ast25_Price.selectByStdDatePaging` | Ast25_Tab_Price:109 | [`Ast25_Price.java:26`](../../ast/services/Ast25_Price.md) | [`ast25_price.selectByStdDatePaging`](../../ast/sql/ast25_price.md), [`ast25_price.selectByStdDatePagingTotal`](../../ast/sql/ast25_price.md) |
| `ast.Ast25_Price.upsert` | Ast25_Tab_Price:297 | [`Ast25_Price.java:38`](../../ast/services/Ast25_Price.md) | [`ast25_price.checkItemCode`](../../ast/sql/ast25_price.md), [`ast25_price.upsert`](../../ast/sql/ast25_price.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys00_Common.selectByKindGroupCode` | Ast25_Tab_Price:137 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast25_price`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`icam20_price`](../../../db/tables/icam.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast25_Tab_Price (`client/vi/ast/Ast25_Tab_Price.java`, 386줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 종목유형: {itemTypeComboBox} 검색: {searchTextField} {holdCheckBox} {retrieveButton} {insertRowButton} {updateButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchTextField` TextField 빈칸="종목코드/종목명", `holdCheckBox` CheckBox, `itemTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체") 빈칸="선택하세요"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - lockYn 40 "" BooleanIcon
  - stdDate 110 "기준일" Date 편집:MyDateField
  - itemTypeName 150 "종목유형" TextCenter 편집:itemTypeComboBox
  - itemCode 150 "종목코드" TextCenter 편집:TextField
  - itemName 350 "종목명" Text 편집:TextField
  - evalPrice 150 "기준일 종가" Double 편집:DoubleField
  - note 300 "비고" TextArea 편집:TextArea
  - itemFullCode 150 "표준코드" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L77-120) → setting()
[E1] searchTextField.KeyPress [Enter] (L148) → retrieve()
[E2] retrieveButton[조회].Select (L160) → retrieve()
[E3] insertRowButton[등록].Select (L166) → insertRow()
[E4] updateButton[저장].Select (L172) → update()
[E5] deleteButton[삭제].Select (L178) → deleteRow()
       └ [E8] msgBox.DialogHide [YES] (L339) → 서비스 ast.Ast25_Price.delete
[E6] grid.CellDoubleClick [colIndex == 9] (L185) → 인라인 L185-196 (new CellDoubleClickHandler() { @Overr…)
[E7] itemTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L209) → 인라인 L209-215 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L122-197 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode | 업무 |
| public retrieve() | L232-256 | E1,E2 | 상태 처리 | 업무 |
| public update() | L259-312 | E4 | 서비스 ast.Ast25_Price.upsert(companyId) | 업무 |
| public insertRow() | L315-321 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L324-357 | E5 | ConfirmBox → E8 | 업무 |
| private getCellValue() | L360-365 | 미사용 후보 | 상태 처리 | 업무 |
| public buildGrid() | L199-229 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByKindGroupCode, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L377-379 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L381-383 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L219) addBooleanIcon
  gb.date('stdDate', 110, '기준일', { editor: 'date' }),  // L220
  gb.textCenter('itemTypeNm', 150, '종목유형', { editor: 'select' }),  // L221 SQL 계산 컬럼(selectByStdDatePaging: f_cdnm('ItemMClassCode', ast25_item_typ…)
  gb.textCenter('itemCd', 150, '종목코드', { editor: 'text' }),  // L222
  gb.text('itemNm', 350, '종목명', { editor: 'text' }),  // L223
  gb.double('evalPrice', 150, '기준일 종가', { editor: 'number' }),  // L224
  gb.textArea('note', 300, '비고', { editor: 'largeText' }),  // L225
  gb.textCenter('itemFullCd', 150, '표준코드'),  // L226 SQL 계산 컬럼(selectByStdDatePaging: com50_item_cd)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

