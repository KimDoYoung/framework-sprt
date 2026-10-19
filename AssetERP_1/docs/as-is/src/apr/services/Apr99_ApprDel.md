# apr.Apr99_ApprDel

`server/apr/Apr99_ApprDel.java`

서비스 키 `apr.Apr99_ApprDel.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`apr99_appr_del.selectById`](../../apr/sql/apr99_appr_del.md) | - |  |
| `selectByCompanyId` | 27 | [`apr99_appr_del.selectByCompanyId`](../../apr/sql/apr99_appr_del.md) | `Apr01_Tab_Restore` |  |
| `restore` | 43 | [`apr90_disposal_list.deleteByApprId`](../../apr/sql/apr90_disposal_list.md), [`apr91_disposal_history.insert`](../../apr/sql/apr91_disposal_history.md), [`apr99_appr_del.deleteApprId`](../../apr/sql/apr99_appr_del.md), [`apr99_appr_del.restore`](../../apr/sql/apr99_appr_del.md) | `Apr01_Tab_Restore` |  |
