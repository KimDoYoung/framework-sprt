# ics33_compliance_answer

`server/ics/mapper/ics33_compliance_answer.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`ics33_compliance_answer`](../../../db/tables/ics.md) | `f_cdnm`, `f_sysdate` | `ics.Ics33_ComplianceAnswer.selectById` |
| `selectByCompanyId` | select | 36 | [`ics33_compliance_answer`](../../../db/tables/ics.md) | `f_cdnm`, `f_sysdate` | `ics.Ics33_ComplianceAnswer.selectByCompanyId` |
| `insert` | insert | 50 | [`ics33_compliance_answer`](../../../db/tables/ics.md) | `f_create_seq` | `ics.Ics30_Compliance.insert` |
| `insertFormIcs30` | insert | 84 | [`ics33_compliance_answer`](../../../db/tables/ics.md) | `f_create_seq` | - |
| `deleteByDate` | delete | 100 | [`ics33_compliance_answer`](../../../db/tables/ics.md) |  | `ics.Ics30_Compliance.deleteByDate` |
