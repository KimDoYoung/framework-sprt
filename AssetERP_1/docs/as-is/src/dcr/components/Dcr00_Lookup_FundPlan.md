# Dcr00_Lookup_FundPlan

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `fnd`
- 파일: `client/vi/dcr/Dcr00_Lookup_FundPlan.java`
- 함께 쓰는 클래스 3개:
  - `Dcr00_TabPage_TreeFundPlan` `client/vi/dcr/Dcr00_TabPage_TreeFundPlan.java`
  - `Dcr00_Tab_TreeFundPlan` `client/vi/dcr/Dcr00_Tab_TreeFundPlan.java`
  - `Dcr00_TabPage_GridFundPlan` `client/vi/dcr/Dcr00_TabPage_GridFundPlan.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `dcr.Dcr01_ClassTree.selectByClassTreeId` | Dcr00_Tab_TreeFundPlan:70 | [`Dcr01_ClassTree.java:202`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr00_TabPage_TreeFundPlan:166 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.selectByText` | Dcr00_TabPage_GridFundPlan:93 | [`Dcr01_ClassTree.java:40`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByText`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr00_Lookup_FundPlan (`client/vi/dcr/Dcr00_Lookup_FundPlan.java`, 82줄)

- 입력·하위 화면: `treeDocType` Dcr00_TabPage_TreeFundPlan, `gridDocType` Dcr00_TabPage_GridFundPlan

#### 이벤트
[E1] oKButton[확인].Select (L46) → confirm()
[E2] cancelButton[닫기].Select (L54) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L30-65 | 공개 메서드 | 상태 처리 | 업무 |
| public confirm() | L67-77 | E1 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L79-81 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr00_TabPage_TreeFundPlan (`client/vi/dcr/Dcr00_TabPage_TreeFundPlan.java`, 205줄)

- 레이아웃: west=vlc, center=grid
- 툴바 `buttonBar`: 문서분류: {retrieveButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L46-98) → retrieve()
[E1] docSearch.KeyPress [Enter] (L51) → search()
[E2] retrieveButton[조회].Select (L60) → retrieve()
[E3] tree.Selection (L84) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getSelectList() | L100-102 | 공개 메서드 | 상태 처리 | 업무 |
| package getMenuTree() | L104-138 | 필드 초기화 | 상태 처리 | 업무 |
| public getServiceResult() | L141-153 | 공개 메서드 | 상태 처리 | 업무 |
| private addChild() | L155-163 | getServiceResult | 상태 처리 | 업무 |
| private retrieve() | L165-174 | 생성자,E2 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L176-195 | E1 | 상태 처리 | 업무 |
| private retrievePage() | L197-200 | E3 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Dcr00_Tab_TreeFundPlan (`client/vi/dcr/Dcr00_Tab_TreeFundPlan.java`, 75줄)

- 레이아웃: center=cp
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 80 "구분코드" Text
  - classTreeName 280 "문서구분명" Text
  - itemTypeName 100 "상품분류" Text

#### 이벤트
[E0] 화면 열림 (생성자 L25-37) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getSelectList() | L51-55 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L57-72 | 공개 메서드 | 서비스 dcr.Dcr01_ClassTree.selectByClassTreeId(companyId, parentId) | 업무 |
| public buildGrid() | L39-50 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeCd', 80, '구분코드'),  // L45
  gb.text('classTreeNm', 280, '문서구분명'),  // L46
  gb.text('itemTypeNm', 100, '상품분류'),  // L47
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Dcr00_TabPage_GridFundPlan (`client/vi/dcr/Dcr00_TabPage_GridFundPlan.java`, 103줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 검색: {searchField} {searchButton}
- 입력·하위 화면: `searchField` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 100 "구분코드" Text
  - classTreeFullName 600 "문서구분명" Text
  - itemTypeName 200 "상품분류" Text

#### 이벤트
[E0] 화면 열림 (생성자 L35-65) → 초기화
[E1] searchField.KeyPress [Enter] (L41) → retrieve()
[E2] searchButton[조회].Select (L49) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L80-94 | E1,E2 | 서비스 dcr.Dcr01_ClassTree.selectByText(companyId, typeCode, searchText) | 업무 |
| public getSelectList() | L96-98 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L67-78 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L100-102 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classTreeCd', 100, '구분코드'),  // L73
  gb.text('classTreeFNm', 600, '문서구분명'),  // L74
  gb.text('itemTypeNm', 200, '상품분류'),  // L75
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

