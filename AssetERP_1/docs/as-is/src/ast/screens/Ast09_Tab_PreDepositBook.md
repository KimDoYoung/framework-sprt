# Ast09_Tab_PreDepositBook

- 종류: 화면
- 메뉴: 관리회계 > 21. 회계장부 > 선급금/선급비용 조회 (#1342)
- 파일: `client/vi/ast/Ast09_Tab_PreDepositBook.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act02_Grid_History`](../../act/components/Act02_Grid_History.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast09_Book.selectPreDepositByHoldDate` | Ast09_Tab_PreDepositBook:127 | [`Ast09_Book.java:52`](../../ast/services/Ast09_Book.md) | [`ast09_book.selectPreDepositByHoldDate`](../../ast/sql/ast09_book.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast11_book_close`](../../../db/tables/ast.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_corp_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast09_Tab_PreDepositBook (`client/vi/ast/Ast09_Tab_PreDepositBook.java`, 149줄)

- 레이아웃: north=buttonBar, center=grid, south=gridTr
- 툴바 `buttonBar`: 보유일자: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="구분/자산명/거래처"
- 그리드 `grid` (buildGrid()):
  - stdDate 120 "일자" Date
  - astSClassName 200 "구분" Text
  - astClassTreeName 350 "자산명" Text
  - corpName 200 "거래처" Text
  - holdQty 150 "잔액" Double

#### 이벤트
[E0] 화면 열림 (생성자 L39-68) → setting(), retrieve()
[E1] searchText.KeyPress [Enter] (L77) → retrieve()
[E2] retrieveButton[조회].Select (L89) → retrieve()
[E3] grid.RowClick (L96) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L70-102 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L118-140 | 생성자,E1,E2 | 서비스 ast.Ast09_Book.selectPreDepositByHoldDate(companyId, holdDate, searchText) | 업무 |
| private retrievePage() | L142-144 | E3,retrieve | 상태 처리 | 업무 |
| public buildGrid() | L104-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L146-148 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('stdDate', 120, '일자'),  // L109 SQL 계산 컬럼(selectPreDepositByHoldDate: #{holdDate})
  gb.text('astSClassNm', 200, '구분'),  // L110 SQL 계산 컬럼(selectPreDepositByHoldDate: f_cdnm('ItemSClassCode', ast01_item_s_c…)
  gb.text('astClassTreeNm', 350, '자산명'),  // L111 SQL 계산 컬럼(selectPreDepositByHoldDate: ast01_class_tree_nm)
  gb.text('corpNm', 200, '거래처'),  // L112 SQL 계산 컬럼(selectPreDepositByHoldDate: f_get_corp_nm(ast01_corp_id))
  gb.double('holdQty', 150, '잔액'),  // L113
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

