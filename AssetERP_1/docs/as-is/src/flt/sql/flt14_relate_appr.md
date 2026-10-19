# flt14_relate_appr

`server/flt/mapper/flt14_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`flt14_relate_appr`](../../../db/tables/flt.md) |  | `flt.Flt14_RelateAppr.selectById` |
| `selectByStdDate` | select | 26 | [`apr01_appr`](../../../db/tables/apr.md), [`emp01_person`](../../../db/tables/emp.md), [`flt14_relate_appr`](../../../db/tables/flt.md) | `f_cdnm` | `flt.Flt14_RelateAppr.selectByStdDate` |
| `checkAppr` | select | 40 | [`apr01_appr`](../../../db/tables/apr.md), [`flt14_relate_appr`](../../../db/tables/flt.md) |  | `flt.Flt10_Tr.countByTrDate` |
| `insertApprId` | insert | 48 | [`flt14_relate_appr`](../../../db/tables/flt.md) | `f_create_seq` | `flt.Flt14_RelateAppr.insertApprId` |
