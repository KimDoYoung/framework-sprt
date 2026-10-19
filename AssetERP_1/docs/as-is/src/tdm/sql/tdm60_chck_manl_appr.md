# tdm60_chck_manl_appr

`server/tdm/mapper/tdm60_chck_manl_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm60_ChckManlAppr.selectById` |
| `insertByTdm58` | insert | 24 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) | `f_create_seq`, `getperson` | `tdm.Tdm51_ChckOrg.updateFix` |
| `updateById` | update | 45 | [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm60_ChckManlAppr.updateApprCmnt`, `tdm.Tdm60_ChckManlAppr.updateApprStatus`, `tdm.Tdm60_ChckManlAppr.updateApprStatus2` |
| `updateApprStatusByChckOrgId` | update | 54 | [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `updateApprStatusByChckManlId` | update | 64 | [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm52_ChckManl.updateApprStart` |
| `deleteByChckOrgId` | delete | 73 | [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateFix` |
