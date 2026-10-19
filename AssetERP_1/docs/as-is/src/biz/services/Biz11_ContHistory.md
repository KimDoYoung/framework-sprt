# biz.Biz11_ContHistory

`server/biz/Biz11_ContHistory.java`

서비스 키 `biz.Biz11_ContHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`biz11_cont_history.selectById`](../../biz/sql/biz11_cont_history.md) | - |  |
| `selectByContCorpId` | 25 | [`biz11_cont_history.selectByContCorpId`](../../biz/sql/biz11_cont_history.md) | `Biz11_TabPage_ContHistory` |  |
| `deleteCheck` | 35 | [`biz11_cont_history.deleteCheck`](../../biz/sql/biz11_cont_history.md) | `Biz11_TabPage_ContHistory` |  |
| `deleteContCorpId` | 51 | [`biz11_cont_history.deleteContCorpId`](../../biz/sql/biz11_cont_history.md), [`biz12_fee_info.deleteContCorpId`](../../biz/sql/biz12_fee_info.md), [`biz13_with_corp.deleteContCorpId`](../../biz/sql/biz13_with_corp.md), [`biz14_relate_appr.deleteContCorpId`](../../biz/sql/biz14_relate_appr.md), [`biz15_share.deleteContCorpId`](../../biz/sql/biz15_share.md) | `Biz10_Tab_ContCorp` |  |
| `modelUpdate` | 63 | `UpdateDataModel(biz11_cont_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 72 | `UpdateDataModel(biz11_cont_history)` 동적 INSERT/UPDATE | `Biz11_TabPage_ContHistory` | `UpdateDataModel` |
| `delete` | 77 | `UpdateDataModel(biz11_cont_history)` 동적 DELETE | `Biz11_TabPage_ContHistory` | `UpdateDataModel` |
