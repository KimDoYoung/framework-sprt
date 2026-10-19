# Sys90_Tab_AfterService

- 종류: 화면
- 메뉴: 커뮤니티 > 90. 기타 > 개선사항 및 오류 통보 (#1066)
- 파일: `client/vi/sys/Sys90_Tab_AfterService.java`
- 함께 쓰는 클래스 4개:
  - `Sys90_Edit_Board` `client/vi/sys/Sys90_Edit_Board.java`
  - `Sys90_Lookup_HappenRemedy` `client/vi/sys/Sys90_Lookup_HappenRemedy.java`
  - `Sys90_Lookup_HappenReason` `client/vi/sys/Sys90_Lookup_HappenReason.java`
  - `Sys90_Grid_ApprFile` `client/vi/sys/Sys90_Grid_ApprFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByParentId` | Sys90_Grid_ApprFile:83 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Sys90_Grid_ApprFile:143 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys90_AfterService.delete` | Sys90_Edit_Board:399 | [`Sys90_AfterService.java:279`](../../sys/services/Sys90_AfterService.md) | `UpdateDataModel(sys90_after_service)` 동적 DELETE |
| `sys.Sys90_AfterService.selectById` | Sys90_Edit_Board:360 | [`Sys90_AfterService.java:33`](../../sys/services/Sys90_AfterService.md) | [`sys90_after_service.selectById`](../../sys/sql/sys90_after_service.md) |
| `sys.Sys90_AfterService.selectBySearchText` | Sys90_Tab_AfterService:213 | [`Sys90_AfterService.java:96`](../../sys/services/Sys90_AfterService.md) | [`sys90_after_service.selectBySearchText`](../../sys/sql/sys90_after_service.md) |
| `sys.Sys90_AfterService.userUpdate` | Sys90_Edit_Board:345 | [`Sys90_AfterService.java:229`](../../sys/services/Sys90_AfterService.md) | [`sys90_after_service.userUpdate`](../../sys/sql/sys90_after_service.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys90_after_service`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys90_Tab_AfterService (`client/vi/sys/Sys90_Tab_AfterService.java`, 260줄)

- 레이아웃: center=vlc, south=editBoard
- 툴바 `buttonBar`: 발생일: {happenStartDate} ~: {happenEndDate} 구분: {typeNameComboBox} 완료여부: {afterStateComboBox} 검색어: {searchText} {confirmYnBox} {retrieveButton} {insertButton}
- 입력·하위 화면: `searchText` TextField 빈칸="요청자/개선 및 오류내용", `workerSearchText` TextField, `happenStartDate` MyDateField, `happenEndDate` MyDateField, `typeNameComboBox` ComboBoxField("AfterServiceCode", "%", "전체"), `afterStateComboBox` ComboBoxField("AfterStateCode", "%", "전체"), `editBoard` Sys90_Edit_Board, `confirmYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - happenDate 100 "발생일" Date
  - regEmpName 120 "요청자" Text
  - afterServiceName 60 "구분" Text
  - organizeHappenReason 900 "개선 및 오류내용" Text
  - afterStateName 80 "수행여부" Text
  - worker 120 "담당자" Text
  - dueDate 100 "완료예정일" Date
  - confirmYn 100 "확인" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L61-112) → settings(), retrieve()
[E1] grid.RowClick (L105) → retrieveEditPage()
[E2] searchText.KeyPress [Enter] (L129) → retrieve()
[E3] retrieveButton[조회].Select (L138) → retrieve()
[E4] insertButton[등록].Select (L144) → insertRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieveEditPage() | L169-182 | E1,retrieve,insertRow | 상태 처리 | 업무 |
| public retrieve() | L184-231 | 생성자,E2,E3 | 서비스 sys.Sys90_AfterService.selectBySearchText(happenStartDate, happenEndDate, typeYn, worker, searchText, stateCode, confirmYn, companyId, personId) | 업무 |
| public insertRow() | L233-251 | E4 | 상태 처리 | 업무 |
| private settings() | L114-150 | 생성자 | 이벤트 연결, 초기값: happenStartDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", happenEndDate=LoginUser.getToday(, typeNameComboBox="전체"("AfterServiceCode"), afterStateComboBox="전체"("AfterStateCode"), confirmYnBox=true("미확인건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L152-167 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L253-255 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L257-259 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('happenDate', 100, '발생일'),  // L157
  gb.text('regEmpNm', 120, '요청자'),  // L158
  gb.text('afterServiceNm', 60, '구분'),  // L159
  gb.text('organizeHappenReason', 900, '개선 및 오류내용'),  // L160 SQL 계산 컬럼(selectBySearchText: regexp_replace(regexp_replace(sys90_hap…)
  gb.text('afterStateNm', 80, '수행여부'),  // L161
  gb.text('worker', 120, '담당자'),  // L162
  gb.date('dueDate', 100, '완료예정일'),  // L163
  gb.booleanYn('confirmYn', 100, '확인'),  // L164
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>

### Sys90_Edit_Board (`client/vi/sys/Sys90_Edit_Board.java`, 505줄)

- 입력·하위 화면: `typeYn` TextField, `stateCode` TextField, `regEmpName` TextField, `afterServiceName` ComboBoxField("AfterServiceCode"), `afterStateName` ComboBoxField("AfterStateCode"), `happenReason` MyTextArea, `happenRemedy` MyTextArea, `remarks` MyTextArea, `worker` TextField, `happenDate` MyDateField, `dueDate` MyDateField, `confirmYn` CheckBox, `lookup` Sys90_Lookup_HappenReason

#### 이벤트
[E0] 화면 열림 (생성자 L120-176) → buttonSetting(), getEditor(), show()
[E1] fileUpload.Change (L136) → 인라인 L136-143 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L146) → resetFileUpload()
[E3] uploadFileButton[파일등록].Select (L186) → 인라인 L186-191 (new SelectHandler() { @Override publi…)
[E4] updateButton[저장].Select (L192) → updateRow()
[E5] deleteButton[삭제].Select (L198) → deleteRow()
       └ [E8] messageBox.DialogHide [YES] (L383) → delete()
[E6] anchor.MouseDown (L214) → 인라인 L214-225 (new MouseDownHandler() { @Override pu…)
[E7] anchor2.MouseDown (L231) → 인라인 L231-237 (new MouseDownHandler() { @Override pu…)
[E9] fileUpload.Change (L428) → 인라인 L428-435 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buttonSetting() | L178-204 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L206-309 | 생성자 | 조회창 Sys90_Lookup_HappenReason 열기, 조회창 Sys90_Lookup_HappenRemedy 열기 | 업무 |
| public retrieve() | L311-331 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L333-357 | E4 | 서비스 sys.Sys90_AfterService.userUpdate | 업무 |
| private updateEnd() | L359-373 | updateRow | 서비스 sys.Sys90_AfterService.selectById(boardId) | 업무 |
| public deleteRow() | L375-392 | E5 | ConfirmBox → E8 | 업무 |
| private delete() | L394-415 | E8 | 서비스 sys.Sys90_AfterService.delete | 업무 |
| public init() | L417-419 | delete | 상태 처리 | 업무 |
| private resetFileUpload() | L421-436 | E2 | 상태 처리 | 업무 |
| private retrieveApproval() | L438-441 | retrieve | 상태 처리 | 업무 |
| public setParent() | L443-445 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlStyle() | L447-449 | getEditor,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L451-453 | getEditor,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L186-191 (new SelectHandler() { @Override publi…) */}>파일등록</Button>

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

