# pay30_basic_setup

`server/pay/mapper/pay30_basic_setup.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`pay30_basic_setup`](../../../db/tables/pay.md) |  | `pay.Pay30_BasicSetup.selectById` |
| `selectByCompanyId` | select | 28 | [`pay30_basic_setup`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay30_BasicSetup.selectByCompanyId` |
| `insertFromPay30` | insert | 39 | [`pay30_basic_setup`](../../../db/tables/pay.md) | `f_create_seq` | - |
