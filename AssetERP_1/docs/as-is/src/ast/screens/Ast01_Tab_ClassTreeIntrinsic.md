# Ast01_Tab_ClassTreeIntrinsic

- 종류: 화면
- 메뉴: 고유자산 > 10. 고유자산 등록 > 고유자산 기본등록 ① (#1087)
- 파일: `client/vi/ast/Ast01_Tab_ClassTreeIntrinsic.java`
- 함께 쓰는 클래스 8개:
  - `Ast01_Lookup_MoveClassTree` `client/vi/ast/Ast01_Lookup_MoveClassTree.java`
  - `Ast01_Move_ClassTree` `client/vi/ast/Ast01_Move_ClassTree.java`
  - `Ast01_Grid_AstType` `client/vi/ast/Ast01_Grid_AstType.java`
  - `Ast10_Lookup_Manager` `client/vi/ast/Ast10_Lookup_Manager.java`
  - `Ast03_Lookup_CfInfo` `client/vi/ast/Ast03_Lookup_CfInfo.java`
  - `Ast03_Lookup_CfAutoCreate` `client/vi/ast/Ast03_Lookup_CfAutoCreate.java`
  - `Ast01_Lookup_ItemClass` `client/vi/ast/Ast01_Lookup_ItemClass.java`
  - `Ast01_Edit_ClassTree` `client/vi/ast/Ast01_Edit_ClassTree.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast05_Lookup_TrCode`](../../ast/components/Ast05_Lookup_TrCode.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast01_ClassTree.createCode` | Ast01_Tab_ClassTreeIntrinsic:234 | [`Ast01_ClassTree.java:159`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.delete` | Ast01_Edit_ClassTree:238, Ast01_Grid_AstType:317 | [`Ast01_ClassTree.java:464`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.checkUseAstId`](../../ast/sql/ast01_class_tree.md), [`ast02_detail.deleteByAstClassTreeId`](../../ast/sql/ast02_detail.md), [`ast10_manager.deleteByLinkId`](../../ast/sql/ast10_manager.md), `UpdateDataModel(ast01_class_tree)` 동적 DELETE |
| `ast.Ast01_ClassTree.insert` | Ast01_Grid_AstType:272 | [`Ast01_ClassTree.java:199`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.createCode`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.infoUpdate`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.insert`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md), [`ast10_manager.insert`](../../ast/sql/ast10_manager.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByCompanyId`](../../org/sql/org01_code.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `ast.Ast01_ClassTree.modelUpdate` | Ast01_Lookup_ItemClass:348 | [`Ast01_ClassTree.java:174`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.modelUpdate`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.pullData` | Ast01_Tab_ClassTreeIntrinsic:367 | [`Ast01_ClassTree.java:362`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.insert`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.selectPullData`](../../ast/sql/ast01_class_tree.md), [`ast10_manager.insert`](../../ast/sql/ast10_manager.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org00_org_info.selectByKorName`](../../org/sql/org00_org_info.md) |
| `ast.Ast01_ClassTree.selectByCompanyId` | Ast01_Move_ClassTree:174, Ast01_Tab_ClassTreeIntrinsic:289 | [`Ast01_ClassTree.java:32`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByCompanyId`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.selectBySearchParentId` | Ast01_Grid_AstType:238 | [`Ast01_ClassTree.java:129`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectBySearchParentId`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.update` | Ast01_Edit_ClassTree:204 | [`Ast01_ClassTree.java:459`](../../ast/services/Ast01_ClassTree.md) | `UpdateDataModel(ast01_class_tree)` 동적 INSERT/UPDATE → [`ast01_class_tree.selectById`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.updateParentId` | Ast01_Lookup_MoveClassTree:105 | [`Ast01_ClassTree.java:443`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.checkParentId`](../../ast/sql/ast01_class_tree.md), [`ast01_class_tree.updateParentId`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast03_CfInfo.bacthUpdate` | Ast03_Lookup_CfAutoCreate:252 | [`Ast03_CfInfo.java:43`](../../ast/services/Ast03_CfInfo.md) | [`ast04_cf.bizDate`](../../ast/sql/ast04_cf.md), [`ast04_cf.deleteByCfInfoId`](../../ast/sql/ast04_cf.md), [`ast04_cf.insert`](../../ast/sql/ast04_cf.md), [`ast04_cf.lastDate`](../../ast/sql/ast04_cf.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast03_cf_info)` 동적 INSERT/UPDATE → [`ast03_cf_info.selectById`](../../ast/sql/ast03_cf_info.md) |
| `ast.Ast03_CfInfo.delete` | Ast03_Lookup_CfInfo:389 | [`Ast03_CfInfo.java:140`](../../ast/services/Ast03_CfInfo.md) | `UpdateDataModel(ast03_cf_info)` 동적 DELETE |
| `ast.Ast03_CfInfo.selectByClassTreeId` | Ast03_Lookup_CfInfo:416 | [`Ast03_CfInfo.java:31`](../../ast/services/Ast03_CfInfo.md) | [`ast03_cf_info.selectByClassTreeId`](../../ast/sql/ast03_cf_info.md) |
| `ast.Ast03_CfInfo.update` | Ast03_Lookup_CfInfo:386 | [`Ast03_CfInfo.java:135`](../../ast/services/Ast03_CfInfo.md) | `UpdateDataModel(ast03_cf_info)` 동적 INSERT/UPDATE → [`ast03_cf_info.selectById`](../../ast/sql/ast03_cf_info.md) |
| `ast.Ast04_Cf.delete` | Ast03_Lookup_CfInfo:402 | [`Ast04_Cf.java:55`](../../ast/services/Ast04_Cf.md) | `UpdateDataModel(ast04_cf)` 동적 DELETE |
| `ast.Ast04_Cf.selectByCfInfoId` | Ast03_Lookup_CfInfo:434 | [`Ast04_Cf.java:38`](../../ast/services/Ast04_Cf.md) | [`ast04_cf.selectByCfInfoId`](../../ast/sql/ast04_cf.md) |
| `ast.Ast04_Cf.update` | Ast03_Lookup_CfInfo:399 | [`Ast04_Cf.java:50`](../../ast/services/Ast04_Cf.md) | `UpdateDataModel(ast04_cf)` 동적 INSERT/UPDATE → [`ast04_cf.selectById`](../../ast/sql/ast04_cf.md) |
| `ast.Ast10_Manager.delete` | Ast10_Lookup_Manager:273 | [`Ast10_Manager.java:38`](../../ast/services/Ast10_Manager.md) | `UpdateDataModel(ast10_manager)` 동적 DELETE |
| `ast.Ast10_Manager.selectByLinkId` | Ast10_Lookup_Manager:295 | [`Ast10_Manager.java:23`](../../ast/services/Ast10_Manager.md) | [`ast10_manager.selectByLinkId`](../../ast/sql/ast10_manager.md) |
| `ast.Ast10_Manager.update` | Ast10_Lookup_Manager:270 | [`Ast10_Manager.java:33`](../../ast/services/Ast10_Manager.md) | `UpdateDataModel(ast10_manager)` 동적 INSERT/UPDATE → [`ast10_manager.selectById`](../../ast/sql/ast10_manager.md) |
| `sys.Sys09_Code.selectByKindCode` | Ast01_Lookup_ItemClass:66 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast03_cf_info`](../../../db/tables/ast.md), [`ast04_cf`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`org00_org_info`](../../../db/views.md), [`org01_code`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_check_use_ast_id`, `f_create_ast_class_tree_cd`, `f_emp_kor_nm`, `f_get_biz_date`, `f_get_corp_nm`, `f_get_last_day`, `f_org_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast01_Tab_ClassTreeIntrinsic (`client/vi/ast/Ast01_Tab_ClassTreeIntrinsic.java`, 391줄)

- 레이아웃: west=westVlc, center=gridDocType
- 툴바 `buttonBar01`: 검색: {astSearch} {retrieveButton} {expandAll} {collapseAll}
- 툴바 `buttonBar02`: {insertRootButton} {insertChildButton} {dataPullButton}
- 입력·하위 화면: `astSearch` TextField, `editClassTree` Ast01_Edit_ClassTree, `popup` Ast01_Lookup_MoveClassTree, `popup_Classification` Ast01_Edit_ClassTree, `lookupCompany` Sys01_Lookup_Company
- 그리드 `treeGrid` (buildTreeGrid()):
  - classTreeName 300 "자산구분" Text
  - actionCell 50 "상세" Cell 편집:editInfoCell
  - actionCell 50 "이동" Cell 편집:moveCell

#### 이벤트
[E0] 화면 열림 (생성자 L57-149) → retrieve()
[E1] astSearch.KeyPress [Enter] (L59) → search()
[E2] retrieveButton[찾기].Select (L67) → search()
[E3] expandAll[+].Select (L73) → 인라인 L73-78 (new SelectHandler(){ @Override public…)
[E4] collapseAll[-].Select (L79) → 인라인 L79-84 (new SelectHandler(){ @Override public…)
[E5] insertRootButton[상위등록].Select (L85) → insertAstClass()
[E6] insertChildButton[하위등록].Select (L91) → insertChildAstClass()
[E7] dataPullButton[가져오기].Select (L97) → pullData()
[E8] treeGrid.SelectionChanged [선택>0] (L134) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildTreeGrid() | L151-174 | 필드 초기화 | 상태 처리 | 업무 |
| private addChildItem() | L176-187 | getServiceResult | 상태 처리 | 업무 |
| public getServiceResult() | L190-209 | insertAstClass,pullData | 상태 처리 | 업무 |
| private insertChildAstClass() | L211-219 | E6 | 미선택 시 alert "먼저 상위분류를 선택해주세요" | 업무 |
| private insertAstClass() | L221-255 | E5,insertChildAstClass | 팝업 Ast01_Edit_ClassTree 열기, 서비스 ast.Ast01_ClassTree.createCode | 업무 |
| private moveItem() | L257-268 | buildTreeGrid | 조회창 Ast01_Lookup_MoveClassTree 열기 | 업무 |
| private editItem() | L270-281 | buildTreeGrid | 팝업 Ast01_Edit_ClassTree 열기 | 업무 |
| private retrievePage() | L283-286 | E8 | 상태 처리 | 업무 |
| public retrieve() | L288-296 | 생성자,insertAstClass,moveItem,editItem,pullData | 서비스 ast.Ast01_ClassTree.selectByCompanyId | 업무 |
| private search() | L298-354 | E1,E2 | 상태 처리 | 업무 |
| private pullData() | L356-386 | E7 | 조회창 Sys01_Lookup_Company 열기, 서비스 ast.Ast01_ClassTree.pullData(companyId, stdDate, targetCompanyId) | 업무 |
| private setHtmlBarStyle() | L388-390 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildTreeGrid = () => [
  gb.text('classTreeNm', 300, '자산구분'),  // L167
  // ⚠ 대응 없음 (GridBuilder L170) addCell
  // ⚠ 대응 없음 (GridBuilder L171) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={search}>찾기</Button>
2. <Button type="plus" onClick={() => /* 인라인 L73-78 (new SelectHandler(){ @Override public…) */}>+</Button>
3. <Button type="minus" onClick={() => /* 인라인 L79-84 (new SelectHandler(){ @Override public…) */}>-</Button>
4. <Button type="register" onClick={insertAstClass}>상위등록</Button>
5. <Button type="register" onClick={insertChildAstClass}>하위등록</Button>
6. <Button type="download" onClick={pullData}>가져오기</Button>

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

### Ast01_Grid_AstType (`client/vi/ast/Ast01_Grid_AstType.java`, 333줄)

- 툴바 `buttonBar`: 검색: {astSearch} {retrieveButton}
- 입력·하위 화면: `astSearch` TextField 빈칸="종목명/종목코드/종목구분", `popup` Ast01_Lookup_ItemClass, `lookupCF` Ast03_Lookup_CfInfo
- 그리드 `grid` (buildGrid(), 체크박스):
  - seq 50 "순서" Long 편집:LongField
  - classTreeName 350 "종목명" Text 편집:TextField
  - isin 120 "종목코드" Text 편집:TextField
  - itemClassName 250 "종목구분" Text
  - useYn 80 "사용여부" Boolean
  - actionCell 50 "추가정보" Cell 편집:detailCell
  - actionCell 50 "담당자" Cell 편집:actionCell
  - actionCell 50 "C/F" Cell 편집:cfCell
  - actionCell 50 "이동" Cell 편집:moveCell

#### 이벤트
[E0] 화면 열림 (생성자 L63-122) → 초기화
[E1] astSearch.KeyPress [Enter] (L68) → retrieve()
[E2] retrieveButton[찾기].Select (L77) → retrieve()
[E3] deleteButton[삭제].Select (L84) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L297) → delete()
[E4] insertButton[등록].Select (L90) → insertRow()
[E5] updateButton[저장].Select (L96) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private moveItem() | L196-207 | buildGrid | 조회창 Ast01_Lookup_MoveClassTree 열기 | 업무 |
| public retrieve() | L209-211 | E1,E2,moveItem,update | 상태 처리 | 업무 |
| public retrieve() | L213-244 | E1,E2,moveItem,update | 서비스 ast.Ast01_ClassTree.selectBySearchParentId(classTreeId, companyId, typeCode, searchText) | 업무 |
| public update() | L246-278 | E5 | 서비스 ast.Ast01_ClassTree.insert(companyId) | 업무 |
| public insertRow() | L280-292 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L294-312 | E3 | ConfirmBox → E6 | 업무 |
| public delete() | L314-327 | E6 | GridDeleteData ast.Ast01_ClassTree.delete(체크된 행 목록) | 업무 |
| public buildGrid() | L124-194 | 필드 초기화 | 조회창 Ast01_Lookup_ItemClass 열기, 조회창 Ast10_Lookup_Manager 열기, 조회창 Ast03_Lookup_CfInfo 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L329-331 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.long('seq', 50, '순서', { editor: 'number' }),  // L183
  gb.text('classTreeNm', 350, '종목명', { editor: 'text' }),  // L184
  gb.text('isin', 120, '종목코드', { editor: 'text' }),  // L185
  gb.text('itemClassNm', 250, '종목구분'),  // L186 SQL 계산 컬럼(selectBySearchParentId: CONCAT( ast01_item_l_class_nm , '/' ||a…)
  gb.boolean('useYn', 80, '사용여부'),  // L187
  // ⚠ 대응 없음 (GridBuilder L188) addCell
  // ⚠ 대응 없음 (GridBuilder L189) addCell
  // ⚠ 대응 없음 (GridBuilder L190) addCell
  // ⚠ 대응 없음 (GridBuilder L191) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>찾기</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>

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

### Ast03_Lookup_CfInfo (`client/vi/ast/Ast03_Lookup_CfInfo.java`, 481줄)

- 레이아웃: west=vlc01, center=vlc02
- 툴바 `cfInfoBar`: {retrieveCfInfoButton} {updateCfInfoButton} {insertCfInfoButton} {deleteCfInfoButton}
- 툴바 `cfBar`: {retrieveCfButton} {updateCfButton} {insertCfButton} {deleteCfButton} {batchCfButton} {uploadExcelForm}
- 입력·하위 화면: `lookupCfInfo` Ast03_Lookup_CfAutoCreate, `trLookup` LookupTriggerField, `lookupTrCode` Ast05_Lookup_TrCode, `corpLookup` LookupTriggerField, `lookupCorp` Sys15_Lookup_Corp
- 그리드 `cfInfoGrid` (buildCfInfoGrid()):
  - cfCode 50 "코드" TextCenter 편집:TextField
  - cfName 170 "구분" Text 편집:TextField
  - trName 180 "발생거래" Text 편집:trLookup
  - corpName 150 "거래처" Text 편집:corpLookup
  - icamYn 70 "ICAM사용" Boolean
- 그리드 `cfGrid` (builCfdGrid(), 행번호숨김, 체크박스(다중)):
  - seq 50 "회차" LongCenter 편집:LongField
  - date 120 "일자" Date 편집:MyDateField
  - settleDate 120 "실수령/지급일" Date 편집:MyDateField
  - contAmt 120 "금액" Long 편집:LongField
  - tax 100 "세금" Long 편집:LongField
  - settleAmt 120 "실수량/지급액" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L105-135) → show()
[E1] uploadExcelForm.SubmitComplete (L141) → retrieveCf()
[E2] cancleButton[닫기].Select (L148) → hide()
[E3] cfInfoGrid.Selection (L155) → retrieveCf()
[E4] retrieveCfInfoButton[조회].Select (L166) → retrieveCfInfo()
[E5] updateCfInfoButton[저장].Select (L172) → updateCfInfo()
[E6] insertCfInfoButton[행 추가].Select (L178) → insertCfInfoRow()
[E7] deleteCfInfoButton[행 삭제].Select (L184) → deleteCfInfoRow()
[E8] retrieveCfButton[조회].Select (L191) → retrieveCf()
[E9] updateCfButton[저장].Select (L202) → updateCf()
[E10] insertCfButton[행 추가].Select (L208) → insertCfRow()
[E11] deleteCfButton[행 삭제].Select (L219) → deleteCfRow()
[E12] excelUploadButton[엑셀업로드].Select (L225) → 메시지 "개발 중"
[E13] batchCfButton[일괄생성].Select (L232) → 메시지 "좌측 구분값을 선택해주세요"
[E14] trLookup.TriggerClick (L273) → 인라인 L273-288 (new TriggerClickHandler(){ @Override …)
[E15] corpLookup.TriggerClick [result == null] (L292) → 인라인 L292-311 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editData() | L92-95 | 공개 메서드 | 상태 처리 | 업무 |
| public editData() | L97-103 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L137-265 | editData | 조회창 Ast03_Lookup_CfAutoCreate 열기, 미선택 시 alert "좌측 구분값을 선택해주세요" | 업무 |
| public buildCfInfoGrid() | L267-320 | 필드 초기화 | 조회창 Ast05_Lookup_TrCode 열기, 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| public builCfdGrid() | L322-336 | 필드 초기화 | 상태 처리 | 업무 |
| private updateCfInfo() | L357-395 | E5 | GridDeleteData ast.Ast03_CfInfo.update, ast.Ast03_CfInfo.delete | 업무 |
| private updateCf() | L397-408 | E9 | GridDeleteData ast.Ast04_Cf.update, ast.Ast04_Cf.delete | 업무 |
| public retrieveCfInfo() | L410-425 | E4,editData | 서비스 ast.Ast03_CfInfo.selectByClassTreeId(classTreeId) | 업무 |
| public retrieveCf() | L427-440 | E1,E3,E8 | 서비스 ast.Ast04_Cf.selectByCfInfoId(cfInfoId) | 업무 |
| private insertCfInfoRow() | L442-448 | E6 | 상태 처리 | 업무 |
| private insertCfRow() | L450-459 | E10 | 상태 처리 | 업무 |
| private deleteCfInfoRow() | L461-467 | E7 | 상태 처리 | 업무 |
| private deleteCfRow() | L469-475 | E11 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L477-479 | editData | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildCfInfoGrid = () => [
  gb.textCenter('cfCd', 50, '코드', { editor: 'text' }),  // L313
  gb.text('cfNm', 170, '구분', { editor: 'text' }),  // L314
  gb.text('trNm', 180, '발생거래'),  // L315 SQL 계산 컬럼(selectByClassTreeId: ast05_tr_code.ast05_tr_nm)
  gb.text('corpNm', 150, '거래처'),  // L316 SQL 계산 컬럼(selectByClassTreeId: f_get_corp_nm(ast03_corp_id))
  gb.boolean('icamYn', 70, 'ICAM사용'),  // L317
];

const builCfdGrid = () => [
  gb.longCenter('seq', 50, '회차', { editor: 'number' }),  // L328
  gb.date('date', 120, '일자', { editor: 'date' }),  // L329
  gb.date('settleDate', 120, '실수령/지급일', { editor: 'date' }),  // L330
  gb.long('contAmt', 120, '금액', { editor: 'number' }),  // L331
  gb.long('tax', 100, '세금', { editor: 'number' }),  // L332
  gb.long('settleAmt', 120, '실수량/지급액', { editor: 'number' }),  // L333
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="search" onClick={retrieveCfInfo}>조회</Button>
3. <Button type="save" onClick={updateCfInfo}>저장</Button>
4. <Button type="addRow" onClick={insertCfInfoRow}>행 추가</Button>
5. <Button type="removeRow" onClick={deleteCfInfoRow}>행 삭제</Button>
6. <Button type="search" onClick={retrieveCf}>조회</Button>
7. <Button type="save" onClick={updateCf}>저장</Button>
8. <Button type="addRow" onClick={insertCfRow}>행 추가</Button>
9. <Button type="removeRow" onClick={deleteCfRow}>행 삭제</Button>
10. <Button type="generate" onClick={() => /* 메시지 "좌측 구분값을 선택해주세요" */}>일괄생성</Button>
11. <Button type="upload" onClick={() => /* 메시지 "개발 중" */}>엑셀업로드</Button>

### Ast03_Lookup_CfAutoCreate (`client/vi/ast/Ast03_Lookup_CfAutoCreate.java`, 292줄)

- 입력·하위 화면: `dateCode` TextField, `holidaySettleCode` TextField, `cycle` LongField, `amt` LongField, `contAmt` LongField, `tax` LongField, `round` LongField, `startYm` TextField 빈칸="ex) 2021-01", `closeYm` TextField 빈칸="ex) 2021-01", `dateName` ComboBoxField("DateCode"), `holidaySettleName` ComboBoxField("HolidaySettleCode")

#### 이벤트
[E0] 화면 열림 (생성자 L84-109) → setting(), getEditor(), show()
[E1] contAmt[금액].ValueChange (L119) → setAmt()
[E2] tax[세금].ValueChange (L126) → setAmt()
[E3] updateButton[생성].Select (L133) → update()
       └ [E7] msgBox.DialogHide [YES] (L247) → hide()
[E4] cancleButton[닫기].Select (L139) → hide()
[E5] dateName[발생일].Collapse (L146) → 인라인 L146-151 (new CollapseHandler() { @Override pub…)
[E6] holidaySettleName[휴일설정].Collapse (L152) → 인라인 L152-157 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L74-82 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L111-158 | 생성자 | 상태 처리 | 업무 |
| private setAmt() | L160-172 | E1,E2 | 상태 처리 | 업무 |
| private getEditor() | L174-217 | 생성자 | 상태 처리 | 업무 |
| public update() | L219-273 | E3 | ConfirmBox → E7 | 업무 |
| package isNumberic() | L275-282 | update | 상태 처리 | 업무 |
| private setHtmlStyle() | L284-286 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L288-290 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

