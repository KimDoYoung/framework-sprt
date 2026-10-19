# tdm09_appr_step

`server/tdm/mapper/tdm09_appr_step.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 29 | [`tdm09_appr_step`](../../../db/tables/tdm.md) |  | `tdm.Tdm09_ApprStep.selectById` |
| `selectByCompanyId` | select | 36 | [`emp01_person`](../../../db/tables/emp.md), [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md) | `f_emp_kor_nm`, `f_today`, `getorg`, `gettdm30roleallc` | `tdm.Tdm09_ApprStep.selectByCompanyId` |
| `selectByParentId` | select | 65 | [`tdm09_appr_step`](../../../db/tables/tdm.md) | `f_cdnm`, `f_today`, `getperson` | `tdm.Tdm09_ApprStep.selectByParentId` |
| `modelUpsert` | insert | 79 | [`tdm09_appr_step`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm09_ApprStep.inUpdateData` |
| `updateByParentId` | update | 120 | [`tdm09_appr_step`](../../../db/tables/tdm.md) |  | `tdm.Tdm09_ApprStep.update` |
| `deleteByParentId` | delete | 128 | [`tdm09_appr_step`](../../../db/tables/tdm.md) |  | `tdm.Tdm09_ApprStep.deleteByParentId` |
