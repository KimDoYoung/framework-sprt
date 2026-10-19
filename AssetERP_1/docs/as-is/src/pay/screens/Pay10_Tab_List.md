# Pay10_Tab_List

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 급여대장 (#1271)
- 파일: `client/vi/pay/Pay10_Tab_List.java`
- 함께 쓰는 클래스 5개:
  - `Pay10_Lookup_Rd_List` `client/vi/pay/Pay10_Lookup_Rd_List.java`
  - `Pay10_Lookup_Journal` `client/vi/pay/Pay10_Lookup_Journal.java`
  - `Pay10_Lookup_GroupList` `client/vi/pay/Pay10_Lookup_GroupList.java`
  - `Pay09_Lookup_Note` `client/vi/pay/Pay09_Lookup_Note.java`
  - `Pay02_Lookup_Rd_Trans` `client/vi/pay/Pay02_Lookup_Rd_Trans.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Pay03_Lookup_PayAccount`](../../pay/components/Pay03_Lookup_PayAccount.md), [`Pay04_Lookup_Formula`](../../pay/components/Pay04_Lookup_Formula.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectPayMonth` | Pay10_Lookup_Journal:122 | [`Act03_JournalDtl.java:45`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectPayMonth`](../../act/sql/act03_journal_dtl.md) |
| `apr.Apr01_Appr.selectById` | Pay10_Tab_List:186 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay10_Tab_List:103, Pay10_Tab_List:520 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `pay.Pay03_Account.selectByStartDate` | Pay10_Tab_List:165, Pay10_Tab_List:571 | [`Pay03_Account.java:28`](../../pay/services/Pay03_Account.md) | [`pay03_account.selectByStartDate`](../../pay/sql/pay03_account.md) |
| `pay.Pay05_RelateAppr.insert` | Pay10_Tab_List:490 | [`Pay05_RelateAppr.java:60`](../../pay/services/Pay05_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay05_relate_appr.insert`](../../pay/sql/pay05_relate_appr.md), [`pay05_relate_appr.selectByCompanyId`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay05_RelateAppr.selectByCompanyId` | Pay10_Tab_List:373 | [`Pay05_RelateAppr.java:26`](../../pay/services/Pay05_RelateAppr.md) | [`pay05_relate_appr.selectByCompanyId`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay05_RelateAppr.updateApprId` | Pay10_Tab_List:582 | [`Pay05_RelateAppr.java:119`](../../pay/services/Pay05_RelateAppr.md) | [`pay05_relate_appr.updateApprId`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay09_RelateNote.checkNote` | Pay09_Lookup_Note:92 | [`Pay09_RelateNote.java:34`](../../pay/services/Pay09_RelateNote.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay09_relate_note.checkNote`](../../pay/sql/pay09_relate_note.md), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.delete` | Pay09_Lookup_Note:260 | [`Pay09_RelateNote.java:86`](../../pay/services/Pay09_RelateNote.md) | `UpdateDataModel(pay09_relate_note)` 동적 DELETE |
| `pay.Pay09_RelateNote.modelUpdate` | Pay09_Lookup_Note:245 | [`Pay09_RelateNote.java:68`](../../pay/services/Pay09_RelateNote.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.selectByCompanyId` | Pay09_Lookup_Note:279 | [`Pay09_RelateNote.java:27`](../../pay/services/Pay09_RelateNote.md) | [`pay09_relate_note.selectByCompanyId`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.update` | Pay09_Lookup_Note:257 | [`Pay09_RelateNote.java:81`](../../pay/services/Pay09_RelateNote.md) | `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay10_Month.selectByYear` | Pay10_Lookup_GroupList:161 | [`Pay10_Month.java:87`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByYear`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.update` | Pay10_Tab_List:425 | [`Pay10_Month.java:673`](../../pay/services/Pay10_Month.md) | `UpdateDataModel(pay10_month)` 동적 INSERT/UPDATE → [`pay10_month.selectById`](../../pay/sql/pay10_month.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay10_Lookup_GroupList:77 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `utils.pdf.PDFCreate.createPayMonth10` | Pay10_Tab_List:502 | [`PDFCreate.java:69`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay03_account`](../../../db/tables/pay.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay09_relate_note`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_account_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay10_Tab_List (`client/vi/pay/Pay10_Tab_List.java`, 610줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 해당 연도: {yearText} 구분: {payGroupName} {retrieveButton} {bankStatementButton} {formulaButton} {payAccountButton} {journalButton} {noteButton} {dcrLinkButton} {fileDownloadForm} {fileDeleteForm}
- 입력·하위 화면: `rdForm` Pay10_Lookup_Rd_List, `yearText` TextField, `payDate` MyDateField, `payCode` TextField, `payGroupName` LookupTriggerField 빈칸="구분을 선택해주세요", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `lookup` Pay09_Lookup_Note, `lookupTrans` Pay02_Lookup_Rd_Trans, `lookupGroupList` Pay10_Lookup_GroupList, `lookupformula` Pay04_Lookup_Formula, `lookupJournal` Pay10_Lookup_Journal, `lookupPayAccount` Pay03_Lookup_PayAccount, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L96-100) → init(), eventSetting(), defaultName()
[E1] classTreeFullName[문서분류].TriggerClick (L150) → openLookupDoc()
[E2] payGroupName.TriggerClick (L156) → lookupPayGroup()
[E3] apprButton[상신].Select [선택>0] (L162) → insertPayRelateAppr()
[E4] apprViewButton[문서보기].Select (L183) → retrieve()
[E5] retrieveButton[조회].Select (L208) → retrieve()
[E6] bankStatementButton[은행이체명세서].Select (L214) → bankRd()
[E7] formulaButton[임금계산방법].Select (L220) → lookupformula()
[E8] noteButton[비고작성].Select (L226) → 메시지 "구분을 선택해주세요"
[E9] dcrLinkButton[문서분류지정].Select (L243) → 인라인 L243-254 (new SelectHandler() { @Override publi…)
[E10] journalButton[전표확인].Select (L255) → lookupJournal()
[E11] payAccountButton[급여출금계좌].Select (L261) → lookupPayAccount()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package isNumberic() | L87-94 | 미사용 후보 | 상태 처리 | 업무 |
| private defaultName() | L102-121 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private eventSetting() | L123-267 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 조회창 Pay09_Lookup_Note 열기, 조회창 Dcr30_Lookup_Link 열기, 서비스 pay.Pay03_Account.selectByStartDate, apr.Apr01_Appr.selectById(companyId, startDate) | 업무 |
| public init() | L269-301 | 생성자 | 상태 처리 | 업무 |
| private bankRd() | L348-358 | E6 | 조회창 Pay02_Lookup_Rd_Trans 열기 | 업무 |
| public retrieve() | L360-419 | E4,E5,updateApprId | 서비스 yy.MM.dd, pay.Pay05_RelateAppr.selectByCompanyId | 업무 |
| public update() | L421-431 | 공개 메서드 | 서비스 pay.Pay10_Month.update | 업무 |
| public lookupPayGroup() | L433-445 | E2 | 조회창 Pay10_Lookup_GroupList 열기 | 업무 |
| public lookupformula() | L447-450 | E7 | 조회창 Pay04_Lookup_Formula 열기 | 업무 |
| private lookupJournal() | L452-460 | E10 | 조회창 Pay10_Lookup_Journal 열기 | 업무 |
| private lookupPayAccount() | L462-465 | E11 | 조회창 Pay03_Lookup_PayAccount 열기 | 업무 |
| private openLookupDoc() | L468-477 | E1 | 상태 처리 | 업무 |
| private insertPayRelateAppr() | L479-516 | E3 | 서비스 pay.Pay05_RelateAppr.insert(relateApprId, payCode, startDate, companyId) | 업무 |
| private insertLinkApproval() | L518-567 | insertPayRelateAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L570-596 | insertLinkApproval | 서비스 pay.Pay03_Account.selectByStartDate, pay.Pay05_RelateAppr.updateApprId(companyId, startDate, relateApprId, apprId, accountId) | 업무 |
| private buildGrid() | L303-346 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L598-600 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L602-604 | eventSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L606-609 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="view" onClick={bankRd}>은행이체명세서</Button>
3. <Button type="view" onClick={lookupformula}>임금계산방법</Button>
4. <Button type="view" onClick={lookupPayAccount}>급여출금계좌</Button>
5. <Button type="view" onClick={lookupJournal}>전표확인</Button>
6. <Button type="view" onClick={() => /* 메시지 "구분을 선택해주세요" */}>비고작성</Button>
7. <Button type="save" onClick={() => /* 인라인 L243-254 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>
8. <Button type="register" onClick={insertPayRelateAppr}>상신</Button>
9. <Button type="search" onClick={retrieve}>문서보기</Button>

### Pay10_Lookup_Rd_List (`client/vi/pay/Pay10_Lookup_Rd_List.java`, 76줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L27-54 | 공개 메서드 | 상태 처리 | 업무 |
| public rdClear() | L56-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L61-62 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L65-66 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L69-70 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L73-74 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pay10_Lookup_Journal (`client/vi/pay/Pay10_Lookup_Journal.java`, 156줄)

- 툴바 `buttonBar`: {retrieveButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - drAccountCode 120 "계정코드" TextCenter 편집:"456EA6"
  - drAccountName 200 "계정과목" TextArea2 편집:"456EA6"
  - drAmt 120 "금액" Long 편집:"456EA6"
  - drAstName 150 "관리계좌" Text 편집:"456EA6"
  - crAccountCode 120 "계정코드" TextCenter 편집:"DD5E5E"
  - crAccountName 200 "계정과목" TextArea2 편집:"DD5E5E"
  - crAmt 120 "금액" Long 편집:"DD5E5E"
  - crAstName 150 "관리계좌" Text 편집:"DD5E5E"

#### 이벤트
[E0] 화면 열림 (생성자 L56-89) → show()
[E1] retrieveButton[조회].Select (L63) → retrieve()
[E2] cancleButton[닫기].Select (L69) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-54 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L117-134 | E1,open | 서비스 act.Act03_JournalDtl.selectPayMonth(companyId, payDate, payType) | 업무 |
| public update() | L137-138 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L141-142 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L145-146 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L91-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L148-150 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L152-155 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L95 newHeaderGroupMap02newHeaderGroupConfigsetHtmlGridStyle14 100 "차변" (act03_new_header_group_map02new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L96 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map05new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.textCenter('drAccountCd', 120, '계정코드'),  // L99
  // ⚠ 대응 없음 (GridBuilder L100) addTextArea2
  gb.long('drAmt', 120, '금액'),  // L101
  gb.text('drAstNm', 150, '관리계좌'),  // L102 SQL 계산 컬럼(selectPayMonth: f_ast_class_tree_nm(act03_dr_ast_id))
  gb.textCenter('crAccountCd', 120, '계정코드'),  // L103
  // ⚠ 대응 없음 (GridBuilder L104) addTextArea2
  gb.long('crAmt', 120, '금액'),  // L105
  gb.text('crAstNm', 150, '관리계좌'),  // L106 SQL 계산 컬럼(selectPayMonth: f_ast_class_tree_nm(act03_cr_ast_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay10_Lookup_GroupList (`client/vi/pay/Pay10_Lookup_GroupList.java`, 177줄)

- 툴바 `buttonBar`: 구분: {payName} {retrieveButton}
- 입력·하위 화면: `payName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - payGroupName 220 "분류" Text

#### 이벤트
[E0] 화면 열림 (생성자 L66-131) → show()
[E1] payName[sys.Sys00_Common.selectByKindGroupCode].KeyPress [Enter] (L81) → retrieve()
[E2] retrieveButton[조회].Select (L89) → retrieve()
[E3] selectButton[확인].Select (L95) → select()
[E4] cancleButton[닫기].Select (L101) → hide()
[E5] grid.CellDoubleClick (L107) → select()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-56 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L58-64 | 공개 메서드 | 상태 처리 | 업무 |
| private select() | L141-145 | E3,E5 | 상태 처리 | 업무 |
| public retrieve() | L147-167 | E1,E2,open | 서비스 pay.Pay10_Month.selectByYear(year, payCode, companyId, code) | 업무 |
| public buildGrid() | L133-139 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L169-171 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L173-175 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('payGroupNm', 220, '분류'),  // L136
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay09_Lookup_Note (`client/vi/pay/Pay09_Lookup_Note.java`, 290줄)

- 툴바 `buttonBar`: {insertRowButton} {deleteRowButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `note` MyTextArea 빈칸="비고내용을 입력해주세요", `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personName 120 "사원명" TextCenter
  - note 400 "비고" Text 편집:MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L111-162) → makeButtonEvent(), getEditor()
[E1] anchor.MouseDown (L121) → retrieve()
[E2] closeButton[닫기].Select (L184) → hide()
[E3] updateButton[저장].Select (L190) → update()
[E4] insertRowButton[행 추가].Select (L196) → insertRow()
[E5] deleteRowButton[행 삭제].Select (L202) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L83-109 | 공개 메서드 | 서비스 pay.Pay09_RelateNote.checkNote(companyId, payCode, payDate, noteType) | 업무 |
| private getEditor() | L164-172 | 생성자 | 상태 처리 | 업무 |
| private makeButtonEvent() | L183-208 | 생성자 | 상태 처리 | 업무 |
| public insertRow() | L210-233 | E4 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| public deleteRow() | L235-241 | E5 | 상태 처리 | 업무 |
| private update() | L243-269 | E3 | GridDeleteData pay.Pay09_RelateNote.modelUpdate, pay.Pay09_RelateNote.update, pay.Pay09_RelateNote.delete | 업무 |
| private retrieve() | L271-285 | E1,open | 서비스 pay.Pay09_RelateNote.selectByCompanyId(companyId, payCode, payDate, noteType) | 업무 |
| public buildGrid() | L174-181 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L287-289 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNm', 120, '사원명'),  // L178 SQL 계산 컬럼(checkNote: f_emp_kor_nm(pay09_person_id))
  gb.text('note', 400, '비고', { editor: 'largeText' }),  // L179
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay02_Lookup_Rd_Trans (`client/vi/pay/Pay02_Lookup_Rd_Trans.java`, 84줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-49) → show()
[E1] closeButton[닫기].Select (L38) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-77 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L79-81 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

