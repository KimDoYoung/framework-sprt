# emp.Emp23_EtcLeavePerson

`server/emp/Emp23_EtcLeavePerson.java`

서비스 키 `emp.Emp23_EtcLeavePerson.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectById` | 19 | [`emp23_etc_leave_person.selectById`](../../emp/sql/emp23_etc_leave_person.md) | - |  |
| `selectByPersonId` | 27 | [`emp23_etc_leave_person.selectByPersonId`](../../emp/sql/emp23_etc_leave_person.md) | - |  |
| `selectByEtcLeaveId` | 37 | [`emp23_etc_leave_person.selectByEtcLeaveId`](../../emp/sql/emp23_etc_leave_person.md) | `Apr01_Edit_ApprDoc`, `Emp23_Page_EtcLeavePerson` |  |
| `update` | 47 | `UpdateDataModel(emp23_etc_leave_person)` 동적 INSERT/UPDATE | `Emp23_Page_EtcLeavePerson` | `UpdateDataModel` |
| `delete` | 52 | `UpdateDataModel(emp23_etc_leave_person)` 동적 DELETE | `Emp23_Page_EtcLeavePerson` | `UpdateDataModel` |
