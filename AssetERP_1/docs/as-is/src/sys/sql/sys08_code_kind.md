# sys08_code_kind

`server/sys/mapper/sys08_code_kind.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`sys08_code_kind`](../../../db/tables/sys.md) |  | - |
| `selectByAll` | select | 22 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md) |  | `sys.Sys08_CodeKind.selectByAll` |
| `selectByKindName` | select | 34 | [`sys08_code_kind`](../../../db/tables/sys.md) |  | `sys.Sys08_CodeKind.selectByKindName` |
| `selectByKindCode` | select | 46 | [`sys08_code_kind`](../../../db/tables/sys.md) |  | `sys.Sys08_CodeKind.selectByKindCode` |
