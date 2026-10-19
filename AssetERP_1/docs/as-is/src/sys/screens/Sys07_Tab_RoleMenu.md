# Sys07_Tab_RoleMenu

- 종류: 화면
- 메뉴: 관리자 > 01. 화면권한관리 > 권한그룹별 메뉴 맵핑 (#1070)
- 파일: `client/vi/sys/Sys07_Tab_RoleMenu.java`
- 함께 쓰는 클래스 1개:
  - `Sys07_Tree_RoleMenu` `client/vi/sys/Sys07_Tree_RoleMenu.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys04_Role.selectByName` | Sys07_Tab_RoleMenu:100 | [`Sys04_Role.java:24`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByName`](../../sys/sql/sys04_role.md) |
| `sys.Sys06_Menu.selectByRoleId` | Sys07_Tree_RoleMenu:162 | [`Sys06_Menu.java:136`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByRoleId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.updateRoleMenu` | Sys07_Tree_RoleMenu:199 | [`Sys06_Menu.java:312`](../../sys/services/Sys06_Menu.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys07_role_menu)` 동적 INSERT/UPDATE → [`sys07_role_menu.selectById`](../../sys/sql/sys07_role_menu.md) |

## 테이블

[`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys07_Tab_RoleMenu (`client/vi/sys/Sys07_Tab_RoleMenu.java`, 106줄)

- 레이아웃: west=cp, center=roleMenuTree
- 툴바 `buttonBar`: 권한명: {roleName} {retrieveButton}
- 입력·하위 화면: `roleName` TextField, `roleMenuTree` Sys07_Tree_RoleMenu
- 그리드 `roleGrid` (buildGrid()):
  - roleName 200 "권한명" Text
  - note 550 "권한설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L35-69) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L73) → retrieve()
[E2] roleGrid.SelectionChanged (L79) → 인라인 L79-85 (new SelectionChangedHandler<Sys04_Rol…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L96-101 | 생성자,E1 | 서비스 sys.Sys04_Role.selectByName(roleName, companyId) | 업무 |
| private settings() | L71-86 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L88-94 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L103-105 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 200, '권한명'),  // L91
  gb.text('note', 550, '권한설명'),  // L92
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys07_Tree_RoleMenu (`client/vi/sys/Sys07_Tree_RoleMenu.java`, 236줄)

- 툴바 `buttonBar`: 매뉴명: {searchText} {refreshButton} {expandAll} {collapseAll} {updateButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - menuNoPlusName 350 "매뉴명" Text
  - roleMenuYn 40 "권한" Boolean
  - seq 80 "조회순서" Text
  - note 500 "매뉴설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-62) → settings()
[E1] searchText.KeyPress [Enter] (L66) → search()
[E2] refreshButton[조회].Select (L74) → refresh()
[E3] expandAll[펼치기].Select (L80) → 인라인 L80-85 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L86) → 인라인 L86-91 (new SelectHandler(){ @Override public…)
[E5] updateButton[저장].Select (L93) → update()
[E6] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L99) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getColumn() | L111-139 | E6 | 상태 처리 | 업무 |
| public buildTreeGrid() | L141-149 | 필드 초기화 | 상태 처리 | 업무 |
| public refresh() | L151-155 | E2 | 상태 처리 | 업무 |
| public retrieve() | L157-183 | refresh | 서비스 sys.Sys06_Menu.selectByRoleId | 업무 |
| private setChildItem() | L185-194 | retrieve | 상태 처리 | 업무 |
| private update() | L196-211 | E5 | 서비스 sys.Sys06_Menu.updateRoleMenu(roleId) | 업무 |
| private search() | L213-231 | E1,retrieve | 상태 처리 | 업무 |
| private settings() | L64-109 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L233-235 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('menuNoPlusNm', 350, '매뉴명'),  // L144 SQL 계산 컬럼(selectByRoleId: ( CASE WHEN sys06_menu_no IS NULL THEN …)
  gb.boolean('useYn', 40, '권한'),  // L145
  gb.text('seq', 80, '조회순서'),  // L146
  gb.text('note', 500, '매뉴설명'),  // L147
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={refresh}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L80-85 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L86-91 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="save" onClick={update}>저장</Button>

