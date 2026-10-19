# crm.Crm12_WorkDetail

`server/crm/Crm12_WorkDetail.java`

서비스 키 `crm.Crm12_WorkDetail.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`crm12_work_detail.selectById`](../../crm/sql/crm12_work_detail.md) | - |  |
| `selectByContactId` | 25 | [`crm12_work_detail.selectByContactId`](../../crm/sql/crm12_work_detail.md) | `Crm12_Grid_WorkDetail` |  |
| `selectByRegDate` | 31 | [`crm12_work_detail.selectByRegDate`](../../crm/sql/crm12_work_detail.md) | - |  |
| `selectByRegDatePaging` | 37 | [`crm12_work_detail.selectByRegDatePaging`](../../crm/sql/crm12_work_detail.md), [`crm12_work_detail.selectByRegDatePagingTotal`](../../crm/sql/crm12_work_detail.md) | - |  |
| `checkByContactId` | 43 | [`crm12_work_detail.checkByContactId`](../../crm/sql/crm12_work_detail.md) | `Crm09_Tab_ContactPoint` |  |
| `modelUpdate` | 58 | [`crm15_share.deleteByWorkDetailId`](../../crm/sql/crm15_share.md), [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(crm12_work_detail)` 동적 INSERT/UPDATE | `Crm12_Lookup_WorkDetail` | `UpdateDataModel` |
| `update` | 77 | `UpdateDataModel(crm12_work_detail)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 82 | `UpdateDataModel(crm12_work_detail)` 동적 DELETE | `Crm12_Grid_WorkDetail` | `UpdateDataModel` |
