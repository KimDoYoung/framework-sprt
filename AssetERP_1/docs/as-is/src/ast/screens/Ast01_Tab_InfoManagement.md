# Ast01_Tab_InfoManagement

- 종류: 화면
- 메뉴: 펀드관리 > 80. 펀드자산 > 펀드자산 종목상세 (#1118)
- 파일: `client/vi/ast/Ast01_Tab_InfoManagement.java`
- 함께 쓰는 클래스 6개:
  - `Ast02_Grid_DetailManagement` `client/vi/ast/Ast02_Grid_DetailManagement.java`
  - `Ast10_Grid_Manager` `client/vi/ast/Ast10_Grid_Manager.java`
  - `Ast10_Lookup_Manager` `client/vi/ast/Ast10_Lookup_Manager.java`
  - `Ast03_Lookup_CfInfo` `client/vi/ast/Ast03_Lookup_CfInfo.java`
  - `Ast03_Lookup_CfAutoCreate` `client/vi/ast/Ast03_Lookup_CfAutoCreate.java`
  - `Ast02_Lookup_Detail` `client/vi/ast/Ast02_Lookup_Detail.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ast05_Lookup_TrCode`](../../ast/components/Ast05_Lookup_TrCode.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ast.Ast01_ClassTree.modelUpdate` | Ast02_Grid_DetailManagement:276 | [`Ast01_ClassTree.java:174`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.modelUpdate`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast01_ClassTree.selectByCompanyId` | Ast01_Tab_InfoManagement:162 | [`Ast01_ClassTree.java:32`](../../ast/services/Ast01_ClassTree.md) | [`ast01_class_tree.selectByCompanyId`](../../ast/sql/ast01_class_tree.md) |
| `ast.Ast02_Detail.delete` | Ast02_Grid_DetailManagement:358, Ast02_Lookup_Detail:183 | [`Ast02_Detail.java:57`](../../ast/services/Ast02_Detail.md) | `UpdateDataModel(ast02_detail)` 동적 DELETE |
| `ast.Ast02_Detail.selectByClassTreeId` | Ast02_Grid_DetailManagement:238 | [`Ast02_Detail.java:38`](../../ast/services/Ast02_Detail.md) | [`ast02_detail.selectByClassTreeId`](../../ast/sql/ast02_detail.md) |
| `ast.Ast02_Detail.selectByCompanyId` | Ast02_Lookup_Detail:199 | [`Ast02_Detail.java:24`](../../ast/services/Ast02_Detail.md) | [`ast02_detail.selectByCompanyId`](../../ast/sql/ast02_detail.md) |
| `ast.Ast02_Detail.update` | Ast02_Grid_DetailManagement:292, Ast02_Lookup_Detail:180 | [`Ast02_Detail.java:52`](../../ast/services/Ast02_Detail.md) | `UpdateDataModel(ast02_detail)` 동적 INSERT/UPDATE → [`ast02_detail.selectById`](../../ast/sql/ast02_detail.md) |
| `ast.Ast03_CfInfo.bacthUpdate` | Ast03_Lookup_CfAutoCreate:252 | [`Ast03_CfInfo.java:43`](../../ast/services/Ast03_CfInfo.md) | [`ast04_cf.bizDate`](../../ast/sql/ast04_cf.md), [`ast04_cf.deleteByCfInfoId`](../../ast/sql/ast04_cf.md), [`ast04_cf.insert`](../../ast/sql/ast04_cf.md), [`ast04_cf.lastDate`](../../ast/sql/ast04_cf.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ast03_cf_info)` 동적 INSERT/UPDATE → [`ast03_cf_info.selectById`](../../ast/sql/ast03_cf_info.md) |
| `ast.Ast03_CfInfo.delete` | Ast03_Lookup_CfInfo:389 | [`Ast03_CfInfo.java:140`](../../ast/services/Ast03_CfInfo.md) | `UpdateDataModel(ast03_cf_info)` 동적 DELETE |
| `ast.Ast03_CfInfo.selectByClassTreeId` | Ast03_Lookup_CfInfo:416 | [`Ast03_CfInfo.java:31`](../../ast/services/Ast03_CfInfo.md) | [`ast03_cf_info.selectByClassTreeId`](../../ast/sql/ast03_cf_info.md) |
| `ast.Ast03_CfInfo.update` | Ast03_Lookup_CfInfo:386 | [`Ast03_CfInfo.java:135`](../../ast/services/Ast03_CfInfo.md) | `UpdateDataModel(ast03_cf_info)` 동적 INSERT/UPDATE → [`ast03_cf_info.selectById`](../../ast/sql/ast03_cf_info.md) |
| `ast.Ast04_Cf.delete` | Ast03_Lookup_CfInfo:402 | [`Ast04_Cf.java:55`](../../ast/services/Ast04_Cf.md) | `UpdateDataModel(ast04_cf)` 동적 DELETE |
| `ast.Ast04_Cf.selectByCfInfoId` | Ast03_Lookup_CfInfo:434 | [`Ast04_Cf.java:38`](../../ast/services/Ast04_Cf.md) | [`ast04_cf.selectByCfInfoId`](../../ast/sql/ast04_cf.md) |
| `ast.Ast04_Cf.update` | Ast03_Lookup_CfInfo:399 | [`Ast04_Cf.java:50`](../../ast/services/Ast04_Cf.md) | `UpdateDataModel(ast04_cf)` 동적 INSERT/UPDATE → [`ast04_cf.selectById`](../../ast/sql/ast04_cf.md) |
| `ast.Ast10_Manager.delete` | Ast10_Lookup_Manager:273 | [`Ast10_Manager.java:38`](../../ast/services/Ast10_Manager.md) | `UpdateDataModel(ast10_manager)` 동적 DELETE |
| `ast.Ast10_Manager.selectByLinkId` | Ast10_Grid_Manager:63, Ast10_Lookup_Manager:295 | [`Ast10_Manager.java:23`](../../ast/services/Ast10_Manager.md) | [`ast10_manager.selectByLinkId`](../../ast/sql/ast10_manager.md) |
| `ast.Ast10_Manager.update` | Ast10_Lookup_Manager:270 | [`Ast10_Manager.java:33`](../../ast/services/Ast10_Manager.md) | `UpdateDataModel(ast10_manager)` 동적 INSERT/UPDATE → [`ast10_manager.selectById`](../../ast/sql/ast10_manager.md) |

## 테이블

[`ast01_class_tree`](../../../db/tables/ast.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast03_cf_info`](../../../db/tables/ast.md), [`ast04_cf`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md)

## DB 함수

`f_ast_class_tree_nm_allpath`, `f_cdnm`, `f_emp_kor_nm`, `f_get_biz_date`, `f_get_corp_nm`, `f_get_last_day`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast01_Tab_InfoManagement (`client/vi/ast/Ast01_Tab_InfoManagement.java`, 217줄)

- 레이아웃: west=vlc, center=gridDetail
- 툴바 `buttonBar`: 검색: {docSearch} {retrieveButton}
- 입력·하위 화면: `docSearch` TextField

#### 이벤트
[E0] 화면 열림 (생성자 L48-101) → retrieve()
[E1] retrieveButton[조회].Select (L50) → retrieve()
[E2] docSearch.KeyPress [Enter] (L57) → search()
[E3] tree.Selection (L68) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| package getMenuTree() | L103-138 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieveTabpage() | L140-148 | E3 | 상태 처리 | 업무 |
| private addChild() | L150-158 | getServiceResult | 상태 처리 | 업무 |
| public retrieve() | L160-171 | 생성자,E1 | 서비스 ast.Ast01_ClassTree.selectByCompanyId | 업무 |
| private search() | L173-194 | E2 | 상태 처리 | 업무 |
| public getServiceResult() | L197-212 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L214-216 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>

### Ast02_Grid_DetailManagement (`client/vi/ast/Ast02_Grid_DetailManagement.java`, 383줄)

- 레이아웃: center=form, south=southVlc
- 툴바 `buttonBar01`: {retrieveButton} {deleteButton} {addButton}
- 툴바 `buttonBar02`: {cfButton}
- 툴바 `buttonBarBottom`: {updateButton}
- 입력·하위 화면: `content` TextField, `popup_CfInfo` Ast03_Lookup_CfInfo, `lookupDetail` Ast02_Lookup_Detail
- 그리드 `grid` (buildGrid(), 행번호숨김, 체크박스(다중)):
  - seq 70 "순번" LongCenter 편집:LongField
  - title 120 "항목" TextCenter 편집:TextField
  - value 350 "정보" TextArea 편집:TextArea
  - note 350 "비고" TextArea 편집:TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L98-102) → settings(), makeLayout()
[E1] retrieveButton[조회].Select (L106) → retrieve()
[E2] updateButton[저장].Select (L112) → update()
[E3] deleteButton[삭제].Select (L118) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L337) → delete()
[E4] cfButton[현금흐름표].Select [classTreeModel == null] (L124) → retrieve()
[E5] addButton[항목추가].Select (L141) → insert()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editData() | L90-96 | retrieve | 상태 처리 | 업무 |
| public visible() | L218-220 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L222-244 | E1,E4 | 서비스 ast.Ast02_Detail.selectByClassTreeId(classTreeId, companyId) | 업무 |
| public update() | L246-306 | E2 | 서비스 ast.Ast01_ClassTree.modelUpdate, ast.Ast02_Detail.update | 업무 |
| public insert() | L308-319 | E5 | 상태 처리 | 업무 |
| public insertRow() | L321-327 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L329-353 | E3 | 미선택 시 alert "삭제할 항목을 선택해주세요" → 확인창 E6 | 업무 |
| public delete() | L355-359 | E6 | GridDeleteData ast.Ast02_Detail.delete(체크된 행 목록) | 업무 |
| private settings() | L104-155 | 생성자 | 조회창 Ast03_Lookup_CfInfo 열기, 조회창 Ast02_Lookup_Detail 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private makeLayout() | L157-203 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L205-216 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L361-363 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L365-367 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtml() | L369-372 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('seq', 70, '순번', { editor: 'number' }),  // L210
  gb.textCenter('title', 120, '항목', { editor: 'text' }),  // L211
  gb.textArea('value', 350, '정보', { editor: 'largeText' }),  // L212
  gb.textArea('note', 350, '비고', { editor: 'largeText' }),  // L213
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="register" onClick={insert}>항목추가</Button>
4. <Button type="register" onClick={retrieve}>현금흐름표</Button>
5. <Button type="save" onClick={update}>저장</Button>

### Ast10_Grid_Manager (`client/vi/ast/Ast10_Grid_Manager.java`, 95줄)

- 툴바 `buttonBar`: {insertButton}
- 입력·하위 화면: `popup` Ast10_Lookup_Manager
- 그리드 `grid` (grid()):
  - managerName 50 "구분" TextCenter
  - orgName 150 "부서" Text
  - personName 80 "성명" Text
  - reprYn 50 "대표" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L32-51) → 초기화
[E1] insertButton[담당자 관리].Select (L35) → editManager()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L53-55 | editManager | 상태 처리 | 업무 |
| public retrieve() | L57-69 | editManager | 서비스 ast.Ast10_Manager.selectByLinkId(companyId, linkId) | 업무 |
| private grid() | L71-79 | 필드 초기화 | 상태 처리 | 업무 |
| public editManager() | L81-94 | E1 | 조회창 Ast10_Lookup_Manager 열기 | 업무 |

#### Grid Spec
```javascript
const grid = () => [
  gb.textCenter('managerNm', 50, '구분'),  // L73 SQL 계산 컬럼(selectByLinkId: f_cdnm('ShareCode', ast10_manager_type,…)
  gb.text('orgNm', 150, '부서'),  // L74 SQL 계산 컬럼(selectByLinkId: f_org_nm(ast10_org_id, f_sysdate()))
  gb.text('personNm', 80, '성명'),  // L75 SQL 계산 컬럼(selectByLinkId: f_emp_kor_nm(ast10_person_id))
  gb.boolean('reprYn', 50, '대표'),  // L76
];
```

#### 사용된 버튼들
1. <Button type="org" onClick={editManager}>담당자 관리</Button>

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

### Ast02_Lookup_Detail (`client/vi/ast/Ast02_Lookup_Detail.java`, 232줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="연관태그를 입력해주세요"
- 그리드 `grid` (buildCfInfoGrid(), 체크박스(다중)):
  - seq 60 "조회순번" Long 편집:LongField
  - title 200 "항목" Text 편집:TextField
  - tag 280 "연관태그" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L67-83) → show()
[E1] searchText.KeyPress [Enter] (L86) → retrieve()
[E2] confirmButton[확인].Select (L94) → hide()
[E3] cancleButton[닫기].Select (L112) → hide()
[E4] retrieveButton[조회].Select (L119) → retrieve()
[E5] updateButton[저장].Select (L125) → update()
[E6] insertButton[행 추가].Select (L131) → insertRow()
[E7] deleteButton[행 삭제].Select (L137) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-65 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L85-151 | open | 미선택 시 alert "저장되지 않은 데이터가 존재합니다." | 업무 |
| public buildCfInfoGrid() | L153-162 | 필드 초기화 | 상태 처리 | 업무 |
| private update() | L164-189 | E5 | GridDeleteData ast.Ast02_Detail.update, ast.Ast02_Detail.delete | 업무 |
| public retrieve() | L191-205 | E1,E4,open | 서비스 ast.Ast02_Detail.selectByCompanyId(defaultYn, companyId, searchText) | 업무 |
| private insertRow() | L207-215 | E6 | 상태 처리 | 업무 |
| private deleteRow() | L217-223 | E7 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L225-227 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L229-231 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildCfInfoGrid = () => [
  gb.long('seq', 60, '조회순번', { editor: 'number' }),  // L157
  gb.text('title', 200, '항목', { editor: 'text' }),  // L158
  gb.text('tag', 280, '연관태그', { editor: 'text' }),  // L159
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
5. <Button type="save" onClick={hide}>확인</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

