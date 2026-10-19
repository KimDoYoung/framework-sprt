# flt04_oath

`server/flt/mapper/flt04_oath.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 18 | [`apr01_appr`](../../../db/tables/apr.md), [`flt04_oath`](../../../db/tables/flt.md) | `f_cdnm` | `flt.Flt04_Oath.selectById` |
| `selectByPersonId` | select | 28 | [`apr01_appr`](../../../db/tables/apr.md), [`flt04_oath`](../../../db/tables/flt.md) | `f_cdnm` | `flt.Flt04_Oath.selectByPersonId` |
| `selectByDate` | select | 39 | [`apr01_appr`](../../../db/tables/apr.md), [`flt04_oath`](../../../db/tables/flt.md) | `f_cdnm` | `flt.Flt04_Oath.selectByDate` |
| `selectByStratDate` | select | 53 | [`flt04_oath`](../../../db/tables/flt.md) |  | `flt.Flt04_Oath.updateApprId` |
| `updateApprId` | update | 62 | [`flt04_oath`](../../../db/tables/flt.md) |  | `flt.Flt04_Oath.updateApprId` |
| `insertApprId` | insert | 70 | [`flt04_oath`](../../../db/tables/flt.md) | `f_create_seq` | `flt.Flt04_Oath.updateApprId` |
