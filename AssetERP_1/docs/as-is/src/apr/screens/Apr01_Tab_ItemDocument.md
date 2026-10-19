# Apr01_Tab_ItemDocument

- 종류: 화면
- 메뉴: 문서작성 > 02. 문서검색 > (X)종목별 문서검색 (#1137, 미사용)
- 파일: `client/vi/apr/Apr01_Tab_ItemDocument.java`
- 함께 쓰는 클래스 1개:
  - `Apr01_Grid_ItemDocList` `client/vi/apr/Apr01_Grid_ItemDocList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectByItemDocList` | Apr01_Grid_ItemDocList:152 | [`Apr01_Appr.java:1166`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectByItemDocList`](../../apr/sql/apr01_appr.md) |
| `ast.Ast01_ClassTree.selectByCompanyId` | Apr01_Tab_ItemDocument:213 | [`Ast01_ClassTree.java:32`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByCompanyId`](../../ast/sql/ast01_class_tree.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr14_relate_ast`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`dcr04_emp_auth`](../../../db/tables/dcr.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`fnd10_book`](../../../db/tables/fnd.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_get_biz_date`, `f_get_corp_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr01_Tab_ItemDocument (`client/vi/apr/Apr01_Tab_ItemDocument.java`, 275줄)

- 레이아웃: west=vlc, center=docList
- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radioIntrinsic` Radio, `radioManagement` Radio, `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L60-143) → retrieve()
[E1] toggleAssetType.ValueChange (L71) → retrieve()
[E2] retrieveButton[찾기].Select (L84) → retrieve()
[E3] docSearch.KeyPress [Enter] (L91) → search()
[E4] tree.Selection (L112) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package getMenuTree() | L145-180 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieveTabpage() | L182-198 | E4 | 상태 처리 | 업무 |
| private addChild() | L200-208 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L210-226 | 생성자,E1,E2 | 서비스 ast.Ast01_ClassTree.selectByCompanyId | 업무 |
| private search() | L228-248 | E3 | 상태 처리 | 업무 |
| public getServiceResult() | L251-266 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlCheckBoxLabelStyle() | L268-270 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L272-274 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>찾기</Button>

### Apr01_Grid_ItemDocList (`client/vi/apr/Apr01_Grid_ItemDocList.java`, 167줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radioSearchType1` Radio, `radioSearchType2` Radio, `searchText` TextField, `apprEditor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "상신일" Date
  - effectDate 100 "시행일" Date
  - classTreeNameAllPath 500 "문서분류" Text
  - title 500 "상신제목" Text
  - note 150 "비고" Text
  - actionCell 60 "상세보기" Cell 편집:detailCell
  - fileName 500 "첨부파일" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-107) → 초기화
[E1] toggleSearchType.ValueChange (L64) → retrieve()
[E2] retrieveButton[조회].Select (L78) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setAstClassTreeId() | L138-140 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L142-158 | E1,E2 | 서비스 apr.Apr01_Appr.selectByItemDocList(companyId, orgId, userId, astClassTreeId, searchType, searchText) | 업무 |
| public buildGrid() | L109-136 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L160-162 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L164-166 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '상신일'),  // L127
  gb.date('effectDate', 100, '시행일'),  // L128
  gb.text('treeNmAllpath', 500, '문서분류'),  // L129
  gb.text('title', 500, '상신제목'),  // L130
  gb.text('note', 150, '비고'),  // L131
  // ⚠ 대응 없음 (GridBuilder L132) addCell
  gb.text('fileNm', 500, '첨부파일'),  // L133
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

