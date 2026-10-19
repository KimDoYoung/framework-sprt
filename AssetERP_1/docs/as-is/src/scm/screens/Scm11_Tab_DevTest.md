# Scm11_Tab_DevTest

- 종류: 화면
- 메뉴: KFS > 01. 시스템 개발 > 시스템 QA/UAT (#1264)
- 파일: `client/vi/scm/Scm11_Tab_DevTest.java`
- 함께 쓰는 클래스 8개:
  - `Scm11_Lookup_DevStep` `client/vi/scm/Scm11_Lookup_DevStep.java`
  - `Scm11_Lookup_Result` `client/vi/scm/Scm11_Lookup_Result.java`
  - `Scm11_Lookup_DevNote` `client/vi/scm/Scm11_Lookup_DevNote.java`
  - `Scm11_Edit_DevStepTest` `client/vi/scm/Scm11_Edit_DevStepTest.java`
  - `Scm11_Grid_ApprFile` `client/vi/scm/Scm11_Grid_ApprFile.java`
  - `Scm01_Lookup_Detail` `client/vi/scm/Scm01_Lookup_Detail.java`
  - `Scm01_Lookup_SrContent` `client/vi/scm/Scm01_Lookup_SrContent.java`
  - `Scm01_Grid_ApprFile` `client/vi/scm/Scm01_Grid_ApprFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys10_Lookup_FileViewer_AView`](../../sys/components/Sys10_Lookup_FileViewer_AView.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `scm.Scm01_Sr.getSrModel` | Scm11_Tab_DevTest:192 | [`Scm01_Sr.java:72`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.getSrModel`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.updateContent` | Scm01_Lookup_SrContent:136 | [`Scm01_Sr.java:96`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.updateContent`](../../scm/sql/scm01_sr.md) |
| `scm.Scm11_DevStep.delete` | Scm11_Lookup_DevStep:295 | [`Scm11_DevStep.java:217`](../../scm/services/Scm11_DevStep.md) | `UpdateDataModel(scm11_dev_step)` 동적 DELETE |
| `scm.Scm11_DevStep.inUpdateProgress` | Scm11_Lookup_DevStep:297 | [`Scm11_DevStep.java:190`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.inUpdateProgress`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.selectByDevId` | Scm11_Lookup_DevNote:160, Scm11_Lookup_DevStep:264 | [`Scm11_DevStep.java:26`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.selectByDevId`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.selectByMyTurnCheck` | Scm11_Tab_DevTest:274 | [`Scm11_DevStep.java:64`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.selectByMyTurnCheck`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.updateResult` | Scm11_Edit_DevStepTest:282, Scm11_Lookup_Result:128 | [`Scm11_DevStep.java:147`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.updateResult`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.updateResultCode` | Scm11_Edit_DevStepTest:262 | [`Scm11_DevStep.java:123`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.checkMyTurn`](../../scm/sql/scm11_dev_step.md), [`scm11_dev_step.updateResultCode`](../../scm/sql/scm11_dev_step.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE → [`scm11_dev_step.selectById`](../../scm/sql/scm11_dev_step.md) |
| `sys.Sys00_Common.selectDevStatus` | Scm11_Tab_DevTest:62 | [`Sys00_Common.java:126`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectDevStatus`](../../sys/sql/sys00_common.md) |
| `sys.Sys10_File.selectByDevId` | Scm11_Grid_ApprFile:80 | [`Sys10_File.java:63`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByDevId`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByParentId` | Scm01_Grid_ApprFile:80 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Scm11_Tab_DevTest (`client/vi/scm/Scm11_Tab_DevTest.java`, 297줄)

- 레이아웃: center=vlc, south=hlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 시스템: {systemComboBox} 상태: {devStatusComboBox} {checkBox01} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="요청자/개발내용/개발자/개발진행상태/SR번호", `startDate` MyDateField, `closeDate` MyDateField, `systemComboBox` ComboBoxField("SystemCode", "%", "전체"), `devStatusComboBox` CommonComboBoxField("sys.Sys00_Common.selectDevStatus", "%", "전체"), `editBoard` Scm11_Edit_DevStepTest, `checkBox01` CheckBox, `lookup` Scm11_Lookup_DevNote
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "등록일" Date
  - systemName 120 "시스템구분" TextCenter
  - requestor 130 "요청자" Text
  - actionCell 60 "개발의뢰<br>상세보기" Cell 편집:actionCell02
  - devArrangeNote 650 "개발내용" Text
  - actionCell 30 "" Cell 편집:viewButton
  - devPersonName 100 "개발자" TextCenter
  - devStepResult 100 "개발진행상태" TextCenter
  - actionCell 50 "" Cell 편집:actionCell01
  - resultName 80 "QA/UAT결과" TextCenter
  - resultDateStr 150 "QA/UAT확인일시" TextCenter
  - fileCount 70 "첨부파일" LongCenter
  - srNo 100 "SR번호" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L70-117) → settings(), retrieve()
[E1] grid.RowClick (L111) → retrieveEditPage()
[E2] systemComboBox[SystemCode].Collapse (L134) → retrieve()
[E3] devStatusComboBox[sys.Sys00_Common.selectDevStatus].Collapse (L142) → retrieve()
[E4] searchText.KeyPress [Enter] (L154) → retrieve()
[E5] retrieveButton[조회].Select (L162) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L229-248 | E1,retrieve | 상태 처리 | 업무 |
| public retrieve() | L250-288 | 생성자,E2,E3,E4,E5,settings,retrieveEditPage | 서비스 scm.Scm11_DevStep.selectByMyTurnCheck(personId, startDate, closeDate, searchText, systemCode, devStatus, checkBox01) | 업무 |
| private settings() | L119-170 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, checkBox01=false("전체보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L172-227 | 필드 초기화 | 조회창 Scm11_Lookup_DevNote 열기, 조회창 Scm11_Lookup_DevStep 열기, 조회창 Scm01_Lookup_Detail 열기, 서비스 scm.Scm01_Sr.getSrModel(devId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L290-292 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L294-296 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L211
  gb.textCenter('systemNm', 120, '시스템구분'),  // L212
  gb.text('requestor', 130, '요청자'),  // L213
  // ⚠ 대응 없음 (GridBuilder L214) addCell
  gb.text('devArrangeNote', 650, '개발내용'),  // L215
  // ⚠ 대응 없음 (GridBuilder L216) addCell
  gb.textCenter('devPersonNm', 100, '개발자'),  // L217
  gb.textCenter('devStepResult', 100, '개발진행상태'),  // L219
  // ⚠ 대응 없음 (GridBuilder L220) addCell
  gb.textCenter('resultNm', 80, 'QA/UAT결과'),  // L221
  gb.textCenter('resultDateStr', 150, 'QA/UAT확인일시'),  // L222
  gb.longCenter('fileCount', 70, '첨부파일'),  // L223
  gb.textCenter('srNo', 100, 'SR번호'),  // L224
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Scm11_Lookup_DevStep (`client/vi/scm/Scm11_Lookup_DevStep.java`, 327줄)

- 툴바 `buttonBar`: {insertButton} {updateButton} {anchor}
- 입력·하위 화면: `devStepComboBox` ComboBoxField("DevStepCode"), `lookupEmpTransInfo` LookupTriggerField, `lookup` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildApprStepGrid(), 체크박스):
  - devStepName 100 "단계" TextCenter
  - personName 100 "담당자" TextCenter
  - devStepName 100 "단계" TextCenter 편집:devStepComboBox
  - personName 100 "담당자" TextCenter 편집:lookupEmpTransInfo
  - resultName 100 "결과" TextCenter
  - resultDateStr 200 "확인일시" TextCenter
  - arrangeResult 400 "결과상세" Text
  - actionCell 30 " " Cell 편집:viewButton
  - note 200 "비고" Text
  - actionCell 30 " " Cell 편집:upButton
  - actionCell 30 " " Cell 편집:downButton
  - actionCell 30 "삭제" Cell 편집:deleteButton

#### 이벤트
[E0] 화면 열림 (생성자 L89-121) → settings(), show()
[E1] anchor.MouseDown (L100) → retrieve()
[E2] insertButton[등록].Select (L124) → insertRow()
[E3] updateButton[저장].Select (L130) → update()
[E4] closeButton[닫기].Select (L136) → hide()
[E5] devStepComboBox[DevStepCode].Collapse (L149) → 인라인 L149-158 (new CollapseHandler() { @Override pub…)
[E6] lookupEmpTransInfo.TriggerClick (L161) → 인라인 L161-176 (new TriggerClickHandler() { @Override…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L70-75 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L77-87 | 공개 메서드 | 상태 처리 | 업무 |
| public buildApprStepGrid() | L144-218 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 조회창 Scm11_Lookup_Result 열기 | 업무 |
| public changeRow() | L220-249 | buildApprStepGrid | 미선택 시 alert "처리완료된 담당자는 수정이 불가능합니다" | 업무 |
| public getSeq() | L251-257 | changeRow | 상태 처리 | 업무 |
| public retrieve() | L259-270 | E1,edit,view,update | 서비스 scm.Scm11_DevStep.selectByDevId(devId) | 업무 |
| public update() | L272-308 | E3 | GridDeleteData scm.Scm11_DevStep.delete, scm.Scm11_DevStep.inUpdateProgress | 업무 |
| public insertRow() | L310-322 | E2 | 상태 처리 | 업무 |
| private settings() | L123-142 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L324-326 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  gb.textCenter('devStepNm', 100, '단계'),  // L203
  gb.textCenter('personNm', 100, '담당자'),  // L204
  gb.textCenter('devStepNm', 100, '단계', { editor: 'select' }),  // L205
  gb.textCenter('personNm', 100, '담당자'),  // L206
  gb.textCenter('resultNm', 100, '결과'),  // L207
  gb.textCenter('resultDateStr', 200, '확인일시'),  // L208
  gb.text('arrangeResult', 400, '결과상세'),  // L210
  // ⚠ 대응 없음 (GridBuilder L211) addCell
  gb.text('note', 200, '비고'),  // L212
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  // ⚠ 대응 없음 (GridBuilder L214) addCell
  // ⚠ 대응 없음 (GridBuilder L215) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Scm11_Lookup_DevNote (`client/vi/scm/Scm11_Lookup_DevNote.java`, 181줄)

- 그리드 `apprStepGrid` (buildApprStepGrid()):
  - devStepName 60 "구분" TextNotSort
  - personName 80 "담당자" TextNotSort
  - resultDateStr 140 "확인일시" TextNotSort
  - resultName 60 "결과" TextNotSort

#### 이벤트
[E1] closeButton[닫기].Select (L86) → hide()
[E2] apprStepGrid.RowClick (L93) → 인라인 L93-117 (new RowClickHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-140 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprStepGrid() | L144-153 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L155-166 | open | 서비스 scm.Scm11_DevStep.selectByDevId(devId) | 업무 |
| private setHtmlHeaderStyle() | L168-170 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L147) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L148) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L149) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L150) addTextNotSort
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm11_Edit_DevStepTest (`client/vi/scm/Scm11_Edit_DevStepTest.java`, 322줄)

- 입력·하위 화면: `resultName` TextField, `lookup` Scm11_Lookup_Result

#### 이벤트
[E0] 화면 열림 (생성자 L82-130) → settings(), getEditor(), show()
[E1] fileUpload.Change (L92) → 인라인 L92-99 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L102) → 인라인 L102-107 (new SubmitCompleteHandler() { @Overri…)
[E3] confirmButton[승인].Select (L139) → updateResultCode()
[E4] rejectButton[반려].Select (L145) → updateResultCode()
[E5] cancelButton[취소].Select (L151) → updateResultCode()
[E6] uploadFileButton[파일업로드].Select (L157) → 인라인 L157-162 (new SelectHandler() { @Override publi…)
[E7] updateButton[저장].Select (L163) → updateResult()
[E8] anchor.MouseDown (L178) → 인라인 L178-192 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L171-227 | 생성자 | 조회창 Scm11_Lookup_Result 열기 | 업무 |
| public retrieve() | L229-247 | 공개 메서드 | 상태 처리 | 업무 |
| private editerEnable() | L249-255 | retrieve | 상태 처리 | 업무 |
| private updateResultCode() | L257-277 | E3,E4,E5 | 서비스 scm.Scm11_DevStep.updateResultCode | 업무 |
| public updateResult() | L279-292 | E7 | 서비스 scm.Scm11_DevStep.updateResult | 업무 |
| public init() | L294-298 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveApproval() | L300-302 | retrieve | 상태 처리 | 업무 |
| public getServiceResult() | L305-307 | updateResultCode,updateResult | 상태 처리 | 업무 |
| private settings() | L132-169 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L309-311 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateResult}>저장</Button>
2. <Button type="upload" onClick={() => /* 인라인 L157-162 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
3. <Button type="save" onClick={updateResultCode}>승인</Button>
4. <Button type="cancel" onClick={updateResultCode}>반려</Button>
5. <Button type="cancel" onClick={updateResultCode}>취소</Button>

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

