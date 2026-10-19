# Pay02_Tab_List

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리(Old) > 급여대장(old) (#1084)
- 파일: `client/vi/pay/Pay02_Tab_List.java`
- 함께 쓰는 클래스 5개:
  - `Pay09_Lookup_Note` `client/vi/pay/Pay09_Lookup_Note.java`
  - `Pay02_Lookup_Rd_Trans` `client/vi/pay/Pay02_Lookup_Rd_Trans.java`
  - `Pay02_Lookup_Rd_List` `client/vi/pay/Pay02_Lookup_Rd_List.java`
  - `Pay02_Lookup_Journal` `client/vi/pay/Pay02_Lookup_Journal.java`
  - `Pay02_Lookup_GroupList` `client/vi/pay/Pay02_Lookup_GroupList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Pay03_Lookup_PayAccount`](../../pay/components/Pay03_Lookup_PayAccount.md), [`Pay04_Lookup_Formula`](../../pay/components/Pay04_Lookup_Formula.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act03_JournalDtl.selectPayMonth` | Pay02_Lookup_Journal:280 | [`Act03_JournalDtl.java:45`](../../act/services/Act03_JournalDtl.md) | [`act03_journal_dtl.selectPayMonth`](../../act/sql/act03_journal_dtl.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay02_Tab_List:108, Pay02_Tab_List:545 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `pay.Pay02_Month.selectByCompanyId` | Pay02_Tab_List:399 | [`Pay02_Month.java:34`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByCompanyId`](../../pay/sql/pay02_month.md) |
| `pay.Pay02_Month.selectByYear` | Pay02_Lookup_GroupList:139 | [`Pay02_Month.java:67`](../../pay/services/Pay02_Month.md) | [`pay02_month.selectByYear`](../../pay/sql/pay02_month.md) |
| `pay.Pay02_Month.update` | Pay02_Tab_List:438 | [`Pay02_Month.java:367`](../../pay/services/Pay02_Month.md) | `UpdateDataModel(pay02_month)` 동적 INSERT/UPDATE → [`pay02_month.selectById`](../../pay/sql/pay02_month.md) |
| `pay.Pay03_Account.selectByStartDate` | Pay02_Tab_List:596 | [`Pay03_Account.java:28`](../../pay/services/Pay03_Account.md) | [`pay03_account.selectByStartDate`](../../pay/sql/pay03_account.md) |
| `pay.Pay05_RelateAppr.insert` | Pay02_Tab_List:515 | [`Pay05_RelateAppr.java:60`](../../pay/services/Pay05_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay05_relate_appr.insert`](../../pay/sql/pay05_relate_appr.md), [`pay05_relate_appr.selectByCompanyId`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay05_RelateAppr.selectByCompanyId` | Pay02_Tab_List:404 | [`Pay05_RelateAppr.java:26`](../../pay/services/Pay05_RelateAppr.md) | [`pay05_relate_appr.selectByCompanyId`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay05_RelateAppr.updateApprId` | Pay02_Tab_List:607 | [`Pay05_RelateAppr.java:119`](../../pay/services/Pay05_RelateAppr.md) | [`pay05_relate_appr.updateApprId`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay09_RelateNote.checkNote` | Pay09_Lookup_Note:92 | [`Pay09_RelateNote.java:34`](../../pay/services/Pay09_RelateNote.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay09_relate_note.checkNote`](../../pay/sql/pay09_relate_note.md), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.delete` | Pay09_Lookup_Note:260 | [`Pay09_RelateNote.java:86`](../../pay/services/Pay09_RelateNote.md) | `UpdateDataModel(pay09_relate_note)` 동적 DELETE |
| `pay.Pay09_RelateNote.modelUpdate` | Pay09_Lookup_Note:245 | [`Pay09_RelateNote.java:68`](../../pay/services/Pay09_RelateNote.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.selectByCompanyId` | Pay09_Lookup_Note:279 | [`Pay09_RelateNote.java:27`](../../pay/services/Pay09_RelateNote.md) | [`pay09_relate_note.selectByCompanyId`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.update` | Pay09_Lookup_Note:257 | [`Pay09_RelateNote.java:81`](../../pay/services/Pay09_RelateNote.md) | `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `utils.pdf.PDFCreate.createPayMonth` | Pay02_Tab_List:527 | [`PDFCreate.java:64`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`act03_journal_dtl`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay02_month`](../../../db/tables/pay.md), [`pay03_account`](../../../db/tables/pay.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay09_relate_note`](../../../db/tables/pay.md)

## DB 함수

`f_ast_class_tree_nm`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_account_nm`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay02_Tab_List (`client/vi/pay/Pay02_Tab_List.java`, 635줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 해당 연도: {yearText} 구분: {payGroupName} {retrieveButton} {excelDownloadButton} {bankStatementButton} {formulaButton} {payAccountButton} {journalButton} {noteButton} {dcrLinkButton} {fileDownloadForm} {fileDeleteForm} {downloadForm} {excelDownloadForm}
- 입력·하위 화면: `yearText` TextField, `payDate` MyDateField, `payGroupName` LookupTriggerField 빈칸="구분을 선택해주세요", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepName` TextField, `lookup` Pay09_Lookup_Note, `lookupTrans` Pay02_Lookup_Rd_List, `lookupGroupList` Pay02_Lookup_GroupList, `lookupformula` Pay04_Lookup_Formula, `lookupJournal` Pay02_Lookup_Journal, `lookupPayAccount` Pay03_Lookup_PayAccount, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - actionCell 30 " " Cell 편집:actionCell
  - personNo 50 "사번" TextCenter
  - personName 80 "사원명" TextCenter
  - posName 50 "직급" TextCenter
  - basicPay 80 "기본급여" Long 편집:"456EA6"
  - bonusPay 80 "성과급여" Long 편집:"456EA6"
  - mealPay 80 "식대" Long 편집:"456EA6"
  - carMt 80 "차량유지비" Long 편집:"456EA6"
  - extendPay 80 "연장수당" Long 편집:"456EA6"
  - nightPay 80 "야간수당" Long 편집:"456EA6"
  - holidayPay 80 "휴일수당" Long 편집:"456EA6"
  - etc01Pay 80 "기타급여1" Long 편집:"456EA6"
  - etc02Pay 80 "기타급여2" Long 편집:"456EA6"
  - paySum 80 "지급액계" Long 편집:"456EA6"
  - incomeTax 80 "소득세" Long 편집:"DD5E5E"
  - residentTax 80 "주민세" Long 편집:"DD5E5E"
  - npDdc 80 "국민연금" Long 편집:"DD5E5E"
  - hiDdc 80 "건강보험" Long 편집:"DD5E5E"
  - ltDdc 80 "장기요양" Long 편집:"DD5E5E"
  - eiDdc 80 "고용보험" Long 편집:"DD5E5E"
  - yearEndTax 80 "연말정산" Long 편집:"DD5E5E"
  - retireAmt 80 "퇴직정산" Long 편집:"DD5E5E"
  - others01Ddc 80 "기타공제1" Long 편집:"DD5E5E"
  - others02Ddc 80 "기타공제2" Long 편집:"DD5E5E"
  - taxDdcsum 80 "공제액계" Long 편집:"DD5E5E"
  - realPay 80 "차감지급액" Long
  - workDay 80 "근로일수" Double
  - totalWorkTime 90 "총 근로시간" Double
  - extendWorkTime 90 "연장근로시간" Double
  - nightWorkTime 90 "야간근로시간" Double
  - holidayWorkTime 90 "휴일근로시간" Double

#### 이벤트
[E0] 화면 열림 (생성자 L101-105) → init(), eventSetting(), defaultName()
[E1] classTreeFullName[문서분류].TriggerClick (L157) → openLookupDoc()
[E2] payGroupName.TriggerClick (L163) → lookupPayGroup()
[E3] apprButton[상신].Select (L169) → insertPayRelateAppr()
[E4] retrieveButton[조회].Select (L175) → retrieve()
[E5] excelDownloadButton[엑셀다운로드].Select (L181) → excelDownload()
[E6] bankStatementButton[은행이체명세서].Select (L187) → bankRd()
[E7] formulaButton[임금계산방법].Select (L194) → lookupformula()
[E8] noteButton[비고작성].Select (L200) → 메시지 "구분을 선택해주세요"
[E9] dcrLinkButton[문서분류지정].Select (L219) → 인라인 L219-230 (new SelectHandler() { @Override publi…)
[E10] journalButton[전표확인].Select (L231) → lookupJournal()
[E11] payAccountButton[급여출금계좌].Select (L237) → lookupPayAccount()
[E12] excelDownloadForm.SubmitComplete (L250) → 인라인 L250-255 (new SubmitCompleteHandler() { @Overri…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package isNumberic() | L92-99 | 미사용 후보 | 상태 처리 | 업무 |
| private defaultName() | L107-126 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private eventSetting() | L128-243 | 생성자 | 조회창 Pay09_Lookup_Note 열기, 조회창 Dcr30_Lookup_Link 열기 | 업무 |
| public init() | L245-284 | 생성자 | 상태 처리 | 업무 |
| private viewRD() | L354-359 | buildGrid | 조회창 Pay02_Lookup_Rd_List 열기 | 업무 |
| private bankRd() | L374-384 | E6 | 조회창 Pay02_Lookup_Rd_Trans 열기 | 업무 |
| public retrieve() | L386-432 | E4 | 서비스 pay.Pay02_Month.selectByCompanyId, pay.Pay05_RelateAppr.selectByCompanyId(companyId, payCode, payDate) | 업무 |
| public update() | L434-444 | 공개 메서드 | 서비스 pay.Pay02_Month.update | 업무 |
| private excelDownload() | L446-456 | E5 | 상태 처리 | 업무 |
| public lookupPayGroup() | L458-470 | E2 | 조회창 Pay02_Lookup_GroupList 열기 | 업무 |
| public lookupformula() | L472-475 | E7 | 조회창 Pay04_Lookup_Formula 열기 | 업무 |
| private lookupJournal() | L477-485 | E10 | 조회창 Pay02_Lookup_Journal 열기 | 업무 |
| private lookupPayAccount() | L487-490 | E11 | 조회창 Pay03_Lookup_PayAccount 열기 | 업무 |
| private openLookupDoc() | L493-502 | E1 | 상태 처리 | 업무 |
| private insertPayRelateAppr() | L504-541 | E3 | 서비스 pay.Pay05_RelateAppr.insert(relateApprId, payCode, startDate, companyId) | 업무 |
| private insertLinkApproval() | L543-592 | insertPayRelateAppr | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L595-621 | insertLinkApproval | 서비스 pay.Pay03_Account.selectByStartDate, pay.Pay05_RelateAppr.updateApprId(companyId, startDate, relateApprId, apprId, accountId) | 업무 |
| private buildGrid() | L286-340 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L623-625 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L627-629 | eventSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L631-634 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L291 newHeaderGroupMap01newHeaderGroupConfig14 100 "사원" (pay02_new_header_group_map01new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L292 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle19 100 "지급액(월)" (pay02_new_header_group_map05new_header_group_configset_html_grid_style19 컬럼 없음)
  // ⚠DB없음 L293 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle112 100 "공제액(월)" (pay02_new_header_group_map014new_header_group_configset_html_grid_style112 컬럼 없음)
  // ⚠DB없음 L294 newHeaderGroupMap027newHeaderGroupConfig15 100 "근로시간(월)" (pay02_new_header_group_map027new_header_group_config15 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L303) addCell
  gb.textCenter('personNo', 50, '사번'),  // L304 SQL 계산 컬럼(selectByCompanyId: emp01_emp_no)
  gb.textCenter('personNm', 80, '사원명'),  // L305 SQL 계산 컬럼(selectByCompanyId: f_emp_kor_nm(pay02_person_id))
  gb.textCenter('posNm', 50, '직급'),  // L306 SQL 계산 컬럼(selectByCompanyId: f_cdnm('EmpPosCode', emp03_pos_cd, emp0…)
  gb.long('basicPay', 80, '기본급여'),  // L308
  gb.long('bonusPay', 80, '성과급여'),  // L309
  gb.long('mealPay', 80, '식대'),  // L310
  gb.long('carMt', 80, '차량유지비'),  // L311
  gb.long('extendPay', 80, '연장수당'),  // L312
  gb.long('nightPay', 80, '야간수당'),  // L313
  gb.long('holidayPay', 80, '휴일수당'),  // L314
  gb.long('etc01Pay', 80, '기타급여1'),  // L315
  gb.long('etc02Pay', 80, '기타급여2'),  // L316
  gb.long('paySum', 80, '지급액계'),  // L317 SQL 계산 컬럼(selectByCompanyId: ( COALESCE(pay02_basic_pay, 0) + COALES…)
  gb.long('incomeTax', 80, '소득세'),  // L319
  gb.long('residentTax', 80, '주민세'),  // L320
  gb.long('npDdc', 80, '국민연금'),  // L321
  gb.long('hiDdc', 80, '건강보험'),  // L322
  gb.long('ltDdc', 80, '장기요양'),  // L323
  gb.long('eiDdc', 80, '고용보험'),  // L324
  gb.long('yearEndTax', 80, '연말정산'),  // L325
  gb.long('retireAmt', 80, '퇴직정산'),  // L326
  gb.long('others01Ddc', 80, '기타공제1'),  // L327
  gb.long('others02Ddc', 80, '기타공제2'),  // L328
  gb.long('taxDdcSum', 80, '공제액계'),  // L329 SQL 계산 컬럼(selectByCompanyId: ( COALESCE(pay02_income_tax, 0) + COALE…)
  gb.long('realPay', 80, '차감지급액'),  // L331
  gb.double('workDay', 80, '근로일수'),  // L333
  gb.double('totalWorkTime', 90, '총 근로시간'),  // L334
  gb.double('extendWorkTime', 90, '연장근로시간'),  // L335
  gb.double('nightWorkTime', 90, '야간근로시간'),  // L336
  gb.double('holidayWorkTime', 90, '휴일근로시간'),  // L337
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={excelDownload}>엑셀다운로드</Button>
3. <Button type="view" onClick={bankRd}>은행이체명세서</Button>
4. <Button type="view" onClick={lookupformula}>임금계산방법</Button>
5. <Button type="view" onClick={lookupPayAccount}>급여출금계좌</Button>
6. <Button type="view" onClick={lookupJournal}>전표확인</Button>
7. <Button type="view" onClick={() => /* 메시지 "구분을 선택해주세요" */}>비고작성</Button>
8. <Button type="save" onClick={() => /* 인라인 L219-230 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>
9. <Button type="register" onClick={insertPayRelateAppr}>상신</Button>

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

### Pay02_Lookup_Rd_List (`client/vi/pay/Pay02_Lookup_Rd_List.java`, 82줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-49) → show()
[E1] closeButton[닫기].Select (L38) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-75 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L77-79 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay02_Lookup_Journal (`client/vi/pay/Pay02_Lookup_Journal.java`, 470줄)

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
[E0] 화면 열림 (생성자 L60-122) → show()
[E1] retrieveButton[조회].Select (L67) → retrieve()
[E2] cancleButton[닫기].Select (L97) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L275-292 | E1,open | 서비스 act.Act03_JournalDtl.selectPayMonth(companyId, payDate, payType) | 업무 |
| public update() | L383-414 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L417-427 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L430-440 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L124-246 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L460-462 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L464-467 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L226 newHeaderGroupMap02newHeaderGroupConfigsetHtmlGridStyle14 100 "차변" (act03_new_header_group_map02new_header_group_configset_html_grid_style14 컬럼 없음)
  // ⚠DB없음 L227 newHeaderGroupMap05newHeaderGroupConfigsetHtmlGridStyle15 100 "대변" (act03_new_header_group_map05new_header_group_configset_html_grid_style15 컬럼 없음)
  gb.textCenter('drAccountCd', 120, '계정코드'),  // L230
  // ⚠ 대응 없음 (GridBuilder L231) addTextArea2
  gb.long('drAmt', 120, '금액'),  // L232
  gb.text('drAstNm', 150, '관리계좌'),  // L233 SQL 계산 컬럼(selectPayMonth: f_ast_class_tree_nm(act03_dr_ast_id))
  gb.textCenter('crAccountCd', 120, '계정코드'),  // L234
  // ⚠ 대응 없음 (GridBuilder L235) addTextArea2
  gb.long('crAmt', 120, '금액'),  // L236
  gb.text('crAstNm', 150, '관리계좌'),  // L237 SQL 계산 컬럼(selectPayMonth: f_ast_class_tree_nm(act03_cr_ast_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay02_Lookup_GroupList (`client/vi/pay/Pay02_Lookup_GroupList.java`, 155줄)

- 툴바 `buttonBar`: 구분: {payName} {retrieveButton}
- 입력·하위 화면: `payName` ComboBoxField("PayMonthCode", "%", "전체")
- 그리드 `grid` (buildGrid()):
  - payGroupName 220 "분류" Text

#### 이벤트
[E0] 화면 열림 (생성자 L52-110) → show()
[E1] payName[PayMonthCode].KeyPress [Enter] (L60) → retrieve()
[E2] retrieveButton[조회].Select (L68) → retrieve()
[E3] selectButton[확인].Select (L74) → select()
[E4] cancleButton[닫기].Select (L80) → hide()
[E5] grid.CellDoubleClick (L86) → select()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-50 | 공개 메서드 | 상태 처리 | 업무 |
| private select() | L120-124 | E3,E5 | 상태 처리 | 업무 |
| public retrieve() | L126-145 | E1,E2,open | 서비스 pay.Pay02_Month.selectByYear(year, payCode, companyId) | 업무 |
| public buildGrid() | L112-118 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L147-149 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L151-153 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('payGroupNm', 220, '분류'),  // L115 SQL 계산 컬럼(selectByYear: (to_char(pay02_pay_date,'yyyy-mm-dd') |…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

