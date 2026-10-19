# Biz01_Tab_CardManagement

- 종류: 화면
- 메뉴: 자금관리 > 30. 법인카드관리 > 법인카드 내역관리 (#1141)
- 파일: `client/vi/biz/Biz01_Tab_CardManagement.java`
- 함께 쓰는 클래스 6개:
  - `Biz01_Lookup_Message` `client/vi/biz/Biz01_Lookup_Message.java`
  - `Biz01_Lookup_CardManagementDownload` `client/vi/biz/Biz01_Lookup_CardManagementDownload.java`
  - `Biz01_Lookup_CardManagement` `client/vi/biz/Biz01_Lookup_CardManagement.java`
  - `Biz01_Edit_Account` `client/vi/biz/Biz01_Edit_Account.java`
  - `Biz05_Lookup_RelateAppr` `client/vi/biz/Biz05_Lookup_RelateAppr.java`
  - `Biz05_Lookup_RelateFile` `client/vi/biz/Biz05_Lookup_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Act14_Lookup_LinkProvideContent`](../../act/components/Act14_Lookup_LinkProvideContent.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Ast06_Lookup_TrBizCard`](../../ast/components/Ast06_Lookup_TrBizCard.md), [`Crd02_Lookup_OtherList`](../../crd/components/Crd02_Lookup_OtherList.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `act.Act01_AccountCode.selectBySlipYn` | Biz01_Edit_Account:157 | [`Act01_AccountCode.java:40`](../../act/services/Act01_AccountCode.md) | [`act01_account_code.selectBySlipYn`](../../act/sql/act01_account_code.md) |
| `apr.Apr01_Appr.selectById` | Biz01_Tab_CardManagement:343, Biz05_Lookup_RelateAppr:128 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz01_Promo.cardClose` | Biz01_Tab_CardManagement:535 | [`Biz01_Promo.java:683`](../../biz/services/Biz01_Promo.md) | [`act02_journal.selectByBizId`](../../act/sql/act02_journal.md), [`act04_gen_ledger.selectCloseCount`](../../act/sql/act04_gen_ledger.md), [`biz01_promo.selectCardCloseCount`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectCardManagement`](../../biz/sql/biz01_promo.md), [`biz01_promo.updateCardClose`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.closeCheck` | Biz01_Edit_Account:393, Biz01_Tab_CardManagement:787 | [`Biz01_Promo.java:182`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.closeCheck`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.compareCheck` | Biz01_Tab_CardManagement:474 | [`Biz01_Promo.java:336`](../../biz/services/Biz01_Promo.md) | [`crd02_data.selectByCompareAmt`](../../crd/sql/crd02_data.md) |
| `biz.Biz01_Promo.modelUpdate` | Biz01_Edit_Account:272 | [`Biz01_Promo.java:655`](../../biz/services/Biz01_Promo.md) | `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE → [`biz01_promo.selectById`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.noteUpdate` | Biz01_Edit_Account:294 | [`Biz01_Promo.java:641`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.noteUpdate`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByAmt` | Biz01_Tab_CardManagement:441 | [`Biz01_Promo.java:50`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByAmt`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByPaging` | Biz01_Tab_CardManagement:192 | [`Biz01_Promo.java:95`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectCardManagementPaging`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectCardManagementTotal`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectCardManagement` | Biz01_Tab_CardManagement:654 | [`Biz01_Promo.java:90`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectCardManagement`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.sendMessage` | Biz01_Lookup_Message:124 | [`Biz01_Promo.java:820`](../../biz/services/Biz01_Promo.md) | [`emp01_person.selectById`](../../emp/sql/emp01_person.md) |
| `biz.Biz01_Promo.updateAccount` | Biz01_Lookup_CardManagement:209 | [`Biz01_Promo.java:774`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.updateAccount01`](../../biz/sql/biz01_promo.md), [`biz01_promo.updateAccount02`](../../biz/sql/biz01_promo.md) |
| `biz.Biz02_Person.insertEmpId` | Biz01_Lookup_CardManagement:243 | [`Biz02_Person.java:59`](../../biz/services/Biz02_Person.md) | [`biz02_person.insert`](../../biz/sql/biz02_person.md), [`biz02_person.selectByEmpId`](../../biz/sql/biz02_person.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `biz.Biz04_ProvideSetup.selectByProvideContentCode` | Biz01_Lookup_CardManagement:266 | [`Biz04_ProvideSetup.java:26`](../../biz/services/Biz04_ProvideSetup.md) | [`biz04_provide_setup.selectByProvideContentCode`](../../biz/sql/biz04_provide_setup.md) |
| `biz.Biz05_RelateAppr.delete` | Biz05_Lookup_RelateAppr:200 | [`Biz05_RelateAppr.java:213`](../../biz/services/Biz05_RelateAppr.md) | `UpdateDataModel(biz05_relate_appr)` 동적 DELETE |
| `biz.Biz05_RelateAppr.insert` | Biz01_Tab_CardManagement:762 | [`Biz05_RelateAppr.java:124`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.deleteByApprId`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.insert`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `biz.Biz05_RelateAppr.modelUpdate` | Biz05_Lookup_RelateAppr:182 | [`Biz05_RelateAppr.java:102`](../../biz/services/Biz05_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz05_relate_appr)` 동적 INSERT/UPDATE → [`biz05_relate_appr.selectById`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectByDataYm` | Biz01_Tab_CardManagement:888 | [`Biz05_RelateAppr.java:48`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectByPromoId` | Biz05_Lookup_RelateAppr:169 | [`Biz05_RelateAppr.java:26`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByPromoId`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectFileCount` | Biz01_Edit_Account:437 | [`Biz05_RelateAppr.java:92`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectFileCount`](../../biz/sql/biz05_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Biz01_Tab_CardManagement:561 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys00_Common.selectBizCardManager` | Biz01_Lookup_Message:155, Biz01_Tab_CardManagement:85 | [`Sys00_Common.java:76`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectBizCardManager`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Biz01_Edit_Account:65, Biz01_Lookup_CardManagement:49, Biz01_Tab_CardManagement:86 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectByProvideContentCode` | Biz01_Lookup_CardManagement:51 | [`Sys00_Common.java:116`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectByProvideContentCode`](../../sys/sql/sys00_common.md) |
| `sys.Sys09_Code.selectByKindCode` | Biz01_Edit_Account:66, Biz01_Lookup_CardManagement:50 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Biz05_Lookup_RelateFile:176 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Biz05_Lookup_RelateFile:182 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.insertRdCardManagement` | Biz01_Tab_CardManagement:807 | [`Sys99_Print.java:1462`](../../sys/services/Sys99_Print.md) | [`biz01_promo.selectCardManagementRd`](../../biz/sql/biz01_promo.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act02_journal`](../../../db/tables/act.md), [`act05_gen_ledger_close`](../../../db/tables/act.md), [`act14_link`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`ast06_tr`](../../../db/tables/ast.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz04_provide_setup`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`, `to_decrypts`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_CardManagement (`client/vi/biz/Biz01_Tab_CardManagement.java`, 976줄)

- 레이아웃: north=buttonHlc01, center=vlc01, east=editAccount
- 툴바 `buttonBar1`: 기준년월: {dataYMText} 사용자: {cardManagerCombo} 제공목적: {providePurCombo} 검색: {searchText} {retrieveButton} {downloadButton} {rdFileDownloadForm}
- 툴바 `buttonBar01_1`: {selectUpdateButton} {closeButton} {closeCancelButton} {sendButton} {connectButton}
- 입력·하위 화면: `editAccount` Biz01_Edit_Account, `cardManagerCombo` CommonComboBoxField("sys.Sys00_Common.selectBizCardManager", "%", "전체"), `providePurCombo` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체"), `dataYMText` TextField 빈칸="YYYY.MM", `searchText` TextField 빈칸="카드명/가맹점명/업종/제공목적/제공내역/계정과목", `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `lookupLinkProvideContent` Act14_Lookup_LinkProvideContent, `editor` Apr01_Edit_ApprDoc, `popup` Crd02_Lookup_OtherList, `lookupAccount` Biz01_Lookup_CardManagement, `apprDoc` Apr01_Edit_ApprDoc, `lookup` Biz01_Lookup_Message
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - closeName 70 "마감구분" TextCenter
  - htmlCardName 110 "카드명" Text
  - regEmpName 100 "사용자" TextCenter
  - approvalDt 100 "카드승인일" Date
  - franchiseName 200 "가맹점명" Text
  - sectorName 150 "업종" Text
  - provideAmt 100 "승인금액" Long
  - providePurName 100 "제공목적" TextCenter
  - provideContentName 100 "제공내역" TextCenter
  - accountName 130 "계정과목" Text
  - taxTypeName 70 "과세구분" TextCenter
  - note 300 "비고(사용내역)" Text

#### 이벤트
[E0] 화면 열림 (생성자 L127-222) → settings(), defaultName(), retrieve()
[E1] dataYMText.KeyPress [Enter] (L240) → retrieve()
[E2] dataYMText.ValueChange (L248) → 인라인 L248-257 (new ValueChangeHandler<String>() { @O…)
[E3] searchText.KeyPress [Enter] (L272) → retrieve()
[E4] grid.SelectionChanged [선택>0] (L281) → retrieveTabpage()
[E5] retrieveButton[조회].Select (L289) → retrieve()
[E6] selectUpdateButton[일괄저장].Select (L296) → openLookupAccount()
[E7] downloadButton[엑셀다운로드].Select (L302) → downloadLookUp()
[E8] closeButton[마감].Select (L308) → closeCheck(), compareCheck()
[E9] closeCancelButton[취소].Select (L314) → closeCheck()
[E10] connectButton[계정과목연결].Select (L320) → 인라인 L320-326 (new SelectHandler() { @Override publi…)
[E11] classTreeFullName[문서분류].TriggerClick (L328) → openLookupDoc()
[E12] apprButton[상신].Select (L334) → checkApproval()
       └ [E16] msgBox.DialogHide [YES] (L632) → getPromoList()
[E13] apprViewButton[문서보기].Select (L340) → apprChk()
[E14] sendButton[마감문자발송].Select (L365) → sendMessage()
[E15] msgBox.DialogHide [YES] (L516) → close()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L393-406 | E4 | 상태 처리 | 업무 |
| public retrieve() | L408-436 | 생성자,E1,E3,E5,retrieveTabpage,close,openLookupAccount,insertLinkApprovals,updateApprId | 상태 처리 | 업무 |
| private totalAmtCheck() | L439-471 | retrieve | 서비스 biz.Biz01_Promo.selectByAmt(companyId, dataYm, managerId, providePurCode, searchText) | 업무 |
| private compareCheck() | L473-489 | E8 | 서비스 biz.Biz01_Promo.compareCheck(companyId, dataYm) | 업무 |
| private closeCheck() | L491-532 | E8,E9,compareCheck | 확인창 표시 | 업무 |
| private close() | L534-558 | E15 | 서비스 biz.Biz01_Promo.cardClose | 업무 |
| private defaultName() | L560-580 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private otherList() | L582-585 | compareCheck | 조회창 Crd02_Lookup_OtherList 열기 | 업무 |
| private openLookupDoc() | L588-597 | E11 | 상태 처리 | 업무 |
| private openLookupAccount() | L600-620 | E6 | 조회창 Biz01_Lookup_CardManagement 열기 | 업무 |
| private checkApproval() | L622-649 | E12 | ConfirmBox → E16 | 업무 |
| protected getPromoList() | L651-673 | E16 | 서비스 biz.Biz01_Promo.selectCardManagement(companyId, dataYm, managerId, providePurCode) | 업무 |
| private insertLinkApprovals() | L675-729 | getPromoList | 상태 처리 | 업무 |
| private insertLinkApprovals() | L731-759 | getPromoList | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L761-777 | insertLinkApprovals | 서비스 biz.Biz05_RelateAppr.insert | 업무 |
| private closeCheck() | L779-802 | E8,E9,compareCheck | 서비스 biz.Biz01_Promo.closeCheck | 업무 |
| private createRdExcel() | L804-866 | downloadLookUp | 서비스 sys.Sys99_Print.insertRdCardManagement(companyId, personId, windowClassName, startYm, closeYm, managerId, providePurCode, searchText) | 업무 |
| private downloadLookUp() | L868-884 | E7 | 조회창 Biz01_Lookup_CardManagementDownload 열기 | 업무 |
| private apprChk() | L886-935 | E13,retrieve | 서비스 biz.Biz05_RelateAppr.selectByDataYm | 업무 |
| private getDataYm() | L937-942 | retrieve,totalAmtCheck,compareCheck,closeCheck,close,checkApproval,getPromoList,insertLinkApprovals,updateApprId,apprChk,sendMessage | 상태 처리 | 업무 |
| private getManagerId() | L944-954 | retrieve,totalAmtCheck,createRdExcel | 상태 처리 | 업무 |
| private getCloseDate() | L956-962 | insertLinkApprovals | 서비스 yyyy.MM.dd | 업무 |
| private sendMessage() | L964-967 | E14 | 조회창 Biz01_Lookup_Message 열기 | 업무 |
| private settings() | L224-371 | 생성자 | 조회창 Act14_Lookup_LinkProvideContent 열기, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 이벤트 연결, 초기값: dataYMText=DateTimeFormat.getFormat("yyyy.MM" | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L373-391 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L969-971 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L973-975 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('closeNm', 70, '마감구분'),  // L377
  gb.text('htmlCardNm', 110, '카드명'),  // L378
  gb.textCenter('regEmpNm', 100, '사용자'),  // L379
  gb.date('approvalDt', 100, '카드승인일'),  // L380
  gb.text('franchiseNm', 200, '가맹점명'),  // L381
  gb.text('sectorNm', 150, '업종'),  // L382
  gb.long('provideAmt', 100, '승인금액'),  // L383
  gb.textCenter('providePurNm', 100, '제공목적'),  // L384
  gb.textCenter('provideContentNm', 100, '제공내역'),  // L385
  gb.text('accountNm', 130, '계정과목'),  // L386
  gb.textCenter('taxTypeNm', 70, '과세구분'),  // L387
  gb.text('note', 300, '비고(사용내역)'),  // L388
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={openLookupAccount}>일괄저장</Button>
3. <Button type="download" onClick={downloadLookUp}>엑셀다운로드</Button>
4. <Button type="save" onClick={() => /* closeCheck(), compareCheck() */}>마감</Button>
5. <Button type="cancel" onClick={closeCheck}>취소</Button>
6. <Button type="save" onClick={() => /* 인라인 L320-326 (new SelectHandler() { @Override publi…) */}>계정과목연결</Button>
7. <Button type="send" onClick={sendMessage}>마감문자발송</Button>
8. <Button type="register" onClick={checkApproval}>상신</Button>
9. <Button type="search" onClick={apprChk}>문서보기</Button>

### Biz01_Lookup_Message (`client/vi/biz/Biz01_Lookup_Message.java`, 166줄)

- 툴바 `buttonBar`: {anchor}
- 그리드 `grid` (buildGrid(), 행번호숨김, 체크박스(다중)):
  - name 120 "사원명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L58-87) → show()
[E1] anchor.MouseDown (L66) → retrieve()
[E2] retrieveButton[조회].Select (L90) → retrieve()
[E3] updateButton[발송].Select (L96) → sendMessage()
[E4] closeButton[닫기].Select (L102) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L52-56 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L89-108 | open | 상태 처리 | 업무 |
| private sendMessage() | L118-140 | E3 | 서비스 biz.Biz01_Promo.sendMessage(companyId, content) | 업무 |
| private getGridList() | L142-148 | sendMessage | 상태 처리 | 업무 |
| public retrieve() | L150-161 | E1,E2,open | 서비스 sys.Sys00_Common.selectBizCardManager(companyId, stdYYYYMM) | 업무 |
| public buildGrid() | L110-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L163-165 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('name', 120, '사원명'),  // L114
];
```

#### 사용된 버튼들
1. <Button type="send" onClick={sendMessage}>발송</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="search" onClick={retrieve}>조회</Button>

### Biz01_Lookup_CardManagementDownload (`client/vi/biz/Biz01_Lookup_CardManagementDownload.java`, 133줄)

- 입력·하위 화면: `startYearText` TextField, `startMonthComboBox` ComboBoxField("MonthsCode"), `closeYearText` TextField, `closeMonthComboBox` ComboBoxField("MonthsCode")

#### 이벤트
[E1] downloadButton[다운로드].Select (L98) → hide()
[E2] closeButton[닫기].Select (L111) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L51-95 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L97-117 | open | 상태 처리 | 업무 |
| private getDataYm() | L119-123 | open | 상태 처리 | 업무 |
| private setHtmlStyle() | L125-127 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L129-131 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="download" onClick={hide}>다운로드</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz01_Lookup_CardManagement (`client/vi/biz/Biz01_Lookup_CardManagement.java`, 295줄)

- 입력·하위 화면: `providePurName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `provideContentName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `accountName` CommonComboBoxField("sys.Sys00_Common.selectByProvideContentCode") 빈칸="선택", `taxTypeName` ComboBoxField("TaxType") 빈칸="선택", `note` MyTextArea

#### 이벤트
[E1] providePurName[제공목적].Collapse [preValue == null] (L108) → 서비스 sys.Sys09_Code.selectByKindCode
[E2] provideContentName[제공내역].Collapse [preValue == null] (L137) → 서비스 sys.Sys00_Common.selectByProvideContentCode
[E3] updateButton[저장].Select (L174) → update()
[E4] closeButton[닫기].Select (L180) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L60-98 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L100-186 | open | 서비스 sys.Sys09_Code.selectByKindCode, sys.Sys00_Common.selectByProvideContentCode | 업무 |
| public update() | L188-231 | E3 | 서비스 biz.Biz01_Promo.updateAccount(providePurCode, provideContentCode, accountId, taxType, note, menuName) | 업무 |
| private insertEmp() | L233-263 | update | 서비스 biz.Biz02_Person.insertEmpId(empId) | 업무 |
| private getEmpSetupYn() | L265-282 | insertEmp | 서비스 biz.Biz04_ProvideSetup.selectByProvideContentCode(companyId, provideContentCode) | 업무 |
| private setHtmlStyle() | L284-286 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L288-290 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L292-294 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz01_Edit_Account (`client/vi/biz/Biz01_Edit_Account.java`, 457줄)

- 입력·하위 화면: `providePurName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `provideContentName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `providePurCode` TextField, `provideContentCode` TextField, `accountCode` LookupTriggerField, `accountName` TextField, `taxType` TextField, `taxTypeName` ComboBoxField("TaxType"), `note` MyTextArea, `depnBookYn` LookupTriggerField, `realPersonName` LookupTriggerField, `realPersonId` LongField, `lookup` Biz05_Lookup_RelateAppr, `lookupAccount` Act01_Lookup_AccountCode, `lookupTrDepn` Ast06_Lookup_TrBizCard, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L82-90) → setting(), getEditor()
[E1] providePurName[제공목적].ValueChange (L109) → refreshCode()
[E2] providePurName[제공목적].Collapse (L117) → 인라인 L117-122 (new CollapseHandler(){ @Override publ…)
[E3] providePurName[제공목적].TriggerClick (L123) → refreshCode()
[E4] provideContentName[제공내역].Collapse (L132) → 인라인 L132-137 (new CollapseHandler(){ @Override publ…)
[E5] provideContentName[제공내역].TriggerClick (L138) → refreshCode()
[E6] accountCode[계정코드].TriggerClick (L145) → openLookupAccount()
[E7] accountCode[계정코드].ValueChange (L151) → setAccount(), openLookupAccount()
[E8] taxTypeName[과세구분].ValueChange (L180) → 인라인 L180-185 (new ValueChangeHandler<String>() { @O…)
[E9] depnBookYn[비품대장등록].TriggerClick (L188) → lookupDepnTr()
[E10] realPersonName[실사용자].TriggerClick (L196) → openLookupPerson()
[E11] updateButton[저장].Select (L203) → closeCheck(), update()
[E12] fileButton[증빙자료(0건)].Select (L211) → setFileButtonText()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editModel() | L92-98 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L100-223 | 생성자 | 조회창 Biz05_Lookup_RelateAppr 열기, 서비스 act.Act01_AccountCode.selectBySlipYn | 업무 |
| private refreshCode() | L225-232 | E1,E3,E5 | 서비스 sys.Sys09_Code.selectByKindCode | 업무 |
| private getEditor() | L234-253 | 생성자 | 상태 처리 | 업무 |
| public update() | L255-281 | E11 | 서비스 biz.Biz01_Promo.modelUpdate | 업무 |
| public updateNote() | L283-305 | closeCheck | 서비스 biz.Biz01_Promo.noteUpdate | 업무 |
| public setButtonVisible() | L307-337 | 공개 메서드 | 상태 처리 | 업무 |
| public openLookupAccount() | L339-348 | E6,E7 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| public openLookupAccount() | L350-359 | E6,E7 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private setAccount() | L361-371 | E7,openLookupAccount | 상태 처리 | 업무 |
| private lookupDepnTr() | L373-386 | E9 | 조회창 Ast06_Lookup_TrBizCard 열기 | 업무 |
| private closeCheck() | L388-409 | E11 | 서비스 biz.Biz01_Promo.closeCheck | 업무 |
| private openLookupPerson() | L411-433 | E10 | 조회창 Emp00_Lookup_SelectSingle 열기 | 업무 |
| private setFileButtonText() | L436-448 | E12,editModel | 서비스 biz.Biz05_RelateAppr.selectFileCount(promoId) | 업무 |
| private setHtmlStyle() | L450-452 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L454-456 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={() => /* closeCheck(), update() */}>저장</Button>
2. <Button type="unknown" onClick={setFileButtonText}>증빙자료(0건)</Button>

### Biz05_Lookup_RelateAppr (`client/vi/biz/Biz05_Lookup_RelateAppr.java`, 207줄)

- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `fileList` Biz05_Lookup_RelateFile, `editor` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - title 370 "제목" Text
  - regDate 90 "등록일" Date
  - effectDate 90 "시행일" Date
  - regEmpName 80 "등록자" TextCenter
  - statusName 80 "상신상태" TextCenter
  - actionCell 70 "상세보기" Cell 편집:actionCell

#### 이벤트
[E0] 화면 열림 (생성자 L97-120) → show()
[E1] retrieveButton[조회].Select (L68) → retrieve()
[E2] insertButton[불러오기].Select (L74) → insert()
[E3] deleteButton[연결제거].Select (L80) → delete()
[E4] closeButton[닫기].Select [callback != null] (L86) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L56-65 | 공개 메서드 | 상태 처리 | 업무 |
| private retrieve() | L164-170 | E1,open,insert | 서비스 biz.Biz05_RelateAppr.selectByPromoId(companyId, promoId) | 업무 |
| private insert() | L172-195 | E2 | 조회창 Apr05_Lookup_LoadDoc 열기, 서비스 biz.Biz05_RelateAppr.modelUpdate | 업무 |
| private delete() | L197-201 | E3 | GridDeleteData biz.Biz05_RelateAppr.delete(체크된 행 목록) | 업무 |
| private settings() | L67-95 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L122-162 | 필드 초기화 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L203-205 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('title', 370, '제목'),  // L154 SQL 계산 컬럼(selectByPromoId: b.apr01_title)
  gb.date('regDate', 90, '등록일'),  // L155 SQL 계산 컬럼(selectByPromoId: b.apr01_reg_date)
  gb.date('effectDate', 90, '시행일'),  // L156 SQL 계산 컬럼(selectByPromoId: b.apr01_effect_date)
  gb.textCenter('regEmpNm', 80, '등록자'),  // L157 SQL 계산 컬럼(selectByPromoId: f_emp_kor_nm(b.apr01_reg_emp_id))
  gb.textCenter('statusNm', 80, '상신상태'),  // L158 SQL 계산 컬럼(selectByPromoId: f_cdnm('AprStatusCode', b.apr01_status_…)
  // ⚠ 대응 없음 (GridBuilder L159) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>불러오기</Button>
3. <Button type="delete" onClick={delete}>연결제거</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz05_Lookup_RelateFile (`client/vi/biz/Biz05_Lookup_RelateFile.java`, 209줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildFileGrid(), 체크박스):
  - fileName 450 "첨부파일" Text
  - actionCell 50 "보기" Cell 편집:viewCell
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell

#### 이벤트
[E0] 화면 열림 (생성자 L60-99) → 초기화
[E1] fileUpload.Change (L68) → 인라인 L68-75 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L78) → retrieve()
[E3] uploadFileButton[파일업로드].Select (L105) → 인라인 L105-110 (new SelectHandler() { @Override publi…)
[E4] fileDeleteForm.SubmitComplete (L115) → retrieve()
[E5] messageBox.DialogHide [YES] (L143) → checkFileDelete()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L54-58 | 공개 메서드 | 상태 처리 | 업무 |
| private buildFileGrid() | L123-171 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기, 확인창 표시 | 업무 |
| public retrieve() | L173-177 | E2,E4,open,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L179-204 | E5 | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public clear() | L206-208 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L101-121 | open | 이벤트 연결 | UI구성 (이벤트 절로 대체) |

#### Grid Spec
```javascript
const buildFileGrid = () => [
  gb.text('fileNm', 450, '첨부파일'),  // L165
  // ⚠ 대응 없음 (GridBuilder L166) addCell
  // ⚠ 대응 없음 (GridBuilder L167) addCell
  // ⚠ 대응 없음 (GridBuilder L168) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L105-110 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

