# Sys06_Lookup_SearchMenu

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `ast`
- 파일: `client/vi/sys/Sys06_Lookup_SearchMenu.java`
- 함께 쓰는 클래스 1개:
  - `Sys40_Lookup_Bookmark` `client/vi/sys/Sys40_Lookup_Bookmark.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys06_Menu.selectByText` | Sys06_Lookup_SearchMenu:232 | [`Sys06_Menu.java:470`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByText`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.selectByTextManager` | Sys06_Lookup_SearchMenu:225 | [`Sys06_Menu.java:452`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByTextManager`](../../sys/sql/sys06_menu.md) |
| `sys.Sys40_Bookmark.deleteAll` | Sys40_Lookup_Bookmark:153 | [`Sys40_Bookmark.java:58`](../../sys/services/Sys40_Bookmark.md) | [`sys40_bookmark.deleteAll`](../../sys/sql/sys40_bookmark.md) |
| `sys.Sys40_Bookmark.deleteMenuId` | Sys06_Lookup_SearchMenu:186 | [`Sys40_Bookmark.java:48`](../../sys/services/Sys40_Bookmark.md) | [`sys40_bookmark.deleteMenuId`](../../sys/sql/sys40_bookmark.md) |
| `sys.Sys40_Bookmark.insertMenuId` | Sys06_Lookup_SearchMenu:170 | [`Sys40_Bookmark.java:34`](../../sys/services/Sys40_Bookmark.md) | [`sys40_bookmark.insertMenuId`](../../sys/sql/sys40_bookmark.md), [`sys40_bookmark.selectByMenuId`](../../sys/sql/sys40_bookmark.md) |
| `sys.Sys40_Bookmark.selectBySearchText` | Sys40_Lookup_Bookmark:118 | [`Sys40_Bookmark.java:24`](../../sys/services/Sys40_Bookmark.md) | [`sys40_bookmark.selectBySearchText`](../../sys/sql/sys40_bookmark.md) |
| `sys.Sys40_Bookmark.update` | Sys40_Lookup_Bookmark:128 | [`Sys40_Bookmark.java:67`](../../sys/services/Sys40_Bookmark.md) | `UpdateDataModel(sys40_bookmark)` 동적 INSERT/UPDATE → [`sys40_bookmark.selectById`](../../sys/sql/sys40_bookmark.md) |

## 테이블

[`emp04_add_title`](../../../db/tables/emp.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys40_bookmark`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md)

## DB 함수

`f_menu_nm_allpath`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys06_Lookup_SearchMenu (`client/vi/sys/Sys06_Lookup_SearchMenu.java`, 275줄)

- 툴바 `buttonBar`: 화면명: {menuName} {retrieveButton} {bookmarkButton} {menuNameYn}
- 입력·하위 화면: `menuName` TextField, `menuNameYn` CheckBox, `lookup` Sys40_Lookup_Bookmark
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - bookmark 50 "" BookMark
  - parentPathName 270 "화면경로" Text
  - menuName 180 "화면명" Text
  - menuNo 100 "화면번호" TextCenter
  - note 630 "화면설명" Text
  - actionCell 50 "" Cell 편집:actionCell
  - className 320 "ClassName" Text

#### 이벤트
[E1] menuName.KeyPress [Enter] (L128) → retrieve()
[E2] retrieveButton[조회].Select (L136) → retrieve()
[E3] bookmarkButton[북마크].Select (L142) → bookmark()
[E4] closeButton[닫기].Select (L148) → hide()
[E5] grid.CellDoubleClick (L155) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-59 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L61-64 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L66-96 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L217-242 | E1,E2,open,buildGrid,bookmark | 서비스 sys.Sys06_Menu.selectByTextManager, sys.Sys06_Menu.selectByText(userId, companyId, searchText, menuNameYn) | 업무 |
| public confirm() | L244-252 | E5 | 미선택 시 alert "매뉴를 선택해주세요" | 업무 |
| private bookmark() | L254-262 | E3 | 조회창 Sys40_Lookup_Bookmark 열기 | 업무 |
| private settings() | L98-161 | open | 이벤트 연결, 초기값: menuNameYn=true("화면명만 검색"), menuNameYn=false("화면명만 검색") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L163-215 | 필드 초기화 | 서비스 sys.Sys40_Bookmark.insertMenuId, sys.Sys40_Bookmark.deleteMenuId, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L264-266 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L268-270 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L272-274 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L207) addBookMark
  gb.text('parentPathNm', 270, '화면경로'),  // L208 SQL 계산 컬럼(selectByText: TRIM(TRAILING sys06_menu_nm FROM f_menu…)
  gb.text('menuNm', 180, '화면명'),  // L209
  gb.textCenter('menuNo', 100, '화면번호'),  // L210
  gb.text('note', 630, '화면설명'),  // L211
  // ⚠ 대응 없음 (GridBuilder L212) addCell
  gb.text('classNm', 320, 'ClassName'),  // L213
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="bookmark" onClick={bookmark}>북마크</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Sys40_Lookup_Bookmark (`client/vi/sys/Sys40_Lookup_Bookmark.java`, 175줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton} {deleteButton} ※ 그룹명은 '가나다' 순으로 자동 정렬되어 보여집니다:
- 그리드 `grid` (buildGrid()):
  - parentTitleName 160 "그룹명" Text 편집:TextField
  - seq 130 "그룹내 매뉴순서" TextCenter 편집:TextField
  - menuName 360 "매뉴명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L75-99) → show(), retrieve()
[E1] retrieveButton[조회].Select (L47) → retrieve()
[E2] updateButton[저장].Select (L53) → update()
[E3] deleteButton[전체삭제].Select (L59) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L134) → delete()
[E4] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-73 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L111-124 | 생성자,E1,delete | 서비스 sys.Sys40_Bookmark.selectBySearchText(companyId, userId, searchText) | 업무 |
| public update() | L126-129 | E2 | 서비스 sys.Sys40_Bookmark.update | 업무 |
| private deleteCheck() | L131-150 | E3 | ConfirmBox → E5 | 업무 |
| private delete() | L152-166 | E5 | 서비스 sys.Sys40_Bookmark.deleteAll | 업무 |
| private buildGrid() | L101-109 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L168-170 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L172-174 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentTitleNm', 160, '그룹명', { editor: 'text' }),  // L104
  gb.textCenter('seq', 130, '그룹내 매뉴순서', { editor: 'text' }),  // L105
  gb.text('menuNm', 360, '매뉴명'),  // L106 SQL 계산 컬럼(selectBySearchText: f_menu_nm_allpath(b.sys06_menu_id))
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteCheck}>전체삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

