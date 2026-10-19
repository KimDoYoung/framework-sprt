# bmt.Bmt12_PcHistory

`server/bmt/Bmt12_PcHistory.java`

서비스 키 `bmt.Bmt12_PcHistory.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`bmt12_pc_history.selectById`](../../bmt/sql/bmt12_pc_history.md) | - |  |
| `selectByCompanyId` | 25 | [`bmt12_pc_history.selectByCompanyId`](../../bmt/sql/bmt12_pc_history.md) | `Bmt12_Tab_PcList` |  |
| `selectByInfoId` | 35 | [`bmt12_pc_history.selectByInfoId`](../../bmt/sql/bmt12_pc_history.md) | `Bmt10_Lookup_History`, `Bmt12_Lookup_History` |  |
| `selectEmpICT` | 43 | [`bmt12_pc_history.selectEmpICT`](../../bmt/sql/bmt12_pc_history.md) | `Bmt12_Tab_EmpIct` |  |
| `modelUpdate` | 48 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bmt12_pc_history)` 동적 INSERT/UPDATE | `Bmt12_Edit_PcHistory` | `UpdateDataModel` |
| `modelDelete` | 62 | `UpdateDataModel(bmt12_pc_history)` 동적 DELETE | - | `UpdateDataModel` |
| `deleteByInfoId` | 71 | [`bmt12_pc_history.deleteByInfoId`](../../bmt/sql/bmt12_pc_history.md) | `Bmt12_Tab_PcList` |  |
| `update` | 76 | `UpdateDataModel(bmt12_pc_history)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 81 | `UpdateDataModel(bmt12_pc_history)` 동적 DELETE | `Bmt10_Lookup_History`, `Bmt12_Lookup_History` | `UpdateDataModel` |
