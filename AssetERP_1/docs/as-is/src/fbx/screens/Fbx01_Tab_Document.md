# Fbx01_Tab_Document

- 종류: 화면
- 메뉴: 문서작성 > 03. 파일 및 양식관리 > 파일등록 (#1116)
- 파일: `client/vi/fbx/Fbx01_Tab_Document.java`
- 함께 쓰는 클래스 2개:
  - `Fbx02_Popup_History` `client/vi/fbx/Fbx02_Popup_History.java`
  - `Fbx01_TabPage_DocList` `client/vi/fbx/Fbx01_TabPage_DocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Fbx01_Tab_Document:319 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `fbx.Fbx01_Box.delete` | Fbx01_Tab_Document:393 | [`Fbx01_Box.java:64`](../../fbx/services/Fbx01_Box.md) | `UpdateDataModel(fbx01_box)` 동적 DELETE |
| `fbx.Fbx01_Box.selectByCompanyId` | Fbx01_Tab_Document:352 | [`Fbx01_Box.java:30`](../../fbx/services/Fbx01_Box.md) | [`fbx01_box.selectByCompanyId`](../../fbx/sql/fbx01_box.md) |
| `fbx.Fbx01_Box.update` | Fbx01_Tab_Document:365 | [`Fbx01_Box.java:59`](../../fbx/services/Fbx01_Box.md) | `UpdateDataModel(fbx01_box)` 동적 INSERT/UPDATE → [`fbx01_box.selectById`](../../fbx/sql/fbx01_box.md) |
| `fbx.Fbx02_History.selectByBoxId` | Fbx02_Popup_History:63 | [`Fbx02_History.java:28`](../../fbx/services/Fbx02_History.md) | [`fbx02_history.selectByBoxId`](../../fbx/sql/fbx02_history.md) |
| `fbx.Fbx03_File.selectByOrgAuth` | Fbx01_TabPage_DocList:215 | [`Fbx03_File.java:106`](../../fbx/services/Fbx03_File.md) | [`fbx03_file.selectByOrgAuth`](../../fbx/sql/fbx03_file.md) |
| `sys.Sys10_File.selectByParentId` | Fbx01_TabPage_DocList:138 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx02_history`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fbx01_Tab_Document (`client/vi/fbx/Fbx01_Tab_Document.java`, 434줄)

- 레이아웃: north=vlc, center=hlc
- 툴바 `buttonBar`: 제목: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `treeSearchBar`: 문서분류: {docSearch} {searchButton} {expandAll} {collapseAll}
- 입력·하위 화면: `docSearch` TextField, `docList` Fbx01_TabPage_DocList, `searchText` TextField 빈칸="", `statusComboBox` ComboBoxField("FbxBoxStatus"), `popup` Fbx02_Popup_History
- 그리드 `grid` (buildGrid(), 체크박스):
  - crtDate 100 "등록일" Date 편집:MyDateField
  - statusName 80 "상태" TextCenter 편집:statusComboBox
  - title 550 "제목" Text 편집:TextField
  - note 450 "비고" Text 편집:TextField
  - fileCount 80 "파일갯수" Long
  - actionCell 80 "기록" Cell 편집:HistoryCell

#### 이벤트
[E0] 화면 열림 (생성자 L82-85) → retrieve(), init()
[E1] searchText.KeyPress [Enter] (L89) → retrieve()
[E2] retrieveButton[조회].Select (L98) → retrieve()
[E3] insertButton[등록].Select (L104) → insertRow()
[E4] updateButton[저장].Select (L110) → update()
[E5] deleteButton[삭제].Select (L116) → deleteRow()
       └ [E13] msgBox.DialogHide [YES] (L388) → 서비스 fbx.Fbx01_Box.delete
[E6] expandAll[+].Select (L122) → 인라인 L122-127 (new SelectHandler(){ @Override public…)
[E7] collapseAll[-].Select (L129) → 인라인 L129-134 (new SelectHandler(){ @Override public…)
[E8] grid.SelectionChanged [선택>0] (L151) → retrieveDocTree()
[E9] tree.Selection (L160) → retrieveDocList()
[E10] docSearch.KeyPress [Enter] (L186) → search()
[E11] searchButton[찾기].Select (L194) → search()
[E12] statusComboBox[FbxBoxStatus].Collapse (L233) → 인라인 L233-239 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L87-225 | 생성자 | 상태 처리 | 업무 |
| package getMenuTree() | L260-296 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L298-307 | getServiceResult | 상태 처리 | 업무 |
| private retrieveDocList() | L309-316 | E9 | 상태 처리 | 업무 |
| public retrieveDocTree() | L318-330 | E8 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| public getServiceResult() | L333-346 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L348-361 | 생성자,E1,E2 | 서비스 fbx.Fbx01_Box.selectByCompanyId(companyId, searchText) | 업무 |
| public update() | L363-366 | E4 | 서비스 fbx.Fbx01_Box.update | 업무 |
| public insertRow() | L368-379 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L381-406 | E5 | ConfirmBox → E13 | 업무 |
| private search() | L409-429 | E10,E11 | 상태 처리 | 업무 |
| public buildGrid() | L227-258 | 필드 초기화 | 팝업 Fbx02_Popup_History 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L431-433 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('crtDate', 100, '등록일', { editor: 'date' }),  // L250
  gb.textCenter('statusNm', 80, '상태', { editor: 'select' }),  // L251
  gb.text('title', 550, '제목', { editor: 'text' }),  // L252
  gb.text('note', 450, '비고', { editor: 'text' }),  // L253
  gb.long('fileCount', 80, '파일갯수'),  // L254
  // ⚠ 대응 없음 (GridBuilder L255) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="search" onClick={search}>찾기</Button>
6. <Button type="plus" onClick={() => /* 인라인 L122-127 (new SelectHandler(){ @Override public…) */}>+</Button>
7. <Button type="minus" onClick={() => /* 인라인 L129-134 (new SelectHandler(){ @Override public…) */}>-</Button>

### Fbx02_Popup_History (`client/vi/fbx/Fbx02_Popup_History.java`, 80줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - actDate 150 "일자" DateTime
  - actName 80 "동작" TextCenter
  - actContent 320 "내용" Text
  - actEmpName 100 "생성자" Text
  - actOrgName 100 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L27-44) → show()
[E1] closeButton[닫기].Select (L34) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L59-69 | open | 서비스 fbx.Fbx02_History.selectByBoxId(companyId, boxId) | 업무 |
| public open() | L71-75 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L46-57 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L77-79 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.dateTime('actDate', 150, '일자'),  // L50
  gb.textCenter('actNm', 80, '동작'),  // L51 SQL 계산 컬럼(selectByBoxId: f_cdnm('FbxHistoryAct', b.fbx02_act_cd,…)
  gb.text('actContent', 320, '내용'),  // L52
  gb.text('actEmpNm', 100, '생성자'),  // L53 SQL 계산 컬럼(selectByBoxId: f_emp_kor_nm(b.fbx02_act_emp_id))
  gb.text('actOrgNm', 100, '부서'),  // L54 SQL 계산 컬럼(selectByBoxId: f_org_nm(b.fbx02_act_org_code_id, b.fbx…)
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Fbx01_TabPage_DocList (`client/vi/fbx/Fbx01_TabPage_DocList.java`, 255줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스):
  - crtDate 100 "등록일" Date
  - dcrClassName 500 "문서분류" Text
  - fileName 300 "파일명" Text
  - empName 100 "등록자" TextCenter
  - actionCell 80 "미리보기" Cell 편집:viewCell
  - actionCell 80 "파일받기" Cell 편집:downloadCell
  - actionCell 80 "파일삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L55-119) → 초기화
[E1] fileDeleteForm.SubmitComplete (L64) → retrieve()
[E2] uploadFileButton[파일업로드].Select (L70) → 인라인 L70-79 (new SelectHandler() { @Override publi…)
[E3] fileUpload.Change (L81) → 인라인 L81-94 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L99) → resetFileUpload(), retrieve()
[E5] messageBox.DialogHide [YES] (L169) → 인라인 L169-184 (new DialogHideHandler() { @Override p…)
[E6] fileUpload.Change (L230) → 인라인 L230-244 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L204-221 | E1,E4 | 서비스 fbx.Fbx03_File.selectByOrgAuth(dcrClassId, boxId, orgId, empId, companyId) | 업무 |
| private resetFileUpload() | L223-245 | E4 | 상태 처리 | 업무 |
| public setDcrTypeCode() | L247-249 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L121-202 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, 서비스 sys.Sys10_File.selectByParentId(parentId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('crtDate', 100, '등록일'),  // L193
  gb.text('dcrClassNm', 500, '문서분류'),  // L194 SQL 계산 컬럼(selectByOrgAuth: f_class_tree_nm_allpath(a.fbx03_dcr_cla…)
  gb.text('fileNm', 300, '파일명'),  // L195
  gb.textCenter('empNm', 100, '등록자'),  // L196 SQL 계산 컬럼(selectByOrgAuth: f_emp_kor_nm(a.fbx03_emp_id))
  // ⚠ 대응 없음 (GridBuilder L197) addCell
  // ⚠ 대응 없음 (GridBuilder L198) addCell
  // ⚠ 대응 없음 (GridBuilder L199) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L70-79 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

