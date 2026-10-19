# ics40_dcr_preconfirm

`server/ics/mapper/ics40_dcr_preconfirm.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 42 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics40_DcrPreconfirm.selectById` |
| `selectByCompanyId` | select | 75 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics40_DcrPreconfirm.selectByCompanyId` |
| `selectByApprId` | select | 108 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics40_DcrPreconfirm.selectByApprId` |
| `selectByDate` | select | 141 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics40_DcrPreconfirm.selectByDate` |
| `selectByConfirm` | select | 177 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics40_DcrPreconfirm.selectByConfirm`, `sys.Sys99_Print.insertRdDcrPreConfirm` |
| `selectByReviewConfirm` | select | 220 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md), [`ics41_dcr_type`](../../../db/tables/ics.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics40_DcrPreconfirm.selectByReviewConfirm` |
| `countByApprNo` | select | 392 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md) |  | `ics.Ics40_DcrPreconfirm.updateByStatus` |
| `updateByStatus01` | update | 399 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md) | `f_sysdate` | `ics.Ics40_DcrPreconfirm.updateByStatus`, `ics.Ics40_DcrPreconfirm.updateByStatus01` |
| `updateByStatus02` | update | 420 | [`ics40_dcr_preconfirm`](../../../db/tables/ics.md) |  | `ics.Ics40_DcrPreconfirm.updateByStatus` |
