# apr.Apr15_ReprCorp

`server/apr/Apr15_ReprCorp.java`

서비스 키 `apr.Apr15_ReprCorp.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 18 | [`apr15_repr_corp.selectById`](../../apr/sql/apr15_repr_corp.md) | - |  |
| `selectByCompanyId` | 23 | [`apr15_repr_corp.selectByCompanyId`](../../apr/sql/apr15_repr_corp.md) | `Apr15_Lookup_ReprCorp`, `Apr15_Tab_ReprCorp` |  |
| `selectCorpRegYn` | 28 | [`apr15_repr_corp.selectCorpRegYn`](../../apr/sql/apr15_repr_corp.md) | `Apr16_Lookup_StampDocAppl`, `Apr16_Lookup_StampDocReg` |  |
| `update` | 33 | `UpdateDataModel(apr15_repr_corp)` 동적 INSERT/UPDATE | `Apr15_Tab_ReprCorp` | `UpdateDataModel` |
| `delete` | 38 | [`apr16_stamp_doc.selectByReprCorpId`](../../apr/sql/apr16_stamp_doc.md), `UpdateDataModel(apr15_repr_corp)` 동적 DELETE | `Apr15_Tab_ReprCorp` | `UpdateDataModel` |
