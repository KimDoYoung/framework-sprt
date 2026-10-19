# Scm13_Tab_Deploy

- 종류: 화면
- 메뉴: KFS > 02. 배포관리 > 배포처리 (#1266)
- 파일: `client/vi/scm/Scm13_Tab_Deploy.java`
- 함께 쓰는 클래스 8개:
  - `Scm13_Page_Deploy` `client/vi/scm/Scm13_Page_Deploy.java`
  - `Scm30_Edit_Program` `client/vi/scm/Scm30_Edit_Program.java`
  - `Scm13_Lookup_Note` `client/vi/scm/Scm13_Lookup_Note.java`
  - `Scm11_Lookup_DevStep` `client/vi/scm/Scm11_Lookup_DevStep.java`
  - `Scm11_Lookup_Result` `client/vi/scm/Scm11_Lookup_Result.java`
  - `Scm01_Lookup_Detail` `client/vi/scm/Scm01_Lookup_Detail.java`
  - `Scm01_Lookup_SrContent` `client/vi/scm/Scm01_Lookup_SrContent.java`
  - `Scm01_Grid_ApprFile` `client/vi/scm/Scm01_Grid_ApprFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys10_Lookup_FileViewer_AView`](../../sys/components/Sys10_Lookup_FileViewer_AView.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `scm.Scm01_Sr.getSrModel` | Scm13_Tab_Deploy:149 | [`Scm01_Sr.java:72`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.getSrModel`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.updateContent` | Scm01_Lookup_SrContent:136 | [`Scm01_Sr.java:96`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.updateContent`](../../scm/sql/scm01_sr.md) |
| `scm.Scm11_DevStep.delete` | Scm11_Lookup_DevStep:295 | [`Scm11_DevStep.java:217`](../../scm/services/Scm11_DevStep.md) | `UpdateDataModel(scm11_dev_step)` 동적 DELETE |
| `scm.Scm11_DevStep.inUpdateProgress` | Scm11_Lookup_DevStep:297 | [`Scm11_DevStep.java:190`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.inUpdateProgress`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.selectByDeployPersonId` | Scm13_Tab_Deploy:222 | [`Scm11_DevStep.java:50`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.selectByDeployPersonId`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.selectByDevId` | Scm11_Lookup_DevStep:264 | [`Scm11_DevStep.java:26`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.selectByDevId`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.updateResult` | Scm11_Lookup_Result:128 | [`Scm11_DevStep.java:147`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.updateResult`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm13_DevProgram.selectByDeployTgtDevId` | Scm13_Page_Deploy:120 | [`Scm13_DevProgram.java:32`](../../scm/services/Scm13_DevProgram.md) | [`scm13_dev_program.selectByDeployTgtDevId`](../../scm/sql/scm13_dev_program.md) |
| `scm.Scm13_DevProgram.updateDeploy` | Scm13_Page_Deploy:148 | [`Scm13_DevProgram.java:116`](../../scm/services/Scm13_DevProgram.md) | [`scm13_dev_program.updateDeploy`](../../scm/sql/scm13_dev_program.md) |
| `scm.Scm13_DevProgram.updateNote` | Scm13_Lookup_Note:77 | [`Scm13_DevProgram.java:105`](../../scm/services/Scm13_DevProgram.md) | [`scm13_dev_program.updateNote`](../../scm/sql/scm13_dev_program.md) |
| `scm.Scm13_DevProgram.updateResultDeploy` | Scm13_Page_Deploy:188 | [`Scm13_DevProgram.java:132`](../../scm/services/Scm13_DevProgram.md) | [`scm11_dev_step.updateResultDeploy`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm30_Program.modelUpdate` | Scm30_Edit_Program:398 | [`Scm30_Program.java:86`](../../scm/services/Scm30_Program.md) | [`scm30_program.selectById`](../../scm/sql/scm30_program.md), [`scm30_program.selectByProgramCode`](../../scm/sql/scm30_program.md), [`scm30_program.updateRegDate`](../../scm/sql/scm30_program.md), `UpdateDataModel(scm30_program)` 동적 INSERT/UPDATE → [`scm30_program.selectById`](../../scm/sql/scm30_program.md) |
| `sys.Sys10_File.selectByParentId` | Scm01_Grid_ApprFile:80, Scm30_Edit_Program:249, Scm30_Edit_Program:365 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`scm01_sr`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Scm13_Tab_Deploy (`client/vi/scm/Scm13_Tab_Deploy.java`, 246줄)

- 레이아웃: center=vlc, south=deployPage
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 시스템: {systemComboBox} {deployCheckBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="개발내용/프로그램ID/프로그램명/SR번호", `systemComboBox` ComboBoxField("SystemCode", "%", "전체"), `deployCheckBox` CheckBox, `deployPage` Scm13_Page_Deploy, `lookup` Scm01_Lookup_Detail
- 그리드 `grid` (buildGrid()):
  - srDate 100 "요청일" Date
  - systemName 120 "시스템" TextCenter
  - actionCell 70 "개발의뢰<br>상세보기" Cell 편집:requestViewCell
  - devNote 650 "개발내용" Text
  - devPersonName 100 "개발자" TextCenter
  - resultDateStr 150 "배포완료일시" TextCenter
  - deployCount 70 "배포건수" LongCenter
  - devStepResult 100 "개발진행상태" TextCenter
  - actionCell 40 "" Cell 편집:progressViewCell
  - srNo 100 "SR번호" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L57-103) → settings(), retrieve()
[E1] grid.SelectionChanged (L93) → retrievePage()
[E2] searchText.KeyPress [Enter] (L126) → retrieve()
[E3] retrieveButton[조회].Select (L135) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrievePage() | L192-204 | E1,retrieve | 상태 처리 | 업무 |
| public retrieve() | L206-237 | 생성자,E2,E3,retrievePage | 서비스 scm.Scm11_DevStep.selectByDeployPersonId(personId, startDate, closeDate, searchText, systemCode, checkBox) | 업무 |
| private settings() | L105-141 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, deployCheckBox=false("전체보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L143-190 | 필드 초기화 | 조회창 Scm01_Lookup_Detail 열기, 조회창 Scm11_Lookup_DevStep 열기, 서비스 scm.Scm01_Sr.getSrModel(devId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L239-241 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L243-245 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('srDate', 100, '요청일'),  // L177
  gb.textCenter('systemNm', 120, '시스템'),  // L178
  // ⚠ 대응 없음 (GridBuilder L179) addCell
  gb.text('devNote', 650, '개발내용'),  // L180
  gb.textCenter('devPersonNm', 100, '개발자'),  // L181
  gb.textCenter('resultDateStr', 150, '배포완료일시'),  // L183
  gb.longCenter('deployCount', 70, '배포건수'),  // L184
  gb.textCenter('devStepResult', 100, '개발진행상태'),  // L185
  // ⚠ 대응 없음 (GridBuilder L186) addCell
  gb.textCenter('srNo', 100, 'SR번호'),  // L187
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Scm13_Page_Deploy (`client/vi/scm/Scm13_Page_Deploy.java`, 200줄)

- 툴바 `buttonBar`: {deployButton}
- 입력·하위 화면: `popup` Scm30_Edit_Program, `lookupNote` Scm13_Lookup_Note
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - deploySeq 80 "배포순서" Long
  - programTypeName 100 "구분" Text
  - programCode 250 "프로그램ID" Text
  - programName 350 "프로그램명" Text
  - personName 100 "개발자" Text
  - actionCell 80 "소스보기" Cell 편집:sourceViewCell
  - deployDateStr 150 "배포일시" Text
  - actionCell 80 "비고" Cell 편집:noteCell

#### 이벤트
[E0] 화면 열림 (생성자 L48-64) → 초기화
[E1] deployButton[배포처리].Select (L55) → deploy()
       └ [E2] msgBox.DialogHide [YES] (L153) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L110-115 | E2,buildGrid | 상태 처리 | 업무 |
| private retrieve() | L117-128 | E2,buildGrid | 서비스 scm.Scm13_DevProgram.selectByDeployTgtDevId(devId) | 업무 |
| private deploy() | L130-179 | E1 | 미선택 시 alert "선택된 프로그램이 없습니다" → 확인창 E2 | 업무 |
| private deployComplete() | L181-199 | retrieve | 서비스 scm.Scm13_DevProgram.updateResultDeploy(devId) | 업무 |
| private buildGrid() | L66-108 | 필드 초기화 | 팝업 Scm30_Edit_Program 열기, 조회창 Scm13_Lookup_Note 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.long('deploySeq', 80, '배포순서'),  // L98
  gb.text('programTypeNm', 100, '구분'),  // L99
  gb.text('programCd', 250, '프로그램ID'),  // L100
  gb.text('programNm', 350, '프로그램명'),  // L101
  gb.text('personNm', 100, '개발자'),  // L102
  // ⚠ 대응 없음 (GridBuilder L103) addCell
  gb.text('deployDateStr', 150, '배포일시'),  // L104 SQL 계산 컬럼(selectByDeployTgtDevId: to_char(scm13_deploy_date, 'YYYY-MM-DD …)
  // ⚠ 대응 없음 (GridBuilder L105) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={deploy}>배포처리</Button>

### Scm30_Edit_Program (`client/vi/scm/Scm30_Edit_Program.java`, 465줄)

- 입력·하위 화면: `systemCode` TextField, `programType` TextField, `systemName` ComboBoxField("SystemCode"), `programTypeName` ComboBoxField("ProgramType"), `programCode` TextField, `programName` TextField 빈칸="미입력시 전버전의 프로그램명으로 등록됩니다.", `version` LongField, `source` MyTextArea, `note` MyTextArea, `useYn` CheckBox, `regDateStr` TextField 빈칸="(자동생성)", `fileName` TextField, `versionName` TextField 빈칸="(자동생성)"

#### 이벤트
[E0] 화면 열림 (생성자 L195-305) → getEditor(), show()
[E1] fileUpload.Change (L218) → 인라인 L218-225 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L228) → resetFileUpload(), fileRetrieve()
[E3] fileDeleteForm.SubmitComplete (L235) → 인라인 L235-240 (new SubmitCompleteHandler() { @Overri…)
[E4] uploadButton[파일업로드].Select [result.getStatus() <= 0] (L245) → 서비스 sys.Sys10_File.selectByParentId, 메시지 "이미 업로드된 파일이 있습니다."
[E5] downloadButton[다운로드].Select (L266) → fileDownload()
[E6] deleteButton[삭제].Select (L272) → fileDelete()
[E7] updateButton[저장].Select (L278) → update()
[E8] closeButton[닫기].Select [versionCode == 1] (L284) → hide()
[E9] fileUpload.Change (L448) → 인라인 L448-455 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L91-107 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L109-133 | 공개 메서드 | 상태 처리 | 업무 |
| public versionEdit() | L135-159 | 공개 메서드 | 상태 처리 | 업무 |
| public read() | L161-186 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L188-193 | insert,edit,versionEdit,read | 상태 처리 | 업무 |
| private getEditor() | L307-362 | 생성자 | 상태 처리 | 업무 |
| private fileRetrieve() | L364-380 | E2,edit,read | 서비스 sys.Sys10_File.selectByParentId | 업무 |
| private update() | L382-419 | E7 | 서비스 scm.Scm30_Program.modelUpdate(versionCode) | 업무 |
| private fileDownload() | L421-429 | E5 | 상태 처리 | 업무 |
| private fileDelete() | L431-439 | E6 | 상태 처리 | 업무 |
| private resetFileUpload() | L441-456 | E2 | 상태 처리 | 업무 |
| private setHtmlStyle() | L458-460 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L462-464 | insert,edit,versionEdit,read | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 서비스 sys.Sys10_File.selectByParentId, 메시지 "이미 업로드된 파일이 있습니다." */}>파일업로드</Button>
2. <Button type="download" onClick={fileDownload}>다운로드</Button>
3. <Button type="delete" onClick={fileDelete}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm13_Lookup_Note (`client/vi/scm/Scm13_Lookup_Note.java`, 94줄)

- 입력·하위 화면: `deployNote` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L55) → update()
[E2] closeButton[닫기].Select (L61) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-72 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L74-88 | E1 | 서비스 scm.Scm13_DevProgram.updateNote | 업무 |
| private setHtmlHeaderStyle() | L90-92 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

