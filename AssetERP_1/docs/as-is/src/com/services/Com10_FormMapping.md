# com.Com10_FormMapping

`server/com/Com10_FormMapping.java`

서비스 키 `com.Com10_FormMapping.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`com10_form_mapping.selectById`](../../com/sql/com10_form_mapping.md) | `Dcr30_Lookup_Link`, `Dcr30_TabPage_Company`, `Dcr30_Tab_LinkAdmin` |  |
| `selectByCompanyId` | 25 | [`com10_form_mapping.selectByCompanyId`](../../com/sql/com10_form_mapping.md) | - |  |
| `selectByLinkCode` | 35 | [`com10_form_mapping.selectByLinkCode`](../../com/sql/com10_form_mapping.md) | `Apr01_Edit_ApprDoc` |  |
| `modelUpdate` | 46 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`dcr30_link.updateFormMappingId`](../../dcr/sql/dcr30_link.md), `UpdateDataModel(com10_form_mapping)` 동적 INSERT/UPDATE | `Com10_Lookup_CommonMapping` | `UpdateDataModel` |
| `update` | 70 | `UpdateDataModel(com10_form_mapping)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 75 | `UpdateDataModel(com10_form_mapping)` 동적 DELETE | - | `UpdateDataModel` |
