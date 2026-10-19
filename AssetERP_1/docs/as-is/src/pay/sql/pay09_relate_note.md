# pay09_relate_note

`server/pay/mapper/pay09_relate_note.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 19 | [`pay09_relate_note`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm` | `pay.Pay09_RelateNote.selectById` |
| `selectByCompanyId` | select | 27 | [`pay09_relate_note`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm` | `pay.Pay09_RelateNote.selectByCompanyId` |
| `checkNote` | select | 38 | [`pay09_relate_note`](../../../db/tables/pay.md) | `f_cdnm`, `f_emp_kor_nm` | `pay.Pay09_RelateNote.checkNote` |
| `insert` | insert | 49 | [`pay09_relate_note`](../../../db/tables/pay.md) |  | - |
| `updateApprId` | update | 65 | [`pay05_relate_appr`](../../../db/tables/pay.md) |  | - |
