# Apr11_Tab_AdvertBook

- 종류: 화면
- 파일: `client/vi/apr/Apr11_Tab_AdvertBook.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr11_AdvertBook.selectByApprDate` | Apr11_Tab_AdvertBook:116 | [`Apr11_AdvertBook.java:21`](../../apr/services/Apr11_AdvertBook.md) | [`apr11_advert_book.selectByApprDate`](../../apr/sql/apr11_advert_book.md) |
| `apr.Apr11_AdvertBook.update` | Apr11_Tab_AdvertBook:122 | [`Apr11_AdvertBook.java:34`](../../apr/services/Apr11_AdvertBook.md) | `UpdateDataModel(apr11_advert_book)` 동적 INSERT/UPDATE → [`apr11_advert_book.selectById`](../../apr/sql/apr11_advert_book.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr11_advert_book`](../../../db/tables/apr.md), [`emp00_trans_info`](../../../db/views.md)

## DB 함수

`f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr11_Tab_AdvertBook (`client/vi/apr/Apr11_Tab_AdvertBook.java`, 133줄)

- 레이아웃: north=buttonBar, center=grid
- 툴바 `buttonBar`: {startDateLabel} {endDateLabel} {retrieveButton} {updateButton}
- 입력·하위 화면: `startDate` MyDateField, `endDate` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스):
  - advertSeq 100 "심사번호" Text
  - apprDate 100 "심사일자" Date
  - advertTypeName 100 "광고종류" Text 편집:TextField
  - mediaName 100 "매체종류" Text 편집:TextField
  - title 400 "광고내용" Text
  - empName 80 "담당자" Text
  - count 60 "수량" Long 편집:LongField
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L39-80) → retrieve()
[E1] retrieveButton[조회].Select (L60) → retrieve()
[E2] updateButton[저장].Select (L68) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L99-118 | 생성자,E1 | 서비스 apr.Apr11_AdvertBook.selectByApprDate(companyId, startDate, endDate) | 업무 |
| private update() | L120-128 | E2 | 서비스 apr.Apr11_AdvertBook.update | 업무 |
| public buildGrid() | L82-97 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L130-132 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('advertSeq', 100, '심사번호'),  // L88
  gb.date('apprDate', 100, '심사일자'),  // L89
  gb.text('advertTypeNm', 100, '광고종류', { editor: 'text' }),  // L90
  gb.text('mediaNm', 100, '매체종류', { editor: 'text' }),  // L91
  gb.text('title', 400, '광고내용'),  // L92
  // ⚠DB없음 L93 empName 80 "담당자" (apr11_emp_name 컬럼 없음)
  gb.long('cnt', 60, '수량', { editor: 'number' }),  // L94
  gb.text('note', 300, '비고', { editor: 'text' }),  // L95
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

