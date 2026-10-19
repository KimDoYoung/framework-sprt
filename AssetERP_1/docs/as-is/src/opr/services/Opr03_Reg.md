# opr.Opr03_Reg

`server/opr/Opr03_Reg.java`

서비스 키 `opr.Opr03_Reg.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByCreateId` | 23 | [`opr03_reg.selectByCreateId`](../../opr/sql/opr03_reg.md) | `Opr03_Tabpage_Reg`, `Opr03_Tabpage_Reg_Manager` |  |
| `selectOnePreRegCheck` | 42 | [`opr03_reg.selectOnePreRegCheck`](../../opr/sql/opr03_reg.md) | - |  |
| `selectOnePreCancelCheck` | 69 | [`opr03_reg.selectOnePreCancelCheck`](../../opr/sql/opr03_reg.md) | `Opr03_Tabpage_Reg` |  |
| `update` | 90 | `UpdateDataModel(opr03_reg)` 동적 INSERT/UPDATE | `Opr03_Tabpage_Reg`, `Opr03_Tabpage_Reg_Manager` | `UpdateDataModel` |
| `delete` | 95 | `UpdateDataModel(opr03_reg)` 동적 DELETE | `Opr03_Tabpage_Reg`, `Opr03_Tabpage_Reg_Manager` | `UpdateDataModel` |
