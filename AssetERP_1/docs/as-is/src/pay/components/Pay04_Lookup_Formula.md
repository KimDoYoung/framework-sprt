# Pay04_Lookup_Formula

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `emp`
- 파일: `client/vi/pay/Pay04_Lookup_Formula.java`
- 함께 쓰는 클래스 2개:
  - `Pay20_Lookup_ItemList` `client/vi/pay/Pay20_Lookup_ItemList.java`
  - `Pay04_Lookup_Insert` `client/vi/pay/Pay04_Lookup_Insert.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay04_Formula.delete` | Pay04_Lookup_Formula:294 | [`Pay04_Formula.java:157`](../../pay/services/Pay04_Formula.md) | `UpdateDataModel(pay04_formula)` 동적 DELETE |
| `pay.Pay04_Formula.deleteByDate` | Pay04_Lookup_Formula:205 | [`Pay04_Formula.java:139`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.deleteByDate`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.insert` | Pay04_Lookup_Insert:74 | [`Pay04_Formula.java:58`](../../pay/services/Pay04_Formula.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay04_formula.insert`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByMaxCompanyId`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.selectByCompanyId` | Pay04_Lookup_Formula:241 | [`Pay04_Formula.java:27`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.selectByCompanyId`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.selectByDate` | Pay04_Lookup_Formula:255 | [`Pay04_Formula.java:39`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.selectByDate`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.update` | Pay04_Lookup_Formula:180 | [`Pay04_Formula.java:152`](../../pay/services/Pay04_Formula.md) | `UpdateDataModel(pay04_formula)` 동적 INSERT/UPDATE → [`pay04_formula.selectById`](../../pay/sql/pay04_formula.md) |
| `pay.Pay20_Item.selectByText` | Pay20_Lookup_ItemList:122 | [`Pay20_Item.java:24`](../../pay/services/Pay20_Item.md) | [`pay20_item.selectByText`](../../pay/sql/pay20_item.md) |

## 테이블

[`pay04_formula`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay04_Lookup_Formula (`client/vi/pay/Pay04_Lookup_Formula.java`, 301줄)

- 레이아웃: west=grid, center=formGrid
- 툴바 `buttonBar1`: {retrieveButton} {insertButton} {deleteButton}
- 툴바 `buttonBar2`: {insertRowButton} {deleteRowButton}
- 입력·하위 화면: `lookup` Pay04_Lookup_Insert, `popup` Pay20_Lookup_ItemList
- 그리드 `grid` (buildGrid()):
  - startDate 150 "기준 적용일" Date
- 그리드 `formGrid` (buildFormGrid(), 체크박스(다중)):
  - itemName 150 "구분" Text
  - formulaForm 320 "산출식 또는 산출방법 입력" Text 편집:TextField
  - note 200 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L69-160) → show()
[E1] grid.SelectionChanged [선택>0] (L76) → retrieveForm()
[E2] retrieveButton[조회].Select (L86) → retrieve()
[E3] insertButton[생성].Select (L92) → insert()
[E4] deleteButton[삭제].Select (L98) → delete()
       └ [E9] msgBox.DialogHide [YES] (L198) → retrieve()
[E5] insertRowButton[행 추가].Select (L104) → insertRow()
[E6] deleteRowButton[행 삭제].Select (L110) → deleteRow()
[E7] updateButton[저장].Select (L117) → update()
[E8] cancleButton[닫기].Select (L123) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L65-67 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFormGrid() | L168-176 | 필드 초기화 | 상태 처리 | 업무 |
| private update() | L178-188 | E7 | 서비스 pay.Pay04_Formula.update | 업무 |
| private delete() | L190-226 | E4 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E9 | 업무 |
| private insert() | L228-236 | E3 | 조회창 Pay04_Lookup_Insert 열기 | 업무 |
| public retrieve() | L238-249 | E2,E9,open,insert | 서비스 pay.Pay04_Formula.selectByCompanyId(companyId) | 업무 |
| public retrieveForm() | L251-261 | E1,update | 서비스 pay.Pay04_Formula.selectByDate(companyId, startDate) | 업무 |
| public insertRow() | L263-289 | E5 | 조회창 Pay20_Lookup_ItemList 열기 | 업무 |
| public deleteRow() | L291-295 | E6 | GridDeleteData pay.Pay04_Formula.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L162-166 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L297-299 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 150, '기준 적용일'),  // L164
];

const buildFormGrid = () => [
  gb.text('itemNm', 150, '구분'),  // L172 SQL 계산 컬럼(selectByDate: pay20_item_nm)
  gb.text('formulaForm', 320, '산출식 또는 산출방법 입력', { editor: 'text' }),  // L173
  gb.text('note', 200, '비고', { editor: 'text' }),  // L174
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>
4. <Button type="generate" onClick={insert}>생성</Button>
5. <Button type="delete" onClick={delete}>삭제</Button>
6. <Button type="addRow" onClick={insertRow}>행 추가</Button>
7. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Pay20_Lookup_ItemList (`client/vi/pay/Pay20_Lookup_ItemList.java`, 149줄)

- 툴바 `buttonBar`: 항목명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemTypeName 140 "구분" Text
  - itemName 150 "항목명" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L56) → retrieve()
[E2] grid.RowDoubleClick (L64) → confirm()
[E3] retrieveButton[조회].Select (L70) → retrieve()
[E4] oKButton[확인].Select (L76) → confirm()
[E5] cancelButton[취소].Select (L82) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-106 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L118-128 | E1,E3,open | 서비스 pay.Pay20_Item.selectByText(searchText) | 업무 |
| public confirm() | L130-139 | E2,E4 | 상태 처리 | 업무 |
| private buildGrid() | L108-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L141-143 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L145-147 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemTypeNm', 140, '구분'),  // L112 SQL 계산 컬럼(selectByText: f_cdnm('PayItemType', pay20_item_type, …)
  gb.text('itemNm', 150, '항목명'),  // L113
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Pay04_Lookup_Insert (`client/vi/pay/Pay04_Lookup_Insert.java`, 95줄)

- 입력·하위 화면: `payDate` MyDateField

#### 이벤트
[E1] updateButton[생성].Select (L49) → update()
[E2] closeButton[닫기].Select (L55) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L33-66 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L68-86 | E1 | 서비스 pay.Pay04_Formula.insert(companyId, startDate) | 업무 |
| private setHtmlStyle() | L88-90 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L92-94 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

