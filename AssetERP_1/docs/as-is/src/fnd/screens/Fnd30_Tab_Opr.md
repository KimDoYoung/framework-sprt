# Fnd30_Tab_Opr

- 종류: 화면
- 메뉴: 펀드관리 > 04. 공모주청약 > 공모주청약 운용지시 (#1227)
- 파일: `client/vi/fnd/Fnd30_Tab_Opr.java`
- 함께 쓰는 클래스 3개:
  - `Fnd31_Page_OprFund` `client/vi/fnd/Fnd31_Page_OprFund.java`
  - `Fnd31_Edit_OprFund` `client/vi/fnd/Fnd31_Edit_OprFund.java`
  - `Fnd30_Lookup_DemandOprList` `client/vi/fnd/Fnd30_Lookup_DemandOprList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Adv02_Lookup_SelectSingle`](../../adv/components/Adv02_Lookup_SelectSingle.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr01_Lookup_Class`](../../dcr/components/Dcr01_Lookup_Class.md), [`Dcr30_Lookup_Link`](../../dcr/components/Dcr30_Lookup_Link.md), [`Fnd01_Lookup_SelectSingle`](../../fnd/components/Fnd01_Lookup_SelectSingle.md), [`Fnd30_Edit_Opr`](../../fnd/components/Fnd30_Edit_Opr.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `adv.Adv02_Account.selectByCompanyId` | Fnd31_Edit_OprFund:208 | [`Adv02_Account.java:26`](../../adv/services/Adv02_Account.md) | [`adv02_account.selectByCompanyId`](../../adv/sql/adv02_account.md) |
| `apr.Apr01_Appr.selectById` | Fnd30_Tab_Opr:234, Fnd30_Tab_Opr:294 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Fnd30_Tab_Opr:190 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `fnd.Fnd30_Opr.delete` | Fnd30_Tab_Opr:499 | [`Fnd30_Opr.java:235`](../../fnd/services/Fnd30_Opr.md) | `UpdateDataModel(fnd30_opr)` 동적 DELETE |
| `fnd.Fnd30_Opr.deleteApprId` | Fnd30_Tab_Opr:482 | [`Fnd30_Opr.java:68`](../../fnd/services/Fnd30_Opr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr03_relate_fund.deleteByApprId`](../../apr/sql/apr03_relate_fund.md), [`apr04_appr_step.deleteByApprId`](../../apr/sql/apr04_appr_step.md), [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md) |
| `fnd.Fnd30_Opr.deleteOprFund` | Fnd30_Tab_Opr:490 | [`Fnd30_Opr.java:87`](../../fnd/services/Fnd30_Opr.md) | [`fnd31_opr_fund.deleteOprFund`](../../fnd/sql/fnd31_opr_fund.md) |
| `fnd.Fnd30_Opr.selectByDate` | Fnd30_Tab_Opr:430 | [`Fnd30_Opr.java:32`](../../fnd/services/Fnd30_Opr.md) | [`fnd30_opr.selectByDate`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd30_Opr.selectByDemandOprCode` | Fnd30_Lookup_DemandOprList:165 | [`Fnd30_Opr.java:56`](../../fnd/services/Fnd30_Opr.md) | [`fnd30_opr.selectByDemandOprCode`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd30_Opr.selectById` | Fnd31_Edit_OprFund:298, Fnd31_Page_OprFund:121, Fnd31_Page_OprFund:192 | [`Fnd30_Opr.java:26`](../../fnd/services/Fnd30_Opr.md) | [`fnd30_opr.selectById`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd30_Opr.updateApprId` | Fnd30_Tab_Opr:396 | [`Fnd30_Opr.java:97`](../../fnd/services/Fnd30_Opr.md) | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`fnd30_opr.updateApprId`](../../fnd/sql/fnd30_opr.md) |
| `fnd.Fnd31_OprFund.delete` | Fnd31_Page_OprFund:235 | [`Fnd31_OprFund.java:62`](../../fnd/services/Fnd31_OprFund.md) | `UpdateDataModel(fnd31_opr_fund)` 동적 DELETE |
| `fnd.Fnd31_OprFund.modelUpdate` | Fnd31_Edit_OprFund:372 | [`Fnd31_OprFund.java:39`](../../fnd/services/Fnd31_OprFund.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd31_opr_fund)` 동적 INSERT/UPDATE → [`fnd31_opr_fund.selectById`](../../fnd/sql/fnd31_opr_fund.md) |
| `fnd.Fnd31_OprFund.selectByOprId` | Fnd30_Tab_Opr:364, Fnd31_Page_OprFund:177 | [`Fnd31_OprFund.java:25`](../../fnd/services/Fnd31_OprFund.md) | [`fnd31_opr_fund.selectByOprId`](../../fnd/sql/fnd31_opr_fund.md) |
| `fnd.Fnd31_OprFund.sumQty` | Fnd31_Edit_OprFund:318, Fnd31_Edit_OprFund:331 | [`Fnd31_OprFund.java:51`](../../fnd/services/Fnd31_OprFund.md) | [`fnd31_opr_fund.sumQty`](../../fnd/sql/fnd31_opr_fund.md) |

## 테이블

[`adv02_account`](../../../db/tables/adv.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr03_relate_fund`](../../../db/tables/apr.md), [`apr04_appr_step`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`apr99_appr_del`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`fnd01_fund_code`](../../../db/tables/fnd.md), [`fnd02_fund_info`](../../../db/tables/fnd.md), [`fnd30_opr`](../../../db/tables/fnd.md), [`fnd31_opr_fund`](../../../db/tables/fnd.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sch10_ipo`](../../../db/tables/sch.md), [`sys10_file`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_create_seq`, `f_get_corp_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Fnd30_Tab_Opr (`client/vi/fnd/Fnd30_Tab_Opr.java`, 524줄)

- 레이아웃: center=vlc, south=oprFundPage
- 툴바 `buttonBar`: 청약기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton} {insertButton} {insertDemandButton} {deleteButton} {dcrLinkButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="종목/주간사", `oprFundPage` Fnd31_Page_OprFund, `lookup` Fnd30_Lookup_DemandOprList, `editor` Apr01_Edit_ApprDoc, `popup` Dcr01_Lookup_Class, `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid(), 체크박스):
  - subscriptionDate 100 "청약일" Date
  - itemName 200 "종목명" Text
  - corpName 100 "주간사" Text
  - price 100 "발행가" Long
  - feeRate 100 "수수료율(%)" Double
  - payDate 100 "납입일" Date
  - qty 100 "총 배정수량" Long
  - lockPeriod 75 "확약기간" TextCenter
  - actionCell 60 "수정" Cell 편집:editCell
  - actionCell 70 "결재요청" Cell 편집:actionCell
  - apprStatusName 100 "결재상태" TextCenter
  - actionCell 80 "상세보기" Cell 편집:viewCell
  - note 400 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L77-125) → settings(), defaultName(), retrieve()
[E1] grid.SelectionChanged (L116) → retrieveEtcPerson()
[E2] searchText.KeyPress [Enter] (L136) → retrieve()
[E3] retrieveButton[조회].Select (L145) → retrieve()
[E4] insertButton[등록].Select (L151) → insertRow()
[E5] insertDemandButton[등록(수요예측)].Select (L157) → retrieve()
[E6] deleteButton[삭제].Select (L169) → deleteCheck()
       └ [E9] msgBox.DialogHide [YES] (L462) → delete()
[E7] dcrLinkButton[문서분류지정].Select (L175) → defaultName()
[E8] msgBox.DialogHide [YES] (L260) → insertApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L189-206 | 생성자,E7 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertApproval() | L339-359 | E8,buildGrid | 조회창 Dcr01_Lookup_Class 열기 | 업무 |
| private insertLinkApproval() | L361-393 | insertApproval | 팝업 Apr01_Edit_ApprDoc 열기, 미선택 시 alert "총 배정수량과 펀드별 배정수량의 합계가 일치하지 않습니다", 서비스 fnd.Fnd31_OprFund.selectByOprId | 업무 |
| private updateApprId() | L395-413 | insertLinkApproval | 서비스 fnd.Fnd30_Opr.updateApprId(apprId, oprId, companyId, startDate, closeDate, searchText, lastApprId, empId) | 업무 |
| private retrieveEtcPerson() | L415-421 | E1 | 상태 처리 | 업무 |
| private retrieve() | L423-438 | 생성자,E2,E3,E5,buildGrid,updateApprId,insertRow | 서비스 fnd.Fnd30_Opr.selectByDate(companyId, startDate, closeDate, oprCode, searchText) | 업무 |
| private deleteCheck() | L440-477 | E6 | ConfirmBox → E9 | 업무 |
| private delete() | L479-509 | E9 | GridDeleteData fnd.Fnd30_Opr.deleteApprId, fnd.Fnd30_Opr.deleteOprFund, fnd.Fnd30_Opr.delete(체크된 행 목록) | 업무 |
| private insertRow() | L511-519 | E4 | 팝업 Fnd30_Edit_Opr 열기 | 업무 |
| private settings() | L127-187 | 생성자 | 조회창 Fnd30_Lookup_DemandOprList 열기, 조회창 Dcr30_Lookup_Link 열기, 이벤트 연결, 초기값: startDate=ClientDateUtil.toDate(DateTimeFormat.getFormat("yyyy-01-01", closeDate=LoginUser.getToday( | UI구성 (이벤트 절로 대체) |
| private buildGrid() | L208-337 | 필드 초기화 | 팝업 Fnd30_Edit_Opr 열기, 팝업 Apr01_Edit_ApprDoc 열기, 확인창 표시, 서비스 apr.Apr01_Appr.selectById, apr.Apr01_Appr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L521-523 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('subscriptionDate', 100, '청약일'),  // L321
  gb.text('itemNm', 200, '종목명'),  // L322
  gb.text('corpNm', 100, '주간사'),  // L324 SQL 계산 컬럼(selectById: f_get_corp_nm(fnd30_corp_id))
  gb.long('price', 100, '발행가'),  // L325
  gb.double('feeRate', 100, '수수료율(%)'),  // L326
  gb.date('payDate', 100, '납입일'),  // L327
  gb.long('qty', 100, '총 배정수량'),  // L328
  gb.textCenter('lockPeriod', 75, '확약기간'),  // L329
  // ⚠ 대응 없음 (GridBuilder L330) addCell
  // ⚠ 대응 없음 (GridBuilder L331) addCell
  gb.textCenter('apprStatusNm', 100, '결재상태'),  // L332 SQL 계산 컬럼(selectById: f_cdnm('AprStatusCode', apr01_status_cd…)
  // ⚠ 대응 없음 (GridBuilder L333) addCell
  gb.text('note', 400, '비고'),  // L334
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="register" onClick={retrieve}>등록(수요예측)</Button>
4. <Button type="delete" onClick={deleteCheck}>삭제</Button>
5. <Button type="save" onClick={defaultName}>문서분류지정</Button>

### Fnd31_Page_OprFund (`client/vi/fnd/Fnd31_Page_OprFund.java`, 262줄)

- 툴바 `buttonBar`: {insertButton} {deleteButton} {tempDownloadButton} {downloadForm} {excelUploadButton} {uploadExcelForm}
- 입력·하위 화면: `lookup` Fnd31_Edit_OprFund
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - fundCode 100 "펀드코드" Text
  - fundName 400 "펀드명" Text
  - qty 100 "배정수량" Long
  - price 100 "단가" Long
  - contAmt 100 "배정금액" Long
  - fee 100 "수수료" Long
  - settleAmt 100 "납입금액" Long
  - actionCell 80 "수정" Cell 편집:editCell

#### 이벤트
[E0] 화면 열림 (생성자 L59-115) → 초기화
[E1] insertButton[등록].Select [oprId == null] (L60) → insertRow()
[E2] deleteButton[삭제].Select (L71) → deleteCheck()
       └ [E6] msgBox.DialogHide [YES] (L211) → deleteRow()
[E3] tempDownloadButton[템플릿].Select (L77) → 인라인 L77-82 (new SelectHandler(){ @Override public…)
[E4] excelUploadButton[엑셀업로드].Select (L83) → excelUpload()
[E5] uploadExcelForm.SubmitComplete (L106) → retrieve()
[E7] fileUploadField.Change (L253) → 인라인 L253-258 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L165-167 | E5,buildGrid,insertRow,deleteRow | 상태 처리 | 업무 |
| public retrieve() | L169-179 | E5,buildGrid,insertRow,deleteRow | 서비스 fnd.Fnd31_OprFund.selectByOprId(oprId) | 업무 |
| private insertRow() | L181-189 | E1 | 팝업 Fnd31_Edit_OprFund 열기 | 업무 |
| private deleteCheck() | L191-230 | E2 | ConfirmBox → E6 | 업무 |
| private deleteRow() | L232-241 | E6 | GridDeleteData fnd.Fnd31_OprFund.delete(체크된 행 목록) | 업무 |
| private excelUpload() | L243-261 | E4 | 상태 처리 | 업무 |
| private buildGrid() | L117-163 | 필드 초기화 | 팝업 Fnd31_Edit_OprFund 열기, 서비스 fnd.Fnd30_Opr.selectById, 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('fundCd', 100, '펀드코드'),  // L153 SQL 계산 컬럼(selectByOprId: c.fund_cd)
  gb.text('fundNm', 400, '펀드명'),  // L154 SQL 계산 컬럼(selectByOprId: c.fund_nm)
  gb.long('qty', 100, '배정수량'),  // L155
  gb.long('price', 100, '단가'),  // L156
  gb.long('contAmt', 100, '배정금액'),  // L157
  gb.long('fee', 100, '수수료'),  // L158
  gb.long('settleAmt', 100, '납입금액'),  // L159
  // ⚠ 대응 없음 (GridBuilder L160) addCell
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="delete" onClick={deleteCheck}>삭제</Button>
3. <Button type="download" onClick={() => /* 인라인 L77-82 (new SelectHandler(){ @Override public…) */}>템플릿</Button>
4. <Button type="upload" onClick={excelUpload}>엑셀업로드</Button>

### Fnd31_Edit_OprFund (`client/vi/fnd/Fnd31_Edit_OprFund.java`, 442줄)

- 입력·하위 화면: `fundCode` LookupTriggerField, `fundName` MyTextArea, `qty` LongField, `price` LongField, `contAmt` LongField, `fee` LongField, `settleAmt` LongField, `lookup` Adv02_Lookup_SelectSingle, `lookupSingleFund` Fnd01_Lookup_SelectSingle

#### 이벤트
[E0] 화면 열림 (생성자 L108-159) → settings(), show()
[E1] updateButton[저장].Select (L169) → update()
[E2] closeButton[닫기].Select (L175) → hide()
[E3] fundButton[펀드선택].Select (L181) → openLookupOpr()
[E4] accountButton[일임계좌선택].Select [result != null] (L187) → 인라인 L187-204 (new SelectHandler(){ @Override public…)
[E5] fundCode[펀드코드].TriggerClick [result.getStatus() > 0] (L205) → openLookupOpr()
[E6] fundCode[펀드코드].ValueChange (L229) → 인라인 L229-257 (new ValueChangeHandler<String>() { @O…)
[E7] qty[배정수량].Change (L264) → checkLongNull()
[E8] contAmt[배정금액].Change (L277) → checkLongNull()
[E9] fee[수수료].Change (L288) → checkLongNull()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public insert() | L78-91 | 공개 메서드 | 상태 처리 | 업무 |
| public edit() | L93-106 | 공개 메서드 | 상태 처리 | 업무 |
| private servicePublic() | L297-315 | insert,edit | 서비스 fnd.Fnd30_Opr.selectById(oprId) | 업무 |
| private serviceInsert() | L317-328 | insert | 서비스 fnd.Fnd31_OprFund.sumQty | 업무 |
| private serviceEdit() | L330-341 | edit | 서비스 fnd.Fnd31_OprFund.sumQty | 업무 |
| private update() | L345-384 | E1 | 서비스 fnd.Fnd31_OprFund.modelUpdate | 업무 |
| private openLookupOpr() | L386-400 | E3,E5 | 조회창 Fnd01_Lookup_SelectSingle 열기 | 업무 |
| private checkLongNull() | L427-433 | E7,E8,E9 | 상태 처리 | 업무 |
| private settings() | L162-295 | 생성자 | 조회창 Adv02_Lookup_SelectSingle 열기, 팝업 SettingPopup 열기, 서비스 adv.Adv02_Account.selectByCompanyId(companyId), 이벤트 연결, 초기값: fundName=resultModel.getManageName(("펀드명"), fundCode=resultModel.getManageCode(("펀드코드"), contAmt=checkLongNull(qty.getCurrentValue(("배정금액"), fee=checkLongNull(contAmt.getCurrentValue(("수수료"), settleAmt=checkLongNull(contAmt.getCurrentValue(("납입금액"), fee=checkLongNull(contAmt.getCurrentValue(("수수료"), settleAmt=checkLongNull(contAmt.getCurrentValue(("납입금액"), settleAmt=checkLongNull(contAmt.getCurrentValue(("납입금액") | UI구성 (이벤트 절로 대체) |
| private setHtmlStyle() | L435-437 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L439-441 | insert,edit | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="save" onClick={update}>저장</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>
3. <Button type="unknown" onClick={openLookupOpr}>펀드선택</Button>
4. <Button type="unknown" onClick={() => /* 인라인 L187-204 (new SelectHandler(){ @Override public…) */}>일임계좌선택</Button>

### Fnd30_Lookup_DemandOprList (`client/vi/fnd/Fnd30_Lookup_DemandOprList.java`, 180줄)

- 툴바 `buttonBar`: 신청기간: {startDate} ~: {closeDate} 검색: {searchText} {retrieveButton}
- 입력·하위 화면: `startDate` MyDateField, `closeDate` MyDateField, `searchText` TextField 빈칸="종목명", `lookup` Fnd30_Edit_Opr
- 그리드 `grid` (buildGrid(), 체크박스):
  - demandDate 100 "신청일" Date
  - itemName 300 "종목명" Text
  - market 80 "시장구분" TextCenter
  - leadManager 180 "주간사" Text
  - price 100 "신청가격" Long
  - lockPeriod 80 "확약기간" Text
  - actionCell 80 "등록" Cell 편집:editCell
  - note 300 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L60-116) → 초기화
[E1] retrieveButton[조회].Select (L76) → retrieve()
[E2] cancleButton[닫기].Select (L82) → hide()
[E3] searchText.KeyPress [Enter] (L89) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-58 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L155-171 | E1,E3,open,buildGrid | 서비스 fnd.Fnd30_Opr.selectByDemandOprCode(companyId, startDate, closeDate, searchText, oprCode) | 업무 |
| public buildGrid() | L118-152 | 필드 초기화 | 팝업 Fnd30_Edit_Opr 열기, 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L173-175 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L177-179 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('demandDate', 100, '신청일'),  // L142
  gb.text('itemNm', 300, '종목명'),  // L143
  gb.textCenter('market', 80, '시장구분'),  // L144
  gb.text('leadManager', 180, '주간사'),  // L145
  gb.long('price', 100, '신청가격'),  // L146
  gb.text('lockPeriod', 80, '확약기간'),  // L147
  // ⚠ 대응 없음 (GridBuilder L148) addCell
  gb.text('note', 300, '비고'),  // L149
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

