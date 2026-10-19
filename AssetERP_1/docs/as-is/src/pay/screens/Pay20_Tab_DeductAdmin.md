# Pay20_Tab_DeductAdmin

- 종류: 화면
- 메뉴: 기초자료 > 30. 자산&경영 > 급여기초정보관리 (#1279)
- 파일: `client/vi/pay/Pay20_Tab_DeductAdmin.java`
- 함께 쓰는 클래스 23개:
  - `Pay29_TabPage_OtherSetupDate` `client/vi/pay/Pay29_TabPage_OtherSetupDate.java`
  - `Pay29_TabPage_OtherSetup` `client/vi/pay/Pay29_TabPage_OtherSetup.java`
  - `Pay29_Popup_OtherSetupCreate` `client/vi/pay/Pay29_Popup_OtherSetupCreate.java`
  - `Pay27_TabPage_TaxDeductTable` `client/vi/pay/Pay27_TabPage_TaxDeductTable.java`
  - `Pay27_TabPage_TaxDeduct` `client/vi/pay/Pay27_TabPage_TaxDeduct.java`
  - `Pay27_Popup_TaxDeductTableCreate` `client/vi/pay/Pay27_Popup_TaxDeductTableCreate.java`
  - `Pay26_TabPage_TaxCalcTable` `client/vi/pay/Pay26_TabPage_TaxCalcTable.java`
  - `Pay26_TabPage_TaxCalc` `client/vi/pay/Pay26_TabPage_TaxCalc.java`
  - `Pay26_Popup_TaxCalcCreate` `client/vi/pay/Pay26_Popup_TaxCalcCreate.java`
  - `Pay25_TabPage_PersonDeduct` `client/vi/pay/Pay25_TabPage_PersonDeduct.java`
  - `Pay25_TabPage_Deduct` `client/vi/pay/Pay25_TabPage_Deduct.java`
  - `Pay25_Popup_personDeductCreate` `client/vi/pay/Pay25_Popup_personDeductCreate.java`
  - `Pay24_TabPage_DeductTable` `client/vi/pay/Pay24_TabPage_DeductTable.java`
  - `Pay24_TabPage_Deduct` `client/vi/pay/Pay24_TabPage_Deduct.java`
  - `Pay24_Popup_DeductTableCreate` `client/vi/pay/Pay24_Popup_DeductTableCreate.java`
  - `Pay23_TabPage_SimpleTaxTable` `client/vi/pay/Pay23_TabPage_SimpleTaxTable.java`
  - `Pay23_Popup_SimpleTaxTableCreate` `client/vi/pay/Pay23_Popup_SimpleTaxTableCreate.java`
  - `Pay22_TabPage_SimpleTax` `client/vi/pay/Pay22_TabPage_SimpleTax.java`
  - `Pay21_TabPage_Rate` `client/vi/pay/Pay21_TabPage_Rate.java`
  - `Pay20_TabPage_Item` `client/vi/pay/Pay20_TabPage_Item.java`
  - `Pay04_TabPage_Formula` `client/vi/pay/Pay04_TabPage_Formula.java`
  - `Pay20_Lookup_ItemList` `client/vi/pay/Pay20_Lookup_ItemList.java`
  - `Pay04_Lookup_Insert` `client/vi/pay/Pay04_Lookup_Insert.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Sys01_Lookup_Company`](../../sys/components/Sys01_Lookup_Company.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `pay.Pay04_Formula.basicDataCreate` | Pay04_TabPage_Formula:462 | [`Pay04_Formula.java:91`](../../pay/services/Pay04_Formula.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay04_formula.deleteByDate`](../../pay/sql/pay04_formula.md), [`pay04_formula.insert`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByCompanyId`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByDate`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.delete` | Pay04_TabPage_Formula:449 | [`Pay04_Formula.java:157`](../../pay/services/Pay04_Formula.md) | `UpdateDataModel(pay04_formula)` 동적 DELETE |
| `pay.Pay04_Formula.deleteByDate` | Pay04_TabPage_Formula:395 | [`Pay04_Formula.java:139`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.deleteByDate`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.insert` | Pay04_Lookup_Insert:74 | [`Pay04_Formula.java:58`](../../pay/services/Pay04_Formula.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay04_formula.insert`](../../pay/sql/pay04_formula.md), [`pay04_formula.selectByMaxCompanyId`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.selectByCompanyId` | Pay04_TabPage_Formula:307 | [`Pay04_Formula.java:27`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.selectByCompanyId`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.selectByDate` | Pay04_TabPage_Formula:338 | [`Pay04_Formula.java:39`](../../pay/services/Pay04_Formula.md) | [`pay04_formula.selectByDate`](../../pay/sql/pay04_formula.md) |
| `pay.Pay04_Formula.update` | Pay04_TabPage_Formula:370 | [`Pay04_Formula.java:152`](../../pay/services/Pay04_Formula.md) | `UpdateDataModel(pay04_formula)` 동적 INSERT/UPDATE → [`pay04_formula.selectById`](../../pay/sql/pay04_formula.md) |
| `pay.Pay20_Item.delete` | Pay20_TabPage_Item:228 | [`Pay20_Item.java:58`](../../pay/services/Pay20_Item.md) | `UpdateDataModel(pay20_item)` 동적 DELETE |
| `pay.Pay20_Item.selectBySearchText` | Pay20_TabPage_Item:192 | [`Pay20_Item.java:30`](../../pay/services/Pay20_Item.md) | [`pay20_item.selectBySearchText`](../../pay/sql/pay20_item.md) |
| `pay.Pay20_Item.selectByText` | Pay20_Lookup_ItemList:122 | [`Pay20_Item.java:24`](../../pay/services/Pay20_Item.md) | [`pay20_item.selectByText`](../../pay/sql/pay20_item.md) |
| `pay.Pay20_Item.update` | Pay20_TabPage_Item:198 | [`Pay20_Item.java:53`](../../pay/services/Pay20_Item.md) | `UpdateDataModel(pay20_item)` 동적 INSERT/UPDATE → [`pay20_item.selectById`](../../pay/sql/pay20_item.md) |
| `pay.Pay21_Rate.delete` | Pay21_TabPage_Rate:201 | [`Pay21_Rate.java:39`](../../pay/services/Pay21_Rate.md) | `UpdateDataModel(pay21_rate)` 동적 DELETE |
| `pay.Pay21_Rate.selectByCode` | Pay21_TabPage_Rate:164 | [`Pay21_Rate.java:24`](../../pay/services/Pay21_Rate.md) | [`pay21_rate.selectByCode`](../../pay/sql/pay21_rate.md) |
| `pay.Pay21_Rate.update` | Pay21_TabPage_Rate:173 | [`Pay21_Rate.java:34`](../../pay/services/Pay21_Rate.md) | `UpdateDataModel(pay21_rate)` 동적 INSERT/UPDATE → [`pay21_rate.selectById`](../../pay/sql/pay21_rate.md) |
| `pay.Pay22_SimpleTaxTable.deleteByDate` | Pay22_TabPage_SimpleTax:283 | [`Pay22_SimpleTaxTable.java:39`](../../pay/services/Pay22_SimpleTaxTable.md) | [`pay22_simple_tax_table.deleteByDate`](../../pay/sql/pay22_simple_tax_table.md) |
| `pay.Pay22_SimpleTaxTable.selectByDate` | Pay22_TabPage_SimpleTax:228 | [`Pay22_SimpleTaxTable.java:25`](../../pay/services/Pay22_SimpleTaxTable.md) | [`pay22_simple_tax_table.selectByDate`](../../pay/sql/pay22_simple_tax_table.md) |
| `pay.Pay23_SimpleTaxTableOther.delete` | Pay22_TabPage_SimpleTax:274 | [`Pay23_SimpleTaxTableOther.java:98`](../../pay/services/Pay23_SimpleTaxTableOther.md) | `UpdateDataModel(pay23_simple_tax_table_other)` 동적 DELETE |
| `pay.Pay23_SimpleTaxTableOther.deleteByDate` | Pay23_TabPage_SimpleTaxTable:162 | [`Pay23_SimpleTaxTableOther.java:82`](../../pay/services/Pay23_SimpleTaxTableOther.md) | [`pay22_simple_tax_table.deleteByDate`](../../pay/sql/pay22_simple_tax_table.md), [`pay23_simple_tax_table_other.deleteByDate`](../../pay/sql/pay23_simple_tax_table_other.md) |
| `pay.Pay23_SimpleTaxTableOther.insert` | Pay23_Popup_SimpleTaxTableCreate:88 | [`Pay23_SimpleTaxTableOther.java:44`](../../pay/services/Pay23_SimpleTaxTableOther.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay23_simple_tax_table_other.insert`](../../pay/sql/pay23_simple_tax_table_other.md), [`pay23_simple_tax_table_other.selectByStartDate`](../../pay/sql/pay23_simple_tax_table_other.md) |
| `pay.Pay23_SimpleTaxTableOther.selectByAll` | Pay23_TabPage_SimpleTaxTable:129 | [`Pay23_SimpleTaxTableOther.java:26`](../../pay/services/Pay23_SimpleTaxTableOther.md) | [`pay23_simple_tax_table_other.selectByAll`](../../pay/sql/pay23_simple_tax_table_other.md) |
| `pay.Pay23_SimpleTaxTableOther.selectByDate` | Pay22_TabPage_SimpleTax:243 | [`Pay23_SimpleTaxTableOther.java:32`](../../pay/services/Pay23_SimpleTaxTableOther.md) | [`pay23_simple_tax_table_other.selectByDate`](../../pay/sql/pay23_simple_tax_table_other.md) |
| `pay.Pay23_SimpleTaxTableOther.update` | Pay22_TabPage_SimpleTax:255 | [`Pay23_SimpleTaxTableOther.java:93`](../../pay/services/Pay23_SimpleTaxTableOther.md) | `UpdateDataModel(pay23_simple_tax_table_other)` 동적 INSERT/UPDATE → [`pay23_simple_tax_table_other.selectById`](../../pay/sql/pay23_simple_tax_table_other.md) |
| `pay.Pay24_DeductTable.delete` | Pay24_TabPage_Deduct:194 | [`Pay24_DeductTable.java:130`](../../pay/services/Pay24_DeductTable.md) | `UpdateDataModel(pay24_deduct_table)` 동적 DELETE |
| `pay.Pay24_DeductTable.deleteByDate` | Pay24_TabPage_DeductTable:162 | [`Pay24_DeductTable.java:115`](../../pay/services/Pay24_DeductTable.md) | [`pay24_deduct_table.deleteByDate`](../../pay/sql/pay24_deduct_table.md) |
| `pay.Pay24_DeductTable.insert` | Pay24_Popup_DeductTableCreate:88 | [`Pay24_DeductTable.java:57`](../../pay/services/Pay24_DeductTable.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay24_deduct_table.insert`](../../pay/sql/pay24_deduct_table.md), [`pay24_deduct_table.selectByStartDate`](../../pay/sql/pay24_deduct_table.md) |
| `pay.Pay24_DeductTable.selectByAll` | Pay24_TabPage_DeductTable:128 | [`Pay24_DeductTable.java:26`](../../pay/services/Pay24_DeductTable.md) | [`pay24_deduct_table.selectByAll`](../../pay/sql/pay24_deduct_table.md) |
| `pay.Pay24_DeductTable.selectByDataCode` | Pay24_TabPage_Deduct:136 | [`Pay24_DeductTable.java:43`](../../pay/services/Pay24_DeductTable.md) | [`pay24_deduct_table.selectByDataCode`](../../pay/sql/pay24_deduct_table.md) |
| `pay.Pay24_DeductTable.update` | Pay24_TabPage_Deduct:156 | [`Pay24_DeductTable.java:125`](../../pay/services/Pay24_DeductTable.md) | `UpdateDataModel(pay24_deduct_table)` 동적 INSERT/UPDATE → [`pay24_deduct_table.selectById`](../../pay/sql/pay24_deduct_table.md) |
| `pay.Pay24_DeductTable.updateLimitAmt` | Pay24_TabPage_Deduct:162 | [`Pay24_DeductTable.java:98`](../../pay/services/Pay24_DeductTable.md) | [`pay24_deduct_table.updateLimitAmt`](../../pay/sql/pay24_deduct_table.md) |
| `pay.Pay25_PersonDeduct.delete` | Pay25_TabPage_Deduct:139 | [`Pay25_PersonDeduct.java:97`](../../pay/services/Pay25_PersonDeduct.md) | `UpdateDataModel(pay25_person_deduct)` 동적 DELETE |
| `pay.Pay25_PersonDeduct.deleteByDate` | Pay25_TabPage_PersonDeduct:163 | [`Pay25_PersonDeduct.java:82`](../../pay/services/Pay25_PersonDeduct.md) | [`pay25_person_deduct.deleteByDate`](../../pay/sql/pay25_person_deduct.md) |
| `pay.Pay25_PersonDeduct.insert` | Pay25_Popup_personDeductCreate:88 | [`Pay25_PersonDeduct.java:51`](../../pay/services/Pay25_PersonDeduct.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay25_person_deduct.insert`](../../pay/sql/pay25_person_deduct.md), [`pay25_person_deduct.selectByStartDate`](../../pay/sql/pay25_person_deduct.md) |
| `pay.Pay25_PersonDeduct.selectByAll` | Pay25_TabPage_PersonDeduct:129 | [`Pay25_PersonDeduct.java:26`](../../pay/services/Pay25_PersonDeduct.md) | [`pay25_person_deduct.selectByAll`](../../pay/sql/pay25_person_deduct.md) |
| `pay.Pay25_PersonDeduct.selectByDate` | Pay25_TabPage_Deduct:115 | [`Pay25_PersonDeduct.java:39`](../../pay/services/Pay25_PersonDeduct.md) | [`pay25_person_deduct.selectByDate`](../../pay/sql/pay25_person_deduct.md) |
| `pay.Pay25_PersonDeduct.update` | Pay25_TabPage_Deduct:120 | [`Pay25_PersonDeduct.java:92`](../../pay/services/Pay25_PersonDeduct.md) | `UpdateDataModel(pay25_person_deduct)` 동적 INSERT/UPDATE → [`pay25_person_deduct.selectById`](../../pay/sql/pay25_person_deduct.md) |
| `pay.Pay26_TaxCalcTable.delete` | Pay26_TabPage_TaxCalc:131 | [`Pay26_TaxCalcTable.java:99`](../../pay/services/Pay26_TaxCalcTable.md) | `UpdateDataModel(pay26_tax_calc_table)` 동적 DELETE |
| `pay.Pay26_TaxCalcTable.deleteByDate` | Pay26_TabPage_TaxCalcTable:163 | [`Pay26_TaxCalcTable.java:84`](../../pay/services/Pay26_TaxCalcTable.md) | [`pay26_tax_calc_table.deleteByDate`](../../pay/sql/pay26_tax_calc_table.md) |
| `pay.Pay26_TaxCalcTable.insert` | Pay26_Popup_TaxCalcCreate:88 | [`Pay26_TaxCalcTable.java:51`](../../pay/services/Pay26_TaxCalcTable.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay26_tax_calc_table.insert`](../../pay/sql/pay26_tax_calc_table.md), [`pay26_tax_calc_table.selectByStartDate`](../../pay/sql/pay26_tax_calc_table.md) |
| `pay.Pay26_TaxCalcTable.selectByAll` | Pay26_TabPage_TaxCalcTable:129 | [`Pay26_TaxCalcTable.java:26`](../../pay/services/Pay26_TaxCalcTable.md) | [`pay26_tax_calc_table.selectByAll`](../../pay/sql/pay26_tax_calc_table.md) |
| `pay.Pay26_TaxCalcTable.selectByDate` | Pay26_TabPage_TaxCalc:107 | [`Pay26_TaxCalcTable.java:39`](../../pay/services/Pay26_TaxCalcTable.md) | [`pay26_tax_calc_table.selectByDate`](../../pay/sql/pay26_tax_calc_table.md) |
| `pay.Pay26_TaxCalcTable.update` | Pay26_TabPage_TaxCalc:112 | [`Pay26_TaxCalcTable.java:94`](../../pay/services/Pay26_TaxCalcTable.md) | `UpdateDataModel(pay26_tax_calc_table)` 동적 INSERT/UPDATE → [`pay26_tax_calc_table.selectById`](../../pay/sql/pay26_tax_calc_table.md) |
| `pay.Pay27_TaxDeductTable.delete` | Pay27_TabPage_TaxDeduct:209 | [`Pay27_TaxDeductTable.java:119`](../../pay/services/Pay27_TaxDeductTable.md) | `UpdateDataModel(pay27_tax_deduct_table)` 동적 DELETE |
| `pay.Pay27_TaxDeductTable.deleteByDate` | Pay27_TabPage_TaxDeductTable:162 | [`Pay27_TaxDeductTable.java:103`](../../pay/services/Pay27_TaxDeductTable.md) | [`pay27_tax_deduct_table.deleteByDate`](../../pay/sql/pay27_tax_deduct_table.md), [`pay28_tax_deduct_limit.deleteByDate`](../../pay/sql/pay28_tax_deduct_limit.md) |
| `pay.Pay27_TaxDeductTable.insert` | Pay27_Popup_TaxDeductTableCreate:88 | [`Pay27_TaxDeductTable.java:51`](../../pay/services/Pay27_TaxDeductTable.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay27_tax_deduct_table.insert`](../../pay/sql/pay27_tax_deduct_table.md), [`pay27_tax_deduct_table.selectByStartDate`](../../pay/sql/pay27_tax_deduct_table.md), [`pay28_tax_deduct_limit.insert`](../../pay/sql/pay28_tax_deduct_limit.md), [`pay28_tax_deduct_limit.selectByStartDate`](../../pay/sql/pay28_tax_deduct_limit.md) |
| `pay.Pay27_TaxDeductTable.selectByAll` | Pay27_TabPage_TaxDeductTable:129 | [`Pay27_TaxDeductTable.java:27`](../../pay/services/Pay27_TaxDeductTable.md) | [`pay27_tax_deduct_table.selectByAll`](../../pay/sql/pay27_tax_deduct_table.md) |
| `pay.Pay27_TaxDeductTable.selectByDate` | Pay27_TabPage_TaxDeduct:178 | [`Pay27_TaxDeductTable.java:39`](../../pay/services/Pay27_TaxDeductTable.md) | [`pay27_tax_deduct_table.selectByDate`](../../pay/sql/pay27_tax_deduct_table.md) |
| `pay.Pay27_TaxDeductTable.update` | Pay27_TabPage_TaxDeduct:190 | [`Pay27_TaxDeductTable.java:114`](../../pay/services/Pay27_TaxDeductTable.md) | `UpdateDataModel(pay27_tax_deduct_table)` 동적 INSERT/UPDATE → [`pay27_tax_deduct_table.selectById`](../../pay/sql/pay27_tax_deduct_table.md) |
| `pay.Pay28_TaxDeductLimit.delete` | Pay27_TabPage_TaxDeduct:254 | [`Pay28_TaxDeductLimit.java:48`](../../pay/services/Pay28_TaxDeductLimit.md) | `UpdateDataModel(pay28_tax_deduct_limit)` 동적 DELETE |
| `pay.Pay28_TaxDeductLimit.selectByDate` | Pay27_TabPage_TaxDeduct:223 | [`Pay28_TaxDeductLimit.java:31`](../../pay/services/Pay28_TaxDeductLimit.md) | [`pay28_tax_deduct_limit.selectByDate`](../../pay/sql/pay28_tax_deduct_limit.md) |
| `pay.Pay28_TaxDeductLimit.update` | Pay27_TabPage_TaxDeduct:235 | [`Pay28_TaxDeductLimit.java:43`](../../pay/services/Pay28_TaxDeductLimit.md) | `UpdateDataModel(pay28_tax_deduct_limit)` 동적 INSERT/UPDATE → [`pay28_tax_deduct_limit.selectById`](../../pay/sql/pay28_tax_deduct_limit.md) |
| `pay.Pay29_OtherSetup.delete` | Pay29_TabPage_OtherSetup:134 | [`Pay29_OtherSetup.java:93`](../../pay/services/Pay29_OtherSetup.md) | `UpdateDataModel(pay29_other_setup)` 동적 DELETE |
| `pay.Pay29_OtherSetup.deleteByDate` | Pay29_TabPage_OtherSetupDate:181 | [`Pay29_OtherSetup.java:78`](../../pay/services/Pay29_OtherSetup.md) | [`pay29_other_setup.deleteByDate`](../../pay/sql/pay29_other_setup.md) |
| `pay.Pay29_OtherSetup.insert` | Pay29_Popup_OtherSetupCreate:88 | [`Pay29_OtherSetup.java:44`](../../pay/services/Pay29_OtherSetup.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay29_other_setup.insert`](../../pay/sql/pay29_other_setup.md), [`pay29_other_setup.selectByStartDate`](../../pay/sql/pay29_other_setup.md) |
| `pay.Pay29_OtherSetup.selectByAll` | Pay29_TabPage_OtherSetupDate:147 | [`Pay29_OtherSetup.java:26`](../../pay/services/Pay29_OtherSetup.md) | [`pay29_other_setup.selectByAll`](../../pay/sql/pay29_other_setup.md) |
| `pay.Pay29_OtherSetup.selectByDate` | Pay29_TabPage_OtherSetup:110 | [`Pay29_OtherSetup.java:32`](../../pay/services/Pay29_OtherSetup.md) | [`pay29_other_setup.selectByDate`](../../pay/sql/pay29_other_setup.md) |
| `pay.Pay29_OtherSetup.update` | Pay29_TabPage_OtherSetup:115 | [`Pay29_OtherSetup.java:88`](../../pay/services/Pay29_OtherSetup.md) | `UpdateDataModel(pay29_other_setup)` 동적 INSERT/UPDATE → [`pay29_other_setup.selectById`](../../pay/sql/pay29_other_setup.md) |

## 테이블

[`pay04_formula`](../../../db/tables/pay.md), [`pay20_item`](../../../db/tables/pay.md), [`pay21_rate`](../../../db/tables/pay.md), [`pay22_simple_tax_table`](../../../db/tables/pay.md), [`pay23_simple_tax_table_other`](../../../db/tables/pay.md), [`pay24_deduct_table`](../../../db/tables/pay.md), [`pay25_person_deduct`](../../../db/tables/pay.md), [`pay26_tax_calc_table`](../../../db/tables/pay.md), [`pay27_tax_deduct_table`](../../../db/tables/pay.md), [`pay28_tax_deduct_limit`](../../../db/tables/pay.md), [`pay29_other_setup`](../../../db/tables/pay.md)

## DB 함수

`f_cdnm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Pay20_Tab_DeductAdmin (`client/vi/pay/Pay20_Tab_DeductAdmin.java`, 78줄)

- 레이아웃: center=tabPanel
- 입력·하위 화면: `tabPage1` Pay20_TabPage_Item, `tabPage2` Pay04_TabPage_Formula, `tabPage3` Pay21_TabPage_Rate, `tabPage4` Pay23_TabPage_SimpleTaxTable, `tabPage5` Pay24_TabPage_DeductTable, `tabPage6` Pay25_TabPage_PersonDeduct, `tabPage7` Pay26_TabPage_TaxCalcTable, `tabPage8` Pay27_TabPage_TaxDeductTable, `tabPage9` Pay29_TabPage_OtherSetupDate

#### 이벤트
[E0] 화면 열림 (생성자 L20-72) → 초기화
[E1] tabPanel.Selection [arg0 != null] (L22) → retrieveTabpage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private retrieveTabpage() | L74-77 | E1 | 선택 회사로 탭페이지 retrieve | 업무 |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
버튼 사용하지 않음

### Pay29_TabPage_OtherSetupDate (`client/vi/pay/Pay29_TabPage_OtherSetupDate.java`, 218줄)

- 레이아웃: north=buttonBar, center=hlc, south=buttonBarBottom
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 툴바 `buttonBarBottom`: {link}
- 입력·하위 화면: `otherSetupPage` Pay29_TabPage_OtherSetup, `popUp` Pay29_Popup_OtherSetupCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L52-54) → settings()
[E1] retrieveButton[조회].Select (L68) → retrieve()
[E2] insertButton[등록].Select (L74) → insert()
[E3] deleteButton[삭제].Select (L80) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L174) → retrieve()
[E4] grid.SelectionChanged (L119) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L136-138 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L141-143 | E1,E5,insert | 상태 처리 | 업무 |
| public retrieve() | L145-155 | E1,E5,insert | 서비스 pay.Pay29_OtherSetup.selectByAll | 업무 |
| public insert() | L157-164 | E2 | 팝업 Pay29_Popup_OtherSetupCreate 열기 | 업무 |
| public deleteRow() | L166-201 | E3 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E5 | 업무 |
| public retrievePage() | L203-207 | E4 | 상태 처리 | 업무 |
| public getGrid() | L214-217 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L56-126 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L128-133 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlCheckBoxStyle() | L209-211 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),  // L130
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay29_TabPage_OtherSetup (`client/vi/pay/Pay29_TabPage_OtherSetup.java`, 143줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - hiMaxDiv 150 "건강보험" Long 편집:LongField
  - eiMaxDiv 150 "고용보험" Long 편집:LongField
  - hiMaxAmt 150 "상한액" Long 편집:LongField
  - hiMinAmt 150 "하한액" Long 편집:LongField
  - npMaxAmt 150 "상한액" Long 편집:LongField
  - npMinAmt 150 "하한액" Long 편집:LongField
  - stdTaxDeduct 150 "표준세액공제" Long 편집:LongField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L44-84) → 초기화
[E1] insertButton[등록].Select (L66) → insertRow()
[E2] updateButton[저장].Select (L72) → update()
[E3] deleteButton[삭제].Select (L78) → deleteRow()
       └ [E4] messageBox.DialogHide [YES] (L128) → 서비스 pay.Pay29_OtherSetup.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L105-111 | 공개 메서드 | 서비스 pay.Pay29_OtherSetup.selectByDate(date) | 업무 |
| public update() | L113-116 | E2 | 서비스 pay.Pay29_OtherSetup.update | 업무 |
| public insertRow() | L118-123 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L125-140 | E3 | ConfirmBox → E4 | 업무 |
| public buildGrid() | L86-103 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L89 newHeaderGroupMap01newHeaderGroupConfig12 100 "최대분할회차" (pay29_new_header_group_map01new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L90 newHeaderGroupMap03newHeaderGroupConfig12 100 "건강보험 상ㆍ하한액" (pay29_new_header_group_map03new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L91 newHeaderGroupMap05newHeaderGroupConfig12 100 "국민연금 상ㆍ하한액" (pay29_new_header_group_map05new_header_group_config12 컬럼 없음)
  gb.long('hiMaxDiv', 150, '건강보험', { editor: 'number' }),  // L93
  gb.long('eiMaxDiv', 150, '고용보험', { editor: 'number' }),  // L94
  gb.long('hiMaxAmt', 150, '상한액', { editor: 'number' }),  // L95
  gb.long('hiMinAmt', 150, '하한액', { editor: 'number' }),  // L96
  gb.long('npMaxAmt', 150, '상한액', { editor: 'number' }),  // L97
  gb.long('npMinAmt', 150, '하한액', { editor: 'number' }),  // L98
  gb.long('stdTaxDeduct', 150, '표준세액공제', { editor: 'number' }),  // L99
  gb.text('note', 500, '비고', { editor: 'text' }),  // L100
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay29_Popup_OtherSetupCreate (`client/vi/pay/Pay29_Popup_OtherSetupCreate.java`, 109줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L42-71) → show()
[E1] updateButton[생성].Select (L54) → update()
[E2] closeButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L73-81 | open | 상태 처리 | 업무 |
| public update() | L83-98 | E1 | 서비스 pay.Pay29_OtherSetup.insert(startDate) | 업무 |
| private setHtmlStyle() | L101-103 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay27_TabPage_TaxDeductTable (`client/vi/pay/Pay27_TabPage_TaxDeductTable.java`, 197줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `taxDeductPage` Pay27_TabPage_TaxDeduct, `popUp` Pay27_Popup_TaxDeductTableCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L48-50) → settings()
[E1] retrieveButton[조회].Select (L64) → retrieve()
[E2] insertButton[등록].Select (L70) → insert()
[E3] deleteButton[삭제].Select (L76) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L155) → retrieve()
[E4] grid.SelectionChanged (L101) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L123-125 | E1,E5,insert | 상태 처리 | 업무 |
| public retrieve() | L127-137 | E1,E5,insert | 서비스 pay.Pay27_TaxDeductTable.selectByAll | 업무 |
| public insert() | L139-146 | E2 | 팝업 Pay27_Popup_TaxDeductTableCreate 열기 | 업무 |
| public deleteRow() | L147-182 | E3 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E5 | 업무 |
| public retrievePage() | L184-189 | E4 | 상태 처리 | 업무 |
| public getGrid() | L192-195 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L52-108 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L110-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),  // L112
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay27_TabPage_TaxDeduct (`client/vi/pay/Pay27_TabPage_TaxDeduct.java`, 263줄)

- 레이아웃: center=vlc, south=vlc2
- 툴바 `buttonBar`: <font style='font-size:14px;'><b>&nbsp;&nbsp;세액공제 </b></font>: {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBar2`: <font style='font-size:14px;'><b>&nbsp;&nbsp;세액공제 한도 </b></font>: {limitInsertButton} {limitUpdateButton} {limitDeleteButton}
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 130 "초과" Long 편집:LongField
  - toAmt 130 "이하" Long 편집:LongField
  - deductAmt 130 "기본공제" Long 편집:LongField
  - rate 130 "적용율(%)" Double 편집:DoubleField
  - note 500 "비고" Text 편집:TextField
- 그리드 `limitGrid` (buildLimitGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 130 "초과" Long 편집:LongField
  - toAmt 130 "이하" Long 편집:LongField
  - minLimit 130 "최소한도" Long 편집:LongField
  - maxLimit 130 "최대한도" Long 편집:LongField
  - rate 130 "적용율(%)" Double 편집:DoubleField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L54-140) → 초기화
[E1] insertButton[등록].Select (L75) → insert()
[E2] updateButton[저장].Select (L81) → update()
[E3] deleteButton[삭제].Select (L87) → delete()
       └ [E7] messageBox.DialogHide [YES] (L203) → 서비스 pay.Pay27_TaxDeductTable.delete
[E4] limitInsertButton[등록].Select (L115) → limitInsert()
[E5] limitUpdateButton[저장].Select (L121) → limitUpdate()
[E6] limitDeleteButton[삭제].Select (L127) → limitDelete()
       └ [E8] messageBox.DialogHide [YES] (L248) → 서비스 pay.Pay28_TaxDeductLimit.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildLimitGrid() | L157-170 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L173-186 | 공개 메서드 | 서비스 pay.Pay27_TaxDeductTable.selectByDate(date) | 업무 |
| public update() | L188-191 | E2 | 서비스 pay.Pay27_TaxDeductTable.update | 업무 |
| public insert() | L193-198 | E1 | 상태 처리 | 업무 |
| public delete() | L200-215 | E3 | ConfirmBox → E7 | 업무 |
| public limitRetrieve() | L218-231 | 공개 메서드 | 서비스 pay.Pay28_TaxDeductLimit.selectByDate(date) | 업무 |
| public limitUpdate() | L233-236 | E5 | 서비스 pay.Pay28_TaxDeductLimit.update | 업무 |
| public limitInsert() | L238-243 | E4 | 상태 처리 | 업무 |
| public limitDelete() | L245-260 | E6 | ConfirmBox → E8 | 업무 |
| public buildGrid() | L142-155 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L146 newHeaderGroupMap01newHeaderGroupConfig12 100 "산출세액" (pay27_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 130, '초과', { editor: 'number' }),  // L148
  gb.long('toAmt', 130, '이하', { editor: 'number' }),  // L149
  gb.long('deductAmt', 130, '기본공제', { editor: 'number' }),  // L150
  gb.double('rate', 130, '적용율(%)', { editor: 'number' }),  // L151
  gb.text('note', 500, '비고', { editor: 'text' }),  // L152
];

const buildLimitGrid = () => [
  // ⚠DB없음 L160 newHeaderGroupMap01newHeaderGroupConfig12 100 "총급여액" (pay28_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 130, '초과', { editor: 'number' }),  // L162
  gb.long('toAmt', 130, '이하', { editor: 'number' }),  // L163
  gb.long('minLimit', 130, '최소한도', { editor: 'number' }),  // L164
  gb.long('maxLimit', 130, '최대한도', { editor: 'number' }),  // L165
  gb.double('rate', 130, '적용율(%)', { editor: 'number' }),  // L166
  gb.text('note', 500, '비고', { editor: 'text' }),  // L167
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insert}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="register" onClick={limitInsert}>등록</Button>
5. <Button type="save" onClick={limitUpdate}>저장</Button>
6. <Button type="delete" onClick={limitDelete}>삭제</Button>

### Pay27_Popup_TaxDeductTableCreate (`client/vi/pay/Pay27_Popup_TaxDeductTableCreate.java`, 109줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L42-71) → show()
[E1] updateButton[생성].Select (L54) → update()
[E2] closeButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L73-81 | open | 상태 처리 | 업무 |
| public update() | L83-98 | E1 | 서비스 pay.Pay27_TaxDeductTable.insert(startDate) | 업무 |
| private setHtmlStyle() | L101-103 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay26_TabPage_TaxCalcTable (`client/vi/pay/Pay26_TabPage_TaxCalcTable.java`, 197줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `taxCalcPage` Pay26_TabPage_TaxCalc, `popUp` Pay26_Popup_TaxCalcCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L48-50) → settings()
[E1] retrieveButton[조회].Select (L64) → retrieve()
[E2] insertButton[등록].Select (L70) → insert()
[E3] deleteButton[삭제].Select (L76) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L156) → retrieve()
[E4] grid.SelectionChanged (L101) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L123-125 | E1,E5,insert | 상태 처리 | 업무 |
| public retrieve() | L127-137 | E1,E5,insert | 서비스 pay.Pay26_TaxCalcTable.selectByAll | 업무 |
| public insert() | L139-146 | E2 | 팝업 Pay26_Popup_TaxCalcCreate 열기 | 업무 |
| public deleteRow() | L148-183 | E3 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E5 | 업무 |
| public retrievePage() | L185-189 | E4 | 상태 처리 | 업무 |
| public getGrid() | L192-195 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L52-108 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L110-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),  // L112
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay26_TabPage_TaxCalc (`client/vi/pay/Pay26_TabPage_TaxCalc.java`, 140줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 150 "초과" Long 편집:LongField
  - toAmt 150 "이하" Long 편집:LongField
  - basicTax 150 "기본세액" Long 편집:LongField
  - rate 200 "초과금액 적용세율(%)" Double 편집:DoubleField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L45-86) → 초기화
[E1] insertButton[등록].Select (L67) → insertRow()
[E2] updateButton[저장].Select (L73) → update()
[E3] deleteButton[삭제].Select (L79) → deleteRow()
       └ [E4] messageBox.DialogHide [YES] (L125) → 서비스 pay.Pay26_TaxCalcTable.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L102-108 | 공개 메서드 | 서비스 pay.Pay26_TaxCalcTable.selectByDate(date) | 업무 |
| public update() | L110-113 | E2 | 서비스 pay.Pay26_TaxCalcTable.update | 업무 |
| public insertRow() | L115-120 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L122-137 | E3 | ConfirmBox → E4 | 업무 |
| public buildGrid() | L88-100 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L91 newHeaderGroupMap01newHeaderGroupConfig12 100 "과세표준(원)" (pay26_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 150, '초과', { editor: 'number' }),  // L93
  gb.long('toAmt', 150, '이하', { editor: 'number' }),  // L94
  gb.long('basicTax', 150, '기본세액', { editor: 'number' }),  // L95
  gb.double('rate', 200, '초과금액 적용세율(%)', { editor: 'number' }),  // L96
  gb.text('note', 500, '비고', { editor: 'text' }),  // L97
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay26_Popup_TaxCalcCreate (`client/vi/pay/Pay26_Popup_TaxCalcCreate.java`, 109줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L42-71) → show()
[E1] updateButton[생성].Select (L54) → update()
[E2] closeButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L73-81 | open | 상태 처리 | 업무 |
| public update() | L83-98 | E1 | 서비스 pay.Pay26_TaxCalcTable.insert(startDate) | 업무 |
| private setHtmlStyle() | L101-103 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay25_TabPage_PersonDeduct (`client/vi/pay/Pay25_TabPage_PersonDeduct.java`, 197줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `deductTablePage` Pay25_TabPage_Deduct, `popUp` Pay25_Popup_personDeductCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L48-50) → settings()
[E1] retrieveButton[조회].Select (L64) → retrieve()
[E2] insertButton[등록].Select (L70) → insert()
[E3] deleteButton[삭제].Select (L76) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L156) → retrieve()
[E4] grid.SelectionChanged (L101) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L123-125 | E1,E5,insert | 상태 처리 | 업무 |
| public retrieve() | L127-137 | E1,E5,insert | 서비스 pay.Pay25_PersonDeduct.selectByAll | 업무 |
| public insert() | L139-146 | E2 | 팝업 Pay25_Popup_personDeductCreate 열기 | 업무 |
| public deleteRow() | L148-183 | E3 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E5 | 업무 |
| public retrievePage() | L185-189 | E4 | 상태 처리 | 업무 |
| public getGrid() | L192-195 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L52-108 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L110-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),  // L112
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay25_TabPage_Deduct (`client/vi/pay/Pay25_TabPage_Deduct.java`, 148줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `personDeductComboBox` ComboBoxField("PersonDeductCode")
- 그리드 `grid` (buildGrid()):
  - personDeductName 200 "구분" Text 편집:personDeductComboBox
  - deductAmt 100 "공제금액" Long 편집:LongField
  - note 800 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L45-86) → 초기화
[E1] insertButton[등록].Select (L67) → insertRow()
[E2] updateButton[저장].Select (L73) → update()
[E3] deleteButton[삭제].Select (L79) → deleteRow()
       └ [E5] messageBox.DialogHide [YES] (L133) → 서비스 pay.Pay25_PersonDeduct.delete
[E4] personDeductComboBox[PersonDeductCode].Collapse (L92) → 인라인 L92-99 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L110-116 | 공개 메서드 | 서비스 pay.Pay25_PersonDeduct.selectByDate(date) | 업무 |
| public update() | L118-121 | E2 | 서비스 pay.Pay25_PersonDeduct.update | 업무 |
| public insertRow() | L123-128 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L130-145 | E3 | ConfirmBox → E5 | 업무 |
| public buildGrid() | L88-108 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('personDeductNm', 200, '구분', { editor: 'select' }),  // L103 SQL 계산 컬럼(selectByDate: f_cdnm('PersonDeductCode', pay25_person…)
  gb.long('deductAmt', 100, '공제금액', { editor: 'number' }),  // L104
  gb.text('note', 800, '비고', { editor: 'text' }),  // L105
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay25_Popup_personDeductCreate (`client/vi/pay/Pay25_Popup_personDeductCreate.java`, 109줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L42-71) → show()
[E1] updateButton[생성].Select (L54) → update()
[E2] closeButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L73-81 | open | 상태 처리 | 업무 |
| public update() | L83-98 | E1 | 서비스 pay.Pay25_PersonDeduct.insert(startDate) | 업무 |
| private setHtmlStyle() | L101-103 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay24_TabPage_DeductTable (`client/vi/pay/Pay24_TabPage_DeductTable.java`, 196줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `deductTablePage` Pay24_TabPage_Deduct, `popUp` Pay24_Popup_DeductTableCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L48-50) → settings()
[E1] retrieveButton[조회].Select (L63) → retrieve()
[E2] insertButton[등록].Select (L69) → insert()
[E3] deleteButton[삭제].Select (L75) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L155) → retrieve()
[E4] grid.SelectionChanged (L100) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L117-119 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L122-124 | E1,E5,insert | 상태 처리 | 업무 |
| public retrieve() | L126-136 | E1,E5,insert | 서비스 pay.Pay24_DeductTable.selectByAll | 업무 |
| public insert() | L138-145 | E2 | 팝업 Pay24_Popup_DeductTableCreate 열기 | 업무 |
| public deleteRow() | L147-182 | E3 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E5 | 업무 |
| public retrievePage() | L184-188 | E4 | 상태 처리 | 업무 |
| public getGrid() | L191-194 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L52-107 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L109-114 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용시작일'),  // L111
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay24_TabPage_Deduct (`client/vi/pay/Pay24_TabPage_Deduct.java`, 207줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 공제한도: {limitAmt} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `limitAmt` LongField
- 그리드 `grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 100 "초과" Long 편집:LongField
  - toAmt 100 "이하" Long 편집:LongField
  - deductAmt 140 "기본공제금액" Long 편집:LongField
  - deductRate 140 "공제율(%)" Double 편집:DoubleField
  - note 500 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L55-106) → 초기화
[E1] insertButton[등록].Select (L87) → insertRow()
[E2] updateButton[저장].Select (L93) → update()
[E3] deleteButton[삭제].Select (L99) → deleteRow()
       └ [E4] messageBox.DialogHide [YES] (L188) → 서비스 pay.Pay24_DeductTable.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L122-152 | update | 서비스 pay.Pay24_DeductTable.selectByDataCode, pay.Pay24_DeductTable.selectByDataCode(date, dataCode, dataCode, date) | 업무 |
| public update() | L154-175 | E2 | 서비스 pay.Pay24_DeductTable.update, pay.Pay24_DeductTable.updateLimitAmt(dataCode, limitAmt, startDate) | 업무 |
| public insertRow() | L177-183 | E1 | 상태 처리 | 업무 |
| public deleteRow() | L185-200 | E3 | ConfirmBox → E4 | 업무 |
| public buildGrid() | L108-120 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L202-204 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L111 newHeaderGroupMap01newHeaderGroupConfig12 100 "총급여액(원)" (pay24_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 100, '초과', { editor: 'number' }),  // L113
  gb.long('toAmt', 100, '이하', { editor: 'number' }),  // L114
  gb.long('deductAmt', 140, '기본공제금액', { editor: 'number' }),  // L115
  gb.double('deductRate', 140, '공제율(%)', { editor: 'number' }),  // L116
  gb.text('note', 500, '비고', { editor: 'text' }),  // L117
];
```

#### 사용된 버튼들
1. <Button type="register" onClick={insertRow}>등록</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay24_Popup_DeductTableCreate (`client/vi/pay/Pay24_Popup_DeductTableCreate.java`, 109줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L42-71) → show()
[E1] updateButton[생성].Select (L54) → update()
[E2] closeButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L73-81 | open | 상태 처리 | 업무 |
| public update() | L83-98 | E1 | 서비스 pay.Pay24_DeductTable.insert(startDate) | 업무 |
| private setHtmlStyle() | L101-103 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay23_TabPage_SimpleTaxTable (`client/vi/pay/Pay23_TabPage_SimpleTaxTable.java`, 197줄)

- 레이아웃: north=buttonBar, center=hlc
- 툴바 `buttonBar`: {retrieveButton} {insertButton} {deleteButton}
- 입력·하위 화면: `simpleTaxTablePage` Pay22_TabPage_SimpleTax, `popUp` Pay23_Popup_SimpleTaxTableCreate
- 그리드 `grid` (buildGrid()):
  - startDate 190 "적용기준시작일" Date

#### 이벤트
[E0] 화면 열림 (생성자 L48-50) → settings()
[E1] retrieveButton[조회].Select (L64) → retrieve()
[E2] insertButton[등록].Select (L70) → insert()
[E3] deleteButton[삭제].Select (L76) → deleteRow()
       └ [E5] msgBox.DialogHide [YES] (L155) → retrieve()
[E4] grid.SelectionChanged (L101) → retrievePage()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L118-120 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L123-125 | E1,E5,insert | 상태 처리 | 업무 |
| public retrieve() | L127-137 | E1,E5,insert | 서비스 pay.Pay23_SimpleTaxTableOther.selectByAll | 업무 |
| public insert() | L139-146 | E2 | 팝업 Pay23_Popup_SimpleTaxTableCreate 열기 | 업무 |
| public deleteRow() | L147-182 | E3 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E5 | 업무 |
| public retrievePage() | L184-189 | E4 | 상태 처리 | 업무 |
| public getGrid() | L192-195 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L52-108 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L110-115 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 190, '적용기준시작일'),  // L112
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insert}>등록</Button>
3. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay23_Popup_SimpleTaxTableCreate (`client/vi/pay/Pay23_Popup_SimpleTaxTableCreate.java`, 109줄)

- 입력·하위 화면: `year` MyDateField

#### 이벤트
[E0] 화면 열림 (생성자 L42-71) → show()
[E1] updateButton[생성].Select (L54) → update()
[E2] closeButton[닫기].Select (L60) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L37-40 | 공개 메서드 | 상태 처리 | 업무 |
| private getEditor() | L73-81 | open | 상태 처리 | 업무 |
| public update() | L83-98 | E1 | 서비스 pay.Pay23_SimpleTaxTableOther.insert(startDate) | 업무 |
| private setHtmlStyle() | L101-103 | getEditor | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L105-107 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

### Pay22_TabPage_SimpleTax (`client/vi/pay/Pay22_TabPage_SimpleTax.java`, 314줄)

- 레이아웃: center=vlc, south=vlc2
- 툴바 `buttonBar`: <font style='font-size:14px;'><b>&nbsp;&nbsp;1. 천만원 이하</b></font>: {searchLong} {retrieveButton} {excelUploadButton} {uploadExcelForm}
- 툴바 `buttonBar2`: <font style='font-size:14px;'><b>&nbsp;&nbsp;2. 천만원 초과</b></font>: {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchLong` LongField
- 그리드 `Grid` (buildGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 100 "이상" Long
  - toAmt 100 "미만" Long
  - deductCnt1 100 "1" Long
  - deductCnt2 100 "2" Long
  - deductCnt3 100 "3" Long
  - deductCnt4 100 "4" Long
  - deductCnt5 100 "5" Long
  - deductCnt6 100 "6" Long
  - deductCnt7 100 "7" Long
  - deductCnt8 100 "8" Long
  - deductCnt9 100 "9" Long
  - deductCnt10 100 "10" Long
  - deductCnt11 100 "11" Long
- 그리드 `otherGrid` (buildOtherGrid()):
  - new HeaderGroupMap(…  "" HeaderGroupMap
  - fromAmt 100 "초과" Long 편집:LongField
  - toAmt 100 "이하" Long 편집:LongField
  - rate1 140 "적용기준율1 (%)" Double 편집:DoubleField
  - rate2 140 "적용기준율2 (%)" Double 편집:DoubleField
  - addTax 140 "누진세액2 (원)" Long 편집:LongField
  - note 700 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L73-181) → 초기화
[E1] uploadExcelForm.SubmitComplete (L91) → retrieve()
[E2] excelUploadButton[엑셀업로드].Select (L98) → excelUploadCheck()
[E3] searchLong.ValueChange (L142) → retrieve()
[E4] retrieveButton[조회].Select (L149) → retrieve()
[E5] insertButton[등록].Select (L156) → insertRow()
[E6] updateButton[저장].Select (L162) → update()
[E7] deleteButton[삭제].Select (L168) → deleteRow()
       └ [E8] messageBox.DialogHide [YES] (L268) → 서비스 pay.Pay23_SimpleTaxTableOther.delete
[E9] fileUploadField.Change (L303) → 인라인 L303-308 (new ChangeHandler() { @Override publi…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public buildOtherGrid() | L207-220 | 필드 초기화 | 상태 처리 | 업무 |
| public retrieve() | L222-236 | E1,E3,E4 | 서비스 pay.Pay22_SimpleTaxTable.selectByDate(date, searchLong) | 업무 |
| public retrieveOther() | L238-251 | 공개 메서드 | 서비스 pay.Pay23_SimpleTaxTableOther.selectByDate(date) | 업무 |
| public update() | L253-256 | E6 | 서비스 pay.Pay23_SimpleTaxTableOther.update | 업무 |
| public insertRow() | L258-263 | E5 | 상태 처리 | 업무 |
| public deleteRow() | L265-280 | E7 | ConfirmBox → E8 | 업무 |
| private excelUploadCheck() | L282-292 | E2 | 서비스 pay.Pay22_SimpleTaxTable.deleteByDate(date) | 업무 |
| private excelUpload() | L294-311 | excelUploadCheck | 상태 처리 | 업무 |
| public buildGrid() | L183-205 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  // ⚠DB없음 L187 newHeaderGroupMap01newHeaderGroupConfig12 100 "월급여액(천원)" (pay22_new_header_group_map01new_header_group_config12 컬럼 없음)
  // ⚠DB없음 L188 newHeaderGroupMap03newHeaderGroupConfig111 100 "공제대상가족의 수" (pay22_new_header_group_map03new_header_group_config111 컬럼 없음)
  gb.long('fromAmt', 100, '이상'),  // L190
  gb.long('toAmt', 100, '미만'),  // L191
  gb.long('deductCnt1', 100, '1'),  // L192
  gb.long('deductCnt2', 100, '2'),  // L193
  gb.long('deductCnt3', 100, '3'),  // L194
  gb.long('deductCnt4', 100, '4'),  // L195
  gb.long('deductCnt5', 100, '5'),  // L196
  gb.long('deductCnt6', 100, '6'),  // L197
  gb.long('deductCnt7', 100, '7'),  // L198
  gb.long('deductCnt8', 100, '8'),  // L199
  gb.long('deductCnt9', 100, '9'),  // L200
  gb.long('deductCnt10', 100, '10'),  // L201
  gb.long('deductCnt11', 100, '11'),  // L202
];

const buildOtherGrid = () => [
  // ⚠DB없음 L210 newHeaderGroupMap01newHeaderGroupConfig12 100 "월급여액(천원)" (pay23_new_header_group_map01new_header_group_config12 컬럼 없음)
  gb.long('fromAmt', 100, '초과', { editor: 'number' }),  // L212
  gb.long('toAmt', 100, '이하', { editor: 'number' }),  // L213
  gb.double('rate1', 140, '적용기준율1 (%)', { editor: 'number' }),  // L214
  gb.double('rate2', 140, '적용기준율2 (%)', { editor: 'number' }),  // L215
  gb.long('addTax', 140, '누진세액2 (원)', { editor: 'number' }),  // L216
  gb.text('note', 700, '비고', { editor: 'text' }),  // L217
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="upload" onClick={excelUploadCheck}>엑셀업로드</Button>
3. <Button type="register" onClick={insertRow}>등록</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay21_TabPage_Rate (`client/vi/pay/Pay21_TabPage_Rate.java`, 219줄)

- 툴바 `buttonBar`: 율 구분: {RateComboBox} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `RateComboBox` ComboBoxField("RateCode", "%", "전체", "전체"), `RateTypeComboBox` ComboBoxField("RateCode")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - rateName 150 "율 구분" Text 편집:RateTypeComboBox
  - startDate 100 "적용시작일" Date 편집:MyDateField
  - applyRate 80 "율(%)" Double 편집:DoubleField
  - note 600 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L57-75) → settings()
[E1] RateComboBox[RateCode].Collapse (L88) → retrieve()
[E2] retrieveButton[조회].Select (L95) → retrieve()
[E3] insertButton[등록].Select (L101) → insertRow()
[E4] updateButton[저장].Select (L107) → update()
[E5] deleteButton[삭제].Select (L113) → deleteRow()
       └ [E7] messageBox.DialogHide [YES] (L195) → 서비스 pay.Pay21_Rate.delete
[E6] RateTypeComboBox[RateCode].Collapse (L127) → 인라인 L127-134 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L146-148 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L151-153 | E1,E2,settings | 상태 처리 | 업무 |
| public retrieve() | L155-169 | E1,E2,settings | 서비스 pay.Pay21_Rate.selectByCode(rateCode) | 업무 |
| public update() | L171-184 | E4 | 서비스 pay.Pay21_Rate.update | 업무 |
| public insertRow() | L186-190 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L192-207 | E5 | ConfirmBox → E7 | 업무 |
| public getGrid() | L214-217 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L77-121 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L123-143 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L209-211 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('rateNm', 150, '율 구분', { editor: 'select' }),  // L137 SQL 계산 컬럼(selectByCode: f_cdnm('RateCode', pay21_rate_cd, 1, f_…)
  gb.date('startDate', 100, '적용시작일', { editor: 'date' }),  // L138
  gb.double('applyRate', 80, '율(%)', { editor: 'number' }),  // L139
  gb.text('note', 600, '비고', { editor: 'text' }),  // L140
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay20_TabPage_Item (`client/vi/pay/Pay20_TabPage_Item.java`, 245줄)

- 툴바 `buttonBar`: 항목구분: {itemTypeComboBox} 검색: {searchText} {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 입력·하위 화면: `searchText` TextField 빈칸="문자열을 입력하세요", `itemTypeComboBox` ComboBoxField("PayItemType", "%", "전체", "전체"), `nonTaxTypeComboBox` ComboBoxField("NonTaxType")
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemTypeName 150 "항목구분" Text 편집:itemTypeComboBox
  - itemCode 100 "코드" TextCenter 편집:TextField
  - itemName 400 "항목명" Text 편집:TextField
  - nonTaxTypeName 100 "과세구분" Text 편집:nonTaxTypeComboBox
  - seq 80 "조회순서" Long 편집:LongField
  - useYn 80 "사용여부" Boolean

#### 이벤트
[E0] 화면 열림 (생성자 L59-79) → settings()
[E1] itemTypeComboBox[PayItemType].Collapse (L92) → retrieve()
[E2] searchText.KeyPress [Enter] (L101) → retrieve()
[E3] retrieveButton[조회].Select (L110) → retrieve()
[E4] insertButton[등록].Select (L116) → insertRow()
[E5] updateButton[저장].Select (L122) → update()
[E6] deleteButton[삭제].Select (L128) → deleteRow()
       └ [E9] messageBox.DialogHide [YES] (L222) → 서비스 pay.Pay20_Item.delete
[E7] itemTypeComboBox[PayItemType].Collapse (L142) → 인라인 L142-149 (new CollapseHandler() { @Override pub…)
[E8] nonTaxTypeComboBox[NonTaxType].Collapse (L151) → 인라인 L151-158 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public init() | L172-174 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L177-179 | E1,E2,E3,settings | 상태 처리 | 업무 |
| public retrieve() | L182-193 | E1,E2,E3,settings | 서비스 pay.Pay20_Item.selectBySearchText(itemType, searchText) | 업무 |
| public update() | L196-209 | E5 | 서비스 pay.Pay20_Item.update | 업무 |
| public insertRow() | L212-216 | E4 | 상태 처리 | 업무 |
| public deleteRow() | L219-234 | E6 | ConfirmBox → E9 | 업무 |
| public getGrid() | L241-244 | 공개 메서드 | 상태 처리 | 업무 |
| private settings() | L81-136 | 생성자 | 이벤트 연결 | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L138-169 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L236-238 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemTypeNm', 150, '항목구분', { editor: 'select' }),  // L161 SQL 계산 컬럼(selectBySearchText: f_cdnm('PayItemType', pay20_item_type, …)
  gb.textCenter('itemCd', 100, '코드', { editor: 'text' }),  // L162
  gb.text('itemNm', 400, '항목명', { editor: 'text' }),  // L163
  gb.text('nonTaxTypeNm', 100, '과세구분', { editor: 'select' }),  // L164 SQL 계산 컬럼(selectBySearchText: f_cdnm('NonTaxType', pay20_non_tax_type…)
  gb.long('seq', 80, '조회순서', { editor: 'number' }),  // L165
  gb.boolean('useYn', 80, '사용여부'),  // L166
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="save" onClick={update}>저장</Button>
4. <Button type="delete" onClick={deleteRow}>삭제</Button>

### Pay04_TabPage_Formula (`client/vi/pay/Pay04_TabPage_Formula.java`, 488줄)

- 레이아웃: center=vlc, east=vlc2, center=vlc
- 툴바 `buttonBar1`: {retrieveButton} {insertButton} {updateButton} {deleteButton}
- 툴바 `buttonBar2`: {insertRowButton} {deleteRowButton}
- 툴바 `buttonBar3`: 고객사: {companyField} {eastRetrieveButton} {basicDataCreateButton}
- 툴바 `buttonBarBottom`: {link}
- 입력·하위 화면: `companyField` LookupTriggerField, `lookupCompany` Sys01_Lookup_Company, `lookup` Pay04_Lookup_Insert, `popup` Pay20_Lookup_ItemList
- 그리드 `grid` (buildGrid()):
  - startDate 150 "기준 적용일" Date
- 그리드 `formGrid` (buildFormGrid()):
  - itemName 120 "구분" Text
  - formulaForm 300 "산출식 또는 산출방법 입력" Text 편집:TextField
  - note 120 "비고" Text 편집:TextField
  - itemName 200 "구분" Text
  - formulaForm 500 "산출식 또는 산출방법 입력" Text 편집:TextField
  - note 500 "비고" Text 편집:TextField
- 그리드 `eastGrid` (buildEastGrid()):
  - startDate 150 "기준 적용일" Date
- 그리드 `eastFormGrid` (buildEastFormGrid()):
  - itemName 120 "구분" Text
  - formulaForm 300 "산출식 또는 산출방법 입력" Text 편집:TextField
  - note 120 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L75-255) → retrieve()
[E1] grid.SelectionChanged [선택>0] (L78) → retrieveForm()
[E2] eastGrid.SelectionChanged [선택>0] (L88) → retrieveEastForm()
[E3] companyField.TriggerClick [result != null] (L100) → eastRetrieve()
[E4] retrieveButton[조회].Select (L123) → retrieve()
[E5] insertButton[생성].Select (L128) → insert()
[E6] updateButton[저장].Select (L133) → update()
[E7] deleteButton[삭제].Select (L138) → delete()
       └ [E12] msgBox.DialogHide [YES] (L388) → retrieve()
[E8] insertRowButton[행 추가].Select (L143) → insertRow()
[E9] deleteRowButton[행 삭제].Select (L148) → deleteRow()
[E10] eastRetrieveButton[조회].Select (L153) → eastRetrieve()
[E11] basicDataCreateButton[기초데이터생성].Select (L158) → basicDataCreate()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private buildFormGrid() | L263-277 | 필드 초기화 | 상태 처리 | 업무 |
| private buildEastGrid() | L279-283 | 필드 초기화 | 상태 처리 | 업무 |
| private buildEastFormGrid() | L285-292 | 필드 초기화 | 상태 처리 | 업무 |
| public init() | L295-297 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L300-302 | 생성자,E4,E12,insert | 상태 처리 | 업무 |
| public retrieve() | L304-315 | 생성자,E4,E12,insert | 서비스 pay.Pay04_Formula.selectByCompanyId(companyId) | 업무 |
| public eastRetrieve() | L317-332 | E3,E10,basicDataCreate | 서비스 pay.Pay04_Formula.selectByCompanyId(companyId) | 업무 |
| public retrieveForm() | L334-344 | E1,update | 서비스 pay.Pay04_Formula.selectByDate(companyId, startDate) | 업무 |
| public retrieveEastForm() | L346-356 | E2 | 서비스 pay.Pay04_Formula.selectByDate(companyId, startDate) | 업무 |
| private insert() | L358-366 | E5 | 조회창 Pay04_Lookup_Insert 열기 | 업무 |
| private update() | L368-378 | E6 | 서비스 pay.Pay04_Formula.update | 업무 |
| private delete() | L380-416 | E7 | 미선택 시 alert "기준 적용일을 선택해주세요" → 확인창 E12 | 업무 |
| public insertRow() | L418-444 | E8 | 조회창 Pay20_Lookup_ItemList 열기 | 업무 |
| public deleteRow() | L446-450 | E9 | GridDeleteData pay.Pay04_Formula.delete(체크된 행 목록) | 업무 |
| public basicDataCreate() | L452-473 | E11 | 미선택 시 alert "고객사는 필수 선택 사항입니다", 서비스 pay.Pay04_Formula.basicDataCreate(companyId, startDate) | 업무 |
| public getGrid() | L484-487 | 공개 메서드 | 상태 처리 | 업무 |
| private buildGrid() | L257-261 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlBarStyle() | L475-477 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxStyle() | L479-481 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('startDate', 150, '기준 적용일'),  // L259
];

const buildFormGrid = () => [
  gb.text('itemNm', 120, '구분'),  // L267 SQL 계산 컬럼(selectByDate: pay20_item_nm)
  gb.text('formulaForm', 300, '산출식 또는 산출방법 입력', { editor: 'text' }),  // L268
  gb.text('note', 120, '비고', { editor: 'text' }),  // L269
  gb.text('itemNm', 200, '구분'),  // L271 SQL 계산 컬럼(selectByDate: pay20_item_nm)
  gb.text('formulaForm', 500, '산출식 또는 산출방법 입력', { editor: 'text' }),  // L272
  gb.text('note', 500, '비고', { editor: 'text' }),  // L273
];

const buildEastGrid = () => [
  gb.date('startDate', 150, '기준 적용일'),  // L281
];

const buildEastFormGrid = () => [
  gb.text('itemNm', 120, '구분'),  // L288 SQL 계산 컬럼(selectByDate: pay20_item_nm)
  gb.text('formulaForm', 300, '산출식 또는 산출방법 입력', { editor: 'text' }),  // L289
  gb.text('note', 120, '비고', { editor: 'text' }),  // L290
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="generate" onClick={insert}>생성</Button>
4. <Button type="delete" onClick={delete}>삭제</Button>
5. <Button type="addRow" onClick={insertRow}>행 추가</Button>
6. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>
7. <Button type="search" onClick={eastRetrieve}>조회</Button>
8. <Button type="unknown" onClick={basicDataCreate}>기초데이터생성</Button>

### Pay20_Lookup_ItemList (`client/vi/pay/Pay20_Lookup_ItemList.java`, 149줄)

- 툴바 `buttonBar`: 항목명: {searchText} {retrieveButton}
- 입력·하위 화면: `searchText` TextField
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - itemTypeName 140 "구분" Text
  - itemName 150 "항목명" Text

#### 이벤트
[E1] searchText.KeyPress [Enter] (L56) → retrieve()
[E2] grid.RowDoubleClick (L64) → confirm()
[E3] retrieveButton[조회].Select (L70) → retrieve()
[E4] oKButton[확인].Select (L76) → confirm()
[E5] cancelButton[취소].Select (L82) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L45-106 | 공개 메서드 | 상태 처리 | 업무 |
| public retrieve() | L118-128 | E1,E3,open | 서비스 pay.Pay20_Item.selectByText(searchText) | 업무 |
| public confirm() | L130-139 | E2,E4 | 상태 처리 | 업무 |
| private buildGrid() | L108-116 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L141-143 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L145-147 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('itemTypeNm', 140, '구분'),  // L112 SQL 계산 컬럼(selectByText: f_cdnm('PayItemType', pay20_item_type, …)
  gb.text('itemNm', 150, '항목명'),  // L113
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={confirm}>확인</Button>
3. <Button type="cancel" onClick={hide}>취소</Button>

### Pay04_Lookup_Insert (`client/vi/pay/Pay04_Lookup_Insert.java`, 95줄)

- 입력·하위 화면: `payDate` MyDateField

#### 이벤트
[E1] updateButton[생성].Select (L49) → update()
[E2] closeButton[닫기].Select (L55) → hide()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L33-66 | 공개 메서드 | 상태 처리 | 업무 |
| public update() | L68-86 | E1 | 서비스 pay.Pay04_Formula.insert(companyId, startDate) | 업무 |
| private setHtmlStyle() | L88-90 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlHeaderStyle() | L92-94 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
Grid 사용하지 않음

#### 사용된 버튼들
1. <Button type="generate" onClick={update}>생성</Button>
2. <Button type="unknown" onClick={hide}>닫기</Button>

