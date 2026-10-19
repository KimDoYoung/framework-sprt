# Pay40_Tab_TaxWithholding

- 종류: 화면
- 메뉴: 경영관리 > 04. 급여관리 > 갑근세확인서 발급 (#1364)
- 파일: `client/vi/pay/Pay40_Tab_TaxWithholding.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Pay40_Tab_TaxWithholding:257 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Pay40_Tab_TaxWithholding:161 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `pay.Pay40_IncomeTaxWithholding.delete` | Pay40_Tab_TaxWithholding:427 | [`Pay40_IncomeTaxWithholding.java:71`](../../pay/services/Pay40_IncomeTaxWithholding.md) | `UpdateDataModel(pay40_income_tax_withholding)` 동적 DELETE |
| `pay.Pay40_IncomeTaxWithholding.selectByCompanyId` | Pay40_Tab_TaxWithholding:326 | [`Pay40_IncomeTaxWithholding.java:26`](../../pay/services/Pay40_IncomeTaxWithholding.md) | [`pay40_income_tax_withholding.selectByCompanyId`](../../pay/sql/pay40_income_tax_withholding.md) |
| `pay.Pay40_IncomeTaxWithholding.updateApprId` | Pay40_Tab_TaxWithholding:441 | [`Pay40_IncomeTaxWithholding.java:35`](../../pay/services/Pay40_IncomeTaxWithholding.md) | [`pay40_income_tax_withholding.updateApprId`](../../pay/sql/pay40_income_tax_withholding.md) |
| `pay.Pay40_IncomeTaxWithholding.updateList` | Pay40_Tab_TaxWithholding:390 | [`Pay40_IncomeTaxWithholding.java:46`](../../pay/services/Pay40_IncomeTaxWithholding.md) | [`pay40_income_tax_withholding.insert`](../../pay/sql/pay40_income_tax_withholding.md), [`pay40_income_tax_withholding.selectById`](../../pay/sql/pay40_income_tax_withholding.md), `UpdateDataModel(pay40_income_tax_withholding)` 동적 INSERT/UPDATE → [`pay40_income_tax_withholding.selectById`](../../pay/sql/pay40_income_tax_withholding.md) |
| `sys.Sys99_Print.getIncomeTaxWithholding` | Pay40_Tab_TaxWithholding:222 | [`Sys99_Print.java:5283`](../../sys/services/Sys99_Print.md) | [`sys99_print.getIncomeTaxWithholding`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp02_others`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay10_month`](../../../db/tables/pay.md), [`pay11_month_item`](../../../db/tables/pay.md), [`pay40_income_tax_withholding`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay40_Tab_TaxWithholding (`client/vi/pay/Pay40_Tab_TaxWithholding.java`, 459줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준연도: {stdYearText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `stdYearText` TextField 빈칸="YYYY", `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `lookupEmpInfo` LookupTriggerField, `purUseComboBox` ComboBoxField("CertUseCode"), `editor` Apr01_Edit_ApprDoc, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "발급신청일" Date 편집:MyDateField
  - personName 100 "사원명" TextCenter 편집:lookupEmpInfo
  - purUseName 250 "용도" Text 편집:purUseComboBox
  - submitTo 250 "제출처" Text 편집:TextField
  - cnt 120 "소요수량(통)" Long 편집:LongField
  - issueNo 100 "발급번호" Long
  - actionCell 100 "결재요청" Cell 편집:actionCell1
  - statusName 100 "결재상태" TextCenter
  - actionCell 100 "상세보기" Cell 편집:actionCell2

#### 이벤트
[E0] 화면 열림 (생성자 L81-110) → settings(), defaultName(), retrieve()
[E1] stdYearText.KeyPress [Enter] (L117) → retrieve()
[E2] retrieveButton[조회].Select (L125) → retrieve()
[E3] insertButton[등록].Select (L131) → insertRow()
[E4] updateButton[저장].Select (L137) → update()
[E5] deleteButton[삭제].Select (L143) → delete()
       └ [E9] msgBox.DialogHide [YES] (L420) → 서비스 pay.Pay40_IncomeTaxWithholding.delete
[E6] classTreeFullName.TriggerClick (L152) → openLookupDoc()
[E7] lookupEmpInfo.TriggerClick (L184) → openLookupEmpInfo()
[E8] purUseComboBox[CertUseCode].Collapse (L191) → 인라인 L191-199 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L160-180 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private openLookupEmpInfo() | L294-306 | E7 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private openLookupDoc() | L309-318 | E6 | 상태 처리 | 업무 |
| public retrieve() | L320-336 | 생성자,E1,E2,update,updateApprId | 서비스 pay.Pay40_IncomeTaxWithholding.selectByCompanyId(companyId, stdYear) | 업무 |
| private insertRow() | L338-346 | E3 | 상태 처리 | 업무 |
| private update() | L348-401 | E4 | 서비스 pay.Pay40_IncomeTaxWithholding.updateList | 업무 |
| private delete() | L403-438 | E5 | 미선택 시 alert "삭제할 항목을 선택해주세요" → 확인창 E9 | 업무 |
| private updateApprId() | L440-454 | buildGrid | 서비스 pay.Pay40_IncomeTaxWithholding.updateApprId(incomeTaxWithholdingId, companyId, stdYear, apprId) | 업무 |
| private settings() | L112-158 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L182-292 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "저장 후 다시 시도해 주세요", 서비스 sys.Sys99_Print.getIncomeTaxWithholding, apr.Apr01_Appr.selectById(companyId, personId, incomeTaxWithholdingId, stdYear, apprId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L456-458 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '발급신청일', { editor: 'date' }),  // L282
  gb.textCenter('personNm', 100, '사원명'),  // L283 SQL 계산 컬럼(selectById: f_emp_kor_nm(pay40_person_id))
  gb.text('purUseNm', 250, '용도', { editor: 'select' }),  // L284 SQL 계산 컬럼(selectById: f_cdnm('CertUseCode', pay40_pur_use_cd,…)
  gb.text('submitTo', 250, '제출처', { editor: 'text' }),  // L285
  gb.long('cnt', 120, '소요수량(통)', { editor: 'number' }),  // L286
  gb.long('issueNo', 100, '발급번호'),  // L287
  // ⚠ 대응 없음 (GridBuilder L288) addCell
  gb.textCenter('statusNm', 100, '결재상태'),  // L289 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L290) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>

