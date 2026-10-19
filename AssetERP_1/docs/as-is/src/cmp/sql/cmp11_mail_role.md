# cmp11_mail_role

`server/cmp/mapper/cmp11_mail_role.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`cmp11_mail_role`](../../../db/tables/cmp.md) |  | - |
| `selectByRoleId` | select | 32 | [`cmp11_mail_role`](../../../db/tables/cmp.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md) | `f_cdnm`, `f_code_seq`, `f_get_emptrans`, `f_org_seq`, `f_sysdate` | `cmp.Cmp11_MailRole.selectByRoleId` |
| `deleteByMailBookId` | select | 63 | [`cmp11_mail_role`](../../../db/tables/cmp.md) |  | `cmp.Cmp11_MailRole.deleteByMailBookId` |
| `checkPerson` | select | 69 | [`cmp11_mail_role`](../../../db/tables/cmp.md) |  | `cmp.Cmp11_MailRole.updateList` |
| `insert` | insert | 77 | [`cmp11_mail_role`](../../../db/tables/cmp.md) |  | `cmp.Cmp11_MailRole.updateList` |
