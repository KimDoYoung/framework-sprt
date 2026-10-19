# Sch04_Tab_IcsListManager

- 종류: 화면
- 메뉴: 준법감시 > 01. 법규관리 > 법규보고 점검(관리자) (#1340)
- 파일: `client/vi/sch/Sch04_Tab_IcsListManager.java`
- 함께 쓰는 클래스 2개:
  - `Sch04_Lookup_Rd_IcsList` `client/vi/sch/Sch04_Lookup_Rd_IcsList.java`
  - `Sch04_Lookup_IcsMsg` `client/vi/sch/Sch04_Lookup_IcsMsg.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Icr01_Lookup_ClassTreeDetail`](../../icr/components/Icr01_Lookup_ClassTreeDetail.md), [`Ics01_Lookup_ClassTreeDetail`](../../ics/components/Ics01_Lookup_ClassTreeDetail.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch04_List.selectByIcs` | Sch04_Tab_IcsListManager:332 | [`Sch04_List.java:171`](../../sch/services/Sch04_List.md) | [`dbConfig.getBizDate`](../../utils/sql/dbConfig.md), [`sch04_list.selectByIcs`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.updateConfirm` | Sch04_Lookup_IcsMsg:174 | [`Sch04_List.java:396`](../../sch/services/Sch04_List.md) | [`sch04_list.selectById`](../../sch/sql/sch04_list.md), [`sch04_list.updateConfirm`](../../sch/sql/sch04_list.md), [`sch04_list.updateNote`](../../sch/sql/sch04_list.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Sch04_Tab_IcsListManager:165 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertRdIcsList` | Sch04_Tab_IcsListManager:229 | [`Sys99_Print.java:3498`](../../sys/services/Sys99_Print.md) | [`dbConfig.getBizDate`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.selectByIcs`](../../sch/sql/sch04_list.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr13_person_auth`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`apr22_relate_icr`](../../../db/tables/apr.md), [`emp03_trans`](../../../db/tables/emp.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`icr05_relate_manager`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`ics04_share`](../../../db/tables/ics.md), [`ics05_relate_manager`](../../../db/tables/ics.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_appr_close_date`, `f_get_biz_date`, `f_get_emptrans`, `f_get_ics_nm`, `f_get_std_date`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Tab_IcsListManager (`client/vi/sch/Sch04_Tab_IcsListManager.java`, 449줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: 마감월: {year} {monthComboBox} {startDate} {closeDate} 담당부서: {orgLookup} 발생구분: {issTypeComboBox} 주기구분: {cycleComboBox} {searchButton} {rdButton}
- 툴바 `buttonBar02`: 검색: {searchText} {exceptYnBox} {advisCheckBox}
- 입력·하위 화면: `exceptYnBox` CheckBox, `advisCheckBox` CheckBox, `cycleComboBox` ComboBoxField("IcsCycleClass", "%", "전체"), `startDate` MyDateField, `closeDate` MyDateField, `year` TextField, `monthComboBox` ComboBoxField("MonthsCode", "yyyy", "MM", "월"), `orgLookup` LookupTriggerField 빈칸="전체", `searchText` TextField 빈칸="담당부서/처리자/법규명/관련조문/원인문서", `issTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체", "전체"), `lookupIcsList` Sch04_Lookup_Rd_IcsList, `statusComboBox` ComboBoxField("ScheduleStatusCode"), `lookupIcs` Ics01_Lookup_ClassTreeDetail, `lookupIcr` Icr01_Lookup_ClassTreeDetail, `editor` Apr01_Edit_ApprDoc, `lookup` Sch04_Lookup_IcsMsg, `orgSearch` Org00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid()):
  - closeDate 90 "마감일" Date
  - mngOrgName 120 "담당부서" Text
  - personName 90 "처리자" TextCenter
  - statusName 100 "처리구분" TextCenter
  - manageDate 90 "처리일" Date
  - actionCell 70 "처리결과<br>확인처리" Cell 편집:"456EA6"
  - confirmYn 70 "확인여부" BooleanYn2
  - title 350 "법규명" TextArea
  - actionCell 30 "" Cell 편집:viewLawCell
  - relatedLaw 200 "관련조문" TextArea
  - apprTitle 250 "원인문서" TextArea
  - actionCell 30 "" Cell 편집:viewApprCell
  - issDate 90 "발생일" Date
  - scheduleName 100 "발생구분" TextCenter
  - cycleName 100 "주기구분" TextCenter
  - advisYn 60 "일임<br>(자문)" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L92-137) → setting()
[E1] year.ValueChange (L144) → setDate()
[E2] monthComboBox[MonthsCode].Collapse (L153) → setDate(), retrieve()
[E3] issTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L173) → retrieve()
[E4] cycleComboBox[IcsCycleClass].Collapse (L182) → retrieve()
[E5] orgLookup.TriggerClick (L193) → lookupOrg()
[E6] searchText.KeyPress [Enter] (L202) → retrieve()
[E7] searchButton[조회].Select (L217) → retrieve()
[E8] rdButton[출력/다운로드].Select [result.getStatus() == 1] (L224) → 서비스 sys.Sys99_Print.insertRdIcsList(companyId, personId, windowClassName, orgId, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, managerYn, searchText, advisYn)
[E9] statusComboBox[ScheduleStatusCode].Collapse (L264) → 인라인 L264-271 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L75-81 | setting,buildGrid,retrieve,viewAppr,editResult,lookupOrg | 상태 처리 | 업무 |
| private setting() | L139-258 | 생성자 | 조회창 Sch04_Lookup_Rd_IcsList 열기 → 콜백: unmask, 서비스 sys.Sys00_Common.selectByKindGroupCode, sys.Sys99_Print.insertRdIcsList(companyId, personId, windowClassName, orgId, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, managerYn, searchText, advisYn) | 업무 |
| private retrieve() | L316-338 | E2,E3,E4,E6,E7 | 서비스 sch.Sch04_List.selectByIcs(companyId, personId, orgId, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, managerYn, searchText, advisYn) | 업무 |
| private viewLaw() | L340-351 | buildGrid | 조회창 Ics01_Lookup_ClassTreeDetail 열기, 조회창 Icr01_Lookup_ClassTreeDetail 열기 | 업무 |
| private viewAppr() | L353-381 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "원인문서가 존재하지 않습니다" | 업무 |
| private editResult() | L383-408 | buildGrid | 조회창 Sch04_Lookup_IcsMsg 열기, 미선택 시 alert "미처리내역 입니다." | 업무 |
| private lookupOrg() | L410-427 | E5 | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private setDate() | L429-436 | E1,E2,execute | 상태 처리 | 업무 |
| public buildGrid() | L260-314 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L438-440 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L442-444 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L446-448 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 90, '마감일'),  // L296
  gb.text('mngOrgNm', 120, '담당부서'),  // L297
  gb.textCenter('personNm', 90, '처리자'),  // L298
  gb.textCenter('statusNm', 100, '처리구분'),  // L299
  gb.date('manageDate', 90, '처리일'),  // L300
  // ⚠ 대응 없음 (GridBuilder L301) addCell
  gb.booleanYn2('confirmYn', 70, '확인여부'),  // L302
  gb.textArea('title', 350, '법규명'),  // L303
  // ⚠ 대응 없음 (GridBuilder L304) addCell
  gb.textArea('relatedLaw', 200, '관련조문'),  // L305
  gb.textArea('apprTitle', 250, '원인문서'),  // L306
  // ⚠ 대응 없음 (GridBuilder L307) addCell
  gb.date('issDate', 90, '발생일'),  // L308
  gb.textCenter('scheduleNm', 100, '발생구분'),  // L309
  gb.textCenter('cycleNm', 100, '주기구분'),  // L310
  gb.booleanYn2('advisYn', 60, '일임<br>(자문)'),  // L311
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdIcsList(companyId, personId, windowClassName, orgId, startDate, closeDate, doneExceptYn, scheduleCode, cycleCode, managerYn, searchText, advisYn) */}>출력/다운로드</Button>

### Sch04_Lookup_Rd_IcsList (`client/vi/sch/Sch04_Lookup_Rd_IcsList.java`, 86줄)


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

### Sch04_Lookup_IcsMsg (`client/vi/sch/Sch04_Lookup_IcsMsg.java`, 205줄)

- 입력·하위 화면: `note` MyTextArea, `confirmerName` TextField, `confirmDate` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L51-58) → 초기화
[E1] updateButton[저장].Select (L92) → update()
[E2] confirmButton[확인].Select (L98) → update()
[E3] cancelButton[확인취소].Select (L104) → update()
[E4] closeButton[닫기].Select (L110) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-84 | 공개 메서드 | 상태 처리 | 업무 |
| private setEnable() | L118-148 | settings,update | 상태 처리 | 업무 |
| private getEditor() | L150-169 | open | 상태 처리 | 업무 |
| public update() | L171-197 | E1,E2,E3 | 서비스 sch.Sch04_List.updateConfirm(type, confirmerId) | 업무 |
| private settings() | L86-116 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L199-201 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="save" onClick={update}>확인</Button>
3. <Button type="cancel" onClick={update}>확인취소</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

