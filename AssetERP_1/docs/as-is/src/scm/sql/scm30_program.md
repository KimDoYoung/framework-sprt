# scm30_program

`server/scm/mapper/scm30_program.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 28 | [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `scm.Scm30_Program.modelUpdate`, `scm.Scm30_Program.selectById` |
| `selectByCompanyId` | select | 38 | [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `scm.Scm30_Program.selectByCompanyId` |
| `whereCondition` | sql | 62 | - |  |  |
| `selectByCompanyIdPaging` | select | 68 | [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `scm.Scm30_Program.selectByPaging` |
| `selectByCompanyIdTotal` | select | 94 | [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `scm.Scm30_Program.selectByPaging` |
| `selectByText` | select | 113 | [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `scm.Scm30_Program.selectByText` |
| `selectByTextPaging` | select | 136 | [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `scm.Scm30_Program.selectByTextPaging` |
| `selectByTextPagingTotal` | select | 161 | [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_sysdate` | `scm.Scm30_Program.selectByTextPaging` |
| `selectByProgramCode` | select | 182 | [`scm30_program`](../../../db/tables/scm.md) | `f_cdnm`, `f_sysdate` | `scm.Scm13_DevProgram.modelUpdate`, `scm.Scm30_Program.modelUpdate` |
| `selectBySystemCode` | select | 202 | [`scm13_dev_program`](../../../db/tables/scm.md), [`scm30_program`](../../../db/tables/scm.md), [`sys10_file`](../../../db/tables/sys.md) | `f_cdnm`, `f_emp_kor_nm`, `f_sysdate` | `scm.Scm30_Program.selectBySystemCode` |
| `insert` | insert | 222 | [`scm30_program`](../../../db/tables/scm.md) |  | - |
| `updateRegDate` | update | 244 | [`scm30_program`](../../../db/tables/scm.md) |  | `scm.Scm13_DevProgram.modelUpdate`, `scm.Scm30_Program.modelUpdate` |
| `updateUseYn` | update | 250 | [`scm30_program`](../../../db/tables/scm.md) |  | `scm.Scm30_Program.updateUseYn` |
