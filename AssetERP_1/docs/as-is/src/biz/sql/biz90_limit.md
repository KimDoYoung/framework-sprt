# biz90_limit

`server/biz/mapper/biz90_limit.xml`

테이블·DB 함수는 `<include>`한 SQL 조각의 것까지 포함한다.

| SQL ID | 종류 | 줄 | 테이블 | DB 함수 | 사용 서버 메서드 |
|:---|:---|---:|:---|:---|:---|
| `selectById` | select | 20 | [`biz90_limit`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz90_Limit.selectById` |
| `selectByCompanyId` | select | 28 | [`biz90_limit`](../../../db/tables/biz.md) | `f_cdnm` | `biz.Biz90_Limit.selectByCompanyId` |
| `insertFromBiz90` | insert | 37 | [`biz90_limit`](../../../db/tables/biz.md) | `f_create_seq` | - |
