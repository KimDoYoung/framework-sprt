# Biz01_Tab_CardReport

- 종류: 화면
- 메뉴: 자금관리 > 30. 법인카드관리 > 법인카드 현황 (#1333)
- 파일: `client/vi/biz/Biz01_Tab_CardReport.java`
- 함께 쓰는 클래스 2개:
  - `Biz03_Lookup_AccountMap` `client/vi/biz/Biz03_Lookup_AccountMap.java`
  - `Biz01_Rd_CardReport` `client/vi/biz/Biz01_Rd_CardReport.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Act01_Lookup_AccountCode`](../../act/components/Act01_Lookup_AccountCode.md), [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz01_Tab_CardReport:129 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz03_AccountMap.delete` | Biz03_Lookup_AccountMap:258 | [`Biz03_AccountMap.java:37`](../../biz/services/Biz03_AccountMap.md) | `UpdateDataModel(biz03_account_map)` 동적 DELETE |
| `biz.Biz03_AccountMap.selectByUseItemCode` | Biz03_Lookup_AccountMap:207 | [`Biz03_AccountMap.java:23`](../../biz/services/Biz03_AccountMap.md) | [`biz03_account_map.selectByUseItemCode`](../../biz/sql/biz03_account_map.md) |
| `biz.Biz03_AccountMap.update` | Biz03_Lookup_AccountMap:243 | [`Biz03_AccountMap.java:32`](../../biz/services/Biz03_AccountMap.md) | `UpdateDataModel(biz03_account_map)` 동적 INSERT/UPDATE → [`biz03_account_map.selectById`](../../biz/sql/biz03_account_map.md) |
| `biz.Biz05_RelateAppr.insert` | Biz01_Tab_CardReport:351 | [`Biz05_RelateAppr.java:124`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.deleteByApprId`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.insert`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `biz.Biz05_RelateAppr.selectByDataYm` | Biz01_Tab_CardReport:370 | [`Biz05_RelateAppr.java:48`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Biz01_Tab_CardReport:294 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys09_Code.selectByCodeKind` | Biz03_Lookup_AccountMap:193 | [`Sys09_Code.java:82`](../../sys/services/Sys09_Code.md) | [`sys09_code.selectByCodeKind`](../../sys/sql/sys09_code.md) |
| `sys.Sys99_Print.insertCardReport` | Biz01_Tab_CardReport:211 | [`Sys99_Print.java:412`](../../sys/services/Sys99_Print.md) | [`biz01_promo.selectByYear`](../../biz/sql/biz01_promo.md), [`biz03_account_map.selectByYear`](../../biz/sql/biz03_account_map.md), [`crd03_trans.selectByYear`](../../crd/sql/crd03_trans.md), [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertCardReport2` | Biz01_Tab_CardReport:221 | [`Sys99_Print.java:507`](../../sys/services/Sys99_Print.md) | [`biz03_account_map.selectByMonth`](../../biz/sql/biz03_account_map.md), [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |
| `sys.Sys99_Print.insertCardReport3` | Biz01_Tab_CardReport:231 | [`Sys99_Print.java:558`](../../sys/services/Sys99_Print.md) | [`biz01_promo.selectMonthAmt`](../../biz/sql/biz01_promo.md), [`biz01_promo.selectMonthAmt2`](../../biz/sql/biz01_promo.md), [`dbConfig.getBatchSeq`](../../utils/sql/dbConfig.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz03_account_map`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_crdmanagerid2`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `f_trunc`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_CardReport (`client/vi/biz/Biz01_Tab_CardReport.java`, 480줄)

- 레이아웃: north=buttonBar, center=rdForm, south=cp
- 툴바 `buttonBar`: 기준년월: {yyyyText} {periodComboBox} {cardRealUserTypeComboBox} {retrieveButton} {mappingButton}
- 입력·하위 화면: `periodComboBox` ComboBoxField("MonthsCode"), `cardRealUserTypeComboBox` StringComboBox, `yyyyText` TextField, `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `editor` Apr01_Edit_ApprDoc, `lookupMapping` Biz03_Lookup_AccountMap, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L74-192) → defaultName()
[E1] retrieveButton[조회].Select (L108) → retrieve()
[E2] mappingButton[항목별 계정연결].Select (L114) → lookupMapping()
[E3] apprButton[상신].Select (L120) → insertLinkApproval()
[E4] apprViewButton[문서보기].Select (L126) → apprChk()
[E5] classTreeFullName[문서분류].TriggerClick (L151) → openLookupDoc()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieve() | L194-270 | E1,lookupMapping,updateApprId | 서비스 sys.Sys99_Print.insertCardReport, sys.Sys99_Print.insertCardReport2, sys.Sys99_Print.insertCardReport3(companyId, personId, startDate, closeDate, year, month, cardRealUserType, windowClassName, companyId, personId, startDate, closeDate, year, month, cardRealUserType, windowClassName, companyId, personId, startDate, closeDate, year, month, cardRealUserType, windowClassName) | 업무 |
| public lookupMapping() | L272-279 | E2 | 조회창 Biz03_Lookup_AccountMap 열기 | 업무 |
| private openLookupDoc() | L282-291 | E5 | 상태 처리 | 업무 |
| private defaultName() | L293-313 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L315-348 | E3 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| private updateApprId() | L350-366 | insertLinkApproval | 서비스 biz.Biz05_RelateAppr.insert | 업무 |
| private apprChk() | L368-417 | E4,retrieve,defaultName | 서비스 biz.Biz05_RelateAppr.selectByDataYm | 업무 |
| private getStartDate() | L419-423 | retrieve | 상태 처리 | 업무 |
| private getStartDateStr() | L425-431 | retrieve,insertLinkApproval | 상태 처리 | 업무 |
| private getCloseDate() | L433-439 | retrieve | 상태 처리 | 업무 |
| private getCloseDateStr() | L441-449 | retrieve,insertLinkApproval | 상태 처리 | 업무 |
| private mask() | L464-470 | retrieve | 상태 처리 | 업무 |
| private setHtmlBarStyle() | L472-474 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L476-478 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={lookupMapping}>항목별 계정연결</Button>
3. <Button type="register" onClick={insertLinkApproval}>상신</Button>
4. <Button type="search" onClick={apprChk}>문서보기</Button>

### Biz03_Lookup_AccountMap (`client/vi/biz/Biz03_Lookup_AccountMap.java`, 270줄)

- 레이아웃: west=codeGrid, center=accountMapGrid
- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBarBottom`: {link}
- 입력·하위 화면: `lookupAccountCode` LookupTriggerField, `lookupAccount` Act01_Lookup_AccountCode
- 그리드 `codeGrid` (buildcodeGrid()):
  - name 150 "항목명" Text
  - seq 80 "순서" Text
- 그리드 `accountMapGrid` (buildAccountMapGrid(), 체크박스(다중)):
  - accountCode 150 "계정코드" Text 편집:lookupAccountCode
  - accountName 250 "계정과목명" Text

#### 이벤트
[E0] 화면 열림 (생성자 L67-150) → show()
[E1] codeGrid.SelectionChanged [선택>0] (L74) → retrieveMap()
[E2] insertButton[등록].Select (L84) → insert()
[E3] updateButton[저장].Select (L90) → update()
[E4] deleteButton[삭제].Select (L96) → delete()
[E5] closeButton[닫기].Select (L103) → hide()
[E6] lookupAccountCode.TriggerClick (L164) → 인라인 L164-179 (new TriggerClickHandler() { @Override…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L62-65 | 공개 메서드 | 상태 처리 | 업무 |
| private buildcodeGrid() | L152-157 | 필드 초기화 | 상태 처리 | 업무 |
| private buildAccountMapGrid() | L159-185 | 필드 초기화 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| public retrieve() | L187-201 | open | 서비스 sys.Sys09_Code.selectByCodeKind(companyId, kindCode, applyDate) | 업무 |
| public retrieveMap() | L203-213 | E1 | 서비스 biz.Biz03_AccountMap.selectByUseItemCode(companyId, useItemCode), 건수 표시 | 업무 |
| private insert() | L215-239 | E2 | 조회창 Act01_Lookup_AccountCode 열기 | 업무 |
| private update() | L241-253 | E3 | 서비스 biz.Biz03_AccountMap.update | 업무 |
| public delete() | L255-259 | E4 | GridDeleteData biz.Biz03_AccountMap.delete(체크된 행 목록) | 업무 |
| private setHtmlHeaderStyle() | L262-264 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L266-268 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildcodeGrid = () => [
  gb.text('name', 150, '항목명'),  // L154
  gb.text('seq', 80, '순서'),  // L155
];

const buildAccountMapGrid = () => [
  gb.text('accountCd', 150, '계정코드'),  // L182
  gb.text('accountNm', 250, '계정과목명'),  // L183
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="unknown" onClick={hide}>닫기</Button>

### Biz01_Rd_CardReport (`client/vi/biz/Biz01_Rd_CardReport.java`, 70줄)


#### 이벤트
[E0] 화면 열림 (생성자 L25-27) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L30-68 | 공개 메서드 | 상태 처리 | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

