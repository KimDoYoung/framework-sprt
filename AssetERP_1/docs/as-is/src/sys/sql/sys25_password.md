# sys25_password

`server/sys/mapper/sys25_password.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`sys25_password`](../../../db/tables/sys.md) |  | `sys.Sys25_Password.selectById` |
| `selectByPersonId` | select | 24 | [`sys25_password`](../../../db/tables/sys.md), [`sys26_login`](../../../db/tables/sys.md) | `f_sysdate`, `to_decrypts` | `sys.Sys02_User.getLoginInfo`, `sys.Sys02_User.getMobiLoginInfo` |
| `checkPassword` | select | 45 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys25_password`](../../../db/tables/sys.md) | `to_decrypts` | `sys.Sys25_Password.checkPassword` |
| `checkPasswordRule` | select | 61 | - | `f_password_rule` | `sys.Sys25_Password.checkPasswordRule` |
| `checkInsert` | select | 65 | [`sys25_password`](../../../db/tables/sys.md) |  | `sys.Sys25_Password.insert` |
| `check` | select | 78 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys25_password`](../../../db/tables/sys.md) |  | `sys.Sys25_Password.getCode` |
| `getPersonId` | select | 94 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys25_password`](../../../db/tables/sys.md) |  | `sys.Sys25_Password.extension` |
| `insert` | insert | 109 | [`sys25_password`](../../../db/tables/sys.md) | `f_create_seq`, `f_sysdate`, `to_encrypts` | `sys.Sys25_Password.insert` |
| `updatePassword` | update | 124 | [`sys25_password`](../../../db/tables/sys.md) | `f_sysdate`, `to_encrypts` | `sys.Sys25_Password.insert` |
| `extension` | update | 133 | [`sys25_password`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys25_Password.extension` |
