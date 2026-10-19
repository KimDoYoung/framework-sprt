# tdm40_manl_job

`server/tdm/mapper/tdm40_manl_job.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 31 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_org_nm` | `tdm.Tdm40_ManlJob.selectById` |
| `selectSimpleById` | select | 65 | [`tdm40_manl_job`](../../../db/tables/tdm.md) |  | `tdm.Tdm42_ManlOrg.insertManlOrg` |
| `selectByText` | select | 71 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_get_tdmorg_id2`, `f_today`, `getorg` | `tdm.Tdm40_ManlJob.selectByText` |
| `createDirectManl` | select | 137 | - | `f_create_tdm_manual` | `tdm.Tdm40_ManlJob.createDirectManl` |
| `createDuty` | insert | 141 | [`tdm35_role_allc_task`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate`, `gettdm30roleallc` | `tdm.Tdm40_ManlJob.createDuty` |
