# bbs.Bbs21_FloralRequestShare

`server/bbs/Bbs21_FloralRequestShare.java`

서비스 키 `bbs.Bbs21_FloralRequestShare.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`bbs21_floral_request_share.selectById`](../../bbs/sql/bbs21_floral_request_share.md) | - |  |
| `selectByFloralRequestId` | 22 | [`bbs21_floral_request_share.selectByFloralRequestId`](../../bbs/sql/bbs21_floral_request_share.md) | `Bbs21_Lookup_FloralRequestShare` |  |
| `selectShareInfo` | 28 | [`bbs21_floral_request_share.selectShareInfo`](../../bbs/sql/bbs21_floral_request_share.md) | `Bbs21_Lookup_FloralRequestShare` |  |
| `insertDefaultShare` | 33 | [`bbs21_floral_request_share.insertDefaultShare`](../../bbs/sql/bbs21_floral_request_share.md), [`bbs21_floral_request_share.selectShareInfo`](../../bbs/sql/bbs21_floral_request_share.md) | `Bbs20_Edit_FloralRequest` |  |
| `deleteDefaultShare` | 42 | [`bbs21_floral_request_share.deleteByFloralRequestId`](../../bbs/sql/bbs21_floral_request_share.md) | `Bbs20_Edit_FloralRequest` |  |
| `update` | 47 | `UpdateDataModel(bbs21_floral_request_share)` 동적 INSERT/UPDATE | `Bbs21_Lookup_FloralRequestShare` | `UpdateDataModel` |
| `delete` | 52 | `UpdateDataModel(bbs21_floral_request_share)` 동적 DELETE | `Bbs21_Lookup_FloralRequestShare` | `UpdateDataModel` |
