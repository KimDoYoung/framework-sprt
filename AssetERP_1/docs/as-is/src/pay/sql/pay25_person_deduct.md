# pay25_person_deduct

`server/pay/mapper/pay25_person_deduct.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`pay25_person_deduct`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay25_PersonDeduct.selectById` |
| `selectByAll` | select | 23 | [`pay25_person_deduct`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay25_PersonDeduct.selectByAll` |
| `selectByMonthId` | select | 33 | [`pay10_month`](../../../db/tables/pay.md), [`pay25_person_deduct`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay25_PersonDeduct.selectByMonthId` |
| `selectByDate` | select | 46 | [`pay25_person_deduct`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay25_PersonDeduct.selectByDate` |
| `selectByStartDate` | select | 53 | [`pay25_person_deduct`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay25_PersonDeduct.insert` |
| `insert` | insert | 63 | [`pay25_person_deduct`](../../../db/tables/pay.md) |  | `pay.Pay25_PersonDeduct.insert` |
| `deleteByDate` | delete | 80 | [`pay25_person_deduct`](../../../db/tables/pay.md) |  | `pay.Pay25_PersonDeduct.deleteByDate` |
