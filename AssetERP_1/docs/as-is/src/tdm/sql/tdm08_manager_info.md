# tdm08_manager_info

`server/tdm/mapper/tdm08_manager_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`tdm08_manager_info`](../../../db/tables/tdm.md) | `f_cdnm`, `getperson` | `tdm.Tdm08_ManagerInfo.selectById` |
| `selectByCompanyId` | select | 36 | [`sys08_code_kind`](../../../db/tables/sys.md), [`sys09_code`](../../../db/tables/sys.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm23_role_relate_org`](../../../db/tables/tdm.md) | `f_emp_kor_nm`, `f_get_emptrans`, `f_org_nm`, `f_today`, `getorg` | `tdm.Tdm08_ManagerInfo.selectByCompanyId` |
| `selectByManagerType` | select | 129 | [`tdm08_manager_info`](../../../db/tables/tdm.md) | `f_cdnm`, `getperson` | `tdm.Tdm08_ManagerInfo.selectByManagerType` |
| `checkIsManager` | select | 144 | [`tdm08_manager_info`](../../../db/tables/tdm.md) |  | `tdm.Tdm08_ManagerInfo.checkIsManager` |
