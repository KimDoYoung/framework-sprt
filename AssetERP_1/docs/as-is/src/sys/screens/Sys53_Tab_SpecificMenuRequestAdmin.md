# Sys53_Tab_SpecificMenuRequestAdmin

- 종류: 화면
- 메뉴: 관리자 > 01. 고객관리 > 고객별 특정화면 관리 (#1410)
- 파일: `client/vi/sys/Sys53_Tab_SpecificMenuRequestAdmin.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Sys53_Tab_SpecificMenuRequestAdmin:125 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `sys.Sys00_Common.selectCompanyName` | Sys53_Tab_SpecificMenuRequestAdmin:51 | [`Sys00_Common.java:41`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectCompanyName`](../../sys/sql/sys00_common.md) |
| `sys.Sys53_SpecificMenuRequest.selectByTextAdmin` | Sys53_Tab_SpecificMenuRequestAdmin:190 | [`Sys53_SpecificMenuRequest.java:33`](../../sys/services/Sys53_SpecificMenuRequest.md) | [`sys53_specific_menu_request.selectByTextAdmin`](../../sys/sql/sys53_specific_menu_request.md) |
| `sys.Sys53_SpecificMenuRequest.update` | Sys53_Tab_SpecificMenuRequestAdmin:200 | [`Sys53_SpecificMenuRequest.java:43`](../../sys/services/Sys53_SpecificMenuRequest.md) | `UpdateDataModel(sys53_specific_menu_request)` 동적 INSERT/UPDATE → [`sys53_specific_menu_request.selectById`](../../sys/sql/sys53_specific_menu_request.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys53_specific_menu_request`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys53_Tab_SpecificMenuRequestAdmin (`client/vi/sys/Sys53_Tab_SpecificMenuRequestAdmin.java`, 206줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 고객사: {companyName} 구분: {specificStateComboBoxField} 특정업무구분: {specificWorkComboBoxField} {retrieveButton} {updateButton}
- 입력·하위 화면: `companyName` CommonComboBoxField("sys.Sys00_Common.selectCompanyName", "%", "전체"), `specificStateComboBoxField` ComboBoxField("SpecificStateCode", "%", "전체"), `specificWorkComboBoxField` ComboBoxField("SpecificWorkCode", "%", "전체"), `editor` Apr01_Edit_ApprDoc, `stateComboBox` ComboBoxField("SpecificStateCode")
- 그리드 `grid` (buildGrid(), 체크박스):
  - companyName 240 "회사명" Text
  - regDate 100 "신청일" Date
  - personName 200 "신청자" Text
  - specificWorkName 120 "특정업무" Text
  - actionCell 80 "문서보기" Cell 편집:actionCell
  - aprStatusName 100 "문서상태" TextStatus
  - confirmName 200 "처리자" Text 편집:TextField
  - confirmDate 100 "처리일" Date 편집:MyDateField
  - stateName 100 "처리상태" TextStatus 편집:stateComboBox

#### 이벤트
[E0] 화면 열림 (생성자 L56-75) → settings(), retrieve()
[E1] companyName[sys.Sys00_Common.selectCompanyName].Collapse (L99) → retrieve()
[E2] retrieveButton[조회].Select (L105) → retrieve()
[E3] updateButton[저장].Select (L111) → update()
[E4] stateComboBox[SpecificStateCode].Collapse (L153) → 인라인 L153-160 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L175-196 | 생성자,E1,E2 | 서비스 sys.Sys53_SpecificMenuRequest.selectByTextAdmin(companyId, stateCode, specificWorkCode) | 업무 |
| private update() | L198-201 | E3 | 서비스 sys.Sys53_SpecificMenuRequest.update | 업무 |
| private settings() | L77-117 | 생성자 | 이벤트 연결, 초기값: companyName="전체"("sys.Sys00_Common.selectCompanyName") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L119-173 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L203-205 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('companyNm', 240, '회사명'),  // L163 SQL 계산 컬럼(selectById: sys01_company_nm)
  gb.date('regDate', 100, '신청일'),  // L164
  gb.text('personNm', 200, '신청자'),  // L165 SQL 계산 컬럼(selectById: f_get_empTrans(sys53_person_id, f_sysda…)
  gb.text('specificWorkNm', 120, '특정업무'),  // L166 SQL 계산 컬럼(selectById: f_cdnm('SpecificWorkCode', sys53_specif…)
  // ⚠ 대응 없음 (GridBuilder L167) addCell
  gb.textStatus('aprStatusNm', 100, '문서상태'),  // L168 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  gb.text('confirmNm', 200, '처리자', { editor: 'text' }),  // L169
  gb.date('confirmDate', 100, '처리일', { editor: 'date' }),  // L170
  gb.textStatus('stateNm', 100, '처리상태', { editor: 'select' }),  // L171 SQL 계산 컬럼(selectById: f_cdnm('SpecificStateCode', sys53_state…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>

