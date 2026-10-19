# bbs.Bbs31_Content

`server/bbs/Bbs31_Content.java`

서비스 키 `bbs.Bbs31_Content.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 22 | [`bbs31_content.selectById`](../../bbs/sql/bbs31_content.md) | `Bbs31_Lookup_Content` |  |
| `selectByClassTreeId` | 28 | [`bbs31_content.selectByClassTreeId`](../../bbs/sql/bbs31_content.md) | `Bbs30_Lookup_ClassTree` |  |
| `selectByParentTreeId` | 34 | [`bbs31_content.selectByParentTreeId`](../../bbs/sql/bbs31_content.md) | `Bbs30_Lookup_ClassTree` |  |
| `selectByClassTreeIdPaging` | 40 | [`bbs31_content.selectByClassTreeIdPaging`](../../bbs/sql/bbs31_content.md), [`bbs31_content.selectByClassTreeIdPagingTotal`](../../bbs/sql/bbs31_content.md) | `Bbs31_Grid_Content` |  |
| `modelUpdate` | 58 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(bbs31_content)` 동적 INSERT/UPDATE | `Bbs31_Edit_Content` | `UpdateDataModel` |
| `modelDelete` | 79 | `UpdateDataModel(bbs31_content)` 동적 DELETE | `Bbs31_Lookup_Content` | `UpdateDataModel` |
| `update` | 88 | `UpdateDataModel(bbs31_content)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 93 | `UpdateDataModel(bbs31_content)` 동적 DELETE | - | `UpdateDataModel` |
