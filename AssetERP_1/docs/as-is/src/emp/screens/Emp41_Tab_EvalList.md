# Emp41_Tab_EvalList

- 종류: 화면
- 메뉴: 경영관리 > 05. 인사평가 > 인사평가 항목 (#1391)
- 메뉴: 기초자료 > 30. 자산&경영 > 인사평가 항목(Admin) (#1398)
- 파일: `client/vi/emp/Emp41_Tab_EvalList.java`
- 함께 쓰는 클래스 2개:
  - `Emp42_Lookup_EvalGrade` `client/vi/emp/Emp42_Lookup_EvalGrade.java`
  - `Emp40_Lookup_Insert` `client/vi/emp/Emp40_Lookup_Insert.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp40_EvalListStd.deleteByEvalListStdId` | Emp41_Tab_EvalList:349 | [`Emp40_EvalListStd.java:42`](../../emp/services/Emp40_EvalListStd.md) | [`emp40_eval_list_std.deleteByEvalListStdId`](../../emp/sql/emp40_eval_list_std.md), [`emp41_eval_list.deleteByEvalListStdId`](../../emp/sql/emp41_eval_list.md), [`emp42_eval_grade.deleteByEvalListStdId`](../../emp/sql/emp42_eval_grade.md), [`emp43_eval_target.getEventChk`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp40_EvalListStd.insert` | Emp40_Lookup_Insert:124 | [`Emp40_EvalListStd.java:60`](../../emp/services/Emp40_EvalListStd.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp40_eval_list_std.insert`](../../emp/sql/emp40_eval_list_std.md), [`emp40_eval_list_std.selectByStartDate`](../../emp/sql/emp40_eval_list_std.md), [`emp41_eval_list.insert`](../../emp/sql/emp41_eval_list.md), [`emp41_eval_list.selectByMaxCompanyId`](../../emp/sql/emp41_eval_list.md), [`emp41_eval_list.selectByMaxCompanyIdAdmin`](../../emp/sql/emp41_eval_list.md), [`emp42_eval_grade.insert`](../../emp/sql/emp42_eval_grade.md), [`emp42_eval_grade.selectByMaxCompanyId`](../../emp/sql/emp42_eval_grade.md), [`emp42_eval_grade.selectByMaxCompanyIdAdmin`](../../emp/sql/emp42_eval_grade.md), [`emp43_eval_target.getDateChk`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp40_EvalListStd.selectByCompanyId` | Emp41_Tab_EvalList:473 | [`Emp40_EvalListStd.java:30`](../../emp/services/Emp40_EvalListStd.md) | [`emp40_eval_list_std.selectByCompanyId`](../../emp/sql/emp40_eval_list_std.md) |
| `emp.Emp40_EvalListStd.updateFixYn` | Emp41_Tab_EvalList:257 | [`Emp40_EvalListStd.java:154`](../../emp/services/Emp40_EvalListStd.md) | [`emp40_eval_list_std.updateFixYn`](../../emp/sql/emp40_eval_list_std.md), [`emp43_eval_target.getEventChk2`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp41_EvalList.selectByEvalListStdId` | Emp41_Tab_EvalList:505 | [`Emp41_EvalList.java:24`](../../emp/services/Emp41_EvalList.md) | [`emp41_eval_list.selectByEvalListStdId`](../../emp/sql/emp41_eval_list.md) |
| `emp.Emp41_EvalList.updateList` | Emp41_Tab_EvalList:455 | [`Emp41_EvalList.java:31`](../../emp/services/Emp41_EvalList.md) | `UpdateDataModel(emp41_eval_list)` 동적 INSERT/UPDATE → [`emp41_eval_list.selectById`](../../emp/sql/emp41_eval_list.md), `UpdateDataModel(emp41_eval_list)` 동적 DELETE |
| `emp.Emp42_EvalGrade.selectByEvalListStdId` | Emp42_Lookup_EvalGrade:173 | [`Emp42_EvalGrade.java:24`](../../emp/services/Emp42_EvalGrade.md) | [`emp42_eval_grade.selectByEvalListStdId`](../../emp/sql/emp42_eval_grade.md) |
| `emp.Emp42_EvalGrade.updateList` | Emp42_Lookup_EvalGrade:226 | [`Emp42_EvalGrade.java:31`](../../emp/services/Emp42_EvalGrade.md) | `UpdateDataModel(emp42_eval_grade)` 동적 INSERT/UPDATE → [`emp42_eval_grade.selectById`](../../emp/sql/emp42_eval_grade.md), `UpdateDataModel(emp42_eval_grade)` 동적 DELETE |
| `emp.Emp43_EvalTarget.getEventChk` | Emp41_Tab_EvalList:186, Emp42_Lookup_EvalGrade:183 | [`Emp43_EvalTarget.java:62`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.getEventChk`](../../emp/sql/emp43_eval_target.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp41_eval_list`](../../../db/tables/emp.md), [`emp42_eval_grade`](../../../db/tables/emp.md), [`emp43_eval_target`](../../../db/tables/emp.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp41_Tab_EvalList (`client/vi/emp/Emp41_Tab_EvalList.java`, 514줄)

- 레이아웃: north=buttonBarHlc, center=hlc
- 툴바 `buttonBar1`: {retrieveButton} {insertButton} {confirmButton} {cancleButton} {deleteButton}
- 툴바 `buttonBar2`: {insertFormButton} {deleteFormButton} {updateFormButton}
- 입력·하위 화면: `lookup` Emp42_Lookup_EvalGrade, `weightMemberField` LongField, `weightLeaderField` LongField, `evalClassComboBox` ComboBoxField("EmpEvalClassCode")
- 그리드 `grid01` (buildGrid01()):
  - startDate 100 "기준 적용일" Date
  - actionCell 80 "평가등급" Cell 편집:viewCell
  - fixYn 50 "확정" BooleanYn
- 그리드 `grid02` (buildGrid02(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - evalClassName 180 "평가항목" TextCenter 편집:evalClassComboBox
  - content 550 "내용" TextArea 편집:MyTextArea
  - weightMember 80 "조직원" Long 편집:weightMemberField
  - weightLeader 80 "조직장" Long 편집:weightLeaderField
  - seq 80 "조회순번" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L79-119) → settings(), retrieve()
[E1] grid01.RowClick (L125) → retrieveForm()
[E2] retrieveButton[조회].Select (L132) → retrieve()
[E3] insertButton[등록].Select (L138) → insert()
[E4] confirmButton[확정].Select [YES] (L144) → confirm()
[E5] msgBox.DialogHide [YES] (L157) → confirm()
[E6] cancleButton[확정취소].Select [YES] (L176) → confirm()
[E7] msgBox.DialogHide [YES] (L202) → confirm()
[E8] deleteButton[삭제].Select (L224) → delete()
       └ [E15] msgBox.DialogHide [YES] (L342) → retrieve()
[E9] insertFormButton[행 추가].Select (L231) → insertForm()
[E10] deleteFormButton[행 삭제].Select (L237) → 인라인 L237-245 (new SelectHandler() { @Override publi…)
[E11] updateFormButton[저장].Select (L246) → updateFormChk()
[E12] weightMemberField.KeyUp (L294) → 인라인 L294-299 (new KeyUpHandler() { @Override public…)
[E13] weightLeaderField.ValueChange (L301) → 인라인 L301-306 (new ValueChangeHandler<Long>() { @Ove…)
[E14] evalClassComboBox[EmpEvalClassCode].Collapse (L309) → 인라인 L309-316 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private confirm() | L254-273 | E4,E5,E6,E7 | 서비스 emp.Emp40_EvalListStd.updateFixYn(companyId, startDate, fixYn) | 업무 |
| private buildGrid01() | L275-290 | 필드 초기화 | 조회창 Emp42_Lookup_EvalGrade 열기 | 업무 |
| private buildGrid02() | L292-327 | 필드 초기화 | 상태 처리 | 업무 |
| private delete() | L329-375 | E8 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E15 | 업무 |
| private insert() | L377-391 | E3 | 조회창 Emp40_Lookup_Insert 열기 | 업무 |
| public insertForm() | L393-409 | E9 | 미선택 시 alert "기준 적용일을 선택해주세요" | 업무 |
| private updateFormChk() | L411-451 | E11 | 상태 처리 | 업무 |
| private updateForm() | L453-468 | updateFormChk | 서비스 emp.Emp41_EvalList.updateList(updateList, deleteList) | 업무 |
| public retrieve() | L470-482 | 생성자,E2,E15,confirm,insert | 서비스 emp.Emp40_EvalListStd.selectByCompanyId(companyId) | 업무 |
| public retrieveForm() | L484-513 | E1,updateForm,retrieve | 서비스 emp.Emp41_EvalList.selectByEvalListStdId(companyId, evalListStdId) | 업무 |
| private settings() | L121-252 | 생성자 | 확인창 표시, 서비스 emp.Emp43_EvalTarget.getEventChk(companyId, evalListStdId), 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.date('startDate', 100, '기준 적용일'),  // L286
  // ⚠ 대응 없음 (GridBuilder L287) addCell
  gb.booleanYn('fixYn', 50, '확정'),  // L288
];

const buildGrid02 = () => [
  // ⚠DB없음 L318 newHeaderGroupMap04newHeaderGroupConfig12 100 "가중치(%)" (emp41_new_header_group_map04new_header_group_config12 컬럼 없음)
  gb.textCenter('evalClassNm', 180, '평가항목', { editor: 'select' }),  // L320 SQL 계산 컬럼(selectByEvalListStdId: f_cdnm('EmpEvalClassCode', emp41_eval_c…)
  gb.textArea('content', 550, '내용', { editor: 'largeText' }),  // L321
  gb.long('weightMember', 80, '조직원'),  // L322
  gb.long('weightLeader', 80, '조직장'),  // L323
  gb.long('seq', 80, '조회순번', { editor: 'number' }),  // L324
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="save" onClick={confirm}>확정</Button>
4. <Button type="cancel" onClick={confirm}>확정취소</Button>
5. <Button type="delete" onClick={delete}>삭제</Button>
6. <Button type="addRow" onClick={insertForm}>행 추가</Button>
7. <Button type="removeRow" onClick={() => /* 인라인 L237-245 (new SelectHandler() { @Override publi…) */}>행 삭제</Button>
8. <Button type="save" onClick={updateFormChk}>저장</Button>

### Emp42_Lookup_EvalGrade (`client/vi/emp/Emp42_Lookup_EvalGrade.java`, 243줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `compareComboBox` ComboBoxField("CompareCode")
- 그리드 `grid` (buildGrid()):
  - grade 100 "평가등급" TextCenter 편집:TextField
  - gradeWeight 100 "등급가중치" DoubleCenter 편집:DoubleField
  - gradeScore 120 "등급기준점수" Long 편집:LongField
  - compareName 120 "이상/미만" TextCenter 편집:compareComboBox
  - reasonYn 140 "평정사유 필수" Boolean

#### 이벤트
[E1] retrieveButton[조회].Select (L89) → retrieve()
[E2] insertButton[등록].Select [(boolean)result] (L95) → eventChk(), insertRow()
[E3] deleteButton[삭제].Select (L112) → 인라인 L112-120 (new SelectHandler(){ @Override public…)
[E4] updateButton[저장].Select [(boolean)result] (L121) → eventChk(), updateChk()
[E5] closeButton[닫기].Select (L138) → hide()
[E6] compareComboBox[CompareCode].Collapse (L151) → 인라인 L151-158 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-86 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L168-179 | E1,open,update | 서비스 emp.Emp42_EvalGrade.selectByEvalListStdId(evalListStdId) | 업무 |
| private eventChk() | L181-197 | E2,E4 | 서비스 emp.Emp43_EvalTarget.getEventChk(evalListStdId) | 업무 |
| private insertRow() | L199-204 | E2 | 상태 처리 | 업무 |
| private updateChk() | L206-223 | E4 | 상태 처리 | 업무 |
| private update() | L225-238 | updateChk | 서비스 emp.Emp42_EvalGrade.updateList(updateList, deleteList) | 업무 |
| private settings() | L88-144 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L146-166 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L240-242 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('grade', 100, '평가등급', { editor: 'text' }),  // L159
  gb.doubleCenter('gradeWeight', 100, '등급가중치', { editor: 'number' }),  // L160
  gb.long('gradeScore', 120, '등급기준점수', { editor: 'number' }),  // L161
  gb.textCenter('compareNm', 120, '이상/미만', { editor: 'select' }),  // L162 SQL 계산 컬럼(selectByEvalListStdId: f_cdnm('CompareCode', emp42_compare_cd,…)
  gb.boolean('reasonYn', 140, '평정사유 필수'),  // L163
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={() => /* eventChk(), insertRow() */}>등록</Button>
3. <Button type="delete" onClick={() => /* 인라인 L112-120 (new SelectHandler(){ @Override public…) */}>삭제</Button>
4. <Button type="save" onClick={() => /* eventChk(), updateChk() */}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp40_Lookup_Insert (`client/vi/emp/Emp40_Lookup_Insert.java`, 153줄)

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
| public update() | L105-144 | E1 | 서비스 yyyy.MM.dd, emp.Emp40_EvalListStd.insert(companyId, startDate) | 업무 |
| private setHtmlStyle() | L146-148 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L150-152 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

