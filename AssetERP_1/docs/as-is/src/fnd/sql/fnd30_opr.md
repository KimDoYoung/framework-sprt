# fnd30_opr

`server/fnd/mapper/fnd30_opr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 45 | [`apr01_appr`](../../../db/tables/apr.md), [`fnd30_opr`](../../../db/tables/fnd.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `fnd.Fnd30_Opr.selectById` |
| `selectByDate` | select | 57 | [`apr01_appr`](../../../db/tables/apr.md), [`fnd30_opr`](../../../db/tables/fnd.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate` | `fnd.Fnd30_Opr.selectByDate` |
| `selectByDemandDate` | select | 91 | [`apr01_appr`](../../../db/tables/apr.md), [`fnd30_opr`](../../../db/tables/fnd.md) | `f_cdnm`, `f_sysdate` | `fnd.Fnd30_Opr.selectByDemandDate` |
| `selectByDemandOprCode` | select | 108 | [`apr01_appr`](../../../db/tables/apr.md), [`fnd30_opr`](../../../db/tables/fnd.md), [`sch10_ipo`](../../../db/tables/sch.md) |  | `fnd.Fnd30_Opr.selectByDemandOprCode` |
| `updateApprId` | update | 131 | [`fnd30_opr`](../../../db/tables/fnd.md) |  | `fnd.Fnd30_Opr.updateApprId` |
