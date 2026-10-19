# Apr50_Lookup_ApprList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `dcr`
- 파일: `client/vi/apr/Apr50_Lookup_ApprList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr50_Bookmark.selectByPersonIdPaging` | Apr50_Lookup_ApprList:67 | [`Apr50_Bookmark.java:33`](../../apr/services/Apr50_Bookmark.md) | [`apr50_bookmark.selectByPersonIdPaging`](../../apr/sql/apr50_bookmark.md), [`apr50_bookmark.selectByPersonIdPagingTotal`](../../apr/sql/apr50_bookmark.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr50_bookmark`](../../../db/tables/apr.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr50_Lookup_ApprList (`client/vi/apr/Apr50_Lookup_ApprList.java`, 178줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - statusName 80 "결재상태" TextStatus
  - regDate 100 "등록(상신)일" Date
  - inOutTypeName 70 "문서구분" TextCenter
  - title 440 "문서명" TextHtml
  - regEmpName 100 "상신자" TextCenter
  - effectDate 100 "시행일" Date
  - classTreeName 170 "문서분류" Text
  - actionCell 80 "상세보기" Cell 편집:editDocCell

#### 이벤트
[E1] searchText.KeyPress [Enter] (L87) → retrieve()
[E2] retrieveButton[검색].Select (L95) → retrieve()
[E3] closeButton[닫기].Select (L101) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L46-82 | 공개 메서드 | 서비스 apr.Apr50_Bookmark.selectByPersonIdPaging | 업무 |
| private retrieve() | L151-169 | E1,E2,open,buildGrid | 상태 처리 | 업무 |
| private settings() | L84-107 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L109-149 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L171-173 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L175-177 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textStatus('statusNm', 80, '결재상태'),  // L139 SQL 계산 컬럼(selectByPersonIdPagingTotal: f_cdnm('AprStatusCode', apr01_status_cd…)
  gb.date('regDate', 100, '등록(상신)일'),  // L140 SQL 계산 컬럼(selectByPersonIdPagingTotal: apr01_reg_date)
  gb.textCenter('inoutNm', 70, '문서구분'),  // L141 SQL 계산 컬럼(selectByPersonIdPagingTotal: f_cdnm('AprInOutTypeCode', apr01_inout_…)
  // ⚠ 대응 없음 (GridBuilder L142) addTextHtml
  gb.textCenter('regEmpNm', 100, '상신자'),  // L143 SQL 계산 컬럼(selectByPersonIdPagingTotal: f_emp_kor_nm(apr01_reg_emp_id))
  gb.date('effectDate', 100, '시행일'),  // L144 SQL 계산 컬럼(selectByPersonIdPagingTotal: apr01_effect_date)
  gb.text('classTreeNm', 170, '문서분류'),  // L145 SQL 계산 컬럼(selectByPersonIdPagingTotal: f_class_tree_nm_allpath(apr01_class_tre…)
  // ⚠ 대응 없음 (GridBuilder L146) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

