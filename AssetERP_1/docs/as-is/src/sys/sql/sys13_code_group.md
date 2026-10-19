# sys13_code_group

`server/sys/mapper/sys13_code_group.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys13_CodeGroup.insert`, `sys.Sys13_CodeGroup.selectById`, `sys.Sys13_CodeGroup.update` |
| `selectByGroupCodeKind` | select | 27 | [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys13_CodeGroup.selectByGroupCodeKind` |
| `selectByKindGroupCode` | select | 35 | [`sys09_code`](../../../db/tables/sys.md), [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys13_CodeGroup.selectByKindGroupCode` |
| `insert` | insert | 47 | [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys13_CodeGroup.insert` |
| `update` | update | 64 | [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys13_CodeGroup.update` |
| `delete` | delete | 73 | [`sys13_code_group`](../../../db/tables/sys.md) |  | `sys.Sys13_CodeGroup.deleteAll` |
