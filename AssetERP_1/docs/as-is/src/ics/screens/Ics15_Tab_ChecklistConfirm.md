# Ics15_Tab_ChecklistConfirm

- 종류: 화면
- 메뉴: 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 확인(부서장) (#1230)
- 파일: `client/vi/ics/Ics15_Tab_ChecklistConfirm.java`
- 함께 쓰는 클래스 3개:
  - `Ics16_Lookup_RelateAppr` `client/vi/ics/Ics16_Lookup_RelateAppr.java`
  - `Ics15_Lookup_Rd_ChecklistConfirm` `client/vi/ics/Ics15_Lookup_Rd_ChecklistConfirm.java`
  - `Ics10_Edit_Checklist` `client/vi/ics/Ics10_Edit_Checklist.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sch05_Page_RelateIcs`](../../sch/components/Sch05_Page_RelateIcs.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Ics16_Lookup_RelateAppr:175 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ics16_Lookup_RelateAppr:310 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `ics.Ics10_Checklist.modelUpdate` | Ics10_Edit_Checklist:320 | [`Ics10_Checklist.java:69`](../../ics/services/Ics10_Checklist.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md), `UpdateDataModel(ics10_checklist)` 동적 INSERT/UPDATE → [`ics10_checklist.selectById`](../../ics/sql/ics10_checklist.md) |
| `ics.Ics11_ChecklistCompany.selectChecklistStatusPaging` | Ics15_Tab_ChecklistConfirm:128 | [`Ics11_ChecklistCompany.java:40`](../../ics/services/Ics11_ChecklistCompany.md) | [`ics11_checklist_company.selectChecklistStatusPaging`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectChecklistStatusPagingTotal`](../../ics/sql/ics11_checklist_company.md) |
| `ics.Ics15_ChecklistWrite.updateConfirmYn` | Ics15_Tab_ChecklistConfirm:566 | [`Ics15_ChecklistWrite.java:79`](../../ics/services/Ics15_ChecklistWrite.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics15_checklist_write.selectByPersonId`](../../ics/sql/ics15_checklist_write.md), [`ics15_checklist_write.updateConfirmYn`](../../ics/sql/ics15_checklist_write.md), `UpdateDataModel(ics15_checklist_write)` 동적 INSERT/UPDATE → [`ics15_checklist_write.selectById`](../../ics/sql/ics15_checklist_write.md) |
| `ics.Ics16_RelateAppr.selectByConfirmerId` | Ics16_Lookup_RelateAppr:222 | [`Ics16_RelateAppr.java:45`](../../ics/services/Ics16_RelateAppr.md) | [`ics16_relate_appr.selectByConfirmerId`](../../ics/sql/ics16_relate_appr.md) |
| `ics.Ics16_RelateAppr.updateApprId` | Ics16_Lookup_RelateAppr:362 | [`Ics16_RelateAppr.java:63`](../../ics/services/Ics16_RelateAppr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics16_relate_appr.selectByCompanyId`](../../ics/sql/ics16_relate_appr.md), [`ics16_relate_appr.updateApprId`](../../ics/sql/ics16_relate_appr.md), `UpdateDataModel(ics16_relate_appr)` 동적 INSERT/UPDATE → [`ics16_relate_appr.selectById`](../../ics/sql/ics16_relate_appr.md) |
| `sch.Sch05_RelateIcs.modelUpdate` | Ics10_Edit_Checklist:254 | [`Sch05_RelateIcs.java:40`](../../sch/services/Sch05_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE → [`sch05_relate_ics.selectById`](../../sch/sql/sch05_relate_ics.md) |
| `sys.Sys01_Company.selectById` | Ics15_Tab_ChecklistConfirm:143 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys09_Code.selectByIcs21` | Ics10_Edit_Checklist:54, Ics15_Tab_ChecklistConfirm:68 | [`Sys09_Code.java:213`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs21`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByIcs23` | Ics10_Edit_Checklist:55, Ics15_Tab_ChecklistConfirm:69 | [`Sys09_Code.java:222`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs23`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.getServerPath` | Ics16_Lookup_RelateAppr:451 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys99_Print.insertRdChecklistConfirm` | Ics15_Tab_ChecklistConfirm:283 | [`Sys99_Print.java:1355`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.selectChecklistStatusPaging`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectChecklistStatusPagingTotal`](../../ics/sql/ics11_checklist_company.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdChecklistDetail` | Ics16_Lookup_RelateAppr:387, Ics16_Lookup_RelateAppr:434 | [`Sys99_Print.java:1408`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.selectChecklistStatusPaging`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectChecklistStatusPagingTotal`](../../ics/sql/ics11_checklist_company.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics16_relate_appr`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch02_share`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_confirmer_limit`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics15_Tab_ChecklistConfirm (`client/vi/ics/Ics15_Tab_ChecklistConfirm.java`, 599줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar1`: 기준 분기(월): {yyyyText} {periodComboBox} 대분류: {icsChecklistLComboBox} 중분류: {icsChecklistMComboBox} {retrieveButton} {downLoadButton} {confirmButton} {cancleButton} {apprButton}
- 툴바 `buttonBar2`: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;검색: {searchText} {unCheckYn} {unConfirmYn}
- 입력·하위 화면: `icsChecklistLComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "%", "전체"), `icsChecklistMComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "%", "전체"), `unCheckYn` CheckBox, `unConfirmYn` CheckBox, `periodComboBox` ComboBoxField("MonthsCode"), `yyyyText` TextField, `searchText` TextField 빈칸="대분류/중분류/체크대상/담당부서/담당자", `lookupRdCheckConfirm` Ics15_Lookup_Rd_ChecklistConfirm, `lookup` Ics10_Edit_Checklist
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - checkLClassName 180 "대분류" Text
  - checkMClassName 230 "중분류" Text
  - content 600 "체크대상" TextArea
  - actionCell 40 " " Cell 편집:actionCell
  - reason 300 "체크결과" TextArea
  - orgName 100 "담당부서" Text
  - personName 100 "담당자" Text
  - confirmYn 80 "확인여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L91-140) → settings()
[E1] yyyyText.ValueChange (L169) → getDate()
[E2] periodComboBox[MonthsCode].ValueChange (L183) → getDate()
[E3] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L216) → refreshCode()
[E4] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L234) → retrieve()
[E5] searchText.KeyPress [Enter] (L243) → retrieve()
[E6] retrieveButton[조회].Select (L257) → retrieve()
[E7] downLoadButton[출력/다운로드].Select (L263) → getDate()
[E8] confirmButton[확인].Select (L314) → confirmChk()
       └ [E11] msgBox.DialogHide [YES] (L516) → confirm()
       └ [E12] msgBox.DialogHide [YES] (L534) → confirm()
[E9] cancleButton[확인취소].Select (L320) → confirmChk()
[E10] apprButton[상신].Select (L326) → listPopup()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private refreshCode() | L334-350 | E3 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| protected enable() | L352-411 | settings | 상태 처리 | 업무 |
| public retrieve() | L442-482 | E4,E5,E6,refreshCode,confirm | 상태 처리 | 업무 |
| private getDate() | L484-505 | E1,E2,E7,refreshCode,retrieve,confirm | 상태 처리 | 업무 |
| private confirmChk() | L507-552 | E8,E9 | ConfirmBox → E11 | 업무 |
| private confirm() | L554-580 | E11,E12 | 미선택 시 alert "선택한 체크대상중에 결과값이 없는 대상이 포함되어 있습니다", 서비스 ics.Ics15_ChecklistWrite.updateConfirmYn(confirmerId, checkYyyymm, cycleType, confirmYn) | 업무 |
| private listPopup() | L582-590 | E10 | 조회창 Ics16_Lookup_RelateAppr 열기 | 업무 |
| private settings() | L142-332 | 생성자 | 조회창 Ics15_Lookup_Rd_ChecklistConfirm 열기 → 콜백: unmask, 서비스 sys.Sys01_Company.selectById, sys.Sys99_Print.insertRdChecklistConfirm(companyId, companyId, personId, windowClassName, stdDate, checklistLClassId, checklistMClassId, cycleType, searchText, unCheckYn, unConfirmYn, confirmerId), 이벤트 연결, 초기값: yyyyText=startYear, unCheckYn=false("미체크 보기"), unConfirmYn=false("미확인 보기") | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L413-440 | 필드 초기화 | 팝업 Ics10_Edit_Checklist 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L592-594 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L596-598 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('checkLClassNm', 180, '대분류'),  // L430
  gb.text('checkMClassNm', 230, '중분류'),  // L431
  gb.textArea('content', 600, '체크대상'),  // L432
  // ⚠ 대응 없음 (GridBuilder L433) addCell
  gb.textArea('reason', 300, '체크결과'),  // L434
  gb.text('orgNm', 100, '담당부서'),  // L435
  gb.text('personNm', 100, '담당자'),  // L436
  gb.booleanYn('confirmYn', 80, '확인여부'),  // L437
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={getDate}>출력/다운로드</Button>
3. <Button type="save" onClick={confirmChk}>확인</Button>
4. <Button type="cancel" onClick={confirmChk}>확인취소</Button>
5. <Button type="register" onClick={listPopup}>상신</Button>

### Ics16_Lookup_RelateAppr (`client/vi/ics/Ics16_Lookup_RelateAppr.java`, 538줄)

- 툴바 `buttonBar`: 분기(월): {yyyyText} {periodComboBox} {retrieveButton}
- 입력·하위 화면: `yyyyText` TextField, `periodComboBox` ComboBoxField("MonthsCode"), `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - checkLClassName 220 "대분류" Text
  - totalCount 80 "전체건수" Long
  - confirmCount 80 "확인건수" Long
  - actionCell 60 "미리보기" Cell 편집:rdViewCell
  - statusName 80 "결재상태" TextCenter
  - actionCell 60 "결재요청" Cell 편집:actionCell
  - actionCell 60 "문서보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L106-132) → settings(), show()
[E1] retrieveButton[조회].Select (L138) → retrieve()
[E2] cancleButton[닫기].Select (L144) → hide()
[E3] msgBox.DialogHide [YES] (L287) → linkCheck()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L77-104 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L211-232 | E1,open,buildGrid,updateApprId | 서비스 ics.Ics16_RelateAppr.selectByConfirmerId(companyId, confirmerId, stdDate, cycleType) | 업무 |
| private checkCount() | L234-244 | retrieve | 상태 처리 | 업무 |
| private getDate() | L246-267 | retrieve,updateApprId,viewRd,createRd | 상태 처리 | 업무 |
| private apprCheck() | L269-305 | checkCount | 확인창 표시 | 업무 |
| private linkCheck() | L307-341 | E3,apprCheck | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L343-359 | createRd | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L361-382 | insertLinkApproval | 서비스 ics.Ics16_RelateAppr.updateApprId | 업무 |
| private viewRd() | L384-428 | buildGrid | 미선택 시 alert, 서비스 sys.Sys99_Print.insertRdChecklistDetail(companyId, personId, windowClassName, stdDate, checklistLClassId, checklistMClassId, cycleType, searchText, unCheckYn, unConfirmYn) | 업무 |
| private createRd() | L430-513 | linkCheck | 미선택 시 alert, 서비스 sys.Sys99_Print.insertRdChecklistDetail, sys.Sys10_File.getServerPath(companyId, personId, stdDate, cycleType, windowClassName, checklistLClassId, checklistMClassId, searchText, unCheckYn, unConfirmYn, companyId) | 업무 |
| private mask() | L515-521 | viewRd,createMask | 상태 처리 | 업무 |
| private createMask() | L523-529 | insertLinkApproval,updateApprId,createRd | 상태 처리 | 업무 |
| private settings() | L134-150 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L152-209 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 존재하지않습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L531-533 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L535-537 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('checkLClassNm', 220, '대분류'),  // L200 SQL 계산 컬럼(selectByConfirmerId: ics10_check_l_class_nm)
  gb.long('totalCount', 80, '전체건수'),  // L201 SQL 계산 컬럼(selectByConfirmerId: total_count)
  gb.long('confirmCount', 80, '확인건수'),  // L202 SQL 계산 컬럼(selectByConfirmerId: confirm_count)
  // ⚠ 대응 없음 (GridBuilder L203) addCell
  gb.textCenter('statusNm', 80, '결재상태'),  // L204 SQL 계산 컬럼(selectByConfirmerId: ( SELECT f_cdnm('AprStatusCode', apr01_…)
  // ⚠ 대응 없음 (GridBuilder L205) addCell
  // ⚠ 대응 없음 (GridBuilder L206) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics15_Lookup_Rd_ChecklistConfirm (`client/vi/ics/Ics15_Lookup_Rd_ChecklistConfirm.java`, 90줄)


#### 이벤트
[E0] 화면 열림 (생성자 L33-54) → show()
[E1] closeButton[닫기].Select (L43) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-84 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L86-88 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

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

