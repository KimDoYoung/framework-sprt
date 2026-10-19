# crd.Crd02_Data

`server/crd/Crd02_Data.java`

서비스 키 `crd.Crd02_Data.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`crd02_data.selectById`](../../crd/sql/crd02_data.md) | - |  |
| `selectByCardNo` | 26 | [`crd02_data.selectByCardNo`](../../crd/sql/crd02_data.md) | `Crd01_Edit_Card`, `Crd01_Tab_Card` |  |
| `selectByCompareAmt` | 38 | [`crd02_data.selectByCompareAmt`](../../crd/sql/crd02_data.md) | `Crd02_Lookup_OtherList` |  |
| `selectByAmt` | 50 | [`crd02_data.selectByAmt`](../../crd/sql/crd02_data.md) | `Crd02_Tab_DataUpload` |  |
| `selectByText` | 80 | [`crd02_data.selectByText`](../../crd/sql/crd02_data.md) | `Crd02_Tab_DataUpload` |  |
| `selectByPaging` | 111 | [`crd02_data.selectByTextPaging`](../../crd/sql/crd02_data.md), [`crd02_data.selectByTextTotal`](../../crd/sql/crd02_data.md) | `Crd02_Tab_DataUpload` |  |
| `targetDelete` | 136 | [`biz01_promo.deleteByCrd02`](../../biz/sql/biz01_promo.md), [`crd02_data.targetDelete`](../../crd/sql/crd02_data.md) | `Crd02_Tab_DataUpload` |  |
| `deleteBiz` | 152 | [`biz01_promo.deleteBiz`](../../biz/sql/biz01_promo.md) | `Crd02_Tab_DataUpload` |  |
| `copyUpdate` | 170 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crd02_data)` 동적 INSERT/UPDATE | `Crd02_Tab_DataUpload` | `UpdateDataModel` |
| `update` | 183 | `UpdateDataModel(crd02_data)` 동적 INSERT/UPDATE | `Crd02_Edit_DataUpload` | `UpdateDataModel` |
| `delete` | 188 | `UpdateDataModel(crd02_data)` 동적 DELETE | `Crd02_Tab_DataUpload` | `UpdateDataModel` |
