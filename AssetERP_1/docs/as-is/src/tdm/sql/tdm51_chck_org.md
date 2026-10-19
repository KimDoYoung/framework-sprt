# tdm51_chck_org

`server/tdm/mapper/tdm51_chck_org.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 60 | [`tdm51_chck_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.selectById` |
| `selectByRoleId` | select | 68 | [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `getorg` | `tdm.Tdm51_ChckOrg.selectByRoleId` |
| `selectByOrgId` | select | 128 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm43_manl`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_tdmorg_id2`, `f_today` | `tdm.Tdm51_ChckOrg.selectByOrgId` |
| `selectApprContent` | select | 387 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md) | `f_emp_kor_nm` | `tdm.Tdm51_ChckOrg.selectApprContent` |
| `selectUnCheckOrg` | select | 431 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md) | `getorg` | `tdm.Tdm59_ChckApprCmnt.updateApprCmnt` |
| `selectDashboardProgress` | select | 461 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `f_get_tdmorg_id2`, `getorg` | `tdm.Tdm51_ChckOrg.selectDashboardProgress` |
| `selectDashboardExct` | select | 515 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `getperson` | `tdm.Tdm51_ChckOrg.selectDashboardExct` |
| `selectDashboardOrg` | select | 558 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md) | `getorg` | `tdm.Tdm51_ChckOrg.selectDashboardOrg` |
| `countUnCheckByChckJobId` | select | 597 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.updateEndYn` |
| `getMessageList` | select | 607 | [`tdm08_manager_info`](../../../db/tables/tdm.md), [`tdm20_role`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.getMessageList` |
| `getTdmOrgId` | select | 647 | - | `f_get_tdmorg_id2` | `tdm.Tdm51_ChckOrg.getTdmOrgId` |
| `insert` | insert | 652 | [`tdm51_chck_org`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm50_ChckJob.createCheckManl` |
| `deleteChckManl` | delete | 668 | [`tdm51_chck_org`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.deleteChckManl` |
