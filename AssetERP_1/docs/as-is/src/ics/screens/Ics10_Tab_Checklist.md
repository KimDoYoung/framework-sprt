# Ics10_Tab_Checklist

- 종류: 화면
- 메뉴: 준법감시 > 30. 내부통제 체크리스트 > 내부통제 체크리스트 관리 (#1228)
- 파일: `client/vi/ics/Ics10_Tab_Checklist.java`
- 함께 쓰는 클래스 6개:
  - `Ics21_Lookup_CheckList` `client/vi/ics/Ics21_Lookup_CheckList.java`
  - `Ics23_TabPage_CheckList` `client/vi/ics/Ics23_TabPage_CheckList.java`
  - `Ics10_Lookup_UseYn` `client/vi/ics/Ics10_Lookup_UseYn.java`
  - `Ics10_Lookup_Rd_Checklist` `client/vi/ics/Ics10_Lookup_Rd_Checklist.java`
  - `Ics10_Lookup_ExcelUpload` `client/vi/ics/Ics10_Lookup_ExcelUpload.java`
  - `Ics10_Edit_Checklist` `client/vi/ics/Ics10_Edit_Checklist.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sch05_Page_RelateIcs`](../../sch/components/Sch05_Page_RelateIcs.md), [`Sch22_Lookup_WriteGroup`](../../sch/components/Sch22_Lookup_WriteGroup.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics10_Checklist.delete` | Ics10_Tab_Checklist:470 | [`Ics10_Checklist.java:121`](../../ics/services/Ics10_Checklist.md) | `UpdateDataModel(ics10_checklist)` 동적 DELETE |
| `ics.Ics10_Checklist.modelUpdate` | Ics10_Edit_Checklist:320 | [`Ics10_Checklist.java:69`](../../ics/services/Ics10_Checklist.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md), `UpdateDataModel(ics10_checklist)` 동적 INSERT/UPDATE → [`ics10_checklist.selectById`](../../ics/sql/ics10_checklist.md) |
| `ics.Ics10_Checklist.preDelete` | Ics10_Tab_Checklist:432 | [`Ics10_Checklist.java:91`](../../ics/services/Ics10_Checklist.md) | [`ics15_checklist_write.deleteChecklistIdCheck`](../../ics/sql/ics15_checklist_write.md) |
| `ics.Ics10_Checklist.selectBySearchText` | Ics10_Lookup_UseYn:276, Ics10_Tab_Checklist:498 | [`Ics10_Checklist.java:27`](../../ics/services/Ics10_Checklist.md) | [`ics10_checklist.selectBySearchText`](../../ics/sql/ics10_checklist.md) |
| `ics.Ics11_ChecklistCompany.updateUseYn` | Ics10_Lookup_UseYn:290 | [`Ics11_ChecklistCompany.java:59`](../../ics/services/Ics11_ChecklistCompany.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics10_checklist.updateUseYn`](../../ics/sql/ics10_checklist.md), [`ics11_checklist_company.insert`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectByChecklistId`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md) |
| `ics.Ics11_ChecklistCompany.updateWriteGroupId` | Ics10_Tab_Checklist:373 | [`Ics11_ChecklistCompany.java:101`](../../ics/services/Ics11_ChecklistCompany.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.insert`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectByChecklistId`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.updateWriteGroupId`](../../ics/sql/ics11_checklist_company.md) |
| `ics.Ics21_ChecklistLClass.delete` | Ics21_Lookup_CheckList:237 | [`Ics21_ChecklistLClass.java:121`](../../ics/services/Ics21_ChecklistLClass.md) | `UpdateDataModel(ics21_checklist_l_class)` 동적 DELETE |
| `ics.Ics21_ChecklistLClass.deleteCheck` | Ics21_Lookup_CheckList:209 | [`Ics21_ChecklistLClass.java:33`](../../ics/services/Ics21_ChecklistLClass.md) | [`ics15_checklist_write.deleteLClassIdCheck`](../../ics/sql/ics15_checklist_write.md) |
| `ics.Ics21_ChecklistLClass.selectByCompanyId` | Ics21_Lookup_CheckList:180 | [`Ics21_ChecklistLClass.java:27`](../../ics/services/Ics21_ChecklistLClass.md) | [`ics21_checklist_l_class.selectByCompanyId`](../../ics/sql/ics21_checklist_l_class.md) |
| `ics.Ics21_ChecklistLClass.update` | Ics21_Lookup_CheckList:284 | [`Ics21_ChecklistLClass.java:82`](../../ics/services/Ics21_ChecklistLClass.md) | [`ics22_checklist_l_class_company.insertUpdate`](../../ics/sql/ics22_checklist_l_class_company.md), `UpdateDataModel(ics21_checklist_l_class)` 동적 INSERT/UPDATE → [`ics21_checklist_l_class.selectById`](../../ics/sql/ics21_checklist_l_class.md), `UpdateDataModel(ics21_checklist_l_class)` 동적 INSERT/UPDATE → [`ics21_checklist_l_class.selectById`](../../ics/sql/ics21_checklist_l_class.md) |
| `ics.Ics23_ChecklistMClass.delete` | Ics23_TabPage_CheckList:170 | [`Ics23_ChecklistMClass.java:98`](../../ics/services/Ics23_ChecklistMClass.md) | `UpdateDataModel(ics23_checklist_m_class)` 동적 DELETE |
| `ics.Ics23_ChecklistMClass.deleteCheck` | Ics23_TabPage_CheckList:142 | [`Ics23_ChecklistMClass.java:38`](../../ics/services/Ics23_ChecklistMClass.md) | [`ics15_checklist_write.deleteMClassIdCheck`](../../ics/sql/ics15_checklist_write.md) |
| `ics.Ics23_ChecklistMClass.selectByCompanyId` | Ics23_TabPage_CheckList:236 | [`Ics23_ChecklistMClass.java:27`](../../ics/services/Ics23_ChecklistMClass.md) | [`ics23_checklist_m_class.selectByCompanyId`](../../ics/sql/ics23_checklist_m_class.md) |
| `ics.Ics23_ChecklistMClass.update` | Ics23_TabPage_CheckList:217 | [`Ics23_ChecklistMClass.java:64`](../../ics/services/Ics23_ChecklistMClass.md) | [`ics24_checklist_m_class_company.insertUpdate`](../../ics/sql/ics24_checklist_m_class_company.md), `UpdateDataModel(ics23_checklist_m_class)` 동적 INSERT/UPDATE → [`ics23_checklist_m_class.selectById`](../../ics/sql/ics23_checklist_m_class.md), `UpdateDataModel(ics23_checklist_m_class)` 동적 INSERT/UPDATE → [`ics23_checklist_m_class.selectById`](../../ics/sql/ics23_checklist_m_class.md) |
| `sch.Sch05_RelateIcs.modelUpdate` | Ics10_Edit_Checklist:254 | [`Sch05_RelateIcs.java:40`](../../sch/services/Sch05_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE → [`sch05_relate_ics.selectById`](../../sch/sql/sch05_relate_ics.md) |
| `sys.Sys09_Code.selectByIcs21` | Ics10_Edit_Checklist:54, Ics10_Lookup_UseYn:63, Ics10_Tab_Checklist:60 | [`Sys09_Code.java:213`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs21`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByIcs23` | Ics10_Edit_Checklist:55, Ics10_Lookup_UseYn:64, Ics10_Tab_Checklist:61 | [`Sys09_Code.java:222`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs23`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdCheckList` | Ics10_Tab_Checklist:238 | [`Sys99_Print.java:4440`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics10_checklist.selectBySearchText`](../../ics/sql/ics10_checklist.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_create_seq`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics10_Tab_Checklist (`client/vi/ics/Ics10_Tab_Checklist.java`, 509줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 대분류: {icsChecklistLComboBox} 중분류: {icsChecklistMComboBox} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton} {rdButton} {batchMangerButton} {settingButton}
- 입력·하위 화면: `icsChecklistLComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "%", "전체"), `icsChecklistMComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "%", "전체"), `searchText` TextField 빈칸="대분류/중분류/체크내용/근거", `lookup` Ics10_Lookup_UseYn, `lookupChecklist` Ics10_Lookup_Rd_Checklist
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 60 "수정" Cell 편집:actionCell1
  - companyId 40 " " LongLockIcon
  - checkLClassName 180 "대분류" Text
  - checkMClassName 230 "중분류" Text
  - content 600 "체크대상" TextArea
  - criterion 300 "근거" TextArea
  - actionCell 60 "상세보기" Cell 편집:actionCell2
  - writeGroupName 200 "담당그룹" Text

#### 이벤트
[E0] 화면 열림 (생성자 L79-112) → settings()
[E1] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L121) → refreshCode()
[E2] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L132) → retrieve()
[E3] retrieveButton[조회].Select (L142) → retrieve()
[E4] insertButton[등록].Select (L148) → insertRow()
[E5] deleteButton[삭제].Select (L154) → deleteChk()
       └ [E14] msgBox.DialogHide [YES] (L447) → deleteRow()
[E6] batchMangerButton[담당그룹 지정].Select (L160) → batchMangerChk()
       └ [E13] msgBox.DialogHide [YES] (L332) → batchManger()
[E7] settingButton[기본설정].Select (L166) → 인라인 L166-177 (new SelectHandler() { @Override publi…)
[E8] useYnButton[사용여부설정].Select (L178) → retrieve()
[E9] checkListButton[분류관리].Select (L190) → refreshCode()
[E10] mangerButton[담당그룹관리].Select (L203) → 인라인 L203-209 (new SelectHandler() { @Override publi…)
[E11] uploadButton[데이터업로드].Select (L210) → retrieve()
[E12] rdButton[출력/다운로드].Select (L222) → 서비스 sys.Sys99_Print.insertRdCheckList(companyId, personId, windowClassName, checklistLClassId, checklistMClassId, useYn, searchText, stdDate)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private refreshCode() | L265-277 | E1,E9 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| private batchMangerChk() | L329-347 | E6 | ConfirmBox → E13 | 업무 |
| public batchManger() | L349-388 | E13 | 조회창 Sch22_Lookup_WriteGroup 열기, 미선택 시 alert "대상을 먼저 선택해주세요", 서비스 ics.Ics11_ChecklistCompany.updateWriteGroupId(writeGroupId, companyId) | 업무 |
| private insertRow() | L390-414 | E4 | 팝업 Ics10_Edit_Checklist 열기 | 업무 |
| private deleteChk() | L416-465 | E5 | ConfirmBox → E14 | 업무 |
| private deleteRow() | L467-476 | E14 | GridDeleteData ics.Ics10_Checklist.delete(체크된 행 목록) | 업무 |
| public retrieve() | L478-504 | E2,E3,E8,E11,refreshCode,buildGrid,batchManger,insertRow,deleteRow | 서비스 ics.Ics10_Checklist.selectBySearchText(companyId, checklistLClassId, checklistMClassId, useYn, searchText, stdDate) | 업무 |
| private settings() | L114-263 | 생성자 | 팝업 SettingPopup 열기, 조회창 Ics10_Lookup_UseYn 열기 → 콜백: unmask, 조회창 Ics21_Lookup_CheckList 열기 → 콜백: unmask, 조회창 Sch22_Lookup_WriteGroup 열기 → 콜백: unmask, 조회창 Ics10_Lookup_ExcelUpload 열기 → 콜백: unmask, 조회창 Ics10_Lookup_Rd_Checklist 열기 → 콜백: unmask, 서비스 sys.Sys99_Print.insertRdCheckList(companyId, personId, windowClassName, checklistLClassId, checklistMClassId, useYn, searchText, stdDate), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L279-327 | 필드 초기화 | 팝업 Ics10_Edit_Checklist 열기, 미선택 시 alert "수정 불가능한 체크리스트입니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L506-508 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L317) addCell
  // ⚠ 대응 없음 (GridBuilder L318) addLongLockIcon
  gb.text('checkLClassNm', 180, '대분류'),  // L319 SQL 계산 컬럼(selectBySearchText: ics21_checklist_l_class_nm)
  gb.text('checkMClassNm', 230, '중분류'),  // L320 SQL 계산 컬럼(selectBySearchText: ics23_checklist_m_class_nm)
  gb.textArea('content', 600, '체크대상'),  // L321
  gb.textArea('criterion', 300, '근거'),  // L322
  // ⚠ 대응 없음 (GridBuilder L323) addCell
  gb.text('writeGroupNm', 200, '담당그룹'),  // L324 SQL 계산 컬럼(selectBySearchText: ( SELECT sch22_write_group_nm FROM sch2…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>
4. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdCheckList(companyId, personId, windowClassName, checklistLClassId, checklistMClassId, useYn, searchText, stdDate) */}>출력/다운로드</Button>
5. <Button type="assign" onClick={batchMangerChk}>담당그룹 지정</Button>
6. <Button type="settings" onClick={() => /* 인라인 L166-177 (new SelectHandler() { @Override publi…) */}>기본설정</Button>
7. <Button type="view" onClick={retrieve}>사용여부설정</Button>
8. <Button type="unknown" onClick={() => /* 인라인 L203-209 (new SelectHandler() { @Override publi…) */}>담당그룹관리</Button>
9. <Button type="register" onClick={refreshCode}>분류관리</Button>
10. <Button type="unknown" onClick={retrieve}>데이터업로드</Button>

### Ics21_Lookup_CheckList (`client/vi/ics/Ics21_Lookup_CheckList.java`, 296줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `tabPage` Ics23_TabPage_CheckList
- 그리드 `grid` (buildGrid(), 체크박스):
  - companyId 40 "" LongLockIcon
  - checklistLClassName 200 "대분류명" Text 편집:TextField
  - seq 50 "순서" Long 편집:LongField
  - note 150 "비고" Text 편집:TextField
  - useYn 100 "사용여부" Boolean
  - closeDate 100 "사용종료일" Date 편집:MyDateField

#### 이벤트
[E1] retrieveButton[조회].Select (L117) → retrieve()
[E2] insertButton[등록].Select (L123) → insertRow()
[E3] updateButton[저장].Select (L129) → update()
[E4] deleteButton[삭제].Select (L135) → deleteCheck()
[E5] cancelButton[닫기].Select (L141) → hide()
[E6] grid.RowClick (L148) → 인라인 L148-157 (new RowClickHandler(){ @Override publ…)
[E7] msgBox.DialogHide [YES] (L230) → 서비스 ics.Ics21_ChecklistLClass.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L81-114 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L116-159 | open | 상태 처리 | 업무 |
| public retrieve() | L177-186 | E1,open,update | 서비스 ics.Ics21_ChecklistLClass.selectByCompanyId(companyId) | 업무 |
| private insertRow() | L188-195 | E2 | 상태 처리 | 업무 |
| private deleteCheck() | L197-225 | E4 | 서비스 ics.Ics21_ChecklistLClass.deleteCheck(companyId) | 업무 |
| private deleteRow() | L227-248 | deleteCheck | 확인창 표시, GridDeleteData ics.Ics21_ChecklistLClass.delete(체크된 행 목록) | 업무 |
| private update() | L250-291 | E3 | 서비스 ics.Ics21_ChecklistLClass.update(companyId) | 업무 |
| package buildGrid() | L161-175 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L293-295 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L167) addLongLockIcon
  gb.text('checklistLClassNm', 200, '대분류명', { editor: 'text' }),  // L168
  gb.long('seq', 50, '순서', { editor: 'number' }),  // L169
  gb.text('note', 150, '비고', { editor: 'text' }),  // L170
  gb.boolean('useYn', 100, '사용여부'),  // L171
  gb.date('closeDate', 100, '사용종료일', { editor: 'date' }),  // L172
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteCheck}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics23_TabPage_CheckList (`client/vi/ics/Ics23_TabPage_CheckList.java`, 246줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - companyId 40 "" LongLockIcon
  - checklistMClassName 200 "중분류명" Text 편집:TextField
  - seq 50 "순서" Long 편집:LongField
  - note 150 "비고" Text 편집:TextField
  - useYn 100 "사용여부" Boolean
  - closeDate 100 "사용종료일" Date 편집:MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L55-72) → setting()
[E1] retrieveButton[조회].Select (L75) → retrieve()
[E2] insertButton[등록].Select (L81) → insertRow()
[E3] updateButton[저장].Select (L87) → update()
[E4] deleteButton[삭제].Select (L93) → deleteCheck()
[E5] msgBox.DialogHide [YES] (L163) → 서비스 ics.Ics23_ChecklistMClass.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L74-99 | 생성자 | 상태 처리 | 업무 |
| private insertRow() | L115-128 | E2 | 상태 처리 | 업무 |
| private deleteCheck() | L130-158 | E4 | 서비스 ics.Ics23_ChecklistMClass.deleteCheck(companyId) | 업무 |
| private deleteRow() | L160-181 | deleteCheck | 확인창 표시, GridDeleteData ics.Ics23_ChecklistMClass.delete(체크된 행 목록) | 업무 |
| private update() | L183-224 | E3 | 서비스 ics.Ics23_ChecklistMClass.update(companyId) | 업무 |
| public retrieve() | L226-245 | E1,update | 서비스 ics.Ics23_ChecklistMClass.selectByCompanyId(checklistLClassId, companyId) | 업무 |
| package buildGrid() | L101-113 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L105) addLongLockIcon
  gb.text('checklistMClassNm', 200, '중분류명', { editor: 'text' }),  // L106
  gb.long('seq', 50, '순서', { editor: 'number' }),  // L107
  gb.text('note', 150, '비고', { editor: 'text' }),  // L108
  gb.boolean('useYn', 100, '사용여부'),  // L109
  gb.date('closeDate', 100, '사용종료일', { editor: 'date' }),  // L110
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteCheck}>삭제</Button>

### Ics10_Lookup_UseYn (`client/vi/ics/Ics10_Lookup_UseYn.java`, 311줄)

- 툴바 `buttonBar`: 대분류: {checkLClassName} 중분류: {checkMClassName} 사용여부: {useYnComboBox} 검색: {searchText} {retrieveButton} {updateButton} {selectAllButton} {releaseAllButton}
- 입력·하위 화면: `searchText` TextField 빈칸="대분류/중분류/체크대상", `checkLClassName` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "%", "전체"), `checkMClassName` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "%", "전체"), `useYnComboBox` ComboBoxField("UseYnCode", "%", "전체", "사용"), `lookup` Ics10_Edit_Checklist
- 그리드 `grid` (buildGrid()):
  - checkLClassName 180 "대분류" Text
  - checkMClassName 230 "중분류" Text
  - content 645 "체크대상" TextArea
  - actionCell 60 "상세보기" Cell 편집:actionCell
  - useYn 80 "사용여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L82-122) → settings(), show()
[E1] checkLClassName[sys.Sys09_Code.selectByIcs21].Collapse (L132) → refreshCode()
[E2] checkMClassName[sys.Sys09_Code.selectByIcs23].Collapse (L144) → retrieve()
[E3] useYnComboBox[UseYnCode].Collapse (L152) → retrieve()
[E4] searchText.KeyPress [Enter] (L161) → retrieve()
[E5] retrieveButton[조회].Select (L169) → retrieve()
[E6] updateButton[저장].Select (L175) → update()
[E7] selectAllButton[전체선택].Select (L181) → selectAll()
[E8] releaseAllButton[전체해제].Select (L187) → releaseAll()
[E9] cancleButton[닫기].Select (L194) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L67-69 | buildGrid | 상태 처리 | 업무 |
| public open() | L76-80 | 공개 메서드 | 상태 처리 | 업무 |
| private refreshCode() | L203-215 | E1 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| private selectAll() | L242-247 | E7 | 상태 처리 | 업무 |
| private releaseAll() | L249-254 | E8 | 상태 처리 | 업무 |
| public retrieve() | L256-277 | E2,E3,E4,E5,open,refreshCode,buildGrid,update | 서비스 ics.Ics10_Checklist.selectBySearchText(companyId, checklistLClassId, checklistMClassId, useYn, searchText, stdDate) | 업무 |
| private update() | L279-302 | E6 | 서비스 ics.Ics11_ChecklistCompany.updateUseYn(companyId) | 업무 |
| private settings() | L124-201 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L217-240 | 필드 초기화 | 팝업 Ics10_Edit_Checklist 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L304-306 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L308-310 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('checkLClassNm', 180, '대분류'),  // L233 SQL 계산 컬럼(selectBySearchText: ics21_checklist_l_class_nm)
  gb.text('checkMClassNm', 230, '중분류'),  // L234 SQL 계산 컬럼(selectBySearchText: ics23_checklist_m_class_nm)
  gb.textArea('content', 645, '체크대상'),  // L235
  // ⚠ 대응 없음 (GridBuilder L236) addCell
  gb.boolean('useYn', 80, '사용여부'),  // L237
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={selectAll}>전체선택</Button>
4. <Button type="removeRow" onClick={releaseAll}>전체해제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics10_Lookup_Rd_Checklist (`client/vi/ics/Ics10_Lookup_Rd_Checklist.java`, 86줄)


#### 이벤트
[E0] 화면 열림 (생성자 L31-51) → show()
[E1] closeButton[닫기].Select (L40) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-80 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L82-84 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics10_Lookup_ExcelUpload (`client/vi/ics/Ics10_Lookup_ExcelUpload.java`, 127줄)


#### 이벤트
[E0] 화면 열림 (생성자 L43-62) → settings(), show()
[E1] tempDownloadButton[템플릿].Select (L67) → 인라인 L67-72 (new SelectHandler(){ @Override public…)
[E2] excelUploadButton[엑셀업로드].Select (L73) → excelUpload()
[E3] cancleButton[닫기].Select (L79) → hide()
[E4] uploadExcelForm.SubmitComplete (L90) → hide()
[E5] fileUploadField.Change (L114) → 인라인 L114-119 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L38-41 | 공개 메서드 | 상태 처리 | 업무 |
| private excelUpload() | L106-122 | E2 | 상태 처리 | 업무 |
| private settings() | L64-104 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlHeaderStyle() | L124-126 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="download" onClick={() => /* 인라인 L67-72 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
2. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Ics10_Edit_Checklist (`client/vi/ics/Ics10_Edit_Checklist.java`, 345줄)

- 툴바 `buttonBar`: {insertIcsButton} {deleteIcsButton}
- 입력·하위 화면: `checkLClassName` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "선택하세요"), `checkMClassName` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "선택하세요"), `content` MyTextArea, `criterion` MyTextArea, `useYn` CheckBox, `seq` LongField, `checklistMClassId` LongField, `relateIcsPage` Sch05_Page_RelateIcs, `lookup` Ics01_Lookup_SelectMulti

#### 이벤트
[E0] 화면 열림 (생성자 L125-182) → settings(), show()
[E1] checkLClassName[대분류].Collapse (L206) → refreshCode()
[E2] checkMClassName[중분류].Collapse (L226) → 인라인 L226-231 (new CollapseHandler() { @Override pub…)
[E3] insertIcsButton[행 추가].Select (L233) → 서비스 sch.Sch05_RelateIcs.modelUpdate
[E4] deleteIcsButton[행 삭제].Select (L270) → 인라인 L270-275 (new SelectHandler(){ @Override public…)
[E5] updateButton[저장].Select (L276) → update()
[E6] closeButton[닫기].Select [callback == null] (L282) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L80-89 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L91-123 | 공개 메서드 | 상태 처리 | 업무 |
| private refreshCode() | L296-306 | E1 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| private update() | L308-336 | E5 | 서비스 ics.Ics10_Checklist.modelUpdate | 업무 |
| private settings() | L184-294 | 생성자 | 조회창 Ics01_Lookup_SelectMulti 열기, 서비스 sch.Sch05_RelateIcs.modelUpdate, 이벤트 연결, 초기값: checklistMClassId=null, checklistMClassId=Long.parseLong(checkMClassName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L338-340 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L342-344 | edit,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="addRow" onClick={() => /* 서비스 sch.Sch05_RelateIcs.modelUpdate */}>행 추가</Button>
2. <Button type="removeRow" onClick={() => /* 인라인 L270-275 (new SelectHandler(){ @Override public…) */}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

