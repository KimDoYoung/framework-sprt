# Icr01_Tab_ClassTree

- 종류: 화면
- 메뉴: 준법감시 > 01. 법규관리 > 내규관리 (#1347)
- 파일: `client/vi/icr/Icr01_Tab_ClassTree.java`
- 함께 쓰는 클래스 9개:
  - `Icr01_Move_TreeGrid` `client/vi/icr/Icr01_Move_TreeGrid.java`
  - `Icr01_Lookup_Manager` `client/vi/icr/Icr01_Lookup_Manager.java`
  - `Icr01_Grid_IcrType` `client/vi/icr/Icr01_Grid_IcrType.java`
  - `Icr01_Move_Grid` `client/vi/icr/Icr01_Move_Grid.java`
  - `Icr01_Lookup_Share` `client/vi/icr/Icr01_Lookup_Share.java`
  - `Icr02_Lookup_Manager` `client/vi/icr/Icr02_Lookup_Manager.java`
  - `Icr01_Lookup_IcrFile` `client/vi/icr/Icr01_Lookup_IcrFile.java`
  - `Icr01_Lookup_Content` `client/vi/icr/Icr01_Lookup_Content.java`
  - `Icr01_Edit_ClassTree` `client/vi/icr/Icr01_Edit_ClassTree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sch03_Lookup_Icr`](../../sch/components/Sch03_Lookup_Icr.md), [`Sch03_Lookup_Ics`](../../sch/components/Sch03_Lookup_Ics.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icr.Icr01_ClassTree.delete` | Icr01_Edit_ClassTree:215, Icr01_Grid_IcrType:363 | [`Icr01_ClassTree.java:300`](../../icr/services/Icr01_ClassTree.md) | `UpdateDataModel(icr01_class_tree)` 동적 DELETE |
| `icr.Icr01_ClassTree.deleteAll` | Icr01_Edit_ClassTree:196 | [`Icr01_ClassTree.java:253`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.deleteByClassTreeId`](../../icr/sql/icr01_class_tree.md), [`icr01_class_tree.getDownTreeId`](../../icr/sql/icr01_class_tree.md), [`icr01_class_tree.insertIcrDel`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.modelUpdate` | Icr01_Lookup_Content:93 | [`Icr01_ClassTree.java:287`](../../icr/services/Icr01_ClassTree.md) | `UpdateDataModel(icr01_class_tree)` 동적 INSERT/UPDATE → [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.refresh` | Icr01_Grid_IcrType:367 | [`Icr01_ClassTree.java:242`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.refresh`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectByClassTreeId` | Icr01_Grid_IcrType:224 | [`Icr01_ClassTree.java:43`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectByClassTreeId`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectByCompanyId` | Icr01_Move_Grid:93, Icr01_Move_TreeGrid:90, Icr01_Tab_ClassTree:273 | [`Icr01_ClassTree.java:28`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectByCompanyId`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.update` | Icr01_Edit_ClassTree:162, Icr01_Grid_IcrType:261, Icr01_Move_Grid:127, Icr01_Move_TreeGrid:124 | [`Icr01_ClassTree.java:295`](../../icr/services/Icr01_ClassTree.md) | `UpdateDataModel(icr01_class_tree)` 동적 INSERT/UPDATE → [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr05_RelateManager.relateUpdate` | Icr01_Lookup_Share:176 | [`Icr05_RelateManager.java:36`](../../icr/services/Icr05_RelateManager.md) | [`icr05_relate_manager.delete`](../../icr/sql/icr05_relate_manager.md), [`icr05_relate_manager.insert`](../../icr/sql/icr05_relate_manager.md), [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) |
| `icr.Icr05_RelateManager.selectByClassTreeId` | Icr01_Lookup_Share:77 | [`Icr05_RelateManager.java:27`](../../icr/services/Icr05_RelateManager.md) | [`icr05_relate_manager.selectByClassTreeId`](../../icr/sql/icr05_relate_manager.md) |
| `ics.Ics02_Manager.getDefaultYn` | Icr01_Lookup_Share:94 | [`Ics02_Manager.java:54`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.getDefaultYn`](../../ics/sql/ics02_manager.md) |
| `ics.Ics02_Manager.selectByCompanyId` | Icr01_Lookup_Manager:130, Icr02_Lookup_Manager:109 | [`Ics02_Manager.java:28`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.selectByCompanyId`](../../ics/sql/ics02_manager.md) |
| `ics.Ics02_Manager.update` | Icr01_Lookup_Manager:140 | [`Ics02_Manager.java:148`](../../ics/services/Ics02_Manager.md) | `UpdateDataModel(ics02_manager)` 동적 INSERT/UPDATE → [`ics02_manager.selectById`](../../ics/sql/ics02_manager.md) |
| `ics.Ics04_Share.selectByManagerId` | Icr01_Lookup_Share:195 | [`Ics04_Share.java:25`](../../ics/services/Ics04_Share.md) | [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md) |
| `sch.Sch03_Deadline.selectByClassTreeId` | Icr01_Grid_IcrType:288 | [`Sch03_Deadline.java:27`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectByClassTreeId`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.selectDeadlineName` | Icr01_Edit_ClassTree:113 | [`Sch03_Deadline.java:43`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectDeadlineName`](../../sch/sql/sch03_deadline.md) |
| `sys.Sys10_File.delete` | Icr01_Lookup_IcrFile:173 | [`Sys10_File.java:368`](../../sys/services/Sys10_File.md) | `UpdateDataModel(sys10_file)` 동적 DELETE |
| `sys.Sys10_File.selectByParentId` | Icr01_Lookup_IcrFile:221 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`icr99_class_tree_del`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics04_share`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_deadline_nm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icr01_Tab_ClassTree (`client/vi/icr/Icr01_Tab_ClassTree.java`, 322줄)

- 레이아웃: west=vlc, center=gridDocType
- 툴바 `buttonBar01`: 내규분류: {icrSearch} {retrieveButton}
- 툴바 `buttonBar02`: {expandAll} {collapseAll} {insertRootButton} {insertChildButton}
- 입력·하위 화면: `icrSearch` TextField, `lookupManager` Icr01_Lookup_Manager, `editClassTree` Icr01_Edit_ClassTree, `popup_Classification` Icr01_Edit_ClassTree
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 250 "분류명" Text
  - classTreeCode 100 "분류코드" Text
  - actionCell 50 "수정" Cell 편집:editInfoCell
  - actionCell 50 "이동" Cell 편집:moveCell

#### 이벤트
[E0] 화면 열림 (생성자 L54-144) → retrieve()
[E1] icrSearch.KeyPress [Enter] (L56) → search()
[E2] retrieveButton[찾기].Select (L64) → search()
[E3] expandAll[펼치기].Select (L70) → 인라인 L70-75 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L76) → 인라인 L76-81 (new SelectHandler(){ @Override public…)
[E5] insertRootButton[상위등록].Select (L82) → insertIcsClass()
[E6] insertChildButton[하위등록].Select (L88) → insertChildIcsClass()
[E7] managerButton[통제그룹담당자 지정].Select (L94) → insertManager()
[E8] treeGrid.SelectionChanged [선택>0] (L129) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L146-169 | 필드 초기화 | 상태 처리 | 업무 |
| private moveItem() | L171-174 | buildTreeGrid | 상태 처리 | 업무 |
| private addChildItem() | L176-187 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L190-209 | 공개 메서드 | 상태 처리 | 업무 |
| private insertManager() | L211-219 | E7 | 조회창 Icr01_Lookup_Manager 열기 | 업무 |
| private insertChildIcsClass() | L221-229 | E6 | 미선택 시 alert "먼저 상위분류를 선택해주세요" | 업무 |
| private insertIcsClass() | L231-253 | E5,insertChildIcsClass | 팝업 Icr01_Edit_ClassTree 열기 | 업무 |
| private editItem() | L255-265 | buildTreeGrid | 팝업 Icr01_Edit_ClassTree 열기 | 업무 |
| private retrievePage() | L267-270 | E8 | 상태 처리 | 업무 |
| public retrieve() | L272-279 | 생성자,insertIcsClass,editItem | 서비스 icr.Icr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L281-317 | E1,E2 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L319-321 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 250, '분류명'),  // L163
  gb.text('classTreeCd', 100, '분류코드'),  // L164
  // ⚠ 대응 없음 (GridBuilder L165) addCell
  // ⚠ 대응 없음 (GridBuilder L166) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="expand" onClick={() => /* 인라인 L70-75 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L76-81 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="register" onClick={insertIcsClass}>상위등록</Button>
5. <Button type="register" onClick={insertChildIcsClass}>하위등록</Button>
6. <Button type="save" onClick={insertManager}>통제그룹담당자 지정</Button>

### Icr01_Move_TreeGrid (`client/vi/icr/Icr01_Move_TreeGrid.java`, 173줄)


#### 이벤트
[E1] okButton[확인].Select (L97) → moveTree()
[E2] closeButton[닫기].Select (L105) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getKey() | L41-43 | 공개 메서드 | 상태 처리 | 업무 |
| public getValue() | L48-50 | 공개 메서드 | 상태 처리 | 업무 |
| public setValue() | L52-54 | 공개 메서드 | 상태 처리 | 업무 |
| public getPath() | L56-58 | 공개 메서드 | 상태 처리 | 업무 |
| package getClassTree() | L61-72 | open | 상태 처리 | 업무 |
| public open() | L74-115 | 공개 메서드 | 서비스 icr.Icr01_ClassTree.selectByCompanyId(companyId, typeCode) | 업무 |
| private moveTree() | L117-141 | E1 | 서비스 icr.Icr01_ClassTree.update | 업무 |
| private addChild() | L143-152 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L155-168 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L170-172 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={moveTree}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Icr01_Lookup_Manager (`client/vi/icr/Icr01_Lookup_Manager.java`, 151줄)

- 툴바 `searchBar`: {anchor}
- 입력·하위 화면: `lookupEmp` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid()):
  - personName 120 "사원명" Text 편집:lookupEmp

#### 이벤트
[E1] anchor.MouseDown (L56) → retrieve()
[E2] lookupEmp.TriggerClick [result != null] (L84) → 인라인 L84-104 (new TriggerClickHandler(){ @Override …)
[E3] updateButton[저장].Select (L113) → update()
[E4] closeButton[닫기].Select (L119) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-77 | 공개 메서드 | 상태 처리 | 업무 |
| public buttonSetting() | L112-125 | open | 상태 처리 | 업무 |
| public retrieve() | L127-136 | E1,open | 서비스 ics.Ics02_Manager.selectByCompanyId(companyId) | 업무 |
| public update() | L138-146 | E3 | 서비스 ics.Ics02_Manager.update | 업무 |
| private buildGrid() | L79-110 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L148-150 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personNm', 120, '사원명'),  // L107 SQL 계산 컬럼(selectByCompanyId: f_emp_kor_nm(ics02_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Icr01_Grid_IcrType (`client/vi/icr/Icr01_Grid_IcrType.java`, 400줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="분류코드/내규명", `lookup` Icr01_Lookup_Content, `lookupDeadline` Sch03_Lookup_Icr, `lookupShare` Icr01_Lookup_Share, `lookupFile` Icr01_Lookup_IcrFile
- 그리드 `grid` (buildGrid(), 체크박스):
  - actionCell 50 "이동" Cell 편집:moveCell
  - classTreeCode 70 "분류코드" Text 편집:TextField
  - classTreeName 200 "내규명" TextArea 편집:TextArea
  - content 300 "상세내용" TextLimitArea
  - actionCell 30 " " Cell 편집:actionCell
  - submitTo 200 "제출처" TextArea 편집:TextArea
  - cycleName 100 "주기" Text
  - actionCell 30 "기한" Cell 편집:deadlineCell
  - managerGroupName 120 "관리그룹" Text
  - actionCell 30 " " Cell 편집:managerCell
  - fileCount 60 "서식파일" Text
  - actionCell 30 " " Cell 편집:fileAddCell
  - relatedLaw 200 "관련조문" TextArea 편집:TextArea
  - useYn 100 "사용여부" Boolean

#### 이벤트
[E1] searchText.KeyPress [Enter] (L74) → retrieve()
[E2] retrieveButton[검색].Select [classTreeModel != null] (L82) → retrieve()
[E3] deleteButton[삭제].Select (L90) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L343) → delete()
[E4] insertButton[등록].Select (L96) → insertRow()
[E5] updateButton[저장].Select (L102) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-129 | 공개 메서드 | 상태 처리 | 업무 |
| private moveItem() | L191-199 | buildGrid | 상태 처리 | 업무 |
| public retrieve() | L201-230 | E1,E2,moveItem | 서비스 icr.Icr01_ClassTree.selectByClassTreeId(classTreeId, companyId, typeCode, searchText) | 업무 |
| public update() | L232-262 | E5 | 서비스 icr.Icr01_ClassTree.update | 업무 |
| public contentEdit() | L264-279 | buildGrid | 조회창 Icr01_Lookup_Content 열기 | 업무 |
| public deadlineList() | L281-305 | buildGrid | 조회창 Sch03_Lookup_Icr 열기, 서비스 sch.Sch03_Deadline.selectByClassTreeId(classTreeId) | 업무 |
| public managerList() | L307-315 | buildGrid | 조회창 Icr01_Lookup_Share 열기 | 업무 |
| public fileAddList() | L317-327 | buildGrid | 조회창 Icr01_Lookup_IcrFile 열기 | 업무 |
| public insertRow() | L329-338 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L340-358 | E3 | ConfirmBox → E6 | 업무 |
| public delete() | L360-364 | E6 | GridDeleteData icr.Icr01_ClassTree.delete(체크된 행 목록) | 업무 |
| private refresh() | L366-384 | contentEdit,deadlineList,managerList,fileAddList | 서비스 icr.Icr01_ClassTree.refresh(classTreeId, companyId) | 업무 |
| private modified() | L386-395 | contentEdit,deadlineList,fileAddList | 상태 처리 | 업무 |
| public buildGrid() | L131-189 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L397-399 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L173) addCell
  gb.text('classTreeCd', 70, '분류코드', { editor: 'text' }),  // L174
  gb.textArea('classTreeNm', 200, '내규명', { editor: 'largeText' }),  // L175
  // ⚠ 대응 없음 (GridBuilder L176) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L177) addCell
  gb.textArea('submitTo', 200, '제출처', { editor: 'largeText' }),  // L178
  gb.text('cycleNm', 100, '주기'),  // L179
  // ⚠ 대응 없음 (GridBuilder L180) addCell
  gb.text('managerGroupNm', 120, '관리그룹'),  // L181
  // ⚠ 대응 없음 (GridBuilder L182) addCell
  gb.text('fileCount', 60, '서식파일'),  // L183
  // ⚠ 대응 없음 (GridBuilder L184) addCell
  gb.textArea('relatedLaw', 200, '관련조문', { editor: 'largeText' }),  // L185
  gb.boolean('useYn', 100, '사용여부'),  // L186
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Icr01_Move_Grid (`client/vi/icr/Icr01_Move_Grid.java`, 167줄)


#### 이벤트
[E1] okButton[확인].Select (L100) → moveTree()
[E2] closeButton[닫기].Select (L108) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getKey() | L44-46 | 공개 메서드 | 상태 처리 | 업무 |
| public getValue() | L51-53 | 공개 메서드 | 상태 처리 | 업무 |
| public setValue() | L55-57 | 공개 메서드 | 상태 처리 | 업무 |
| public getPath() | L59-61 | 공개 메서드 | 상태 처리 | 업무 |
| package getClassTree() | L64-75 | open | 상태 처리 | 업무 |
| public open() | L77-118 | 공개 메서드 | 서비스 icr.Icr01_ClassTree.selectByCompanyId(companyId, typeCode) | 업무 |
| private moveTree() | L120-135 | E1 | 서비스 icr.Icr01_ClassTree.update | 업무 |
| private addChild() | L137-146 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L149-162 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L164-166 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={moveTree}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Icr01_Lookup_Share (`client/vi/icr/Icr01_Lookup_Share.java`, 210줄)

- 입력·하위 화면: `personName` TextField, `managerGroupName` LookupTriggerField, `lookup` Icr02_Lookup_Manager
- 그리드 `grid` (grid()):
  - shareName 80 "구분" TextCenter
  - orgName 250 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L63-74) → getEditor(), show()
[E1] updateButton[저장].Select (L115) → update()
[E2] closeButton[닫기].Select (L121) → hide()
[E3] managerGroupName[관리그룹].TriggerClick (L130) → shareRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-61 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L76-112 | open | 서비스 icr.Icr05_RelateManager.selectByClassTreeId, ics.Ics02_Manager.getDefaultYn | 업무 |
| private setting() | L114-151 | open | 조회창 Icr02_Lookup_Manager 열기 | 업무 |
| private grid() | L153-160 | 필드 초기화 | 상태 처리 | 업무 |
| private getEditor() | L162-173 | 생성자 | 상태 처리 | 업무 |
| public update() | L175-189 | E1 | 서비스 icr.Icr05_RelateManager.relateUpdate | 업무 |
| private shareRetrieve() | L191-201 | E3,retrieve | 서비스 ics.Ics04_Share.selectByManagerId(companyId, managerId) | 업무 |
| private setHtmlStyle() | L203-205 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L207-209 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('shareNm', 80, '구분'),  // L155 SQL 계산 컬럼(selectByManagerId: f_cdnm('ShareCode', ics04_share_cd, ics…)
  gb.text('orgNm', 250, '부서'),  // L156 SQL 계산 컬럼(selectByManagerId: f_org_nm(ics04_org_id, f_sysdate()))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Icr02_Lookup_Manager (`client/vi/icr/Icr02_Lookup_Manager.java`, 145줄)

- 그리드 `grid` (buildGrid(), 체크박스):
  - managerGroupName 320 "관리그룹명" Text

#### 이벤트
[E1] oKButton[확인].Select (L69) → confirm()
[E2] allButton[전체].Select [callback != null] (L75) → hide()
[E3] cancelButton[닫기].Select (L84) → hide()
[E4] grid.CellDoubleClick (L90) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-42 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L44-66 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L68-96 | open | 상태 처리 | 업무 |
| public retrieve() | L106-115 | open | 서비스 ics.Ics02_Manager.selectByCompanyId(companyId) | 업무 |
| public confirm() | L117-129 | E1,E4 | 미선택 시 alert "관리그룹을 선택해주세요" | 업무 |
| public getServiceResult() | L132-140 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L98-104 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L142-144 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('managerGroupNm', 320, '관리그룹명'),  // L102
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={confirm}>확인</Button>
2. <Button type="unknown" onClick={hide}>전체</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Icr01_Lookup_IcrFile (`client/vi/icr/Icr01_Lookup_IcrFile.java`, 265줄)

- 그리드 `grid` (buildApprFileGrid(), 체크박스):
  - fileName 580 "서식파일" Text
  - regDate 100 "등록일" Date
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] updateButton[등록].Select (L88) → upLoadFile()
[E2] closeButton[닫기].Select (L94) → confirm()
[E3] fileUpload.Change (L109) → 인라인 L109-116 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L119) → resetFileUpload(), retrieve()
[E5] fileDeleteForm.SubmitComplete (L140) → retrieve()
[E6] fileUpload.Change (L191) → 인라인 L191-198 (new ChangeHandler() { @Override publi…)
[E7] fileUploadForm.SubmitComplete (L201) → resetFileUpload(), retrieve()
[E8] fileUpload.Change (L241) → 인라인 L241-248 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L56-61 | 공개 메서드 | 상태 처리 | 업무 |
| public openPeriod() | L64-73 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L75-80 | openUser | 상태 처리 | 업무 |
| private buildApprFileGrid() | L154-183 | 필드 초기화 | GridDeleteData sys.Sys10_File.delete(체크된 행 목록) | 업무 |
| private upLoadFile() | L185-214 | E1 | 상태 처리 | 업무 |
| private retrieve() | L216-227 | E4,E5,E7,settings | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private confirm() | L229-232 | E2 | 상태 처리 | 업무 |
| private resetFileUpload() | L234-249 | E4,E7 | 상태 처리 | 업무 |
| public getServiceResult() | L252-260 | 공개 메서드 | 상태 처리 | 업무 |
| public settings() | L82-152 | openPeriod,open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L262-264 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 580, '서식파일'),  // L177
  gb.date('regDate', 100, '등록일'),  // L178
  // ⚠ 대응 없음 (GridBuilder L179) addCell
  // ⚠ 대응 없음 (GridBuilder L180) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={upLoadFile}>등록</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

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

### Icr01_Edit_ClassTree (`client/vi/icr/Icr01_Edit_ClassTree.java`, 231줄)

- 입력·하위 화면: `companyId` LongField, `classTreeId` LongField, `parentTreeId` LongField, `classTreeName` TextField, `classTreeCode` TextField, `seq` TextField, `deadlineFullName` TextField, `lookupDeadline` Sch03_Lookup_Ics

#### 이벤트
[E1] deadlineButton[설정].Select (L106) → 서비스 sch.Sch03_Deadline.selectDeadlineName(infoId)
[E2] deleteButton[삭제].Select (L128) → deleteCheck()
       └ [E5] msgBox.DialogHide [YES] (L174) → deleteAll()
[E3] updateButton[저장].Select (L137) → update()
[E4] closeButton[닫기].Select (L145) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editData() | L67-154 | 공개 메서드 | 조회창 Sch03_Lookup_Ics 열기, 서비스 sch.Sch03_Deadline.selectDeadlineName(infoId) | 업무 |
| public update() | L156-169 | E3 | 서비스 icr.Icr01_ClassTree.update | 업무 |
| private deleteCheck() | L171-190 | E2 | ConfirmBox → E5 | 업무 |
| private deleteAll() | L193-208 | E5 | 서비스 icr.Icr01_ClassTree.deleteAll | 업무 |
| public delete() | L210-222 | 공개 메서드 | 서비스 icr.Icr01_ClassTree.delete | 업무 |
| private setHtmlStyle() | L224-226 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L228-230 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteCheck}>삭제</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="register" onClick={() => /* 서비스 sch.Sch03_Deadline.selectDeadlineName(infoId) */}>설정</Button>

