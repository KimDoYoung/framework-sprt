# pay06_act_mapping

`server/pay/mapper/pay06_act_mapping.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`pay06_act_mapping`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay06_ActMapping.selectById` |
| `selectByCompanyId` | select | 28 | [`pay06_act_mapping`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay06_ActMapping.selectByCompanyId` |
| `selectByLinkCode` | select | 37 | [`pay06_act_mapping`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay06_ActMapping.selectByLinkCode` |
| `selectByKindCode` | select | 48 | [`pay06_act_mapping`](../../../db/tables/pay.md) |  | `pay.Pay06_ActMapping.selectByKindCode` |
| `insertFormPay06` | insert | 56 | [`pay06_act_mapping`](../../../db/tables/pay.md) | `f_create_seq` | - |
