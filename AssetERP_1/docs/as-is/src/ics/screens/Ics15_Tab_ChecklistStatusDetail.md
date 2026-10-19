# Ics15_Tab_ChecklistStatusDetail

- 종류: 화면
- 메뉴: 준법감시 > 30. 내부통제 체크리스트 > 내부통제내역 상세(준감인) (#1235)
- 파일: `client/vi/ics/Ics15_Tab_ChecklistStatusDetail.java`
- 함께 쓰는 클래스 2개:
  - `Ics15_Lookup_Rd_ChecklistDetail` `client/vi/ics/Ics15_Lookup_Rd_ChecklistDetail.java`
  - `Ics10_Edit_Checklist` `client/vi/ics/Ics10_Edit_Checklist.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Ics01_Lookup_SelectMulti`](../../ics/components/Ics01_Lookup_SelectMulti.md), [`Sch05_Page_RelateIcs`](../../sch/components/Sch05_Page_RelateIcs.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `ics.Ics10_Checklist.modelUpdate` | Ics10_Edit_Checklist:320 | [`Ics10_Checklist.java:69`](../../ics/services/Ics10_Checklist.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.updateUseYn`](../../ics/sql/ics11_checklist_company.md), `UpdateDataModel(ics10_checklist)` 동적 INSERT/UPDATE → [`ics10_checklist.selectById`](../../ics/sql/ics10_checklist.md) |
| `ics.Ics11_ChecklistCompany.selectChecklistStatusPaging` | Ics15_Tab_ChecklistStatusDetail:107 | [`Ics11_ChecklistCompany.java:40`](../../ics/services/Ics11_ChecklistCompany.md) | [`ics11_checklist_company.selectChecklistStatusPaging`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectChecklistStatusPagingTotal`](../../ics/sql/ics11_checklist_company.md) |
| `sch.Sch05_RelateIcs.modelUpdate` | Ics10_Edit_Checklist:254 | [`Sch05_RelateIcs.java:40`](../../sch/services/Sch05_RelateIcs.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(sch05_relate_ics)` 동적 INSERT/UPDATE → [`sch05_relate_ics.selectById`](../../sch/sql/sch05_relate_ics.md) |
| `sys.Sys01_Company.selectById` | Ics15_Tab_ChecklistStatusDetail:121 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys09_Code.selectByIcs21` | Ics10_Edit_Checklist:54, Ics15_Tab_ChecklistStatusDetail:60 | [`Sys09_Code.java:213`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs21`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByIcs23` | Ics10_Edit_Checklist:55, Ics15_Tab_ChecklistStatusDetail:61 | [`Sys09_Code.java:222`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByIcs23`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdChecklistDetail` | Ics15_Tab_ChecklistStatusDetail:268 | [`Sys99_Print.java:1408`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics11_checklist_company.selectChecklistStatusPaging`](../../ics/sql/ics11_checklist_company.md), [`ics11_checklist_company.selectChecklistStatusPagingTotal`](../../ics/sql/ics11_checklist_company.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`emp04_add_title`](../../../db/tables/emp.md), [`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_get_confirmer_limit`, `f_sysdate`, `f_today`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics15_Tab_ChecklistStatusDetail (`client/vi/ics/Ics15_Tab_ChecklistStatusDetail.java`, 493줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {yyyyText} {periodComboBox} 대분류: {icsChecklistLComboBox} 중분류: {icsChecklistMComboBox} 검색: {searchText} {unCheckYn} {unConfirmYn} {retrieveButton} {downLoadButton}
- 입력·하위 화면: `icsChecklistLComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs21", "%", "전체"), `icsChecklistMComboBox` CommonComboBoxField("sys.Sys09_Code.selectByIcs23", "%", "전체"), `unCheckYn` CheckBox, `unConfirmYn` CheckBox, `periodComboBox` ComboBoxField("MonthsCode"), `yyyyText` TextField, `searchText` TextField 빈칸="대분류/중분류/체크대상/담당부서/담당자", `lookupRdCheckDetail` Ics15_Lookup_Rd_ChecklistDetail, `lookup` Ics10_Edit_Checklist
- 그리드 `grid` (buildGrid()):
  - checkLClassName 180 "대분류" Text
  - checkMClassName 230 "중분류" Text
  - content 600 "체크대상" TextArea
  - actionCell 40 " " Cell 편집:actionCell
  - reason 300 "체크결과" TextArea
  - orgName 100 "담당부서" Text
  - personName 100 "담당자" TextCenter
  - confirmerName 100 "확인자" TextCenter
  - confirmYn 80 "확인여부" BooleanYn

#### 이벤트
[E0] 화면 열림 (생성자 L78-118) → settings()
[E1] yyyyText.KeyPress [Enter] (L149) → retrieve()
[E2] yyyyText.ValueChange (L157) → getDate()
[E3] periodComboBox[MonthsCode].ValueChange (L171) → getDate()
[E4] icsChecklistLComboBox[sys.Sys09_Code.selectByIcs21].Collapse (L200) → refreshCode()
[E5] icsChecklistMComboBox[sys.Sys09_Code.selectByIcs23].Collapse (L218) → retrieve()
[E6] searchText.KeyPress [Enter] (L227) → retrieve()
[E7] retrieveButton[조회].Select (L241) → retrieve()
[E8] downLoadButton[출력/다운로드].Select (L247) → getDate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private refreshCode() | L305-321 | E4 | 서비스 sys.Sys09_Code.selectByIcs23 | 업무 |
| protected enable() | L323-386 | settings | 상태 처리 | 업무 |
| public retrieve() | L417-461 | E1,E5,E6,E7,refreshCode,enable | 상태 처리 | 업무 |
| private getDate() | L463-484 | E2,E3,E8,refreshCode,retrieve | 상태 처리 | 업무 |
| private settings() | L120-303 | 생성자 | 조회창 Ics15_Lookup_Rd_ChecklistDetail 열기 → 콜백: unmask, 서비스 sys.Sys01_Company.selectById, sys.Sys99_Print.insertRdChecklistDetail(companyId, companyId, personId, windowClassName, stdDate, checklistLClassId, checklistMClassId, cycleType, searchText, unCheckYn, unConfirmYn), 이벤트 연결, 초기값: yyyyText=startYear, unCheckYn=false("미체크 보기"), unConfirmYn=false("미확인 보기") | UI구성 (이벤트 절로 대체) |
| package buildGrid() | L388-415 | 필드 초기화 | 팝업 Ics10_Edit_Checklist 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L486-488 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L490-492 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('checkLClassNm', 180, '대분류'),  // L404
  gb.text('checkMClassNm', 230, '중분류'),  // L405
  gb.textArea('content', 600, '체크대상'),  // L406
  // ⚠ 대응 없음 (GridBuilder L407) addCell
  gb.textArea('reason', 300, '체크결과'),  // L408
  gb.text('orgNm', 100, '담당부서'),  // L409
  gb.textCenter('personNm', 100, '담당자'),  // L410
  gb.textCenter('confirmerNm', 100, '확인자'),  // L411
  gb.booleanYn('confirmYn', 80, '확인여부'),  // L412
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={getDate}>출력/다운로드</Button>

### Ics15_Lookup_Rd_ChecklistDetail (`client/vi/ics/Ics15_Lookup_Rd_ChecklistDetail.java`, 90줄)


#### 이벤트
[E0] 화면 열림 (생성자 L33-54) → show()
[E1] closeButton[닫기].Select (L43) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-84 | 공개 메서드 | 상태 처리 | 업무 |
| private setHtmlHeaderStyle() | L86-88 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

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

