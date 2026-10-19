# Sys10_Tab_TotalSize

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 고객별 서버사용량 (#1306)
- 파일: `client/vi/sys/Sys10_Tab_TotalSize.java`
- 함께 쓰는 클래스 1개:
  - `Sys10_TabPage_Detail` `client/vi/sys/Sys10_TabPage_Detail.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys10_File.selectByTotalSize` | Sys10_Tab_TotalSize:98 | [`Sys10_File.java:180`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByTotalSize`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByTotalSizeMonth` | Sys10_TabPage_Detail:95 | [`Sys10_File.java:196`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByTotalSizeMonth`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByTotalSizeYear` | Sys10_TabPage_Detail:72 | [`Sys10_File.java:188`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByTotalSizeYear`](../../sys/sql/sys10_file.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys10_Tab_TotalSize (`client/vi/sys/Sys10_Tab_TotalSize.java`, 124줄)

- 레이아웃: center=vlc, east=tabPage
- 툴바 `buttonBar`: {retrieveButton} {useYnBox}
- 입력·하위 화면: `useYnBox` CheckBox, `tabPage` Sys10_TabPage_Detail
- 그리드 `grid` (buildGrid(), 체크박스):
  - companyName 250 "회사" Text
  - locName 80 "서브도메인" Text
  - runningTotalSize 200 "누적사용용량(MB)" Double

#### 이벤트
[E0] 화면 열림 (생성자 L37-64) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L70) → retrieve()
[E2] grid.RowClick (L76) → retrieveTabPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L94-110 | 생성자,E1 | 서비스 sys.Sys10_File.selectByTotalSize(useYn) | 업무 |
| private retrieveTabPage() | L112-119 | E2,retrieve | 상태 처리 | 업무 |
| private settings() | L66-82 | 생성자 | 이벤트 연결, 초기값: useYnBox=true("사용고객만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L84-92 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L121-123 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 250, '회사'),  // L87 SQL 계산 컬럼(selectByTotalSize: sys01_company_nm)
  gb.text('locNm', 80, '서브도메인'),  // L88 SQL 계산 컬럼(selectByTotalSize: sys01_loc_nm)
  gb.double('runningTotalSize', 200, '누적사용용량(MB)'),  // L89 SQL 계산 컬럼(selectByTotalSize: ( SELECT ROUND(SUM(sys10_size)*(0.001),…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys10_TabPage_Detail (`client/vi/sys/Sys10_TabPage_Detail.java`, 103줄)

- 레이아웃: center=vlc
- 그리드 `gridYear` (buildGridYear()):
  - year 100 "사용연도" TextCenter
  - totalSize 150 "사용용량(MB)" Double
- 그리드 `gridMonth` (buildGridMonth()):
  - month 100 "사용월" TextCenter
  - totalSize 150 "사용용량(MB)" Double

#### 이벤트
[E0] 화면 열림 (생성자 L27-45) → 초기화
[E1] gridYear.RowClick (L39) → retrieveMonth()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGridYear() | L47-53 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGridMonth() | L55-61 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L63-85 | 공개 메서드 | 서비스 sys.Sys10_File.selectByTotalSizeYear(locName) | 업무 |
| public retrieveMonth() | L87-102 | E1,retrieve | 서비스 sys.Sys10_File.selectByTotalSizeMonth(locName, year) | 업무 |

#### Grid Spec
```javascript
const buildGridYear = () => [
  gb.textCenter('year', 100, '사용연도'),  // L49 SQL 계산 컬럼(selectByTotalSizeYear: a.year)
  gb.double('totalSize', 150, '사용용량(MB)'),  // L50 SQL 계산 컬럼(selectByTotalSizeYear: a.total_size)
];

const buildGridMonth = () => [
  gb.textCenter('month', 100, '사용월'),  // L57 SQL 계산 컬럼(selectByTotalSizeMonth: a.month)
  gb.double('totalSize', 150, '사용용량(MB)'),  // L58 SQL 계산 컬럼(selectByTotalSizeYear: a.total_size)
];
```

#### 사용된 버튼들
버튼 사용하지 않음

