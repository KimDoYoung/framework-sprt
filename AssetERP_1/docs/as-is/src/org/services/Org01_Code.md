# org.Org01_Code

`server/org/Org01_Code.java`

서비스 키 `org.Org01_Code.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByKorName` | 34 | [`org01_code.selectByKorName`](../../org/sql/org01_code.md) | `Fnd08_Lookup_OrgCode` |  |
| `selectByCompanyId` | 64 | [`org01_code.selectByParentId_1Bang`](../../org/sql/org01_code.md) | `Apr10_Move_OrgCode`, `Dcr03_Tab_OrgAuth`, `Org01_Move_OrgCode`, `Org01_Tab_OrgCode`, `Org01_Tree_OrgCode` | `TreeUtil` |
| `update` | 106 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`org01_code.selectByBaseDate`](../../org/sql/org01_code.md), [`org02_info.selectById`](../../org/sql/org02_info.md), `UpdateDataModel(org02_info)` 동적 INSERT/UPDATE, `UpdateDataModel(org01_code)` 동적 INSERT/UPDATE | `Org01_Edit_OrgCode`, `Org02_Edit_Info` | `UpdateDataModel` |
| `delete` | 169 | [`org01_code.selectByBaseDate`](../../org/sql/org01_code.md), [`org02_info.selectCountByCodeId`](../../org/sql/org02_info.md), `UpdateDataModel(org02_info)` 동적 DELETE, `UpdateDataModel(org01_code)` 동적 DELETE | `Org01_Edit_OrgCode`, `Org02_Edit_Info` | `UpdateDataModel` |
| `selectByFundCodeId` | 221 | [`org01_code.selectByFundCodeId`](../../org/sql/org01_code.md) | `Fnd08_Page_OrgAuth` |  |
| `selectByAccountId` | 244 | [`org01_code.selectByAccountId`](../../org/sql/org01_code.md) | `Adv05_Page_OrgAuth` |  |
| `selectByDcrCodeId` | 264 | [`org01_code.selectByDcrCodeId`](../../org/sql/org01_code.md) | `Dcr03_TabPage_DcrAuth` |  |
| `selectByOrgCodeId` | 285 | [`org01_code.selectByFundCodeId`](../../org/sql/org01_code.md), [`org01_code.selectByOrgCodeId`](../../org/sql/org01_code.md) | - |  |
| `selectByDcrTreeId` | 309 | `org01_code.selectByDcrTreeId`(없음) | - |  |
| `updateFundAuth` | 376 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(fnd08_org_auth)` 동적 INSERT/UPDATE | `Fnd08_Page_OrgAuth` | `UpdateDataModel` |
| `updateAccountAuth` | 409 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(adv05_org_auth)` 동적 INSERT/UPDATE | `Adv05_Page_OrgAuth` | `UpdateDataModel` |
| `updateDcrAuth` | 443 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr01_class_tree.selectByClasssTreeId`](../../dcr/sql/dcr01_class_tree.md), [`dcr03_org_auth.deleteByOrgAuthId`](../../dcr/sql/dcr03_org_auth.md), [`dcr03_org_auth.selectByDcrOrgId`](../../dcr/sql/dcr03_org_auth.md), [`dcr30_link.selectByClassTreeId`](../../dcr/sql/dcr30_link.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(dcr03_org_auth)` 동적 INSERT/UPDATE | `Dcr03_TabPage_DcrAuth` | `UpdateDataModel` |
| `copyDcrRight` | 523 | [`dcr01_class_tree.selectByOrgCodeId_1Bang`](../../dcr/sql/dcr01_class_tree.md), [`dcr03_org_auth.inUpdateRight`](../../dcr/sql/dcr03_org_auth.md) | `Dcr03_Tab_OrgAuth` |  |
