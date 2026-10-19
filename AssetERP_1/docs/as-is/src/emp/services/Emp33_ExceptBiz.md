# emp.Emp33_ExceptBiz

`server/emp/Emp33_ExceptBiz.java`

서비스 키 `emp.Emp33_ExceptBiz.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 16 | [`emp33_except_biz.selectById`](../../emp/sql/emp33_except_biz.md) | - |  |
| `selectByExceptBizCode` | 22 | [`emp33_except_biz.selectByExceptBizCode`](../../emp/sql/emp33_except_biz.md) | `Emp33_Lookup_ExceptBiz` |  |
| `update` | 28 | `UpdateDataModel(emp33_except_biz)` 동적 INSERT/UPDATE | `Emp33_Lookup_ExceptBiz` | `UpdateDataModel` |
| `delete` | 33 | `UpdateDataModel(emp33_except_biz)` 동적 DELETE | `Emp33_Lookup_ExceptBiz` | `UpdateDataModel` |
