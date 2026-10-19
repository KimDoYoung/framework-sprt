# Pay10_Tab_MonthSearch

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 급여항목조회 (#1285)
- 파일: `client/vi/pay/Pay10_Tab_MonthSearch.java`
- 함께 쓰는 클래스 2개:
  - `Pay20_Lookup_MonthItem` `client/vi/pay/Pay20_Lookup_MonthItem.java`
  - `Pay10_Lookup_Rd_MonthSearch` `client/vi/pay/Pay10_Lookup_Rd_MonthSearch.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay11_MonthItem.selectByDate` | Pay10_Tab_MonthSearch:194 | [`Pay11_MonthItem.java:49`](../../pay/services/Pay11_MonthItem.md) | [`pay11_month_item.selectByDate`](../../pay/sql/pay11_month_item.md) |
| `pay.Pay20_Item.getMonthItem` | Pay20_Lookup_MonthItem:128 | [`Pay20_Item.java:47`](../../pay/services/Pay20_Item.md) | [`pay20_item.getMonthItem`](../../pay/sql/pay20_item.md) |
| `sys.Sys99_Print.insertRdMonthSearch` | Pay10_Tab_MonthSearch:118 | [`Sys99_Print.java:2495`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay11_month_item.selectByDate`](../../pay/sql/pay11_month_item.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay10_Tab_MonthSearch (`client/vi/pay/Pay10_Tab_MonthSearch.java`, 231줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 항목: {itemName} 검색: {searchText} {retrieveButton} {downLoadButton}
- 입력·하위 화면: `searchText` TextField 빈칸="사원/항목명", `itemName` LookupTriggerField 빈칸="전체", `startDate` MyDateField, `closeDate` MyDateField, `lookupMonthSearch` Pay10_Lookup_Rd_MonthSearch, `lookup` Pay20_Lookup_MonthItem
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - payDate 100 "지급일" Date
  - payName 100 "지급구분" TextCenter
  - personNo 100 "사번" TextCenter
  - personName 150 "사원명" TextCenter
  - posName 100 "직급" TextCenter
  - itemTypeName 150 "항목구분" TextCenter
  - itemName 250 "항목명" Text
  - itemAmt 150 "금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L144-163) → settings()
[E1] itemName.TriggerClick (L89) → lookupItemList()
[E2] searchText.KeyPress [Enter] (L97) → retrieve()
[E3] retrieveButton[조회].Select (L106) → retrieve()
[E4] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L112) → 서비스 sys.Sys99_Print.insertRdMonthSearch(companyId, personId, windowClassName, startDate, closeDate, itemCode, searchText)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L183-204 | E2,E3 | 서비스 pay.Pay11_MonthItem.selectByDate(companyId, startDate, closeDate, itemCode, searchText) | 업무 |
| public lookupItemList() | L206-221 | E1 | 조회창 Pay20_Lookup_MonthItem 열기 | 업무 |
| private settings() | L60-142 | 생성자 | 조회창 Pay10_Lookup_Rd_MonthSearch 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdMonthSearch(companyId, personId, windowClassName, startDate, closeDate, itemCode, searchText), 이벤트 연결, 초기값: startDate=fromDate, closeDate=endDate | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L165-181 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L223-226 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L228-230 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('payDate', 100, '지급일'),  // L171 SQL 계산 컬럼(selectByDate: pay10_date)
  gb.textCenter('payNm', 100, '지급구분'),  // L172 SQL 계산 컬럼(selectByDate: f_cdnm('PayMonthCode', pay10_pay_cd, 1,…)
  gb.textCenter('personNo', 100, '사번'),  // L173 SQL 계산 컬럼(selectByDate: emp01_emp_no)
  gb.textCenter('personNm', 150, '사원명'),  // L174 SQL 계산 컬럼(selectByDate: f_emp_kor_nm(pay10_person_id))
  gb.textCenter('posNm', 100, '직급'),  // L175 SQL 계산 컬럼(selectByDate: f_cdnm('EmpPosCode', emp03_pos_cd, emp0…)
  gb.textCenter('itemTypeNm', 150, '항목구분'),  // L176 SQL 계산 컬럼(selectByDate: f_cdnm('PayItemType', pay11_item_type, …)
  gb.text('itemNm', 250, '항목명'),  // L177 SQL 계산 컬럼(selectByDate: pay20_item_nm)
  gb.long('itemAmt', 150, '금액'),  // L178
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdMonthSearch(companyId, personId, windowClassName, startDate, closeDate, itemCode, searchText) */}>출력/다운로드</Button>

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

### Pay10_Lookup_Rd_MonthSearch (`client/vi/pay/Pay10_Lookup_Rd_MonthSearch.java`, 86줄)


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

