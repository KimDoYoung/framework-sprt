# Scm01_Tab_Sr

- 종류: 화면
- 메뉴: KFS > 01. 시스템 개발 > 시스템 개발 의뢰 (#1261)
- 파일: `client/vi/scm/Scm01_Tab_Sr.java`
- 함께 쓰는 클래스 7개:
  - `Scm01_Edit_SrRO` `client/vi/scm/Scm01_Edit_SrRO.java`
  - `Scm01_Edit_Sr` `client/vi/scm/Scm01_Edit_Sr.java`
  - `Scm02_Grid_ApprStep` `client/vi/scm/Scm02_Grid_ApprStep.java`
  - `Scm02_Edit_NoteMessage` `client/vi/scm/Scm02_Edit_NoteMessage.java`
  - `Scm02_Edit_ApprStep` `client/vi/scm/Scm02_Edit_ApprStep.java`
  - `Scm01_Lookup_SrContent` `client/vi/scm/Scm01_Lookup_SrContent.java`
  - `Scm01_Grid_ApprFile` `client/vi/scm/Scm01_Grid_ApprFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Org01_Tree_OrgCode`](../../org/components/Org01_Tree_OrgCode.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys10_Lookup_FileViewer_AView`](../../sys/components/Sys10_Lookup_FileViewer_AView.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.selectByOrgCodeId` | Scm02_Edit_ApprStep:78 | [`Emp00_TransInfo.java:110`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByOrgCodeId`](../../emp/sql/emp00_trans_info.md) |
| `scm.Scm01_Sr.delete` | Scm01_Tab_Sr:334 | [`Scm01_Sr.java:118`](../../scm/services/Scm01_Sr.md) | `UpdateDataModel(scm01_sr)` 동적 DELETE |
| `scm.Scm01_Sr.selectById` | Scm01_Edit_Sr:476, Scm01_Edit_Sr:560 | [`Scm01_Sr.java:21`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.selectById`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.selectByText` | Scm01_Tab_Sr:277 | [`Scm01_Sr.java:26`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.selectByText`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.update` | Scm01_Edit_Sr:426 | [`Scm01_Sr.java:77`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.createSrNo`](../../scm/sql/scm01_sr.md), `UpdateDataModel(scm01_sr)` 동적 INSERT/UPDATE → [`scm01_sr.selectById`](../../scm/sql/scm01_sr.md) |
| `scm.Scm01_Sr.updateContent` | Scm01_Lookup_SrContent:136 | [`Scm01_Sr.java:96`](../../scm/services/Scm01_Sr.md) | [`scm01_sr.updateContent`](../../scm/sql/scm01_sr.md) |
| `scm.Scm02_SrApprStep.modelUpdate` | Scm01_Edit_Sr:698, Scm02_Edit_NoteMessage:99 | [`Scm02_SrApprStep.java:37`](../../scm/services/Scm02_SrApprStep.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(scm02_sr_appr_step)` 동적 INSERT/UPDATE → [`scm02_sr_appr_step.selectById`](../../scm/sql/scm02_sr_appr_step.md) |
| `scm.Scm02_SrApprStep.selectBySrId` | Scm02_Grid_ApprStep:75 | [`Scm02_SrApprStep.java:25`](../../scm/services/Scm02_SrApprStep.md) | [`scm02_sr_appr_step.selectBySrId`](../../scm/sql/scm02_sr_appr_step.md) |
| `scm.Scm02_SrApprStep.updateList` | Scm01_Edit_Sr:466, Scm01_Edit_Sr:551 | [`Scm02_SrApprStep.java:51`](../../scm/services/Scm02_SrApprStep.md) | [`scm02_sr_appr_step.deleteBySrId`](../../scm/sql/scm02_sr_appr_step.md), `UpdateDataModel(scm02_sr_appr_step)` 동적 INSERT/UPDATE → [`scm02_sr_appr_step.selectById`](../../scm/sql/scm02_sr_appr_step.md) |
| `sys.Sys10_File.selectByParentId` | Scm01_Grid_ApprFile:80 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`scm01_sr`](../../../db/tables/scm.md), [`scm02_sr_appr_step`](../../../db/tables/scm.md), [`scm10_dev`](../../../db/tables/scm.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_get_dev_status`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_org_seq`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Scm01_Tab_Sr (`client/vi/scm/Scm01_Tab_Sr.java`, 364줄)

- 레이아웃: north=vlc, center=editBoard1, south=editBoard2
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 시스템: {systemComboBox} 상태: {srStatusComboBox} {checkBox01} {retrieveButton} {insertButton} {deleteButton}
- 툴바 `buttonBar02`: 검색조건: {searchText} {checkBox02} {checkBoxMyReg}
- 입력·하위 화면: `searchText` TextField 빈칸="등록자/요청자/요청내용/처리내용/결재(합의/참조)자/SR번호", `startDate` MyDateField, `closeDate` MyDateField, `systemComboBox` ComboBoxField("SystemCode", "%", "전체"), `srStatusComboBox` ComboBoxField("SrStatus", "%", "전체"), `editBoard1` Scm01_Edit_Sr, `editBoard2` Scm01_Edit_SrRO, `checkBox01` CheckBox, `checkBox02` CheckBox, `checkBoxMyReg` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스):
  - srDate 100 "요청일" Date
  - systemName 120 "시스템구분" TextCenter
  - srTypeName 100 "요청구분" Text
  - personName 70 "등록자" TextCenter
  - requestorCorpName 130 "요청자" Text
  - srArrangeContent 650 "요청내용" Text
  - fileCount 70 "첨부파일" LongCenter
  - apprStatusName 100 "승인상태" TextCenter
  - srStatusName 100 "처리상태" TextCenter
  - closeDate 100 "처리완료일" Date
  - srNo 100 "SR번호" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L74-130) → settings()
[E1] grid.RowClick (L124) → retrieveEditPage()
[E2] systemComboBox[SystemCode].Collapse (L152) → retrieve()
[E3] srStatusComboBox[SrStatus].Collapse (L160) → retrieve()
[E4] searchText.KeyPress [Enter] (L178) → retrieve()
[E5] retrieveButton[조회].Select (L186) → retrieve()
[E6] insertButton[등록].Select (L192) → insertRow()
[E7] deleteButton[삭제].Select (L198) → deleteRow()
       └ [E8] messageBox.DialogHide (L319) → deleteSelectedRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L227-248 | E1,retrieve,insertRow,deleteSelectedRow | 상태 처리 | 업무 |
| public retrieve() | L250-291 | E2,E3,E4,E5,settings | 서비스 scm.Scm01_Sr.selectByText(startDate, closeDate, searchText, systemCode, srStatus, checkBox01, checkBox02, checkBoxMyReg, personId, gubun) | 업무 |
| public insertRow() | L293-307 | E6 | 상태 처리 | 업무 |
| public deleteRow() | L309-329 | E7 | 미선택 시 alert "상신중이거나 완료/반려된 문서는 삭제가 불가능합니다" → 확인창 E8 | 업무 |
| private deleteSelectedRow() | L331-345 | E8 | GridDeleteData scm.Scm01_Sr.delete(체크된 행 목록) | 업무 |
| private editmask() | L347-355 | retrieveEditPage | 상태 처리 | 업무 |
| private settings() | L132-206 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, checkBox01=true("미완료건만 보기"), checkBox02=true("미승인건만 보기"), checkBoxMyReg=true("내 등록건만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L208-225 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L357-359 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L361-363 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('srDate', 100, '요청일'),  // L212
  gb.textCenter('systemNm', 120, '시스템구분'),  // L213
  gb.text('srTypeNm', 100, '요청구분'),  // L214
  gb.textCenter('personNm', 70, '등록자'),  // L215
  gb.text('requestorCorpNm', 130, '요청자'),  // L216
  gb.text('srArrangeContent', 650, '요청내용'),  // L217
  gb.longCenter('fileCount', 70, '첨부파일'),  // L218
  gb.textCenter('apprStatusNm', 100, '승인상태'),  // L219
  gb.textCenter('srStatusNm', 100, '처리상태'),  // L220
  gb.date('closeDate', 100, '처리완료일'),  // L221
  gb.textCenter('srNo', 100, 'SR번호'),  // L222
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Scm01_Edit_SrRO (`client/vi/scm/Scm01_Edit_SrRO.java`, 128줄)

- 입력·하위 화면: `srStatusCode` TextField, `resultContent` MyTextArea, `dueDate` MyDateField, `closeDate` MyDateField, `srStatusName` ComboBoxField("SrStatus")

#### 이벤트
[E0] 화면 열림 (생성자 L49-65) → settings(), getEditor(), show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L74-104 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L106-114 | 공개 메서드 | 상태 처리 | 업무 |
| public init() | L116-118 | 공개 메서드 | 상태 처리 | 업무 |
| public getServiceResult() | L121-123 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L67-72 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L125-127 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Scm01_Edit_Sr (`client/vi/scm/Scm01_Edit_Sr.java`, 773줄)

- 입력·하위 화면: `corpId` LongField, `systemCode` TextField, `srType` TextField, `requestor` TextField 빈칸="요청자", `srDate` MyDateField, `srContent` MyTextArea, `systemName` ComboBoxField("SystemCode"), `srTypeName` ComboBoxField("SrType"), `corpName` LookupTriggerField 빈칸="요청사", `lookupCorp` Sys15_Lookup_Corp, `lookup` Scm01_Lookup_SrContent

#### 이벤트
[E0] 화면 열림 (생성자 L124-178) → settings(), getEditor(), show()
[E1] fileUpload.Change (L135) → 인라인 L135-142 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L145) → resetFileUpload()
[E3] corpName[요청자].TriggerClick [result != null] (L192) → 인라인 L192-211 (new TriggerClickHandler(){ @Override …)
[E4] uploadFileButton[첨부파일].Select (L213) → 인라인 L213-218 (new SelectHandler() { @Override publi…)
[E5] apprStepButton[결재선].Select (L219) → 인라인 L219-224 (new SelectHandler() { @Override publi…)
[E6] tempUpdateButton[저장].Select (L225) → updateRow()
[E7] updateButton[결재요청].Select (L231) → updateRow()
[E8] cancelButton[전체 초기화].Select (L237) → cancelRow()
       └ [E14] messageBox.DialogHide [YES] (L511) → cancel()
[E9] confirmButton[승인].Select [YES] (L243) → updateApprStep()
[E10] msgBox.DialogHide [YES] (L248) → updateApprStep()
[E11] rejectButton[반려].Select [YES] (L266) → updateApprStep()
[E12] msgBox.DialogHide [YES] (L271) → updateApprStep()
[E13] anchor.MouseDown (L294) → 인라인 L294-309 (new MouseDownHandler() { @Override pu…)
[E15] fileUpload.Change (L746) → 인라인 L746-753 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L291-363 | 생성자 | 조회창 Scm01_Lookup_SrContent 열기 | 업무 |
| public retrieve() | L365-378 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L380-500 | E6,E7 | 서비스 scm.Scm01_Sr.update, scm.Scm02_SrApprStep.updateList, scm.Scm01_Sr.selectById(apprStepList, srId, sms, srId) | 업무 |
| public cancelRow() | L502-520 | E8 | ConfirmBox → E14 | 업무 |
| private cancel() | L522-578 | E14 | 서비스 scm.Scm01_Sr.update, scm.Scm02_SrApprStep.updateList, scm.Scm01_Sr.selectById(apprStepList, srId, sms, srId) | 업무 |
| public init() | L580-585 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveApproval() | L587-595 | retrieve,updateRow,cancel | 상태 처리 | 업무 |
| private retrieveApprStep() | L597-691 | retrieve,updateRow,cancel,updateApprStep | 상태 처리 | 업무 |
| private updateApprStep() | L693-737 | E9,E10,E11,E12 | 서비스 scm.Scm02_SrApprStep.modelUpdate, scm.Scm01_Sr.update | 업무 |
| private resetFileUpload() | L739-754 | E2 | 상태 처리 | 업무 |
| private settings() | L181-289 | 생성자 | 조회창 Sys15_Lookup_Corp 열기, 확인창 표시, 이벤트 연결, 초기값: corpId=resultModel.getCorpId(, corpName=resultModel.getCorpName(("요청자"), corpId=null, corpName=null("요청자") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L756-758 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateRow}>저장</Button>
2. <Button type="register" onClick={updateRow}>결재요청</Button>
3. <Button type="save" onClick={updateApprStep}>승인</Button>
4. <Button type="cancel" onClick={updateApprStep}>반려</Button>
5. <Button type="unknown" onClick={cancelRow}>전체 초기화</Button>
6. <Button type="upload" onClick={() => /* 인라인 L213-218 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
7. <Button type="unknown" onClick={() => /* 인라인 L219-224 (new SelectHandler() { @Override publi…) */}>결재선 설정</Button>

### Scm02_Grid_ApprStep (`client/vi/scm/Scm02_Grid_ApprStep.java`, 165줄)

- 입력·하위 화면: `editor` Scm02_Edit_ApprStep
- 그리드 `apprStepGrid` (buildApprStepGrid()):
  - stepTypeName 80 "구분" TextNotSort
  - stepStatusName 80 "결재상태" TextNotSort
  - apprDate 100 "결재일" DateNotSort
  - stepApprName 150 "결재자" TextNotSort
  - actionCell 80 "결재의견" CellNotSort 편집:detailCell
  - actionCell 80 "반려사유" CellNotSort 편집:rejectCell

#### 이벤트
[E0] 화면 열림 (생성자 L51-61) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L35-49 | 공개 메서드 | 팝업 Scm02_Edit_ApprStep 열기 | 업무 |
| public retrieve() | L63-66 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieveApprStepGrid() | L69-76 | retrieve | 서비스 scm.Scm02_SrApprStep.selectBySrId(companyId, personId, srId, baseDate) | 업무 |
| private buildApprStepGrid() | L79-110 | 필드 초기화 | 팝업 Scm02_Edit_NoteMessage 열기 | 업무 |
| public changeRow() | L112-142 | 공개 메서드 | 상태 처리 | 업무 |
| public getSeq() | L144-150 | changeRow | 상태 처리 | 업무 |
| public getApprStepGrid() | L152-154 | 공개 메서드 | 상태 처리 | 업무 |
| public clearApprStep() | L156-160 | 공개 메서드 | 상태 처리 | 업무 |
| public clear() | L162-164 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L102) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L103) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L104) addDateNotSort
  // ⚠ 대응 없음 (GridBuilder L105) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L106) addCellNotSort
  // ⚠ 대응 없음 (GridBuilder L107) addCellNotSort
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Scm02_Edit_NoteMessage (`client/vi/scm/Scm02_Edit_NoteMessage.java`, 119줄)

- 입력·하위 화면: `rejectReason` TextArea, `note` TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L67-79) → settings(), show()
[E1] updateButton[저장].Select (L82) → update()
[E2] closeButton[닫기].Select (L88) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L36-65 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L96-114 | E1 | 서비스 scm.Scm02_SrApprStep.modelUpdate | 업무 |
| public settings() | L81-94 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L116-118 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Scm02_Edit_ApprStep (`client/vi/scm/Scm02_Edit_ApprStep.java`, 322줄)

- 레이아웃: west=treePanel, center=empPanel
- 입력·하위 화면: `buildTree` Org01_Tree_OrgCode
- 그리드 `empGrid` (buildEmpGrid(), 체크박스):
  - orgKorName 200 "부서명" Text
  - titleName 80 "직책" Text
  - empKorName 80 "성명" Text
  - actionCell 80 "결재" Cell 편집:actionCell01
  - actionCell 80 "합의" Cell 편집:actionCell02
  - actionCell 80 "참조" Cell 편집:actionCell03
- 그리드 `apprStepGrid` (buildApprStepGrid(), 체크박스):
  - stepTypeName 40 "구분" TextNotSort
  - orgKorName 200 "부서명" TextNotSort
  - titleName 80 "직책" TextNotSort
  - empKorName 80 "성명" TextNotSort
  - actionCell 70 "위로" Cell 편집:upButton
  - actionCell 70 "아래로" Cell 편집:downButton
  - actionCell 70 "삭제" Cell 편집:deleteButton

#### 이벤트
[E0] 화면 열림 (생성자 L59-141) → 초기화
[E1] orgTree.SelectionChanged [orgCodeModel != null] (L71) → 서비스 emp.Emp00_TransInfo.selectByOrgCodeId(orgCodeId)
[E2] confirmButton[확인].Select (L115) → hide()
[E3] closeButton[닫기].Select (L125) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public makeMeLine() | L55-57 | 공개 메서드 | 상태 처리 | 업무 |
| public buildEmpGrid() | L143-173 | 필드 초기화 | 상태 처리 | 업무 |
| public buildApprStepGrid() | L175-206 | 필드 초기화 | 상태 처리 | 업무 |
| public insertApprovalEmp() | L208-217 | makeMeLine,buildEmpGrid | 상태 처리 | 업무 |
| public insertApprovalEmp() | L219-273 | makeMeLine,buildEmpGrid | 상태 처리 | 업무 |
| public changeRow() | L275-305 | buildApprStepGrid | 상태 처리 | 업무 |
| public getSeq() | L307-313 | insertApprovalEmp,changeRow | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L315-317 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L319-321 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildEmpGrid = () => [
  gb.text('korNm', 200, '부서명'),  // L165
  gb.text('titleNm', 80, '직책'),  // L166
  gb.text('korNm', 80, '성명'),  // L167
  // ⚠ 대응 없음 (GridBuilder L168) addCell
  // ⚠ 대응 없음 (GridBuilder L169) addCell
  // ⚠ 대응 없음 (GridBuilder L170) addCell
];

const buildApprStepGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L197) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L198) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L199) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L200) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L201) addCell
  // ⚠ 대응 없음 (GridBuilder L202) addCell
  // ⚠ 대응 없음 (GridBuilder L203) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={hide}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

