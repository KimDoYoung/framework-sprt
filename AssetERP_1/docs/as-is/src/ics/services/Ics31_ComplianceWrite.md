# ics.Ics31_ComplianceWrite

`server/ics/Ics31_ComplianceWrite.java`

서비스 키 `ics.Ics31_ComplianceWrite.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`ics31_compliance_write.selectById`](../../ics/sql/ics31_compliance_write.md) | `Ics31_Tab_ComplianceWrite` |  |
| `selectByStartDate` | 28 | [`ics31_compliance_write.selectByStartDate`](../../ics/sql/ics31_compliance_write.md) | `Ics30_Tab_Compliance` |  |
| `updateAnswerCode` | 45 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`ics31_compliance_write.selectByPersonId`](../../ics/sql/ics31_compliance_write.md), [`ics31_compliance_write.updateAnswerCode`](../../ics/sql/ics31_compliance_write.md), `UpdateDataModel(ics31_compliance_write)` 동적 INSERT/UPDATE | `Ics31_Tab_ComplianceWrite` | `UpdateDataModel` |
| `updateFixYn` | 95 | [`ics31_compliance_write.updateFixYn`](../../ics/sql/ics31_compliance_write.md) | `Ics31_Tab_ComplianceWrite` |  |
| `updateConfirmYn` | 112 | [`ics31_compliance_write.updateConfirmYn`](../../ics/sql/ics31_compliance_write.md) | `Ics31_Tab_ComplianceConfirm` |  |
| `modelUpdate` | 133 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics31_compliance_write)` 동적 INSERT/UPDATE | `Ics31_Edit_Reason`, `Ics31_Tab_ComplianceWrite` | `UpdateDataModel` |
| `deleteByPersonId` | 146 | [`ics31_compliance_write.selectWrite`](../../ics/sql/ics31_compliance_write.md), `UpdateDataModel(ics31_compliance_write)` 동적 DELETE | `Ics31_Tab_ComplianceWrite` | `UpdateDataModel` |
| `update` | 164 | `UpdateDataModel(ics31_compliance_write)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 169 | `UpdateDataModel(ics31_compliance_write)` 동적 DELETE | - | `UpdateDataModel` |
