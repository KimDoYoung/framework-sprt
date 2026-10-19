# Sch04_Tab_CheckList

- 종류: 화면
- 메뉴: 준법감시 > 90. 법규통제 현황(사용X) > 법규통제 상세내역 (#1017)
- 파일: `client/vi/sch/Sch04_Tab_CheckList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Ics01_Lookup_CheckList`](../../ics/components/Ics01_Lookup_CheckList.md), [`IcsComboBoxField`](../../ics/components/IcsComboBoxField.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sch04_Tab_CheckList:143 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `sch.Sch04_List.selectByCheckList` | Sch04_Tab_CheckList:313 | [`Sch04_List.java:113`](../../sch/services/Sch04_List.md) | [`sch04_list.selectByCheckList`](../../sch/sql/sch04_list.md) |
| `sch.Sch04_List.update` | Sch04_Tab_CheckList:323 | [`Sch04_List.java:462`](../../sch/services/Sch04_List.md) | `UpdateDataModel(sch04_list)` 동적 INSERT/UPDATE → [`sch04_list.selectById`](../../sch/sql/sch04_list.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr20_relate_ics`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics01_class_tree`](../../../db/tables/ics.md), [`ics03_company_info`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch03_deadline`](../../../db/tables/sch.md), [`sch04_list`](../../../db/tables/sch.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_appr_close_date`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_ics_manager`, `f_get_ics_nm`, `f_get_std_date`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sch04_Tab_CheckList (`client/vi/sch/Sch04_Tab_CheckList.java`, 337줄)

- 레이아웃: center=vlc01
- 툴바 `buttonBar01`: 조회기간: {startDate} ~: {endDate} 대분류: {level1Name} 중분류: {level2Name} {dailyCheckBox}
- 툴바 `buttonBar02`: 담당부서: {orgName} 담당자: {managerName} 처리여부: {statusComboBox} {confirmCheckBox} {searchButton} {updateButton}
- 입력·하위 화면: `statusComboBox` ComboBoxField("ScheduleStatusCode", "%", "전체"), `dailyCheckBox` CheckBox, `confirmCheckBox` CheckBox, `startDate` MyDateField, `endDate` MyDateField, `orgName` TextField, `managerName` TextField, `level1Name` IcsComboBoxField, `level2Name` LookupTriggerField, `editor` Apr01_Edit_ApprDoc, `lookupCheckList` Ics01_Lookup_CheckList
- 그리드 `grid` (buildGrid()):
  - closeDate 120 "처리기한" Date
  - title 500 "업무명" Text
  - orgName 150 "담당부서" Text
  - managerName 100 "담당자" Text
  - statusName 150 "처리상태" Text
  - manageDate 120 "처리일" Date
  - confirmNote 250 "비고" Text 편집:TextField
  - actionCell 100 "문서조회" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L77-131) → eventSetting(), setInitData()
[E1] searchButton[조회].Select (L181) → retrieve()
[E2] updateButton[저장].Select (L187) → update()
[E3] level2Name[전체].TriggerClick (L194) → lookupIcsCode()
[E4] level1Name[전체].ValueChange (L200) → 인라인 L200-206 (new ValueChangeHandler<String>() { @O…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L57-59 | buildGrid,lookupIcsCode,retrieve | 상태 처리 | 업무 |
| private eventSetting() | L180-223 | 생성자 | 상태 처리 | 업무 |
| private setInitData() | L225-235 | 생성자 | 상태 처리 | 업무 |
| public lookupIcsCode() | L237-252 | E3 | 조회창 Ics01_Lookup_CheckList 열기 | 업무 |
| public retrieveCall() | L254-268 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L270-319 | E1,execute,retrieveCall | 서비스 sch.Sch04_List.selectByCheckList(companyId, managerName, orgName, startDate, endDate, statusCode, level1Name, level2Name, dailyYn, confirmYn) | 업무 |
| private update() | L321-324 | E2 | 서비스 sch.Sch04_List.update | 업무 |
| public retrieveTabPanel() | L334-336 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L133-178 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "해당 리스트는 문서정보가 없습니다", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L326-328 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L330-332 | eventSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 120, '처리기한'),  // L167
  gb.text('title', 500, '업무명'),  // L168
  gb.text('orgNm', 150, '담당부서'),  // L169
  gb.text('managerNm', 100, '담당자'),  // L170
  gb.text('statusNm', 150, '처리상태'),  // L171
  gb.date('manageDate', 120, '처리일'),  // L172
  gb.text('confirmNote', 250, '비고', { editor: 'text' }),  // L174
  // ⚠ 대응 없음 (GridBuilder L175) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

