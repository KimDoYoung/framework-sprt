# grid-style — 그리드 이름표 (부품 · 형식)

그리드 관련 이름표는 이 문서 하나다. 두 층으로 나뉜다.

1. **공통 부품 이름표** — GridType·`gb.*` 컬럼·옵션. 그리드를 **무엇으로 만드는지**. yunhee 변환 명세와 TOBE 코드가 이 이름만 쓴다.
2. **그리드 형식(GID)** — 그리드 한 개가 **어떻게 보이는지**(열 폭·합계·선·색). 화면 전체 배치는 `page-style.md`(SID).

## 1. 공통 부품 이름표 (GridType · gb 컬럼)


AS-IS GXT `Grid` + `GridBuilder` → TOBE `OMS/frontend/src/components/grid`. 여기 이름이 **ID**다.
yunhee 변환 명세는 이 표의 이름만 쓰고, Claude는 명세가 지정한 GridType·`gb.*` 코드를 그대로 붙인다.
여기 없는 AS-IS 메서드는 추측하지 않고 `⚠ 대응 없음 (GridBuilder L###)`으로 표시한 뒤 화면에서 직접 ColDef를 쓴다.

```tsx
import { SingleGrid, gbFor } from '@/components/grid';
const gb = gbFor<CompanyDetail>();
const cols = [gb.text('companyNm', 200, '고객명'), gb.textCenter('icamCompanyCd', 80, 'ICAM<br>운용사코드')];
<SingleGrid<CompanyDetail> gridRef={gridRef} rowData={rows} columnDefs={cols}
  getRowId={p => String(p.data.companyId)} onSelect={row => …} />
```
레퍼런스: `OMS/frontend/src/pages/sys/Sys01_Tab_Company.tsx` (SingleGrid).

### GridType

| GridType | AS-IS 판정 신호 | 동작 · 주요 prop |
|:---|:---|:---|
| `SingleGrid` | 편집기 인자 없음, `setChecked` 없음 | 1개 선택(클릭·방향키), 읽기 전용. `onSelect(row)` = AS-IS `SelectionChanged` |
| `MultiGrid` | `setChecked(SelectionMode.MULTI/SIMPLE)`, 편집기 없음 | 체크박스 + 헤더 체크박스. `onCheckedChange(rows)` |
| `CellEditGrid` | `addXxx(…, IsField)` 편집기 인자 있음 | 셀 편집 + 체크박스(삭제용) + Enter↓/Tab→. `crud={useGridCrud(...)}` |
| `ModalEditGrid` | 편집기 없음 + 행/셀 더블클릭 또는 수정 버튼 셀에서 `*_Edit_*` 팝업 | 1개 선택 + 더블클릭 → `onEdit(row)`. `editButton`(true/'라벨')이면 맨 뒤 버튼 컬럼 |

### 공통 옵션 (모든 GridType)

| 옵션 | AS-IS | 기본 |
|:---|:---|:---|
| `rowNumber` | `RowNumberer` 40px (`setRowNumHidden(true)` → `false`) | `true` |
| `density` | `setRowPadding` / `setContentFontSize` | `'normal'`(헤더 36·행 32), `'compact'`(28·24) |
| `sortable` | `setSortable(false)` → `false` | `true` |
| `headerColor` | `setHtmlGridStyle(header, color)` (그리드 단위로) | 없음 — 공통 연회색 `#f5f5f5`(`theme.ts`). 그 그리드만 다른 색 |
| `sumRow={{ labelField, label, sum, avg }}` | `getSumGrid` / `setSumGrid(i)` / `setAvgGrid(i)` | 없음. 맨 아래 고정 합계 행(`.summary-row`) |
| `gb.group(header, children)` | `addHeaderGroupMap` | — |
| 트리 | `getTreeGrid` | `hooks/useTreeGrid.tsx`를 SingleGrid/CellEditGrid에 `{...tree.gridProps}`로 |
| CSV | (엑셀 다운로드) | `gridRef.current.api.exportDataAsCsv()` |

모두 기본으로 들어간다: 굵은 헤더, 줄무늬, 컬럼선, 헤더 메뉴 없음, 정렬·폭 조절 허용, px 고정 폭, 부모 채우기.
모양 값(높이·색)은 `components/grid/theme.ts` 한 곳에 있다 (hover `#f1f5f9`, 선택 `#dbeafe`, 합계행 `#f8fafc`).

### gb 컬럼 — `gb.xxx(field, width, header, opts?)`

`header`의 `<br>`은 두 줄 헤더가 된다. `opts.editor`(`'text'|'largeText'|'number'|'date'|'select'` + `values`)가 있으면 편집 컬럼(파란 글씨).
그 밖의 `opts`는 AG Grid `ColDef`에 그대로 덮어쓴다.

| AS-IS GridBuilder | gb | 정렬 · 표시 |
|:---|:---|:---|
| `addText` | `gb.text` | 왼쪽 |
| `addTextCenter` | `gb.textCenter` | 가운데 |
| `addTextRight` | `gb.textRight` | 오른쪽 |
| `addTextArea` | `gb.textArea` | 왼쪽, 줄바꿈 유지·행 높이 자동 |
| `addTextStatus` | `gb.textStatus` | 완료/점검진행 파랑, 반려/승인반려 빨강, 미흡/개선 주황 (굵게) |
| `addLong` | `gb.long` | 오른쪽, 천단위 콤마 (열 이름이 `…Id`면 왼쪽 정렬·콤마 없음 — UX-13) |
| `addLongCenter` | `gb.longCenter` | 가운데, 천단위 콤마 (UX-13 같음) |
| `addLongColor` | `gb.longColor` | 오른쪽, **음수 빨강·양수 파랑** (원본 그대로) |
| `addLongSecond(…, color)` | `gb.longSecond(f, w, h, color)` | 오른쪽, 굵은 정수(콤마 없음), 0·빈 값은 회색 0, 그 밖은 color |
| `addDouble` | `gb.double` | 오른쪽, `#,###.######` |
| `addDoubleCenter` | `gb.doubleCenter` | 가운데 |
| `addDoubleColor` | `gb.doubleColor` | 오른쪽, **양수 빨강·음수 파랑** (원본 그대로) |
| `addDate` | `gb.date` | 가운데, `yyyy-MM-dd` |
| `addDateMonth` | `gb.dateMonth` | 가운데, `yyyy-MM` |
| `addDateTime` | `gb.dateTime` | 가운데, `yyyy-MM-dd HH:mm:ss` |
| `addBoolean` | `gb.boolean` | 네모 체크박스, 가운데, 두 상태, 정렬 안 함 (`{ editable: true }`면 클릭으로 바꿈) |
| `addBooleanYn` | `gb.booleanYn` | `O` / `X` |
| `addBooleanIcon` | `gb.booleanIcon` | 잠금 아이콘(`LockOutlined`)만 — true면 아이콘, null·false는 빈칸. 가운데, 읽기 전용 (AS-IS `lock.png`. A19) |
| `addTextHtml` | `gb.textHtml` | 왼쪽, 값의 HTML(굵은 색 글씨 등)을 보여 줌 — 위험한 태그는 글자로 (`sanitizeHtml`, F01) |
| `addBookMarkYn` | `gb.bookmarkYn` | 가운데, true면 노란 별 (F01) |
| `addBooleanYn2` | `gb.booleanYn2` | 네모 체크박스, 가운데, 선택·해제 두 상태(null은 해제). 읽기 전용, `{ editable: true }`면 클릭으로 바꿈 (AS-IS는 ✓/빈칸 글자) |
| `addHeaderGroupMap` | `gb.group` | 헤더 묶음 |

**체크박스 폭 원칙** (사용자 확정 2026-11-09): 체크박스 컬럼(`gb.boolean`·`gb.booleanYn2`·`tgb.boolean`)의 제목이 3글자(`<br>` 없음)면 폭은 70으로 한다. 예: `gb.booleanYn2('mainTitleYn', 70, '본업무')`. `gb.booleanYn`(O/X)·`gb.booleanIcon`은 해당 없음. 기존 화면은 같은 날 일괄 적용했다(26건).

렌더러(직접 쓸 때): `StatusCell`, `SignColorCell`, `ValueWithRateCell`(값 + 작은 비율), `ActionCell`(행 안 버튼, 클릭 전파 막음).

### 아직 대응 없음

`addCell`/`addCellFix`/`addCellNotSort`(사용자 정의 Cell: LookupTriggerCell 등), `addLongHtml`류, `addLongCnt`, `addTextLink`,
`addApprStep`/`addStopLoss`/`addIcamUserState` 등 업무 전용 렌더러, `getAggregationGrid`/`getTotalGrid`, `GridGroupBuilder`/`GridExpandBuilder`.
나오면 원본 줄을 보고 화면에서 ColDef로 쓰고, 여러 화면에서 반복되면 여기에 gb를 추가한다.


## 2. 그리드 형식 (GID)

견본 코드는 `docs/grid-style/{GID}/`(참조용 복사본). 새 그리드는 해당 GID의 견본을 뼈대로 만들고, 견본에 없는 모양이면 사용자에게 알린 뒤 새 GID로 먼저 등록한다. 기존 화면은 일괄 수정하지 않고 다시 건드릴 때 맞춘다(page-style과 같은 규칙).

| GID | 이름 | 한 줄 설명 | 견본 |
|:---|:---|:---|:---|
| grid-SUM | 합계 행이 이어지는 표 | 열 폭이 화면에 맞게 줄고 숫자는 잘리지 않으며, 합계 행이 마지막 내역 바로 다음에 붙는다 | `Biz01_TabPage_MonthEntertmExpense` (U18 월별 제공금액 누계, 2026-10-30) |

### grid-SUM — 합계 행이 이어지는 표 (초안, 2026-10-30 U18에서 사용자 확정)

견본: `docs/grid-style/grid-SUM/` (`Biz01_TabPage_MonthEntertmExpense.tsx` + 도우미 `bizEntertmTab.ts`의 `fitCols`·`withTotalRow`·`totalRowClass`·`gridSumCss`)

- **수평 스크롤 방지**: 열 폭은 AS-IS 폭을 비율(`flex`)로 쓰고, 열마다 최소 폭을 데이터에서 계산한다 — `max(최대 글자 수 × 8 + 24, 제목 글자 수 × 13 + 24, 40)`, AS-IS 폭을 넘지 않음. 숫자는 잘리지 않고, 정말 모자란 화면에서만 가로 스크롤이 생긴다. 도우미 `fitCols(cols, rows)`.
- **합계 행**: 공통 `sumRow`(맨 아래 고정)를 쓰지 않고, 조회 결과 끝에 합계 행(가짜 키 -1)을 데이터로 붙여 **마지막 내역 바로 다음 행**으로 둔다. 조회 결과가 0건이면 합계 행도 없다. `getRowClass`로 `…-total-row` 클래스를 준다.
  - 합계 행 모양: 배경은 공통 합계 행 색(`var(--gb-summary-row)`), 굵은 글씨, **위에 2px 연한 파랑 선(`#91caff`)**, 행번호는 `color: transparent`(왼쪽 고정 열), `pointer-events: none`(선택·클릭 불가).
- **셀 세로선**: 모든 셀 오른쪽에 `1px solid #e0e0e0`.
- **합계 열**(있으면): 사용자(이름) 열 바로 뒤에 두고 **숫자만 굵은 파랑**(`#1677ff`), 배경색은 다른 열과 같다(회색 배경은 선택 행 색을 가려 쓰지 않는다).
- 스타일은 그리드를 감싼 `div` 클래스(`entertm-month`)로 범위를 좁혀 인라인 `<style>`로 둔다 — 공통 `grid.css`는 건드리지 않는다. 세 번째 화면에서 쓰게 되면 공통 부품으로 뽑을 후보(03 원칙 15, 사용자 승인 뒤).
- 값·열 순서는 AS-IS와 같게 두되 사용자 요청으로 바꾼 부분(합 계 열 위치, 합계 행 위치)은 화면 머리 주석에 날짜와 함께 적는다.

#### grid-SUM 특징 점검표 (새 화면을 만들거나 다시 건드릴 때 하나씩 본다)

| # | 특징 | 값 | 이유·결정 |
|---:|:---|:---|:---|
| 1 | 가로 스크롤 | 안 생김(최소 폭 합이 화면보다 클 때만) | Page 원칙 1. 화면 폭에 맞추느라 숫자가 안 보이면 곤란하다는 결정 → 최소 폭은 고정값이 아니라 데이터로 계산 |
| 2 | 열 폭 | AS-IS 폭 = `flex` 비율, `minWidth` = 값·제목 길이 | AS-IS 폭보다 좁아질 수 있으나 최소 폭이 AS-IS 폭을 넘지 않는다 |
| 3 | 합계 행 위치 | 마지막 내역 바로 다음 행 | 사용자 요청. 공통 `sumRow`(맨 아래 고정)와 다르다. 0건이면 합계 행 없음, 행이 많으면 스크롤 끝에 있음 |
| 4 | 합계 행 윗선 | 2px `#91caff` | 구분선이 필요(처음 안 보임 → `!important`로 셀에 직접). 처음 `#1677ff`는 너무 진해 연하게 |
| 5 | 합계 행 모양 | 공통 합계 행 배경(`--gb-summary-row`)·굵은 글씨·행번호 숨김·클릭 불가 | 선택 행 색이 합계 행에 번지지 않게 |
| 6 | 셀 세로선 | 오른쪽 1px `#e0e0e0` | 사용자 요청 |
| 7 | 합계 열 위치 | 사용자 열 바로 뒤 | 사용자 요청(AS-IS는 맨 오른쪽) |
| 8 | 합계 열 모양 | 숫자만 굵은 파랑 `#1677ff`, **배경색은 다른 열과 같게** | 열에 회색·파랑 배경을 주면 선택 행 색을 가려 "행이 뒤에 있는 듯" 보여서 뺐다 |
| 9 | 숫자 정렬·형식 | `gb.long` 그대로(천 단위 쉼표, 오른쪽) | 공통 |
| 10 | 적용 범위 | 그리드를 감싼 `div` 클래스 안, 인라인 `<style>` | 공통 `grid.css` 불변. 반복되면 부품 후보 |

선택 행 색을 가리는 셀 배경은 쓰지 않는다(8번). 새로 정한 모양이 생기면 이 표에 행을 더하고, 견본 복사본도 같이 갱신한다.

적용 화면: U18 `Biz01_Tab_EntertmExpenseReport`의 탭 3개 — 월별(견본), 제공 내역(합계 행 카드승인일 열), 거래처별(왼쪽 거래처 목록만 합계 행, 오른쪽 내역은 합계 없이 세로선·열 폭만)
