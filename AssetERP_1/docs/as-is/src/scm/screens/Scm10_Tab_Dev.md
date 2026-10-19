# Scm10_Tab_Dev

- 종류: 화면
- 메뉴: KFS > 01. 시스템 개발 > 시스템 개발 (#1263)
- 파일: `client/vi/scm/Scm10_Tab_Dev.java`
- 함께 쓰는 클래스 13개:
  - `Scm11_Lookup_ResultMessage` `client/vi/scm/Scm11_Lookup_ResultMessage.java`
  - `Scm11_Grid_DevStep` `client/vi/scm/Scm11_Grid_DevStep.java`
  - `Scm11_Edit_DevStep` `client/vi/scm/Scm11_Edit_DevStep.java`
  - `Scm13_Lookup_MultiUpload` `client/vi/scm/Scm13_Lookup_MultiUpload.java`
  - `Scm13_Grid_DevProgram` `client/vi/scm/Scm13_Grid_DevProgram.java`
  - `Scm13_Edit_DevProgram` `client/vi/scm/Scm13_Edit_DevProgram.java`
  - `Scm11_Lookup_Result` `client/vi/scm/Scm11_Lookup_Result.java`
  - `Scm11_Grid_ApprFile` `client/vi/scm/Scm11_Grid_ApprFile.java`
  - `Scm03_Lookup_ExpectProgram` `client/vi/scm/Scm03_Lookup_ExpectProgram.java`
  - `Scm10_Lookup_Note` `client/vi/scm/Scm10_Lookup_Note.java`
  - `Scm01_Lookup_Detail` `client/vi/scm/Scm01_Lookup_Detail.java`
  - `Scm01_Lookup_SrContent` `client/vi/scm/Scm01_Lookup_SrContent.java`
  - `Scm01_Grid_ApprFile` `client/vi/scm/Scm01_Grid_ApprFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys10_Lookup_FileViewer_AView`](../../sys/components/Sys10_Lookup_FileViewer_AView.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Scm13_Edit_DevProgram:105 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `scm.Scm01_Sr.getSrModel` | Scm10_Tab_Dev:226, Scm11_Edit_DevStep:220 | [`Scm01_Sr.java:72`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.getSrModel`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.updateContent` | Scm01_Lookup_SrContent:136 | [`Scm01_Sr.java:96`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.updateContent`](../../scm/sql/scm01_sr.md) |
| `scm.Scm03_ExpectProgram.selectBySrId` | Scm03_Lookup_ExpectProgram:91 | [`Scm03_ExpectProgram.java:23`](../../scm/services/Scm03_ExpectProgram.md) | [`scm03_expect_program.selectBySrId`](../../scm/sql/scm03_expect_program.md) |
| `scm.Scm10_Dev.selectByText` | Scm10_Tab_Dev:344 | [`Scm10_Dev.java:27`](../../scm/services/Scm10_Dev.md) | [`scm10_dev.selectByText`](../../scm/sql/scm10_dev.md) |
| `scm.Scm11_DevStep.checkMyTurn` | Scm11_Edit_DevStep:195 | [`Scm11_DevStep.java:79`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.checkMyTurn`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.modelUpdate` | Scm11_Edit_DevStep:447 | [`Scm11_DevStep.java:166`](../../scm/services/Scm11_DevStep.md) | [`scm10_dev.updateDate`](../../scm/sql/scm10_dev.md), [`scm11_dev_step.updateResultDate`](../../scm/sql/scm11_dev_step.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE → [`scm11_dev_step.selectById`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.selectByDevId` | Scm11_Grid_DevStep:46 | [`Scm11_DevStep.java:26`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.selectByDevId`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.updateResult` | Scm11_Lookup_Result:128 | [`Scm11_DevStep.java:147`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.updateResult`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.updateStatus` | Scm11_Edit_DevStep:424 | [`Scm11_DevStep.java:96`](../../scm/services/Scm11_DevStep.md) | [`scm10_dev.updateDate`](../../scm/sql/scm10_dev.md), [`scm11_dev_step.checkMyTurn`](../../scm/sql/scm11_dev_step.md), [`scm11_dev_step.updateDevStatusCode`](../../scm/sql/scm11_dev_step.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE → [`scm11_dev_step.selectById`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm13_DevProgram.delete` | Scm13_Grid_DevProgram:91 | [`Scm13_DevProgram.java:142`](../../scm/services/Scm13_DevProgram.md) | `UpdateDataModel(scm13_dev_program)` 동적 DELETE |
| `scm.Scm13_DevProgram.modelUpdate` | Scm13_Edit_DevProgram:377 | [`Scm13_DevProgram.java:37`](../../scm/services/Scm13_DevProgram.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`scm30_program.selectByProgramCode`](../../scm/sql/scm30_program.md), [`scm30_program.updateRegDate`](../../scm/sql/scm30_program.md), `UpdateDataModel(scm13_dev_program)` 동적 INSERT/UPDATE → [`scm13_dev_program.selectById`](../../scm/sql/scm13_dev_program.md), `UpdateDataModel(scm30_program)` 동적 INSERT/UPDATE → [`scm30_program.selectById`](../../scm/sql/scm30_program.md) |
| `scm.Scm13_DevProgram.selectByDevId` | Scm13_Grid_DevProgram:44 | [`Scm13_DevProgram.java:27`](../../scm/services/Scm13_DevProgram.md) | [`scm13_dev_program.selectByDevId`](../../scm/sql/scm13_dev_program.md) |
| `scm.Scm30_Program.updateUseYn` | Scm13_Grid_DevProgram:81 | [`Scm30_Program.java:77`](../../scm/services/Scm30_Program.md) | [`scm30_program.updateUseYn`](../../scm/sql/scm30_program.md) |
| `sys.Sys00_Common.selectDevStatus` | Scm10_Tab_Dev:68 | [`Sys00_Common.java:126`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectDevStatus`](../../sys/sql/sys00_common.md) |
| `sys.Sys10_File.selectByDevId` | Scm11_Grid_ApprFile:80 | [`Sys10_File.java:63`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByDevId`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByParentId` | Scm01_Grid_ApprFile:80, Scm13_Edit_DevProgram:239, Scm13_Edit_DevProgram:344 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`scm01_sr`](../../../db/tables/scm.md), [`scm03_expect_program`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Scm10_Tab_Dev (`client/vi/scm/Scm10_Tab_Dev.java`, 377줄)

- 레이아웃: north=vlc, center=hlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 시스템: {systemComboBox} 상태: {devStatusComboBox} {checkBox01} 검색: {searchText} {retrieveButton} {checkBoxMyDev}
- 입력·하위 화면: `searchText` TextField 빈칸="요청자/개발내용/개발자/진행상태/SR번호/결과상세/비고", `startDate` MyDateField, `closeDate` MyDateField, `systemComboBox` ComboBoxField("SystemCode", "%", "전체"), `devStatusComboBox` CommonComboBoxField("sys.Sys00_Common.selectDevStatus", "%", "전체"), `editBoard` Scm11_Edit_DevStep, `checkBox01` CheckBox, `checkBoxMyDev` CheckBox, `lookup` Scm10_Lookup_Note
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "등록일" Date
  - systemName 120 "시스템구분" TextCenter
  - requestor 150 "요청자" Text
  - actionCell 70 "개발의뢰<br>상세보기" Cell 편집:actionCell03
  - arrangeNote 650 "개발내용" Text
  - actionCell 50 "" Cell 편집:actionCell01
  - personName 100 "개발자" TextCenter
  - startDate 100 "시작일" Date
  - dueDate 100 "완료예정일" Date
  - resultDate 100 "완료일" Date
  - devStepResult 100 "진행상태" TextCenter
  - srNo 100 "SR번호" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L78-133) → settings()
[E1] grid.SelectionChanged (L127) → retrieveEditPage()
[E2] systemComboBox[SystemCode].Collapse (L152) → retrieve()
[E3] devStatusComboBox[sys.Sys00_Common.selectDevStatus].Collapse (L160) → retrieve()
[E4] searchText.KeyPress [Enter] (L175) → retrieve()
[E5] retrieveButton[조회].Select (L183) → retrieve()
[E6] grid.CellDoubleClick [colIndex == 13] (L190) → 인라인 L190-200 (new CellDoubleClickHandler() { @Overr…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L262-317 | E1,retrieve | 조회창 Scm11_Lookup_ResultMessage 열기 | 업무 |
| public retrieve() | L319-358 | E2,E3,E4,E5,settings,retrieveEditPage | 서비스 scm.Scm10_Dev.selectByText(startDate, closeDate, searchText, systemCode, devStatus, checkBox01, checkBoxMyDev, personId) | 업무 |
| private settings() | L135-203 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, checkBox01=true("미완료건만 보기"), checkBoxMyDev=true("내 개발건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L205-260 | 필드 초기화 | 조회창 Scm10_Lookup_Note 열기, 조회창 Scm01_Lookup_Detail 열기, 서비스 scm.Scm01_Sr.getSrModel(devId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L360-362 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L364-366 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L245
  gb.textCenter('systemNm', 120, '시스템구분'),  // L246
  gb.text('requestor', 150, '요청자'),  // L247
  // ⚠ 대응 없음 (GridBuilder L248) addCell
  gb.text('arrangeNote', 650, '개발내용'),  // L249
  // ⚠ 대응 없음 (GridBuilder L250) addCell
  gb.textCenter('personNm', 100, '개발자'),  // L251
  gb.date('startDate', 100, '시작일'),  // L252
  gb.date('dueDate', 100, '완료예정일'),  // L253
  gb.date('resultDate', 100, '완료일'),  // L254
  gb.textCenter('devStepResult', 100, '진행상태'),  // L255
  gb.textCenter('srNo', 100, 'SR번호'),  // L257
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Scm11_Lookup_ResultMessage (`client/vi/scm/Scm11_Lookup_ResultMessage.java`, 79줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-47) → 초기화
[E1] closeButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setMessage() | L49-69 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L71-73 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm11_Grid_DevStep (`client/vi/scm/Scm11_Grid_DevStep.java`, 87줄)

- 그리드 `grid` (buildApprStepGrid()):
  - devStepName 60 "구분" TextNotSort
  - personName 80 "담당자" TextNotSort
  - resultDateStr 140 "확인일시" TextNotSort
  - resultName 60 "결과" TextNotSort

#### 이벤트
[E0] 화면 열림 (생성자 L23-33) → 초기화
[E1] grid.RowClick (L27) → 인라인 L27-32 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L35-39 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L41-67 | 미사용 후보 | 서비스 scm.Scm11_DevStep.selectByDevId(devId) | 업무 |
| private buildApprStepGrid() | L69-78 | 필드 초기화 | 상태 처리 | 업무 |
| public getGrid() | L80-82 | 공개 메서드 | 상태 처리 | 업무 |
| public clear() | L84-86 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L72) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L73) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L74) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L75) addTextNotSort
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Scm11_Edit_DevStep (`client/vi/scm/Scm11_Edit_DevStep.java`, 508줄)

- 입력·하위 화면: `devStatusName` TextField, `result` MyTextArea, `note` MyTextArea, `startDate` MyDateField, `dueDate` MyDateField, `lookup` Scm13_Edit_DevProgram

#### 이벤트
[E0] 화면 열림 (생성자 L98-147) → settings(), getEditor(), show()
[E1] fileUpload.Change (L108) → 인라인 L108-115 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L118) → resetFileUpload()
[E3] updateButton13[등록].Select [devStepModel == null] (L157) → 메시지 "상단 개발내용을 먼저 선택해주세요"
[E4] allUpdateButton13[파일일괄등록].Select [devStepModel == null] (L174) → 메시지 "상단 개발내용을 먼저 선택해주세요"
[E5] deleteButton13[삭제].Select [result.getStatus() > 0] (L190) → getServiceResult()
[E6] listButton13[예상목록].Select [devStepModel == null] (L213) → getServiceResult()
[E7] code20Button[진행중].Select (L236) → updateStatus()
[E8] code90Button[완료].Select (L242) → updateStatus()
[E9] code10Button[이행불가].Select (L248) → updateStatus()
[E10] uploadFileButton[파일업로드].Select [devStepModel == null] (L254) → 메시지 "상단 개발내용을 먼저 선택해주세요"
[E11] updateButton[저장].Select (L265) → updateRow()
[E12] anchor.MouseDown (L296) → 인라인 L296-310 (new MouseDownHandler() { @Override pu…)
[E13] fileUpload.Change (L480) → 인라인 L480-487 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L273-358 | 생성자 | 조회창 Scm11_Lookup_Result 열기 | 업무 |
| public retrieve() | L360-381 | 공개 메서드 | 상태 처리 | 업무 |
| private editerEnable() | L383-394 | retrieve | 상태 처리 | 업무 |
| public readOnly() | L396-417 | 공개 메서드 | 상태 처리 | 업무 |
| private updateStatus() | L419-441 | E7,E8,E9 | 서비스 scm.Scm11_DevStep.updateStatus(startDate, dueDate) | 업무 |
| public updateRow() | L443-459 | E11 | 서비스 scm.Scm11_DevStep.modelUpdate(startDate, dueDate) | 업무 |
| public init() | L461-466 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveApproval() | L468-471 | retrieve | 상태 처리 | 업무 |
| private resetFileUpload() | L473-488 | E2 | 상태 처리 | 업무 |
| public getServiceResult() | L491-493 | E5,E6,updateStatus,updateRow | 상태 처리 | 업무 |
| private settings() | L149-271 | 생성자 | 팝업 Scm13_Edit_DevProgram 열기, 조회창 Scm13_Lookup_MultiUpload 열기, 조회창 Scm03_Lookup_ExpectProgram 열기, 서비스 scm.Scm11_DevStep.checkMyTurn, scm.Scm01_Sr.getSrModel(devId, devStepId, devId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L495-497 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="register" onClick={() => /* 메시지 "상단 개발내용을 먼저 선택해주세요" */}>등록</Button>
3. <Button type="register" onClick={() => /* 메시지 "상단 개발내용을 먼저 선택해주세요" */}>파일일괄등록</Button>
4. <Button type="delete" onClick={getServiceResult}>삭제</Button>
5. <Button type="assign" onClick={getServiceResult}>예상목록</Button>
6. <Button type="upload" onClick={() => /* 메시지 "상단 개발내용을 먼저 선택해주세요" */}>파일업로드</Button>
7. <Button type="unknown" onClick={updateStatus}>진행중</Button>
8. <Button type="unknown" onClick={updateStatus}>완료</Button>
9. <Button type="unknown" onClick={updateStatus}>이행불가</Button>

### Scm13_Lookup_MultiUpload (`client/vi/scm/Scm13_Lookup_MultiUpload.java`, 152줄)

- 입력·하위 화면: `systemName` ComboBoxField("SystemCode"), `programTypeName` ComboBoxField("ProgramType") 빈칸="선택", `deployTgtYn` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L54-95) → settings(), show()
[E1] fileUpload.Change (L65) → 인라인 L65-77 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L81) → hide()
[E3] updateButton[업로드].Select (L98) → uploadChk()
[E4] closeButton[닫기].Select (L104) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L46-52 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L112-134 | insert | 상태 처리 | 업무 |
| public uploadChk() | L136-143 | E3 | 상태 처리 | 업무 |
| private settings() | L97-110 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L145-147 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L149-151 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={uploadChk}>업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm13_Grid_DevProgram (`client/vi/scm/Scm13_Grid_DevProgram.java`, 108줄)

- 입력·하위 화면: `lookup` Scm13_Edit_DevProgram
- 그리드 `grid` (buildApprStepGrid()):
  - programTypeName 100 "구분" Text
  - programCode 310 "프로그램ID" Text
  - deploySeq 60 "배포순서" Long
  - actionCell 30 "소스" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L31-34) → 초기화
[E1] msgBox.DialogHide [YES] (L74) → 서비스 scm.Scm30_Program.updateUseYn, scm.Scm13_DevProgram.delete(programId, useYn)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L36-39 | buildApprStepGrid | 상태 처리 | 업무 |
| public retrieve() | L41-45 | buildApprStepGrid | 서비스 scm.Scm13_DevProgram.selectByDevId(devId) | 업무 |
| private buildApprStepGrid() | L47-69 | 필드 초기화 | 팝업 Scm13_Edit_DevProgram 열기 | 업무 |
| public deleteRow() | L71-103 | 공개 메서드 | 확인창 표시, GridDeleteData scm.Scm30_Program.updateUseYn, scm.Scm13_DevProgram.delete(체크된 행 목록) | 업무 |
| public clear() | L105-107 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  gb.text('programTypeNm', 100, '구분'),  // L62
  gb.text('programCd', 310, '프로그램ID'),  // L63
  gb.long('deploySeq', 60, '배포순서'),  // L65
  // ⚠ 대응 없음 (GridBuilder L66) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Scm13_Edit_DevProgram (`client/vi/scm/Scm13_Edit_DevProgram.java`, 439줄)

- 입력·하위 화면: `version` LongField 빈칸="(자동생성)", `programCode` TextField, `programName` TextField 빈칸="미입력시 전버전의 프로그램명으로 등록됩니다.", `regDateStr` TextField, `fileName` TextField, `systemCode` TextField, `programType` TextField, `systemName` ComboBoxField("SystemCode"), `programTypeName` ComboBoxField("ProgramType"), `source` MyTextArea, `note` MyTextArea, `deployTgtYn` CheckBox, `deploySeq` LongField

#### 이벤트
[E0] 화면 열림 (생성자 L170-218) → settings(), getEditor(), show()
[E1] fileUpload.Change (L183) → 인라인 L183-190 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L193) → resetFileUpload(), fileRetrieve()
[E3] fileDeleteForm.SubmitComplete (L200) → 인라인 L200-205 (new SubmitCompleteHandler() { @Overri…)
[E4] uploadButton[파일업로드].Select [result.getStatus() <= 0] (L235) → 서비스 sys.Sys10_File.selectByParentId, 메시지 "이미 업로드된 파일이 있습니다."
[E5] downloadButton[다운로드].Select (L256) → fileDownload()
[E6] deleteButton[삭제].Select (L262) → fileDelete()
[E7] updateButton[저장].Select (L268) → update()
[E8] closeButton[닫기].Select (L274) → hide()
[E9] fileUpload.Change (L422) → 인라인 L422-429 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L98-123 | 공개 메서드 | 상태 처리 | 업무 |
| private init() | L125-130 | insert | 상태 처리 | 업무 |
| public edit() | L132-147 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L149-168 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L282-341 | 생성자 | 상태 처리 | 업무 |
| private fileRetrieve() | L343-359 | E2,edit,open | 서비스 sys.Sys10_File.selectByParentId | 업무 |
| private update() | L361-395 | E7 | 서비스 scm.Scm13_DevProgram.modelUpdate(companyId, personId, systemCode, programType, programCode, versionCode) | 업무 |
| private fileDownload() | L397-404 | E5 | 상태 처리 | 업무 |
| private fileDelete() | L406-413 | E6 | 상태 처리 | 업무 |
| private resetFileUpload() | L415-430 | E2 | 상태 처리 | 업무 |
| private settings() | L220-280 | 생성자 | 서비스 sys.Sys10_File.selectByParentId, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L432-434 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L436-438 | insert,edit,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 서비스 sys.Sys10_File.selectByParentId, 메시지 "이미 업로드된 파일이 있습니다." */}>파일업로드</Button>
2. <Button type="download" onClick={fileDownload}>다운로드</Button>
3. <Button type="delete" onClick={fileDelete}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm11_Lookup_Result (`client/vi/scm/Scm11_Lookup_Result.java`, 159줄)


#### 이벤트
[E0] 화면 열림 (생성자 L49-57) → 초기화
[E1] closeButton[닫기].Select (L76) → hide()
[E2] confirmButton[확인].Select (L106) → update()
[E3] closeButton[닫기].Select (L112) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-86 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L88-122 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L124-139 | E2 | 서비스 scm.Scm11_DevStep.updateResult | 업무 |
| private setHtmlHeaderStyle() | L141-143 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={update}>확인</Button>

### Scm11_Grid_ApprFile (`client/vi/scm/Scm11_Grid_ApprFile.java`, 153줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer_AView
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L43-67) → 초기화
[E1] fileDeleteForm.SubmitComplete (L58) → retrieve()
[E2] messageBox.DialogHide [YES] (L108) → 인라인 L108-119 (new DialogHideHandler() { @Override p…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L69-71 | E1 | 상태 처리 | 업무 |
| public retrieve() | L73-86 | E1 | 서비스 sys.Sys10_File.selectByDevId(devId) | 업무 |
| private buildApprFileGrid() | L88-140 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer_AView 열기, 확인창 표시 | 업무 |
| public hideButton() | L142-148 | 공개 메서드 | 상태 처리 | 업무 |
| public clear() | L150-152 | 공개 메서드 | 상태 처리 | 업무 |

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

### Scm03_Lookup_ExpectProgram (`client/vi/scm/Scm03_Lookup_ExpectProgram.java`, 102줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - programTypeName 80 "구분" Text
  - programCode 200 "프로그램코드" Text
  - programName 200 "프로그램명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L39-71) → show()
[E1] retrieveButton[새로고침].Select (L46) → retrieve()
[E2] cancelButton[닫기].Select (L52) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L34-37 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L85-97 | E1,open | 서비스 scm.Scm03_ExpectProgram.selectBySrId(srId) | 업무 |
| private buildGrid() | L73-83 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L99-101 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('programTypeNm', 80, '구분'),  // L78 SQL 계산 컬럼(selectBySrId: f_cdnm('ProgramType', scm30_program_typ…)
  gb.text('programCd', 200, '프로그램코드'),  // L79 SQL 계산 컬럼(selectBySrId: scm30_program_cd)
  gb.text('programNm', 200, '프로그램명'),  // L80 SQL 계산 컬럼(selectBySrId: scm30_program_nm)
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm10_Lookup_Note (`client/vi/scm/Scm10_Lookup_Note.java`, 168줄)


#### 이벤트
[E0] 화면 열림 (생성자 L50-58) → 초기화
[E1] updateButton[확인].Select (L135) → hide()
[E2] closeButton[닫기].Select (L142) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-94 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L96-132 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L134-148 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L150-152 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={hide}>확인</Button>

### Scm01_Lookup_Detail (`client/vi/scm/Scm01_Lookup_Detail.java`, 198줄)

- 입력·하위 화면: `systemName` TextField, `srTypeName` TextField, `requestor` TextField, `corpName` TextField, `personName` TextField, `srDate` MyDateField, `lookup` Scm01_Lookup_SrContent

#### 이벤트
[E0] 화면 열림 (생성자 L70-102) → settings(), getEditor(), show()
[E1] cancelButton[닫기].Select (L117) → hide()
[E2] anchor.MouseDown (L128) → 인라인 L128-134 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L65-68 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L125-175 | 생성자 | 조회창 Scm01_Lookup_SrContent 열기 | 업무 |
| public retrieve() | L177-180 | open | 상태 처리 | 업무 |
| private settings() | L105-123 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L182-184 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L186-188 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm01_Lookup_SrContent (`client/vi/scm/Scm01_Lookup_SrContent.java`, 172줄)

- 입력·하위 화면: `resultContent` MyTextArea

#### 이벤트
[E1] closeButton[닫기].Select (L76) → hide()
[E2] confirmButton[확인].Select (L111) → update()
[E3] closeButton[닫기].Select (L117) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-86 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L88-130 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L132-147 | E2 | 서비스 scm.Scm01_Sr.updateContent | 업무 |
| private setHtmlHeaderStyle() | L150-152 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={update}>확인</Button>

### Scm01_Grid_ApprFile (`client/vi/scm/Scm01_Grid_ApprFile.java`, 154줄)

- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer_AView
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L43-67) → 초기화
[E1] fileDeleteForm.SubmitComplete (L58) → retrieve()
[E2] messageBox.DialogHide [YES] (L108) → 인라인 L108-119 (new DialogHideHandler() { @Override p…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L69-71 | E1 | 상태 처리 | 업무 |
| public retrieve() | L73-86 | E1 | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private buildApprFileGrid() | L88-141 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer_AView 열기, 확인창 표시 | 업무 |
| public hideButton() | L143-149 | 공개 메서드 | 상태 처리 | 업무 |
| public clear() | L151-153 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L135
  // ⚠ 대응 없음 (GridBuilder L136) addCell
  // ⚠ 대응 없음 (GridBuilder L137) addCell
  // ⚠ 대응 없음 (GridBuilder L138) addCell
];
```

#### 사용된 버튼들
버튼 사용하지 않음

