# emp.Emp25_MypageNotice

`server/emp/Emp25_MypageNotice.java`

서비스 키 `emp.Emp25_MypageNotice.{메서드}`. SQL ID는 같은 클래스 안에서 호출하는 메서드의 것까지 포함한다.

| 메서드 | 줄 | SQL ID | 호출 클래스 | 다른 서버 클래스 |
|:---|---:|:---|:---|:---|
| `selectByPersonId` | 20 | [`emp25_mypage_notice.selectByPersonId`](../../emp/sql/emp25_mypage_notice.md) | - |  |
| `updateList` | 26 | [`dbConfig.getSeq`](../../utils/sql/dbConfig.md) (→ `f_create_seq()`), [`emp25_mypage_notice.selectByPersonId`](../../emp/sql/emp25_mypage_notice.md), `UpdateDataModel(emp25_mypage_notice)` 동적 INSERT/UPDATE | `Emp03_Lookup_Grade` | `UpdateDataModel` |
| `update` | 50 | `UpdateDataModel(emp25_mypage_notice)` 동적 INSERT/UPDATE | - | `UpdateDataModel` |
| `delete` | 55 | `UpdateDataModel(emp25_mypage_notice)` 동적 DELETE | - | `UpdateDataModel` |
