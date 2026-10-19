# icam01_data_info

`server/icam/mapper/icam01_data_info.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`icam01_data_info`](../../../db/tables/icam.md), [`ics01_class_tree`](../../../db/tables/ics.md) |  | `icam.Icam01_DataInfo.selectById` |
| `selectByInfoCodeAndTrCode` | select | 27 | [`icam01_data_info`](../../../db/tables/icam.md), [`ics01_class_tree`](../../../db/tables/ics.md) |  | - |
| `selectBySearchText` | select | 36 | [`icam01_data_info`](../../../db/tables/icam.md), [`ics01_class_tree`](../../../db/tables/ics.md) |  | `icam.Icam01_DataInfo.selectBySearchText` |
| `selectIcamInfoData` | select | 45 | - |  | - |
| `insertUpdate` | insert | 53 | [`icam01_data_info`](../../../db/tables/icam.md) | `f_create_seq` | - |
