# chk02_daily_list

`server/chk/mapper/chk02_daily_list.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `chk.Chk02_DailyList.selectById` |
| `selectByAdmin` | select | 44 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md) |  | `chk.Chk02_DailyList.selectByAdmin` |
| `selectBySearchText` | select | 57 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `chk.Chk02_DailyList.selectBySearchText` |
| `selectBySearchText2` | select | 76 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `chk.Chk02_DailyList.selectBySearchText2` |
| `selectByAdminDailyListId` | select | 94 | [`chk02_daily_list`](../../../db/tables/chk.md) |  | `chk.Chk02_DailyList.insert` |
| `selectByPersonId` | select | 102 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`chk03_daily_list_write`](../../../db/tables/chk.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md) |  | `chk.Chk02_DailyList.selectByPersonId` |
| `insertFromAdmin` | insert | 167 | [`chk02_daily_list`](../../../db/tables/chk.md) | `f_create_seq` | `chk.Chk02_DailyList.insert` |
| `insertFromChk02` | insert | 186 | [`chk02_daily_list`](../../../db/tables/chk.md) | `f_create_seq` | - |
| `updateFromAdmin` | update | 204 | [`chk02_daily_list`](../../../db/tables/chk.md) |  | `chk.Chk02_DailyList.insert` |
| `updateUseYn` | update | 213 | [`chk02_daily_list`](../../../db/tables/chk.md) |  | `chk.Chk02_DailyList.updateUseYn` |
| `updateWriteGroupId` | update | 220 | [`chk02_daily_list`](../../../db/tables/chk.md) |  | `chk.Chk02_DailyList.updateWriteGroupId` |
