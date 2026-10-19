# Sys95_Tab_Manual

- 종류: 화면
- 메뉴: 커뮤니티 > 91. AssetERP > AssetERP 매뉴얼 (#1297)
- 파일: `client/vi/sys/Sys95_Tab_Manual.java`
- 함께 쓰는 클래스 1개:
  - `Sys95_PDFViewer` `client/vi/sys/Sys95_PDFViewer.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys95_Manual.selectByText` | Sys95_Tab_Manual:151 | [`Sys95_Manual.java:34`](../../sys/services/Sys95_Manual.md) | [`sys95_manual.selectByText`](../../sys/sql/sys95_manual.md) |

## 테이블

[`sys10_file`](../../../db/tables/sys.md), [`sys95_manual`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys95_Tab_Manual (`client/vi/sys/Sys95_Tab_Manual.java`, 181줄)

- 레이아웃: center=vlc, east=viewer, center=blc
- 툴바 `buttonBar`: 분류: {typeComboBox} {searchTextField} {retrieveButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="검색어 입력", `typeComboBox` ComboBoxField("ManualType", "%", "전체", "전체")
- 그리드 `grid` (buildGrid()):
  - regDate 90 "등록일" Date
  - manualTypeName 100 "분류" Text
  - fileName 300 "파일명" Text
  - note 500 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L53-93) → settings(), retrieve()
[E1] typeComboBox[ManualType].Collapse (L97) → retrieve()
[E2] searchTextField.KeyPress [Enter] (L106) → retrieve()
[E3] grid.CellClick (L114) → 인라인 L114-126 (new CellClickHandler() { @Override pu…)
[E4] retrieveButton[조회].Select (L127) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L39-42 | retrieve | 상태 처리 | 업무 |
| public retrieve() | L145-172 | 생성자,E1,E2,E4,execute | 서비스 sys.Sys95_Manual.selectByText(manualType, searchText, publicCheck) | 업무 |
| private settings() | L95-133 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L135-143 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L174-176 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L138
  gb.text('manualTypeNm', 100, '분류'),  // L139 SQL 계산 컬럼(selectByText: f_cdnm('ManualType', sys95_manual_type,…)
  gb.text('fileNm', 300, '파일명'),  // L140 SQL 계산 컬럼(selectByText: sys10_file_nm)
  gb.text('note', 500, '비고'),  // L141
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys95_PDFViewer (`client/vi/sys/Sys95_PDFViewer.java`, 69줄)


#### 이벤트
[E0] 화면 열림 (생성자 L24-28) → show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L30-32 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L34-68 | view | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

