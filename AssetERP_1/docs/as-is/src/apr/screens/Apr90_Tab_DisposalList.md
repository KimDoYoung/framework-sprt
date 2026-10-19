# Apr90_Tab_DisposalList

- 종류: 화면
- 메뉴: 문서작성 > 01. 문서작성 > 폐기문서 신청현황 (#1443)
- 파일: `client/vi/apr/Apr90_Tab_DisposalList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Apr90_Tab_DisposalList:96 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr90_DisposalList.selectByPersonId` | Apr90_Tab_DisposalList:155 | [`Apr90_DisposalList.java:43`](../../apr/services/Apr90_DisposalList.md) | [`apr90_disposal_list.selectByPersonId`](../../apr/sql/apr90_disposal_list.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr90_disposal_list`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr90_Tab_DisposalList (`client/vi/apr/Apr90_Tab_DisposalList.java`, 166줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기간: {startDate} ~: {closeDate} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "신청일" Date
  - title 400 "문서명" Text
  - actionCell 45 " " CellFix 편집:actionCell
  - statusName 100 "문서상태" TextCenter
  - reason 400 "사유" TextArea
  - confirmYn 100 "승인여부" BooleanYn
  - confirmEmpName 100 "승인(반려)자" TextCenter
  - confirmDate 100 "승인(반려)일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L48-71) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L79) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L138-161 | 생성자,E1 | 서비스 apr.Apr90_DisposalList.selectByPersonId(personId, startDate, closeDate) | 업무 |
| private settings() | L73-85 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L87-136 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L163-165 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '신청일'),  // L125
  gb.text('title', 400, '문서명'),  // L127 SQL 계산 컬럼(selectById: appr.title)
  // ⚠ 대응 없음 (GridBuilder L128) addCellFix
  gb.textCenter('statusNm', 100, '문서상태'),  // L129 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', appr.status_cd,…)
  gb.textArea('reason', 400, '사유'),  // L130
  gb.booleanYn('confirmYn', 100, '승인여부'),  // L131
  gb.textCenter('confirmEmpNm', 100, '승인(반려)자'),  // L132 SQL 계산 컬럼(selectById: f_emp_kor_nm(apr90_confirm_emp_id))
  gb.date('confirmDate', 100, '승인(반려)일'),  // L133
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

