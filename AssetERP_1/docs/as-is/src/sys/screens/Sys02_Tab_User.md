# Sys02_Tab_User

- 종류: 화면
- 파일: `client/vi/sys/Sys02_Tab_User.java`
- 함께 쓰는 클래스 1개:
  - `Sys82_Lookup_UserMenu` `client/vi/sys/Sys82_Lookup_UserMenu.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys02_User.delete` | Sys02_Tab_User:151 | [`Sys02_User.java:412`](../../sys/services/Sys02_User.md) | `UpdateDataModel(sys02_user)` 동적 DELETE |
| `sys.Sys02_User.selectByName` | Sys02_Tab_User:124 | [`Sys02_User.java:371`](../../sys/services/Sys02_User.md) | [`sys02_user.selectByName`](../../sys/sql/sys02_user.md) |
| `sys.Sys02_User.update` | Sys02_Tab_User:130 | [`Sys02_User.java:394`](../../sys/services/Sys02_User.md) | [`sys02_user.encryptsPasswd`](../../sys/sql/sys02_user.md), `UpdateDataModel(sys02_user)` 동적 INSERT/UPDATE → [`sys02_user.selectById`](../../sys/sql/sys02_user.md) |
| `sys.Sys06_Menu.selectByAdminUserId` | Sys82_Lookup_UserMenu:189 | [`Sys06_Menu.java:179`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByAdminUserId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys82_AdminUserMenu.updateMenu` | Sys82_Lookup_UserMenu:233 | [`Sys82_AdminUserMenu.java:19`](../../sys/services/Sys82_AdminUserMenu.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys82_admin_user_menu)` 동적 INSERT/UPDATE → [`sys82_admin_user_menu.selectById`](../../sys/sql/sys82_admin_user_menu.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys82_admin_user_menu`](../../../db/tables/sys.md)

## DB 함수

`f_today`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys02_Tab_User (`client/vi/sys/Sys02_Tab_User.java`, 170줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `lookup` Sys82_Lookup_UserMenu
- 그리드 `grid` (buildGrid()):
  - korName 120 "사용자명" Text 편집:"0069B4"
  - loginId 120 "ID" TextCenter 편집:"0069B4"
  - decPasswd 120 "PW" TextCenter 편집:"0069B4"
  - email 240 "이메일" Text 편집:TextField
  - telNo01 140 "휴대폰번호" TextCenter 편집:TextField
  - telNo02 140 "사무실번호" TextCenter 편집:TextField
  - note 480 "기타정보" Text 편집:TextField
  - adminYn 100 "전체권한" Boolean
  - actionCell 100 "권한설정" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L47-85) → 초기화
[E1] retrieveButton[조회].Select (L50) → retrieve()
[E2] updateButton[저장].Select (L56) → update()
[E3] insertButton[등록].Select (L62) → insertRow()
[E4] deleteButton[삭제].Select (L68) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L115-118 | E1 | 상태 처리 | 업무 |
| public retrieve() | L121-125 | E1 | 서비스 sys.Sys02_User.selectByName(companyId) | 업무 |
| public update() | L128-131 | E2 | 서비스 sys.Sys02_User.update | 업무 |
| public insertRow() | L134-145 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L148-152 | E4 | GridDeleteData sys.Sys02_User.delete(체크된 행 목록) | 업무 |
| public retrieve() | L155-158 | E1 | 상태 처리 | 업무 |
| public init() | L161-163 | 공개 메서드 | 상태 처리 | 업무 |
| public getGrid() | L166-169 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L87-113 | 필드 초기화 | 조회창 Sys82_Lookup_UserMenu 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('korNm', 120, '사용자명', { editor: 'text' }),  // L102
  gb.textCenter('loginId', 120, 'ID', { editor: 'text' }),  // L103
  gb.textCenter('decPasswd', 120, 'PW'),  // L104 SQL 계산 컬럼(selectByName: to_decrypts(sys02_passwd))
  gb.text('email', 240, '이메일', { editor: 'text' }),  // L105
  gb.textCenter('tel1', 140, '휴대폰번호', { editor: 'text' }),  // L106
  gb.textCenter('tel2', 140, '사무실번호', { editor: 'text' }),  // L107
  gb.text('note', 480, '기타정보', { editor: 'text' }),  // L108
  gb.boolean('adminYn', 100, '전체권한'),  // L109
  // ⚠ 대응 없음 (GridBuilder L110) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sys82_Lookup_UserMenu (`client/vi/sys/Sys82_Lookup_UserMenu.java`, 274줄)

- 툴바 `buttonBar`: 매뉴명: {searchText} {refreshButton} {expandAll} {collapseAll}
- 입력·하위 화면: `searchText` TextField
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - menuName 250 "매뉴명" Text
  - adminUserMenuYn 40 "권한" Boolean
  - seq 80 "조회순서" Text
  - note 250 "매뉴설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L59-85) → settings()
[E1] searchText.KeyPress [Enter] (L89) → search()
[E2] refreshButton[조회].Select (L97) → refresh()
[E3] expandAll[펼치기].Select (L103) → 인라인 L103-108 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L109) → 인라인 L109-114 (new SelectHandler(){ @Override public…)
[E5] updateButton[저장].Select (L115) → update()
[E6] closeButton[닫기].Select (L121) → hide()
[E7] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L127) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-57 | 공개 메서드 | 상태 처리 | 업무 |
| private getColumn() | L139-167 | E7 | 상태 처리 | 업무 |
| public buildTreeGrid() | L169-177 | 필드 초기화 | 상태 처리 | 업무 |
| public refresh() | L179-183 | E2 | 상태 처리 | 업무 |
| public retrieve() | L185-214 | open,refresh | 서비스 sys.Sys06_Menu.selectByAdminUserId | 업무 |
| private setChildItem() | L216-228 | retrieve | 상태 처리 | 업무 |
| private update() | L230-245 | E5 | 서비스 sys.Sys82_AdminUserMenu.updateMenu(userId) | 업무 |
| private search() | L247-265 | E1,retrieve | 상태 처리 | 업무 |
| private settings() | L87-137 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L267-269 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L271-273 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('menuNm', 250, '매뉴명'),  // L171
  gb.boolean('useYn', 40, '권한'),  // L172
  gb.text('seq', 80, '조회순서'),  // L173
  gb.text('note', 250, '매뉴설명'),  // L174
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={refresh}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L103-108 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L109-114 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

