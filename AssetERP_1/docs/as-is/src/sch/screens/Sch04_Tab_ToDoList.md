# Sch04_Tab_ToDoList

- 종류: 화면
- 메뉴: 스케줄 > 01. 업무일정 > 업무일정 처리 (#1043)
- 파일: `client/vi/sch/Sch04_Tab_ToDoList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sch01_Lookup_InfoView`](../../sch/components/Sch01_Lookup_InfoView.md), [`Sch10_Lookup_Ipo`](../../sch/components/Sch10_Lookup_Ipo.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch04_List.insertCheck` | Sch04_Tab_ToDoList:449 | [`Sch04_List.java:207`](../../sch/services/Sch04_List.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch04_list.confirmUpdate`](../../sch/sql/sch04_list.md), [`sch04_list.insert`](../../sch/sql/sch04_list.md), [`sch04_list.selectById`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.selectByManagerId` | Sch04_Tab_ToDoList:395 | [`Sch04_List.java:34`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByManagerId`](../../sch/sql/sch04_list.md) |
| `sch.Sch10_Ipo.selectById` | Sch04_Tab_ToDoList:490 | [`Sch10_Ipo.java:16`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |
| `sys.Sys00_Common.selectScheduleClass2` | Sch04_Tab_ToDoList:192 | [`Sys00_Common.java:171`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectScheduleClass2`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`emp03_trans`](../../../db/tables/emp.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch09_deadline_day`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_get_std_date`, `f_org_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Tab_ToDoList (`client/vi/sch/Sch04_Tab_ToDoList.java`, 629줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: {closeRadio} {manageRadio} {anchor01} {stdDate} {anchor02} 분류: {scheduleClassComboBox} 처리여부: {statusComboBox} {exceptYnBox} {cancelYnBox} {searchButton} {updateButton} {personButton}
- 입력·하위 화면: `manageRadio` Radio, `closeRadio` Radio, `stdDate` MyDateField, `exceptYnBox` CheckBox, `cancelYnBox` CheckBox, `scheduleClassComboBox` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass2", "전체", "전체"), `statusComboBox` ComboBoxField("ScheduleStatusCode", "%", "전체", "전체"), `lookupEmpInfo` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `lookup` Sch01_Lookup_InfoView
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - closeDate 100 "마감일" Date
  - className 150 "분류" Text
  - title 500 "일정명" Text
  - cycleName 100 "주기구분" TextCenter
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - statusName 100 "처리여부" TextCenter 편집:"456EA6"
  - manageDate 100 "처리일" Date 편집:"456EA6"
  - personName 100 "담당자" TextCenter 편집:"456EA6"
  - managerName 100 "등록자" TextCenter
  - note 350 "비고" Text 편집:"456EA6"

#### 이벤트
[E0] 화면 열림 (생성자 L103-167) → settings(), setIconStyle(), setInitData()
[E1] anchor01.MouseDown (L109) → retrieve()
[E2] anchor02.MouseDown (L121) → retrieve()
[E3] toggle.ValueChange (L180) → retrieve()
[E4] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass2].Collapse (L199) → retrieve()
[E5] statusComboBox[ScheduleStatusCode].Collapse (L213) → retrieve()
[E6] searchButton[조회].Select (L241) → retrieve()
[E7] updateButton[저장].Select (L247) → update()
[E8] personButton[담당자 일괄변경].Select (L253) → personUpdate()
[E9] statusComboBox[ScheduleStatusCode].Collapse (L270) → 인라인 L270-277 (new CollapseHandler() { @Override pub…)
[E10] lookupEmpInfo.TriggerClick (L285) → 인라인 L285-300 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setInitData() | L261-263 | 생성자 | 상태 처리 | 업무 |
| public retrieveCall() | L359-362 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L364-401 | E1,E2,E3,E4,E5,E6,retrieveCall,update | 서비스 sch.Sch04_List.selectByManagerId(companyId, personId, orgId, manageCheck, startDate, shareType, exceptYn, cancelYn, statusCode, classId, searchText) | 업무 |
| private update() | L403-461 | E7 | 서비스 sch.Sch04_List.insertCheck | 업무 |
| private personUpdate() | L463-481 | E8 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private view() | L483-506 | buildGrid | 조회창 Sch01_Lookup_InfoView 열기, 조회창 Sch10_Lookup_Ipo 열기, 서비스 sch.Sch10_Ipo.selectById | 업무 |
| public setIconStyle() | L626-628 | 생성자 | 상태 처리 | 업무 |
| private settings() | L169-259 | 생성자 | 서비스 sys.Sys00_Common.selectScheduleClass2, 이벤트 연결, 초기값: closeRadio=true("마감일"), manageRadio=false("처리일"), exceptYnBox=false("완료건 제외"), cancelYnBox=true("취소건 제외") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L265-357 | 필드 초기화 | 조회창 Emp00_Lookup_SelectSingle 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L617-619 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L620-622 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L623-625 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 100, '마감일'),  // L341
  gb.text('classNm', 150, '분류'),  // L343
  gb.text('title', 500, '일정명'),  // L344
  gb.textCenter('cycleNm', 100, '주기구분'),  // L345
  // ⚠ 대응 없음 (GridBuilder L346) addCell
  gb.textCenter('statusNm', 100, '처리여부', { editor: 'select' }),  // L350
  gb.date('manageDate', 100, '처리일', { editor: 'date' }),  // L351
  gb.textCenter('personNm', 100, '담당자'),  // L352
  gb.textCenter('managerNm', 100, '등록자'),  // L353
  gb.text('note', 350, '비고', { editor: 'text' }),  // L354
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="save" onClick={personUpdate}>담당자 일괄변경</Button>

