# sys14_holiday

`server/sys/mapper/sys14_holiday.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`sys14_holiday`](../../../db/tables/sys.md) |  | `sys.Sys14_Holiday.selectById` |
| `selectByCompanyId` | select | 20 | [`sys14_holiday`](../../../db/tables/sys.md) |  | - |
| `selectByYear` | select | 27 | [`sys14_holiday`](../../../db/tables/sys.md) |  | `sys.Sys14_Holiday.selectByYear` |
| `insertInitData` | insert | 35 | [`sys14_holiday`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys14_Holiday.insertInitData` |
| `deleteByDay` | delete | 48 | [`sys14_holiday`](../../../db/tables/sys.md) |  | `sys.Sys14_Holiday.insertInitData` |
| `insertFormSys14` | insert | 55 | [`sys14_holiday`](../../../db/tables/sys.md) | `f_create_seq` | - |
