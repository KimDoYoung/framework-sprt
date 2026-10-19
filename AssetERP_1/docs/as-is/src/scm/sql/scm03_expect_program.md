# scm03_expect_program

`server/scm/mapper/scm03_expect_program.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 16 | [`scm03_expect_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_sysdate` | `scm.Scm03_ExpectProgram.selectById` |
| `selectBySrId` | select | 26 | [`scm03_expect_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_sysdate` | `scm.Scm03_ExpectProgram.selectBySrId` |
