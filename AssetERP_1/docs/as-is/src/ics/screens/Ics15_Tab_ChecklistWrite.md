# Ics15_Tab_ChecklistWrite

- 종류: 화면
- 메뉴: 준법감시 > 30. 내부통제 체크리스트 > 내부통제 체크리스트 작성 (#1229)
- 파일: `client/vi/ics/Ics15_Tab_ChecklistWrite.java`
- 함께 쓰는 클래스 2개:
  - `Ics15_Edit_Reason` `client/vi/ics/Ics15_Edit_Reason.java`
  - `Ics10_Edit_Checklist` `client/vi/ics/Ics10_Edit_Checklist.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sch05_Page_RelateIcs`](../../sch/components/Sch05_Page_RelateIcs.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics10_Checklist.modelUpdate` | Ics10_Edit_Checklist:320 | [`Ics10_Checklist.java:69`](../../ics/services/Ics10_Checklist.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md), `UpdateDataModel(ics10_checklist)` 동적 INSERT/UPDATE → [`ics10_checklist.selectById`](../../ics/sql/ics10_checklist.md) |
| `ics.Ics10_Checklist.selectByPersonId` | Ics15_Tab_ChecklistWrite:448 | [`Ics10_Checklist.java:53`](../../ics/services/Ics10_Checklist.md) | [`ics10_checklist.selectByPersonId`](../../ics/sql/ics10_checklist.md) |
| `ics.Ics15_ChecklistWrite.deleteByPersonId` | Ics15_Tab_ChecklistWrite:461 | [`Ics15_ChecklistWrite.java:166`](../../ics/services/Ics15_ChecklistWrite.md) | [`ics15_checklist_write.selectWrite`](../../ics/sql/ics15_checklist_write.md), `UpdateDataModel(ics15_checklist_write)` 동적 DELETE |
| `ics.Ics15_ChecklistWrite.modelUpdate` | Ics15_Edit_Reason:90, Ics15_Tab_ChecklistWrite:382 | [`Ics15_ChecklistWrite.java:137`](../../ics/services/Ics15_ChecklistWrite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics15_checklist_write)` 동적 INSERT/UPDATE → [`ics15_checklist_write.selectById`](../../ics/sql/ics15_checklist_write.md) |
| `ics.Ics15_ChecklistWrite.selectById` | Ics15_Tab_ChecklistWrite:564 | [`Ics15_ChecklistWrite.java:23`](../../ics/services/Ics15_ChecklistWrite.md) | [`ics15_checklist_write.selectById`](../../ics/sql/ics15_checklist_write.md) |
| `ics.Ics15_ChecklistWrite.updateAnswerCode` | Ics15_Tab_ChecklistWrite:322 | [`Ics15_ChecklistWrite.java:29`](../../ics/services/Ics15_ChecklistWrite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics15_checklist_write.selectByPersonId`](../../ics/sql/ics15_checklist_write.md), [`ics15_checklist_write.updateAnswerCode`](../../ics/sql/ics15_checklist_write.md), `UpdateDataModel(ics15_checklist_write)` 동적 INSERT/UPDATE → [`ics15_checklist_write.selectById`](../../ics/sql/ics15_checklist_write.md) |
| `ics.Ics15_ChecklistWrite.updateFixYn` | Ics15_Tab_ChecklistWrite:634 | [`Ics15_ChecklistWrite.java:150`](../../ics/services/Ics15_ChecklistWrite.md) | [`ics15_checklist_write.updateFixYn`](../../ics/sql/ics15_checklist_write.md) |
| `sch.Sch05_RelateIcs.modelUpdate` | Ics10_Edit_Checklist:254 | [`Sch05_RelateIcs.java:40`](../../sch/services/Sch05_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE → [`sch05_relate_ics.selectById`](../../sch/sql/sch05_relate_ics.md) |
| `sys.Sys01_Company.selectById` | Ics15_Tab_ChecklistWrite:130 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys09_Code.selectByIcs21` | Ics10_Edit_Checklist:54, Ics15_Tab_ChecklistWrite:71 | [`Sys09_Code.java:213`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs21`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByIcs23` | Ics10_Edit_Checklist:55, Ics15_Tab_ChecklistWrite:72 | [`Sys09_Code.java:222`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs23`](../../sys/sql/sys09_code.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics15_Tab_ChecklistWrite (`client/vi/ics/Ics15_Tab_ChecklistWrite.java`, 721줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {yyyyText} {periodComboBox} 대분류: {icsChecklistLComboBox} 중분류: {icsChecklistMComboBox} 검색: {searchText} {checkBox} {retrieveButton} {fixButton} {cancelButton} {deleteButton}
- 입력·하위 화면: `icsChecklistLComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "%", "전체"), `icsChecklistMComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "%", "전체"), `periodComboBox` ComboBoxField("MonthsCode"), `checkBox` CheckBox, `yyyyText` TextField, `searchText` TextField 빈칸="대분류/중분류/체크내용/근거", `lookup` Ics10_Edit_Checklist
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - checkLClassName 180 "대분류" Text
  - checkMClassName 230 "중분류" Text
  - content 600 "체크대상" TextArea
  - actionCell 40 " " Cell 편집:actionCell
  - yes 70 "예" Boolean
  - no 70 "아니오" Boolean
  - not 70 "해당없음" Boolean
  - reason 300 "체크내용" TextArea
  - actionCell 40 " " Cell 편집:editCell
  - fixYn 80 "제출여부" BooleanYn
  - confirmYn 80 "확인여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L92-127) → settings()
[E1] yyyyText.ValueChange (L158) → getDate()
[E2] periodComboBox[MonthsCode].ValueChange (L172) → getDate()
[E3] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L201) → refreshCode()
[E4] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L219) → retrieve()
[E5] searchText.KeyPress [Enter] (L228) → retrieve()
[E6] retrieveButton[조회].Select (L240) → retrieve()
[E7] fixButton[제출].Select (L246) → fixChk()
[E8] cancelButton[제출취소].Select (L252) → fixChk()
[E9] deleteButton[새로작성].Select (L258) → delete()
[E10] messageBox.DialogHide (L262) → delete()
[E11] sendMailButton[메일발송].Select (L274) → sendMail()
[E12] grid.getStore().StoreRecordChange [chkModel.getConfirmYn()] (L280) → getDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L421-458 | E4,E5,E6,buildGrid,delete,refreshCode,preFixCheck,fixChk | 서비스 ics.Ics10_Checklist.selectByPersonId(companyId, personId, stdDate, checklistLClassId, checklistMClassId, searchText, checkBox, cycleType) | 업무 |
| private delete() | L460-480 | E9,E10 | 서비스 ics.Ics15_ChecklistWrite.deleteByPersonId(companyId, personId, checkYyyymm, cycleType) | 업무 |
| private refreshCode() | L482-498 | E3 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| protected enable() | L500-559 | settings | 상태 처리 | 업무 |
| private lookupReason() | L561-584 | buildGrid | 팝업 Ics15_Edit_Reason 열기, 서비스 ics.Ics15_ChecklistWrite.selectById(checklistWriteId) | 업무 |
| private preFixCheck() | L586-590 | fixChk | 상태 처리 | 업무 |
| private fixChk() | L592-656 | E7,E8 | 서비스 ics.Ics15_ChecklistWrite.updateFixYn(fixYn) | 업무 |
| private sendMail() | L658-684 | E11 | 팝업 AlarmPopup 열기 | 업무 |
| private getDate() | L686-707 | E1,E2,E12,buildGrid,retrieve,delete,refreshCode | 상태 처리 | 업무 |
| private settings() | L129-345 | 생성자 | 확인창 표시, 서비스 sys.Sys01_Company.selectById, ics.Ics15_ChecklistWrite.updateAnswerCode(companyId, checklistId, companyId, personId, answerCode, checkYyyymm, cycleType), 이벤트 연결, 초기값: yyyyText=startYear, checkBox=false("미체크 보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L347-419 | 필드 초기화 | 팝업 Ics10_Edit_Checklist 열기, 미선택 시 alert "담당자가 확인처리한 체크리스트로 수정이 불가능합니다", 서비스 ics.Ics15_ChecklistWrite.modelUpdate, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L709-712 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L714-716 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L718-720 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L405 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle13 100 "체크" (ics10_new_header_group_map05new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.text('checkLClassNm', 180, '대분류'),  // L406 SQL 계산 컬럼(selectById: a.ics23_checklist_l_class_nm)
  gb.text('checkMClassNm', 230, '중분류'),  // L407 SQL 계산 컬럼(selectById: a.ics23_checklist_m_class_nm)
  gb.textArea('content', 600, '체크대상'),  // L408
  // ⚠ 대응 없음 (GridBuilder L409) addCell
  // ⚠DB없음 L410 yes 70 "예" (ics10_yes 컬럼 없음)
  // ⚠DB없음 L411 no 70 "아니오" (ics10_no 컬럼 없음)
  // ⚠DB없음 L412 not 70 "해당없음" (ics10_not 컬럼 없음)
  gb.textArea('reason', 300, '체크내용'),  // L413
  // ⚠ 대응 없음 (GridBuilder L414) addCell
  gb.booleanYn('fixYn', 80, '제출여부'),  // L415 SQL 계산 컬럼(selectByPersonId: COALESCE(ics15_fix_yn, 'false'))
  gb.booleanYn('confirmYn', 80, '확인여부'),  // L416 SQL 계산 컬럼(selectByPersonId: COALESCE(ics15_confirm_yn, 'false'))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={fixChk}>제출</Button>
3. <Button type="cancel" onClick={fixChk}>제출취소</Button>
4. <Button type="view" onClick={delete}>새로작성</Button>
5. <Button type="send" onClick={sendMail}>메일발송</Button>

### Ics15_Edit_Reason (`client/vi/ics/Ics15_Edit_Reason.java`, 106줄)

- 입력·하위 화면: `reason` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L50-70) → settings(), show()
[E1] updateButton[저장].Select (L73) → update()
[E2] closeButton[닫기].Select (L79) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L40-48 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L87-101 | E1 | 서비스 ics.Ics15_ChecklistWrite.modelUpdate | 업무 |
| private settings() | L72-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L103-105 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics10_Edit_Checklist (`client/vi/ics/Ics10_Edit_Checklist.java`, 345줄)

- 툴바 `buttonBar`: {insertIcsButton} {deleteIcsButton}
- 입력·하위 화면: `checkLClassName` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "선택하세요"), `checkMClassName` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "선택하세요"), `content` MyTextArea, `criterion` MyTextArea, `useYn` CheckBox, `seq` LongField, `checklistMClassId` LongField, `relateIcsPage` Sch05_Page_RelateIcs, `lookup` Ics01_Lookup_SelectMulti

#### 이벤트
[E0] 화면 열림 (생성자 L125-182) → settings(), show()
[E1] checkLClassName[대분류].Collapse (L206) → refreshCode()
[E2] checkMClassName[중분류].Collapse (L226) → 인라인 L226-231 (new CollapseHandler() { @Override pub…)
[E3] insertIcsButton[행 추가].Select (L233) → 서비스 sch.Sch05_RelateIcs.modelUpdate
[E4] deleteIcsButton[행 삭제].Select (L270) → 인라인 L270-275 (new SelectHandler(){ @Override public…)
[E5] updateButton[저장].Select (L276) → update()
[E6] closeButton[닫기].Select [callback == null] (L282) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L80-89 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L91-123 | 공개 메서드 | 상태 처리 | 업무 |
| private refreshCode() | L296-306 | E1 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| private update() | L308-336 | E5 | 서비스 ics.Ics10_Checklist.modelUpdate | 업무 |
| private settings() | L184-294 | 생성자 | 조회창 Ics01_Lookup_SelectMulti 열기, 서비스 sch.Sch05_RelateIcs.modelUpdate, 이벤트 연결, 초기값: checklistMClassId=null, checklistMClassId=Long.parseLong(checkMClassName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L338-340 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L342-344 | edit,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="addRow" onClick={() => /* 서비스 sch.Sch05_RelateIcs.modelUpdate */}>행 추가</Button>
2. <Button type="removeRow" onClick={() => /* 인라인 L270-275 (new SelectHandler(){ @Override public…) */}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

