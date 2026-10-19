# Biz01_Tab_CardContents

- 종류: 화면
- 메뉴: 준법감시 > 40. 이익제공(수령)현황 > 법인카드 사용내역 조회 (#1138)
- 파일: `client/vi/biz/Biz01_Tab_CardContents.java`
- 함께 쓰는 클래스 6개:
  - `Biz02_Grid_PersonList` `client/vi/biz/Biz02_Grid_PersonList.java`
  - `Biz02_Grid_InternalList` `client/vi/biz/Biz02_Grid_InternalList.java`
  - `Biz02_Grid_ExternalList` `client/vi/biz/Biz02_Grid_ExternalList.java`
  - `Biz01_Edit_Card` `client/vi/biz/Biz01_Edit_Card.java`
  - `Biz05_Lookup_RelateAppr` `client/vi/biz/Biz05_Lookup_RelateAppr.java`
  - `Biz05_Lookup_RelateFile` `client/vi/biz/Biz05_Lookup_RelateFile.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Apr05_Lookup_LoadDoc`](../../apr/components/Apr05_Lookup_LoadDoc.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Mkt01_Lookup_Select`](../../mkt/components/Mkt01_Lookup_Select.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz05_Lookup_RelateAppr:128 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz01_Promo.closeCheck` | Biz01_Edit_Card:354, Biz02_Grid_ExternalList:217, Biz02_Grid_InternalList:216 | [`Biz01_Promo.java:182`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.closeCheck`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.modelUpdate` | Biz01_Edit_Card:220 | [`Biz01_Promo.java:655`](../../biz/services/Biz01_Promo.md) | `UpdateDataModel(biz01_promo)` 동적 INSERT/UPDATE → [`biz01_promo.selectById`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.noteUpdate` | Biz01_Edit_Card:242 | [`Biz01_Promo.java:641`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.noteUpdate`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByAmt` | Biz01_Tab_CardContents:354 | [`Biz01_Promo.java:50`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByAmt`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectCardContentsPaging` | Biz01_Tab_CardContents:109 | [`Biz01_Promo.java:84`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectCardContentsPaging`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectCardContentsTotal`](../../biz/sql/biz01_promo.md) |
| `biz.Biz02_Person.delete` | Biz02_Grid_ExternalList:189, Biz02_Grid_InternalList:188 | [`Biz02_Person.java:118`](../../biz/services/Biz02_Person.md) | `UpdateDataModel(biz02_person)` 동적 DELETE |
| `biz.Biz02_Person.insertEmpId` | Biz01_Edit_Card:310 | [`Biz02_Person.java:59`](../../biz/services/Biz02_Person.md) | [`biz02_person.insert`](../../biz/sql/biz02_person.md), [`biz02_person.selectByEmpId`](../../biz/sql/biz02_person.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `biz.Biz02_Person.modelUpdate` | Biz02_Grid_ExternalList:156, Biz02_Grid_InternalList:153 | [`Biz02_Person.java:99`](../../biz/services/Biz02_Person.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE → [`biz02_person.selectById`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.selectByExternal` | Biz02_Grid_ExternalList:115 | [`Biz02_Person.java:32`](../../biz/services/Biz02_Person.md) | [`biz02_person.selectByExternal`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.selectByInternal` | Biz02_Grid_InternalList:114 | [`Biz02_Person.java:26`](../../biz/services/Biz02_Person.md) | [`biz02_person.selectByInternal`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.update` | Biz02_Grid_ExternalList:132, Biz02_Grid_InternalList:131 | [`Biz02_Person.java:113`](../../biz/services/Biz02_Person.md) | `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE → [`biz02_person.selectById`](../../biz/sql/biz02_person.md) |
| `biz.Biz04_ProvideSetup.selectByProvideContentCode` | Biz01_Edit_Card:331 | [`Biz04_ProvideSetup.java:26`](../../biz/services/Biz04_ProvideSetup.md) | [`biz04_provide_setup.selectByProvideContentCode`](../../biz/sql/biz04_provide_setup.md) |
| `biz.Biz05_RelateAppr.delete` | Biz05_Lookup_RelateAppr:200 | [`Biz05_RelateAppr.java:213`](../../biz/services/Biz05_RelateAppr.md) | `UpdateDataModel(biz05_relate_appr)` 동적 DELETE |
| `biz.Biz05_RelateAppr.modelUpdate` | Biz05_Lookup_RelateAppr:182 | [`Biz05_RelateAppr.java:102`](../../biz/services/Biz05_RelateAppr.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz05_relate_appr)` 동적 INSERT/UPDATE → [`biz05_relate_appr.selectById`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectByPromoId` | Biz05_Lookup_RelateAppr:169 | [`Biz05_RelateAppr.java:26`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByPromoId`](../../biz/sql/biz05_relate_appr.md) |
| `biz.Biz05_RelateAppr.selectFileCount` | Biz01_Edit_Card:374 | [`Biz05_RelateAppr.java:92`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectFileCount`](../../biz/sql/biz05_relate_appr.md) |
| `sys.Sys00_Common.selectBizCardManager` | Biz01_Tab_CardContents:64 | [`Sys00_Common.java:76`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectBizCardManager`](../../sys/sql/sys00_common.md) |
| `sys.Sys00_Common.selectByKindGroupCode` | Biz01_Edit_Card:54, Biz01_Tab_CardContents:65 | [`Sys00_Common.java:106`](../../sys/services/Sys00_Common.md) | [`sys09_code.selectByKindGroupCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys00_Common.selectByProvideContentCode` | Biz01_Edit_Card:56 | [`Sys00_Common.java:116`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectByProvideContentCode`](../../sys/sql/sys00_common.md) |
| `sys.Sys09_Code.selectByKindCode` | Biz01_Edit_Card:55 | [`Sys09_Code.java:128`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByKindCode`](../../sys/sql/sys09_code.md) |
| `sys.Sys10_File.selectByParentId` | Biz05_Lookup_RelateFile:176 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Biz05_Lookup_RelateFile:182 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |
| `sys.Sys99_Print.insertRdCardContents` | Biz01_Tab_CardContents:221 | [`Sys99_Print.java:3389`](../../sys/services/Sys99_Print.md) | [`biz01_promo.selectCardContents`](../../biz/sql/biz01_promo.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertRdCardContentsDownload` | Biz01_Tab_CardContents:389 | [`Sys99_Print.java:3443`](../../sys/services/Sys99_Print.md) | [`biz01_promo.selectCardContentsDownload`](../../biz/sql/biz01_promo.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act14_link`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz04_provide_setup`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`mkt01_target_company`](../../../db/tables/mkt.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_crdmanagerid`, `f_get_dcr_no`, `f_get_emptrans`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_CardContents (`client/vi/biz/Biz01_Tab_CardContents.java`, 464줄)

- 레이아웃: north=buttonHlc01, center=vlc01, east=vlc02
- 툴바 `buttonBar`: 기준년월: {dataYMText} 관리자: {cardManagerCombo} 제공목적: {providePurCombo} {retrieveButton} {rdButton} {downloadButton} {rdFileDownloadForm}
- 입력·하위 화면: `editCard` Biz01_Edit_Card, `cardManagerCombo` CommonComboBoxField("sys.Sys00_Common.selectBizCardManager", "%", "전체"), `providePurCombo` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode", "%", "전체"), `dataYMText` TextField 빈칸="YYYY.MM", `searchTextField` TextField
- 그리드 `grid` (buildGrid()):
  - closeName 70 "마감구분" TextCenter
  - htmlCardName 110 "카드명" Text
  - regEmpName 70 "관리자" TextCenter
  - approvalDt 100 "카드승인일" Date
  - franchiseName 200 "가맹점명" Text
  - sectorName 150 "업종" Text
  - approvalAmount 100 "승인금액" Long
  - providePurName 100 "제공목적" TextCenter
  - provideContentName 100 "제공내역" TextCenter
  - totalPeple 70 "인원" Long
  - averagePrice 100 "인당 경제적가치" Long
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L82-150) → setting(), retrieve()
[E1] dataYMText.KeyPress [Enter] (L165) → retrieve()
[E2] dataYMText.ValueChange (L173) → 인라인 L173-182 (new ValueChangeHandler<String>() { @O…)
[E3] grid.RowClick (L197) → retrieveTabpage()
[E4] searchTextField.KeyPress [Enter] (L203) → retrieve()
[E5] retrieveButton[조회].Select (L211) → retrieve()
[E6] rdButton[출력/다운로드].Select [result.getStatus() == 1] (L217) → getCardDate()
[E7] downloadButton[엑셀다운로드].Select (L258) → createRdExcel()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L152-265 | 생성자 | 서비스 sys.Sys99_Print.insertRdCardContents(companyId, personId, windowClassName, dataYm, managerId, providePurCode, searchText) | 업무 |
| private retrieveTabpage() | L287-302 | E3 | 상태 처리 | 업무 |
| public retrieve() | L304-351 | 생성자,E1,E4,E5,retrieveTabpage | 상태 처리 | 업무 |
| private totalAmtCheck() | L353-384 | retrieve | 서비스 biz.Biz01_Promo.selectByAmt(companyId, dataYm, managerId, providePurCode, searchText) | 업무 |
| private createRdExcel() | L386-440 | E7 | 서비스 sys.Sys99_Print.insertRdCardContentsDownload(windowClassName, companyId, personId, dataYm, managerId, providePurCode, searchText) | 업무 |
| private getCardDate() | L442-447 | E6,retrieve,totalAmtCheck,createRdExcel | 상태 처리 | 업무 |
| private getManagerId() | L449-459 | totalAmtCheck | 상태 처리 | 업무 |
| public buildGrid() | L267-285 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L461-463 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('closeNm', 70, '마감구분'),  // L271
  gb.text('htmlCardNm', 110, '카드명'),  // L272
  gb.textCenter('regEmpNm', 70, '관리자'),  // L273
  gb.date('approvalDt', 100, '카드승인일'),  // L274
  gb.text('franchiseNm', 200, '가맹점명'),  // L275
  gb.text('sectorNm', 150, '업종'),  // L276
  gb.long('approvalAmount', 100, '승인금액'),  // L277
  gb.textCenter('providePurNm', 100, '제공목적'),  // L278
  gb.textCenter('provideContentNm', 100, '제공내역'),  // L279
  gb.long('totalPeple', 70, '인원'),  // L280
  gb.long('averagePrice', 100, '인당 경제적가치'),  // L281
  gb.text('note', 300, '비고'),  // L282
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={getCardDate}>출력/다운로드</Button>
3. <Button type="download" onClick={createRdExcel}>엑셀다운로드</Button>

### Biz02_Grid_PersonList (`client/vi/biz/Biz02_Grid_PersonList.java`, 46줄)


#### 이벤트
[E0] 화면 열림 (생성자 L14-17) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public setting() | L19-22 | 공개 메서드 | 상태 처리 | 업무 |
| public setButtonVisible() | L24-27 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L29-45 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Biz02_Grid_InternalList (`client/vi/biz/Biz02_Grid_InternalList.java`, 236줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 직원: {insertButton} {deleteButton}
- 입력·하위 화면: `lookupEmpTransInfo` Emp00_Lookup_SelectMulti
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - orgName 200 "본부(부서)" TextCenter
  - empName 100 "성명" TextCenter

#### 이벤트
[E0] 화면 열림 (생성자 L57-74) → setting()
[E1] insertButton[등록].Select (L77) → closeCheck(), insertRow()
[E2] deleteButton[삭제].Select (L90) → closeCheck(), deleteRow()
       └ [E3] msgBox.DialogHide [YES] (L181) → 서비스 biz.Biz02_Person.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L76-97 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L108-120 | insertRow | 서비스 biz.Biz02_Person.selectByInternal(promoId) | 업무 |
| public retrieve() | L122-127 | insertRow | 상태 처리 | 업무 |
| public update() | L129-137 | 공개 메서드 | 서비스 biz.Biz02_Person.update | 업무 |
| private insertRow() | L139-170 | E1 | 조회창 Emp00_Lookup_SelectMulti 열기, 서비스 biz.Biz02_Person.modelUpdate | 업무 |
| public deleteRow() | L172-204 | E2 | ConfirmBox → E3 | 업무 |
| public setButtonVisible() | L206-210 | 공개 메서드 | 상태 처리 | 업무 |
| private closeCheck() | L212-231 | E1,E2 | 서비스 biz.Biz01_Promo.closeCheck | 업무 |
| public buildGrid() | L99-106 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L233-235 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('orgNm', 200, '본부(부서)'),  // L102 SQL 계산 컬럼(selectByInternal: f_org_nm(c.emp03_org_code_id, b.biz01_p…)
  gb.textCenter('empNm', 100, '성명'),  // L103 SQL 계산 컬럼(selectByInternal: f_emp_kor_nm(a.biz02_emp_id))
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* closeCheck(), insertRow() */}>등록</Button>
2. <Button type="delete" onClick={() => /* closeCheck(), deleteRow() */}>삭제</Button>

### Biz02_Grid_ExternalList (`client/vi/biz/Biz02_Grid_ExternalList.java`, 237줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 거래상대방: {insertButton} {deleteButton}
- 입력·하위 화면: `lookup` Mkt01_Lookup_Select
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - targetCompanyName 170 "회사명" Text
  - targetEmpName 70 "성명" Text
  - targetOrgName 100 "부서" Text

#### 이벤트
[E0] 화면 열림 (생성자 L56-74) → setting()
[E1] insertButton[등록].Select (L77) → closeCheck(), insertRow()
[E2] deleteButton[삭제].Select (L90) → closeCheck(), deleteRow()
       └ [E3] msgBox.DialogHide [YES] (L182) → 서비스 biz.Biz02_Person.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L76-97 | 생성자 | 상태 처리 | 업무 |
| public retrieve() | L109-121 | insertRow | 서비스 biz.Biz02_Person.selectByExternal(promoId) | 업무 |
| public retrieve() | L123-128 | insertRow | 상태 처리 | 업무 |
| public update() | L130-138 | 공개 메서드 | 서비스 biz.Biz02_Person.update | 업무 |
| public insertRow() | L140-171 | E1 | 조회창 Mkt01_Lookup_Select 열기, 서비스 biz.Biz02_Person.modelUpdate | 업무 |
| public deleteRow() | L173-205 | E2 | ConfirmBox → E3 | 업무 |
| public setButtonVisible() | L207-211 | 공개 메서드 | 상태 처리 | 업무 |
| private closeCheck() | L213-232 | E1,E2 | 서비스 biz.Biz01_Promo.closeCheck | 업무 |
| public buildGrid() | L99-107 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L234-236 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('targetCompanyNm', 170, '회사명'),  // L102
  gb.text('targetEmpNm', 70, '성명'),  // L103
  gb.text('targetOrgNm', 100, '부서'),  // L104
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={() => /* closeCheck(), insertRow() */}>등록</Button>
2. <Button type="delete" onClick={() => /* closeCheck(), deleteRow() */}>삭제</Button>

### Biz01_Edit_Card (`client/vi/biz/Biz01_Edit_Card.java`, 394줄)

- 입력·하위 화면: `providePurName` CommonComboBoxField("sys.Sys00_Common.selectByKindGroupCode") 빈칸="선택", `provideContentName` CommonComboBoxField("sys.Sys09_Code.selectByKindCode") 빈칸="선택", `accountName` CommonComboBoxField("sys.Sys00_Common.selectByProvideContentCode") 빈칸="선택", `note` MyTextArea, `lookup` Biz05_Lookup_RelateAppr

#### 이벤트
[E0] 화면 열림 (생성자 L63-72) → setting(), getEditor()
[E1] providePurName[제공목적].Collapse [preValue == null] (L107) → 서비스 sys.Sys09_Code.selectByKindCode
[E2] provideContentName[제공내역].Collapse [preValue == null] (L134) → insertEmp()
[E3] updateButton[저장].Select (L167) → closeCheck(), update()
[E4] fileButton[증빙자료(0건)].Select (L175) → setFileButtonText()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public editModel() | L74-81 | 공개 메서드 | 상태 처리 | 업무 |
| public editModel2() | L83-91 | 공개 메서드 | 상태 처리 | 업무 |
| private setting() | L93-187 | 생성자 | 조회창 Biz05_Lookup_RelateAppr 열기, 서비스 sys.Sys09_Code.selectByKindCode, sys.Sys00_Common.selectByProvideContentCode | 업무 |
| private getEditor() | L189-202 | 생성자 | 상태 처리 | 업무 |
| public update() | L204-229 | E3 | 서비스 biz.Biz01_Promo.modelUpdate | 업무 |
| public updateNote() | L231-253 | closeCheck | 서비스 biz.Biz01_Promo.noteUpdate | 업무 |
| private setComboBox() | L255-279 | editModel,editModel2 | 서비스 sys.Sys09_Code.selectByKindCode, sys.Sys00_Common.selectByProvideContentCode | 업무 |
| public setButtonVisible() | L281-299 | 공개 메서드 | 상태 처리 | 업무 |
| private insertEmp() | L301-328 | E2 | 서비스 biz.Biz02_Person.insertEmpId(empId) | 업무 |
| private getEmpSetupYn() | L330-347 | insertEmp | 서비스 biz.Biz04_ProvideSetup.selectByProvideContentCode(companyId, provideContentCode) | 업무 |
| private closeCheck() | L349-370 | E3 | 서비스 biz.Biz01_Promo.closeCheck | 업무 |
| private setFileButtonText() | L373-385 | E4,editModel,editModel2 | 서비스 biz.Biz05_RelateAppr.selectFileCount(promoId) | 업무 |
| private setHtmlStyle() | L387-389 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L391-393 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |

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

