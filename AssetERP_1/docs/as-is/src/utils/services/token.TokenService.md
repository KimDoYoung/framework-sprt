# utils.token.TokenService

`server/utils/token/TokenService.java`

서비스 키 `utils.token.TokenService.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `makeToken` | 19 | [`tmp_token.insertByToken`](../../utils/sql/tmp_token.md), [`tmp_token.selectByPersonId`](../../utils/sql/tmp_token.md) | `MainFrame` |  |
| `checkToken` | 39 | [`tmp_token.deleteByToken`](../../utils/sql/tmp_token.md), [`tmp_token.selectByToken`](../../utils/sql/tmp_token.md) | - |  |
