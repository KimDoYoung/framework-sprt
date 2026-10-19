# emp14_account

`server/emp/mapper/emp14_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 24 | [`emp14_account`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | - |
| `selectByPersonId` | select | 32 | [`emp14_account`](../../../db/tables/emp.md) | `f_cdnm`, `f_sysdate`, `to_decrypts` | `emp.Emp14_Account.selectByPersonId` |
