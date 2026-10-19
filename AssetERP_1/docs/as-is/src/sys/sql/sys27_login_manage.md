# sys27_login_manage

`server/sys/mapper/sys27_login_manage.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`sys01_company`](../../../db/tables/sys.md), [`sys27_login_manage`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `sys.Sys27_LoginManage.selectById`, `sys.Sys27_LoginManage.updateConfirmYn` |
| `selectByPersonId` | select | 37 | [`sys01_company`](../../../db/tables/sys.md), [`sys27_login_manage`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `sys.Sys27_LoginManage.selectByPersonId` |
| `selectByMacAddress` | select | 50 | [`sys01_company`](../../../db/tables/sys.md), [`sys27_login_manage`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `sys.Sys27_LoginManage.insert`, `sys.Sys27_LoginManage.selectByMacAddress` |
| `selectByText` | select | 64 | [`sys01_company`](../../../db/tables/sys.md), [`sys27_login_manage`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `sys.Sys27_LoginManage.selectByText` |
| `checkMacAddress` | select | 78 | [`sys27_login_manage`](../../../db/tables/sys.md) |  | `sys.Sys27_LoginManage.checkMacAddress` |
| `updateConfirmYn` | update | 86 | [`sys27_login_manage`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys27_LoginManage.updateConfirmYn` |
| `insert` | insert | 93 | [`sys27_login_manage`](../../../db/tables/sys.md) | `f_create_seq`, `f_sysdate` | `sys.Sys27_LoginManage.insert` |
