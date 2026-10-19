# sms02_history

`server/sms/mapper/sms02_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`sms02_history`](../../../db/tables/sms.md) |  | `sms.Sms02_History.selectById` |
| `selectByDate` | select | 38 | [`sms02_history`](../../../db/tables/sms.md) |  | `sms.Sms02_History.selectByDate` |
| `selectByTotalCount` | select | 49 | [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md) |  | `sms.Sms02_History.selectByTotalCount` |
| `selectByCompanyId` | select | 77 | [`sms02_history`](../../../db/tables/sms.md) |  | `biz.Biz55_ErpFeeCharge.updateErpCompany` |
| `selectByTotalCountYear` | select | 85 | [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md) |  | `sms.Sms02_History.selectByTotalCountYear` |
| `selectByTotalCountMonth` | select | 101 | [`sms02_history`](../../../db/tables/sms.md), [`sys01_company`](../../../db/tables/sys.md) |  | `sms.Sms02_History.selectByTotalCountMonth` |
| `insert` | insert | 118 | [`sms02_history`](../../../db/tables/sms.md) |  | `sms.Sms02_History.sendMessage`, `sms.Sms02_History.sendTagetMessage` |
