# Tdm10_Tab_Task

- 종류: 화면
- 메뉴: 책무 > 01. 기본정보 > 책무 등록 (#1412)
- 파일: `client/vi/tdm/Tdm10_Tab_Task.java`
- 함께 쓰는 클래스 5개:
  - `Tdm95_Lookup_ChangeHistory` `client/vi/tdm/Tdm95_Lookup_ChangeHistory.java`
  - `Tdm14_Lookup_TaskType` `client/vi/tdm/Tdm14_Lookup_TaskType.java`
  - `Tdm12_Lookup_TaskRelateDetail` `client/vi/tdm/Tdm12_Lookup_TaskRelateDetail.java`
  - `Tdm11_Lookup_TaskRelateRule` `client/vi/tdm/Tdm11_Lookup_TaskRelateRule.java`
  - `Tdm10_Edit_Task` `client/vi/tdm/Tdm10_Edit_Task.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Bbs15_Lookup_CompanyRule`](../../bbs/components/Bbs15_Lookup_CompanyRule.md), [`Sys09_Lookup_CodeKind`](../../sys/components/Sys09_Lookup_CodeKind.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm10_Task.countUseByTaskId` | Tdm10_Tab_Task:361 | [`Tdm10_Task.java:30`](../../tdm/services/Tdm10_Task.md) | [`tdm10_task.countUseByTaskId`](../../tdm/sql/tdm10_task.md) |
| `tdm.Tdm10_Task.delete` | Tdm10_Tab_Task:420 | [`Tdm10_Task.java:90`](../../tdm/services/Tdm10_Task.md) | [`tdm10_task.countUseByTaskId`](../../tdm/sql/tdm10_task.md), `UpdateDataModel(tdm10_task)` 동적 DELETE |
| `tdm.Tdm10_Task.modelUpdate` | Tdm10_Edit_Task:320 | [`Tdm10_Task.java:43`](../../tdm/services/Tdm10_Task.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm10_task.createCopy`](../../tdm/sql/tdm10_task.md), `UpdateDataModel(tdm10_task)` 동적 INSERT/UPDATE → [`tdm10_task.selectById`](../../tdm/sql/tdm10_task.md) |
| `tdm.Tdm10_Task.selectById` | Tdm11_Lookup_TaskRelateRule:369 | [`Tdm10_Task.java:20`](../../tdm/services/Tdm10_Task.md) | [`tdm10_task.selectById`](../../tdm/sql/tdm10_task.md) |
| `tdm.Tdm10_Task.selectByText` | Tdm10_Tab_Task:321 | [`Tdm10_Task.java:25`](../../tdm/services/Tdm10_Task.md) | [`tdm10_task.selectByText`](../../tdm/sql/tdm10_task.md) |
| `tdm.Tdm11_TaskRelateRule.delete` | Tdm11_Lookup_TaskRelateRule:349 | [`Tdm11_TaskRelateRule.java:59`](../../tdm/services/Tdm11_TaskRelateRule.md) | `UpdateDataModel(tdm11_task_relate_rule)` 동적 DELETE |
| `tdm.Tdm11_TaskRelateRule.selectBySearchText` | Tdm11_Lookup_TaskRelateRule:232 | [`Tdm11_TaskRelateRule.java:25`](../../tdm/services/Tdm11_TaskRelateRule.md) | [`tdm11_task_relate_rule.selectBySearchText`](../../tdm/sql/tdm11_task_relate_rule.md) |
| `tdm.Tdm11_TaskRelateRule.update` | Tdm11_Lookup_TaskRelateRule:337 | [`Tdm11_TaskRelateRule.java:35`](../../tdm/services/Tdm11_TaskRelateRule.md) | [`tdm11_task_relate_rule.countUseByRuleCode`](../../tdm/sql/tdm11_task_relate_rule.md), `UpdateDataModel(tdm11_task_relate_rule)` 동적 INSERT/UPDATE → [`tdm11_task_relate_rule.selectById`](../../tdm/sql/tdm11_task_relate_rule.md) |
| `tdm.Tdm12_TaskRelateDetail.countByTaskDetailId` | Tdm12_Lookup_TaskRelateDetail:312 | [`Tdm12_TaskRelateDetail.java:47`](../../tdm/services/Tdm12_TaskRelateDetail.md) | [`tdm12_task_relate_detail.countByTaskDetailId`](../../tdm/sql/tdm12_task_relate_detail.md) |
| `tdm.Tdm12_TaskRelateDetail.delete` | Tdm12_Lookup_TaskRelateDetail:370 | [`Tdm12_TaskRelateDetail.java:75`](../../tdm/services/Tdm12_TaskRelateDetail.md) | [`tdm12_task_relate_detail.countByTaskDetailId`](../../tdm/sql/tdm12_task_relate_detail.md), `UpdateDataModel(tdm12_task_relate_detail)` 동적 DELETE |
| `tdm.Tdm12_TaskRelateDetail.selectByTaskId` | Tdm12_Lookup_TaskRelateDetail:191 | [`Tdm12_TaskRelateDetail.java:24`](../../tdm/services/Tdm12_TaskRelateDetail.md) | [`tdm12_task_relate_detail.selectByTaskId`](../../tdm/sql/tdm12_task_relate_detail.md) |
| `tdm.Tdm12_TaskRelateDetail.update` | Tdm12_Lookup_TaskRelateDetail:286 | [`Tdm12_TaskRelateDetail.java:60`](../../tdm/services/Tdm12_TaskRelateDetail.md) | `UpdateDataModel(tdm12_task_relate_detail)` 동적 INSERT/UPDATE → [`tdm12_task_relate_detail.selectById`](../../tdm/sql/tdm12_task_relate_detail.md) |
| `tdm.Tdm14_TaskType.delete` | Tdm14_Lookup_TaskType:304 | [`Tdm14_TaskType.java:63`](../../tdm/services/Tdm14_TaskType.md) | [`tdm14_task_type.countUseByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.selectById`](../../tdm/sql/tdm14_task_type.md), `UpdateDataModel(tdm14_task_type)` 동적 DELETE |
| `tdm.Tdm14_TaskType.selectByCompanyId` | Tdm14_Lookup_TaskType:284 | [`Tdm14_TaskType.java:24`](../../tdm/services/Tdm14_TaskType.md) | [`tdm14_task_type.selectByCompanyId`](../../tdm/sql/tdm14_task_type.md) |
| `tdm.Tdm14_TaskType.update` | Tdm14_Lookup_TaskType:356 | [`Tdm14_TaskType.java:29`](../../tdm/services/Tdm14_TaskType.md) | [`tdm14_task_type.countDupByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.countUseByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.selectTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), `UpdateDataModel(tdm14_task_type)` 동적 INSERT/UPDATE → [`tdm14_task_type.selectById`](../../tdm/sql/tdm14_task_type.md) |
| `tdm.Tdm95_ChangeHistory.selectByTargetId` | Tdm95_Lookup_ChangeHistory:221 | [`Tdm95_ChangeHistory.java:20`](../../tdm/services/Tdm95_ChangeHistory.md) | [`tdm95_change_history.selectByTargetId`](../../tdm/sql/tdm95_change_history.md) |
| `tdm.Tdm96_ChangeDetail.selectByChangeHistoryId` | Tdm95_Lookup_ChangeHistory:237 | [`Tdm96_ChangeDetail.java:22`](../../tdm/services/Tdm96_ChangeDetail.md) | [`tdm96_change_detail.selectByChangeHistoryId`](../../tdm/sql/tdm96_change_detail.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm21_role_relate_task`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm95_change_history`](../../../db/tables/tdm.md), [`tdm96_change_detail`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_create_tdm10copy`, `f_sysdate`, `f_today`, `getcompanyrule`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm10_Tab_Task (`client/vi/tdm/Tdm10_Tab_Task.java`, 438줄)

- 레이아웃: center=vlc
- 툴바 `buttonBarL`: 기준일: {baseDate} {allYn} 책무구분: {taskClassComboBox} 검색: {searchText} {retrieveButton} {insertButton} {copyButton} {deleteButton}
- 툴바 `buttonBarR`: {taskTypeButton} {historyButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="책무유형/책무", `allYn` CheckBox, `taskClassComboBox` ComboBoxField("TdmTaskClassCode", "%", "전체", "전체"), `lookup` Tdm14_Lookup_TaskType
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 50 "수정" Cell 편집:actionCell01
  - taskClassName 120 "책무구분" Text
  - taskTypeName 250 "책무유형" Text
  - taskName 350 "책무" TextArea
  - taskRelateDetailCntStr 60 "세부내용" TextCenter
  - actionCell 35 " " Cell 편집:actionCell02
  - taskRelateLawCntStr 60 "연결법규" TextCenter
  - actionCell 35 " " Cell 편집:actionCell03
  - taskRelateRuleCntStr 60 "연결내규" TextCenter
  - actionCell 35 " " Cell 편집:actionCell04
  - commonYn 80 "공통책무" BooleanYn2
  - ceoYn 80 "CEO책무" BooleanYn2
  - startDate 90 "사용시작일" Date
  - endDate 90 "사용종료일" Date
  - updName 80 "변경자" TextCenter
  - updDateStr 150 "변경일시" TextCenter
  - actionCell 70 "변경이력 " Cell 편집:historyCell

#### 이벤트
[E0] 화면 열림 (생성자 L81-123) → settings(), retrieve()
[E1] allYn[전체보기].ValueChange [allYn.getValue()] (L131) → retrieve()
[E2] taskClassComboBox[TdmTaskClassCode].Collapse (L144) → retrieve()
[E3] searchText.KeyPress [Enter] (L153) → retrieve()
[E4] retrieveButton[조회].Select (L162) → retrieve()
[E5] insertButton[등록].Select (L168) → insertRow()
[E6] copyButton[등록(복사)].Select (L174) → copyRow()
[E7] deleteButton[삭제].Select (L180) → deleteChk()
       └ [E11] msgBox.DialogHide [YES] (L375) → execute(), deleteRow()
[E8] taskTypeButton[책무유형 관리].Select (L186) → 인라인 L186-192 (new SelectHandler() { @Override publi…)
[E9] historyButton[변경이력].Select (L193) → 인라인 L193-199 (new SelectHandler() { @Override publi…)
[E10] taskClassComboBox[TdmTaskClassCode].Collapse (L204) → 인라인 L204-212 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L67-70 | E11,buildGrid,retrieve,insertRow,copyRow,deleteRow | 상태 처리 | 업무 |
| public retrieve() | L312-327 | 생성자,E1,E2,E3,E4,execute,buildGrid,insertRow,copyRow | 서비스 tdm.Tdm10_Task.selectByText(companyId, baseDate, taskClassCode, allYn, searchText) | 업무 |
| public insertRow() | L329-337 | E5 | 팝업 Tdm10_Edit_Task 열기 | 업무 |
| public copyRow() | L339-352 | E6 | 팝업 Tdm10_Edit_Task 열기 | 업무 |
| private deleteChk() | L354-411 | E7 | 미선택 시 alert "삭제대상을 선택하세요" → 확인창 E11 | 업무 |
| public deleteRow() | L413-430 | E11 | GridDeleteData tdm.Tdm10_Task.delete(체크된 행 목록) | 업무 |
| private settings() | L125-200 | 생성자 | 조회창 Tdm14_Lookup_TaskType 열기, 조회창 Tdm95_Lookup_ChangeHistory 열기, 이벤트 연결, 초기값: baseDate=LoginUser.getToday(, allYn=true("전체보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L202-310 | 필드 초기화 | 팝업 Tdm10_Edit_Task 열기, 조회창 Tdm12_Lookup_TaskRelateDetail 열기, 조회창 Tdm11_Lookup_TaskRelateRule 열기, 조회창 Tdm95_Lookup_ChangeHistory 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L432-434 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L435-437 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L291) addCell
  gb.text('taskClassNm', 120, '책무구분'),  // L292
  gb.text('taskTypeNm', 250, '책무유형'),  // L293
  gb.textArea('taskNm', 350, '책무'),  // L294
  gb.textCenter('taskRelateDetailCntStr', 60, '세부내용'),  // L295
  // ⚠ 대응 없음 (GridBuilder L296) addCell
  // ⚠DB없음 L297 taskRelateLawCntStr 60 "연결법규" (tdm12_task_relate_law_cnt_str 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L298) addCell
  // ⚠DB없음 L299 taskRelateRuleCntStr 60 "연결내규" (tdm12_task_relate_rule_cnt_str 컬럼 없음)
  // ⚠ 대응 없음 (GridBuilder L300) addCell
  gb.booleanYn2('commonYn', 80, '공통책무'),  // L301
  gb.booleanYn2('ceoYn', 80, 'CEO책무'),  // L302
  gb.date('startDate', 90, '사용시작일'),  // L303
  gb.date('endDate', 90, '사용종료일'),  // L304
  gb.textCenter('updNm', 80, '변경자'),  // L305
  gb.textCenter('updDateStr', 150, '변경일시'),  // L306
  // ⚠ 대응 없음 (GridBuilder L307) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={copyRow}>등록(복사)</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="save" onClick={() => /* 인라인 L186-192 (new SelectHandler() { @Override publi…) */}>책무유형 관리</Button>
6. <Button type="unknown" onClick={() => /* 인라인 L193-199 (new SelectHandler() { @Override publi…) */}>변경이력</Button>

### Tdm95_Lookup_ChangeHistory (`client/vi/tdm/Tdm95_Lookup_ChangeHistory.java`, 254줄)

- 툴바 `buttonBar`: 구분: {dmlTypeComboBox} 검색: {searchText} {retrieveButton} * '사유' 및 '변경 전/후 데이터'는 더블 클릭하여 넓은 팝업으로 볼 수 있습니다:
- 입력·하위 화면: `dmlTypeComboBox` ComboBoxField("DataDmlType", "%", "전체", "전체"), `searchText` TextField 빈칸="처리자/사유/변경항목"
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - rowNum 50 " " LongCenter
  - changeDateStr 150 "처리일시" TextCenter
  - changeEmpName 80 "처리자" TextCenter
  - changeType 70 "처리구분" TextCenter
  - reason 300 "사유" Text
- 그리드 `detailGrid` (detailBuildGrid()):
  - windowItemName 150 "변경항목" Text
  - beforeData 250 "변경 전 데이터" Text
  - afterData 250 "변경 후 데이터" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-65) → 초기화
[E1] dmlTypeComboBox[DataDmlType].Collapse (L109) → retrieve()
[E2] searchText.KeyPress [Enter] (L118) → retrieve()
[E3] grid.SelectionChanged [selectModel == null] (L127) → detailRetrieve()
[E4] grid.CellDoubleClick [cellIndex == 5] (L137) → 인라인 L137-147 (new CellDoubleClickHandler() { @Overr…)
[E5] detailGrid.CellDoubleClick [cellIndex == 2] (L148) → 인라인 L148-162 (new CellDoubleClickHandler() { @Overr…)
[E6] retrieveButton[조회].Select (L163) → retrieve()
[E7] closeButton[닫기].Select (L169) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L47-50 | retrieve,detailRetrieve | 상태 처리 | 업무 |
| public open() | L67-70 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L72-105 | 공개 메서드 | 상태 처리 | 업무 |
| public detailBuildGrid() | L191-200 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L202-230 | E1,E2,E6,execute | 서비스 tdm.Tdm95_ChangeHistory.selectByTargetId(companyId, targetTable, targetId, changeType, searchText) | 업무 |
| public detailRetrieve() | L232-243 | E3 | 서비스 tdm.Tdm96_ChangeDetail.selectByChangeHistoryId(changeHistoryId) | 업무 |
| private settings() | L107-175 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L177-189 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L245-247 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L248-250 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L251-253 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.longCenter('rowNum', 50, ' '),  // L182 SQL 계산 컬럼(selectByTargetId: ROW_NUMBER() OVER(ORDER BY tdm95_change…)
  gb.textCenter('changeDateStr', 150, '처리일시'),  // L183 SQL 계산 컬럼(selectByTargetId: COALESCE(TO_CHAR(tdm95_change_date, 'yy…)
  gb.textCenter('changeEmpNm', 80, '처리자'),  // L184
  gb.textCenter('changeType', 70, '처리구분'),  // L185
  gb.text('reason', 300, '사유'),  // L186
];

const detailBuildGrid = () => [
  gb.text('windowItemNm', 150, '변경항목'),  // L195
  gb.text('beforeData', 250, '변경 전 데이터'),  // L196
  gb.text('afterData', 250, '변경 후 데이터'),  // L197
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm14_Lookup_TaskType (`client/vi/tdm/Tdm14_Lookup_TaskType.java`, 380줄)

- 툴바 `buttonBar`: 책무구분: {taskClassComboBox} {retrieveButton} {useCheckBox} {retrieveButton} {insertRowButton} {updateButton} {deleteButton}
- 입력·하위 화면: `taskClassComboBox` ComboBoxField("TdmTaskClassCode", "%", "전체"), `useCheckBox` CheckBox, `taskClassCombo` ComboBoxField("TdmTaskClassCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - taskClassName 120 "책무구분" TextCenter 편집:taskClassCombo
  - taskTypeCode 100 "책무유형코드" TextCenter 편집:TextField
  - taskTypeName 350 "책무유형명" Text 편집:TextField
  - useYn 70 "사용" Boolean
  - taskClassName 120 "책무구분" TextCenter
  - taskTypeCode 100 "책무유형코드" TextCenter
  - taskTypeName 350 "책무유형명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L67-76) → 초기화
[E1] grid.RowDoubleClick (L126) → selectClose()
[E2] taskClassComboBox[TdmTaskClassCode].Collapse (L152) → retrieve()
[E3] retrieveButton[조회].Select (L162) → retrieve()
[E4] insertRowButton[등록].Select (L168) → insertRow()
[E5] deleteButton[삭제].Select (L174) → delete()
[E6] messageBox.DialogHide (L183) → delete()
[E7] updateButton[저장].Select (L195) → update()
[E8] selectButton[확인].Select (L201) → selectClose()
[E9] selectAllButton[전체].Select [callback != null] (L207) → hide()
[E10] closeButton[닫기].Select [선택>0] (L216) → hide()
[E11] messageBox.DialogHide (L221) → hide()
[E12] taskClassCombo[TdmTaskClassCode].Collapse (L242) → 인라인 L242-248 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L78-82 | 공개 메서드 | 상태 처리 | 업무 |
| public view() | L84-95 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L98-111 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L113-141 | view,edit | 상태 처리 | 업무 |
| private selectClose() | L263-274 | E1,E8 | 미선택 시 alert "선택한 내역이 없습니다" | 업무 |
| private retrieve() | L276-290 | E2,E3,settings,update | 서비스 tdm.Tdm14_TaskType.selectByCompanyId(companyId, taskClassCode, useYn) | 업무 |
| private insertRow() | L292-299 | E4 | 상태 처리 | 업무 |
| private delete() | L301-316 | E5,E6 | GridDeleteData tdm.Tdm14_TaskType.delete | 업무 |
| private update() | L318-369 | E7 | 서비스 tdm.Tdm14_TaskType.update | 업무 |
| private settings() | L143-236 | open | 확인창 표시, 이벤트 연결, 초기값: useCheckBox=true("사용만 보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L238-261 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L371-373 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L374-376 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L377-379 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('taskClassNm', 120, '책무구분'),  // L251 SQL 계산 컬럼(selectByCompanyId: f_cdnm('TdmTaskClassCode', tdm14_task_c…)
  gb.textCenter('taskTypeCd', 100, '책무유형코드', { editor: 'text' }),  // L252
  gb.text('taskTypeNm', 350, '책무유형명', { editor: 'text' }),  // L253
  gb.boolean('useYn', 70, '사용'),  // L254
  gb.textCenter('taskClassNm', 120, '책무구분'),  // L256 SQL 계산 컬럼(selectByCompanyId: f_cdnm('TdmTaskClassCode', tdm14_task_c…)
  gb.textCenter('taskTypeCd', 100, '책무유형코드'),  // L257
  gb.text('taskTypeNm', 350, '책무유형명'),  // L258
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="save" onClick={selectClose}>확인</Button>
6. <Button type="unknown" onClick={hide}>전체</Button>
7. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm12_Lookup_TaskRelateDetail (`client/vi/tdm/Tdm12_Lookup_TaskRelateDetail.java`, 387줄)

- 툴바 `buttonBarL`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBarR`: {historyButton}
- 입력·하위 화면: `lookup` Tdm95_Lookup_ChangeHistory
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - content 550 "책무 세부내용" TextArea 편집:MyTextArea
  - seq 80 "조회순서" LongCenter 편집:LongField
  - useYn 80 "사용여부" Boolean
  - actionCell 70 "변경이력 " Cell 편집:historyCell

#### 이벤트
[E0] 화면 열림 (생성자 L78-110) → settings(), show()
[E1] retrieveButton[조회].Select (L113) → retrieve()
[E2] insertButton[등록].Select (L119) → insertRow()
[E3] updateButton[저장].Select (L125) → preUpdate()
[E4] deleteButton[삭제].Select (L131) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L325) → deleteRow()
[E5] closeButton[닫기].Select [선택>0] (L137) → hide()
[E6] messageBox.DialogHide (L142) → hide()
[E7] historyButton[변경이력].Select (L159) → 인라인 L159-165 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L70-76 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L187-197 | E1,open | 서비스 tdm.Tdm12_TaskRelateDetail.selectByTaskId(taskId) | 업무 |
| private preUpdate() | L199-278 | E3 | 상태 처리 | 업무 |
| private update() | L280-292 | preUpdate | 서비스 tdm.Tdm12_TaskRelateDetail.update(historyMap) | 업무 |
| private insertRow() | L294-303 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L305-361 | E4 | 미선택 시 alert "삭제대상을 선택하세요" → 확인창 E8 | 업무 |
| private deleteRow() | L363-380 | E8 | GridDeleteData tdm.Tdm12_TaskRelateDetail.delete(체크된 행 목록) | 업무 |
| private settings() | L112-166 | 생성자 | 조회창 Tdm95_Lookup_ChangeHistory 열기, 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L168-185 | 필드 초기화 | 조회창 Tdm95_Lookup_ChangeHistory 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L382-384 | 생성자,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textArea('content', 550, '책무 세부내용', { editor: 'largeText' }),  // L180
  gb.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L181
  gb.boolean('useYn', 80, '사용여부'),  // L182
  // ⚠ 대응 없음 (GridBuilder L183) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={preUpdate}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={() => /* 인라인 L159-165 (new SelectHandler() { @Override publi…) */}>변경이력</Button>
6. <Button type="unknown" onClick={hide}>닫기</Button>

### Tdm11_Lookup_TaskRelateRule (`client/vi/tdm/Tdm11_Lookup_TaskRelateRule.java`, 390줄)

- 툴바 `buttonBar`: 구분: {relateTypeComboBox} 검색: {searchText} {insertButton} {deleteButton} {anchor}
- 입력·하위 화면: `searchText` TextField 빈칸="규정/규정코드", `relateTypeComboBox` ComboBoxField("Ruletype", "%", "전체", "1", "법규", "2", "내규", "전체"), `lookup` Sys09_Lookup_CodeKind
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - relateTypeName 80 "구분" TextCenter
  - ruleName 450 "규정" Text
  - ruleCode 100 "규정코드" Text
  - closeDate 100 "종료일자" Date

#### 이벤트
[E1] relateTypeComboBox[Ruletype].Collapse (L127) → retrieve()
[E2] searchText.KeyPress [Enter] (L136) → retrieve()
[E3] anchor.MouseDown (L147) → retrieve()
[E4] insertButton[행 추가].Select (L164) → insertRow()
[E5] deleteButton[행 삭제].Select (L170) → deleteRow()
[E6] updateButton[저장].Select (L176) → update()
[E7] closeButton[닫기].Select [YES] (L182) → close()
[E8] msgBox.DialogHide [YES] (L188) → close()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L86-108 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L222-238 | E1,E2,E3,settings,updateEnd | 서비스 tdm.Tdm11_TaskRelateRule.selectBySearchText(companyId, taskId, relateType, searchText) | 업무 |
| private insertRow() | L240-306 | E4 | 조회창 Sys09_Lookup_CodeKind 열기, 조회창 Bbs15_Lookup_CompanyRule 열기 | 업무 |
| private deleteRow() | L308-319 | E5 | 미선택 시 alert "삭제할 내역을 선택하세요" | 업무 |
| private update() | L321-358 | E6 | GridDeleteData tdm.Tdm11_TaskRelateRule.update, tdm.Tdm11_TaskRelateRule.delete | 업무 |
| private updateEnd() | L360-365 | update | 상태 처리 | 업무 |
| private close() | L367-382 | E7,E8 | 서비스 tdm.Tdm10_Task.selectById(taskId) | 업무 |
| private settings() | L110-209 | open | 확인창 표시, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L211-220 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L384-386 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L387-389 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('relateTypeNm', 80, '구분'),  // L214
  gb.text('ruleNm', 450, '규정'),  // L215
  gb.text('ruleCd', 100, '규정코드'),  // L216
  gb.date('closeDate', 100, '종료일자'),  // L217
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="unknown" onClick={close}>닫기</Button>

### Tdm10_Edit_Task (`client/vi/tdm/Tdm10_Edit_Task.java`, 461줄)

- 입력·하위 화면: `taskClassName` ComboBoxField("TdmTaskClassCode") 빈칸="선택하세요", `taskClassCode` TextField, `taskTypeName` LookupTriggerField, `taskTypeCode` TextField, `taskName` MyTextArea, `commonYn` CheckBox, `ceoYn` CheckBox, `startDate` MyDateField, `endDate` MyDateField, `lookup` Tdm12_Lookup_TaskRelateDetail

#### 이벤트
[E0] 화면 열림 (생성자 L135-150) → setting(), show()
[E1] updateButton[저장].Select (L153) → preUpdate()
[E2] closeButton[닫기].Select (L159) → hide()
[E3] taskClassName[책무구분].Collapse (L166) → 인라인 L166-176 (new CollapseHandler() { @Override pub…)
[E4] taskTypeName[책무유형].TriggerClick (L178) → lookupTaskType()
[E5] relateDetailButton[세부내용(0건)].Select (L185) → 메시지 "책무구분은 필수선택 항목입니다"
[E6] relateRuleButton[연결규정(0건)].Select [result != null] (L207) → 인라인 L207-230 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L79-95 | 공개 메서드 | 상태 처리 | 업무 |
| public copy() | L97-121 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L123-133 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L152-231 | 생성자 | 조회창 Tdm12_Lookup_TaskRelateDetail 열기, 조회창 Tdm11_Lookup_TaskRelateRule 열기, LabelHtml 래퍼 | 업무 |
| private getEditor() | L233-270 | insert,copy,edit | 상태 처리 | 업무 |
| private preUpdate() | L272-317 | E1 | 상태 처리 | 업무 |
| private update() | L319-340 | preUpdate | 서비스 tdm.Tdm10_Task.modelUpdate(actionType, oldTaskId, historyMap) | 업무 |
| private getHistoryMap() | L342-415 | preUpdate | 상태 처리 | 업무 |
| private retrieveRelate() | L417-429 | edit | LabelHtml 래퍼 | 업무 |
| private lookupTaskType() | L431-448 | E4 | 조회창 Tdm14_Lookup_TaskType 열기 | 업무 |
| private setHtmlStyle() | L450-452 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L454-456 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L458-460 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 메시지 "책무구분은 필수선택 항목입니다" */}>세부내용(0건)</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L207-230 (new SelectHandler() { @Override publi…) */}>연결규정(0건)</Button>
3. <Button type="save" onClick={preUpdate}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

