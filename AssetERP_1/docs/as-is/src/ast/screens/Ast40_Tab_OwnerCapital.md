# Ast40_Tab_OwnerCapital

- 종류: 화면
- 메뉴: 고유자산 > 10. 고유자산 등록 > 자기자본/투자한도 등록 (#1299)
- 파일: `client/vi/ast/Ast40_Tab_OwnerCapital.java`
- 함께 쓰는 클래스 2개:
  - `Ast41_Lookup_InvestLimit` `client/vi/ast/Ast41_Lookup_InvestLimit.java`
  - `Ast41_Lookup_Insert` `client/vi/ast/Ast41_Lookup_Insert.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast40_OwnerCapital.delete` | Ast40_Tab_OwnerCapital:218 | [`Ast40_OwnerCapital.java:49`](../../ast/services/Ast40_OwnerCapital.md) | `UpdateDataModel(ast40_owner_capital)` 동적 DELETE |
| `ast.Ast40_OwnerCapital.selectByDate` | Ast40_Tab_OwnerCapital:150 | [`Ast40_OwnerCapital.java:34`](../../ast/services/Ast40_OwnerCapital.md) | [`ast40_owner_capital.selectByDate`](../../ast/sql/ast40_owner_capital.md) |
| `ast.Ast40_OwnerCapital.update` | Ast40_Tab_OwnerCapital:200 | [`Ast40_OwnerCapital.java:44`](../../ast/services/Ast40_OwnerCapital.md) | `UpdateDataModel(ast40_owner_capital)` 동적 INSERT/UPDATE → [`ast40_owner_capital.selectById`](../../ast/sql/ast40_owner_capital.md) |
| `ast.Ast41_InvestLimit.delete` | Ast41_Lookup_InvestLimit:290 | [`Ast41_InvestLimit.java:106`](../../ast/services/Ast41_InvestLimit.md) | `UpdateDataModel(ast41_invest_limit)` 동적 DELETE |
| `ast.Ast41_InvestLimit.deleteByDate` | Ast41_Lookup_InvestLimit:219 | [`Ast41_InvestLimit.java:88`](../../ast/services/Ast41_InvestLimit.md) | [`ast41_invest_limit.deleteByDate`](../../ast/sql/ast41_invest_limit.md) |
| `ast.Ast41_InvestLimit.insert` | Ast41_Lookup_Insert:74 | [`Ast41_InvestLimit.java:52`](../../ast/services/Ast41_InvestLimit.md) | [`ast41_invest_limit.insert`](../../ast/sql/ast41_invest_limit.md), [`ast41_invest_limit.selectByMaxCompanyId`](../../ast/sql/ast41_invest_limit.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast41_InvestLimit.selectByCompanyId` | Ast41_Lookup_InvestLimit:255 | [`Ast41_InvestLimit.java:26`](../../ast/services/Ast41_InvestLimit.md) | [`ast41_invest_limit.selectByCompanyId`](../../ast/sql/ast41_invest_limit.md) |
| `ast.Ast41_InvestLimit.selectByDate` | Ast41_Lookup_InvestLimit:269 | [`Ast41_InvestLimit.java:38`](../../ast/services/Ast41_InvestLimit.md) | [`ast41_invest_limit.selectByDate`](../../ast/sql/ast41_invest_limit.md) |
| `ast.Ast41_InvestLimit.update` | Ast41_Lookup_InvestLimit:194 | [`Ast41_InvestLimit.java:101`](../../ast/services/Ast41_InvestLimit.md) | `UpdateDataModel(ast41_invest_limit)` 동적 INSERT/UPDATE → [`ast41_invest_limit.selectById`](../../ast/sql/ast41_invest_limit.md) |

## 테이블

[`ast40_owner_capital`](../../../db/tables/ast.md), [`ast41_invest_limit`](../../../db/tables/ast.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast40_Tab_OwnerCapital (`client/vi/ast/Ast40_Tab_OwnerCapital.java`, 239줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준연도: {leaveYText} {retrieveButton} {insertButton} {deleteButton} {updateButton} {stopLossButton}
- 입력·하위 화면: `leaveYText` TextField 빈칸="YYYY", `lookupStopLoss` Ast41_Lookup_InvestLimit
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - stdDate 100 "기준일" Date 편집:MyDateField
  - amt 200 "자기자본금" Long 편집:LongField
  - note 800 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L55-86) → settings(), retrieve()
[E1] leaveYText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L101) → retrieve()
[E3] insertButton[등록].Select (L107) → insertRow()
[E4] deleteButton[삭제].Select (L113) → delete()
       └ [E7] msgBox.DialogHide [YES] (L211) → 서비스 ast.Ast40_OwnerCapital.delete
[E5] updateButton[저장].Select (L119) → update()
[E6] stopLossButton[투자한도/StopLoss 설정].Select (L125) → lookupStopLoss()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L144-160 | 생성자,E1,E2 | 서비스 ast.Ast40_OwnerCapital.selectByDate(companyId, stdYear) | 업무 |
| private insertRow() | L191-196 | E3 | 상태 처리 | 업무 |
| private update() | L198-201 | E5 | 서비스 ast.Ast40_OwnerCapital.update | 업무 |
| private delete() | L203-229 | E4 | 미선택 시 alert "삭제할 항목을 선택해주세요" → 확인창 E7 | 업무 |
| public lookupStopLoss() | L231-234 | E6 | 조회창 Ast41_Lookup_InvestLimit 열기 | 업무 |
| private settings() | L88-131 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L133-142 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일', { editor: 'date' }),  // L137
  gb.long('amt', 200, '자기자본금', { editor: 'number' }),  // L138
  gb.text('note', 800, '비고', { editor: 'text' }),  // L139
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="view" onClick={lookupStopLoss}>투자한도/StopLoss 설정</Button>

### Ast41_Lookup_InvestLimit (`client/vi/ast/Ast41_Lookup_InvestLimit.java`, 297줄)

- 레이아웃: west=grid, center=formGrid
- 툴바 `buttonBar1`: {retrieveButton} {insertButton} {deleteButton}
- 툴바 `buttonBar2`: {insertRowButton} {deleteRowButton}
- 입력·하위 화면: `investAssetTypeComboBox` ComboBoxField("InvestAssetType"), `lookup` Ast41_Lookup_Insert
- 그리드 `grid` (buildGrid()):
  - startDate 150 "기준 적용일" Date
- 그리드 `formGrid` (buildFormGrid(), 체크박스(다중)):
  - investAssetName 150 "자산구분" Text 편집:investAssetTypeComb…
  - limitRate 150 "투자한도비율(%)" Double 편집:DoubleField
  - stopLossRate 150 "Stop Loss(%)" Double 편집:DoubleField
  - note 200 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L71-162) → show()
[E1] grid.SelectionChanged [선택>0] (L78) → retrieveForm()
[E2] retrieveButton[조회].Select (L88) → retrieve()
[E3] insertButton[생성].Select (L94) → insert()
[E4] deleteButton[삭제].Select (L100) → delete()
       └ [E10] msgBox.DialogHide [YES] (L212) → retrieve()
[E5] insertRowButton[행 추가].Select (L106) → insertRow()
[E6] deleteRowButton[행 삭제].Select (L112) → deleteRow()
[E7] updateButton[저장].Select (L119) → update()
[E8] cancleButton[닫기].Select (L125) → hide()
[E9] investAssetTypeComboBox[InvestAssetType].Collapse (L174) → 인라인 L174-182 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L67-69 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFormGrid() | L170-190 | 필드 초기화 | 상태 처리 | 업무 |
| private update() | L192-202 | E7 | 서비스 ast.Ast41_InvestLimit.update | 업무 |
| private delete() | L204-240 | E4 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E10 | 업무 |
| private insert() | L242-250 | E3 | 조회창 Ast41_Lookup_Insert 열기 | 업무 |
| public retrieve() | L252-263 | E2,E10,open,insert | 서비스 ast.Ast41_InvestLimit.selectByCompanyId(companyId) | 업무 |
| public retrieveForm() | L265-275 | E1,update | 서비스 ast.Ast41_InvestLimit.selectByDate(companyId, startDate) | 업무 |
| public insertRow() | L277-285 | E5 | 상태 처리 | 업무 |
| public deleteRow() | L287-291 | E6 | GridDeleteData ast.Ast41_InvestLimit.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L164-168 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L293-295 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 150, '기준 적용일'),  // L166
];

const buildFormGrid = () => [
  gb.text('investAssetNm', 150, '자산구분', { editor: 'select' }),  // L185 SQL 계산 컬럼(selectByDate: f_cdnm('InvestAssetType', ast41_invest_…)
  gb.double('limitRate', 150, '투자한도비율(%)', { editor: 'number' }),  // L186
  gb.double('stopLossRate', 150, 'Stop Loss(%)', { editor: 'number' }),  // L187
  gb.text('note', 200, '비고', { editor: 'text' }),  // L188
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

### Ast41_Lookup_Insert (`client/vi/ast/Ast41_Lookup_Insert.java`, 95줄)

- 입력·하위 화면: `payDate` MyDateField

#### 이벤트
[E1] updateButton[생성].Select (L49) → update()
[E2] closeButton[닫기].Select (L55) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L33-66 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L68-86 | E1 | 서비스 ast.Ast41_InvestLimit.insert(companyId, startDate) | 업무 |
| private setHtmlStyle() | L88-90 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L92-94 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

