# chk.Chk01_ClassTree

`server/chk/Chk01_ClassTree.java`

서비스 키 `chk.Chk01_ClassTree.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`chk01_class_tree.selectById`](../../chk/sql/chk01_class_tree.md) | - |  |
| `selectByLinkCode` | 25 | [`chk01_class_tree.selectByLinkCode`](../../chk/sql/chk01_class_tree.md) | `Chk02_Lookup_UseYn`, `Chk02_Tab_DailyList`, `Chk02_Tab_DailyListAdmin`, `Chk03_Tab_DailyListConfirm`, `Chk03_Tab_DailyListStatus`, `Chk03_Tab_DailyListWrite` |  |
| `selectByAll` | 30 | [`chk01_class_tree.selectByParentId`](../../chk/sql/chk01_class_tree.md) | `Chk01_Tab_ClassTree` |  |
| `selectByCompanyId` | 53 | [`chk01_class_tree.selectByCompanyId`](../../chk/sql/chk01_class_tree.md) | `Chk01_Lookup_ClassTree` |  |
| `update` | 90 | `UpdateDataModel(chk01_class_tree)` 동적 INSERT/UPDATE | `Chk01_Edit_ClassTree` | `UpdateDataModel` |
| `delete` | 95 | `UpdateDataModel(chk01_class_tree)` 동적 DELETE | `Chk01_Edit_ClassTree` | `UpdateDataModel` |
