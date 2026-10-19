# sys50_specific_menu

`server/sys/mapper/sys50_specific_menu.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`sys06_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md) | `f_cdnm`, `f_menu_nm_allpath`, `f_sysdate` | `sys.Sys50_SpecificMenu.selectById` |
| `selectByCompanyId` | select | 26 | [`sys06_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md) | `f_cdnm`, `f_menu_nm_allpath`, `f_sysdate` | `sys.Sys50_SpecificMenu.selectByCompanyId` |
| `selectBySpecificWorkCode` | select | 36 | [`sys06_menu`](../../../db/tables/sys.md), [`sys50_specific_menu`](../../../db/tables/sys.md) | `f_cdnm`, `f_menu_nm_allpath`, `f_sysdate` | `sys.Sys50_SpecificMenu.selectBySpecificWorkCode` |
