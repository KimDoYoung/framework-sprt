# tdm.Tdm30_RoleAllc

`server/tdm/Tdm30_RoleAllc.java`

서비스 키 `tdm.Tdm30_RoleAllc.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 25 | [`tdm30_role_allc.selectById`](../../tdm/sql/tdm30_role_allc.md) | `Tdm34_TabPage_RoleAllcDetail`, `Tdm34_TabPage_RoleAllcDetail_20260406` |  |
| `selectByText` | 30 | [`tdm30_role_allc.selectByText`](../../tdm/sql/tdm30_role_allc.md) | `Tdm30_Tab_RoleAllc` |  |
| `selectByPersonId` | 35 | [`tdm30_role_allc.selectByPersonId`](../../tdm/sql/tdm30_role_allc.md) | `Apr01_Edit_ApprDoc` |  |
| `selectByAllcStdDate` | 45 | [`tdm30_role_allc.selectByAllcStdDate`](../../tdm/sql/tdm30_role_allc.md) | `Apr01_Edit_ApprDoc` |  |
| `selectPerson` | 54 | [`tdm30_role_allc.selectPerson`](../../tdm/sql/tdm30_role_allc.md) | `Tdm30_Lookup_SelectMulti` |  |
| `selectByExctId` | 59 | [`tdm30_role_allc.selectByExctId`](../../tdm/sql/tdm30_role_allc.md) | `Tdm50_Tab_DashboardExct` |  |
| `notInRoleAllcIdList` | 64 | [`tdm30_role_allc.notInRoleAllcIdList`](../../tdm/sql/tdm30_role_allc.md) | `Tdm30_Edit_RoleAllc`, `Tdm30_Edit_RoleAllcModify`, `Tdm30_Lookup_UpdateEndDate`, `Tdm30_Tab_RoleAllc` |  |
| `insertAppr` | 77 | [`apr01_appr.insertApproval`](../../apr/sql/apr01_appr.md), [`apr04_appr_step.insertApproval`](../../apr/sql/apr04_appr_step.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`tdm12_task_relate_detail.getHtmlData`](../../tdm/sql/tdm12_task_relate_detail.md), [`tdm30_role_allc.updateApprId`](../../tdm/sql/tdm30_role_allc.md) | - |  |
| `updateEndDate` | 150 | [`tdm30_role_allc.updateEndDate`](../../tdm/sql/tdm30_role_allc.md) | - |  |
| `updateEndDate2` | 168 | [`tdm30_role_allc.updateEndDate`](../../tdm/sql/tdm30_role_allc.md) | `Tdm30_Lookup_UpdateEndDate` |  |
| `modelUpdate` | 182 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm30_role_allc)` 동적 INSERT/UPDATE | `Tdm30_Edit_RoleAllc`, `Tdm30_Edit_RoleAllcModify` | `UpdateDataModel` |
| `update` | 196 | `UpdateDataModel(tdm30_role_allc)` 동적 INSERT/UPDATE | `Tdm30_Tab_RoleAllc` | `UpdateDataModel` |
| `delete` | 208 | [`tdm34_role_allc_detail.deleteByRoleAllcId`](../../tdm/sql/tdm34_role_allc_detail.md), `UpdateDataModel(tdm30_role_allc)` 동적 DELETE | `Tdm30_Tab_RoleAllc` | `UpdateDataModel` |
