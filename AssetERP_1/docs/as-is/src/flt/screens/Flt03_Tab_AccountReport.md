# Flt03_Tab_AccountReport

- 종류: 화면
- 메뉴: 준법감시 > 10. 임직원매매 > 계좌신고 (#1125)
- 파일: `client/vi/flt/Flt03_Tab_AccountReport.java`
- 함께 쓰는 클래스 9개:
  - `Flt13_Lookup_BookInit` `client/vi/flt/Flt13_Lookup_BookInit.java`
  - `Flt10_Lookup_Item` `client/vi/flt/Flt10_Lookup_Item.java`
  - `Flt05_Lookup_ItemTypeConfirm` `client/vi/flt/Flt05_Lookup_ItemTypeConfirm.java`
  - `Flt03_Lookup_Account` `client/vi/flt/Flt03_Lookup_Account.java`
  - `Flt06_TabPage_AccountClose` `client/vi/flt/Flt06_TabPage_AccountClose.java`
  - `Flt03_Lookup_MainAccount` `client/vi/flt/Flt03_Lookup_MainAccount.java`
  - `Flt03_Lookup_ItemType` `client/vi/flt/Flt03_Lookup_ItemType.java`
  - `Flt03_Lookup_AccountClose` `client/vi/flt/Flt03_Lookup_AccountClose.java`
  - `Flt02_Lookup_Emp` `client/vi/flt/Flt02_Lookup_Emp.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Com50_Lookup_StkItem`](../../com/components/Com50_Lookup_StkItem.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md), [`Sys15_Lookup_Corp`](../../sys/components/Sys15_Lookup_Corp.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Flt02_Lookup_Emp:402, Flt03_Tab_AccountReport:384, Flt06_TabPage_AccountClose:141 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Flt02_Lookup_Emp:271, Flt03_Tab_AccountReport:258, Flt06_TabPage_AccountClose:118 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `flt.Flt02_Emp.delete` | Flt02_Lookup_Emp:562 | [`Flt02_Emp.java:59`](../../flt/services/Flt02_Emp.md) | `UpdateDataModel(flt02_emp)` 동적 DELETE |
| `flt.Flt02_Emp.selectByDate` | Flt03_Tab_AccountReport:274 | [`Flt02_Emp.java:39`](../../flt/services/Flt02_Emp.md) | [`flt02_emp.selectByDate`](../../flt/sql/flt02_emp.md) |
| `flt.Flt02_Emp.selectByPersonId` | Flt02_Lookup_Emp:487 | [`Flt02_Emp.java:25`](../../flt/services/Flt02_Emp.md) | [`flt02_emp.selectByPersonId`](../../flt/sql/flt02_emp.md) |
| `flt.Flt02_Emp.update` | Flt02_Lookup_Emp:528 | [`Flt02_Emp.java:54`](../../flt/services/Flt02_Emp.md) | `UpdateDataModel(flt02_emp)` 동적 INSERT/UPDATE → [`flt02_emp.selectById`](../../flt/sql/flt02_emp.md) |
| `flt.Flt03_Account.delete` | Flt03_Tab_AccountReport:604 | [`Flt03_Account.java:110`](../../flt/services/Flt03_Account.md) | [`flt10_tr.checkTrByAccountId`](../../flt/sql/flt10_tr.md), `UpdateDataModel(flt03_account)` 동적 DELETE |
| `flt.Flt03_Account.getItemTypeName` | Flt03_Lookup_ItemType:210 | [`Flt03_Account.java:66`](../../flt/services/Flt03_Account.md) | [`flt03_account.getItemTypeName`](../../flt/sql/flt03_account.md) |
| `flt.Flt03_Account.selectByDate` | Flt03_Lookup_Account:158 | [`Flt03_Account.java:50`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByDate`](../../flt/sql/flt03_account.md) |
| `flt.Flt03_Account.selectByPersonId` | Flt03_Lookup_MainAccount:94, Flt03_Tab_AccountReport:448 | [`Flt03_Account.java:27`](../../flt/services/Flt03_Account.md) | [`flt03_account.selectByPersonId`](../../flt/sql/flt03_account.md) |
| `flt.Flt03_Account.update` | Flt03_Lookup_MainAccount:126, Flt03_Tab_AccountReport:533 | [`Flt03_Account.java:96`](../../flt/services/Flt03_Account.md) | [`dbConfig.getEncrypts`](../../utils/sql/dbConfig.md), `UpdateDataModel(flt03_account)` 동적 INSERT/UPDATE → [`flt03_account.selectById`](../../flt/sql/flt03_account.md) |
| `flt.Flt03_Account.updateApprId` | Flt03_Tab_AccountReport:704 | [`Flt03_Account.java:75`](../../flt/services/Flt03_Account.md) | [`flt03_account.updateApprId`](../../flt/sql/flt03_account.md) |
| `flt.Flt04_Oath.selectByDate` | Flt03_Tab_AccountReport:302 | [`Flt04_Oath.java:35`](../../flt/services/Flt04_Oath.md) | [`flt04_oath.selectByDate`](../../flt/sql/flt04_oath.md) |
| `flt.Flt04_Oath.selectByPersonId` | Flt02_Lookup_Emp:444 | [`Flt04_Oath.java:26`](../../flt/services/Flt04_Oath.md) | [`flt04_oath.selectByPersonId`](../../flt/sql/flt04_oath.md) |
| `flt.Flt04_Oath.updateApprId` | Flt02_Lookup_Emp:426 | [`Flt04_Oath.java:45`](../../flt/services/Flt04_Oath.md) | [`flt04_oath.insertApprId`](../../flt/sql/flt04_oath.md), [`flt04_oath.selectByStratDate`](../../flt/sql/flt04_oath.md), [`flt04_oath.updateApprId`](../../flt/sql/flt04_oath.md) |
| `flt.Flt05_ItemType.selectBySearchText` | Flt05_Lookup_ItemTypeConfirm:225 | [`Flt05_ItemType.java:24`](../../flt/services/Flt05_ItemType.md) | [`flt05_item_type.selectBySearchText`](../../flt/sql/flt05_item_type.md) |
| `flt.Flt06_AccountClose.delete` | Flt06_TabPage_AccountClose:234 | [`Flt06_AccountClose.java:90`](../../flt/services/Flt06_AccountClose.md) | `UpdateDataModel(flt06_account_close)` 동적 DELETE |
| `flt.Flt06_AccountClose.insert` | Flt03_Lookup_AccountClose:86 | [`Flt06_AccountClose.java:36`](../../flt/services/Flt06_AccountClose.md) | [`flt06_account_close.insert`](../../flt/sql/flt06_account_close.md), [`flt11_book.checkBookQtyByAccountId`](../../flt/sql/flt11_book.md) |
| `flt.Flt06_AccountClose.selectByPersonId` | Flt06_TabPage_AccountClose:189 | [`Flt06_AccountClose.java:27`](../../flt/services/Flt06_AccountClose.md) | [`flt06_account_close.selectByPersonId`](../../flt/sql/flt06_account_close.md) |
| `flt.Flt06_AccountClose.updateApprId` | Flt06_TabPage_AccountClose:298 | [`Flt06_AccountClose.java:64`](../../flt/services/Flt06_AccountClose.md) | [`flt06_account_close.updateApprId`](../../flt/sql/flt06_account_close.md) |
| `flt.Flt07_FamilyConsent.deleteByFamilyConsentId` | Flt02_Lookup_Emp:344 | [`Flt07_FamilyConsent.java:22`](../../flt/services/Flt07_FamilyConsent.md) | [`flt07_family_consent.deleteByFamilyConsentId`](../../flt/sql/flt07_family_consent.md) |
| `flt.Flt10_Tr.countByTrDate` | Flt13_Lookup_BookInit:627 | [`Flt10_Tr.java:442`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.countByTrDate`](../../flt/sql/flt10_tr.md), [`flt14_relate_appr.checkAppr`](../../flt/sql/flt14_relate_appr.md) |
| `flt.Flt10_Tr.selectItemName` | Flt10_Lookup_Item:147 | [`Flt10_Tr.java:54`](../../flt/services/Flt10_Tr.md) | [`flt10_tr.selectItemName`](../../flt/sql/flt10_tr.md) |
| `flt.Flt13_BookInit.delete` | Flt13_Lookup_BookInit:570 | [`Flt13_BookInit.java:131`](../../flt/services/Flt13_BookInit.md) | [`flt05_item_type.selectByItemType`](../../flt/sql/flt05_item_type.md), [`flt11_book.deleteByItemName`](../../flt/sql/flt11_book.md), `UpdateDataModel(flt13_book_init)` 동적 DELETE |
| `flt.Flt13_BookInit.getInfo` | Flt03_Tab_AccountReport:662 | [`Flt13_BookInit.java:36`](../../flt/services/Flt13_BookInit.md) | [`flt13_book_init.getInfo`](../../flt/sql/flt13_book_init.md) |
| `flt.Flt13_BookInit.getInitDate` | Flt13_Lookup_BookInit:268 | [`Flt13_BookInit.java:56`](../../flt/services/Flt13_BookInit.md) | [`flt13_book_init.getInitDate`](../../flt/sql/flt13_book_init.md) |
| `flt.Flt13_BookInit.selectByPersonId` | Flt13_Lookup_BookInit:433 | [`Flt13_BookInit.java:31`](../../flt/services/Flt13_BookInit.md) | [`flt13_book_init.selectByPersonId`](../../flt/sql/flt13_book_init.md) |
| `flt.Flt13_BookInit.update` | Flt13_Lookup_BookInit:515 | [`Flt13_BookInit.java:67`](../../flt/services/Flt13_BookInit.md) | [`flt05_item_type.selectByItemType`](../../flt/sql/flt05_item_type.md), [`flt10_tr.insertFloorTrBook`](../../flt/sql/flt10_tr.md), [`flt11_book.deleteByItemName`](../../flt/sql/flt11_book.md), [`flt11_book.insertByFlt13`](../../flt/sql/flt11_book.md), `UpdateDataModel(flt13_book_init)` 동적 INSERT/UPDATE → [`flt13_book_init.selectById`](../../flt/sql/flt13_book_init.md) |
| `sys.Sys00_Common.selectByFltItemType` | Flt13_Lookup_BookInit:335 | [`Sys00_Common.java:121`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectByFltItemType`](../../sys/sql/sys00_common.md) |
| `sys.Sys09_Code.selectByKindGroupCode` | Flt05_Lookup_ItemTypeConfirm:243 | [`Sys09_Code.java:110`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByFamilyConsentId` | Flt02_Lookup_Emp:501 | [`Sys10_File.java:252`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByFamilyConsentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Flt02_Lookup_Emp:568 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys12_Calendar.selectByDay` | Flt13_Lookup_BookInit:286 | [`Sys12_Calendar.java:31`](../../sys/services/Sys12_Calendar.md) | [`sys12_calendar.selectByDay`](../../sys/sql/sys12_calendar.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt02_emp`](../../../db/tables/flt.md), [`flt03_account`](../../../db/tables/flt.md), [`flt04_oath`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`flt06_account_close`](../../../db/tables/flt.md), [`flt07_family_consent`](../../../db/tables/flt.md), [`flt10_tr`](../../../db/tables/flt.md), [`flt11_book`](../../../db/tables/flt.md), [`flt13_book_init`](../../../db/tables/flt.md), [`flt14_relate_appr`](../../../db/tables/flt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_dcr_no`, `f_get_emptrans`, `f_get_itemtype_nm`, `f_insert_floortrbook`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_trunc`, `getperson`, `to_decrypts`, `to_encrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Flt03_Tab_AccountReport (`client/vi/flt/Flt03_Tab_AccountReport.java`, 770줄)

- 레이아웃: center=vlc, south=tabPage
- 툴바 `buttonBar01`: {openButton}
- 툴바 `buttonBar02`: {retrieveButton} {insertButton} {updateButton} {deleteButton} {cancleButton} {mainAccountButton} {initBookButton}
- 툴바 `buttonBar03`: 문서분류: {classTreeFullName} {apprButton}
- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="문서분류를 선택해주세요", `tabPage` Flt06_TabPage_AccountClose, `lookup` Flt02_Lookup_Emp, `AccountRegReasonComboBox` ComboBoxField("AccountRegReason"), `FamilyRelateComboBox` ComboBoxField("FamilyRelateCode"), `corpLookup` LookupTriggerField, `itemLookup` LookupTriggerField, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc, `lookupAccountClose` Flt03_Lookup_AccountClose
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - setupDate 90 "계좌개설일" Date 편집:MyDateField
  - regReasonName 100 "신고사유" Text 편집:AccountRegReasonCom…
  - familyRelateName 80 "관계" Text 편집:FamilyRelateComboBox
  - mainAccountYn 70 "주 계좌" Boolean
  - accountName 150 "계좌명의" Text 편집:TextField
  - accountNoDec 180 "계좌번호" Text 편집:TextField
  - corpName 150 "개설기관" Text 편집:corpLookup
  - corpBranchName 150 "개설점포" Text 편집:TextField
  - itemTypeName 150 "종목유형" Text 편집:itemLookup
  - note 150 "비고" Text 편집:TextField
  - apprRegDate 90 "상신일" Date
  - apprStatusName 80 "상신상태" TextCenter
  - actionCell 80 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L110-163) → settings(), check(), retrieve()
[E1] openButton[보고주기 변경 및 서약서 서명].Select (L174) → check()
[E2] retrieveButton[조회].Select (L186) → retrieve()
[E3] insertButton[등록].Select (L192) → insertRow()
[E4] updateButton[저장].Select (L198) → update()
[E5] deleteButton[삭제].Select (L204) → deleteRow()
       └ [E15] msgBox.DialogHide [YES] (L555) → delete()
[E6] cancleButton[계좌폐쇄].Select (L210) → insertAccountClose()
       └ [E16] msgBox.DialogHide [YES] (L744) → retrieve()
[E7] mainAccountButton[주계좌 설정].Select (L216) → retrieve()
[E8] initBookButton[최초원장 등록].Select (L228) → 인라인 L228-238 (new SelectHandler() { @Override publi…)
[E9] classTreeFullName.TriggerClick (L243) → openLookupDoc()
[E10] apprButton[상신].Select (L249) → insertLinkApproval()
[E11] AccountRegReasonComboBox[AccountRegReason].Collapse (L335) → 인라인 L335-341 (new CollapseHandler() { @Override pub…)
[E12] FamilyRelateComboBox[FamilyRelateCode].Collapse (L344) → 인라인 L344-350 (new CollapseHandler() { @Override pub…)
[E13] corpLookup.TriggerClick (L354) → 인라인 L354-369 (new TriggerClickHandler(){ @Override …)
[E14] itemLookup.TriggerClick (L373) → openItem()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private check() | L257-328 | 생성자,E1 | 서비스 dcr.Dcr30_Link.selectByLinkCode, flt.Flt02_Emp.selectByDate, flt.Flt04_Oath.selectByDate | 업무 |
| private openItem() | L427-440 | E14 | 조회창 Flt03_Lookup_ItemType 열기 | 업무 |
| public retrieve() | L443-455 | 생성자,E2,E7,E16,settings,updateApprId | 서비스 flt.Flt03_Account.selectByPersonId(companyId, personId), 건수 표시 | 업무 |
| public update() | L458-534 | E4 | 서비스 flt.Flt03_Account.update | 업무 |
| public insertRow() | L537-543 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L546-570 | E5 | ConfirmBox → E15 | 업무 |
| private delete() | L572-614 | E15 | 미선택 시 alert, GridDeleteData flt.Flt03_Account.delete(체크된 행 목록) | 업무 |
| private openLookupDoc() | L616-625 | E9 | 상태 처리 | 업무 |
| private insertLinkApproval() | L627-695 | E10 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "신고할 계좌정보를 선택해주세요", 서비스 flt.Flt13_BookInit.getInfo(companyId, personId) | 업무 |
| private updateApprId() | L697-717 | insertLinkApproval | 서비스 flt.Flt03_Account.updateApprId(apprId) | 업무 |
| private insertAccountClose() | L719-765 | E6 | 조회창 Flt03_Lookup_AccountClose 열기, 미선택 시 alert "폐쇄할 계좌를 선택해주세요" → 확인창 E16 | 업무 |
| private settings() | L165-255 | 생성자 | 조회창 Flt02_Lookup_Emp 열기, 조회창 Flt03_Lookup_MainAccount 열기, 조회창 Flt13_Lookup_BookInit 열기, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L330-425 | 필드 초기화 | 조회창 Sys15_Lookup_Corp 열기 → 콜백: unmask, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById(apprId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L767-769 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('setupDate', 90, '계좌개설일', { editor: 'date' }),  // L410
  gb.text('regReasonNm', 100, '신고사유', { editor: 'select' }),  // L411
  gb.text('familyRelateNm', 80, '관계', { editor: 'select' }),  // L412
  gb.boolean('mainAccountYn', 70, '주 계좌'),  // L413
  gb.text('accountNm', 150, '계좌명의', { editor: 'text' }),  // L414
  gb.text('accountNoDec', 180, '계좌번호', { editor: 'text' }),  // L415
  gb.text('corpNm', 150, '개설기관'),  // L416
  gb.text('corpBranchNm', 150, '개설점포', { editor: 'text' }),  // L417
  gb.text('itemTypeNm', 150, '종목유형'),  // L418
  gb.text('note', 150, '비고', { editor: 'text' }),  // L419
  gb.date('apprRegDate', 90, '상신일'),  // L420
  gb.textCenter('apprStatusNm', 80, '상신상태'),  // L421
  // ⚠ 대응 없음 (GridBuilder L422) addCell
];
```

#### 사용된 버튼들
1. <Button type="download" onClick={check}>보고주기 변경 및 서약서 서명</Button>
2. <Button type="search" onClick={retrieve}>조회</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="register" onClick={insertRow}>등록</Button>
5. <Button type="delete" onClick={deleteRow}>삭제</Button>
6. <Button type="close" onClick={insertAccountClose}>계좌폐쇄</Button>
7. <Button type="save" onClick={retrieve}>주계좌 설정</Button>
8. <Button type="register" onClick={() => /* 인라인 L228-238 (new SelectHandler() { @Override publi…) */}>최초원장 등록</Button>
9. <Button type="register" onClick={insertLinkApproval}>상신</Button>

### Flt13_Lookup_BookInit (`client/vi/flt/Flt13_Lookup_BookInit.java`, 665줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton} ※ 최초원장 잔고기준일(영업일): {stdDate} {insertButton} {updateButton} {deleteButton} {tempDownloadButton} {excelUploadButton} {itemTypeButton} {uploadExcelForm} {downloadForm}
- 입력·하위 화면: `stdDate` MyDateField, `searchText` TextField 빈칸="계좌/종목/종목유형", `lookupItemType` Flt05_Lookup_ItemTypeConfirm, `lookupAccount` LookupTriggerField, `lookup` Flt03_Lookup_Account, `ItemTypeComboBox` CommonComboBoxField("sys.Sys00_Common.selectByFltItemType"), `lookupItemInfo` LookupTriggerField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - bookDate 100 "잔고기준일" Date
  - accountInfo 250 "계좌" Text 편집:lookupAccount
  - itemTypeName 150 "종목유형" Text 편집:ItemTypeComboBox
  - itemName 250 "종목명" Text 편집:lookupItemInfo
  - itemCode 120 "종목코드" TextCenter
  - bookQty 100 "보유수량<br>(입출금액)" Double 편집:DoubleField
  - bookAmt 120 "보유금액" Long 편집:LongField

#### 이벤트
[E0] 화면 열림 (생성자 L99-107) → 초기화
[E1] searchText.KeyPress [Enter] (L149) → retrieve()
[E2] stdDate.ValueChange [YES] (L159) → holdDateChange()
[E3] msgBox.DialogHide [YES] (L171) → holdDateChange()
[E4] retrieveButton[조회].Select (L192) → retrieve()
[E5] insertButton[등록].Select (L198) → insertRow()
[E6] updateButton[저장].Select (L204) → update()
[E7] deleteButton[삭제].Select (L210) → preDelete()
       └ [E16] msgBox.DialogHide [YES] (L546) → delete()
[E8] closeButton[닫기].Select [callback != null] (L216) → hide()
[E9] tempDownloadButton[템플릿].Select (L225) → 인라인 L225-230 (new SelectHandler(){ @Override public…)
[E10] excelUploadButton[엑셀업로드].Select (L231) → checkPreTr(), excelUpload()
[E11] itemTypeButton[종목유형코드].Select (L242) → 인라인 L242-249 (new SelectHandler() { @Override publi…)
[E12] uploadExcelForm.SubmitComplete (L256) → retrieve()
[E13] lookupAccount.TriggerClick [result != null] (L313) → 인라인 L313-329 (new TriggerClickHandler() { @Override…)
[E14] ItemTypeComboBox[sys.Sys00_Common.selectByFltItemType].Collapse (L336) → 인라인 L336-347 (new CollapseHandler() { @Override pub…)
[E15] lookupItemInfo.TriggerClick (L351) → lookupStkItem(), lookupItem()
[E17] fileUploadField.Change (L608) → 인라인 L608-613 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L109-144 | 공개 메서드 | 상태 처리 | 업무 |
| private setStdDate() | L267-283 | settings | 서비스 flt.Flt13_BookInit.getInitDate(companyId, personId) | 업무 |
| private checkWorkingYn() | L285-304 | checkPreTr | 서비스 sys.Sys12_Calendar.selectByDay(companyId, stdDate) | 업무 |
| private lookupItem() | L388-398 | E15 | 조회창 Flt10_Lookup_Item 열기 | 업무 |
| private lookupStkItem() | L400-423 | E15 | 조회창 Com50_Lookup_StkItem 열기 | 업무 |
| public retrieve() | L425-439 | E1,E4,E12,setStdDate | 서비스 flt.Flt13_BookInit.selectByPersonId(companyId, personId, searchText) | 업무 |
| private insertRow() | L441-460 | E5 | 상태 처리 | 업무 |
| private update() | L462-531 | E6 | 서비스 flt.Flt13_BookInit.update | 업무 |
| private preDelete() | L533-563 | E7 | ConfirmBox → E16 | 업무 |
| private delete() | L565-584 | E16 | GridDeleteData flt.Flt13_BookInit.delete(체크된 행 목록) | 업무 |
| private holdDateChange() | L586-595 | E2,E3 | 상태 처리 | 업무 |
| private excelUpload() | L597-616 | E10 | 상태 처리 | 업무 |
| private checkPreTr() | L621-651 | E10,insertRow,update,preDelete,holdDateChange | 서비스 flt.Flt10_Tr.countByTrDate(companyId, personId, stdDate) | 업무 |
| private settings() | L146-265 | open | 조회창 Flt05_Lookup_ItemTypeConfirm 열기, 확인창 표시, 이벤트 연결, 초기값: stdDate=orgDate | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L306-386 | 필드 초기화 | 조회창 Flt03_Lookup_Account 열기, 미선택 시 alert "종목유형 선택 후 종목 선택이 가능합니다", 서비스 sys.Sys00_Common.selectByFltItemType, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L653-655 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L657-659 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlSpace() | L661-663 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('bookDate', 100, '잔고기준일'),  // L377
  gb.text('accountInfo', 250, '계좌'),  // L378 SQL 계산 컬럼(selectByPersonId: TO_DECRYPTS(flt03_account_no) || ' ' ||…)
  gb.text('itemTypeNm', 150, '종목유형', { editor: 'select' }),  // L379 SQL 계산 컬럼(selectByPersonId: flt05_item_type_nm)
  gb.text('itemNm', 250, '종목명'),  // L380
  gb.textCenter('itemCd', 120, '종목코드'),  // L381
  gb.double('bookQty', 100, '보유수량<br>(입출금액)', { editor: 'number' }),  // L382
  gb.long('bookAmt', 120, '보유금액', { editor: 'number' }),  // L383
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={preDelete}>삭제</Button>
5. <Button type="download" onClick={() => /* 인라인 L225-230 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
6. <Button type="upload" onClick={() => /* checkPreTr(), excelUpload() */}>엑셀업로드</Button>
7. <Button type="unknown" onClick={() => /* 인라인 L242-249 (new SelectHandler() { @Override publi…) */}>종목유형코드</Button>
8. <Button type="unknown" onClick={hide}>닫기</Button>

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

### Flt06_TabPage_AccountClose (`client/vi/flt/Flt06_TabPage_AccountClose.java`, 360줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar01`: {cancleButton}
- 툴바 `buttonBar02`: 문서분류: {classTreeFullName} {apprButton}
- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="문서분류를 선택해주세요", `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - closeDate 100 "계좌폐쇄일" Date
  - familyRelateName 100 "관계" Text
  - accountName 150 "계좌명의" Text
  - accountNoDec 200 "계좌번호" Text
  - corpName 200 "개설기관" Text
  - corpBranchName 150 "개설점포" Text
  - itemTypeName 150 "종목유형" Text
  - apprRegDate 100 "상신일" Date
  - apprStatusName 100 "상신상태" Text
  - actionCell 80 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L69-90) → settings(), check()
[E1] cancleButton[폐쇄취소].Select (L93) → deleteRow()
       └ [E4] msgBox.DialogHide [YES] (L200) → delete()
[E2] classTreeFullName.TriggerClick (L103) → openLookupDoc()
[E3] apprButton[상신].Select (L109) → insertLinkApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private check() | L117-133 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public retrieve() | L184-195 | updateApprId | 서비스 flt.Flt06_AccountClose.selectByPersonId(companyId, personId), 건수 표시 | 업무 |
| public deleteRow() | L197-215 | E1 | ConfirmBox → E4 | 업무 |
| private delete() | L217-240 | E4 | 미선택 시 alert, GridDeleteData flt.Flt06_AccountClose.delete(체크된 행 목록) | 업무 |
| private openLookupDoc() | L242-251 | E2 | 상태 처리 | 업무 |
| private insertLinkApproval() | L253-289 | E3 | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "문서분류를 먼저 선택해주세요" | 업무 |
| private updateApprId() | L291-311 | insertLinkApproval | 서비스 flt.Flt06_AccountClose.updateApprId(apprId) | 업무 |
| public setCallback() | L353-355 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L92-115 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L135-182 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById(apprId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L357-359 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('closeDate', 100, '계좌폐쇄일'),  // L168
  gb.text('familyRelateNm', 100, '관계'),  // L170 SQL 계산 컬럼(selectById: f_cdnm('FamilyRelateCode', flt03_family…)
  gb.text('accountNm', 150, '계좌명의'),  // L171 SQL 계산 컬럼(selectById: flt03_account_nm)
  gb.text('accountNoDec', 200, '계좌번호'),  // L172 SQL 계산 컬럼(selectById: TO_DECRYPTS(flt03_account_no))
  gb.text('corpNm', 200, '개설기관'),  // L173 SQL 계산 컬럼(selectById: sys15_corp_nm)
  gb.text('corpBranchNm', 150, '개설점포'),  // L174 SQL 계산 컬럼(selectById: flt03_corp_branch_nm)
  gb.text('itemTypeNm', 150, '종목유형'),  // L175 SQL 계산 컬럼(selectById: f_get_itemtype_nm(flt03_item_type, flt0…)
  gb.date('apprRegDate', 100, '상신일'),  // L176 SQL 계산 컬럼(selectById: apr01_reg_date)
  gb.text('apprStatusNm', 100, '상신상태'),  // L177 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L178) addCell
];
```

#### 사용된 버튼들
1. <Button type="close" onClick={deleteRow}>폐쇄취소</Button>
2. <Button type="register" onClick={insertLinkApproval}>상신</Button>

### Flt03_Lookup_MainAccount (`client/vi/flt/Flt03_Lookup_MainAccount.java`, 133줄)

- 그리드 `grid` (buildGrid(), 행번호숨김):
  - corpName 200 "개설기관" Text
  - accountNoDec 200 "계좌번호" Text
  - accountName 150 "계좌명의" Text
  - mainAccountYn 70 "주 계좌" Boolean

#### 이벤트
[E1] updateButton[저장].Select (L60) → update()
[E2] closeButton[닫기].Select (L66) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-57 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L89-100 | open | 서비스 flt.Flt03_Account.selectByPersonId(companyId, personId), 건수 표시 | 업무 |
| public update() | L102-127 | E1 | 서비스 flt.Flt03_Account.update | 업무 |
| private settings() | L59-73 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L75-87 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L129-131 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('corpNm', 200, '개설기관'),  // L80
  gb.text('accountNoDec', 200, '계좌번호'),  // L81
  gb.text('accountNm', 150, '계좌명의'),  // L82
  gb.boolean('mainAccountYn', 70, '주 계좌'),  // L83
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt03_Lookup_ItemType (`client/vi/flt/Flt03_Lookup_ItemType.java`, 232줄)

- 입력·하위 화면: `checkBox01` CheckBox, `checkBox02` CheckBox, `checkBox03` CheckBox, `checkBox04` CheckBox, `checkBox05` CheckBox, `checkBox06` CheckBox

#### 이벤트
[E0] 화면 열림 (생성자 L94-164) → show()
[E1] updateButton[저장].Select (L127) → update()
[E2] closeButton[닫기].Select (L133) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L43-50 | 공개 메서드 | 상태 처리 | 업무 |
| private checkBox() | L52-88 | open | 상태 처리 | 업무 |
| public open() | L90-92 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L166-227 | E1 | 서비스 flt.Flt03_Account.getItemTypeName | 업무 |
| private setHtmlHeaderStyle() | L229-231 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Flt03_Lookup_AccountClose (`client/vi/flt/Flt03_Lookup_AccountClose.java`, 115줄)

- 입력·하위 화면: `closeDate` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L37-58) → settings(), show()
[E1] updateButton[저장].Select (L66) → insert()
[E2] closeButton[닫기].Select (L72) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-63 | 공개 메서드 | 상태 처리 | 업무 |
| private insert() | L80-106 | E1 | 서비스 flt.Flt06_AccountClose.insert(closeDate) | 업무 |
| private settings() | L65-78 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L108-110 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L112-114 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={insert}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

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

