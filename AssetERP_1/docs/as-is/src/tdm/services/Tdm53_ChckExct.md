# tdm.Tdm53_ChckExct

`server/tdm/Tdm53_ChckExct.java`

서비스 키 `tdm.Tdm53_ChckExct.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`tdm53_chck_exct.selectById`](../../tdm/sql/tdm53_chck_exct.md) | - |  |
| `selectByChckJobId` | 26 | [`tdm53_chck_exct.selectByChckJobId`](../../tdm/sql/tdm53_chck_exct.md) | `Tdm50_TabPage_CheckJob` |  |
| `fileCheck` | 35 | [`sys10_file.deleteByParentId`](../../sys/sql/sys10_file.md), [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | `Tdm50_TabPage_CheckJob` | `File` |
| `fileStatusCheck` | 48 | [`sys10_file.selectByParentId`](../../sys/sql/sys10_file.md) | - |  |
| `updateLockYn` | 60 | `UpdateDataModel(tdm53_chck_exct)` 동적 INSERT/UPDATE | `Tdm50_TabPage_CheckJob` | `UpdateDataModel` |
| `update` | 74 | `UpdateDataModel(tdm53_chck_exct)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `deleteList` | 79 | [`sys10_file.deleteById`](../../sys/sql/sys10_file.md) | `Tdm50_TabPage_CheckJob` |  |
| `delete` | 93 | `UpdateDataModel(tdm53_chck_exct)` 동적 DELETE | - | `UpdateDataModel` |
