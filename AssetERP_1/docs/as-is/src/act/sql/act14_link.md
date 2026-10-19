# act14_link

`server/act/mapper/act14_link.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`act14_link`](../../../db/tables/act.md) | `f_cdnm`, `f_today` | `act.Act14_Link.selectById` |
| `selectByAccountCode` | select | 25 | [`act14_link`](../../../db/tables/act.md) | `f_cdnm`, `f_today` | `act.Act01_AccountCode.insertAdminCopy`, `act.Act14_Link.selectByAccountCode` |
| `selectByProvideContentCode` | select | 35 | [`act14_link`](../../../db/tables/act.md) | `f_get_account_nm` | `act.Act14_Link.selectByProvideContentCode` |
| `insert` | insert | 44 | [`act14_link`](../../../db/tables/act.md) | `f_create_seq` | `act.Act14_Link.insert` |
| `insertUpdate` | insert | 59 | [`act14_link`](../../../db/tables/act.md) | `f_create_seq` | `act.Act01_AccountCode.insertAdminCopy` |
