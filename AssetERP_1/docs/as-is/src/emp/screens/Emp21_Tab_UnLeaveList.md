# Emp21_Tab_UnLeaveList

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 연차휴가 사용촉진 (#1185)
- 파일: `client/vi/emp/Emp21_Tab_UnLeaveList.java`
- 함께 쓰는 클래스 3개:
  - `Emp21_TabPage_UnLeaveList2` `client/vi/emp/Emp21_TabPage_UnLeaveList2.java`
  - `Emp21_TabPage_UnLeaveList1` `client/vi/emp/Emp21_TabPage_UnLeaveList1.java`
  - `Emp21_Lookup_Insert` `client/vi/emp/Emp21_Lookup_Insert.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Emp21_TabPage_UnLeaveList1:244, Emp21_TabPage_UnLeaveList1:274, Emp21_TabPage_UnLeaveList2:243 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Emp21_TabPage_UnLeaveList1:218, Emp21_TabPage_UnLeaveList2:217 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `emp.Emp21_UnLeave.delete` | Emp21_TabPage_UnLeaveList1:411, Emp21_TabPage_UnLeaveList2:362 | [`Emp21_UnLeave.java:679`](../../emp/services/Emp21_UnLeave.md) | `UpdateDataModel(emp21_un_leave)` 동적 DELETE |
| `emp.Emp21_UnLeave.insert` | Emp21_Lookup_Insert:136 | [`Emp21_UnLeave.java:95`](../../emp/services/Emp21_UnLeave.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.selectByUnLeaveCode`](../../emp/sql/emp01_person.md), [`emp21_un_leave.insert`](../../emp/sql/emp21_un_leave.md) |
| `emp.Emp21_UnLeave.insert2` | Emp21_TabPage_UnLeaveList2:506 | [`Emp21_UnLeave.java:128`](../../emp/services/Emp21_UnLeave.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp01_person.selectByUnLeaveCode2`](../../emp/sql/emp01_person.md), [`emp21_un_leave.insert`](../../emp/sql/emp21_un_leave.md) |
| `emp.Emp21_UnLeave.insertAppr` | Emp21_TabPage_UnLeaveList1:472 | [`Emp21_UnLeave.java:159`](../../emp/services/Emp21_UnLeave.md) | [`apr01_appr.insertApproval`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.insertApproval`](../../apr/sql/apr04_appr_step.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp21_un_leave.updateApprId`](../../emp/sql/emp21_un_leave.md), [`emp22_etc_leave.getLeaveDate`](../../emp/sql/emp22_etc_leave.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys12_calendar.selectByDate`](../../sys/sql/sys12_calendar.md) |
| `emp.Emp21_UnLeave.insertAppr2` | Emp21_TabPage_UnLeaveList2:428 | [`Emp21_UnLeave.java:387`](../../emp/services/Emp21_UnLeave.md) | [`apr01_appr.insertApproval`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.insertApproval`](../../apr/sql/apr04_appr_step.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp21_un_leave.updateApprId`](../../emp/sql/emp21_un_leave.md), [`emp22_etc_leave.getLeaveDate`](../../emp/sql/emp22_etc_leave.md), [`sys12_calendar.selectByDate`](../../sys/sql/sys12_calendar.md) |
| `emp.Emp21_UnLeave.selectByUnLeaveCode` | Emp21_TabPage_UnLeaveList1:357 | [`Emp21_UnLeave.java:71`](../../emp/services/Emp21_UnLeave.md) | [`emp21_un_leave.selectByUnLeaveCode`](../../emp/sql/emp21_un_leave.md) |
| `emp.Emp21_UnLeave.selectByUnLeaveCode2` | Emp21_TabPage_UnLeaveList2:308 | [`Emp21_UnLeave.java:83`](../../emp/services/Emp21_UnLeave.md) | [`emp21_un_leave.selectByUnLeaveCode2`](../../emp/sql/emp21_un_leave.md) |
| `emp.Emp21_UnLeave.sendMessage` | Emp21_TabPage_UnLeaveList1:514, Emp21_TabPage_UnLeaveList2:470 | [`Emp21_UnLeave.java:615`](../../emp/services/Emp21_UnLeave.md) | [`emp01_person.selectById`](../../emp/sql/emp01_person.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `emp.Emp21_UnLeave.update` | Emp21_TabPage_UnLeaveList1:376, Emp21_TabPage_UnLeaveList2:327 | [`Emp21_UnLeave.java:674`](../../emp/services/Emp21_UnLeave.md) | `UpdateDataModel(emp21_un_leave)` 동적 INSERT/UPDATE → [`emp21_un_leave.selectById`](../../emp/sql/emp21_un_leave.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Emp21_Lookup_Insert:40, Emp21_TabPage_UnLeaveList1:75, Emp21_TabPage_UnLeaveList2:75 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp21_un_leave`](../../../db/tables/emp.md), [`emp22_etc_leave`](../../../db/tables/emp.md), [`emp23_etc_leave_person`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_close_date`, `f_get_datediff`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_last_day`, `f_get_leave_days2`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp21_Tab_UnLeaveList (`client/vi/emp/Emp21_Tab_UnLeaveList.java`, 30줄)

- 레이아웃: center=vlc
- 입력·하위 화면: `tabPage1` Emp21_TabPage_UnLeaveList1, `tabPage2` Emp21_TabPage_UnLeaveList2

#### 이벤트
[E0] 화면 열림 (생성자 L13-29) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Emp21_TabPage_UnLeaveList2 (`client/vi/emp/Emp21_TabPage_UnLeaveList2.java`, 542줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 해당 연도: {yearText} 구분: {unLeaveComboBox} {retrieveButton} {updateButton} {deleteButton} {insertButton} ※ 기타직은 미사용 월차휴가관리 대상자가 아니므로 생성 시 제외됩니다.:
- 입력·하위 화면: `yearText` TextField, `unLeaveComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체"), `classTreeFullName` LookupTriggerField 빈칸="구분값을 먼저 선택해주세요", `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - unLeaveName 150 "구분" Text
  - personNo 50 "사번" TextCenter
  - personName 100 "성명" TextCenter
  - hireDate 100 "입사일자" Date
  - totalDays 100 "발생휴가" Double 편집:DoubleField
  - useDays 100 "사용휴가" Double 편집:DoubleField
  - remainDays 100 "잔여휴가" Double 편집:DoubleField
  - startDate 100 "생성일자" Date
  - apprStatusName 100 "통지여부" TextCenter
  - actionCell 60 "상세보기" Cell 편집:actionCell
  - expectApprStatusName 100 "지정통보여부" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L92-131) → settings()
[E1] unLeaveComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L117) → defaultName(), retrieve()
[E2] retrieveButton[조회].Select (L152) → retrieve()
[E3] updateButton[저장].Select (L158) → update()
[E4] deleteButton[삭제].Select (L164) → deleteCheck()
       └ [E9] msgBox.DialogHide [YES] (L342) → delete()
[E5] insertButton[생성].Select (L170) → insert()
[E6] classTreeFullName[문서분류].TriggerClick (L177) → openLookupDoc()
[E7] apprButton[상신].Select (L183) → insertApprCheck()
       └ [E10] msgBox.DialogHide [YES] (L402) → insertAppr()
[E8] sendButton[문자발송].Select (L189) → sendMessage()
       └ [E11] msgBox.DialogHide [YES] (L465) → 서비스 emp.Emp21_UnLeave.sendMessage, 메시지 "문자알림이 발송되었습니다 / 문자발송 기능을 미신…"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L201-237 | E1 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public retrieve() | L289-314 | E1,E2,insertAppr,insert | 서비스 emp.Emp21_UnLeave.selectByUnLeaveCode2(companyId, unLeaveCode, stdYear) | 업무 |
| public update() | L316-328 | E3 | 서비스 emp.Emp21_UnLeave.update | 업무 |
| public deleteCheck() | L330-357 | E4 | 미선택 시 alert "상신중인 미사용휴가정보가 포함되어있습니다" → 확인창 E9 | 업무 |
| public delete() | L359-363 | E9 | GridDeleteData emp.Emp21_UnLeave.delete(체크된 행 목록) | 업무 |
| private openLookupDoc() | L366-375 | E6 | 상태 처리 | 업무 |
| private insertApprCheck() | L377-418 | E7 | 미선택 시 alert "구분을 선택해주세요" → 확인창 E10 | 업무 |
| private insertAppr() | L420-441 | E10 | 서비스 emp.Emp21_UnLeave.insertAppr2 | 업무 |
| private sendMessage() | L443-496 | E8 | 미선택 시 alert "문자발송할 사원을 선택해주세요" → 확인창 E11 | 업무 |
| public insert() | L498-524 | E5 | 서비스 emp.Emp21_UnLeave.insert2(companyId, stdYear) | 업무 |
| private settings() | L133-199 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L239-287 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L526-529 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L531-533 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L535-537 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L539-541 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('unLeaveNm', 150, '구분'),  // L274 SQL 계산 컬럼(selectById: f_cdnm('unLeaveCode', emp21_un_leave_cd…)
  gb.textCenter('personNo', 50, '사번'),  // L275 SQL 계산 컬럼(selectById: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L276 SQL 계산 컬럼(selectById: f_emp_kor_nm(emp21_person_id))
  gb.date('hireDate', 100, '입사일자'),  // L277 SQL 계산 컬럼(selectById: COALESCE(emp02_hire_date_leave_calc, em…)
  gb.double('totalDays', 100, '발생휴가', { editor: 'number' }),  // L278
  gb.double('useDays', 100, '사용휴가', { editor: 'number' }),  // L279
  gb.double('remainDays', 100, '잔여휴가', { editor: 'number' }),  // L280
  gb.date('startDate', 100, '생성일자'),  // L281
  gb.textCenter('apprStatusNm', 100, '통지여부'),  // L282 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L283) addCell
  gb.textCenter('expectApprStatusNm', 100, '지정통보여부'),  // L284 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr02.apr01_sta…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="generate" onClick={insert}>생성</Button>
5. <Button type="register" onClick={insertApprCheck}>상신</Button>
6. <Button type="unknown" onClick={sendMessage}>문자발송</Button>

### Emp21_TabPage_UnLeaveList1 (`client/vi/emp/Emp21_TabPage_UnLeaveList1.java`, 563줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 해당 연도: {yearText} 구분: {unLeaveComboBox} {retrieveButton} {updateButton} {deleteButton} {insertButton} ※ 기타직은 미사용 연차휴가관리 대상자가 아니므로 생성 시 제외됩니다.:
- 입력·하위 화면: `yearText` TextField, `unLeaveComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="구분을 선택해주세요", `classTreeFullName` LookupTriggerField 빈칸="구분값을 먼저 선택해주세요", `editor` Apr01_Edit_ApprDoc, `lookupInsert` Emp21_Lookup_Insert
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - personNo 50 "사번" TextCenter
  - personName 100 "성명" TextCenter
  - hireDate 100 "입사일자" Date
  - totalDays 100 "발생휴가" Double 편집:DoubleField
  - useDays 100 "사용휴가" Double 편집:DoubleField
  - remainDays 100 "잔여휴가" Double 편집:DoubleField
  - startDate 100 "생성일자" Date
  - apprStatusName 140 "사용촉진통보" TextCenter
  - actionCell 60 "사용촉진<br>상세보기" Cell 편집:actionCell
  - expectApprStatusName 100 "지정통보" TextCenter
  - actionCell 60 "지정통보<br>상세보기" Cell 편집:actionCell2

#### 이벤트
[E0] 화면 열림 (생성자 L92-130) → settings()
[E1] unLeaveComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L116) → defaultName(), retrieve()
[E2] retrieveButton[조회].Select (L154) → retrieve()
[E3] updateButton[저장].Select (L160) → update()
[E4] deleteButton[삭제].Select (L166) → deleteCheck()
       └ [E9] msgBox.DialogHide [YES] (L391) → delete()
[E5] insertButton[생성].Select (L172) → insert()
[E6] classTreeFullName[문서분류].TriggerClick (L178) → openLookupDoc()
[E7] apprButton[상신].Select (L184) → insertApprCheck()
       └ [E10] msgBox.DialogHide [YES] (L446) → insertAppr()
[E8] sendButton[문자발송].Select (L190) → sendMessage()
       └ [E11] msgBox.DialogHide [YES] (L509) → 서비스 emp.Emp21_UnLeave.sendMessage, 메시지 "문자알림이 발송되었습니다 / 문자발송 기능을 미신…"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L202-238 | E1 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public insert() | L319-330 | E5 | 조회창 Emp21_Lookup_Insert 열기 → 콜백: unmask | 업무 |
| public retrieve() | L332-363 | E1,E2,insert,insertAppr | 서비스 emp.Emp21_UnLeave.selectByUnLeaveCode(companyId, unLeaveCode, stdYear) | 업무 |
| public update() | L365-377 | E3 | 서비스 emp.Emp21_UnLeave.update | 업무 |
| private deleteCheck() | L379-406 | E4 | 미선택 시 alert "상신중인 미사용휴가정보가 포함되어있습니다" → 확인창 E9 | 업무 |
| private delete() | L408-412 | E9 | GridDeleteData emp.Emp21_UnLeave.delete(체크된 행 목록) | 업무 |
| private openLookupDoc() | L415-424 | E6 | 상태 처리 | 업무 |
| private insertApprCheck() | L426-462 | E7 | 미선택 시 alert "구분을 선택해주세요" → 확인창 E10 | 업무 |
| private insertAppr() | L464-485 | E10 | 서비스 emp.Emp21_UnLeave.insertAppr | 업무 |
| private sendMessage() | L487-540 | E8 | 미선택 시 alert "문자발송할 사원을 선택해주세요" → 확인창 E11 | 업무 |
| private settings() | L132-200 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L240-317 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L542-545 | retrieve | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L547-550 | retrieve | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L552-554 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L556-558 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L560-562 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('personNo', 50, '사번'),  // L304 SQL 계산 컬럼(selectById: emp01_emp_no)
  gb.textCenter('personNm', 100, '성명'),  // L305 SQL 계산 컬럼(selectById: f_emp_kor_nm(emp21_person_id))
  gb.date('hireDate', 100, '입사일자'),  // L306 SQL 계산 컬럼(selectById: COALESCE(emp02_hire_date_leave_calc, em…)
  gb.double('totalDays', 100, '발생휴가', { editor: 'number' }),  // L307
  gb.double('useDays', 100, '사용휴가', { editor: 'number' }),  // L308
  gb.double('remainDays', 100, '잔여휴가', { editor: 'number' }),  // L309
  gb.date('startDate', 100, '생성일자'),  // L310
  gb.textCenter('apprStatusNm', 140, '사용촉진통보'),  // L311 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L312) addCell
  gb.textCenter('expectApprStatusNm', 100, '지정통보'),  // L313 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr02.apr01_sta…)
  // ⚠ 대응 없음 (GridBuilder L314) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="generate" onClick={insert}>생성</Button>
5. <Button type="register" onClick={insertApprCheck}>상신</Button>
6. <Button type="unknown" onClick={sendMessage}>문자발송</Button>

### Emp21_Lookup_Insert (`client/vi/emp/Emp21_Lookup_Insert.java`, 167줄)

- 입력·하위 화면: `yearText` TextField, `unLeaveComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="구분을 선택해주세요"

#### 이벤트
[E1] updateButton[생성].Select (L84) → updateCheck()
[E2] closeButton[닫기].Select (L91) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-103 | 공개 메서드 | 상태 처리 | 업무 |
| public updateCheck() | L105-124 | E1 | 상태 처리 | 업무 |
| public update() | L126-154 | updateCheck | 서비스 emp.Emp21_UnLeave.insert(companyId, stdYear, unLeaveCode) | 업무 |
| private setHtmlStyle() | L156-158 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L160-162 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L164-166 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={updateCheck}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

