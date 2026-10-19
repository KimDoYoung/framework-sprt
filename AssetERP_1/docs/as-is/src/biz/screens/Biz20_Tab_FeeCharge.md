# Biz20_Tab_FeeCharge

- 종류: 화면
- 메뉴: KFS > 10. ICAM 계약사관리 > 최저보수 청구 (#1210)
- 파일: `client/vi/biz/Biz20_Tab_FeeCharge.java`
- 함께 쓰는 클래스 5개:
  - `Biz29_Lookup_Account` `client/vi/biz/Biz29_Lookup_Account.java`
  - `Biz22_Lookup_FeeChargeCalc` `client/vi/biz/Biz22_Lookup_FeeChargeCalc.java`
  - `Biz20_Lookup_FileList` `client/vi/biz/Biz20_Lookup_FileList.java`
  - `Biz20_Edit_FeeCharge` `client/vi/biz/Biz20_Edit_FeeCharge.java`
  - `Biz10_Lookup_ContCorp` `client/vi/biz/Biz10_Lookup_ContCorp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Ast01_Lookup_Info`](../../ast/components/Ast01_Lookup_Info.md), [`Biz13_Lookup_WithCorp`](../../biz/components/Biz13_Lookup_WithCorp.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz20_Tab_FeeCharge:810 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz10_ContCorp.selectByText` | Biz10_Lookup_ContCorp:149 | [`Biz10_ContCorp.java:27`](../../biz/services/Biz10_ContCorp.md) | [`biz10_cont_corp.selectByText`](../../biz/sql/biz10_cont_corp.md) |
| `biz.Biz20_FeeCharge.apprCheck` | Biz20_Tab_FeeCharge:396 | [`Biz20_FeeCharge.java:796`](../../biz/services/Biz20_FeeCharge.md) | [`biz20_fee_charge.getHtmlContent`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz20_FeeCharge.confirmUpdate` | Biz20_Tab_FeeCharge:575 | [`Biz20_FeeCharge.java:818`](../../biz/services/Biz20_FeeCharge.md) | [`biz20_fee_charge.confirmUpdate`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz20_FeeCharge.createFeeCharge` | Biz20_Tab_FeeCharge:745 | [`Biz20_FeeCharge.java:40`](../../biz/services/Biz20_FeeCharge.md) | [`ast33_fund_trans.selectFundTransByDate`](../../ast/sql/ast33_fund_trans.md), [`biz11_cont_history.selectByDate`](../../biz/sql/biz11_cont_history.md), [`biz11_cont_history.selectByStartDate`](../../biz/sql/biz11_cont_history.md), [`biz11_cont_history.selectContCorp`](../../biz/sql/biz11_cont_history.md), [`biz11_cont_history.updateDate`](../../biz/sql/biz11_cont_history.md), [`biz13_with_corp.selectByContCorpId2`](../../biz/sql/biz13_with_corp.md), [`biz13_with_corp.selectFirstStartDateIsNull`](../../biz/sql/biz13_with_corp.md), [`biz13_with_corp.updateFirstStartDate`](../../biz/sql/biz13_with_corp.md), [`biz17_dual_manage_fund.calcDualFundFee`](../../biz/sql/biz17_dual_manage_fund.md), [`biz20_fee_charge.insert`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.selectByContCorpId2`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.selectByCorpId`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.selectFeeInfo`](../../biz/sql/biz20_fee_charge.md), [`biz20_fee_charge.updateFeeCalcInfo`](../../biz/sql/biz20_fee_charge.md), [`biz21_fee_charge_dtl.deleteByFeeChargeId`](../../biz/sql/biz21_fee_charge_dtl.md), [`biz21_fee_charge_dtl.insert`](../../biz/sql/biz21_fee_charge_dtl.md), [`biz21_fee_charge_dtl.selectOccFeeSum`](../../biz/sql/biz21_fee_charge_dtl.md), [`biz22_fee_charge_calc.deleteByContCorpId`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.deleteByFeeChargeCalcId`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.deleteTermLastCloseDate`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.insert`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.selectByContCorpId`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.selectTermStartDate`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.updateFeeInfo`](../../biz/sql/biz22_fee_charge_calc.md), [`biz22_fee_charge_calc.updateTermCloseDate`](../../biz/sql/biz22_fee_charge_calc.md), [`biz29_account.insertNotAccount`](../../biz/sql/biz29_account.md), [`dbConfig.getQuarterStartDate`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `biz.Biz20_FeeCharge.deleteList` | Biz20_Tab_FeeCharge:527 | [`Biz20_FeeCharge.java:851`](../../biz/services/Biz20_FeeCharge.md) | [`biz20_fee_charge.deleteByFeeChargeId`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz20_FeeCharge.modelUpdate` | Biz20_Edit_FeeCharge:240 | [`Biz20_FeeCharge.java:842`](../../biz/services/Biz20_FeeCharge.md) | `UpdateDataModel(biz20_fee_charge)` 동적 INSERT/UPDATE → [`biz20_fee_charge.selectById`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz20_FeeCharge.selectByChargeDate` | Biz20_Tab_FeeCharge:642 | [`Biz20_FeeCharge.java:35`](../../biz/services/Biz20_FeeCharge.md) | [`biz20_fee_charge.selectByChargeDate`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz20_FeeCharge.updateApprId` | Biz20_Tab_FeeCharge:896 | [`Biz20_FeeCharge.java:833`](../../biz/services/Biz20_FeeCharge.md) | [`biz20_fee_charge.updateApprId`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz20_FeeCharge.updateCheck` | Biz20_Edit_FeeCharge:206 | [`Biz20_FeeCharge.java:807`](../../biz/services/Biz20_FeeCharge.md) | [`biz20_fee_charge.updateCheck`](../../biz/sql/biz20_fee_charge.md) |
| `biz.Biz22_FeeChargeCalc.selectByContCorpId` | Biz22_Lookup_FeeChargeCalc:148 | [`Biz22_FeeChargeCalc.java:22`](../../biz/services/Biz22_FeeChargeCalc.md) | [`biz22_fee_charge_calc.selectByContCorpId`](../../biz/sql/biz22_fee_charge_calc.md) |
| `biz.Biz29_Account.delete` | Biz29_Lookup_Account:280 | [`Biz29_Account.java:41`](../../biz/services/Biz29_Account.md) | `UpdateDataModel(biz29_account)` 동적 DELETE |
| `biz.Biz29_Account.selectBySearchText` | Biz29_Lookup_Account:220 | [`Biz29_Account.java:27`](../../biz/services/Biz29_Account.md) | [`biz29_account.selectBySearchText`](../../biz/sql/biz29_account.md) |
| `biz.Biz29_Account.update` | Biz29_Lookup_Account:258 | [`Biz29_Account.java:36`](../../biz/services/Biz29_Account.md) | `UpdateDataModel(biz29_account)` 동적 INSERT/UPDATE → [`biz29_account.selectById`](../../biz/sql/biz29_account.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Biz20_Tab_FeeCharge:661, Biz20_Tab_FeeCharge:847 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `getSeq` | Biz20_Edit_FeeCharge:105, Biz20_Edit_FeeCharge:68 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys10_File.selectByFeeChargeId` | Biz20_Lookup_FileList:214 | [`Sys10_File.java:75`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByFeeChargeId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Biz20_Lookup_FileList:237 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.insertRdFeeCharge` | Biz20_Tab_FeeCharge:229 | [`Sys99_Print.java:1061`](../../sys/services/Sys99_Print.md) | [`biz20_fee_charge.selectByChargeDate`](../../biz/sql/biz20_fee_charge.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `utils.excel.ExcelCreate.createFeeExcel` | Biz20_Tab_FeeCharge:766 | [`ExcelCreate.java:17`](../../utils/services/excel.ExcelCreate.md) | - |
| `utils.pdf.PDFCreate.createFeePDF` | Biz20_Tab_FeeCharge:786 | [`PDFCreate.java:84`](../../utils/services/pdf.PDFCreate.md) | - |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast33_fund_trans`](../../../db/tables/ast.md), [`biz10_cont_corp`](../../../db/tables/biz.md), [`biz11_cont_history`](../../../db/tables/biz.md), [`biz12_fee_info`](../../../db/tables/biz.md), [`biz13_with_corp`](../../../db/tables/biz.md), [`biz20_fee_charge`](../../../db/tables/biz.md), [`biz21_fee_charge_dtl`](../../../db/tables/biz.md), [`biz22_fee_charge_calc`](../../../db/tables/biz.md), [`biz29_account`](../../../db/tables/biz.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_calc_dual_fund_fee`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_date`, `f_get_datedif`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_last_day`, `f_get_quarter_date`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz20_Tab_FeeCharge (`client/vi/biz/Biz20_Tab_FeeCharge.java`, 950줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: 해당 연도: {yearText} {quarterComboBox} 분기: 검색: {searchTextField} {retrieveButton} {batchButton} {corpBatchButton} {allFileDownloadButton} {printDownButton} {accountButton} {downloadForm} {allFileDownloadForm}
- 툴바 `buttonBar02`: {insertButton} {deleteButton} {confirmButton} {cancleButton} {apprAllButton}
- 입력·하위 화면: `yearText` TextField, `searchTextField` TextField, `quarterComboBox` StringComboBox, `lookup` Biz10_Lookup_ContCorp, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc, `editor` Apr01_Edit_ApprDoc, `lookupAccount` Biz29_Lookup_Account
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fixYnName 80 "확정여부" TextCenter
  - corpName 200 "운용사" Text
  - preOccFee 120 "발생보수" Long 편집:"456EA6"
  - preRealChargeFee 120 "청구액" Long 편집:"456EA6"
  - occFee 120 "발생보수" Long 편집:"DD5E5E"
  - realChargeFee 120 "청구액" Long 편집:"DD5E5E"
  - actionCell 50 "수정" Cell 편집:actionCell
  - actionCell 50 "계산<br>상세" Cell 편집:calcCell
  - actionCell 50 "파일" Cell 편집:fileView
  - aprStatusName 120 "결재상태" TextCenter
  - actionCell 50 "상신" Cell 편집:apprCell
  - note 400 "비고" TextArea
  - realFeeChargeId 120 "RealFeeChargeId" LongCenter

#### 이벤트
[E0] 화면 열림 (생성자 L100-104) → init(), eventSetting(), retrieve()
[E1] quarterComboBox[1].Collapse (L157) → retrieve()
[E2] searchTextField.KeyPress [Enter] (L164) → retrieve()
[E3] retrieveButton[조회].Select (L172) → retrieve()
[E4] batchButton[자료일괄생성].Select (L178) → batchCheck()
       └ [E20] msgBox.DialogHide [YES] (L724) → batch()
[E5] corpBatchButton[계약사별자료생성].Select [YES] (L185) → batch()
[E6] msgBox.DialogHide [YES] (L197) → batch()
[E7] allFileDownloadButton[파일 일괄 다운로드].Select (L220) → allFileDownload()
[E8] printDownButton[츨력/다운로드].Select [result.getStatus() == 1] (L226) → getChargeDate()
[E9] accountButton[보수입금계좌].Select (L265) → lookupAccount()
[E10] insertButton[등록].Select (L272) → insert()
[E11] deleteButton[삭제].Select (L278) → deleteChk()
       └ [E17] msgBox.DialogHide [YES] (L495) → deleteList()
[E12] confirmButton[확정].Select (L284) → confirmUpdate()
       └ [E18] msgBox.DialogHide [YES] (L581) → retrieve()
       └ [E19] msgBox.DialogHide [YES] (L610) → retrieve()
[E13] cancleButton[확정취소].Select (L290) → confirmUpdate()
[E14] apprAllButton[통합상신].Select [YES] (L296) → apprAll()
[E15] msgBox.DialogHide [YES] (L303) → apprAll()
[E16] allFileDownloadForm.SubmitComplete (L325) → 인라인 L325-330 (new SubmitCompleteHandler() { @Overri…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private eventSetting() | L106-320 | 생성자 | 조회창 Biz10_Lookup_ContCorp 열기, 확인창 표시, 서비스 sys.Sys99_Print.insertRdFeeCharge(companyId, personId, windowClassName, searchText, chargeDate, year, quarter) | 업무 |
| public init() | L322-344 | 생성자 | 상태 처리 | 업무 |
| private insert() | L449-456 | E10 | 팝업 Biz20_Edit_FeeCharge 열기 | 업무 |
| public retrieve() | L458-471 | 생성자,E1,E2,E3,E18,E19,buildGrid,insert,deleteList,makePDF,checkAppr,updateApprId | 서비스 biz.Biz20_FeeCharge.selectByChargeDate(companyId, chargeDate, searchText) | 업무 |
| private getChargeDate() | L473-490 | E8,insert,retrieve,apprAll,insertLinkApproval,allFileDownload,batch,makeExcel,makePDF | 상태 처리 | 업무 |
| private deleteChk() | L492-510 | E11 | ConfirmBox → E17 | 업무 |
| private deleteList() | L512-542 | E17 | 서비스 biz.Biz20_FeeCharge.deleteList | 업무 |
| private confirmUpdate() | L544-639 | E12,E13 | 미선택 시 alert "선택된 운용사가 없습니다" → 확인창 E18 | 업무 |
| private apprAll() | L641-692 | E14,E15 | 조회창 Dcr01_Lookup_Class 열기, 서비스 biz.Biz20_FeeCharge.selectByChargeDate, dcr.Dcr30_Link.selectByLinkCode(companyId, chargeDate, searchText) | 업무 |
| private insertLinkApproval() | L694-709 | apprAll,checkdcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private allFileDownload() | L711-719 | E7 | 상태 처리 | 업무 |
| private batchCheck() | L721-740 | E4 | ConfirmBox → E20 | 업무 |
| private batch() | L742-763 | E5,E6,E20 | 서비스 biz.Biz20_FeeCharge.createFeeCharge(companyId, chargeDate, contCorpId) | 업무 |
| private makeExcel() | L765-783 | batch | 상태 처리 | 업무 |
| private makePDF() | L785-803 | makeExcel | 상태 처리 | 업무 |
| private checkAppr() | L805-837 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private checkdcr() | L839-878 | checkAppr | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L880-891 | apprAll,checkdcr | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L893-923 | insertLinkApproval | 서비스 biz.Biz20_FeeCharge.updateApprId(feeChargeId, apprId) | 업무 |
| private lookupAccount() | L925-928 | E9 | 조회창 Biz29_Lookup_Account 열기 | 업무 |
| private checkRealFeeChargeId() | L930-936 | buildGrid,confirmUpdate | 상태 처리 | 업무 |
| private buildGrid() | L346-447 | 필드 초기화 | 팝업 Biz20_Edit_FeeCharge 열기, 조회창 Biz22_Lookup_FeeChargeCalc 열기, 조회창 Biz20_Lookup_FileList 열기, 서비스 biz.Biz20_FeeCharge.apprCheck, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L938-940 | eventSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L942-944 | eventSetting | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L946-949 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L430 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle12 100 "전분기" (biz13_new_header_group_map04new_header_group_configset_html_grid_style12 컬럼 없음)
  // ⚠DB없음 L431 newHeaderGroupMap06newHeaderGroupConfigsetHtmlGridStyle12 100 "당분기" (biz13_new_header_group_map06new_header_group_configset_html_grid_style12 컬럼 없음)
  gb.textCenter('fixNm', 80, '확정여부'),  // L432
  gb.text('corpNm', 200, '운용사'),  // L433
  gb.long('preOccFee', 120, '발생보수'),  // L434
  gb.long('preRealChargeFee', 120, '청구액'),  // L435
  gb.long('occFee', 120, '발생보수'),  // L436
  gb.long('realChargeFee', 120, '청구액'),  // L437
  // ⚠ 대응 없음 (GridBuilder L438) addCell
  // ⚠ 대응 없음 (GridBuilder L439) addCell
  // ⚠ 대응 없음 (GridBuilder L440) addCell
  gb.textCenter('aprStatusNm', 120, '결재상태'),  // L441
  // ⚠ 대응 없음 (GridBuilder L442) addCell
  gb.textArea('note', 400, '비고'),  // L443
  gb.longCenter('realFeeChargeId', 120, 'RealFeeChargeId'),  // L444
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="generate" onClick={batchCheck}>자료일괄생성</Button>
3. <Button type="generate" onClick={batch}>계약사별자료생성</Button>
4. <Button type="download" onClick={allFileDownload}>파일 일괄 다운로드</Button>
5. <Button type="download" onClick={getChargeDate}>츨력/다운로드</Button>
6. <Button type="view" onClick={lookupAccount}>보수입금계좌</Button>
7. <Button type="register" onClick={insert}>등록</Button>
8. <Button type="delete" onClick={deleteChk}>삭제</Button>
9. <Button type="save" onClick={confirmUpdate}>확정</Button>
10. <Button type="cancel" onClick={confirmUpdate}>확정취소</Button>
11. <Button type="register" onClick={apprAll}>통합상신</Button>

### Biz29_Lookup_Account (`client/vi/biz/Biz29_Lookup_Account.java`, 305줄)

- 툴바 `buttonBar`: 검색: {searchTextField} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchTextField` TextField 빈칸="운용사/예금주명/연결계좌/비고", `lookupCorp` LookupTriggerField, `lookupAst` LookupTriggerField, `bankComboBox` ComboBoxField("BankCode"), `lookupInfo` Ast01_Lookup_Info
- 그리드 `grid` (buildGrid(), 체크박스):
  - corpName 150 "운용사" Text 편집:lookupCorp
  - startDate 100 "입금시작일" Date 편집:MyDateField
  - bankName 120 "은행명" Text 편집:bankComboBox
  - accountNo 180 "계좌번호" Text 편집:TextField
  - accountName 120 "예금주명" Text 편집:TextField
  - astClassTreeName 150 "연결계좌" Text 편집:lookupAst
  - note 250 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L74-144) → show()
[E1] retrieveButton[조회].Select (L85) → retrieve()
[E2] insertButton[등록].Select (L91) → insertRow()
[E3] deleteButton[삭제].Select (L97) → deleteRow()
       └ [E10] msgBox.DialogHide [YES] (L273) → 서비스 biz.Biz29_Account.delete
[E4] updateButton[저장].Select (L103) → update()
[E5] cancleButton[닫기].Select (L109) → hide()
[E6] searchTextField.KeyPress [Enter] (L116) → retrieve()
[E7] lookupCorp.TriggerClick (L151) → lookupCorp()
[E8] lookupAst.TriggerClick (L158) → lookupAst()
[E9] bankComboBox[BankCode].Collapse (L165) → 인라인 L165-172 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L70-72 | 공개 메서드 | 상태 처리 | 업무 |
| private lookupCorp() | L186-197 | E7 | 조회창 Sys15_Lookup_Corp 열기 | 업무 |
| private lookupAst() | L199-212 | E8 | 조회창 Ast01_Lookup_Info 열기 | 업무 |
| public retrieve() | L214-226 | E1,E6,open | 서비스 biz.Biz29_Account.selectBySearchText(companyId, searchText), 건수 표시 | 업무 |
| public update() | L229-259 | E4 | 서비스 biz.Biz29_Account.update | 업무 |
| public insertRow() | L262-267 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L270-291 | E3 | ConfirmBox → E10 | 업무 |
| private buildGrid() | L146-184 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L293-295 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L297-299 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L301-304 | 공개 메서드 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpNm', 150, '운용사'),  // L175 SQL 계산 컬럼(selectBySearchText: sys15_corp_nm)
  gb.date('startDate', 100, '입금시작일', { editor: 'date' }),  // L176
  gb.text('bankNm', 120, '은행명', { editor: 'select' }),  // L177 SQL 계산 컬럼(selectBySearchText: f_cdnm('BankCode', biz29_bank_cd, biz29…)
  gb.text('accountNo', 180, '계좌번호', { editor: 'text' }),  // L178
  gb.text('accountNm', 120, '예금주명', { editor: 'text' }),  // L179
  gb.text('astClassTreeNm', 150, '연결계좌'),  // L180 SQL 계산 컬럼(selectBySearchText: ast01_class_tree_nm)
  gb.text('note', 250, '비고', { editor: 'text' }),  // L181
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz22_Lookup_FeeChargeCalc (`client/vi/biz/Biz22_Lookup_FeeChargeCalc.java`, 159줄)

- 툴바 `buttonBar`: {retrieveButton} {downloadButton} {downloadForm}
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - termStartDate 90 "구간시작일" Date
  - termCloseDate 90 "구간종료일" Date
  - termDays 65 "구간일수" LongCenter
  - manageMinFee 90 "<span style='color:#456EA6;'>청구기간<br>최저보수</span>" LongHtml
  - manageTermMinFee 90 "<span style='color:#456EA6;'>계산구간<br>최저보수</span>" LongHtml
  - manageTermOccFee 90 "<span style='color:#456EA6;'>계산구간<br>발생보수</span>" LongHtml
  - manageTermWithFee 90 "<span style='color:#456EA6;'>계산구간<br>병행보수</span>" LongHtml
  - manageTermChargeFee 90 "<span style='color:#456EA6;'>청구보수</span>" LongHtml
  - advMinFee 90 "<span style='color:#B36D3D;'>청구기간<br>최저보수</span>" LongHtml
  - advTermMinFee 90 "<span style='color:#B36D3D;'>계산구간<br>최저보수</span>" LongHtml
  - advTermOccFee 90 "<span style='color:#B36D3D;'>계산구간<br>발생보수</span>" LongHtml
  - advTermWithFee 90 "<span style='color:#B36D3D;'>계산구간<br>병행보수</span>" LongHtml
  - advTermChargeFee 90 "<span style='color:#B36D3D;'>청구보수</span>" LongHtml
  - discrMinFee 90 "<span style='color:#258A65;'>청구기간<br>최저보수</span>" Long
  - discrTermMinFee 90 "<span style='color:#258A65;'>계산구간<br>최저보수</span>" Long
  - discrTermOccFee 90 "<span style='color:#258A65;'>계산구간<br>발생보수</span>" Long
  - discrTermWithFee 90 "<span style='color:#258A65;'>계산구간<br>병행보수</span>" Long
  - discrTermChargeFee 90 "<span style='color:#258A65;'>청구보수</span>" Long
  - withYn 70 "병행적용<br>여부" BooleanYn
  - withFee 90 "청구기간<br>병행보수" LongHtml
  - withTermWithFee 90 "계산구간<br>병행보수" LongHtml
  - withTermOccFee 90 "계산구간<br>발생보수" LongHtml
  - withTermChargeFee 90 "계산구간<br>청구보수" LongHtml

#### 이벤트
[E1] retrieveButton[새로고침].Select (L78) → retrieve()
[E2] downloadButton[엑셀다운로드].Select (L84) → 인라인 L84-95 (new SelectHandler(){ @Override public…)
[E3] cancelButton[닫기].Select (L96) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-73 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L75-102 | open | 상태 처리 | 업무 |
| private retrieve() | L144-149 | E1,open | 서비스 biz.Biz22_FeeChargeCalc.selectByContCorpId(contCorpId, chargeDate) | 업무 |
| private buildGrid() | L104-142 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L151-153 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| public setHtmlGridStyle() | L155-158 | buildGrid | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L108 newHeaderGroupMap04newHeaderGroupConfigsetHtmlGridStyle15 100 "운용보수" (biz22_new_header_group_map04new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L109 newHeaderGroupMap09newHeaderGroupConfigsetHtmlGridStyle15 100 "자문보수" (biz22_new_header_group_map09new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L110 newHeaderGroupMap014newHeaderGroupConfigsetHtmlGridStyle15 100 "일임보수" (biz22_new_header_group_map014new_header_group_configset_html_grid_style15 컬럼 없음)
  // ⚠DB없음 L111 newHeaderGroupMap020newHeaderGroupConfigsetHtmlGridStyle14 100 "병행보수" (biz22_new_header_group_map020new_header_group_configset_html_grid_style14 컬럼 없음)
  gb.date('termStartDate', 90, '구간시작일'),  // L114
  gb.date('termCloseDate', 90, '구간종료일'),  // L115
  gb.longCenter('termDays', 65, '구간일수'),  // L116
  // ⚠ 대응 없음 (GridBuilder L117) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L118) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L119) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L120) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L121) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L123) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L124) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L125) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L126) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L127) addLongHtml
  gb.long('discrMinFee', 90, '<span style=\'color:#258A65;\'>청구기간<br>최저보수</span>'),  // L129
  gb.long('discrTermMinFee', 90, '<span style=\'color:#258A65;\'>계산구간<br>최저보수</span>'),  // L130
  gb.long('discrTermOccFee', 90, '<span style=\'color:#258A65;\'>계산구간<br>발생보수</span>'),  // L131
  gb.long('discrTermWithFee', 90, '<span style=\'color:#258A65;\'>계산구간<br>병행보수</span>'),  // L132
  gb.long('discrTermChargeFee', 90, '<span style=\'color:#258A65;\'>청구보수</span>'),  // L133
  gb.booleanYn('withYn', 70, '병행적용<br>여부'),  // L135
  // ⚠ 대응 없음 (GridBuilder L136) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L137) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L138) addLongHtml
  // ⚠ 대응 없음 (GridBuilder L139) addLongHtml
];
```

#### 사용된 버튼들
1. <Button type="reset" onClick={retrieve}>새로고침</Button>
2. <Button type="download" onClick={() => /* 인라인 L84-95 (new SelectHandler(){ @Override public…) */}>엑셀다운로드</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz20_Lookup_FileList (`client/vi/biz/Biz20_Lookup_FileList.java`, 264줄)

- 툴바 `buttonBar`: {uploadButton} {fileUploadForm} {fileDownloadForm} {fileDeleteForm}
- 입력·하위 화면: `viewer` Sys10_Lookup_FileViewer
- 그리드 `grid` (buildGrid()):
  - fileName 500 "파일명" Text
  - size 60 "size(KB)" Double
  - actionCell 80 "파일받기" Cell 편집:downloadCell
  - actionCell 80 "파일삭제" Cell 편집:deleteCell
  - actionCell 80 "미리보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L63-105) → show()
[E1] fileUploadForm.SubmitComplete (L81) → resetFileUpload(), retrieve()
[E2] fileDeleteForm.SubmitComplete (L88) → retrieve()
[E3] uploadButton[파일업로드].Select (L122) → fileUpload()
[E4] closeButton[닫기].Select (L128) → hide()
[E5] fileUpload.Change (L142) → 인라인 L142-149 (new ChangeHandler() { @Override publi…)
[E6] msgBox.DialogHide [YES] (L172) → checkFileDelete()
[E7] fileUpload.Change (L224) → 인라인 L224-231 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L107-114 | 공개 메서드 | 상태 처리 | 업무 |
| private fileUpload() | L137-152 | E3 | 상태 처리 | 업무 |
| private retrieve() | L211-215 | E1,E2,open,checkFileDelete | 서비스 sys.Sys10_File.selectByFeeChargeId(parentId) | 업무 |
| private resetFileUpload() | L217-232 | E1 | 상태 처리 | 업무 |
| private checkFileDelete() | L234-259 | E6 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private settings() | L116-135 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L154-209 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L261-263 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fileNm', 500, '파일명'),  // L202
  gb.double('size', 60, 'size(KB)'),  // L203
  // ⚠ 대응 없음 (GridBuilder L204) addCell
  // ⚠ 대응 없음 (GridBuilder L205) addCell
  // ⚠ 대응 없음 (GridBuilder L206) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={fileUpload}>파일업로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz20_Edit_FeeCharge (`client/vi/biz/Biz20_Edit_FeeCharge.java`, 260줄)

- 입력·하위 화면: `chargeDate` MyDateField, `corpId` LongField, `contCorpId` LongField, `occFee` LongField, `chargeFee` LongField, `tax` LongField, `note` MyTextArea, `corpName` LookupTriggerField, `lookupCorp` Biz13_Lookup_WithCorp

#### 이벤트
[E0] 화면 열림 (생성자 L64-82) → init()
[E1] updateButton[저장].Select (L141) → updateCheck()
[E2] closeButton[닫기].Select (L147) → hide()
[E3] corpName[운용사명].TriggerClick (L161) → 인라인 L161-176 (new TriggerClickHandler(){ @Override …)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L120-137 | 생성자 | 상태 처리 | 업무 |
| private getEditor() | L159-196 | init | 조회창 Biz13_Lookup_WithCorp 열기 | 업무 |
| private updateCheck() | L198-223 | E1 | 서비스 biz.Biz20_FeeCharge.updateCheck(feeChargeId, chargeDate, corpId, companyId) | 업무 |
| private update() | L225-251 | updateCheck | 서비스 biz.Biz20_FeeCharge.modelUpdate | 업무 |
| private settings() | L139-157 | init | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L253-255 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L257-259 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={updateCheck}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz10_Lookup_ContCorp (`client/vi/biz/Biz10_Lookup_ContCorp.java`, 164줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스):
  - contDate 100 "(재)계약일자" Date
  - contCorpName 150 "계약사명" Text
  - contStatusName 100 "계약상태" Text
  - corpStatusName 100 "거래유무" Text
  - trType 100 "거래형태" Text
  - contPeriodName 80 "계약기간" TextCenter
  - startDate 100 "거래개시일" Date
  - closeDate 100 "거래종료일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L92-113) → show()
[E1] searchText.KeyPress [Enter] (L56) → retrieve()
[E2] retrieveButton[조회].Select (L64) → retrieve()
[E3] confirmButton[확인].Select (L71) → hide()
[E4] closeButton[닫기].Select (L83) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-46 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L48-52 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L139-155 | E1,E2,open | 서비스 biz.Biz10_ContCorp.selectByText(companyId, searchText, check, stdYear, statusCode, statusCheck) | 업무 |
| private settings() | L54-90 | open | 미선택 시 alert "계약사 정보를 선택해주세요", 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L115-137 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L157-159 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L161-163 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('contDate', 100, '(재)계약일자'),  // L120
  gb.text('contCorpNm', 150, '계약사명'),  // L121
  gb.text('contStatusNm', 100, '계약상태'),  // L122
  gb.text('corpStatusNm', 100, '거래유무'),  // L123
  gb.text('trType', 100, '거래형태'),  // L124
  gb.textCenter('contPeriodNm', 80, '계약기간'),  // L125
  gb.date('startDate', 100, '거래개시일'),  // L126
  gb.date('closeDate', 100, '거래종료일'),  // L127
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={hide}>확인</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

