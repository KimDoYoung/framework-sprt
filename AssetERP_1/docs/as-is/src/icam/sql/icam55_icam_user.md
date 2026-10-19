# icam55_icam_user

`server/icam/mapper/icam55_icam_user.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 46 | [`apr01_appr`](../../../db/tables/apr.md), [`icam55_icam_user`](../../../db/tables/icam.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `icam.Icam55_IcamUser.selectById` |
| `selectBySearchText` | select | 67 | [`apr01_appr`](../../../db/tables/apr.md), [`icam55_icam_user`](../../../db/tables/icam.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `icam.Icam55_IcamUser.selectBySearchText` |
| `selectByDate` | select | 96 | [`apr01_appr`](../../../db/tables/apr.md), [`icam55_icam_user`](../../../db/tables/icam.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `icam.Icam55_IcamUser.selectByDate` |
| `selectByProcStateCode` | select | 126 | [`icam55_icam_user`](../../../db/tables/icam.md) | `f_emp_kor_nm`, `f_get_datedif`, `f_get_datediff`, `f_sysdate` | `icam.Icam55_IcamUser.selectByProcStateCode` |
| `updateApprId` | update | 151 | [`icam55_icam_user`](../../../db/tables/icam.md) |  | `icam.Icam55_IcamUser.updateApprId`, `icam.Icam55_IcamUser.updateApprIds` |
| `updateResult` | update | 157 | [`icam55_icam_user`](../../../db/tables/icam.md) |  | `icam.Icam55_IcamUser.updateResult` |
| `updateStopAuth` | update | 166 | [`icam55_icam_user`](../../../db/tables/icam.md) |  | `icam.Icam55_IcamUser.updateEachAuth`, `icam.Icam55_IcamUser.updateMultiAuth` |
| `excelDelete` | delete | 175 | [`icam55_icam_user`](../../../db/tables/icam.md) |  | - |
| `excelInsert` | insert | 184 | [`icam55_icam_user`](../../../db/tables/icam.md) | `f_create_seq` | - |
