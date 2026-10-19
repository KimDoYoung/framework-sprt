# sys09_code

`server/sys/mapper/sys09_code.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectByAll` | select | 21 | [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByAll` |
| `selectById` | select | 27 | [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.checkCode` |
| `selectByCompanyId` | select | 33 | [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.insert`, `sys.Sys09_Code.selectByCompanyId` |
| `selectEvalGrade` | select | 41 | [`emp42_eval_grade`](../../../db/tables/emp.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectEvalGrade` |
| `selectByStringComboBox` | select | 52 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByStringComboBox` |
| `selectByCodeKindId` | select | 65 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm11_task_relate_rule`](../../../db/tables/tdm.md) |  | `sys.Sys09_Code.selectByApplyDate`, `sys.Sys09_Code.selectByCodeKindId` |
| `selectByCodeKind` | select | 99 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_trunc` | `sys.Sys09_Code.selectByCodeKind` |
| `selectByKindGroupCode` | select | 127 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) | `f_trunc` | `sys.Sys00_Common.selectByKindGroupCode`, `sys.Sys09_Code.selectByKindGroupCode` |
| `selectByApplyDate` | select | 158 | [`sys09_code`](../../../db/tables/sys.md) |  | - |
| `selectByCode` | select | 172 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByCode` |
| `selectByCodeName` | select | 197 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `emp.Emp00_TransInfo.update`, `pay.Pay04_Formula_20230620.insert` |
| `selectByCode2` | select | 208 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_trunc` | - |
| `selectByCode3` | select | 237 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_trunc` | `sys.Sys09_Code.selectByCode3` |
| `selectByName` | select | 266 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | - |
| `selectByKindCode` | select | 282 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectByKindCode`, `sys.Sys09_Code.selectByKindCode` |
| `linkCheck` | select | 293 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `dcr.Dcr30_Link.insertCheck`, `dcr.Dcr30_Link.linkCheck` |
| `selectByChecklistCode` | select | 301 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByChecklistCode` |
| `selectByIcs21` | select | 311 | [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByIcs21` |
| `selectScheduleClass` | select | 322 | [`sch08_class`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectScheduleClass` |
| `selectScheduleClass2` | select | 333 | [`sch08_class`](../../../db/tables/sch.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectScheduleClass2` |
| `selectWeekBizClass` | select | 351 | [`rpt05_week_biz_class`](../../../db/tables/rpt.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectWeekBizClass` |
| `selectIcs41DcrType` | select | 366 | [`ics41_dcr_type`](../../../db/tables/ics.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys00_Common.selectIcs41DcrType` |
| `selectByIcs23` | select | 378 | [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByIcs23` |
| `selectByDcr01` | select | 397 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr03_org_auth`](../../../db/tables/dcr.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByDcrLv1`, `sys.Sys09_Code.selectByDcrLv2`, `sys.Sys09_Code.selectByDcrLv3` |
| `selectByDcrDetail` | select | 452 | [`dcr01_class_tree`](../../../db/tables/dcr.md), [`dcr07_class_detail`](../../../db/tables/dcr.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.selectByDcrDetail` |
| `selectByApplicationForm` | select | 465 | [`bbs12_application_form`](../../../db/tables/bbs.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `bbs.Bbs12_ApplicationForm.formCheck` |
| `selectByExpenseForm` | select | 477 | [`pay51_expense_form`](../../../db/tables/pay.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `pay.Pay51_ExpenseForm.formCheck` |
| `checkByCode` | select | 489 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.checkCode` |
| `codeInsert` | insert | 499 | [`sys09_code`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys09_Code.codeInsert` |
| `insert` | insert | 508 | [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.insert` |
| `delete` | delete | 540 | [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.insert` |
| `insertFromSys09` | insert | 547 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_create_seq` | - |
