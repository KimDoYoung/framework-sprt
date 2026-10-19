# Est02_Tab_PfContract

- 종류: 화면
- 메뉴: 펀드관리 > 05. 부동산PF 용역수행 > 용역계약체결 (#1376)
- 파일: `client/vi/est/Est02_Tab_PfContract.java`
- 함께 쓰는 클래스 3개:
  - `Est02_Edit_PfContract` `client/vi/est/Est02_Edit_PfContract.java`
  - `Est02_Grid_File` `client/vi/est/Est02_Grid_File.java`
  - `Est01_Lookup_PfFeeType` `client/vi/est/Est01_Lookup_PfFeeType.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Emp00_Lookup_SelectSingle`](../../emp/components/Emp00_Lookup_SelectSingle.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Est02_Tab_PfContract:201 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Est02_Tab_PfContract:312 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `est.Est01_PfFeeType.selectByText` | Est01_Lookup_PfFeeType:113 | [`Est01_PfFeeType.java:30`](../../est/services/Est01_PfFeeType.md) | [`est01_pf_fee_type.selectByText`](../../est/sql/est01_pf_fee_type.md) |
| `est.Est02_PfContract.delete` | Est02_Tab_PfContract:299 | [`Est02_PfContract.java:86`](../../est/services/Est02_PfContract.md) | `UpdateDataModel(est02_pf_contract)` 동적 DELETE |
| `est.Est02_PfContract.modelUpdate` | Est02_Edit_PfContract:248 | [`Est02_PfContract.java:68`](../../est/services/Est02_PfContract.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(est02_pf_contract)` 동적 INSERT/UPDATE → [`est02_pf_contract.selectById`](../../est/sql/est02_pf_contract.md) |
| `est.Est02_PfContract.selectByText` | Est02_Tab_PfContract:251 | [`Est02_PfContract.java:27`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.selectByText`](../../est/sql/est02_pf_contract.md) |
| `est.Est02_PfContract.updateApprId` | Est02_Tab_PfContract:353 | [`Est02_PfContract.java:50`](../../est/services/Est02_PfContract.md) | [`est02_pf_contract.updateApprId`](../../est/sql/est02_pf_contract.md) |
| `est.Est03_PfHistory.checkList` | Est02_Tab_PfContract:143, Est02_Tab_PfContract:266 | [`Est03_PfHistory.java:77`](../../est/services/Est03_PfHistory.md) | [`est03_pf_history.checkList`](../../est/sql/est03_pf_history.md) |
| `sys.Sys10_File.selectByParentId` | Est02_Grid_File:120 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Est02_Grid_File:182 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`est01_pf_fee_type`](../../../db/tables/est.md), [`est02_pf_contract`](../../../db/tables/est.md), [`est03_pf_history`](../../../db/tables/est.md), [`est04_pf_file`](../../../db/tables/est.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Est02_Tab_PfContract (`client/vi/est/Est02_Tab_PfContract.java`, 405줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 조회기준일: {startDate} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `startDate` MyDateField, `searchText` TextField 빈칸="차주명/사업자명/수수료명", `lookup` Est02_Edit_PfContract, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - actionCell 50 "수정" Cell 편집:actionCell01
  - borrower 100 "차주명" Text
  - projectSiteName 250 "사업자명" Text
  - projectSiteAddr 250 "사업장 주소지" Text
  - feeName 200 "용역(수수료)명" Text
  - startDate 100 "수행시작일" Date
  - closeDate 100 "수행종료일" Date
  - managerInfo 350 "담당자" Text
  - actionCell 50 "결재" Cell 편집:actionCell02
  - planApprStatusName 100 "결재상태" TextCenter
  - actionCell 100 "문서보기" Cell 편집:actionCell03

#### 이벤트
[E0] 화면 열림 (생성자 L67-92) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L99) → retrieve()
[E2] retrieveButton[조회].Select (L107) → retrieve()
[E3] insertButton[등록].Select (L113) → retrieve()
[E4] deleteButton[삭제].Select (L125) → deleteChk()
[E5] msgBox.DialogHide [YES] (L292) → 서비스 est.Est02_PfContract.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L244-257 | 생성자,E1,E2,E3,buildGrid,updateApprId | 서비스 est.Est02_PfContract.selectByText(companyId, startDate, searchText) | 업무 |
| private deleteChk() | L259-287 | E4 | 서비스 est.Est03_PfHistory.checkList | 업무 |
| public deleteRow() | L289-309 | deleteChk | 확인창 표시, GridDeleteData est.Est02_PfContract.delete(체크된 행 목록) | 업무 |
| private getClassTreeModel() | L311-335 | buildGrid | 조회창 Dcr01_Lookup_Class 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L337-350 | getClassTreeModel | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L352-364 | insertLinkApproval | 서비스 est.Est02_PfContract.updateApprId(pfContractId, apprId) | 업무 |
| public createMapping() | L366-378 | insertLinkApproval | 상태 처리 | 업무 |
| private checkStringNull() | L380-388 | createMapping | 상태 처리 | 업무 |
| private checkDateNull() | L390-400 | createMapping | 상태 처리 | 업무 |
| private settings() | L94-131 | 생성자 | 팝업 Est02_Edit_PfContract 열기, 이벤트 연결, 초기값: startDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L133-242 | 필드 초기화 | 팝업 Est02_Edit_PfContract 열기, 팝업 Apr01_Edit_ApprDoc 열기, 서비스 est.Est03_PfHistory.checkList, apr.Apr01_Appr.selectById(apprId), 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L402-404 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L229) addCell
  gb.text('borrower', 100, '차주명'),  // L230
  gb.text('projectSiteNm', 250, '사업자명'),  // L231
  gb.text('projectSiteAddr', 250, '사업장 주소지'),  // L232
  gb.text('feeNm', 200, '용역(수수료)명'),  // L233
  gb.date('startDate', 100, '수행시작일'),  // L234
  gb.date('closeDate', 100, '수행종료일'),  // L235
  gb.text('managerInfo', 350, '담당자'),  // L236
  // ⚠ 대응 없음 (GridBuilder L237) addCell
  gb.textCenter('planApprStatusNm', 100, '결재상태'),  // L238
  // ⚠ 대응 없음 (GridBuilder L239) addCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={retrieve}>등록</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>

### Est02_Edit_PfContract (`client/vi/est/Est02_Edit_PfContract.java`, 311줄)

- 입력·하위 화면: `pfFeeTypeId` LongField, `feeName` LookupTriggerField, `managerId` LongField, `managerName` LookupTriggerField, `borrower` TextField, `projectSiteName` TextField, `projectSiteAddr` TextField, `startDate` MyDateField, `closeDate` MyDateField, `lookup` Est01_Lookup_PfFeeType, `lookupEmpTransInfo` Emp00_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L133-168) → settings(), getEditor()
[E1] feeName.TriggerClick (L172) → 인라인 L172-186 (new TriggerClickHandler(){ @Override …)
[E2] managerName[담당자].TriggerClick (L188) → 인라인 L188-202 (new TriggerClickHandler(){ @Override …)
[E3] updateButton[저장].Select (L203) → update()
[E4] closeButton[닫기].Select (L209) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L81-101 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L103-131 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L217-259 | E3 | 서비스 est.Est02_PfContract.modelUpdate | 업무 |
| private getEditor() | L263-275 | 생성자 | 상태 처리 | 업무 |
| private settings() | L170-215 | 생성자 | 조회창 Est01_Lookup_PfFeeType 열기, 조회창 Emp00_Lookup_SelectSingle 열기, 이벤트 연결, 초기값: feeName=resultModel.getFeeName(, pfFeeTypeId=resultModel.getPfFeeTypeId(, managerName=empTransInfoModel.getEmpPersonModel(("담당자"), managerId=empTransInfoModel.getPersonId( | UI구성 (이벤트 절로 대체) |
| private setHtml() | L277-280 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L292-294 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L296-298 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L300-302 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L304-306 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L308-310 | 미사용 후보 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Est02_Grid_File (`client/vi/est/Est02_Grid_File.java`, 211줄)

- 툴바 `buttonBar`: {uploadFileButton} {fileUploadForm} {fileDownloadForm} {fileDeleteForm}
- 입력·하위 화면: `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `fileGrid` (buildApprFileGrid(), 체크박스):
  - fileName 300 "첨부파일" TextNotSort
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell
  - actionCell 50 "보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L53-103) → 초기화
[E1] fileUpload.Change (L59) → 인라인 L59-66 (new ChangeHandler() { @Override publi…)
[E2] fileUploadForm.SubmitComplete (L68) → retrieve()
[E3] fileDeleteForm.SubmitComplete (L78) → retrieve()
[E4] uploadFileButton[파일업로드].Select (L84) → 인라인 L84-89 (new SelectHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L105-107 | E2,E3,checkFileDelete | 상태 처리 | 업무 |
| public retrieve() | L109-135 | E2,E3,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private buildApprFileGrid() | L137-177 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private checkFileDelete() | L179-204 | buildApprFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| public unEnable() | L206-210 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
```javascript
const buildApprFileGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L171) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L172) addCell
  // ⚠ 대응 없음 (GridBuilder L173) addCell
  // ⚠ 대응 없음 (GridBuilder L174) addCell
];
```

#### 사용된 버튼들
1. <Button type="upload" onClick={() => /* 인라인 L84-89 (new SelectHandler() { @Override publi…) */}>파일업로드</Button>

### Est01_Lookup_PfFeeType (`client/vi/est/Est01_Lookup_PfFeeType.java`, 142줄)

- 툴바 `buttonBar`: 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField 빈칸="부동산PF 수수료 항목/정의"
- 그리드 `grid` (buildGrid(), 체크박스):
  - feeName 250 "부동산PF 수수료 항목" Text
  - feeDesc 550 "정의" Text

#### 이벤트
[E0] 화면 열림 (생성자 L70-72) → settings()
[E1] retrieveButton[조회].Select (L77) → retrieve()
[E2] confirmButton[확인].Select (L83) → confirm()
[E3] grid.CellDoubleClick (L89) → confirm()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L44-68 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L106-119 | E1,open | 서비스 est.Est01_PfFeeType.selectByText(companyId, startDate, searchText) | 업무 |
| public confirm() | L121-133 | E2,E3 | 미선택 시 alert "선택된 용역(수수료)가 없습니다" | 업무 |
| private settings() | L74-95 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L97-104 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L135-137 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L139-141 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('feeNm', 250, '부동산PF 수수료 항목'),  // L100 SQL 계산 컬럼(selectByText: a.sys09_name)
  gb.text('feeDesc', 550, '정의'),  // L101 SQL 계산 컬럼(selectByText: a.sys09_desc)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>

