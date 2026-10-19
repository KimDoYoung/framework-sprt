# pln.Pln03_Resrch

`server/pln/Pln03_Resrch.java`

서비스 키 `pln.Pln03_Resrch.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 24 | `pln03_resrch.selectById`(없음) | `Pln03_Lookup_ResrchDetail` |  |
| `selectBySearchText` | 30 | `pln03_resrch.selectBySearchText`(없음) | `Pln03_Tab_Resrch` |  |
| `selectDetailInit` | 56 | `pln03_resrch.selectDetailInit`(없음) | `Pln03_Lookup_ResrchDetail` |  |
| `selectOneApprPersonId` | 74 | [`emp00_trans_info.selectOneEmpInfo`](../../emp/sql/emp00_trans_info.md), `pln03_resrch.selectOneApprPersonId`(없음) | - |  |
| `closeUpdate` | 106 | `pln03_resrch.closeUpdate`(없음) | `Pln03_Lookup_ResrchDetail` |  |
| `apprUpdate` | 122 | `pln03_resrch.apprUpdate`(없음) | `Pln03_Lookup_ResrchDetail` |  |
| `update` | 140 | `pln03_resrch.insert`(없음) | `Pln03_Lookup_ResrchDetail` |  |
| `delete` | 147 | `UpdateDataModel(pln03_resrch)` 동적 DELETE | `Pln03_Tab_Resrch` | `UpdateDataModel` |
