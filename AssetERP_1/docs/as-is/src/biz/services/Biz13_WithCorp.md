# biz.Biz13_WithCorp

`server/biz/Biz13_WithCorp.java`

서비스 키 `biz.Biz13_WithCorp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`biz13_with_corp.selectById`](../../biz/sql/biz13_with_corp.md) | - |  |
| `selectByCompanyId` | 25 | `biz13_with_corp.selectByCompanyId`(없음) | - |  |
| `selectByText` | 31 | [`biz13_with_corp.selectByText`](../../biz/sql/biz13_with_corp.md) | `Biz13_Lookup_WithCorp` |  |
| `selectByHistoryContCorpId` | 40 | [`biz13_with_corp.selectByHistoryContCorpId`](../../biz/sql/biz13_with_corp.md) | `Biz13_TabPage_WithCorp` |  |
| `selectByWithGroupId` | 46 | `biz13_with_corp.selectByWithGroupId`(없음) | `Biz13_Page_WithCorp` |  |
| `getCorpName` | 52 | `biz13_with_corp.getCorpName`(없음) | `Biz13_Page_WithCorp` |  |
| `modelUpdate` | 61 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz13_with_corp)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 72 | `UpdateDataModel(biz13_with_corp)` 동적 INSERT/UPDATE | `Biz13_TabPage_WithCorp` | `UpdateDataModel` |
| `delete` | 77 | `UpdateDataModel(biz13_with_corp)` 동적 DELETE | `Biz13_TabPage_WithCorp` | `UpdateDataModel` |
