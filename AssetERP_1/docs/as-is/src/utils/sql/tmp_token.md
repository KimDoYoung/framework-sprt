# tmp_token

`server/utils/token/mapper/tmp_token.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 14 | [`tmp_token`](../../../db/tables/_etc.md) |  | - |
| `selectByPersonId` | select | 20 | [`tmp_token`](../../../db/tables/_etc.md) |  | `utils.token.TokenService.makeToken` |
| `selectByToken` | select | 28 | [`tmp_token`](../../../db/tables/_etc.md) |  | `utils.token.TokenService.checkToken` |
| `insertByToken` | insert | 36 | [`tmp_token`](../../../db/tables/_etc.md) | `f_create_seq`, `f_sysdate` | `utils.token.TokenService.makeToken` |
| `deleteByToken` | delete | 46 | [`tmp_token`](../../../db/tables/_etc.md) |  | `utils.token.TokenService.checkToken` |
