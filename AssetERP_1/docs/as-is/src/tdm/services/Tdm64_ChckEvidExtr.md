# tdm.Tdm64_ChckEvidExtr

`server/tdm/Tdm64_ChckEvidExtr.java`

서비스 키 `tdm.Tdm64_ChckEvidExtr.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`tdm64_chck_evid_extr.selectById`](../../tdm/sql/tdm64_chck_evid_extr.md) | - |  |
| `selectByTargetId` | 21 | [`tdm64_chck_evid_extr.selectByTargetId`](../../tdm/sql/tdm64_chck_evid_extr.md) | `Tdm00_Lookup_RelateAppr` |  |
| `update` | 26 | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 INSERT/UPDATE | `Tdm00_Lookup_RelateAppr` | `UpdateDataModel` |
| `delete` | 31 | `UpdateDataModel(tdm64_chck_evid_extr)` 동적 DELETE | `Tdm00_Lookup_RelateAppr` | `UpdateDataModel` |
