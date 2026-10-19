# chk.Chk02_DailyList

`server/chk/Chk02_DailyList.java`

서비스 키 `chk.Chk02_DailyList.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`chk02_daily_list.selectById`](../../chk/sql/chk02_daily_list.md) | - |  |
| `selectByAdmin` | 27 | [`chk02_daily_list.selectByAdmin`](../../chk/sql/chk02_daily_list.md) | `Chk02_Tab_DailyListAdmin` |  |
| `selectBySearchText` | 40 | [`chk02_daily_list.selectBySearchText`](../../chk/sql/chk02_daily_list.md) | `Chk02_Tab_DailyList` |  |
| `selectBySearchText2` | 53 | [`chk02_daily_list.selectBySearchText2`](../../chk/sql/chk02_daily_list.md) | `Chk02_Lookup_UseYn` |  |
| `selectByPersonId` | 65 | [`chk02_daily_list.selectByPersonId`](../../chk/sql/chk02_daily_list.md) | `Chk03_Tab_DailyListWrite` |  |
| `updateUseYn` | 82 | [`chk02_daily_list.updateUseYn`](../../chk/sql/chk02_daily_list.md) | `Chk02_Lookup_UseYn` |  |
| `updateWriteGroupId` | 99 | [`chk02_daily_list.updateWriteGroupId`](../../chk/sql/chk02_daily_list.md) | `Chk02_Tab_DailyList` |  |
| `insert` | 117 | [`chk02_daily_list.insertFromAdmin`](../../chk/sql/chk02_daily_list.md), [`chk02_daily_list.selectByAdminDailyListId`](../../chk/sql/chk02_daily_list.md), [`chk02_daily_list.updateFromAdmin`](../../chk/sql/chk02_daily_list.md) | `Chk02_Tab_DailyListAdmin` |  |
| `modelUpdate` | 148 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk02_daily_list)` 동적 INSERT/UPDATE | `Chk02_Edit_DailyList` | `UpdateDataModel` |
| `update` | 161 | `UpdateDataModel(chk02_daily_list)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 166 | `UpdateDataModel(chk02_daily_list)` 동적 DELETE | `Chk02_Tab_DailyList`, `Chk02_Tab_DailyListAdmin` | `UpdateDataModel` |
