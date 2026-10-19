# Apr05_Lookup_LoadDoc

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `act`, `biz`, `bmt`
- 파일: `client/vi/apr/Apr05_Lookup_LoadDoc.java`
- 함께 쓰는 클래스 1개:
  - `Apr05_Grid_RelateAprList` `client/vi/apr/Apr05_Grid_RelateAprList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr03_RelateFund.selectByClassTreeId` | Apr05_Grid_RelateAprList:100 | [`Apr03_RelateFund.java:32`](../../apr/services/Apr03_RelateFund.md) | [`apr03_relate_fund.selectByClassTreeId`](../../apr/sql/apr03_relate_fund.md) |
| `apr.Apr03_RelateFund.selectBySearch` | Apr05_Grid_RelateAprList:126 | [`Apr03_RelateFund.java:90`](../../apr/services/Apr03_RelateFund.md) | [`apr03_relate_fund.selectBySearch`](../../apr/sql/apr03_relate_fund.md) |
| `dcr.Dcr01_ClassTree.selectByCompanyIdRole` | Apr05_Lookup_LoadDoc:265 | [`Dcr01_ClassTree.java:156`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentIdRole_1Bang`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr05_Lookup_LoadDoc (`client/vi/apr/Apr05_Lookup_LoadDoc.java`, 336줄)

- 레이아웃: west=vlc, north=vlc2, center=cp2, center=blc2
- 툴바 `buttonBar`: 문서분류: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L73-75) → init()
[E1] docSearch.KeyPress [Enter] (L92) → search()
[E2] searchButton[찾기].Select (L100) → search()
[E3] tree.Selection (L127) → 인라인 L127-137 (new SelectionHandler<Dcr01_ClassTreeM…)
[E4] gridPage.grid.Selection (L138) → setHtml()
[E5] insertButton[확인].Select (L176) → insert()
[E6] closeButton[닫기].Select (L182) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L82-194 | 생성자 | 상태 처리 | 업무 |
| package getMenuTree() | L196-230 | 필드 초기화 | 상태 처리 | 업무 |
| public getServiceResult() | L233-251 | 공개 메서드 | 상태 처리 | 업무 |
| private addChild() | L253-261 | getServiceResult | 상태 처리 | 업무 |
| private retrieve() | L263-277 | init | 서비스 dcr.Dcr01_ClassTree.selectByCompanyIdRole(companyId, empId, orgId, typeCode) | 업무 |
| private retrievePage() | L279-281 | 미사용 후보 | 상태 처리 | 업무 |
| private insert() | L296-303 | E5 | 미선택 시 alert "문서를 선택해주세요" | 업무 |
| private search() | L305-326 | E1,E2 | 상태 처리 | 업무 |
| private setHtml() | L283-286 | E4 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L288-290 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L292-294 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L328-330 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={insert}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Apr05_Grid_RelateAprList (`client/vi/apr/Apr05_Grid_RelateAprList.java`, 142줄)

- 툴바 `buttonBar`: 문서: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField 빈칸="상신제목"
- 그리드 `grid` (buildGrid()):
  - statusName 80 "상태" TextHtml
  - title 260 "상신제목" Text
  - fundName 260 "펀드명" Text
  - regDate 100 "등록일" Date
  - regEmpName 100 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L35-37) → init()
[E1] docSearch.KeyPress [Enter] (L48) → search()
[E2] searchButton[찾기].Select (L56) → search()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L43-71 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L87-91 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L93-107 | 공개 메서드 | 서비스 apr.Apr03_RelateFund.selectByClassTreeId(classTreeId, orgId, empId, companyId) | 업무 |
| private search() | L109-136 | E1,E2 | 서비스 apr.Apr03_RelateFund.selectBySearch(searchText, classTreeId, orgId, empId) | 업무 |
| public buildGrid() | L73-85 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L138-140 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L78) addTextHtml
  gb.text('title', 260, '상신제목'),  // L79
  gb.text('fundNm', 260, '펀드명'),  // L80
  gb.date('regDate', 100, '등록일'),  // L81
  gb.textCenter('regEmpNm', 100, '등록자'),  // L82 SQL 계산 컬럼(selectByClassTreeId: ( SELECT emp01_kor_nm FROM emp01_person…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>

