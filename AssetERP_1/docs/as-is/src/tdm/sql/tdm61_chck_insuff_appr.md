# tdm61_chck_insuff_appr

`server/tdm/mapper/tdm61_chck_insuff_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm61_ChckInsuffAppr.selectById` |
| `selectByChckInsuffId` | select | 25 | [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm54_ChckInsuff.updateComplete` |
| `insertByTdm58` | insert | 32 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) | `f_create_seq`, `getperson` | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `updateById` | update | 69 | [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm61_ChckInsuffAppr.updateApprCmnt`, `tdm.Tdm61_ChckInsuffAppr.updateApprStatus` |
| `updateApprStatusByChckInsuffId` | update | 78 | [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm52_ChckManl.updateApprStart` |
| `deleteByChckInsuffId` | delete | 87 | [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `deleteByChckManlId` | delete | 93 | [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.updateComplete` |
| `deleteByChckOrgId` | delete | 102 | [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus` |
