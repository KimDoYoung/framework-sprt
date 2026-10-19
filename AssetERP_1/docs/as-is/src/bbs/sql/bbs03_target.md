# bbs03_target

`server/bbs/mapper/bbs03_target.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 26 | [`bbs03_target`](../../../db/tables/bbs.md) |  | - |
| `selectByNoticeId` | select | 32 | [`bbs03_target`](../../../db/tables/bbs.md), [`emp01_person`](../../../db/tables/emp.md), [`emp03_trans`](../../../db/tables/emp.md), [`emp04_add_title`](../../../db/tables/emp.md), [`org00_org_info`](../../../db/views.md), [`sys01_company`](../../../db/tables/sys.md) | `f_cdnm`, `f_code_seq`, `f_get_emptrans`, `f_org_nm`, `f_org_parent_full_nm` | `bbs.Bbs03_Target.selectByNoticeId` |
| `insert` | insert | 57 | [`bbs03_target`](../../../db/tables/bbs.md) |  | `apr.Apr20_RelateIcs.check`, `apr.Apr22_RelateIcr.check` |
| `deleteAll` | delete | 70 | [`bbs03_target`](../../../db/tables/bbs.md) |  | `bbs.Bbs03_Target.deleteAllTarget` |
