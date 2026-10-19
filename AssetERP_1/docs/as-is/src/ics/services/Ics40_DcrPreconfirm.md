# ics.Ics40_DcrPreconfirm

`server/ics/Ics40_DcrPreconfirm.java`

서비스 키 `ics.Ics40_DcrPreconfirm.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 23 | [`ics40_dcr_preconfirm.selectById`](../../ics/sql/ics40_dcr_preconfirm.md) | - |  |
| `selectByCompanyId` | 29 | [`ics40_dcr_preconfirm.selectByCompanyId`](../../ics/sql/ics40_dcr_preconfirm.md) | `Ics41_Lookup_DcrType` |  |
| `selectByApprId` | 39 | [`ics40_dcr_preconfirm.selectByApprId`](../../ics/sql/ics40_dcr_preconfirm.md) | `Apr01_Tab_MyRequestList` |  |
| `selectByDate` | 50 | [`ics40_dcr_preconfirm.selectByDate`](../../ics/sql/ics40_dcr_preconfirm.md) | `Ics40_Lookup_SelectSingle` |  |
| `selectByConfirm` | 64 | [`ics40_dcr_preconfirm.selectByConfirm`](../../ics/sql/ics40_dcr_preconfirm.md) | `Ics40_Tab_DcrPreConfirm` |  |
| `selectByReviewConfirm` | 78 | [`ics40_dcr_preconfirm.selectByReviewConfirm`](../../ics/sql/ics40_dcr_preconfirm.md) | `Ics40_Tab_DcrReviewConfirm` |  |
| `updateByStatus` | 94 | [`ics40_dcr_preconfirm.countByApprNo`](../../ics/sql/ics40_dcr_preconfirm.md), [`ics40_dcr_preconfirm.updateByStatus01`](../../ics/sql/ics40_dcr_preconfirm.md), [`ics40_dcr_preconfirm.updateByStatus02`](../../ics/sql/ics40_dcr_preconfirm.md) | `Ics40_Tab_DcrPreConfirm` |  |
| `modelUpdate` | 132 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), `UpdateDataModel(ics40_dcr_preconfirm)` 동적 INSERT/UPDATE | `Ics40_Edit_DcrPreconfirm`, `Ics40_Edit_Msg` | `UpdateDataModel` |
| `updateByStatus01` | 146 | [`ics40_dcr_preconfirm.updateByStatus01`](../../ics/sql/ics40_dcr_preconfirm.md) | `Ics40_Edit_DcrPreconfirm` |  |
| `update` | 163 | `UpdateDataModel(ics40_dcr_preconfirm)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 168 | `UpdateDataModel(ics40_dcr_preconfirm)` 동적 DELETE | `Ics40_Edit_DcrPreconfirm` | `UpdateDataModel` |
