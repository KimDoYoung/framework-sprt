# biz.Biz16_EachCont

`server/biz/Biz16_EachCont.java`

서비스 키 `biz.Biz16_EachCont.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`biz16_each_contract.selectById`](../../biz/sql/biz16_each_contract.md) | - |  |
| `selectByCorpId` | 25 | [`biz16_each_contract.selectByCorpId`](../../biz/sql/biz16_each_contract.md) | `Biz16_TabPage_EachCont` |  |
| `selectByContCorpId` | 34 | [`biz16_each_contract.selectByContCorpId`](../../biz/sql/biz16_each_contract.md) | `Biz16_TabPage_EachCont` |  |
| `updateApprId` | 43 | [`biz16_each_contract.updateApprId`](../../biz/sql/biz16_each_contract.md) | `Biz16_TabPage_EachCont` |  |
| `modelUpdate` | 52 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(biz16_each_contract)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `update` | 63 | `UpdateDataModel(biz16_each_contract)` 동적 INSERT/UPDATE | `Biz16_TabPage_EachCont` | `UpdateDataModel` |
| `delete` | 68 | `UpdateDataModel(biz16_each_contract)` 동적 DELETE | `Biz16_TabPage_EachCont` | `UpdateDataModel` |
