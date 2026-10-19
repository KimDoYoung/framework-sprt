# Flt11_Tab_BookListAdmin

- 종류: 화면
- 메뉴: 준법감시 > 11. 임직원매매(준감인) > 보유내역조회 (#1154)
- 파일: `client/vi/flt/Flt11_Tab_BookListAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `flt.Flt10_Tr.getBizDate` | Flt11_Tab_BookListAdmin:249 | [`Flt10_Tr.java:459`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.getBizDate`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.insertFloorTrBook` | Flt11_Tab_BookListAdmin:216 | [`Flt10_Tr.java:468`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md) |
| `flt.Flt11_Book.selectByBookList` | Flt11_Tab_BookListAdmin:180 | [`Flt11_Book.java:35`](../../flt/services/Flt11_Book.md) | [`flt11_book.selectByBookList`](../../flt/sql/flt11_book.md) |
| `flt.Flt11_Book.update` | Flt11_Tab_BookListAdmin:241 | [`Flt11_Book.java:51`](../../flt/services/Flt11_Book.md) | `UpdateDataModel(flt11_book)` 동적 INSERT/UPDATE → [`flt11_book.selectById`](../../flt/sql/flt11_book.md) |
| `sys.Sys99_Print.insertRdBookListAdmin` | Flt11_Tab_BookListAdmin:265 | [`Sys99_Print.java:4193`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt11_book.selectByBookList`](../../flt/sql/flt11_book.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`emp04_add_title`](../../../db/tables/emp.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_biz_date`, `f_get_biz_days`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_floortrrcntbuydate`, `f_insert_floortrbook`, `f_today`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt11_Tab_BookListAdmin (`client/vi/flt/Flt11_Tab_BookListAdmin.java`, 323줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기준일: {baseDate} 사원명: {empKorName} {retrieveButton} {downloadButton} ※ 기준일부터 현재일까지 정리됩니다: {rdFileDownloadForm}
- 입력·하위 화면: `baseDate` MyDateField, `empKorName` LookupTriggerField 빈칸="전체", `empSearch` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - personOrgName 150 "사원명" Text
  - checkCycleName 100 "점검주기" TextCenter
  - buyDate 100 "최근매매일" Date
  - accountNo 200 "계좌" Text
  - itemTypeName 150 "종목유형" Text
  - itemName 250 "종목명" Text
  - bookQty 80 "보유수량" Double
  - bookAmt 120 "보유금액" Long
  - bookDays 120 "보유기간" TextCenter
  - yearInvestLimit 120 "연간투자금액" Long
  - totalInvestAmt 120 "총누적투자금액" Long
  - turnoverRate 120 "월간매매회전율(%)" Double

#### 이벤트
[E0] 화면 열림 (생성자 L65-95) → settings()
[E1] empKorName.TriggerClick [result == null] (L105) → 인라인 L105-123 (new TriggerClickHandler(){ @Override …)
[E2] empKorName.Change (L124) → 인라인 L124-131 (new ChangeHandler() { @Override publi…)
[E3] retrieveButton[조회].Select (L133) → retrieve()
[E4] downloadButton[엑셀다운로드].Select (L147) → createRdExcel()
[E5] msgBox.DialogHide [YES] (L197) → arrange()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L173-186 | E3 | 서비스 flt.Flt11_Book.selectByBookList(companyId, personId, baseDate) | 업무 |
| private preArrange() | L188-213 | 미사용 후보 | 확인창 표시 | 업무 |
| private arrange() | L215-237 | E5 | 서비스 flt.Flt10_Tr.insertFloorTrBook(companyId, personId, accountId, itemType, itemName, itemCode, startDate) | 업무 |
| public update() | L239-242 | 공개 메서드 | 서비스 flt.Flt11_Book.update | 업무 |
| private setInitData() | L244-260 | settings | 서비스 flt.Flt10_Tr.getBizDate(companyId, baseDate) | 업무 |
| private createRdExcel() | L262-314 | E4 | 서비스 sys.Sys99_Print.insertRdBookListAdmin(windowClassName, companyId, personId, personId, baseDate) | 업무 |
| private settings() | L97-153 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: empKorName=null, empKorName=codeModel.getEmpPersonModel( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L155-171 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L316-318 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L320-322 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personOrgNm', 150, '사원명'),  // L157 SQL 계산 컬럼(selectByBookList: CONCAT(flt11_person_nm,'('||flt11_org_n…)
  gb.textCenter('checkCycleNm', 100, '점검주기'),  // L158 SQL 계산 컬럼(selectByBookList: f_cdnm('FloorTrCheckCycle', flt11_check…)
  gb.date('buyDate', 100, '최근매매일'),  // L159 SQL 계산 컬럼(selectByBookList: f_get_floorTrRcntBuyDate( flt11_company…)
  gb.text('accountNo', 200, '계좌'),  // L160 SQL 계산 컬럼(selectByBookList: TO_DECRYPTS(flt03_account_no) || ' (' |…)
  gb.text('itemTypeNm', 150, '종목유형'),  // L161 SQL 계산 컬럼(selectByBookList: flt05_item_type_nm)
  gb.text('itemNm', 250, '종목명'),  // L162
  gb.double('bookQty', 80, '보유수량'),  // L163
  gb.long('bookAmt', 120, '보유금액'),  // L164
  gb.textCenter('bookDays', 120, '보유기간'),  // L165 SQL 계산 컬럼(selectByBookList: CASE WHEN flt11_buy_date IS NULL THEN '…)
  gb.long('yearInvestLimit', 120, '연간투자금액'),  // L166 SQL 계산 컬럼(selectByBookList: f_get_floorTrCheck('1', emp00_company_i…)
  gb.long('totalInvestAmt', 120, '총누적투자금액'),  // L167 SQL 계산 컬럼(selectByBookList: f_get_floorTrCheck('2', emp00_company_i…)
  gb.double('turnoverRate', 120, '월간매매회전율(%)'),  // L168 SQL 계산 컬럼(selectByBookList: f_get_floorTrCheck('3', emp00_company_i…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

