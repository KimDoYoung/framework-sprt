# fnd.Fnd03_Consignment

`server/fnd/Fnd03_Consignment.java`

서비스 키 `fnd.Fnd03_Consignment.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByCodeName` | 21 | [`fnd03_consignment.selectByCodeName`](../../fnd/sql/fnd03_consignment.md) | - |  |
| `selectByCompanyId` | 34 | [`fnd03_consignment.selectByCompanyId`](../../fnd/sql/fnd03_consignment.md) | `Fnd03_Tab_Consignment` |  |
| `selectByCompanyId0` | 39 | [`fnd03_consignment.selectByCompanyId0`](../../fnd/sql/fnd03_consignment.md) | `Fnd03_Tab_ConsignmentManager` |  |
| `selectByText` | 44 | [`fnd03_consignment.selectByText`](../../fnd/sql/fnd03_consignment.md) | `Fnd03_Lookup_Consignment` |  |
| `preUpdate` | 53 | [`fnd03_consignment.selectByCd`](../../fnd/sql/fnd03_consignment.md), [`fnd03_consignment.selectById`](../../fnd/sql/fnd03_consignment.md) | `Fnd03_Tab_Consignment` |  |
| `insertCheck` | 93 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd03_consignment.insertUpdate`](../../fnd/sql/fnd03_consignment.md), [`fnd03_consignment.selectById`](../../fnd/sql/fnd03_consignment.md) | `Fnd03_Tab_ConsignmentManager` |  |
| `update` | 132 | `UpdateDataModel(fnd03_consignment)` 동적 INSERT/UPDATE | `Fnd03_Tab_Consignment` | `UpdateDataModel` |
| `delete` | 137 | `UpdateDataModel(fnd03_consignment)` 동적 DELETE | `Fnd03_Tab_Consignment` | `UpdateDataModel` |
| `selectIcamConsignment` | 142 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd03_consignment.insertUpdate`](../../fnd/sql/fnd03_consignment.md), [`fnd03_consignment.selectByCd`](../../fnd/sql/fnd03_consignment.md), [`sys01_company.selectIcamCompanyCode`](../../sys/sql/sys01_company.md) | `Fnd03_Tab_Consignment`, `Fnd03_Tab_ConsignmentManager` | `DatabaseFactoryICAM` |
