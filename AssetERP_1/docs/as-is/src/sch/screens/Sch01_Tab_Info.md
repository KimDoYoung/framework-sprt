# Sch01_Tab_Info

- 종류: 화면
- 메뉴: 스케줄 > 01. 업무일정 > 업무일정 등록 (#1042)
- 파일: `client/vi/sch/Sch01_Tab_Info.java`
- 함께 쓰는 클래스 14개:
  - `Sch01_Lookup_ManagerModi` `client/vi/sch/Sch01_Lookup_ManagerModi.java`
  - `Sch01_Lookup_ManagerModiRun` `client/vi/sch/Sch01_Lookup_ManagerModiRun.java`
  - `Sch01_Lookup_Info` `client/vi/sch/Sch01_Lookup_Info.java`
  - `Sch08_Lookup_Class` `client/vi/sch/Sch08_Lookup_Class.java`
  - `Sch03_Lookup_Short` `client/vi/sch/Sch03_Lookup_Short.java`
  - `Sch03_TabPage_Short99` `client/vi/sch/Sch03_TabPage_Short99.java`
  - `Sch03_Lookup_Cycle` `client/vi/sch/Sch03_Lookup_Cycle.java`
  - `Sch03_TabPage_Cycle06` `client/vi/sch/Sch03_TabPage_Cycle06.java`
  - `Sch03_TabPage_Cycle05` `client/vi/sch/Sch03_TabPage_Cycle05.java`
  - `Sch03_TabPage_Cycle04` `client/vi/sch/Sch03_TabPage_Cycle04.java`
  - `Sch03_TabPage_Cycle03` `client/vi/sch/Sch03_TabPage_Cycle03.java`
  - `Sch03_TabPage_Cycle02` `client/vi/sch/Sch03_TabPage_Cycle02.java`
  - `Sch03_TabPage_Cycle01` `client/vi/sch/Sch03_TabPage_Cycle01.java`
  - `Sch01_Grid_RelateFile` `client/vi/sch/Sch01_Grid_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Org00_Lookup_SelectMulti`](../../org/components/Org00_Lookup_SelectMulti.md), [`Sch06_Lookup_AlarmSetup`](../../sch/components/Sch06_Lookup_AlarmSetup.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sch.Sch01_Info.checkSchInfo` | Sch01_Tab_Info:300 | [`Sch01_Info.java:81`](../../sch/services/Sch01_Info.md) | [`sch04_list.checkSchInfo`](../../sch/sql/sch04_list.md) |
| `sch.Sch01_Info.copySchedule` | Sch01_Lookup_ManagerModiRun:195 | [`Sch01_Info.java:92`](../../sch/services/Sch01_Info.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch01_info.insertByInfoId`](../../sch/sql/sch01_info.md), [`sch01_info.selectByIdList`](../../sch/sql/sch01_info.md), [`sch01_info.updateUseYnByInfoId`](../../sch/sql/sch01_info.md), [`sch02_share.insertByInfoId`](../../sch/sql/sch02_share.md), [`sch03_deadline.insertByInfoId`](../../sch/sql/sch03_deadline.md), [`sch05_relate_ics.insertByInfoId`](../../sch/sql/sch05_relate_ics.md), [`sch06_alarm.insertByTargetId`](../../sch/sql/sch06_alarm.md), [`sch08_class.insertByClassId`](../../sch/sql/sch08_class.md) |
| `sch.Sch01_Info.delete` | Sch01_Tab_Info:312 | [`Sch01_Info.java:212`](../../sch/services/Sch01_Info.md) | `UpdateDataModel(sch01_info)` 동적 DELETE |
| `sch.Sch01_Info.deleteByInfoId` | Sch01_Lookup_Info:922 | [`Sch01_Info.java:207`](../../sch/services/Sch01_Info.md) | [`sch01_info.deleteByInfoId`](../../sch/sql/sch01_info.md) |
| `sch.Sch01_Info.selectById` | Sch01_Lookup_Info:959 | [`Sch01_Info.java:22`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectById`](../../sch/sql/sch01_info.md) |
| `sch.Sch01_Info.selectByManagerId` | Sch01_Lookup_ManagerModi:210 | [`Sch01_Info.java:75`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectByManagerId`](../../sch/sql/sch01_info.md) |
| `sch.Sch01_Info.selectByText` | Sch01_Tab_Info:246 | [`Sch01_Info.java:27`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectByText`](../../sch/sql/sch01_info.md) |
| `sch.Sch01_Info.update` | Sch01_Lookup_Info:867, Sch01_Lookup_Info:944 | [`Sch01_Info.java:199`](../../sch/services/Sch01_Info.md) | `UpdateDataModel(sch01_info)` 동적 INSERT/UPDATE → [`sch01_info.selectById`](../../sch/sql/sch01_info.md) |
| `sch.Sch02_Share.delete` | Sch01_Lookup_Info:760 | [`Sch02_Share.java:95`](../../sch/services/Sch02_Share.md) | `UpdateDataModel(sch02_share)` 동적 DELETE |
| `sch.Sch02_Share.selectByInfoId` | Sch01_Lookup_Info:798 | [`Sch02_Share.java:35`](../../sch/services/Sch02_Share.md) | [`sch02_share.selectByInfoId`](../../sch/sql/sch02_share.md) |
| `sch.Sch02_Share.update` | Sch01_Lookup_Info:749 | [`Sch02_Share.java:90`](../../sch/services/Sch02_Share.md) | `UpdateDataModel(sch02_share)` 동적 INSERT/UPDATE → [`sch02_share.selectById`](../../sch/sql/sch02_share.md) |
| `sch.Sch03_Deadline.delete` | Sch01_Lookup_Info:887 | [`Sch03_Deadline.java:108`](../../sch/services/Sch03_Deadline.md) | `UpdateDataModel(sch03_deadline)` 동적 DELETE |
| `sch.Sch03_Deadline.insertModel` | Sch03_Lookup_Cycle:259, Sch03_Lookup_Short:136 | [`Sch03_Deadline.java:76`](../../sch/services/Sch03_Deadline.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), `UpdateDataModel(sch03_deadline)` 동적 INSERT/UPDATE → [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.selectByInfoId` | Sch01_Lookup_Info:810 | [`Sch03_Deadline.java:33`](../../sch/services/Sch03_Deadline.md) | [`sch03_deadline.selectByInfoId`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch03_Deadline.updateModel` | Sch01_Lookup_Info:986 | [`Sch03_Deadline.java:50`](../../sch/services/Sch03_Deadline.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sch03_deadline.insert`](../../sch/sql/sch03_deadline.md), [`sch03_deadline.selectById`](../../sch/sql/sch03_deadline.md) |
| `sch.Sch08_Class.checkClassId` | Sch08_Lookup_Class:162 | [`Sch08_Class.java:27`](../../sch/services/Sch08_Class.md) | [`sch01_info.checkClassId`](../../sch/sql/sch01_info.md) |
| `sch.Sch08_Class.delete` | Sch08_Lookup_Class:235 | [`Sch08_Class.java:41`](../../sch/services/Sch08_Class.md) | `UpdateDataModel(sch08_class)` 동적 DELETE |
| `sch.Sch08_Class.selectByPersonId` | Sch08_Lookup_Class:143 | [`Sch08_Class.java:22`](../../sch/services/Sch08_Class.md) | [`sch08_class.selectByPersonId`](../../sch/sql/sch08_class.md) |
| `sch.Sch08_Class.update` | Sch08_Lookup_Class:223 | [`Sch08_Class.java:36`](../../sch/services/Sch08_Class.md) | `UpdateDataModel(sch08_class)` 동적 INSERT/UPDATE → [`sch08_class.selectById`](../../sch/sql/sch08_class.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Sch03_TabPage_Cycle04:62, Sch03_TabPage_Cycle05:62 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectDeadLine` | Sch01_Lookup_Info:141 | [`Sys00_Common.java:21`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectDeadLine`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectScheduleClass` | Sch01_Lookup_Info:227, Sch01_Lookup_ManagerModi:122, Sch01_Tab_Info:121 | [`Sys00_Common.java:166`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectScheduleClass`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Sch01_Grid_RelateFile:152 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Sch01_Grid_RelateFile:163 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch05_relate_ics`](../../../db/tables/sch.md), [`sch06_alarm`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_alarm_info`, `f_get_deadline_nm`, `f_ics_class_tree_nm`, `f_org_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch01_Tab_Info (`client/vi/sch/Sch01_Tab_Info.java`, 342줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 분류: {scheduleClassComboBox} 주기: {cycleComboBox} 검색: {searchText} {dailyYnCheckBox} {useYnCheckBox} {retrieveButton} {insertButton} {deleteButton}
- 툴바 `buttonBarR`: {managerButton}
- 입력·하위 화면: `cycleComboBox` ComboBoxField("CycleCode", "%", "전체"), `searchText` TextField 빈칸="스케줄명/주기구분/보고처", `useYnCheckBox` CheckBox, `dailyYnCheckBox` CheckBox, `scheduleClassComboBox` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass", "전체", "전체"), `popup` Sch01_Lookup_Info, `lookup` Sch01_Lookup_ManagerModi
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 45 "수정" Cell 편집:editCell
  - className 150 "분류" Text
  - title 300 "스케줄명" Text
  - deadlineName 120 "주기구분" Text
  - deadlineFullName 150 "처리일정보" Text
  - shareOrgName 130 "공유부서" Text
  - sharePersonName 120 "공유자" Text
  - alarmInfo 200 "알람설정" Text
  - dailyYnName 80 "데일리여부" TextCenter
  - privateYnName 80 "비공개여부" TextCenter
  - useYn 80 "사용여부" BooleanString

#### 이벤트
[E0] 화면 열림 (생성자 L71-114) → settings()
[E1] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass].Collapse (L131) → retrieve()
[E2] cycleComboBox[CycleCode].Collapse (L140) → retrieve()
[E3] searchText.KeyPress [Enter] (L149) → retrieve()
[E4] retrieveButton[조회].Select (L164) → retrieve()
[E5] insertButton[등록].Select (L171) → insertRow()
[E6] deleteButton[삭제].Select (L178) → deleteRow()
       └ [E8] messageBox.DialogHide (L281) → delete()
[E7] managerButton[담당자 변경].Select (L185) → lookupManager()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L232-254 | E1,E2,E3,E4,settings,lookupManager | 서비스 sch.Sch01_Info.selectByText(companyId, userId, classId, cycleCode, searchText, dailyYn, useYn) | 업무 |
| public insertRow() | L256-277 | E5 | 조회창 Sch01_Lookup_Info 열기 | 업무 |
| public deleteRow() | L279-291 | E6 | ConfirmBox → E8 | 업무 |
| public delete() | L293-323 | E8 | 미선택 시 alert "이미 발생한 스케줄이므로 삭제할 수 없는 정보입니다", GridDeleteData sch.Sch01_Info.checkSchInfo, sch.Sch01_Info.delete(체크된 행 목록) | 업무 |
| private lookupManager() | L325-333 | E7 | 조회창 Sch01_Lookup_ManagerModi 열기 | 업무 |
| private settings() | L116-191 | 생성자 | 서비스 sys.Sys00_Common.selectScheduleClass, 이벤트 연결, 초기값: dailyYnCheckBox=false("데일리 체크리스트만 보기"), useYnCheckBox=true("사용스케줄만 보기") | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L193-230 | 필드 초기화 | 조회창 Sch01_Lookup_Info 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxLabelStyle() | L335-337 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L339-341 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L216) addCell
  gb.text('classNm', 150, '분류'),  // L217
  gb.text('title', 300, '스케줄명'),  // L218
  gb.text('deadlineNm', 120, '주기구분'),  // L219
  gb.text('deadlineFullNm', 150, '처리일정보'),  // L220
  gb.text('shareOrgNm', 130, '공유부서'),  // L222
  gb.text('sharePersonNm', 120, '공유자'),  // L223
  gb.text('alarmInfo', 200, '알람설정'),  // L224
  gb.textCenter('dailyYnNm', 80, '데일리여부'),  // L225
  gb.textCenter('privateYnNm', 80, '비공개여부'),  // L226
  // ⚠ 대응 없음 (GridBuilder L227) addBooleanString
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="assign" onClick={lookupManager}>담당자 변경</Button>

### Sch01_Lookup_ManagerModi (`client/vi/sch/Sch01_Lookup_ManagerModi.java`, 242줄)

- 툴바 `buttonBar`: 담당자: {managerName} 분류: {scheduleClassComboBox} 검색: {searchText} {retrieveButton} {updateButton}
- 입력·하위 화면: `managerId` LongField, `managerName` LookupTriggerField, `searchText` TextField 빈칸="스케줄명/보고처", `scheduleClassComboBox` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass", "전체", "전체"), `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `lookupRun` Sch01_Lookup_ManagerModiRun
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - className 150 "분류" Text
  - title 400 "스케줄명" Text
  - report 200 "보고처" Text

#### 이벤트
[E0] 화면 열림 (생성자 L61-69) → 초기화
[E1] managerName.TriggerClick (L109) → openLookupManagerInfo()
[E2] scheduleClassComboBox[sys.Sys00_Common.selectScheduleClass].Collapse (L130) → retrieve()
[E3] searchText.KeyPress [Enter] (L139) → retrieve()
[E4] retrieveButton[조회].Select (L148) → retrieve()
[E5] updateButton[변경].Select (L154) → update()
[E6] closeButton[닫기].Select [callback != null] (L160) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L71-98 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupManagerInfo() | L171-181 | E1 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| public retrieve() | L195-216 | E2,E3,E4,settings,update | 서비스 sch.Sch01_Info.selectByManagerId(companyId, managerId, classId, searchText) | 업무 |
| private update() | L218-232 | E5 | 조회창 Sch01_Lookup_ManagerModiRun 열기 | 업무 |
| private settings() | L100-169 | open | 서비스 sys.Sys00_Common.selectScheduleClass, 이벤트 연결, 초기값: managerId=LoginUser.getUserId( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L183-193 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L234-236 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L238-240 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classNm', 150, '분류'),  // L188
  gb.text('title', 400, '스케줄명'),  // L189
  gb.text('report', 200, '보고처'),  // L190
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="change" onClick={update}>변경</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch01_Lookup_ManagerModiRun (`client/vi/sch/Sch01_Lookup_ManagerModiRun.java`, 224줄)

- 입력·하위 화면: `befManagerId` LongField, `befManagerName` TextField, `aftManagerId` LongField, `aftManagerName` LookupTriggerField 빈칸="선택하세요", `copyRadio` Radio, `moveRadio` Radio, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L67-97) → show()
[E1] aftManagerName[변경 후 담당자].TriggerClick (L125) → openLookupManagerInfo()
[E2] updateButton[변경하기].Select (L132) → preUpdate()
       └ [E4] messageBox.DialogHide (L169) → update()
[E3] closeButton[닫기].Select [callback != null] (L139) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L99-105 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupManagerInfo() | L150-160 | E1 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private preUpdate() | L162-179 | E2 | ConfirmBox → E4 | 업무 |
| private update() | L181-212 | E4 | 서비스 sch.Sch01_Info.copySchedule(managerId, procType) | 업무 |
| private settings() | L107-148 | open | 이벤트 연결, 초기값: moveRadio=true("이동"), copyRadio=false("처리구분"), aftManagerId=null | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L214-216 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L217-219 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlRadioLabelStyle() | L220-222 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={preUpdate}>변경하기</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Sch01_Lookup_Info (`client/vi/sch/Sch01_Lookup_Info.java`, 1040줄)

- 툴바 `buttonBar02`: {hlc02}
- 툴바 `buttonBar03`: {hlc03}
- 툴바 `buttonBar02R`: {alarmButton}
- 툴바 `buttonBarHlc01L`: {className}
- 입력·하위 화면: `title` TextField 빈칸="내용을 입력해주세요", `report` TextField 빈칸="내용을 입력해주세요", `classId` LongField, `content` TextArea 빈칸="내용을 입력해주세요", `managerId` LongField, `dailyYn` CheckBox, `privateYn` CheckBox, `managerName` LookupTriggerField, `useTrue` Radio, `useFalse` Radio, `radio01` Radio, `radio02` Radio, `deadlineComboBox` CommonComboBoxField("sys.Sys00_Common.selectDeadLine", "(수시)") 빈칸="선택하세요", `className` CommonComboBoxField("sys.Sys00_Common.selectScheduleClass", "<선택안함>") 빈칸="분류를 선택해주세요", `lookup` Sch08_Lookup_Class, `lookupShort` Sch03_Lookup_Short("1"), `lookupCycle` Sch03_Lookup_Cycle("1"), `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `shareGrid` (shareGrid()):
  - shareName 100 "구분" TextCenter
  - orgName 380 "부서" TextCenter
  - personName 180 "성명" TextCenter
- 그리드 `deadlineGrid` (deadlinedGrid()):
  - cycleName 120 "주기구분" TextCenter
  - deadlineFullName 300 "처리일 정보" Text
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date
  - actionCell 50 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L167-251) → getEditor(), show()
[E1] managerName.TriggerClick (L183) → openLookupManagerInfo()
[E2] updateButton[저장].Select (L199) → update()
[E3] closeButton[닫기].Select [callback != null] (L205) → newDataRollback(), hide()
[E4] className[sys.Sys00_Common.selectScheduleClass].ValueChange (L229) → 인라인 L229-238 (new ValueChangeHandler<String>() { @O…)
[E5] useToggleGroup.ValueChange (L305) → 인라인 L305-314 (new ValueChangeHandler<HasValue<Boole…)
[E6] privateYn[비공개 스케줄].ValueChange [YES] (L319) → setShareEnabled(), deleteRow02All(), setShareEnabled()
[E7] messageBox.DialogHide [YES] (L326) → setShareEnabled(), deleteRow02All()
[E8] anchor02.MouseDown (L349) → retrieve02()
[E9] anchor03.MouseDown (L356) → retrieve03()
[E10] insertButton02[행 추가].Select (L377) → insertRow02()
[E11] deleteButton02[행 삭제].Select (L383) → deleteRow02()
[E12] loadButton[선택].Select (L405) → load()
[E13] deleteButton[삭제].Select (L411) → deleteRow()
       └ [E18] messageBox.DialogHide [YES] (L881) → 서비스 sch.Sch03_Deadline.delete
[E14] shortButton[일회성조건].Select (L417) → shortInsert()
[E15] cycleButton[반복주기조건].Select (L423) → cycleInsert()
[E16] alarmButton[알람설정].Select (L429) → lookupAlarm()
[E17] addClassButton[분류추가].Select (L435) → execute()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L143-151 | E17,deadlinedGrid,openLookupManagerInfo,openLookupOrgInfo,openLookupEmpInfo,update02,retrieve02,retrieve03,shortInsert,cycleInsert,lookupAlarm | 상태 처리 | 업무 |
| public openNew() | L253-257 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L259-296 | openNew | 상태 처리 | 업무 |
| private setShareEnabled() | L473-479 | E6,E7,open | 상태 처리 | 업무 |
| private shareGrid() | L481-488 | 필드 초기화 | 상태 처리 | 업무 |
| private deadlinedGrid() | L490-523 | 필드 초기화 | 조회창 Sch03_Lookup_Short 열기, 조회창 Sch03_Lookup_Cycle 열기 | 업무 |
| private getEditor() | L533-623 | 생성자 | 상태 처리 | 업무 |
| private openLookupManagerInfo() | L625-635 | E1 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private openLookupOrgInfo() | L637-663 | insertRow02 | 조회창 Org00_Lookup_SelectMulti 열기 | 업무 |
| private openLookupEmpInfo() | L665-694 | insertRow02 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private insertRow02() | L734-742 | E10 | 상태 처리 | 업무 |
| private update02() | L744-771 | update | GridDeleteData sch.Sch02_Share.update, sch.Sch02_Share.delete | 업무 |
| private deleteRow02() | L773-779 | E11 | 상태 처리 | 업무 |
| private deleteRow02All() | L781-790 | E6,E7 | 상태 처리 | 업무 |
| private retrieve02() | L792-804 | E8,open | 서비스 sch.Sch02_Share.selectByInfoId(companyId, infoId) | 업무 |
| private retrieve03() | L806-816 | E9,open,deadlinedGrid,load,shortInsert,cycleInsert | 서비스 sch.Sch03_Deadline.selectByInfoId(companyId, infoId) | 업무 |
| private update01() | L864-876 | open | 서비스 sch.Sch01_Info.update | 업무 |
| public deleteRow() | L878-893 | E13 | ConfirmBox → E18 | 업무 |
| private newDataRollback() | L921-936 | E3 | 서비스 sch.Sch01_Info.deleteByInfoId | 업무 |
| public update() | L938-956 | E2 | 서비스 sch.Sch01_Info.update | 업무 |
| private updateEnd() | L958-976 | update02 | 서비스 sch.Sch01_Info.selectById(infoId) | 업무 |
| public load() | L978-1000 | E12 | 서비스 sch.Sch03_Deadline.updateModel(deadlineId, classTreeId, companyId, scheduleCode) | 업무 |
| public shortInsert() | L1002-1009 | E14 | 조회창 Sch03_Lookup_Short 열기 | 업무 |
| public cycleInsert() | L1011-1018 | E15 | 조회창 Sch03_Lookup_Cycle 열기 | 업무 |
| private lookupAlarm() | L1020-1027 | E16 | 조회창 Sch06_Lookup_AlarmSetup 열기 | 업무 |
| private settings() | L298-471 | open | 조회창 Sch08_Lookup_Class 열기, 확인창 표시, 이벤트 연결, 초기값: useTrue=true("사용"), useFalse=false("미사용"), privateYn=false("비공개 스케줄"), radio01=false("직원"), radio02=true("부서") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L1029-1031 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L1033-1035 | 생성자,openNew,open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L1037-1039 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const shareGrid = () => [
  gb.textCenter('shareNm', 100, '구분'),  // L483 SQL 계산 컬럼(selectByInfoId: f_cdnm('ShareCode', sch02_share_cd, sch…)
  gb.textCenter('orgNm', 380, '부서'),  // L484 SQL 계산 컬럼(selectByInfoId: f_org_nm(sch02_org_id, f_sysdate()))
  gb.textCenter('personNm', 180, '성명'),  // L485 SQL 계산 컬럼(selectByInfoId: f_emp_kor_nm(sch02_person_id))
];

const deadlinedGrid = () => [
  gb.textCenter('cycleNm', 120, '주기구분'),  // L516 SQL 계산 컬럼(selectByInfoId: f_cdnm('CycleCode', sch03_cycle_cd, sch…)
  gb.text('deadlineFullNm', 300, '처리일 정보'),  // L517 SQL 계산 컬럼(selectByInfoId: f_get_deadline_nm(sch03_deadline_id, '2…)
  gb.date('startDate', 100, '시작일'),  // L518
  gb.date('closeDate', 100, '종료일'),  // L519
  // ⚠ 대응 없음 (GridBuilder L520) addCell
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={execute}>분류추가</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="unknown" onClick={() => /* newDataRollback(), hide() */}>닫기</Button>
4. <Button type="addRow" onClick={insertRow02}>행 추가</Button>
5. <Button type="removeRow" onClick={deleteRow02}>행 삭제</Button>
6. <Button type="view" onClick={lookupAlarm}>알람설정</Button>
7. <Button type="select" onClick={load}>선택</Button>
8. <Button type="addRow" onClick={shortInsert}>일회성조건</Button>
9. <Button type="addRow" onClick={cycleInsert}>반복주기조건</Button>
10. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Sch08_Lookup_Class (`client/vi/sch/Sch08_Lookup_Class.java`, 258줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {anchor}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - className 200 "분류" Text 편집:TextField
  - seq 70 "조회순서" LongCenter 편집:LongField
  - note 150 "비고" Text 편집:TextField
  - useYn 70 "사용" Boolean

#### 이벤트
[E1] anchor.MouseDown (L74) → retrieve()
[E2] insertButton[행 추가].Select (L99) → insertRow()
[E3] deleteButton[행 삭제].Select (L105) → deleteRow()
[E4] updateButton[저장].Select (L111) → preUpdate()
[E5] cancelButton[닫기].Select (L117) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-96 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L98-123 | open | 상태 처리 | 업무 |
| private retrieve() | L137-149 | E1,open | 서비스 sch.Sch08_Class.selectByPersonId(personId) | 업무 |
| private insertRow() | L151-158 | E2 | 상태 처리 | 업무 |
| private deleteRow() | L160-180 | E3 | 서비스 sch.Sch08_Class.checkClassId(classId) | 업무 |
| private preUpdate() | L182-209 | E4 | 상태 처리 | 업무 |
| private update() | L211-246 | preUpdate | GridDeleteData sch.Sch08_Class.update, sch.Sch08_Class.delete | 업무 |
| private updateEnd() | L248-252 | update | 상태 처리 | 업무 |
| private buildGrid() | L125-135 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L254-256 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('classNm', 200, '분류', { editor: 'text' }),  // L129
  gb.longCenter('seq', 70, '조회순서', { editor: 'number' }),  // L130
  gb.text('note', 150, '비고', { editor: 'text' }),  // L131
  gb.boolean('useYn', 70, '사용'),  // L132
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
3. <Button type="save" onClick={preUpdate}>저장</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Sch01_Grid_RelateFile (`client/vi/sch/Sch01_Grid_RelateFile.java`, 212줄)

- 툴바 `buttonBar`: {updateButton} {fileUploadForm}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 400 "첨부파일명" Text
  - actionCell 80 "받기" Cell 편집:downloadCell
  - actionCell 80 "삭제" Cell 편집:deleteCell
  - actionCell 80 "보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L50-96) → settings()
[E1] fileUploadForm.SubmitComplete (L60) → resetFileUpload(), retrieve()
[E2] fileUpload.Change (L68) → 인라인 L68-75 (new ChangeHandler() { @Override publi…)
[E3] fileDeleteForm.SubmitComplete (L78) → retrieve()
[E4] updateButton[파일업로드].Select (L100) → 인라인 L100-105 (new SelectHandler(){ @Override public…)
[E5] fileUpload.Change (L194) → 인라인 L194-201 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildApprFileGrid() | L108-144 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| public retrieve() | L146-158 | E1,E3,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L160-185 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private resetFileUpload() | L187-202 | E1 | 상태 처리 | 업무 |
| public getServiceResult() | L205-211 | checkFileDelete | 상태 처리 | 업무 |
| private settings() | L98-106 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  gb.text('fileNm', 400, '첨부파일명'),  // L138
  // ⚠ 대응 없음 (GridBuilder L139) addCell
  // ⚠ 대응 없음 (GridBuilder L140) addCell
  // ⚠ 대응 없음 (GridBuilder L141) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L100-105 (new SelectHandler(){ @Override public…) */}>파일업로드</Button>

