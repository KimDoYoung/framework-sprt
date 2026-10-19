# car05_relate_appr

`server/car/mapper/car05_relate_appr.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 17 | [`apr01_appr`](../../../db/tables/apr.md), [`car05_relate_appr`](../../../db/tables/car.md) | `f_cdnm` | `car.Car05_RelateAppr.selectById` |
| `selectByStdMonth` | select | 26 | [`apr01_appr`](../../../db/tables/apr.md), [`car05_relate_appr`](../../../db/tables/car.md) | `f_cdnm` | `car.Car05_RelateAppr.selectByStdMonth` |
| `checkRelateApprId` | select | 37 | [`car05_relate_appr`](../../../db/tables/car.md) |  | `car.Car05_RelateAppr.insert` |
| `updateApprId` | update | 45 | [`car05_relate_appr`](../../../db/tables/car.md) |  | `car.Car05_RelateAppr.updateApprId` |
| `insert` | insert | 51 | [`car05_relate_appr`](../../../db/tables/car.md) |  | `car.Car05_RelateAppr.insert` |
