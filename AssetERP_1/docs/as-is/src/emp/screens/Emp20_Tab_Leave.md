# Emp20_Tab_Leave

- 종류: 화면
- 메뉴: 신청 > 01. 외출/출장/휴가 > 휴가신청 (#1032)
- 파일: `client/vi/emp/Emp20_Tab_Leave.java`
- 함께 쓰는 클래스 2개:
  - `Emp22_Lookup_EtcLeave` `client/vi/emp/Emp22_Lookup_EtcLeave.java`
  - `Emp20_Edit_Leave` `client/vi/emp/Emp20_Edit_Leave.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr07_Lookup_AltAppr`](../../apr/components/Apr07_Lookup_AltAppr.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp20_Tab_Leave:259 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `apr.Apr07_AltAppr.deleteByLeaveId` | Emp20_Tab_Leave:526 | [`Apr07_AltAppr.java:89`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.deleteByLeaveId`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr07_AltAppr.selectByLeaveId` | Emp20_Tab_Leave:491 | [`Apr07_AltAppr.java:79`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.selectByLeaveId`](../../apr/sql/apr07_alt_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp20_Edit_Leave:260, Emp20_Edit_Leave:651 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp20_Leave.count` | Emp20_Edit_Leave:770 | [`Emp20_Leave.java:83`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.count`](../../emp/sql/emp20_leave.md), [`emp20_leave.countByDate`](../../emp/sql/emp20_leave.md) |
| `emp.Emp20_Leave.delete` | Emp20_Tab_Leave:541 | [`Emp20_Leave.java:284`](../../emp/services/Emp20_Leave.md) | `UpdateDataModel(emp20_leave)` 동적 DELETE |
| `emp.Emp20_Leave.selectByDays` | Emp20_Tab_Leave:341 | [`Emp20_Leave.java:77`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectByDays`](../../emp/sql/emp20_leave.md) |
| `emp.Emp20_Leave.selectById` | Emp20_Edit_Leave:476 | [`Emp20_Leave.java:34`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectById`](../../emp/sql/emp20_leave.md) |
| `emp.Emp20_Leave.selectByPersonId` | Emp20_Tab_Leave:322 | [`Emp20_Leave.java:42`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectByPersonId`](../../emp/sql/emp20_leave.md) |
| `emp.Emp20_Leave.update` | Emp20_Edit_Leave:466 | [`Emp20_Leave.java:261`](../../emp/services/Emp20_Leave.md) | `UpdateDataModel(emp20_leave)` 동적 INSERT/UPDATE → [`emp20_leave.selectById`](../../emp/sql/emp20_leave.md) |
| `emp.Emp20_Leave.updateOverConfirm` | Emp20_Edit_Leave:634 | [`Emp20_Leave.java:241`](../../emp/services/Emp20_Leave.md) | [`emp20_leave.selectById`](../../emp/sql/emp20_leave.md), [`emp20_leave.updateOverConfirm`](../../emp/sql/emp20_leave.md) |
| `emp.Emp22_EtcLeave.selectByDays` | Emp20_Tab_Leave:363 | [`Emp22_EtcLeave.java:70`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.selectByDays`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp22_EtcLeave.selectByEtcLeaveId` | Emp20_Edit_Leave:807 | [`Emp22_EtcLeave.java:39`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.selectByEtcLeaveId`](../../emp/sql/emp22_etc_leave.md) |
| `emp.Emp22_EtcLeave.selectByPersonId` | Emp22_Lookup_EtcLeave:165 | [`Emp22_EtcLeave.java:45`](../../emp/services/Emp22_EtcLeave.md) | [`emp22_etc_leave.selectByPersonId`](../../emp/sql/emp22_etc_leave.md) |
| `sms.Sms02_History.sendMessage` | Emp20_Edit_Leave:607 | [`Sms02_History.java:100`](../../sms/services/Sms02_History.md) | [`dbConfig.getEtcSeq`](../../utils/sql/dbConfig.md), [`sms02_history.insert`](../../sms/sql/sms02_history.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys00_Common.selectLeaveCode` | Emp20_Edit_Leave:116 | [`Sys00_Common.java:141`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectLeaveCode`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectSpcLeaveCode` | Emp20_Edit_Leave:117 | [`Sys00_Common.java:151`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectSpcLeaveCode`](../../sys/sql/sys00_common.md) |
| `sys.Sys01_Company.selectById` | Emp20_Edit_Leave:547 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys31_LeaveCompany.selectByCompanyId` | Emp20_Edit_Leave:280 | [`Sys31_LeaveCompany.java:24`](../../sys/services/Sys31_LeaveCompany.md) | [`sys31_leave_company.selectByCompanyId`](../../sys/sql/sys31_leave_company.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr07_alt_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md), [`emp24_joint_leave`](../../../db/tables/emp.md), [`emp27_leave_old`](../../../db/tables/emp.md), [`emp28_joint_leave_except`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys31_leave_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_biz_days`, `f_get_close_date`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_leave_count`, `f_get_leave_count_by_date`, `f_get_leave_days`, `f_get_leave_days2`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp20_Tab_Leave (`client/vi/emp/Emp20_Tab_Leave.java`, 567줄)

- 레이아웃: center=vlc, south=editForm
- 툴바 `buttonBar`: 기준연도: {leaveYText} {retrieveButton} {insertButton} {copyButton} {deleteButton}
- 툴바 `centerButtonBar01`: 연차휴가 총 일수: {total01} +: {pyRemainMonthDays01} (전년도 미사용 월차): /: 연차휴가 사용 일수: {use01} /: 연차휴가 잔여 일수: {remain01} /: 휴가사용기간: {stdPeriod01}
- 툴바 `centerButtonBar02`: 포상휴가 총 일수: {total02} /: 포상휴가 사용 일수: {use02} /: 포상휴가 잔여 일수: {remain02} ※ 사용만료기간의 차이로 잔여 일수가 일치하지 않을 수 있습니다. 자세한 내용은 우측 아이콘을 통해 확인해주세요.: {hlc}
- 입력·하위 화면: `editForm` Emp20_Edit_Leave, `total01` TextField, `use01` TextField, `remain01` TextField, `stdPeriod01` TextField, `pyRemainMonthDays01` TextField, `total02` TextField, `use02` TextField, `remain02` TextField, `leaveYText` TextField 빈칸="YYYY", `lookup` Emp22_Lookup_EtcLeave, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - startDate 100 "시작일" Date
  - closeDate 100 "종료일" Date
  - leaveName 100 "휴가구분" Text
  - leaveCount 60 "기간" DoubleCenter
  - managerName 360 "대직자" Text
  - note 360 "비고" Text
  - apprStatusName 80 "문서상태" TextCenter
  - apprStatusCode 35 "" DynamicCell 편집:actionCell
  - cancel 70 "취소여부" TextCenter
  - overConfirmStatusName 70 "승인상태" TextCenter
  - overConfirmerName 100 "승인자" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L91-163) → settings(), retrieve()
[E1] helpAnchor.MouseDown (L96) → 인라인 L96-102 (new MouseDownHandler() { @Override pu…)
[E2] grid.RowClick (L157) → retrieveEditPage()
[E3] leaveYText.KeyPress [Enter] (L211) → retrieve()
[E4] retrieveButton[조회].Select (L219) → retrieve()
[E5] insertButton[등록].Select (L225) → insertRow()
[E6] copyButton[등록(복사)].Select (L231) → copyInsertRow()
[E7] deleteButton[삭제].Select (L237) → deleteRow()
       └ [E8] messageBox.DialogHide (L472) → deleteChk()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveEditPage() | L308-311 | E2 | 상태 처리 | 업무 |
| public retrieve() | L314-338 | 생성자,E3,E4 | 서비스 emp.Emp20_Leave.selectByPersonId(personId, stdYear, managerYn) | 업무 |
| public checkRemainDay() | L340-402 | retrieve | 서비스 emp.Emp20_Leave.selectByDays, emp.Emp22_EtcLeave.selectByDays(personId, stdYear, apprCheckYn, personId, stdYear, apprCheckYn) | 업무 |
| public update() | L405-407 | 공개 메서드 | 상태 처리 | 업무 |
| public insertRow() | L410-427 | E5,retrieve | 상태 처리 | 업무 |
| public copyInsertRow() | L429-457 | E6 | 상태 처리 | 업무 |
| public deleteRow() | L460-486 | E7 | 미선택 시 alert "문서를 선택해주세요" → 확인창 E8 | 업무 |
| private deleteChk() | L488-523 | E8 | ConfirmBox → E9 | 업무 |
| private deleteAltAppr() | L525-536 | E9 | 서비스 apr.Apr07_AltAppr.deleteByLeaveId(leaveId) | 업무 |
| private deleteSelectedRow() | L538-554 | E9,deleteChk,deleteAltAppr | GridDeleteData emp.Emp20_Leave.delete(체크된 행 목록) | 업무 |
| private settings() | L165-252 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L254-306 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L556-558 | 생성자,settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarNoticeStyleNoSpace() | L560-562 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L564-566 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L290 newHeaderGroupMap011newHeaderGroupConfig12 100 "초과휴가" (emp22_new_header_group_map011new_header_group_config12 컬럼 없음)
  gb.date('startDate', 100, '시작일'),  // L293
  gb.date('closeDate', 100, '종료일'),  // L294
  gb.text('leaveNm', 100, '휴가구분'),  // L295
  gb.doubleCenter('leaveCount', 60, '기간'),  // L296
  gb.text('managerNm', 360, '대직자'),  // L297
  gb.text('note', 360, '비고'),  // L298
  gb.textCenter('apprStatusNm', 80, '문서상태'),  // L299
  // ⚠ 대응 없음 (GridBuilder L300) addDynamicCell
  gb.textCenter('cancel', 70, '취소여부'),  // L301
  gb.textCenter('overConfirmStatusNm', 70, '승인상태'),  // L302
  gb.textCenter('overConfirmerNm', 100, '승인자'),  // L303
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={copyInsertRow}>등록(복사)</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

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

### Emp20_Edit_Leave (`client/vi/emp/Emp20_Edit_Leave.java`, 935줄)

- 입력·하위 화면: `regDate` MyDateField, `startDate` MyDateField, `closeDate` MyDateField, `managerName` MyTextArea, `reason` MyTextArea, `note` MyTextArea, `leaveCode` TextField, `spcLeaveCode` TextField, `emergencyTelno` TextField, `leaveCount` DoubleField, `leaveId` LongField, `etcLeaveId` LongField, `apprId` LongField, `leaveName` CommonComboBoxField("sys.Sys00_Common.selectLeaveCode"), `spcLeaveName` CommonComboBoxField("sys.Sys00_Common.selectSpcLeaveCode"), `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `lookup` Apr07_Lookup_AltAppr, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `editor` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L121-180) → defaultCheck(), getEditor(), refreshCode01()
[E1] tempButton[임시저장].Select (L134) → updateRow()
[E2] apprButton[상신하기].Select (L140) → updateRow()
[E3] overConfirmButton[초과사용 승인요청].Select (L146) → lookupEmpTransInfo()
[E4] calculateButton[계산].Select (L152) → preCalculate()
[E5] altApprButton[대결자 지정].Select (L158) → 인라인 L158-166 (new SelectHandler() { @Override publi…)
[E6] classTreeFullName[문서분류].TriggerClick (L299) → openLookupDoc()
[E7] leaveName[휴가구분].Collapse (L305) → refreshCode02()
[E8] spcLeaveName[sys.Sys00_Common.selectSpcLeaveCode].Collapse (L311) → checkCode()
[E9] startDate[휴가시작일].Collapse (L317) → 인라인 L317-323 (new CollapseHandler() { @Override pub…)
[E10] closeDate[휴가종료일].Collapse (L324) → 인라인 L324-329 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private refreshCode01() | L182-193 | 생성자 | 상태 처리 | 업무 |
| private refreshCode02() | L195-238 | E7,refreshCode01 | 조회창 Emp22_Lookup_EtcLeave 열기 | 업무 |
| private checkCode() | L241-253 | E8,refreshCode02,retrieve,clear | 상태 처리 | 업무 |
| public setParent() | L255-257 | 공개 메서드 | 상태 처리 | 업무 |
| private defaultCheck() | L259-294 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode, sys.Sys31_LeaveCompany.selectByCompanyId | 업무 |
| private getEditor() | L296-366 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L368-435 | 공개 메서드 | 상태 처리 | 업무 |
| public updateRow() | L438-492 | E1,E2 | 서비스 emp.Emp20_Leave.update, emp.Emp20_Leave.selectById(leaveId) | 업무 |
| public checkA() | L494-513 | updateRow | 상태 처리 | 업무 |
| private checkExcess() | L516-587 | checkA | 서비스 sys.Sys01_Company.selectById | 업무 |
| private lookupEmpTransInfo() | L589-599 | E3 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private sendMessage() | L601-629 | lookupEmpTransInfo | 서비스 sms.Sms02_History.sendMessage(companyId, msg) | 업무 |
| private updateOverConfirm() | L631-646 | sendMessage | 서비스 emp.Emp20_Leave.updateOverConfirm(leaveId, confirmStatusCode, confirmerId) | 업무 |
| private insertLinkApproval() | L649-696 | checkExcess | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private updateApprId() | L699-716 | insertLinkApproval | 서비스 emp.Emp20_Leave.update | 업무 |
| private preCalculate() | L719-735 | E4 | 상태 처리 | 업무 |
| private calculate() | L737-793 | retrieve,preCalculate,clear | 서비스 emp.Emp20_Leave.count(startDate, closeDate, leaveCode, companyId, calcCode) | 업무 |
| private chkReward() | L795-835 | updateRow,preCalculate | 서비스 emp.Emp22_EtcLeave.selectByEtcLeaveId(etcLeaveId, leaveId, personId) | 업무 |
| private openLookupDoc() | L838-847 | E6 | 상태 처리 | 업무 |
| public clear() | L850-855 | 공개 메서드 | 상태 처리 | 업무 |
| public createMapping() | L858-884 | insertLinkApproval | 상태 처리 | 업무 |
| private checkStringNull() | L886-894 | createMapping | 상태 처리 | 업무 |
| private checkDate01Null() | L896-906 | createMapping | 상태 처리 | 업무 |
| private checkDate02Null() | L908-918 | createMapping | 상태 처리 | 업무 |
| private checkDoubleNull() | L920-930 | createMapping | 상태 처리 | 업무 |
| private setHtmlStyle() | L932-934 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={preCalculate}>계산</Button>
2. <Button type="unknown" onClick={() => /* 인라인 L158-166 (new SelectHandler() { @Override publi…) */}>대결자 지정</Button>
3. <Button type="unknown" onClick={updateRow}>임시저장</Button>
4. <Button type="unknown" onClick={updateRow}>상신하기</Button>
5. <Button type="unknown" onClick={lookupEmpTransInfo}>초과사용 승인요청</Button>

