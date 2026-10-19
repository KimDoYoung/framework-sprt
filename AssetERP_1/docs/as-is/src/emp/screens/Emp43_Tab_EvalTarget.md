# Emp43_Tab_EvalTarget

- 종류: 화면
- 메뉴: 경영관리 > 05. 인사평가 > 인사평가 대상자 (#1392)
- 파일: `client/vi/emp/Emp43_Tab_EvalTarget.java`
- 함께 쓰는 클래스 3개:
  - `Emp43_Lookup_SelectSingle` `client/vi/emp/Emp43_Lookup_SelectSingle.java`
  - `Emp43_Lookup_SelectMulti` `client/vi/emp/Emp43_Lookup_SelectMulti.java`
  - `Emp43_Edit_ChangeEval` `client/vi/emp/Emp43_Edit_ChangeEval.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `emp.Emp00_TransInfo.getHighInfo` | Emp43_Tab_EvalTarget:435 | [`Emp00_TransInfo.java:610`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.getHighInfo`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByEvalText` | Emp43_Lookup_SelectMulti:162 | [`Emp00_TransInfo.java:72`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByEvalText`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp00_TransInfo.selectByText` | Emp43_Lookup_SelectSingle:170 | [`Emp00_TransInfo.java:33`](../../emp/services/Emp00_TransInfo.md) | [`emp00_trans_info.selectByText`](../../emp/sql/emp00_trans_info.md) |
| `emp.Emp40_EvalListStd.getEvalListStdId` | Emp43_Tab_EvalTarget:407 | [`Emp40_EvalListStd.java:36`](../../emp/services/Emp40_EvalListStd.md) | [`emp40_eval_list_std.getEvalListStdId`](../../emp/sql/emp40_eval_list_std.md) |
| `emp.Emp43_EvalTarget.deleteList` | Emp43_Tab_EvalTarget:688 | [`Emp43_EvalTarget.java:163`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md), [`emp44_eval_write.deleteByPersonId`](../../emp/sql/emp44_eval_write.md), `UpdateDataModel(emp43_eval_target)` 동적 DELETE |
| `emp.Emp43_EvalTarget.selectByTermCode` | Emp43_Tab_EvalTarget:506 | [`Emp43_EvalTarget.java:32`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectByTermCode`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.update` | Emp43_Tab_EvalTarget:644 | [`Emp43_EvalTarget.java:199`](../../emp/services/Emp43_EvalTarget.md) | `UpdateDataModel(emp43_eval_target)` 동적 INSERT/UPDATE → [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.updateEval` | Emp43_Edit_ChangeEval:172 | [`Emp43_EvalTarget.java:89`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.updateEval`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp43_EvalTarget.updateList` | Emp43_Tab_EvalTarget:634 | [`Emp43_EvalTarget.java:125`](../../emp/services/Emp43_EvalTarget.md) | [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md), [`emp44_eval_write.deleteByPersonId`](../../emp/sql/emp44_eval_write.md), `UpdateDataModel(emp43_eval_target)` 동적 INSERT/UPDATE → [`emp43_eval_target.selectById`](../../emp/sql/emp43_eval_target.md) |
| `emp.Emp44_EvalWrite.selectByEvaluatorId` | Emp43_Lookup_SelectSingle:188, Emp43_Lookup_SelectSingle:212 | [`Emp44_EvalWrite.java:34`](../../emp/services/Emp44_EvalWrite.md) | [`emp44_eval_write.selectByEvaluatorId`](../../emp/sql/emp44_eval_write.md) |
| `emp.Emp45_EvalRelateAppr.selectByTermCode` | Emp43_Tab_EvalTarget:516 | [`Emp45_EvalRelateAppr.java:25`](../../emp/services/Emp45_EvalRelateAppr.md) | [`emp45_eval_relate_appr.selectByTermCode`](../../emp/sql/emp45_eval_relate_appr.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Emp43_Tab_EvalTarget:183 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys01_Company.selectById` | Emp43_Tab_EvalTarget:150 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`emp08_license`](../../../db/tables/emp.md), [`emp40_eval_list_std`](../../../db/tables/emp.md), [`emp43_eval_target`](../../../db/tables/emp.md), [`emp44_eval_write`](../../../db/tables/emp.md), [`emp45_eval_relate_appr`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys04_role`](../../../db/tables/sys.md), [`sys05_user_role`](../../../db/tables/sys.md), [`sys06_menu`](../../../db/tables/sys.md), [`sys07_role_menu`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_org_parent_info_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Emp43_Tab_EvalTarget (`client/vi/emp/Emp43_Tab_EvalTarget.java`, 735줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 평가기간: {dataYearText} 년: {termComboBox} {orgName} {retrieveButton} {updateButton} {insertButton} {deleteButton} {changeButton}
- 입력·하위 화면: `orgName` LookupTriggerField 빈칸="전체", `dataYearText` TextField, `termComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `orgSearch` Org00_Lookup_SelectSingle, `lookup01` LookupTriggerField, `lookup` Emp43_Lookup_SelectSingle, `lookup02` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - orgHeadName 80 "구분" TextCenter
  - posName 80 "직위" TextCenter
  - personName 80 "성명" TextCenter
  - orgName 180 "부서" TextCenter
  - firstOrgName 180 "직책" TextCenter
  - firstPersonName 80 "성명" TextCenter 편집:lookup01
  - firstEvalWeight 80 "비중(%)" LongCenter 편집:LongField
  - secondOrgName 180 "직책" TextCenter
  - secondPersonName 80 "성명" TextCenter 편집:lookup02
  - secondEvalWeight 80 "비중(%)" LongCenter 편집:LongField
  - sumEvalWeight 80 "평가비중<br>합계(%)" LongCenter
  - status 100 "진행상태" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L97-127) → settings(), retrieve()
[E1] orgName.TriggerClick (L133) → openLookupOrgInfo()
[E2] dataYearText.ValueChange (L143) → retrieve()
[E3] termComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L193) → retrieve()
[E4] retrieveButton[조회].Select (L199) → retrieve()
[E5] insertButton[등록].Select (L205) → insertRow()
[E6] updateButton[저장].Select (L211) → updateChk()
       └ [E11] msgBox.DialogHide [YES] (L611) → updateList()
[E7] deleteButton[삭제].Select (L217) → deleteChk()
       └ [E12] msgBox.DialogHide [YES] (L667) → deleteList()
[E8] changeButton[평가자 변경(선택)].Select (L223) → changeChk()
[E9] lookup01.TriggerClick [선택>0] (L251) → 메시지 "완료건은 수정이 불가능합니다 / 1,2차 평가자는…"
[E10] lookup02.TriggerClick [선택>0] (L300) → 메시지 "완료건은 수정이 불가능합니다 / 1,2차 평가자는…"

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private openLookupOrgInfo() | L231-246 | E1 | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private insertRow() | L368-424 | E5 | 서비스 emp.Emp40_EvalListStd.getEvalListStdId(companyId, startDate) | 업무 |
| private insertRow() | L426-492 | E5 | 조회창 Emp43_Lookup_SelectMulti 열기, 서비스 emp.Emp00_TransInfo.getHighInfo(companyId, personId, orgCodeId, transDate) | 업무 |
| private retrieve() | L494-513 | 생성자,E2,E3,E4,changeChk | 서비스 emp.Emp43_EvalTarget.selectByTermCode(companyId, stdYear, orgId, stdTermCode, stdTermCode) | 업무 |
| private checkFinalApprStatus() | L515-549 | retrieve | 서비스 emp.Emp45_EvalRelateAppr.selectByTermCode(companyId, stdYear, stdTermCode, stdTermCode) | 업무 |
| private updateChk() | L551-630 | E6 | ConfirmBox → E11 | 업무 |
| private updateList() | L632-640 | E11 | 서비스 emp.Emp43_EvalTarget.updateList | 업무 |
| private update() | L642-650 | updateChk | 서비스 emp.Emp43_EvalTarget.update | 업무 |
| private deleteChk() | L652-683 | E7 | ConfirmBox → E12 | 업무 |
| private deleteList() | L685-694 | E12 | GridDeleteData emp.Emp43_EvalTarget.deleteList(체크된 행 목록) | 업무 |
| private changeChk() | L696-721 | E8 | 팝업 Emp43_Edit_ChangeEval 열기 | 업무 |
| private settings() | L129-229 | 생성자 | 서비스 sys.Sys01_Company.selectById, sys.Sys00_Common.selectByKindGroupCode, 이벤트 연결, 초기값: dataYearText=startYear, dataYearText=DateTimeFormat.getFormat("yyyy" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L248-366 | 필드 초기화 | 조회창 Emp43_Lookup_SelectSingle 열기, 미선택 시 alert "완료건은 수정이 불가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L723-726 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L728-730 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L732-734 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L348 newHeaderGroupMap02newHeaderGroupConfig14 100 "인사평가 대상자" (emp03_new_header_group_map02new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L349 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle13 100 "1차 평가자" (emp03_new_header_group_map06new_header_group_configset_html_grid_style13 컬럼 없음)
  // ⚠DB없음 L350 newHeaderGroupMap09newHeaderGroupConfigsetHtmlGridStyle13 100 "2차 평가자" (emp03_new_header_group_map09new_header_group_configset_html_grid_style13 컬럼 없음)
  gb.textCenter('orgHeadNm', 80, '구분'),  // L352
  gb.textCenter('posNm', 80, '직위'),  // L353
  gb.textCenter('personNm', 80, '성명'),  // L354
  gb.textCenter('orgNm', 180, '부서'),  // L355
  gb.textCenter('firstOrgNm', 180, '직책'),  // L356
  gb.textCenter('firstPersonNm', 80, '성명'),  // L357
  gb.longCenter('firstEvalWeight', 80, '비중(%)', { editor: 'number' }),  // L358
  gb.textCenter('secondOrgNm', 180, '직책'),  // L359
  gb.textCenter('secondPersonNm', 80, '성명'),  // L360
  gb.longCenter('secondEvalWeight', 80, '비중(%)', { editor: 'number' }),  // L361
  gb.longCenter('sumEvalWeight', 80, '평가비중<br>합계(%)'),  // L362
  gb.textCenter('status', 100, '진행상태'),  // L363
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={updateChk}>저장</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>
5. <Button type="change" onClick={changeChk}>평가자 변경(선택)</Button>

### Emp43_Lookup_SelectSingle (`client/vi/emp/Emp43_Lookup_SelectSingle.java`, 272줄)

- 툴바 `buttonBar`: 기준일: {baseDateField} 조직/직무/성명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField, `baseDateField` MyDateField
- 그리드 `grid` (buildGrid(), 체크박스):
  - parentFullName 200 "조직" Text
  - titleName 120 "직책" Text
  - empNo 80 "사번" Text
  - empKorName 100 "성명" Text
  - transDate 100 "발령일" Date

#### 이벤트
[E1] grid.CellDoubleClick (L91) → confirmChk()
[E2] searchText.KeyPress [Enter] (L112) → retrieve()
[E3] retrieveButton[조회].Select (L120) → retrieve()
[E4] oKButton[확인].Select (L126) → confirmChk()
[E5] nullButton[미선택].Select (L132) → hide()
[E6] cancelButton[닫기].Select (L139) → hide()
[E7] msgBox.DialogHide [YES] (L240) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-105 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L160-176 | E2,E3,open | 서비스 emp.Emp00_TransInfo.selectByText(companyId, searchText, transDate, transCode, isSeparateAddTitle) | 업무 |
| public confirmChk() | L178-235 | E1,E4 | 미선택 시 alert "선택된 사원이 없습니다", 서비스 emp.Emp44_EvalWrite.selectByEvaluatorId, emp.Emp44_EvalWrite.selectByEvaluatorId(evalTargetId, personId, evalTargetId, personId) | 업무 |
| public deleteWrite() | L237-256 | confirmChk | 확인창 표시 | 업무 |
| public confirm() | L258-263 | E7,confirmChk | 상태 처리 | 업무 |
| private settings() | L107-145 | open | 이벤트 연결, 초기값: baseDateField=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L147-158 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L265-267 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L269-271 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L151
  gb.text('titleNm', 120, '직책'),  // L152
  gb.text('empNo', 80, '사번'),  // L153
  gb.text('korNm', 100, '성명'),  // L154
  gb.date('transDate', 100, '발령일'),  // L155
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirmChk}>확인</Button>
3. <Button type="unknown" onClick={hide}>미선택</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp43_Lookup_SelectMulti (`client/vi/emp/Emp43_Lookup_SelectMulti.java`, 206줄)

- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton}
- 툴바 `buttonBarBottom`: * 비중(%) 초기설정값: 1차 평가자: {firstWeight} /: 2차 평가자: {secondWeight}
- 입력·하위 화면: `searchTextField` TextField 빈칸="조직/직책/성명/구분", `firstWeight` LongField, `secondWeight` LongField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - parentFullName 200 "조직" Text
  - titleName 120 "직책" TextCenter
  - empKorName 100 "성명" TextCenter
  - orgHeadName 100 "구분" TextCenter
  - hireDate 100 "입사일" Date
  - transDate 100 "발령일" Date

#### 이벤트
[E1] firstWeight.ValueChange (L97) → 인라인 L97-102 (new ValueChangeHandler<Long>() { @Ove…)
[E2] secondWeight.ValueChange (L105) → 인라인 L105-110 (new ValueChangeHandler<Long>() { @Ove…)
[E3] searchTextField.KeyPress [Enter] (L113) → retrieve()
[E4] retrieveButton[조회].Select (L121) → retrieve()
[E5] insertButton[생성].Select (L127) → confirm()
[E6] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-92 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L155-168 | E3,E4,open | 서비스 emp.Emp00_TransInfo.selectByEvalText(companyId, searchText, transDate) | 업무 |
| public confirm() | L170-197 | E5 | 미선택 시 alert "1차 평가자 비중(%)을 입력해주세요" | 업무 |
| private settings() | L94-139 | open | 이벤트 연결, 초기값: firstWeight=50l, secondWeight=100l - firstWeight.getCurrentValue(, secondWeight=50l, firstWeight=100l - secondWeight.getCurrentValue( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L141-153 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L199-201 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L203-205 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('parentFullNm', 200, '조직'),  // L145
  gb.textCenter('titleNm', 120, '직책'),  // L146
  gb.textCenter('korNm', 100, '성명'),  // L147
  gb.textCenter('orgHeadNm', 100, '구분'),  // L148
  gb.date('hireDate', 100, '입사일'),  // L149
  gb.date('transDate', 100, '발령일'),  // L150
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={confirm}>생성</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Emp43_Edit_ChangeEval (`client/vi/emp/Emp43_Edit_ChangeEval.java`, 201줄)

- 입력·하위 화면: `firstPersonName` LookupTriggerField, `firstPersonId` LongField, `firstEvalWeight` LongField, `secondPersonName` LookupTriggerField, `secondPersonId` LongField, `secondEvalWeight` LongField, `lookup` Emp00_Lookup_SelectSingle

#### 이벤트
[E1] updateButton[변경].Select (L76) → update()
[E2] closeButton[닫기].Select (L82) → hide()
[E3] firstPersonName[1차 평가자].TriggerClick (L88) → changeEval()
[E4] secondPersonName[2차 평가자].TriggerClick (L94) → changeEval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-70 | 공개 메서드 | 상태 처리 | 업무 |
| private changeEval() | L102-128 | E3,E4 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private getEditor() | L130-147 | open | 상태 처리 | 업무 |
| private update() | L149-192 | E1 | 서비스 emp.Emp43_EvalTarget.updateEval(firstPersonId, firstEvalWeight, secondPersonId, secondEvalWeight, secondPersonId, secondEvalWeight) | 업무 |
| private settings() | L72-100 | open | 이벤트 연결, 초기값: firstEvalWeight=50l, secondEvalWeight=50l | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L194-196 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L198-200 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="change" onClick={update}>변경</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

