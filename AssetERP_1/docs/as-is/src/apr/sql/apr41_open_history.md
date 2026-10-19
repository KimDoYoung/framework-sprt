# apr41_open_history

`server/apr/mapper/apr41_open_history.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`apr41_open_history`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr41_OpenHistory.selectById` |
| `selectByApprId` | select | 29 | [`apr41_open_history`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr41_OpenHistory.selectByApprId` |
| `selectByApprIdPaging` | select | 40 | [`apr41_open_history`](../../../db/tables/apr.md) | `f_cdnm`, `f_emp_kor_nm`, `f_get_emptrans`, `f_sysdate` | `apr.Apr41_OpenHistory.selectByApprIdPaging` |
| `selectByApprIdTotal` | select | 53 | [`apr41_open_history`](../../../db/tables/apr.md) |  | `apr.Apr41_OpenHistory.selectByApprIdPaging` |
| `insert` | insert | 59 | [`apr41_open_history`](../../../db/tables/apr.md) | `f_create_seq`, `f_sysdate` | `apr.Apr41_OpenHistory.insert` |
