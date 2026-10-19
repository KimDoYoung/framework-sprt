# Ics01_Lookup_CheckList

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`
- 파일: `client/vi/ics/Ics01_Lookup_CheckList.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectByAll` | Ics01_Lookup_CheckList:154 | [`Ics01_ClassTree.java:153`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByAll`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.selectByParentTreeId` | Ics01_Lookup_CheckList:145 | [`Ics01_ClassTree.java:131`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByParentTreeId`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md)

## DB 함수

`f_cdnm`, `f_get_ics_nm`, `f_ics_class_tree_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Lookup_CheckList (`client/vi/ics/Ics01_Lookup_CheckList.java`, 171줄)

- 툴바 `buttonBar`: 중분류명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - parentTreeName 250 "대분류" TextArea
  - classTreeName 350 "중분류" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L52-116) → show()
[E1] searchText.KeyPress [Enter] (L59) → retrieve()
[E2] retrieveButton[조회].Select (L67) → retrieve()
[E3] selectButton[확인].Select (L73) → select()
[E4] selectAllButton[전체].Select (L79) → selectAll()
[E5] cancleButton[닫기].Select (L85) → hide()
[E6] grid.CellDoubleClick (L91) → select()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-50 | 공개 메서드 | 상태 처리 | 업무 |
| private select() | L129-133 | E3,E6 | 상태 처리 | 업무 |
| private selectAll() | L135-138 | E4 | 상태 처리 | 업무 |
| public retrieve() | L140-161 | E1,E2,open | 서비스 ics.Ics01_ClassTree.selectByParentTreeId, ics.Ics01_ClassTree.selectByAll(parentTreeId, searchText, searchText) | 업무 |
| public buildGrid() | L118-127 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L163-165 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L167-169 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('parentTreeNm', 250, '대분류'),  // L123
  gb.textArea('classTreeNm', 350, '중분류'),  // L124
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={selectAll}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

