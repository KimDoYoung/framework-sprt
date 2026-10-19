# Scm01_Tab_DevMng

- 종류: 화면
- 메뉴: KFS > 01. 시스템 개발 > 시스템 개발 관리 (#1262)
- 파일: `client/vi/scm/Scm01_Tab_DevMng.java`
- 함께 쓰는 클래스 15개:
  - `Scm01_Edit_DevMngRO` `client/vi/scm/Scm01_Edit_DevMngRO.java`
  - `Scm01_Lookup_SrContent` `client/vi/scm/Scm01_Lookup_SrContent.java`
  - `Scm01_Grid_ApprFile` `client/vi/scm/Scm01_Grid_ApprFile.java`
  - `Scm01_Edit_DevMng` `client/vi/scm/Scm01_Edit_DevMng.java`
  - `Scm12_Lookup_DevStepRule` `client/vi/scm/Scm12_Lookup_DevStepRule.java`
  - `Scm10_Grid_Dev` `client/vi/scm/Scm10_Grid_Dev.java`
  - `Scm13_Lookup_DevProgram` `client/vi/scm/Scm13_Lookup_DevProgram.java`
  - `Scm13_Edit_DevProgram` `client/vi/scm/Scm13_Edit_DevProgram.java`
  - `Scm11_Lookup_DevStep` `client/vi/scm/Scm11_Lookup_DevStep.java`
  - `Scm11_Lookup_Result` `client/vi/scm/Scm11_Lookup_Result.java`
  - `Scm10_Lookup_Note` `client/vi/scm/Scm10_Lookup_Note.java`
  - `Scm01_Lookup_ApprFile` `client/vi/scm/Scm01_Lookup_ApprFile.java`
  - `Scm03_Grid_ExpectProgram` `client/vi/scm/Scm03_Grid_ExpectProgram.java`
  - `Scm30_Lookup_SelectMulti` `client/vi/scm/Scm30_Lookup_SelectMulti.java`
  - `Scm01_Lookup_ResultContent` `client/vi/scm/Scm01_Lookup_ResultContent.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Biz13_Lookup_WithCorp`](../../biz/components/Biz13_Lookup_WithCorp.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys10_Lookup_FileViewer_AView`](../../sys/components/Sys10_Lookup_FileViewer_AView.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `getSeq` | Scm13_Edit_DevProgram:105 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `scm.Scm01_Sr.selectByDevMng` | Scm01_Tab_DevMng:260 | [`Scm01_Sr.java:51`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.selectByDevMng`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.update` | Scm01_Edit_DevMng:411 | [`Scm01_Sr.java:77`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.createSrNo`](../../scm/sql/scm01_sr.md), `UpdateDataModel(scm01_sr)` 동적 INSERT/UPDATE → [`scm01_sr.selectById`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.updateContent` | Scm01_Lookup_SrContent:136 | [`Scm01_Sr.java:96`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.updateContent`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.updateResultContent` | Scm01_Lookup_ResultContent:100 | [`Scm01_Sr.java:107`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.updateResultContent`](../../scm/sql/scm01_sr.md) |
| `scm.Scm03_ExpectProgram.delete` | Scm03_Grid_ExpectProgram:113 | [`Scm03_ExpectProgram.java:36`](../../scm/services/Scm03_ExpectProgram.md) | `UpdateDataModel(scm03_expect_program)` 동적 DELETE |
| `scm.Scm03_ExpectProgram.selectBySrId` | Scm03_Grid_ExpectProgram:72 | [`Scm03_ExpectProgram.java:23`](../../scm/services/Scm03_ExpectProgram.md) | [`scm03_expect_program.selectBySrId`](../../scm/sql/scm03_expect_program.md) |
| `scm.Scm03_ExpectProgram.update` | Scm03_Grid_ExpectProgram:87 | [`Scm03_ExpectProgram.java:31`](../../scm/services/Scm03_ExpectProgram.md) | `UpdateDataModel(scm03_expect_program)` 동적 INSERT/UPDATE → [`scm03_expect_program.selectById`](../../scm/sql/scm03_expect_program.md) |
| `scm.Scm10_Dev.delete` | Scm10_Grid_Dev:236 | [`Scm10_Dev.java:96`](../../scm/services/Scm10_Dev.md) | `UpdateDataModel(scm10_dev)` 동적 DELETE |
| `scm.Scm10_Dev.selectBySrId` | Scm10_Grid_Dev:88 | [`Scm10_Dev.java:42`](../../scm/services/Scm10_Dev.md) | [`scm10_dev.selectBySrId`](../../scm/sql/scm10_dev.md) |
| `scm.Scm10_Dev.updateList` | Scm10_Grid_Dev:192 | [`Scm10_Dev.java:50`](../../scm/services/Scm10_Dev.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`scm11_dev_step.checkDevStep`](../../scm/sql/scm11_dev_step.md), [`scm12_dev_step_rule.getList`](../../scm/sql/scm12_dev_step_rule.md), `UpdateDataModel(scm11_dev_step)` 동적 INSERT/UPDATE → [`scm11_dev_step.selectById`](../../scm/sql/scm11_dev_step.md), `UpdateDataModel(scm10_dev)` 동적 INSERT/UPDATE → [`scm10_dev.selectById`](../../scm/sql/scm10_dev.md) |
| `scm.Scm11_DevStep.delete` | Scm11_Lookup_DevStep:295 | [`Scm11_DevStep.java:217`](../../scm/services/Scm11_DevStep.md) | `UpdateDataModel(scm11_dev_step)` 동적 DELETE |
| `scm.Scm11_DevStep.deleteByDevId` | Scm10_Grid_Dev:227 | [`Scm11_DevStep.java:161`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.deleteByDevId`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.inUpdateProgress` | Scm11_Lookup_DevStep:297 | [`Scm11_DevStep.java:190`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.inUpdateProgress`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.selectByDevId` | Scm11_Lookup_DevStep:264 | [`Scm11_DevStep.java:26`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.selectByDevId`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm11_DevStep.updateResult` | Scm11_Lookup_Result:128 | [`Scm11_DevStep.java:147`](../../scm/services/Scm11_DevStep.md) | [`scm11_dev_step.updateResult`](../../scm/sql/scm11_dev_step.md) |
| `scm.Scm12_DevStepRule.delete` | Scm12_Lookup_DevStepRule:192 | [`Scm12_DevStepRule.java:37`](../../scm/services/Scm12_DevStepRule.md) | `UpdateDataModel(scm12_dev_step_rule)` 동적 DELETE |
| `scm.Scm12_DevStepRule.getList` | Scm12_Lookup_DevStepRule:182 | [`Scm12_DevStepRule.java:21`](../../scm/services/Scm12_DevStepRule.md) | [`scm12_dev_step_rule.getList`](../../scm/sql/scm12_dev_step_rule.md) |
| `scm.Scm12_DevStepRule.updateList` | Scm12_Lookup_DevStepRule:200 | [`Scm12_DevStepRule.java:26`](../../scm/services/Scm12_DevStepRule.md) | `UpdateDataModel(scm12_dev_step_rule)` 동적 INSERT/UPDATE → [`scm12_dev_step_rule.selectById`](../../scm/sql/scm12_dev_step_rule.md) |
| `scm.Scm13_DevProgram.modelUpdate` | Scm13_Edit_DevProgram:377 | [`Scm13_DevProgram.java:37`](../../scm/services/Scm13_DevProgram.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`scm30_program.selectByProgramCode`](../../scm/sql/scm30_program.md), [`scm30_program.updateRegDate`](../../scm/sql/scm30_program.md), `UpdateDataModel(scm13_dev_program)` 동적 INSERT/UPDATE → [`scm13_dev_program.selectById`](../../scm/sql/scm13_dev_program.md), `UpdateDataModel(scm30_program)` 동적 INSERT/UPDATE → [`scm30_program.selectById`](../../scm/sql/scm30_program.md) |
| `scm.Scm13_DevProgram.selectByDevId` | Scm13_Lookup_DevProgram:64 | [`Scm13_DevProgram.java:27`](../../scm/services/Scm13_DevProgram.md) | [`scm13_dev_program.selectByDevId`](../../scm/sql/scm13_dev_program.md) |
| `scm.Scm30_Program.selectByTextPaging` | Scm30_Lookup_SelectMulti:114 | [`Scm30_Program.java:58`](../../scm/services/Scm30_Program.md) | [`scm30_program.selectByTextPaging`](../../scm/sql/scm30_program.md), [`scm30_program.selectByTextPagingTotal`](../../scm/sql/scm30_program.md) |
| `sys.Sys10_File.selectByDevId` | Scm01_Lookup_ApprFile:150 | [`Sys10_File.java:63`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByDevId`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByParentId` | Scm01_Grid_ApprFile:80, Scm13_Edit_DevProgram:239, Scm13_Edit_DevProgram:344 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`scm01_sr`](../../../db/tables/scm.md), [`scm03_expect_program`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`scm11_dev_step`](../../../db/tables/scm.md), [`scm12_dev_step_rule`](../../../db/tables/scm.md), [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Scm01_Tab_DevMng (`client/vi/scm/Scm01_Tab_DevMng.java`, 301줄)

- 레이아웃: north=vlc, center=editBoard1, south=editBoard2
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 시스템: {systemComboBox} 상태: {srStatusComboBox} {checkBox01} {retrieveButton}
- 툴바 `buttonBar02`: 검색조건: {searchText}
- 입력·하위 화면: `searchText` TextField 빈칸="등록자/요청자/요청내용/처리내용/SR번호/개발진행상태/개발내용/개발결과상세/개발비고", `startDate` MyDateField, `closeDate` MyDateField, `systemComboBox` ComboBoxField("SystemCode", "%", "전체"), `srStatusComboBox` ComboBoxField("SrStatus", "%", "전체"), `editBoard1` Scm01_Edit_DevMngRO, `editBoard2` Scm01_Edit_DevMng, `checkBox01` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - srDate 100 "요청일" Date
  - systemName 120 "시스템구분" TextCenter
  - srTypeName 100 "요청구분" Text
  - personName 70 "등록자" TextCenter
  - requestorCorpName 150 "요청자" Text
  - srArrangeContent 650 "요청내용" Text
  - fileCount 70 "첨부파일" LongCenter
  - srStatusName 70 "처리상태" TextCenter
  - devCountStr 70 "개발상태" TextCenter
  - closeDate 100 "처리완료일" Date
  - srNo 100 "SR번호" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L63-114) → settings()
[E1] grid.RowClick (L108) → retrieveEditPage()
[E2] systemComboBox[SystemCode].Collapse (L136) → retrieve()
[E3] srStatusComboBox[SrStatus].Collapse (L144) → retrieve()
[E4] searchText.KeyPress [Enter] (L156) → retrieve()
[E5] retrieveButton[조회].Select (L164) → retrieve()
[E6] grid.CellDoubleClick [colIndex == 12] (L171) → 인라인 L171-181 (new CellDoubleClickHandler() { @Overr…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L206-233 | E1,retrieve | 상태 처리 | 업무 |
| public retrieve() | L235-272 | E2,E3,E4,E5 | 서비스 scm.Scm01_Sr.selectByDevMng(startDate, closeDate, searchText, systemCode, srStatus, checkBox01, checkBox02, gubun) | 업무 |
| private editmask() | L274-282 | retrieveEditPage | 상태 처리 | 업무 |
| private settings() | L116-184 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, checkBox01=true("미완료건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L186-204 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L284-286 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L288-290 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('srDate', 100, '요청일'),  // L190
  gb.textCenter('systemNm', 120, '시스템구분'),  // L191
  gb.text('srTypeNm', 100, '요청구분'),  // L192
  gb.textCenter('personNm', 70, '등록자'),  // L193
  gb.text('requestorCorpNm', 150, '요청자'),  // L194
  gb.text('srArrangeContent', 650, '요청내용'),  // L196
  gb.longCenter('fileCount', 70, '첨부파일'),  // L197
  gb.textCenter('srStatusNm', 70, '처리상태'),  // L198
  gb.textCenter('devCountStr', 70, '개발상태'),  // L199
  gb.date('closeDate', 100, '처리완료일'),  // L200
  gb.textCenter('srNo', 100, 'SR번호'),  // L201
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Scm01_Edit_DevMngRO (`client/vi/scm/Scm01_Edit_DevMngRO.java`, 228줄)

- 입력·하위 화면: `lookup` Scm01_Lookup_SrContent

#### 이벤트
[E0] 화면 열림 (생성자 L67-116) → settings(), getEditor(), show()
[E1] fileUpload.Change (L88) → 인라인 L88-97 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L100) → resetFileUpload()
[E3] updateButton[파일업로드].Select (L124) → 인라인 L124-129 (new SelectHandler(){ @Override public…)
[E4] anchor.MouseDown (L135) → 인라인 L135-141 (new MouseDownHandler() { @Override pu…)
[E5] fileUpload.Change (L201) → 인라인 L201-208 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L132-169 | 생성자 | 조회창 Scm01_Lookup_SrContent 열기 | 업무 |
| public retrieve() | L171-182 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L184-187 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveApproval() | L189-192 | retrieve | 상태 처리 | 업무 |
| private resetFileUpload() | L194-209 | E2 | 상태 처리 | 업무 |
| public getServiceResult() | L212-214 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L118-130 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L216-218 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L124-129 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>

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

### Scm01_Edit_DevMng (`client/vi/scm/Scm01_Edit_DevMng.java`, 446줄)

- 입력·하위 화면: `corpId` LongField, `systemCode` TextField, `srType` TextField, `requestor` TextField 빈칸="요청자", `srStatusCode` TextField, `devImportanceCode` TextField, `expectPeriod` TextField, `devContent` TextField, `devTarget` TextField, `devTargetEtc` TextField, `resultContent` MyTextArea, `startDate` MyDateField, `dueDate` MyDateField, `closeDate` MyDateField, `systemName` ComboBoxField("SystemCode"), `srTypeName` ComboBoxField("SrType"), `srStatusName` ComboBoxField("SrStatus"), `devImportanceName` ComboBoxField("DevImportanceCode"), `corpName` LookupTriggerField 빈칸="요청사", `ch01` CheckBox, `ch02` CheckBox, `ch03` CheckBox, `ch04` CheckBox, `ch05` CheckBox, `lookupCorp` Biz13_Lookup_WithCorp, `lookup` Scm12_Lookup_DevStepRule

#### 이벤트
[E0] 화면 열림 (생성자 L148-171) → settings(), getEditor(), show()
[E1] ch05.ValueChange [!event.getValue()] (L196) → 인라인 L196-205 (new ValueChangeHandler<Boolean>() { @…)
[E2] corpName.TriggerClick (L211) → 인라인 L211-225 (new TriggerClickHandler(){ @Override …)
[E3] updateButton[저장].Select (L227) → updateRow()
[E4] insertButton03[등록].Select (L233) → 메시지 "상단 개발요청내용을 먼저 선택해주세요"
[E5] updateButton03[저장].Select (L244) → 인라인 L244-249 (new SelectHandler() { @Override publi…)
[E6] deleteButton03[삭제].Select (L250) → 인라인 L250-255 (new SelectHandler() { @Override publi…)
[E7] insertButton10[등록].Select (L257) → 메시지 "상단 개발요청내용을 먼저 선택해주세요"
[E8] updateButton10[저장].Select (L268) → 인라인 L268-273 (new SelectHandler() { @Override publi…)
[E9] deleteButton10[삭제].Select (L274) → 인라인 L274-279 (new SelectHandler() { @Override publi…)
[E10] settingButton10[진행단계 기본설정].Select (L280) → 인라인 L280-286 (new SelectHandler() { @Override publi…)
[E11] anchor.MouseDown (L303) → 인라인 L303-317 (new MouseDownHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public checkBox() | L109-134 | retrieve | 상태 처리 | 업무 |
| private getDevTarget() | L136-146 | updateRow | 상태 처리 | 업무 |
| private getEditor() | L289-391 | 생성자 | 조회창 Scm01_Lookup_ResultContent 열기 | 업무 |
| public retrieve() | L393-405 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L407-422 | E3 | 서비스 scm.Scm01_Sr.update | 업무 |
| public init() | L424-429 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveApproval() | L431-436 | retrieve | 상태 처리 | 업무 |
| public getServiceResult() | L439-441 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L173-287 | 생성자 | 조회창 Biz13_Lookup_WithCorp 열기, 조회창 Scm12_Lookup_DevStepRule 열기, 미선택 시 alert "상단 개발요청내용을 먼저 선택해주세요", 이벤트 연결, 초기값: devTargetEtc=null, corpId=resultModel.getCorpId(, corpName=resultModel.getCorpName( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L443-445 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="register" onClick={() => /* 메시지 "상단 개발요청내용을 먼저 선택해주세요" */}>등록</Button>
3. <Button type="save" onClick={() => /* 인라인 L244-249 (new SelectHandler() { @Override publi…) */}>저장</Button>
4. <Button type="delete" onClick={() => /* 인라인 L250-255 (new SelectHandler() { @Override publi…) */}>삭제</Button>
5. <Button type="register" onClick={() => /* 메시지 "상단 개발요청내용을 먼저 선택해주세요" */}>등록</Button>
6. <Button type="save" onClick={() => /* 인라인 L268-273 (new SelectHandler() { @Override publi…) */}>저장</Button>
7. <Button type="delete" onClick={() => /* 인라인 L274-279 (new SelectHandler() { @Override publi…) */}>삭제</Button>
8. <Button type="assign" onClick={() => /* 인라인 L280-286 (new SelectHandler() { @Override publi…) */}>진행단계 기본설정</Button>

### Scm12_Lookup_DevStepRule (`client/vi/scm/Scm12_Lookup_DevStepRule.java`, 229줄)

- 툴바 `buttonBar`: {insertButton}
- 입력·하위 화면: `devStepComboBox` ComboBoxField("DevStepCode")
- 그리드 `grid` (buildApprStepGrid(), 체크박스):
  - devStepName 150 "구분" Text 편집:devStepComboBox
  - actionCell 30 " " Cell 편집:upButton
  - actionCell 30 " " Cell 편집:downButton
  - actionCell 30 "삭제" Cell 편집:deleteButton

#### 이벤트
[E0] 화면 열림 (생성자 L57-79) → settings(), show()
[E1] insertButton[등록].Select (L82) → insertRow()
[E2] confirmButton[저장].Select (L88) → update()
[E3] closeButton[닫기].Select (L94) → hide()
[E4] devStepComboBox[DevStepCode].Collapse (L107) → 인라인 L107-116 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-55 | 공개 메서드 | 상태 처리 | 업무 |
| public buildApprStepGrid() | L102-142 | 필드 초기화 | 상태 처리 | 업무 |
| public changeRow() | L144-168 | buildApprStepGrid | 상태 처리 | 업무 |
| public getSeq() | L170-176 | changeRow | 상태 처리 | 업무 |
| public retrieve() | L178-188 | open,update | 서비스 scm.Scm12_DevStepRule.getList | 업무 |
| public update() | L190-211 | E2 | GridDeleteData scm.Scm12_DevStepRule.delete, scm.Scm12_DevStepRule.updateList | 업무 |
| public insertRow() | L213-224 | E1 | 상태 처리 | 업무 |
| private settings() | L81-100 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L226-228 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  gb.text('devStepNm', 150, '구분', { editor: 'select' }),  // L136 SQL 계산 컬럼(getList: f_cdnm('DevStepCode', scm12_dev_step_cd…)
  // ⚠ 대응 없음 (GridBuilder L137) addCell
  // ⚠ 대응 없음 (GridBuilder L138) addCell
  // ⚠ 대응 없음 (GridBuilder L139) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm10_Grid_Dev (`client/vi/scm/Scm10_Grid_Dev.java`, 244줄)

- 입력·하위 화면: `lookup` Emp00_Lookup_SelectMulti, `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildApprStepGrid()):
  - regDate 100 "등록일" Date 편집:MyDateField
  - personName 80 "개발자" Text 편집:lookupEmpInfo
  - arrangeNote 390 "개발내용" Text
  - actionCell 30 "" Cell 편집:actionCell1
  - devStepResult 80 "진행상태" Text
  - actionCell 30 "" Cell 편집:actionCell2
  - devProgramCnt 55 "프로그램" Long
  - actionCell 30 "" Cell 편집:actionCell3
  - fileCnt 55 "첨부파일" Long
  - actionCell 30 "" Cell 편집:actionCell4
  - startDate 90 "시작일" Date
  - dueDate 90 "완료예정일" Date
  - resultDate 90 "완료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L75-78) → 초기화
[E1] lookupEmpInfo.TriggerClick (L93) → 인라인 L93-108 (new TriggerClickHandler(){ @Override …)
[E2] msgBox.DialogHide [YES] (L207) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insertRow() | L48-73 | 공개 메서드 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| public retrieve() | L80-83 | update | 상태 처리 | 업무 |
| private retrieve() | L85-89 | update | 서비스 scm.Scm10_Dev.selectBySrId(srId) | 업무 |
| private buildApprStepGrid() | L91-176 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 조회창 Scm10_Lookup_Note 열기, 조회창 Scm11_Lookup_DevStep 열기, 조회창 Scm13_Lookup_DevProgram 열기, 조회창 Scm01_Lookup_ApprFile 열기 | 업무 |
| public update() | L178-202 | 공개 메서드 | 서비스 scm.Scm10_Dev.updateList | 업무 |
| public deleteChk() | L204-222 | 공개 메서드 | 확인창 표시 | 업무 |
| private deleteRow() | L224-239 | E2 | GridDeleteData scm.Scm11_DevStep.deleteByDevId, scm.Scm10_Dev.delete(체크된 행 목록) | 업무 |
| public clear() | L241-243 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  gb.date('regDate', 100, '등록일', { editor: 'date' }),  // L160
  gb.text('personNm', 80, '개발자'),  // L161
  gb.text('arrangeNote', 390, '개발내용'),  // L163
  // ⚠ 대응 없음 (GridBuilder L164) addCell
  gb.text('devStepResult', 80, '진행상태'),  // L165
  // ⚠ 대응 없음 (GridBuilder L166) addCell
  gb.long('devProgramCnt', 55, '프로그램'),  // L167
  // ⚠ 대응 없음 (GridBuilder L168) addCell
  gb.long('fileCnt', 55, '첨부파일'),  // L169
  // ⚠ 대응 없음 (GridBuilder L170) addCell
  gb.date('startDate', 90, '시작일'),  // L171
  gb.date('dueDate', 90, '완료예정일'),  // L172
  gb.date('resultDate', 90, '완료일'),  // L173
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Scm13_Lookup_DevProgram (`client/vi/scm/Scm13_Lookup_DevProgram.java`, 93줄)

- 입력·하위 화면: `lookup` Scm13_Edit_DevProgram
- 그리드 `grid` (buildApprStepGrid()):
  - programTypeName 100 "구분" Text
  - programCode 310 "프로그램ID" Text
  - deploySeq 60 "배포순서" Long
  - actionCell 30 "소스" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L33-50) → settings(), show()
[E1] closeButton[닫기].Select (L53) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L28-31 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L61-65 | open | 서비스 scm.Scm13_DevProgram.selectByDevId(devId) | 업무 |
| private buildApprStepGrid() | L67-84 | 필드 초기화 | 팝업 Scm13_Edit_DevProgram 열기 | 업무 |
| public clear() | L86-88 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L52-59 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L90-92 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  gb.text('programTypeNm', 100, '구분'),  // L77
  gb.text('programCd', 310, '프로그램ID'),  // L78
  gb.long('deploySeq', 60, '배포순서'),  // L80
  // ⚠ 대응 없음 (GridBuilder L81) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Scm01_Lookup_ApprFile (`client/vi/scm/Scm01_Lookup_ApprFile.java`, 234줄)

- 툴바 `buttonBar`: {updateButton}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer_AView
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 270 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:actionCell1
  - actionCell 50 "받기" Cell 편집:actionCell2
  - actionCell 50 "삭제" Cell 편집:actionCell3

#### 이벤트
[E0] 화면 열림 (생성자 L63-129) → settings(), show()
[E1] fileUpload.Change (L85) → 인라인 L85-92 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L95) → resetFileUpload(), retrieve()
[E3] fileDeleteForm.SubmitComplete (L113) → retrieve()
[E4] updateButton[파일업로드].Select (L132) → 인라인 L132-137 (new SelectHandler(){ @Override public…)
[E5] closeButton[닫기].Select (L139) → hide()
[E6] messageBox.DialogHide [YES] (L186) → 인라인 L186-197 (new DialogHideHandler() { @Override p…)
[E7] fileUpload.Change (L217) → 인라인 L217-224 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L58-61 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L147-156 | E2,E3,open | 서비스 sys.Sys10_File.selectByDevId(devId) | 업무 |
| private buildApprFileGrid() | L158-208 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer_AView 열기, 확인창 표시 | 업무 |
| private resetFileUpload() | L210-225 | E2 | 상태 처리 | 업무 |
| public clear() | L231-233 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L131-145 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L227-229 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 270, '첨부파일'),  // L202
  // ⚠ 대응 없음 (GridBuilder L203) addCell
  // ⚠ 대응 없음 (GridBuilder L204) addCell
  // ⚠ 대응 없음 (GridBuilder L205) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L132-137 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm03_Grid_ExpectProgram (`client/vi/scm/Scm03_Grid_ExpectProgram.java`, 119줄)

- 입력·하위 화면: `lookup` Scm30_Lookup_SelectMulti
- 그리드 `grid` (buildApprStepGrid(), 체크박스(다중)):
  - programTypeName 75 "구분" Text
  - programCode 150 "프로그램ID" Text
  - programName 150 "프로그램명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L59-62) → 초기화
[E1] msgBox.DialogHide [YES] (L93) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insertRow() | L30-57 | 공개 메서드 | 조회창 Scm30_Lookup_SelectMulti 열기 | 업무 |
| public retrieve() | L64-67 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L69-73 | 미사용 후보 | 서비스 scm.Scm03_ExpectProgram.selectBySrId(srId) | 업무 |
| private buildApprStepGrid() | L75-83 | 필드 초기화 | 상태 처리 | 업무 |
| public update() | L85-88 | 공개 메서드 | 서비스 scm.Scm03_ExpectProgram.update | 업무 |
| public deleteChk() | L90-108 | 공개 메서드 | 확인창 표시 | 업무 |
| public deleteRow() | L110-114 | E1 | GridDeleteData scm.Scm03_ExpectProgram.delete(체크된 행 목록) | 업무 |
| public clear() | L116-118 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  gb.text('programTypeNm', 75, '구분'),  // L78 SQL 계산 컬럼(selectBySrId: f_cdnm('ProgramType', scm30_program_typ…)
  gb.text('programCd', 150, '프로그램ID'),  // L79 SQL 계산 컬럼(selectBySrId: scm30_program_cd)
  gb.text('programNm', 150, '프로그램명'),  // L80 SQL 계산 컬럼(selectBySrId: scm30_program_nm)
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Scm30_Lookup_SelectMulti (`client/vi/scm/Scm30_Lookup_SelectMulti.java`, 198줄)

- 툴바 `buttonBar`: 시스템: {systemName} 구분: {programTypeName} 검색: {findTextField} {retrieveButton}
- 입력·하위 화면: `findTextField` TextField, `systemName` ComboBoxField("SystemCode", "%", "전체"), `programTypeName` ComboBoxField("ProgramType", "%", "전체")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - programTypeName 80 "구분" Text
  - programCode 200 "프로그램코드" Text
  - programName 200 "프로그램명" Text
  - note 200 "비고" Text

#### 이벤트
[E1] findTextField.KeyPress [Enter] (L63) → retrieve()
[E2] retrieveButton[조회].Select (L80) → retrieve()
[E3] oKButton[확인].Select (L86) → confirm()
[E4] cancelButton[취소].Select (L92) → hide()
[E5] grid.CellDoubleClick (L123) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-135 | 공개 메서드 | 서비스 scm.Scm30_Program.selectByTextPaging | 업무 |
| public retrieve() | L150-177 | E1,E2 | 상태 처리 | 업무 |
| public confirm() | L179-188 | E3,E5 | 상태 처리 | 업무 |
| private buildGrid() | L137-148 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L190-192 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L194-196 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('programTypeNm', 80, '구분'),  // L142 SQL 계산 컬럼(selectByTextPaging: f_cdnm('ProgramType', scm30_program_typ…)
  gb.text('programCd', 200, '프로그램코드'),  // L143
  gb.text('programNm', 200, '프로그램명'),  // L144
  gb.text('note', 200, '비고'),  // L145
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Scm01_Lookup_ResultContent (`client/vi/scm/Scm01_Lookup_ResultContent.java`, 116줄)

- 입력·하위 화면: `resultContent` MyTextArea

#### 이벤트
[E1] closeButton[닫기].Select (L51) → hide()
[E2] confirmButton[확인].Select (L78) → update()
[E3] closeButton[닫기].Select (L84) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L36-61 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L63-94 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L96-111 | E2 | 서비스 scm.Scm01_Sr.updateResultContent | 업무 |
| private setHtmlHeaderStyle() | L113-115 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="save" onClick={update}>확인</Button>

