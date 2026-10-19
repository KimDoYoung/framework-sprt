# tdm.Tdm44_ManlDutyOrg

`server/tdm/Tdm44_ManlDutyOrg.java`

서비스 키 `tdm.Tdm44_ManlDutyOrg.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 20 | [`tdm44_manl_duty_org.selectById`](../../tdm/sql/tdm44_manl_duty_org.md) | - |  |
| `selectByManlDutyId` | 25 | [`tdm44_manl_duty_org.selectByManlDutyId`](../../tdm/sql/tdm44_manl_duty_org.md) | `Tdm44_Lookup_ManlDutyOrg` |  |
| `insert` | 34 | [`tdm44_manl_duty_org.insert`](../../tdm/sql/tdm44_manl_duty_org.md), [`tdm44_manl_duty_org.insertCheck`](../../tdm/sql/tdm44_manl_duty_org.md) | `Tdm41_TabPage_ManlDutyOrg` |  |
| `update` | 58 | `UpdateDataModel(tdm44_manl_duty_org)` 동적 INSERT/UPDATE | `Tdm44_Lookup_ManlDutyOrg` | `UpdateDataModel` |
| `delete` | 63 | `UpdateDataModel(tdm44_manl_duty_org)` 동적 DELETE | `Tdm44_Lookup_ManlDutyOrg` | `UpdateDataModel` |
