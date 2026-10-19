# Biz01_Tab_EntertmExpenseReport

- 종류: 화면
- 메뉴: 자금관리 > 30. 법인카드관리 > 접대비 현황 (#1335)
- 파일: `client/vi/biz/Biz01_Tab_EntertmExpenseReport.java`
- 함께 쓰는 클래스 6개:
  - `Biz02_TabPage_CompanyEntertmExpense` `client/vi/biz/Biz02_TabPage_CompanyEntertmExpense.java`
  - `Biz01_TabPage_MonthEntertmExpense` `client/vi/biz/Biz01_TabPage_MonthEntertmExpense.java`
  - `Biz01_TabPage_EntertmExpenseHistory` `client/vi/biz/Biz01_TabPage_EntertmExpenseHistory.java`
  - `Biz02_Grid_PersonList` `client/vi/biz/Biz02_Grid_PersonList.java`
  - `Biz02_Grid_InternalList` `client/vi/biz/Biz02_Grid_InternalList.java`
  - `Biz02_Grid_ExternalList` `client/vi/biz/Biz02_Grid_ExternalList.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md), [`Emp00_Lookup_SelectMulti`](../../emp/components/Emp00_Lookup_SelectMulti.md), [`Mkt01_Lookup_Select`](../../mkt/components/Mkt01_Lookup_Select.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Biz01_Tab_EntertmExpenseReport:245 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `biz.Biz01_Promo.closeCheck` | Biz02_Grid_ExternalList:217, Biz02_Grid_InternalList:216 | [`Biz01_Promo.java:182`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.closeCheck`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByAccountName` | Biz01_TabPage_EntertmExpenseHistory:116 | [`Biz01_Promo.java:167`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByAccountName`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByMonthEntertmExpense` | Biz01_TabPage_MonthEntertmExpense:151 | [`Biz01_Promo.java:151`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByMonthEntertmExpense`](../../biz/sql/biz01_promo.md) |
| `biz.Biz01_Promo.selectByTargetCompanyName` | Biz02_TabPage_CompanyEntertmExpense:140 | [`Biz01_Promo.java:172`](../../biz/services/Biz01_Promo.md) | [`biz01_promo.selectByTargetCompanyName`](../../biz/sql/biz01_promo.md) |
| `biz.Biz02_Person.delete` | Biz02_Grid_ExternalList:189, Biz02_Grid_InternalList:188 | [`Biz02_Person.java:118`](../../biz/services/Biz02_Person.md) | `UpdateDataModel(biz02_person)` 동적 DELETE |
| `biz.Biz02_Person.modelUpdate` | Biz02_Grid_ExternalList:156, Biz02_Grid_InternalList:153 | [`Biz02_Person.java:99`](../../biz/services/Biz02_Person.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE → [`biz02_person.selectById`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.selectByEntertmExpense` | Biz02_TabPage_CompanyEntertmExpense:117 | [`Biz02_Person.java:38`](../../biz/services/Biz02_Person.md) | [`biz02_person.selectByEntertmExpense`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.selectByExternal` | Biz02_Grid_ExternalList:115 | [`Biz02_Person.java:32`](../../biz/services/Biz02_Person.md) | [`biz02_person.selectByExternal`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.selectByInternal` | Biz02_Grid_InternalList:114 | [`Biz02_Person.java:26`](../../biz/services/Biz02_Person.md) | [`biz02_person.selectByInternal`](../../biz/sql/biz02_person.md) |
| `biz.Biz02_Person.update` | Biz02_Grid_ExternalList:132, Biz02_Grid_InternalList:131 | [`Biz02_Person.java:113`](../../biz/services/Biz02_Person.md) | `UpdateDataModel(biz02_person)` 동적 INSERT/UPDATE → [`biz02_person.selectById`](../../biz/sql/biz02_person.md) |
| `biz.Biz05_RelateAppr.insert` | Biz01_Tab_EntertmExpenseReport:369 | [`Biz05_RelateAppr.java:124`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.deleteByApprId`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.insert`](../../biz/sql/biz05_relate_appr.md), [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `biz.Biz05_RelateAppr.selectByDataYm` | Biz01_Tab_EntertmExpenseReport:388 | [`Biz05_RelateAppr.java:48`](../../biz/services/Biz05_RelateAppr.md) | [`biz05_relate_appr.selectByDataYm`](../../biz/sql/biz05_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Biz01_TabPage_MonthEntertmExpense:173, Biz01_Tab_EntertmExpenseReport:301 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`biz01_promo`](../../../db/tables/biz.md), [`biz02_person`](../../../db/tables/biz.md), [`biz05_relate_appr`](../../../db/tables/biz.md), [`biz90_limit`](../../../db/tables/biz.md), [`crd01_card`](../../../db/tables/crd.md), [`crd02_data`](../../../db/tables/crd.md), [`crd03_trans`](../../../db/tables/crd.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys01_company`](../../../db/tables/sys.md)

## DB 함수

`f_cdnm`, `f_class_tree_nm_allpath`, `f_emp_kor_nm`, `f_get_dcr_no`, `f_get_emptrans`, `f_nvl`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Biz01_Tab_EntertmExpenseReport (`client/vi/biz/Biz01_Tab_EntertmExpenseReport.java`, 488줄)

- 레이아웃: north=buttonBar, center=tabPanel, south=cp
- 툴바 `buttonBar`: 기준년월: {yyyyText} {monthComboBox} {cardRealUserTypeComboBox} {retrieveButton} {rdDownloadButton}
- 입력·하위 화면: `yyyyText` TextField, `monthComboBox` StringComboBox, `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprStepCode` TextField, `apprStepName` TextField, `cardRealUserTypeComboBox` StringComboBox, `tabPage1` Biz01_TabPage_MonthEntertmExpense, `tabPage2` Biz01_TabPage_EntertmExpenseHistory, `tabPage3` Biz02_TabPage_CompanyEntertmExpense, `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc

#### 이벤트
[E0] 화면 열림 (생성자 L81-173) → settings(), defaultName()
[E1] tabPanel.Selection [arg0 != null] (L84) → retrieveTabpage()
[E2] yyyyText.KeyPress [Enter] (L184) → retrieveTabpage()
[E3] retrieveButton[조회].Select (L193) → retrieveTabpage()
[E4] rdDownloadButton[출력/다운로드].Select (L200) → getCloseDate()
[E5] classTreeFullName[문서분류].TriggerClick (L228) → openLookupDoc()
[E6] apprButton[상신].Select (L235) → insertLinkApproval()
       └ [E8] msgBox.DialogHide [YES] (L339) → updateApprId()
[E7] apprViewButton[문서보기].Select (L242) → apprChk()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L270-286 | E1,E2,E3 | 선택 회사로 탭페이지 retrieve | 업무 |
| private openLookupDoc() | L289-298 | E5 | 상태 처리 | 업무 |
| private defaultName() | L300-320 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L322-366 | E6 | 팝업 Apr01_Edit_ApprDoc 열기, ConfirmBox → E8 | 업무 |
| private updateApprId() | L368-384 | E8 | 서비스 biz.Biz05_RelateAppr.insert | 업무 |
| private apprChk() | L386-435 | E7,retrieveTabpage,defaultName,updateApprId | 서비스 biz.Biz05_RelateAppr.selectByDataYm | 업무 |
| private getCloseDate() | L437-445 | E4,retrieveTabpage | 상태 처리 | 업무 |
| private getMonth() | L447-479 | insertLinkApproval,updateApprId,apprChk,getCloseDate | 상태 처리 | 업무 |
| private settings() | L175-268 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 apr.Apr01_Appr.selectById, 이벤트 연결, 초기값: yyyyText=startYear | UI구성 (이벤트 절로 대체) |
| private setHtmlBarStyle() | L481-483 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L485-487 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="search" onClick={retrieveTabpage}>조회</Button>
2. <Button type="download" onClick={getCloseDate}>출력/다운로드</Button>
3. <Button type="register" onClick={insertLinkApproval}>상신</Button>
4. <Button type="search" onClick={apprChk}>문서보기</Button>

### Biz02_TabPage_CompanyEntertmExpense (`client/vi/biz/Biz02_TabPage_CompanyEntertmExpense.java`, 155줄)

- 그리드 `grid` (buildGrid()):
  - htmlTargetCompanyName 200 "회사명" TextHtml
  - entertmExpenseSum 200 "접대비" Long
- 그리드 `reportGrid` (buildReportGrid()):
  - regEmpName 70 "사용자" TextCenter
  - approvalDt 100 "카드승인일" Date
  - franchiseName 240 "가맹점명" Text
  - provideAmt 100 "결제금액" Long
  - averageProvideAmt 100 "제공금액" Long
  - totalPeple 70 "인원" Long
  - averagePrice 100 "인당 경제적가치" Long
  - note 270 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L36-49) → settings()
[E1] grid.SelectionChanged [선택>0] (L52) → retrieve()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildReportGrid() | L75-88 | 필드 초기화 | 상태 처리 | 업무 |
| public init() | L91-93 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L96-106 | E1,settings | 상태 처리 | 업무 |
| public retrieve() | L108-129 | E1,settings | 서비스 biz.Biz02_Person.selectByEntertmExpense(companyId, year, closeDate) | 업무 |
| public retrieve() | L131-147 | E1,settings | 서비스 biz.Biz01_Promo.selectByTargetCompanyName(companyId, year, closeDate, cardRealUserType, targetCompanyName) | 업무 |
| public getGrid() | L150-153 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L51-63 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L65-73 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠ 대응 없음 (GridBuilder L69) addTextHtml
  gb.long('entertmExpenseSum', 200, '접대비'),  // L70 SQL 계산 컬럼(selectByEntertmExpense: SUM((biz01_average_price * (SELECT CASE…)
];

const buildReportGrid = () => [
  gb.textCenter('regEmpNm', 70, '사용자'),  // L78
  gb.date('approvalDt', 100, '카드승인일'),  // L79
  gb.text('franchiseNm', 240, '가맹점명'),  // L80
  gb.long('provideAmt', 100, '결제금액'),  // L81
  gb.long('averageProvideAmt', 100, '제공금액'),  // L82
  gb.long('totalPeple', 70, '인원'),  // L83
  gb.long('averagePrice', 100, '인당 경제적가치'),  // L84
  gb.text('note', 270, '비고'),  // L85
];
```

#### 사용된 버튼들
버튼 사용하지 않음

### Biz01_TabPage_MonthEntertmExpense (`client/vi/biz/Biz01_TabPage_MonthEntertmExpense.java`, 222줄)

- 레이아웃: center=grid
- 입력·하위 화면: `classTreeFullName` LookupTriggerField 빈칸="문서분류가 미지정 상태입니다. 관리자에게 문의해주세요", `apprDoc` Apr01_Edit_ApprDoc
- 그리드 `grid` (buildGrid()):
  - empName 80 "사용자" TextCenter
  - janSum 110 "1월" Long
  - febSum 110 "2월" Long
  - marSum 110 "3월" Long
  - aprSum 110 "4월" Long
  - maySum 110 "5월" Long
  - junSum 110 "6월" Long
  - julSum 110 "7월" Long
  - augSum 110 "8월" Long
  - sepSum 110 "9월" Long
  - octSum 110 "10월" Long
  - novSum 110 "11월" Long
  - decSum 110 "12월" Long
  - totalSum 120 "합 계" Long

#### 이벤트
[E0] 화면 열림 (생성자 L57-83) → settings(), defaultName()
[E1] classTreeFullName[문서분류].TriggerClick (L87) → openLookupDoc()
[E2] apprButton[상신].Select (L94) → insertLinkApproval()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L127-129 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L132-142 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L144-158 | 공개 메서드 | 서비스 biz.Biz01_Promo.selectByMonthEntertmExpense(companyId, year, closeDate, cardRealUserType) | 업무 |
| private openLookupDoc() | L161-170 | E1 | 상태 처리 | 업무 |
| private defaultName() | L172-191 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| private insertLinkApproval() | L193-210 | E2 | 팝업 Apr01_Edit_ApprDoc 열기 | 업무 |
| public getGrid() | L218-221 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L85-101 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L103-124 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L213-215 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('empNm', 80, '사용자'),  // L107
  gb.long('janSum', 110, '1월'),  // L108
  gb.long('febSum', 110, '2월'),  // L109
  gb.long('marSum', 110, '3월'),  // L110
  gb.long('aprSum', 110, '4월'),  // L111
  gb.long('maySum', 110, '5월'),  // L112
  gb.long('junSum', 110, '6월'),  // L113
  gb.long('julSum', 110, '7월'),  // L114
  gb.long('augSum', 110, '8월'),  // L115
  gb.long('sepSum', 110, '9월'),  // L116
  gb.long('octSum', 110, '10월'),  // L117
  gb.long('novSum', 110, '11월'),  // L118
  gb.long('decSum', 110, '12월'),  // L119
  gb.long('totalSum', 120, '합 계'),  // L120
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertLinkApproval}>상신</Button>

### Biz01_TabPage_EntertmExpenseHistory (`client/vi/biz/Biz01_TabPage_EntertmExpenseHistory.java`, 130줄)

- 레이아웃: center=hlc
- 그리드 `grid` (buildGrid()):
  - regEmpName 70 "사용자" TextCenter
  - approvalDt 100 "카드승인일" Date
  - franchiseName 240 "가맹점명" Text
  - provideAmt 100 "결제금액" Long
  - averageProvideAmt 100 "제공금액" Long
  - totalPeple 70 "인원" Long
  - averagePrice 100 "인당 경제적가치" Long
  - note 270 "비고" Text

#### 이벤트
[E0] 화면 열림 (생성자 L35-53) → setting(), retrieve()
[E1] grid.RowClick (L59) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private setting() | L55-65 | 생성자 | 상태 처리 | 업무 |
| public init() | L83-85 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L88-98 | 생성자,retrieveTabpage | 상태 처리 | 업무 |
| private retrieveTabpage() | L100-107 | E1 | 상태 처리 | 업무 |
| public retrieve() | L109-123 | 생성자,retrieveTabpage | 서비스 biz.Biz01_Promo.selectByAccountName(companyId, year, closeDate, cardRealUserType), 건수 표시 | 업무 |
| public getGrid() | L126-129 | 공개 메서드 | 상태 처리 | 업무 |
| public buildGrid() | L67-80 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('regEmpNm', 70, '사용자'),  // L70
  gb.date('approvalDt', 100, '카드승인일'),  // L71
  gb.text('franchiseNm', 240, '가맹점명'),  // L72
  gb.long('provideAmt', 100, '결제금액'),  // L73
  gb.long('averageProvideAmt', 100, '제공금액'),  // L74
  gb.long('totalPeple', 70, '인원'),  // L75
  gb.long('averagePrice', 100, '인당 경제적가치'),  // L76
  gb.text('note', 270, '비고'),  // L77
];
```

#### 사용된 버튼들
버튼 사용하지 않음

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

