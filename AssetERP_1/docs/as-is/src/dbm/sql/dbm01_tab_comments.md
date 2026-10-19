# dbm01_tab_comments

`server/dbm/mapper/dbm01_tab_comments.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `table_comments_tibero` | sql | 16 | - |  |  |
| `table_comments_postgresql` | sql | 27 | - |  |  |
| `selectByTableName` | select | 61 | - |  | `dbm.Dbm01_TabComments.selectByTableName` |
| `callByDDLRun` | select | 74 | - |  | `dbm.Dbm00_DDLRun.callByDDLRun`, `dbm.Dbm01_TabComments.update`, `dbm.Dbm02_ColComments.update` |
