# Bbs15_Lookup_CompanyRule

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `tdm`
- 파일: `client/vi/bbs/Bbs15_Lookup_CompanyRule.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `bbs.Bbs15_CompanyRule.selectBySearchText` | Bbs15_Lookup_CompanyRule:144 | [`Bbs15_CompanyRule.java:33`](../../bbs/services/Bbs15_CompanyRule.md) | [`bbs15_company_rule.selectBySearchText`](../../bbs/sql/bbs15_company_rule.md) |

## 테이블

[`bbs15_company_rule`](../../../db/tables/bbs.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Bbs15_Lookup_CompanyRule (`client/vi/bbs/Bbs15_Lookup_CompanyRule.java`, 158줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyRuleCode 100 "내규코드" TextCenter
  - title 500 "내규" Text

#### 이벤트
[E0] 화면 열림 (생성자 L44-49) → 초기화
[E1] searchText.KeyPress [Enter] (L82) → retrieve()
[E2] retrieveButton[조회].Select (L91) → retrieve()
[E3] selectButton[확인].Select (L97) → selectClose()
[E4] closeButton[닫기].Select (L103) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public tdmOpen() | L51-54 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L56-78 | tdmOpen | 상태 처리 | 업무 |
| private selectClose() | L121-132 | E3 | 미선택 시 alert "선택한 내역이 없습니다" | 업무 |
| private retrieve() | L134-150 | E1,E2,open | 서비스 bbs.Bbs15_CompanyRule.selectBySearchText(companyId, ruleType, stdDate, searchText, taskId) | 업무 |
| private settings() | L80-109 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L111-119 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L152-154 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L155-157 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('companyRuleCd', 100, '내규코드'),  // L115
  gb.text('title', 500, '내규'),  // L116
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={selectClose}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

