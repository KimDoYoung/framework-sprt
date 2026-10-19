# emp.Emp17_Benefit

`server/emp/Emp17_Benefit.java`

서비스 키 `emp.Emp17_Benefit.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`emp17_benefit.selectById`](../../emp/sql/emp17_benefit.md) | - |  |
| `selectByCompanyId` | 29 | [`emp17_benefit.selectByCompanyId`](../../emp/sql/emp17_benefit.md) | - |  |
| `selectByText` | 42 | [`emp17_benefit.selectByText`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `selectByBenefitCode` | 56 | [`emp17_benefit.selectByBenefitCode`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `selectByPersonId` | 70 | [`emp17_benefit.selectByPersonId`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_Benefit` |  |
| `selectByYyyymm` | 84 | [`emp17_benefit.selectByYyyymm`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `selectApprId` | 100 | [`emp17_benefit.selectByYyyymm`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `payRequestApprCheck` | 112 | [`emp17_benefit.selectByYyyymm`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `deleteApprId` | 146 | [`apr01_appr.deleteAppr`](../../apr/sql/apr01_appr.md), [`apr01_appr.insertApprDel`](../../apr/sql/apr01_appr.md), [`emp17_benefit.deleteApprId`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `sendMessage` | 163 | [`emp01_person.selectByPersonId`](../../emp/sql/emp01_person.md) | `Emp17_Edit_Note` | `SendSMSAPIFunction` |
| `modelUpdate` | 180 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(emp17_benefit)` 동적 INSERT/UPDATE | `Emp17_Edit_Note`, `Emp17_Lookup_Benefit` | `UpdateDataModel` |
| `updateApprId` | 193 | [`emp17_benefit.updateApprId`](../../emp/sql/emp17_benefit.md) | `Emp17_Lookup_Benefit` |  |
| `updatePayRequestApprId` | 202 | [`emp17_benefit.updateModel`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `updatePayRequestYm` | 215 | [`emp17_benefit.updateModel`](../../emp/sql/emp17_benefit.md) | `Emp17_Tab_BenefitManager` |  |
| `deleteBenefitId` | 228 | [`emp17_benefit.deleteBenefitId`](../../emp/sql/emp17_benefit.md) | `Emp17_Lookup_Benefit` |  |
| `update` | 237 | `UpdateDataModel(emp17_benefit)` 동적 INSERT/UPDATE | `Emp17_Tab_BenefitManager` | `UpdateDataModel` |
| `delete` | 242 | `UpdateDataModel(emp17_benefit)` 동적 DELETE | `Emp17_Tab_Benefit` | `UpdateDataModel` |
