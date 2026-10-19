# Chk01_Tab_ClassTree

- 종류: 화면
- 메뉴: 기초자료 > 00. 내부통제 > 일일점검내역 분류(관리자) (#1244)
- 파일: `client/vi/chk/Chk01_Tab_ClassTree.java`
- 함께 쓰는 클래스 1개:
  - `Chk01_Edit_ClassTree` `client/vi/chk/Chk01_Edit_ClassTree.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `chk.Chk01_ClassTree.delete` | Chk01_Edit_ClassTree:151 | [`Chk01_ClassTree.java:95`](../../chk/services/Chk01_ClassTree.md) | `UpdateDataModel(chk01_class_tree)` 동적 DELETE |
| `chk.Chk01_ClassTree.selectByAll` | Chk01_Tab_ClassTree:123 | [`Chk01_ClassTree.java:30`](../../chk/services/Chk01_ClassTree.md) | [`chk01_class_tree.selectByParentId`](../../chk/sql/chk01_class_tree.md) |
| `chk.Chk01_ClassTree.update` | Chk01_Edit_ClassTree:117 | [`Chk01_ClassTree.java:90`](../../chk/services/Chk01_ClassTree.md) | `UpdateDataModel(chk01_class_tree)` 동적 INSERT/UPDATE → [`chk01_class_tree.selectById`](../../chk/sql/chk01_class_tree.md) |

## 테이블

[`chk01_class_tree`](../../../db/tables/chk.md)

## DB 함수

`f_cdnm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Chk01_Tab_ClassTree (`client/vi/chk/Chk01_Tab_ClassTree.java`, 207줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {addParentButton} {addChildButton}
- 입력·하위 화면: `editClassTree` Chk01_Edit_ClassTree
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - classTreeName 500 "클래스명" Text
  - actionCell 50 "수정" Cell 편집:editCell
  - useYn 50 "사용" Boolean
  - seq 100 "순서" Long
  - note 300 "비고" Text
  - linkName 300 "매뉴링크" Text

#### 이벤트
[E0] 화면 열림 (생성자 L42-62) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L67) → retrieve()
[E2] addParentButton[상위분류 등록].Select (L73) → insertClassTree()
[E3] addChildButton[하위분류 등록].Select (L80) → insertChildClassTree()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L89-108 | 필드 초기화 | 상태 처리 | 업무 |
| private editClassTree() | L110-119 | buildTreeGrid | 팝업 Chk01_Edit_ClassTree 열기 | 업무 |
| public retrieve() | L121-127 | 생성자,E1,editClassTree,insertClassTree | 서비스 chk.Chk01_ClassTree.selectByAll | 업무 |
| private setChildClassTreeItem() | L129-139 | getServiceResult | 상태 처리 | 업무 |
| private insertClassTree() | L141-161 | E2,insertChildClassTree | 팝업 Chk01_Edit_ClassTree 열기 | 업무 |
| private insertChildClassTree() | L163-178 | E3 | 미선택 시 alert "선택된 분류가 없습니다" | 업무 |
| public getServiceResult() | L181-206 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L64-87 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 500, '클래스명'),  // L100
  // ⚠ 대응 없음 (GridBuilder L101) addCell
  gb.boolean('useYn', 50, '사용'),  // L102
  gb.long('seq', 100, '순서'),  // L103
  gb.text('note', 300, '비고'),  // L104
  gb.text('linkNm', 300, '매뉴링크'),  // L105 SQL 계산 컬럼(selectByParentId: f_cdnm('ChkLinkCode', chk01_link_cd, ch…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertClassTree}>상위분류 등록</Button>
3. <Button type="register" onClick={insertChildClassTree}>하위분류 등록</Button>

### Chk01_Edit_ClassTree (`client/vi/chk/Chk01_Edit_ClassTree.java`, 241줄)

- 입력·하위 화면: `classTreeName` TextField, `linkCode` TextField, `seq` LongField, `note` TextArea, `linkName` ComboBoxField("ChkLinkCode", "(선택안함)") 빈칸="선택", `useYn` StringComboBox

#### 이벤트
[E2] linkName[매뉴링크].Collapse (L170) → 인라인 L170-175 (new CollapseHandler() { @Override pub…)
[E3] useYn[사용여부].Collapse (L182) → 인라인 L182-191 (new CollapseHandler() { @Override pub…)
[E4] deleteButton[삭제].Select (L192) → deleteChk()
       └ [E1] msgBox.DialogHide [YES] (L129) → delete()
[E5] updateButton[저장].Select (L198) → update()
[E6] closeButton[닫기].Select (L204) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L66-87 | 공개 메서드 | 상태 처리 | 업무 |
| public insert() | L89-110 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L112-124 | E5 | 서비스 chk.Chk01_ClassTree.update | 업무 |
| private deleteChk() | L126-144 | E4 | ConfirmBox → E1 | 업무 |
| private delete() | L146-158 | E1 | 서비스 chk.Chk01_ClassTree.delete | 업무 |
| public setForm() | L160-232 | edit,insert | 상태 처리 | 업무 |
| private setHtmlStyle() | L234-236 | setForm | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L238-240 | edit,insert | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteChk}>삭제</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

