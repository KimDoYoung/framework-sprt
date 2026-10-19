# tdm54_chck_insuff

`server/tdm/mapper/tdm54_chck_insuff.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 52 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_org_nm`, `f_today` | `tdm.Tdm54_ChckInsuff.selectById` |
| `selectByChckManlId` | select | 78 | [`tdm54_chck_insuff`](../../../db/tables/tdm.md) | `f_emp_kor_nm` | `tdm.Tdm52_ChckManl.batchCheckComplete`, `tdm.Tdm52_ChckManl.updateComplete`, `tdm.Tdm54_ChckInsuff.selectByChckManlId` |
| `selectByChckApprCmntId` | select | 86 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `getorg`, `getperson`, `getsubtdmorg` | `tdm.Tdm54_ChckInsuff.selectByChckApprCmntId` |
| `selectByRegDate` | select | 264 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_tdmorg_id2`, `f_org_nm`, `f_today` | `tdm.Tdm54_ChckInsuff.selectByRegDate` |
| `selectDashboardInsuff` | select | 324 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_tdmorg_id2`, `getorg`, `getperson`, `gettdm30roleallc` | `tdm.Tdm54_ChckInsuff.selectDashboardInsuff` |
| `selectApprTarget` | select | 370 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `countByChckApprCmntId` | select | 401 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm61_chck_insuff_appr`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm59_ChckApprCmnt.updateApprCmnt` |
| `selectPossibleYn` | select | 431 | - |  | `tdm.Tdm54_ChckInsuff.updateComplete` |
| `updateStatusCode` | update | 437 | [`tdm54_chck_insuff`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.updateApprStart`, `tdm.Tdm61_ChckInsuffAppr.updateApprStatus` |
| `updateStatusCode2` | update | 445 | [`tdm54_chck_insuff`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `deleteByChckManlId` | delete | 454 | [`tdm54_chck_insuff`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.updateCheckStatus` |
| `deleteById` | delete | 460 | [`tdm54_chck_insuff`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.batchCheckComplete`, `tdm.Tdm52_ChckManl.updateComplete` |
