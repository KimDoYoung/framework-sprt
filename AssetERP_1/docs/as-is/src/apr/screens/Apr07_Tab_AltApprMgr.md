# Apr07_Tab_AltApprMgr

- 종류: 화면
- 메뉴: 관리자 > 04. 전자결재 > 대결자 지정(관리자) (#1022)
- 파일: `client/vi/apr/Apr07_Tab_AltApprMgr.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr07_AltAppr.delete` | Apr07_Tab_AltApprMgr:371 | [`Apr07_AltAppr.java:153`](../../apr/services/Apr07_AltAppr.md) | `UpdateDataModel(apr07_alt_appr)` 동적 DELETE |
| `apr.Apr07_AltAppr.notAltApprIdList` | Apr07_Tab_AltApprMgr:282 | [`Apr07_AltAppr.java:56`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.notAltApprIdList`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr07_AltAppr.selectByText` | Apr07_Tab_AltApprMgr:229 | [`Apr07_AltAppr.java:24`](../../apr/services/Apr07_AltAppr.md) | [`apr07_alt_appr.selectByText`](../../apr/sql/apr07_alt_appr.md) |
| `apr.Apr07_AltAppr.update` | Apr07_Tab_AltApprMgr:336 | [`Apr07_AltAppr.java:148`](../../apr/services/Apr07_AltAppr.md) | `UpdateDataModel(apr07_alt_appr)` 동적 INSERT/UPDATE → [`apr07_alt_appr.selectById`](../../apr/sql/apr07_alt_appr.md) |

## 테이블

[`apr07_alt_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md)

## DB 함수

`f_get_emptrans`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Apr07_Tab_AltApprMgr (`client/vi/apr/Apr07_Tab_AltApprMgr.java`, 381줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 등록기간: {startDate} {endDate} 원결재자: {searchText} {retrieveButton} {deleteButton} {insertRowButton} {saveButton}
- 입력·하위 화면: `startDate` MyDateField, `endDate` MyDateField, `searchText` TextField, `lookupEmpInfo1` LookupTriggerField, `lookupEmpInfo2` LookupTriggerField, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - targetEmpName 90 "성명" Text 편집:lookupEmpInfo1
  - targetEmpNo 50 "사번" Text
  - targetOrgName 150 "부서" Text
  - targetTitleName 90 "직책" Text
  - altEmpName 90 "성명" Text 편집:"0069B4"
  - altEmpNo 50 "사번" Text 편집:"0069B4"
  - altOrgName 150 "부서" Text 편집:"0069B4"
  - altTitleName 90 "직책" Text 편집:"0069B4"
  - startDate 100 "시작일" Date 편집:MyDateField
  - closeDate 100 "종료일" Date 편집:MyDateField
  - stampYn 120 "인감날인은<br>(부)책임자가 대리" Boolean
  - reasonCd 250 "대결사유" Text 편집:TextField
  - emgrPoint 120 "본인비상연락망" Text 편집:TextField
  - note 200 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L70-98) → settings(), getCenterLayout()
[E1] retrieveButton[조회].Select (L109) → retrieve()
[E2] deleteButton[삭제].Select (L115) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L351) → delete()
[E3] insertRowButton[등록].Select (L121) → insertRow()
[E4] saveButton[저장].Select (L127) → update()
[E5] searchText.KeyPress [Enter] (L133) → retrieve()
[E6] lookupEmpInfo1.TriggerClick (L146) → openLookupEmpInfo()
[E7] lookupEmpInfo2.TriggerClick (L154) → openLookupEmpInfo()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private getCenterLayout() | L182-193 | 생성자 | 상태 처리 | 업무 |
| private openLookupEmpInfo() | L195-220 | E6,E7 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private retrieve() | L222-235 | E1,E5 | 서비스 apr.Apr07_AltAppr.selectByText(companyId, empId, startDate, endDate, searchText) | 업무 |
| private insertRow() | L237-246 | E3 | 상태 처리 | 업무 |
| private update() | L248-332 | E4 | 서비스 apr.Apr07_AltAppr.notAltApprIdList(empId, companyId, altApprIdList) | 업무 |
| private updateFinal() | L334-346 | update | 서비스 apr.Apr07_AltAppr.update | 업무 |
| private deleteChk() | L348-366 | E2 | ConfirmBox → E8 | 업무 |
| private delete() | L368-372 | E8 | GridDeleteData apr.Apr07_AltAppr.delete(체크된 행 목록) | 업무 |
| private settings() | L100-141 | 생성자 | 이벤트 연결, 초기값: startDate=start, endDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L143-180 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L374-376 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlGridStyle() | L378-380 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L162 newHeaderGroupMap02newHeaderGroupConfig14 100 "원결재자" (apr07_new_header_group_map02new_header_group_config14 컬럼 없음)
  // ⚠DB없음 L163 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle14 100 "대결자" (apr07_new_header_group_map06new_header_group_configset_html_grid_style14 컬럼 없음)
  gb.text('targetEmpNm', 90, '성명'),  // L164 SQL 계산 컬럼(selectByText: tgt.emp01_kor_nm)
  gb.text('targetEmpNo', 50, '사번'),  // L165 SQL 계산 컬럼(selectByText: tgt.emp01_emp_no)
  gb.text('targetOrgNm', 150, '부서'),  // L166 SQL 계산 컬럼(selectByText: f_get_empTrans(tgt.emp01_person_id, apr…)
  gb.text('targetTitleNm', 90, '직책'),  // L167 SQL 계산 컬럼(selectByText: f_get_empTrans(tgt.emp01_person_id, apr…)
  gb.text('altEmpNm', 90, '성명'),  // L168 SQL 계산 컬럼(selectByText: org.emp01_kor_nm)
  gb.text('altEmpNo', 50, '사번'),  // L169 SQL 계산 컬럼(selectByText: org.emp01_emp_no)
  gb.text('altOrgNm', 150, '부서'),  // L170 SQL 계산 컬럼(selectByText: f_get_empTrans(org.emp01_person_id, apr…)
  gb.text('altTitleNm', 90, '직책'),  // L171 SQL 계산 컬럼(selectByText: f_get_empTrans(org.emp01_person_id, apr…)
  gb.date('startDate', 100, '시작일', { editor: 'date' }),  // L172
  gb.date('closeDate', 100, '종료일', { editor: 'date' }),  // L173
  gb.boolean('stampYn', 120, '인감날인은<br>(부)책임자가 대리'),  // L174
  gb.text('reasonCd', 250, '대결사유', { editor: 'text' }),  // L175
  gb.text('emgrPoint', 120, '본인비상연락망', { editor: 'text' }),  // L176
  gb.text('note', 200, '비고', { editor: 'text' }),  // L177
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="delete" onClick={deleteChk}>삭제</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>

