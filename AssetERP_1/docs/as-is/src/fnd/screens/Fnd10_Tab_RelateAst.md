# Fnd10_Tab_RelateAst

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 펀드별 자산 조회(ICAM) (#1123)
- 파일: `client/vi/fnd/Fnd10_Tab_RelateAst.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `fnd.Fnd01_FundCode.selectByCompanyId` | Fnd10_Tab_RelateAst:181 | [`Fnd01_FundCode.java:326`](../../fnd/services/Fnd01_FundCode.md) | [`fnd01_fund_code.selectByCompanyId`](../../fnd/sql/fnd01_fund_code.md) |
| `fnd.Fnd10_Book.selectByRelateAst` | Fnd10_Tab_RelateAst:197 | [`Fnd10_Book.java:22`](../../fnd/services/Fnd10_Book.md) | [`fnd10_book.selectByRelateAst`](../../fnd/sql/fnd10_book.md) |
| `sys.Sys12_Calendar.selectBizDate` | Fnd10_Tab_RelateAst:97 | [`Sys12_Calendar.java:60`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.bizDate`](../../sys/sql/sys12_calendar.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd10_book`](../../../db/tables/fnd.md), [`icam06_fund_book`](../../../db/tables/icam.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath2`, `f_get_biz_date`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd10_Tab_RelateAst (`client/vi/fnd/Fnd10_Tab_RelateAst.java`, 203줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {baseDate} 펀드구분: {fundTypeComboBox} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="펀드코드/명", `fundTypeComboBox` ComboBoxField("FundType", "전체", "전체")
- 그리드 `fndGrid` (buildFndGrid()):
  - fundCode 150 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text
- 그리드 `bookGrid` (buildBookGrid()):
  - itemCode 150 "종목코드" Text
  - note 550 "종목명" Text
  - evalAmt 120 "평가금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L59-90) → settings()
[E1] fundTypeComboBox[FundType].Collapse (L114) → retrieve()
[E2] searchText.KeyPress [Enter] (L123) → retrieve()
[E3] fndGrid.SelectionChanged [선택>0] (L132) → retrieve()
[E4] retrieveButton[조회].Select (L142) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L54-56 | retrieve | 상태 처리 | 업무 |
| private buildFndGrid() | L150-157 | 필드 초기화 | 상태 처리 | 업무 |
| private buildBookGrid() | L159-170 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L172-190 | E1,E2,E3,E4,settings | 서비스 fnd.Fnd01_FundCode.selectByCompanyId(companyId, orgId, stdDate, fundType, searchText) | 업무 |
| public retrieve() | L192-198 | E1,E2,E3,E4,settings | 서비스 fnd.Fnd10_Book.selectByRelateAst(companyId, fundCodeId, stdDate) | 업무 |
| private settings() | L92-148 | 생성자 | 서비스 sys.Sys12_Calendar.selectBizDate, 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L200-202 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildFndGrid = () => [
  gb.textCenter('fundCd', 150, '펀드코드'),  // L153
  gb.text('fundNm', 400, '펀드명'),  // L154
];

const buildBookGrid = () => [
  gb.text('itemCd', 150, '종목코드'),  // L163
  gb.text('note', 550, '종목명'),  // L165
  gb.long('evalAmt', 120, '평가금액'),  // L166
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

