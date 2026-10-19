# Sms02_Tab_TotalCount

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 고객별 문자사용량 (#1305)
- 파일: `client/vi/sms/Sms02_Tab_TotalCount.java`
- 함께 쓰는 클래스 2개:
  - `Sms02_TabPage_Detail` `client/vi/sms/Sms02_TabPage_Detail.java`
  - `Sms02_Lookup_History` `client/vi/sms/Sms02_Lookup_History.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sms.Sms02_History.selectByDate` | Sms02_Lookup_History:129 | [`Sms02_History.java:31`](../../sms/services/Sms02_History.md) | [`sms02_history.selectByDate`](../../sms/sql/sms02_history.md) |
| `sms.Sms02_History.selectByTotalCount` | Sms02_Tab_TotalCount:110 | [`Sms02_History.java:43`](../../sms/services/Sms02_History.md) | [`sms02_history.selectByTotalCount`](../../sms/sql/sms02_history.md) |
| `sms.Sms02_History.selectByTotalCountMonth` | Sms02_TabPage_Detail:97 | [`Sms02_History.java:59`](../../sms/services/Sms02_History.md) | [`sms02_history.selectByTotalCountMonth`](../../sms/sql/sms02_history.md) |
| `sms.Sms02_History.selectByTotalCountYear` | Sms02_TabPage_Detail:74 | [`Sms02_History.java:51`](../../sms/services/Sms02_History.md) | [`sms02_history.selectByTotalCountYear`](../../sms/sql/sms02_history.md) |

## 테이블

[`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sms02_Tab_TotalCount (`client/vi/sms/Sms02_Tab_TotalCount.java`, 136줄)

- 레이아웃: center=vlc, east=tabPage
- 툴바 `buttonBar`: {retrieveButton} {useYnBox}
- 입력·하위 화면: `useYnBox` CheckBox, `tabPage` Sms02_TabPage_Detail, `lookup` Sms02_Lookup_History
- 그리드 `grid` (buildGrid(), 체크박스):
  - companyName 250 "회사" Text
  - locName 80 "서브도메인" Text
  - runningTotalCount 200 "누적사용건수" Long
  - actionCell 80 "발신기록" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L39-66) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L72) → retrieve()
[E2] grid.RowClick (L78) → retrieveTabPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L106-122 | 생성자,E1 | 서비스 sms.Sms02_History.selectByTotalCount(useYn) | 업무 |
| private retrieveTabPage() | L124-131 | E2,retrieve | 상태 처리 | 업무 |
| private settings() | L68-84 | 생성자 | 이벤트 연결, 초기값: useYnBox=true("사용고객만 보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L86-104 | 필드 초기화 | 조회창 Sms02_Lookup_History 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L133-135 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 250, '회사'),  // L98 SQL 계산 컬럼(selectByTotalCount: sys01_company_nm)
  gb.text('locNm', 80, '서브도메인'),  // L99 SQL 계산 컬럼(selectByTotalCount: sys01_loc_nm)
  gb.long('runningTotalCount', 200, '누적사용건수'),  // L100 SQL 계산 컬럼(selectByTotalCount: ( SELECT count(sms02_history_id) FROM s…)
  // ⚠ 대응 없음 (GridBuilder L101) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sms02_TabPage_Detail (`client/vi/sms/Sms02_TabPage_Detail.java`, 105줄)

- 레이아웃: center=vlc
- 그리드 `gridYear` (buildGridYear()):
  - year 100 "사용연도" TextCenter
  - totalCount 100 "사용건수" Long
  - totalPayCount 100 "사용금액" Long
- 그리드 `gridMonth` (buildGridMonth()):
  - month 100 "사용월" TextCenter
  - totalCount 100 "사용건수" Long
  - totalPayCount 100 "사용금액" Long

#### 이벤트
[E0] 화면 열림 (생성자 L27-45) → 초기화
[E1] gridYear.RowClick (L39) → retrieveMonth()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildGridYear() | L47-54 | 필드 초기화 | 상태 처리 | 업무 |
| public buildGridMonth() | L56-63 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L65-87 | 공개 메서드 | 서비스 sms.Sms02_History.selectByTotalCountYear(locName) | 업무 |
| public retrieveMonth() | L89-104 | E1,retrieve | 서비스 sms.Sms02_History.selectByTotalCountMonth(locName, year) | 업무 |

#### Grid Spec
```javascript
const buildGridYear = () => [
  gb.textCenter('year', 100, '사용연도'),  // L49 SQL 계산 컬럼(selectByTotalCountYear: a.year)
  gb.long('totalCount', 100, '사용건수'),  // L50 SQL 계산 컬럼(selectByTotalCountYear: a.total_count)
  gb.long('totalPayCount', 100, '사용금액'),  // L51 SQL 계산 컬럼(selectByTotalCountYear: a.total_pay_count)
];

const buildGridMonth = () => [
  gb.textCenter('month', 100, '사용월'),  // L58 SQL 계산 컬럼(selectByTotalCountMonth: a.month)
  gb.long('totalCount', 100, '사용건수'),  // L59 SQL 계산 컬럼(selectByTotalCountYear: a.total_count)
  gb.long('totalPayCount', 100, '사용금액'),  // L60 SQL 계산 컬럼(selectByTotalCountYear: a.total_pay_count)
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Sms02_Lookup_History (`client/vi/sms/Sms02_Lookup_History.java`, 144줄)

- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="내용"
- 그리드 `grid` (buildGrid()):
  - sendDateStr 170 "전송일" TextCenter
  - content 470 "내용" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L51-80) → settings(), show()
[E1] searchText.KeyPress [Enter] (L90) → retrieve()
[E2] retrieveButton[조회].Select (L98) → retrieve()
[E3] closeButton[닫기].Select (L104) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-49 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L120-135 | E1,E2,open | 서비스 sms.Sms02_History.selectByDate(companyId, startDate, closeDate, searchText, limit) | 업무 |
| private settings() | L82-110 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L112-118 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L137-139 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L141-143 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('sendDateStr', 170, '전송일'),  // L115 SQL 계산 컬럼(selectByDate: TO_CHAR(sms02_send_date, 'yyyy-mm-dd hh…)
  gb.textArea('content', 470, '내용'),  // L116
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

