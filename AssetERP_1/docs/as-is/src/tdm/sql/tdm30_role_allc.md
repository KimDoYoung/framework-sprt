# tdm30_role_allc

`server/tdm/mapper/tdm30_role_allc.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 43 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) | `f_emp_kor_nm` | `tdm.Tdm30_RoleAllc.selectById` |
| `selectByText` | select | 84 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm34_role_allc_detail`](../../../db/tables/tdm.md) | `f_emp_kor_nm` | `tdm.Tdm30_RoleAllc.selectByText` |
| `selectByPersonId` | select | 135 | [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm35_role_allc_task`](../../../db/tables/tdm.md) | `gettdm30roleallc` | `tdm.Tdm30_RoleAllc.selectByPersonId` |
| `selectByAllcStdDate` | select | 150 | [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today`, `gettdm30roleallc` | `tdm.Tdm30_RoleAllc.selectByAllcStdDate` |
| `selectPerson` | select | 177 | [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md) | `f_get_tdmpersoninfo`, `gettdm30roleallc` | `tdm.Tdm30_RoleAllc.selectPerson` |
| `notInRoleAllcIdList` | select | 200 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md) | `f_emp_kor_nm` | `tdm.Tdm30_RoleAllc.notInRoleAllcIdList` |
| `selectByExctId` | select | 252 | [`apr01_appr`](../../../db/tables/apr.md) | `gettdm30roleallc` | `tdm.Tdm30_RoleAllc.selectByExctId`, `tdm.Tdm35_RoleAllcTask.deleteInsert` |
| `updateApprId` | update | 260 | [`tdm30_role_allc`](../../../db/tables/tdm.md) |  | `tdm.Tdm30_RoleAllc.insertAppr` |
| `updateEndDate` | update | 266 | [`tdm30_role_allc`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm30_RoleAllc.updateEndDate`, `tdm.Tdm30_RoleAllc.updateEndDate2` |
