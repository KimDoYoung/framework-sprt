# Ast01_Tab_ClassTreeManagement

- 종류: 화면
- 메뉴: 펀드관리 > 80. 펀드자산 > 펀드자산 종목기본 (#1117)
- 파일: `client/vi/ast/Ast01_Tab_ClassTreeManagement.java`
- 함께 쓰는 클래스 6개:
  - `Ast01_Lookup_MoveClassTree` `client/vi/ast/Ast01_Lookup_MoveClassTree.java`
  - `Ast01_Move_ClassTree` `client/vi/ast/Ast01_Move_ClassTree.java`
  - `Ast01_Grid_AstTypeManagement` `client/vi/ast/Ast01_Grid_AstTypeManagement.java`
  - `Ast10_Lookup_Manager` `client/vi/ast/Ast10_Lookup_Manager.java`
  - `Ast01_Edit_ClassTree` `client/vi/ast/Ast01_Edit_ClassTree.java`
  - `Ast01_Lookup_ItemClass` `client/vi/ast/Ast01_Lookup_ItemClass.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast01_ClassTree.createCode` | Ast01_Tab_ClassTreeManagement:217 | [`Ast01_ClassTree.java:159`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.delete` | Ast01_Edit_ClassTree:238, Ast01_Grid_AstTypeManagement:219 | [`Ast01_ClassTree.java:464`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.checkUseAstId`](../../ast/sql/ast01_class_tree.md), [`ast02_detail.deleteByAstClassTreeId`](../../ast/sql/ast02_detail.md), [`ast10_manager.deleteByLinkId`](../../ast/sql/ast10_manager.md), `UpdateDataModel(ast01_class_tree)` 동적 DELETE |
| `ast.Ast01_ClassTree.insert` | Ast01_Grid_AstTypeManagement:175 | [`Ast01_ClassTree.java:199`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.infoUpdate`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.insert`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast10_manager.insert`](../../ast/sql/ast10_manager.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByCompanyId`](../../org/sql/org01_code.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `ast.Ast01_ClassTree.modelUpdate` | Ast01_Lookup_ItemClass:348 | [`Ast01_ClassTree.java:174`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.modelUpdate`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.selectByCompanyId` | Ast01_Move_ClassTree:174, Ast01_Tab_ClassTreeManagement:272 | [`Ast01_ClassTree.java:32`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByCompanyId`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.selectByParentId` | Ast01_Grid_AstTypeManagement:145 | [`Ast01_ClassTree.java:113`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByParentId`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.update` | Ast01_Edit_ClassTree:204 | [`Ast01_ClassTree.java:459`](../../ast/services/Ast01_ClassTree.md) | `UpdateDataModel(ast01_class_tree)` 동적 INSERT/UPDATE → [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.updateParentId` | Ast01_Lookup_MoveClassTree:105 | [`Ast01_ClassTree.java:443`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.checkParentId`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.updateParentId`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast10_Manager.delete` | Ast10_Lookup_Manager:273 | [`Ast10_Manager.java:38`](../../ast/services/Ast10_Manager.md) | `UpdateDataModel(ast10_manager)` 동적 DELETE |
| `ast.Ast10_Manager.selectByLinkId` | Ast10_Lookup_Manager:295 | [`Ast10_Manager.java:23`](../../ast/services/Ast10_Manager.md) | [`ast10_manager.selectByLinkId`](../../ast/sql/ast10_manager.md) |
| `ast.Ast10_Manager.update` | Ast10_Lookup_Manager:270 | [`Ast10_Manager.java:33`](../../ast/services/Ast10_Manager.md) | `UpdateDataModel(ast10_manager)` 동적 INSERT/UPDATE → [`ast10_manager.selectById`](../../ast/sql/ast10_manager.md) |
| `sys.Sys09_Code.selectByKindCode` | Ast01_Lookup_ItemClass:66 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`org01_code`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_check_use_ast_id`, `f_create_ast_class_tree_cd`, `f_emp_kor_nm`, `f_get_corp_nm`, `f_org_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast01_Tab_ClassTreeManagement (`client/vi/ast/Ast01_Tab_ClassTreeManagement.java`, 306줄)

- 레이아웃: north=buttonBar, west=treeGrid, center=gridDocType
- 툴바 `buttonBar`: 검색: {astSearch} {retrieveButton} {expandAll} {collapseAll} {insertRootButton} {insertChildButton}
- 입력·하위 화면: `astSearch` TextField, `editClassTree` Ast01_Edit_ClassTree, `popup` Ast01_Lookup_MoveClassTree, `popup_Classification` Ast01_Edit_ClassTree
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 350 "자산구분" Text
  - note 200 "비고" TextArea
  - actionCell 50 "이동" Cell 편집:moveCell
  - actionCell 50 "상세" Cell 편집:editInfoCell

#### 이벤트
[E0] 화면 열림 (생성자 L51-132) → retrieve()
[E1] astSearch.KeyPress [Enter] (L53) → search()
[E2] retrieveButton[찾기].Select (L61) → search()
[E3] expandAll[펼치기].Select (L67) → 인라인 L67-72 (new SelectHandler(){ @Override public…)
[E4] collapseAll[감추기].Select (L73) → 인라인 L73-78 (new SelectHandler(){ @Override public…)
[E5] insertRootButton[상위등록].Select (L79) → insertAstClass()
[E6] insertChildButton[하위등록].Select (L85) → insertChildAstClass()
[E7] treeGrid.SelectionChanged [선택>0] (L115) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L134-157 | 필드 초기화 | 상태 처리 | 업무 |
| private addChildItem() | L159-170 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L173-192 | insertAstClass | 상태 처리 | 업무 |
| private insertChildAstClass() | L194-202 | E6 | 미선택 시 alert "먼저 상위분류를 선택해주세요" | 업무 |
| private insertAstClass() | L204-238 | E5,insertChildAstClass | 팝업 Ast01_Edit_ClassTree 열기, 서비스 ast.Ast01_ClassTree.createCode | 업무 |
| private moveItem() | L240-251 | buildTreeGrid | 조회창 Ast01_Lookup_MoveClassTree 열기 | 업무 |
| private editItem() | L253-264 | buildTreeGrid | 팝업 Ast01_Edit_ClassTree 열기 | 업무 |
| private retrievePage() | L266-269 | E7 | 상태 처리 | 업무 |
| public retrieve() | L271-279 | 생성자,insertAstClass,moveItem,editItem | 서비스 ast.Ast01_ClassTree.selectByCompanyId | 업무 |
| private search() | L281-301 | E1,E2 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L303-305 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 350, '자산구분'),  // L150
  gb.textArea('note', 200, '비고'),  // L152
  // ⚠ 대응 없음 (GridBuilder L153) addCell
  // ⚠ 대응 없음 (GridBuilder L154) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="expand" onClick={() => /* 인라인 L67-72 (new SelectHandler(){ @Override public…) */}>펼치기</Button>
3. <Button type="collapse" onClick={() => /* 인라인 L73-78 (new SelectHandler(){ @Override public…) */}>감추기</Button>
4. <Button type="register" onClick={insertAstClass}>상위등록</Button>
5. <Button type="register" onClick={insertChildAstClass}>하위등록</Button>

### Ast01_Lookup_MoveClassTree (`client/vi/ast/Ast01_Lookup_MoveClassTree.java`, 129줄)

- 입력·하위 화면: `parentName` LookupTriggerField 빈칸="선택해주세요", `parentId` LongField

#### 이벤트
[E0] 화면 열림 (생성자 L66-99) → show()
[E1] parentName.TriggerClick (L49) → 인라인 L49-63 (new TriggerClickHandler(){ @Override …)
[E2] updateButton[확인].Select (L73) → update()
[E3] cancleButton[닫기].Select (L79) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L40-64 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L101-123 | E2 | 서비스 ast.Ast01_ClassTree.updateParentId | 업무 |
| private setHtmlHeaderStyle() | L125-127 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>확인</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast01_Move_ClassTree (`client/vi/ast/Ast01_Move_ClassTree.java`, 232줄)

- 툴바 `buttonBar`: 자산구분: {docSearch} {searchButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L95-116) → show()
[E1] docSearch.KeyPress [Enter] (L62) → search()
[E2] searchButton[찾기].Select (L70) → search()
[E3] updateButton[확인].Select (L81) → update()
[E4] cancleButton[닫기].Select (L87) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-58 | 공개 메서드 | 상태 처리 | 업무 |
| private buttonBarSetting() | L60-93 | open | 상태 처리 | 업무 |
| private update() | L118-121 | E3 | 상태 처리 | 업무 |
| package getMenuTree() | L123-159 | 필드 초기화 | 상태 처리 | 업무 |
| private addChild() | L162-170 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L172-184 | open | 서비스 ast.Ast01_ClassTree.selectByCompanyId | 업무 |
| private search() | L186-206 | E1,E2 | 상태 처리 | 업무 |
| public getServiceResult() | L209-222 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L224-226 | buttonBarSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L228-230 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast01_Grid_AstTypeManagement (`client/vi/ast/Ast01_Grid_AstTypeManagement.java`, 222줄)

- 입력·하위 화면: `popup` Ast10_Lookup_Manager
- 그리드 `grid` (buildGrid(), 체크박스):
  - seq 50 "순서" Long 편집:LongField
  - isin 120 "종목코드" Text 편집:TextField
  - classTreeName 350 "종목명" Text 편집:TextField
  - actionCell 50 "담당자" Cell 편집:actionCell
  - actionCell 50 "이동" Cell 편집:moveCell

#### 이벤트
[E0] 화면 열림 (생성자 L48-79) → 초기화
[E1] deleteButton[삭제].Select (L51) → deleteRow()
       └ [E4] msgBox.DialogHide [YES] (L199) → delete()
[E2] insertButton[등록].Select (L57) → insertRow()
[E3] updateButton[저장].Select (L63) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private moveItem() | L116-127 | buildGrid | 조회창 Ast01_Lookup_MoveClassTree 열기 | 업무 |
| public retrieve() | L129-151 | moveItem,update | 서비스 ast.Ast01_ClassTree.selectByParentId(classTreeId, companyId, typeCode) | 업무 |
| public update() | L153-181 | E3 | 서비스 ast.Ast01_ClassTree.insert(companyId) | 업무 |
| public insertRow() | L183-194 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L196-214 | E1 | ConfirmBox → E4 | 업무 |
| public delete() | L216-220 | E4 | GridDeleteData ast.Ast01_ClassTree.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L81-114 | 필드 초기화 | 조회창 Ast10_Lookup_Manager 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.long('seq', 50, '순서', { editor: 'number' }),  // L107
  gb.text('isin', 120, '종목코드', { editor: 'text' }),  // L108
  gb.text('classTreeNm', 350, '종목명', { editor: 'text' }),  // L109
  // ⚠ 대응 없음 (GridBuilder L110) addCell
  // ⚠ 대응 없음 (GridBuilder L111) addCell
];
```

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteRow}>삭제</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>

### Ast10_Lookup_Manager (`client/vi/ast/Ast10_Lookup_Manager.java`, 310줄)

- 툴바 `buttonBar`: {hlc}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `orgSearch` Org00_Lookup_SelectMulti, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (grid(), 체크박스(다중)):
  - managerName 70 "구분" TextCenter
  - orgName 250 "부서" Text
  - personName 100 "성명" TextCenter
  - reprYn 50 "대표" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L135-166) → show()
[E1] anchor.MouseDown (L85) → retrieve()
[E2] insertButton[행 추가].Select (L99) → insertRow()
[E3] deleteButton[행 삭제].Select (L105) → deleteRow()
[E4] updateButton[저장].Select (L142) → preCheck()
[E5] closeButton[닫기].Select (L148) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L74-80 | 공개 메서드 | 상태 처리 | 업무 |
| private ButtonSetting() | L82-121 | open | 상태 처리 | 업무 |
| private grid() | L123-133 | 필드 초기화 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L168-194 | insertRow | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L196-224 | insertRow | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow() | L226-234 | E2 | 상태 처리 | 업무 |
| private preCheck() | L236-266 | E4 | 상태 처리 | 업무 |
| private update() | L268-279 | preCheck | GridDeleteData ast.Ast10_Manager.update, ast.Ast10_Manager.delete | 업무 |
| private deleteRow() | L281-287 | E3 | 상태 처리 | 업무 |
| private retrieve() | L289-301 | E1,open | 서비스 ast.Ast10_Manager.selectByLinkId(companyId, linkId) | 업무 |
| private setHtmlHeaderStyle() | L303-305 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L307-309 | ButtonSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('managerNm', 70, '구분'),  // L127 SQL 계산 컬럼(selectByLinkId: f_cdnm('ShareCode', ast10_manager_type,…)
  gb.text('orgNm', 250, '부서'),  // L128 SQL 계산 컬럼(selectByLinkId: f_org_nm(ast10_org_id, f_sysdate()))
  gb.textCenter('personNm', 100, '성명'),  // L129 SQL 계산 컬럼(selectByLinkId: f_emp_kor_nm(ast10_person_id))
  gb.boolean('reprYn', 50, '대표'),  // L130
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={preCheck}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Ast01_Edit_ClassTree (`client/vi/ast/Ast01_Edit_ClassTree.java`, 268줄)

- 입력·하위 화면: `companyId` LongField, `classTreeId` LongField, `parentTreeId` LongField, `seq` LongField, `classTreeName` TextField, `classTreeCode` TextField, `content` TextField, `note` TextField, `ipoAssignYn` CheckBox, `lookup` Ast01_Lookup_ItemClass

#### 이벤트
[E1] deleteButton[삭제].Select (L156) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L216) → delete()
[E2] updateButton[저장].Select (L162) → update()
[E3] closeButton[닫기].Select (L168) → hide()
[E4] addInfoButton[추가정보].Select (L174) → lookupAddInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editData() | L77-149 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L151-180 | editData | 상태 처리 | 업무 |
| private lookupAddInfo() | L182-185 | E4 | 조회창 Ast01_Lookup_ItemClass 열기 | 업무 |
| public update() | L192-211 | E2 | 서비스 ast.Ast01_ClassTree.update | 업무 |
| public deleteRow() | L213-231 | E1 | ConfirmBox → E5 | 업무 |
| public delete() | L233-245 | E5 | 서비스 ast.Ast01_ClassTree.delete | 업무 |
| private setHtml() | L187-190 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L257-259 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L261-263 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L265-267 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={lookupAddInfo}>추가정보</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Ast01_Lookup_ItemClass (`client/vi/ast/Ast01_Lookup_ItemClass.java`, 387줄)

- 입력·하위 화면: `itemLClassCode` TextField, `itemMClassCode` TextField, `itemSClassCode` TextField, `itemDClassCode` TextField, `accountType` TextField, `depnType` TextField, `evalType` TextField, `accountName` ComboBoxField("AccountType") 빈칸="선택", `itemLClassName` ComboBoxField("ItemLClassCode") 빈칸="선택", `itemMClassName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `itemSClassName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `itemDClassName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `depnTypeName` ComboBoxField("DepnType", "(해당없음)") 빈칸="선택", `evalTypeName` ComboBoxField("AssetEvalType", "(해당없음)") 빈칸="선택", `curCode` ComboBoxField("CurCode"), `issueDate` MyDateField, `matDate` MyDateField, `trUnit` LongField, `depnYear` LongField, `depnRate` DoubleField, `corpId` LongField, `corpName` LookupTriggerField, `lookupCorp` Sys15_Lookup_Corp

#### 이벤트
[E0] 화면 열림 (생성자 L99-177) → show()
[E1] updateButton[저장].Select (L106) → update()
[E2] closeButton[닫기].Select (L112) → hide()
[E3] accountName[계정구분].Collapse (L199) → 인라인 L199-204 (new CollapseHandler(){ @Override publ…)
[E4] itemLClassName[ItemLClassCode].ValueChange (L206) → refreshCode()
[E5] itemMClassName[sys.Sys09_Code.selectByKindCode].ValueChange (L218) → refreshCode()
[E6] itemSClassName[sys.Sys09_Code.selectByKindCode].ValueChange (L236) → refreshCode()
[E7] itemLClassName[ItemLClassCode].Collapse (L244) → 인라인 L244-249 (new CollapseHandler(){ @Override publ…)
[E8] itemMClassName[sys.Sys09_Code.selectByKindCode].Collapse (L250) → 인라인 L250-255 (new CollapseHandler(){ @Override publ…)
[E9] itemSClassName[sys.Sys09_Code.selectByKindCode].Collapse (L256) → 인라인 L256-261 (new CollapseHandler(){ @Override publ…)
[E10] itemDClassName[sys.Sys09_Code.selectByKindCode].Collapse (L262) → 인라인 L262-267 (new CollapseHandler(){ @Override publ…)
[E11] itemMClassName[sys.Sys09_Code.selectByKindCode].TriggerClick (L268) → refreshCode()
[E12] itemSClassName[sys.Sys09_Code.selectByKindCode].TriggerClick (L274) → refreshCode()
[E13] itemDClassName[sys.Sys09_Code.selectByKindCode].TriggerClick (L280) → refreshCode()
[E14] depnTypeName[감가상각방식].Collapse (L287) → setDepn()
[E15] corpName[보관처].TriggerClick [result == null] (L295) → 인라인 L295-313 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L89-97 | 공개 메서드 | 상태 처리 | 업무 |
| private refreshCode() | L316-337 | E4,E5,E6,E11,E12,E13 | 서비스 sys.Sys09_Code.selectByKindCode, sys.Sys09_Code.selectByKindCode, sys.Sys09_Code.selectByKindCode | 업무 |
| private update() | L339-362 | E1 | 서비스 ast.Ast01_ClassTree.modelUpdate | 업무 |
| private setDepn() | L364-378 | E14,settings | 상태 처리 | 업무 |
| private settings() | L179-314 | open | 조회창 Sys15_Lookup_Corp 열기, 이벤트 연결, 초기값: accountType=accountName.getCode(, trUnit=(long("거래단위"), trUnit=(long("거래단위"), trUnit=(long("거래단위"), itemLClassCode=itemLClassName.getCode(, itemMClassCode=itemMClassName.getCode(, itemSClassCode=itemSClassName.getCode(, itemDClassCode=itemDClassName.getCode(, corpId=null, corpName=null("보관처"), corpId=corpModel.getCorpId(, corpName=corpModel.getCorpName(("보관처") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L380-382 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L384-386 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

