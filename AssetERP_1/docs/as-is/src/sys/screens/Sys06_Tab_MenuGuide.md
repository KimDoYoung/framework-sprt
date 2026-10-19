# Sys06_Tab_MenuGuide

- 종류: 화면
- 메뉴: 관리자 > 02. 시스템관리 > 화면안내등록 (#1360)
- 파일: `client/vi/sys/Sys06_Tab_MenuGuide.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectMenuName` | Sys06_Tab_MenuGuide:40 | [`Sys00_Common.java:46`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectMenuName`](../../sys/sql/sys00_common.md) |
| `sys.Sys06_Menu.selectByMenuId` | Sys06_Tab_MenuGuide:149 | [`Sys06_Menu.java:555`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByMenuId`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.update` | Sys06_Tab_MenuGuide:195 | [`Sys06_Menu.java:695`](../../sys/services/Sys06_Menu.md) | `UpdateDataModel(sys06_menu)` 동적 INSERT/UPDATE → [`sys06_menu.selectById`](../../sys/sql/sys06_menu.md) |

## 테이블

[`sys06_menu`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys06_Tab_MenuGuide (`client/vi/sys/Sys06_Tab_MenuGuide.java`, 212줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 메뉴명: {menuName} 검색: {searchText} {retrieveButton} {updateButton}
- 입력·하위 화면: `menuName` CommonComboBoxField("sys.Sys00_Common.selectMenuName", "%", "전체"), `searchText` TextField 빈칸="메뉴/화면명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - menuFullName 300 "메뉴" Text
  - menuName 250 "화면명" Text
  - note 800 "화면안내" TextArea 편집:TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L46-78) → settings(), retrieve()
[E1] menuName[sys.Sys00_Common.selectMenuName].Collapse (L87) → retrieve()
[E2] retrieveButton[조회].Select (L93) → retrieve()
[E3] updateButton[저장].Select (L99) → update()
[E4] searchText.KeyPress [Enter] (L106) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L126-155 | 생성자,E1,E2,E4 | 서비스 sys.Sys06_Menu.selectByMenuId(menuId, searchText) | 업무 |
| private retrieveFocus() | L157-188 | update | 서비스 sys.Sys06_Menu.selectByMenuId(menuId, searchText) | 업무 |
| private update() | L190-207 | E3 | 서비스 sys.Sys06_Menu.update | 업무 |
| private settings() | L80-114 | 생성자 | 이벤트 연결, 초기값: menuName="전체"("sys.Sys00_Common.selectMenuName") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L116-124 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L209-211 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('menuFullNm', 300, '메뉴'),  // L119 SQL 계산 컬럼(selectByMenuId: total_menu_nm)
  gb.text('menuNm', 250, '화면명'),  // L120
  gb.textArea('note', 800, '화면안내', { editor: 'largeText' }),  // L121
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

