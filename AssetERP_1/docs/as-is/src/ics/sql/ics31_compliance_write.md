# ics31_compliance_write

`server/ics/mapper/ics31_compliance_write.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `ics.Ics31_ComplianceWrite.selectById` |
| `selectByComplianceId` | select | 34 | [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `ics.Ics30_Compliance.checkDate`, `ics.Ics30_Compliance.deleteByDate`, `ics.Ics30_Compliance.updateList` |
| `selectByPersonId` | select | 40 | [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `ics.Ics31_ComplianceWrite.updateAnswerCode` |
| `selectByStartDate` | select | 50 | [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `ics.Ics31_ComplianceWrite.selectByStartDate` |
| `selectNonComplianceReason` | select | 57 | [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `sys.Sys99_Print.insertComplianceState` |
| `selectWrite` | select | 67 | [`ics30_compliance`](../../../db/tables/ics.md), [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `ics.Ics31_ComplianceWrite.deleteByPersonId` |
| `checkWriteByPersonId` | select | 81 | [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `sys.Sys99_Print.insertComplianceState` |
| `updateAnswerCode` | update | 90 | [`ics31_compliance_write`](../../../db/tables/ics.md) |  | `ics.Ics31_ComplianceWrite.updateAnswerCode` |
| `updateFixYn` | update | 97 | [`ics31_compliance_write`](../../../db/tables/ics.md) | `f_sysdate` | `ics.Ics31_ComplianceWrite.updateFixYn` |
| `updateConfirmYn` | update | 111 | [`ics31_compliance_write`](../../../db/tables/ics.md) | `f_sysdate` | `ics.Ics31_ComplianceWrite.updateConfirmYn` |
