# com.Com11_FormMappingMulti

`server/com/Com11_FormMappingMulti.java`

서비스 키 `com.Com11_FormMappingMulti.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`com11_form_mapping_multi.selectById`](../../com/sql/com11_form_mapping_multi.md) | - |  |
| `selectByCompanyId` | 25 | [`com11_form_mapping_multi.selectByCompanyId`](../../com/sql/com11_form_mapping_multi.md) | - |  |
| `selectByLinkCode` | 35 | [`com11_form_mapping_multi.selectByLinkCode`](../../com/sql/com11_form_mapping_multi.md) | - |  |
| `selectByDetailCode` | 46 | [`com11_form_mapping_multi.selectByDetailCode`](../../com/sql/com11_form_mapping_multi.md) | `Apr01_Edit_ApprDoc` |  |
| `getUpdateModel` | 59 | [`com11_form_mapping_multi.selectByDetailCode`](../../com/sql/com11_form_mapping_multi.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com11_form_mapping_multi)` 동적 INSERT/UPDATE | `Est01_Tab_PfFeeType` | `UpdateDataModel` |
| `modelUpdate` | 89 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(com11_form_mapping_multi)` 동적 INSERT/UPDATE | `Com11_Lookup_FormMappingMulti` | `UpdateDataModel` |
| `update` | 102 | `UpdateDataModel(com11_form_mapping_multi)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 107 | `UpdateDataModel(com11_form_mapping_multi)` 동적 DELETE | - | `UpdateDataModel` |
