# tdm58_chck_appr_step

`server/tdm/mapper/tdm58_chck_appr_step.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md) | `getperson` | `tdm.Tdm58_ChckApprStep.selectById` |
| `selectByChckOrgId` | select | 39 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md) | `getperson` | `tdm.Tdm58_ChckApprStep.selectByChckOrgId` |
| `selectApprStep` | select | 55 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md) | `f_org_nm`, `getperson` | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `checkLastApprEmp` | select | 82 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateFix` |
| `insertByTmd09` | insert | 92 | [`tdm09_appr_step`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm50_ChckJob.createCheckManl` |
| `deleteChckManl` | delete | 115 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.deleteChckManl` |
