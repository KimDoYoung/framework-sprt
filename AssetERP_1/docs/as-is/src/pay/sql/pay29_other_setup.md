# pay29_other_setup

`server/pay/mapper/pay29_other_setup.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`pay29_other_setup`](../../../db/tables/pay.md) |  | `pay.Pay29_OtherSetup.selectById` |
| `selectByAll` | select | 25 | [`pay29_other_setup`](../../../db/tables/pay.md) |  | `pay.Pay29_OtherSetup.selectByAll` |
| `selectByDate` | select | 34 | [`pay29_other_setup`](../../../db/tables/pay.md) |  | `pay.Pay29_OtherSetup.selectByDate` |
| `selectByStartDate` | select | 41 | [`pay29_other_setup`](../../../db/tables/pay.md) |  | `pay.Pay29_OtherSetup.insert` |
| `insert` | insert | 50 | [`pay29_other_setup`](../../../db/tables/pay.md) |  | `pay.Pay29_OtherSetup.insert` |
| `deleteByDate` | delete | 77 | [`pay29_other_setup`](../../../db/tables/pay.md) |  | `pay.Pay29_OtherSetup.deleteByDate` |
