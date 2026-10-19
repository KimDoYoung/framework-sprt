# ics35_extr_activity

`server/ics/mapper/ics35_extr_activity.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 36 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`ics35_extr_activity`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics35_ExtrActivity.selectById` |
| `selectByCompanyId` | select | 70 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`ics35_extr_activity`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics35_ExtrActivity.selectByCompanyId` |
| `selectByPersonId` | select | 114 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`ics35_extr_activity`](../../../db/tables/ics.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_get_emptrans`, `f_sysdate` | `ics.Ics35_ExtrActivity.selectByPersonId` |
| `updateApprId` | update | 151 | [`ics35_extr_activity`](../../../db/tables/ics.md) |  | `ics.Ics35_ExtrActivity.updateApprId` |
| `updateResultApprId` | update | 157 | [`ics35_extr_activity`](../../../db/tables/ics.md) |  | `ics.Ics35_ExtrActivity.updateResultApprId` |
