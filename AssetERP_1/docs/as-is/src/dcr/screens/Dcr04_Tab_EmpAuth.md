# Dcr04_Tab_EmpAuth

- 종류: 화면
- 메뉴: 관리자 > 02. 문서권한관리 > 조회권한 예외사원 등록 (#1491)
- 파일: `client/vi/dcr/Dcr04_Tab_EmpAuth.java`
- 함께 쓰는 클래스 3개:
  - `Dcr04_TabPage_EmpAuth` `client/vi/dcr/Dcr04_TabPage_EmpAuth.java`
  - `Dcr04_Lookup_DocList` `client/vi/dcr/Dcr04_Lookup_DocList.java`
  - `Dcr04_TabPage_DocList` `client/vi/dcr/Dcr04_TabPage_DocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr04_Tab_EmpAuth:194 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.selectByOrgCodeId` | Dcr04_Tab_EmpAuth:186 | [`Dcr01_ClassTree.java:61`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByOrgCodeId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr04_EmpAuth.delete` | Dcr04_TabPage_DocList:155, Dcr04_TabPage_EmpAuth:280 | [`Dcr04_EmpAuth.java:81`](../../dcr/services/Dcr04_EmpAuth.md) | `UpdateDataModel(dcr04_emp_auth)` 동적 DELETE |
| `dcr.Dcr04_EmpAuth.getTargetClassTreeList` | Dcr04_TabPage_DocList:123 | [`Dcr04_EmpAuth.java:43`](../../dcr/services/Dcr04_EmpAuth.md) | [`dcr04_emp_auth.getTargetClassTreeList`](../../dcr/sql/dcr04_emp_auth.md) |
| `dcr.Dcr04_EmpAuth.getTargetList` | Dcr04_Lookup_DocList:140 | [`Dcr04_EmpAuth.java:34`](../../dcr/services/Dcr04_EmpAuth.md) | [`dcr04_emp_auth.getTargetList`](../../dcr/sql/dcr04_emp_auth.md) |
| `dcr.Dcr04_EmpAuth.selectByText` | Dcr04_TabPage_EmpAuth:183 | [`Dcr04_EmpAuth.java:25`](../../dcr/services/Dcr04_EmpAuth.md) | [`dcr04_emp_auth.selectByText`](../../dcr/sql/dcr04_emp_auth.md) |
| `dcr.Dcr04_EmpAuth.updateList` | Dcr04_TabPage_EmpAuth:205 | [`Dcr04_EmpAuth.java:52`](../../dcr/services/Dcr04_EmpAuth.md) | [`dcr04_emp_auth.checkPerson`](../../dcr/sql/dcr04_emp_auth.md), [`dcr04_emp_auth.updateNote`](../../dcr/sql/dcr04_emp_auth.md), `UpdateDataModel(dcr04_emp_auth)` 동적 INSERT/UPDATE → [`dcr04_emp_auth.selectById`](../../dcr/sql/dcr04_emp_auth.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_emptrans`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr04_Tab_EmpAuth (`client/vi/dcr/Dcr04_Tab_EmpAuth.java`, 258줄)

- 레이아웃: west=vlc, center=tabPage
- 툴바 `buttonBar01`: 문서분류: {docSearch} {searchButton01}
- 툴바 `buttonBar02`: 부서별 조회권한 필터링: {orgSearch}
- 입력·하위 화면: `tabPage` Dcr04_TabPage_EmpAuth, `docSearch` TextField, `orgSearch` LookupTriggerField 빈칸="전체", `searchPopup` Org00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L56-91) → settings(), retrieve()
[E1] docSearch.KeyPress [Enter] (L95) → search()
[E2] orgSearch.TriggerClick [result != null] (L106) → retrieve()
[E3] searchButton01[찾기].Select (L126) → search()
[E4] tree.Selection (L132) → 인라인 L132-146 (new SelectionHandler<Dcr01_ClassTreeM…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package getMenuTree() | L149-180 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L182-205 | 생성자,E2 | 서비스 dcr.Dcr01_ClassTree.selectByOrgCodeId, dcr.Dcr01_ClassTree.selectByCompanyId(companyId, orgCodeId, typeCode, companyId, typeCode) | 업무 |
| private addChild() | L207-215 | getServiceResult | 상태 처리 | 업무 |
| private search() | L217-236 | E1,E3 | 상태 처리 | 업무 |
| public getServiceResult() | L239-253 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L93-147 | 생성자 | 조회창 Org00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: orgSearch=findOrgCodeModel.getKorName( | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L255-257 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>

### Dcr04_TabPage_EmpAuth (`client/vi/dcr/Dcr04_TabPage_EmpAuth.java`, 286줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton} {deleteListButton}
- 입력·하위 화면: `searchText` TextField 빈칸="부서/성명/직위/사원구분", `lookup` Dcr04_Lookup_DocList, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 300 "부서" Text
  - personName 100 "성명" TextCenter
  - posName 100 "직위" TextCenter
  - kindName 100 "사원구분" TextCenter
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L62-87) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L92) → retrieve()
[E2] retrieveButton[조회].Select (L100) → retrieve()
[E3] insertButton[등록].Select (L106) → insertRow()
[E4] updateButton[저장].Select (L112) → update()
[E5] deleteButton[삭제].Select (L118) → deleteChk()
       └ [E7] msgBox.DialogHide [YES] (L259) → deleteRow()
[E6] deleteListButton[사원별 권한현황].Select (L124) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L149-152 | 생성자,E1,E2,E6,update | 상태 처리 | 업무 |
| public retrieve() | L154-190 | 생성자,E1,E2,E6,update | 서비스 dcr.Dcr04_EmpAuth.selectByText(classTreeId, searchText) | 업무 |
| public update() | L193-213 | E4 | 서비스 dcr.Dcr04_EmpAuth.updateList | 업무 |
| public insertRow() | L216-254 | E3 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private deleteChk() | L256-274 | E5 | ConfirmBox → E7 | 업무 |
| public deleteRow() | L277-281 | E7 | GridDeleteData dcr.Dcr04_EmpAuth.delete(체크된 행 목록) | 업무 |
| private settings() | L89-136 | 생성자 | 조회창 Dcr04_Lookup_DocList 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L137-147 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L283-285 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 300, '부서'),  // L140 SQL 계산 컬럼(selectByText: f_get_empTrans(b.emp01_person_id, f_sys…)
  gb.textCenter('personNm', 100, '성명'),  // L141 SQL 계산 컬럼(selectByText: b.emp01_kor_nm)
  gb.textCenter('posNm', 100, '직위'),  // L142 SQL 계산 컬럼(selectByText: f_get_empTrans(b.emp01_person_id, f_sys…)
  gb.textCenter('kindNm', 100, '사원구분'),  // L143 SQL 계산 컬럼(selectByText: f_get_empTrans(b.emp01_person_id, f_sys…)
  gb.text('note', 500, '비고', { editor: 'text' }),  // L144
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={retrieve}>사원별 권한현황</Button>

### Dcr04_Lookup_DocList (`client/vi/dcr/Dcr04_Lookup_DocList.java`, 155줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="부서/성명/직위/사원구분", `tabPage` Dcr04_TabPage_DocList
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 300 "부서" Text
  - personName 100 "성명" TextCenter
  - posName 100 "직위" TextCenter
  - kindName 100 "사원구분" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L54-83) → settings()
[E1] searchText.KeyPress [Enter] (L88) → retrieve()
[E2] retrieveButton[조회].Select (L96) → retrieve()
[E3] closeButton[닫기].Select (L102) → hide()
[E4] grid.RowClick (L109) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L48-52 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L133-146 | E1,E2,E4,open | 서비스 dcr.Dcr04_EmpAuth.getTargetList(companyId, searchText) | 업무 |
| private settings() | L85-120 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L122-131 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L148-150 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L152-154 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('orgNm', 300, '부서'),  // L125 SQL 계산 컬럼(getTargetList: MAX(dcr04_org_nm))
  gb.textCenter('personNm', 100, '성명'),  // L126 SQL 계산 컬럼(getTargetList: MAX(dcr04_person_nm))
  gb.textCenter('posNm', 100, '직위'),  // L127 SQL 계산 컬럼(getTargetList: MAX(dcr04_pos_nm))
  gb.textCenter('kindNm', 100, '사원구분'),  // L128 SQL 계산 컬럼(getTargetList: MAX(dcr04_kind_nm))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr04_TabPage_DocList (`client/vi/dcr/Dcr04_TabPage_DocList.java`, 166줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="문서분류명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeFullName 600 "문서분류명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L46-67) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L72) → retrieve()
[E2] retrieveButton[조회].Select (L80) → retrieve()
[E3] deleteButton[삭제].Select (L86) → deleteChk()
       └ [E4] msgBox.DialogHide [YES] (L135) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L100-104 | 생성자,E1,E2 | 상태 처리 | 업무 |
| public retrieve() | L106-130 | 생성자,E1,E2 | 서비스 dcr.Dcr04_EmpAuth.getTargetClassTreeList(personId, searchText) | 업무 |
| private deleteChk() | L132-150 | E3 | ConfirmBox → E4 | 업무 |
| public deleteRow() | L152-161 | E4 | GridDeleteData dcr.Dcr04_EmpAuth.delete(체크된 행 목록) | 업무 |
| private settings() | L69-92 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L93-98 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L163-165 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeFullNm', 600, '문서분류명'),  // L96 SQL 계산 컬럼(getTargetClassTreeList: f_class_tree_nm_allpath(a.dcr04_class_t…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={deleteChk}>삭제</Button>

