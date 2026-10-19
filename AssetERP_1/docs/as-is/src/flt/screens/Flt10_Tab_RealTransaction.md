# Flt10_Tab_RealTransaction

- 종류: 화면
- 메뉴: 준법감시 > 10. 임직원매매 > 정기보고 (#1142)
- 파일: `client/vi/flt/Flt10_Tab_RealTransaction.java`
- 함께 쓰는 클래스 5개:
  - `Flt14_Lookup_RelateAppr` `client/vi/flt/Flt14_Lookup_RelateAppr.java`
  - `Flt11_Lookup_BookList` `client/vi/flt/Flt11_Lookup_BookList.java`
  - `Flt10_Lookup_Item` `client/vi/flt/Flt10_Lookup_Item.java`
  - `Flt05_Lookup_ItemTypeConfirm` `client/vi/flt/Flt05_Lookup_ItemTypeConfirm.java`
  - `Flt03_Lookup_Account` `client/vi/flt/Flt03_Lookup_Account.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Flt10_Tab_RealTransaction:2214, Flt10_Tab_RealTransaction:957 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Flt10_Tab_RealTransaction:2054 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `flt.Flt01_CompanyStd.selectByDate` | Flt11_Lookup_BookList:255 | [`Flt01_CompanyStd.java:36`](../../flt/services/Flt01_CompanyStd.md) | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt02_Emp.selectByDate` | Flt10_Tab_RealTransaction:295, Flt10_Tab_RealTransaction:625 | [`Flt02_Emp.java:39`](../../flt/services/Flt02_Emp.md) | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md) |
| `flt.Flt02_Emp.selectInvestLimit` | Flt10_Tab_RealTransaction:734 | [`Flt02_Emp.java:49`](../../flt/services/Flt02_Emp.md) | [`flt02_emp.selectInvestLimit`](../../flt/sql/flt02_emp.md) |
| `flt.Flt03_Account.getFamilyAccount` | Flt10_Tab_RealTransaction:2082 | [`Flt03_Account.java:36`](../../flt/services/Flt03_Account.md) | [`flt03_account.getFamilyAccount`](../../flt/sql/flt03_account.md) |
| `flt.Flt03_Account.selectByDate` | Flt03_Lookup_Account:158 | [`Flt03_Account.java:50`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByDate`](../../flt/sql/flt03_account.md) |
| `flt.Flt05_ItemType.selectBySearchText` | Flt05_Lookup_ItemTypeConfirm:225 | [`Flt05_ItemType.java:24`](../../flt/services/Flt05_ItemType.md) | [`flt05_item_type.selectBySearchText`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt10_Tr.checkNextAppr` | Flt10_Tab_RealTransaction:1942 | [`Flt10_Tr.java:276`](../../flt/services/Flt10_Tr.md) | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md), [`flt03_account.countAccount`](../../flt/sql/flt03_account.md), [`flt10_tr.checkNextReport`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.checkPreAppr` | Flt10_Tab_RealTransaction:1931 | [`Flt10_Tr.java:211`](../../flt/services/Flt10_Tr.md) | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md), [`flt03_account.countAccount`](../../flt/sql/flt03_account.md), [`flt10_tr.checkReport`](../../flt/sql/flt10_tr.md), [`flt10_tr.getPreReportDate`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.delete` | Flt10_Tab_RealTransaction:1720 | [`Flt10_Tr.java:711`](../../flt/services/Flt10_Tr.md) | `UpdateDataModel(flt10_tr)` 동적 DELETE |
| `flt.Flt10_Tr.deleteApprList` | Flt10_Tab_RealTransaction:1581, Flt10_Tab_RealTransaction:1726 | [`Flt10_Tr.java:602`](../../flt/services/Flt10_Tr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`flt10_tr.updateByApprId`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.deleteUpdate` | Flt10_Tab_RealTransaction:1758 | [`Flt10_Tr.java:639`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.delete`](../../flt/sql/flt10_tr.md), [`flt10_tr.updateTrData`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.getBizDate` | Flt10_Tab_RealTransaction:1837, Flt10_Tab_RealTransaction:1875 | [`Flt10_Tr.java:459`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.getBizDate`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.insertFloorTrBook` | Flt10_Tab_RealTransaction:1606 | [`Flt10_Tr.java:468`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectByPeriod` | Flt10_Tab_RealTransaction:1791 | [`Flt10_Tr.java:158`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByPeriod`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectItemName` | Flt10_Lookup_Item:147 | [`Flt10_Tr.java:54`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectItemName`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.update` | Flt10_Tab_RealTransaction:1573 | [`Flt10_Tr.java:670`](../../flt/services/Flt10_Tr.md) | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md), `UpdateDataModel(flt10_tr)` 동적 INSERT/UPDATE → [`flt10_tr.selectById`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.updateApprId` | Flt10_Tab_RealTransaction:2143 | [`Flt10_Tr.java:504`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.updateApprId`](../../flt/sql/flt10_tr.md) |
| `flt.Flt11_Book.selectByDate` | Flt10_Tab_RealTransaction:2100 | [`Flt11_Book.java:40`](../../flt/services/Flt11_Book.md) | [`flt11_book.selectByDate`](../../flt/sql/flt11_book.md) |
| `flt.Flt11_Book.selectByText` | Flt11_Lookup_BookList:201 | [`Flt11_Book.java:25`](../../flt/services/Flt11_Book.md) | [`flt11_book.selectByText`](../../flt/sql/flt11_book.md) |
| `flt.Flt11_Book.selectByText2` | Flt11_Lookup_BookList:199 | [`Flt11_Book.java:30`](../../flt/services/Flt11_Book.md) | [`flt11_book.selectByText2`](../../flt/sql/flt11_book.md) |
| `flt.Flt12_BookMonth.checkBookMonth` | Flt10_Tab_RealTransaction:709 | [`Flt12_BookMonth.java:31`](../../flt/services/Flt12_BookMonth.md) | [`flt12_book_month.checkBookMonth`](../../flt/sql/flt12_book_month.md) |
| `flt.Flt12_BookMonth.insertBookAmt` | Flt10_Tab_RealTransaction:1354 | [`Flt12_BookMonth.java:75`](../../flt/services/Flt12_BookMonth.md) | [`flt11_book.updateBookAmt`](../../flt/sql/flt11_book.md), [`flt12_book_month.selectInsertBookAmtTarget`](../../flt/sql/flt12_book_month.md), `UpdateDataModel(flt12_book_month)` 동적 INSERT/UPDATE → [`flt12_book_month.selectById`](../../flt/sql/flt12_book_month.md) |
| `flt.Flt12_BookMonth.selectByBookDate` | Flt10_Tab_RealTransaction:1820 | [`Flt12_BookMonth.java:26`](../../flt/services/Flt12_BookMonth.md) | [`flt12_book_month.selectByBookDate`](../../flt/sql/flt12_book_month.md) |
| `flt.Flt12_BookMonth.update` | Flt10_Tab_RealTransaction:1330 | [`Flt12_BookMonth.java:41`](../../flt/services/Flt12_BookMonth.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`flt11_book.updateBookAmt`](../../flt/sql/flt11_book.md), [`flt12_book_month.selectById`](../../flt/sql/flt12_book_month.md), `UpdateDataModel(flt12_book_month)` 동적 INSERT/UPDATE → [`flt12_book_month.selectById`](../../flt/sql/flt12_book_month.md) |
| `flt.Flt14_RelateAppr.insertApprId` | Flt10_Tab_RealTransaction:2151 | [`Flt14_RelateAppr.java:34`](../../flt/services/Flt14_RelateAppr.md) | [`flt14_relate_appr.insertApprId`](../../flt/sql/flt14_relate_appr.md) |
| `flt.Flt14_RelateAppr.selectByStdDate` | Flt10_Tab_RealTransaction:1106, Flt10_Tab_RealTransaction:2197, Flt14_Lookup_RelateAppr:150 | [`Flt14_RelateAppr.java:25`](../../flt/services/Flt14_RelateAppr.md) | [`flt14_relate_appr.selectByStdDate`](../../flt/sql/flt14_relate_appr.md) |
| `sys.Sys00_Common.selectByFltItemType` | Flt10_Tab_RealTransaction:888 | [`Sys00_Common.java:121`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectByFltItemType`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Flt10_Tab_RealTransaction:858 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys09_Code.selectByKindGroupCode` | Flt05_Lookup_ItemTypeConfirm:243 | [`Sys09_Code.java:110`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys12_Calendar.selectByDay` | Flt10_Tab_RealTransaction:1033 | [`Sys12_Calendar.java:31`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.selectByDay`](../../sys/sql/sys12_calendar.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt12_book_month`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`flt14_relate_appr`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_biz_date`, `f_get_biz_days`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_floortrfundholdcheck`, `f_get_floortrrcntbuydate`, `f_get_itemtype_nm`, `f_get_last_day`, `f_get_price_stk`, `f_get_quarter_date`, `f_insert_floortrbook`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_RealTransaction (`client/vi/flt/Flt10_Tab_RealTransaction.java`, 2296줄)

- 레이아웃: north=vlc01, center=vlc02
- 툴바 `buttonBar01`: 보고구분: {dataYearText} 년도: {radio01} {monthComboBox} {radio02} {yearComboBox} 검색: {searchText} {myAccountCheckBox} {retrieveButton} {bookButton}
- 툴바 `buttonBar01_1`: 계좌선택: {accountField} {preTrYnCheckBox} 상신상태: {apprStepName} {apprButton} {apprViewButton} {notice}
- 툴바 `buttonBarBook`: {bookLabel} {updateButton12} {stkEvalButton} {updatePurAmtButton} * 월 매매회전율 계산 시 월말 평가금액이 필요합니다 / * 평가단가: 코스콤 종가 기준 (NXT 종가 기준 평가를 원하실 경우 평가금액 직접 입력):
- 툴바 `buttonBar02`: {trLabel} {insertButton} {updateButton10} {deleteButton} {tempDownloadButton} {excelUploadButton} {itemTypeButton} {uploadExcelForm} {downloadForm}
- 입력·하위 화면: `apprStepCode` TextField, `apprStepName` TextField, `monthComboBox` StringComboBox, `yearComboBox` StringComboBox, `radio01` Radio, `radio02` Radio, `myAccountCheckBox` CheckBox, `preTrYnCheckBox` CheckBox, `dataYearText` TextField, `accountField` LookupTriggerField 빈칸="전체", `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="종목유형/종목명/종목코드", `lookup` Flt03_Lookup_Account, `lookupItemType` Flt05_Lookup_ItemTypeConfirm, `lookupAccount` LookupTriggerField, `trDateField` MyDateField, `TrTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode"), `itemTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByFltItemType"), `lookupItemInfo` LookupTriggerField, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `bookGrid` (bookBuildGrid()):
  - accountNo 250 "계좌" Text
  - bookDate 120 "보유일자" Date
  - itemTypeName 150 "종목유형" Text
  - itemName 250 "종목명" Text
  - itemCode 110 "종목코드" TextCenter
  - bookQty 100 "보유수량" Double
  - bookAmt 150 "평가금액" Long 편집:"0069B4"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - accountInfo 230 "계좌정보" Text 편집:"0069B4"
  - accountRelateName 100 "관계" TextCenter
  - trTypeName 70 "구분" TextCenter 편집:"0069B4"
  - statusName 70 "상태" TextCenter
  - checkPeriod 100 "위반사항" TextCenterCursor
  - regDate 90 "사전신고일" Date
  - itemName 150 "종목명" Text
  - expectTrQty 80 "신고수량" Double
  - expectTrAmt 120 "신고총액" Long
  - actionCell 60 "Copy" Cell 편집:"0069B4"
  - trDate 90 "실거래일" Date 편집:"0069B4"
  - trItemTypeName 150 "종목유형" Text 편집:"0069B4"
  - trItemName 180 "종목명" TextArea 편집:"0069B4"
  - trItemCode 110 "종목코드" TextCenter
  - trQty 80 "매매수량" Double 편집:"0069B4"
  - trAmt 120 "매매총액" Long 편집:"0069B4"
  - trNote 150 "비고" TextArea 편집:TextArea
  - apprRegDate 90 "상신일" Date
  - apprStatusName 100 "상신상태" TextCenter
  - actionCell 60 "상세보기" Cell 편집:detailCell

#### 이벤트
[E0] 화면 열림 (생성자 L187-278) → settings()
[E1] dataYearText.ValueChange (L287) → retrieve()
[E2] accountField.TriggerClick [result == null] (L372) → 인라인 L372-390 (new TriggerClickHandler(){ @Override …)
[E3] toggleGroup.ValueChange (L403) → retrieve()
[E4] yearComboBox[1].Collapse (L464) → retrieve()
[E5] monthComboBox.Collapse (L476) → retrieve()
[E6] searchText.KeyPress [Enter] (L485) → retrieve()
[E7] preTrYnCheckBox[사전신고 포함].ValueChange (L499) → setPreTrColumn(), retrieve()
[E8] retrieveButton[조회].Select (L508) → retrieve()
[E9] bookButton[보유원장 정리].Select (L514) → insertFloorTrBook()
[E10] messageBox.DialogHide (L518) → insertFloorTrBook()
[E11] insertButton[등록].Select (L530) → insertRow()
[E12] updateButton12[저장].Select (L536) → update12()
[E13] stkEvalButton[상장주식 평가처리].Select (L542) → updateEvalAmt()
       └ [E32] msgBox.DialogHide [YES] (L1348) → bookRetrieve()
[E14] updatePurAmtButton[평가금액을 취득금액으로 저장].Select (L548) → updateEvalAmt()
[E15] updateButton10[저장].Select (L554) → updateCheck10()
       └ [E33] msgBox.DialogHide [YES] (L1513) → update10()
[E16] deleteButton[삭제].Select (L560) → deleteCheck()
       └ [E36] msgBox.DialogHide [YES] (L1656) → deleteUpdate()
       └ [E37] msgBox.DialogHide [YES] (L1675) → delete()
       └ [E38] msgBox.DialogHide [YES] (L1695) → delete()
[E17] apprButton[정기보고서 작성].Select (L566) → getDate(), getInvestLimit(), checkEval()
[E18] messageBox.DialogHide (L582) → checkEval()
[E19] messageBox.DialogHide (L595) → checkEval()
[E20] apprViewButton[문서보기].Select (L616) → apprView()
[E21] itemTypeButton[종목유형코드].Select (L622) → setEnableFalse()
[E22] tempDownloadButton[템플릿].Select (L656) → 인라인 L656-661 (new SelectHandler(){ @Override public…)
[E23] excelUploadButton[엑셀업로드].Select (L662) → excelUpload()
[E24] uploadExcelForm.SubmitComplete (L675) → insertFloorTrBook()
[E25] grid.CellClick [event.getCellIndex() == 6] (L687) → 인라인 L687-699 (new CellClickHandler() { @Override pu…)
[E26] lookupAccount.TriggerClick (L824) → 인라인 L824-842 (new TriggerClickHandler() { @Override…)
[E27] trDateField.ValueChange (L846) → checkTrDate()
[E28] TrTypeComboBox[sys.Sys00_Common.selectByKindGroupCode].Collapse (L859) → 인라인 L859-882 (new CollapseHandler() { @Override pub…)
[E29] itemTypeComboBox[sys.Sys00_Common.selectByFltItemType].Collapse (L889) → 인라인 L889-910 (new CollapseHandler() { @Override pub…)
[E30] lookupItemInfo.TriggerClick (L931) → lookupItemMain()
[E31] lookupItemInfo.KeyDown [Enter] (L937) → lookupItemMain()
[E34] messageBox.DialogHide (L1539) → 인라인 L1539-1546 (new DialogHideHandler() { @Override p…)
[E35] messageBox.DialogHide (L1552) → 인라인 L1552-1559 (new DialogHideHandler() { @Override p…)
[E39] msgBox.DialogHide [YES] (L1905) → open()
[E40] fileUploadField.Change (L2249) → 인라인 L2249-2254 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private checkEval() | L704-731 | E17,E18,E19 | 서비스 flt.Flt12_BookMonth.checkBookMonth(companyId, personId, startDate, closeDate, myAccountYn) | 업무 |
| private getInvestLimit() | L733-774 | E17,retrieve | 서비스 flt.Flt02_Emp.selectInvestLimit(companyId, personId, stdDate) | 업무 |
| private setEnableFalse() | L776-797 | E21,settings | 상태 처리 | 업무 |
| public bookBuildGrid() | L799-812 | 필드 초기화 | 상태 처리 | 업무 |
| private setPreTrColumn() | L1013-1029 | E7,settings | 상태 처리 | 업무 |
| private checkTrDate() | L1031-1081 | E27 | 미선택 시 alert "계좌개설일보다 빠를 수 없습니다.", 서비스 sys.Sys12_Calendar.selectByDay | 업무 |
| private apprChk() | L1083-1216 | settings,retrieve,apprView | 서비스 flt.Flt14_RelateAppr.selectByStdDate | 업무 |
| private lookupItemMain() | L1218-1258 | E30,E31 | 미선택 시 alert "계좌 선택 후 종목 선택이 가능합니다" | 업무 |
| private lookupItem() | L1260-1270 | lookupItemMain | 조회창 Flt10_Lookup_Item 열기 | 업무 |
| private lookupStkItem() | L1272-1284 | lookupItemMain | 조회창 Com50_Lookup_StkItem 열기 | 업무 |
| private lookupHoldItem() | L1286-1305 | lookupItemMain | 조회창 Flt11_Lookup_BookList 열기 | 업무 |
| private insertRow() | L1307-1321 | E11 | 상태 처리 | 업무 |
| private update12() | L1323-1336 | E12 | 서비스 flt.Flt12_BookMonth.update | 업무 |
| private updateEvalAmt() | L1338-1380 | E13,E14 | ConfirmBox → E32 | 업무 |
| private updateCheck10() | L1382-1534 | E15 | ConfirmBox → E33 | 업무 |
| private checkInvestLimit() | L1536-1566 | updateCheck10 | 확인창 표시 | 업무 |
| private update10() | L1568-1602 | E33,updateCheck10 | 서비스 flt.Flt10_Tr.update, flt.Flt10_Tr.deleteApprList(apprList, personId) | 업무 |
| private insertFloorTrBook() | L1604-1629 | E9,E10,E24,update10,delete,deleteUpdate | 서비스 flt.Flt10_Tr.insertFloorTrBook(companyId, personId, accountId, itemType, itemName, itemCode, startDate) | 업무 |
| private deleteCheck() | L1631-1712 | E16 | 미선택 시 alert "삭제할 내용을 선택해주세요" → 확인창 E36 | 업무 |
| private delete() | L1714-1752 | E37,E38 | GridDeleteData flt.Flt10_Tr.delete, flt.Flt10_Tr.deleteApprList, flt.Flt10_Tr.delete(체크된 행 목록) | 업무 |
| private deleteUpdate() | L1754-1769 | E36 | 서비스 flt.Flt10_Tr.deleteUpdate(deleteList) | 업무 |
| private retrieve() | L1771-1806 | E1,E3,E4,E5,E6,E7,E8,settings,buildGrid,insertFloorTrBook,delete,deleteUpdate,updateApprId | 서비스 flt.Flt10_Tr.selectByPeriod(companyId, personId, accountId, trType, startDate, closeDate, searchText, myAccountYn, preTrYn), 건수 표시 | 업무 |
| private bookRetrieve() | L1808-1826 | E32,update12,retrieve | 서비스 flt.Flt12_BookMonth.selectByBookDate(companyId, personId, accountId, startDate, closeDate, searchText, myAccountYn), 건수 표시 | 업무 |
| private getDate() | L1828-1891 | E17,settings,checkTrDate,retrieve | 서비스 flt.Flt10_Tr.getBizDate, flt.Flt10_Tr.getBizDate(companyId, baseDate, companyId, baseDate) | 업무 |
| private openCheck() | L1893-1928 | checkEval | 확인창 표시 | 업무 |
| private checkAppr() | L1930-1965 | openCheck | 서비스 flt.Flt10_Tr.checkPreAppr, flt.Flt10_Tr.checkNextAppr(companyId, personId, stdDate, companyId, personId, stdDate) | 업무 |
| private open() | L1967-2079 | E39,openCheck | 조회창 Dcr01_Lookup_Class 열기, 미선택 시 alert "매매내역에서 실거래내역을 먼저 입력해주세요", 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private familyAccountYn() | L2081-2097 | open | 서비스 flt.Flt03_Account.getFamilyAccount | 업무 |
| private insertLinkApprovals() | L2099-2134 | familyAccountYn | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 flt.Flt11_Book.selectByDate | 업무 |
| private updateApprId() | L2136-2166 | insertLinkApprovals | 서비스 flt.Flt10_Tr.updateApprId, flt.Flt14_RelateAppr.insertApprId(apprId, apprId, personId, stdDate, checkCycle) | 업무 |
| private apprView() | L2168-2238 | E20 | 조회창 Flt14_Lookup_RelateAppr 열기, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 flt.Flt14_RelateAppr.selectByStdDate, apr.Apr01_Appr.selectById | 업무 |
| private excelUpload() | L2240-2257 | E23 | 상태 처리 | 업무 |
| private settings() | L280-702 | 생성자 | 조회창 Flt03_Lookup_Account 열기, 조회창 Flt05_Lookup_ItemTypeConfirm 열기, 확인창 표시, 서비스 flt.Flt02_Emp.selectByDate, flt.Flt02_Emp.selectByDate, 이벤트 연결, 초기값: dataYearText=startYear, radio01=false("월별"), radio02=true("분기별"), radio01=true("월별"), radio02=false("분기별"), accountField="전체", accountField=resultModel.getAccountName(, dataYearText=DateTimeFormat.getFormat("yyyy", myAccountCheckBox=false("본인계좌만 조회"), preTrYnCheckBox=true("사전신고 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L814-1011 | 필드 초기화 | 조회창 Flt03_Lookup_Account 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "상신문서가 없습니다. 먼저 상신을 진행해주세요", 서비스 sys.Sys00_Common.selectByKindGroupCode, sys.Sys00_Common.selectByFltItemType, apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| public setHtmlGridStyle() | L2263-2271 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L2273-2275 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L2277-2279 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L2281-2283 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlRadioLabelStyle12() | L2285-2287 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L2289-2291 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L2293-2295 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const bookBuildGrid = () => [
  gb.text('accountNo', 250, '계좌'),  // L803 SQL 계산 컬럼(selectById: TO_DECRYPTS(flt03_account_no) || ' (' |…)
  gb.date('bookDate', 120, '보유일자'),  // L804
  gb.text('itemTypeNm', 150, '종목유형'),  // L805 SQL 계산 컬럼(selectById: flt05_item_type_nm)
  gb.text('itemNm', 250, '종목명'),  // L806
  gb.textCenter('itemCd', 110, '종목코드'),  // L807
  gb.double('bookQty', 100, '보유수량'),  // L808 SQL 계산 컬럼(selectById: flt11_book_qty)
  gb.long('bookAmt', 150, '평가금액', { editor: 'number' }),  // L809
];

const buildGrid = () => [
  // ⚠DB없음 L818 newHeaderGroupMap05newHeaderGroupConfig16 100 "사전승인" (flt01_new_header_group_map05new_header_group_config16 컬럼 없음)
  gb.text('accountInfo', 230, '계좌정보'),  // L982
  gb.textCenter('accountRelateNm', 100, '관계'),  // L983
  gb.textCenter('trTypeNm', 70, '구분', { editor: 'select' }),  // L984
  gb.textCenter('statusNm', 70, '상태'),  // L985
  // ⚠ 대응 없음 (GridBuilder L986) addTextCenterCursor
  gb.date('regDate', 90, '사전신고일'),  // L987
  gb.text('itemNm', 150, '종목명'),  // L989
  gb.double('expectTrQty', 80, '신고수량'),  // L990
  gb.long('expectTrAmt', 120, '신고총액'),  // L991
  // ⚠ 대응 없음 (GridBuilder L992) addCell
  gb.date('trDate', 90, '실거래일', { editor: 'date' }),  // L993
  gb.text('trItemTypeNm', 150, '종목유형', { editor: 'select' }),  // L994
  gb.textArea('trItemNm', 180, '종목명'),  // L995
  gb.textCenter('trItemCd', 110, '종목코드'),  // L996
  gb.double('trQty', 80, '매매수량', { editor: 'number' }),  // L997
  gb.long('trAmt', 120, '매매총액', { editor: 'number' }),  // L998
  gb.textArea('trNote', 150, '비고', { editor: 'largeText' }),  // L999
  gb.date('apprRegDate', 90, '상신일'),  // L1000
  gb.textCenter('apprStatusNm', 100, '상신상태'),  // L1001
  // ⚠ 대응 없음 (GridBuilder L1002) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="view" onClick={insertFloorTrBook}>보유원장 정리</Button>
3. <Button type="save" onClick={updateCheck10}>저장</Button>
4. <Button type="register" onClick={insertRow}>등록</Button>
5. <Button type="delete" onClick={deleteCheck}>삭제</Button>
6. <Button type="register" onClick={() => /* getDate(), getInvestLimit(), checkEval() */}>정기보고서 작성</Button>
7. <Button type="search" onClick={apprView}>문서보기</Button>
8. <Button type="download" onClick={() => /* 인라인 L656-661 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
9. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>
10. <Button type="unknown" onClick={setEnableFalse}>종목유형코드</Button>
11. <Button type="save" onClick={update12}>저장</Button>
12. <Button type="save" onClick={updateEvalAmt}>상장주식 평가처리</Button>
13. <Button type="unknown" onClick={updateEvalAmt}>평가금액을 취득금액으로 저장</Button>

### Flt14_Lookup_RelateAppr (`client/vi/flt/Flt14_Lookup_RelateAppr.java`, 163줄)

- 툴바 `buttonBar`: {retrieveButton}
- 입력·하위 화면: `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - apprRegDate 100 "상신일자" Date
  - apprTitle 400 "상신제목" Text
  - apprStatusName 100 "상태" TextCenter
  - actionCell 80 "문서보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L48-56) → 초기화
[E1] retrieveButton[조회].Select (L80) → retrieve()
[E2] cancelButton[닫기].Select (L86) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L58-77 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L143-156 | E1,open,buildGrid | 서비스 flt.Flt14_RelateAppr.selectByStdDate(stdDate, personId) | 업무 |
| private settings() | L79-94 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L96-141 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "문서가 존재하지않습니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L159-161 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('apprRegDate', 100, '상신일자'),  // L135 SQL 계산 컬럼(selectByStdDate: apr01_reg_date)
  gb.text('apprTitle', 400, '상신제목'),  // L136 SQL 계산 컬럼(selectByStdDate: apr01_title)
  gb.textCenter('apprStatusName', 100, '상태'),  // L137 SQL 계산 컬럼(selectByStdDate: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L138) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt11_Lookup_BookList (`client/vi/flt/Flt11_Lookup_BookList.java`, 347줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="종목코드/명"
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bookDate 100 "보유기준일" Date
  - accountNo 200 "계좌" Text
  - itemTypeName 150 "종목유형" Text
  - itemName 200 "종목명" Text
  - itemCode 110 "종목코드" TextCenter
  - bookAmt 120 "보유금액" Long
  - bookQty 80 "보유수량" Double
  - bookDays 100 "보유기간" TextCenter
  - buyDate 100 "최근매수일" Date
  - checkFundHoldYn 60 "펀드종목" BooleanYn2

#### 이벤트
[E1] searchText.KeyPress [Enter] (L132) → retrieve()
[E2] retrieveButton[조회].Select (L140) → retrieve()
[E3] oKButton[선택].Select (L146) → confirm()
       └ [E6] msgBox.DialogHide [YES] (L230) → confirmNext()
[E4] cancelButton[닫기].Select (L152) → hide()
[E5] grid.CellDoubleClick (L159) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L63-68 | view | 상태 처리 | 업무 |
| public open() | L70-78 | view | 상태 처리 | 업무 |
| public open() | L80-87 | view | 상태 처리 | 업무 |
| public view() | L89-97 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L99-127 | view | 상태 처리 | 업무 |
| public retrieve() | L187-210 | E1,E2,open | 서비스 flt.Flt11_Book.selectByText2, flt.Flt11_Book.selectByText(companyId, personId, accountId, stdDate, searchText), 건수 표시 | 업무 |
| public confirm() | L212-249 | E3,E5 | ConfirmBox → E6 | 업무 |
| private confirmNext() | L251-329 | E6,confirm | 미선택 시 alert "의무보유기간 기준일수가 등록되어 있지 않습니다. 내부통제 관리자에게 문의하세요" → 확인창 E7 | 업무 |
| private confirmEnd() | L331-337 | E7,confirmNext | 상태 처리 | 업무 |
| private settings() | L129-165 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L167-185 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L339-341 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L343-345 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('bookDate', 100, '보유기준일'),  // L173
  gb.text('accountNo', 200, '계좌'),  // L174 SQL 계산 컬럼(selectByText2: TO_DECRYPTS(flt03_account_no) || ' (' |…)
  gb.text('itemTypeNm', 150, '종목유형'),  // L175 SQL 계산 컬럼(selectByText2: flt05_item_type_nm)
  gb.text('itemNm', 200, '종목명'),  // L176
  gb.textCenter('itemCd', 110, '종목코드'),  // L177
  gb.long('bookAmt', 120, '보유금액'),  // L178
  gb.double('bookQty', 80, '보유수량'),  // L179
  gb.textCenter('bookDays', 100, '보유기간'),  // L180 SQL 계산 컬럼(selectByText2: CASE WHEN flt11_buy_date IS NULL THEN '…)
  gb.date('buyDate', 100, '최근매수일'),  // L181 SQL 계산 컬럼(selectByText2: f_get_floorTrRcntBuyDate( flt11_company…)
  gb.booleanYn2('checkFundHoldYn', 60, '펀드종목'),  // L182 SQL 계산 컬럼(selectByText2: f_get_floorTrFundHoldCheck( flt11_compa…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt10_Lookup_Item (`client/vi/flt/Flt10_Lookup_Item.java`, 176줄)

- 툴바 `buttonBar`: 종목명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid()):
  - itemTypeName 150 "종목유형" Text
  - itemName 270 "종목명" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L93) → retrieve()
[E2] retrieveButton[조회].Select (L102) → retrieve()
[E3] oKButton[선택].Select (L108) → confirm()
[E4] cancelButton[닫기].Select (L114) → hide()
[E5] grid.CellDoubleClick (L121) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L49-54 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L56-60 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L62-90 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L139-153 | E1,E2,open | 서비스 flt.Flt10_Tr.selectItemName(companyId, personId, stdDate, searchText) | 업무 |
| public confirm() | L155-166 | E3,E5 | 미선택 시 alert "선택된 종목이 없습니다" | 업무 |
| private settings() | L92-127 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L129-137 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L168-170 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L172-174 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemTypeNm', 150, '종목유형'),  // L133
  gb.text('itemNm', 270, '종목명'),  // L134
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt05_Lookup_ItemTypeConfirm (`client/vi/flt/Flt05_Lookup_ItemTypeConfirm.java`, 315줄)

- 툴바 `buttonBar01`: 검색: {searchText} {retrieveButton} 검색: {searchText} {retrieveButton}
- 툴바 `buttonBar02`: {notice} {notice}
- 입력·하위 화면: `searchText` TextField 빈칸="종목유형명"
- 그리드 `grid` (buildGrid(), 행번호숨김):
  - itemTypeCode 90 "종목유형코드" TextCenter
  - itemTypeName 250 "종목유형명" Text
- 그리드 `trTypeGrid` (trTypebuildGrid(), 행번호숨김):
  - code 80 "구분코드" TextCenter
  - name 250 "구분명" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L145) → retrieve()
[E2] retrieveButton[조회].Select (L153) → retrieve()
[E3] cancelButton[닫기].Select (L159) → hide()
[E4] grid.CellDoubleClick (L165) → getCellValue(), showCopyNotice()
[E5] trTypeGrid.CellDoubleClick (L180) → getCellValue(), showCopyNotice()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-93 | 공개 메서드 | 상태 처리 | 업무 |
| public openGroup() | L95-142 | 공개 메서드 | 상태 처리 | 업무 |
| private trTypebuildGrid() | L208-217 | 필드 초기화 | 상태 처리 | 업무 |
| private retrieve() | L219-234 | E1,E2,open,openGroup | 서비스 flt.Flt05_ItemType.selectBySearchText(companyId, searchText) | 업무 |
| private retrieveTrType() | L236-249 | retrieve | 서비스 sys.Sys09_Code.selectByKindGroupCode(companyId, applyDate, kindGroupCode) | 업무 |
| private getCellValue() | L252-259 | E4,E5 | 상태 처리 | 업무 |
| private getCellValue() | L262-269 | E4,E5 | 상태 처리 | 업무 |
| private showCopyNotice() | L281-301 | E4,E5 | 상태 처리 | 업무 |
| private settings() | L144-195 | open,openGroup | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L197-206 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L303-305 | open,openGroup | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L307-309 | open,openGroup | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L311-313 | showCopyNotice,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('itemTypeCd', 90, '종목유형코드'),  // L203
  gb.text('itemTypeNm', 250, '종목유형명'),  // L204
];

const trTypebuildGrid = () => [
  gb.textCenter('code', 80, '구분코드'),  // L214
  gb.text('name', 250, '구분명'),  // L215
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt03_Lookup_Account (`client/vi/flt/Flt03_Lookup_Account.java`, 187줄)

- 툴바 `buttonBar`: 기준일: {baseDateField} {retrieveButton}
- 입력·하위 화면: `baseDateField` MyDateField
- 그리드 `grid` (buildGrid()):
  - mainAccountYnStr 60 "주계좌" TextCenter
  - corpName 100 "개설기관" Text
  - accountNoDec 200 "계좌번호" Text
  - accountName 100 "계좌명" Text
  - itemTypeName 130 "종목유형" Text

#### 이벤트
[E0] 화면 열림 (생성자 L80-136) → show()
[E1] retrieveButton[조회].Select (L87) → retrieve()
[E2] oKButton[확인].Select (L93) → confirm()
[E3] nullButton[전체].Select (L99) → hide()
[E4] cancelButton[닫기].Select (L106) → hide()
[E5] grid.CellDoubleClick (L124) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public openNull() | L46-58 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L60-68 | 공개 메서드 | 상태 처리 | 업무 |
| public openDateLock() | L70-78 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L150-164 | E1,openNull,open,openDateLock | 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate), 건수 표시 | 업무 |
| public confirm() | L166-177 | E2,E5 | 미선택 시 alert "선택된 계좌정보가 없습니다" | 업무 |
| private buildGrid() | L138-148 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L179-181 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L183-185 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('mainAccountYnStr', 60, '주계좌'),  // L141
  gb.text('corpNm', 100, '개설기관'),  // L142
  gb.text('accountNoDec', 200, '계좌번호'),  // L143
  gb.text('accountNm', 100, '계좌명'),  // L144
  gb.text('itemTypeNm', 130, '종목유형'),  // L145
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="unknown" onClick={hide}>전체</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

