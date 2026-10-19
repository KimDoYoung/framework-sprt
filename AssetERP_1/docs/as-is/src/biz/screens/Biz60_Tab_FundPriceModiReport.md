# Biz60_Tab_FundPriceModiReport

- 종류: 화면
- 메뉴: KFS > 20. 기타 > 기준가 정정내역 보고 (#1505)
- 파일: `client/vi/biz/Biz60_Tab_FundPriceModiReport.java`
- 함께 쓰는 클래스 1개:
  - `Biz60_Edit_FundPriceModi` `client/vi/biz/Biz60_Edit_FundPriceModi.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr10_Lookup_MailSender`](../../dcr/components/Dcr10_Lookup_MailSender.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Sys10_Lookup_FileViewer`](../../sys/components/Sys10_Lookup_FileViewer.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz60_Tab_FundPriceModiReport:199, Biz60_Tab_FundPriceModiReport:538 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz60_FundPriceModi.delete` | Biz60_Tab_FundPriceModiReport:644 | [`Biz60_FundPriceModi.java:54`](../../biz/services/Biz60_FundPriceModi.md) | `UpdateDataModel(biz60_fund_price_modi)` 동적 DELETE |
| `biz.Biz60_FundPriceModi.modelUpdate` | Biz60_Edit_FundPriceModi:708 | [`Biz60_FundPriceModi.java:36`](../../biz/services/Biz60_FundPriceModi.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz60_fund_price_modi)` 동적 INSERT/UPDATE → [`biz60_fund_price_modi.selectById`](../../biz/sql/biz60_fund_price_modi.md) |
| `biz.Biz60_FundPriceModi.selectApprId` | Biz60_Tab_FundPriceModiReport:527 | **(없음)** | - |
| `biz.Biz60_FundPriceModi.selectByText` | Biz60_Tab_FundPriceModiReport:603 | [`Biz60_FundPriceModi.java:26`](../../biz/services/Biz60_FundPriceModi.md) | [`biz60_fund_price_modi.selectByText`](../../biz/sql/biz60_fund_price_modi.md) |
| `biz.Biz60_FundPriceModi.update` | Biz60_Tab_FundPriceModiReport:418 | [`Biz60_FundPriceModi.java:49`](../../biz/services/Biz60_FundPriceModi.md) | `UpdateDataModel(biz60_fund_price_modi)` 동적 INSERT/UPDATE → [`biz60_fund_price_modi.selectById`](../../biz/sql/biz60_fund_price_modi.md) |
| `biz.Biz61_ModiRptRelateAppr.selectByCompanyId` | Biz60_Tab_FundPriceModiReport:327 | [`Biz61_ModiRptRelateAppr.java:25`](../../biz/services/Biz61_ModiRptRelateAppr.md) | [`biz61_modi_rpt_relate_appr.selectByCompanyId`](../../biz/sql/biz61_modi_rpt_relate_appr.md) |
| `biz.Biz61_ModiRptRelateAppr.updateApprId` | Biz60_Tab_FundPriceModiReport:582 | [`Biz61_ModiRptRelateAppr.java:34`](../../biz/services/Biz61_ModiRptRelateAppr.md) | [`biz61_modi_rpt_relate_appr.insert`](../../biz/sql/biz61_modi_rpt_relate_appr.md), [`biz61_modi_rpt_relate_appr.selectByCompanyId`](../../biz/sql/biz61_modi_rpt_relate_appr.md), [`biz61_modi_rpt_relate_appr.updateApprId`](../../biz/sql/biz61_modi_rpt_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Biz60_Tab_FundPriceModiReport:445, Biz60_Tab_FundPriceModiReport:461, Biz60_Tab_FundPriceModiReport:477 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `getSeq` | Biz60_Edit_FundPriceModi:140 | (공통) 채번 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `sys.Sys10_File.selectByParentId` | Biz60_Edit_FundPriceModi:517 | [`Sys10_File.java:51`](../../sys/services/Sys10_File.md) | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) |
| `sys.Sys11_RelateFile.checkFileDelete` | Biz60_Edit_FundPriceModi:523 | [`Sys11_RelateFile.java:59`](../../sys/services/Sys11_RelateFile.md) | [`sys11_relate_file.checkFileDelete01`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete02`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.checkFileDelete03`](../../sys/sql/sys11_relate_file.md), [`sys11_relate_file.deleteRelateFile`](../../sys/sql/sys11_relate_file.md) |

## 테이블

[`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`biz60_fund_price_modi`](../../../db/tables/biz.md), [`biz61_modi_rpt_relate_appr`](../../../db/tables/biz.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md), [`sys11_relate_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz60_Tab_FundPriceModiReport (`client/vi/biz/Biz60_Tab_FundPriceModiReport.java`, 654줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 변경년월: {quickMoveField} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `quickMoveField` QuickMoveField, `searchText` TextField 빈칸="운용사/펀드", `apprStepCode` TextField, `apprStepName` TextField, `relateClassTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `editor` Apr01_Edit_ApprDoc, `mailSender` Dcr10_Lookup_MailSender, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - actionCell 55 "수정" Cell 편집:actionCell01
  - modiDate 100 "변경일" Date
  - reportTypeName 180 "구분" TextCenter
  - amCorpName 200 "운용사" Text
  - fundName 300 "펀드" Text
  - priceStdDate 100 "산출일" Date
  - firstPersonName 100 "최초발견자" Text
  - ksdNoticeYn 70 "예탁원<br>공시" BooleanYn
  - kofiaNoticeYn 70 "협회<br>공시" BooleanYn
  - cmpsAmt 100 "배상금액" Double
  - actionCell 80 "결재(보기)" Cell 편집:actionCell02
  - statusName 80 "결재상태" TextStatus
  - statusCode 80 "메일<br>보내기" DynamicCell 편집:actionCell03

#### 이벤트
[E0] 화면 열림 (생성자 L106-150) → settings(), retrieve()
[E1] searchText.KeyPress [Enter] (L160) → retrieve()
[E2] retrieveButton[조회].Select (L168) → retrieve()
[E3] insertButton[등록].Select (L174) → insertRow()
[E4] deleteButton[삭제].Select (L180) → deleteChk()
       └ [E8] msgBox.DialogHide [YES] (L624) → deleteRow()
[E5] apprButton[상신].Select (L186) → relateInsertLinkApproval()
[E6] apprViewButton[문서보기].Select (L196) → execute(), apprChk()
[E7] relateClassTreeFullName[문서분류].TriggerClick (L221) → openLookupDoc()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public execute() | L76-78 | E6,buildGrid,insertLinkApproval,updateApprId,openLookupDoc,relateInsertLinkApproval,retrieve,insertRow | 상태 처리 | 업무 |
| public execute() | L82-84 | E6,buildGrid,insertLinkApproval,updateApprId,openLookupDoc,relateInsertLinkApproval,retrieve,insertRow | 상태 처리 | 업무 |
| private apprChk() | L323-378 | E6,relateUpdateApprId,retrieve | 서비스 biz.Biz61_ModiRptRelateAppr.selectByCompanyId | 업무 |
| private insertLinkApproval() | L381-411 | buildGrid | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "문서분류가 미지정 상태입니다. 관리자에게 문의해주세요" | 업무 |
| private updateApprId() | L413-430 | insertLinkApproval | 서비스 biz.Biz60_FundPriceModi.update | 업무 |
| private openLookupDoc() | L433-442 | E7 | 상태 처리 | 업무 |
| private defaultName() | L444-495 | settings | 서비스 dcr.Dcr30_Link.selectByLinkCode, dcr.Dcr30_Link.selectByLinkCode, dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private getGridList() | L497-503 | relateInsertLinkApproval | 상태 처리 | 업무 |
| private relateInsertLinkApproval() | L505-579 | E5 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 biz.Biz60_FundPriceModi.selectApprId, apr.Apr01_Appr.selectById | 업무 |
| private relateUpdateApprId() | L581-594 | relateInsertLinkApproval | 서비스 biz.Biz61_ModiRptRelateAppr.updateApprId(companyId, yyyymm, apprId) | 업무 |
| public retrieve() | L596-610 | 생성자,E1,E2,execute,buildGrid,updateApprId,relateInsertLinkApproval,insertRow | 서비스 biz.Biz60_FundPriceModi.selectByText(companyId, yyyymm, searchText) | 업무 |
| public insertRow() | L612-619 | E3 | 팝업 Biz60_Edit_FundPriceModi 열기 | 업무 |
| private deleteChk() | L621-639 | E4 | ConfirmBox → E8 | 업무 |
| public deleteRow() | L641-645 | E8 | GridDeleteData biz.Biz60_FundPriceModi.delete(체크된 행 목록) | 업무 |
| private settings() | L152-227 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L229-321 | 필드 초기화 | 팝업 Biz60_Edit_FundPriceModi 열기, 팝업 Apr01_Edit_ApprDoc 열기, 조회창 Dcr10_Lookup_MailSender 열기 → 콜백: unmask, 미선택 시 alert "저장 후 진행가능합니다", 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L647-649 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L651-653 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L306) addCell
  gb.date('modiDate', 100, '변경일'),  // L307
  gb.textCenter('reportTypeNm', 180, '구분'),  // L308
  gb.text('amCorpNm', 200, '운용사'),  // L309
  gb.text('fundNm', 300, '펀드'),  // L310
  gb.date('priceStdDate', 100, '산출일'),  // L311
  gb.text('firstPersonNm', 100, '최초발견자'),  // L312
  gb.booleanYn('ksdNoticeYn', 70, '예탁원<br>공시'),  // L313
  gb.booleanYn('kofiaNoticeYn', 70, '협회<br>공시'),  // L314
  gb.double('cmpsAmt', 100, '배상금액'),  // L315
  // ⚠ 대응 없음 (GridBuilder L316) addCell
  gb.textStatus('statusNm', 80, '결재상태'),  // L317
  // ⚠ 대응 없음 (GridBuilder L318) addDynamicCell
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteChk}>삭제</Button>
4. <Button type="register" onClick={relateInsertLinkApproval}>상신</Button>
5. <Button type="search" onClick={() => /* execute(), apprChk() */}>문서보기</Button>

### Biz60_Edit_FundPriceModi (`client/vi/biz/Biz60_Edit_FundPriceModi.java`, 870줄)

- 입력·하위 화면: `reportType` TextField, `reportTypeName` ComboBoxField("FundPriceModifyReportType") 빈칸="선택해주세요", `modiDate` MyDateField, `priceStdDate` MyDateField, `amCorpName` TextField, `fundName` TextField, `firstPersonName` TextField, `discCause` TextField, `modiReason` MyTextArea, `prevPlan` MyTextArea, `ksdNoticeYn` CheckBox, `kofiaNoticeYn` CheckBox, `cmpsAmt` DoubleField, `fundCloseYn` CheckBox, `befPrice` DoubleField, `aftPrice` DoubleField, `befFullPrice` DoubleField, `aftFullPrice` DoubleField, `befTaxPrice` DoubleField, `aftTaxPrice` DoubleField, `befFullTaxPrice` DoubleField, `aftFullTaxPrice` DoubleField, `befClosePrice` DoubleField, `aftClosePrice` DoubleField, `befCloseFullPrice` DoubleField, `aftCloseFullPrice` DoubleField, `befCloseTaxPrice` DoubleField, `aftCloseTaxPrice` DoubleField, `befCloseFullTaxPrice` DoubleField, `aftCloseFullTaxPrice` DoubleField, `gapPrice` DoubleField, `gapFullPrice` DoubleField, `gapTaxPrice` DoubleField, `gapFullTaxPrice` DoubleField, `gapClosePrice` DoubleField, `gapCloseFullPrice` DoubleField, `gapCloseTaxPrice` DoubleField, `gapCloseFullTaxPrice` DoubleField, `lookupViewer` Sys10_Lookup_FileViewer
- 그리드 `relateFileGrid` (buildRelateFileGrid()):
  - fileName 350 "첨부파일" TextNotSort
  - actionCell 50 "받기" Cell 편집:downloadCell
  - actionCell 50 "삭제" Cell 편집:deleteCell
  - actionCell 50 "보기" Cell 편집:viewCell

#### 이벤트
[E0] 화면 열림 (생성자 L136-153) → init()
[E1] befPrice.Change (L241) → calculateGapPrices()
[E2] aftPrice.Change (L247) → calculateGapPrices()
[E3] befFullPrice.Change (L253) → calculateGapPrices()
[E4] aftFullPrice.Change (L259) → calculateGapPrices()
[E5] befTaxPrice.Change (L265) → calculateGapPrices()
[E6] aftTaxPrice.Change (L271) → calculateGapPrices()
[E7] befFullTaxPrice.Change (L277) → calculateGapPrices()
[E8] aftFullTaxPrice.Change (L283) → calculateGapPrices()
[E9] befClosePrice.Change (L289) → calculateGapPrices()
[E10] aftClosePrice.Change (L295) → calculateGapPrices()
[E11] befCloseFullPrice.Change (L301) → calculateGapPrices()
[E12] aftCloseFullPrice.Change (L307) → calculateGapPrices()
[E13] befCloseTaxPrice.Change (L313) → calculateGapPrices()
[E14] aftCloseTaxPrice.Change (L319) → calculateGapPrices()
[E15] befCloseFullTaxPrice.Change (L325) → calculateGapPrices()
[E16] aftCloseFullTaxPrice.Change (L331) → calculateGapPrices()
[E17] reportTypeName[구분].Collapse (L340) → enableds()
[E18] fundCloseYn[결산유무].ValueChange (L347) → 인라인 L347-352 (new ValueChangeHandler<Boolean>() { @…)
[E19] fileDeleteForm.SubmitComplete (L356) → fileRetrieve()
[E20] uploadButton[첨부파일].Select (L362) → upload()
[E21] updateButton[저장].Select (L368) → update()
[E22] closeButton[닫기].Select (L374) → hide()
[E23] fileUpload.Change (L402) → 인라인 L402-409 (new ChangeHandler() { @Override publi…)
[E24] fileUploadForm.SubmitComplete (L411) → fileRetrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L163-193 | 생성자 | 상태 처리 | 업무 |
| private enableds() | L382-394 | E17,init | 상태 처리 | 업무 |
| private upload() | L396-423 | E20 | 상태 처리 | 업무 |
| private buildRelateFileGrid() | L479-512 | 필드 초기화 | 조회창 Sys10_Lookup_FileViewer 열기 | 업무 |
| private fileRetrieve() | L514-518 | E19,E24,checkFileDelete | 서비스 sys.Sys10_File.selectByParentId(parentId) | 업무 |
| private checkFileDelete() | L520-545 | buildRelateFileGrid | 서비스 sys.Sys11_RelateFile.checkFileDelete(fileId, parentId) | 업무 |
| private getEditor() | L547-699 | init | 상태 처리 | 업무 |
| public update() | L701-719 | E21 | 서비스 biz.Biz60_FundPriceModi.modelUpdate | 업무 |
| private validateFields() | L721-801 | update | 상태 처리 | 업무 |
| private calculateGapPrices() | L841-850 | E1,E2,E3,E4,E5,E6,E7,E8,E9,E10,E11,E12,E13,E14,E15,E16,init | 상태 처리 | 업무 |
| private calculateGap() | L852-861 | calculateGapPrices | 상태 처리 | 업무 |
| private settings() | L195-380 | init | 이벤트 연결, 초기값: reportType=reportTypeName.getCode( | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L863-865 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L867-869 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildRelateFileGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L507) addTextNotSort
  // ⚠ 대응 없음 (GridBuilder L508) addCell
  // ⚠ 대응 없음 (GridBuilder L509) addCell
  // ⚠ 대응 없음 (GridBuilder L510) addCell
];
```

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="upload" onClick={upload}>파일업로드</Button>

