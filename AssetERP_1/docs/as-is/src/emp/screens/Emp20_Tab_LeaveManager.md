# Emp20_Tab_LeaveManager

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 휴가관리(경영관리팀) (#1033)
- 파일: `client/vi/emp/Emp20_Tab_LeaveManager.java`
- 함께 쓰는 클래스 2개:
  - `Emp26_Lookup_InitLeave` `client/vi/emp/Emp26_Lookup_InitLeave.java`
  - `Emp22_Lookup_EtcLeave` `client/vi/emp/Emp22_Lookup_EtcLeave.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys31_Lookup_LeaveCompany`](../../sys/components/Sys31_Lookup_LeaveCompany.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp20_Leave.cancelUpdate` | Emp20_Tab_LeaveManager:383 | [`Emp20_Leave.java:124`](../../emp/services/Emp20_Leave.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.selectByApprId`](../../apr/sql/apr04_appr_step.md), [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`emp20_leave.cancelUpdate`](../../emp/sql/emp20_leave.md), [`emp92_sms_notice.sendCheckMail`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckSms`](../../emp/sql/emp92_sms_notice.md), [`emp92_sms_notice.sendCheckTalk`](../../emp/sql/emp92_sms_notice.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `emp.Emp20_Leave.selectByDays` | Emp20_Tab_LeaveManager:430 | [`Emp20_Leave.java:77`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectByDays`](../../emp/sql/emp20_leave.md) |
| `emp.Emp20_Leave.selectByPersonId` | Emp20_Tab_LeaveManager:417 | [`Emp20_Leave.java:42`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectByPersonId`](../../emp/sql/emp20_leave.md) |
| `emp.Emp20_Leave.updateOverConfirm` | Emp20_Tab_LeaveManager:591 | [`Emp20_Leave.java:241`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectById`](../../emp/sql/emp20_leave.md), [`emp20_leave.updateOverConfirm`](../../emp/sql/emp20_leave.md) |
| `emp.Emp22_EtcLeave.selectByDays` | Emp20_Tab_LeaveManager:449 | [`Emp22_EtcLeave.java:70`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.selectByDays`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp22_EtcLeave.selectByPersonId` | Emp22_Lookup_EtcLeave:165 | [`Emp22_EtcLeave.java:45`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.selectByPersonId`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp26_InitLeave.delete` | Emp26_Lookup_InitLeave:262 | [`Emp26_InitLeave.java:47`](../../emp/services/Emp26_InitLeave.md) | `UpdateDataModel(emp26_init_leave)` 동적 DELETE |
| `emp.Emp26_InitLeave.selectByYear` | Emp26_Lookup_InitLeave:187 | [`Emp26_InitLeave.java:30`](../../emp/services/Emp26_InitLeave.md) | [`emp26_init_leave.selectByYear`](../../emp/sql/emp26_init_leave.md) |
| `emp.Emp26_InitLeave.update` | Emp26_Lookup_InitLeave:211 | [`Emp26_InitLeave.java:42`](../../emp/services/Emp26_InitLeave.md) | `UpdateDataModel(emp26_init_leave)` 동적 INSERT/UPDATE → [`emp26_init_leave.selectById`](../../emp/sql/emp26_init_leave.md) |
| `sys.Sys99_Print.insertRdLeaveManager` | Emp20_Tab_LeaveManager:477 | [`Sys99_Print.java:4244`](../../sys/services/Sys99_Print.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp20_leave.selectByPersonId`](../../emp/sql/emp20_leave.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr92_appr_modi`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md), [`emp24_joint_leave`](../../../db/tables/emp.md), [`emp26_init_leave`](../../../db/tables/emp.md), [`emp27_leave_old`](../../../db/tables/emp.md), [`emp28_joint_leave_except`](../../../db/tables/emp.md), [`emp92_sms_notice`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_biz_days`, `f_get_close_date`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_leave_count`, `f_get_leave_days`, `f_get_leave_days2`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp20_Tab_LeaveManager (`client/vi/emp/Emp20_Tab_LeaveManager.java`, 639줄)

- 레이아웃: center=vlc
- 툴바 `centerButtonBar01`: 유급휴가 총 일수: {total1} +: {pyRemainMonthDays01} (전년도 미사용 월차): /: 유급휴가 사용 일수: {use1} /: 유급휴가 잔여 일수: {remain1} /: 휴가사용기간: {stdPeriod1}
- 툴바 `centerButtonBar02`: 포상휴가 총 일수: {total02} /: 포상휴가 사용 일수: {use02} /: 포상휴가 잔여 일수: {remain02} ※ 사용만료기간의 차이로 잔여 일수가 일치하지 않을 수 있습니다. 자세한 내용은 우측 아이콘을 통해 확인해주세요.: {hlc}
- 툴바 `buttonBarL`: 기준연도: {leaveYText} 사원명: {personName} {retrieveButton} {downloadButton} {cancelButton} {rdFileDownloadForm} {overLeaveLabel} {overApprButton} {overRejectButton} {overCancelButton}
- 툴바 `buttonBarR`: {leaveMngButton} {mappingButton} {initButton}
- 입력·하위 화면: `total1` TextField, `use1` TextField, `remain1` TextField, `stdPeriod1` TextField, `pyRemainMonthDays01` TextField, `total02` TextField, `use02` TextField, `remain02` TextField, `leaveYText` TextField 빈칸="YYYY", `personId` LongField, `personName` LookupTriggerField, `lookup` Emp22_Lookup_EtcLeave, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date
  - leaveName 100 "휴가구분" Text
  - leaveCount 60 "기간" Double
  - managerName 120 "대직자" Text
  - reason 550 "사유" Text
  - apprStatusName 100 "문서상태" Text
  - overConfirmStatusName 70 "승인상태" TextCenter
  - overConfirmerName 100 "승인자" TextCenter
  - overConfirmDateStr 150 "승인일시" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L100-194) → buttonBarSetting()
[E1] helpAnchor.MouseDown (L105) → 메시지 "사원을 선택해주세요"
[E2] leaveYText.KeyPress [Enter] (L235) → retrieve()
[E3] personName.TriggerClick (L243) → retrieve()
[E4] retrieveButton[조회].Select (L263) → personNameCheck()
[E5] downloadButton[엑셀다운로드].Select (L269) → createRdExcel()
[E6] cancelButton[휴가취소].Select (L275) → cancel()
[E7] overApprButton[승인].Select (L281) → updateOverStatus()
       └ [E14] messageBox.DialogHide (L587) → 서비스 emp.Emp20_Leave.updateOverConfirm(leaveId, confirmStatusCode, confirmerId)
[E8] overRejectButton[반려].Select (L287) → updateOverStatus()
[E9] overCancelButton[취소].Select (L293) → updateOverStatus()
[E10] initButton[초기설정 휴가일수].Select (L299) → 인라인 L299-305 (new SelectHandler() { @Override publi…)
[E11] leaveMngButton[기본설정].Select (L306) → 인라인 L306-312 (new SelectHandler() { @Override publi…)
[E12] mappingButton[문서분류지정].Select (L313) → 인라인 L313-324 (new SelectHandler() { @Override publi…)
[E13] msgBox.DialogHide [YES] (L375) → 서비스 emp.Emp20_Leave.cancelUpdate(companyId, leaveId, apprId, targetEmpId, empId), 메시지 "취소처리가 완료되었습니다."

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buttonBarSetting() | L196-325 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 조회창 Emp26_Lookup_InitLeave 열기, 조회창 Sys31_Lookup_LeaveCompany 열기, 조회창 Dcr30_Lookup_Link 열기 | 업무 |
| private personNameCheck() | L348-354 | E4 | 상태 처리 | 업무 |
| private cancel() | L356-370 | E6 | 미선택 시 alert "문서를 선택해주세요" | 업무 |
| private cancelMessage() | L372-408 | cancel | 확인창 표시, 서비스 emp.Emp20_Leave.cancelUpdate(companyId, leaveId, apprId, targetEmpId, empId) | 업무 |
| public retrieve() | L410-427 | E2,E3,personNameCheck | 서비스 emp.Emp20_Leave.selectByPersonId(personId, stdYear, managerYn) | 업무 |
| private checkRemainDay() | L429-473 | retrieve | 서비스 emp.Emp20_Leave.selectByDays, emp.Emp22_EtcLeave.selectByDays(personId, stdYear, apprCheckYn, personId, stdYear, apprCheckYn) | 업무 |
| private createRdExcel() | L475-529 | E5 | 서비스 sys.Sys99_Print.insertRdLeaveManager(companyId, personId, windowClassName, selectPersonId, stdYear, managerYn) | 업무 |
| private updateOverStatus() | L531-608 | E7,E8,E9 | 미선택 시 alert "초과휴가 내역을 선택하세요" → 확인창 E14 | 업무 |
| private setOverConfirmVer() | L610-626 | buttonBarSetting | 상태 처리 | 업무 |
| public buildGrid() | L327-346 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L628-630 | 생성자,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarNoticeStyleNoSpace() | L632-634 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L636-638 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L330 newHeaderGroupMap09newHeaderGroupConfig13 100 "초과휴가" (emp22_new_header_group_map09new_header_group_config13 컬럼 없음)
  gb.date('startDate', 100, '시작일'),  // L333
  gb.date('closeDate', 100, '종료일'),  // L334
  gb.text('leaveNm', 100, '휴가구분'),  // L335
  gb.double('leaveCount', 60, '기간'),  // L336
  gb.text('managerNm', 120, '대직자'),  // L337
  gb.text('reason', 550, '사유'),  // L338
  gb.text('apprStatusNm', 100, '문서상태'),  // L339
  gb.textCenter('overConfirmStatusNm', 70, '승인상태'),  // L341
  gb.textCenter('overConfirmerNm', 100, '승인자'),  // L342
  gb.textCenter('overConfirmDateStr', 150, '승인일시'),  // L343
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={personNameCheck}>조회</Button>
2. <Button type="unknown" onClick={cancel}>휴가취소</Button>
3. <Button type="save" onClick={updateOverStatus}>승인</Button>
4. <Button type="cancel" onClick={updateOverStatus}>반려</Button>
5. <Button type="cancel" onClick={updateOverStatus}>취소</Button>
6. <Button type="settings" onClick={() => /* 인라인 L306-312 (new SelectHandler() { @Override publi…) */}>기본설정</Button>
7. <Button type="save" onClick={() => /* 인라인 L313-324 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>
8. <Button type="org" onClick={() => /* 인라인 L299-305 (new SelectHandler() { @Override publi…) */}>초기설정 휴가일수</Button>
9. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

### Emp26_Lookup_InitLeave (`client/vi/emp/Emp26_Lookup_InitLeave.java`, 272줄)

- 툴바 `buttonBar`: 기준연도: {leaveYText} 사원명: {personName} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `leaveYText` TextField 빈칸="YYYY", `personId` LongField, `personName` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - year 80 "사용년도" TextCenter 편집:TextField
  - personNo 100 "사번" TextCenter
  - personName 100 "사원명" TextCenter
  - posName 150 "직책" TextCenter
  - useDays 100 "사용일수" Double 편집:DoubleField

#### 이벤트
[E0] 화면 열림 (생성자 L71-102) → settings(), show()
[E1] leaveYText.KeyPress [Enter] (L107) → retrieve()
[E2] personName.TriggerClick [result == null] (L117) → 인라인 L117-136 (new TriggerClickHandler(){ @Override …)
[E3] retrieveButton[조회].Select (L137) → retrieve()
[E4] insertButton[등록].Select (L143) → insertRow()
[E5] updateButton[저장].Select (L149) → update()
[E6] deleteButton[삭제].Select (L155) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L242) → deleteRow()
[E7] cancelButton[닫기].Select (L161) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L66-69 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L181-194 | E1,E3,open | 서비스 emp.Emp26_InitLeave.selectByYear(companyId, year, personId) | 업무 |
| public update() | L196-212 | E5 | 서비스 emp.Emp26_InitLeave.update(personId) | 업무 |
| public insertRow() | L214-237 | E4 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private deleteChk() | L239-257 | E6 | ConfirmBox → E8 | 업무 |
| public deleteRow() | L259-263 | E8 | GridDeleteData emp.Emp26_InitLeave.delete(체크된 행 목록) | 업무 |
| private settings() | L104-167 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: personName=null, personId=null, personName=empTransInfoModel.getEmpPersonModel(, personId=empTransInfoModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L169-179 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L265-267 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L269-271 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('year', 80, '사용년도', { editor: 'text' }),  // L172
  gb.textCenter('personNo', 100, '사번'),  // L173 SQL 계산 컬럼(selectByYear: emp01_emp_no)
  gb.textCenter('personNm', 100, '사원명'),  // L174 SQL 계산 컬럼(selectByYear: f_emp_kor_nm(emp26_person_id))
  gb.textCenter('posNm', 150, '직책'),  // L175 SQL 계산 컬럼(selectByYear: f_cdnm('EmpPosCode', emp03_pos_cd, emp2…)
  gb.double('useDays', 100, '사용일수', { editor: 'number' }),  // L176
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp22_Lookup_EtcLeave (`client/vi/emp/Emp22_Lookup_EtcLeave.java`, 201줄)

- 툴바 `buttonBar`: 기준연도: {leaveYText} {retrieveButton}
- 입력·하위 화면: `leaveYText` TextField 빈칸="YYYY"
- 그리드 `grid` (buildGrid(), 체크박스):
  - reason 250 "사유" Text
  - startDate 100 "사용시작일" Date
  - closeDate 100 "사용만료일" Date
  - days 60 "총일수" Long
  - useDays 60 "사용일수" Double
  - remainDays 60 "잔여일수" Double
  - note 250 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L50-56) → 초기화
[E1] leaveYText.KeyPress [Enter] (L110) → retrieve()
[E2] retrieveButton[조회].Select (L118) → retrieve()
[E3] selectButton[선택].Select (L124) → select()
[E4] closeButton[닫기].Select (L130) → hide()
[E5] grid.RowDoubleClick (L137) → select()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L58-62 | view | 상태 처리 | 업무 |
| public view() | L64-67 | 공개 메서드 | 상태 처리 | 업무 |
| private open() | L69-103 | view | 상태 처리 | 업무 |
| private retrieve() | L160-173 | E1,E2,open | 서비스 emp.Emp22_EtcLeave.selectByPersonId(companyId, personId, stdYear) | 업무 |
| private select() | L175-192 | E3,E5 | 미선택 시 alert "선택된 내역이 없습니다" | 업무 |
| private settings() | L105-143 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L145-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L194-196 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L198-200 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('reason', 250, '사유'),  // L149
  gb.date('startDate', 100, '사용시작일'),  // L150
  gb.date('closeDate', 100, '사용만료일'),  // L151
  gb.long('days', 60, '총일수'),  // L152
  gb.double('useDays', 60, '사용일수'),  // L153 SQL 계산 컬럼(selectByPersonId: COALESCE(emp20.use_days,0))
  gb.double('remainDays', 60, '잔여일수'),  // L154 SQL 계산 컬럼(selectByPersonId: emp22_days - COALESCE(emp20.use_days,0))
  gb.text('note', 250, '비고'),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={select}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

