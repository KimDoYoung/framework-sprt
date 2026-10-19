# bbs.Bbs20_FloralRequest

`server/bbs/Bbs20_FloralRequest.java`

서비스 키 `bbs.Bbs20_FloralRequest.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`bbs20_floral_request.selectById`](../../bbs/sql/bbs20_floral_request.md) | `Bbs20_Edit_FloralRequest` |  |
| `selectByText` | 29 | [`bbs20_floral_request.selectByText`](../../bbs/sql/bbs20_floral_request.md) | `Bbs20_Tab_FloralRequest` |  |
| `selectByTextAdmin` | 44 | [`bbs20_floral_request.selectByTextAdmin`](../../bbs/sql/bbs20_floral_request.md) | `Bbs20_Tab_FloralRequestMng` |  |
| `sendMessage` | 58 | [`emp01_person.selectById`](../../emp/sql/emp01_person.md) | `Bbs20_Lookup_Message` | `SendSMSAPIFunction` |
| `modelUpdate` | 75 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs20_floral_request)` 동적 INSERT/UPDATE | `Bbs20_Edit_FloralRequest` | `UpdateDataModel` |
| `update` | 88 | `UpdateDataModel(bbs20_floral_request)` 동적 INSERT/UPDATE | `Bbs20_Tab_FloralRequestMng` | `UpdateDataModel` |
| `delete` | 93 | `UpdateDataModel(bbs20_floral_request)` 동적 DELETE | `Bbs20_Tab_FloralRequest` | `UpdateDataModel` |
