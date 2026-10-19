# fnd32_account

`server/fnd/mapper/fnd32_account.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 34 | [`fnd32_account`](../../../db/tables/fnd.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate`, `to_decrypts` | `fnd.Fnd32_Account.selectById` |
| `selectByText` | select | 50 | [`fnd32_account`](../../../db/tables/fnd.md) | `f_cdnm`, `f_get_corp_nm`, `f_sysdate`, `to_decrypts` | `fnd.Fnd32_Account.selectByText` |
| `excelInsert` | insert | 73 | [`fnd32_account`](../../../db/tables/fnd.md) | `f_create_seq` | - |
| `encrypts` | select | 111 | - | `to_encrypts` | `fnd.Fnd32_Account.copyUpdate`, `fnd.Fnd32_Account.updateList` |
