# Sys90_Tab_AfterServiceAdmin

- 종류: 화면
- 메뉴: 관리자 > 02. 시스템관리 > 개선사항 및 오류 통보 (#1121)
- 파일: `client/vi/sys/Sys90_Tab_AfterServiceAdmin.java`
- 함께 쓰는 클래스 6개:
  - `Sys90_Edit_BoardAdmin` `client/vi/sys/Sys90_Edit_BoardAdmin.java`
  - `Sys90_Lookup_Remarks` `client/vi/sys/Sys90_Lookup_Remarks.java`
  - `Sys90_Lookup_HappenRemedy` `client/vi/sys/Sys90_Lookup_HappenRemedy.java`
  - `Sys90_Lookup_HappenReason` `client/vi/sys/Sys90_Lookup_HappenReason.java`
  - `Sys90_Grid_ApprFile` `client/vi/sys/Sys90_Grid_ApprFile.java`
  - `Sys10_Lookup_ListFileViewer` `client/vi/sys/Sys10_Lookup_ListFileViewer.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectCompanyName` | Sys90_Tab_AfterServiceAdmin:50 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |
| `sys.Sys10_File.fileRandomCopy` | Sys10_Lookup_ListFileViewer:260 | [`Sys10_File.java:262`](../../sys/services/Sys10_File.md) | - |
| `sys.Sys10_File.selectByParentId` | Sys10_Lookup_ListFileViewer:243, Sys90_Grid_ApprFile:83 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Sys10_Lookup_ListFileViewer:325, Sys90_Grid_ApprFile:143 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys90_AfterService.adminUpdate` | Sys90_Edit_BoardAdmin:381 | [`Sys90_AfterService.java:248`](../../sys/services/Sys90_AfterService.md) | [`sys90_after_service.adminUpdate`](../../sys/sql/sys90_after_service.md) |
| `sys.Sys90_AfterService.delete` | Sys90_Edit_BoardAdmin:431 | [`Sys90_AfterService.java:279`](../../sys/services/Sys90_AfterService.md) | `UpdateDataModel(sys90_after_service)` 동적 DELETE |
| `sys.Sys90_AfterService.selectById` | Sys90_Edit_BoardAdmin:397 | [`Sys90_AfterService.java:33`](../../sys/services/Sys90_AfterService.md) | [`sys90_after_service.selectById`](../../sys/sql/sys90_after_service.md) |
| `sys.Sys90_AfterService.updateRemarks` | Sys90_Lookup_Remarks:77 | [`Sys90_AfterService.java:218`](../../sys/services/Sys90_AfterService.md) | [`sys90_after_service.updateRemarks`](../../sys/sql/sys90_after_service.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys90_after_service`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys90_Tab_AfterServiceAdmin (`client/vi/sys/Sys90_Tab_AfterServiceAdmin.java`, 250줄)

- 레이아웃: center=vlc, south=editBoard
- 툴바 `buttonBar`: 발생일: {happenStartDate} ~: {happenEndDate} 회사명: {companyComboBox} 구분: {typeNameComboBox} 완료여부: {afterStateComboBox} 검색어: {searchText} {checkBox01} {confirmYnBox} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="요청자/개선 및 오류내용/담당자", `workerSearchText` TextField, `happenStartDate` MyDateField, `happenEndDate` MyDateField, `companyComboBox` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체"), `typeNameComboBox` ComboBoxField("AfterServiceCode", "%", "전체"), `afterStateComboBox` ComboBoxField("AfterStateCode", "%", "전체"), `editBoard` Sys90_Edit_BoardAdmin, `checkBox01` CheckBox, `confirmYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - companyName 150 "회사명" Text
  - happenDate 100 "발생일" Date
  - regEmpName 80 "요청자" Text
  - afterServiceName 80 "구분" Text
  - organizeHappenReason 700 "개선 및 오류내용" Text
  - afterStateName 80 "수행여부" Text
  - worker 120 "담당자" Text
  - dueDate 100 "완료예정일" Date
  - confirmYn 100 "고객사 확인" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L62-117) → settings(), retrieve()
[E1] grid.RowClick (L110) → retrieveEditPage()
[E2] searchText.KeyPress [Enter] (L138) → retrieve()
[E3] retrieveButton[조회].Select (L147) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveEditPage() | L173-186 | E1,retrieve | 상태 처리 | 업무 |
| public retrieve() | L188-241 | 생성자,E2,E3 | 상태 처리 | 업무 |
| private settings() | L119-153 | 생성자 | 이벤트 연결, 초기값: happenStartDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", happenEndDate=LoginUser.getToday(, companyComboBox="전체"("sys.Sys00_Common.selectCompanyName"), typeNameComboBox="전체"("AfterServiceCode"), afterStateComboBox="전체"("AfterStateCode"), checkBox01=true("미완료건만 보기"), confirmYnBox=true("미확인건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L155-171 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L243-245 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L247-249 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 150, '회사명'),  // L160 SQL 계산 컬럼(selectById: b.sys01_company_nm)
  gb.date('happenDate', 100, '발생일'),  // L161
  gb.text('regEmpNm', 80, '요청자'),  // L162
  gb.text('afterServiceNm', 80, '구분'),  // L163
  gb.text('organizeHappenReason', 700, '개선 및 오류내용'),  // L164 SQL 계산 컬럼(selectById: regexp_replace(regexp_replace(sys90_hap…)
  gb.text('afterStateNm', 80, '수행여부'),  // L165
  gb.text('worker', 120, '담당자'),  // L166
  gb.date('dueDate', 100, '완료예정일'),  // L167
  gb.booleanYn('confirmYn', 100, '고객사 확인'),  // L168
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys90_Edit_BoardAdmin (`client/vi/sys/Sys90_Edit_BoardAdmin.java`, 542줄)

- 입력·하위 화면: `typeYn` TextField, `stateCode` TextField, `regEmpName` TextField, `afterServiceName` ComboBoxField("AfterServiceCode"), `afterStateName` ComboBoxField("AfterStateCode"), `happenReason` MyTextArea, `happenRemedy` MyTextArea, `remarks` MyTextArea, `worker` TextField, `happenDate` MyDateField, `dueDate` MyDateField, `confirmYn` CheckBox, `lookup` Sys90_Lookup_HappenReason, `lookupRemarks` Sys90_Lookup_Remarks, `lookupFileViewer` Sys10_Lookup_ListFileViewer

#### 이벤트
[E0] 화면 열림 (생성자 L120-177) → buttonSetting(), getEditor(), show()
[E1] fileUpload.Change (L135) → 인라인 L135-142 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L145) → resetFileUpload()
[E3] uploadFileButton[파일등록].Select (L185) → 인라인 L185-190 (new SelectHandler() { @Override publi…)
[E4] fileViewButton[파일관리].Select (L191) → fileViewLookup()
[E5] updateButton[저장].Select (L197) → updateRow()
[E6] deleteButton[삭제].Select (L203) → deleteRow()
       └ [E11] messageBox.DialogHide [YES] (L415) → delete()
[E7] confirmYn[확인여부].Change [confirmYn.getValue()] (L209) → 메시지 "변경불가"
[E8] anchor3.MouseDown (L230) → 인라인 L230-236 (new MouseDownHandler() { @Override pu…)
[E9] anchor.MouseDown (L278) → 인라인 L278-289 (new MouseDownHandler() { @Override pu…)
[E10] anchor2.MouseDown (L293) → 인라인 L293-306 (new MouseDownHandler() { @Override pu…)
[E12] fileUpload.Change (L476) → 인라인 L476-483 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buttonSetting() | L179-220 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L222-353 | 생성자 | 조회창 Sys90_Lookup_HappenReason 열기, 조회창 Sys90_Lookup_HappenRemedy 열기, 조회창 Sys90_Lookup_Remarks 열기 | 업무 |
| public retrieve() | L355-372 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L374-394 | E5 | 서비스 sys.Sys90_AfterService.adminUpdate | 업무 |
| private updateEnd() | L396-410 | updateRow | 서비스 sys.Sys90_AfterService.selectById(boardId) | 업무 |
| public deleteRow() | L412-424 | E6 | ConfirmBox → E11 | 업무 |
| private delete() | L426-448 | E11 | 서비스 sys.Sys90_AfterService.delete | 업무 |
| public init() | L450-452 | delete | 상태 처리 | 업무 |
| private retrieveApproval() | L454-457 | retrieve | 상태 처리 | 업무 |
| private fileViewLookup() | L459-467 | E4 | 조회창 Sys10_Lookup_ListFileViewer 열기 | 업무 |
| private resetFileUpload() | L469-484 | E2 | 상태 처리 | 업무 |
| public setParent() | L486-488 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L490-492 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L185-190 (new SelectHandler() { @Override publi…) */}>파일등록</Button>
3. <Button type="unknown" onClick={fileViewLookup}>파일관리</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sys90_Lookup_Remarks (`client/vi/sys/Sys90_Lookup_Remarks.java`, 94줄)

- 입력·하위 화면: `remarks` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L55) → update()
[E2] closeButton[닫기].Select (L61) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-72 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L74-88 | E1 | 서비스 sys.Sys90_AfterService.updateRemarks | 업무 |
| private setHtmlHeaderStyle() | L90-92 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys90_Lookup_HappenRemedy (`client/vi/sys/Sys90_Lookup_HappenRemedy.java`, 142줄)

- 입력·하위 화면: `resultContent` MyTextArea

#### 이벤트
[E1] closeButton[닫기].Select (L67) → hide()
[E2] confirmButton[확인].Select (L101) → hide()
[E3] closeButton[닫기].Select (L108) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-77 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L79-118 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L120-122 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={hide}>확인</Button>

### Sys90_Lookup_HappenReason (`client/vi/sys/Sys90_Lookup_HappenReason.java`, 142줄)

- 입력·하위 화면: `resultContent` MyTextArea

#### 이벤트
[E1] closeButton[닫기].Select (L67) → hide()
[E2] confirmButton[확인].Select (L101) → hide()
[E3] closeButton[닫기].Select (L108) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-77 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L79-118 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L120-122 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={hide}>확인</Button>

### Sys90_Grid_ApprFile (`client/vi/sys/Sys90_Grid_ApprFile.java`, 166줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L46-70) → 초기화
[E1] fileDeleteForm.SubmitComplete (L61) → retrieve()
[E2] messageBox.DialogHide [YES] (L111) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L72-74 | E1,checkFileDelete | 상태 처리 | 업무 |
| public retrieve() | L76-89 | E1,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private buildApprFileGrid() | L91-138 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| private checkFileDelete() | L140-165 | E2 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L133
  // ⚠ 대응 없음 (GridBuilder L134) addCell
  // ⚠ 대응 없음 (GridBuilder L135) addCell
  // ⚠ 대응 없음 (GridBuilder L136) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Sys10_Lookup_ListFileViewer (`client/vi/sys/Sys10_Lookup_ListFileViewer.java`, 352줄)

- 레이아웃: west=vlc, center=cp
- 툴바 `buttonBar`: {uploadButton}
- 그리드 `grid` (buildGrid()):
  - fileName 300 "파일명" Text
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell
  - viewerYn 50 "" Boolean
  - fileType 70 "" Text
  - viewerPath 500 "" Text

#### 이벤트
[E0] 화면 열림 (생성자 L78-84) → settings()
[E1] closeButton[닫기].Select (L87) → hide()
[E2] grid.CellClick (L95) → viewerOpen()
[E3] uploadButton[파일업로드].Select (L107) → 인라인 L107-112 (new SelectHandler() { @Override publi…)
[E4] fileUpload.Change (L119) → 인라인 L119-126 (new ChangeHandler() { @Override publi…)
[E5] fileUploadForm.SubmitComplete (L129) → resetFileUpload(), retrieve()
[E6] fileDeleteForm.SubmitComplete (L146) → retrieve()
[E7] msgBox.DialogHide [YES] (L205) → checkFileDelete()
[E8] fileUpload.Change (L312) → 인라인 L312-319 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L103-186 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L236-252 | E5,E6,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private fileRandomCopy() | L254-277 | retrieve | 서비스 sys.Sys10_File.fileRandomCopy(devYn, devYn) | 업무 |
| private viewerOpen() | L279-303 | E2 | LabelHtml 래퍼 | 업무 |
| private resetFileUpload() | L305-320 | E5 | 상태 처리 | 업무 |
| private checkFileDelete() | L322-347 | E7 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private settings() | L86-101 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L188-234 | 필드 초기화 | 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L349-351 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 300, '파일명'),  // L226
  // ⚠ 대응 없음 (GridBuilder L227) addCell
  // ⚠ 대응 없음 (GridBuilder L228) addCell
  // ⚠DB없음 L229 viewerYn 50 "" (sys10_viewer_yn 컬럼 없음)
  // ⚠DB없음 L230 fileType 70 "" (sys10_file_type 컬럼 없음)
  // ⚠DB없음 L231 viewerPath 500 "" (sys10_viewer_path 컬럼 없음)
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L107-112 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

