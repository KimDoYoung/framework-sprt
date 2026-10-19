# sys95_manual

`server/sys/mapper/sys95_manual.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`sys10_file`](../../../db/tables/sys.md), [`sys95_manual`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `sys.Sys95_Manual.selectById` |
| `selectByCompanyId` | select | 32 | [`sys10_file`](../../../db/tables/sys.md), [`sys95_manual`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `sys.Sys95_Manual.selectByCompanyId` |
| `selectByPersonId` | select | 44 | [`sys10_file`](../../../db/tables/sys.md), [`sys95_manual`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | - |
| `selectByText` | select | 56 | [`sys10_file`](../../../db/tables/sys.md), [`sys95_manual`](../../../db/tables/sys.md) | `f_cdnm`, `f_today` | `sys.Sys95_Manual.selectByText` |
| `checkManualType` | select | 74 | [`sys95_manual`](../../../db/tables/sys.md) |  | `sys.Sys09_Code.checkCode`, `sys.Sys95_Manual.checkManualType` |
| `insert` | insert | 81 | [`sys95_manual`](../../../db/tables/sys.md) | `f_sysdate` | - |
