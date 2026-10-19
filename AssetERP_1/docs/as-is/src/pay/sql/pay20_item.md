# pay20_item

`server/pay/mapper/pay20_item.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay20_Item.selectById` |
| `selectByText` | select | 28 | [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay20_Item.selectByText` |
| `selectBySearchText` | select | 36 | [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay20_Item.selectBySearchText` |
| `selectByItemType` | select | 46 | [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay20_Item.selectByItemType` |
| `getMonthItem` | select | 55 | [`pay20_item`](../../../db/tables/pay.md) | `f_cdnm`, `f_sysdate` | `pay.Pay20_Item.getMonthItem` |
