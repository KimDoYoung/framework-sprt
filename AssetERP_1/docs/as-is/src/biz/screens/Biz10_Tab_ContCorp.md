# Biz10_Tab_ContCorp

- 종류: 화면
- 메뉴: KFS > 10. ICAM 계약사관리 > ICAM 계약사 관리 (#1209)
- 파일: `client/vi/biz/Biz10_Tab_ContCorp.java`
- 함께 쓰는 클래스 10개:
  - `Biz17_TabPage_DualManageFund` `client/vi/biz/Biz17_TabPage_DualManageFund.java`
  - `Biz17_Lookup_HoldFee` `client/vi/biz/Biz17_Lookup_HoldFee.java`
  - `Biz16_TabPage_EachCont` `client/vi/biz/Biz16_TabPage_EachCont.java`
  - `Biz13_TabPage_WithCorp` `client/vi/biz/Biz13_TabPage_WithCorp.java`
  - `Biz11_TabPage_ContHistory` `client/vi/biz/Biz11_TabPage_ContHistory.java`
  - `Biz14_Lookup_RelateAppr` `client/vi/biz/Biz14_Lookup_RelateAppr.java`
  - `Biz11_Lookup_FileList` `client/vi/biz/Biz11_Lookup_FileList.java`
  - `Biz11_PDFViewer` `client/vi/biz/Biz11_PDFViewer.java`
  - `Biz11_Edit_ContHistory` `client/vi/biz/Biz11_Edit_ContHistory.java`
  - `Biz12_Edit_FeeInfo` `client/vi/biz/Biz12_Edit_FeeInfo.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Org00_Lookup_SelectSingle`](../../org/components/Org00_Lookup_SelectSingle.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md), [`Sys15_Lookup_Corp_OnlyKFS`](../../sys/components/Sys15_Lookup_Corp_OnlyKFS.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz14_Lookup_RelateAppr:186, Biz16_TabPage_EachCont:293 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `ast.Ast30_BookFundFee.selectByContCorpId` | Biz17_Lookup_HoldFee:159 | [`Ast30_BookFundFee.java:60`](../../ast/services/Ast30_BookFundFee.md) | [`ast30_book_fund_fee.selectByContCorpId`](../../ast/sql/ast30_book_fund_fee.md) |
| `biz.Biz10_ContCorp.delete` | Biz10_Tab_ContCorp:405 | [`Biz10_ContCorp.java:114`](../../biz/services/Biz10_ContCorp.md) | `UpdateDataModel(biz10_cont_corp)` 동적 DELETE |
| `biz.Biz10_ContCorp.insertUpdate` | Biz11_Edit_ContHistory:591, Biz11_TabPage_ContHistory:275 | [`Biz10_ContCorp.java:59`](../../biz/services/Biz10_ContCorp.md) | [`biz15_share.insertUpdate`](../../biz/sql/biz15_share.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz10_cont_corp)` 동적 INSERT/UPDATE → [`biz10_cont_corp.selectById`](../../biz/sql/biz10_cont_corp.md), `UpdateDataModel(biz11_cont_history)` 동적 INSERT/UPDATE → [`biz11_cont_history.selectById`](../../biz/sql/biz11_cont_history.md), `UpdateDataModel(biz12_fee_info)` 동적 INSERT/UPDATE → [`biz12_fee_info.selectById`](../../biz/sql/biz12_fee_info.md) |
| `biz.Biz10_ContCorp.selectById` | Biz11_TabPage_ContHistory:171, Biz13_TabPage_WithCorp:206, Biz16_TabPage_EachCont:258, Biz17_TabPage_DualManageFund:167 | [`Biz10_ContCorp.java:21`](../../biz/services/Biz10_ContCorp.md) | [`biz10_cont_corp.selectById`](../../biz/sql/biz10_cont_corp.md) |
| `biz.Biz10_ContCorp.selectByText` | Biz10_Tab_ContCorp:342 | [`Biz10_ContCorp.java:27`](../../biz/services/Biz10_ContCorp.md) | [`biz10_cont_corp.selectByText`](../../biz/sql/biz10_cont_corp.md) |
| `biz.Biz11_ContHistory.delete` | Biz11_TabPage_ContHistory:245 | [`Biz11_ContHistory.java:77`](../../biz/services/Biz11_ContHistory.md) | `UpdateDataModel(biz11_cont_history)` 동적 DELETE |
| `biz.Biz11_ContHistory.deleteCheck` | Biz11_TabPage_ContHistory:220 | [`Biz11_ContHistory.java:35`](../../biz/services/Biz11_ContHistory.md) | [`biz11_cont_history.deleteCheck`](../../biz/sql/biz11_cont_history.md) |
| `biz.Biz11_ContHistory.deleteContCorpId` | Biz10_Tab_ContCorp:396 | [`Biz11_ContHistory.java:51`](../../biz/services/Biz11_ContHistory.md) | [`biz11_cont_history.deleteContCorpId`](../../biz/sql/biz11_cont_history.md), [`biz12_fee_info.deleteContCorpId`](../../biz/sql/biz12_fee_info.md), [`biz13_with_corp.deleteContCorpId`](../../biz/sql/biz13_with_corp.md), [`biz14_relate_appr.deleteContCorpId`](../../biz/sql/biz14_relate_appr.md), [`biz15_share.deleteContCorpId`](../../biz/sql/biz15_share.md) |
| `biz.Biz11_ContHistory.selectByContCorpId` | Biz11_TabPage_ContHistory:154 | [`Biz11_ContHistory.java:25`](../../biz/services/Biz11_ContHistory.md) | [`biz11_cont_history.selectByContCorpId`](../../biz/sql/biz11_cont_history.md) |
| `biz.Biz11_ContHistory.update` | Biz11_TabPage_ContHistory:160 | [`Biz11_ContHistory.java:72`](../../biz/services/Biz11_ContHistory.md) | `UpdateDataModel(biz11_cont_history)` 동적 INSERT/UPDATE → [`biz11_cont_history.selectById`](../../biz/sql/biz11_cont_history.md) |
| `biz.Biz12_FeeInfo.modelUpdate` | Biz12_Edit_FeeInfo:267 | [`Biz12_FeeInfo.java:23`](../../biz/services/Biz12_FeeInfo.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz12_fee_info)` 동적 INSERT/UPDATE → [`biz12_fee_info.selectById`](../../biz/sql/biz12_fee_info.md) |
| `biz.Biz13_WithCorp.delete` | Biz13_TabPage_WithCorp:274 | [`Biz13_WithCorp.java:77`](../../biz/services/Biz13_WithCorp.md) | `UpdateDataModel(biz13_with_corp)` 동적 DELETE |
| `biz.Biz13_WithCorp.selectByHistoryContCorpId` | Biz13_TabPage_WithCorp:174 | [`Biz13_WithCorp.java:40`](../../biz/services/Biz13_WithCorp.md) | [`biz13_with_corp.selectByHistoryContCorpId`](../../biz/sql/biz13_with_corp.md) |
| `biz.Biz13_WithCorp.update` | Biz13_TabPage_WithCorp:194 | [`Biz13_WithCorp.java:72`](../../biz/services/Biz13_WithCorp.md) | `UpdateDataModel(biz13_with_corp)` 동적 INSERT/UPDATE → [`biz13_with_corp.selectById`](../../biz/sql/biz13_with_corp.md) |
| `biz.Biz14_RelateAppr.delete` | Biz14_Lookup_RelateAppr:290 | [`Biz14_RelateAppr.java:47`](../../biz/services/Biz14_RelateAppr.md) | `UpdateDataModel(biz14_relate_appr)` 동적 DELETE |
| `biz.Biz14_RelateAppr.modelUpdate` | Biz14_Lookup_RelateAppr:241, Biz14_Lookup_RelateAppr:272 | [`Biz14_RelateAppr.java:29`](../../biz/services/Biz14_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz14_relate_appr)` 동적 INSERT/UPDATE → [`biz14_relate_appr.selectById`](../../biz/sql/biz14_relate_appr.md) |
| `biz.Biz14_RelateAppr.selectByContHistoryId` | Biz14_Lookup_RelateAppr:259 | [`Biz14_RelateAppr.java:23`](../../biz/services/Biz14_RelateAppr.md) | [`biz14_relate_appr.selectByContHistoryId`](../../biz/sql/biz14_relate_appr.md) |
| `biz.Biz15_Share.delete` | Biz11_Edit_ContHistory:562 | [`Biz15_Share.java:49`](../../biz/services/Biz15_Share.md) | `UpdateDataModel(biz15_share)` 동적 DELETE |
| `biz.Biz15_Share.insert` | Biz11_Edit_ContHistory:208 | [`Biz15_Share.java:35`](../../biz/services/Biz15_Share.md) | [`biz15_share.insert`](../../biz/sql/biz15_share.md) |
| `biz.Biz15_Share.selectByContHistoryId` | Biz11_Edit_ContHistory:481 | [`Biz15_Share.java:25`](../../biz/services/Biz15_Share.md) | [`biz15_share.selectByContHistoryId`](../../biz/sql/biz15_share.md) |
| `biz.Biz15_Share.update` | Biz11_Edit_ContHistory:559 | [`Biz15_Share.java:44`](../../biz/services/Biz15_Share.md) | `UpdateDataModel(biz15_share)` 동적 INSERT/UPDATE → [`biz15_share.selectById`](../../biz/sql/biz15_share.md) |
| `biz.Biz16_EachCont.delete` | Biz16_TabPage_EachCont:420 | [`Biz16_EachCont.java:68`](../../biz/services/Biz16_EachCont.md) | `UpdateDataModel(biz16_each_contract)` 동적 DELETE |
| `biz.Biz16_EachCont.selectByContCorpId` | Biz16_TabPage_EachCont:104 | [`Biz16_EachCont.java:34`](../../biz/services/Biz16_EachCont.md) | [`biz16_each_contract.selectByContCorpId`](../../biz/sql/biz16_each_contract.md) |
| `biz.Biz16_EachCont.selectByCorpId` | Biz16_TabPage_EachCont:164 | [`Biz16_EachCont.java:25`](../../biz/services/Biz16_EachCont.md) | [`biz16_each_contract.selectByCorpId`](../../biz/sql/biz16_each_contract.md) |
| `biz.Biz16_EachCont.update` | Biz16_TabPage_EachCont:247 | [`Biz16_EachCont.java:63`](../../biz/services/Biz16_EachCont.md) | `UpdateDataModel(biz16_each_contract)` 동적 INSERT/UPDATE → [`biz16_each_contract.selectById`](../../biz/sql/biz16_each_contract.md) |
| `biz.Biz16_EachCont.updateApprId` | Biz16_TabPage_EachCont:376 | [`Biz16_EachCont.java:43`](../../biz/services/Biz16_EachCont.md) | [`biz16_each_contract.updateApprId`](../../biz/sql/biz16_each_contract.md) |
| `biz.Biz17_DualManageFund.delete` | Biz17_TabPage_DualManageFund:219 | [`Biz17_DualManageFund.java:39`](../../biz/services/Biz17_DualManageFund.md) | `UpdateDataModel(biz17_dual_manage_fund)` 동적 DELETE |
| `biz.Biz17_DualManageFund.selectByContCorpId` | Biz17_TabPage_DualManageFund:135 | [`Biz17_DualManageFund.java:25`](../../biz/services/Biz17_DualManageFund.md) | [`biz17_dual_manage_fund.selectByContCorpId`](../../biz/sql/biz17_dual_manage_fund.md) |
| `biz.Biz17_DualManageFund.update` | Biz17_TabPage_DualManageFund:155 | [`Biz17_DualManageFund.java:34`](../../biz/services/Biz17_DualManageFund.md) | `UpdateDataModel(biz17_dual_manage_fund)` 동적 INSERT/UPDATE → [`biz17_dual_manage_fund.selectById`](../../biz/sql/biz17_dual_manage_fund.md) |
| `dcr.Dcr01_ClassTree.selectById` | Biz14_Lookup_RelateAppr:90 | [`Dcr01_ClassTree.java:27`](../../dcr/services/Dcr01_ClassTree.md) | [`dcr01_class_tree.selectById`](../../dcr/sql/dcr01_class_tree.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Biz16_TabPage_EachCont:322 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `getSeq` | Biz11_Edit_ContHistory:171, Biz11_Edit_ContHistory:198 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys00_Common.selectByKindGroupCode` | Biz11_Edit_ContHistory:196 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Biz11_Lookup_FileList:225 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Biz11_Lookup_FileList:268 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr30_appr_step_group`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ast30_book_fund_fee`](../../../db/tables/ast.md), [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz14_relate_appr`](../../../db/tables/biz.md), [`biz15_share`](../../../db/tables/biz.md), [`biz16_each_contract`](../../../db/tables/biz.md), [`biz17_dual_manage_fund`](../../../db/tables/biz.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz10_Tab_ContCorp (`client/vi/biz/Biz10_Tab_ContCorp.java`, 432줄)

- 레이아웃: center=vlc, south=cp
- 툴바 `buttonBar`: {radio1} 전체: {radio2} 계약년도: {yearText} 계약상태: {statusName} {statusCheckBox} 검색: {searchText} 거래종료: {monthText} (개월 전): {retrieveButton} {insertButton} {deleteButton} {downLoadButton}
- 입력·하위 화면: `searchText` TextField 빈칸="계약사명/계약형태/비고", `yearText` TextField, `monthText` TextField 빈칸="전체", `statusName` ComboBoxField("ContStatusCode", "%", "전체") 빈칸="전체", `statusCheckBox` CheckBox, `radio1` Radio, `radio2` Radio, `tabPage01` Biz13_TabPage_WithCorp, `tabPage02` Biz11_TabPage_ContHistory, `tabPage03` Biz16_TabPage_EachCont, `tabPage04` Biz17_TabPage_DualManageFund
- 그리드 `grid` (buildGrid()):
  - contDate 100 "(재)계약일자" Date
  - contCorpName 150 "계약사명" Text
  - contStatusName 100 "계약상태" Text
  - corpStatusName 100 "거래유무" Text
  - trType 100 "거래형태" Text
  - contPeriodName 80 "계약기간" TextCenter
  - startDate 100 "거래개시일" Date
  - closeDate 100 "거래종료일" Date
  - minFeeStr 180 "최저보수" Text
  - withFeeStr 100 "병행보수" Text
  - feeChargeTypeName 100 "청구구분" Text
  - baseFee 100 "기본보수(bp)" Text
  - manager 100 "담당자명" TextArea
  - managerTel 150 "담당자연락처" TextArea
  - note 250 "비고" TextArea

#### 이벤트
[E0] 화면 열림 (생성자 L83-87) → init(), settings(), retrieve()
[E1] yearText.KeyPress [Enter] (L102) → retrieve()
[E2] searchText.KeyPress [Enter] (L112) → retrieve()
[E3] monthText.KeyPress [Enter] (L123) → retrieve()
[E4] retrieveButton[조회].Select (L132) → retrieve()
[E5] insertButton[등록].Select (L138) → insert()
[E6] deleteButton[삭제].Select (L144) → deleteCheck()
       └ [E11] msgBox.DialogHide [YES] (L377) → delete()
[E7] downLoadButton[출력/다운로드].Select (L150) → 인라인 L150-187 (new SelectHandler() { @Override publi…)
[E8] toggle.ValueChange (L198) → 인라인 L198-210 (new ValueChangeHandler<HasValue<Boole…)
[E9] grid.RowClick (L249) → retrieveTabpage()
[E10] tabPanel.Selection [arg0 != null] (L255) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private init() | L213-287 | 생성자 | 상태 처리 | 업무 |
| private retrieveTabpage() | L312-322 | E9,E10,retrieve | 선택 회사로 탭페이지 retrieve | 업무 |
| public retrieve() | L324-356 | 생성자,E1,E2,E3,E4,insert,delete | 서비스 biz.Biz10_ContCorp.selectByText(companyId, searchText, check, stdYear, statusCode, statusCheck, endMonth), 선택 회사로 탭페이지 retrieve(companyId, searchText, check, stdYear, statusCode, statusCheck, endMonth) | 업무 |
| public insert() | L358-365 | E5 | 팝업 Biz11_Edit_ContHistory 열기 | 업무 |
| public deleteCheck() | L367-393 | E6 | ConfirmBox → E11 | 업무 |
| private delete() | L395-414 | E11 | GridDeleteData biz.Biz11_ContHistory.deleteContCorpId, biz.Biz10_ContCorp.delete(체크된 행 목록) | 업무 |
| private settings() | L89-211 | 생성자 | 이벤트 연결, 초기값: statusCheckBox=true("계약건만 보기"), radio1=true("전체"), radio2=false("계약년도") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L289-310 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L416-418 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L420-422 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L424-426 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarNoticeStyleNoSpace() | L428-430 | init | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('contDate', 100, '(재)계약일자'),  // L293
  gb.text('contCorpNm', 150, '계약사명'),  // L294
  gb.text('contStatusNm', 100, '계약상태'),  // L295
  gb.text('corpStatusNm', 100, '거래유무'),  // L296
  gb.text('trType', 100, '거래형태'),  // L297
  gb.textCenter('contPeriodNm', 80, '계약기간'),  // L298
  gb.date('startDate', 100, '거래개시일'),  // L299
  gb.date('closeDate', 100, '거래종료일'),  // L300
  gb.text('minFeeStr', 180, '최저보수'),  // L301
  gb.text('withFeeStr', 100, '병행보수'),  // L302
  gb.text('feeChargeTypeNm', 100, '청구구분'),  // L303
  gb.text('baseFee', 100, '기본보수(bp)'),  // L304
  gb.textArea('manager', 100, '담당자명'),  // L305
  gb.textArea('managerTel', 150, '담당자연락처'),  // L306
  gb.textArea('note', 250, '비고'),  // L307
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="download" onClick={() => /* 인라인 L150-187 (new SelectHandler() { @Override publi…) */}>출력/다운로드</Button>

### Biz17_TabPage_DualManageFund (`client/vi/biz/Biz17_TabPage_DualManageFund.java`, 238줄)

- 입력·하위 화면: `fundCode` LookupTriggerField, `lookup` Biz17_Lookup_HoldFee, `positionComboBox` ComboBoxField("FundMngPositionType")
- 그리드 `grid` (buildGrid(), 체크박스):
  - fundCode 150 "펀드" TextCenter 편집:fundCode
  - fundName 480 "펀드명" Text
  - startDate 120 "적용시작일" Date 편집:MyDateField
  - fundFee 90 "보수율" Double 편집:DoubleField
  - fundSubFee 90 "(부)보수율" Double 편집:DoubleField
  - positionTypeName 110 "구분" TextCenter 편집:positionComboBox

#### 이벤트
[E0] 화면 열림 (생성자 L58-69) → 초기화
[E1] searchBarBuilder[등록].Insert (L63) → insertRow()
[E2] searchBarBuilder[삭제].Delete (L64) → deleteRow()
       └ [E6] messageBox.DialogHide [YES] (L213) → updateTransInfoGrid()
[E3] searchBarBuilder[저장].Update (L65) → update()
[E4] fundCode.TriggerClick (L77) → 인라인 L77-92 (new TriggerClickHandler(){ @Override …)
[E5] positionComboBox[FundMngPositionType].Collapse (L95) → 인라인 L95-101 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L115-117 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L120-122 | updateTransInfoGrid | 상태 처리 | 업무 |
| public retrieve() | L125-136 | updateTransInfoGrid | 서비스 biz.Biz17_DualManageFund.selectByContCorpId(contCorpId, stdDate) | 업무 |
| public update() | L139-162 | E3 | 서비스 biz.Biz17_DualManageFund.update | 업무 |
| private updateTransInfoGrid() | L164-195 | E6,update | 서비스 biz.Biz10_ContCorp.selectById | 업무 |
| public insertRow() | L198-207 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L210-229 | E2 | ConfirmBox → E6 | 업무 |
| public getGrid() | L232-235 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L71-112 | 필드 초기화 | 조회창 Biz17_Lookup_HoldFee 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 150, '펀드'),  // L104
  gb.text('fundNm', 480, '펀드명'),  // L105 SQL 계산 컬럼(selectByContCorpId: ( SELECT ast30_fund_nm FROM ast30_book_…)
  gb.date('startDate', 120, '적용시작일', { editor: 'date' }),  // L106
  gb.double('fundFee', 90, '보수율', { editor: 'number' }),  // L107
  gb.double('fundSubFee', 90, '(부)보수율', { editor: 'number' }),  // L108
  gb.textCenter('positionTypeNm', 110, '구분', { editor: 'select' }),  // L109 SQL 계산 컬럼(selectByContCorpId: f_cdnm('FundMngPositionType' , biz17_po…)
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>

### Biz17_Lookup_HoldFee (`client/vi/biz/Biz17_Lookup_HoldFee.java`, 186줄)

- 툴바 `buttonBar`: 기준일자: {stdDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="펀드코드/펀드명", `stdDate` MyDateField
- 그리드 `grid` (buildGrid()):
  - fundCode 150 "펀드코드" TextCenter
  - fundName 480 "펀드명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L65-82) → show()
[E1] searchText.KeyPress [Enter] (L94) → retrieve()
[E2] grid.RowDoubleClick (L104) → select()
[E3] selectButton[확인].Select (L120) → select()
[E4] cancleButton[닫기].Select (L126) → hide()
[E5] retrieveButton[조회].Select (L132) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L55-63 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L84-138 | open | 상태 처리 | 업무 |
| private retrieve() | L150-165 | E1,E5,open | 서비스 ast.Ast30_BookFundFee.selectByContCorpId(companyId, holdDate, contCorpId, searchText) | 업무 |
| private select() | L167-176 | E2,E3 | 상태 처리 | 업무 |
| public buildGrid() | L140-148 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L178-180 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L182-184 | setting | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('fundCd', 150, '펀드코드'),  // L144
  gb.text('fundNm', 480, '펀드명'),  // L145
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={select}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz16_TabPage_EachCont (`client/vi/biz/Biz16_TabPage_EachCont.java`, 496줄)

- 입력·하위 화면: `lookup` Dcr30_Lookup_Link, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class
- 그리드 `grid` (buildGrid(), 체크박스):
  - date 120 "계약일" Date 편집:MyDateField
  - fundName 400 "펀드명" Text 편집:TextField
  - fundStartDate 120 "설정일" Date 편집:MyDateField
  - fundFee 140 "보수율" Text 편집:TextField
  - note 280 "비고" Text 편집:TextField
  - aprStatusName 120 "결재상태" TextCenter
  - actionCell 50 "상신" Cell 편집:apprCell

#### 이벤트
[E0] 화면 열림 (생성자 L67-95) → 초기화
[E1] searchBarBuilder[등록].Insert (L72) → insertRow()
[E2] searchBarBuilder[삭제].Delete (L73) → deleteRow()
       └ [E5] messageBox.DialogHide [YES] (L414) → updateTransInfoGrid()
[E3] searchBarBuilder[저장].Update (L74) → update()
[E4] dcrLinkButton[문서분류지정].Select (L80) → 인라인 L80-91 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L147-149 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L152-154 | updateTransInfoGrid,checkAppr,updateApprId | 상태 처리 | 업무 |
| public retrieve() | L157-165 | updateTransInfoGrid,checkAppr,updateApprId | 서비스 biz.Biz16_EachCont.selectByCorpId(contCorpId, companyId) | 업무 |
| private updateCheck() | L167-202 | buildGrid | 상태 처리 | 업무 |
| public update() | L205-253 | E3 | 미선택 시 alert "계약일은 필수작성 항목입니다", 서비스 biz.Biz16_EachCont.update | 업무 |
| private updateTransInfoGrid() | L255-286 | E5,update | 서비스 biz.Biz10_ContCorp.selectById | 업무 |
| private checkAppr() | L288-319 | updateCheck | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private checkdcr() | L321-355 | checkAppr | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L357-371 | checkdcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L373-387 | insertLinkApproval | 서비스 biz.Biz16_EachCont.updateApprId(contractId, apprId) | 업무 |
| public insertRow() | L390-399 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L402-431 | E2 | ConfirmBox → E5 | 업무 |
| public createMapping() | L434-454 | insertLinkApproval | 상태 처리 | 업무 |
| private checkStringNull() | L456-464 | createMapping | 상태 처리 | 업무 |
| private checkDate01Null() | L466-476 | createMapping | 상태 처리 | 업무 |
| private checkDate02Null() | L478-488 | createMapping | 상태 처리 | 업무 |
| public getGrid() | L491-494 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L97-144 | 필드 초기화 | 미선택 시 alert "계약사 주소와 대표이사를 입력해야합니다.", 서비스 biz.Biz16_EachCont.selectByContCorpId(contCorpId, companyId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('date', 120, '계약일', { editor: 'date' }),  // L131
  gb.text('fundNm', 400, '펀드명', { editor: 'text' }),  // L132
  gb.date('fundStartDate', 120, '설정일', { editor: 'date' }),  // L133
  gb.text('fundFee', 140, '보수율', { editor: 'text' }),  // L135
  gb.text('note', 280, '비고', { editor: 'text' }),  // L136
  gb.textCenter('aprStatusNm', 120, '결재상태'),  // L140 SQL 계산 컬럼(selectByContCorpId: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L141) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={() => /* 인라인 L80-91 (new SelectHandler() { @Override publi…) */}>문서분류지정</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>

### Biz13_TabPage_WithCorp (`client/vi/biz/Biz13_TabPage_WithCorp.java`, 291줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {updateButton} {corpButton}
- 입력·하위 화면: `lookupCorp` LookupTriggerField, `manageTypeComboBox` ComboBoxField("ManageType"), `lookup` Sys15_Lookup_Corp_OnlyKFS
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - corpCode 80 "운용사코드" TextCenter
  - corpName 250 "운용사명" Text 편집:lookupCorp
  - manageTypeName 120 "운영구분" Text 편집:manageTypeComboBox
  - firstStartDate 120 "최초업무시작일" Date 편집:MyDateField
  - lastCloseDate 120 "최종업무종료일" Date 편집:MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L65-81) → setting()
[E1] insertButton[등록].Select (L84) → insertRow()
[E2] deleteButton[삭제].Select (L90) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L268) → updateTransInfoGrid()
[E3] updateButton[저장].Select (L96) → update()
[E4] corpButton[운용사코드 등록].Select (L102) → lookupCorp()
[E5] lookupCorp.TriggerClick (L113) → 인라인 L113-129 (new TriggerClickHandler(){ @Override …)
[E6] manageTypeComboBox[ManageType].Collapse (L131) → 인라인 L131-141 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L83-108 | 생성자 | 상태 처리 | 업무 |
| private lookupCorp() | L153-156 | E4 | 조회창 Sys15_Lookup_Corp_OnlyKFS 열기 | 업무 |
| public init() | L159-161 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L164-166 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L169-175 | 공개 메서드 | 서비스 biz.Biz13_WithCorp.selectByHistoryContCorpId(contCorpId) | 업무 |
| public update() | L178-201 | E3 | 서비스 biz.Biz13_WithCorp.update | 업무 |
| private updateTransInfoGrid() | L203-232 | E7,update | 서비스 biz.Biz10_ContCorp.selectById | 업무 |
| public insertRow() | L235-262 | E1 | 조회창 Sys15_Lookup_Corp 열기, 미선택 시 alert "계약사를 먼저 선택해주세요" | 업무 |
| public deleteRow() | L265-284 | E2 | ConfirmBox → E7 | 업무 |
| public getGrid() | L287-290 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L110-151 | 필드 초기화 | 조회창 Sys15_Lookup_Corp 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('corpCd', 80, '운용사코드'),  // L144 SQL 계산 컬럼(selectByHistoryContCorpId: sys15_corp_cd)
  gb.text('corpNm', 250, '운용사명'),  // L145 SQL 계산 컬럼(selectByHistoryContCorpId: sys15_corp_nm)
  gb.text('manageTypeNm', 120, '운영구분', { editor: 'select' }),  // L146 SQL 계산 컬럼(selectByHistoryContCorpId: f_cdnm('ManageType', biz13_manage_type,…)
  gb.date('firstStartDate', 120, '최초업무시작일', { editor: 'date' }),  // L147
  gb.date('lastCloseDate', 120, '최종업무종료일', { editor: 'date' }),  // L148
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteRow}>삭제</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="group" onClick={lookupCorp}>운용사코드 등록</Button>

### Biz11_TabPage_ContHistory (`client/vi/biz/Biz11_TabPage_ContHistory.java`, 302줄)

- 입력·하위 화면: `lookup` Biz14_Lookup_RelateAppr
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "적용일자" Date
  - actionCell 30 "수정" Cell 편집:actionCell1
  - contCorpName 200 "계약사명" Text
  - contStatusName 100 "계약상태" Text
  - corpStatusName 100 "거래유무" Text
  - trType 100 "거래형태" Text
  - contPeriodName 70 "계약기간" TextCenter
  - contDate 100 "(재)계약일" Date
  - startDate 100 "거래개시일" Date
  - closeDate 100 "거래종료일" Date
  - minFeeStr 230 "최저보수" Text
  - withFeeStr 100 "병행보수" Text
  - feeChargeTypeName 130 "청구구분" Text
  - baseFee 100 "기본보수(bp)" Text
  - manager 100 "담당자명" Text
  - managerTel 150 "담당자연락처" Text
  - actionCell 50 "연관문서" Cell 편집:actionCell3
  - note 200 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L51-76) → 초기화
[E1] searchBarBuilder[등록].Insert (L56) → insertRow()
[E2] searchBarBuilder[삭제].Delete (L57) → deleteRow()
[E3] searchBarBuilder[저장].Update (L58) → update()
[E4] autoInsertButton[자동연장].Select (L62) → autoInsert()
[E5] fileManageButton[첨부파일관리].Select (L68) → fileManage()
[E6] messageBox.DialogHide [YES] (L239) → updateTransInfoGrid()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L139-141 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L144-146 | buildGrid,insertRow,autoInsert | 상태 처리 | 업무 |
| public retrieve() | L149-155 | buildGrid,insertRow,autoInsert | 서비스 biz.Biz11_ContHistory.selectByContCorpId(contCorpId) | 업무 |
| public update() | L158-166 | E3 | 서비스 biz.Biz11_ContHistory.update | 업무 |
| private updateTransInfoGrid() | L168-197 | E6,update | 서비스 biz.Biz10_ContCorp.selectById | 업무 |
| public insertRow() | L200-213 | E1 | 팝업 Biz11_Edit_ContHistory 열기, 미선택 시 alert "계약사를 먼저 선택해주세요" | 업무 |
| public deleteRow() | L216-234 | E2 | 서비스 biz.Biz11_ContHistory.deleteCheck(contCorpId) | 업무 |
| public delete() | L236-255 | deleteRow | 확인창 표시, GridDeleteData biz.Biz11_ContHistory.delete(체크된 행 목록) | 업무 |
| private autoInsert() | L257-286 | E4 | 미선택 시 alert "자동연장이 완료되었습니다.", 서비스 biz.Biz10_ContCorp.insertUpdate | 업무 |
| private fileManage() | L288-295 | E5 | 조회창 Biz11_Lookup_FileList 열기 | 업무 |
| public getGrid() | L298-301 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L78-136 | 필드 초기화 | 팝업 Biz11_Edit_ContHistory 열기, 조회창 Biz14_Lookup_RelateAppr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '적용일자'),  // L115
  // ⚠ 대응 없음 (GridBuilder L116) addCell
  gb.text('contCorpNm', 200, '계약사명'),  // L117
  gb.text('contStatusNm', 100, '계약상태'),  // L118 SQL 계산 컬럼(selectByContCorpId: f_cdnm('ContStatusCode' , biz11_cont_st…)
  gb.text('corpStatusNm', 100, '거래유무'),  // L119 SQL 계산 컬럼(selectByContCorpId: f_cdnm('ContCorpStatusCode', biz11_corp…)
  gb.text('trType', 100, '거래형태'),  // L120
  gb.textCenter('contPeriodNm', 70, '계약기간'),  // L121 SQL 계산 컬럼(selectByContCorpId: f_cdnm('ContPeriodCode' , biz11_cont_pe…)
  gb.date('contDate', 100, '(재)계약일'),  // L122
  gb.date('startDate', 100, '거래개시일'),  // L123
  gb.date('closeDate', 100, '거래종료일'),  // L124
  gb.text('minFeeStr', 230, '최저보수'),  // L125
  gb.text('withFeeStr', 100, '병행보수'),  // L126
  gb.text('feeChargeTypeNm', 130, '청구구분'),  // L127
  gb.text('baseFee', 100, '기본보수(bp)'),  // L128
  gb.text('manager', 100, '담당자명'),  // L129
  gb.text('managerTel', 150, '담당자연락처'),  // L130
  // ⚠ 대응 없음 (GridBuilder L132) addCell
  gb.text('note', 200, '비고'),  // L133
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={autoInsert}>자동연장</Button>
2. <Button type="view" onClick={fileManage}>첨부파일관리</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="save" onClick={update}>저장</Button>

### Biz14_Lookup_RelateAppr (`client/vi/biz/Biz14_Lookup_RelateAppr.java`, 300줄)

- 툴바 `buttonBar01`: 문서분류: {classTreeFullName} {apprButton}
- 툴바 `buttonBar02`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="문서분류를 선택해주세요", `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - title 370 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L154-178) → show()
[E1] retrieveButton[조회].Select (L106) → retrieve()
[E2] insertButton[불러오기].Select (L112) → insert()
[E3] deleteButton[연결제거].Select (L118) → delete()
[E4] closeButton[닫기].Select [callback != null] (L124) → hide()
[E5] classTreeFullName.TriggerClick (L136) → openLookupDoc()
[E6] apprButton[신규문서 작성].Select [classTreeModel == null] (L142) → insertApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L69-72 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L74-77 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L79-84 | 공개 메서드 | 상태 처리 | 업무 |
| private openLookupDoc() | L220-229 | E5 | 상태 처리 | 업무 |
| private insertApproval() | L231-254 | E6 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 biz.Biz14_RelateAppr.modelUpdate | 업무 |
| private retrieve() | L256-260 | E1,open,insertApproval,insert | 서비스 biz.Biz14_RelateAppr.selectByContHistoryId(contHistoryId) | 업무 |
| private insert() | L262-285 | E2 | 조회창 Apr05_Lookup_LoadDoc 열기, 서비스 biz.Biz14_RelateAppr.modelUpdate | 업무 |
| private delete() | L287-291 | E3 | GridDeleteData biz.Biz14_RelateAppr.delete(체크된 행 목록) | 업무 |
| private settings() | L86-152 | open | 서비스 dcr.Dcr01_ClassTree.selectById(classTreeId), 이벤트 연결, 초기값: classTreeFullName=classTreeModel.getClassTreeFullName( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L180-217 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L293-295 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L297-299 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 370, '제목'),  // L209 SQL 계산 컬럼(selectById: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L210 SQL 계산 컬럼(selectById: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L211 SQL 계산 컬럼(selectById: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L212 SQL 계산 컬럼(selectById: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L213 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L214) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="register" onClick={insert}>불러오기</Button>
4. <Button type="delete" onClick={delete}>연결제거</Button>
5. <Button type="register" onClick={insertApproval}>신규문서 작성</Button>

### Biz11_Lookup_FileList (`client/vi/biz/Biz11_Lookup_FileList.java`, 295줄)

- 레이아웃: west=vlc, center=viewer
- 툴바 `buttonBar`: {uploadButton}
- 그리드 `grid` (buildGrid()):
  - fileName 300 "파일명" Text
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L64-144) → settings(), show()
[E1] uploadButton[파일업로드].Select (L73) → 인라인 L73-78 (new SelectHandler() { @Override publi…)
[E2] fileUpload.Change (L85) → 인라인 L85-92 (new ChangeHandler() { @Override publi…)
[E3] fileUploadForm.SubmitComplete (L95) → resetFileUpload(), retrieve()
[E4] fileDeleteForm.SubmitComplete (L112) → retrieve()
[E5] closeButton[닫기].Select (L147) → hide()
[E6] grid.CellClick (L154) → 인라인 L154-166 (new CellClickHandler() { @Override pu…)
[E7] msgBox.DialogHide [YES] (L191) → checkFileDelete()
[E8] fileUpload.Change (L255) → 인라인 L255-262 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L169-172 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L219-246 | E3,E4,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private resetFileUpload() | L248-263 | E3 | 상태 처리 | 업무 |
| private checkFileDelete() | L265-290 | E7 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private settings() | L146-167 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L174-217 | 필드 초기화 | 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L292-294 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 300, '파일명'),  // L212
  // ⚠ 대응 없음 (GridBuilder L213) addCell
  // ⚠ 대응 없음 (GridBuilder L214) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L73-78 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz11_PDFViewer (`client/vi/biz/Biz11_PDFViewer.java`, 69줄)


#### 이벤트
[E0] 화면 열림 (생성자 L24-28) → show()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public view() | L30-32 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L34-68 | view | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Biz11_Edit_ContHistory (`client/vi/biz/Biz11_Edit_ContHistory.java`, 612줄)

- 툴바 `shareButtonBar`: {hlc}
- 입력·하위 화면: `minFeeStr` LookupTriggerField, `contHistoryId` LongField, `regDate` MyDateField, `contCorpName` TextField, `contStatusCode` TextField, `corpStatusCode` TextField, `trType` TextField, `contPeriodCode` TextField, `contDate` MyDateField, `startDate` MyDateField, `closeDate` MyDateField, `baseFee` TextField, `manager` TextField, `managerTel` TextField, `note` MyTextArea, `personId` LongField, `address` TextField, `ceo` TextField, `corpStatusName` ComboBoxField("ContCorpStatusCode"), `contPeriodName` ComboBoxField("ContPeriodCode"), `personName` LookupTriggerField, `radio01` Radio, `radio02` Radio, `contStatusName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `lookupFeeInfo` Biz12_Edit_FeeInfo, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle, `orgSearch` Org00_Lookup_SelectSingle
- 그리드 `shareGrid` (shareGrid()):
  - shareName 50 "구분" TextCenter
  - orgName 160 "부서" Text
  - personName 80 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L167-185) → init()
[E1] updateButton[저장].Select (L255) → update()
[E2] closeButton[닫기].Select (L261) → hide()
[E3] contPeriodName[계약기간].ValueChange (L267) → getDate()
[E4] startDate[거래개시일].ValueChange (L275) → getDate()
[E5] insertButton[행 추가].Select (L284) → insertRow()
[E6] deleteButton[행 삭제].Select (L290) → deleteRow()
[E7] contStatusName[계약상태].Collapse (L316) → 인라인 L316-321 (new CollapseHandler() { @Override pub…)
[E8] corpStatusName[계약사 거래유무].Collapse (L322) → 인라인 L322-327 (new CollapseHandler() { @Override pub…)
[E9] contPeriodName[계약기간].Collapse (L328) → 인라인 L328-333 (new CollapseHandler() { @Override pub…)
[E10] minFeeStr[최저보수].TriggerClick (L335) → 인라인 L335-347 (new TriggerClickHandler(){ @Override …)
[E11] personName[확인자].TriggerClick (L349) → 인라인 L349-363 (new TriggerClickHandler(){ @Override …)
[E12] anchor.MouseDown (L444) → retrieveShare()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L226-251 | 생성자 | 서비스 sys.Sys00_Common.selectByKindGroupCode | 업무 |
| private getDate() | L298-313 | E3,E4 | 상태 처리 | 업무 |
| private getEditor() | L315-433 | init | 팝업 Biz12_Edit_FeeInfo 열기, 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private getShare() | L435-465 | getEditor | 상태 처리 | 업무 |
| private shareGrid() | L467-474 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieveShare() | L476-487 | E12,init | 서비스 biz.Biz15_Share.selectByContHistoryId(companyId, contHistoryId) | 업무 |
| private insertRow() | L489-497 | E5 | 상태 처리 | 업무 |
| private deleteRow() | L499-505 | E6 | 상태 처리 | 업무 |
| private openLookupOrgInfo() | L507-529 | insertRow | 조회창 Org00_Lookup_SelectSingle 열기 | 업무 |
| private openLookupEmpInfo() | L531-555 | insertRow | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private shareUpdate() | L557-568 | update | GridDeleteData biz.Biz15_Share.update, biz.Biz15_Share.delete | 업무 |
| private spaceDelete() | L570-574 | update | 상태 처리 | 업무 |
| public update() | L576-603 | E1 | 서비스 biz.Biz10_ContCorp.insertUpdate | 업무 |
| private settings() | L253-296 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L605-607 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L609-611 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const shareGrid = () => [
  gb.textCenter('shareNm', 50, '구분'),  // L469 SQL 계산 컬럼(selectByContHistoryId: f_cdnm('ShareCode', biz15_share_cd, c.s…)
  gb.text('orgNm', 160, '부서'),  // L470 SQL 계산 컬럼(selectByContHistoryId: f_org_nm(biz15_org_id, f_sysdate()))
  gb.textCenter('personNm', 80, '성명'),  // L471 SQL 계산 컬럼(selectByContHistoryId: f_emp_kor_nm(biz15_person_id))
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Biz12_Edit_FeeInfo (`client/vi/biz/Biz12_Edit_FeeInfo.java`, 287줄)

- 입력·하위 화면: `feeInfoId` LongField, `contHistoryId` LongField, `manageMinFee` LongField, `advMinFee` LongField, `discrMinFee` LongField, `withFee` LongField, `feeChargeType` TextField, `minFeeStr` TextField, `feeChargeTypeName` ComboBoxField("FundFeeChargeType") 빈칸="선택", `minFeeName` StringComboBox, `withName` StringComboBox, `vatName` StringComboBox

#### 이벤트
[E0] 화면 열림 (생성자 L74-80) → 초기화
[E1] feeChargeTypeName[청구구분].Collapse (L148) → 인라인 L148-153 (new CollapseHandler() { @Override pub…)
[E2] minFeeName[최저보수].ValueChange (L154) → readOnlyVlc1(), readOnlyAll()
[E3] withName[병행보수].ValueChange (L168) → readOnlyVlc2()
[E4] updateButton[저장].Select (L180) → update()
[E5] closeButton[닫기].Select (L186) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L82-120 | 공개 메서드 | 상태 처리 | 업무 |
| private readOnlyVlc1() | L194-202 | E2,open | 상태 처리 | 업무 |
| private readOnlyVlc2() | L204-208 | E3,open | 상태 처리 | 업무 |
| private readOnlyAll() | L210-220 | E2,open | 상태 처리 | 업무 |
| private getEditor() | L222-260 | open | 상태 처리 | 업무 |
| public update() | L262-278 | E4 | 서비스 biz.Biz12_FeeInfo.modelUpdate | 업무 |
| private settings() | L122-192 | open | 이벤트 연결, 초기값: feeChargeType=feeChargeTypeName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L280-282 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L284-286 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

