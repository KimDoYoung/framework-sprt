# Fnd10_Tab_RelateFnd

- 종류: 화면
- 메뉴: 펀드관리 > 02. 펀드관리 > 자산별 펀드 조회(ICAM) (#1124)
- 파일: `client/vi/fnd/Fnd10_Tab_RelateFnd.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast01_ClassTree.selectByAssetType` | Fnd10_Tab_RelateFnd:156 | [`Ast01_ClassTree.java:147`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByAssetType`](../../ast/sql/ast01_class_tree.md) |
| `fnd.Fnd10_Book.selectByRelateFnd` | Fnd10_Tab_RelateFnd:173 | [`Fnd10_Book.java:28`](../../fnd/services/Fnd10_Book.md) | [`fnd10_book.selectByRelateFnd`](../../fnd/sql/fnd10_book.md) |
| `sys.Sys12_Calendar.selectBizDate` | Fnd10_Tab_RelateFnd:86 | [`Sys12_Calendar.java:60`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.bizDate`](../../sys/sql/sys12_calendar.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd10_book`](../../../db/tables/fnd.md)

## DB 함수

`f_ast_class_tree_nm_allpath2`, `f_get_biz_date`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd10_Tab_RelateFnd (`client/vi/fnd/Fnd10_Tab_RelateFnd.java`, 184줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준일: {baseDate} 종목코드/명: {searchText} {retrieveButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField
- 그리드 `astGrid` (buildAstGrid()):
  - isin 150 "종목코드" Text
  - classTreeFullName 550 "종목명" Text
- 그리드 `bookGrid` (buildBookGrid()):
  - fundCode 150 "펀드코드" TextCenter
  - fundName 400 "펀드명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L50-78) → settings()
[E1] searchText.KeyPress [Enter] (L103) → retrieve()
[E2] astGrid.SelectionChanged [선택>0] (L112) → retrieve()
[E3] retrieveButton[조회].Select (L122) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildAstGrid() | L130-137 | 필드 초기화 | 상태 처리 | 업무 |
| private buildBookGrid() | L139-146 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L148-165 | E1,E2,E3,settings | 서비스 ast.Ast01_ClassTree.selectByAssetType(companyId, stdDate, assetType, searchText) | 업무 |
| public retrieve() | L167-179 | E1,E2,E3,settings | 서비스 fnd.Fnd10_Book.selectByRelateFnd(companyId, orgId, astClassTreeId, stdDate) | 업무 |
| private settings() | L80-128 | 생성자 | 서비스 sys.Sys12_Calendar.selectBizDate, 이벤트 연결, 초기값: baseDate=stdDate | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L181-183 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildAstGrid = () => [
  gb.text('isin', 150, '종목코드'),  // L133
  gb.text('classTreeFullNm', 550, '종목명'),  // L134 SQL 계산 컬럼(selectByAssetType: f_ast_class_tree_nm_allpath2(ast01_clas…)
];

const buildBookGrid = () => [
  gb.textCenter('fundCd', 150, '펀드코드'),  // L142 SQL 계산 컬럼(selectByRelateFnd: distinct c.fund_cd)
  gb.text('fundNm', 400, '펀드명'),  // L143 SQL 계산 컬럼(selectByRelateFnd: c.fund_nm)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

