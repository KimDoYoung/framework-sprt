# Sys03_Tab_CompanyMenu

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 회사별 메뉴맵핑 (#1076)
- 메뉴 키: `Sys03_Tab_ComapnyMenu`
- 파일: `client/vi/sys/Sys03_Tab_CompanyMenu.java`
- 함께 쓰는 클래스 1개:
  - `Sys03_Tree_CompanyMenu` `client/vi/sys/Sys03_Tree_CompanyMenu.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectByName` | Sys03_Tab_CompanyMenu:109 | [`Sys01_Company.java:41`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByName`](../../sys/sql/sys01_company.md) |
| `sys.Sys06_Menu.selectByCompanyIdAll` | Sys03_Tree_CompanyMenu:171 | [`Sys06_Menu.java:99`](../../sys/services/Sys06_Menu.md) | [`sys06_menu.selectByCompanyIdAll`](../../sys/sql/sys06_menu.md) |
| `sys.Sys06_Menu.updateCompanyMenu` | Sys03_Tree_CompanyMenu:252 | [`Sys06_Menu.java:345`](../../sys/services/Sys06_Menu.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sys03_company_menu)` 동적 INSERT/UPDATE → [`sys03_company_menu.selectById`](../../sys/sql/sys03_company_menu.md) |

## 테이블

[`sys01_company`](../../../db/tables/sys.md), [`sys03_company_menu`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys03_Tab_CompanyMenu (`client/vi/sys/Sys03_Tab_CompanyMenu.java`, 115줄)

- 레이아웃: west=cp, center=treeMenu
- 툴바 `buttonBar`: 고객명: {companyName} {retrieveButton}
- 입력·하위 화면: `companyName` TextField, `treeMenu` Sys03_Tree_CompanyMenu
- 그리드 `companyGrid` (buildGrid()):
  - companyName 200 "고객명" Text
  - locationName 100 "고객코드" Text
  - erpProductCode 80 "상품구분" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L36-88) → retrieve()
[E1] companyName.KeyDown [Enter] (L46) → retrieve()
[E2] retrieveButton[조회].Select (L55) → retrieve()
[E3] companyGrid.SelectionChanged (L67) → 인라인 L67-73 (new SelectionChangedHandler<Sys01_Com…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L104-110 | 생성자,E1,E2 | 서비스 sys.Sys01_Company.selectByName(companyName, useYn) | 업무 |
| public buildGrid() | L90-102 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L112-114 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '고객명'),  // L96
  gb.text('locNm', 100, '고객코드'),  // L97
  gb.textCenter('erpProductCd', 80, '상품구분'),  // L98
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Sys03_Tree_CompanyMenu (`client/vi/sys/Sys03_Tree_CompanyMenu.java`, 275줄)

- 툴바 `buttonBar`: 고객별 매뉴조회: {searchText} {refreshButton} {expandAll} {collapseAll} {updateButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - menuName 250 "매뉴명" Text
  - companyMenuUseYn 60 "권한" Boolean
  - seq 80 "조회순서" Text
  - note 500 "매뉴설명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L47-109) → 초기화
[E1] searchText.KeyPress [Enter] (L54) → search()
[E2] refreshButton[조회].Select [companyId != null] (L63) → retrieve()
[E3] expandAll[펼치기].Select (L73) → 인라인 L73-78 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L81) → 인라인 L81-86 (new SelectHandler(){ @Override public…)
[E5] updateButton[저장].Select (L89) → update()
[E6] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L99) → getColumn()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getColumn() | L111-149 | E6 | 상태 처리 | 업무 |
| public buildTreeGrid() | L151-161 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L163-195 | E2 | 서비스 sys.Sys06_Menu.selectByCompanyIdAll | 업무 |
| private setChildItem() | L197-206 | retrieve | 상태 처리 | 업무 |
| private search() | L208-247 | E1,retrieve | 상태 처리 | 업무 |
| private update() | L249-270 | E5 | 서비스 sys.Sys06_Menu.updateCompanyMenu(companyId) | 업무 |
| private setHtmlBarStyle() | L271-273 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('menuNm', 250, '매뉴명'),  // L155
  gb.boolean('useYn', 60, '권한'),  // L156
  gb.text('seq', 80, '조회순서'),  // L157
  gb.text('note', 500, '매뉴설명'),  // L158
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L73-78 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L81-86 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="save" onClick={update}>저장</Button>

