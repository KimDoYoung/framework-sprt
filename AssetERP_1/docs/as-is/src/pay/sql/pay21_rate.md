# pay21_rate

`server/pay/mapper/pay21_rate.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`pay21_rate`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay21_Rate.selectById` |
| `selectByCode` | select | 23 | [`pay21_rate`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay21_Rate.selectByCode` |
| `selectByDate` | select | 30 | [`pay21_rate`](../../../db/tables/pay.md) |  | `pay.Pay31_InsureApply.insert3` |
