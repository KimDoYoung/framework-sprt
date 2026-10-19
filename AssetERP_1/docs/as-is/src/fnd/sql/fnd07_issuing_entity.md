# fnd07_issuing_entity

`server/fnd/mapper/fnd07_issuing_entity.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 23 | [`fnd07_issuing_entity`](../../../db/tables/fnd.md) |  | - |
| `selectByCodeName` | select | 30 | [`fnd07_issuing_entity`](../../../db/tables/fnd.md) | `f_cdnm`, `f_sysdate` | `fnd.Fnd07_IssuingEntity.selectByCodeName` |
| `selectBysearchText` | select | 37 | [`fnd07_issuing_entity`](../../../db/tables/fnd.md) |  | `fnd.Fnd07_IssuingEntity.selectBysearchText` |
| `insertUpdate` | insert | 43 | [`fnd07_issuing_entity`](../../../db/tables/fnd.md) |  | - |
