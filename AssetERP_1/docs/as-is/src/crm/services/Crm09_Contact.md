# crm.Crm09_Contact

`server/crm/Crm09_Contact.java`

서비스 키 `crm.Crm09_Contact.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByAll` | 28 | `crm09_contact.selectByAll`(없음) | - |  |
| `selectByCompanyName` | 35 | [`crm09_contact.selectByCompanyName`](../../crm/sql/crm09_contact.md) | - |  |
| `selectByName` | 59 | [`crm09_contact.selectByName`](../../crm/sql/crm09_contact.md) | `Crm09_Lookup_SelectSingle` |  |
| `selectByPaging` | 82 | [`crm09_contact.selectByNamePaging`](../../crm/sql/crm09_contact.md), [`crm09_contact.selectByNameTotal`](../../crm/sql/crm09_contact.md) | `Crm09_Lookup_Select`, `Crm09_Lookup_SelectMulti`, `Crm09_Tab_ContactPoint` |  |
| `selectKeyInCompanyName` | 88 | [`crm09_contact.selectKeyInCompanyName`](../../crm/sql/crm09_contact.md) | `Crm09_Lookup_SelectSingle` |  |
| `selectBiz02Company` | 93 | [`crm09_contact.selectBiz02Company`](../../crm/sql/crm09_contact.md) | `Crm09_Lookup_SelectSingle` |  |
| `selectBiz02Emp` | 98 | [`crm09_contact.selectBiz02Emp`](../../crm/sql/crm09_contact.md) | `Crm09_Lookup_SelectSingle` |  |
| `modelUpdate` | 103 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crm09_contact)` 동적 INSERT/UPDATE | `Crm09_Lookup_ContactPoint` | `UpdateDataModel` |
| `update` | 116 | `UpdateDataModel(crm09_contact)` 동적 INSERT/UPDATE | `Crm09_Edit_ContactPoint` | `UpdateDataModel` |
| `delete` | 121 | `UpdateDataModel(crm09_contact)` 동적 DELETE | `Crm09_Edit_ContactPoint`, `Crm09_Tab_ContactPoint` | `UpdateDataModel` |
