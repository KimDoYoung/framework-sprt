# Apr01_Tab_TotalList

- 종류: 화면
- 메뉴: 문서작성 > 06. 문서작성현황 > 운영현황표 (#1010)
- 파일: `client/vi/apr/Apr01_Tab_TotalList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Tab_SubList`](../../apr/screens/Apr01_Tab_SubList.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByTotalList` | Apr01_Tab_TotalList:169 | [`Apr01_Appr.java:1115`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByTotalList`](../../apr/sql/apr01_appr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md)

## DB 함수

`f_emp_kor_nm`, `f_get_emptrans`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_TotalList (`client/vi/apr/Apr01_Tab_TotalList.java`, 183줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {closeDate} 담당부서: {orgName} 담당자: {personName} {searchButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `orgName` TextField, `personName` TextField
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - aprOrgName 150 "담당부서" Text
  - aprPersonName 100 "담당자" Text
  - genCnt 100 "일반문서" Long
  - icsCnt 100 "내부통제문서" Long
  - totalCnt 100 "계" Long
  - procGenCnt 100 "일반문서" Long 편집:"0069B4"
  - procIcsCnt 100 "내부통제문서" Long 편집:"0069B4"
  - procTotalCnt 100 "계" Long 편집:"0069B4"
  - unProcGenCnt 100 "일반문서" Long 편집:"DF5E5E"
  - unProcIcsCnt 100 "내부통제문서" Long 편집:"DF5E5E"
  - unProcTotalCnt 100 "계" Long 편집:"DF5E5E"
  - actionCell 100 "건별명세" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L48-87) → setInitData(), retrieve()
[E1] searchButton[조회].Select (L50) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setInitData() | L133-143 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L145-175 | 생성자,E1 | 서비스 apr.Apr01_Appr.selectByTotalList(companyId, personName, orgName, startDate, closeDate) | 업무 |
| public buildGrid() | L89-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L177-179 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGridStyle() | L180-182 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.group('newHeaderGroupMap03newHeaderGroupConfig13', 100, '발생건수'),  // L112
  gb.group('newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle13', 100, '처리건수'),  // L113
  gb.group('newHeaderGroupMap09newHeaderGroupConfigsetHtmlGridStyle13', 100, '미처리건수'),  // L114
  gb.text('aprOrgName', 150, '담당부서'),  // L116
  gb.text('aprPersonName', 100, '담당자'),  // L117
  gb.long('genCnt', 100, '일반문서'),  // L118
  gb.long('icsCnt', 100, '내부통제문서'),  // L119
  gb.long('totalCnt', 100, '계'),  // L120
  gb.long('procGenCnt', 100, '일반문서'),  // L121
  gb.long('procIcsCnt', 100, '내부통제문서'),  // L122
  gb.long('procTotalCnt', 100, '계'),  // L123
  gb.long('unProcGenCnt', 100, '일반문서'),  // L124
  gb.long('unProcIcsCnt', 100, '내부통제문서'),  // L125
  gb.long('unProcTotalCnt', 100, '계'),  // L126
  // ⚠ 대응 없음 (GridBuilder L127) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

