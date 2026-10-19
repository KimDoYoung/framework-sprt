# Sch03_Lookup_Icr

- 종류: 컴포넌트 (다른 도메인에서도 쓰는 클래스)
- 사용 도메인: `icr`
- 파일: `client/vi/sch/Sch03_Lookup_Icr.java`
- 함께 쓰는 클래스 9개:
  - `Sch03_Lookup_Short` `client/vi/sch/Sch03_Lookup_Short.java`
  - `Sch03_TabPage_Short99` `client/vi/sch/Sch03_TabPage_Short99.java`
  - `Sch03_Lookup_Cycle` `client/vi/sch/Sch03_Lookup_Cycle.java`
  - `Sch03_TabPage_Cycle06` `client/vi/sch/Sch03_TabPage_Cycle06.java`
  - `Sch03_TabPage_Cycle05` `client/vi/sch/Sch03_TabPage_Cycle05.java`
  - `Sch03_TabPage_Cycle04` `client/vi/sch/Sch03_TabPage_Cycle04.java`
  - `Sch03_TabPage_Cycle03` `client/vi/sch/Sch03_TabPage_Cycle03.java`
  - `Sch03_TabPage_Cycle02` `client/vi/sch/Sch03_TabPage_Cycle02.java`
  - `Sch03_TabPage_Cycle01` `client/vi/sch/Sch03_TabPage_Cycle01.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch03_Deadline.delete` | Sch03_Lookup_Icr:251 | [`Sch03_Deadline.java:108`](../../sch/services/Sch03_Deadline.md) | `UpdateDataModel(sch03_deadline)` 동적 DELETE |
| `sch.Sch03_Deadline.insertModel` | Sch03_Lookup_Cycle:259, Sch03_Lookup_Short:136 | [`Sch03_Deadline.java:76`](../../sch/services/Sch03_Deadline.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), `UpdateDataModel(sch03_deadline)` 동적 INSERT/UPDATE → [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.selectByClassTreeId` | Sch03_Lookup_Icr:200 | [`Sch03_Deadline.java:27`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectByClassTreeId`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.updateModel` | Sch03_Lookup_Icr:209 | [`Sch03_Deadline.java:50`](../../sch/services/Sch03_Deadline.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Sch03_TabPage_Cycle04:62, Sch03_TabPage_Cycle05:62 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectDeadLine` | Sch03_Lookup_Icr:59 | [`Sys00_Common.java:21`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectDeadLine`](../../sys/sql/sys00_common.md) |

## 테이블

[`ics01_class_tree`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_deadline_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch03_Lookup_Icr (`client/vi/sch/Sch03_Lookup_Icr.java`, 262줄)

- 툴바 `buttonBar`: {deadlineComboBox} {loadButton} {shortButton} {cycleButton} {deleteButton}
- 툴바 `iconBar`: {anchor}
- 입력·하위 화면: `deadlineComboBox` CommonComboBoxField("sys.Sys00_Common.selectDeadLine") 빈칸="선택하세요", `lookupShort` Sch03_Lookup_Short, `lookupCycle` Sch03_Lookup_Cycle
- 그리드 `grid` (buildGrid(), 체크박스):
  - cycleName 120 "주기구분" TextCenter
  - deadlineFullName 450 "처리일 정보" Text
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date
  - actionCell 50 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L68-70) → 초기화
[E1] anchor.MouseDown (L89) → retrieve()
[E2] loadButton[선택].Select (L99) → load()
[E3] deleteButton[삭제].Select (L105) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L245) → 서비스 sch.Sch03_Deadline.delete
[E4] shortButton[일회성조건].Select (L111) → shortInsert()
[E5] cycleButton[반복주기조건].Select (L117) → cycleInsert()
[E6] closeButton[닫기].Select (L124) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L72-78 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L197-201 | E1,open,buildGrid,load,shortInsert,cycleInsert | 서비스 sch.Sch03_Deadline.selectByClassTreeId(classTreeId) | 업무 |
| public load() | L203-222 | E2 | 서비스 sch.Sch03_Deadline.updateModel(deadlineId, classTreeId, companyId, scheduleCode) | 업무 |
| public shortInsert() | L224-231 | E4 | 조회창 Sch03_Lookup_Short 열기 | 업무 |
| public cycleInsert() | L233-240 | E5 | 조회창 Sch03_Lookup_Cycle 열기 | 업무 |
| public deleteRow() | L242-257 | E3 | ConfirmBox → E7 | 업무 |
| private makeLayout() | L80-158 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L160-195 | 필드 초기화 | 조회창 Sch03_Lookup_Short 열기, 조회창 Sch03_Lookup_Cycle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L259-261 | makeLayout | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('cycleNm', 120, '주기구분'),  // L188 SQL 계산 컬럼(selectByClassTreeId: f_cdnm('CycleCode', sch03_cycle_cd, sch…)
  gb.text('deadlineFullNm', 450, '처리일 정보'),  // L189 SQL 계산 컬럼(selectByClassTreeId: f_get_deadline_nm(sch03_deadline_id, '2…)
  gb.date('startDate', 100, '시작일'),  // L190
  gb.date('closeDate', 100, '종료일'),  // L191
  // ⚠ 대응 없음 (GridBuilder L192) addCell
];
```

#### 사용된 버튼들
1. <Button type="select" onClick={load}>선택</Button>
2. <Button type="addRow" onClick={shortInsert}>일회성조건</Button>
3. <Button type="addRow" onClick={cycleInsert}>반복주기조건</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch03_Lookup_Short (`client/vi/sch/Sch03_Lookup_Short.java`, 152줄)

- 입력·하위 화면: `tabCycle99` Sch03_TabPage_Short99

#### 이벤트
[E0] 화면 열림 (생성자 L42-67) → Settings(), show(), SetModel()
[E1] updateButton[저장].Select (L102) → update()
[E2] closeButton[닫기].Select (L108) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private SetModel() | L69-71 | 생성자 | 상태 처리 | 업무 |
| private Settings() | L99-114 | 생성자 | 상태 처리 | 업무 |
| public update() | L116-130 | E1 | 상태 처리 | 업무 |
| private insertModel() | L132-147 | update | 서비스 sch.Sch03_Deadline.insertModel | 업무 |
| private setHtmlHeaderStyle() | L149-151 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch03_TabPage_Short99 (`client/vi/sch/Sch03_TabPage_Short99.java`, 242줄)

- 툴바 `buttonBar01`: {radioType01} 즉시:
- 툴바 `buttonBar02`: {radioType02} {fixDate}
- 툴바 `buttonBar03`: {radioType03} {num1} {periodName} {holidayName01}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `fixDate` MyDateField, `num1` LongField, `periodCode` TextField, `periodName` ComboBoxField("PeriodCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L57-72) → Settings(), getEditor(), activeCode01(), activeCode10()
[E1] toggleGroup.ValueChange (L91) → activeCode10(), activeCode01(), activeCode02()
[E2] periodName[PeriodCode].Collapse (L122) → 인라인 L122-127 (new CollapseHandler() { @Override pub…)
[E3] holidayName01[HolidaySettleCode].Collapse (L128) → 인라인 L128-133 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L74-105 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L107-165 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L167-186 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L188-201 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode10() | L203-213 | 생성자,E1,setModel | 상태 처리 | 업무 |
| private activeCode01() | L215-225 | 생성자,E1,setModel | 상태 처리 | 업무 |
| private activeCode02() | L227-237 | E1,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L239-241 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_Lookup_Cycle (`client/vi/sch/Sch03_Lookup_Cycle.java`, 283줄)

- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `tabCycle01` Sch03_TabPage_Cycle01, `tabCycle02` Sch03_TabPage_Cycle02, `tabCycle03` Sch03_TabPage_Cycle03, `tabCycle04` Sch03_TabPage_Cycle04, `tabCycle05` Sch03_TabPage_Cycle05, `tabCycle06` Sch03_TabPage_Cycle06

#### 이벤트
[E0] 화면 열림 (생성자 L61-114) → settings(), getDate(), show(), SetModel()
[E1] updateButton[저장].Select (L212) → update()
[E2] closeButton[닫기].Select (L218) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private SetModel() | L170-195 | 생성자 | 상태 처리 | 업무 |
| private getDate() | L197-209 | 생성자 | 상태 처리 | 업무 |
| public update() | L226-253 | E1 | 상태 처리 | 업무 |
| private insertModel() | L255-270 | update | 서비스 sch.Sch03_Deadline.insertModel | 업무 |
| private settings() | L211-224 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCheckBoxStyle() | L272-274 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L276-278 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L280-282 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch03_TabPage_Cycle06 (`client/vi/sch/Sch03_TabPage_Cycle06.java`, 467줄)

- 툴바 `buttonBar01`: {radioType01} 년의 말일: {holidayName}
- 툴바 `buttonBar02`: {radioType02} {monthName01} {num101} {monthTypeName01} {dayName01} {num201} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar03`: {radioType03} {monthName02} {num102} {monthTypeName02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `num101` LongField, `num201` LongField, `num102` LongField, `holidayCode` TextField, `holidayName` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode01` TextField, `monthName01` ComboBoxField("MonthCode") 빈칸="선택", `monthTypeCode01` TextField, `monthTypeName01` ComboBoxField("MonthTypeCode") 빈칸="선택", `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode02` TextField, `monthName02` ComboBoxField("MonthCode") 빈칸="선택", `monthTypeCode02` TextField, `monthTypeName02` ComboBoxField("MonthTypeCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L74-82) → Settings(), getEditor(), activeCode09()
[E1] dayName01[DayCode].Collapse (L135) → 인라인 L135-153 (new CollapseHandler() { @Override pub…)
[E2] monthName01[MonthCode].Collapse (L166) → 인라인 L166-184 (new CollapseHandler() { @Override pub…)
[E3] monthName02[MonthCode].Collapse (L196) → 인라인 L196-214 (new CollapseHandler() { @Override pub…)
[E4] toggleGroup.ValueChange (L215) → activeCode11(), activeCode12(), activeCode09()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L84-229 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L231-344 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L346-376 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L378-426 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode09() | L428-438 | 생성자,E4,setModel | 상태 처리 | 업무 |
| private activeCode11() | L440-450 | E4,setModel | 상태 처리 | 업무 |
| private activeCode12() | L452-462 | E4,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L464-466 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle05 (`client/vi/sch/Sch03_TabPage_Cycle05.java`, 493줄)

- 툴바 `buttonBar01`: {radioType01} 반기의 말일: {holidayName}
- 툴바 `buttonBar02`: {radioType02} {monthName01} {num101} {monthTypeName01} {dayName01} {num201} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar03`: {radioType03} {monthName02} {num102} {monthTypeName02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `num101` LongField, `num201` LongField, `num102` LongField, `holidayCode` TextField, `holidayName` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode01` TextField, `monthName01` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode01` TextField, `monthTypeName01` ComboBoxField("MonthTypeCode") 빈칸="선택", `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode02` TextField, `monthName02` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode02` TextField, `monthTypeName02` ComboBoxField("MonthTypeCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L86-94) → Settings(), getEditor(), activeCode08()
[E1] dayName01[DayCode].Collapse (L160) → 인라인 L160-178 (new CollapseHandler() { @Override pub…)
[E2] monthName01[sys.Sys00_Common.selectByKindGroupCode].Collapse (L192) → 인라인 L192-210 (new CollapseHandler() { @Override pub…)
[E3] monthName02[sys.Sys00_Common.selectByKindGroupCode].Collapse (L223) → 인라인 L223-241 (new CollapseHandler() { @Override pub…)
[E4] toggleGroup.ValueChange (L243) → activeCode08(), activeCode11(), activeCode12()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L96-257 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L259-372 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L374-404 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L406-452 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode08() | L454-464 | 생성자,E4,setModel | 상태 처리 | 업무 |
| private activeCode11() | L466-476 | E4,setModel | 상태 처리 | 업무 |
| private activeCode12() | L478-488 | E4,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L490-492 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle04 (`client/vi/sch/Sch03_TabPage_Cycle04.java`, 490줄)

- 툴바 `buttonBar01`: {radioType01} 분기의 말일: {holidayName}
- 툴바 `buttonBar02`: {radioType02} {monthName01} {num101} {monthTypeName01} {dayName01} {num201} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar03`: {radioType03} {monthName02} {num102} {monthTypeName02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `radioType03` Radio, `num101` LongField, `num201` LongField, `num102` LongField, `holidayCode` TextField, `holidayName` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode01` TextField, `monthName01` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode01` TextField, `monthTypeName01` ComboBoxField("MonthTypeCode") 빈칸="선택", `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `monthCode02` TextField, `monthName02` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `monthTypeCode02` TextField, `monthTypeName02` ComboBoxField("MonthTypeCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L84-92) → Settings(), getEditor(), activeCode07()
[E1] dayName01[DayCode].Collapse (L154) → 인라인 L154-171 (new CollapseHandler() { @Override pub…)
[E2] monthName01[sys.Sys00_Common.selectByKindGroupCode].Collapse (L185) → 인라인 L185-203 (new CollapseHandler() { @Override pub…)
[E3] monthName02[sys.Sys00_Common.selectByKindGroupCode].Collapse (L217) → 인라인 L217-235 (new CollapseHandler() { @Override pub…)
[E4] toggleGroup.ValueChange (L237) → activeCode07(), activeCode11(), activeCode12()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L94-252 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L254-367 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L369-400 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L402-449 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode07() | L451-461 | 생성자,E4,setModel | 상태 처리 | 업무 |
| private activeCode11() | L463-473 | E4,setModel | 상태 처리 | 업무 |
| private activeCode12() | L475-485 | E4,setModel | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L487-489 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle03 (`client/vi/sch/Sch03_TabPage_Cycle03.java`, 255줄)

- 툴바 `buttonBar01`: {radioType01} {dayName01} {num1} {dayTypeName01} {holidayName01}
- 툴바 `buttonBar02`: {radioType02} {weekName02} {dayWeekName02} {holidayName02}
- 입력·하위 화면: `radioType01` Radio, `radioType02` Radio, `num1` LongField, `dayCode01` TextField, `dayName01` ComboBoxField("DayCode") 빈칸="선택", `dayTypeCode01` TextField, `dayTypeName01` ComboBoxField("DsCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택", `weekCode02` TextField, `weekName02` ComboBoxField("WeekOfMonth") 빈칸="선택", `dayWeekCode02` TextField, `dayWeekName02` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode02` TextField, `holidayName02` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L56-64) → Settings(), getEditor(), activeCode05()
[E1] dayName01[DayCode].Collapse (L102) → 인라인 L102-112 (new CollapseHandler() { @Override pub…)
[E2] toggleGroup.ValueChange (L114) → activeCode05(), activeCode06()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L66-126 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L128-196 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L198-217 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L219-236 | 공개 메서드 | 상태 처리 | 업무 |
| private activeCode05() | L238-245 | 생성자,E2,setModel | 상태 처리 | 업무 |
| private activeCode06() | L247-254 | E2,setModel | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle02 (`client/vi/sch/Sch03_TabPage_Cycle02.java`, 109줄)

- 툴바 `buttonBar01`: {radioType01} {dayWeekName01} {holidayName01}
- 입력·하위 화면: `radioType01` Radio, `dayWeekCode01` TextField, `dayWeekName01` ComboBoxField("DayOfWeekCode") 빈칸="선택", `holidayCode01` TextField, `holidayName01` ComboBoxField("HolidaySettleCode") 빈칸="선택"

#### 이벤트
[E0] 화면 열림 (생성자 L35-41) → Settings(), getEditor()
[E1] dayWeekName01[DayOfWeekCode].Collapse (L55) → 인라인 L55-60 (new CollapseHandler() { @Override pub…)
[E2] holidayName01[HolidaySettleCode].Collapse (L61) → 인라인 L61-66 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L43-51 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L53-83 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L85-96 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L98-108 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Sch03_TabPage_Cycle01 (`client/vi/sch/Sch03_TabPage_Cycle01.java`, 87줄)

- 툴바 `buttonBar01`: {radioType01} 매일:
- 입력·하위 화면: `radioType01` Radio

#### 이벤트
[E0] 화면 열림 (생성자 L29-35) → Settings(), getEditor()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private Settings() | L37-40 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L42-59 | 생성자 | 상태 처리 | 업무 |
| public getModel() | L61-70 | 공개 메서드 | 상태 처리 | 업무 |
| public setModel() | L72-82 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlCheckBoxStyle() | L84-86 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

