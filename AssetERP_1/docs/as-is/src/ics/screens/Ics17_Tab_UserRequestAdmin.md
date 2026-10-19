# Ics17_Tab_UserRequestAdmin

- 종류: 화면
- 메뉴: 기초자료 > 00. 내부통제 > 법규등록신청확인 (#1339)
- 파일: `client/vi/ics/Ics17_Tab_UserRequestAdmin.java`
- 함께 쓰는 클래스 3개:
  - `Ics17_Edit_UserRequestAdmin` `client/vi/ics/Ics17_Edit_UserRequestAdmin.java`
  - `Ics17_Lookup_LawContent` `client/vi/ics/Ics17_Lookup_LawContent.java`
  - `Ics17_Grid_FileList` `client/vi/ics/Ics17_Grid_FileList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics17_UserRequest.selectBySearchTextAdmin` | Ics17_Tab_UserRequestAdmin:236 | [`Ics17_UserRequest.java:51`](../../ics/services/Ics17_UserRequest.md) | [`ics17_user_request.selectBySearchTextAdmin`](../../ics/sql/ics17_user_request.md) |
| `ics.Ics17_UserRequest.update` | Ics17_Edit_UserRequestAdmin:292 | [`Ics17_UserRequest.java:84`](../../ics/services/Ics17_UserRequest.md) | `UpdateDataModel(ics17_user_request)` 동적 INSERT/UPDATE → [`ics17_user_request.selectById`](../../ics/sql/ics17_user_request.md) |
| `ics.Ics17_UserRequest.updateLawContent` | Ics17_Lookup_LawContent:85 | [`Ics17_UserRequest.java:73`](../../ics/services/Ics17_UserRequest.md) | [`ics17_user_request.updateLawContent`](../../ics/sql/ics17_user_request.md) |
| `sys.Sys00_Common.selectCompanyName` | Ics17_Tab_UserRequestAdmin:49 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |
| `sys.Sys10_File.selectByParentId` | Ics17_Grid_FileList:84 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Ics17_Grid_FileList:145 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ics17_user_request`](../../../db/tables/ics.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics17_Tab_UserRequestAdmin (`client/vi/ics/Ics17_Tab_UserRequestAdmin.java`, 258줄)

- 레이아웃: center=vlc, south=editBoard
- 툴바 `buttonBar`: 발생일: {startDate} ~: {closeDate} 회사명: {companyComboBox} 완료여부: {stateComboBox} 검색어: {searchText} {checkBox01} {confirmYnBox} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="요청자/법규명/법규내용", `startDate` MyDateField, `closeDate` MyDateField, `stateComboBox` ComboBoxField("AfterStateCode", "%", "전체"), `companyComboBox` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체"), `editBoard` Ics17_Edit_UserRequestAdmin, `checkBox01` CheckBox, `confirmYnBox` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "요청일" Date
  - companyName 150 "회사명" Text
  - personName 80 "요청자" Text
  - lawTitle 800 "법규명" Text
  - stateName 80 "진행상태" Text
  - closeDate 100 "완료일" Date
  - confirmYn 100 "확인" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L58-118) → settings(), retrieve()
[E1] grid.RowClick (L111) → retrieveEditPage()
[E2] searchText.KeyPress [Enter] (L137) → retrieve()
[E3] retrieveButton[조회].Select (L146) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L170-183 | E1,retrieve | 상태 처리 | 업무 |
| public retrieve() | L185-249 | 생성자,E2,E3 | 서비스 ics.Ics17_UserRequest.selectBySearchTextAdmin(startDate, closeDate, searchText, stateCode, confirmYn, completeYn, companyText) | 업무 |
| private settings() | L120-152 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, companyComboBox="전체"("sys.Sys00_Common.selectCompanyName"), stateComboBox="전체"("AfterStateCode"), checkBox01=true("미완료건만 보기"), confirmYnBox=true("미확인건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L154-168 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L251-253 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L255-257 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '요청일'),  // L159
  gb.text('companyNm', 150, '회사명'),  // L160 SQL 계산 컬럼(selectBySearchTextAdmin: sys01_company_nm)
  gb.text('personNm', 80, '요청자'),  // L161 SQL 계산 컬럼(selectBySearchTextAdmin: f_emp_kor_nm(ics17_person_id))
  gb.text('lawTitle', 800, '법규명'),  // L162
  gb.text('stateNm', 80, '진행상태'),  // L163 SQL 계산 컬럼(selectBySearchTextAdmin: f_cdnm('AfterStateCode', ics17_state_cd…)
  gb.date('closeDate', 100, '완료일'),  // L164
  gb.booleanYn('confirmYn', 100, '확인'),  // L165
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Ics17_Edit_UserRequestAdmin (`client/vi/ics/Ics17_Edit_UserRequestAdmin.java`, 340줄)

- 툴바 `toolBar`: {anchor}
- 입력·하위 화면: `lawContent` MyTextArea, `result` MyTextArea, `note` MyTextArea, `lawTitle` TextField, `submitTo` TextField, `relatedLaw` TextField, `reportCycle` TextField, `stateCode` TextField, `personName` TextField, `regDate` MyDateField, `closeDate` MyDateField, `confirmYn` CheckBox, `stateName` ComboBoxField("AfterStateCode"), `lookupContent` Ics17_Lookup_LawContent

#### 이벤트
[E0] 화면 열림 (생성자 L92-145) → buttonSetting(), getEditor(), show()
[E1] fileUpload.Change (L105) → 인라인 L105-112 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L115) → resetFileUpload()
[E3] uploadFileButton[파일등록].Select (L156) → 인라인 L156-161 (new SelectHandler() { @Override publi…)
[E4] updateButton[저장].Select (L162) → updateRow()
[E5] anchor.MouseDown (L176) → 인라인 L176-189 (new MouseDownHandler() { @Override pu…)
[E6] fileUpload.Change (L320) → 인라인 L320-327 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buttonSetting() | L147-168 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L170-267 | 생성자 | 조회창 Ics17_Lookup_LawContent 열기 | 업무 |
| public retrieve() | L269-280 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L282-302 | E4 | 서비스 ics.Ics17_UserRequest.update | 업무 |
| public init() | L304-306 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L309-311 | 공개 메서드 | 상태 처리 | 업무 |
| private resetFileUpload() | L313-328 | E2 | 상태 처리 | 업무 |
| private retrieveFile() | L330-333 | retrieve | 상태 처리 | 업무 |
| private setHtmlStyle() | L335-337 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L156-161 (new SelectHandler() { @Override publi…) */}>파일등록</Button>

### Ics17_Lookup_LawContent (`client/vi/ics/Ics17_Lookup_LawContent.java`, 102줄)

- 입력·하위 화면: `lawContent` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L58) → update()
[E2] closeButton[닫기].Select (L64) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-80 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L82-96 | E1 | 서비스 ics.Ics17_UserRequest.updateLawContent | 업무 |
| private setHtmlHeaderStyle() | L98-100 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics17_Grid_FileList (`client/vi/ics/Ics17_Grid_FileList.java`, 168줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L47-71) → 초기화
[E1] fileDeleteForm.SubmitComplete (L62) → retrieve()
[E2] messageBox.DialogHide [YES] (L112) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L73-75 | E1,checkFileDelete | 상태 처리 | 업무 |
| public retrieve() | L77-90 | E1,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private buildApprFileGrid() | L92-140 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| private checkFileDelete() | L142-167 | E2 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L134
  // ⚠ 대응 없음 (GridBuilder L135) addCell
  // ⚠ 대응 없음 (GridBuilder L136) addCell
  // ⚠ 대응 없음 (GridBuilder L137) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

