# bbs.Bbs02_Notice

`server/bbs/Bbs02_Notice.java`

서비스 키 `bbs.Bbs02_Notice.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`bbs02_notice.selectById`](../../bbs/sql/bbs02_notice.md) | `Monitoring_Page_Relate` |  |
| `selectByCompanyId` | 29 | [`bbs02_notice.selectByCompanyId`](../../bbs/sql/bbs02_notice.md) | - |  |
| `selectByPersonId` | 48 | `bbs02_notice.selectByPersonId`(없음) | - |  |
| `selectByNoticeDetailCode` | 61 | [`bbs02_notice.selectByNoticeDetailCode`](../../bbs/sql/bbs02_notice.md) | - |  |
| `selectByTabBorder` | 75 | [`bbs02_notice.selectByTabBorder`](../../bbs/sql/bbs02_notice.md) | `Monitoring_Page_Notice` |  |
| `selectByOpenMessage` | 84 | [`bbs02_notice.selectByOpenMessage`](../../bbs/sql/bbs02_notice.md) | - |  |
| `selectByTargetCompany` | 97 | [`bbs02_notice.selectByTargetCompany`](../../bbs/sql/bbs02_notice.md) | `Bbs02_Lookup_NoticeAdmin`, `Calendar` |  |
| `selectByTargetPerson` | 111 | [`bbs02_notice.selectByTargetPerson`](../../bbs/sql/bbs02_notice.md) | `Frm01_Lookup_NoticeList` |  |
| `selectByPersonIdPaging` | 125 | [`bbs02_notice.selectByPersonIdPaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByPersonIdTotal`](../../bbs/sql/bbs02_notice.md) | `Bbs02_Tab_NoticeView` |  |
| `selectByCompanyIdPaging` | 131 | [`bbs02_notice.selectByCompanyIdPaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByCompanyIdTotal`](../../bbs/sql/bbs02_notice.md) | `Bbs02_Lookup_LoadBbs`, `Bbs02_Tab_NoticeManager` |  |
| `selectByPublicYnPaging` | 137 | [`bbs02_notice.selectByPublicYnPaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByPublicYnTotal`](../../bbs/sql/bbs02_notice.md) | `Bbs02_Tab_NoticeAdmin` |  |
| `selectByNoticeDetailCodePaging` | 143 | [`bbs02_notice.selectByNoticeDetailCodePaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectByNoticeDetailCodeTotal`](../../bbs/sql/bbs02_notice.md) | `Bbs02_Tab_NoticeViewLaw`, `Bbs02_Tab_NoticeViewMgt` |  |
| `selectPersonNotice` | 149 | [`bbs02_notice.selectPersonNotice`](../../bbs/sql/bbs02_notice.md) | `Monitoring_Page_Relate` |  |
| `selectPersonNoticePaging` | 155 | [`bbs02_notice.selectPersonNoticePaging`](../../bbs/sql/bbs02_notice.md), [`bbs02_notice.selectPersonNoticePagingTotal`](../../bbs/sql/bbs02_notice.md) | - |  |
| `getNoticeNo` | 161 | [`bbs02_notice.getNoticeNo`](../../bbs/sql/bbs02_notice.md) | - |  |
| `modelUpdate` | 167 | [`bbs02_notice.getNoticeNo`](../../bbs/sql/bbs02_notice.md), `UpdateDataModel(bbs02_notice)` 동적 INSERT/UPDATE | `Bbs02_Edit_NoticeAdmin` | `UpdateDataModel` |
| `update` | 181 | [`bbs02_notice.getNoticeNo`](../../bbs/sql/bbs02_notice.md), `UpdateDataModel(bbs02_notice)` 동적 INSERT/UPDATE | `Bbs02_Edit_Notice` | `UpdateDataModel` |
| `delete` | 196 | `UpdateDataModel(bbs02_notice)` 동적 DELETE | `Bbs02_Edit_Notice`, `Bbs02_Edit_NoticeAdmin` | `UpdateDataModel` |
