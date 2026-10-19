# Sys30_Tab_LeaveYear

- 종류: 화면
- 메뉴: 경영관리 > 02. 휴가/출장 관리 > 연차휴가 결산기준 (#1036)
- 파일: `client/vi/sys/Sys30_Tab_LeaveYear.java`
- 함께 쓰는 클래스 1개:
  - `Sys30_Grid_LeaveYear` `client/vi/sys/Sys30_Grid_LeaveYear.java`

## 서비스

| 서비스 | 호출 위치 | 서버 | SQL ID |
|:---|:---|:---|:---|
| `sys.Sys01_Company.selectById` | Sys30_Tab_LeaveYear:112 | [`Sys01_Company.java:20`](../../sys/services/Sys01_Company.md) | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), [`sys01_company.updateMainImageId`](../../sys/sql/sys01_company.md) |
| `sys.Sys01_Company.update` | Sys30_Tab_LeaveYear:119 | [`Sys01_Company.java:182`](../../sys/services/Sys01_Company.md) | `UpdateDataModel(sys01_company)` 동적 INSERT/UPDATE → [`sys01_company.selectById`](../../sys/sql/sys01_company.md) ; 부수 효과: 아래 "저장 시 부수 효과" |
| `sys.Sys30_LeaveYear.delete` | Sys30_Grid_LeaveYear:71 | [`Sys30_LeaveYear.java:53`](../../sys/services/Sys30_LeaveYear.md) | `UpdateDataModel(sys30_leave_year)` 동적 DELETE |
| `sys.Sys30_LeaveYear.selectByAll` | Sys30_Grid_LeaveYear:49 | [`Sys30_LeaveYear.java:21`](../../sys/services/Sys30_LeaveYear.md) | [`sys30_leave_year.selectByAll`](../../sys/sql/sys30_leave_year.md) |
| `sys.Sys30_LeaveYear.update` | Sys30_Grid_LeaveYear:55 | [`Sys30_LeaveYear.java:48`](../../sys/services/Sys30_LeaveYear.md) | `UpdateDataModel(sys30_leave_year)` 동적 INSERT/UPDATE → [`sys30_leave_year.selectById`](../../sys/sql/sys30_leave_year.md) |

## 테이블

[`act01_account_code`](../../../db/tables/act.md), [`act09_account_num`](../../../db/tables/act.md), [`act10_repr_account`](../../../db/tables/act.md), [`act11_tr_map`](../../../db/tables/act.md), [`act12_journal_map`](../../../db/tables/act.md), [`act13_real_account_map`](../../../db/tables/act.md), [`ast02_detail`](../../../db/tables/ast.md), [`ast05_tr_code`](../../../db/tables/ast.md), [`ast15_tr_code_window`](../../../db/tables/ast.md), [`bbs12_application_form`](../../../db/tables/bbs.md), [`biz90_limit`](../../../db/tables/biz.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`com11_form_mapping_multi`](../../../db/tables/com.md), [`dcr05_doc_type`](../../../db/tables/dcr.md), [`emp55_benefit_info`](../../../db/tables/emp.md), [`flt01_company_std`](../../../db/tables/flt.md), [`flt05_item_type`](../../../db/tables/flt.md), [`ics02_manager`](../../../db/tables/ics.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics33_compliance_answer`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`pay04_formula`](../../../db/tables/pay.md), [`pay06_act_mapping`](../../../db/tables/pay.md), [`pay30_basic_setup`](../../../db/tables/pay.md), [`pay51_expense_form`](../../../db/tables/pay.md), [`sys01_company`](../../../db/tables/sys.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys12_calendar`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md), [`sys15_corp`](../../../db/tables/sys.md), [`sys30_leave_year`](../../../db/tables/sys.md)

## DB 함수

`dcr01_import_from_admin`, `f_cdnm`, `f_create_seq`, `f_sysdate`, `f_today`, `to_decrypts`

## 저장 시 부수 효과 (UpdateDataModel)

`sys01_company`를 새로 INSERT하면 (UpdateDataModel.java L92-319) 이어서:

1. [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) → [`org01_code.insertOrg01Code`](../../org/sql/org01_code.md) (L106, [`org01_code`](../../../db/tables/org.md))
2. [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`) → [`org02_info.insertOrg02Info`](../../org/sql/org02_info.md) (L123, [`org02_info`](../../../db/tables/org.md))
3. [`sys09_code.insertFromSys09`](../../sys/sql/sys09_code.md) (L129, [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md))
4. `call dcr01_import_from_admin(?)` (L152, DB 프로시저 → [dcr01_import_from_admin](../../../db/functions/dcr01_import_from_admin.md))
5. [`ast02_detail.insertFromAst02`](../../ast/sql/ast02_detail.md) (L162, [`ast02_detail`](../../../db/tables/ast.md))
6. [`sys30_leave_year.insertFromSys30`](../../sys/sql/sys30_leave_year.md) (L167, [`sys30_leave_year`](../../../db/tables/sys.md))
7. [`pay04_formula.insertFromAdmin`](../../pay/sql/pay04_formula.md) (L173, [`pay04_formula`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md))
8. [`ics02_manager.insertFromIcs02`](../../ics/sql/ics02_manager.md) (L178, [`ics02_manager`](../../../db/tables/ics.md))
9. [`act01_account_code.insertFromAct01`](../../act/sql/act01_account_code.md) (L183, [`act01_account_code`](../../../db/tables/act.md))
10. [`ics30_compliance.insertFormIcs30`](../../ics/sql/ics30_compliance.md) (L193, [`ics30_compliance`](../../../db/tables/ics.md))
11. [`ics33_compliance_answer.insertFormIcs30`](../../ics/sql/ics33_compliance_answer.md) (L198, [`ics33_compliance_answer`](../../../db/tables/ics.md))
12. [`bbs12_application_form.insertFormBbs12`](../../bbs/sql/bbs12_application_form.md) (L203, [`bbs12_application_form`](../../../db/tables/bbs.md))
13. [`pay51_expense_form.insertFormPay51`](../../pay/sql/pay51_expense_form.md) (L208, [`pay51_expense_form`](../../../db/tables/pay.md))
14. [`com11_form_mapping_multi.insertFormCom11`](../../com/sql/com11_form_mapping_multi.md) (L213, [`com11_form_mapping_multi`](../../../db/tables/com.md))
15. [`pay06_act_mapping.insertFormPay06`](../../pay/sql/pay06_act_mapping.md) (L218, [`pay06_act_mapping`](../../../db/tables/pay.md))
16. [`pay04_formula.insertFormPay04`](../../pay/sql/pay04_formula.md) (L223, [`pay04_formula`](../../../db/tables/pay.md))
17. [`dcr05_doc_type.insertFormDcr05`](../../dcr/sql/dcr05_doc_type.md) (L228, [`dcr05_doc_type`](../../../db/tables/dcr.md))
18. [`sys15_corp.insertFormSys15`](../../sys/sql/sys15_corp.md) (L233, [`sys15_corp`](../../../db/tables/sys.md))
19. [`sys14_holiday.insertFormSys14`](../../sys/sql/sys14_holiday.md) (L238, [`sys14_holiday`](../../../db/tables/sys.md))
20. [`sys12_calendar.insertFormSys12`](../../sys/sql/sys12_calendar.md) (L243, [`sys12_calendar`](../../../db/tables/sys.md), [`sys14_holiday`](../../../db/tables/sys.md))
21. [`act10_repr_account.insertFormAct10`](../../act/sql/act10_repr_account.md) (L248, [`act10_repr_account`](../../../db/tables/act.md))
22. [`ast05_tr_code.insertFormAst05`](../../ast/sql/ast05_tr_code.md) (L253, [`ast05_tr_code`](../../../db/tables/ast.md))
23. [`ast15_tr_code_window.insertFormAst15`](../../ast/sql/ast15_tr_code_window.md) (L258, [`ast15_tr_code_window`](../../../db/tables/ast.md))
24. [`act11_tr_map.insertFormAct11`](../../act/sql/act11_tr_map.md) (L263, [`act11_tr_map`](../../../db/tables/act.md))
25. [`act12_journal_map.insertFormAct12`](../../act/sql/act12_journal_map.md) (L268, [`act12_journal_map`](../../../db/tables/act.md))
26. [`act13_real_account_map.insertFormAct13`](../../act/sql/act13_real_account_map.md) (L273, [`act13_real_account_map`](../../../db/tables/act.md))
27. [`chk02_daily_list.insertFromChk02`](../../chk/sql/chk02_daily_list.md) (L278, [`chk02_daily_list`](../../../db/tables/chk.md))
28. [`act09_account_num.insertFromAct09`](../../act/sql/act09_account_num.md) (L283, [`act09_account_num`](../../../db/tables/act.md))
29. [`pay30_basic_setup.insertFromPay30`](../../pay/sql/pay30_basic_setup.md) (L288, [`pay30_basic_setup`](../../../db/tables/pay.md))
30. [`flt01_company_std.insertFromFlt01`](../../flt/sql/flt01_company_std.md) (L293, [`flt01_company_std`](../../../db/tables/flt.md))
31. [`flt05_item_type.insertFromFlt05`](../../flt/sql/flt05_item_type.md) (L298, [`flt05_item_type`](../../../db/tables/flt.md))
32. [`biz90_limit.insertFromBiz90`](../../biz/sql/biz90_limit.md) (L303, [`biz90_limit`](../../../db/tables/biz.md))
33. [`emp55_benefit_info.insertFromEmp55`](../../emp/sql/emp55_benefit_info.md) (L308, [`emp55_benefit_info`](../../../db/tables/emp.md))

## UI

GXT 소스에서 정적으로 뽑은 화면 구성 (LLM 없음). 처리 로직은 메서드 줄 범위만 원본에서 읽는다.

### Sys30_Tab_LeaveYear (`client/vi/sys/Sys30_Tab_LeaveYear.java`, 133줄)

- 레이아웃: north=buttonBar, west=grid, center=gridLeaveYear
- 툴바 `buttonBar`: {retrieveButton} {updateButton} {addRowButton} {deleteRowButton}
- 입력·하위 화면: `monthComboBox` ComboBoxField("MonthsCode")
- 그리드 `grid` (buildGrid()):
  - leaveYn 100 "휴가초과<br>허용여부" Boolean
  - leaveMonthName 100 "휴가결산월" Text 편집:monthComboBox

#### 이벤트
[E0] 화면 열림 (생성자 L33-86) → retrieve()
[E1] retrieveButton[조회].Select (L34) → retrieve()
[E2] updateButton[저장].Select (L40) → update()
[E3] addRowButton[행 추가].Select (L46) → insertRow()
[E4] deleteRowButton[행 삭제].Select (L52) → deleteRow()
[E5] monthComboBox[MonthsCode].Collapse (L94) → 인라인 L94-101 (new CollapseHandler() { @Override pub…)

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L109-114 | 생성자,E1 | 서비스 sys.Sys01_Company.selectById(companyId) | 업무 |
| public update() | L117-121 | E2 | 서비스 sys.Sys01_Company.update | 업무 |
| public insertRow() | L124-126 | E3 | 상태 처리 | 업무 |
| public deleteRow() | L129-131 | E4 | 상태 처리 | 업무 |
| private buildGrid() | L88-106 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.boolean('leaveYn', 100, '휴가초과<br>허용여부'),  // L102
  gb.text('leaveMonthNm', 100, '휴가결산월', { editor: 'select' }),  // L103 SQL 계산 컬럼(selectById: f_cdnm('MonthsCode', sys01_leave_month_…)
];
```

#### 사용된 버튼들
1. <Button type="search" onClick={retrieve}>조회</Button>
2. <Button type="save" onClick={update}>저장</Button>
3. <Button type="addRow" onClick={insertRow}>행 추가</Button>
4. <Button type="removeRow" onClick={deleteRow}>행 삭제</Button>

### Sys30_Grid_LeaveYear (`client/vi/sys/Sys30_Grid_LeaveYear.java`, 75줄)

- 레이아웃: center=grid
- 그리드 `grid` (buildGrid(), 체크박스):
  - year 120 "근속연수" Text 편집:TextField
  - leaveDays 120 "연차개수" Text 편집:TextField

#### 이벤트
[E0] 화면 열림 (생성자 L27-32) → 초기화

#### 메서드
| 메서드 | 줄 | 호출처 | 하는 일 | 구분 |
| --- | --- | --- | --- | --- |
| public retrieve() | L46-50 | 공개 메서드 | 서비스 sys.Sys30_LeaveYear.selectByAll(companyId) | 업무 |
| public update() | L53-57 | 공개 메서드 | 서비스 sys.Sys30_LeaveYear.update | 업무 |
| public insertRow() | L60-65 | 공개 메서드 | 상태 처리 | 업무 |
| public deleteRow() | L68-72 | 공개 메서드 | GridDeleteData sys.Sys30_LeaveYear.delete(체크된 행 목록) | 업무 |
| private buildGrid() | L35-43 | 필드 초기화 | 그리드 컬럼 | UI구성 (그리드 절로 대체) |

#### Grid Spec
```javascript
const buildGrid = () => [
  gb.text('year', 120, '근속연수', { editor: 'text' }),  // L39
  gb.text('leaveDays', 120, '연차개수', { editor: 'text' }),  // L40
];
```

#### 사용된 버튼들
버튼 사용하지 않음

