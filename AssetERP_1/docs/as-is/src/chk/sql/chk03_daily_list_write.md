# chk03_daily_list_write

`server/chk/mapper/chk03_daily_list_write.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`chk03_daily_list_write`](../../../db/tables/chk.md) |  | `chk.Chk03_DailyListWrite.selectById` |
| `selectByPersonId` | select | 38 | [`chk03_daily_list_write`](../../../db/tables/chk.md) |  | `chk.Chk03_DailyListWrite.updateAnswerCode`, `chk.Chk03_DailyListWrite.updateConfirmYn` |
| `chkList` | sql | 47 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md) | `f_get_confirmer_limit`, `getperson` |  |
| `whereCondition` | sql | 108 | - | `f_emp_kor_nm`, `f_org_nm` |  |
| `selectDailyListStatusPaging` | select | 128 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`chk03_daily_list_write`](../../../db/tables/chk.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_confirmer_limit`, `f_org_nm`, `getperson` | `chk.Chk03_DailyListWrite.selectDailyListStatusPaging` |
| `selectDailyListStatusPagingTotal` | select | 168 | [`chk01_class_tree`](../../../db/tables/chk.md), [`chk02_daily_list`](../../../db/tables/chk.md), [`chk03_daily_list_write`](../../../db/tables/chk.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md) | `f_emp_kor_nm`, `f_get_confirmer_limit`, `f_org_nm`, `getperson` | `chk.Chk03_DailyListWrite.selectDailyListStatusPaging` |
| `updateAnswerCode` | update | 180 | [`chk03_daily_list_write`](../../../db/tables/chk.md) |  | `chk.Chk03_DailyListWrite.updateAnswerCode` |
| `updateConfirmYn` | update | 187 | [`chk03_daily_list_write`](../../../db/tables/chk.md) |  | `chk.Chk03_DailyListWrite.updateConfirmYn` |
