# Ics30_Tab_Compliance

- 종류: 화면
- 메뉴: 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수리스트 관리 (#1309)
- 메뉴: 기초자료 > 00. 내부통제 > 임직원 내부통제 준수리스트 (#1313)
- 파일: `client/vi/ics/Ics30_Tab_Compliance.java`
- 함께 쓰는 클래스 2개:
  - `Ics33_TabPage_ComplianceAnswer` `client/vi/ics/Ics33_TabPage_ComplianceAnswer.java`
  - `Ics30_Lookup_Insert` `client/vi/ics/Ics30_Lookup_Insert.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp33_Lookup_ExceptBiz`](../../emp/components/Emp33_Lookup_ExceptBiz.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics30_Compliance.checkDate` | Ics30_Tab_Compliance:211 | [`Ics30_Compliance.java:148`](../../ics/services/Ics30_Compliance.md) | [`ics30_compliance.selectByStartDate`](../../ics/sql/ics30_compliance.md), [`ics31_compliance_write.selectByComplianceId`](../../ics/sql/ics31_compliance_write.md) |
| `ics.Ics30_Compliance.deleteByDate` | Ics30_Tab_Compliance:349 | [`Ics30_Compliance.java:174`](../../ics/services/Ics30_Compliance.md) | [`ics30_compliance.deleteByDate`](../../ics/sql/ics30_compliance.md), [`ics30_compliance.selectByStartDate`](../../ics/sql/ics30_compliance.md), [`ics31_compliance_write.selectByComplianceId`](../../ics/sql/ics31_compliance_write.md), [`ics33_compliance_answer.deleteByDate`](../../ics/sql/ics33_compliance_answer.md) |
| `ics.Ics30_Compliance.groupByStartDate` | Ics30_Tab_Compliance:496 | [`Ics30_Compliance.java:87`](../../ics/services/Ics30_Compliance.md) | [`ics30_compliance.groupByStartDate`](../../ics/sql/ics30_compliance.md) |
| `ics.Ics30_Compliance.insert` | Ics30_Lookup_Insert:128 | [`Ics30_Compliance.java:107`](../../ics/services/Ics30_Compliance.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics30_compliance.insert`](../../ics/sql/ics30_compliance.md), [`ics30_compliance.selectByMaxCompanyId`](../../ics/sql/ics30_compliance.md), [`ics33_compliance_answer.insert`](../../ics/sql/ics33_compliance_answer.md) |
| `ics.Ics30_Compliance.selectByStartDate` | Ics30_Tab_Compliance:532 | [`Ics30_Compliance.java:60`](../../ics/services/Ics30_Compliance.md) | [`ics30_compliance.selectByStartDate`](../../ics/sql/ics30_compliance.md) |
| `ics.Ics30_Compliance.updateDateFixYn` | Ics30_Tab_Compliance:288 | [`Ics30_Compliance.java:93`](../../ics/services/Ics30_Compliance.md) | [`ics30_compliance.updateDateFixYn`](../../ics/sql/ics30_compliance.md) |
| `ics.Ics30_Compliance.updateList` | Ics30_Tab_Compliance:438, Ics30_Tab_Compliance:476 | [`Ics30_Compliance.java:203`](../../ics/services/Ics30_Compliance.md) | [`ics31_compliance_write.selectByComplianceId`](../../ics/sql/ics31_compliance_write.md), `UpdateDataModel(ics30_compliance)` 동적 INSERT/UPDATE → [`ics30_compliance.selectById`](../../ics/sql/ics30_compliance.md), `UpdateDataModel(ics30_compliance)` 동적 DELETE |
| `ics.Ics31_ComplianceWrite.selectByStartDate` | Ics30_Tab_Compliance:160 | [`Ics31_ComplianceWrite.java:28`](../../ics/services/Ics31_ComplianceWrite.md) | [`ics31_compliance_write.selectByStartDate`](../../ics/sql/ics31_compliance_write.md) |
| `ics.Ics33_ComplianceAnswer.delete` | Ics33_TabPage_ComplianceAnswer:208 | [`Ics33_ComplianceAnswer.java:41`](../../ics/services/Ics33_ComplianceAnswer.md) | `UpdateDataModel(ics33_compliance_answer)` 동적 DELETE |
| `ics.Ics33_ComplianceAnswer.selectByCompanyId` | Ics33_TabPage_ComplianceAnswer:246 | [`Ics33_ComplianceAnswer.java:24`](../../ics/services/Ics33_ComplianceAnswer.md) | [`ics33_compliance_answer.selectByCompanyId`](../../ics/sql/ics33_compliance_answer.md) |
| `ics.Ics33_ComplianceAnswer.update` | Ics33_TabPage_ComplianceAnswer:217 | [`Ics33_ComplianceAnswer.java:36`](../../ics/services/Ics33_ComplianceAnswer.md) | `UpdateDataModel(ics33_compliance_answer)` 동적 INSERT/UPDATE → [`ics33_compliance_answer.selectById`](../../ics/sql/ics33_compliance_answer.md) |

## 테이블

[`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`ics33_compliance_answer`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics30_Tab_Compliance (`client/vi/ics/Ics30_Tab_Compliance.java`, 549줄)

- 레이아웃: north=buttonBarHlc, center=hlc
- 툴바 `buttonBar1`: {retrieveButton} {insertButton} {confirmButton} {cancleButton} {deleteButton} {excpEmpButton}
- 툴바 `buttonBar2`: {insertFormButton} {deleteFormButton} {updateFormButton}
- 입력·하위 화면: `tapPage` Ics33_TabPage_ComplianceAnswer, `complianceTypeComboBox` ComboBoxField("IcsComplianceType"), `lookup` Ics30_Lookup_Insert
- 그리드 `grid` (buildGrid()):
  - startDate 100 "기준 적용일" Date
  - dateFixYn 50 "확정" BooleanYn
- 그리드 `formGrid` (buildFormGrid(), 체크박스(다중)):
  - complianceTypeName 200 "준수항목" Text 편집:complianceTypeCombo…
  - subNum 100 "내부번호" Text 편집:TextField
  - content 550 "내용" TextArea 편집:MyTextArea
  - naUseYn 100 "해당없음<br>사용" Boolean
  - useYn 100 "사용" Boolean
  - useCloseDate 100 "미사용<br>적용일자" Date 편집:MyDateField
  - note 350 "비고" TextArea 편집:MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L76-126) → settings(), retrieve()
[E1] grid.RowClick (L129) → retrieveForm()
[E2] formGrid.RowClick (L136) → 인라인 L136-142 (new RowClickHandler(){ @Override publ…)
[E3] retrieveButton[조회].Select (L143) → retrieve()
[E4] insertButton[등록].Select (L149) → insert()
[E5] confirmButton[확정].Select [YES] (L155) → confirm()
[E6] msgBox.DialogHide [YES] (L180) → confirm()
[E7] cancleButton[확정취소].Select [YES] (L202) → confirm()
[E8] msgBox.DialogHide [YES] (L224) → confirm()
[E9] deleteButton[삭제].Select (L249) → delete()
       └ [E15] msgBox.DialogHide [YES] (L342) → retrieve()
[E10] excpEmpButton[예외사원 등록].Select (L255) → lookupExcpEmp()
[E11] insertFormButton[행 추가].Select (L262) → insertForm()
[E12] deleteFormButton[행 삭제].Select (L268) → 인라인 L268-276 (new SelectHandler() { @Override publi…)
[E13] updateFormButton[저장].Select (L277) → updateFormChk()
       └ [E16] msgBox.DialogHide [YES] (L452) → updateForm()
[E14] complianceTypeComboBox[IcsComplianceType].Collapse (L313) → 인라인 L313-320 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private confirm() | L285-300 | E5,E6,E7,E8 | 서비스 ics.Ics30_Compliance.updateDateFixYn(companyId, startDate, dateFixYn) | 업무 |
| private buildFormGrid() | L309-332 | 필드 초기화 | 상태 처리 | 업무 |
| private delete() | L334-375 | E9 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E15 | 업무 |
| private insert() | L377-391 | E4 | 조회창 Ics30_Lookup_Insert 열기 | 업무 |
| public insertForm() | L393-413 | E11 | 미선택 시 alert "기준 적용일을 선택해주세요" | 업무 |
| private updateFormChk() | L415-473 | E13 | 미선택 시 alert "미사용 처리 시, 미사용 적용일자는 필수 선택사항입니다" → 확인창 E16 | 업무 |
| private updateForm() | L475-491 | E16,updateFormChk | 서비스 ics.Ics30_Compliance.updateList(updateList, deleteList, actionCode) | 업무 |
| public retrieve() | L493-505 | 생성자,E3,E15,confirm,insert | 서비스 ics.Ics30_Compliance.groupByStartDate(companyId) | 업무 |
| public retrieveForm() | L507-543 | E1,updateFormChk,updateForm,retrieve | 서비스 ics.Ics30_Compliance.selectByStartDate(companyId, startDate) | 업무 |
| private lookupExcpEmp() | L545-548 | E10 | 조회창 Emp33_Lookup_ExceptBiz 열기 | 업무 |
| private settings() | L128-283 | 생성자 | 확인창 표시, 서비스 ics.Ics31_ComplianceWrite.selectByStartDate, ics.Ics30_Compliance.checkDate(companyId, startDate, companyId, startDate), 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L302-307 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '기준 적용일'),  // L304
  gb.booleanYn('dateFixYn', 50, '확정'),  // L305
];

const buildFormGrid = () => [
  gb.text('complianceTypeNm', 200, '준수항목', { editor: 'select' }),  // L323 SQL 계산 컬럼(selectByStartDate: sys09_name)
  gb.text('subNum', 100, '내부번호', { editor: 'text' }),  // L324
  gb.textArea('content', 550, '내용', { editor: 'largeText' }),  // L325
  gb.boolean('naUseYn', 100, '해당없음<br>사용'),  // L326
  gb.boolean('useYn', 100, '사용'),  // L327
  gb.date('useCloseDate', 100, '미사용<br>적용일자', { editor: 'date' }),  // L328
  gb.textArea('note', 350, '비고', { editor: 'largeText' }),  // L329
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={confirm}>확정</Button>
4. <Button type="cancel" onClick={confirm}>확정취소</Button>
5. <Button type="delete" onClick={delete}>삭제</Button>
6. <Button type="unknown" onClick={lookupExcpEmp}>예외사원 등록</Button>
7. <Button type="addRow" onClick={insertForm}>행 추가</Button>
8. <Button type="removeRow" onClick={() => /* 인라인 L268-276 (new SelectHandler() { @Override publi…) */}>행 삭제</Button>
9. <Button type="save" onClick={updateFormChk}>저장</Button>

### Ics33_TabPage_ComplianceAnswer (`client/vi/ics/Ics33_TabPage_ComplianceAnswer.java`, 263줄)

- 레이아웃: center=vlc
- 툴바 `buttonBarL`: {anchor01}
- 툴바 `buttonBarR`: {insertRowButton} {deleteRowButton} {updateButton}
- 입력·하위 화면: `answer1ComboBox` ComboBoxField("AnswerCode", "<blank>"), `answer2ComboBox` ComboBoxField("AnswerCode", "<blank>"), `answer3ComboBox` ComboBoxField("AnswerCode", "<blank>"), `answer4ComboBox` ComboBoxField("AnswerCode", "<blank>"), `answer5ComboBox` ComboBoxField("AnswerCode", "<blank>")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - caseNo 150 "CASE" TextCenter 편집:TextField
  - answer1Name 200 "답변1" TextCenter 편집:answer1ComboBox
  - answer2Name 200 "답변2" TextCenter 편집:answer2ComboBox
  - answer3Name 200 "답변3" TextCenter 편집:answer3ComboBox
  - answer4Name 200 "답변4" TextCenter 편집:answer4ComboBox
  - answer5Name 200 "답변5" TextCenter 편집:answer5ComboBox

#### 이벤트
[E0] 화면 열림 (생성자 L59-86) → setting()
[E1] insertRowButton[행 추가].Select (L89) → insertRow()
[E2] deleteRowButton[행 삭제].Select (L95) → 인라인 L95-103 (new SelectHandler() { @Override publi…)
[E3] updateButton[저장].Select (L104) → update()
[E4] answer1ComboBox[AnswerCode].Collapse (L117) → 인라인 L117-124 (new CollapseHandler() { @Override pub…)
[E5] answer2ComboBox[AnswerCode].Collapse (L126) → 인라인 L126-133 (new CollapseHandler() { @Override pub…)
[E6] answer3ComboBox[AnswerCode].Collapse (L135) → 인라인 L135-142 (new CollapseHandler() { @Override pub…)
[E7] answer4ComboBox[AnswerCode].Collapse (L144) → 인라인 L144-151 (new CollapseHandler() { @Override pub…)
[E8] answer5ComboBox[AnswerCode].Collapse (L153) → 인라인 L153-160 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L88-110 | 생성자 | 상태 처리 | 업무 |
| private insertRow() | L173-186 | E1 | 상태 처리 | 업무 |
| private update() | L188-224 | E3 | GridDeleteData ics.Ics33_ComplianceAnswer.delete, ics.Ics33_ComplianceAnswer.update | 업무 |
| public retrieve() | L226-256 | update | 서비스 ics.Ics33_ComplianceAnswer.selectByCompanyId(companyId, startDate, complianceType) | 업무 |
| public setEnable() | L258-262 | 공개 메서드 | 상태 처리 | 업무 |
| package buildGrid() | L112-171 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('caseNo', 150, 'CASE', { editor: 'text' }),  // L163
  gb.textCenter('answer1Nm', 200, '답변1', { editor: 'select' }),  // L164 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AnswerCode', ics33_answer1_cd, …)
  gb.textCenter('answer2Nm', 200, '답변2', { editor: 'select' }),  // L165 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AnswerCode', ics33_answer2_cd, …)
  gb.textCenter('answer3Nm', 200, '답변3', { editor: 'select' }),  // L166 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AnswerCode', ics33_answer3_cd, …)
  gb.textCenter('answer4Nm', 200, '답변4', { editor: 'select' }),  // L167 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AnswerCode', ics33_answer4_cd, …)
  gb.textCenter('answer5Nm', 200, '답변5', { editor: 'select' }),  // L168 SQL 계산 컬럼(selectByCompanyId: f_cdnm('AnswerCode', ics33_answer5_cd, …)
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={() => /* 인라인 L95-103 (new SelectHandler() { @Override publi…) */}>행 삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>

### Ics30_Lookup_Insert (`client/vi/ics/Ics30_Lookup_Insert.java`, 149줄)

- 입력·하위 화면: `yearText` TextField, `monthComboBox` ComboBoxField("MonthsCode")

#### 이벤트
[E0] 화면 열림 (생성자 L60-91) → show()
[E1] updateButton[생성].Select (L74) → update()
[E2] closeButton[닫기].Select (L80) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-58 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L93-103 | open | 상태 처리 | 업무 |
| public update() | L105-140 | E1 | 서비스 yyyy.MM.dd, ics.Ics30_Compliance.insert(companyId, startDate) | 업무 |
| private setHtmlStyle() | L142-144 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L146-148 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

