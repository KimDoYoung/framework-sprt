# ics30_compliance

`server/ics/mapper/ics30_compliance.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 37 | [`ics30_compliance`](../../../db/tables/ics.md) | `f_cdnm`, `f_sysdate` | `ics.Ics30_Compliance.selectById` |
| `selectByPersonId` | select | 44 | [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics30_Compliance.selectByPersonId`, `sys.Sys99_Print.insertRdComplianceWrite` |
| `selectByCompanyIdSql` | sql | 78 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) |  |  |
| `selectByCompanyId` | select | 124 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_code_seq`, `f_sysdate` | `ics.Ics30_Compliance.selectByCompanyId` |
| `selectByCompanyIdPaging` | select | 153 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) | `f_cdnm`, `f_code_seq`, `f_sysdate` | `ics.Ics30_Compliance.selectByPaging` |
| `selectByCompanyIdTotal` | select | 184 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md) |  | `ics.Ics30_Compliance.selectByPaging` |
| `selectByStartDate` | select | 189 | [`ics30_compliance`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `ics.Ics30_Compliance.checkDate`, `ics.Ics30_Compliance.deleteByDate`, `ics.Ics30_Compliance.selectByStartDate` |
| `selectByMaxCompanyId` | select | 201 | [`ics30_compliance`](../../../db/tables/ics.md) | `f_cdnm`, `f_sysdate`, `f_today` | `ics.Ics30_Compliance.insert` |
| `selectComplianceResultByPersonId` | select | 214 | [`ics30_compliance`](../../../db/tables/ics.md), [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) | `f_get_compliance_result` | `sys.Sys99_Print.insertComplianceState` |
| `createComplianceStateList` | select | 236 | - | `f_create_compliancestatelist` | `sys.Sys99_Print.selectComplianceState` |
| `groupByStartDate` | select | 240 | [`ics30_compliance`](../../../db/tables/ics.md) |  | `ics.Ics30_Compliance.groupByStartDate` |
| `updateDateFixYn` | update | 250 | [`ics30_compliance`](../../../db/tables/ics.md) |  | `ics.Ics30_Compliance.updateDateFixYn` |
| `insert` | insert | 257 | [`ics30_compliance`](../../../db/tables/ics.md) |  | `ics.Ics30_Compliance.insert` |
| `insertFormIcs30` | insert | 286 | [`ics30_compliance`](../../../db/tables/ics.md) | `f_create_seq` | - |
| `deleteByDate` | delete | 304 | [`ics30_compliance`](../../../db/tables/ics.md) |  | `ics.Ics30_Compliance.deleteByDate` |
