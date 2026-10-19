# Act11_Tab_TrJournalMap

- 종류: 화면
- 메뉴: 관리자 > 05. 관리회계 > 거래유형별 분개맵핑 (#1162)
- 메뉴: 기초자료 > 40. 관리회계 > 거래유형별 분개맵핑 (#1168)
- 파일: `client/vi/act/Act11_Tab_TrJournalMap.java`
- 함께 쓰는 클래스 2개:
  - `Act11_Grid_TrJournalMap` `client/vi/act/Act11_Grid_TrJournalMap.java`
  - `Act10_Lookup_ReprAccount` `client/vi/act/Act10_Lookup_ReprAccount.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast05_Lookup_TrCode`](../../ast/components/Ast05_Lookup_TrCode.md), [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act10_ReprAccount.selectByCompanyId` | Act10_Lookup_ReprAccount:158, Act11_Grid_TrJournalMap:123, Act11_Tab_TrJournalMap:279 | [`Act10_ReprAccount.java:25`](../../act/services/Act10_ReprAccount.md) | [`act10_repr_account.selectByCompanyId`](../../act/sql/act10_repr_account.md) |
| `act.Act11_TrMap.delete` | Act11_Tab_TrJournalMap:464 | [`Act11_TrMap.java:57`](../../act/services/Act11_TrMap.md) | `UpdateDataModel(act11_tr_map)` 동적 DELETE |
| `act.Act11_TrMap.insertInitData` | Act11_Tab_TrJournalMap:358 | [`Act11_TrMap.java:31`](../../act/services/Act11_TrMap.md) | [`act11_tr_map.deleteByJournalGroup`](../../act/sql/act11_tr_map.md), [`act11_tr_map.insertInitData`](../../act/sql/act11_tr_map.md), [`act12_journal_map.deleteByJournalGroup`](../../act/sql/act12_journal_map.md), [`act12_journal_map.insertInitData`](../../act/sql/act12_journal_map.md) |
| `act.Act11_TrMap.selectByCompanyId` | Act11_Tab_TrJournalMap:408 | [`Act11_TrMap.java:25`](../../act/services/Act11_TrMap.md) | [`act11_tr_map.selectByCompanyId`](../../act/sql/act11_tr_map.md) |
| `act.Act11_TrMap.update` | Act11_Tab_TrJournalMap:436 | [`Act11_TrMap.java:52`](../../act/services/Act11_TrMap.md) | `UpdateDataModel(act11_tr_map)` 동적 INSERT/UPDATE → [`act11_tr_map.selectById`](../../act/sql/act11_tr_map.md) |
| `act.Act12_JournalMap.delete` | Act11_Grid_TrJournalMap:265 | [`Act12_JournalMap.java:39`](../../act/services/Act12_JournalMap.md) | `UpdateDataModel(act12_journal_map)` 동적 DELETE |
| `act.Act12_JournalMap.selectByJournalGroup` | Act11_Grid_TrJournalMap:222 | [`Act12_JournalMap.java:28`](../../act/services/Act12_JournalMap.md) | [`act12_journal_map.selectByJournalGroup`](../../act/sql/act12_journal_map.md) |
| `act.Act12_JournalMap.update` | Act11_Grid_TrJournalMap:236 | [`Act12_JournalMap.java:34`](../../act/services/Act12_JournalMap.md) | `UpdateDataModel(act12_journal_map)` 동적 INSERT/UPDATE → [`act12_journal_map.selectById`](../../act/sql/act12_journal_map.md) |
| `ast.Ast05_TrCode.selectBySearchText` | Act11_Tab_TrJournalMap:234 | [`Ast05_TrCode.java:37`](../../ast/services/Ast05_TrCode.md) | [`ast05_tr_code.selectBySearchText`](../../ast/sql/ast05_tr_code.md) |

## 테이블

[`act10_repr_account`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act12_journal_map`](../../../db/tables/act.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act11_Tab_TrJournalMap (`client/vi/act/Act11_Tab_TrJournalMap.java`, 481줄)

- 레이아웃: north=vlc, center=journalGrid
- 툴바 `buttonBar`: 거래코드/명: {trSearchText} 분개그룹: {jnlGroupSearchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {companyField} {dataButton}
- 입력·하위 화면: `trSearchText` TextField, `jnlGroupSearchText` TextField, `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `lookupTrCode` LookupTriggerField, `bookIoTypeComboBox` ComboBoxField("BookInOutType"), `lookupPlReprAccount` LookupTriggerField, `lookupReprAccount` Act10_Lookup_ReprAccount
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - trCode 120 "거래코드" TextCenter 편집:lookupTrCode
  - trName 250 "거래명" Text
  - journalGroup 120 "분개그룹" TextCenter 편집:TextField
  - bookIoTypeName 120 "입출고구분" TextCenter 편집:bookIoTypeComboBox
  - plReprAccountName 120 "손익대표계정" TextCenter 편집:lookupPlReprAccount
  - useYn 80 "사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L85-126) → settings(), retrieve()
[E1] trSearchText.KeyPress [Enter] (L130) → retrieve()
[E2] jnlGroupSearchText.KeyPress [Enter] (L140) → retrieve()
[E3] retrieveButton[조회].Select (L149) → retrieve()
[E4] insertButton[등록].Select (L155) → insertRow()
[E5] updateButton[저장].Select (L161) → update()
[E6] deleteButton[삭제].Select (L167) → deleteRow()
       └ [E15] msgBox.DialogHide [YES] (L457) → 서비스 act.Act11_TrMap.delete
[E7] companyField.TriggerClick [result == null] (L176) → 인라인 L176-198 (new TriggerClickHandler() { @Override…)
[E8] dataButton[기초데이터생성].Select (L199) → initData()
[E9] grid.RowClick (L206) → 인라인 L206-212 (new RowClickHandler() { @Override pub…)
[E10] lookupTrCode.TriggerClick (L220) → lookupTrCode()
[E11] lookupTrCode.ValueChange (L226) → setTrCode(), lookupTrCode()
[E12] bookIoTypeComboBox[BookInOutType].Collapse (L256) → 인라인 L256-262 (new CollapseHandler() { @Override pub…)
[E13] lookupPlReprAccount.TriggerClick (L265) → lookupPlReprAccount()
[E14] lookupPlReprAccount.ValueChange (L271) → setPlReprAccount(), lookupPlReprAccount()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupTrCode() | L310-319 | E10,E11 | 조회창 Ast05_Lookup_TrCode 열기 | 업무 |
| private setTrCode() | L321-325 | E11,lookupTrCode | 상태 처리 | 업무 |
| private lookupPlReprAccount() | L327-336 | E13,E14 | 조회창 Act10_Lookup_ReprAccount 열기 | 업무 |
| private setPlReprAccount() | L338-342 | E14,lookupPlReprAccount | 상태 처리 | 업무 |
| private initData() | L344-383 | E8 | 미선택 시 alert "선택한 고객사가 없습니다.", 서비스 act.Act11_TrMap.insertInitData(companyId) | 업무 |
| public retrieve() | L385-419 | 생성자,E1,E2,E3 | 서비스 act.Act11_TrMap.selectByCompanyId(companyId, trSearchText, jnlGroupSearchText) | 업무 |
| public update() | L422-437 | E5 | 서비스 act.Act11_TrMap.update | 업무 |
| public insertRow() | L440-446 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L449-475 | E6 | 미선택 시 alert "삭제할 거래 맵핑정보를 선택해주세요" → 확인창 E15 | 업무 |
| private settings() | L128-213 | 생성자 | 조회창 Sys01_Lookup_Company 열기, 이벤트 연결, 초기값: companyField=null, companyField=companyName | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L215-308 | 필드 초기화 | 서비스 ast.Ast05_TrCode.selectBySearchText, act.Act10_ReprAccount.selectByCompanyId(companyId, useYn, searchText, rcvPayCode, companyId, searchText, attributeCode), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L477-479 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('trCd', 120, '거래코드'),  // L300
  gb.text('trNm', 250, '거래명'),  // L301
  gb.textCenter('journalGroup', 120, '분개그룹', { editor: 'text' }),  // L302
  gb.textCenter('bookIoTypeNm', 120, '입출고구분', { editor: 'select' }),  // L303
  gb.textCenter('plReprAccountNm', 120, '손익대표계정'),  // L304
  gb.boolean('useYn', 80, '사용'),  // L305
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={initData}>기초데이터생성</Button>

### Act11_Grid_TrJournalMap (`client/vi/act/Act11_Grid_TrJournalMap.java`, 278줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookupReprAccountField` LookupTriggerField, `comboBoxDrcrField` ComboBoxField("DrcrType"), `lookupReprAccount` Act10_Lookup_ReprAccount
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - journalGroup 120 "분개그룹" TextCenter 편집:TextField
  - seq 80 "순번" Long 편집:LongField
  - reprAccountCode 120 "대표계정코드" TextCenter 편집:lookupReprAccountFi…
  - reprAccountName 200 "대표계정명" Text
  - drcrTypeName 120 "차대구분" TextCenter 편집:comboBoxDrcrField
  - formula 200 "계산식" Text 편집:TextField
  - forFormula 200 "외화계산식" Text 편집:TextField
  - note 300 "비고" Text 편집:TextField
  - useYn 80 "사용" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L62-79) → settings()
[E1] insertButton[등록].Select (L83) → insertRow()
[E2] updateButton[저장].Select (L89) → preUpdate()
[E3] deleteButton[삭제].Select (L95) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L258) → 서비스 act.Act12_JournalMap.delete
[E4] lookupReprAccountField.TriggerClick (L109) → lookupReprAccount()
[E5] lookupReprAccountField.ValueChange (L115) → setReprAccount(), lookupReprAccount()
[E6] comboBoxDrcrField[DrcrType].Collapse (L144) → 인라인 L144-150 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private lookupReprAccount() | L166-175 | E4,E5 | 조회창 Act10_Lookup_ReprAccount 열기 | 업무 |
| private setReprAccount() | L177-181 | E5,lookupReprAccount | 상태 처리 | 업무 |
| private preUpdate() | L183-209 | E2 | 상태 처리 | 업무 |
| public retrieve() | L211-214 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L217-231 | 공개 메서드 | 서비스 act.Act12_JournalMap.selectByJournalGroup(companyId, journalGroup) | 업무 |
| public update() | L234-237 | preUpdate | 서비스 act.Act12_JournalMap.update | 업무 |
| public insertRow() | L240-247 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L250-276 | E3 | 미선택 시 alert "삭제할 분개 맵핑정보를 선택해주세요" → 확인창 E7 | 업무 |
| private settings() | L81-101 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L103-164 | 필드 초기화 | 서비스 act.Act10_ReprAccount.selectByCompanyId(companyId, searchText, attributeCode), 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('journalGroup', 120, '분개그룹', { editor: 'text' }),  // L153
  gb.long('seq', 80, '순번', { editor: 'number' }),  // L154
  gb.textCenter('reprAccountCd', 120, '대표계정코드'),  // L155
  gb.text('reprAccountNm', 200, '대표계정명'),  // L156 SQL 계산 컬럼(selectByJournalGroup: act10_repr_account_nm)
  gb.textCenter('drcrTypeNm', 120, '차대구분'),  // L157 SQL 계산 컬럼(selectByJournalGroup: f_cdnm('DrcrType', act12_drcr_type, act…)
  gb.text('formula', 200, '계산식', { editor: 'text' }),  // L158
  gb.text('forFormula', 200, '외화계산식', { editor: 'text' }),  // L159
  gb.text('note', 300, '비고', { editor: 'text' }),  // L160
  gb.boolean('useYn', 80, '사용'),  // L161
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={preUpdate}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Act10_Lookup_ReprAccount (`client/vi/act/Act10_Lookup_ReprAccount.java`, 193줄)

- 툴바 `buttonBar`: 대표계정코드/명: {searchText} 계정속성: {attributeComboBox} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `attributeComboBox` ComboBoxField("AccountAttributeCode", "%", "전체") 빈칸="전체"
- 그리드 `grid` (buildGrid(), 체크박스):
  - attributeName 80 "속성" TextCenter
  - reprAccountCode 100 "대표계정코드" TextCenter
  - reprAccountName 300 "대표계정명" Text

#### 이벤트
[E1] grid.CellDoubleClick (L81) → confirm()
[E2] searchText.KeyPress [Enter] (L97) → retrieve()
[E3] retrieveButton[조회].Select (L106) → retrieve()
[E4] oKButton[확인].Select (L112) → confirm()
[E5] cancelButton[취소].Select (L118) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L48-51 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L53-89 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L138-159 | E2,E3,open | 서비스 act.Act10_ReprAccount.selectByCompanyId(companyId, searchText, attributeCode), 건수 표시 | 업무 |
| public confirm() | L161-172 | E1,E4 | 미선택 시 alert "선택된 대표계정코드가 없습니다." | 업무 |
| public getServiceResult() | L175-183 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L91-124 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L126-136 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L185-187 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L189-191 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L131 attributeName 80 "속성" (act10_attribute_nm 컬럼 없음)
  gb.textCenter('reprAccountCd', 100, '대표계정코드'),  // L132
  gb.text('reprAccountNm', 300, '대표계정명'),  // L133
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

