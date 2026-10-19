# Dcr01_Tab_DcrClassModify

- 종류: 화면
- 메뉴: 관리자 > 03. 문서관리 > 문서이동 (#1004)
- 파일: `client/vi/dcr/Dcr01_Tab_DcrClassModify.java`
- 함께 쓰는 클래스 2개:
  - `Dcr01_Grid_DcrClassList` `client/vi/dcr/Dcr01_Grid_DcrClassList.java`
  - `Dcr01_Move_DcrClass` `client/vi/dcr/Dcr01_Move_DcrClass.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByClassTreeId2` | Dcr01_Grid_DcrClassList:235 | [`Apr01_Appr.java:202`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByClassTreeId2`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.updateParentId` | Dcr01_Move_DcrClass:147 | [`Apr01_Appr.java:1213`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.updateParentId`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr01_Move_DcrClass:208, Dcr01_Tab_DcrClassModify:165 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr12_relate_adv`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md), [`sys52_specific_menu_link`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_get_fund_nm2`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Tab_DcrClassModify (`client/vi/dcr/Dcr01_Tab_DcrClassModify.java`, 218줄)

- 레이아웃: west=vlc, center=dcrClassList
- 툴바 `buttonBar`: 문서분류: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L49-112) → retrieve()
[E1] retrieveButton[조회].Select (L54) → retrieve()
[E2] docSearch.KeyPress [Enter] (L62) → search()
[E3] searchButton[찾기].Select (L72) → search()
[E4] tree.Selection (L96) → 인라인 L96-104 (new SelectionHandler<Dcr01_ClassTreeM…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package getMenuTree() | L114-150 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L153-161 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L163-173 | 생성자,E1 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L175-195 | E2,E3 | 상태 처리 | 업무 |
| public getServiceResult() | L198-213 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L215-217 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>

### Dcr01_Grid_DcrClassList (`client/vi/dcr/Dcr01_Grid_DcrClassList.java`, 247줄)

- 입력·하위 화면: `startDate` MyDateField, `endDate` MyDateField, `searchTextField` TextField, `apprEditor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bookmarkYn 30 " " BookMarkYn
  - title 280 "상신제목" Text
  - relateDisplayName 80 "펀드/일임" TextCenter
  - statusName 65 "상태" TextHtml
  - actionCell 50 "보기" Cell 편집:detailCell
  - regDate 100 "등록일" Date
  - effectDate 100 "시행일" Date
  - regEmpName 100 "등록자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L62-64) → init()
[E1] searchTextField.KeyPress [Enter] (L99) → retrieve()
[E2] retrieveButton[검색].Select (L107) → retrieve()
[E3] moveButton[변경].Select (L113) → moveChk()
       └ [E4] msgBox.DialogHide [YES] (L157) → moveDcrClass()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L70-86 | 생성자 | 상태 처리 | 업무 |
| private moveChk() | L154-172 | E3 | ConfirmBox → E4 | 업무 |
| public moveDcrClass() | L174-187 | E4 | 미선택 시 alert "문서를 선택해주세요" | 업무 |
| public retrieve() | L189-210 | E1,E2,buildGrid,moveDcrClass | 상태 처리 | 업무 |
| private retrieve() | L212-241 | E1,E2,buildGrid,moveDcrClass | 서비스 apr.Apr01_Appr.selectByClassTreeId2(classTreeId, startDate, endDate, searchText, orgId, empId, companyId, admin, admin) | 업무 |
| private settings() | L88-119 | init | 이벤트 연결, 초기값: startDate=fromDate, endDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L121-152 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L243-245 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L142) addBookMarkYn
  gb.text('title', 280, '상신제목'),  // L143
  gb.textCenter('relateDisplayName', 80, '펀드/일임'),  // L144
  // ⚠ 대응 없음 (GridBuilder L145) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L146) addCell
  gb.date('regDate', 100, '등록일'),  // L147
  gb.date('effectDate', 100, '시행일'),  // L148
  gb.textCenter('regEmpNm', 100, '등록자'),  // L149
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="change" onClick={moveChk}>변경</Button>
3. <Button type="register" onClick={undefined}>신규문서 작성</Button>

### Dcr01_Move_DcrClass (`client/vi/dcr/Dcr01_Move_DcrClass.java`, 281줄)

- 툴바 `buttonBar`: 문서분류: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L57-134) → show(), retrieve()
[E1] docSearch.KeyPress [Enter] (L72) → search()
[E2] searchButton[찾기].Select (L82) → search()
[E3] tree.Selection (L102) → 인라인 L102-111 (new SelectionHandler<Dcr01_ClassTreeM…)
[E4] okButton[변경].Select (L115) → update()
[E5] cancleButton[닫기].Select (L123) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private update() | L136-153 | E4 | 서비스 apr.Apr01_Appr.updateParentId | 업무 |
| package getMenuTree() | L156-193 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L196-204 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L206-216 | 생성자 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L218-238 | E1,E2 | 상태 처리 | 업무 |
| public getServiceResult() | L241-271 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L273-275 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L277-279 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="change" onClick={update}>변경</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

