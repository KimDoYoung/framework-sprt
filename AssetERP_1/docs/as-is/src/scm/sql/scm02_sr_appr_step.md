# scm02_sr_appr_step

`server/scm/mapper/scm02_sr_appr_step.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 38 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`scm02_sr_appr_step`](../../../db/tables/scm.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today` | `scm.Scm02_SrApprStep.selectById` |
| `selectBySrId` | select | 61 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`scm02_sr_appr_step`](../../../db/tables/scm.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_to_number`, `f_today` | `scm.Scm02_SrApprStep.selectBySrId` |
| `scm02_empOrg_ById` | sql | 87 | [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`org01_code`](../../../db/tables/org.md), [`org02_info`](../../../db/tables/org.md), [`scm02_sr_appr_step`](../../../db/tables/scm.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_today` |  |
| `deleteBySrId` | delete | 166 | [`scm02_sr_appr_step`](../../../db/tables/scm.md) |  | `scm.Scm02_SrApprStep.updateList` |
