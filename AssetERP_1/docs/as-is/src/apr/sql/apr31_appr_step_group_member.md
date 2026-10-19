# apr31_appr_step_group_member

`server/apr/mapper/apr31_appr_step_group_member.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`apr30_appr_step_group`](../../../db/tables/apr.md), [`apr31_appr_step_group_member`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_get_emptrans`, `f_org_parent_full_nm`, `f_sysdate`, `f_today`, `getperson` | `apr.Apr31_ApprStepGroupMember.selectById` |
| `selectByApprStepGroupId` | select | 65 | [`apr31_appr_step_group_member`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md) | `f_cdnm`, `f_today`, `getperson` | `apr.Apr31_ApprStepGroupMember.selectByApprStepGroupId` |
| `selectByClassTreeId` | select | 122 | [`apr31_appr_step_group_member`](../../../db/tables/apr.md), [`dcr01_class_tree`](../../../db/tables/dcr.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm`, `f_sysdate`, `f_today` | `apr.Apr04_ApprStep.selectByApprovalTypeCd` |
