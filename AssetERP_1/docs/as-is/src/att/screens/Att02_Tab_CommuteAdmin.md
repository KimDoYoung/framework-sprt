# Att02_Tab_CommuteAdmin

- 종류: 화면
- 메뉴: 경영관리 > 06. 근태관리 > 근태관리(관리자) (#1485)
- 파일: `client/vi/att/Att02_Tab_CommuteAdmin.java`
- 함께 쓰는 클래스 5개:
  - `Att02_Lookup_InsertBatch` `client/vi/att/Att02_Lookup_InsertBatch.java`
  - `Att02_Edit_InOutReason` `client/vi/att/Att02_Edit_InOutReason.java`
  - `Att02_Edit_CommuteBatch` `client/vi/att/Att02_Edit_CommuteBatch.java`
  - `Att02_Edit_Commute` `client/vi/att/Att02_Edit_Commute.java`
  - `Att01_Lookup_WorkPolicy` `client/vi/att/Att01_Lookup_WorkPolicy.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `att.Att01_WorkPolicy.delete` | Att01_Lookup_WorkPolicy:308 | [`Att01_WorkPolicy.java:62`](../../att/services/Att01_WorkPolicy.md) | `UpdateDataModel(att01_work_policy)` 동적 DELETE |
| `att.Att01_WorkPolicy.getModel` | Att02_Edit_CommuteBatch:211 | [`Att01_WorkPolicy.java:46`](../../att/services/Att01_WorkPolicy.md) | [`att01_work_policy.getModel`](../../att/sql/att01_work_policy.md) |
| `att.Att01_WorkPolicy.notWorkPolicyIdList` | Att01_Lookup_WorkPolicy:185 | [`Att01_WorkPolicy.java:34`](../../att/services/Att01_WorkPolicy.md) | [`att01_work_policy.notWorkPolicyIdList`](../../att/sql/att01_work_policy.md) |
| `att.Att01_WorkPolicy.selectByCompanyId` | Att01_Lookup_WorkPolicy:297 | [`Att01_WorkPolicy.java:25`](../../att/services/Att01_WorkPolicy.md) | [`att01_work_policy.selectByCompanyId`](../../att/sql/att01_work_policy.md) |
| `att.Att01_WorkPolicy.update` | Att01_Lookup_WorkPolicy:239 | [`Att01_WorkPolicy.java:57`](../../att/services/Att01_WorkPolicy.md) | `UpdateDataModel(att01_work_policy)` 동적 INSERT/UPDATE → [`att01_work_policy.selectById`](../../att/sql/att01_work_policy.md) |
| `att.Att02_Commute.adminCheck` | Att02_Tab_CommuteAdmin:370 | [`Att02_Commute.java:173`](../../att/services/Att02_Commute.md) | [`att02_commute.adminCheck`](../../att/sql/att02_commute.md) |
| `att.Att02_Commute.delete` | Att02_Tab_CommuteAdmin:440 | [`Att02_Commute.java:186`](../../att/services/Att02_Commute.md) | `UpdateDataModel(att02_commute)` 동적 DELETE |
| `att.Att02_Commute.insertBatch` | Att02_Lookup_InsertBatch:196 | [`Att02_Commute.java:139`](../../att/services/Att02_Commute.md) | [`att02_commute.insertBatch`](../../att/sql/att02_commute.md) |
| `att.Att02_Commute.selectByTextAdmin` | Att02_Tab_CommuteAdmin:398 | [`Att02_Commute.java:39`](../../att/services/Att02_Commute.md) | [`att02_commute.selectByTextAdmin`](../../att/sql/att02_commute.md) |
| `att.Att04_CommuteHist.insert` | Att02_Edit_Commute:178 | [`Att04_CommuteHist.java:63`](../../att/services/Att04_CommuteHist.md) | [`att04_commute_hist.insert`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.selectByCommuteId`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.updateTime`](../../att/sql/att04_commute_hist.md) |
| `att.Att04_CommuteHist.insertList` | Att02_Edit_CommuteBatch:180 | [`Att04_CommuteHist.java:85`](../../att/services/Att04_CommuteHist.md) | [`att02_commute.selectById`](../../att/sql/att02_commute.md), [`att04_commute_hist.insert`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.selectByCommuteId`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.updateTime`](../../att/sql/att04_commute_hist.md) |
| `att.Att04_CommuteHist.updateAuto` | Att02_Tab_CommuteAdmin:423 | [`Att04_CommuteHist.java:37`](../../att/services/Att04_CommuteHist.md) | [`att04_commute_hist.insertAuto`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.selectByCommuteId`](../../att/sql/att04_commute_hist.md), [`att04_commute_hist.updateTimeAuto`](../../att/sql/att04_commute_hist.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`att01_work_policy`](../../../db/tables/att.md), [`att02_commute`](../../../db/tables/att.md), [`att03_overtime_req`](../../../db/tables/att.md), [`att04_commute_hist`](../../../db/tables/att.md), [`att05_pm_work`](../../../db/tables/att.md), [`emp01_person`](../../../db/tables/emp.md), [`emp20_leave`](../../../db/tables/emp.md), [`sys12_calendar`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_create_seq`, `f_get_emptrans`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Att02_Tab_CommuteAdmin (`client/vi/att/Att02_Tab_CommuteAdmin.java`, 454줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar1`: {radio01} {baseDate} {radio02} {startDate} ~: {closeDate} 검색: {searchText} 사원: {empKorName} {retrieveButton} {updateButton} {insertButton}
- 툴바 `buttonBar2`: {updateAutoButton} {settingButton}
- 입력·하위 화면: `radio01` Radio, `radio02` Radio, `baseDate` MyDateField, `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="사원번호/사원명/본부(부서)", `empKorName` LookupTriggerField 빈칸="전체", `empSearch` Emp00_Lookup_SelectSingle, `lookup` Att01_Lookup_WorkPolicy
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - statusCode 35 " " DynamicCell 편집:actionCell01
  - workDate 100 "근무일자" Date
  - division 100 "근무형태" TextCenter
  - statusName 140 "상태" TextCenter
  - inOutReasonYnStr 35 " " DynamicCell 편집:actionCell02
  - personNo 100 "사원번호" TextCenter
  - personName 80 "사원명" TextCenter
  - orgName 160 "본부(부서)" Text
  - posName 80 "직위" TextCenter
  - dayOfWeek 50 "요일" TextCenter
  - dateInfo 100 "구분" TextCenter
  - checkInTimeStr 90 "출근시간" TextCenter
  - checkOutTimeStr 90 "퇴근시간" TextCenter
  - workTimeStr 100 "근로시간" TextCenter
  - calcCheckInTimeStr 90 "출근시간" TextCenter 편집:"2EAC7E"
  - calcCheckOutTimeStr 90 "퇴근시간" TextCenter 편집:"2EAC7E"
  - calcWorkTimeStr 100 "근로시간" TextCenter 편집:"2EAC7E"
  - actionCell 35 " " Cell 편집:actionCell03

#### 이벤트
[E0] 화면 열림 (생성자 L86-127) → settings(), retrieve()
[E1] radio01[근무일자 :].ValueChange [event.getValue()] (L134) → 인라인 L134-144 (event -> { if(event.getValue()) { bas…)
[E2] radio02[근무기간 :].ValueChange [event.getValue()] (L150) → 인라인 L150-160 (event -> { if(event.getValue()) { bas…)
[E3] searchText.KeyPress [Enter] (L178) → retrieve()
[E4] empKorName.TriggerClick [result == null] (L189) → 인라인 L189-207 (new TriggerClickHandler(){ @Override …)
[E5] empKorName.Change (L208) → 인라인 L208-215 (new ChangeHandler() { @Override publi…)
[E6] retrieveButton[조회].Select (L216) → retrieve()
[E7] updateButton[일괄수정].Select (L222) → update()
[E8] updateAutoButton[근로시간 일괄조정].Select [YES] (L233) → updateAuto()
[E9] msgBox.DialogHide [YES] (L243) → updateAuto()
[E10] settingButton[근태정책설정].Select (L261) → 인라인 L261-267 (new SelectHandler() { @Override publi…)
[E11] insertButton[일괄생성].Select [radio01.getValue()] (L268) → retrieve()
[E12] msgBox.DialogHide [YES] (L306) → adminCheck()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private adminCheck() | L369-380 | E12 | 서비스 att.Att02_Commute.adminCheck(commuteId) | 업무 |
| public retrieve() | L382-405 | 생성자,E3,E6,E11,buildGrid,adminCheck,update,updateAuto | 서비스 att.Att02_Commute.selectByTextAdmin(searchText, companyId, personId, baseDate, startDate, closeDate, baseDate, startDate, closeDate) | 업무 |
| private update() | L407-415 | E7 | 팝업 Att02_Edit_CommuteBatch 열기 | 업무 |
| private updateAuto() | L417-435 | E8,E9 | 서비스 att.Att04_CommuteHist.updateAuto(personId, changeReason) | 업무 |
| public deleteRow() | L437-441 | 공개 메서드 | GridDeleteData att.Att02_Commute.delete(체크된 행 목록) | 업무 |
| private settings() | L129-296 | 생성자 | 조회창 Emp00_Lookup_SelectSingle 열기, 조회창 Att01_Lookup_WorkPolicy 열기, 조회창 Att02_Lookup_InsertBatch 열기, 확인창 표시, 이벤트 연결, 초기값: radio01=true("근무일자 :"), radio02=false("근무기간 :"), baseDate=LoginUser.getToday(, startDate=date, closeDate=LoginUser.getToday(, empKorName="전체", empKorName=codeModel.getEmpPersonModel( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L298-367 | 필드 초기화 | 팝업 Att02_Edit_InOutReason 열기, 팝업 Att02_Edit_Commute 열기, 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L443-445 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L447-449 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGridStyle() | L451-453 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.group('newHeaderGroupMap012newHeaderGroupConfig13', 100, '근로자 실입력'),  // L344
  gb.group('newHeaderGroupMap015newHeaderGroupConfigsetHtmlGridStyle13', 100, '관리자 확정'),  // L345
  // ⚠ 대응 없음 (GridBuilder L347) addDynamicCell
  gb.date('workDate', 100, '근무일자'),  // L348
  gb.textCenter('division', 100, '근무형태'),  // L349
  gb.textCenter('statusNm', 140, '상태'),  // L350
  // ⚠ 대응 없음 (GridBuilder L351) addDynamicCell
  gb.textCenter('personNo', 100, '사원번호'),  // L352
  gb.textCenter('personNm', 80, '사원명'),  // L353
  gb.text('orgNm', 160, '본부(부서)'),  // L354
  gb.textCenter('posNm', 80, '직위'),  // L355
  gb.textCenter('dayOfWeek', 50, '요일'),  // L356
  gb.textCenter('dateInfo', 100, '구분'),  // L357
  gb.textCenter('checkInTimeStr', 90, '출근시간'),  // L358
  gb.textCenter('checkOutTimeStr', 90, '퇴근시간'),  // L359
  gb.textCenter('workTimeStr', 100, '근로시간'),  // L360
  gb.textCenter('calcCheckInTimeStr', 90, '출근시간'),  // L361
  gb.textCenter('calcCheckOutTimeStr', 90, '퇴근시간'),  // L362
  gb.textCenter('calcWorkTimeStr', 100, '근로시간'),  // L363
  // ⚠ 대응 없음 (GridBuilder L364) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={update}>일괄수정</Button>
3. <Button type="generate" onClick={retrieve}>일괄생성</Button>
4. <Button type="unknown" onClick={updateAuto}>근로시간 일괄조정</Button>
5. <Button type="unknown" onClick={() => /* 인라인 L261-267 (new SelectHandler() { @Override publi…) */}>근태정책설정</Button>

### Att02_Lookup_InsertBatch (`client/vi/att/Att02_Lookup_InsertBatch.java`, 227줄)

- 툴바 `buttonBar`: 근무일자: {startDate} ~: {closeDate} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - korName 100 "성명" TextCenter
  - empNo 100 "사번" TextCenter
  - orgName 250 "부서명" Text
  - posName 100 "직위" Text

#### 이벤트
[E0] 화면 열림 (생성자 L67-103) → settings()
[E1] insertButton[행 추가].Select (L109) → insertRow()
[E2] deleteButton[행 삭제].Select (L115) → delete()
[E3] updateButton[일괄생성].Select (L121) → update()
[E4] closeButton[닫기].Select (L127) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L59-65 | 공개 메서드 | 상태 처리 | 업무 |
| private insertRow() | L146-172 | E1 | 조회창 Emp00_Lookup_SelectMulti 열기 | 업무 |
| private update() | L174-211 | E3 | 서비스 att.Att02_Commute.insertBatch(startDate, closeDate, companyId) | 업무 |
| private delete() | L213-218 | E2 | 상태 처리 | 업무 |
| private settings() | L105-133 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L135-144 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L220-222 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L224-226 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('korNm', 100, '성명'),  // L138
  gb.textCenter('empNo', 100, '사번'),  // L139
  gb.text('orgNm', 250, '부서명'),  // L140 SQL 계산 컬럼(selectByCompanyId: f_get_empTrans(emp01_person_id, f_sysda…)
  gb.text('posNm', 100, '직위'),  // L141 SQL 계산 컬럼(selectByCompanyId: f_get_empTrans(emp01_person_id, f_sysda…)
];
```

#### 사용된 버튼들
1. <Button type="addRow" onClick={insertRow}>행 추가</Button>
2. <Button type="removeRow" onClick={delete}>행 삭제</Button>
3. <Button type="generate" onClick={update}>일괄생성</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Att02_Edit_InOutReason (`client/vi/att/Att02_Edit_InOutReason.java`, 89줄)

- 입력·하위 화면: `inReason` MyTextArea, `outReason` MyTextArea

#### 이벤트
[E0] 화면 열림 (생성자 L43-71) → show()
[E1] closeButton[닫기].Select (L74) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L34-41 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L73-80 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L82-84 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L86-88 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>

### Att02_Edit_CommuteBatch (`client/vi/att/Att02_Edit_CommuteBatch.java`, 258줄)

- 입력·하위 화면: `checkBox01` CheckBox, `checkBox02` CheckBox, `checkInTime` MyDateField, `checkOutTime` MyDateField, `checkInTimeStr` TextField 빈칸="24:59", `checkOutTimeStr` TextField 빈칸="24:59"

#### 이벤트
[E0] 화면 열림 (생성자 L61-94) → show()
[E1] checkBox01.ValueChange (L104) → 인라인 L104-107 (event -> { checkInTime.setEnabled(eve…)
[E2] checkBox02.ValueChange (L109) → 인라인 L109-112 (event -> { checkOutTime.setEnabled(ev…)
[E3] checkInTimeStr[확정 출근시간].Blur (L114) → formatTime()
[E4] checkOutTimeStr[확정 퇴근시간].Blur (L119) → formatTime()
[E5] checkInTimeStr[확정 출근시간].KeyPress (L125) → 인라인 L125-130 (event -> { char c = event.getCharCode())
[E6] checkOutTimeStr[확정 퇴근시간].KeyPress (L131) → 인라인 L131-136 (event -> { char c = event.getCharCode())
[E7] updateButton[적용].Select (L138) → update()
[E8] closeButton[닫기].Select (L144) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L52-59 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L152-208 | E7 | 서비스 att.Att04_CommuteHist.insertList(commuteIdList, personId, changeReason, checkInTime, checkInTimeStr, checkInTime, checkInTimeStr, checkOutTime, checkOutTimeStr, checkOutTime, checkOutTimeStr) | 업무 |
| private defaultInfo() | L210-226 | open | 서비스 att.Att01_WorkPolicy.getModel(companyId) | 업무 |
| private isValidTime() | L228-230 | update | 상태 처리 | 업무 |
| private formatTime() | L232-249 | E3,E4 | 상태 처리 | 업무 |
| private settings() | L96-150 | open | 이벤트 연결, 초기값: checkInTime=this.commuteList.get(0, checkOutTime=this.commuteList.get(0, checkBox01=true, checkBox02=true, checkInTimeStr=formatted("확정 출근시간"), checkOutTimeStr=formatted("확정 퇴근시간") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L251-253 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L255-257 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="unknown" onClick={update}>적용</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Att02_Edit_Commute (`client/vi/att/Att02_Edit_Commute.java`, 223줄)

- 입력·하위 화면: `checkInTime` MyDateField, `checkOutTime` MyDateField, `checkInTimeStr` TextField 빈칸="24:59", `checkOutTimeStr` TextField 빈칸="24:59"

#### 이벤트
[E0] 화면 열림 (생성자 L61-91) → show()
[E1] checkInTimeStr[확정 출근시간].Blur (L99) → formatTime()
[E2] checkOutTimeStr[확정 퇴근시간].Blur (L104) → formatTime()
[E3] checkInTimeStr[확정 출근시간].KeyPress (L110) → 인라인 L110-115 (event -> { char c = event.getCharCode())
[E4] checkOutTimeStr[확정 퇴근시간].KeyPress (L116) → 인라인 L116-121 (event -> { char c = event.getCharCode())
[E5] updateButton[저장].Select (L123) → updateChk()
       └ [E7] msgBox.DialogHide [YES] (L158) → update()
[E6] closeButton[닫기].Select (L129) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public edit() | L51-59 | 공개 메서드 | 상태 처리 | 업무 |
| private updateChk() | L137-173 | E5 | ConfirmBox → E7 | 업무 |
| private update() | L175-191 | E7 | 서비스 att.Att04_CommuteHist.insert(updateModel, personId, changeReason) | 업무 |
| private isValidTime() | L193-195 | updateChk | 상태 처리 | 업무 |
| private formatTime() | L197-214 | E1,E2 | 상태 처리 | 업무 |
| private settings() | L93-135 | edit | 이벤트 연결, 초기값: checkInTimeStr=formatted("확정 출근시간"), checkOutTimeStr=formatted("확정 퇴근시간") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L216-218 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L220-222 | edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateChk}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Att01_Lookup_WorkPolicy (`client/vi/att/Att01_Lookup_WorkPolicy.java`, 314줄)

- 툴바 `buttonBar`: {retrieveButton} {updateButton} {insertButton} {deleteButton}
- 그리드 `grid` (buildGrid()):
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - workStartTime 130 "출근시간" TextCenter 편집:TextField
  - workEndTime 130 "퇴근시간" TextCenter 편집:TextField
  - breakMinutes 130 "휴게시간(분)" Long 편집:LongField
  - useYn 50 "사용" Boolean
  - overtimeMinutes 130 "연장허용시간(분)" Long 편집:LongField
  - startGraceAfterMinutes 130 "출근 지각<br>허용시간(분)" Long 편집:LongField
  - endGraceBeforeMinutes 130 "퇴근 조기<br>허용시간(분)" Long 편집:LongField
  - endGraceAfterMinutes 130 "퇴근 초과인정<br>유예시간(분)" Long 편집:LongField
  - pmWorkStartTime 130 "오후근무<br>출근시간" TextCenter 편집:TextField
  - pmWorkEndTime 130 "오후근무<br>퇴근시간" TextCenter 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L65-90) → settings(), show()
[E1] retrieveButton[조회].Select (L93) → retrieve()
[E2] insertButton[등록].Select (L99) → insertRow()
[E3] updateButton[저장].Select (L105) → update()
[E4] deleteButton[삭제].Select (L111) → deleteChk()
       └ [E6] msgBox.DialogHide [YES] (L274) → delete()
[E5] closeButton[닫기].Select (L117) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L61-63 | 공개 메서드 | 상태 처리 | 업무 |
| private update() | L143-235 | E3 | 서비스 att.Att01_WorkPolicy.notWorkPolicyIdList(companyId, workPolicyIdList) | 업무 |
| private updateFinal() | L237-249 | update | 서비스 att.Att01_WorkPolicy.update | 업무 |
| private insertRow() | L251-269 | E2 | 상태 처리 | 업무 |
| private deleteChk() | L271-290 | E4 | ConfirmBox → E6 | 업무 |
| public retrieve() | L292-303 | E1,open | 서비스 att.Att01_WorkPolicy.selectByCompanyId(companyId) | 업무 |
| private delete() | L305-309 | E6 | GridDeleteData att.Att01_WorkPolicy.delete(체크된 행 목록) | 업무 |
| private settings() | L92-123 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L125-141 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L311-313 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L127
  gb.textCenter('workStartTime', 130, '출근시간', { editor: 'text' }),  // L128
  gb.textCenter('workEndTime', 130, '퇴근시간', { editor: 'text' }),  // L129
  gb.long('breakMinutes', 130, '휴게시간(분)', { editor: 'number' }),  // L130
  gb.boolean('useYn', 50, '사용'),  // L131
  gb.long('overtimeMinutes', 130, '연장허용시간(분)', { editor: 'number' }),  // L132
  gb.long('startGraceAfterMinutes', 130, '출근 지각<br>허용시간(분)', { editor: 'number' }),  // L133
  gb.long('endGraceBeforeMinutes', 130, '퇴근 조기<br>허용시간(분)', { editor: 'number' }),  // L134
  gb.long('endGraceAfterMinutes', 130, '퇴근 초과인정<br>유예시간(분)', { editor: 'number' }),  // L135
  gb.textCenter('pmWorkStartTime', 130, '오후근무<br>출근시간', { editor: 'text' }),  // L136
  gb.textCenter('pmWorkEndTime', 130, '오후근무<br>퇴근시간', { editor: 'text' }),  // L137
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

