# fnd.Fnd06_OfficeWork

`server/fnd/Fnd06_OfficeWork.java`

서비스 키 `fnd.Fnd06_OfficeWork.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByCodeName` | 27 | [`fnd06_office_work.selectByCodeName`](../../fnd/sql/fnd06_office_work.md) | - |  |
| `selectByCompanyId` | 45 | [`fnd06_office_work.selectByCompanyId`](../../fnd/sql/fnd06_office_work.md) | `Fnd06_Tab_OfficeWork` |  |
| `selectByCompanyId0` | 50 | [`fnd06_office_work.selectByCompanyId0`](../../fnd/sql/fnd06_office_work.md) | `Fnd06_Tab_OfficeWorkManager` |  |
| `selectByText` | 55 | [`fnd06_office_work.selectByText`](../../fnd/sql/fnd06_office_work.md) | `Fnd06_Lookup_OfficeWork` |  |
| `preUpdate` | 115 | [`fnd06_office_work.selectByCd`](../../fnd/sql/fnd06_office_work.md), [`fnd06_office_work.selectById`](../../fnd/sql/fnd06_office_work.md) | `Fnd06_Tab_OfficeWork` |  |
| `selectIcamOfficeWork` | 155 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd06_office_work.insertUpdate`](../../fnd/sql/fnd06_office_work.md), [`fnd06_office_work.selectByCd`](../../fnd/sql/fnd06_office_work.md) | `Fnd06_Tab_OfficeWork`, `Fnd06_Tab_OfficeWorkManager` | `DatabaseFactoryICAM` |
| `update` | 198 | `UpdateDataModel(fnd06_office_work)` 동적 INSERT/UPDATE | `Fnd06_Tab_OfficeWork`, `Fnd06_Tab_OfficeWorkManager` | `UpdateDataModel` |
| `delete` | 203 | `UpdateDataModel(fnd06_office_work)` 동적 DELETE | `Fnd06_Tab_OfficeWork` | `UpdateDataModel` |
