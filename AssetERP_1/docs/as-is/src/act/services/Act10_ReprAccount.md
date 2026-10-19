# act.Act10_ReprAccount

`server/act/Act10_ReprAccount.java`

서비스 키 `act.Act10_ReprAccount.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`act10_repr_account.selectById`](../../act/sql/act10_repr_account.md) | - |  |
| `selectByCompanyId` | 25 | [`act10_repr_account.selectByCompanyId`](../../act/sql/act10_repr_account.md) | `Act10_Lookup_ReprAccount`, `Act10_Tab_ReprAccount`, `Act11_Grid_TrJournalMap`, `Act11_Tab_TrJournalMap`, `Act13_Tab_RealAccountMap` |  |
| `insertInitData` | 31 | [`act10_repr_account.deleteByReprAccountCode`](../../act/sql/act10_repr_account.md), [`act10_repr_account.insertInitData`](../../act/sql/act10_repr_account.md) | `Act10_Tab_ReprAccount` |  |
| `update` | 48 | `UpdateDataModel(act10_repr_account)` 동적 INSERT/UPDATE | `Act10_Tab_ReprAccount` | `UpdateDataModel` |
| `delete` | 53 | `UpdateDataModel(act10_repr_account)` 동적 DELETE | `Act10_Tab_ReprAccount` | `UpdateDataModel` |
