# opr03_reg

`server/opr/mapper/opr03_reg.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 25 | [`emp00_trans_info`](../../../db/views.md), [`opr01_create`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md), [`sys10_file`](../../../db/tables/sys.md) |  | `opr.Opr01_Create.insertAppr` |
| `selectByCreateId` | select | 44 | [`emp00_trans_info`](../../../db/views.md), [`opr01_create`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md), [`sys10_file`](../../../db/tables/sys.md) |  | `opr.Opr03_Reg.selectByCreateId` |
| `selectOnePreRegCheck` | select | 78 | [`opr03_reg`](../../../db/tables/opr.md) |  | `opr.Opr03_Reg.selectOnePreRegCheck` |
| `selectOnePreCancelCheck` | select | 90 | [`apr01_appr`](../../../db/tables/apr.md), [`opr01_create`](../../../db/tables/opr.md), [`opr03_reg`](../../../db/tables/opr.md) |  | `opr.Opr03_Reg.selectOnePreCancelCheck` |
