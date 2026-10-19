# Dbm01_Tab_TabComments

- 종류: 화면
- 메뉴: 관리자 > 09. 기타 > Table Spec,(Model)Properties (#1081)
- 파일: `client/vi/dbm/Dbm01_Tab_TabComments.java`
- 함께 쓰는 클래스 3개:
  - `Dbm02_TabPage_ColComments` `client/vi/dbm/Dbm02_TabPage_ColComments.java`
  - `Dbm02_PopupSourceGenerator` `client/vi/dbm/Dbm02_PopupSourceGenerator.java`
  - `Dbm01_Lookup_Tables` `client/vi/dbm/Dbm01_Lookup_Tables.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dbm.Dbm00_DDLRun.callByDDLRun` | Dbm01_Tab_TabComments:135 | [`Dbm00_DDLRun.java:18`](../../dbm/services/Dbm00_DDLRun.md) | [`dbm01_tab_comments.callByDDLRun`](../../dbm/sql/dbm01_tab_comments.md) |
| `dbm.Dbm01_TabComments.selectByTableName` | Dbm01_Lookup_Tables:134, Dbm01_Tab_TabComments:147 | [`Dbm01_TabComments.java:16`](../../dbm/services/Dbm01_TabComments.md) | [`dbm01_tab_comments.selectByTableName`](../../dbm/sql/dbm01_tab_comments.md) |
| `dbm.Dbm01_TabComments.update` | Dbm01_Tab_TabComments:157 | [`Dbm01_TabComments.java:35`](../../dbm/services/Dbm01_TabComments.md) | [`dbm01_tab_comments.callByDDLRun`](../../dbm/sql/dbm01_tab_comments.md) |
| `dbm.Dbm02_ColComments.selectByTableName` | Dbm02_TabPage_ColComments:154 | [`Dbm02_ColComments.java:17`](../../dbm/services/Dbm02_ColComments.md) | [`dbm02_col_comments.selectByTableName`](../../dbm/sql/dbm02_col_comments.md) |
| `dbm.Dbm02_ColComments.update` | Dbm02_TabPage_ColComments:159 | [`Dbm02_ColComments.java:32`](../../dbm/services/Dbm02_ColComments.md) | [`dbm01_tab_comments.callByDDLRun`](../../dbm/sql/dbm01_tab_comments.md) |
| `dbm.Dbm03_TabColumns.selectByGridBuilder` | Dbm02_TabPage_ColComments:194 | [`Dbm03_TabColumns.java:86`](../../dbm/services/Dbm03_TabColumns.md) | [`dbm03_tab_columns.selectByGridBuilder`](../../dbm/sql/dbm03_tab_columns.md) |
| `dbm.Dbm03_TabColumns.selectByModel` | Dbm02_TabPage_ColComments:174 | [`Dbm03_TabColumns.java:40`](../../dbm/services/Dbm03_TabColumns.md) | [`dbm03_tab_columns.selectByModel`](../../dbm/sql/dbm03_tab_columns.md) |
| `dbm.Dbm03_TabColumns.selectByProperties` | Dbm02_TabPage_ColComments:184 | [`Dbm03_TabColumns.java:63`](../../dbm/services/Dbm03_TabColumns.md) | [`dbm03_tab_columns.selectByProperties`](../../dbm/sql/dbm03_tab_columns.md) |
| `dbm.Dbm03_TabColumns.selectByXML` | Dbm02_TabPage_ColComments:164 | [`Dbm03_TabColumns.java:17`](../../dbm/services/Dbm03_TabColumns.md) | [`dbm03_tab_columns.selectByXML`](../../dbm/sql/dbm03_tab_columns.md) |

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dbm01_Tab_TabComments (`client/vi/dbm/Dbm01_Tab_TabComments.java`, 182줄)

- 레이아웃: north=searchBarBuilder.getSearchBar(), west=grid, center=colGrid
- 입력·하위 화면: `lookupTableField` LookupTriggerField 빈칸="전체", `colGrid` Dbm02_TabPage_ColComments, `lookupTable` Dbm01_Lookup_Tables
- 그리드 `grid` (buildGrid(), 체크박스):
  - tableName 160 "Table Name" Text
  - tableComments 250 "Comments" Text 편집:TextField
  - tableType 70 "Type" Text
  - tablespaceName 110 "Tablespace" Text

#### 이벤트
[E0] 화면 열림 (생성자 L41-86) → 초기화
[E1] lookupTableField[Table 찾기:].TriggerClick (L47) → openLookupTable()
[E2] searchBarBuilder[조회].Retrieve (L59) → retrieve()
[E3] searchBarBuilder[저장].Update (L60) → update()
[E4] grid.SelectionChanged [data != null] (L72) → 인라인 L72-82 (new SelectionChangedHandler<Dbm01_Tab…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openLookupTable() | L88-98 | E1 | 조회창 Dbm01_Lookup_Tables 열기 | 업무 |
| public execute() | L125-141 | openLookupTable | 서비스 dbm.Dbm00_DDLRun.callByDDLRun | 업무 |
| public retrieve() | L144-149 | E2,getServiceResult | 서비스 dbm.Dbm01_TabComments.selectByTableName(tableName) | 업무 |
| public update() | L152-158 | E3 | 서비스 dbm.Dbm01_TabComments.update | 업무 |
| public insertRow() | L161-162 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L165-166 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L169-179 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L100-123 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('tableName', 160, 'Table Name'),  // L105
  gb.text('comments', 250, 'Comments', { editor: 'text' }),  // L118
  gb.text('tableType', 70, 'Type'),  // L119
  gb.text('tablespaceName', 110, 'Tablespace'),  // L120
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

### Dbm02_TabPage_ColComments (`client/vi/dbm/Dbm02_TabPage_ColComments.java`, 206줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - columnName 250 "Column ID" Text
  - columnComment 300 "Comment" Text 편집:TextField
  - dataType 80 "Type" Text
  - nullAble 60 "Null" Text
  - columnLength 60 "Length" Text

#### 이벤트
[E0] 화면 열림 (생성자 L41-120) → 초기화
[E1] xmlGeneratorButton[XML].Select (L45) → popupXML()
[E2] modelGeneratorButton[Model].Select (L53) → popupModel()
[E3] modelPropertiesButton[Properties].Select (L61) → popupProperties()
[E4] gridBuilderButton[GridBuilder].Select (L69) → popupGridBuilder()
[E5] retrievePDFButton[Table Print].Select (L77) → 인라인 L77-84 (new SelectHandler() { @Override publi…)
[E6] retrievePDF2Button[Report Print].Select (L87) → 인라인 L87-94 (new SelectHandler() { @Override publi…)
[E7] retrieveRDButton[RD Print].Select (L97) → 인라인 L97-108 (new SelectHandler() { @Override publi…)
[E8] updateButton[Comment Save].Select (L111) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getServiceResult() | L137-148 | 공개 메서드 | 팝업 Dbm02_PopupSourceGenerator 열기 | 업무 |
| public retrieve() | L150-155 | 공개 메서드 | 서비스 dbm.Dbm02_ColComments.selectByTableName(tableName) | 업무 |
| public update() | L157-160 | E8 | 서비스 dbm.Dbm02_ColComments.update | 업무 |
| private popupXML() | L162-170 | E1 | 서비스 dbm.Dbm03_TabColumns.selectByXML | 업무 |
| private popupModel() | L172-180 | E2 | 서비스 dbm.Dbm03_TabColumns.selectByModel | 업무 |
| private popupProperties() | L182-190 | E3 | 서비스 dbm.Dbm03_TabColumns.selectByProperties | 업무 |
| private popupGridBuilder() | L192-201 | E4 | 서비스 dbm.Dbm03_TabColumns.selectByGridBuilder | 업무 |
| public buildGrid() | L122-134 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L203-205 | getServiceResult | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('ColumnName', 250, 'Column ID'),  // L127
  gb.text('ColumnComment', 300, 'Comment', { editor: 'text' }),  // L128
  gb.text('DataType', 80, 'Type'),  // L129
  gb.text('NullAble', 60, 'Null'),  // L130
  gb.text('ColumnLength', 60, 'Length'),  // L131
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={popupXML}>XML</Button>
2. <Button type="unknown" onClick={popupModel}>Model</Button>
3. <Button type="unknown" onClick={popupProperties}>Properties</Button>
4. <Button type="unknown" onClick={popupGridBuilder}>GridBuilder</Button>
5. <Button type="unknown" onClick={() => /* 인라인 L77-84 (new SelectHandler() { @Override publi…) */}>Table Print</Button>
6. <Button type="unknown" onClick={() => /* 인라인 L87-94 (new SelectHandler() { @Override publi…) */}>Report Print</Button>
7. <Button type="unknown" onClick={() => /* 인라인 L97-108 (new SelectHandler() { @Override publi…) */}>RD Print</Button>
8. <Button type="unknown" onClick={update}>Comment Save</Button>

### Dbm02_PopupSourceGenerator (`client/vi/dbm/Dbm02_PopupSourceGenerator.java`, 31줄)

- 입력·하위 화면: `textArea` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L14-29) → 초기화
[E1] closeButton[닫기].Select (L16) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Dbm01_Lookup_Tables (`client/vi/dbm/Dbm01_Lookup_Tables.java`, 166줄)

- 툴바 `searchBar`: {searchField} {retrieveButton}
- 입력·하위 화면: `TableNameText` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - tableName 160 "Table Name" Text
  - tableComments 250 "Comments" Text
  - tableType 90 "Table Type" Text
  - tablespaceName 110 "Tablespace Name" Text

#### 이벤트
[E1] TableNameText[Name].KeyPress [Enter] (L56) → retrieve()
[E2] retrieveButton[조회].Select (L68) → retrieve()
[E3] okButton[확인].Select (L82) → confirm()
[E4] cancelButton[취소].Select (L90) → hide()
[E5] grid.CellDoubleClick (L99) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-108 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L122-135 | E1,E2,open | 서비스 dbm.Dbm01_TabComments.selectByTableName(tableName) | 업무 |
| private confirm() | L137-149 | E3,E5 | 미선택 시 alert "조회할 Table을 선택하여 주세요" | 업무 |
| public getServiceResult() | L152-160 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L110-120 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L162-164 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('tableName', 160, 'Table Name'),  // L114
  gb.text('comments', 250, 'Comments'),  // L115
  gb.text('tableType', 90, 'Table Type'),  // L116
  gb.text('tablespaceName', 110, 'Tablespace Name'),  // L117
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

