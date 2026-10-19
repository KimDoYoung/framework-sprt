# Dcr01_Tab_ClassTree

- 종류: 화면
- 메뉴: 관리자 > 03. 문서관리 > 문서분류 (#1001)
- 메뉴: 기초자료 > 20. 문서(전자결재) > 문서분류 (#1110)
- 파일: `client/vi/dcr/Dcr01_Tab_ClassTree.java`
- 함께 쓰는 클래스 12개:
  - `Dcr01_Move_TreeGrid` `client/vi/dcr/Dcr01_Move_TreeGrid.java`
  - `Dcr01_Lookup_UseYn` `client/vi/dcr/Dcr01_Lookup_UseYn.java`
  - `Dcr01_Lookup_DcrCopyAdmin` `client/vi/dcr/Dcr01_Lookup_DcrCopyAdmin.java`
  - `Dcr01_Grid_DocType` `client/vi/dcr/Dcr01_Grid_DocType.java`
  - `Dcr21_Lookup_Icr` `client/vi/dcr/Dcr21_Lookup_Icr.java`
  - `Dcr20_Lookup_Ics` `client/vi/dcr/Dcr20_Lookup_Ics.java`
  - `Dcr07_Lookup_ClassDetail` `client/vi/dcr/Dcr07_Lookup_ClassDetail.java`
  - `Dcr06_Lookup_Form` `client/vi/dcr/Dcr06_Lookup_Form.java`
  - `Dcr05_Lookup_DocType` `client/vi/dcr/Dcr05_Lookup_DocType.java`
  - `Dcr05_Edit_Update` `client/vi/dcr/Dcr05_Edit_Update.java`
  - `Dcr01_Move_Grid` `client/vi/dcr/Dcr01_Move_Grid.java`
  - `Dcr01_Edit_ClassTree` `client/vi/dcr/Dcr01_Edit_ClassTree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr10_Lookup_DocStamp`](../../apr/components/Apr10_Lookup_DocStamp.md), [`Apr10_Lookup_Stamp`](../../apr/components/Apr10_Lookup_Stamp.md), [`Apr30_Lookup_ApprStepGroup`](../../apr/components/Apr30_Lookup_ApprStepGroup.md), [`Icr01_Lookup_SelectMulti`](../../icr/components/Icr01_Lookup_SelectMulti.md), [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_ApprTemp.insert` | Dcr05_Edit_Update:241 | [`Apr01_ApprTemp.java:38`](../../apr/services/Apr01_ApprTemp.md) | [`apr01_appr_temp.insert`](../../apr/sql/apr01_appr_temp.md), [`apr03_relate_fund.conflict`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md) |
| `dcr.Dcr01_ClassTree.deleteAll` | Dcr01_Edit_ClassTree:273, Dcr01_Grid_DocType:581 | [`Dcr01_ClassTree.java:452`](../../dcr/services/Dcr01_ClassTree.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectByClassTreeId`](../../apr/sql/apr01_appr.md), [`dcr01_class_tree.deleteByClassTreeId`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getDownTreeId`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.insertDcrDel`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.deleteCheck` | Dcr01_Edit_ClassTree:222, Dcr01_Grid_DocType:489 | [`Dcr01_ClassTree.java:415`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.apprCheck`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.linkCheck`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.insertAdminCopy` | Dcr01_Lookup_DcrCopyAdmin:180 | [`Dcr01_ClassTree.java:349`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.insertAdminDcrClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectAdminDcrClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectByInsertBakDcrId`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.updateAdminDcrClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr20_relate_ics.deleteByInsertBakDcrId`](../../dcr/sql/dcr20_relate_ics.md), [`dcr20_relate_ics.insertByInsertBakDcrId`](../../dcr/sql/dcr20_relate_ics.md) |
| `dcr.Dcr01_ClassTree.selectByAll` | Dcr01_Lookup_UseYn:181 | [`Dcr01_ClassTree.java:73`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByAll`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.selectByClassTreeId` | Dcr01_Grid_DocType:338 | [`Dcr01_ClassTree.java:202`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.selectByCompanyId` | Dcr01_Lookup_DcrCopyAdmin:240, Dcr01_Move_Grid:93, Dcr01_Move_TreeGrid:90, Dcr01_Tab_ClassTree:339 | [`Dcr01_ClassTree.java:50`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByParentId1Bang`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.update` | Dcr01_Edit_ClassTree:191, Dcr01_Grid_DocType:412, Dcr01_Lookup_UseYn:207, Dcr01_Move_Grid:127, Dcr01_Move_TreeGrid:124 | [`Dcr01_ClassTree.java:410`](../../dcr/services/Dcr01_ClassTree.md) | `UpdateDataModel(dcr01_class_tree)` 동적 INSERT/UPDATE → [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr01_ClassTree.updateCheck` | Dcr01_Edit_ClassTree:157, Dcr01_Grid_DocType:456 | [`Dcr01_ClassTree.java:288`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectByClassTreeCode`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr05_DocType.selectByName` | Dcr05_Lookup_DocType:162 | [`Dcr05_DocType.java:31`](../../dcr/services/Dcr05_DocType.md) | [`dcr05_doc_type.selectByName`](../../dcr/sql/dcr05_doc_type.md) |
| `dcr.Dcr05_DocType.updateEdit` | Dcr05_Edit_Update:198 | [`Dcr05_DocType.java:128`](../../dcr/services/Dcr05_DocType.md) | `UpdateDataModel(dcr05_doc_type)` 동적 INSERT/UPDATE → [`dcr05_doc_type.selectById`](../../dcr/sql/dcr05_doc_type.md) |
| `dcr.Dcr06_RelateDocType.delete` | Dcr06_Lookup_Form:220 | [`Dcr06_RelateDocType.java:47`](../../dcr/services/Dcr06_RelateDocType.md) | `UpdateDataModel(dcr06_relate_doc_Type)` 동적 DELETE |
| `dcr.Dcr06_RelateDocType.selectByClassTreeId` | Dcr06_Lookup_Form:179 | [`Dcr06_RelateDocType.java:32`](../../dcr/services/Dcr06_RelateDocType.md) | [`dcr06_relate_doc_Type.selectByClassTreeId`](../../dcr/sql/dcr06_relate_doc_Type.md) |
| `dcr.Dcr06_RelateDocType.update` | Dcr06_Lookup_Form:217 | [`Dcr06_RelateDocType.java:42`](../../dcr/services/Dcr06_RelateDocType.md) | `UpdateDataModel(dcr06_relate_doc_Type)` 동적 INSERT/UPDATE → [`dcr06_relate_doc_Type.selectById`](../../dcr/sql/dcr06_relate_doc_Type.md) |
| `dcr.Dcr07_ClassDetail.delete` | Dcr07_Lookup_ClassDetail:181 | [`Dcr07_ClassDetail.java:39`](../../dcr/services/Dcr07_ClassDetail.md) | `UpdateDataModel(dcr07_class_detail)` 동적 DELETE |
| `dcr.Dcr07_ClassDetail.selectByClassTreeId` | Dcr07_Lookup_ClassDetail:131 | [`Dcr07_ClassDetail.java:24`](../../dcr/services/Dcr07_ClassDetail.md) | [`dcr07_class_detail.selectByClassTreeId`](../../dcr/sql/dcr07_class_detail.md) |
| `dcr.Dcr07_ClassDetail.update` | Dcr07_Lookup_ClassDetail:157 | [`Dcr07_ClassDetail.java:34`](../../dcr/services/Dcr07_ClassDetail.md) | `UpdateDataModel(dcr07_class_detail)` 동적 INSERT/UPDATE → [`dcr07_class_detail.selectById`](../../dcr/sql/dcr07_class_detail.md) |
| `dcr.Dcr20_RelateIcs.delete` | Dcr20_Lookup_Ics:205 | [`Dcr20_RelateIcs.java:64`](../../dcr/services/Dcr20_RelateIcs.md) | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr20_relate_ics.deleteAll`](../../dcr/sql/dcr20_relate_ics.md), `UpdateDataModel(dcr20_relate_ics)` 동적 DELETE |
| `dcr.Dcr20_RelateIcs.selectByDcrClassTreeId` | Dcr20_Lookup_Ics:197 | [`Dcr20_RelateIcs.java:26`](../../dcr/services/Dcr20_RelateIcs.md) | [`dcr20_relate_ics.selectByDcrClassTreeId`](../../dcr/sql/dcr20_relate_ics.md) |
| `dcr.Dcr20_RelateIcs.update` | Dcr20_Lookup_Ics:202 | [`Dcr20_RelateIcs.java:38`](../../dcr/services/Dcr20_RelateIcs.md) | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr20_relate_ics.insertAll`](../../dcr/sql/dcr20_relate_ics.md), `UpdateDataModel(dcr20_relate_ics)` 동적 INSERT/UPDATE → [`dcr20_relate_ics.selectById`](../../dcr/sql/dcr20_relate_ics.md) |
| `dcr.Dcr21_RelateIcr.delete` | Dcr21_Lookup_Icr:199 | [`Dcr21_RelateIcr.java:64`](../../dcr/services/Dcr21_RelateIcr.md) | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr21_relate_icr.deleteAll`](../../dcr/sql/dcr21_relate_icr.md), `UpdateDataModel(dcr21_relate_icr)` 동적 DELETE |
| `dcr.Dcr21_RelateIcr.selectByDcrClassTreeId` | Dcr21_Lookup_Icr:191 | [`Dcr21_RelateIcr.java:26`](../../dcr/services/Dcr21_RelateIcr.md) | [`dcr21_relate_icr.selectByDcrClassTreeId`](../../dcr/sql/dcr21_relate_icr.md) |
| `dcr.Dcr21_RelateIcr.update` | Dcr21_Lookup_Icr:196 | [`Dcr21_RelateIcr.java:38`](../../dcr/services/Dcr21_RelateIcr.md) | [`dcr01_class_tree.getAdminYn`](../../dcr/sql/dcr01_class_tree.md), [`dcr01_class_tree.getClassTree`](../../dcr/sql/dcr01_class_tree.md), [`dcr21_relate_icr.insertAll`](../../dcr/sql/dcr21_relate_icr.md), `UpdateDataModel(dcr21_relate_icr)` 동적 INSERT/UPDATE → [`dcr21_relate_icr.selectById`](../../dcr/sql/dcr21_relate_icr.md) |
| `sys.Sys01_Company.selectByUseYn` | Dcr01_Lookup_DcrCopyAdmin:272 | [`Sys01_Company.java:103`](../../sys/services/Sys01_Company.md) | [`sys01_company.selectByUseYn`](../../sys/sql/sys01_company.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr01_appr_temp`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), `dcr06_relate_doc_Type` ⚠DB없음, [`dcr06_relate_doc_type`](../../../db/tables/dcr.md), [`dcr07_class_detail`](../../../db/tables/dcr.md), [`dcr20_relate_ics`](../../../db/tables/dcr.md), [`dcr21_relate_icr`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`dcr99_class_tree_del`](../../../db/tables/dcr.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_icr_class_tree_nm_allpath`, `f_ics_class_tree_nm_allpath`, `f_sysdate`, `f_to_number`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Dcr01_Tab_ClassTree (`client/vi/dcr/Dcr01_Tab_ClassTree.java`, 389줄)

- 레이아웃: west=vlc, center=gridDocType
- 툴바 `buttonBar01`: 검색: {searchText} {retrieveButton} {adminUpdateButton} {useYnCheckButton}
- 툴바 `buttonBar02`: {expandAll} {collapseAll} {insertRootButton} {insertChildButton}
- 입력·하위 화면: `searchText` TextField 빈칸="분류명", `lookup` Dcr01_Lookup_UseYn, `editClassTree` Dcr01_Edit_ClassTree, `popup_Classification` Dcr01_Edit_ClassTree, `lookupAdmin` Dcr01_Lookup_DcrCopyAdmin
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 270 "분류명" Text
  - classTreeCode 80 "분류코드" Text
  - actionCell 50 "수정" Cell 편집:editOrgInfoCell
  - actionCell 50 "이동" Cell 편집:moveCell

#### 이벤트
[E0] 화면 열림 (생성자 L72-197) → retrieve()
[E1] searchText.KeyPress [Enter] (L82) → search()
[E2] retrieveButton[조회].Select (L91) → search()
[E3] expandAll[펼치기].Select (L98) → 인라인 L98-103 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L105) → 인라인 L105-110 (new SelectHandler(){ @Override public…)
[E5] insertRootButton[업무등록].Select (L112) → insertDcrClass()
[E6] insertChildButton[하위등록].Select (L119) → insertChildDcrClass()
[E7] useYnCheckButton[사용여부설정].Select (L126) → useYnCheck()
[E8] adminUpdateButton[문서분류복사].Select (L132) → adminLookup()
[E9] treeGrid.SelectionChanged [선택>0] (L180) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L199-223 | 필드 초기화 | 상태 처리 | 업무 |
| private moveItem() | L225-228 | buildTreeGrid | 상태 처리 | 업무 |
| private addChildItem() | L230-241 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L244-263 | 공개 메서드 | 상태 처리 | 업무 |
| private insertChildDcrClass() | L265-273 | E6 | 미선택 시 alert "먼저 상위분류를 선택해주세요" | 업무 |
| private useYnCheck() | L275-283 | E7 | 조회창 Dcr01_Lookup_UseYn 열기 | 업무 |
| private insertDcrClass() | L285-313 | E5,insertChildDcrClass | 팝업 Dcr01_Edit_ClassTree 열기 | 업무 |
| private editItem() | L315-325 | buildTreeGrid | 팝업 Dcr01_Edit_ClassTree 열기 | 업무 |
| private adminLookup() | L327-330 | E8 | 조회창 Dcr01_Lookup_DcrCopyAdmin 열기 | 업무 |
| private retrievePage() | L332-335 | E9 | 상태 처리 | 업무 |
| public retrieve() | L337-346 | 생성자,useYnCheck,insertDcrClass,editItem | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private search() | L348-384 | E1,E2 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L386-388 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 270, '분류명'),  // L215
  gb.text('classTreeCd', 80, '분류코드'),  // L216
  // ⚠ 대응 없음 (GridBuilder L217) addCell
  // ⚠ 대응 없음 (GridBuilder L218) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>조회</Button>
2. <Button type="expand" onClick={() => /* 인라인 L98-103 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L105-110 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="register" onClick={insertDcrClass}>업무등록</Button>
5. <Button type="register" onClick={insertChildDcrClass}>하위등록</Button>
6. <Button type="view" onClick={useYnCheck}>사용여부설정</Button>
7. <Button type="change" onClick={adminLookup}>문서분류복사</Button>

### Dcr01_Move_TreeGrid (`client/vi/dcr/Dcr01_Move_TreeGrid.java`, 173줄)


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
| public open() | L74-115 | 공개 메서드 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode) | 업무 |
| private moveTree() | L117-141 | E1 | 서비스 dcr.Dcr01_ClassTree.update | 업무 |
| private addChild() | L143-152 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L155-168 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L170-172 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={moveTree}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr01_Lookup_UseYn (`client/vi/dcr/Dcr01_Lookup_UseYn.java`, 261줄)

- 툴바 `buttonBar`: 검색: {dcrSearch} {retrieveButton}
- 입력·하위 화면: `dcrSearch` TextField
- 그리드 `treeGrid` (buildTreeGrid(), 트리):
  - classTreeName 345 "문서분류" Text
  - apprCount 75 "등록문서건수" Long
  - useYn 80 "사용여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L62-100) → show()
[E1] treeGrid.CellMouseDown [event.getRowIndex() >= 0] (L84) → getColumn()
[E2] dcrSearch.KeyPress [Enter] (L104) → search()
[E3] retrieveButton[조회].Select (L112) → search()
[E4] updateButton[저장].Select (L118) → update()
[E5] cancleButton[닫기].Select (L124) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-60 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L102-131 | open | 상태 처리 | 업무 |
| private getColumn() | L133-158 | E1 | 상태 처리 | 업무 |
| public buildTreeGrid() | L160-166 | 필드 초기화 | 상태 처리 | 업무 |
| private addChildItem() | L168-177 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L179-186 | open,update | 서비스 dcr.Dcr01_ClassTree.selectByAll | 업무 |
| public getServiceResult() | L189-203 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L205-214 | E4 | 서비스 dcr.Dcr01_ClassTree.update | 업무 |
| private search() | L216-252 | E2,E3 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L254-256 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L258-260 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 345, '문서분류'),  // L162
  gb.long('apprCount', 75, '등록문서건수'),  // L163
  gb.boolean('useYn', 80, '사용여부'),  // L164
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr01_Lookup_DcrCopyAdmin (`client/vi/dcr/Dcr01_Lookup_DcrCopyAdmin.java`, 313줄)

- 레이아웃: west=vlcL, center=vlcR
- 툴바 `buttonBarL`: 문서분류: {searchText} {searchButton}
- 툴바 `buttonBarR`: {updateButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyName 200 "운용사" Text
  - locationName 100 " " Text

#### 이벤트
[E0] 화면 열림 (생성자 L61-67) → 초기화
[E1] searchText.KeyPress [Enter] (L122) → search()
[E2] searchButton[찾기].Select (L131) → search()
[E3] updateButton[문서분류복사].Select (L137) → update()
[E4] closeButton[닫기].Select (L143) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-114 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L116-149 | open | 상태 처리 | 업무 |
| private update() | L160-196 | E3 | 미선택 시 alert "문서분류를 선택해주세요", 서비스 dcr.Dcr01_ClassTree.insertAdminCopy(dcrClassTreeId) | 업무 |
| package getMenuTree() | L198-235 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L237-268 | open | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId | 업무 |
| private retrieveCompany() | L270-273 | open | 서비스 sys.Sys01_Company.selectByUseYn | 업무 |
| private addChild() | L275-283 | retrieve | 상태 처리 | 업무 |
| private search() | L285-303 | E1,E2 | 상태 처리 | 업무 |
| private buildGrid() | L151-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L305-307 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L309-311 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 200, '운용사'),  // L155
  gb.text('locNm', 100, ' '),  // L156
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="search" onClick={search}>찾기</Button>
3. <Button type="change" onClick={update}>문서분류복사</Button>

### Dcr01_Grid_DocType (`client/vi/dcr/Dcr01_Grid_DocType.java`, 612줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="구분코드/문서구분명", `docItemComboBox` ComboBoxField("DocItemTypeCode"), `approvalComboBox` ComboBoxField("ApprovalTypeCode"), `sealName` LookupTriggerField, `lookupDetail` Dcr07_Lookup_ClassDetail, `lookupGroup` LookupTriggerField, `lookup` Apr30_Lookup_ApprStepGroup, `lookupStamp` Apr10_Lookup_DocStamp, `lookupForm` Dcr06_Lookup_Form, `lookupIcsList` Dcr20_Lookup_Ics, `lookupIcrList` Dcr21_Lookup_Icr
- 그리드 `grid` (buildGrid(), 체크박스):
  - actionCell 50 "이동" Cell 편집:moveCell
  - adminYn 40 "" BooleanIcon
  - classTreeCode 80 "구분코드" Text 편집:TextField
  - classTreeName 250 "문서구분명" TextArea 편집:TextArea
  - note 300 "업무개요" TextArea 편집:TextArea
  - seq 80 "정렬순서" Text 편집:TextField
  - formCountStr 50 "양식지정" Text
  - actionCell 30 "" Cell 편집:formCell
  - icsCountStr 50 "법규연결" Text
  - actionCell 30 "" Cell 편집:icsCell
  - icrCountStr 50 "내규연결" Text
  - actionCell 30 "" Cell 편집:icrCell
  - actionCell 80 "세부분류" Cell 편집:detailCell
  - approvalTypeName 100 "결재구분" Text 편집:approvalComboBox
  - apprStepGroupName 120 "추가결재" Text 편집:lookupGroup
  - sealName 200 "인감종류" Text 편집:sealName
  - compYn 70 "준법감시" Boolean
  - mngmYn 70 "경영지원" Boolean
  - printFundYn 70 "펀드출력" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L95-161) → 초기화
[E1] searchText.KeyPress [Enter] (L100) → retrieve()
[E2] retrieveButton[조회].Select (L108) → retrieve()
[E3] deleteButton[삭제].Select (L114) → adminCheck()
[E4] insertButton[등록].Select (L120) → insertRow()
[E5] updateButton[저장].Select (L126) → updateCheck()
[E6] docItemComboBox[DocItemTypeCode].Collapse (L165) → 인라인 L165-171 (new CollapseHandler(){ @Override publ…)
[E7] approvalComboBox[ApprovalTypeCode].Collapse (L173) → 인라인 L173-179 (new CollapseHandler(){ @Override publ…)
[E8] sealName.TriggerClick (L181) → findStamp()
[E9] sealName.KeyDown (L187) → 인라인 L187-192 (new KeyDownHandler() { @Override publ…)
[E10] lookupGroup.TriggerClick [result == null] (L249) → 인라인 L249-270 (new TriggerClickHandler(){ @Override …)
[E11] msgBox.DialogHide [YES] (L499) → deleteAll()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private moveItem() | L305-313 | buildGrid | 상태 처리 | 업무 |
| public retrieve() | L315-344 | E1,E2,moveItem,deleteAll | 서비스 dcr.Dcr01_ClassTree.selectByClassTreeId(companyId, parentId, searchText) | 업무 |
| public findStamp() | L346-373 | E8 | 조회창 Apr10_Lookup_DocStamp 열기 | 업무 |
| public update() | L377-413 | updateCheck | 서비스 dcr.Dcr01_ClassTree.update | 업무 |
| private formList() | L415-418 | buildGrid | 조회창 Dcr06_Lookup_Form 열기 | 업무 |
| private icsList() | L420-423 | buildGrid | 조회창 Dcr20_Lookup_Ics 열기 | 업무 |
| private icsListUser() | L425-428 | buildGrid | 조회창 Dcr20_Lookup_Ics 열기 | 업무 |
| private icrList() | L430-433 | buildGrid | 조회창 Dcr21_Lookup_Icr 열기 | 업무 |
| private icrListUser() | L435-438 | buildGrid | 조회창 Dcr21_Lookup_Icr 열기 | 업무 |
| private updateCheck() | L440-470 | E5 | 서비스 dcr.Dcr01_ClassTree.updateCheck | 업무 |
| private adminCheck() | L472-484 | E3 | 상태 처리 | 업무 |
| private deleteCheck() | L486-560 | adminCheck | 확인창 표시, 서비스 dcr.Dcr01_ClassTree.deleteCheck | 업무 |
| public insertRow() | L562-576 | E4 | 상태 처리 | 업무 |
| public deleteAll() | L578-592 | E11 | 서비스 dcr.Dcr01_ClassTree.deleteAll | 업무 |
| public buildGrid() | L163-303 | 필드 초기화 | 조회창 Dcr07_Lookup_ClassDetail 열기, 조회창 Apr30_Lookup_ApprStepGroup 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L608-610 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L280) addCell
  // ⚠ 대응 없음 (GridBuilder L281) addBooleanIcon
  gb.text('classTreeCd', 80, '구분코드', { editor: 'text' }),  // L282
  gb.textArea('classTreeNm', 250, '문서구분명', { editor: 'largeText' }),  // L283
  gb.textArea('note', 300, '업무개요', { editor: 'largeText' }),  // L284
  gb.text('seq', 80, '정렬순서', { editor: 'text' }),  // L285
  gb.text('formCount', 50, '양식지정'),  // L286
  // ⚠ 대응 없음 (GridBuilder L287) addCell
  gb.text('icsCount', 50, '법규연결'),  // L288
  // ⚠ 대응 없음 (GridBuilder L289) addCell
  gb.text('icrCount', 50, '내규연결'),  // L290
  // ⚠ 대응 없음 (GridBuilder L291) addCell
  // ⚠ 대응 없음 (GridBuilder L292) addCell
  gb.text('approvalTypeNm', 100, '결재구분', { editor: 'select' }),  // L293
  gb.text('apprStepGroupNm', 120, '추가결재'),  // L294
  gb.text('sealNm', 200, '인감종류'),  // L295
  gb.boolean('compYn', 70, '준법감시'),  // L296
  gb.boolean('mngmYn', 70, '경영지원'),  // L298
  gb.boolean('printFundYn', 70, '펀드출력'),  // L299
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={adminCheck}>삭제</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={updateCheck}>저장</Button>

### Dcr21_Lookup_Icr (`client/vi/dcr/Dcr21_Lookup_Icr.java`, 210줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookup` Icr01_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeFullName 300 "내규명" TextArea
  - content 400 "상세내용" TextLimitArea
  - submitTo 150 "제출처" TextArea
  - cycleName 100 "주기" Text
  - relatedLaw 200 "관련조문" TextArea
  - classTreeCode 70 "분류코드" Text

#### 이벤트
[E0] 화면 열림 (생성자 L66-132) → show(), retrieve()
[E1] anchor.MouseDown (L76) → retrieve()
[E2] insertButton[행 추가].Select (L82) → insertRow()
[E3] deleteButton[행 삭제].Select (L88) → deleteRow()
[E4] updateButton[저장].Select (L95) → update()
[E5] cancleButton[닫기].Select (L101) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L56-59 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L61-64 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L148-176 | E2 | 조회창 Icr01_Lookup_SelectMulti 열기 | 업무 |
| public deleteRow() | L178-184 | E3 | 상태 처리 | 업무 |
| public retrieve() | L186-192 | 생성자,E1,openUser,open | 서비스 dcr.Dcr21_RelateIcr.selectByDcrClassTreeId(dcrClassTreeId) | 업무 |
| public update() | L194-205 | E4 | GridDeleteData dcr.Dcr21_RelateIcr.update, dcr.Dcr21_RelateIcr.delete | 업무 |
| public buildGrid() | L134-146 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L207-209 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('classTreeFullNm', 300, '내규명'),  // L138
  // ⚠ 대응 없음 (GridBuilder L139) addTextLimitArea
  gb.textArea('submitTo', 150, '제출처'),  // L140
  gb.text('cycleNm', 100, '주기'),  // L141
  gb.textArea('relatedLaw', 200, '관련조문'),  // L142
  gb.text('classTreeCd', 70, '분류코드'),  // L143
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr20_Lookup_Ics (`client/vi/dcr/Dcr20_Lookup_Ics.java`, 216줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `lookup` Ics01_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - classTreeFullName 300 "법규명" TextArea
  - content 400 "상세내용" TextLimitArea
  - submitTo 150 "제출처" TextArea
  - cycleName 100 "주기" Text
  - relatedLaw 200 "관련조문" TextArea
  - classTreeCode 70 "분류코드" Text

#### 이벤트
[E0] 화면 열림 (생성자 L69-135) → show(), retrieve()
[E1] anchor.MouseDown (L79) → retrieve()
[E2] insertButton[행 추가].Select (L85) → insertRow()
[E3] deleteButton[행 삭제].Select (L91) → deleteRow()
[E4] updateButton[저장].Select (L98) → update()
[E5] cancleButton[닫기].Select (L104) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openUser() | L56-62 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L64-67 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L154-182 | E2 | 조회창 Ics01_Lookup_SelectMulti 열기 | 업무 |
| public deleteRow() | L184-190 | E3 | 상태 처리 | 업무 |
| public retrieve() | L192-198 | 생성자,E1,openUser,open | 서비스 dcr.Dcr20_RelateIcs.selectByDcrClassTreeId(dcrClassTreeId) | 업무 |
| public update() | L200-211 | E4 | GridDeleteData dcr.Dcr20_RelateIcs.update, dcr.Dcr20_RelateIcs.delete | 업무 |
| public buildGrid() | L137-152 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L213-215 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('classTreeFullNm', 300, '법규명'),  // L141
  // ⚠ 대응 없음 (GridBuilder L142) addTextLimitArea
  gb.textArea('submitTo', 150, '제출처'),  // L143
  gb.text('cycleNm', 100, '주기'),  // L144
  gb.textArea('relatedLaw', 200, '관련조문'),  // L145
  gb.text('classTreeCd', 70, '분류코드'),  // L146
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr07_Lookup_ClassDetail (`client/vi/dcr/Dcr07_Lookup_ClassDetail.java`, 197줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid()):
  - classDetailName 350 "세부분류<br>(상신제목)" Text 편집:TextField
  - keyword 350 "키워드<br>(비고)" Text 편집:TextField
  - guid 270 "작성요령" TextArea 편집:TextArea
  - seq 80 "조회순서" LongCenter 편집:LongField
  - linkYn 80 "특정화면<br>연결여부" Boolean
  - useYn 80 "사용여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L60-113) → show()
[E1] retrieveButton[조회].Select (L66) → retrieve()
[E2] insertButton[등록].Select (L72) → insertRow()
[E3] deleteButton[삭제].Select (L78) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L174) → 서비스 dcr.Dcr07_ClassDetail.delete
[E4] updateButton[저장].Select (L84) → update()
[E5] cancleButton[닫기].Select (L90) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L128-132 | E1,open | 서비스 dcr.Dcr07_ClassDetail.selectByClassTreeId(classTreeId) | 업무 |
| public update() | L135-158 | E4 | 서비스 dcr.Dcr07_ClassDetail.update | 업무 |
| public insertRow() | L161-168 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L171-192 | E3 | ConfirmBox → E6 | 업무 |
| private buildGrid() | L115-125 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L194-196 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classDetailNm', 350, '세부분류<br>(상신제목)', { editor: 'text' }),  // L117
  gb.text('keyword', 350, '키워드<br>(비고)', { editor: 'text' }),  // L118
  gb.textArea('guide', 270, '작성요령', { editor: 'largeText' }),  // L119
  gb.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L120
  gb.boolean('linkYn', 80, '특정화면<br>연결여부'),  // L121
  gb.boolean('useYn', 80, '사용여부'),  // L122
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr06_Lookup_Form (`client/vi/dcr/Dcr06_Lookup_Form.java`, 232줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `popup` Dcr05_Lookup_DocType
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - title 450 "양식 제목" Text
  - defaultYn 60 "대표양식" Boolean
  - note 180 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L65-127) → show()
[E1] anchor.MouseDown (L74) → retrieve()
[E2] insertButton[행 추가].Select (L80) → insertRow()
[E3] deleteButton[행 삭제].Select (L86) → deleteRow()
[E4] updateButton[저장].Select (L92) → updateCheck()
[E5] cancleButton[닫기].Select (L98) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| private insertRow() | L139-164 | E2 | 조회창 Dcr05_Lookup_DocType 열기 | 업무 |
| private deleteRow() | L166-172 | E3 | 상태 처리 | 업무 |
| private retrieve() | L174-180 | E1,open | 서비스 dcr.Dcr06_RelateDocType.selectByClassTreeId(classTreeId) | 업무 |
| private updateCheck() | L182-213 | E4 | 상태 처리 | 업무 |
| private update() | L215-226 | updateCheck | GridDeleteData dcr.Dcr06_RelateDocType.update, dcr.Dcr06_RelateDocType.delete | 업무 |
| private buildGrid() | L129-137 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L228-230 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 450, '양식 제목'),  // L133
  gb.boolean('defaultYn', 60, '대표양식'),  // L134
  gb.text('note', 180, '비고', { editor: 'text' }),  // L135
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={updateCheck}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr05_Lookup_DocType (`client/vi/dcr/Dcr05_Lookup_DocType.java`, 183줄)

- 툴바 `buttonBar`: 구분: {docFormClassComboBox} 검색: {titleName} {retrieveButton}
- 입력·하위 화면: `docFormClassComboBox` ComboBoxField("DocFormClassCode", "%", "전체"), `titleName` TextField 빈칸="양식제목을 입력해주세요", `editor` Dcr05_Edit_Update
- 그리드 `grid` (buildGrid(), 체크박스):
  - docFormClassName 150 "구분" Text
  - title 450 "양식 제목" Text
  - actionCell 80 "수정" Cell 편집:editDocCell

#### 이벤트
[E1] docFormClassComboBox[DocFormClassCode].Collapse (L65) → retrieve()
[E2] titleName.KeyPress [Enter] (L74) → retrieve()
[E3] retrieveButton[조회].Select (L82) → retrieve()
[E4] oKButton[확인].Select (L88) → confirm()
[E5] cancelButton[취소].Select (L94) → hide()
[E6] grid.CellDoubleClick (L100) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L52-128 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L156-168 | E1,E2,E3,open | 서비스 dcr.Dcr05_DocType.selectByName(searchText, companyId, formClassCode) | 업무 |
| public confirm() | L170-174 | E4,E6,open | 상태 처리 | 업무 |
| private buildGrid() | L130-154 | 필드 초기화 | 팝업 Dcr05_Edit_Update 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L176-178 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L180-182 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('docFormClassNm', 150, '구분'),  // L149 SQL 계산 컬럼(selectByName: b.sys09_name)
  gb.text('title', 450, '양식 제목'),  // L150
  // ⚠ 대응 없음 (GridBuilder L151) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Dcr05_Edit_Update (`client/vi/dcr/Dcr05_Edit_Update.java`, 304줄)

- 입력·하위 화면: `title` TextField, `content` TextField, `note` MyTextArea, `docFormClassCode` TextField, `docFormClassName` ComboBoxField("DocFormClassCode")

#### 이벤트
[E0] 화면 열림 (생성자 L71-98) → settings(), getEditor(), show()
[E1] updateButton[수정].Select (L101) → updateEdit()
[E2] pdfButton[미리보기].Select (L107) → makePreviewPDF()
[E3] closeButton[닫기].Select (L113) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getEditor() | L122-157 | 생성자 | 상태 처리 | 업무 |
| public retrieveReadOnly() | L159-167 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveApproval() | L170-173 | retrieveReadOnly | 상태 처리 | 업무 |
| public retrieveApproval() | L175-178 | retrieveReadOnly | 상태 처리 | 업무 |
| public updateEdit() | L180-218 | E1 | 서비스 dcr.Dcr05_DocType.updateEdit(updateDcrModel) | 업무 |
| private makePreviewPDF() | L220-273 | E2 | 서비스 apr.Apr01_ApprTemp.insert(updateApprModel) | 업무 |
| public getServiceResult() | L276-277 | updateEdit,makePreviewPDF | 상태 처리 | 업무 |
| private masking() | L279-281 | makePreviewPDF | 상태 처리 | 업무 |
| private unmasking() | L282-284 | makePreviewPDF | 상태 처리 | 업무 |
| private settings() | L100-120 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L296-298 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L300-302 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={updateEdit}>수정</Button>
2. <Button type="unknown" onClick={makePreviewPDF}>미리보기</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr01_Move_Grid (`client/vi/dcr/Dcr01_Move_Grid.java`, 167줄)


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
| public open() | L77-118 | 공개 메서드 | 서비스 dcr.Dcr01_ClassTree.selectByCompanyId(companyId, typeCode) | 업무 |
| private moveTree() | L120-135 | E1 | 서비스 dcr.Dcr01_ClassTree.update | 업무 |
| private addChild() | L137-146 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L149-162 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L164-166 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={moveTree}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Dcr01_Edit_ClassTree (`client/vi/dcr/Dcr01_Edit_ClassTree.java`, 310줄)

- 입력·하위 화면: `companyId` LongField, `classTreeId` LongField, `parentTreeId` LongField, `classTreeName` TextField, `classTreeCode` TextField, `seq` TextField, `note` MyTextArea

#### 이벤트
[E1] deleteButton[삭제].Select (L120) → adminCheck()
[E2] updateButton[저장].Select (L129) → updateCheck()
[E3] closeButton[닫기].Select (L137) → hide()
[E4] msgBox.DialogHide [YES] (L215) → deleteAll()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editData() | L82-146 | 공개 메서드 | 상태 처리 | 업무 |
| private updateCheck() | L148-176 | E2 | 서비스 dcr.Dcr01_ClassTree.updateCheck | 업무 |
| public update() | L178-198 | updateCheck | 서비스 dcr.Dcr01_ClassTree.update | 업무 |
| private adminCheck() | L200-210 | E1 | 상태 처리 | 업무 |
| public deleteCheck() | L212-267 | adminCheck | 확인창 표시, 서비스 dcr.Dcr01_ClassTree.deleteCheck | 업무 |
| public deleteAll() | L269-285 | E4 | 서비스 dcr.Dcr01_ClassTree.deleteAll | 업무 |
| private setHtmlStyle() | L303-305 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L307-309 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="delete" onClick={adminCheck}>삭제</Button>
2. <Button type="save" onClick={updateCheck}>저장</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

