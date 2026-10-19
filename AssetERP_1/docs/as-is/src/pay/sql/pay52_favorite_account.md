# pay52_favorite_account

`server/pay/mapper/pay52_favorite_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`act01_account_code`](../../../db/tables/act.md), [`pay52_favorite_account`](../../../db/tables/pay.md) | `f_cdnm`, `f_today` | `pay.Pay52_FavoriteAccount.selectById` |
| `selectByCompanyId` | select | 29 | [`act01_account_code`](../../../db/tables/act.md), [`pay52_favorite_account`](../../../db/tables/pay.md) | `f_cdnm`, `f_today` | `pay.Pay52_FavoriteAccount.selectByCompanyId` |
| `countByAccountCodeId` | select | 63 | [`pay52_favorite_account`](../../../db/tables/pay.md) |  | `pay.Pay52_FavoriteAccount.insert` |
| `insert` | insert | 69 | [`pay52_favorite_account`](../../../db/tables/pay.md) | `f_create_seq` | `pay.Pay52_FavoriteAccount.insert` |
