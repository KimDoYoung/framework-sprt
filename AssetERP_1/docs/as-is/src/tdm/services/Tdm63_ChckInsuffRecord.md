# tdm.Tdm63_ChckInsuffRecord

`server/tdm/Tdm63_ChckInsuffRecord.java`

서비스 키 `tdm.Tdm63_ChckInsuffRecord.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 17 | [`tdm63_chck_insuff_record.selectById`](../../tdm/sql/tdm63_chck_insuff_record.md) | - |  |
| `selectBychckInsuffId` | 22 | [`tdm63_chck_insuff_record.selectBychckInsuffId`](../../tdm/sql/tdm63_chck_insuff_record.md) | `Tdm54_Lookup_ChckInsuff`, `Tdm54_Lookup_ChckInsuffCmnt` |  |
| `update` | 27 | `UpdateDataModel(tdm63_chck_insuff_record)` 동적 INSERT/UPDATE | `Tdm54_Lookup_ChckInsuff` | `UpdateDataModel` |
| `delete` | 37 | `UpdateDataModel(tdm63_chck_insuff_record)` 동적 DELETE | `Tdm54_Lookup_ChckInsuff` | `UpdateDataModel` |
