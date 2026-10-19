# Ics01_Lookup_SelectParent

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `sch`
- 파일: `client/vi/ics/Ics01_Lookup_SelectParent.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.selectByCompanyId` | Ics01_Lookup_SelectParent:133 | [`Ics01_ClassTree.java:28`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByCompanyId`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.selectById` | Ics01_Lookup_SelectParent:196 | [`Ics01_ClassTree.java:22`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectById`](../../ics/sql/ics01_class_tree.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_deadline_nm`, `f_get_ics_nm`, `f_ics_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Lookup_SelectParent (`client/vi/ics/Ics01_Lookup_SelectParent.java`, 238줄)

- 툴바 `buttonBar`: {search} {searchButton}
- 입력·하위 화면: `search` TextField
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 500 "분류명" Text
  - classTreeCode 80 "법규코드" Text

#### 이벤트
[E0] 화면 열림 (생성자 L53-121) → show(), retrieve()
[E1] search.KeyPress [Enter] (L62) → search()
[E2] searchButton[찾기].Select (L70) → search()
[E3] selectButton[확인].Select (L76) → update()
[E4] noneButton[전체].Select (L82) → hide()
[E5] cancleButton[닫기].Select (L89) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L123-129 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L131-142 | 생성자 | 서비스 ics.Ics01_ClassTree.selectByCompanyId | 업무 |
| private addChildItem() | L144-152 | getServiceResult | 상태 처리 | 업무 |
| private search() | L154-190 | E1,E2 | 상태 처리 | 업무 |
| private update() | L192-211 | E3 | 미선택 시 alert "법규분류를 선택해주세요", 서비스 ics.Ics01_ClassTree.selectById(classTreeId) | 업무 |
| public getServiceResult() | L214-233 | update | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L235-237 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 500, '분류명'),  // L126
  gb.text('classTreeCd', 80, '법규코드'),  // L127
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

