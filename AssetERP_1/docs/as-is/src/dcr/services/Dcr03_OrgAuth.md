# dcr.Dcr03_OrgAuth

`server/dcr/Dcr03_OrgAuth.java`

서비스 키 `dcr.Dcr03_OrgAuth.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByOrgCodeId` | 27 | [`dcr01_class_tree.selectByOrgCodeId_1Bang`](../../dcr/sql/dcr01_class_tree.md) | `Dcr03_TabPage_OrgAuth` | `TreeUtil` |
| `selectByDcrOrgId` | 61 | [`dcr03_org_auth.selectByDcrOrgId`](../../dcr/sql/dcr03_org_auth.md) | `Dcr30_Move_DcrClass` |  |
| `update` | 99 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr03_org_auth.selectByDcrOrgId`](../../dcr/sql/dcr03_org_auth.md), [`dcr30_link.selectByClassTreeId`](../../dcr/sql/dcr30_link.md), [`sys01_company.selectById`](../../sys/sql/sys01_company.md), `UpdateDataModel(dcr03_org_auth)` 동적 INSERT/UPDATE | `Dcr03_TabPage_OrgAuth` | `UpdateDataModel` |
| `delete` | 150 | - | - |  |
