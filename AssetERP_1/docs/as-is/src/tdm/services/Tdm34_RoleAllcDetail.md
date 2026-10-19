# tdm.Tdm34_RoleAllcDetail

`server/tdm/Tdm34_RoleAllcDetail.java`

서비스 키 `tdm.Tdm34_RoleAllcDetail.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm34_role_allc_detail.selectById`](../../tdm/sql/tdm34_role_allc_detail.md) | - |  |
| `selectByRoleAllcId` | 25 | [`tdm34_role_allc_detail.selectByRoleAllcId`](../../tdm/sql/tdm34_role_allc_detail.md) | `Tdm34_TabPage_RoleAllcDetail`, `Tdm34_TabPage_RoleAllcDetail_20260406` |  |
| `notInRoleAllcDetailIdList` | 33 | [`tdm34_role_allc_detail.notInRoleAllcDetailIdList`](../../tdm/sql/tdm34_role_allc_detail.md) | - |  |
| `updateApprId` | 45 | [`tdm34_role_allc_detail.updateApprId`](../../tdm/sql/tdm34_role_allc_detail.md), [`tdm35_role_allc_task.deleteByRoleAllcDetailId`](../../tdm/sql/tdm35_role_allc_task.md), [`tdm35_role_allc_task.insertByRoleAllcDetailId`](../../tdm/sql/tdm35_role_allc_task.md) | `Tdm34_TabPage_RoleAllcDetail`, `Tdm34_TabPage_RoleAllcDetail_20260406` |  |
| `modelUpdate` | 62 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm34_role_allc_detail)` 동적 INSERT/UPDATE | `Tdm30_Edit_RoleAllc` | `UpdateDataModel` |
| `update` | 75 | `UpdateDataModel(tdm34_role_allc_detail)` 동적 INSERT/UPDATE | `Tdm34_TabPage_RoleAllcDetail`, `Tdm34_TabPage_RoleAllcDetail_20260406` | `UpdateDataModel` |
| `delete` | 80 | `UpdateDataModel(tdm34_role_allc_detail)` 동적 DELETE | `Tdm34_TabPage_RoleAllcDetail`, `Tdm34_TabPage_RoleAllcDetail_20260406` | `UpdateDataModel` |
