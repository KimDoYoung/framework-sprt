# Icr01_Lookup_SelectMulti

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `apr`, `dcr`, `tdm`
- 파일: `client/vi/icr/Icr01_Lookup_SelectMulti.java`
- 함께 쓰는 클래스 2개:
  - `Icr01_Lookup_SelectParent` `client/vi/icr/Icr01_Lookup_SelectParent.java`
  - `Icr01_Lookup_Content` `client/vi/icr/Icr01_Lookup_Content.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icr.Icr01_ClassTree.modelUpdate` | Icr01_Lookup_Content:93 | [`Icr01_ClassTree.java:287`](../../icr/services/Icr01_ClassTree.md) | `UpdateDataModel(icr01_class_tree)` 동적 INSERT/UPDATE → [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectByCompanyId` | Icr01_Lookup_SelectParent:133 | [`Icr01_ClassTree.java:28`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectByCompanyId`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectById` | Icr01_Lookup_SelectParent:196 | [`Icr01_ClassTree.java:22`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectByListIcrId` | Icr01_Lookup_SelectMulti:278 | [`Icr01_ClassTree.java:186`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectByListIcrId`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectByTypeCodePaging` | Icr01_Lookup_SelectMulti:114 | [`Icr01_ClassTree.java:85`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectByTypeCodePaging`](../../icr/sql/icr01_class_tree.md), [`icr01_class_tree.selectByTypeCodePagingTotal`](../../icr/sql/icr01_class_tree.md) |

## 테이블

[`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_deadline_nm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icr01_Lookup_SelectMulti (`client/vi/icr/Icr01_Lookup_SelectMulti.java`, 307줄)

- 툴바 `buttonBar`: 분류: {classTreeName} 내규검색: {lawSearch} 조문검색: {statuteSearch} {retrieveButton} {detailSearchCheckBox}
- 입력·하위 화면: `classTreeName` LookupTriggerField, `classTreeId` LongField, `lawSearch` TextField 빈칸="내규코드/내규명", `statuteSearch` TextField 빈칸="관련조문", `detailSearchCheckBox` CheckBox, `lookup` Icr01_Lookup_Content
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeCode 70 "내규코드" TextCenter
  - classTreeName 300 "내규명" TextArea
  - content 400 "상세내용" TextLimitArea
  - actionCell 35 " " Cell 편집:actionCell
  - submitTo 200 "제출처" TextArea
  - cycleName 100 "주기" Text
  - relatedLaw 200 "관련조문" TextArea
  - classTreeFullName 250 "분류" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L71-77) → 초기화
[E1] classTreeName[전체].TriggerClick [result == null] (L138) → 인라인 L138-156 (new TriggerClickHandler(){ @Override …)
[E2] lawSearch.KeyPress [Enter] (L159) → retrieve()
[E3] statuteSearch.KeyPress [Enter] (L169) → retrieve()
[E4] retrieveButton[검색].Select (L179) → retrieve()
[E5] changeButton[확인].Select (L185) → update()
[E6] cancleButton[닫기].Select (L191) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUnConn() | L78-82 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L84-130 | openUnConn | 서비스 icr.Icr01_ClassTree.selectByTypeCodePaging | 업무 |
| private retrieve() | L229-254 | E2,E3,E4,open | 상태 처리 | 업무 |
| private update() | L256-294 | E5 | 미선택 시 alert "우측 내규를 선택해주세요", 서비스 icr.Icr01_ClassTree.selectByListIcrId(classTreeIdList) | 업무 |
| private settings() | L132-197 | open | 조회창 Icr01_Lookup_SelectParent 열기, 이벤트 연결, 초기값: classTreeId=null, classTreeId=null, classTreeId=resultModel.getClassTreeId(, detailSearchCheckBox=false("상세내용 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L199-227 | 필드 초기화 | 조회창 Icr01_Lookup_Content 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L296-298 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L300-302 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L304-306 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('classTreeCd', 70, '내규코드'),  // L218
  gb.textArea('classTreeNm', 300, '내규명'),  // L219
  // ⚠ 대응 없음 (GridBuilder L220) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L221) addCell
  gb.textArea('submitTo', 200, '제출처'),  // L222
  gb.text('cycleNm', 100, '주기'),  // L223
  gb.textArea('relatedLaw', 200, '관련조문'),  // L224
  gb.textArea('classTreeFullNm', 250, '분류'),  // L225
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Icr01_Lookup_SelectParent (`client/vi/icr/Icr01_Lookup_SelectParent.java`, 238줄)

- 툴바 `buttonBar`: {search} {searchButton}
- 입력·하위 화면: `search` TextField
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 500 "분류명" Text
  - classTreeCode 80 "내규코드" Text

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
| public retrieve() | L131-142 | 생성자 | 서비스 icr.Icr01_ClassTree.selectByCompanyId | 업무 |
| private addChildItem() | L144-152 | getServiceResult | 상태 처리 | 업무 |
| private search() | L154-190 | E1,E2 | 상태 처리 | 업무 |
| private update() | L192-211 | E3 | 미선택 시 alert "내규분류를 선택해주세요", 서비스 icr.Icr01_ClassTree.selectById(classTreeId) | 업무 |
| public getServiceResult() | L214-233 | update | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L235-237 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 500, '분류명'),  // L126
  gb.text('classTreeCd', 80, '내규코드'),  // L127
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Icr01_Lookup_Content (`client/vi/icr/Icr01_Lookup_Content.java`, 113줄)

- 입력·하위 화면: `content` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L54-79) → getEditor(), show()
[E1] updateButton[저장].Select (L60) → update()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L38-45 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L47-52 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L81-90 | 생성자 | 상태 처리 | 업무 |
| public update() | L92-108 | E1 | 서비스 icr.Icr01_ClassTree.modelUpdate(classTreeModel) | 업무 |
| private setHtmlHeaderStyle() | L110-112 | view,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

