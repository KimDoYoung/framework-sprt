# Ics31_Tab_ComplianceReport

- 종류: 화면
- 메뉴: 준법감시 > 20. 임직원 내부통제 준수 > 내부통제 준수보고(준감인) (#1312)
- 파일: `client/vi/ics/Ics31_Tab_ComplianceReport.java`
- 함께 쓰는 클래스 1개:
  - `Ics31_Rd_ComplianceReport` `client/vi/ics/Ics31_Rd_ComplianceReport.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Ics31_Tab_ComplianceReport:215 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ics31_Tab_ComplianceReport:356 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `ics.Ics32_RelateAppr.insert` | Ics31_Tab_ComplianceReport:252 | [`Ics32_RelateAppr.java:48`](../../ics/services/Ics32_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics32_relate_appr.insert`](../../ics/sql/ics32_relate_appr.md), [`ics32_relate_appr.selectByCompanyId`](../../ics/sql/ics32_relate_appr.md) |
| `ics.Ics32_RelateAppr.selectByCompanyId` | Ics31_Tab_ComplianceReport:460 | [`Ics32_RelateAppr.java:25`](../../ics/services/Ics32_RelateAppr.md) | [`ics32_relate_appr.selectByCompanyId`](../../ics/sql/ics32_relate_appr.md) |
| `ics.Ics32_RelateAppr.updateApprId` | Ics31_Tab_ComplianceReport:329 | [`Ics32_RelateAppr.java:77`](../../ics/services/Ics32_RelateAppr.md) | [`ics32_relate_appr.updateApprId`](../../ics/sql/ics32_relate_appr.md) |
| `sys.Sys01_Company.selectById` | Ics31_Tab_ComplianceReport:130 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys10_File.getServerPath` | Ics31_Tab_ComplianceReport:523 | [`Sys10_File.java:231`](../../sys/services/Sys10_File.md) | [`sys01_company.selectById`](../../sys/sql/sys01_company.md) |
| `sys.Sys99_Print.insertComplianceState` | Ics31_Tab_ComplianceReport:437, Ics31_Tab_ComplianceReport:512 | [`Sys99_Print.java:324`](../../sys/services/Sys99_Print.md) | [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp03_trans.getRetireDate`](../../emp/sql/emp03_trans.md), [`emp03_trans.selectInOffice`](../../emp/sql/emp03_trans.md), [`ics30_compliance.selectComplianceResultByPersonId`](../../ics/sql/ics30_compliance.md), [`ics31_compliance_write.checkWriteByPersonId`](../../ics/sql/ics31_compliance_write.md), [`ics31_compliance_write.selectNonComplianceReason`](../../ics/sql/ics31_compliance_write.md), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp33_except_biz`](../../../db/tables/emp.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`ics32_relate_appr`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_code_seq`, `f_get_compliance_result`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ics31_Tab_ComplianceReport (`client/vi/ics/Ics31_Tab_ComplianceReport.java`, 623줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 기준 분기(월): {yyyyText} {periodComboBox} {retrieveButton} {rdFileCreateForm}
- 입력·하위 화면: `periodComboBox` ComboBoxField("MonthsCode"), `yyyyText` TextField, `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L86-127) → settings()
[E1] yyyyText.ValueChange (L154) → 인라인 L154-160 (new ValueChangeHandler<String>() { @O…)
[E2] periodComboBox[MonthsCode].ValueChange (L164) → 인라인 L164-170 (new ValueChangeHandler<String>() { @O…)
[E3] periodComboBox[MonthsCode].Collapse (L172) → retrieve()
[E4] retrieveButton[조회].Select (L179) → retrieve()
[E5] classTreeFullName[문서분류].TriggerClick (L190) → openLookupDoc()
[E6] apprButton[상신].Select [apprStepCode == null] (L196) → createRd()
[E7] apprViewButton[문서보기].Select (L212) → defaultApprName()
[E8] rdFileCreateForm.SubmitComplete (L238) → insertRelateApprId()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private insertRelateApprId() | L249-266 | E8,createRd | 서비스 ics.Ics32_RelateAppr.insert(companyId, yyyymm, cycleType) | 업무 |
| private insertLinkApproval() | L304-326 | insertRelateApprId | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L328-341 | insertLinkApproval | 서비스 ics.Ics32_RelateAppr.updateApprId | 업무 |
| private openLookupDoc() | L344-353 | E5 | 상태 처리 | 업무 |
| private defaultName() | L355-375 | settings | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| protected enable() | L377-425 | settings | 상태 처리 | 업무 |
| public retrieve() | L427-457 | E3,E4 | 서비스 sys.Sys99_Print.insertComplianceState(companyId, personId, stdDate, cycleType, exceptBizCode, windowClassName) | 업무 |
| private defaultApprName() | L459-506 | E7,updateApprId,retrieve | 서비스 ics.Ics32_RelateAppr.selectByCompanyId(companyId, yyyymm, cycleType) | 업무 |
| private createRd() | L508-578 | E6 | 서비스 sys.Sys99_Print.insertComplianceState, sys.Sys10_File.getServerPath(companyId, personId, stdDate, cycleType, windowClassName, companyId) | 업무 |
| private MASK() | L580-586 | insertRelateApprId,insertLinkApproval,retrieve,createRd | 상태 처리 | 업무 |
| private getDate() | L588-609 | insertRelateApprId,retrieve,defaultApprName,createRd | 상태 처리 | 업무 |
| private settings() | L129-246 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 sys.Sys01_Company.selectById, apr.Apr01_Appr.selectById(companyId), 이벤트 연결, 초기값: yyyyText=startYear | UI구성 (이벤트 절로 대체) |
| public setHtmlGridStyle() | L611-614 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L616-618 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L620-622 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={createRd}>상신</Button>
3. <Button type="search" onClick={defaultApprName}>문서보기</Button>

### Ics31_Rd_ComplianceReport (`client/vi/ics/Ics31_Rd_ComplianceReport.java`, 65줄)


#### 이벤트
[E0] 화면 열림 (생성자 L23-25) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L27-64 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

