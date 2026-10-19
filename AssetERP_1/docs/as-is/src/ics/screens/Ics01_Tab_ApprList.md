# Ics01_Tab_ApprList

- 종류: 화면
- 메뉴: 문서작성 > 01. 문서작성 > 법규별 문서작성 (#1014)
- 파일: `client/vi/ics/Ics01_Tab_ApprList.java`
- 함께 쓰는 클래스 1개:
  - `Ics01_Grid_ApprList` `client/vi/ics/Ics01_Grid_ApprList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr03_RelateFund.selectByIcsClassTreeId` | Ics01_Grid_ApprList:203 | [`Apr03_RelateFund.java:74`](../../apr/services/Apr03_RelateFund.md) | [`apr03_relate_fund.selectByIcsClassTreeId`](../../apr/sql/apr03_relate_fund.md) |
| `ics.Ics01_ClassTree.selectByCompanyId` | Ics01_Tab_ApprList:177 | [`Ics01_ClassTree.java:28`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByCompanyId`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr14_relate_ast`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md)

## DB 함수

`f_class_tree_nm_allpath`, `f_get_deadline_nm`, `f_max_workdate`, `f_org_nm`, `f_sysdate`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_ApprList (`client/vi/ics/Ics01_Tab_ApprList.java`, 211줄)

- 레이아웃: west=vlc, center=cp02
- 툴바 `buttonBar`: 법규분류: {icsSearch} {retrieveButton}
- 입력·하위 화면: `icsSearch` TextField
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 345 "분류명" Text
  - classTreeCode 100 "분류코드" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-124) → retrieve()
[E1] icsSearch.KeyPress [Enter] (L49) → search()
[E2] retrieveButton[찾기].Select (L57) → search()
[E3] treeGrid.SelectionChanged [선택>0] (L93) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L126-134 | 필드 초기화 | 상태 처리 | 업무 |
| private addChildItem() | L136-147 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L150-169 | 공개 메서드 | 상태 처리 | 업무 |
| private retrievePage() | L171-174 | E3 | 상태 처리 | 업무 |
| public retrieve() | L176-184 | 생성자 | 서비스 ics.Ics01_ClassTree.selectByCompanyId | 업무 |
| private search() | L186-206 | E1,E2 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L208-210 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 345, '분류명'),  // L130
  gb.text('classTreeCd', 100, '분류코드'),  // L131
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>

### Ics01_Grid_ApprList (`client/vi/ics/Ics01_Grid_ApprList.java`, 254줄)

- 입력·하위 화면: `startDate` MyDateField, `endDate` MyDateField, `searchTextField` TextField, `apprEditor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "등록일" Date
  - effectDate 100 "시행일" Date
  - regEmpName 100 "등록자" Text
  - title 700 "상신제목" Text
  - actionCell 70 "상세보기" Cell 편집:detailCell

#### 이벤트
[E0] 화면 열림 (생성자 L62-95) → settings()
[E1] helpAnchor.MouseDown (L67) → 메시지 "업데이트 예정 / 해당법규분류의 팁은 추후 업데이…"
[E2] searchTextField.KeyPress [Enter] (L108) → retrieve()
[E3] retrieveButton[검색].Select (L116) → retrieve()
[E4] insertButton[신규문서 작성].Select (L122) → insertIcsApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insertIcsApproval() | L156-178 | E4 | 조회창 Dcr01_Lookup_Class 열기, 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private retrieve() | L180-209 | E2,E3,insertIcsApproval | 서비스 apr.Apr03_RelateFund.selectByIcsClassTreeId(classTreeId, companyId, startDate, endDate, searchText, orgId, empId, admin, admin) | 업무 |
| public retrieve() | L211-249 | E2,E3,insertIcsApproval | 서비스 apr.Apr03_RelateFund.selectByIcsClassTreeId(classTreeId, companyId, startDate, endDate, searchText, orgId, empId, admin, admin) | 업무 |
| private settings() | L97-128 | 생성자 | 이벤트 연결, 초기값: startDate=fromDate, endDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L130-154 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L251-253 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L147
  gb.date('effectDate', 100, '시행일'),  // L148
  gb.text('regEmpNm', 100, '등록자'),  // L149 SQL 계산 컬럼(selectByIcsClassTreeId: ( SELECT emp01_kor_nm FROM emp01_person…)
  gb.text('title', 700, '상신제목'),  // L150
  // ⚠ 대응 없음 (GridBuilder L151) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="register" onClick={insertIcsApproval}>신규문서 작성</Button>

