# Pay04_Tab_Formula

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 임금계산방법(x) (#1111, 미사용)
- 파일: `client/vi/pay/Pay04_Tab_Formula.java`
- 함께 쓰는 클래스 1개:
  - `Pay04_Lookup_Insert` `client/vi/pay/Pay04_Lookup_Insert.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay04_Formula.deleteByDate` | Pay04_Tab_Formula:152 | [`Pay04_Formula.java:139`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.deleteByDate`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.insert` | Pay04_Lookup_Insert:74 | [`Pay04_Formula.java:58`](../../pay/services/Pay04_Formula.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay04_formula.insert`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByMaxCompanyId`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.selectByCompanyId` | Pay04_Tab_Formula:178 | [`Pay04_Formula.java:27`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.selectByCompanyId`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.selectByDate` | Pay04_Tab_Formula:190 | [`Pay04_Formula.java:39`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.selectByDate`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.update` | Pay04_Tab_Formula:129 | [`Pay04_Formula.java:152`](../../pay/services/Pay04_Formula.md) | `UpdateDataModel(pay04_formula)` 동적 INSERT/UPDATE → [`pay04_formula.selectById`](../../pay/sql/pay04_formula.md) |

## 테이블

[`pay04_formula`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay04_Tab_Formula (`client/vi/pay/Pay04_Tab_Formula.java`, 207줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookup` Pay04_Lookup_Insert
- 그리드 `grid` (buildGrid()):
  - startDate 150 "기준 적용일" Date
- 그리드 `formGrid` (buildDayGrid()):
  - formulaName 200 "구분" Text
  - rate 200 "이율(%)" Double 편집:DoubleField
  - formulaForm 600 "산출식 또는 산출방법 입력" Text 편집:TextField
  - note 600 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L47-71) → settings(), retrieve()
[E1] grid.SelectionChanged [선택>0] (L74) → retrieveForm()
[E2] retrieveButton[조회].Select (L84) → retrieve()
[E3] insertButton[생성].Select (L90) → insert()
[E4] deleteButton[삭제].Select (L96) → delete()
       └ [E6] msgBox.DialogHide [YES] (L145) → retrieve()
[E5] updateButton[저장].Select (L102) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildDayGrid() | L117-125 | 필드 초기화 | 상태 처리 | 업무 |
| private update() | L127-135 | E5 | 서비스 pay.Pay04_Formula.update | 업무 |
| private delete() | L137-173 | E4 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E6 | 업무 |
| public retrieve() | L175-184 | 생성자,E2,E6,insert | 서비스 pay.Pay04_Formula.selectByCompanyId(companyId) | 업무 |
| public retrieveForm() | L186-196 | E1 | 서비스 pay.Pay04_Formula.selectByDate(companyId, startDate) | 업무 |
| private insert() | L198-206 | E3 | 조회창 Pay04_Lookup_Insert 열기 | 업무 |
| private settings() | L73-108 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L110-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 150, '기준 적용일'),  // L113
];

const buildDayGrid = () => [
  gb.text('formulaNm', 200, '구분'),  // L120 SQL 계산 컬럼(selectByDateCode: f_cdnm('PayFormulaCode', pay04_formula_…)
  gb.double('rate', 200, '이율(%)', { editor: 'number' }),  // L121
  gb.text('formulaForm', 600, '산출식 또는 산출방법 입력', { editor: 'text' }),  // L122
  gb.text('note', 600, '비고', { editor: 'text' }),  // L123
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={insert}>생성</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>

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

