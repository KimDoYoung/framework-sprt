# Apr40_Lookup_DownloadHistory

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr40_Lookup_DownloadHistory.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr40_DownloadHistory.selectByTextPaging` | Apr40_Lookup_DownloadHistory:81 | [`Apr40_DownloadHistory.java:37`](../../apr/services/Apr40_DownloadHistory.md) | [`apr40_download_history.selectByTextPaging`](../../apr/sql/apr40_download_history.md), [`apr40_download_history.selectByTextPagingTotal`](../../apr/sql/apr40_download_history.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr40_download_history`](../../../db/tables/apr.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr40_Lookup_DownloadHistory (`client/vi/apr/Apr40_Lookup_DownloadHistory.java`, 180줄)

- 툴바 `buttonBar`: 기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="문서명/사원명", `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDateString 200 "다운일시" TextCenter
  - actionCell 30 "" Cell 편집:actionCell
  - title 550 "문서명" Text
  - personName 100 "사원명" TextCenter

#### 이벤트
[E1] searchText.KeyPress [Enter] (L105) → retrieve()
[E2] retrieveButton[조회].Select (L113) → retrieve()
[E3] closeButton[닫기].Select (L119) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-91 | 공개 메서드 | 서비스 apr.Apr40_DownloadHistory.selectByTextPaging | 업무 |
| private retrieve() | L152-171 | E1,E2,open | 상태 처리 | 업무 |
| private settings() | L93-125 | open | 이벤트 연결, 초기값: closeDate=toDay, startDate=endDate | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L127-150 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L173-175 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L177-179 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('regDateString', 200, '다운일시'),  // L144 SQL 계산 컬럼(selectByTextPaging: TO_CHAR(apr40_reg_date, 'YYYY-MM-DD HH2…)
  // ⚠ 대응 없음 (GridBuilder L145) addCell
  gb.text('title', 550, '문서명'),  // L146
  gb.textCenter('personNm', 100, '사원명'),  // L147 SQL 계산 컬럼(selectByTextPaging: f_emp_kor_nm(apr40_person_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

