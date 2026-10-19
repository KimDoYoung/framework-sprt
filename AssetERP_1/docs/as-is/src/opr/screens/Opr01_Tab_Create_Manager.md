# Opr01_Tab_Create_Manager

- 종류: 화면
- 파일: `client/vi/opr/Opr01_Tab_Create_Manager.java`
- 함께 쓰는 클래스 3개:
  - `Opr03_Tabpage_Reg_Manager` `client/vi/opr/Opr03_Tabpage_Reg_Manager.java`
  - `Opr02_Tabpage_Fund_Manager` `client/vi/opr/Opr02_Tabpage_Fund_Manager.java`
  - `Opr02_Lookup_Fund` `client/vi/opr/Opr02_Lookup_Fund.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Fnd01_Lookup_SelectMulti`](../../fnd/components/Fnd01_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `opr.Opr01_Create.delete` | Opr01_Tab_Create_Manager:314 | [`Opr01_Create.java:259`](../../opr/services/Opr01_Create.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(opr01_create)` 동적 DELETE |
| `opr.Opr01_Create.insertAppr` | Opr01_Tab_Create_Manager:192 | [`Opr01_Create.java:136`](../../opr/services/Opr01_Create.md) | [`apr01_appr.insert`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.insertOprFund`](../../apr/sql/apr03_relate_fund.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md), [`opr01_create.selectById`](../../opr/sql/opr01_create.md), [`opr01_create.updateApprId`](../../opr/sql/opr01_create.md), [`opr03_reg.selectById`](../../opr/sql/opr03_reg.md), [`sys10_file.insert`](../../sys/sql/sys10_file.md), [`sys10_file.selectOneByParentId`](../../sys/sql/sys10_file.md), `UpdateDataModel(apr04_appr_step)` 동적 INSERT/UPDATE → [`apr04_appr_step.selectById`](../../apr/sql/apr04_appr_step.md) |
| `opr.Opr01_Create.selectByLookupTitle` | Opr02_Lookup_Fund:182 | [`Opr01_Create.java:103`](../../opr/services/Opr01_Create.md) | [`opr01_create.selectByLookupTitle`](../../opr/sql/opr01_create.md) |
| `opr.Opr01_Create.selectByTitle` | Opr01_Tab_Create_Manager:217 | [`Opr01_Create.java:34`](../../opr/services/Opr01_Create.md) | [`opr01_create.selectByTitle`](../../opr/sql/opr01_create.md) |
| `opr.Opr01_Create.update` | Opr01_Tab_Create_Manager:235 | [`Opr01_Create.java:254`](../../opr/services/Opr01_Create.md) | `UpdateDataModel(opr01_create)` 동적 INSERT/UPDATE → [`opr01_create.selectById`](../../opr/sql/opr01_create.md) |
| `opr.Opr02_Fund.delete` | Opr02_Tabpage_Fund_Manager:196 | [`Opr02_Fund.java:79`](../../opr/services/Opr02_Fund.md) | `UpdateDataModel(opr02_fund)` 동적 DELETE |
| `opr.Opr02_Fund.selectByCreateId` | Opr02_Lookup_Fund:197, Opr02_Tabpage_Fund_Manager:130 | [`Opr02_Fund.java:25`](../../opr/services/Opr02_Fund.md) | [`opr02_fund.selectByCreateId`](../../opr/sql/opr02_fund.md) |
| `opr.Opr02_Fund.update` | Opr02_Tabpage_Fund_Manager:211 | [`Opr02_Fund.java:74`](../../opr/services/Opr02_Fund.md) | `UpdateDataModel(opr02_fund)` 동적 INSERT/UPDATE → [`opr02_fund.selectById`](../../opr/sql/opr02_fund.md) |
| `opr.Opr03_Reg.delete` | Opr03_Tabpage_Reg_Manager:245 | [`Opr03_Reg.java:95`](../../opr/services/Opr03_Reg.md) | `UpdateDataModel(opr03_reg)` 동적 DELETE |
| `opr.Opr03_Reg.selectByCreateId` | Opr03_Tabpage_Reg_Manager:177 | [`Opr03_Reg.java:23`](../../opr/services/Opr03_Reg.md) | [`opr03_reg.selectByCreateId`](../../opr/sql/opr03_reg.md) |
| `opr.Opr03_Reg.update` | Opr03_Tabpage_Reg_Manager:193 | [`Opr03_Reg.java:90`](../../opr/services/Opr03_Reg.md) | `UpdateDataModel(opr03_reg)` 동적 INSERT/UPDATE → [`opr03_reg.selectById`](../../opr/sql/opr03_reg.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp00_trans_info`](../../../db/views.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd00_fund`](../../../db/views.md), [`fnd08_org_auth`](../../../db/tables/fnd.md), [`opr01_create`](../../../db/tables/opr.md), [`opr02_fund`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_max_workdate`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Opr01_Tab_Create_Manager (`client/vi/opr/Opr01_Tab_Create_Manager.java`, 352줄)

- 레이아웃: north=vlc, west=fundGrid, center=regGrid
- 입력·하위 화면: `searchYear` TextField, `searchTitle` TextField, `termCdComboBox` ComboBoxField("TermCodeOpr", "%", "전체"), `progressCheckBox` CheckBox, `closeCheckBox` CheckBox, `aprCheckBox` CheckBox, `lookupApr` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - title 200 "제목" Text 편집:TextField
  - year 50 "년도" Text 편집:TextField
  - termNm 100 "기간구분" Text 편집:termCdComboBox
  - startDate 100 "시작일" Date 편집:MyDateField
  - dueDate 100 "완료예정일" Date 편집:MyDateField
  - korName 100 "담당자" Text
  - orgName 100 "부서" Text
  - closeDate 100 "등록완료일" Date
  - aprNm 80 "결재상태" Text
  - aprDate 100 "결재완료일" Date
  - actionCell 60 "결재요청" Cell 편집:aprButton
  - note 300 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L65-138) → retrieve()
[E1] searchYear[년도].EnterKey [Enter] (L74) → retrieve()
[E2] searchTitle[제목].EnterKey [Enter] (L77) → retrieve()
[E3] searchBarBuilder[조회].Retrieve (L98) → retrieve()
[E4] searchBarBuilder[삭제].Delete (L99) → deleteRow()
       └ [E9] msgBox.DialogHide [YES] (L308) → 서비스 opr.Opr01_Create.delete
[E5] searchBarBuilder[등록].Insert (L100) → insertRow()
[E6] searchBarBuilder[저장].Update (L101) → update()
[E7] grid.RowClick (L107) → retrievePage()
[E8] termCdComboBox[TermCodeOpr].Collapse (L150) → 인라인 L150-156 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertAppr() | L190-199 | buildGrid | 서비스 opr.Opr01_Create.insertAppr | 업무 |
| public retrieve() | L202-227 | 생성자,E1,E2,E3,getServiceResult | 서비스 opr.Opr01_Create.selectByTitle(companyId, userId, year, termCd, title, progressYn, closeYn, aprYn) | 업무 |
| public update() | L230-236 | E6 | 서비스 opr.Opr01_Create.update | 업무 |
| private chkPreUpdate() | L238-267 | update | 상태 처리 | 업무 |
| public insertRow() | L270-281 | E5 | 상태 처리 | 업무 |
| public deleteRow() | L284-324 | E4 | 미선택 시 alert "삭제할 보고서를 선택해주세요" → 확인창 E9 | 업무 |
| protected retrievePage() | L326-333 | E7,retrieve | 상태 처리 | 업무 |
| public getServiceResult() | L336-349 | 공개 메서드 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private buildGrid() | L140-188 | 필드 초기화 | 미선택 시 alert "상신 전입니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 200, '제목', { editor: 'text' }),  // L146
  gb.text('year', 50, '년도', { editor: 'text' }),  // L147
  gb.text('termNm', 100, '기간구분', { editor: 'select' }),  // L157 SQL 계산 컬럼(selectById: f_cdnm('TermCodeOpr', a.opr01_term_cd, …)
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L158
  gb.date('dueDate', 100, '완료예정일', { editor: 'date' }),  // L159
  gb.text('korNm', 100, '담당자'),  // L160
  // ⚠DB없음 L162 orgName 100 "부서" (opr01_org_name 컬럼 없음)
  gb.date('closeDate', 100, '등록완료일'),  // L163
  gb.text('aprNm', 80, '결재상태'),  // L164 SQL 계산 컬럼(selectById: CASE c.apr01_status_cd WHEN null THEN '…)
  gb.date('apprDate', 100, '결재완료일'),  // L165
  // ⚠ 대응 없음 (GridBuilder L185) addCell
  gb.text('note', 300, '비고', { editor: 'text' }),  // L186
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Opr03_Tabpage_Reg_Manager (`client/vi/opr/Opr03_Tabpage_Reg_Manager.java`, 261줄)

- 입력·하위 화면: `lookupEmpInfo` LookupTriggerField, `lookupEmp` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - seq 40 "순서" Text 편집:TextField
  - korName 100 "담당자" Text 편집:lookupEmpInfo
  - orgName 150 "부서" Text
  - docNm 150 "운용보고서 첨부파일" Text
  - actionCellUp 80 "파일등록" Cell 편집:fileUpButton
  - actionCellDown 80 "파일받기" Cell 편집:fileDownButton
  - regDate 100 "등록일" Date 편집:MyDateField
  - closeYnFlag 80 "완료" Boolean
  - note 100 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L56-70) → setGrid()
[E1] searchBarBuilder[삭제].Delete (L63) → deleteRow()
       └ [E6] msgBox.DialogHide [YES] (L238) → 서비스 opr.Opr03_Reg.delete
[E2] searchBarBuilder[등록].Insert (L64) → insertRow()
[E3] searchBarBuilder[저장].Update (L65) → update()
[E4] fileUpdownForm.Change (L80) → update()
[E5] lookupEmpInfo.TriggerClick (L111) → findEmp()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setGrid() | L72-103 | 생성자 | 상태 처리 | 업무 |
| private findEmp() | L149-167 | E5 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L169-178 | 공개 메서드 | 서비스 opr.Opr03_Reg.selectByCreateId(companyId, createId, empId) | 업무 |
| public retrieve() | L181-183 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L186-194 | E3,E4 | 서비스 opr.Opr03_Reg.update | 업무 |
| private chkPreUpdate() | L196-217 | update | 상태 처리 | 업무 |
| public insertRow() | L220-232 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L235-255 | E1 | ConfirmBox → E6 | 업무 |
| private buildGrid() | L105-147 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L257-259 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('seq', 40, '순서', { editor: 'text' }),  // L135
  gb.text('korNm', 100, '담당자'),  // L136
  // ⚠DB없음 L138 orgName 150 "부서" (sys10_org_name 컬럼 없음)
  gb.text('docNm', 150, '운용보고서 첨부파일'),  // L139
  // ⚠ 대응 없음 (GridBuilder L140) addCell
  // ⚠ 대응 없음 (GridBuilder L141) addCell
  gb.date('regDate', 100, '등록일', { editor: 'date' }),  // L142
  // ⚠DB없음 L143 closeYnFlag 80 "완료" (sys10_close_yn_flag 컬럼 없음)
  gb.text('note', 100, '비고', { editor: 'text' }),  // L144
];
```

#### 사용된 버튼들
1. <Button type="delete" onClick={deleteRow}>삭제</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>

### Opr02_Tabpage_Fund_Manager (`client/vi/opr/Opr02_Tabpage_Fund_Manager.java`, 222줄)

- 입력·하위 화면: `lookupFund` Opr02_Lookup_Fund, `popup_fund` Fnd01_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - fundCode 80 "펀드코드" Text
  - fundName 250 "펀드명" Text
  - fundTypeName 80 "펀드유형" Text
  - empName1 100 "운용역" Text
  - startDate 100 "설정일" Date
  - publicName 80 "공모/사모" Text
  - orgCodeName 200 "운용부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L46-68) → 초기화
[E1] searchBarBuilder[삭제].Delete (L53) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L190) → 서비스 opr.Opr02_Fund.delete
[E2] searchBarBuilder[등록].Insert (L54) → insertRow()
[E3] fundButton[펀드불러오기].Select (L57) → LookupFund()
[E4] searchBarBuilder[저장].Update (L65) → update()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| protected LookupFund() | L70-104 | E3 | 조회창 Opr02_Lookup_Fund 열기 | 업무 |
| public retrieve() | L122-131 | update | 서비스 opr.Opr02_Fund.selectByCreateId(companyId, orgId, createId) | 업무 |
| public retrieve() | L134-136 | update | 상태 처리 | 업무 |
| public insertRow() | L139-178 | E2 | 조회창 Fnd01_Lookup_SelectMulti 열기 | 업무 |
| public deleteRow() | L181-206 | E1 | ConfirmBox → E5 | 업무 |
| public update() | L209-217 | E4 | 서비스 opr.Opr02_Fund.update | 업무 |
| private buildGrid() | L106-120 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L218-220 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 80, '펀드코드'),  // L111
  gb.text('fundNm', 250, '펀드명'),  // L112
  gb.text('fundTypeNm', 80, '펀드유형'),  // L113
  gb.text('emp1Nm', 100, '운용역'),  // L114
  gb.date('startDate', 100, '설정일'),  // L115
  gb.text('publicNm', 80, '공모/사모'),  // L116
  gb.text('orgCodeNm', 200, '운용부서'),  // L117
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={LookupFund}>펀드불러오기</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Opr02_Lookup_Fund (`client/vi/opr/Opr02_Lookup_Fund.java`, 220줄)

- 툴바 `searchBar`: {searchYearField} {searchField} {retrieveButton}
- 입력·하위 화면: `searchTitle` TextField, `searchYear` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - title 200 "*제목" Text
  - year 80 "년도" Text
  - termNm 80 "기간구분" Text
  - korName 100 "담당자" Text
  - posName 80 "직위" Text
  - orgName 200 "부서" Text
  - startDate 100 "시작일" Date
  - closeDate 100 "완료일" Date
- 그리드 `grid2` (buildGrid2(), 체크박스(다중)):
  - fundCode 70 "펀드코드" Text
  - fundName 250 "펀드명" Text
  - fundTypeName 80 "펀드유형" Text
  - empName1 70 "운용역" Text
  - startDate 80 "설정일" Date
  - publicName 70 "공모/사모" Text
  - orgCodeName 150 "운용부서" Text

#### 이벤트
[E1] searchYear[년도].KeyPress [Enter] (L71) → retrieve()
[E2] searchTitle[검색*].KeyPress [Enter] (L85) → retrieve()
[E3] retrieveButton[조회].Select (L98) → retrieve()
[E4] grid.SelectionChanged [선택>0] (L117) → retrieve2()
[E5] okButton[확인].Select (L126) → confirm()
[E6] cancelButton[취소].Select (L134) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L58-145 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid2() | L162-174 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L176-189 | E1,E2,E3,open | 서비스 opr.Opr01_Create.selectByLookupTitle(companyId, title, year) | 업무 |
| private retrieve2() | L191-198 | E4 | 서비스 opr.Opr02_Fund.selectByCreateId(companyId, createId, orgId) | 업무 |
| private confirm() | L200-210 | E5 | 미선택 시 alert "조회할 펀드를 선택해주세요" | 업무 |
| private buildGrid() | L147-160 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L212-214 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L216-218 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 200, '*제목'),  // L151
  gb.text('year', 80, '년도'),  // L152
  gb.text('termNm', 80, '기간구분'),  // L153 SQL 계산 컬럼(selectByLookupTitle: f_cdnm('TermCodeOpr', a.opr01_term_cd, …)
  gb.text('korNm', 100, '담당자'),  // L154
  gb.text('posNm', 80, '직위'),  // L155
  // ⚠DB없음 L156 orgName 200 "부서" (opr01_org_name 컬럼 없음)
  gb.date('startDate', 100, '시작일'),  // L157
  gb.date('closeDate', 100, '완료일'),  // L158
];

const buildGrid2 = () => [
  gb.text('fundCd', 70, '펀드코드'),  // L166
  gb.text('fundNm', 250, '펀드명'),  // L167
  gb.text('fundTypeNm', 80, '펀드유형'),  // L168
  gb.text('emp1Nm', 70, '운용역'),  // L169
  gb.date('startDate', 80, '설정일'),  // L170
  gb.text('publicNm', 70, '공모/사모'),  // L171
  gb.text('orgCodeNm', 150, '운용부서'),  // L172
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

