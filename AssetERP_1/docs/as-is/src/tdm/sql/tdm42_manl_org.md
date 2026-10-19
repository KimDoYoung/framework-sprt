# tdm42_manl_org

`server/tdm/mapper/tdm42_manl_org.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 47 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md) | `f_cdnm`, `f_org_nm`, `f_sysdate` | `tdm.Tdm41_ManlDuty.updateEndYn`, `tdm.Tdm42_ManlOrg.selectById` |
| `selectByText` | select | 62 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_company_nm`, `f_get_tdmorg_id2`, `f_today`, `getorg` | `tdm.Tdm42_ManlOrg.selectByText` |
| `selectByStdDate` | select | 152 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm42_manl_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.createCheckManl` |
| `selectByManlJobId` | select | 162 | [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) |  | - |
| `selectByNewOrgId` | select | 180 | [`tdm42_manl_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm41_ManlDuty.changeOrgId2` |
| `notManlOrgList` | select | 188 | [`tdm42_manl_org`](../../../db/tables/tdm.md) | `f_org_nm` | `tdm.Tdm42_ManlOrg.notManlOrgList` |
| `confirmChk` | select | 203 | [`tdm42_manl_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm42_ManlOrg.confirmChk` |
| `countLockByRoleId` | select | 210 | [`tdm42_manl_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm41_ManlDuty.changeOrgId`, `tdm.Tdm41_ManlDuty.changeOrgId2` |
| `insertByManlJobId` | insert | 218 | [`tdm40_manl_job`](../../../db/tables/tdm.md), [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate`, `gettdm30roleallc` | `tdm.Tdm42_ManlOrg.insertManlOrg` |
| `insert` | insert | 241 | [`tdm42_manl_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm41_ManlDuty.changeOrgId2` |
| `updateLockYn` | update | 258 | [`tdm42_manl_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm42_ManlOrg.updateLock` |
| `updateApprId` | update | 266 | [`tdm42_manl_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm42_ManlOrg.updateApprId` |
| `updateOrgId` | update | 272 | [`tdm42_manl_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm41_ManlDuty.changeOrgId` |
| `deleteByManlJobId` | delete | 281 | [`tdm42_manl_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm40_ManlJob.deleteAll`, `tdm.Tdm42_ManlOrg.deleteByManlJobId` |
| `deleteManlOrg` | delete | 287 | [`tdm42_manl_org`](../../../db/tables/tdm.md) |  | - |
| `deleteByTdm43` | delete | 294 | [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm41_ManlDuty.changeOrgId2` |
