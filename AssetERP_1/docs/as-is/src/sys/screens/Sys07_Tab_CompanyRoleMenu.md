# Sys07_Tab_CompanyRoleMenu

- 종류: 화면
- 메뉴: 기초자료 > 50. 권한 > 고객사별 메뉴권한 관리 (#1286)
- 파일: `client/vi/sys/Sys07_Tab_CompanyRoleMenu.java`
- 함께 쓰는 클래스 1개:
  - `Sys07_Tree_CompanyRoleMenu` `client/vi/sys/Sys07_Tree_CompanyRoleMenu.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_SelectSingle`](../../sys/components/Sys01_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys04_Role.selectByCompanyId` | Sys07_Tab_CompanyRoleMenu:129 | [`Sys04_Role.java:35`](../../sys/services/Sys04_Role.md) | [`sys04_role.selectByCompanyId`](../../sys/sql/sys04_role.md) |
| `sys.Sys06_Menu.selectByRoleId` | Sys07_Tree_CompanyRoleMenu:146 | [`Sys06_Menu.java:136`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByRoleId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.updateRoleMenu` | Sys07_Tree_CompanyRoleMenu:184 | [`Sys06_Menu.java:312`](../../sys/services/Sys06_Menu.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys07_role_menu)` 동적 INSERT/UPDATE → [`sys07_role_menu.selectById`](../../sys/sql/sys07_role_menu.md) |

## 테이블

[`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md)

## DB 함수

`f_get_company_nm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys07_Tab_CompanyRoleMenu (`client/vi/sys/Sys07_Tab_CompanyRoleMenu.java`, 138줄)

- 레이아웃: west=cp, center=roleMenuTree
- 툴바 `buttonBar`: 회사명: {companyName} {retrieveButton}
- 입력·하위 화면: `roleMenuTree` Sys07_Tree_CompanyRoleMenu, `companyName` LookupTriggerField, `lookup` Sys01_Lookup_SelectSingle
- 그리드 `roleGrid` (buildGrid()):
  - roleName 150 "권한명" Text
  - defaultRole 100 "기본권한" Boolean
  - adminYn 100 "관리자권한" Boolean
  - note 550 "권한설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L41-73) → settings()
[E1] companyName.TriggerClick [result != null] (L78) → 인라인 L78-97 (new TriggerClickHandler(){ @Override …)
[E2] retrieveButton[조회].Select (L99) → retrieve()
[E3] roleGrid.SelectionChanged (L105) → 인라인 L105-111 (new SelectionChangedHandler<Sys04_Rol…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L125-133 | E2 | 서비스 sys.Sys04_Role.selectByCompanyId(companyId) | 업무 |
| private settings() | L75-112 | 생성자 | 조회창 Sys01_Lookup_SelectSingle 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L114-123 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L135-137 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 150, '권한명'),  // L118
  gb.boolean('defaultRole', 100, '기본권한'),  // L119
  gb.boolean('adminYn', 100, '관리자권한'),  // L120
  gb.text('note', 550, '권한설명'),  // L121
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys07_Tree_CompanyRoleMenu (`client/vi/sys/Sys07_Tree_CompanyRoleMenu.java`, 197줄)

- 툴바 `buttonBar`: {refreshButton} {expandAll} {collapseAll} {updateButton}
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - menuName 250 "매뉴명" Text
  - roleMenuYn 40 "권한" Boolean
  - seq 80 "조회순서" Text
  - note 500 "매뉴설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L42-55) → settings()
[E1] refreshButton[조회].Select (L58) → refresh()
[E2] expandAll[펼치기].Select (L64) → 인라인 L64-69 (new SelectHandler(){ @Override public…)
[E3] collapseAll[감추기].Select (L70) → 인라인 L70-75 (new SelectHandler(){ @Override public…)
[E4] updateButton[저장].Select (L76) → update()
[E5] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L82) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getColumn() | L94-122 | E5 | 상태 처리 | 업무 |
| public buildTreeGrid() | L124-132 | 필드 초기화 | 상태 처리 | 업무 |
| public refresh() | L134-140 | E1 | 상태 처리 | 업무 |
| public retrieve() | L142-167 | refresh | 서비스 sys.Sys06_Menu.selectByRoleId | 업무 |
| private setChildItem() | L169-179 | retrieve | 상태 처리 | 업무 |
| private update() | L181-196 | E4 | 서비스 sys.Sys06_Menu.updateRoleMenu(roleId) | 업무 |
| private settings() | L57-92 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('menuNm', 250, '매뉴명'),  // L126
  gb.boolean('useYn', 40, '권한'),  // L127
  gb.text('seq', 80, '조회순서'),  // L128
  gb.text('note', 500, '매뉴설명'),  // L129
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={refresh}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L64-69 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L70-75 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="save" onClick={update}>저장</Button>

