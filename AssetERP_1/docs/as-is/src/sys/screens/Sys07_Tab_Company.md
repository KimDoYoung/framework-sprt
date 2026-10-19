# Sys07_Tab_Company

- 종류: 화면
- 메뉴: 기초자료 > 50. 권한 > 권한그룹별 메뉴권한 복사 (#1247)
- 파일: `client/vi/sys/Sys07_Tab_Company.java`
- 함께 쓰는 클래스 4개:
  - `Sys07_Tab_OutCompany` `client/vi/sys/Sys07_Tab_OutCompany.java`
  - `Sys07_TabPage_Role` `client/vi/sys/Sys07_TabPage_Role.java`
  - `Sys07_TapPage_Menu` `client/vi/sys/Sys07_TapPage_Menu.java`
  - `Sys07_Tab_InCompany` `client/vi/sys/Sys07_Tab_InCompany.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectByName` | Sys07_Tab_InCompany:105, Sys07_Tab_OutCompany:113 | [`Sys01_Company.java:41`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByName`](../../sys/sql/sys01_company.md) |
| `sys.Sys04_Role.selectByName` | Sys07_TabPage_Role:108 | [`Sys04_Role.java:24`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) |
| `sys.Sys06_Menu.selectByRoleId` | Sys07_TapPage_Menu:92 | [`Sys06_Menu.java:136`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByRoleId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys07_RoleMenu.updateMenu` | Sys07_Tab_Company:171 | [`Sys07_RoleMenu.java:46`](../../sys/services/Sys07_RoleMenu.md) | [`sys03_company_menu.insertMenu`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.selectByMenu`](../../sys/sql/sys03_company_menu.md), [`sys03_company_menu.updateMenu`](../../sys/sql/sys03_company_menu.md), [`sys04_role.selectByName`](../../sys/sql/sys04_role.md), [`sys06_menu.getMenuId`](../../sys/sql/sys06_menu.md), [`sys07_role_menu.insertRoleMenu`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.selectByMenuId`](../../sys/sql/sys07_role_menu.md), [`sys07_role_menu.updateRoleMenu`](../../sys/sql/sys07_role_menu.md) |
| `sys.Sys07_RoleMenu.updateRole` | Sys07_Tab_Company:147 | [`Sys07_RoleMenu.java:23`](../../sys/services/Sys07_RoleMenu.md) | [`sys04_role.insertRole`](../../sys/sql/sys04_role.md), [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_company_nm`, `f_sysdate`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys07_Tab_Company (`client/vi/sys/Sys07_Tab_Company.java`, 191줄)

- 레이아웃: north=buttonBar, center=tapInCompany, south=tapOutCompany
- 툴바 `buttonBar`: {copyRoleButton} {copyMenuButton} ※ 상단 : 출발지 회사 / 하단 : 목적지 회사:
- 입력·하위 화면: `tapInCompany` Sys07_Tab_InCompany, `tapOutCompany` Sys07_Tab_OutCompany

#### 이벤트
[E0] 화면 열림 (생성자 L38-68) → settings()
[E1] copyRoleButton[권한그룹복사].Select [YES] (L71) → updateRole()
[E2] msgBox.DialogHide [YES] (L86) → updateRole()
[E3] copyMenuButton[매뉴권한복사].Select [YES] (L104) → updateMenu()
[E4] msgBox.DialogHide [YES] (L120) → updateMenu()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private updateRole() | L140-161 | E1,E2 | 서비스 sys.Sys07_RoleMenu.updateRole(inCompanyId, roleName) | 업무 |
| private updateMenu() | L164-186 | E3,E4 | 서비스 sys.Sys07_RoleMenu.updateMenu(inCompanyId, roleName, menuId) | 업무 |
| private settings() | L70-138 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L188-190 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="change" onClick={updateRole}>권한그룹복사</Button>
2. <Button type="change" onClick={updateMenu}>매뉴권한복사</Button>

### Sys07_Tab_OutCompany (`client/vi/sys/Sys07_Tab_OutCompany.java`, 128줄)

- 레이아웃: west=cp, center=tapPageRole
- 툴바 `buttonBar`: 회사명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `tapPageRole` Sys07_TabPage_Role
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 180 "고객명" Text
  - locationName 105 "Sub-Domain" Text

#### 이벤트
[E0] 화면 열림 (생성자 L38-69) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L73) → retrieve()
[E2] grid.RowClick (L79) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L106-119 | 생성자,E1,E2 | 서비스 sys.Sys01_Company.selectByName(companyName, now, useYn) | 업무 |
| public getModels() | L121-123 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L71-93 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L95-104 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L125-127 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 180, '고객명'),  // L101
  gb.text('locNm', 105, 'Sub-Domain'),  // L102
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys07_TabPage_Role (`client/vi/sys/Sys07_TabPage_Role.java`, 127줄)

- 레이아웃: west=vlc, center=tapPageMenu
- 툴바 `buttonBar`: 권한명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `tapPageMenu` Sys07_TapPage_Menu
- 그리드 `grid` (buildGrid(), 체크박스):
  - roleName 220 "권한명" Text
  - defaultRole 65 "기본권한" BooleanYn
  - adminYn 65 "관리자권한" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L37-62) → settings(), refresh()
[E1] retrieveButton[조회].Select (L66) → refresh()
[E2] grid.SelectionChanged [companyId != null] (L72) → 인라인 L72-81 (new SelectionChangedHandler<Sys04_Rol…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public refresh() | L96-100 | 생성자,E1 | 상태 처리 | 업무 |
| public retrieve() | L102-114 | refresh | 서비스 sys.Sys04_Role.selectByName(roleName, companyId) | 업무 |
| public getModel() | L116-118 | 공개 메서드 | 상태 처리 | 업무 |
| public getTabPageMenu() | L120-122 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L64-82 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L84-94 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L124-126 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 220, '권한명'),  // L90
  gb.booleanYn('defaultRole', 65, '기본권한'),  // L91
  gb.booleanYn('adminYn', 65, '관리자권한'),  // L92
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={refresh}>조회</Button>

### Sys07_TapPage_Menu (`client/vi/sys/Sys07_TapPage_Menu.java`, 130줄)

- 툴바 `buttonBar`: {refreshButton} {expandAll} {collapseAll}
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - menuName 400 "매뉴명" Text
  - roleMenuYn 30 "권한" BooleanYn
  - seq 70 "조회순서" Text
  - note 500 "매뉴설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L37-48) → settings()
[E1] refreshButton[조회].Select (L51) → refresh()
[E2] expandAll[펼치기].Select (L57) → 인라인 L57-62 (new SelectHandler(){ @Override public…)
[E3] collapseAll[감추기].Select (L63) → 인라인 L63-68 (new SelectHandler(){ @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L71-80 | 필드 초기화 | 상태 처리 | 업무 |
| public refresh() | L82-86 | E1 | 상태 처리 | 업무 |
| public retrieve() | L88-113 | refresh | 서비스 sys.Sys06_Menu.selectByRoleId | 업무 |
| private setChildItem() | L115-125 | retrieve | 상태 처리 | 업무 |
| public getModel() | L127-129 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L50-69 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('menuNm', 400, '매뉴명'),  // L74
  gb.booleanYn('useYn', 30, '권한'),  // L75
  gb.text('seq', 70, '조회순서'),  // L76
  gb.text('note', 500, '매뉴설명'),  // L77
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={refresh}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L57-62 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L63-68 (new SelectHandler(){ @Override public…) */}>감추기</Button>

### Sys07_Tab_InCompany (`client/vi/sys/Sys07_Tab_InCompany.java`, 128줄)

- 레이아웃: west=cp, center=tapPageRole
- 툴바 `buttonBar`: 회사명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `tapPageRole` Sys07_TabPage_Role
- 그리드 `grid` (buildGrid(), 체크박스):
  - companyName 180 "고객명" Text
  - locationName 105 "Sub-Domain" Text

#### 이벤트
[E0] 화면 열림 (생성자 L37-67) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L71) → retrieve()
[E2] grid.RowClick (L77) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L98-111 | 생성자,E1,E2 | 서비스 sys.Sys01_Company.selectByName(companyName, now, useYn) | 업무 |
| public getCompanyModel() | L113-115 | 공개 메서드 | 상태 처리 | 업무 |
| public getRoleModel() | L117-119 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuModel() | L121-123 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L69-85 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L87-96 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L125-127 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 180, '고객명'),  // L93
  gb.text('locNm', 105, 'Sub-Domain'),  // L94
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

