# tdm44_manl_duty_org

`server/tdm/mapper/tdm44_manl_duty_org.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 22 | [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_org_nm`, `f_sysdate` | `tdm.Tdm44_ManlDutyOrg.selectById` |
| `selectByManlDutyId` | select | 29 | [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_org_nm`, `f_sysdate` | `tdm.Tdm44_ManlDutyOrg.selectByManlDutyId` |
| `insertCheck` | select | 36 | [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm44_ManlDutyOrg.insert` |
| `insert` | insert | 43 | [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm44_ManlDutyOrg.insert` |
| `createDutyOrg` | insert | 56 | [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_create_seq`, `f_sysdate` | `tdm.Tdm40_ManlJob.createDuty` |
| `updateEndYn` | update | 71 | [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm41_ManlDuty.updateEndYn`, `tdm.Tdm43_Manl.copyDutyList` |
| `clearEndYn` | update | 91 | [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm42_ManlOrg.deleteByManlJobId` |
| `updateOrgId` | update | 103 | [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm41_ManlDuty.changeOrgId` |
| `updateOrgIdByTaskId` | update | 115 | [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm41_ManlDuty.changeOrgId2` |
| `deleteByManlJobId` | delete | 129 | [`tdm41_manl_duty`](../../../db/tables/tdm.md), [`tdm44_manl_duty_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm40_ManlJob.deleteAll` |
