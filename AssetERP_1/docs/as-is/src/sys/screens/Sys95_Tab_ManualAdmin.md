# Sys95_Tab_ManualAdmin

- 종류: 화면
- 메뉴: 관리자 > 09. 기타 > AssetERP 매뉴얼 등록 (#1298)
- 파일: `client/vi/sys/Sys95_Tab_ManualAdmin.java`
- 함께 쓰는 클래스 1개:
  - `Sys95_PDFViewer` `client/vi/sys/Sys95_PDFViewer.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys09_Lookup_Code`](../../sys/components/Sys09_Lookup_Code.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys11_RelateFile.checkFileDelete` | Sys95_Tab_ManualAdmin:336 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys95_Manual.delete` | Sys95_Tab_ManualAdmin:358 | [`Sys95_Manual.java:54`](../../sys/services/Sys95_Manual.md) | `UpdateDataModel(sys95_manual)` 동적 DELETE |
| `sys.Sys95_Manual.selectByText` | Sys95_Tab_ManualAdmin:286 | [`Sys95_Manual.java:34`](../../sys/services/Sys95_Manual.md) | [`sys95_manual.selectByText`](../../sys/sql/sys95_manual.md) |
| `sys.Sys95_Manual.update` | Sys95_Tab_ManualAdmin:311 | [`Sys95_Manual.java:49`](../../sys/services/Sys95_Manual.md) | `UpdateDataModel(sys95_manual)` 동적 INSERT/UPDATE → [`sys95_manual.selectById`](../../sys/sql/sys95_manual.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys95_manual`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys95_Tab_ManualAdmin (`client/vi/sys/Sys95_Tab_ManualAdmin.java`, 377줄)

- 레이아웃: west=vlc, center=viewer, center=blc
- 툴바 `buttonBar`: 분류: {typeComboBox} {searchTextField} {retrieveButton} {updateButton} {uploadButton} {addTypeButton} {fileUploadForm}
- 입력·하위 화면: `searchTextField` TextField 빈칸="검색어(파일명/비고) 입력", `typeComboBox` ComboBoxField("ManualType", "%", "전체", "전체"), `typeCombo` ComboBoxField("ManualType"), `lookupCode` Sys09_Lookup_Code
- 그리드 `grid` (buildGrid()):
  - regDate 90 "등록일" Date
  - manualTypeName 100 "분류" Text 편집:typeCombo
  - fileName 300 "파일명" Text
  - publicYn 50 "공개" Boolean
  - note 250 "비고" Text 편집:TextField
  - actionCell 30 "" Cell 편집:downloadCell
  - actionCell 30 "" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L81-157) → settings(), retrieve()
[E1] fileUpload.Change (L89) → 인라인 L89-98 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L101) → resetFileUpload(), retrieve()
[E3] fileDeleteForm.SubmitComplete (L112) → retrieve()
[E4] typeComboBox[ManualType].Collapse (L161) → retrieve()
[E5] searchTextField.KeyPress [Enter] (L170) → retrieve()
[E6] retrieveButton[조회].Select (L178) → retrieve()
[E7] updateButton[저장].Select (L184) → update()
[E8] uploadButton[파일업로드].Select (L190) → 메시지 "분류를 선택한 후, 파일을 업로드해 주세요."
[E9] addTypeButton[분류추가].Select (L200) → lookupType()
[E10] grid.CellClick (L207) → 인라인 L207-219 (new CellClickHandler() { @Override pu…)
[E11] msgBox.DialogHide [YES] (L240) → checkFileDelete()
[E12] typeCombo[ManualType].Collapse (L260) → 인라인 L260-266 (new CollapseHandler() { @Override pub…)
[E13] fileUpload.Change (L321) → 인라인 L321-330 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L63-66 | buildGrid,retrieve,lookupType | 상태 처리 | 업무 |
| public retrieve() | L280-307 | 생성자,E2,E3,E4,E5,E6,execute,checkFileDelete | 서비스 sys.Sys95_Manual.selectByText(manualType, searchText, publicCheck) | 업무 |
| public update() | L309-312 | E7 | 서비스 sys.Sys95_Manual.update | 업무 |
| private resetFileUpload() | L314-331 | E2 | 상태 처리 | 업무 |
| private checkFileDelete() | L333-362 | E11 | GridDeleteData sys.Sys11_RelateFile.checkFileDelete, sys.Sys95_Manual.delete(체크된 행 목록) | 업무 |
| private lookupType() | L364-372 | E9 | 조회창 Sys09_Lookup_Code 열기 | 업무 |
| private settings() | L159-220 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L222-278 | 필드 초기화 | 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L374-376 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L269
  gb.text('manualTypeNm', 100, '분류'),  // L270 SQL 계산 컬럼(selectByText: f_cdnm('ManualType', sys95_manual_type,…)
  gb.text('fileNm', 300, '파일명'),  // L271 SQL 계산 컬럼(selectByText: sys10_file_nm)
  gb.boolean('publicYn', 50, '공개'),  // L272
  gb.text('note', 250, '비고', { editor: 'text' }),  // L273
  // ⚠ 대응 없음 (GridBuilder L274) addCell
  // ⚠ 대응 없음 (GridBuilder L275) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="upload" onClick={() => /* 메시지 "분류를 선택한 후, 파일을 업로드해 주세요." */}>파일업로드</Button>
4. <Button type="addRow" onClick={lookupType}>분류추가</Button>

### Sys95_PDFViewer (`client/vi/sys/Sys95_PDFViewer.java`, 69줄)


#### 이벤트
[E0] 화면 열림 (생성자 L24-28) → show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L30-32 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L34-68 | view | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

