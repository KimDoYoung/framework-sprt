# Fnd30_Tab_DemandOpr

- 종류: 화면
- 메뉴: 펀드관리 > 04. 공모주청약 > 공모주 수요예측 (#1341)
- 파일: `client/vi/fnd/Fnd30_Tab_DemandOpr.java`
- 함께 쓰는 클래스 2개:
  - `Fnd31_Page_DemandOprFund` `client/vi/fnd/Fnd31_Page_DemandOprFund.java`
  - `Fnd31_Edit_DemandOprFund` `client/vi/fnd/Fnd31_Edit_DemandOprFund.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Adv02_Lookup_SelectSingle`](../../adv/components/Adv02_Lookup_SelectSingle.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Fnd01_Lookup_SelectSingle`](../../fnd/components/Fnd01_Lookup_SelectSingle.md), [`Fnd30_Edit_DemandOpr`](../../fnd/components/Fnd30_Edit_DemandOpr.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `adv.Adv02_Account.selectByCompanyId` | Fnd31_Edit_DemandOprFund:188 | [`Adv02_Account.java:26`](../../adv/services/Adv02_Account.md) | [`adv02_account.selectByCompanyId`](../../adv/sql/adv02_account.md) |
| `apr.Apr01_Appr.selectById` | Fnd30_Tab_DemandOpr:224, Fnd30_Tab_DemandOpr:284 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Fnd30_Tab_DemandOpr:173 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `fnd.Fnd30_Opr.delete` | Fnd30_Tab_DemandOpr:469 | [`Fnd30_Opr.java:235`](../../fnd/services/Fnd30_Opr.md) | `UpdateDataModel(fnd30_opr)` 동적 DELETE |
| `fnd.Fnd30_Opr.deleteApprId` | Fnd30_Tab_DemandOpr:452 | [`Fnd30_Opr.java:68`](../../fnd/services/Fnd30_Opr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md) |
| `fnd.Fnd30_Opr.deleteOprFund` | Fnd30_Tab_DemandOpr:460 | [`Fnd30_Opr.java:87`](../../fnd/services/Fnd30_Opr.md) | [`fnd31_opr_fund.deleteOprFund`](../../fnd/sql/fnd31_opr_fund.md) |
| `fnd.Fnd30_Opr.selectByDemandDate` | Fnd30_Tab_DemandOpr:400 | [`Fnd30_Opr.java:44`](../../fnd/services/Fnd30_Opr.md) | [`fnd30_opr.selectByDemandDate`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd30_Opr.selectById` | Fnd31_Edit_DemandOprFund:254, Fnd31_Page_DemandOprFund:116, Fnd31_Page_DemandOprFund:235 | [`Fnd30_Opr.java:26`](../../fnd/services/Fnd30_Opr.md) | [`fnd30_opr.selectById`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd30_Opr.updateApprId` | Fnd30_Tab_DemandOpr:366 | [`Fnd30_Opr.java:97`](../../fnd/services/Fnd30_Opr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`fnd30_opr.updateApprId`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd31_OprFund.delete` | Fnd31_Page_DemandOprFund:221 | [`Fnd31_OprFund.java:62`](../../fnd/services/Fnd31_OprFund.md) | `UpdateDataModel(fnd31_opr_fund)` 동적 DELETE |
| `fnd.Fnd31_OprFund.modelUpdate` | Fnd31_Edit_DemandOprFund:288 | [`Fnd31_OprFund.java:39`](../../fnd/services/Fnd31_OprFund.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd31_opr_fund)` 동적 INSERT/UPDATE → [`fnd31_opr_fund.selectById`](../../fnd/sql/fnd31_opr_fund.md) |
| `fnd.Fnd31_OprFund.selectByOprId` | Fnd31_Page_DemandOprFund:169 | [`Fnd31_OprFund.java:25`](../../fnd/services/Fnd31_OprFund.md) | [`fnd31_opr_fund.selectByOprId`](../../fnd/sql/fnd31_opr_fund.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd30_opr`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_corp_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd30_Tab_DemandOpr (`client/vi/fnd/Fnd30_Tab_DemandOpr.java`, 494줄)

- 레이아웃: center=vlc, south=demandOprFundPage
- 툴바 `buttonBar`: 신청일: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton} {insertButton} {deleteButton} {dcrLinkButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="종목/주간사", `demandOprFundPage` Fnd31_Page_DemandOprFund, `lookup` Dcr30_Lookup_Link, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - demandDate 90 "신청일" Date
  - itemName 200 "종목명" Text
  - market 80 "시장구분" TextCenter
  - leadManager 180 "주간사" Text
  - demandPeriod 140 "수요예측기간" TextCenter
  - priceBracket 140 "공모가밴드" TextCenter
  - price 80 "신청가격" Long
  - priceAcceptStr 100 "확정공모가액<br>-10% 변동수용" TextCenterHtml
  - lockPeriod 75 "확약기간" TextCenter
  - actionCell 40 "수정" Cell 편집:editCell
  - actionCell 60 "결재요청" Cell 편집:actionCell
  - apprStatusName 70 "결재상태" TextCenter
  - actionCell 60 "상세보기" Cell 편집:viewCell
  - cancelName 60 "참여취소" TextCenter
  - note 400 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L73-120) → settings(), defaultName(), retrieve()
[E1] grid.SelectionChanged (L111) → retrieveEtcPerson()
[E2] searchText.KeyPress [Enter] (L131) → retrieve()
[E3] retrieveButton[조회].Select (L140) → retrieve()
[E4] insertButton[등록].Select (L146) → insertRow()
[E5] deleteButton[삭제].Select (L152) → deleteCheck()
       └ [E8] msgBox.DialogHide [YES] (L432) → delete()
[E6] dcrLinkButton[문서분류지정].Select (L158) → defaultName()
[E7] msgBox.DialogHide [YES] (L250) → insertApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L172-189 | 생성자,E6 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertApproval() | L330-348 | E7,buildGrid | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| private insertLinkApproval() | L350-363 | insertApproval | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L365-383 | insertLinkApproval | 서비스 fnd.Fnd30_Opr.updateApprId(apprId, oprId, companyId, startDate, closeDate, searchText, lastApprId, empId) | 업무 |
| private retrieveEtcPerson() | L385-391 | E1 | 상태 처리 | 업무 |
| private retrieve() | L393-408 | 생성자,E2,E3,buildGrid,updateApprId,insertRow | 서비스 fnd.Fnd30_Opr.selectByDemandDate(companyId, startDate, closeDate, oprCode, searchText) | 업무 |
| private deleteCheck() | L410-447 | E5 | ConfirmBox → E8 | 업무 |
| private delete() | L449-479 | E8 | GridDeleteData fnd.Fnd30_Opr.deleteApprId, fnd.Fnd30_Opr.deleteOprFund, fnd.Fnd30_Opr.delete(체크된 행 목록) | 업무 |
| private insertRow() | L481-489 | E4 | 팝업 Fnd30_Edit_DemandOpr 열기 | 업무 |
| private settings() | L122-170 | 생성자 | 조회창 Dcr30_Lookup_Link 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L191-328 | 필드 초기화 | 팝업 Fnd30_Edit_DemandOpr 열기, 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시, 서비스 apr.Apr01_Appr.selectById, apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L491-493 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('demandDate', 90, '신청일'),  // L311
  gb.text('itemNm', 200, '종목명'),  // L312
  gb.textCenter('market', 80, '시장구분'),  // L313
  gb.text('leadManager', 180, '주간사'),  // L314
  gb.textCenter('demandPeriod', 140, '수요예측기간'),  // L315
  gb.textCenter('priceBracket', 140, '공모가밴드'),  // L316
  gb.long('price', 80, '신청가격'),  // L317
  // ⚠ 대응 없음 (GridBuilder L318) addTextCenterHtml
  gb.textCenter('lockPeriod', 75, '확약기간'),  // L319
  // ⚠ 대응 없음 (GridBuilder L320) addCell
  // ⚠ 대응 없음 (GridBuilder L321) addCell
  gb.textCenter('apprStatusNm', 70, '결재상태'),  // L322 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L323) addCell
  gb.textCenter('cancelNm', 60, '참여취소'),  // L324 SQL 계산 컬럼(selectById: CASE WHEN COALESCE(fnd30_cancel_yn,'fal…)
  gb.text('note', 400, '비고'),  // L325
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={deleteCheck}>삭제</Button>
4. <Button type="save" onClick={defaultName}>문서분류지정</Button>

### Fnd31_Page_DemandOprFund (`client/vi/fnd/Fnd31_Page_DemandOprFund.java`, 286줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {tempDownloadButton} {downloadForm} {excelUploadButton} {uploadExcelForm}
- 입력·하위 화면: `lookup` Fnd31_Edit_DemandOprFund
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - fundCode 100 "펀드코드" Text
  - fundName 400 "펀드명" Text
  - qty 100 "신청수량" Long
  - settleAmt 100 "신청금액" Long
  - actionCell 80 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L59-110) → 초기화
[E1] insertButton[등록].Select (L60) → insertRow()
[E2] deleteButton[삭제].Select (L66) → deleteCheck()
       └ [E6] msgBox.DialogHide [YES] (L199) → deleteRow()
[E3] tempDownloadButton[템플릿].Select (L72) → 인라인 L72-77 (new SelectHandler(){ @Override public…)
[E4] excelUploadButton[엑셀업로드].Select (L78) → excelUpload()
[E5] uploadExcelForm.SubmitComplete (L101) → retrieve()
[E7] fileUploadField.Change (L275) → 인라인 L275-280 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L157-159 | E5,buildGrid,insertRow,deleteRow | 상태 처리 | 업무 |
| public retrieve() | L161-171 | E5,buildGrid,insertRow,deleteRow | 서비스 fnd.Fnd31_OprFund.selectByOprId(oprId) | 업무 |
| private insertRow() | L173-186 | E1 | 팝업 Fnd31_Edit_DemandOprFund 열기 | 업무 |
| private deleteCheck() | L188-216 | E2 | ConfirmBox → E6 | 업무 |
| private deleteRow() | L218-227 | E6 | GridDeleteData fnd.Fnd31_OprFund.delete(체크된 행 목록) | 업무 |
| private apprCheck() | L229-260 | insertRow,deleteCheck,excelUpload | 서비스 fnd.Fnd30_Opr.selectById | 업무 |
| private excelUpload() | L262-285 | E4 | 상태 처리 | 업무 |
| private buildGrid() | L112-155 | 필드 초기화 | 팝업 Fnd31_Edit_DemandOprFund 열기, 서비스 fnd.Fnd30_Opr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 100, '펀드코드'),  // L148 SQL 계산 컬럼(selectByOprId: c.fund_cd)
  gb.text('fundNm', 400, '펀드명'),  // L149 SQL 계산 컬럼(selectByOprId: c.fund_nm)
  gb.long('qty', 100, '신청수량'),  // L150
  gb.long('settleAmt', 100, '신청금액'),  // L151
  // ⚠ 대응 없음 (GridBuilder L152) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteCheck}>삭제</Button>
3. <Button type="download" onClick={() => /* 인라인 L72-77 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
4. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

### Fnd31_Edit_DemandOprFund (`client/vi/fnd/Fnd31_Edit_DemandOprFund.java`, 358줄)

- 입력·하위 화면: `fundCode` LookupTriggerField, `fundName` MyTextArea, `qty` LongField, `price` LongField, `settleAmt` LongField, `lookup` Adv02_Lookup_SelectSingle, `lookupSingleFund` Fnd01_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L100-142) → settings(), show()
[E1] updateButton[저장].Select (L149) → update()
[E2] closeButton[닫기].Select (L155) → hide()
[E3] fundButton[펀드선택].Select (L161) → openLookupOpr()
[E4] accountButton[일임계좌선택].Select [result != null] (L167) → 인라인 L167-184 (new SelectHandler(){ @Override public…)
[E5] fundCode[펀드코드].TriggerClick [result.getStatus() > 0] (L185) → openLookupOpr()
[E6] fundCode[펀드코드].ValueChange (L209) → 인라인 L209-237 (new ValueChangeHandler<String>() { @O…)
[E7] qty[신청수량].Change (L243) → checkLongNull()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L72-84 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L86-98 | 공개 메서드 | 상태 처리 | 업무 |
| private servicePublic() | L253-269 | insert,edit | 서비스 fnd.Fnd30_Opr.selectById(oprId) | 업무 |
| private update() | L271-300 | E1 | 서비스 fnd.Fnd31_OprFund.modelUpdate | 업무 |
| private openLookupOpr() | L302-316 | E3,E5 | 조회창 Fnd01_Lookup_SelectSingle 열기 | 업무 |
| private checkLongNull() | L343-349 | E7 | 상태 처리 | 업무 |
| private settings() | L144-251 | 생성자 | 조회창 Adv02_Lookup_SelectSingle 열기, 팝업 SettingPopup 열기, 서비스 adv.Adv02_Account.selectByCompanyId(companyId), 이벤트 연결, 초기값: fundName=resultModel.getManageName(("펀드명"), fundCode=resultModel.getManageCode(("펀드코드"), settleAmt=checkLongNull(qty.getCurrentValue(("신청금액") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L351-353 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L355-357 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={openLookupOpr}>펀드선택</Button>
4. <Button type="unknown" onClick={() => /* 인라인 L167-184 (new SelectHandler(){ @Override public…) */}>일임계좌선택</Button>

