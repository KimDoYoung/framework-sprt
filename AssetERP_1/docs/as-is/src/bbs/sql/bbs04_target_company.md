# bbs04_target_company

`server/bbs/mapper/bbs04_target_company.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 15 | [`bbs04_target_company`](../../../db/tables/bbs.md), [`sys01_company`](../../../db/tables/sys.md) |  | - |
| `selectByNoticeId` | select | 23 | [`bbs04_target_company`](../../../db/tables/bbs.md), [`sys01_company`](../../../db/tables/sys.md) |  | `bbs.Bbs04_TargetCompany.selectByNoticeId` |
| `insert` | insert | 31 | [`bbs04_target_company`](../../../db/tables/bbs.md) |  | - |
| `insertFromBbs04` | insert | 44 | [`bbs02_notice`](../../../db/tables/bbs.md), [`bbs04_target_company`](../../../db/tables/bbs.md) | `f_create_seq` | - |
| `deleteAll` | delete | 54 | [`bbs04_target_company`](../../../db/tables/bbs.md) |  | `bbs.Bbs04_TargetCompany.deleteAllTarget` |
