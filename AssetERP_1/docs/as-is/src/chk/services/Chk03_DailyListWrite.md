# chk.Chk03_DailyListWrite

`server/chk/Chk03_DailyListWrite.java`

서비스 키 `chk.Chk03_DailyListWrite.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`chk03_daily_list_write.selectById`](../../chk/sql/chk03_daily_list_write.md) | `Chk03_Tab_DailyListWrite` |  |
| `selectDailyListStatusPaging` | 27 | [`chk03_daily_list_write.selectDailyListStatusPaging`](../../chk/sql/chk03_daily_list_write.md), [`chk03_daily_list_write.selectDailyListStatusPagingTotal`](../../chk/sql/chk03_daily_list_write.md) | `Chk03_Tab_DailyListConfirm`, `Chk03_Tab_DailyListStatus` |  |
| `updateAnswerCode` | 45 | [`chk03_daily_list_write.selectByPersonId`](../../chk/sql/chk03_daily_list_write.md), [`chk03_daily_list_write.updateAnswerCode`](../../chk/sql/chk03_daily_list_write.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk03_daily_list_write)` 동적 INSERT/UPDATE | `Chk03_Tab_DailyListWrite` | `UpdateDataModel` |
| `updateConfirmYn` | 94 | [`chk03_daily_list_write.selectByPersonId`](../../chk/sql/chk03_daily_list_write.md), [`chk03_daily_list_write.updateConfirmYn`](../../chk/sql/chk03_daily_list_write.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk03_daily_list_write)` 동적 INSERT/UPDATE | `Chk03_Tab_DailyListConfirm` | `UpdateDataModel` |
| `modelUpdate` | 149 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(chk03_daily_list_write)` 동적 INSERT/UPDATE | `Chk03_Edit_Note`, `Chk03_Edit_Reason`, `Chk03_Tab_DailyListWrite` | `UpdateDataModel` |
| `update` | 162 | `UpdateDataModel(chk03_daily_list_write)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 167 | `UpdateDataModel(chk03_daily_list_write)` 동적 DELETE | - | `UpdateDataModel` |
