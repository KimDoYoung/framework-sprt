# bbs.Bbs10_BizShare

`server/bbs/Bbs10_BizShare.java`

서비스 키 `bbs.Bbs10_BizShare.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`bbs10_biz_share.selectById`](../../bbs/sql/bbs10_biz_share.md) | - |  |
| `selectByText` | 26 | [`bbs10_biz_share.selectByText`](../../bbs/sql/bbs10_biz_share.md) | `Bbs10_Tab_BizShare` |  |
| `modelUpdate` | 39 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs10_biz_share)` 동적 INSERT/UPDATE | `Bbs10_Edit_BizShare` | `UpdateDataModel` |
| `update` | 52 | `UpdateDataModel(bbs10_biz_share)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 57 | `UpdateDataModel(bbs10_biz_share)` 동적 DELETE | `Bbs10_Tab_BizShare` | `UpdateDataModel` |
