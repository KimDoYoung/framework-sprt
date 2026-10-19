# sys26_login

`server/sys/mapper/sys26_login.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`sys26_login`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys26_Login.selectById` |
| `selectByLoginDate` | select | 33 | [`emp01_person`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md), [`sys02_user`](../../../db/tables/sys.md), [`sys26_login`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `sys.Sys26_Login.selectByLoginDate` |
| `insert` | insert | 70 | [`sys26_login`](../../../db/tables/sys.md) | `f_create_seq`, `f_sysdate` | - |
| `insertSeq` | insert | 84 | [`sys26_login`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys02_User.getLoginInfo`, `sys.Sys02_User.getMobiLoginInfo` |
