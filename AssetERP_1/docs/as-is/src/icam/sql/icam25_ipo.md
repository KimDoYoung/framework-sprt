# icam25_ipo

`server/icam/mapper/icam25_ipo.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 21 | [`icam25_ipo`](../../../db/tables/icam.md) |  | - |
| `selectIcamIpo` | select | 28 | `sjg1fc` ⚠DB없음, `sjg1jc` ⚠DB없음, `szx0aa` ⚠DB없음 |  | - |
| `insert` | insert | 56 | [`icam25_ipo`](../../../db/tables/icam.md) | `f_create_batchseq`, `f_sysdate` | - |
| `delete` | delete | 71 | [`icam25_ipo`](../../../db/tables/icam.md) |  | - |
