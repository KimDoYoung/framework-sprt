# Act15_Tab_CloseCheck

- 종류: 화면
- 메뉴: 기초자료 > 40. 관리회계 > 마감검증 체크항목 (#1368)
- 파일: `client/vi/act/Act15_Tab_CloseCheck.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act15_CloseCheck.selectByText` | Act15_Tab_CloseCheck:119 | [`Act15_CloseCheck.java:24`](../../act/services/Act15_CloseCheck.md) | [`act15_close_check.selectByText`](../../act/sql/act15_close_check.md) |
| `act.Act15_CloseCheck.update` | Act15_Tab_CloseCheck:137 | [`Act15_CloseCheck.java:30`](../../act/services/Act15_CloseCheck.md) | [`act15_close_check.selectById`](../../act/sql/act15_close_check.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(act15_close_check)` 동적 INSERT/UPDATE → [`act15_close_check.selectById`](../../act/sql/act15_close_check.md) |

## 테이블

[`act15_close_check`](../../../db/tables/act.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Act15_Tab_CloseCheck (`client/vi/act/Act15_Tab_CloseCheck.java`, 152줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {updateButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid()):
  - companyName 220 "고객사" Text
  - depositRealMatchYn 100 "실제예금<br>잔고대사" Boolean
  - depositApprYn 100 "예금대사<br>결과보고" Boolean
  - depositLedgerMatchYn 100 "예금대사<br>잔고vs계정" Boolean
  - financeEvalYn 100 "금융상품<br>평가" Boolean
  - financeLedgerMatchYn 100 "금융상품<br>잔고vs계정" Boolean
  - fxEvalYn 100 "환평가" Boolean
  - depnYn 100 "감가상각" Boolean
  - tangibleMatchYn 100 "유형자산<br>잔고vs계정" Boolean
  - intangibleMatchYn 100 "무형자산<br>잔고vs계정" Boolean
  - supplyMatchYn 100 "소모품(비품)<br>잔고vs계정" Boolean
  - fundFeeMatchYn 100 "펀드보수<br>ICAMvsERP" Boolean
  - fundFeeEvalYn 100 "펀드미수보수" Boolean
  - unfixYn 100 "미승인전표" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L37-62) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L66) → retrieve()
[E2] retrieveButton[조회].Select (L75) → retrieve()
[E3] updateButton[저장].Select (L81) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L112-128 | 생성자,E1,E2,update | 서비스 act.Act15_CloseCheck.selectByText(searchText) | 업무 |
| public update() | L135-143 | E3 | 서비스 act.Act15_CloseCheck.update | 업무 |
| public insertRow() | L146-147 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L150-151 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L64-87 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L89-110 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L130-132 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 220, '고객사'),  // L94 SQL 계산 컬럼(selectByText: sys01_company_nm)
  gb.boolean('depositRealMatchYn', 100, '실제예금<br>잔고대사'),  // L95
  gb.boolean('depositApprYn', 100, '예금대사<br>결과보고'),  // L96
  gb.boolean('depositLedgerMatchYn', 100, '예금대사<br>잔고vs계정'),  // L97
  gb.boolean('financeEvalYn', 100, '금융상품<br>평가'),  // L98
  gb.boolean('financeLedgerMatchYn', 100, '금융상품<br>잔고vs계정'),  // L99
  gb.boolean('fxEvalYn', 100, '환평가'),  // L100
  gb.boolean('depnYn', 100, '감가상각'),  // L101
  gb.boolean('tangibleMatchYn', 100, '유형자산<br>잔고vs계정'),  // L102
  gb.boolean('intangibleMatchYn', 100, '무형자산<br>잔고vs계정'),  // L103
  gb.boolean('supplyMatchYn', 100, '소모품(비품)<br>잔고vs계정'),  // L104
  gb.boolean('fundFeeMatchYn', 100, '펀드보수<br>ICAMvsERP'),  // L105
  gb.boolean('fundFeeEvalYn', 100, '펀드미수보수'),  // L106
  gb.boolean('unfixYn', 100, '미승인전표'),  // L107
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

