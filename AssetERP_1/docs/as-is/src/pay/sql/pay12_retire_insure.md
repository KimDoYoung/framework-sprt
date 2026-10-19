# pay12_retire_insure

`server/pay/mapper/pay12_retire_insure.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`pay12_retire_insure`](../../../db/tables/pay.md) |  | `pay.Pay12_RetireInsure.selectById` |
| `selectByPersonId` | select | 30 | [`pay10_month`](../../../db/tables/pay.md), [`pay12_retire_insure`](../../../db/tables/pay.md) |  | `pay.Pay12_RetireInsure.selectByPersonId` |
| `selectByRdPersonId` | select | 40 | [`pay10_month`](../../../db/tables/pay.md), [`pay12_retire_insure`](../../../db/tables/pay.md) |  | `pay.Pay12_RetireInsure.selectByRdPersonId`, `sys.Sys99_Print.insertRdRetireInsure` |
| `selectByYear` | select | 49 | [`pay12_retire_insure`](../../../db/tables/pay.md) |  | `pay.Pay12_RetireInsure.insertRetireInfo` |
| `getInsureRetire` | select | 57 | - | `f_calc_4insure_retire` | `pay.Pay12_RetireInsure.callInsureRetire`, `pay.Pay12_RetireInsure.getInsureRetire` |
| `updateModel` | update | 61 | [`pay12_retire_insure`](../../../db/tables/pay.md) | `f_create_seq` | `pay.Pay12_RetireInsure.insertRetireInfo` |
| `deleteByMonthId` | delete | 119 | [`pay12_retire_insure`](../../../db/tables/pay.md) |  | `pay.Pay10_Month.deleteAll` |
| `deleteByRetireInsureId` | delete | 125 | [`pay12_retire_insure`](../../../db/tables/pay.md) |  | `pay.Pay12_RetireInsure.insertRetireInfo` |
