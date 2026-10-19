# Dbm99_Tab_RDTest

- 종류: 화면
- 파일: `client/vi/dbm/Dbm99_Tab_RDTest.java`
- 함께 쓰는 클래스 1개:
  - `Dbm01_Lookup_Tables` `client/vi/dbm/Dbm01_Lookup_Tables.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dbm.Dbm01_TabComments.selectByTableName` | Dbm01_Lookup_Tables:134 | [`Dbm01_TabComments.java:16`](../../dbm/services/Dbm01_TabComments.md) | [`dbm01_tab_comments.selectByTableName`](../../dbm/sql/dbm01_tab_comments.md) |

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dbm99_Tab_RDTest (`client/vi/dbm/Dbm99_Tab_RDTest.java`, 105줄)

- 레이아웃: north=searchBarBuilder.getSearchBar(), center=rdLayoutContainer, center=rdLayoutContainer
- 입력·하위 화면: `lookupTableField` LookupTriggerField 빈칸="전체", `tableNameField` TextField, `lookupTable` Dbm01_Lookup_Tables

#### 이벤트
[E0] 화면 열림 (생성자 L33-55) → 초기화
[E1] lookupTableField[Table 찾기:].TriggerClick (L37) → openLookupTable()
[E2] searchBarBuilder[조회].Retrieve (L50) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setReportDesigner() | L57-77 | retrieve | 상태 처리 | 업무 |
| private openLookupTable() | L79-89 | E1 | 조회창 Dbm01_Lookup_Tables 열기 | 업무 |
| public retrieve() | L92-94 | E2 | 상태 처리 | 업무 |
| public update() | L96-97 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L99-100 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L102-103 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

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

