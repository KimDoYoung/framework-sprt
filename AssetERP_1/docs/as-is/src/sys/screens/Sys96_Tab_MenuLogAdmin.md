# Sys96_Tab_MenuLogAdmin

- 종류: 화면
- 파일: `client/vi/sys/Sys96_Tab_MenuLogAdmin.java`
- 함께 쓰는 클래스 1개:
  - `Sys06_Lookup_SelectMulti` `client/vi/sys/Sys06_Lookup_SelectMulti.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys00_Common.selectCompanyName` | Sys96_Tab_MenuLogAdmin:48 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |
| `sys.Sys06_Menu.getAllMenuList` | Sys06_Lookup_SelectMulti:142 | [`Sys06_Menu.java:493`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.getAllMenuList`](../../sys/sql/sys06_menu.md) |
| `sys.Sys96_MenuLog.selectByTextAdminPaging` | Sys96_Tab_MenuLogAdmin:92 | [`Sys96_MenuLog.java:33`](../../sys/services/Sys96_MenuLog.md) | [`sys96_menu_log.selectByTextAdminPaging`](../../sys/sql/sys96_menu_log.md), [`sys96_menu_log.selectByTextAdminPagingTotal`](../../sys/sql/sys96_menu_log.md) |

## 테이블

[`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys96_menu_log`](../../../db/tables/sys.md)

## DB 함수

`f_get_emptrans`, `f_menu_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys96_Tab_MenuLogAdmin (`client/vi/sys/Sys96_Tab_MenuLogAdmin.java`, 209줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyName} {searchText} 매뉴명: {lookupMenuInfo} {retrieveButton}
- 입력·하위 화면: `companyName` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체"), `lookupMenuInfo` LookupTriggerField, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="사원명", `lookup` Sys06_Lookup_SelectMulti
- 그리드 `grid` (buildGrid()):
  - companyName 200 "고객사명" Text
  - personInfo 200 "사원정보" Text
  - menuName 200 "매뉴명" Text
  - className 200 "클래스명" Text
  - firstDateStr 150 "최초접속일" TextCenter
  - lastDateStr 150 "최근접속일" TextCenter
  - cnt 50 "횟수" Long

#### 이벤트
[E0] 화면 열림 (생성자 L61-104) → settings(), retrieve()
[E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L115) → retrieve()
[E2] searchText.KeyDown [Enter] (L123) → retrieve()
[E3] lookupMenuInfo[전체].TriggerClick (L134) → openLookupMenuInfo()
[E4] retrieveButton[조회].Select (L140) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openLookupMenuInfo() | L148-167 | E3 | 조회창 Sys06_Lookup_SelectMulti 열기 | 업무 |
| public retrieve() | L181-204 | 생성자,E1,E2,E4 | 상태 처리 | 업무 |
| private settings() | L106-146 | 생성자 | 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday(, companyName="전체"("sys.Sys00_Common.selectCompanyName") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L169-179 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L206-208 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '고객사명'),  // L171 SQL 계산 컬럼(selectByTextAdminPaging: sys01_company_nm)
  gb.text('personInfo', 200, '사원정보'),  // L172 SQL 계산 컬럼(selectByTextAdminPaging: ( CASE WHEN emp01_person_id IS NULL THE…)
  gb.text('menuNm', 200, '매뉴명'),  // L173 SQL 계산 컬럼(selectByTextAdminPaging: ( SELECT sys06_menu_nm FROM sys06_menu …)
  gb.text('classNm', 200, '클래스명'),  // L174
  gb.textCenter('firstDateStr', 150, '최초접속일'),  // L175 SQL 계산 컬럼(selectByTextAdminPaging: TO_CHAR(sys96_first_date,'yyyy-mm-dd HH…)
  gb.textCenter('lastDateStr', 150, '최근접속일'),  // L176 SQL 계산 컬럼(selectByTextAdminPaging: TO_CHAR(sys96_last_date,'yyyy-mm-dd HH2…)
  gb.long('cnt', 50, '횟수'),  // L177
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys06_Lookup_SelectMulti (`client/vi/sys/Sys06_Lookup_SelectMulti.java`, 173줄)

- 툴바 `buttonBar`: 매뉴명: {menuName} {retrieveButton} {menuNameYn}
- 입력·하위 화면: `menuName` TextField, `menuNameYn` CheckBox
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentPathName 300 "경로" Text
  - menuName 200 "매뉴명" Text

#### 이벤트
[E1] menuName.KeyPress [Enter] (L92) → retrieve()
[E2] retrieveButton[조회].Select (L100) → retrieve()
[E3] confirmButton[확인].Select (L106) → confirm()
[E4] closeButton[닫기].Select (L112) → hide()
[E5] grid.CellDoubleClick (L119) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-52 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L54-84 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L136-148 | E1,E2,open | 서비스 sys.Sys06_Menu.getAllMenuList(searchText, menuNameYn) | 업무 |
| public confirm() | L150-160 | E3,E5 | 상태 처리 | 업무 |
| private settings() | L86-125 | open | 이벤트 연결, 초기값: menuNameYn=false("매뉴명만 검색") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L127-134 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L162-164 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L166-168 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L170-172 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentPathNm', 300, '경로'),  // L131 SQL 계산 컬럼(getAllMenuList: TRIM(TRAILING sys06_menu_nm FROM f_menu…)
  gb.text('menuNm', 200, '매뉴명'),  // L132
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

