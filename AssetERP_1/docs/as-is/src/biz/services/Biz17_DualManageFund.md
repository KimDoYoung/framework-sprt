# biz.Biz17_DualManageFund

`server/biz/Biz17_DualManageFund.java`

서비스 키 `biz.Biz17_DualManageFund.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`biz17_dual_manage_fund.selectById`](../../biz/sql/biz17_dual_manage_fund.md) | - |  |
| `selectByContCorpId` | 25 | [`biz17_dual_manage_fund.selectByContCorpId`](../../biz/sql/biz17_dual_manage_fund.md) | `Biz17_TabPage_DualManageFund` |  |
| `update` | 34 | `UpdateDataModel(biz17_dual_manage_fund)` 동적 INSERT/UPDATE | `Biz17_TabPage_DualManageFund` | `UpdateDataModel` |
| `delete` | 39 | `UpdateDataModel(biz17_dual_manage_fund)` 동적 DELETE | `Biz17_TabPage_DualManageFund` | `UpdateDataModel` |
