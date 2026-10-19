# Tdm43_Tab_RelateFormFileUpload

- 종류: 화면
- 메뉴: 책무 > 90. 책무관리현황 > 이행점검 연관양식 등록 (#1481)
- 파일: `client/vi/tdm/Tdm43_Tab_RelateFormFileUpload.java`
- 함께 쓰는 클래스 1개:
  - `Tdm43_Lookup_RelateFormFileMultiUpload` `client/vi/tdm/Tdm43_Lookup_RelateFormFileMultiUpload.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.getTdmCheckFormFile` | Tdm43_Tab_RelateFormFileUpload:223 | [`Sys10_File.java:92`](../../sys/services/Sys10_File.md) | [`sys10_file.getTdmCheckFormFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.update` | Tdm43_Tab_RelateFormFileUpload:238 | [`Sys10_File.java:363`](../../sys/services/Sys10_File.md) | `UpdateDataModel(sys10_file)` 동적 INSERT/UPDATE → [`sys10_file.selectById`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Tdm43_Tab_RelateFormFileUpload:249 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm43_Tab_RelateFormFileUpload (`client/vi/tdm/Tdm43_Tab_RelateFormFileUpload.java`, 285줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 구분: {typeComboBox} 검색: {searchText} {retrieveButton} {updateButton} {fileUploadButton} {fileDownloadForm} {fileDeleteForm}
- 입력·하위 화면: `typeComboBox` ComboBoxField("TdmCheckFormType", "%", "전체", "전체"), `searchText` TextField 빈칸="파일명/비고", `formTypeComboBox` ComboBoxField("TdmCheckFormType"), `lookupViewer` Sys10_Lookup_FileViewer, `Lookup` Tdm43_Lookup_RelateFormFileMultiUpload
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - tdmCheckFormTypeName 200 "구분" Text 편집:formTypeComboBox
  - fileName 500 "파일명" Text
  - note 200 "비고" Text 편집:TextField
  - regDate 100 "등록일" Date
  - actionCell 50 "받기" CellFix 편집:downloadCell
  - actionCell 50 "삭제" CellFix 편집:deleteCell
  - actionCell 50 "보기" CellFix 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L71-116) → settings(), show(), retrieve()
[E1] fileDeleteForm.SubmitComplete (L76) → retrieve()
[E2] fileUploadButton[파일업로드].Select (L82) → fileMultiUpload()
[E3] typeComboBox[TdmCheckFormType].Collapse (L120) → retrieve()
[E4] searchText.KeyPress [Enter] (L128) → retrieve()
[E5] retrieveButton[조회].Select (L136) → retrieve()
[E6] updateButton[저장].Select (L142) → update()
[E7] formTypeComboBox[TdmCheckFormType].ValueChange (L154) → 인라인 L154-161 (new ValueChangeHandler<String>() { @O…)
[E8] msgBox.DialogHide [YES] (L177) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L60-63 | buildApprFileGrid,retrieve,update,fileMultiUpload | 상태 처리 | 업무 |
| private buildApprFileGrid() | L150-213 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| private retrieve() | L215-229 | 생성자,E1,E3,E4,E5,execute,update,checkFileDelete,fileMultiUpload | 서비스 sys.Sys10_File.getTdmCheckFormFile(companyId, tdmCheckFormType, searchText) | 업무 |
| private update() | L231-244 | E6 | 서비스 sys.Sys10_File.update | 업무 |
| private checkFileDelete() | L246-271 | E8 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public fileMultiUpload() | L273-280 | E2 | 조회창 Tdm43_Lookup_RelateFormFileMultiUpload 열기 | 업무 |
| private settings() | L118-148 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L282-284 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('tdmCheckFormTypeNm', 200, '구분', { editor: 'select' }),  // L204 SQL 계산 컬럼(getTdmCheckFormFile: f_cdnm('TdmCheckFormType', sys10_tdm_ch…)
  gb.text('fileNm', 500, '파일명'),  // L205
  gb.text('note', 200, '비고', { editor: 'text' }),  // L206
  gb.date('regDate', 100, '등록일'),  // L207
  // ⚠ 대응 없음 (GridBuilder L208) addCellFix
  // ⚠ 대응 없음 (GridBuilder L209) addCellFix
  // ⚠ 대응 없음 (GridBuilder L210) addCellFix
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="upload" onClick={fileMultiUpload}>파일업로드</Button>

### Tdm43_Lookup_RelateFormFileMultiUpload (`client/vi/tdm/Tdm43_Lookup_RelateFormFileMultiUpload.java`, 150줄)

- 입력·하위 화면: `typeComboBox` ComboBoxField("TdmCheckFormType") 빈칸="선택하세요", `note` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L47-111) → show()
[E1] fileUpload.Change [note.getText() == null] (L59) → 인라인 L59-79 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L84) → hide()
[E3] updateButton[업로드].Select (L93) → uploadChk()
[E4] closeButton[닫기].Select (L99) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L42-45 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L113-131 | open | 상태 처리 | 업무 |
| public uploadChk() | L133-139 | E3 | 상태 처리 | 업무 |
| private setHtmlStyle() | L142-144 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L146-148 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={uploadChk}>업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

