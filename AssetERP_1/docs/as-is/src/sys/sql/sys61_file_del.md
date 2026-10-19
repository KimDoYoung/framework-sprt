# sys61_file_del

`server/sys/mapper/sys61_file_del.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`sys10_file`](../../../db/tables/sys.md), [`sys61_file_del`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `sys.Sys61_FileDel.selectById` |
| `selectByParentId` | select | 28 | [`sys10_file`](../../../db/tables/sys.md), [`sys61_file_del`](../../../db/tables/sys.md) | `f_emp_kor_nm` | `sys.Sys61_FileDel.selectByParentId` |
| `insert` | insert | 38 | [`sys61_file_del`](../../../db/tables/sys.md) | `f_sysdate` | `sys.Sys61_FileDel.insert` |
| `deleteByFileDelId` | delete | 60 | [`sys61_file_del`](../../../db/tables/sys.md) |  | `sys.Sys61_FileDel.recovery` |
