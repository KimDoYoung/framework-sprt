# biz.Biz10_ContCorp

`server/biz/Biz10_ContCorp.java`

서비스 키 `biz.Biz10_ContCorp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`biz10_cont_corp.selectById`](../../biz/sql/biz10_cont_corp.md) | `Biz11_TabPage_ContHistory`, `Biz13_TabPage_WithCorp`, `Biz16_TabPage_EachCont`, `Biz17_TabPage_DualManageFund` |  |
| `selectByText` | 27 | [`biz10_cont_corp.selectByText`](../../biz/sql/biz10_cont_corp.md) | `Biz10_Lookup_ContCorp`, `Biz10_Tab_ContCorp` |  |
| `modelUpdate` | 50 | `UpdateDataModel(biz10_cont_corp)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `insertUpdate` | 59 | [`biz15_share.insertUpdate`](../../biz/sql/biz15_share.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz10_cont_corp)` 동적 INSERT/UPDATE, `UpdateDataModel(biz11_cont_history)` 동적 INSERT/UPDATE, `UpdateDataModel(biz12_fee_info)` 동적 INSERT/UPDATE | `Biz11_Edit_ContHistory`, `Biz11_TabPage_ContHistory` | `UpdateDataModel` |
| `update` | 109 | `UpdateDataModel(biz10_cont_corp)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 114 | `UpdateDataModel(biz10_cont_corp)` 동적 DELETE | `Biz10_Tab_ContCorp` | `UpdateDataModel` |
