# Ics01_Tab_ClassTree

- 종류: 화면
- 메뉴: 기초자료 > 00. 내부통제 > 법규관리(관리자) (#1012)
- 파일: `client/vi/ics/Ics01_Tab_ClassTree.java`
- 함께 쓰는 클래스 11개:
  - `Ics01_Move_TreeGrid` `client/vi/ics/Ics01_Move_TreeGrid.java`
  - `Ics01_Grid_IcsType` `client/vi/ics/Ics01_Grid_IcsType.java`
  - `Ics20_Lookup_RevisionHistory` `client/vi/ics/Ics20_Lookup_RevisionHistory.java`
  - `Ics20_Lookup_File` `client/vi/ics/Ics20_Lookup_File.java`
  - `Ics20_Lookup_Content` `client/vi/ics/Ics20_Lookup_Content.java`
  - `Ics01_Move_Grid` `client/vi/ics/Ics01_Move_Grid.java`
  - `Ics01_Lookup_RelateTdm` `client/vi/ics/Ics01_Lookup_RelateTdm.java`
  - `Ics01_Lookup_SelectTdm` `client/vi/ics/Ics01_Lookup_SelectTdm.java`
  - `Ics01_Lookup_IcsFile` `client/vi/ics/Ics01_Lookup_IcsFile.java`
  - `Ics01_Lookup_IcsFileAdmin` `client/vi/ics/Ics01_Lookup_IcsFileAdmin.java`
  - `Ics01_Edit_ClassTree` `client/vi/ics/Ics01_Edit_ClassTree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_Content`](../../ics/components/Ics01_Lookup_Content.md), [`Sch03_Lookup_Ics`](../../sch/components/Sch03_Lookup_Ics.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics01_ClassTree.delete` | Ics01_Edit_ClassTree:215, Ics01_Grid_IcsType:369 | [`Ics01_ClassTree.java:322`](../../ics/services/Ics01_ClassTree.md) | `UpdateDataModel(ics01_class_tree)` 동적 DELETE |
| `ics.Ics01_ClassTree.deleteAll` | Ics01_Edit_ClassTree:196 | [`Ics01_ClassTree.java:275`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.deleteByClassTreeId`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.getDownTreeId`](../../ics/sql/ics01_class_tree.md), [`ics01_class_tree.insertIcsDel`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.refresh` | Ics01_Grid_IcsType:373 | [`Ics01_ClassTree.java:264`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.refresh`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.selectByClassTreeId` | Ics01_Grid_IcsType:264 | [`Ics01_ClassTree.java:43`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByClassTreeId`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.selectByCompanyId` | Ics01_Move_Grid:93, Ics01_Move_TreeGrid:90, Ics01_Tab_ClassTree:294 | [`Ics01_ClassTree.java:28`](../../ics/services/Ics01_ClassTree.md) | [`ics01_class_tree.selectByCompanyId`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics01_ClassTree.update` | Ics01_Edit_ClassTree:162, Ics01_Grid_IcsType:297, Ics01_Move_Grid:127, Ics01_Move_TreeGrid:124 | [`Ics01_ClassTree.java:317`](../../ics/services/Ics01_ClassTree.md) | `UpdateDataModel(ics01_class_tree)` 동적 INSERT/UPDATE → [`ics01_class_tree.selectById`](../../ics/sql/ics01_class_tree.md) |
| `ics.Ics20_RevisionHistory.selectByClassTreeId` | Ics20_Lookup_RevisionHistory:137 | [`Ics20_RevisionHistory.java:48`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.selectByClassTreeId`](../../ics/sql/ics20_revision_history.md) |
| `ics.Ics20_RevisionHistory.updateContent` | Ics20_Lookup_Content:85 | [`Ics20_RevisionHistory.java:60`](../../ics/services/Ics20_RevisionHistory.md) | [`ics20_revision_history.updateContent`](../../ics/sql/ics20_revision_history.md) |
| `sch.Sch03_Deadline.selectDeadlineName` | Ics01_Edit_ClassTree:113 | [`Sch03_Deadline.java:43`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectDeadlineName`](../../sch/sql/sch03_deadline.md) |
| `sys.Sys10_File.getIcsFile` | Ics01_Lookup_IcsFileAdmin:157 | [`Sys10_File.java:81`](../../sys/services/Sys10_File.md) | [`sys10_file.getIcsFile`](../../sys/sql/sys10_file.md) |
| `sys.Sys10_File.selectByParentId` | Ics20_Lookup_File:105 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.delete` | Ics01_Lookup_IcsFile:179 | [`Sys11_RelateFile.java:199`](../../sys/services/Sys11_RelateFile.md) | `UpdateDataModel(sys11_relate_file)` 동적 DELETE |
| `sys.Sys11_RelateFile.insert` | Ics01_Lookup_IcsFile:213 | [`Sys11_RelateFile.java:143`](../../sys/services/Sys11_RelateFile.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys11_relate_file.insert`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.insertCheck`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys11_RelateFile.selectByParentId` | Ics01_Lookup_IcsFile:197 | [`Sys11_RelateFile.java:33`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.selectByParentId`](../../sys/sql/sys11_relate_file.md) |
| `tdm.Tdm43_Manl.selectByExceptIcsId` | Ics01_Lookup_SelectTdm:134 | [`Tdm43_Manl.java:63`](../../tdm/services/Tdm43_Manl.md) | [`tdm43_manl.selectByExceptIcsId`](../../tdm/sql/tdm43_manl.md) |
| `tdm.Tdm45_ManlRelateIcs.delete` | Ics01_Lookup_RelateTdm:214 | [`Tdm45_ManlRelateIcs.java:68`](../../tdm/services/Tdm45_ManlRelateIcs.md) | `UpdateDataModel(tdm45_manl_relate_ics)` 동적 DELETE |
| `tdm.Tdm45_ManlRelateIcs.insertList` | Ics01_Lookup_RelateTdm:192 | [`Tdm45_ManlRelateIcs.java:39`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm43_manl.selectById`](../../tdm/sql/tdm43_manl.md), [`tdm45_manl_relate_ics.insert`](../../tdm/sql/tdm45_manl_relate_ics.md) |
| `tdm.Tdm45_ManlRelateIcs.selectByIcsId` | Ics01_Lookup_RelateTdm:170 | [`Tdm45_ManlRelateIcs.java:34`](../../tdm/services/Tdm45_ManlRelateIcs.md) | [`tdm45_manl_relate_ics.selectByIcsId`](../../tdm/sql/tdm45_manl_relate_ics.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`ics19_revision_relate_ics`](../../../db/tables/ics.md), [`ics20_revision_history`](../../../db/tables/ics.md), [`ics99_class_tree_del`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm45_manl_relate_ics`](../../../db/tables/tdm.md), [`tdm46_manl_relate_icr`](../../../db/tables/tdm.md), [`tdm47_manl_relate_dcr`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_deadline_nm`, `f_get_exctdutymap_nm`, `f_get_ics_nm`, `f_get_tdmcheckcycle`, `f_ics_class_tree_nm_allpath`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics01_Tab_ClassTree (`client/vi/ics/Ics01_Tab_ClassTree.java`, 363줄)

- 레이아웃: west=vlc, center=gridDocType
- 툴바 `buttonBar01`: 법규분류: {icsSearch} {retrieveButton}
- 툴바 `buttonBar02`: {expandAll} {collapseAll} {insertRootButton} {insertChildButton}
- 입력·하위 화면: `publicTypeComboBox` ComboBoxField("IcsPublicType", "%", "전체"), `icsSearch` TextField, `editClassTree` Ics01_Edit_ClassTree, `popup_Classification` Ics01_Edit_ClassTree
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 250 "분류명" Text
  - classTreeCode 100 "분류코드" TextCenter
  - actionCell 50 "수정" Cell 편집:editInfoCell
  - actionCell 50 "이동" Cell 편집:moveCell

#### 이벤트
[E0] 화면 열림 (생성자 L57-161) → retrieve()
[E1] icsSearch.KeyPress [Enter] (L59) → search()
[E2] retrieveButton[찾기].Select (L70) → search()
[E3] expandAll[펼치기].Select (L76) → 인라인 L76-81 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L82) → 인라인 L82-87 (new SelectHandler(){ @Override public…)
[E5] insertRootButton[상위등록].Select (L88) → insertIcsClass()
[E6] insertChildButton[하위등록].Select (L94) → insertChildIcsClass()
[E7] treeGrid.SelectionChanged [선택>0] (L144) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L163-186 | 필드 초기화 | 상태 처리 | 업무 |
| private moveItem() | L188-191 | buildTreeGrid | 상태 처리 | 업무 |
| private addChildItem() | L193-204 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L207-226 | 공개 메서드 | 상태 처리 | 업무 |
| private insertChildIcsClass() | L238-246 | E6 | 미선택 시 alert "먼저 상위분류를 선택해주세요" | 업무 |
| private insertIcsClass() | L248-270 | E5,insertChildIcsClass | 팝업 Ics01_Edit_ClassTree 열기 | 업무 |
| private editItem() | L272-282 | buildTreeGrid | 팝업 Ics01_Edit_ClassTree 열기 | 업무 |
| public getPublicType() | L284-286 | 공개 메서드 | 상태 처리 | 업무 |
| private retrievePage() | L288-291 | E7 | 상태 처리 | 업무 |
| public retrieve() | L293-300 | 생성자,insertIcsClass,editItem | 서비스 ics.Ics01_ClassTree.selectByCompanyId | 업무 |
| private search() | L302-358 | E1,E2 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L360-362 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 250, '분류명'),  // L180
  gb.textCenter('classTreeCd', 100, '분류코드'),  // L181
  // ⚠ 대응 없음 (GridBuilder L182) addCell
  // ⚠ 대응 없음 (GridBuilder L183) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="expand" onClick={() => /* 인라인 L76-81 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L82-87 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="register" onClick={insertIcsClass}>상위등록</Button>
5. <Button type="register" onClick={insertChildIcsClass}>하위등록</Button>

### Ics01_Move_TreeGrid (`client/vi/ics/Ics01_Move_TreeGrid.java`, 173줄)


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
| public open() | L74-115 | 공개 메서드 | 서비스 ics.Ics01_ClassTree.selectByCompanyId(companyId, typeCode) | 업무 |
| private moveTree() | L117-141 | E1 | 서비스 ics.Ics01_ClassTree.update | 업무 |
| private addChild() | L143-152 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L155-168 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L170-172 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={moveTree}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Grid_IcsType (`client/vi/ics/Ics01_Grid_IcsType.java`, 414줄)

- 툴바 `buttonBar`: 검색: {searchText} {advisCheckBox} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="분류코드/법규명", `advisCheckBox` CheckBox, `publicType` ComboBoxField("IcsPublicType"), `lookup` Ics01_Lookup_RelateTdm, `lookupDeadline` Sch03_Lookup_Ics, `lookupFile` Ics01_Lookup_IcsFile, `lookupRevisionHistory` Ics20_Lookup_RevisionHistory
- 그리드 `grid` (buildGrid(), 체크박스):
  - actionCell 40 "이동" Cell 편집:moveCell
  - classTreeCode 70 "분류코드" TextCenter 편집:TextField
  - classTreeName 200 "법규명" TextArea 편집:TextArea
  - content 300 "상세내용" TextLimitArea
  - actionCell 30 " " Cell 편집:actionCell
  - submitTo 170 "제출처" TextArea 편집:TextArea
  - cycleName 100 "주기" Text
  - actionCell 30 "기한" Cell 편집:deadlineCell
  - fileCount 60 "서식파일" TextCenter
  - actionCell 30 " " Cell 편집:fileAddCell
  - relatedLaw 150 "관련조문" TextArea 편집:TextArea
  - revisionCount 60 "개정이력" TextCenter
  - actionCell 30 " " Cell 편집:revisionCell
  - tdmCount 60 "연결책무" TextCenter
  - actionCell 30 " " Cell 편집:tdmCell
  - advisYn 60 "일임<br>(자문)" Boolean

#### 이벤트
[E1] searchText.KeyPress [Enter] (L78) → retrieve()
[E2] retrieveButton[검색].Select [classTreeModel != null] (L90) → retrieve()
[E3] deleteButton[삭제].Select (L98) → deleteRow()
       └ [E7] msgBox.DialogHide [YES] (L349) → delete()
[E4] insertButton[등록].Select (L104) → insertRow()
[E5] updateButton[저장].Select (L110) → update()
[E6] publicType[IcsPublicType].Collapse (L169) → 인라인 L169-175 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L72-140 | 공개 메서드 | 상태 처리 | 업무 |
| private moveItem() | L229-237 | buildGrid | 상태 처리 | 업무 |
| public retrieve() | L239-270 | E1,E2,moveItem | 서비스 ics.Ics01_ClassTree.selectByClassTreeId(classTreeId, publicType, companyId, typeCode, searchText, advisYn) | 업무 |
| public update() | L272-298 | E5 | 서비스 ics.Ics01_ClassTree.update | 업무 |
| public contentEdit() | L300-310 | buildGrid | 조회창 Ics01_Lookup_Content 열기 | 업무 |
| public deadlineList() | L312-322 | buildGrid | 조회창 Sch03_Lookup_Ics 열기 | 업무 |
| public fileAddList() | L324-332 | buildGrid | 조회창 Ics01_Lookup_IcsFile 열기 | 업무 |
| public insertRow() | L334-344 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L346-364 | E3 | ConfirmBox → E7 | 업무 |
| public delete() | L366-370 | E7 | GridDeleteData ics.Ics01_ClassTree.delete(체크된 행 목록) | 업무 |
| private refresh() | L372-390 | buildGrid,contentEdit,deadlineList,fileAddList | 서비스 ics.Ics01_ClassTree.refresh(classTreeId, companyId) | 업무 |
| private modified() | L392-401 | contentEdit,deadlineList | 상태 처리 | 업무 |
| private revisionList() | L403-406 | buildGrid | 조회창 Ics20_Lookup_RevisionHistory 열기 | 업무 |
| public buildGrid() | L142-227 | 필드 초기화 | 조회창 Ics01_Lookup_RelateTdm 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L408-410 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L411-413 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L209) addCell
  gb.textCenter('classTreeCd', 70, '분류코드', { editor: 'text' }),  // L210
  gb.textArea('classTreeNm', 200, '법규명', { editor: 'largeText' }),  // L211
  // ⚠ 대응 없음 (GridBuilder L212) addTextLimitArea
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  gb.textArea('submitTo', 170, '제출처', { editor: 'largeText' }),  // L214
  gb.text('cycleNm', 100, '주기'),  // L215
  // ⚠ 대응 없음 (GridBuilder L216) addCell
  gb.textCenter('fileCount', 60, '서식파일'),  // L217
  // ⚠ 대응 없음 (GridBuilder L218) addCell
  gb.textArea('relatedLaw', 150, '관련조문', { editor: 'largeText' }),  // L219
  gb.textCenter('revisionCount', 60, '개정이력'),  // L220
  // ⚠ 대응 없음 (GridBuilder L221) addCell
  gb.textCenter('tdmCount', 60, '연결책무'),  // L222
  // ⚠ 대응 없음 (GridBuilder L223) addCell
  gb.boolean('advisYn', 60, '일임<br>(자문)'),  // L224
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>검색</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Ics20_Lookup_RevisionHistory (`client/vi/ics/Ics20_Lookup_RevisionHistory.java`, 148줄)

- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookupContent` Ics20_Lookup_Content, `lookupFile` Ics20_Lookup_File
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 90 "등록일" Date
  - submissionDate 90 "의견제출일" Date
  - effectDate 90 "시행일" Date
  - title 450 "법규명" Text
  - actionCell 60 "상세내용" Cell 편집:ContentCell
  - financeAgencyName 100 "소관부처" Text
  - reflectionDate 90 "법규반영일" Date
  - fileCount 60 "첨부파일" LongCenter
  - actionCell 30 " " Cell 편집:fileListCell

#### 이벤트
[E0] 화면 열림 (생성자 L40-42) → 초기화
[E1] anchor.MouseDown (L59) → retrieve()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-48 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L134-138 | E1,open | 서비스 ics.Ics20_RevisionHistory.selectByClassTreeId(classTreeId) | 업무 |
| private fileList() | L140-143 | buildGrid | 조회창 Ics20_Lookup_File 열기 | 업무 |
| private makeLayout() | L50-87 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L90-132 | 필드 초기화 | 조회창 Ics20_Lookup_Content 열기, 미선택 시 alert "첨부파일이 없습니다.", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L145-147 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 90, '등록일'),  // L121
  gb.date('submissionDate', 90, '의견제출일'),  // L122
  gb.date('effectDate', 90, '시행일'),  // L123
  gb.text('title', 450, '법규명'),  // L124
  // ⚠ 대응 없음 (GridBuilder L125) addCell
  gb.text('financeAgencyNm', 100, '소관부처'),  // L126
  gb.date('reflectionDate', 90, '법규반영일'),  // L127
  gb.longCenter('fileCount', 60, '첨부파일'),  // L128
  // ⚠ 대응 없음 (GridBuilder L129) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics20_Lookup_File (`client/vi/ics/Ics20_Lookup_File.java`, 117줄)

- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 440 "첨부파일명" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E1] closeButton[닫기].Select (L46) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-65 | 공개 메서드 | 상태 처리 | 업무 |
| private buildApprFileGrid() | L67-97 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private retrieve() | L99-111 | open | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private setHtmlHeaderStyle() | L113-115 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 440, '첨부파일명'),  // L92
  // ⚠ 대응 없음 (GridBuilder L93) addCell
  // ⚠ 대응 없음 (GridBuilder L94) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics20_Lookup_Content (`client/vi/ics/Ics20_Lookup_Content.java`, 102줄)

- 입력·하위 화면: `note` MyTextArea

#### 이벤트
[E1] updateButton[저장].Select (L60) → update()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L39-80 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L82-96 | E1 | 서비스 ics.Ics20_RevisionHistory.updateContent | 업무 |
| private setHtmlHeaderStyle() | L98-100 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Move_Grid (`client/vi/ics/Ics01_Move_Grid.java`, 167줄)


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
| public open() | L77-118 | 공개 메서드 | 서비스 ics.Ics01_ClassTree.selectByCompanyId(companyId, typeCode) | 업무 |
| private moveTree() | L120-135 | E1 | 서비스 ics.Ics01_ClassTree.update | 업무 |
| private addChild() | L137-146 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L149-162 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L164-166 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={moveTree}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Lookup_RelateTdm (`client/vi/ics/Ics01_Lookup_RelateTdm.java`, 230줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="직책/책무/책무세부/주요관리의무/점검항목", `lookup` Ics01_Lookup_SelectTdm
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - roleName 120 "직책" Text
  - taskDutyName 350 "주요관리의무" TextArea
  - taskCheckItem 450 "점검항목" TextArea
  - taskCheckHow 450 "점검방법" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L70-96) → settings(), show()
[E1] searchText.KeyPress [Enter] (L101) → retrieve()
[E2] retrieveButton[조회].Select (L109) → retrieve()
[E3] insertButton[점검항목연결].Select (L115) → lookupSelectTdm()
[E4] deleteButton[연결제거].Select (L121) → delete()
[E5] messageBox.DialogHide (L130) → delete()
[E6] closeButton[닫기].Select (L142) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-68 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L163-176 | E1,E2,open,lookupSelectTdm | 서비스 tdm.Tdm45_ManlRelateIcs.selectByIcsId(companyId, icsId, searchText) | 업무 |
| private lookupSelectTdm() | L178-209 | E3 | 조회창 Ics01_Lookup_SelectTdm 열기, 서비스 tdm.Tdm45_ManlRelateIcs.insertList(icsList, manlItemList) | 업무 |
| private delete() | L211-222 | E4,E5 | GridDeleteData tdm.Tdm45_ManlRelateIcs.delete(체크된 행 목록) | 업무 |
| private settings() | L98-148 | 생성자 | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L150-161 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L224-226 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L227-229 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 120, '직책'),  // L153 SQL 계산 컬럼(selectByIcsId: tdm43_role_nm)
  gb.textArea('taskDutyNm', 350, '주요관리의무'),  // L156 SQL 계산 컬럼(selectByIcsId: tdm43_task_relate_duty_nm)
  gb.textArea('taskCheckItem', 450, '점검항목'),  // L157 SQL 계산 컬럼(selectByIcsId: CONCAT('('||tdm43_manl_cd||') ', tdm43_…)
  gb.textArea('taskCheckHow', 450, '점검방법'),  // L158 SQL 계산 컬럼(selectByIcsId: tdm43_check_how)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={lookupSelectTdm}>점검항목연결</Button>
3. <Button type="delete" onClick={delete}>연결제거</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Lookup_SelectTdm (`client/vi/ics/Ics01_Lookup_SelectTdm.java`, 162줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="직책/책무/책무세부/주요관리의무/점검항목"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - roleName 120 "직책" Text
  - taskRelateDutyName 350 "주요관리의무" TextArea
  - checkItemAddCode 450 "점검항목" TextArea
  - checkHow 450 "점검방법" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L55-81) → settings(), show()
[E1] searchText.KeyPress [Enter] (L86) → retrieve()
[E2] retrieveButton[조회].Select (L94) → retrieve()
[E3] selectButton[확인].Select (L100) → select()
[E4] closeButton[닫기].Select (L106) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-53 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L127-140 | E1,E2,open | 서비스 tdm.Tdm43_Manl.selectByExceptIcsId(companyId, icsId, searchText) | 업무 |
| private select() | L142-154 | E3 | 미선택 시 alert "선택된 점검항목이 없습니다." | 업무 |
| private settings() | L83-112 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L114-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L156-158 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L159-161 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('roleNm', 120, '직책'),  // L117
  gb.textArea('taskRelateDutyNm', 350, '주요관리의무'),  // L120
  // ⚠DB없음 L121 checkItemAddCode 450 "점검항목" (tdm45_check_item_add_code 컬럼 없음)
  gb.textArea('checkHow', 450, '점검방법'),  // L122
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Lookup_IcsFile (`client/vi/ics/Ics01_Lookup_IcsFile.java`, 268줄)

- 입력·하위 화면: `listLookup` Ics01_Lookup_IcsFileAdmin
- 그리드 `grid` (buildApprFileGrid(), 체크박스):
  - fileName 580 "서식파일" Text
  - regDate 100 "등록일" Date
  - actionCell 80 "다운로드" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] okButton[닫기].Select (L94) → confirm()
[E2] listButton[불러오기].Select (L100) → listLookup()
[E3] fileUpload.Change (L115) → 인라인 L115-122 (new ChangeHandler() { @Override publi…)
[E4] fileUploadForm.SubmitComplete (L125) → resetFileUpload(), retrieve()
[E5] fileDeleteForm.SubmitComplete (L146) → retrieve()
[E6] fileUpload.Change (L243) → 인라인 L243-250 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L60-65 | 공개 메서드 | 상태 처리 | 업무 |
| public openPeriod() | L68-78 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L80-86 | openUser | 상태 처리 | 업무 |
| public setting() | L88-158 | openPeriod,open | 상태 처리 | 업무 |
| private buildApprFileGrid() | L160-190 | 필드 초기화 | GridDeleteData sys.Sys11_RelateFile.delete(체크된 행 목록) | 업무 |
| private retrieve() | L192-203 | E4,E5,setting,listLookup | 서비스 sys.Sys11_RelateFile.selectByParentId(parentId) | 업무 |
| private listLookup() | L205-227 | E2 | 조회창 Ics01_Lookup_IcsFileAdmin 열기, 서비스 sys.Sys11_RelateFile.insert(relateId, tableName) | 업무 |
| private confirm() | L229-234 | E1 | 상태 처리 | 업무 |
| private resetFileUpload() | L236-251 | E4 | 상태 처리 | 업무 |
| public getServiceResult() | L254-262 | listLookup | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L264-266 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 580, '서식파일'),  // L184 SQL 계산 컬럼(selectByParentId: sys10_file_nm)
  gb.date('regDate', 100, '등록일'),  // L185 SQL 계산 컬럼(selectByParentId: sys10_reg_date)
  // ⚠ 대응 없음 (GridBuilder L186) addCell
  // ⚠ 대응 없음 (GridBuilder L187) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={listLookup}>불러오기</Button>
2. <Button type="unknown" onClick={confirm}>닫기</Button>

### Ics01_Lookup_IcsFileAdmin (`client/vi/ics/Ics01_Lookup_IcsFileAdmin.java`, 196줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="법령구분/내용/서식파일"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "등록일" Date
  - lawName 150 "법령구분" Text
  - note 150 "내용" Text
  - fileName 350 "서식파일" Text
  - actionCell 80 "다운로드" Cell 편집:downloadCell

#### 이벤트
[E0] 화면 열림 (생성자 L58-87) → Settings(), show(), retrieve()
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L103) → retrieve()
[E3] confirmButton[확인].Select (L109) → confirm()
       └ [E5] msgBox.DialogHide [YES] (L170) → hide()
[E4] closeButton[닫기].Select (L115) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-56 | 공개 메서드 | 상태 처리 | 업무 |
| public Settings() | L89-121 | 생성자 | 상태 처리 | 업무 |
| private retrieve() | L148-163 | 생성자,E1,E2 | 서비스 sys.Sys10_File.getIcsFile(parentId, lawType, searchText, firstRegDateYn) | 업무 |
| private confirm() | L165-187 | E3 | ConfirmBox → E5 | 업무 |
| private buildGrid() | L123-146 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L189-191 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L193-195 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L139
  gb.text('lawNm', 150, '법령구분'),  // L140 SQL 계산 컬럼(getIcsFile: f_cdnm('LawType', sys10_law_type, 0, f_…)
  gb.text('note', 150, '내용'),  // L141
  gb.text('fileNm', 350, '서식파일'),  // L142
  // ⚠ 대응 없음 (GridBuilder L143) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics01_Edit_ClassTree (`client/vi/ics/Ics01_Edit_ClassTree.java`, 231줄)

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
| public update() | L156-169 | E3 | 서비스 ics.Ics01_ClassTree.update | 업무 |
| private deleteCheck() | L171-190 | E2 | ConfirmBox → E5 | 업무 |
| private deleteAll() | L193-208 | E5 | 서비스 ics.Ics01_ClassTree.deleteAll | 업무 |
| public delete() | L210-222 | 공개 메서드 | 서비스 ics.Ics01_ClassTree.delete | 업무 |
| private setHtmlStyle() | L224-226 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L228-230 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteCheck}>삭제</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>
4. <Button type="register" onClick={() => /* 서비스 sch.Sch03_Deadline.selectDeadlineName(infoId) */}>설정</Button>

