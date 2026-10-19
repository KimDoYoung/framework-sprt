# sys51_specific_menu_person

`server/sys/mapper/sys51_specific_menu_person.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`sys51_specific_menu_person`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `sys.Sys51_SpecificMenuPerson.selectById` |
| `selectBySpecificMenuId` | select | 24 | [`sys51_specific_menu_person`](../../../db/tables/sys.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `sys.Sys51_SpecificMenuPerson.selectBySpecificMenuId`, `sys.Sys51_SpecificMenuPerson.updateGroup` |
| `deleteSpecificMenuPerson` | delete | 33 | [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md) |  | `sys.Sys51_SpecificMenuPerson.updateGroup` |
| `insertSpecificMenuPerson` | insert | 47 | [`sys50_specific_menu`](../../../db/tables/sys.md), [`sys51_specific_menu_person`](../../../db/tables/sys.md) | `f_create_seq` | `sys.Sys51_SpecificMenuPerson.updateGroup` |
