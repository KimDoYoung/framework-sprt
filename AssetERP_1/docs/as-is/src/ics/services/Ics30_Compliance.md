# ics.Ics30_Compliance

`server/ics/Ics30_Compliance.java`

서비스 키 `ics.Ics30_Compliance.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`ics30_compliance.selectById`](../../ics/sql/ics30_compliance.md) | - |  |
| `selectByPersonId` | 27 | [`ics30_compliance.selectByPersonId`](../../ics/sql/ics30_compliance.md) | `Ics31_Tab_ComplianceWrite` |  |
| `selectByCompanyId` | 41 | [`ics30_compliance.selectByCompanyId`](../../ics/sql/ics30_compliance.md) | - |  |
| `selectByPaging` | 54 | [`ics30_compliance.selectByCompanyIdPaging`](../../ics/sql/ics30_compliance.md), [`ics30_compliance.selectByCompanyIdTotal`](../../ics/sql/ics30_compliance.md) | `Ics31_Tab_ComplianceConfirm` |  |
| `selectByStartDate` | 60 | [`ics30_compliance.selectByStartDate`](../../ics/sql/ics30_compliance.md) | `Ics30_Tab_Compliance` |  |
| `selectComplianceStatusPaging` | 72 | `ics30_compliance.selectChecklistStatusPaging`(없음), `ics30_compliance.selectChecklistStatusPagingTotal`(없음) | - |  |
| `groupByStartDate` | 87 | [`ics30_compliance.groupByStartDate`](../../ics/sql/ics30_compliance.md) | `Ics30_Tab_Compliance` |  |
| `updateDateFixYn` | 93 | [`ics30_compliance.updateDateFixYn`](../../ics/sql/ics30_compliance.md) | `Ics30_Tab_Compliance` |  |
| `insert` | 107 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics30_compliance.insert`](../../ics/sql/ics30_compliance.md), [`ics30_compliance.selectByMaxCompanyId`](../../ics/sql/ics30_compliance.md), [`ics33_compliance_answer.insert`](../../ics/sql/ics33_compliance_answer.md) | `Ics30_Lookup_Insert` |  |
| `checkDate` | 148 | [`ics30_compliance.selectByStartDate`](../../ics/sql/ics30_compliance.md), [`ics31_compliance_write.selectByComplianceId`](../../ics/sql/ics31_compliance_write.md) | `Ics30_Tab_Compliance` |  |
| `deleteByDate` | 174 | [`ics30_compliance.deleteByDate`](../../ics/sql/ics30_compliance.md), [`ics30_compliance.selectByStartDate`](../../ics/sql/ics30_compliance.md), [`ics31_compliance_write.selectByComplianceId`](../../ics/sql/ics31_compliance_write.md), [`ics33_compliance_answer.deleteByDate`](../../ics/sql/ics33_compliance_answer.md) | `Ics30_Tab_Compliance` |  |
| `updateList` | 203 | [`ics31_compliance_write.selectByComplianceId`](../../ics/sql/ics31_compliance_write.md), `UpdateDataModel(ics30_compliance)` 동적 INSERT/UPDATE, `UpdateDataModel(ics30_compliance)` 동적 DELETE | `Ics30_Tab_Compliance` | `UpdateDataModel` |
| `update` | 264 | `UpdateDataModel(ics30_compliance)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 269 | `UpdateDataModel(ics30_compliance)` 동적 DELETE | - | `UpdateDataModel` |
