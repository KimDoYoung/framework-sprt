# flt.Flt15_TrStatus

`server/flt/Flt15_TrStatus.java`

서비스 키 `flt.Flt15_TrStatus.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`flt15_tr_status.selectById`](../../flt/sql/flt15_tr_status.md) | - |  |
| `selectByPersonId` | 23 | [`flt15_tr_status.insert`](../../flt/sql/flt15_tr_status.md), [`flt15_tr_status.selectByPersonId`](../../flt/sql/flt15_tr_status.md) | `Flt15_Lookup_Note` |  |
| `update` | 38 | `UpdateDataModel(flt15_tr_status)` 동적 INSERT/UPDATE | `Flt15_Lookup_Note` | `UpdateDataModel` |
| `delete` | 46 | `UpdateDataModel(flt15_tr_status)` 동적 DELETE | - | `UpdateDataModel` |
