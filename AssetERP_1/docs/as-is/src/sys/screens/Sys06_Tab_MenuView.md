# Sys06_Tab_MenuView

- 종류: 화면
- 메뉴: 관리자 > 01. 화면권한관리 > 메뉴별 그룹권한(View) (#1284)
- 파일: `client/vi/sys/Sys06_Tab_MenuView.java`
- 함께 쓰는 클래스 2개:
  - `Sys04_Page_RoleView` `client/vi/sys/Sys04_Page_RoleView.java`
  - `Sys05_Page_UserRoleView` `client/vi/sys/Sys05_Page_UserRoleView.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys04_Role.selectByMenuId` | Sys04_Page_RoleView:90 | [`Sys04_Role.java:45`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByMenuId`](../../sys/sql/sys04_role.md) |
| `sys.Sys05_UserRole.selectByRoleId` | Sys05_Page_UserRoleView:60 | [`Sys05_UserRole.java:23`](../../sys/services/Sys05_UserRole.md) | [`sys05_user_role.selectByRoleId`](../../sys/sql/sys05_user_role.md) |
| `sys.Sys06_Menu.selectByCompanyId` | Sys06_Tab_MenuView:137 | [`Sys06_Menu.java:46`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByCompanyId`](../../sys/sql/sys06_menu.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_code_seq`, `f_get_company_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_seq`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys06_Tab_MenuView (`client/vi/sys/Sys06_Tab_MenuView.java`, 201줄)

- 레이아웃: west=cp, center=roleViewPage
- 툴바 `buttonBar`: {searchText} {retrieveButton} {expandAll} {collapseAll}
- 입력·하위 화면: `roleViewPage` Sys04_Page_RoleView, `searchText` TextField
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - menuNoPlusName 400 "매뉴명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-80) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L85) → search()
[E2] retrieveButton[검색].Select (L93) → search()
[E3] expandAll[펼치기].Select (L100) → 인라인 L100-105 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L106) → 인라인 L106-111 (new SelectHandler(){ @Override public…)
[E5] treeGrid.SelectionChanged [data != null] (L113) → 인라인 L113-124 (new SelectionChangedHandler<Sys06_Men…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L127-134 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L136-142 | 생성자 | 서비스 sys.Sys06_Menu.selectByCompanyId(companyId) | 업무 |
| private setChildMenuItem() | L144-153 | getServiceResult | 상태 처리 | 업무 |
| private search() | L155-173 | E1,E2 | 상태 처리 | 업무 |
| public getServiceResult() | L176-200 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L82-125 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('menuNoPlusNm', 400, '매뉴명'),  // L131 SQL 계산 컬럼(selectByCompanyId: ( CASE WHEN sys06_menu_no IS NULL THEN …)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>검색</Button>
2. <Button type="expand" onClick={() => /* 인라인 L100-105 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L106-111 (new SelectHandler(){ @Override public…) */}>감추기</Button>

### Sys04_Page_RoleView (`client/vi/sys/Sys04_Page_RoleView.java`, 101줄)

- 레이아웃: west=cp, center=userRolePage
- 입력·하위 화면: `userRolePage` Sys05_Page_UserRoleView
- 그리드 `grid` (buildGrid()):
  - roleName 200 "권한명" Text
  - note 400 "권한설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L27-54) → settings()
[E1] grid.SelectionChanged (L57) → retrieveUserRole()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveUserRole() | L73-80 | E1,retrieve | 상태 처리 | 업무 |
| public retrieve() | L82-100 | 공개 메서드 | 서비스 sys.Sys04_Role.selectByMenuId(menuId, companyId) | 업무 |
| private settings() | L56-63 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L65-71 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '권한명'),  // L68
  gb.text('note', 400, '권한설명'),  // L69
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Sys05_Page_UserRoleView (`client/vi/sys/Sys05_Page_UserRoleView.java`, 63줄)

- 레이아웃: center=cp
- 그리드 `grid` (buildGrid()):
  - orgName 160 "조직" Text
  - titleName 100 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 80 "성명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L23-42) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L54-62 | 공개 메서드 | 서비스 sys.Sys05_UserRole.selectByRoleId(roleId) | 업무 |
| private buildGrid() | L44-52 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 160, '조직'),  // L46
  gb.text('titleNm', 100, '직책'),  // L47
  gb.text('empNo', 80, '사번'),  // L48
  gb.text('korNm', 80, '성명'),  // L49
];
```

#### 사용된 버튼들
버튼 사용하지 않음

