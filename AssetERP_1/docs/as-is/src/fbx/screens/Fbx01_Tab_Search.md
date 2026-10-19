# Fbx01_Tab_Search

- 종류: 화면
- 메뉴: 문서작성 > 03. 파일 및 양식관리 > 파일조회 (#1122)
- 파일: `client/vi/fbx/Fbx01_Tab_Search.java`
- 함께 쓰는 클래스 2개:
  - `Fbx02_Popup_History` `client/vi/fbx/Fbx02_Popup_History.java`
  - `Fbx01_Grid_DocList` `client/vi/fbx/Fbx01_Grid_DocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fbx.Fbx01_Box.delete` | Fbx01_Tab_Search:204 | [`Fbx01_Box.java:64`](../../fbx/services/Fbx01_Box.md) | `UpdateDataModel(fbx01_box)` 동적 DELETE |
| `fbx.Fbx01_Box.selectByCompanyId` | Fbx01_Tab_Search:163 | [`Fbx01_Box.java:30`](../../fbx/services/Fbx01_Box.md) | [`fbx01_box.selectByCompanyId`](../../fbx/sql/fbx01_box.md) |
| `fbx.Fbx01_Box.update` | Fbx01_Tab_Search:176 | [`Fbx01_Box.java:59`](../../fbx/services/Fbx01_Box.md) | `UpdateDataModel(fbx01_box)` 동적 INSERT/UPDATE → [`fbx01_box.selectById`](../../fbx/sql/fbx01_box.md) |
| `fbx.Fbx02_History.selectByBoxId` | Fbx02_Popup_History:63 | [`Fbx02_History.java:28`](../../fbx/services/Fbx02_History.md) | [`fbx02_history.selectByBoxId`](../../fbx/sql/fbx02_history.md) |
| `fbx.Fbx03_File.selectByBoxId` | Fbx01_Grid_DocList:191 | [`Fbx03_File.java:124`](../../fbx/services/Fbx03_File.md) | [`fbx03_file.selectByBoxId`](../../fbx/sql/fbx03_file.md) |
| `sys.Sys10_File.selectByParentId` | Fbx01_Grid_DocList:126 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`fbx01_box`](../../../db/tables/fbx.md), [`fbx02_history`](../../../db/tables/fbx.md), [`fbx03_file`](../../../db/tables/fbx.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fbx01_Tab_Search (`client/vi/fbx/Fbx01_Tab_Search.java`, 222줄)

- 레이아웃: north=vlc, center=hlc
- 툴바 `buttonBar`: 제목: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="", `statusComboBox` ComboBoxField("FbxBoxStatus"), `popup` Fbx02_Popup_History
- 그리드 `grid` (buildGrid(), 체크박스):
  - crtDate 100 "등록일" Date
  - statusName 80 "상태" TextCenter
  - title 550 "제목" Text
  - note 450 "비고" Text
  - fileCount 80 "파일갯수" Long
  - actionCell 80 "기록" Cell 편집:HistoryCell

#### 이벤트
[E0] 화면 열림 (생성자 L55-58) → retrieve(), init()
[E1] searchText.KeyPress [Enter] (L62) → retrieve()
[E2] retrieveButton[조회].Select (L71) → retrieve()
[E3] grid.CellClick (L90) → retrieveDocList()
[E4] statusComboBox[FbxBoxStatus].Collapse (L127) → 인라인 L127-133 (new CollapseHandler() { @Override pub…)
[E5] msgBox.DialogHide [YES] (L199) → 서비스 fbx.Fbx01_Box.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L60-119 | 생성자 | 상태 처리 | 업무 |
| private retrieveDocList() | L154-157 | E3 | 상태 처리 | 업무 |
| public retrieve() | L159-172 | 생성자,E1,E2 | 서비스 fbx.Fbx01_Box.selectByCompanyId(companyId, searchText) | 업무 |
| public update() | L174-177 | 공개 메서드 | 서비스 fbx.Fbx01_Box.update | 업무 |
| public insertRow() | L179-190 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L192-217 | 공개 메서드 | 확인창 표시, GridDeleteData fbx.Fbx01_Box.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L121-152 | 필드 초기화 | 팝업 Fbx02_Popup_History 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L219-221 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('crtDate', 100, '등록일'),  // L144
  gb.textCenter('statusNm', 80, '상태'),  // L145
  gb.text('title', 550, '제목'),  // L146
  gb.text('note', 450, '비고'),  // L147
  gb.long('fileCount', 80, '파일갯수'),  // L148
  // ⚠ 대응 없음 (GridBuilder L149) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

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

### Fbx01_Grid_DocList (`client/vi/fbx/Fbx01_Grid_DocList.java`, 202줄)

- 툴바 `buttonBar`: 문서분류/파일명: {fileName} 등록자: {regEmpName} {retrieveButton} {fileDownloadForm}
- 입력·하위 화면: `fileName` TextField, `regEmpName` TextField, `viewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid(), 체크박스):
  - crtDate 100 "등록일" Date
  - dcrClassName 600 "문서분류" Text
  - fileName 400 "파일명" Text
  - empName 100 "등록자" TextCenter
  - actionCell 80 "미리보기" Cell 편집:viewCell
  - actionCell 80 "파일받기" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L50-107) → 초기화
[E1] fileName.KeyPress [Enter] (L79) → retrieve()
[E2] regEmpName.KeyPress [Enter] (L87) → retrieve()
[E3] retrieveButton[검색].Select (L95) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L161-197 | E1,E2,E3 | 서비스 fbx.Fbx03_File.selectByBoxId(boxId, orgId, empId, companyId, fileName, regEmpName) | 업무 |
| public buildGrid() | L109-159 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 서비스 sys.Sys10_File.selectByParentId(parentId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L199-201 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('crtDate', 100, '등록일'),  // L151
  gb.text('dcrClassNm', 600, '문서분류'),  // L152 SQL 계산 컬럼(selectByBoxId: f_class_tree_nm_allpath(a.fbx03_dcr_cla…)
  gb.text('fileNm', 400, '파일명'),  // L153
  gb.textCenter('empNm', 100, '등록자'),  // L154 SQL 계산 컬럼(selectByBoxId: f_emp_kor_nm(a.fbx03_emp_id))
  // ⚠ 대응 없음 (GridBuilder L155) addCell
  // ⚠ 대응 없음 (GridBuilder L156) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>

