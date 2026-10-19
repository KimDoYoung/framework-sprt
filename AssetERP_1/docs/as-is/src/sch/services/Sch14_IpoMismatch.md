# sch.Sch14_IpoMismatch

`server/sch/Sch14_IpoMismatch.java`

서비스 키 `sch.Sch14_IpoMismatch.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`sch14_ipo_mismatch.selectById`](../../sch/sql/sch14_ipo_mismatch.md) | - |  |
| `selectByCheckYn` | 21 | [`sch14_ipo_mismatch.selectByCheckYn`](../../sch/sql/sch14_ipo_mismatch.md) | `Sch14_Lookup_IpoMismatch` |  |
| `createIpoMismatch` | 26 | [`sch14_ipo_mismatch.createIpoMismatch`](../../sch/sql/sch14_ipo_mismatch.md) | `Sch14_Lookup_IpoMismatch` |  |
| `update` | 35 | `UpdateDataModel(sch14_ipo_mismatch)` 동적 INSERT/UPDATE | `Sch14_Lookup_IpoMismatch` | `UpdateDataModel` |
| `delete` | 40 | `UpdateDataModel(sch14_ipo_mismatch)` 동적 DELETE | - | `UpdateDataModel` |
