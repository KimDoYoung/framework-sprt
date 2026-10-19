# pay.Pay09_RelateNote

`server/pay/Pay09_RelateNote.java`

서비스 키 `pay.Pay09_RelateNote.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`pay09_relate_note.selectById`](../../pay/sql/pay09_relate_note.md) | - |  |
| `selectByCompanyId` | 27 | [`pay09_relate_note.selectByCompanyId`](../../pay/sql/pay09_relate_note.md) | `Pay09_Lookup_Note` |  |
| `checkNote` | 34 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`pay09_relate_note.checkNote`](../../pay/sql/pay09_relate_note.md), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE | `Pay09_Lookup_Note` | `UpdateDataModel` |
| `modelUpdate` | 68 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE | `Pay09_Lookup_Note` | `UpdateDataModel` |
| `update` | 81 | `UpdateDataModel(pay09_relate_note)` 동적 INSERT/UPDATE | `Pay09_Lookup_Note` | `UpdateDataModel` |
| `delete` | 86 | `UpdateDataModel(pay09_relate_note)` 동적 DELETE | `Pay09_Lookup_Note` | `UpdateDataModel` |
