# sch.Sch11_IpoCompany

`server/sch/Sch11_IpoCompany.java`

서비스 키 `sch.Sch11_IpoCompany.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`sch11_ipo_company.selectById`](../../sch/sql/sch11_ipo_company.md) | - |  |
| `selectByIpoId` | 24 | [`sch11_ipo_company.selectByIpoId`](../../sch/sql/sch11_ipo_company.md) | `Sch11_Edit_IpoAlarmSetup` |  |
| `insertInterest` | 29 | [`sch11_ipo_company.insertInterest`](../../sch/sql/sch11_ipo_company.md) | `Sch10_Tab_Ipo`, `Sch10_Tab_Ipo2` |  |
| `update` | 44 | `UpdateDataModel(sch11_ipo_company)` 동적 INSERT/UPDATE | `Sch11_Edit_IpoAlarmSetup` | `UpdateDataModel` |
| `delete` | 49 | `UpdateDataModel(sch11_ipo_company)` 동적 DELETE | - | `UpdateDataModel` |
