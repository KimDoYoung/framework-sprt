# tdm52_chck_manl

`server/tdm/mapper/tdm52_chck_manl.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 55 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_org_nm`, `f_sysdate`, `f_today` | `tdm.Tdm52_ChckManl.selectById`, `tdm.Tdm52_ChckManl.updateComplete` |
| `getFileCountStr` | select | 86 | - | `f_get_tdmevidcount` | `tdm.Tdm52_ChckManl.getFileCountStr` |
| `selectByChckOrgId` | select | 91 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_org_nm`, `f_today` | `tdm.Tdm52_ChckManl.selectByChckOrgId` |
| `selectByPersonId` | select | 140 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_org_nm`, `f_today` | `tdm.Tdm52_ChckManl.selectByPersonId` |
| `selectByChckApprCmntId` | select | 194 | [`tdm10_task`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_today`, `getorg`, `getsubtdmorg` | `tdm.Tdm52_ChckManl.selectByChckApprCmntId` |
| `selectDashboardUndone` | select | 273 | [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_get_tdmcheckcycle`, `f_get_tdmevidcount`, `f_get_tdmorg_id2`, `f_today`, `getorg`, `getperson` | `tdm.Tdm52_ChckManl.selectDashboardUndone` |
| `selectCheckTargetByCheckerId` | select | 328 | [`tdm52_chck_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.updateCheckStatus` |
| `selectByCheckStatusCode` | select | 347 | [`tdm52_chck_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `countEvidFile` | select | 354 | - | `f_get_tdmevidcount` | `tdm.Tdm52_ChckManl.updateComplete` |
| `countCheckerIdIsNull` | select | 359 | [`tdm52_chck_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateFix` |
| `countByChckApprCmntId` | select | 368 | [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.countByChckApprCmntId`, `tdm.Tdm59_ChckApprCmnt.updateApprCmnt` |
| `insertByTdm43` | insert | 387 | [`sys01_company`](../../../db/tables/sys.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_create_seq`, `f_get_last_day`, `f_get_quarter_date`, `f_get_tdmorg_id`, `f_sysdate`, `getperson` | `tdm.Tdm50_ChckJob.createCheckManl` |
| `updateCheckerId` | update | 447 | [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm52_ChckManl.updateCheckerId` |
| `updateCheckStatusByChckOrgId` | update | 456 | [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm51_ChckOrg.updateFix` |
| `updateCheckStatusById` | update | 469 | [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm51_ChckOrg.updateApprStatus`, `tdm.Tdm52_ChckManl.updateApprStart`, `tdm.Tdm52_ChckManl.updateCheckStatus`, `tdm.Tdm60_ChckManlAppr.updateApprStatus`, `tdm.Tdm60_ChckManlAppr.updateApprStatus2` |
| `updateByChckManlId` | update | 478 | [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm52_ChckManl.batchCancelComplete`, `tdm.Tdm52_ChckManl.batchCheckComplete`, `tdm.Tdm52_ChckManl.updateCheckStatus`, `tdm.Tdm52_ChckManl.updateComplete` |
| `deleteChckManl` | delete | 490 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.deleteChckManl` |
