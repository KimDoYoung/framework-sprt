# Flt10_Tab_BuyReport

- 종류: 화면
- 메뉴: 준법감시 > 10. 임직원매매 > 매수 사전신고 (#1126)
- 파일: `client/vi/flt/Flt10_Tab_BuyReport.java`
- 함께 쓰는 클래스 3개:
  - `Flt10_Lookup_Item` `client/vi/flt/Flt10_Lookup_Item.java`
  - `Flt10_Lookup_ExpectTr` `client/vi/flt/Flt10_Lookup_ExpectTr.java`
  - `Flt02_Lookup_Emp` `client/vi/flt/Flt02_Lookup_Emp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Flt02_Lookup_Emp:402 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Flt02_Lookup_Emp:271 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `flt.Flt01_CompanyStd.getExpectTrDate` | Flt10_Tab_BuyReport:710 | [`Flt01_CompanyStd.java:41`](../../flt/services/Flt01_CompanyStd.md) | [`flt01_company_std.getExpectTrDate`](../../flt/sql/flt01_company_std.md), [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md) |
| `flt.Flt02_Emp.delete` | Flt02_Lookup_Emp:562 | [`Flt02_Emp.java:59`](../../flt/services/Flt02_Emp.md) | `UpdateDataModel(flt02_emp)` 동적 DELETE |
| `flt.Flt02_Emp.selectByDate` | Flt10_Tab_BuyReport:791 | [`Flt02_Emp.java:39`](../../flt/services/Flt02_Emp.md) | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md) |
| `flt.Flt02_Emp.selectByPersonId` | Flt02_Lookup_Emp:487 | [`Flt02_Emp.java:25`](../../flt/services/Flt02_Emp.md) | [`flt02_emp.selectByPersonId`](../../flt/sql/flt02_emp.md) |
| `flt.Flt02_Emp.update` | Flt02_Lookup_Emp:528 | [`Flt02_Emp.java:54`](../../flt/services/Flt02_Emp.md) | `UpdateDataModel(flt02_emp)` 동적 INSERT/UPDATE → [`flt02_emp.selectById`](../../flt/sql/flt02_emp.md) |
| `flt.Flt03_Account.selectByDate` | Flt10_Tab_BuyReport:948 | [`Flt03_Account.java:50`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByDate`](../../flt/sql/flt03_account.md) |
| `flt.Flt04_Oath.selectByDate` | Flt10_Tab_BuyReport:842 | [`Flt04_Oath.java:35`](../../flt/services/Flt04_Oath.md) | [`flt04_oath.selectByDate`](../../flt/sql/flt04_oath.md) |
| `flt.Flt04_Oath.selectByPersonId` | Flt02_Lookup_Emp:444 | [`Flt04_Oath.java:26`](../../flt/services/Flt04_Oath.md) | [`flt04_oath.selectByPersonId`](../../flt/sql/flt04_oath.md) |
| `flt.Flt04_Oath.updateApprId` | Flt02_Lookup_Emp:426 | [`Flt04_Oath.java:45`](../../flt/services/Flt04_Oath.md) | [`flt04_oath.insertApprId`](../../flt/sql/flt04_oath.md), [`flt04_oath.selectByStratDate`](../../flt/sql/flt04_oath.md), [`flt04_oath.updateApprId`](../../flt/sql/flt04_oath.md) |
| `flt.Flt07_FamilyConsent.deleteByFamilyConsentId` | Flt02_Lookup_Emp:344 | [`Flt07_FamilyConsent.java:22`](../../flt/services/Flt07_FamilyConsent.md) | [`flt07_family_consent.deleteByFamilyConsentId`](../../flt/sql/flt07_family_consent.md) |
| `flt.Flt08_BuyLockup.checkLockup` | Flt10_Tab_BuyReport:499 | [`Flt08_BuyLockup.java:31`](../../flt/services/Flt08_BuyLockup.md) | [`flt01_company_std.selectByDate`](../../flt/sql/flt01_company_std.md), [`flt08_buy_lockup.checkLockup`](../../flt/sql/flt08_buy_lockup.md) |
| `flt.Flt10_Tr.delete` | Flt10_Tab_BuyReport:787 | [`Flt10_Tr.java:711`](../../flt/services/Flt10_Tr.md) | `UpdateDataModel(flt10_tr)` 동적 DELETE |
| `flt.Flt10_Tr.selectByAccountId` | Flt10_Lookup_ExpectTr:177, Flt10_Tab_BuyReport:562 | [`Flt10_Tr.java:112`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectByAccountId`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectInvestLimit` | Flt10_Tab_BuyReport:907 | [`Flt10_Tr.java:75`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectInvestLimit`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.selectItemName` | Flt10_Lookup_Item:147 | [`Flt10_Tr.java:54`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectItemName`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.update` | Flt10_Tab_BuyReport:691 | [`Flt10_Tr.java:670`](../../flt/services/Flt10_Tr.md) | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md), `UpdateDataModel(flt10_tr)` 동적 INSERT/UPDATE → [`flt10_tr.selectById`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.updateStatusCode` | Flt10_Tab_BuyReport:1043, Flt10_Tab_BuyReport:1113 | [`Flt10_Tr.java:521`](../../flt/services/Flt10_Tr.md) | [`flt01_company_std.getExpectTrDate2`](../../flt/sql/flt01_company_std.md), [`flt10_tr.updateStatusCode`](../../flt/sql/flt10_tr.md) |
| `flt.Flt10_Tr.updateUnFill` | Flt10_Tab_BuyReport:1183 | [`Flt10_Tr.java:574`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectSimpleById`](../../flt/sql/flt10_tr.md), [`flt10_tr.updateUnfillYn`](../../flt/sql/flt10_tr.md) |
| `sys.Sys00_Common.selectByFltItemType` | Flt10_Tab_BuyReport:394 | [`Sys00_Common.java:121`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectByFltItemType`](../../sys/sql/sys00_common.md) |
| `sys.Sys10_File.selectByFamilyConsentId` | Flt02_Lookup_Emp:501 | [`Sys10_File.java:252`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByFamilyConsentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Flt02_Lookup_Emp:568 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`adv10_book`](../../../db/tables/adv.md), [`adv11_book_extr`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast09_book`](../../../db/tables/ast.md), [`com50_item`](../../../db/tables/com.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt04_oath`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`flt07_family_consent`](../../../db/tables/flt.md), [`flt08_buy_lockup`](../../../db/tables/flt.md), [`flt09_fund_item`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`fnd10_book`](../../../db/tables/fnd.md), [`fnd11_book_extr`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_emp_kor_nm`, `f_get_biz_date`, `f_get_biz_date2`, `f_get_biz_days`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_floortrcheck`, `f_get_floortrfundholdcheck`, `f_get_floortrrcntbuydate`, `f_get_itemtype_nm`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `getperson`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt10_Tab_BuyReport (`client/vi/flt/Flt10_Tab_BuyReport.java`, 1215줄)

- 레이아웃: north=northVlc, center=centerVlc
- 툴바 `buttonBar01`: 기준일자: {baseDate} {retrieveButton} {periodRetrieveButton} {openButton}
- 툴바 `buttonBar02L`: {searchText} {insertButton} {updateButton} {deleteButton} {fixButton} {cancelButton}
- 툴바 `buttonBar02R`: {unFillButton} {unFillCancelButton}
- 툴바 `limitMsgBar`: {label04}
- 입력·하위 화면: `searchText` TextField 빈칸="검색어 입력 (종목명/종목코드)", `baseDate` MyDateField, `lookup` Flt02_Lookup_Emp, `ItemTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByFltItemType"), `lookupItemInfo` LookupTriggerField
- 그리드 `accountGrid` (buildAccountGrid()):
  - mainAccountYnStr 60 "주계좌" TextCenter
  - familyRelateName 70 "관계" Text
  - corpName 100 "개설기관" Text
  - accountNoDec 200 "계좌번호" Text
  - accountName 100 "계좌명" Text
  - itemTypeName 130 "종목유형" Text
- 그리드 `limitGrid` (buildLimitGrid(), 행번호숨김):
  - checkTypeName 200 "구분" TextCenter
  - yearInvestLimit 110 "연간 투자금액" Long
  - totalInvestAmt 110 "총누적 투자금액" Long
  - turnoverRate 110 "월매매회전율(%)" Double
  - monthBuyCount 110 "월매수주문횟수" Long
  - dayBuyCount 110 "일매수주문횟수" Long
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - regDate 100 "사전신고일" Date
  - trTypeName 80 "구분" TextCenter
  - itemTypeName 200 "종목유형" Text 편집:"456EA6"
  - itemName 230 "종목명" Text 편집:"456EA6"
  - itemCode 110 "종목코드" TextCenter
  - expectTrQty 100 "주문수량" Double 편집:"456EA6"
  - expectTrAmt 150 "주문총액" Long 편집:"456EA6"
  - expectTrDate 100 "주문유효일" Date
  - checkBuyLockup 80 "매수제한" TextCenter
  - checkFundHold 80 "펀드<br>보유종목" TextCenter
  - trReason 150 "매매사유" TextArea 편집:"456EA6"
  - statusName 65 "승인상태" TextCenter
  - unfillYn 60 "미체결" BooleanYn2

#### 이벤트
[E0] 화면 열림 (생성자 L131-212) → settings(), check()
[E1] baseDate.ValueChange (L217) → setOnlyCurr()
[E2] searchText.KeyPress [Enter] (L226) → retrieve()
[E3] openButton[보고주기 변경 및 서약서 서명].Select (L236) → check()
[E4] retrieveButton[조회].Select (L248) → check()
[E5] periodRetrieveButton[기간조회].Select (L254) → lookupPeriod()
[E6] insertButton[등록].Select (L260) → insertRow()
[E7] updateButton[저장].Select (L266) → preUpdate()
       └ [E20] messageBox.DialogHide (L656) → update()
       └ [E21] messageBox.DialogHide (L669) → update()
[E8] deleteButton[삭제].Select (L272) → deleteRow()
       └ [E22] msgBox.DialogHide [YES] (L753) → delete()
[E9] fixButton[승인신청].Select (L278) → fix()
       └ [E23] msgBox.DialogHide [YES] (L1025) → retrieve(), retrieveLimit()
[E10] cancelButton[신청취소].Select (L284) → fixCancel()
       └ [E24] msgBox.DialogHide [YES] (L1086) → retrieve(), retrieveLimit()
[E11] unFillButton[미체결].Select (L290) → updateUnFill()
       └ [E25] messageBox.DialogHide (L1157) → retrieve(), retrieveLimit()
[E12] unFillCancelButton[미체결취소].Select (L296) → updateUnFill()
[E13] accountGrid.RowClick [YES] (L303) → retrieve()
[E14] msgBox.DialogHide [YES] (L318) → retrieve()
[E15] grid.CellClick (L344) → 인라인 L344-357 (new CellClickHandler() { @Override pu…)
[E16] ItemTypeComboBox[sys.Sys00_Common.selectByFltItemType].Collapse (L395) → 인라인 L395-411 (new CollapseHandler() { @Override pub…)
[E17] lookupItemInfo.TriggerClick (L415) → lookupItemMain()
[E18] lookupItemInfo.KeyDown [Enter] (L421) → lookupItemMain()
[E19] msgBox.DialogHide [YES] (L516) → 인라인 L516-530 (YES: Flt10_TrModel data = grid.getSelectionModel().getSelectedItem();, NO: default:
                                break;)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildAccountGrid() | L360-371 | 필드 초기화 | 상태 처리 | 업무 |
| public buildLimitGrid() | L373-385 | 필드 초기화 | 상태 처리 | 업무 |
| private lookupItemMain() | L452-473 | E17,E18 | 미선택 시 alert "종목유형 선택 후 종목 선택이 가능합니다" | 업무 |
| private lookupItem() | L475-485 | lookupItemMain | 조회창 Flt10_Lookup_Item 열기 | 업무 |
| private lookupStkItem() | L487-496 | lookupItemMain | 조회창 Com50_Lookup_StkItem 열기 | 업무 |
| private checkLockup() | L498-544 | lookupStkItem | 확인창 표시, 서비스 flt.Flt08_BuyLockup.checkLockup(companyId, itemCode, stdDate) | 업무 |
| private retrieve() | L546-549 | E2,E13,E14,E23,E24,E25,retrieveAccount,lookupPeriod | 상태 처리 | 업무 |
| private retrieve() | L551-568 | E2,E13,E14,E23,E24,E25,retrieveAccount,lookupPeriod | 서비스 flt.Flt10_Tr.selectByAccountId(companyId, personId, accountId, regDate, trType, searchText), 건수 표시 | 업무 |
| public preUpdate() | L570-687 | E7 | 미선택 시 alert "변경된 내역이 없습니다" → 확인창 E20 | 업무 |
| private update() | L689-703 | E20,E21,preUpdate | 서비스 flt.Flt10_Tr.update | 업무 |
| public insertRow() | L705-748 | E6 | 미선택 시 alert "먼저 계좌를 선택해주세요", 서비스 flt.Flt01_CompanyStd.getExpectTrDate | 업무 |
| public deleteRow() | L750-768 | E8 | ConfirmBox → E22 | 업무 |
| private delete() | L770-788 | E22 | 미선택 시 alert, GridDeleteData flt.Flt10_Tr.delete(체크된 행 목록) | 업무 |
| private check() | L790-871 | 생성자,E3,E4 | 서비스 flt.Flt02_Emp.selectByDate, flt.Flt04_Oath.selectByDate | 업무 |
| private setButtonEnable() | L873-881 | check,retrieveLimit | 상태 처리 | 업무 |
| private setButtonEnable2() | L883-889 | check,setOnlyCurr | 상태 처리 | 업무 |
| private setOnlyCurr() | L891-900 | E1,lookupPeriod | 상태 처리 | 업무 |
| public retrieveLimit() | L902-939 | E23,E24,E25,check,lookupPeriod | 서비스 flt.Flt10_Tr.selectInvestLimit(companyId, personId, stdDate) | 업무 |
| public retrieveAccount() | L941-977 | check | 서비스 flt.Flt03_Account.selectByDate(companyId, personId, setupDate), 건수 표시 | 업무 |
| private lookupPeriod() | L979-1009 | E5 | 조회창 Flt10_Lookup_ExpectTr 열기 | 업무 |
| private fix() | L1011-1070 | E9 | 미선택 시 alert "저장되지 않은 내역이 존재합니다. 저장한 후 신청하세요" → 확인창 E23 | 업무 |
| private fixCancel() | L1072-1140 | E10 | 미선택 시 alert "저장되지 않은 내역이 존재합니다. 저장한 후 신청하세요" → 확인창 E24 | 업무 |
| private updateUnFill() | L1142-1210 | E11,E12 | 미선택 시 alert "선택한 사전신고 내역이 없습니다" → 확인창 E25 | 업무 |
| private settings() | L214-358 | 생성자 | 조회창 Flt02_Lookup_Emp 열기, 확인창 표시, 이벤트 연결, 초기값: baseDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L387-450 | 필드 초기화 | 서비스 sys.Sys00_Common.selectByFltItemType, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L1212-1214 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildAccountGrid = () => [
  gb.textCenter('mainAccountYnStr', 60, '주계좌'),  // L363
  gb.text('familyRelateNm', 70, '관계'),  // L364
  gb.text('corpNm', 100, '개설기관'),  // L365
  gb.text('accountNoDec', 200, '계좌번호'),  // L366
  gb.text('accountNm', 100, '계좌명'),  // L367
  gb.text('itemTypeNm', 130, '종목유형'),  // L368
];

const buildLimitGrid = () => [
  gb.textCenter('checkTypeNm', 200, '구분'),  // L377
  gb.long('yearInvestLimit', 110, '연간 투자금액'),  // L378
  gb.long('totalInvestAmt', 110, '총누적 투자금액'),  // L379
  gb.double('turnoverRate', 110, '월매매회전율(%)'),  // L380
  gb.long('monthBuyCount', 110, '월매수주문횟수'),  // L381
  gb.long('dayBuyCount', 110, '일매수주문횟수'),  // L382
];

const buildGrid = () => [
  gb.date('regDate', 100, '사전신고일'),  // L431
  gb.textCenter('trTypeNm', 80, '구분'),  // L432
  gb.text('itemTypeNm', 200, '종목유형', { editor: 'select' }),  // L433
  gb.text('itemNm', 230, '종목명'),  // L434
  gb.textCenter('itemCd', 110, '종목코드'),  // L435
  gb.double('expectTrQty', 100, '주문수량', { editor: 'number' }),  // L436
  gb.long('expectTrAmt', 150, '주문총액', { editor: 'number' }),  // L437
  gb.date('expectTrDate', 100, '주문유효일'),  // L438
  gb.textCenter('checkBuyLockup', 80, '매수제한'),  // L439
  gb.textCenter('checkFundHold', 80, '펀드<br>보유종목'),  // L440
  gb.textArea('trReason', 150, '매매사유', { editor: 'largeText' }),  // L441
  gb.textCenter('statusNm', 65, '승인상태'),  // L442
  gb.booleanYn2('unfillYn', 60, '미체결'),  // L443
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={check}>조회</Button>
2. <Button type="search" onClick={lookupPeriod}>기간조회</Button>
3. <Button type="download" onClick={check}>보고주기 변경 및 서약서 서명</Button>
4. <Button type="save" onClick={preUpdate}>저장</Button>
5. <Button type="register" onClick={insertRow}>등록</Button>
6. <Button type="delete" onClick={deleteRow}>삭제</Button>
7. <Button type="register" onClick={fix}>승인신청</Button>
8. <Button type="cancel" onClick={fixCancel}>신청취소</Button>
9. <Button type="close" onClick={updateUnFill}>미체결</Button>
10. <Button type="close" onClick={updateUnFill}>미체결취소</Button>

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

### Flt10_Lookup_ExpectTr (`client/vi/flt/Flt10_Lookup_ExpectTr.java`, 205줄)

- 툴바 `buttonBar`: 사전신고일: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="계좌명/종목명"
- 그리드 `grid` (buildGrid(), 체크박스):
  - regDate 100 "사전신고일" Date
  - accountInfo 250 "계좌명" Text
  - itemTypeName 150 "종목유형" Text
  - itemName 250 "종목명" Text
  - itemCode 110 "종목코드" TextCenter
  - expectTrQty 100 "주문수량" Double
  - expectTrAmt 150 "주문총액" Long

#### 이벤트
[E1] searchText.KeyPress [Enter] (L115) → retrieve()
[E2] retrieveButton[조회].Select (L123) → retrieve()
[E3] oKButton[선택].Select (L129) → confirm()
[E4] cancelButton[닫기].Select (L135) → hide()
[E5] grid.CellDoubleClick (L142) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L57-62 | 공개 메서드 | 상태 처리 | 업무 |
| public open() | L64-102 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L166-183 | E1,E2,open | 서비스 flt.Flt10_Tr.selectByAccountId(companyId, personId, startDate, closeDate, searchText, trType), 건수 표시 | 업무 |
| public confirm() | L185-195 | E3,E5 | 미선택 시 alert "선택된 내역이 없습니다" | 업무 |
| private settings() | L104-148 | open | 이벤트 연결, 초기값: startDate=calcDate, closeDate=stdDate | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L150-164 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L197-199 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L201-203 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('regDate', 100, '사전신고일'),  // L155
  gb.text('accountInfo', 250, '계좌명'),  // L156
  gb.text('itemTypeNm', 150, '종목유형'),  // L157
  gb.text('itemNm', 250, '종목명'),  // L158
  gb.textCenter('itemCd', 110, '종목코드'),  // L159
  gb.double('expectTrQty', 100, '주문수량'),  // L160
  gb.long('expectTrAmt', 150, '주문총액'),  // L161
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="select" onClick={confirm}>선택</Button>
3. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt02_Lookup_Emp (`client/vi/flt/Flt02_Lookup_Emp.java`, 603줄)

- 툴바 `buttonBar01`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBar02`: {fileUploadButton}
- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepName` TextField, `FloorTrCheckCycleComboBox` ComboBoxField("FloorTrCheckCycle"), `viewer` Sys10_Lookup_FileViewer, `apprDoc` Apr01_Edit_ApprDoc, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - startDate 120 "적용시작일자" Date 편집:MyDateField
  - yearInvestLimit 300 "연간추가 투자한도 (연봉한도)" Long 편집:LongField
  - checkCycleName 120 "보고주기" Text 편집:FloorTrCheckCycleCo…
- 그리드 `fileGrid` (buildFileGrid(), 체크박스):
  - fileName 690 "첨부파일" TextNotSort
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E1] retrieveButton[조회].Select (L182) → retrieve(), fileRetrieve()
[E2] insertButton[등록].Select (L189) → insertRow()
[E3] updateButton[저장].Select (L195) → update()
[E4] deleteButton[삭제].Select (L201) → deleteRow()
       └ [E14] msgBox.DialogHide [YES] (L542) → delete()
[E5] fileUploadButton[파일업로드].Select (L207) → 인라인 L207-212 (new SelectHandler() { @Override publi…)
[E6] fileDeleteForm.SubmitComplete (L215) → fileRetrieve()
[E7] fileUpload.Change (L223) → 인라인 L223-234 (new ChangeHandler() { @Override publi…)
[E8] fileUploadForm.SubmitComplete (L239) → fileRetrieve()
[E9] classTreeFullName[문서분류].TriggerClick (L248) → openLookupDoc()
[E10] apprButton[상신].Select (L254) → insertLinkApproval()
[E11] closeButton[닫기].Select (L261) → hide()
[E12] FloorTrCheckCycleComboBox[FloorTrCheckCycle].Collapse (L297) → 인라인 L297-304 (new CollapseHandler() { @Override pub…)
[E13] messageBox.DialogHide [YES] (L340) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L116-179 | 공개 메서드 | 상태 처리 | 업무 |
| private defaultName() | L270-290 | open | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private buildFileGrid() | L314-369 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시, 서비스 flt.Flt07_FamilyConsent.deleteByFamilyConsentId(familyConsentId) | 업무 |
| private openLookupDoc() | L372-381 | E9 | 상태 처리 | 업무 |
| private insertLinkApproval() | L383-423 | E10 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById | 업무 |
| private updateApprId() | L425-439 | insertLinkApproval | 서비스 flt.Flt04_Oath.updateApprId(apprId, regDate, personId, companyId) | 업무 |
| private retrieveApprStep() | L441-481 | open,insertLinkApproval,updateApprId | 서비스 flt.Flt04_Oath.selectByPersonId | 업무 |
| public retrieve() | L483-495 | E1,open,checkFileDelete | 서비스 flt.Flt02_Emp.selectByPersonId(companyId, personId) | 업무 |
| public fileRetrieve() | L497-507 | E1,E6,E8,open | 서비스 sys.Sys10_File.selectByFamilyConsentId(personId) | 업무 |
| public update() | L509-529 | E3 | 서비스 flt.Flt02_Emp.update | 업무 |
| public insertRow() | L531-537 | E2 | 상태 처리 | 업무 |
| public deleteRow() | L539-557 | E4 | ConfirmBox → E14 | 업무 |
| private delete() | L559-563 | E14 | GridDeleteData flt.Flt02_Emp.delete(체크된 행 목록) | 업무 |
| private checkFileDelete() | L565-590 | E13 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private settings() | L181-268 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L292-312 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L592-594 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L596-598 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlButtonBottomStyle() | L600-602 | retrieveApprStep | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 120, '적용시작일자', { editor: 'date' }),  // L307
  gb.long('yearInvestLimit', 300, '연간추가 투자한도 (연봉한도)', { editor: 'number' }),  // L308
  gb.text('checkCycleNm', 120, '보고주기', { editor: 'select' }),  // L309 SQL 계산 컬럼(selectById: f_cdnm('FloorTrCheckCycle', flt02_check…)
];

const buildFileGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L363) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L364) addCell
  // ⚠ 대응 없음 (GridBuilder L365) addCell
  // ⚠ 대응 없음 (GridBuilder L366) addCell
];
```

#### 사용된 버튼들
1. <Button type="unknown" onClick={hide}>닫기</Button>
2. <Button type="search" onClick={() => /* retrieve(), fileRetrieve() */}>조회</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="register" onClick={insertRow}>등록</Button>
5. <Button type="delete" onClick={deleteRow}>삭제</Button>
6. <Button type="upload" onClick={() => /* 인라인 L207-212 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>
7. <Button type="register" onClick={insertLinkApproval}>상신</Button>

