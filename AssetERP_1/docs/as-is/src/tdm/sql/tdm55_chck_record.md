# tdm55_chck_record

`server/tdm/mapper/tdm55_chck_record.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`tdm55_chck_record`](../../../db/tables/tdm.md) |  | `tdm.Tdm55_ChckRecord.selectById` |
| `selectByRelateId` | select | 31 | [`tdm55_chck_record`](../../../db/tables/tdm.md) |  | `tdm.Tdm55_ChckRecord.selectByRelateId` |
| `selectByChckOrgId` | select | 43 | [`tdm55_chck_record`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm55_ChckRecord.selectByChckOrgId` |
| `selectByInsuffId` | select | 58 | [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm55_chck_record`](../../../db/tables/tdm.md) |  | `tdm.Tdm55_ChckRecord.selectByInsuffId` |
| `selectByChckApprCmntId` | select | 73 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm55_chck_record`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md) | `getorg`, `getsubtdmorg` | `tdm.Tdm55_ChckRecord.selectByChckApprCmntId` |
| `insert` | insert | 107 | [`tdm55_chck_record`](../../../db/tables/tdm.md) | `f_cdnm`, `f_create_seq`, `f_sysdate`, `getperson` | `tdm.Tdm51_ChckOrg.updateApprStatus`, `tdm.Tdm52_ChckManl.batchCancelComplete`, `tdm.Tdm52_ChckManl.batchCheckComplete`, `tdm.Tdm52_ChckManl.updateApprStart`, `tdm.Tdm52_ChckManl.updateCheckStatus`, `tdm.Tdm52_ChckManl.updateComplete`, `tdm.Tdm54_ChckInsuff.modelUpdate`, `tdm.Tdm54_ChckInsuff.updateComplete`, `tdm.Tdm59_ChckApprCmnt.updateApprCmnt`, `tdm.Tdm60_ChckManlAppr.updateApprStatus`, `tdm.Tdm60_ChckManlAppr.updateApprStatus2`, `tdm.Tdm61_ChckInsuffAppr.updateApprStatus` |
