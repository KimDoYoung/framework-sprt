# 공통 그리드 이름표 (GridType · gb 컬럼)

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

## GridType

| GridType | AS-IS 판정 신호 | 동작 · 주요 prop |
|:---|:---|:---|
| `SingleGrid` | 편집기 인자 없음, `setChecked` 없음 | 1개 선택(클릭·방향키), 읽기 전용. `onSelect(row)` = AS-IS `SelectionChanged` |
| `MultiGrid` | `setChecked(SelectionMode.MULTI/SIMPLE)`, 편집기 없음 | 체크박스 + 헤더 체크박스. `onCheckedChange(rows)` |
| `CellEditGrid` | `addXxx(…, IsField)` 편집기 인자 있음 | 셀 편집 + 체크박스(삭제용) + Enter↓/Tab→. `crud={useGridCrud(...)}` |
| `ModalEditGrid` | 편집기 없음 + 행/셀 더블클릭 또는 수정 버튼 셀에서 `*_Edit_*` 팝업 | 1개 선택 + 더블클릭 → `onEdit(row)`. `editButton`(true/'라벨')이면 맨 뒤 버튼 컬럼 |

## 공통 옵션 (모든 GridType)

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

## gb 컬럼 — `gb.xxx(field, width, header, opts?)`

`header`의 `<br>`은 두 줄 헤더가 된다. `opts.editor`(`'text'|'largeText'|'number'|'date'|'select'` + `values`)가 있으면 편집 컬럼(파란 글씨).
그 밖의 `opts`는 AG Grid `ColDef`에 그대로 덮어쓴다.

| AS-IS GridBuilder | gb | 정렬 · 표시 |
|:---|:---|:---|
| `addText` | `gb.text` | 왼쪽 |
| `addTextCenter` | `gb.textCenter` | 가운데 |
| `addTextRight` | `gb.textRight` | 오른쪽 |
| `addTextArea` | `gb.textArea` | 왼쪽, 줄바꿈 유지·행 높이 자동 |
| `addTextStatus` | `gb.textStatus` | 완료/점검진행 파랑, 반려/승인반려 빨강, 미흡/개선 주황 (굵게) |
| `addLong` | `gb.long` | 오른쪽, 천단위 콤마 |
| `addLongCenter` | `gb.longCenter` | 가운데, 천단위 콤마 |
| `addLongColor` | `gb.longColor` | 오른쪽, **음수 빨강·양수 파랑** (원본 그대로) |
| `addDouble` | `gb.double` | 오른쪽, `#,###.######` |
| `addDoubleCenter` | `gb.doubleCenter` | 가운데 |
| `addDoubleColor` | `gb.doubleColor` | 오른쪽, **양수 빨강·음수 파랑** (원본 그대로) |
| `addDate` | `gb.date` | 가운데, `yyyy-MM-dd` |
| `addDateMonth` | `gb.dateMonth` | 가운데, `yyyy-MM` |
| `addDateTime` | `gb.dateTime` | 가운데, `yyyy-MM-dd HH:mm:ss` |
| `addBoolean` | `gb.boolean` | 네모 체크박스, 가운데, 두 상태, 정렬 안 함 (`{ editable: true }`면 클릭으로 바꿈) |
| `addBooleanYn` | `gb.booleanYn` | `O` / `X` |
| `addBooleanYn2` | `gb.booleanYn2` | 네모 체크박스, 가운데, 선택·해제 두 상태(null은 해제). 읽기 전용, `{ editable: true }`면 클릭으로 바꿈 (AS-IS는 ✓/빈칸 글자) |
| `addHeaderGroupMap` | `gb.group` | 헤더 묶음 |

렌더러(직접 쓸 때): `StatusCell`, `SignColorCell`, `ValueWithRateCell`(값 + 작은 비율), `ActionCell`(행 안 버튼, 클릭 전파 막음).

## 아직 대응 없음

`addCell`/`addCellFix`/`addCellNotSort`(사용자 정의 Cell: LookupTriggerCell 등), `addLongHtml`/`addTextHtml`류, `addLongCnt`, `addTextLink`,
`addApprStep`/`addStopLoss`/`addIcamUserState` 등 업무 전용 렌더러, `getAggregationGrid`/`getTotalGrid`, `GridGroupBuilder`/`GridExpandBuilder`.
나오면 원본 줄을 보고 화면에서 ColDef로 쓰고, 여러 화면에서 반복되면 여기에 gb를 추가한다.
