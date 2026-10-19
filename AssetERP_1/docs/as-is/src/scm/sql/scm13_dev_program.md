# scm13_dev_program

`server/scm/mapper/scm13_dev_program.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 27 | [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_sysdate` | `scm.Scm13_DevProgram.selectById` |
| `selectByDevId` | select | 38 | [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_sysdate` | `scm.Scm13_DevProgram.selectByDevId` |
| `selectByDeployTgtDevId` | select | 50 | [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `scm.Scm13_DevProgram.selectByDeployTgtDevId` |
| `updateNote` | update | 64 | [`scm13_dev_program`](../../../db/tables/scm.md) |  | `scm.Scm13_DevProgram.updateNote` |
| `updateDeploy` | update | 70 | [`scm13_dev_program`](../../../db/tables/scm.md) |  | `scm.Scm13_DevProgram.updateDeploy` |
| `insert` | insert | 77 | [`scm13_dev_program`](../../../db/tables/scm.md) |  | - |
