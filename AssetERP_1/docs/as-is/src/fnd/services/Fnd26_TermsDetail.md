# fnd.Fnd26_TermsDetail

`server/fnd/Fnd26_TermsDetail.java`

서비스 키 `fnd.Fnd26_TermsDetail.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 21 | [`fnd26_terms_detail.selectById`](../../fnd/sql/fnd26_terms_detail.md) | - |  |
| `selectBySearchText` | 27 | [`fnd26_terms_detail.selectBySearchText`](../../fnd/sql/fnd26_terms_detail.md) | `Fnd25_Tab_FundTermsManager` |  |
| `selectBySearchTextManager` | 32 | [`fnd26_terms_detail.selectBySearchTextManager`](../../fnd/sql/fnd26_terms_detail.md) | `Fnd25_Grid_FundTermsDetail` |  |
| `update` | 37 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`fnd26_terms_detail.RevisionNoCheck`](../../fnd/sql/fnd26_terms_detail.md), `UpdateDataModel(fnd25_terms)` 동적 INSERT/UPDATE, `UpdateDataModel(fnd26_terms_detail)` 동적 INSERT/UPDATE | `Fnd25_Edit_FundTermsManager`, `Fnd25_Lookup_FundTermsManager` | `UpdateDataModel` |
| `deleteAll` | 125 | [`fnd25_terms.deleteByTermsId`](../../fnd/sql/fnd25_terms.md), [`fnd26_terms_detail.deleteByTermsId`](../../fnd/sql/fnd26_terms_detail.md) | `Fnd25_Lookup_FundTermsManager` |  |
| `delete` | 137 | `UpdateDataModel(fnd26_terms_detail)` 동적 DELETE | `Fnd25_Grid_FundTermsDetail` | `UpdateDataModel` |
