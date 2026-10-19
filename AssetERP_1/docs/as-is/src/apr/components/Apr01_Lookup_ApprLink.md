# Apr01_Lookup_ApprLink

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `flt`, `tdm`
- 파일: `client/vi/apr/Apr01_Lookup_ApprLink.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByApprIdList` | Apr01_Lookup_ApprLink:183 | [`Apr01_Appr.java:90`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByApprIdList`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectByLinkCode` | Apr01_Lookup_ApprLink:196 | [`Apr01_Appr.java:77`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByLinkCode`](../../apr/sql/apr01_appr.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`dcr30_link`](../../../db/tables/dcr.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Lookup_ApprLink (`client/vi/apr/Apr01_Lookup_ApprLink.java`, 210줄)

- 툴바 `buttonBar`: {retrieveButton} {retrieveButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "상신일자" Date
  - title 400 "상신제목" Text
  - statusName 100 "상태" TextCenter
  - actionCell 80 "문서보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L52-60) → 초기화
[E1] retrieveButton[조회].Select (L105) → retrieve()
[E2] cancelButton[닫기].Select (L111) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-81 | 공개 메서드 | 상태 처리 | 업무 |
| public checkJobOpen() | L83-102 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L174-203 | E1,open,checkJobOpen,buildGrid | 서비스 apr.Apr01_Appr.selectByApprIdList, apr.Apr01_Appr.selectByLinkCode(companyId, CheckJobList, companyId, stdDate, linkCode) | 업무 |
| private settings() | L104-125 | open,checkJobOpen | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L127-172 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "문서가 존재하지않습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L206-208 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '상신일자'),  // L166
  gb.text('title', 400, '상신제목'),  // L167
  gb.textCenter('statusNm', 100, '상태'),  // L168
  // ⚠ 대응 없음 (GridBuilder L169) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

