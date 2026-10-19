# Pay10_Tab_MonthItem

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 급여관리(항목별) (#1281)
- 파일: `client/vi/pay/Pay10_Tab_MonthItem.java`
- 함께 쓰는 클래스 4개:
  - `Pay20_Lookup_MonthItem` `client/vi/pay/Pay20_Lookup_MonthItem.java`
  - `Pay10_Lookup_Rd_MonthItem` `client/vi/pay/Pay10_Lookup_Rd_MonthItem.java`
  - `Pay10_Lookup_Insert` `client/vi/pay/Pay10_Lookup_Insert.java`
  - `Pay10_Lookup_GroupList` `client/vi/pay/Pay10_Lookup_GroupList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp01_Lookup_TransDate`](../../emp/components/Emp01_Lookup_TransDate.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay10_Month.checkAppr` | Pay10_Lookup_Insert:173, Pay10_Tab_MonthItem:235 | [`Pay10_Month.java:211`](../../pay/services/Pay10_Month.md) | [`act02_journal.countByPayMonthCode`](../../act/sql/act02_journal.md), [`pay05_relate_appr.checkAppr`](../../pay/sql/pay05_relate_appr.md) |
| `pay.Pay10_Month.insert` | Pay10_Lookup_Insert:211 | [`Pay10_Month.java:243`](../../pay/services/Pay10_Month.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay01_annual.selectByApprStatus`](../../pay/sql/pay01_annual.md), [`pay10_month.insert`](../../pay/sql/pay10_month.md), [`pay10_month.selectByPayDatePersonId`](../../pay/sql/pay10_month.md), [`pay11_month_item.getAdjustPay`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureEi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureHi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureLtc`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureNps`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.insert`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.insertLatestInfo`](../../pay/sql/pay11_month_item.md), [`sys12_calendar.workDayPerson`](../../sys/sql/sys12_calendar.md) |
| `pay.Pay10_Month.selectByYear` | Pay10_Lookup_GroupList:161 | [`Pay10_Month.java:87`](../../pay/services/Pay10_Month.md) | [`pay10_month.selectByYear`](../../pay/sql/pay10_month.md) |
| `pay.Pay11_MonthItem.insertItemType` | Pay10_Tab_MonthItem:292 | [`Pay11_MonthItem.java:83`](../../pay/services/Pay11_MonthItem.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay10_month.selectByCompanyId`](../../pay/sql/pay10_month.md), [`pay11_month_item.insert`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay11_MonthItem.selectByText` | Pay10_Tab_MonthItem:394 | [`Pay11_MonthItem.java:66`](../../pay/services/Pay11_MonthItem.md) | [`pay11_month_item.selectByText`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay11_MonthItem.updateMonthItemList` | Pay10_Tab_MonthItem:328 | [`Pay11_MonthItem.java:262`](../../pay/services/Pay11_MonthItem.md) | [`pay11_month_item.getIncomeTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getInsureAdjustModi`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.getLocalTax`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateItemAmt`](../../pay/sql/pay11_month_item.md), [`pay11_month_item.updateModel`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay20_Item.getMonthItem` | Pay20_Lookup_MonthItem:128 | [`Pay20_Item.java:47`](../../pay/services/Pay20_Item.md) | [`pay20_item.getMonthItem`](../../pay/sql/pay20_item.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Pay10_Lookup_GroupList:77 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdMonthItem` | Pay10_Tab_MonthItem:160 | [`Sys99_Print.java:2542`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay11_month_item.selectByText`](../../pay/sql/pay11_month_item.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay01_annual`](../../../db/tables/pay.md), [`pay05_relate_appr`](../../../db/tables/pay.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_calc_4insure_ei`, `f_calc_4insure_hi`, `f_calc_4insure_ltc`, `f_calc_4insure_nps`, `f_calc_income_tax`, `f_calc_local_tax`, `f_cdnm`, `f_create_4insure_adjust_modi`, `f_create_4insure_adjust_pay`, `f_create_seq`, `f_emp_kor_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay10_Tab_MonthItem (`client/vi/pay/Pay10_Tab_MonthItem.java`, 415줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 해당 연도: {yearText} 구분: {payGroupName} 항목: {itemName} 검색: {searchText} {retrieveButton} {updateButton} {insertButton} {downLoadButton}
- 입력·하위 화면: `yearText` TextField, `searchText` TextField 빈칸="사원/항목명", `monthId` LongField, `payDate` MyDateField, `payGroupName` LookupTriggerField 빈칸="구분을 선택해주세요", `itemName` LookupTriggerField 빈칸="전체", `lookupMonthItem` Pay10_Lookup_Rd_MonthItem, `lookupInsert` Pay10_Lookup_Insert, `lookup` Pay20_Lookup_MonthItem, `lookupGroupList` Pay10_Lookup_GroupList
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 100 "사번" TextCenter
  - personName 150 "사원명" TextCenter
  - posName 100 "직급" TextCenter
  - itemTypeName 150 "항목구분" TextCenter
  - itemName 250 "항목명" Text
  - itemAmt 150 "금액" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L186-205) → settings()
[E1] payGroupName.TriggerClick (L104) → lookupPayGroup()
[E2] itemName.TriggerClick (L112) → lookupItemList()
[E3] searchText.KeyPress [Enter] (L120) → retrieve()
[E4] retrieveButton[조회].Select (L133) → retrieve()
[E5] updateButton[저장].Select (L139) → checkAppr()
[E6] insertButton[일괄생성].Select (L145) → lookupItem()
       └ [E8] msgBox.DialogHide [YES] (L270) → insertItem()
[E7] downLoadButton[출력/다운로드].Select (L151) → 서비스 sys.Sys99_Print.insertRdMonthItem(companyId, personId, windowClassName, payCode, payDate, itemCode, searchText), 메시지 "구분을 선택해주세요"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package isNumberic() | L73-80 | 미사용 후보 | 상태 처리 | 업무 |
| public insert() | L222-232 | 공개 메서드 | 조회창 Pay10_Lookup_Insert 열기 → 콜백: unmask | 업무 |
| public checkAppr() | L234-253 | E5 | 서비스 pay.Pay10_Month.checkAppr(companyId, payCode, payDate, monthId) | 업무 |
| public lookupItem() | L255-289 | E6 | 조회창 Pay20_Lookup_MonthItem 열기, ConfirmBox → E8 | 업무 |
| public insertItem() | L291-307 | E8 | 서비스 pay.Pay11_MonthItem.insertItemType(companyId, payCode, payDate, itemType, itemCode) | 업무 |
| public update() | L309-345 | checkAppr | 서비스 pay.Pay11_MonthItem.updateMonthItemList(updateList, payDate) | 업무 |
| public lookupPayGroup() | L347-360 | E1 | 조회창 Pay10_Lookup_GroupList 열기 | 업무 |
| public lookupItemList() | L362-377 | E2 | 조회창 Pay20_Lookup_MonthItem 열기 | 업무 |
| public retrieve() | L379-405 | E3,E4,insertItem,update | 미선택 시 alert "구분을 선택해주세요", 서비스 pay.Pay11_MonthItem.selectByText(companyId, payCode, payDate, itemCode, searchText) | 업무 |
| private settings() | L82-184 | 생성자 | 조회창 Pay10_Lookup_Rd_MonthItem 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdMonthItem(companyId, personId, windowClassName, payCode, payDate, itemCode, searchText), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L207-220 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L407-410 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L412-414 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 100, '사번'),  // L212 SQL 계산 컬럼(selectByText: emp01_emp_no)
  gb.textCenter('personNm', 150, '사원명'),  // L213 SQL 계산 컬럼(selectByText: f_emp_kor_nm(pay10_person_id))
  gb.textCenter('posNm', 100, '직급'),  // L214 SQL 계산 컬럼(selectByText: f_cdnm('EmpPosCode', emp03_pos_cd, emp0…)
  gb.textCenter('itemTypeNm', 150, '항목구분'),  // L215 SQL 계산 컬럼(selectByText: f_cdnm('PayItemType', pay11_item_type, …)
  gb.text('itemNm', 250, '항목명'),  // L216 SQL 계산 컬럼(selectByText: pay20_item_nm)
  gb.long('itemAmt', 150, '금액', { editor: 'number' }),  // L217
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={checkAppr}>저장</Button>
3. <Button type="generate" onClick={lookupItem}>일괄생성</Button>
4. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdMonthItem(companyId, personId, windowClassName, payCode, payDate, itemCode, searchText), 메시지 "구분을 선택해주세요" */}>출력/다운로드</Button>

### Pay20_Lookup_MonthItem (`client/vi/pay/Pay20_Lookup_MonthItem.java`, 155줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="항목명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - itemTypeName 150 "항목구분" TextCenter
  - itemName 300 "항목명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L49-109) → show()
[E1] searchText.KeyPress [Enter] (L65) → retrieve()
[E2] retrieveButton[조회].Select (L73) → retrieve()
[E3] confirmButton[확인].Select (L79) → confirm()
[E4] cancelButton[취소].Select (L85) → hide()
[E5] grid.CellDoubleClick (L97) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openMonthItem() | L44-47 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L123-134 | E1,E2,openMonthItem | 서비스 pay.Pay20_Item.getMonthItem(searchText) | 업무 |
| public confirm() | L136-146 | E3,E5 | 상태 처리 | 업무 |
| private buildGrid() | L111-121 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L148-150 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L152-154 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeNm', 150, '항목구분'),  // L117 SQL 계산 컬럼(getMonthItem: f_cdnm('PayItemType', pay20_item_type, …)
  gb.text('itemNm', 300, '항목명'),  // L118
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Pay10_Lookup_Rd_MonthItem (`client/vi/pay/Pay10_Lookup_Rd_MonthItem.java`, 86줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-51) → show()
[E1] closeButton[닫기].Select (L40) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L82-84 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

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

