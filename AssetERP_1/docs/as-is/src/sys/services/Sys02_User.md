# sys.Sys02_User

`server/sys/Sys02_User.java`

서비스 키 `sys.Sys02_User.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `checkUserName` | 31 | - | `LoginPage` |  |
| `getLoginInfo` | 43 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp00_trans_info.checkRetire`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByComplianceCheck`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByLoginId`](../../emp/sql/emp00_trans_info.md), [`org00_org_info.selectByParentId`](../../org/sql/org00_org_info.md), [`sys02_user.selectByLoginId`](../../sys/sql/sys02_user.md), [`sys05_user_role.selectByUserId`](../../sys/sql/sys05_user_role.md), [`sys25_password.selectByPersonId`](../../sys/sql/sys25_password.md), [`sys26_login.insertSeq`](../../sys/sql/sys26_login.md) | `LoginPage` |  |
| `getMobiLoginInfo` | 160 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp00_trans_info.checkRetire`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByComplianceCheck`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByLoginId`](../../emp/sql/emp00_trans_info.md), [`org00_org_info.selectByParentId`](../../org/sql/org00_org_info.md), [`sys02_user.selectByLoginId`](../../sys/sql/sys02_user.md), [`sys05_user_role.selectByUserId`](../../sys/sql/sys05_user_role.md), [`sys25_password.selectByPersonId`](../../sys/sql/sys25_password.md), [`sys26_login.insertSeq`](../../sys/sql/sys26_login.md) | - |  |
| `getChangeInfo` | 275 | [`emp00_trans_info.selectByComplianceCheck`](../../emp/sql/emp00_trans_info.md), [`emp00_trans_info.selectByPersonId`](../../emp/sql/emp00_trans_info.md) | `Emp04_Lookup_AddTitleList` |  |
| `userLock` | 333 | [`emp01_person.selectByCompanyCode`](../../emp/sql/emp01_person.md), [`emp01_person.updateLockYn`](../../emp/sql/emp01_person.md) | `LoginPage` |  |
| `selectByAll` | 343 | `sys02_user.selectByAll`(없음) | - |  |
| `selectByUserName` | 348 | `sys02_user.selectByUserName`(없음) | - |  |
| `selectByCompanyId` | 365 | [`sys02_user.selectByCompanyId`](../../sys/sql/sys02_user.md) | - |  |
| `selectByName` | 371 | [`sys02_user.selectByName`](../../sys/sql/sys02_user.md) | `Sys02_Tab_User` |  |
| `update` | 394 | [`sys02_user.encryptsPasswd`](../../sys/sql/sys02_user.md), `UpdateDataModel(sys02_user)` 동적 INSERT/UPDATE | `Sys02_Tab_User`, `TabPage_User` | `UpdateDataModel` |
| `delete` | 412 | `UpdateDataModel(sys02_user)` 동적 DELETE | `Sys02_Tab_User`, `TabPage_User` | `UpdateDataModel` |
