# Fnd10_Lookup_RelateFund

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `flt`
- 파일: `client/vi/fnd/Fnd10_Lookup_RelateFund.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd10_Book.selectFundListByItemCode` | Fnd10_Lookup_RelateFund:188 | [`Fnd10_Book.java:40`](../../fnd/services/Fnd10_Book.md) | [`fnd10_book.selectFundListByItemCode`](../../fnd/sql/fnd10_book.md) |
| `fnd.Fnd10_Book.selectItemList` | Fnd10_Lookup_RelateFund:168 | [`Fnd10_Book.java:34`](../../fnd/services/Fnd10_Book.md) | [`fnd10_book.selectItemList`](../../fnd/sql/fnd10_book.md) |
| `sys.Sys12_Calendar.selectBizDate` | Fnd10_Lookup_RelateFund:125 | [`Sys12_Calendar.java:60`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.bizDate`](../../sys/sql/sys12_calendar.md) |

## 테이블

[`adv10_book`](../../../db/tables/adv.md), [`adv11_book_extr`](../../../db/tables/adv.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`flt09_fund_item`](../../../db/tables/flt.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd10_book`](../../../db/tables/fnd.md), [`fnd11_book_extr`](../../../db/tables/fnd.md)

## DB 함수

`f_get_biz_date`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd10_Lookup_RelateFund (`client/vi/fnd/Fnd10_Lookup_RelateFund.java`, 204줄)

- 툴바 `buttonBar`: 기준일: {stdDate} 종목코드/명: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="종목코드/종목명"
- 그리드 `itemGrid` (itemBuildGrid()):
  - itemCode 120 "종목코드" TextCenter
  - itemName 250 "종목명" Text
- 그리드 `fundGrid` (fundBuildGrid()):
  - fundCode 100 "펀드코드" TextCenter
  - fundName 350 "펀드명" Text
  - manageType 100 "구분" Text

#### 이벤트
[E0] 화면 열림 (생성자 L52-84) → setting(), show()
[E1] searchText.KeyPress [Enter] (L91) → itemRetrieve()
[E2] itemGrid.SelectionChanged [선택>0] (L100) → fundRetrieve()
[E3] retrieveButton[조회].Select (L110) → itemRetrieve()
[E4] closeButton[닫기].Select (L116) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L86-122 | 생성자 | 상태 처리 | 업무 |
| public open() | L124-139 | 공개 메서드 | 서비스 sys.Sys12_Calendar.selectBizDate | 업무 |
| private itemBuildGrid() | L141-148 | 필드 초기화 | 상태 처리 | 업무 |
| private fundBuildGrid() | L150-158 | 필드 초기화 | 상태 처리 | 업무 |
| public itemRetrieve() | L160-178 | E1,E3,open | 서비스 fnd.Fnd10_Book.selectItemList(companyId, stdDate, searchText) | 업무 |
| public fundRetrieve() | L180-194 | E2,itemRetrieve | 서비스 fnd.Fnd10_Book.selectFundListByItemCode(companyId, stdDate, itemCode) | 업무 |
| private setHtmlHeaderStyle() | L196-198 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L200-202 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const itemBuildGrid = () => [
  gb.textCenter('itemCd', 120, '종목코드'),  // L144
  gb.text('itemNm', 250, '종목명'),  // L145 SQL 계산 컬럼(selectItemList: com50_item_nm)
];

const fundBuildGrid = () => [
  gb.textCenter('fundCd', 100, '펀드코드'),  // L153 SQL 계산 컬럼(selectFundListByItemCode: fnd01_fund_cd)
  gb.text('fundNm', 350, '펀드명'),  // L154 SQL 계산 컬럼(selectFundListByItemCode: fnd02_fund_nm)
  gb.text('manageType', 100, '구분'),  // L155 SQL 계산 컬럼(selectFundListByItemCode: '운용')
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={itemRetrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

