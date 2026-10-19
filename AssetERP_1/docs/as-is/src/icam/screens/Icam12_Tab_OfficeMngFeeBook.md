# Icam12_Tab_OfficeMngFeeBook

- 종류: 화면
- 메뉴: 관리회계 > 30. 사무보수관리 > ICAM 펀드보수 월말잔액 (#1200)
- 파일: `client/vi/icam/Icam12_Tab_OfficeMngFeeBook.java`
- 함께 쓰는 클래스 1개:
  - `Icam13_Lookup_FeeBookCheck` `client/vi/icam/Icam13_Lookup_FeeBookCheck.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icam.Icam12_FeeBook.selectByStdDatePaging` | Icam12_Tab_OfficeMngFeeBook:64 | [`Icam12_FeeBook.java:20`](../../icam/services/Icam12_FeeBook.md) | [`icam12_fee_book.selectByStdDatePaging`](../../icam/sql/icam12_fee_book.md), [`icam12_fee_book.selectByStdDatePagingTotal`](../../icam/sql/icam12_fee_book.md) |
| `icam.Icam13_FeeBookCheck.checkFeeBook` | Icam13_Lookup_FeeBookCheck:128 | [`Icam13_FeeBookCheck.java:36`](../../icam/services/Icam13_FeeBookCheck.md) | [`ast30_book_fund_fee.selectFeeBookDiff`](../../ast/sql/ast30_book_fund_fee.md), [`ast33_fund_trans.selectFundTransByCorpCode`](../../ast/sql/ast33_fund_trans.md), [`biz13_with_corp.selectManageTypeIs1`](../../biz/sql/biz13_with_corp.md), [`icam12_fee_book.delete`](../../icam/sql/icam12_fee_book.md), [`icam12_fee_book.insert`](../../icam/sql/icam12_fee_book.md), [`icam13_fee_book_check.delete`](../../icam/sql/icam13_fee_book_check.md), [`icam13_fee_book_check.insert`](../../icam/sql/icam13_fee_book_check.md) |
| `icam.Icam13_FeeBookCheck.selectByStdDate` | Icam13_Lookup_FeeBookCheck:117 | [`Icam13_FeeBookCheck.java:31`](../../icam/services/Icam13_FeeBookCheck.md) | [`icam13_fee_book_check.selectByStdDate`](../../icam/sql/icam13_fee_book_check.md) |

## 테이블

[`ast30_book_fund_fee`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz17_dual_manage_fund`](../../../db/tables/biz.md), [`icam10_fee`](../../../db/tables/icam.md), [`icam12_fee_book`](../../../db/tables/icam.md), [`icam13_fee_book_check`](../../../db/tables/icam.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_calc_dual_fund_fee`, `f_create_batchseq`, `f_emp_kor_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icam12_Tab_OfficeMngFeeBook (`client/vi/icam/Icam12_Tab_OfficeMngFeeBook.java`, 198줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar`: 기준년월: {yyyyMM} 검색: {searchTextField} {retrieveButton} {checkButton}
- 입력·하위 화면: `yyyyMM` TextField 빈칸="YYYY.MM", `searchTextField` TextField 빈칸="운용사/펀드/수탁사", `lookupCheck` Icam13_Lookup_FeeBookCheck
- 그리드 `grid` (buildGrid(), 체크박스):
  - stdDate 100 "기준일" Date
  - icamCompanyCode 70 "운용사코드" TextCenter
  - icamCompanyName 200 "운용사명" Text
  - fundCode 70 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
  - curCode 55 "통화" TextCenter
  - forFee 120 "누적보수(기준통화)" Double
  - fee 120 "누적보수(KRW)" Long
  - consignmentName 150 "수탁사" Text
  - workDateString 150 "생성일시" TextCenter
  - worker 150 "생성자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L46-80) → setting()
[E1] yyyyMM.KeyPress [Enter] (L91) → retrieve()
[E2] searchTextField.KeyPress [Enter] (L102) → retrieve()
[E3] retrieveButton[조회].Select (L111) → retrieve()
[E4] checkButton[ICAM 월말잔액 대사].Select (L117) → getStdDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L82-124 | 생성자 | 조회창 Icam13_Lookup_FeeBookCheck 열기 | 업무 |
| public retrieve() | L147-172 | E1,E2,E3 | 상태 처리 | 업무 |
| private getStdDate() | L174-180 | E4,retrieve | 서비스 yyyy.MM.dd | 업무 |
| public update() | L183-184 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L187-188 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L191-192 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L126-144 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일'),  // L131
  gb.textCenter('icamCompanyCd', 70, '운용사코드'),  // L132
  gb.text('icamCompanyNm', 200, '운용사명'),  // L133
  gb.textCenter('fundCd', 70, '펀드코드'),  // L134
  gb.text('fundNm', 400, '펀드명'),  // L135
  gb.textCenter('curCd', 55, '통화'),  // L136
  gb.double('forFee', 120, '누적보수(기준통화)'),  // L137
  gb.long('fee', 120, '누적보수(KRW)'),  // L138
  gb.text('consignmentNm', 150, '수탁사'),  // L139
  gb.textCenter('workDateString', 150, '생성일시'),  // L140 SQL 계산 컬럼(selectByStdDatePaging: to_char(icam12_work_date,'yyyy-mm-dd HH…)
  gb.textCenter('worker', 150, '생성자'),  // L141
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={getStdDate}>ICAM 월말잔액 대사</Button>

### Icam13_Lookup_FeeBookCheck (`client/vi/icam/Icam13_Lookup_FeeBookCheck.java`, 147줄)

- 툴바 `buttonBar`: {checkButton} {retrieveButton} {infoLabel}
- 그리드 `grid` (buildGrid()):
  - stdDate 100 "기준일" Date
  - result 620 "결과" TextArea
  - diffAmt 90 "차이금액" Double
  - workerName 80 "작업자" TextCenter
  - workDateString 140 "작업일시" Text

#### 이벤트
[E1] retrieveButton[조회].Select (L78) → retrieve()
[E2] checkButton[잔액대사].Select (L84) → check()
[E3] cancelButton[닫기].Select (L91) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-74 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L76-97 | open | 상태 처리 | 업무 |
| private retrieve() | L112-123 | E1,open,check | 서비스 icam.Icam13_FeeBookCheck.selectByStdDate(companyId, stdDate) | 업무 |
| private check() | L125-142 | E2 | 서비스 icam.Icam13_FeeBookCheck.checkFeeBook(companyId, personId, personName, stdDate) | 업무 |
| private buildGrid() | L99-110 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L144-146 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 100, '기준일'),  // L103
  gb.textArea('result', 620, '결과'),  // L104
  gb.double('diffAmt', 90, '차이금액'),  // L105
  gb.textCenter('workerNm', 80, '작업자'),  // L106 SQL 계산 컬럼(selectByStdDate: f_emp_kor_nm(icam13_worker))
  gb.text('workDateString', 140, '작업일시'),  // L107 SQL 계산 컬럼(selectByStdDate: to_char(icam13_work_date,'yyyy-mm-dd HH…)
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={check}>잔액대사</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

