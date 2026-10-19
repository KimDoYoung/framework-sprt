# Sys53_Tab_SpecificMenuRequest

- 종류: 화면
- 메뉴: 관리자 > 01. 화면권한관리 > 특정화면 사용요청 (#1409)
- 파일: `client/vi/sys/Sys53_Tab_SpecificMenuRequest.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sys53_Tab_SpecificMenuRequest:147 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Sys53_Tab_SpecificMenuRequest:186 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys53_SpecificMenuRequest.delete` | Sys53_Tab_SpecificMenuRequest:331 | [`Sys53_SpecificMenuRequest.java:48`](../../sys/services/Sys53_SpecificMenuRequest.md) | `UpdateDataModel(sys53_specific_menu_request)` 동적 DELETE |
| `sys.Sys53_SpecificMenuRequest.selectByText` | Sys53_Tab_SpecificMenuRequest:258 | [`Sys53_SpecificMenuRequest.java:23`](../../sys/services/Sys53_SpecificMenuRequest.md) | [`sys53_specific_menu_request.selectByText`](../../sys/sql/sys53_specific_menu_request.md) |
| `sys.Sys53_SpecificMenuRequest.update` | Sys53_Tab_SpecificMenuRequest:237 | [`Sys53_SpecificMenuRequest.java:43`](../../sys/services/Sys53_SpecificMenuRequest.md) | `UpdateDataModel(sys53_specific_menu_request)` 동적 INSERT/UPDATE → [`sys53_specific_menu_request.selectById`](../../sys/sql/sys53_specific_menu_request.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys53_specific_menu_request`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys53_Tab_SpecificMenuRequest (`client/vi/sys/Sys53_Tab_SpecificMenuRequest.java`, 342줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 구분: {specificStateComboBoxField} 특정업무구분: {specificWorkComboBoxField} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `specificStateComboBoxField` ComboBoxField("SpecificStateCode", "%", "전체"), `specificWorkComboBoxField` ComboBoxField("SpecificWorkCode", "%", "전체"), `specificWorkComboBox` ComboBoxField("SpecificWorkCode"), `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "신청일" Date
  - personName 200 "신청자" Text
  - specificWorkName 120 "특정업무" Text 편집:specificWorkComboBox
  - actionCell 80 "결재요청" Cell 편집:actionCell
  - aprStatusName 100 "문서상태" TextStatus
  - confirmName 200 "처리담당자" Text
  - stateName 100 "처리상태" TextStatus

#### 이벤트
[E0] 화면 열림 (생성자 L67-95) → settings(), retrieve()
[E1] retrieveButton[조회].Select (L103) → retrieve()
[E2] insertButton[등록].Select (L109) → insertRow()
[E3] updateButton[저장].Select (L115) → update()
[E4] deleteButton[삭제].Select (L121) → deleteChk()
       └ [E6] messageBox.DialogHide (L311) → deleteRow()
[E5] specificWorkComboBox[SpecificWorkCode].Collapse (L131) → 인라인 L131-138 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private checkdcr() | L185-217 | buildGrid | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L219-230 | checkdcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L232-249 | insertLinkApproval | 서비스 sys.Sys53_SpecificMenuRequest.update | 업무 |
| private retrieve() | L251-264 | 생성자,E1,updateApprId | 서비스 sys.Sys53_SpecificMenuRequest.selectByText(companyId, stateCode, specificWorkCode) | 업무 |
| private insertRow() | L266-274 | E2 | 상태 처리 | 업무 |
| private update() | L276-295 | E3 | 서비스 sys.Sys53_SpecificMenuRequest.update | 업무 |
| private deleteChk() | L297-326 | E4 | 미선택 시 alert "내용을 선택해주세요" → 확인창 E6 | 업무 |
| private deleteRow() | L328-337 | E6 | GridDeleteData sys.Sys53_SpecificMenuRequest.delete(체크된 행 목록) | 업무 |
| private settings() | L97-127 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L129-183 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "저장 후에 결재요청을 진행해주세요", 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L339-341 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '신청일'),  // L175
  gb.text('personNm', 200, '신청자'),  // L176 SQL 계산 컬럼(selectById: f_get_empTrans(sys53_person_id, f_sysda…)
  gb.text('specificWorkNm', 120, '특정업무', { editor: 'select' }),  // L177 SQL 계산 컬럼(selectById: f_cdnm('SpecificWorkCode', sys53_specif…)
  // ⚠ 대응 없음 (GridBuilder L178) addCell
  gb.textStatus('aprStatusNm', 100, '문서상태'),  // L179 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  gb.text('confirmNm', 200, '처리담당자'),  // L180
  gb.textStatus('stateNm', 100, '처리상태'),  // L181 SQL 계산 컬럼(selectById: f_cdnm('SpecificStateCode', sys53_state…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteChk}>삭제</Button>

