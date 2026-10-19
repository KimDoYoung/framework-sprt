# Ics15_Tab_ChecklistStatus

- 종류: 화면
- 메뉴: 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 현황(준감인) (#1231)
- 파일: `client/vi/ics/Ics15_Tab_ChecklistStatus.java`
- 함께 쓰는 클래스 2개:
  - `Ics15_Lookup_ChecklistStatusDetail` `client/vi/ics/Ics15_Lookup_ChecklistStatusDetail.java`
  - `Ics10_Edit_Checklist` `client/vi/ics/Ics10_Edit_Checklist.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sch05_Page_RelateIcs`](../../sch/components/Sch05_Page_RelateIcs.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics10_Checklist.modelUpdate` | Ics10_Edit_Checklist:320 | [`Ics10_Checklist.java:69`](../../ics/services/Ics10_Checklist.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md), `UpdateDataModel(ics10_checklist)` 동적 INSERT/UPDATE → [`ics10_checklist.selectById`](../../ics/sql/ics10_checklist.md) |
| `ics.Ics11_ChecklistCompany.selectByChecklistIdStatus` | Ics15_Lookup_ChecklistStatusDetail:166 | [`Ics11_ChecklistCompany.java:26`](../../ics/services/Ics11_ChecklistCompany.md) | [`ics11_checklist_company.selectByChecklistIdStatus`](../../ics/sql/ics11_checklist_company.md) |
| `sch.Sch05_RelateIcs.modelUpdate` | Ics10_Edit_Checklist:254 | [`Sch05_RelateIcs.java:40`](../../sch/services/Sch05_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE → [`sch05_relate_ics.selectById`](../../sch/sql/sch05_relate_ics.md) |
| `sys.Sys01_Company.selectById` | Ics15_Tab_ChecklistStatus:94 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys09_Code.selectByIcs21` | Ics10_Edit_Checklist:54, Ics15_Tab_ChecklistStatus:50 | [`Sys09_Code.java:213`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs21`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByIcs23` | Ics10_Edit_Checklist:55, Ics15_Tab_ChecklistStatus:51 | [`Sys09_Code.java:222`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs23`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertIcsCheckListStatus` | Ics15_Tab_ChecklistStatus:299 | [`Sys99_Print.java:238`](../../sys/services/Sys99_Print.md) | [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getPreMonthLastDay`](../../utils/sql/dbConfig.md), [`dbConfig.getPreQuarterCloseDate`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.selectChecklistStatus`](../../ics/sql/ics11_checklist_company.md), [`sys12_calendar.selectMonthLastDay`](../../sys/sql/sys12_calendar.md), [`sys12_calendar.selectQuarterLastDay`](../../sys/sql/sys12_calendar.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md), [`sys99_print.selectIcsCheckListStatus`](../../sys/sql/sys99_print.md) |

## 테이블

[`emp04_add_title`](../../../db/tables/emp.md), [`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_confirmer_limit`, `f_get_last_day`, `f_get_quarter_date`, `f_sysdate`, `f_today`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics15_Tab_ChecklistStatus (`client/vi/ics/Ics15_Tab_ChecklistStatus.java`, 318줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회년도: {yyyyText} 대분류: {icsChecklistLComboBox} 중분류: {icsChecklistMComboBox} 검색: {searchText} {retrieveButton} ※ 선택한 행의 '월' 또는 '분기' 더블클릭시 상세내역 확인이 가능합니다.:
- 입력·하위 화면: `icsChecklistLComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "%", "전체"), `icsChecklistMComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "%", "전체"), `yyyyText` TextField, `searchText` TextField 빈칸="대분류/중분류/체크대상", `lookup` Ics15_Lookup_ChecklistStatusDetail
- 그리드 `grid` (buildGrid()):
  - string01 180 "대분류" Text
  - string02 230 "중분류" Text
  - string03 500 "체크대상" TextArea
  - string11 70 "1월" TextCenter
  - string12 70 "2월" TextCenter
  - string13 70 "3월" TextCenter
  - string14 70 "4월" TextCenter
  - string15 70 "5월" TextCenter
  - string16 70 "6월" TextCenter
  - string17 70 "7월" TextCenter
  - string18 70 "8월" TextCenter
  - string19 70 "9월" TextCenter
  - string20 70 "10월" TextCenter
  - string21 70 "11월" TextCenter
  - string22 70 "12월" TextCenter
  - string13 100 "1분기" TextCenter
  - string16 100 "2분기" TextCenter
  - string19 100 "3분기" TextCenter
  - string22 100 "4분기" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L60-91) → settings()
[E1] yyyyText.KeyPress [Enter] (L110) → retrieve()
[E2] yyyyText.ValueChange (L118) → getDate()
[E3] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L148) → refreshCode()
[E4] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L166) → retrieve()
[E5] searchText.KeyPress [Enter] (L175) → retrieve()
[E6] retrieveButton[가져오기].Select (L184) → retrieve()
[E7] grid.CellDoubleClick [event.getCellIndex() > 3] (L191) → 인라인 L191-204 (new CellDoubleClickHandler() { @Overr…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private refreshCode() | L207-218 | E3 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| private setColumnHidden() | L249-272 | settings | 상태 처리 | 업무 |
| public retrieve() | L274-305 | E1,E4,E5,E6 | 서비스 sys.Sys99_Print.insertIcsCheckListStatus(companyId, personId, checklistLClassId, checklistMClassId, searchText, stdYear, cycleType, windowClassName) | 업무 |
| private getDate() | L307-309 | E2,settings,refreshCode | 상태 처리 | 업무 |
| private settings() | L93-205 | 생성자 | 조회창 Ics15_Lookup_ChecklistStatusDetail 열기, 서비스 sys.Sys01_Company.selectById(companyId), 이벤트 연결, 초기값: yyyyText=startYear | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L220-247 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L311-313 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L315-317 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('string01', 180, '대분류'),  // L224
  gb.text('string02', 230, '중분류'),  // L225
  gb.textArea('string03', 500, '체크대상'),  // L226
  gb.textCenter('string11', 70, '1월'),  // L228
  gb.textCenter('string12', 70, '2월'),  // L229
  gb.textCenter('string13', 70, '3월'),  // L230
  gb.textCenter('string14', 70, '4월'),  // L231
  gb.textCenter('string15', 70, '5월'),  // L232
  gb.textCenter('string16', 70, '6월'),  // L233
  gb.textCenter('string17', 70, '7월'),  // L234
  gb.textCenter('string18', 70, '8월'),  // L235
  gb.textCenter('string19', 70, '9월'),  // L236
  gb.textCenter('string20', 70, '10월'),  // L237
  gb.textCenter('string21', 70, '11월'),  // L238
  gb.textCenter('string22', 70, '12월'),  // L239
  gb.textCenter('string13', 100, '1분기'),  // L241
  gb.textCenter('string16', 100, '2분기'),  // L242
  gb.textCenter('string19', 100, '3분기'),  // L243
  gb.textCenter('string22', 100, '4분기'),  // L244
];
```

#### 사용된 버튼들
1. <Button type="download" onClick={retrieve}>가져오기</Button>

### Ics15_Lookup_ChecklistStatusDetail (`client/vi/ics/Ics15_Lookup_ChecklistStatusDetail.java`, 205줄)

- 툴바 `buttonBar`: {unCheckYn} {unConfirmYn} {retrieveButton}
- 입력·하위 화면: `unCheckYn` CheckBox, `unConfirmYn` CheckBox, `periodComboBox` ComboBoxField("MonthsCode"), `lookup` Ics10_Edit_Checklist
- 그리드 `grid` (buildGrid()):
  - checkLClassName 100 "대분류" Text
  - checkMClassName 200 "중분류" Text
  - content 550 "체크대상" TextArea
  - actionCell 40 " " Cell 편집:actionCell
  - reason 280 "체크결과" TextArea
  - orgName 100 "담당부서" Text
  - personName 100 "담당자" TextCenter
  - confirmerName 100 "확인자" TextCenter
  - confirmYn 65 "확인여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L79-103) → settings(), show()
[E1] retrieveButton[조회].Select (L111) → retrieve()
[E2] cancleButton[닫기].Select (L117) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L55-77 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L154-172 | E1,view | 서비스 ics.Ics11_ChecklistCompany.selectByChecklistIdStatus(companyId, stdDate, cycleType, checklistId, unCheckYn, unConfirmYn) | 업무 |
| private getDate() | L174-196 | retrieve | 상태 처리 | 업무 |
| private settings() | L105-123 | 생성자 | 이벤트 연결, 초기값: unCheckYn=false("미체크 보기"), unConfirmYn=false("미확인 보기") | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L125-152 | 필드 초기화 | 팝업 Ics10_Edit_Checklist 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L198-200 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('checkLClassNm', 100, '대분류'),  // L141
  gb.text('checkMClassNm', 200, '중분류'),  // L142
  gb.textArea('content', 550, '체크대상'),  // L143
  // ⚠ 대응 없음 (GridBuilder L144) addCell
  gb.textArea('reason', 280, '체크결과'),  // L145
  gb.text('orgNm', 100, '담당부서'),  // L146
  gb.textCenter('personNm', 100, '담당자'),  // L147
  gb.textCenter('confirmerNm', 100, '확인자'),  // L148
  gb.booleanYn('confirmYn', 65, '확인여부'),  // L149
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

