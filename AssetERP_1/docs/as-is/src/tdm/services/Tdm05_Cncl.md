# tdm.Tdm05_Cncl

`server/tdm/Tdm05_Cncl.java`

서비스 키 `tdm.Tdm05_Cncl.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm05_cncl.selectById`](../../tdm/sql/tdm05_cncl.md) | - |  |
| `selectByCompanyId` | 25 | [`tdm05_cncl.selectByCompanyId`](../../tdm/sql/tdm05_cncl.md) | - |  |
| `selectByDate` | 33 | [`tdm05_cncl.selectByDate`](../../tdm/sql/tdm05_cncl.md) | `Tdm05_Lookup_SelectMulti`, `Tdm05_Tab_Cncl` |  |
| `modelUpdate` | 38 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(tdm05_cncl)` 동적 INSERT/UPDATE | `Tdm05_Edit_Cncl` | `UpdateDataModel` |
| `update` | 51 | `UpdateDataModel(tdm05_cncl)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 56 | [`tdm05_cncl.countUseByCnclId`](../../tdm/sql/tdm05_cncl.md), `UpdateDataModel(tdm05_cncl)` 동적 DELETE | `Tdm05_Tab_Cncl` | `UpdateDataModel` |
