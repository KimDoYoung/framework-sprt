# sch14_ipo_mismatch

`server/sch/mapper/sch14_ipo_mismatch.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`sch14_ipo_mismatch`](../../../db/tables/sch.md) |  | `sch.Sch14_IpoMismatch.selectById` |
| `selectByIpoId` | select | 27 | [`sch14_ipo_mismatch`](../../../db/tables/sch.md) |  | - |
| `selectByCheckYn` | select | 35 | [`sch14_ipo_mismatch`](../../../db/tables/sch.md) |  | `sch.Sch14_IpoMismatch.selectByCheckYn` |
| `createIpoMismatch` | select | 44 | - | `f_create_ipomismatch` | `sch.Sch14_IpoMismatch.createIpoMismatch` |
| `insert` | insert | 48 | [`sch14_ipo_mismatch`](../../../db/tables/sch.md) | `f_create_batchseq`, `f_sysdate` | - |
| `deleteByCheckYn` | delete | 62 | [`sch14_ipo_mismatch`](../../../db/tables/sch.md) |  | - |
