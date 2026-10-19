# Sys08_Tab_CodeKindAdmin

- 종류: 화면
- 메뉴: 관리자 > 03. 코드관리 > 시스템 공통코드 관리 (#1078)
- 파일: `client/vi/sys/Sys08_Tab_CodeKindAdmin.java`
- 함께 쓰는 클래스 3개:
  - `Sys13_Lookup_CodeGroup` `client/vi/sys/Sys13_Lookup_CodeGroup.java`
  - `Sys13_TabPage_Code` `client/vi/sys/Sys13_TabPage_Code.java`
  - `Sys09_Grid_Code` `client/vi/sys/Sys09_Grid_Code.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_SelectSingle`](../../sys/components/Sys01_Lookup_SelectSingle.md), [`Sys09_Lookup_CodeKind`](../../sys/components/Sys09_Lookup_CodeKind.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys08_CodeKind.delete` | Sys08_Tab_CodeKindAdmin:190 | [`Sys08_CodeKind.java:65`](../../sys/services/Sys08_CodeKind.md) | `UpdateDataModel(sys08_code_kind)` 동적 DELETE |
| `sys.Sys08_CodeKind.selectByKindName` | Sys08_Tab_CodeKindAdmin:163 | [`Sys08_CodeKind.java:22`](../../sys/services/Sys08_CodeKind.md) | [`sys08_code_kind.selectByKindName`](../../sys/sql/sys08_code_kind.md) |
| `sys.Sys08_CodeKind.update` | Sys08_Tab_CodeKindAdmin:168 | [`Sys08_CodeKind.java:60`](../../sys/services/Sys08_CodeKind.md) | `UpdateDataModel(sys08_code_kind)` 동적 INSERT/UPDATE → [`sys08_code_kind.selectById`](../../sys/sql/sys08_code_kind.md) |
| `sys.Sys09_Code.delete` | Sys09_Grid_Code:204 | [`Sys09_Code.java:391`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 DELETE |
| `sys.Sys09_Code.selectByCodeKindId` | Sys09_Grid_Code:166 | [`Sys09_Code.java:32`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKindId`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.update` | Sys09_Grid_Code:190 | [`Sys09_Code.java:386`](../../sys/services/Sys09_Code.md) | `UpdateDataModel(sys09_code)` 동적 INSERT/UPDATE → [`sys09_code.selectById`](../../sys/sql/sys09_code.md) |
| `sys.Sys13_CodeGroup.delete` | Sys13_TabPage_Code:196 | [`Sys13_CodeGroup.java:93`](../../sys/services/Sys13_CodeGroup.md) | `UpdateDataModel(sys13_code_group)` 동적 DELETE |
| `sys.Sys13_CodeGroup.deleteAll` | Sys13_Lookup_CodeGroup:188 | [`Sys13_CodeGroup.java:57`](../../sys/services/Sys13_CodeGroup.md) | [`sys13_code_group.delete`](../../sys/sql/sys13_code_group.md), `UpdateDataModel(sys13_code_group)` 동적 DELETE |
| `sys.Sys13_CodeGroup.insert` | Sys13_TabPage_Code:216 | [`Sys13_CodeGroup.java:44`](../../sys/services/Sys13_CodeGroup.md) | [`sys13_code_group.insert`](../../sys/sql/sys13_code_group.md), [`sys13_code_group.selectById`](../../sys/sql/sys13_code_group.md) |
| `sys.Sys13_CodeGroup.selectByGroupCodeKind` | Sys13_Lookup_CodeGroup:162 | [`Sys13_CodeGroup.java:25`](../../sys/services/Sys13_CodeGroup.md) | [`sys13_code_group.selectByGroupCodeKind`](../../sys/sql/sys13_code_group.md) |
| `sys.Sys13_CodeGroup.selectByKindGroupCode` | Sys13_TabPage_Code:240 | [`Sys13_CodeGroup.java:34`](../../sys/services/Sys13_CodeGroup.md) | [`sys13_code_group.selectByKindGroupCode`](../../sys/sql/sys13_code_group.md) |
| `sys.Sys13_CodeGroup.update` | Sys13_Lookup_CodeGroup:203 | [`Sys13_CodeGroup.java:72`](../../sys/services/Sys13_CodeGroup.md) | [`sys13_code_group.selectById`](../../sys/sql/sys13_code_group.md), [`sys13_code_group.update`](../../sys/sql/sys13_code_group.md), `UpdateDataModel(sys13_code_group)` 동적 INSERT/UPDATE → [`sys13_code_group.selectById`](../../sys/sql/sys13_code_group.md) |

## 테이블

[`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys08_Tab_CodeKindAdmin (`client/vi/sys/Sys08_Tab_CodeKindAdmin.java`, 205줄)

- 레이아웃: west=cp, center=gridCode
- 툴바 `buttonBar`: 코드구분명: {codeKindName} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `codeKindName` TextField, `openLookup` Sys13_Lookup_CodeGroup
- 그리드 `grid` (buildGrid()):
  - kindCode 120 "코드구분" Text 편집:"0069B4"
  - kindName 150 "코드구분명" Text 편집:"0069B4"
  - sysYnFlag 60 "시스템" Boolean
  - note 340 "상세설명" TextArea 편집:TextField
  - actionCell 60 "그룹" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L50-130) → retrieve()
[E1] codeKindName.KeyPress [Enter] (L63) → retrieve()
[E2] retrieveButton[조회].Select (L71) → retrieve()
[E3] insertButton[등록].Select (L77) → insertRow()
[E4] updateButton[저장].Select (L83) → update()
[E5] deleteButton[삭제].Select (L89) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L185) → 서비스 sys.Sys08_CodeKind.delete
[E6] grid.SelectionChanged (L121) → 인라인 L121-127 (new SelectionChangedHandler<Sys08_Cod…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private editGroup() | L152-157 | buildGrid | 조회창 Sys13_Lookup_CodeGroup 열기 | 업무 |
| public retrieve() | L159-164 | 생성자,E1,E2 | 서비스 sys.Sys08_CodeKind.selectByKindName(kindName, sysYn) | 업무 |
| public update() | L166-169 | E4 | 서비스 sys.Sys08_CodeKind.update | 업무 |
| public insertRow() | L171-177 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L179-200 | E5 | ConfirmBox → E7 | 업무 |
| private buildGrid() | L132-150 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('kindCd', 120, '코드구분', { editor: 'text' }),  // L143
  gb.text('kindNm', 150, '코드구분명', { editor: 'text' }),  // L144
  // ⚠DB없음 L145 sysYnFlag 60 "시스템" (sys08_sys_yn_flag 컬럼 없음)
  gb.textArea('note', 340, '상세설명', { editor: 'text' }),  // L146
  // ⚠ 대응 없음 (GridBuilder L147) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sys13_Lookup_CodeGroup (`client/vi/sys/Sys13_Lookup_CodeGroup.java`, 209줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `tabPageCode` Sys13_TabPage_Code
- 그리드 `grid` (buildGrid(), 체크박스):
  - kindGroupCode 200 "그룹코드" Text 편집:TextField
  - kindGroupName 280 "그룹설명" TextArea 편집:MyTextArea

#### 이벤트
[E1] retrieveButton[조회].Select (L100) → retrieve()
[E2] insertButton[등록].Select (L106) → insertRow()
[E3] updateButton[저장].Select (L112) → update()
[E4] deleteButton[삭제].Select (L118) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L181) → 서비스 sys.Sys13_CodeGroup.deleteAll
[E5] cancelButton[닫기].Select (L125) → hide()
[E6] grid.RowClick (L137) → 인라인 L137-142 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-90 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L92-144 | open | 상태 처리 | 업무 |
| public retrieve() | L158-167 | E1,open | 서비스 sys.Sys13_CodeGroup.selectByGroupCodeKind(codekindId) | 업무 |
| private insertRow() | L169-176 | E2 | 상태 처리 | 업무 |
| private deleteRow() | L178-199 | E4 | ConfirmBox → E7 | 업무 |
| private update() | L201-204 | E3 | 서비스 sys.Sys13_CodeGroup.update | 업무 |
| private buildGrid() | L146-156 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L206-208 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('kindGroupCd', 200, '그룹코드', { editor: 'text' }),  // L152
  gb.textArea('kindGroupNm', 280, '그룹설명', { editor: 'largeText' }),  // L153
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys13_TabPage_Code (`client/vi/sys/Sys13_TabPage_Code.java`, 250줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {companyName} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `companyName` LookupTriggerField, `lookup` Sys01_Lookup_SelectSingle, `openLookup` Sys09_Lookup_CodeKind
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - code 100 "코드" TextCenter
  - name 280 "코드명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-80) → setting()
[E1] companyName.TriggerClick [result != null] (L99) → retrieve()
[E2] retrieveButton[조회].Select (L118) → retrieve()
[E3] insertButton[등록].Select (L124) → insertRow()
[E4] updateButton[저장].Select (L130) → update()
[E5] deleteButton[삭제].Select (L136) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L189) → 서비스 sys.Sys13_CodeGroup.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L82-143 | 생성자 | 조회창 Sys01_Lookup_SelectSingle 열기 | 업무 |
| private insertRow() | L155-184 | E3 | 조회창 Sys09_Lookup_CodeKind 열기 | 업무 |
| private deleteRow() | L186-207 | E5 | ConfirmBox → E6 | 업무 |
| private update() | L209-228 | E4 | 서비스 sys.Sys13_CodeGroup.insert | 업무 |
| public retrieve() | L230-248 | E1,E2,update | 서비스 sys.Sys13_CodeGroup.selectByKindGroupCode(kindGroupCode, codeKindId, companyId) | 업무 |
| private buildGrid() | L145-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('code', 100, '코드'),  // L149 SQL 계산 컬럼(selectById: COALESCE(b.sys09_code, ''))
  gb.text('name', 280, '코드명'),  // L150 SQL 계산 컬럼(selectById: COALESCE(b.sys09_name, ''))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sys09_Grid_Code (`client/vi/sys/Sys09_Grid_Code.java`, 219줄)

- 툴바 `buttonBar`: 상세코드구분명: {detailCodeKindName} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `detailCodeKindName` TextField
- 그리드 `grid` (buildGrid()):
  - code 60 "코드" Text 편집:"0069B4"
  - name 150 "코드명" Text 편집:"0069B4"
  - seq 80 "조회순서" Text 편집:"0069B4"
  - closeYn 60 "미사용" Boolean
  - applyDate 100 "시작일자" Date 편집:"0069B4"
  - closeDate 100 "종료일자" Date 편집:MyDateField
  - note 300 "상세설명" TextArea 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L51-99) → 초기화
[E1] detailCodeKindName.KeyPress [Enter] (L55) → retrieve()
[E2] retrieveButton[조회].Select (L63) → retrieve()
[E3] insertButton[등록].Select (L69) → insertRow()
[E4] updateButton[저장].Select (L75) → update()
[E5] deleteButton[삭제].Select (L81) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L199) → 서비스 sys.Sys09_Code.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveCode() | L117-143 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveCode() | L145-157 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L159-167 | E1,E2,retrieveCode | 서비스 sys.Sys09_Code.selectByCodeKindId(codeKindId, companyId, searchText) | 업무 |
| public insertRow() | L169-186 | E3 | 상태 처리 | 업무 |
| public update() | L188-191 | E4 | 서비스 sys.Sys09_Code.update | 업무 |
| public deleteRow() | L193-214 | E5 | ConfirmBox → E6 | 업무 |
| private buildGrid() | L101-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L216-218 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('code', 60, '코드', { editor: 'text' }),  // L105
  gb.text('name', 150, '코드명', { editor: 'text' }),  // L106
  gb.text('seq', 80, '조회순서', { editor: 'text' }),  // L107
  gb.boolean('closeYn', 60, '미사용'),  // L108
  gb.date('applyDate', 100, '시작일자', { editor: 'date' }),  // L109
  gb.date('closeDate', 100, '종료일자', { editor: 'date' }),  // L110
  gb.textArea('note', 300, '상세설명', { editor: 'text' }),  // L111
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

