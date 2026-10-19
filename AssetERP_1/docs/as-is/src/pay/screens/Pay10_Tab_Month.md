# Pay10_Tab_Month

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 급여관리 (#1270)
- 파일: `client/vi/pay/Pay10_Tab_Month.java`
- 함께 쓰는 클래스 7개:
  - `Pay11_TabPage_MonthItem` `client/vi/pay/Pay11_TabPage_MonthItem.java`
  - `Pay32_Lookup_Detail` `client/vi/pay/Pay32_Lookup_Detail.java`
  - `Pay20_Lookup_SelectMulti` `client/vi/pay/Pay20_Lookup_SelectMulti.java`
  - `Pay10_Lookup_Work` `client/vi/pay/Pay10_Lookup_Work.java`
  - `Pay09_Lookup_Note` `client/vi/pay/Pay09_Lookup_Note.java`
  - `Pay10_Lookup_Insert` `client/vi/pay/Pay10_Lookup_Insert.java`
  - `Pay10_Lookup_GroupList` `client/vi/pay/Pay10_Lookup_GroupList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp01_Lookup_TransDate`](../../emp/components/Emp01_Lookup_TransDate.md), [`Pay04_Lookup_Formula`](../../pay/components/Pay04_Lookup_Formula.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay09_RelateNote.checkNote` | Pay09_Lookup_Note:92 | [`Pay09_RelateNote.java:34`](../../pay/services/Pay09_RelateNote.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay09_relate_note.checkNote`](../../pay/sql/pay09_relate_note.md), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.delete` | Pay09_Lookup_Note:260 | [`Pay09_RelateNote.java:86`](../../pay/services/Pay09_RelateNote.md) | `UpdateDataModel(pay09_relate_note)` 동적 DELETE |
| `pay.Pay09_RelateNote.modelUpdate` | Pay09_Lookup_Note:245 | [`Pay09_RelateNote.java:68`](../../pay/services/Pay09_RelateNote.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.selectByCompanyId` | Pay09_Lookup_Note:279 | [`Pay09_RelateNote.java:27`](../../pay/services/Pay09_RelateNote.md) | [`pay09_relate_note.selectByCompanyId`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay09_RelateNote.update` | Pay09_Lookup_Note:257 | [`Pay09_RelateNote.java:81`](../../pay/services/Pay09_RelateNote.md) | `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE → [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) |
| `pay.Pay10_Month.calculate` | Pay10_Tab_Month:275 | **(없음)** | - |
| `pay.Pay10_Month.checkAppr` | Pay10_Lookup_Insert:173, Pay10_Lookup_Work:109, Pay10_Tab_Month:243, Pay11_TabPage_MonthItem:424 | [`Pay10_Month.java:211`](../../pay/services/Pay10_Month.md) | [`act02_journal.countByPayMonthCode`](../../act/sql/act02_journal.md), [`pay05_relate_appr.checkAppr`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay10_Month.deleteAll` | Pay10_Tab_Month:328 | [`Pay10_Month.java:628`](../../pay/services/Pay10_Month.md) | [`pay11_month_item.deleteByMonthId`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureAdjustModi`](../../pay/sql/pay11_month_item.md), [`pay12_retire_insure.deleteByMonthId`](../../pay/sql/pay12_retire_insure.md), [`pay13_retire_tax.deleteByMonthId`](../../pay/sql/pay13_retire_tax.md), [`pay14_retire_tax_item.deleteByMonthId`](../../pay/sql/pay14_retire_tax_item.md), [`pay32_insure_pay.deleteByDate`](../../pay/sql/pay32_insure_pay.md), `UpdateDataModel(pay10_month)` 동적 DELETE |
| `pay.Pay10_Month.insert` | Pay10_Lookup_Insert:211 | [`Pay10_Month.java:243`](../../pay/services/Pay10_Month.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay01_annual.selectByApprStatus`](../../pay/sql/pay01_annual.md), [`pay10_month.insert`](../../pay/sql/pay10_month.md), [`pay10_month.selectByPayDatePersonId`](../../pay/sql/pay10_month.md), [`pay11_month_item.getAdjustPay`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureEi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureHi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureLtc`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureNps`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.insert`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.insertLatestInfo`](../../pay/sql/pay11_month_item.md), [`sys12_calendar.workDayPerson`](../../sys/sql/sys12_calendar.md) |
| `pay.Pay10_Month.modelUpdate` | Pay10_Lookup_Work:134 | [`Pay10_Month.java:615`](../../pay/services/Pay10_Month.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay10_month)` 동적 INSERT/UPDATE → [`pay10_month.selectById`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.selectByCompanyId` | Pay10_Tab_Month:226 | [`Pay10_Month.java:37`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByCompanyId`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.selectByYear` | Pay10_Lookup_GroupList:161 | [`Pay10_Month.java:87`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByYear`](../../pay/sql/pay10_month.md) |
| `pay.Pay10_Month.update` | Pay10_Tab_Month:270 | [`Pay10_Month.java:673`](../../pay/services/Pay10_Month.md) | `UpdateDataModel(pay10_month)` 동적 INSERT/UPDATE → [`pay10_month.selectById`](../../pay/sql/pay10_month.md) |
| `pay.Pay11_MonthItem.getInsureAdjustModi` | Pay11_TabPage_MonthItem:354 | [`Pay11_MonthItem.java:158`](../../pay/services/Pay11_MonthItem.md) | [`pay11_month_item.deleteByMonthItemId`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureAdjustModi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateModel`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay11_MonthItem.recalculationTax` | Pay11_TabPage_MonthItem:377 | [`Pay11_MonthItem.java:340`](../../pay/services/Pay11_MonthItem.md) | [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay11_MonthItem.selectByItemType` | Pay11_TabPage_MonthItem:403 | [`Pay11_MonthItem.java:38`](../../pay/services/Pay11_MonthItem.md) | [`pay11_month_item.selectByItemType`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay11_MonthItem.updateList` | Pay11_TabPage_MonthItem:321 | [`Pay11_MonthItem.java:116`](../../pay/services/Pay11_MonthItem.md) | [`pay11_month_item.deleteByMonthItemId`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateModel`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay20_Item.selectByItemType` | Pay20_Lookup_SelectMulti:100 | [`Pay20_Item.java:41`](../../pay/services/Pay20_Item.md) | [`pay20_item.selectByItemType`](../../pay/sql/pay20_item.md) |
| `pay.Pay32_InsurePay.delete` | Pay32_Lookup_Detail:257 | [`Pay32_InsurePay.java:63`](../../pay/services/Pay32_InsurePay.md) | `UpdateDataModel(pay32_insure_pay)` 동적 DELETE |
| `pay.Pay32_InsurePay.selectByPersonId` | Pay32_Lookup_Detail:207 | [`Pay32_InsurePay.java:41`](../../pay/services/Pay32_InsurePay.md) | [`pay32_insure_pay.selectByPersonId`](../../pay/sql/pay32_insure_pay.md) |
| `pay.Pay32_InsurePay.update` | Pay32_Lookup_Detail:212 | [`Pay32_InsurePay.java:58`](../../pay/services/Pay32_InsurePay.md) | `UpdateDataModel(pay32_insure_pay)` 동적 INSERT/UPDATE → [`pay32_insure_pay.selectById`](../../pay/sql/pay32_insure_pay.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay10_Lookup_GroupList:77, Pay32_Lookup_Detail:88 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay09_relate_note`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay12_retire_insure`](../../../db/tables/pay.md), [`pay13_retire_tax`](../../../db/tables/pay.md), [`pay14_retire_tax_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay32_insure_pay`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_calc_4insure_ei`, `f_calc_4insure_hi`, `f_calc_4insure_ltc`, `f_calc_4insure_nps`, `f_calc_income_tax`, `f_calc_local_tax`, `f_cdnm`, `f_create_4insure_adjust_modi`, `f_create_4insure_adjust_pay`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay10_Tab_Month (`client/vi/pay/Pay10_Tab_Month.java`, 369줄)

- 레이아웃: center=vlc, east=tabPageMonth
- 툴바 `buttonBar`: 해당 연도: {yearText} 구분: {payGroupName} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `yearText` TextField, `monthId` LongField, `payDate` MyDateField, `payGroupName` LookupTriggerField 빈칸="구분을 선택해주세요", `tabPageMonth` Pay11_TabPage_MonthItem, `lookupInsert` Pay10_Lookup_Insert, `lookupGroupList` Pay10_Lookup_GroupList
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 50 "사번" TextCenter
  - personName 80 "사원명" TextCenter
  - posName 50 "직급" TextCenter
  - paySum 120 "지급액계" Long
  - taxDdcSum 120 "공제액계" Long
  - deductionSum 120 "차감지급액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L161-183) → settings()
[E1] payGroupName.TriggerClick (L91) → lookupPayGroup()
[E2] retrieveButton[조회].Select (L102) → retrieve()
[E3] deleteButton[삭제].Select (L114) → checkAppr()
[E4] insertButton[생성].Select (L120) → insert()
[E5] grid.RowClick (L126) → retrieveEditPage()
[E6] msgBox.DialogHide [YES] (L304) → delete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package isNumberic() | L68-75 | 미사용 후보 | 상태 처리 | 업무 |
| private retrieveEditPage() | L142-159 | E5,retrieve | 상태 처리 | 업무 |
| public insert() | L200-210 | E4 | 조회창 Pay10_Lookup_Insert 열기 → 콜백: unmask | 업무 |
| public retrieve() | L212-240 | E2,delete,lookupPayGroup | 미선택 시 alert "구분을 선택해주세요", 서비스 pay.Pay10_Month.selectByCompanyId(companyId, payCode, payDate) | 업무 |
| public checkAppr() | L242-266 | E3 | 서비스 pay.Pay10_Month.checkAppr(companyId, payCode, payDate, monthId) | 업무 |
| public update() | L268-289 | checkAppr | 서비스 pay.Pay10_Month.update, pay.Pay10_Month.calculate(companyId, payCode, payDate) | 업무 |
| public deleteCheck() | L291-319 | checkAppr | 확인창 표시 | 업무 |
| public delete() | L321-343 | E6 | 서비스 pay.Pay10_Month.deleteAll | 업무 |
| public lookupPayGroup() | L345-359 | E1 | 조회창 Pay10_Lookup_GroupList 열기 | 업무 |
| private settings() | L76-140 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L185-198 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L361-364 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L366-368 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 50, '사번'),  // L190
  gb.textCenter('personNm', 80, '사원명'),  // L191
  gb.textCenter('posNm', 50, '직급'),  // L192
  gb.long('paySum', 120, '지급액계'),  // L193
  gb.long('taxDdcSum', 120, '공제액계'),  // L194
  gb.long('deductionSum', 120, '차감지급액'),  // L195
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={insert}>생성</Button>
3. <Button type="delete" onClick={checkAppr}>삭제</Button>

### Pay11_TabPage_MonthItem (`client/vi/pay/Pay11_TabPage_MonthItem.java`, 457줄)

- 레이아웃: center=vlc1, east=vlc2
- 툴바 `buttonBar1`: {insertButton1} {deleteButton1} {updateButton1}
- 툴바 `buttonBar2`: {insertButton2} {deleteButton2} {updateButton2} {recalculationButton}
- 툴바 `buttonBarBottom`: {workTimeButton} {noteButton} {formulaButton} {insureDetailButton}
- 입력·하위 화면: `lookupWork` Pay10_Lookup_Work, `lookup` Pay09_Lookup_Note, `lookupformula` Pay04_Lookup_Formula
- 그리드 `grid1` (buildGrid1(), 체크박스(다중)):
  - itemName 150 "급여항목" Text
  - nonTaxTypeName 100 "과세구분" TextCenter
  - itemAmt 150 "지급액" Long 편집:LongField
- 그리드 `grid2` (buildGrid2(), 체크박스(다중)):
  - itemName 150 "공제항목" Text
  - itemAmt 150 "공제액" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L67-120) → settings()
[E1] insertButton1[행 추가].Select (L123) → insertRow()
[E2] deleteButton1[행 삭제].Select (L129) → deleteRow()
[E3] updateButton1[저장].Select (L135) → update()
[E4] insertButton2[행 추가].Select (L142) → insertRow()
[E5] deleteButton2[행 삭제].Select (L148) → deleteRow()
[E6] updateButton2[저장].Select (L154) → update()
[E7] recalculationButton[소득세 재계산].Select (L160) → recalculation()
[E8] workTimeButton[근로시간].Select [monthModel == null] (L166) → 메시지 "좌측 급여정보를 먼저 선택해주세요"
[E9] noteButton[비고작성].Select [monthModel == null] (L179) → 메시지 "좌측 급여정보를 먼저 선택해주세요"
[E10] formulaButton[임금계산방법].Select (L196) → lookupformula()
[E11] insureDetailButton[4대보험 연말정산 납부상세].Select [monthModel == null] (L202) → 메시지 "좌측 급여정보를 먼저 선택해주세요"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGrid1() | L216-224 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGrid2() | L226-233 | 필드 초기화 | 상태 처리 | 업무 |
| public insertRow() | L235-280 | E1,E4 | 조회창 Pay20_Lookup_SelectMulti 열기 | 업무 |
| public deleteRow() | L282-299 | E2,E5 | 미선택 시 alert "좌측 급여정보를 먼저 선택해주세요" | 업무 |
| public update() | L301-374 | E3,E6 | 서비스 pay.Pay11_MonthItem.updateList, pay.Pay11_MonthItem.getInsureAdjustModi(updateList, deleteList, monthId, payDate, updateList, deleteList, personId, payDate) | 업무 |
| private recalculation() | L376-393 | E7 | 서비스 pay.Pay11_MonthItem.recalculationTax(monthId, payDate) | 업무 |
| public retrieve() | L395-409 | update,recalculation | 서비스 pay.Pay11_MonthItem.selectByItemType, pay.Pay11_MonthItem.selectByItemType(monthId, itemType, monthId, itemType) | 업무 |
| public init() | L411-416 | 공개 메서드 | 상태 처리 | 업무 |
| public lookupformula() | L418-421 | E10 | 조회창 Pay04_Lookup_Formula 열기 | 업무 |
| public enabled() | L423-456 | 공개 메서드 | 서비스 pay.Pay10_Month.checkAppr(companyId, payCode, payDate, monthId) | 업무 |
| private settings() | L122-214 | 생성자 | 조회창 Pay10_Lookup_Work 열기, 조회창 Pay09_Lookup_Note 열기, 조회창 Pay32_Lookup_Detail 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildGrid1 = () => [
  gb.text('itemNm', 150, '급여항목'),  // L219 SQL 계산 컬럼(selectByItemType: pay20_item_nm)
  gb.textCenter('nonTaxTypeNm', 100, '과세구분'),  // L220 SQL 계산 컬럼(selectByItemType: f_cdnm('NonTaxType', pay20_non_tax_type…)
  gb.long('itemAmt', 150, '지급액', { editor: 'number' }),  // L221
];

const buildGrid2 = () => [
  gb.text('itemNm', 150, '공제항목'),  // L229 SQL 계산 컬럼(selectByItemType: pay20_item_nm)
  gb.long('itemAmt', 150, '공제액', { editor: 'number' }),  // L230
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="addRow" onClick={insertRow}>행 추가</Button>
5. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
6. <Button type="save" onClick={update}>저장</Button>
7. <Button type="view" onClick={recalculation}>소득세 재계산</Button>
8. <Button type="view" onClick={() => /* 메시지 "좌측 급여정보를 먼저 선택해주세요" */}>근로시간</Button>
9. <Button type="view" onClick={() => /* 메시지 "좌측 급여정보를 먼저 선택해주세요" */}>비고작성</Button>
10. <Button type="view" onClick={lookupformula}>임금계산방법</Button>
11. <Button type="view" onClick={() => /* 메시지 "좌측 급여정보를 먼저 선택해주세요" */}>4대보험 연말정산 납부상세</Button>

### Pay32_Lookup_Detail (`client/vi/pay/Pay32_Lookup_Detail.java`, 267줄)

- 툴바 `buttonBar`: 기준년도: {yearText} 구분: {insureName} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `yearText` TextField 빈칸="YYYY", `insureName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "건강보험", "yyyy", "YYYY"), `divPayComboBox` ComboBoxField("DivPayCode")
- 그리드 `grid` (buildGrid()):
  - date 100 "일자" Date 편집:MyDateField
  - tgtAmt 150 "정산보험료" Long 편집:LongField
  - payName 120 "납부방법" TextCenter 편집:divPayComboBox
  - payDiv 150 "분할납부회차" LongCenter 편집:LongField
  - cnt 150 "납부회차" LongCenter 편집:LongField
  - amt 150 "납부금액" Long 편집:LongField
  - remAmt 150 "잔여금액" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L74-80) → 초기화
[E1] insureName[sys.Sys00_Common.selectByKindGroupCode].Collapse (L108) → retrieve()
[E2] yearText.KeyPress [Enter] (L116) → retrieve()
[E3] retrieveButton[조회].Select (L125) → retrieve()
[E4] insertButton[등록].Select (L131) → insertRow()
[E5] updateButton[저장].Select (L137) → update()
[E6] deleteButton[삭제].Select (L143) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L237) → deleteRow()
[E7] divPayComboBox[DivPayCode].Collapse (L174) → 인라인 L174-182 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-67 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L69-72 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L196-208 | E1,E2,E3,settings | 서비스 pay.Pay32_InsurePay.selectByPersonId(companyId, personId, companyId, personId, insureCode, year) | 업무 |
| public update() | L210-213 | E5 | 서비스 pay.Pay32_InsurePay.update | 업무 |
| public insertRow() | L215-232 | E4 | 상태 처리 | 업무 |
| private deleteChk() | L234-252 | E6 | ConfirmBox → E8 | 업무 |
| public deleteRow() | L254-258 | E8 | GridDeleteData pay.Pay32_InsurePay.delete(체크된 행 목록) | 업무 |
| private settings() | L82-170 | open | 서비스 sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L172-194 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L260-262 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L264-266 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 100, '일자', { editor: 'date' }),  // L185
  gb.long('tgtAmt', 150, '정산보험료', { editor: 'number' }),  // L186
  gb.textCenter('payNm', 120, '납부방법', { editor: 'select' }),  // L187 SQL 계산 컬럼(selectByPersonId: f_cdnm('DivPayCode', pay32_pay_cd, pay3…)
  gb.longCenter('payDiv', 150, '분할납부회차', { editor: 'number' }),  // L188
  gb.longCenter('cnt', 150, '납부회차', { editor: 'number' }),  // L189
  gb.long('amt', 150, '납부금액', { editor: 'number' }),  // L190
  gb.long('remAmt', 150, '잔여금액', { editor: 'number' }),  // L191
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Pay20_Lookup_SelectMulti (`client/vi/pay/Pay20_Lookup_SelectMulti.java`, 122줄)

- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemTypeName 150 "지급구분" TextCenter
  - itemName 300 "항목명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L45-80) → show()
[E1] confirmButton[확인].Select (L52) → confirm()
[E2] cancelButton[취소].Select (L58) → hide()
[E3] grid.CellDoubleClick (L68) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-43 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L94-106 | open | 서비스 pay.Pay20_Item.selectByItemType(itemType) | 업무 |
| public confirm() | L108-117 | E1,E3 | 상태 처리 | 업무 |
| private buildGrid() | L82-92 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L119-121 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeNm', 150, '지급구분'),  // L88 SQL 계산 컬럼(selectByItemType: f_cdnm('PayItemType', pay20_item_type, …)
  gb.text('itemNm', 300, '항목명'),  // L89
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="cancel" onClick={hide}>취소</Button>

### Pay10_Lookup_Work (`client/vi/pay/Pay10_Lookup_Work.java`, 154줄)

- 입력·하위 화면: `personName` TextField, `workDay` DoubleField, `totalWorkTime` DoubleField, `extendWorkTime` DoubleField, `nightWorkTime` DoubleField, `holidayWorkTime` DoubleField

#### 이벤트
[E1] updateButton[저장].Select (L87) → checkAppr()
[E2] closeButton[닫기].Select (L93) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-104 | 공개 메서드 | 상태 처리 | 업무 |
| public checkAppr() | L106-127 | E1 | 서비스 pay.Pay10_Month.checkAppr(companyId, payCode, payDate, monthId) | 업무 |
| public update() | L129-145 | checkAppr | 서비스 pay.Pay10_Month.modelUpdate | 업무 |
| private setHtmlStyle() | L147-149 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L151-153 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={checkAppr}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Pay10_Lookup_Insert (`client/vi/pay/Pay10_Lookup_Insert.java`, 243줄)

- 입력·하위 화면: `payName` ComboBoxField("PayMonthCode"), `payCode` TextField, `payDate` MyDateField, `stdMonth` TextField 빈칸="YYYY.MM", `radio01` Radio, `radio02` Radio, `annualYn` TextField, `popup` Emp01_Lookup_TransDate

#### 이벤트
[E1] toggle.ValueChange (L83) → 인라인 L83-95 (new ValueChangeHandler<HasValue<Boole…)
[E2] payName[지급구분].Collapse (L122) → 인라인 L122-127 (new CollapseHandler() { @Override pub…)
[E3] payName[지급구분].ValueChange (L129) → 인라인 L129-140 (new ValueChangeHandler<String>() { @O…)
[E4] payDate[지급일자].ValueChange (L141) → 인라인 L141-146 (new ValueChangeHandler<Date>() { @Ove…)
[E5] updateButton[생성].Select (L148) → checkAppr()
[E6] closeButton[닫기].Select (L155) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L64-167 | 공개 메서드 | 상태 처리 | 업무 |
| public checkAppr() | L169-192 | E5 | 서비스 pay.Pay10_Month.checkAppr(companyId, payCode, payDate, monthId) | 업무 |
| public update() | L194-234 | checkAppr | 조회창 Emp01_Lookup_TransDate 열기, 서비스 pay.Pay10_Month.insert(companyId, payCode, payDate, annualYn, stdMonth) | 업무 |
| private setHtmlStyle() | L236-238 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L240-242 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={checkAppr}>생성</Button>
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

