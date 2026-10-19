# bbs.Bbs22_FloralMessage

`server/bbs/Bbs22_FloralMessage.java`

서비스 키 `bbs.Bbs22_FloralMessage.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`bbs22_floral_message.selectById`](../../bbs/sql/bbs22_floral_message.md) | - |  |
| `selectByCompanyId` | 24 | [`bbs22_floral_message.selectByCompanyId`](../../bbs/sql/bbs22_floral_message.md) | `Bbs22_Lookup_FloralMessage` |  |
| `getMessage` | 30 | [`bbs22_floral_message.getMessage`](../../bbs/sql/bbs22_floral_message.md) | `Bbs20_Edit_FloralRequest` |  |
| `checkOccasionsCode` | 39 | [`bbs22_floral_message.deleteCode`](../../bbs/sql/bbs22_floral_message.md), [`bbs22_floral_message.insertCode`](../../bbs/sql/bbs22_floral_message.md) | `Bbs22_Lookup_FloralMessage` |  |
| `update` | 49 | `UpdateDataModel(bbs22_floral_message)` 동적 INSERT/UPDATE | `Bbs22_Lookup_FloralMessage` | `UpdateDataModel` |
| `delete` | 54 | `UpdateDataModel(bbs22_floral_message)` 동적 DELETE | - | `UpdateDataModel` |
