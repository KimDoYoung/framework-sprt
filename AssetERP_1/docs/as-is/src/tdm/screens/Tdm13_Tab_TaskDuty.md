# Tdm13_Tab_TaskDuty

- 종류: 화면
- 메뉴: 책무 > 01. 기본정보 > 관리의무 등록 (#1413)
- 파일: `client/vi/tdm/Tdm13_Tab_TaskDuty.java`
- 함께 쓰는 클래스 3개:
  - `Tdm95_Lookup_ChangeHistory` `client/vi/tdm/Tdm95_Lookup_ChangeHistory.java`
  - `Tdm14_Lookup_TaskType` `client/vi/tdm/Tdm14_Lookup_TaskType.java`
  - `Tdm13_TabPage_TaskDuty` `client/vi/tdm/Tdm13_TabPage_TaskDuty.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `tdm.Tdm12_TaskRelateDetail.selectByText` | Tdm13_Tab_TaskDuty:223 | [`Tdm12_TaskRelateDetail.java:32`](../../tdm/services/Tdm12_TaskRelateDetail.md) | [`tdm12_task_relate_detail.selectByText`](../../tdm/sql/tdm12_task_relate_detail.md) |
| `tdm.Tdm13_TaskRelateDuty.countByDutyId` | Tdm13_TabPage_TaskDuty:258 | [`Tdm13_TaskRelateDuty.java:32`](../../tdm/services/Tdm13_TaskRelateDuty.md) | [`tdm13_task_relate_duty.countByDutyId`](../../tdm/sql/tdm13_task_relate_duty.md) |
| `tdm.Tdm13_TaskRelateDuty.delete` | Tdm13_TabPage_TaskDuty:316 | [`Tdm13_TaskRelateDuty.java:60`](../../tdm/services/Tdm13_TaskRelateDuty.md) | [`tdm13_task_relate_duty.countByDutyId`](../../tdm/sql/tdm13_task_relate_duty.md), `UpdateDataModel(tdm13_task_relate_duty)` 동적 DELETE |
| `tdm.Tdm13_TaskRelateDuty.selectByTaskRelateDetailId` | Tdm13_TabPage_TaskDuty:129 | [`Tdm13_TaskRelateDuty.java:24`](../../tdm/services/Tdm13_TaskRelateDuty.md) | [`tdm13_task_relate_duty.selectByTaskRelateDetailId`](../../tdm/sql/tdm13_task_relate_duty.md) |
| `tdm.Tdm13_TaskRelateDuty.update` | Tdm13_TabPage_TaskDuty:227 | [`Tdm13_TaskRelateDuty.java:45`](../../tdm/services/Tdm13_TaskRelateDuty.md) | `UpdateDataModel(tdm13_task_relate_duty)` 동적 INSERT/UPDATE → [`tdm13_task_relate_duty.selectById`](../../tdm/sql/tdm13_task_relate_duty.md) |
| `tdm.Tdm14_TaskType.delete` | Tdm14_Lookup_TaskType:304 | [`Tdm14_TaskType.java:63`](../../tdm/services/Tdm14_TaskType.md) | [`tdm14_task_type.countUseByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.selectById`](../../tdm/sql/tdm14_task_type.md), `UpdateDataModel(tdm14_task_type)` 동적 DELETE |
| `tdm.Tdm14_TaskType.selectByCompanyId` | Tdm14_Lookup_TaskType:284 | [`Tdm14_TaskType.java:24`](../../tdm/services/Tdm14_TaskType.md) | [`tdm14_task_type.selectByCompanyId`](../../tdm/sql/tdm14_task_type.md) |
| `tdm.Tdm14_TaskType.update` | Tdm14_Lookup_TaskType:356 | [`Tdm14_TaskType.java:29`](../../tdm/services/Tdm14_TaskType.md) | [`tdm14_task_type.countDupByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.countUseByTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), [`tdm14_task_type.selectTaskTypeCode`](../../tdm/sql/tdm14_task_type.md), `UpdateDataModel(tdm14_task_type)` 동적 INSERT/UPDATE → [`tdm14_task_type.selectById`](../../tdm/sql/tdm14_task_type.md) |
| `tdm.Tdm95_ChangeHistory.selectByTargetId` | Tdm95_Lookup_ChangeHistory:221 | [`Tdm95_ChangeHistory.java:20`](../../tdm/services/Tdm95_ChangeHistory.md) | [`tdm95_change_history.selectByTargetId`](../../tdm/sql/tdm95_change_history.md) |
| `tdm.Tdm96_ChangeDetail.selectByChangeHistoryId` | Tdm95_Lookup_ChangeHistory:237 | [`Tdm96_ChangeDetail.java:22`](../../tdm/services/Tdm96_ChangeDetail.md) | [`tdm96_change_detail.selectByChangeHistoryId`](../../tdm/sql/tdm96_change_detail.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`tdm10_task`](../../../db/tables/tdm.md), [`tdm12_task_relate_detail`](../../../db/tables/tdm.md), [`tdm13_task_relate_duty`](../../../db/tables/tdm.md), [`tdm14_task_type`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm95_change_history`](../../../db/tables/tdm.md), [`tdm96_change_detail`](../../../db/tables/tdm.md)

## DB 함수

`f_cdnm`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Tdm13_Tab_TaskDuty (`client/vi/tdm/Tdm13_Tab_TaskDuty.java`, 258줄)

- 레이아웃: center=vlc, south=dutyPage
- 툴바 `buttonBarL`: 기준일: {baseDate} {allYn} 책무유형: {taskTypeName} 검색: {searchText} {retrieveButton}
- 툴바 `buttonBarR`: {historyButton}
- 입력·하위 화면: `baseDate` MyDateField, `searchText` TextField 빈칸="책무/책무세부내용", `allYn` CheckBox, `taskTypeName` LookupTriggerField 빈칸="전체", `dutyPage` Tdm13_TabPage_TaskDuty, `lookup` Tdm95_Lookup_ChangeHistory
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - taskTypeName 250 "책무유형" Text
  - taskName 350 "책무" Text
  - taskStartDate 90 "책무<br>사용시작일" Date
  - taskEndDate 90 "책무<br>사용종료일" Date
  - content 700 "세부내용" Text
  - useYn 35 "사용" BooleanYn2
  - dutyCnt 80 "관리의무<br>건수" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L59-103) → settings(), retrieve()
[E1] allYn[전체보기].ValueChange [allYn.getValue()] (L111) → setGridHidden(), retrieve()
[E2] taskTypeName.TriggerClick (L128) → lookupTaskType()
[E3] searchText.KeyPress [Enter] (L137) → retrieve()
[E4] retrieveButton[조회].Select (L146) → retrieve()
[E5] historyButton[변경이력].Select (L152) → 인라인 L152-158 (new SelectHandler() { @Override publi…)
[E6] grid.SelectionChanged [선택>0] (L165) → retrieveEditPage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setGridHidden() | L175-191 | E1,settings | 상태 처리 | 업무 |
| private retrieveEditPage() | L193-196 | E6 | 상태 처리 | 업무 |
| public retrieve() | L212-232 | 생성자,E1,E3,E4 | 서비스 tdm.Tdm12_TaskRelateDetail.selectByText(companyId, baseDate, taskTypeCode, allYn, searchText) | 업무 |
| private lookupTaskType() | L234-250 | E2 | 조회창 Tdm14_Lookup_TaskType 열기 | 업무 |
| private settings() | L105-173 | 생성자 | 조회창 Tdm95_Lookup_ChangeHistory 열기, 이벤트 연결, 초기값: baseDate=LoginUser.getToday(, allYn=true("전체보기") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L198-210 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L252-254 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L255-257 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('taskTypeNm', 250, '책무유형'),  // L201
  gb.text('taskNm', 350, '책무'),  // L202
  gb.date('taskStartDate', 90, '책무<br>사용시작일'),  // L203
  gb.date('taskEndDate', 90, '책무<br>사용종료일'),  // L204
  gb.text('content', 700, '세부내용'),  // L205
  gb.booleanYn2('useYn', 35, '사용'),  // L206
  gb.textCenter('dutyCnt', 80, '관리의무<br>건수'),  // L207
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L152-158 (new SelectHandler() { @Override publi…) */}>변경이력</Button>

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

### Tdm13_TabPage_TaskDuty (`client/vi/tdm/Tdm13_TabPage_TaskDuty.java`, 335줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: ▼ 관리의무: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `lookup` Tdm95_Lookup_ChangeHistory
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - content 1200 "관리의무" Text 편집:TextField
  - seq 80 "조회순서" LongCenter 편집:LongField
  - useYn 80 "사용여부" Boolean
  - actionCell 70 "변경이력 " Cell 편집:historyCell

#### 이벤트
[E0] 화면 열림 (생성자 L62-79) → settings()
[E1] insertButton[등록].Select (L82) → insertRow()
[E2] updateButton[저장].Select (L88) → preUpdate()
[E3] deleteButton[삭제].Select (L94) → deleteChk()
       └ [E4] msgBox.DialogHide [YES] (L271) → deleteRow()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L122-135 | 공개 메서드 | 서비스 tdm.Tdm13_TaskRelateDuty.selectByTaskRelateDetailId(taskRelateDetailId) | 업무 |
| public preUpdate() | L137-218 | E2 | 상태 처리 | 업무 |
| private update() | L220-233 | preUpdate | 서비스 tdm.Tdm13_TaskRelateDuty.update(historyMap) | 업무 |
| public insertRow() | L235-249 | E1 | 상태 처리 | 업무 |
| private deleteChk() | L251-307 | E3 | 미선택 시 alert "삭제대상을 선택하세요" → 확인창 E4 | 업무 |
| public deleteRow() | L309-326 | E4 | GridDeleteData tdm.Tdm13_TaskRelateDuty.delete(체크된 행 목록) | 업무 |
| public gridClear() | L328-330 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L81-100 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L102-120 | 필드 초기화 | 조회창 Tdm95_Lookup_ChangeHistory 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L332-334 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('content', 1200, '관리의무', { editor: 'text' }),  // L114
  gb.longCenter('seq', 80, '조회순서', { editor: 'number' }),  // L115
  gb.boolean('useYn', 80, '사용여부'),  // L116
  // ⚠ 대응 없음 (GridBuilder L117) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={preUpdate}>저장</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>

