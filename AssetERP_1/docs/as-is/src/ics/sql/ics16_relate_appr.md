# ics16_relate_appr

`server/ics/mapper/ics16_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`ics16_relate_appr`](../../../db/tables/ics.md) |  | `ics.Ics16_RelateAppr.selectById` |
| `selectByCompanyId` | select | 34 | [`apr01_appr`](../../../db/tables/apr.md), [`ics16_relate_appr`](../../../db/tables/ics.md) | `f_cdnm` | `ics.Ics16_RelateAppr.selectByCompanyId`, `ics.Ics16_RelateAppr.updateApprId` |
| `selectByConfirmerId` | select | 46 | [`apr01_appr`](../../../db/tables/apr.md), [`emp04_add_title`](../../../db/tables/emp.md), [`ics10_checklist`](../../../db/tables/ics.md), [`ics11_checklist_company`](../../../db/tables/ics.md), [`ics15_checklist_write`](../../../db/tables/ics.md), [`ics16_relate_appr`](../../../db/tables/ics.md), [`ics21_checklist_l_class`](../../../db/tables/ics.md), [`ics22_checklist_l_class_company`](../../../db/tables/ics.md), [`ics23_checklist_m_class`](../../../db/tables/ics.md), [`ics24_checklist_m_class_company`](../../../db/tables/ics.md), [`sch02_share`](../../../db/tables/sch.md), [`sch22_write_group`](../../../db/tables/sch.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_confirmer_limit`, `getperson` | `ics.Ics16_RelateAppr.selectByConfirmerId` |
| `updateApprId` | update | 88 | [`ics16_relate_appr`](../../../db/tables/ics.md) |  | `ics.Ics16_RelateAppr.updateApprId` |
