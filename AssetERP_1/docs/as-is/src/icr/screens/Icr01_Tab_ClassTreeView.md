# Icr01_Tab_ClassTreeView

- 종류: 화면
- 메뉴: 준법감시 > 00. 법규정보 > 내규조회 (#1346)
- 파일: `client/vi/icr/Icr01_Tab_ClassTreeView.java`
- 함께 쓰는 클래스 5개:
  - `Icr01_Lookup_Share` `client/vi/icr/Icr01_Lookup_Share.java`
  - `Icr02_Lookup_Manager` `client/vi/icr/Icr02_Lookup_Manager.java`
  - `Icr01_Lookup_SelectParent` `client/vi/icr/Icr01_Lookup_SelectParent.java`
  - `Icr01_Lookup_IcrFile` `client/vi/icr/Icr01_Lookup_IcrFile.java`
  - `Icr01_Lookup_Content` `client/vi/icr/Icr01_Lookup_Content.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sch03_Lookup_IcsUser`](../../sch/components/Sch03_Lookup_IcsUser.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `icr.Icr01_ClassTree.modelUpdate` | Icr01_Lookup_Content:93 | [`Icr01_ClassTree.java:287`](../../icr/services/Icr01_ClassTree.md) | `UpdateDataModel(icr01_class_tree)` 동적 INSERT/UPDATE → [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.refresh` | Icr01_Tab_ClassTreeView:258 | [`Icr01_ClassTree.java:242`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.refresh`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectByCompanyId` | Icr01_Lookup_SelectParent:133 | [`Icr01_ClassTree.java:28`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectByCompanyId`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectById` | Icr01_Lookup_SelectParent:196 | [`Icr01_ClassTree.java:22`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectById`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr01_ClassTree.selectByTypeCodePaging` | Icr01_Tab_ClassTreeView:80 | [`Icr01_ClassTree.java:85`](../../icr/services/Icr01_ClassTree.md) | [`icr01_class_tree.selectByTypeCodePaging`](../../icr/sql/icr01_class_tree.md), [`icr01_class_tree.selectByTypeCodePagingTotal`](../../icr/sql/icr01_class_tree.md) |
| `icr.Icr05_RelateManager.relateUpdate` | Icr01_Lookup_Share:176 | [`Icr05_RelateManager.java:36`](../../icr/services/Icr05_RelateManager.md) | [`icr05_relate_manager.delete`](../../icr/sql/icr05_relate_manager.md), [`icr05_relate_manager.insert`](../../icr/sql/icr05_relate_manager.md), [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md), [`sch02_share.delete`](../../sch/sql/sch02_share.md), [`sch02_share.insert`](../../sch/sql/sch02_share.md) |
| `icr.Icr05_RelateManager.selectByClassTreeId` | Icr01_Lookup_Share:77 | [`Icr05_RelateManager.java:27`](../../icr/services/Icr05_RelateManager.md) | [`icr05_relate_manager.selectByClassTreeId`](../../icr/sql/icr05_relate_manager.md) |
| `ics.Ics02_Manager.getDefaultYn` | Icr01_Lookup_Share:94 | [`Ics02_Manager.java:54`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.getDefaultYn`](../../ics/sql/ics02_manager.md) |
| `ics.Ics02_Manager.selectByCompanyId` | Icr02_Lookup_Manager:109 | [`Ics02_Manager.java:28`](../../ics/services/Ics02_Manager.md) | [`ics02_manager.selectByCompanyId`](../../ics/sql/ics02_manager.md) |
| `ics.Ics04_Share.selectByManagerId` | Icr01_Lookup_Share:195 | [`Ics04_Share.java:25`](../../ics/services/Ics04_Share.md) | [`ics04_share.selectByManagerId`](../../ics/sql/ics04_share.md) |
| `sys.Sys10_File.delete` | Icr01_Lookup_IcrFile:173 | [`Sys10_File.java:368`](../../sys/services/Sys10_File.md) | `UpdateDataModel(sys10_file)` 동적 DELETE |
| `sys.Sys10_File.selectByParentId` | Icr01_Lookup_IcrFile:221 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |

## 테이블

[`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics04_share`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_deadline_nm`, `f_get_icr_nm`, `f_icr_class_tree_nm_allpath`, `f_org_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Icr01_Tab_ClassTreeView (`client/vi/icr/Icr01_Tab_ClassTreeView.java`, 284줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 분류: {classTreeName} 내규검색: {lawSearch} 조문검색: {statuteSearch} {retrieveButton} {detailSearchCheckBox} {retrieveButton}
- 입력·하위 화면: `classTreeName` LookupTriggerField 빈칸="전체", `classTreeId` LongField, `detailSearchCheckBox` CheckBox, `lawSearch` TextField 빈칸="내규코드/내규명", `statuteSearch` TextField 빈칸="관련조문", `lookup` Icr01_Lookup_Content, `lookupDeadline` Sch03_Lookup_IcsUser, `lookupShare` Icr01_Lookup_Share, `lookupFile` Icr01_Lookup_IcrFile
- 그리드 `grid` (buildGrid(), 체크박스):
  - classTreeCode 60 "내규코드" TextCenter
  - classTreeName 250 "내규명" TextArea
  - content 400 "상세내용" TextLimitArea
  - actionCell 30 " " Cell 편집:actionCell
  - submitTo 150 "제출처" TextArea
  - relatedLaw 200 "관련조문" TextArea
  - cycleName 100 "주기" Text
  - actionCell 30 " " Cell 편집:deadlineCell
  - fileCount 60 "서식파일" TextCenter
  - actionCell 30 " " Cell 편집:fileAddCell
  - parentTreeFullName 200 "분류" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L59-96) → settings(), retrieve()
[E1] classTreeName.TriggerClick [result == null] (L104) → 인라인 L104-122 (new TriggerClickHandler(){ @Override …)
[E2] lawSearch.KeyPress [Enter] (L125) → retrieve()
[E3] statuteSearch.KeyPress [Enter] (L135) → retrieve()
[E4] retrieveButton[조회].Select (L146) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L197-220 | 생성자,E2,E3,E4 | 상태 처리 | 업무 |
| public contentView() | L222-230 | buildGrid | 조회창 Icr01_Lookup_Content 열기 | 업무 |
| public deadlineList() | L232-235 | buildGrid | 조회창 Sch03_Lookup_IcsUser 열기 | 업무 |
| public managerList() | L237-245 | 공개 메서드 | 조회창 Icr01_Lookup_Share 열기 | 업무 |
| public fileAddList() | L247-255 | buildGrid | 조회창 Icr01_Lookup_IcrFile 열기 | 업무 |
| private refresh() | L257-275 | managerList,fileAddList | 서비스 icr.Icr01_ClassTree.refresh(classTreeId, companyId) | 업무 |
| private settings() | L98-152 | 생성자 | 조회창 Icr01_Lookup_SelectParent 열기, 이벤트 연결, 초기값: classTreeId=null, classTreeId=null, classTreeId=resultModel.getClassTreeId(, detailSearchCheckBox=false("상세내용 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L154-195 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L277-279 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L281-283 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('classTreeCd', 60, '내규코드'),  // L182
  gb.textArea('classTreeNm', 250, '내규명'),  // L183
  // ⚠ 대응 없음 (GridBuilder L184) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L185) addCell
  gb.textArea('submitTo', 150, '제출처'),  // L186
  gb.textArea('relatedLaw', 200, '관련조문'),  // L187
  gb.text('cycleNm', 100, '주기'),  // L188
  // ⚠ 대응 없음 (GridBuilder L189) addCell
  gb.textCenter('fileCount', 60, '서식파일'),  // L190
  // ⚠ 대응 없음 (GridBuilder L191) addCell
  gb.textArea('parentTreeFullNm', 200, '분류'),  // L192
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

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

