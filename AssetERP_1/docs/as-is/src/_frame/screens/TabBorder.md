# TabBorder

- 종류: 프레임 (로그인·메인 화면 등, 메뉴로 열지 않음)
- 파일: `client/vi/TabBorder.java`
- 함께 쓰는 클래스 9개:
  - `Monitoring_Page_Relate` `client/vi/frm/Monitoring_Page_Relate.java`
  - `Monitoring_Page_Outstanding` `client/vi/frm/Monitoring_Page_Outstanding.java`
  - `Monitoring_Page_IcsNotice` `client/vi/frm/Monitoring_Page_IcsNotice.java`
  - `Monitoring_Page_Emp` `client/vi/frm/Monitoring_Page_Emp.java`
  - `Monitoring_Page_DayList` `client/vi/frm/Monitoring_Page_DayList.java`
  - `Monitoring_Page_CrmProject` `client/vi/frm/Monitoring_Page_CrmProject.java`
  - `Monitoring_Page_Appr` `client/vi/frm/Monitoring_Page_Appr.java`
  - `LoginUser` `client/vi/LoginUser.java`
  - `Calendar` `client/vi/frm/Calendar.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Ast04_Lookup_Cf`](../../ast/components/Ast04_Lookup_Cf.md), [`Bbs02_Lookup_NoticeAdmin`](../../bbs/components/Bbs02_Lookup_NoticeAdmin.md), [`Bbs02_Popup_Notice`](../../bbs/components/Bbs02_Popup_Notice.md), [`Bbs02_Popup_NoticeAdmin`](../../bbs/components/Bbs02_Popup_NoticeAdmin.md), [`Bbs20_Edit_FloralRequest`](../../bbs/components/Bbs20_Edit_FloralRequest.md), [`Car03_Popup_BookingReg`](../../car/components/Car03_Popup_BookingReg.md), [`Emp00_Popup_Emp`](../../emp/components/Emp00_Popup_Emp.md), [`Fnd20_Lookup_ToDoList`](../../fnd/components/Fnd20_Lookup_ToDoList.md), [`MenuGrid`](../../_frame/screens/MenuGrid.md), [`MenuOpener`](../../_frame/screens/MenuOpener.md), [`Mkt03_Lookup_History`](../../mkt/components/Mkt03_Lookup_History.md), [`Mrb01_Popup_MeetingRoomReg`](../../mrb/components/Mrb01_Popup_MeetingRoomReg.md), [`Sch01_Lookup_InfoView`](../../sch/components/Sch01_Lookup_InfoView.md), [`Sch04_Lookup_IcrList`](../../sch/components/Sch04_Lookup_IcrList.md), [`Sch04_Lookup_IcsList`](../../sch/components/Sch04_Lookup_IcsList.md), [`Sch04_Lookup_SchList`](../../sch/components/Sch04_Lookup_SchList.md), [`Sch10_Lookup_Ipo`](../../sch/components/Sch10_Lookup_Ipo.md), [`Sch14_Lookup_IpoMismatch`](../../sch/components/Sch14_Lookup_IpoMismatch.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectMonitorngAppr` | Monitoring_Page_Appr:168 | [`Apr01_Appr.java:919`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectMonitorngAppr`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectOutstanding` | Monitoring_Page_Appr:146, Monitoring_Page_Outstanding:123 | [`Apr01_Appr.java:860`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectOutstanding`](../../apr/sql/apr01_appr.md) |
| `apr.Apr01_Appr.selectTemporary` | Monitoring_Page_Appr:189 | [`Apr01_Appr.java:934`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectTemporary`](../../apr/sql/apr01_appr.md) |
| `ast.Ast04_Cf.selectByRelateId` | Monitoring_Page_DayList:212 | [`Ast04_Cf.java:24`](../../ast/services/Ast04_Cf.md) | [`ast04_cf.selectByRelateId`](../../ast/sql/ast04_cf.md) |
| `bbs.Bbs02_Notice.selectById` | Monitoring_Page_Relate:229 | [`Bbs02_Notice.java:23`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectById`](../../bbs/sql/bbs02_notice.md) |
| `bbs.Bbs02_Notice.selectByTargetCompany` | Calendar:142, Calendar:193 | [`Bbs02_Notice.java:97`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectByTargetCompany`](../../bbs/sql/bbs02_notice.md) |
| `bbs.Bbs02_Notice.selectPersonNotice` | Monitoring_Page_Relate:382 | [`Bbs02_Notice.java:149`](../../bbs/services/Bbs02_Notice.md) | [`bbs02_notice.selectPersonNotice`](../../bbs/sql/bbs02_notice.md) |
| `emp.Emp03_Trans.MonitoringByText` | Monitoring_Page_Emp:197 | [`Emp03_Trans.java:167`](../../emp/services/Emp03_Trans.md) | [`emp03_trans.MonitoringByText`](../../emp/sql/emp03_trans.md) |
| `emp.Emp20_Leave.selectByDate` | Monitoring_Page_Relate:400 | [`Emp20_Leave.java:48`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectByDate`](../../emp/sql/emp20_leave.md) |
| `frm.Frm01_List.selectIcsNotice` | Monitoring_Page_IcsNotice:101 | [`Frm01_List.java:46`](../../frm/services/Frm01_List.md) | [`frm01_list.selectIcsNotice`](../../frm/sql/frm01_list.md) |
| `frm.Frm01_List.selectToDoList` | Monitoring_Page_DayList:329 | [`Frm01_List.java:33`](../../frm/services/Frm01_List.md) | [`frm01_list.selectToDoList`](../../frm/sql/frm01_list.md) |
| `mkt.Mkt03_History.selectByRegDate` | Monitoring_Page_Relate:365 | [`Mkt03_History.java:29`](../../mkt/services/Mkt03_History.md) | [`mkt03_history.selectByRegDate`](../../mkt/sql/mkt03_history.md) |
| `mrb.Mrb01_Booking.selectByBookingDate` | Monitoring_Page_Relate:415 | [`Mrb01_Booking.java:76`](../../mrb/services/Mrb01_Booking.md) | [`mrb01_booking.selectByBookingDate`](../../mrb/sql/mrb01_booking.md) |
| `sch.Sch01_Info.selectMyPageOrgSchedule` | Monitoring_Page_Relate:348 | [`Sch01_Info.java:51`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectMyPageOrgSchedule`](../../sch/sql/sch01_info.md) |
| `sch.Sch01_Info.selectMyPageSchedule` | Monitoring_Page_Relate:328 | [`Sch01_Info.java:39`](../../sch/services/Sch01_Info.md) | [`sch01_info.selectMyPageSchedule`](../../sch/sql/sch01_info.md) |
| `sch.Sch04_List.selectByToDoList` | Monitoring_Page_Relate:427 | [`Sch04_List.java:318`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByToDoList`](../../sch/sql/sch04_list.md) |
| `sch.Sch10_Ipo.selectById` | Monitoring_Page_DayList:301 | [`Sch10_Ipo.java:16`](../../sch/services/Sch10_Ipo.md) | [`sch10_ipo.selectById`](../../sch/sql/sch10_ipo.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`apr22_relate_icr`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast03_cf_info`](../../../db/tables/ast.md), [`ast04_cf`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`ast10_manager`](../../../db/tables/ast.md), [`bbs02_notice`](../../../db/tables/bbs.md), [`bbs03_target`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md), [`bbs05_history`](../../../db/tables/bbs.md), [`bbs07_comment`](../../../db/tables/bbs.md), [`bbs10_biz_share`](../../../db/tables/bbs.md), [`bbs20_floral_request`](../../../db/tables/bbs.md), [`bbs21_floral_request_share`](../../../db/tables/bbs.md), [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`car01_info`](../../../db/tables/car.md), [`car03_booking`](../../../db/tables/car.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md), [`emp25_mypage_notice`](../../../db/tables/emp.md), [`emp31_director`](../../../db/tables/emp.md), [`emp53_biz_trip`](../../../db/tables/emp.md), [`emp54_errand`](../../../db/tables/emp.md), [`emp56_share`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd20_plan`](../../../db/tables/fnd.md), [`icr01_class_tree`](../../../db/tables/icr.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`mkt03_history`](../../../db/tables/mkt.md), [`mkt04_relate_fund`](../../../db/tables/mkt.md), [`mkt05_share`](../../../db/tables/mkt.md), [`mrb01_booking`](../../../db/tables/mrb.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay50_expense`](../../../db/tables/pay.md), [`sch01_info`](../../../db/tables/sch.md), [`sch02_share`](../../../db/tables/sch.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md), [`sch08_class`](../../../db/tables/sch.md), [`sch09_deadline_day`](../../../db/tables/sch.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sch14_ipo_mismatch`](../../../db/tables/sch.md), [`sms10_alarm_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys28_login_real_time`](../../../db/tables/sys.md)

## DB 함수

`f_add_day`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_appr_close_date`, `f_get_biz_date`, `f_get_close_date`, `f_get_corp_nm`, `f_get_deadline_nm`, `f_get_emptrans`, `f_get_ics_manager`, `f_get_ics_nm`, `f_get_ics_unmanage`, `f_get_last_day`, `f_get_leave_days2`, `f_get_std_date`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### TabBorder (`client/vi/TabBorder.java`, 212줄)

- 레이아웃: west=westVlc, center=centerVlc, east=eastVlc
- 툴바 `buttonBarL`: {seletDateStr}
- 툴바 `buttonBarR`: {baroButton}
- 입력·하위 화면: `crmGrid` Monitoring_Page_CrmProject, `relateGrid` Monitoring_Page_Relate("알림", "부서일정", "↪ 일정 바로가기", "↪ 등록 바로가기"), `toDoGrid` Monitoring_Page_DayList, `outstandingGrid` Monitoring_Page_Outstanding, `apprGird` Monitoring_Page_Appr, `icsNoticeGrid` Monitoring_Page_IcsNotice, `empGrid` Monitoring_Page_Emp

#### 이벤트
[E0] 화면 열림 (생성자 L63-151) → settings()
[E1] baroButton.Click (L154) → 인라인 L154-159 (new ClickHandler() { @Override public…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L43-55 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L163-171 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveTimer() | L173-181 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieveClear() | L183-191 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L194-195 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L198-199 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L202-203 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L153-160 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCalendarButtonStyle() | L205-207 | execute,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCalendarStyle() | L209-211 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Monitoring_Page_Relate (`client/vi/frm/Monitoring_Page_Relate.java`, 679줄)

- 입력·하위 화면: `lookup` Mkt03_Lookup_History
- 그리드 `grid01` (buildGrid01(), 행번호숨김):
  - className 120 "분류" Text
  - title 300 "나의일정명" Text
  - managerName 90 "등록자" TextCenter
  - closeDate 85 "마감일" Date
  - manageDate 85 "처리일" Date
  - actionCell 60 "상세보기" Cell 편집:viewCell
- 그리드 `grid01_1` (buildGrid01_1(), 행번호숨김):
  - orgName 180 "등록부서" Text
  - className 100 "분류" Text
  - title 300 "일정명" Text
  - closeDate 85 "마감일" Date
  - actionCell 60 "상세보기" Cell 편집:viewCell
- 그리드 `grid02` (buildGrid02(), 행번호숨김):
  - activityDate 85 "활동일" Date
  - targetCompanyName 150 "활동처" Text
  - activityTitle 230 "활동내용" Text
  - personOrgName 120 "작성자" Text
  - regDate 85 "작성일" Date
  - actionCell 60 "상세보기" Cell 편집:viewCell
- 그리드 `grid03` (buildGrid03(), 행번호숨김):
  - noticeTypeName 80 "구분" TextCenter
  - title 590 "내용" Text
  - actionCell 60 "상세보기" Cell 편집:viewCell
- 그리드 `grid04` (buildGrid04(), 행번호숨김):
  - personName 120 "사원명" Text
  - leaveName 380 "내용" Text
  - stdPeriod 170 "기간" Text
  - actionCell 60 "상세보기" Cell 편집:viewCell
- 그리드 `grid05` (buildGrid05(), 행번호숨김):
  - typeName 80 "구분" TextCenter
  - empName 120 "예약자" Text
  - content 250 "내용" Text
  - attendance 120 "참석자" Text
  - time 100 "예약시간" TextCenter
  - actionCell 60 "상세보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L107-123) → settings(), retrieve()
[E1] plainTabPanel.Selection [arg0 != null] (L141) → 인라인 L141-160 (new SelectionHandler<Widget>(){ @Over…)
[E2] button01[휴가].Select (L554) → 인라인 L554-561 (new SelectHandler() { @Override publi…)
[E3] button02[외출].Select (L562) → 인라인 L562-569 (new SelectHandler() { @Override publi…)
[E4] button03[출장].Select (L570) → 인라인 L570-577 (new SelectHandler() { @Override publi…)
[E5] button01[휴가].Select (L593) → 인라인 L593-600 (new SelectHandler() { @Override publi…)
[E6] button02[외출].Select (L601) → 인라인 L601-608 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildGrid01() | L163-180 | 필드 초기화 | 상태 처리 | 업무 |
| private buildGrid01_1() | L182-198 | 필드 초기화 | 상태 처리 | 업무 |
| private buildGrid02() | L200-219 | 필드 초기화 | 조회창 Mkt03_Lookup_History 열기 | 업무 |
| private buildGrid03() | L221-278 | 필드 초기화 | 팝업 Bbs02_Popup_Notice 열기, 조회창 Sch14_Lookup_IpoMismatch 열기, 팝업 Bbs20_Edit_FloralRequest 열기, 서비스 bbs.Bbs02_Notice.selectById(noticeId) | 업무 |
| private buildGrid04() | L280-299 | 필드 초기화 | 상태 처리 | 업무 |
| private buildGrid05() | L301-320 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve01() | L322-337 | view01,retrieve | 서비스 sch.Sch01_Info.selectMyPageSchedule(companyId, personId, orgId, stdDate) | 업무 |
| private retrieve01_1() | L339-357 | retrieve | 서비스 sch.Sch01_Info.selectMyPageOrgSchedule(companyId, orgId, subOrgYn, startDate, endDate, dailyYn, searchText) | 업무 |
| private retrieve02() | L359-374 | retrieve | 서비스 mkt.Mkt03_History.selectByRegDate(companyId, stdDate, personId, orgId) | 업무 |
| private retrieve03() | L376-391 | retrieve | 서비스 bbs.Bbs02_Notice.selectPersonNotice(companyId, stdDate, personId, orgId) | 업무 |
| private retrieve04() | L393-409 | retrieve | 서비스 emp.Emp20_Leave.selectByDate(companyId, stdDate, shareCheck, personId, orgId) | 업무 |
| private retrieve05() | L411-424 | view05,retrieve | 서비스 mrb.Mrb01_Booking.selectByBookingDate(companyId, stdDate) | 업무 |
| private view01() | L426-453 | buildGrid01 | 조회창 Sch04_Lookup_SchList 열기, 서비스 sch.Sch04_List.selectByToDoList | 업무 |
| private view01_1() | L455-458 | buildGrid01_1 | 조회창 Sch01_Lookup_InfoView 열기 | 업무 |
| private view05() | L460-490 | buildGrid05 | 팝업 Mrb01_Popup_MeetingRoomReg 열기, 팝업 Car03_Popup_BookingReg 열기 | 업무 |
| public retrieve() | L492-496 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L498-508 | 생성자 | 상태 처리 | 업무 |
| public openTab() | L510-522 | 공개 메서드 | 상태 처리 | 업무 |
| private openTab01() | L524-527 | openTab | 상태 처리 | 업무 |
| private openTab01_1() | L529-532 | openTab | 상태 처리 | 업무 |
| private openTab02() | L534-537 | openTab | 상태 처리 | 업무 |
| private openTab04() | L539-578 | openTab | 확인창 표시 | 업무 |
| private openTab05() | L580-609 | openTab | 확인창 표시 | 업무 |
| public clearPanel() | L611-664 | retrieve01,retrieve01_1,retrieve02,retrieve03,retrieve04,retrieve05 | 상태 처리 | 업무 |
| private specialCharacters() | L666-670 | clearPanel | 상태 처리 | 업무 |
| private settings() | L125-161 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlContentStyle() | L672-674 | openTab04,openTab05 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L676-678 | openTab04,openTab05 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  gb.text('classNm', 120, '분류'),  // L171
  gb.text('title', 300, '나의일정명'),  // L172
  gb.textCenter('managerNm', 90, '등록자'),  // L173
  gb.date('closeDate', 85, '마감일'),  // L174
  gb.date('manageDate', 85, '처리일'),  // L175
  // ⚠ 대응 없음 (GridBuilder L176) addCell
];

const buildGrid01_1 = () => [
  gb.text('orgNm', 180, '등록부서'),  // L190
  gb.text('classNm', 100, '분류'),  // L191
  gb.text('title', 300, '일정명'),  // L192
  gb.date('closeDate', 85, '마감일'),  // L193
  // ⚠ 대응 없음 (GridBuilder L194) addCell
];

const buildGrid02 = () => [
  gb.date('activityDate', 85, '활동일'),  // L210
  gb.text('targetCompanyNm', 150, '활동처'),  // L211
  gb.text('activityTitle', 230, '활동내용'),  // L212
  gb.text('personOrgNm', 120, '작성자'),  // L213
  gb.date('regDate', 85, '작성일'),  // L214
  // ⚠ 대응 없음 (GridBuilder L215) addCell
];

const buildGrid03 = () => [
  gb.textCenter('noticeTypeNm', 80, '구분'),  // L271
  gb.text('title', 590, '내용'),  // L272
  // ⚠ 대응 없음 (GridBuilder L274) addCell
];

const buildGrid04 = () => [
  gb.text('personNm', 120, '사원명'),  // L292
  gb.text('leaveNm', 380, '내용'),  // L293
  gb.text('stdPeriod', 170, '기간'),  // L294
  // ⚠ 대응 없음 (GridBuilder L295) addCell
];

const buildGrid05 = () => [
  gb.textCenter('typeNm', 80, '구분'),  // L311 SQL 계산 컬럼(selectByBookingDate: '회의실')
  gb.text('empNm', 120, '예약자'),  // L312 SQL 계산 컬럼(selectById: f_emp_kor_nm(mrb01_emp_id))
  gb.text('content', 250, '내용'),  // L313 SQL 계산 컬럼(selectByBookingDate: f_cdnm('MeetingRoomCode', mrb01_room_cd…)
  gb.text('attendance', 120, '참석자'),  // L314
  gb.textCenter('time', 100, '예약시간'),  // L315 SQL 계산 컬럼(selectById: mrb01_start_hour||':'||mrb01_start_min|…)
  // ⚠ 대응 없음 (GridBuilder L316) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={() => /* 인라인 L593-600 (new SelectHandler() { @Override publi…) */}>회의실</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L601-608 (new SelectHandler() { @Override publi…) */}>공용차량</Button>
3. <Button type="unknown" onClick={() => /* 인라인 L570-577 (new SelectHandler() { @Override publi…) */}>출장</Button>

### Monitoring_Page_Outstanding (`client/vi/frm/Monitoring_Page_Outstanding.java`, 147줄)

- 툴바 `buttonBar`: {goPageButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - statusName 80 "진행상태" TextFix
  - regDate 100 "등록일" DateFix
  - title 240 "제목" Text
  - regEmpName 100 "상신자" TextFix
  - actionCell 80 "상세보기" CellFix 편집:apprButton

#### 이벤트
[E0] 화면 열림 (생성자 L43-58) → settings(), retrieve()
[E1] grid.CellDoubleClick (L62) → retrieve()
[E2] goPageButton[바로가기].Select (L79) → 인라인 L79-85 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L118-133 | 생성자,E1,buildGrid | 서비스 apr.Apr01_Appr.selectOutstanding(companyId, empId, toDay) | 업무 |
| public update() | L135-136 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L138-139 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L141-142 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L60-86 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L88-115 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlMonitoringStyle() | L144-146 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L107) addTextFix
  // ⚠ 대응 없음 (GridBuilder L108) addDateFix
  gb.text('title', 240, '제목'),  // L109
  // ⚠ 대응 없음 (GridBuilder L110) addTextFix
  // ⚠ 대응 없음 (GridBuilder L111) addCellFix
];
```

#### 사용된 버튼들
1. <Button type="shortcut" onClick={() => /* 인라인 L79-85 (new SelectHandler() { @Override publi…) */}>바로가기</Button>

### Monitoring_Page_IcsNotice (`client/vi/frm/Monitoring_Page_IcsNotice.java`, 150줄)

- 입력·하위 화면: `lookIcs` Sch04_Lookup_IcsList, `lookIcr` Sch04_Lookup_IcrList
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - bizNoticeName 100 "구분" TextFix
  - date 100 "마감일" DateFix
  - todoTitle 240 "제목" TextHtml
  - actionCell 60 "상세보기" CellFix 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L39-54) → settings(), retrieve()
[E1] grid.CellDoubleClick (L58) → callLookup()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L84-88 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L90-110 | 생성자 | 서비스 frm.Frm01_List.selectIcsNotice(companyId, empId, orgCd, orgCodeLevel, selectDate) | 업무 |
| private callLookup() | L112-127 | E1,buildGrid | 상태 처리 | 업무 |
| private lookupIcs() | L129-136 | callLookup | 조회창 Sch04_Lookup_IcsList 열기 | 업무 |
| private lookupIcr() | L138-145 | callLookup | 조회창 Sch04_Lookup_IcrList 열기 | 업무 |
| private settings() | L56-64 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L66-82 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlMonitoringStyle() | L147-149 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L76) addTextFix
  // ⚠ 대응 없음 (GridBuilder L77) addDateFix
  // ⚠ 대응 없음 (GridBuilder L78) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L79) addCellFix
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Monitoring_Page_Emp (`client/vi/frm/Monitoring_Page_Emp.java`, 204줄)

- 툴바 `bar01`: {anchor01} {anchor02} {anchor03}
- 툴바 `bar02`: {anchor04}
- 입력·하위 화면: `searchText` CustomTextField 빈칸="사원/부서명 검색", `popup` Emp00_Popup_Emp
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - personIdString 65 "" Cell 편집:EmpImageCell
  - monitoringName 100 "" HtmlText
  - locationCode 40 "" Location

#### 이벤트
[E0] 화면 열림 (생성자 L50-152) → retrieve()
[E1] anchor04.MouseDown (L66) → retrieve()
[E2] searchText.KeyPress [Enter] (L102) → retrieve()
[E3] grid.CellClick (L137) → 인라인 L137-151 (new CellClickHandler() { @Override pu…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L184-203 | 생성자,E1,E2 | 서비스 emp.Emp03_Trans.MonitoringByText(companyId, transDate, searchText) | 업무 |
| private buildGrid() | L172-182 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public render() | L157-161 | 공개 메서드 | 상태 처리 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L177) addCell
  // ⚠ 대응 없음 (GridBuilder L178) addHtmlText
  // ⚠ 대응 없음 (GridBuilder L179) addLocation
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Monitoring_Page_DayList (`client/vi/frm/Monitoring_Page_DayList.java`, 355줄)

- 툴바 `buttonBar01`: {labelItem} {anchor01} {baseDate} {anchor02}
- 툴바 `buttonBar02`: {refreshButton} {baroButton}
- 입력·하위 화면: `baseDate` MyDateField, `lookup` Fnd20_Lookup_ToDoList, `editor` Apr01_Edit_ApprDoc, `lookIcs` Sch04_Lookup_IcsList, `lookIcr` Sch04_Lookup_IcrList
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - bizNoticeName 100 "업무구분" TextFix
  - date 85 "등록(마감)일" DateFix
  - todoTitle 240 "제목" TextHtml
  - closeDate 85 "처리(완료)일" DateFix
  - personName 60 "담당자" TextFix
  - actionCell 60 "상세보기" CellFix 편집:goPageButton

#### 이벤트
[E0] 화면 열림 (생성자 L75-127) → settings(), setIconStyle(), retrieve()
[E1] anchor01.MouseDown (L81) → retrieve()
[E2] anchor02.MouseDown (L93) → retrieve()
[E3] baseDate.ValueChange (L132) → retrieve()
[E4] grid.CellDoubleClick (L139) → open()
[E5] refreshButton.Click (L146) → retrieve()
[E6] baroButton.Click (L152) → 메시지 "업무구분을 선택해주세요"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private open() | L198-315 | E4,buildGrid | 조회창 Fnd20_Lookup_ToDoList 열기 → 콜백: unmask, 조회창 Ast04_Lookup_Cf 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 조회창 Sch04_Lookup_IcsList 열기 → 콜백: unmask, 조회창 Sch04_Lookup_IcrList 열기 → 콜백: unmask, 조회창 Sch10_Lookup_Ipo 열기 → 콜백: unmask, 서비스 ast.Ast04_Cf.selectByRelateId, sch.Sch10_Ipo.selectById(ipoId) | 업무 |
| public retrieve() | L317-320 | 생성자,E1,E2,E3,E5 | 상태 처리 | 업무 |
| public retrieve() | L322-337 | 생성자,E1,E2,E3,E5 | 서비스 frm.Frm01_List.selectToDoList(companyId, empId, orgCd, orgCodeLevel, selectDate) | 업무 |
| public setIconStyle() | L343-345 | 생성자 | 상태 처리 | 업무 |
| private settings() | L129-174 | 생성자 | 미선택 시 alert "업무구분을 선택해주세요", 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L176-196 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCalendarButtonStyle() | L339-341 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L347-350 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlMonitoringStyle() | L352-354 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L187) addTextFix
  // ⚠ 대응 없음 (GridBuilder L188) addDateFix
  // ⚠ 대응 없음 (GridBuilder L189) addTextHtml
  // ⚠ 대응 없음 (GridBuilder L190) addDateFix
  // ⚠ 대응 없음 (GridBuilder L191) addTextFix
  // ⚠ 대응 없음 (GridBuilder L192) addCellFix
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Monitoring_Page_CrmProject (`client/vi/frm/Monitoring_Page_CrmProject.java`, 134줄)

- 툴바 `bar`: {goPageButton}
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - regDate 100 "등록일" Date
  - title 380 "제목" Text
  - korName 80 "작성자" Text

#### 이벤트
[E0] 화면 열림 (생성자 L40-61) → retrieve()
[E1] goPageButton[바로가기].Select (L41) → 인라인 L41-47 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L95-98 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L101-117 | 생성자 | 상태 처리 | 업무 |
| public update() | L120-121 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L124-125 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L128-129 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L63-93 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlMonitoringStyle() | L131-133 | 필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '등록일'),  // L66
  gb.text('title', 380, '제목'),  // L67
  gb.text('korNm', 80, '작성자'),  // L68
];
```

#### 사용된 버튼들
1. <Button type="shortcut" onClick={() => /* 인라인 L41-47 (new SelectHandler() { @Override publi…) */}>바로가기</Button>

### Monitoring_Page_Appr (`client/vi/frm/Monitoring_Page_Appr.java`, 247줄)

- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid01` (buildGrid01(), 행번호숨김):
  - statusName 80 "진행상태" TextFix
  - regDate 100 "등록일" DateFix
  - title 240 "제목" Text
  - regEmpName 100 "상신자" TextFix
  - actionCell 80 "상세보기" CellFix 편집:apprButton
- 그리드 `grid02` (buildGrid02(), 행번호숨김):
  - statusName 80 "결재상태" TextFix
  - regDate 100 "등록일" DateFix
  - title 280 "제목" Text
  - NextApprName 120 "다음결재자" TextFixCenter
- 그리드 `grid03` (buildGrid03(), 행번호숨김):
  - regDate 100 "등록일" DateFix
  - title 420 "제목" Text
  - actionCell 80 "상세보기" CellFix 편집:apprButton

#### 이벤트
[E0] 화면 열림 (생성자 L45-56) → settings(), retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildGrid01() | L64-90 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private buildGrid02() | L92-100 | 필드 초기화 | 상태 처리 | 업무 |
| private buildGrid03() | L102-138 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당문서의 열람권한이 없습니다" | 업무 |
| private retrieve01() | L141-161 | buildGrid01,retrieve | 서비스 apr.Apr01_Appr.selectOutstanding(companyId, empId, toDay) | 업무 |
| private retrieve02() | L163-183 | retrieve | 서비스 apr.Apr01_Appr.selectMonitorngAppr(companyId, empId, toDay) | 업무 |
| private retrieve03() | L185-204 | buildGrid03,retrieve | 서비스 apr.Apr01_Appr.selectTemporary(companyId, empId) | 업무 |
| public retrieve() | L206-210 | 생성자 | 상태 처리 | 업무 |
| public clearPanel() | L212-240 | retrieve01,retrieve02,retrieve03 | 상태 처리 | 업무 |
| private specialCharacters() | L242-246 | clearPanel | 상태 처리 | 업무 |
| private settings() | L58-62 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildGrid01 = () => [
  // ⚠ 대응 없음 (GridBuilder L84) addTextFix
  // ⚠ 대응 없음 (GridBuilder L85) addDateFix
  gb.text('title', 240, '제목'),  // L86
  // ⚠ 대응 없음 (GridBuilder L87) addTextFix
  // ⚠ 대응 없음 (GridBuilder L88) addCellFix
];

const buildGrid02 = () => [
  // ⚠ 대응 없음 (GridBuilder L95) addTextFix
  // ⚠ 대응 없음 (GridBuilder L96) addDateFix
  gb.text('title', 280, '제목'),  // L97
  // ⚠ 대응 없음 (GridBuilder L98) addTextFixCenter
];

const buildGrid03 = () => [
  // ⚠ 대응 없음 (GridBuilder L134) addDateFix
  gb.text('title', 420, '제목'),  // L135
  // ⚠ 대응 없음 (GridBuilder L136) addCellFix
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### LoginUser (`client/vi/LoginUser.java`, 331줄)


#### 이벤트

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public getMobile() | L38-40 | 공개 메서드 | 상태 처리 | 업무 |
| public setMobile() | L42-44 | 공개 메서드 | 상태 처리 | 업무 |
| public setToDoDate() | L46-48 | 공개 메서드 | 상태 처리 | 업무 |
| public getToDoDate() | L50-52 | 공개 메서드 | 상태 처리 | 업무 |
| public setSubDomain() | L54-56 | 공개 메서드 | 상태 처리 | 업무 |
| public getSubDomain() | L58-60 | 공개 메서드 | 상태 처리 | 업무 |
| public setMacAddress() | L62-64 | 공개 메서드 | 상태 처리 | 업무 |
| public getMacAddress() | L66-68 | 공개 메서드 | 상태 처리 | 업무 |
| public setIpAddress() | L70-72 | 공개 메서드 | 상태 처리 | 업무 |
| public getIpAddress() | L74-76 | 공개 메서드 | 상태 처리 | 업무 |
| public setMode() | L78-80 | 공개 메서드 | 상태 처리 | 업무 |
| public getMode() | L82-84 | 공개 메서드 | 상태 처리 | 업무 |
| public setSelectDate() | L86-88 | 공개 메서드 | 상태 처리 | 업무 |
| public getSelectDate() | L90-92 | 공개 메서드 | 상태 처리 | 업무 |
| public setConfirmTransId() | L94-96 | 공개 메서드 | 상태 처리 | 업무 |
| public getConfirmTransId() | L98-100 | 공개 메서드 | 상태 처리 | 업무 |
| public setIsManager() | L102-104 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsManager() | L106-108 | 공개 메서드 | 상태 처리 | 업무 |
| public setIsUserManager() | L110-112 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsUserManager() | L114-116 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuFixYn() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuFixYn() | L122-124 | 공개 메서드 | 상태 처리 | 업무 |
| public getIsIcam() | L126-132 | 공개 메서드 | 상태 처리 | 업무 |
| public setManagerModel() | L134-137 | 공개 메서드 | 상태 처리 | 업무 |
| public getManagerModel() | L139-141 | 공개 메서드 | 상태 처리 | 업무 |
| public setUserModel() | L143-147 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserModel() | L149-151 | 공개 메서드 | 상태 처리 | 업무 |
| public getCompanyId() | L153-161 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserId() | L163-170 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserIdStr() | L172-179 | 공개 메서드 | 상태 처리 | 업무 |
| public getThemeCode() | L181-183 | 공개 메서드 | 상태 처리 | 업무 |
| public getThemeName() | L185-187 | 공개 메서드 | 상태 처리 | 업무 |
| public getIconColor() | L189-191 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserName() | L193-200 | 공개 메서드 | 상태 처리 | 업무 |
| public getEmpNo() | L202-209 | 공개 메서드 | 상태 처리 | 업무 |
| public getUserInfoString() | L211-224 | 공개 메서드 | 상태 처리 | 업무 |
| public getOrgCodeId() | L226-233 | 공개 메서드 | 상태 처리 | 업무 |
| public getParentCodeId() | L235-237 | 공개 메서드 | 상태 처리 | 업무 |
| public getParentCodeName() | L239-241 | 공개 메서드 | 상태 처리 | 업무 |
| public getMailInfo() | L243-245 | 공개 메서드 | 상태 처리 | 업무 |
| public getSmsId() | L247-249 | 공개 메서드 | 상태 처리 | 업무 |
| public getSmsAPIKey() | L251-253 | 공개 메서드 | 상태 처리 | 업무 |
| public getYear() | L255-257 | getNewYearDay | 상태 처리 | 업무 |
| public getYearMonth() | L259-261 | getMonthFirstDay | 상태 처리 | 업무 |
| public getTodayString() | L263-265 | 공개 메서드 | 상태 처리 | 업무 |
| public getTodayInt() | L267-269 | 공개 메서드 | 상태 처리 | 업무 |
| public getToday() | L271-274 | 공개 메서드 | 상태 처리 | 업무 |
| public getNewYearDay() | L276-278 | 공개 메서드 | 상태 처리 | 업무 |
| public getMonthFirstDay() | L280-282 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuInfoNoticeList() | L284-286 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuInfoNoticeList() | L288-290 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuInfoYn() | L292-294 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuInfoYn() | L296-298 | 공개 메서드 | 상태 처리 | 업무 |
| public getCompanyModel() | L300-302 | 공개 메서드 | 상태 처리 | 업무 |
| public setCompanyModel() | L304-306 | 공개 메서드 | 상태 처리 | 업무 |
| public getLogoutYn() | L308-310 | 공개 메서드 | 상태 처리 | 업무 |
| public setLogoutYn() | L312-314 | 공개 메서드 | 상태 처리 | 업무 |
| public getMenuList() | L316-318 | 공개 메서드 | 상태 처리 | 업무 |
| public setMenuList() | L320-322 | 공개 메서드 | 상태 처리 | 업무 |
| public getLoginId() | L324-326 | 공개 메서드 | 상태 처리 | 업무 |
| public setLoginId() | L328-330 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Calendar (`client/vi/frm/Calendar.java`, 241줄)

- 입력·하위 화면: `popup` Bbs02_Popup_NoticeAdmin

#### 이벤트
[E0] 화면 열림 (생성자 L56-58) → init()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L81-103 | 생성자 | 상태 처리 | 업무 |
| private toDoListRetrieve() | L117-123 | init | 상태 처리 | 업무 |
| private allRetrieve() | L125-134 | init | 상태 처리 | 업무 |
| public retrieve() | L136-181 | init,allRetrieve,retrieveClear | 팝업 Bbs02_Popup_NoticeAdmin 열기, 조회창 Bbs02_Lookup_NoticeAdmin 열기, 서비스 bbs.Bbs02_Notice.selectByTargetCompany(companyId, personId) | 업무 |
| public retrieveClear() | L183-231 | 공개 메서드 | 팝업 Bbs02_Popup_NoticeAdmin 열기, 조회창 Bbs02_Lookup_NoticeAdmin 열기, 서비스 bbs.Bbs02_Notice.selectByTargetCompany(companyId, personId) | 업무 |
| private makeLayout() | L105-115 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlCalendarStyle() | L238-240 | toDoListRetrieve | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

