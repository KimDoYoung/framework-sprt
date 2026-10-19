# tdm50_chck_job

`server/tdm/mapper/tdm50_chck_job.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 43 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md) | `f_cdnm` | `tdm.Tdm50_ChckJob.modelUpdate`, `tdm.Tdm50_ChckJob.selectById` |
| `selectByCheckYm` | select | 75 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md), [`tdm56_chck_relate_appr`](../../../db/tables/tdm.md), [`tdm91_company_setup`](../../../db/tables/tdm.md) | `f_cdnm`, `f_create_seq`, `f_sysdate` | `tdm.Tdm50_ChckJob.selectByCheckYm` |
| `selectEndInfoByApprEmpId` | select | 140 | [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm91_company_setup`](../../../db/tables/tdm.md) | `f_get_tdmsubmitpossibleyn` | `tdm.Tdm50_ChckJob.selectEndInfoByApprEmpId` |
| `selectCheckStatus` | select | 156 | [`apr01_appr`](../../../db/tables/apr.md), [`tdm42_manl_org`](../../../db/tables/tdm.md), [`tdm50_chck_job`](../../../db/tables/tdm.md), [`tdm51_chck_org`](../../../db/tables/tdm.md), [`tdm52_chck_manl`](../../../db/tables/tdm.md), [`tdm53_chck_exct`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.preCreateCheckManl` |
| `selectPreCheckYm` | select | 187 | [`tdm50_chck_job`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.createCheckManl` |
| `selectCheckStartDate` | select | 194 | [`tdm50_chck_job`](../../../db/tables/tdm.md) |  | `tdm.Tdm51_ChckOrg.updateApprStatus`, `tdm.Tdm52_ChckManl.batchCancelComplete`, `tdm.Tdm52_ChckManl.batchCheckComplete`, `tdm.Tdm52_ChckManl.updateCheckStatus`, `tdm.Tdm52_ChckManl.updateComplete`, `tdm.Tdm59_ChckApprCmnt.updateApprCmnt`, `tdm.Tdm60_ChckManlAppr.updateApprStatus`, `tdm.Tdm60_ChckManlAppr.updateApprStatus2` |
| `countCheckYm` | select | 203 | [`tdm50_chck_job`](../../../db/tables/tdm.md) |  | `tdm.Tdm50_ChckJob.modelUpdate` |
| `updateEndYn` | update | 210 | [`tdm50_chck_job`](../../../db/tables/tdm.md) | `f_sysdate` | `tdm.Tdm50_ChckJob.updateEndYn` |
