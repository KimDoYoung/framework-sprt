# tdm59_chck_appr_cmnt

`server/tdm/mapper/tdm59_chck_appr_cmnt.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 57 | [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) |  | `tdm.Tdm59_ChckApprCmnt.selectById` |
| `selectByApprEmpId` | select | 68 | [`tdm20_role`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm54_chck_insuff`](../../../db/tables/tdm.md), [`tdm58_chck_appr_step`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm62_chck_cmnt_relate_org`](../../../db/tables/tdm.md) | `f_cdnm`, `getorg`, `getsubtdmorg` | `tdm.Tdm59_ChckApprCmnt.selectByApprEmpId` |
| `selectByApprOrgId` | select | 218 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) | `getperson` | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `selectByChckManlId` | select | 237 | [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md), [`tdm60_chck_manl_appr`](../../../db/tables/tdm.md) |  | `tdm.Tdm52_ChckManl.updateComplete` |
| `selectParent` | select | 259 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) | `f_org_nm` | `tdm.Tdm59_ChckApprCmnt.selectPreNextOrg`, `tdm.Tdm59_ChckApprCmnt.updateSubmit` |
| `selectChild` | select | 271 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) | `f_org_nm` | `tdm.Tdm59_ChckApprCmnt.selectPreNextOrg`, `tdm.Tdm59_ChckApprCmnt.updateApprCmnt`, `tdm.Tdm59_ChckApprCmnt.updateSubmit` |
| `countChild` | select | 281 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) |  | `tdm.Tdm59_ChckApprCmnt.updateSubmit` |
| `selectChildApprYn` | select | 290 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) |  | `tdm.Tdm59_ChckApprCmnt.updateApprCmnt` |
| `checkTdmSubmitPossibleYn` | select | 303 | - | `f_get_tdmsubmitpossibleyn` | `tdm.Tdm59_ChckApprCmnt.updateSubmit` |
| `createTdm59` | select | 308 | - | `f_create_tdm59` | `tdm.Tdm51_ChckOrg.updateFix` |
| `updateApprStatus` | update | 314 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus`, `tdm.Tdm59_ChckApprCmnt.updateSubmit` |
| `updateApprStatusBySubCheckOrg` | update | 321 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus` |
| `updateByApprInfo` | update | 333 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) |  | `tdm.Tdm59_ChckApprCmnt.updateApprCmnt` |
| `updateSubmit` | update | 342 | [`tdm59_chck_appr_cmnt`](../../../db/tables/tdm.md) |  | `tdm.Tdm59_ChckApprCmnt.updateApprCmnt`, `tdm.Tdm59_ChckApprCmnt.updateSubmit` |
