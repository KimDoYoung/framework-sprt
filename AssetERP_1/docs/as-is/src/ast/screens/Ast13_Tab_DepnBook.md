# Ast13_Tab_DepnBook

- 종류: 화면
- 메뉴: 고유자산 > 30. 고유자산 현황 > 감가상각대장 (#1181)
- 파일: `client/vi/ast/Ast13_Tab_DepnBook.java`
- 함께 쓰는 클래스 1개:
  - `Ast16_Lookup_NonDeductTax` `client/vi/ast/Ast16_Lookup_NonDeductTax.java`
- 연결 화면·컴포넌트 (각 파일 참고): [`Apr01_Edit_ApprDoc`](../../apr/components/Apr01_Edit_ApprDoc.md), [`Dcr30_Move_DcrClass`](../../dcr/components/Dcr30_Move_DcrClass.md)

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `apr.Apr01_Appr.selectById` | Ast13_Tab_DepnBook:245 | [`Apr01_Appr.java:39`](../../apr/services/Apr01_Appr.md) | [`apr01_appr.selectById`](../../apr/sql/apr01_appr.md) |
| `ast.Ast13_BookDepn.getDepnDate2` | Ast13_Tab_DepnBook:355 | [`Ast13_BookDepn.java:43`](../../ast/services/Ast13_BookDepn.md) | [`ast13_book_depn.getDepnDate2`](../../ast/sql/ast13_book_depn.md) |
| `ast.Ast13_BookDepn.selectByDepnDate2` | Ast13_Tab_DepnBook:330 | [`Ast13_BookDepn.java:25`](../../ast/services/Ast13_BookDepn.md) | [`ast13_book_depn.selectByDepnDate2`](../../ast/sql/ast13_book_depn.md) |
| `ast.Ast16_NonDeductTax.delete` | Ast16_Lookup_NonDeductTax:174 | [`Ast16_NonDeductTax.java:30`](../../ast/services/Ast16_NonDeductTax.md) | `UpdateDataModel(ast16_non_deduct_tax)` 동적 DELETE |
| `ast.Ast16_NonDeductTax.selectByPurTrId` | Ast16_Lookup_NonDeductTax:135 | [`Ast16_NonDeductTax.java:20`](../../ast/services/Ast16_NonDeductTax.md) | [`ast16_non_deduct_tax.selectByPurTrId`](../../ast/sql/ast16_non_deduct_tax.md) |
| `ast.Ast16_NonDeductTax.update` | Ast16_Lookup_NonDeductTax:145 | [`Ast16_NonDeductTax.java:25`](../../ast/services/Ast16_NonDeductTax.md) | `UpdateDataModel(ast16_non_deduct_tax)` 동적 INSERT/UPDATE → [`ast16_non_deduct_tax.selectById`](../../ast/sql/ast16_non_deduct_tax.md) |
| `ast.Ast80_RelateAppr.insert` | Ast13_Tab_DepnBook:404 | [`Ast80_RelateAppr.java:58`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.deleteByApprId`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.insert`](../../ast/sql/ast80_relate_appr.md), [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) |
| `ast.Ast80_RelateAppr.selectByCompanyId` | Ast13_Tab_DepnBook:452 | [`Ast80_RelateAppr.java:26`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.selectByCompanyId`](../../ast/sql/ast80_relate_appr.md) |
| `ast.Ast80_RelateAppr.updateApprId` | Ast13_Tab_DepnBook:436 | [`Ast80_RelateAppr.java:95`](../../ast/services/Ast80_RelateAppr.md) | [`ast80_relate_appr.updateApprId`](../../ast/sql/ast80_relate_appr.md) |
| `dcr.Dcr30_Link.selectByLinkCode` | Ast13_Tab_DepnBook:277, Ast13_Tab_DepnBook:378 | [`Dcr30_Link.java:46`](../../dcr/services/Dcr30_Link.md) | [`dcr01_class_tree.selectByLinkCode`](../../dcr/sql/dcr01_class_tree.md) |
| `sys.Sys00_Common.selectDepnItemType` | Ast13_Tab_DepnBook:144 | [`Sys00_Common.java:156`](../../sys/services/Sys00_Common.md) | [`sys00_common.selectDepnItemType`](../../sys/sql/sys00_common.md) |
| `sys.Sys99_Print.insertRdDepnBook` | Ast13_Tab_DepnBook:192 | [`Sys99_Print.java:1520`](../../sys/services/Sys99_Print.md) | [`ast13_book_depn.selectByDepnDate2`](../../ast/sql/ast13_book_depn.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys99_print.deleteByPersonId`](../../sys/sql/sys99_print.md), [`sys99_print.insert`](../../sys/sql/sys99_print.md) |

## 테이블

[`act02_journal`](../../../db/tables/act.md), [`apr01_appr`](../../../db/tables/apr.md), [`apr10_stamp`](../../../db/tables/apr.md), [`ast01_class_tree`](../../../db/tables/ast.md), [`ast06_tr`](../../../db/tables/ast.md), [`ast13_book_depn`](../../../db/tables/ast.md), [`ast16_non_deduct_tax`](../../../db/tables/ast.md), [`ast80_relate_appr`](../../../db/tables/ast.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr30_link`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys99_print`](../../../db/tables/sys.md)

## DB 함수

`f_ast_class_tree_nm_allpath2`, `f_cdnm`, `f_class_tree_nm_allpath`, `f_get_dcr_no`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Ast13_Tab_DepnBook (`client/vi/ast/Ast13_Tab_DepnBook.java`, 528줄)

- 레이아웃: center=vlc
- 툴바 `buttonBar`: 보유일자: {holdDate} 구분: {astTypeCombo} 검색: {searchText} {retireCheckBox} {retrieveButton} {downLoadButton} {notice}
- 입력·하위 화면: `holdDate` MyDateField, `retireCheckBox` CheckBox, `searchText` TextField 빈칸="계정구분/구분/자산명/적요", `classTreeFullName` LookupTriggerField 빈칸="미선택시 자동으로 관리자가 지정한 문서분류에 상신이 진행됩니다.", `apprStepCode` TextField, `apprStepName` TextField, `astTypeCombo` CommonComboBoxField("sys.Sys00_Common.selectDepnItemType", "%", "전체", "전체"), `editor` Apr01_Edit_ApprDoc, `apprDoc` Apr01_Edit_ApprDoc, `lookupNonDeductTax` Ast16_Lookup_NonDeductTax
- 그리드 `grid` (buildGrid()):
  - accountTypeName 120 "계정구분" TextCenter
  - itemType 200 "구분" Text
  - itemName 300 "자산명" TextArea
  - note 300 "적요" TextArea
  - purDate 90 "취득일자" Date
  - purAmt 100 "취득금액" Long
  - nonDeductTax 100 "불공제세액<br>(추가분)" Long
  - monthDepnCost 100 "당월<br>감가상각비" Long
  - depnCost 100 "당기<br>감가상각비" Long
  - acmDepnCost 100 "감가상각누계액" Long
  - remDepnCost 100 "잔여상각액" Long
  - retireDate 90 "폐기일자" Date

#### 이벤트
[E0] 화면 열림 (생성자 L87-132) → settings(), defaultName(), retrieve()
[E1] astTypeCombo[sys.Sys00_Common.selectDepnItemType].Collapse (L152) → retrieve()
[E2] searchText.KeyPress [Enter] (L167) → retrieve()
[E3] retrieveButton[조회].Select (L179) → retrieve()
[E4] downLoadButton[출력/다운로드].Select [result.getStatus() == 1] (L186) → 서비스 sys.Sys99_Print.insertRdDepnBook(companyId, personId, windowClassName, depnDate, itemLClassCode, retireYn, searchText)
[E5] classTreeFullName[문서분류].TriggerClick (L230) → openLookupDoc()
[E6] apprButton[상신].Select (L236) → getDepnDate2()
[E7] apprViewButton[문서보기].Select (L242) → retrieveApprStep()
[E8] grid.RowDoubleClick (L268) → lookupNonDeductTax()

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| private defaultName() | L276-296 | 생성자 | 서비스 dcr.Dcr30_Link.selectByLinkCode | 업무 |
| public retrieve() | L319-340 | 생성자,E1,E2,E3,settings,updateApprId,lookupNonDeductTax | 서비스 ast.Ast13_BookDepn.selectByDepnDate2(companyId, depnDate, itemLClassCode, retireYn, searchText) | 업무 |
| private openLookupDoc() | L343-352 | E5 | 상태 처리 | 업무 |
| private getDepnDate2() | L354-374 | E6 | 서비스 ast.Ast13_BookDepn.getDepnDate2(companyId, depnDate) | 업무 |
| private insertLinkApprovals() | L376-432 | getDepnDate2 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 dcr.Dcr30_Link.selectByLinkCode, ast.Ast80_RelateAppr.insert | 업무 |
| private updateApprId() | L435-447 | insertLinkApprovals | 서비스 ast.Ast80_RelateAppr.updateApprId(relateApprId, apprId) | 업무 |
| private retrieveApprStep() | L449-498 | E7,retrieve | 서비스 ast.Ast80_RelateAppr.selectByCompanyId | 업무 |
| private lookupNonDeductTax() | L500-511 | E8 | 조회창 Ast16_Lookup_NonDeductTax 열기 | 업무 |
| private settings() | L134-274 | 생성자 | 팝업 Apr01_Edit_ApprDoc 열기, 서비스 sys.Sys00_Common.selectDepnItemType, sys.Sys99_Print.insertRdDepnBook, apr.Apr01_Appr.selectById(companyId, personId, windowClassName, depnDate, itemLClassCode, retireYn, searchText), 이벤트 연결, 초기값: holdDate=LoginUser.getToday(, retireCheckBox=false("폐기자산 포함") | UI구성 (이벤트 절로 대체) |
| public buildGrid() | L298-317 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlStyle() | L513-515 | 생성자,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlBarStyle() | L517-519 | 생성자 | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlCheckBoxLabelStyle() | L521-523 | settings | LabelHtml 래퍼 | 유틸 (변환 불필요) |
| private setHtmlStyle() | L525-527 | 생성자,필드 초기화 | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.textCenter('accountTypeNm', 120, '계정구분'),  // L303
  gb.text('itemType', 200, '구분'),  // L304
  gb.textArea('itemNm', 300, '자산명'),  // L305
  gb.textArea('note', 300, '적요'),  // L306
  gb.date('purDate', 90, '취득일자'),  // L307
  gb.long('purAmt', 100, '취득금액'),  // L308
  gb.long('nonDeductTax', 100, '불공제세액<br>(추가분)'),  // L309
  gb.long('monthDepnCost', 100, '당월<br>감가상각비'),  // L310
  gb.long('depnCost', 100, '당기<br>감가상각비'),  // L311
  gb.long('acmDepnCost', 100, '감가상각누계액'),  // L312
  gb.long('remDepnCost', 100, '잔여상각액'),  // L313
  gb.date('retireDate', 90, '폐기일자'),  // L314
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="download" onClick={() => /* 서비스 sys.Sys99_Print.insertRdDepnBook(companyId, personId, windowClassName, depnDate, itemLClassCode, retireYn, searchText) */}>출력/다운로드</Button>
3. <Button type="register" onClick={getDepnDate2}>상신</Button>
4. <Button type="search" onClick={retrieveApprStep}>문서보기</Button>

### Ast16_Lookup_NonDeductTax (`client/vi/ast/Ast16_Lookup_NonDeductTax.java`, 192줄)

- 툴바 `buttonBar`: {retrieveButton} {insertRowButton} {deleteButton}
- 그리드 `grid` (buildGrid(), 체크박스(다중)):
  - applyDate 120 "적용일자" Date 편집:MyDateField
  - applyNonDeductTax 120 "불공제세액<br>(추가분)" Long 편집:LongField
  - note 350 "비고" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L61-76) → show()
[E1] cancleButton[닫기].Select (L79) → hide()
[E2] retrieveButton[조회].Select (L85) → retrieve()
[E3] updateButton[저장].Select (L91) → update()
[E4] insertRowButton[등록].Select (L97) → insertRow()
[E5] deleteButton[삭제].Select (L103) → delete()
       └ [E6] msgBox.DialogHide [YES] (L167) → 서비스 ast.Ast16_NonDeductTax.delete

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public open() | L53-59 | 공개 메서드 | 상태 처리 | 업무 |
| public setting() | L78-115 | open | 상태 처리 | 업무 |
| public retrieve() | L129-141 | E2,setting | 서비스 ast.Ast16_NonDeductTax.selectByPurTrId(purTrId) | 업무 |
| private update() | L143-154 | E3 | 서비스 ast.Ast16_NonDeductTax.update | 업무 |
| private insertRow() | L156-162 | E4 | 상태 처리 | 업무 |
| private delete() | L164-184 | E5 | ConfirmBox → E6 | 업무 |
| public buildGrid() | L117-127 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |
| private setHtmlHeaderStyle() | L187-189 | open | LabelHtml 래퍼 | 유틸 (변환 불필요) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.date('applyDate', 120, '적용일자', { editor: 'date' }),  // L122
  gb.long('applyNonDeductTax', 120, '불공제세액<br>(추가분)', { editor: 'number' }),  // L123
  gb.text('note', 350, '비고', { editor: 'text' }),  // L124
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="register" onClick={insertRow}>등록</Button>
3. <Button type="delete" onClick={delete}>삭제</Button>
4. <Button type="save" onClick={update}>저장</Button>
5. <Button type="unknown" onClick={hide}>닫기</Button>

