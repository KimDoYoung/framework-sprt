# sys02_user

`server/sys/mapper/sys02_user.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md) | `to_decrypts` | - |
| `selectByLoginId` | select | 37 | [`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md) | `to_decrypts` | `sys.Sys02_User.getLoginInfo`, `sys.Sys02_User.getMobiLoginInfo` |
| `selectByName` | select | 47 | [`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md) | `to_decrypts` | `sys.Sys02_User.selectByName` |
| `selectByCompanyId` | select | 57 | [`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md) | `to_decrypts` | `sys.Sys02_User.selectByCompanyId` |
| `encryptsPasswd` | select | 66 | - | `to_encrypts` | `sys.Sys02_User.update` |
