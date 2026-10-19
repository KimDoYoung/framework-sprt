# sch08_class

`server/sch/mapper/sch08_class.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`sch08_class`](../../../db/tables/sch.md) |  | `sch.Sch08_Class.selectById` |
| `selectByPersonId` | select | 21 | [`sch08_class`](../../../db/tables/sch.md) |  | `sch.Sch08_Class.selectByPersonId` |
| `insertByClassId` | insert | 28 | [`sch08_class`](../../../db/tables/sch.md) |  | `sch.Sch01_Info.copySchedule` |
