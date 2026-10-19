# act10_repr_account

`server/act/mapper/act10_repr_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`act10_repr_account`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act10_ReprAccount.selectById` |
| `selectByCompanyId` | select | 31 | [`act10_repr_account`](../../../db/tables/act.md) | `f_cdnm`, `f_sysdate` | `act.Act10_ReprAccount.selectByCompanyId` |
| `insertInitData` | insert | 46 | [`act10_repr_account`](../../../db/tables/act.md) | `f_create_seq` | `act.Act10_ReprAccount.insertInitData` |
| `insertFormAct10` | insert | 61 | [`act10_repr_account`](../../../db/tables/act.md) | `f_create_seq` | - |
| `deleteByReprAccountCode` | delete | 75 | [`act10_repr_account`](../../../db/tables/act.md) |  | `act.Act10_ReprAccount.insertInitData` |
