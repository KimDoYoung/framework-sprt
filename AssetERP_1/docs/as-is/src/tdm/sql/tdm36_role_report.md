# tdm36_role_report

`server/tdm/mapper/tdm36_role_report.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm36_role_report`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm36_RoleReport.selectById` |
| `selectByDate` | select | 49 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm36_role_report`](../../../db/tables/tdm.md) | `f_cdnm`, `f_sysdate` | `tdm.Tdm36_RoleReport.selectByDate` |
| `getAttachList` | select | 69 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm01_hr`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm30_role_allc`](../../../db/tables/tdm.md), [`tdm31_role_desc`](../../../db/tables/tdm.md), [`tdm32_role_digm`](../../../db/tables/tdm.md), [`tdm36_role_report`](../../../db/tables/tdm.md) |  | `tdm.Tdm36_RoleReport.getAttachList` |
