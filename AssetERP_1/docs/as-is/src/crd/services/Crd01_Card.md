# crd.Crd01_Card

`server/crd/Crd01_Card.java`

서비스 키 `crd.Crd01_Card.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`crd01_card.selectById`](../../crd/sql/crd01_card.md) | - |  |
| `selectByText` | 27 | [`crd01_card.selectByText`](../../crd/sql/crd01_card.md) | `Crd01_Tab_Card` |  |
| `update` | 49 | `UpdateDataModel(crd01_card)` 동적 INSERT/UPDATE | `Crd01_Edit_Card` | `UpdateDataModel` |
| `delete` | 54 | `UpdateDataModel(crd01_card)` 동적 DELETE | `Crd01_Tab_Card` | `UpdateDataModel` |
